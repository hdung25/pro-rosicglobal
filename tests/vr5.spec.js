import { test, expect } from '@playwright/test';
import { EXPORT_CATEGORIES } from '../src/export-catalog.js';
import { DEFAULT_PRODUCTS } from '../src/catalog-v6.js';

test.beforeEach(async ({ page, context }) => {
  await page.route('**/api/content', route => route.fulfill({ json: { ok: true, data: null } }));
  // Never leave the test environment: capture WhatsApp hand-offs locally.
  await context.route(/https:\/\/(wa\.me|api\.whatsapp\.com)\//, route => route.fulfill({ contentType: 'text/html', body: '<title>WhatsApp</title>' }));
});

for (const width of [1440, 390, 320]) {
  test(`VR5 product to one-step quote flow at ${width}px`, async ({ page, context }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/#products');
    const search = page.locator('.finder-search input');
    await search.fill('ROS-101');
    await search.press('Enter');
    await expect(page.locator('.v6-finder .pcard')).toHaveCount(1);
    await page.locator('.v6-finder .pcard__link').click();
    await expect(page.locator('h1')).toHaveText('Cà phê nhân xanh size 13 – Clean');
    await page.locator('.related .pcard__link', { hasText: 'Cà phê rang xay' }).click();
    await expect(page.locator('.spec-table')).toContainText('ROS-108');
    await page.locator('.product-detail').screenshot({ path: `artifacts/vr5/product-${width}.png` });
    await page.locator('.product-detail__actions .button-primary').click();
    const dialog = page.locator('.quote-dialog');
    await expect(dialog.locator('[name="product"]')).toHaveValue('ca-phe-rang-xay');
    await dialog.locator('[name="name"]').fill('Kiểm thử ROSIC');
    await dialog.locator('[name="phone"]').fill('+84962284872');
    await dialog.locator('[name="email"]').fill('vr5-test@example.com');
    await dialog.locator('[name="quantity"]').fill('1 container');
    await dialog.locator('[name="consent"]').check();
    const [whatsapp] = await Promise.all([context.waitForEvent('page'), dialog.getByRole('button', { name: 'Gửi qua WhatsApp' }).click()]);
    const url = new URL(whatsapp.url());
    expect(url.searchParams.get('text') ?? url.searchParams.get('text')).toContain('ROS-108 · Cà phê rang xay');
    expect(url.pathname === '/84962284872' || url.searchParams.get('phone') === '84962284872').toBe(true);
    await whatsapp.close();
    await expect(dialog.locator('.quote-status')).toContainText('Đã mở ứng dụng');
    await page.screenshot({ path: `artifacts/vr5/quote-${width}.png`, fullPage: false });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('VR5 group pages list variants, search fallback, themes and linked channels only', async ({ page }) => {
  await page.goto('/san-pham/ca-phe');
  await expect(page.locator('.group-products .pcard')).toHaveCount(8);
  await page.goto('/san-pham/hat-dieu');
  await expect(page.locator('.group-products .pcard')).toHaveCount(9);
  await page.screenshot({ path: 'artifacts/vr5/cashew-variants.png' });
  await page.locator('.topbar .theme-cell').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.screenshot({ path: 'artifacts/vr5/category-dark.png' });
  await page.goto('/#products');
  const search = page.locator('.finder-search input');
  await search.fill('no-match-vr5');
  await search.press('Enter');
  await expect(page.locator('.v6-finder .v6-empty')).toBeVisible();
  await page.locator('.v6-finder .v6-empty button').click();
  expect(await page.locator('.v6-finder .pcard').count()).toBeGreaterThan(10);
  // TikTok has no link yet, so it is hidden; the other six channels stay.
  await expect(page.locator('.footer-social .social-icon')).toHaveCount(6);
  await expect(page.locator('.contact-intro .social-icon')).toHaveCount(6);
  await expect(page.locator('[data-channel="tiktok"]')).toHaveCount(0);
});

test('VR5 mobile group card reaches the group page, direct journey anchor and logo', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto('/');
  await page.locator('.about-journey-button').click();
  await expect(page).toHaveURL(/#journey$/);
  await expect(page.locator('#journey h2')).toBeInViewport();
  await page.locator('#export-catalog').scrollIntoViewIfNeeded();
  await page.locator('.gcard', { hasText: 'Hạt điều' }).getByRole('link').click();
  await expect(page).toHaveURL(/\/san-pham\/hat-dieu$/);
  await page.locator('.group-hero .button-primary').click();
  await expect(page.locator('.quote-dialog [name="product"]')).toHaveValue('group:cashew-kernel');
  await page.keyboard.press('Escape');
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

test('legacy CMS data is replaced by the v6 catalogue while uploaded photos are kept', async ({ page }) => {
  const data = { catalogVersion: 5, content: {}, settings: {}, categories: EXPORT_CATEGORIES.filter(item => ['cashew-kernel', 'coffee-bean'].includes(item.id)), products: [
    { id: 'mango', code: 'ROS-001', title: 'Xoài từ CMS cũ', category: 'fruit', group: 'Trái cây', image: '/images/vietnam-banana-w960-hong-tam-rosic.webp', alt: 'Xoài', description: 'Xoài', status: 'published' },
    { id: 'durian', code: 'ROS-013', title: 'Sầu riêng', category: 'fruit', image: '/media/0b5d1c1e-1111-4222-8333-944455556666/durian-hong-tam-rosic.webp', alt: 'Sầu riêng', description: 'Sầu riêng', status: 'published' },
    { id: 'vegetables', code: 'ROS-007', title: 'Rau củ theo mùa', category: 'vegetables', status: 'published' },
  ] };
  await page.route('**/api/content', route => route.fulfill({ json: { ok: true, data } }));
  await page.route('**/media/**', route => route.fulfill({ path: 'public/images/vietnam-durian-w960-hong-tam-rosic.webp', contentType: 'image/webp' }));
  await page.goto('/#products');
  await expect(page.locator('.v6-finder .finder-count')).toHaveText(`${DEFAULT_PRODUCTS.length} sản phẩm`);
  const search = page.locator('.finder-search input');
  await search.fill('Rau củ');
  await search.press('Enter');
  await expect(page.locator('.v6-finder .v6-empty')).toBeVisible();
  await page.goto('/san-pham/trai-cay-tuoi/durian');
  await expect(page.locator('.product-detail__media img').first()).toHaveAttribute('src', /^\/media\//);
  await page.goto('/san-pham/trai-cay-tuoi/mango');
  await expect(page.locator('h1')).toHaveText('Xoài chín vàng');
});

test('published v6 CMS deletion never silently restores removed products', async ({ page }) => {
  const product = DEFAULT_PRODUCTS.find(item => item.id === 'ca-phe-rang-xay');
  const data = { catalogVersion: 6, content: {}, settings: {}, categories: [], products: [product] };
  await page.route('**/api/content', route => route.fulfill({ json: { ok: true, data } }));
  await page.goto('/#products');
  await expect(page.locator('.v6-finder .pcard')).toHaveCount(1);
  const search = page.locator('.finder-search input');
  await search.fill('ROS-101');
  await search.press('Enter');
  await expect(page.locator('.v6-finder .v6-empty')).toBeVisible();
});
