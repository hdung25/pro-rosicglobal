import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import sharp from 'sharp';
const base = 'https://rosicglobal.com';
const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ baseURL: base, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
try {
  const page = await context.newPage();
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  const manifestResponse = await context.request.get('/site.webmanifest');
  const manifest = await manifestResponse.json();
  const swResponse = await context.request.get('/sw.js');
  expect(swResponse.headers()['cache-control']).toContain('must-revalidate');
  const icons = [];
  for (const icon of manifest.icons) {
    const response = await context.request.get(icon.src);
    expect(response.status()).toBe(200);
    const metadata = await sharp(await response.body()).metadata();
    expect(`${metadata.width}x${metadata.height}`).toBe(icon.sizes);
    icons.push({ path: icon.src, width: metadata.width, height: metadata.height, purpose: icon.purpose });
  }
  await page.locator('.install-app-button').tap();
  await expect(page.locator('.install-app-dialog')).toBeVisible();
  await page.screenshot({ path: 'artifacts/vr5/production-pwa-install.png' });
  await page.locator('.install-app-dialog .social-qr-close').tap();
  await expect(page.locator('.install-app-button')).toBeFocused();
  const cached = await page.evaluate(async () => {
    const cache = await caches.open('rosic-offline-v1');
    return (await cache.keys()).map(request => new URL(request.url).pathname);
  });
  expect(cached.sort()).toEqual(['/offline.html','/icons/rosic-192.png','/icons/rosic-512.png'].sort());
  const cdp = await context.newCDPSession(page);
  await cdp.send('Page.enable');
  const diagnostic = await cdp.send('Page.getInstallabilityErrors');
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading')).toContainText('Bạn đang ngoại tuyến');
  await page.screenshot({ path: 'artifacts/vr5/production-pwa-offline.png' });
  await context.setOffline(false);
  await page.getByRole('button', { name: 'Thử lại / Retry' }).tap();
  await expect(page.locator('.site-header')).toBeVisible();
  const report = { url: base, manifestStatus: manifestResponse.status(), serviceWorkerStatus: swResponse.status(), serviceWorkerControlsPage: true, icons, cached, offlineFallback: true, reconnect: true, installationGuide: true, focusRestored: true, nativeInstallationPerformed: false, browserDiagnostic: diagnostic };
  fs.writeFileSync('artifacts/vr5/production-pwa.json', JSON.stringify(report, null, 2));
  console.log(report);
} finally { await browser.close(); }
