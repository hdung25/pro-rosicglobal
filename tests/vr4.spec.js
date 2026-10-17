import { test, expect } from '@playwright/test';
import { readFile, stat } from 'node:fs/promises';

test('brand layout, mobile fit, photo, navigation and fixed controls', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Khởi từ Tâm');
  await expect(page.locator('.rosic-values li')).toHaveCount(5);
  await expect(page.locator('.about-pillars article')).toHaveCount(2);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  await expect(page.locator('.site-header .brand-slogan')).toHaveCount(1);
  await expect(page.locator('.hero-landscape img')).toHaveAttribute('src', '/images/rosic-terraces.webp');
  await page.locator('.hero-about-button').click();
  await expect(page).toHaveURL(/#about$/);
  await page.locator('.floating-back-top').click();
  await expect(page).toHaveURL(/#home$/);
  await page.locator('.floating-theme').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('.theme-toggle')).toHaveCount(1);
  await page.screenshot({ path: 'artifacts/vr4/home-dark.png' });
  await page.locator('.floating-theme').click();
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 1440 || width === 390) await page.screenshot({ path: `artifacts/vr4/home-${width}.png` });
  }
  expect(errors).toEqual([]);
});

test('quick view stays attached to its card, product lightbox and keyboard dismissal', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.official-export-card').first();
  await card.hover();
  await expect(page.locator('.product-hover-spec')).toHaveCount(0);
  await expect(card.locator('.official-export-card__detail')).toBeVisible();
  await card.getByRole('button').click();
  await page.locator('.official-export-dialog__visual .image-zoom').click();
  await expect(page.locator('.image-lightbox')).toBeVisible();
  await expect.poll(() => page.locator('.image-lightbox img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.locator('.image-lightbox')).toHaveCount(0);
  await expect(page.locator('.official-export-dialog__content')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.official-export-dialog__content')).toHaveCount(0);
});

test('every public catalogue category contains at least one product', async ({ page }) => {
  await page.goto('/#products');
  const tabs = page.locator('.catalog-section .category-tabs button');
  await expect(tabs.first()).toBeVisible();
  const count = await tabs.count();
  expect(count).toBeGreaterThan(5);
  for (let index = 0; index < count; index += 1) {
    await tabs.nth(index).click();
    await expect(page.locator('.catalog-section .product-card').first()).toBeVisible();
    await expect(page.locator('.catalog-section .empty-state')).toHaveCount(0);
  }
});

test('content protection alerts without blocking contact form editing', async ({ page }) => {
  await page.goto('/');
  const messages = [];
  page.on('dialog', async dialog => { messages.push(dialog.message()); await dialog.accept(); });
  await page.locator('h1').dispatchEvent('contextmenu');
  await page.locator('h1').dispatchEvent('copy');
  await page.locator('.hero-landscape img').dispatchEvent('dragstart');
  expect(messages).toEqual(Array(3).fill('ALERT: Content is protected !!'));
  const name = page.getByLabel('Họ và tên');
  await name.fill('Hồng Tâm');
  await name.dispatchEvent('copy');
  expect(messages).toHaveLength(3);
});

test('live admin preview uses draft data on desktop/mobile and respects blank social links', async ({ page }) => {
  await page.route('**/api/content', route => route.fulfill({ json: { ok: true, data: null } }));
  await page.route('**/api/admin-auth', route => route.fulfill({ json: { authenticated: true } }));
  await page.goto('/admin/');
  const preview = page.frameLocator('iframe[title^="Live Preview"]');
  await expect(preview.locator('h1')).toContainText('Khởi từ Tâm');
  await page.getByRole('button', { name: 'Nội dung trang', exact: true }).click();
  await page.getByLabel('Tiêu đề chính', { exact: true }).fill('Khởi từ Tâm VR4');
  await expect(preview.locator('h1')).toContainText('Khởi từ Tâm VR4');
  await expect(preview.locator('.rosic-slogan')).toContainText('Khởi từ Tâm VR4');
  expect(await page.evaluate(() => localStorage.getItem('rosic-cms-published-v1'))).toBeNull();
  await page.getByRole('button', { name: 'Điện thoại', exact: true }).click();
  await expect(page.locator('iframe')).toHaveAttribute('title', 'Live Preview Mobile');
  await expect.poll(() => preview.locator('html').evaluate(node => node.clientWidth)).toBe(390);
  await page.getByRole('button', { name: 'Cài đặt', exact: true }).click();
  await expect(page.getByLabel('Facebook', { exact: true })).toHaveValue('https://www.facebook.com/share/1Dq8KnnGEK/');
  await page.getByLabel('Facebook', { exact: true }).fill('https://www.facebook.com/rosic-example');
  await expect(preview.locator('.footer-socials a[aria-label="Facebook"]')).toHaveAttribute('href', 'https://www.facebook.com/rosic-example');
  await page.getByLabel('Facebook', { exact: true }).fill('');
  await expect(preview.locator('.footer-socials a[aria-label="Facebook"]')).toHaveCount(0);
  await page.screenshot({ path: 'artifacts/vr4/admin-live-preview.png' });
});

test('product SEO files are WebP with descriptive filenames and below 150KB', async () => {
  const images = JSON.parse(await readFile('scripts/product-image-manifest.json', 'utf8'));
  expect(images.length).toBeGreaterThan(30);
  for (const image of images) {
    expect(image.file).toMatch(/\/vietnam-.+-w(320|960)-hong-tam-rosic\.webp$/);
    expect((await stat(`public${image.file}`)).size).toBeLessThan(150000);
  }
});
