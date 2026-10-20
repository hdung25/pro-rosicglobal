import { test, expect } from '@playwright/test';

for (const width of [1440, 390, 320]) {
  test(`compact footer and group page photography at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/api/content', route => route.fulfill({ json: { ok: true, data: null } }));
    await page.goto('/san-pham/hat-dieu');
    // A group opens with four products; the rest are behind "show more".
    await expect(page.locator('.group-products .pcard')).toHaveCount(4);
    await page.locator('.group-products .finder-more button').click();
    await expect(page.locator('.group-products .pcard')).toHaveCount(9);
    const target = page.locator('.group-products .pcard').filter({ hasText: 'ROS-030' });
    await expect(target.locator('.pcard__meta strong')).toBeVisible();
    await target.getByRole('link').click();
    await expect(page.locator('.spec-table')).toContainText('ROS-030');
    await page.locator('.product-detail__actions .button-primary').click();
    await expect(page.locator('.quote-dialog [name="product"]')).toHaveValue('cashew-1-2');
    await page.keyboard.press('Escape');
    await page.goto('/san-pham/hat-dieu');
    await page.locator('.group-products').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `artifacts/vr5/refined-catalog-${width}.png` });
    const footer = page.locator('.site-footer');
    await expect(footer.locator('.social-icon')).toHaveCount(6);
    await expect(footer.locator('img[alt^="QR"]')).toHaveCount(0);
    await footer.scrollIntoViewIfNeeded();
    const height = await footer.evaluate(el => el.getBoundingClientRect().height);
    expect(height).toBeLessThan(width > 1000 ? 650 : 1350);
    await footer.screenshot({ path: `artifacts/vr5/refined-footer-${width}.png` });
    await footer.getByRole('button', { name: 'WhatsApp', exact: true }).click();
    await expect(page.locator('.social-popup__qr img')).toHaveAttribute('src', '/images/social/rosic-whatsapp-official.png');
    await page.keyboard.press('Escape');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
