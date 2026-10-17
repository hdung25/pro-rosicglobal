import { test, expect } from '@playwright/test';
import { EXPORT_CATEGORIES } from '../src/export-catalog.js';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/content', route => route.fulfill({ json: { ok: true, data: null } }));
});

for (const width of [1440, 390, 320]) {
  test(`VR5 product to free quote flow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/#products');
    const search = page.locator('.product-search input');
    await search.fill('ROS-021');
    await expect(page.locator('.product-card')).toHaveCount(1);
    await page.locator('.product-open').click();
    const dialog = page.locator('.detail-dialog');
    await expect(dialog).toContainText('Robusta nhân xanh');
    await dialog.locator('.product-switcher select').selectOption('arabica-roasted');
    await expect(dialog).toContainText('ROS-024');
    await dialog.screenshot({ path: `artifacts/vr5/product-${width}.png` });
    await dialog.locator('.button-primary').click();
    await expect(page.locator('#contact-product')).toHaveValue('Cà phê Arabica rang theo yêu cầu');
    await page.locator('#contact-name').fill('Kiểm thử ROSIC');
    await page.locator('#contact-phone').fill('+84962284872');
    await page.locator('#contact-email').fill('vr5-test@example.com');
    await page.locator('#contact-quantity').fill('1 container');
    await page.getByRole('button', { name: 'Chuẩn bị yêu cầu báo giá' }).click();
    const result = page.locator('.request-result');
    await expect(result).toContainText('Yêu cầu đã sẵn sàng để gửi');
    const href = await result.getByRole('link', { name: 'WhatsApp', exact: true }).getAttribute('href');
    expect(new URL(href).searchParams.get('text')).toContain('ROS-024 · Cà phê Arabica rang theo yêu cầu');
    expect(new URL(href).pathname).toBe('/84962284872');
    await result.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `artifacts/vr5/quote-${width}.png`, fullPage: false });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('VR5 category variants, search fallback, themes and seven channel slots', async ({ page }) => {
  await page.goto('/#export-catalog');
  await page.locator('.official-export-card--coffee-bean button').click();
  await expect(page.locator('.category-variants button')).toHaveCount(4);
  await page.locator('.official-export-dialog__body > .product-switcher select').selectOption('cashew-kernel');
  await expect(page.locator('.category-variants button')).toHaveCount(9);
  await page.screenshot({ path: 'artifacts/vr5/cashew-variants.png' });
  await page.keyboard.press('Escape');
  await page.locator('.floating-theme').click();
  await page.locator('.official-export-card--coffee-bean button').click();
  await expect(page.locator('.official-export-dialog__content')).toHaveCSS('background-color', 'rgb(25, 59, 48)');
  await page.screenshot({ path: 'artifacts/vr5/category-dark.png' });
  await page.keyboard.press('Escape');
  await page.locator('.product-search input').fill('no-match-vr5');
  await expect(page.locator('.empty-state')).toBeVisible();
  await page.locator('.empty-state button').click();
  expect(await page.locator('.product-card').count()).toBeGreaterThan(20);
  await expect(page.locator('.footer-invitation .social-channel')).toHaveCount(7);
  await expect(page.locator('.contact-intro .social-channel')).toHaveCount(7);
  await expect(page.locator('.footer-invitation .social-channel .social-qr-action')).toHaveCount(6);
});

test('VR5 mobile category scroll reaches quote, direct journey anchor and logo', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto('/');
  await page.locator('.about-copy .text-link').click();
  await expect(page).toHaveURL(/#journey$/);
  await expect(page.locator('#journey h2')).toBeInViewport();
  await page.locator('.official-export-card--cashew-kernel button').click();
  const cta = page.locator('.official-export-dialog__action');
  await cta.scrollIntoViewIfNeeded();
  await expect(cta).toBeInViewport();
  await page.screenshot({ path: 'artifacts/vr5/category-mobile-scroll.png' });
  await cta.click();
  await expect(page.locator('#contact-product')).toHaveValue('Hạt điều nhân');
  await page.locator('.site-header .brand').screenshot({ path: 'artifacts/vr5/logo-after.png' });
});

test('VR5 admin edits detailed stories and keeps drafts separate from published content', async ({ page }) => {
  await page.route('**/api/admin-auth', route => route.fulfill({ json: { authenticated: true } }));
  await page.goto('/admin/');
  await page.getByRole('button', { name: 'Nội dung trang', exact: true }).click();
  await page.getByText('story', { exact: true }).click();
  await page.getByRole('textbox', { name: 'blocks › 0', exact: true }).fill('Câu chuyện VR5 kiểm thử bản nháp.');
  const preview = page.frameLocator('iframe[title^="Live Preview"]');
  await expect(preview.locator('.about-pillars')).toContainText('Câu chuyện VR5 kiểm thử bản nháp.');
  expect(await page.evaluate(() => localStorage.getItem('rosic-cms-published-v1'))).toBeNull();
  await page.screenshot({ path: 'artifacts/vr5/admin-content-preview.png' });
});

test('legacy CMS data receives variants and revised bundled backgrounds without replacing uploaded images', async ({ page }) => {
  const data = { catalogVersion: 4, content: {}, settings: {}, categories: EXPORT_CATEGORIES.filter(item => ['cashew-kernel', 'coffee-bean'].includes(item.id)), products: [
    { id: 'mango', code: 'ROS-001', title: 'Xoài từ CMS cũ', category: 'fruit', group: 'Trái cây', image: '/images/vietnam-mango-w960-hong-tam-rosic.webp', alt: 'Xoài', description: 'Xoài', status: 'published' },
    { id: 'custom-upload', code: 'ROS-002', title: 'Ảnh riêng của khách', category: 'fruit', image: '/images/vietnam-banana-w960-hong-tam-rosic.webp', alt: 'Ảnh riêng', description: 'Hàng riêng', status: 'published' },
    { id: 'coffee', code: 'ROS-006', title: 'Cà phê cũ', category: 'processed', status: 'published' },
    { id: 'cashews', code: 'ROS-005', title: 'Điều cũ', category: 'nuts', status: 'published' },
  ] };
  await page.route('**/api/content', route => route.fulfill({ json: { ok: true, data } }));
  await page.goto('/#products');
  await expect(page.locator('.product-card')).toHaveCount(15);
  await page.locator('.product-search input').fill('ROS-001');
  await expect(page.locator('.product-card img')).toHaveAttribute('src', '/images/vr5/vietnam-mango-w960-hong-tam-rosic.webp');
  await page.locator('.product-search input').fill('ROS-002');
  await expect(page.locator('.product-card img')).toHaveAttribute('src', '/images/vietnam-banana-w960-hong-tam-rosic.webp');
});

test('published VR5 CMS deletion never silently restores removed variants', async ({ page }) => {
  const data = { catalogVersion: 5, content: {}, settings: {}, categories: [EXPORT_CATEGORIES.find(item => item.id === 'coffee-bean')], products: [
    { id: 'arabica-roasted', code: 'ROS-024', title: 'Arabica rang', category: 'coffee-bean', image: '/images/vietnam-coffee-w960-hong-tam-rosic.webp', alt: 'Arabica', description: 'Arabica rang', status: 'published' },
  ] };
  await page.route('**/api/content', route => route.fulfill({ json: { ok: true, data } }));
  await page.goto('/#products');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.locator('.product-search input').fill('ROS-021');
  await expect(page.locator('.empty-state')).toBeVisible();
});
