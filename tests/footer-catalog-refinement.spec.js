import { test, expect } from '@playwright/test';

for (const width of [1440, 390, 320]) {
  test(`compact footer and shared product photography at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/api/content', route => route.fulfill({ json: { ok: true, data: null } }));
    await page.goto('/#products');
    await page.locator('.product-search input').fill('Hạt điều');
    await expect(page.locator('.product-card')).toHaveCount(9);
    await expect(page.locator('.product-family-photo > img')).toHaveCount(1);
    const target = page.locator('.product-card').filter({ hasText: 'ROS-030' });
    await expect(target.locator('.product-meta > span:last-child')).toBeVisible();
    await target.getByRole('button').click();
    await expect(page.locator('.detail-dialog')).toContainText('ROS-030');
    await page.locator('.detail-dialog .button-primary').click();
    await expect(page.locator('#contact-product')).toHaveValue('Hạt điều 16 · vỡ');
    await page.locator('.product-search input').fill('Hạt điều');
    await page.locator('.product-family').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `artifacts/vr5/refined-catalog-${width}.png` });
    const footer = page.locator('.site-footer');
    await expect(footer.locator('.social-channel')).toHaveCount(7);
    await expect(footer.locator('.social-qr-preview')).toHaveCount(0);
    await footer.scrollIntoViewIfNeeded();
    const height = await footer.evaluate(el => el.getBoundingClientRect().height);
    expect(height).toBeLessThan(width > 1000 ? 650 : 1250);
    await footer.screenshot({ path: `artifacts/vr5/refined-footer-${width}.png` });
    await footer.getByRole('button', { name: 'Phóng to QR WhatsApp', exact: true }).click();
    await expect(page.locator('.social-qr-dialog img')).toHaveAttribute('src', '/images/social/rosic-whatsapp-official.png');
    await page.keyboard.press('Escape');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
