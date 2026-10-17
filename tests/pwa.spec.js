import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('production PWA serves an honest offline screen and never caches Admin or API data', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:4173' });
  const page = await context.newPage();
  await page.route('**/api/content', route => route.fulfill({ json: { ok: true, data: null } }));
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  const manifest = await (await context.request.get('/site.webmanifest')).json();
  expect(manifest.id).toBe('/');
  expect(manifest.theme_color).toBe('#193B30');
  expect(manifest.icons.some(icon => icon.purpose === 'maskable')).toBe(true);
  for (const icon of manifest.icons) expect((await context.request.get(icon.src)).status()).toBe(200);
  const cached = await page.evaluate(async () => {
    const cache = await caches.open('rosic-offline-v1');
    return (await cache.keys()).map(request => new URL(request.url).pathname);
  });
  expect(cached.sort()).toEqual(['/icons/rosic-192.png','/icons/rosic-512.png','/offline.html'].sort());
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading')).toContainText('Bạn đang ngoại tuyến');
  await expect(page.getByRole('button', { name: 'Thử lại / Retry' })).toBeVisible();
  await page.screenshot({ path: 'artifacts/vr5/pwa-offline.png' });
  await context.setOffline(false);
  await page.getByRole('button', { name: 'Thử lại / Retry' }).click();
  await expect(page.locator('.site-header')).toBeVisible();
  await context.close();
});

test('installation guide is accessible, fits a small screen and restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  await page.locator('.install-app-button').click();
  const dialog = page.locator('.install-app-dialog');
  await expect(dialog).toBeVisible();
  const scan = await new AxeBuilder({ page }).include('.install-app-dialog').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(scan.violations).toEqual([]);
  expect(await dialog.evaluate(el => el.getBoundingClientRect().width)).toBeLessThanOrEqual(320);
  await page.keyboard.press('Escape');
  await expect(page.locator('.install-app-button')).toBeFocused();
});
