import { test, expect } from '@playwright/test';

for (const language of ['vi', 'en', 'zh', 'ko', 'ja', 'ar', 'fr', 'de']) {
  test(`VR4 complete page, Quick View and product page fit: ${language}`, async ({ page }) => {
    test.setTimeout(90_000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(language => localStorage.setItem('rosic-language', language), language);
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const title = await page.locator('h1').boundingBox();
      expect(title.x).toBeGreaterThanOrEqual(0);
      expect(title.x + title.width).toBeLessThanOrEqual(width + 1);
      if (width === 390) {
        await page.screenshot({ path: `artifacts/vr4/mobile-${language}.png` });
        await page.locator('#export-catalog').scrollIntoViewIfNeeded();
        await page.locator('.gcard .gcard__actions button').first().click();
        const dialog = page.locator('.quick-view');
        await expect(dialog).toBeVisible();
        const box = await dialog.boundingBox();
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
        await page.keyboard.press('Escape');
      }
    }
    await page.goto('/san-pham/que/que-ong');
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(page.locator('.spec-table > div')).toHaveCount(8);
    }
    expect(errors).toEqual([]);
  });
}

test('admin screens fit mobile, tablet and desktop', async ({ page }) => {
  await page.route('**/api/content', route => route.fulfill({ json: { ok: true, data: null } }));
  await page.route('**/api/admin-auth', route => route.fulfill({ json: { authenticated: true } }));
  await page.goto('/admin/');
  for (const width of [1440, 1280, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const name of ['Tổng quan', 'Sản phẩm', 'Danh mục', 'Nội dung trang', 'Thư viện media', 'Cài đặt']) {
      await page.locator('.admin-sidebar').getByRole('button', { name, exact: true }).click();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), { message: `${name} at ${width}px` }).toBe(true);
    }
    if (width === 390) await page.screenshot({ path: 'artifacts/vr4/admin-mobile.png' });
  }
});
