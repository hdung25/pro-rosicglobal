import { test, expect } from '@playwright/test';
import { PRODUCTS } from '../src/data.js';
import { EXPORT_CATEGORIES } from '../src/export-catalog.js';
import { SOCIAL_DEFAULTS, SOCIAL_QR_DEFAULTS } from '../src/social-config.js';

const legacyCms = {
  products: PRODUCTS.map(item => ({ ...item, status: 'published' })), categories: EXPORT_CATEGORIES,
  content: {}, settings: {}, media: [], catalogVersion: 5, socialConfigVersion: 2,
  social: { ...SOCIAL_DEFAULTS, facebook: '', wechat: '', whatsapp: 'https://wa.me/84962284872' },
};
test.beforeEach(async ({ page }) => {
  await page.route('**/api/content', route => route.fulfill({ json: { ok: true, data: legacyCms } }));
});

for (const width of [1440, 390]) {
  test(`official links and original QR images work with existing CMS at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#contact');
    for (const parent of ['.contact-intro', '.footer-social']) {
      await expect(page.locator(`${parent} [data-channel="tiktok"]`)).toHaveCount(0);
      for (const key of ['facebook', 'whatsapp', 'wechat']) {
        await page.locator(`${parent} .social-icon[data-channel="${key}"]`).click();
        const popup = page.locator('.social-qr-dialog');
        await expect(popup.locator('.social-popup__open')).toHaveAttribute('href', SOCIAL_DEFAULTS[key]);
        if (SOCIAL_QR_DEFAULTS[key]) await expect(popup.locator('img')).toHaveAttribute('src', SOCIAL_QR_DEFAULTS[key]);
        await expect(popup.locator('img')).toBeInViewport();
        if (key === 'wechat') await page.screenshot({ path: `artifacts/vr5/social-wechat-qr-${width}.png` });
        await page.keyboard.press('Escape');
        await expect(popup).toHaveCount(0);
      }
    }
    await page.locator('.footer-social').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `artifacts/vr5/social-channels-${width}.png` });
  });
}

test('Admin can edit every link, keep TikTok pending and clear an obsolete official QR when the recipient changes', async ({ page }) => {
  await page.route('**/api/admin-auth', route => route.fulfill({ json: { authenticated: true } }));
  await page.goto('/admin/');
  await page.getByRole('button', { name: 'Cài đặt', exact: true }).click();
  await expect(page.getByLabel('Facebook', { exact: true })).toHaveValue(SOCIAL_DEFAULTS.facebook);
  await expect(page.getByLabel('WhatsApp · Kênh chính', { exact: true })).toHaveValue(SOCIAL_DEFAULTS.whatsapp);
  await expect(page.getByLabel('WeChat', { exact: true })).toHaveValue(SOCIAL_DEFAULTS.wechat);
  await expect(page.getByLabel('TikTok', { exact: true })).toHaveValue('');
  const preview = page.frameLocator('iframe');
  await page.getByLabel('TikTok', { exact: true }).fill('https://www.tiktok.com/@rosic-test');
  await expect(preview.locator('.footer-social .social-icon[data-channel="tiktok"]')).toHaveCount(1);
  await page.getByLabel('WhatsApp · Kênh chính', { exact: true }).fill('https://wa.me/message/OTHERBUSINESS');
  await expect(page.getByLabel('QR chính thức · WhatsApp · Kênh chính', { exact: true })).toHaveValue('');
  await preview.locator('.contact-intro .social-icon[data-channel="whatsapp"]').click();
  await expect(preview.locator('.social-qr-dialog img')).toHaveAttribute('src', /^data:image\/png/);
  await preview.locator('.social-qr-close').click();
  await page.getByLabel('TikTok', { exact: true }).fill('');
  await expect(preview.locator('.footer-social [data-channel="tiktok"]')).toHaveCount(0);
});
