import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import process from 'node:process';
import { SOCIAL_DEFAULTS, SOCIAL_QR_DEFAULTS } from '../src/social-config.js';

const base = process.env.VR5_DEPLOYMENT_URL || 'https://pro-rosicglobal-3b75cbsi3-ha-huy-dungs-projects.vercel.app';
const cookieFile = process.env.VR5_COOKIE_FILE || '.vercel/vr5-preview-cookies.txt';
const hasCookies = fs.existsSync(cookieFile);
if (!hasCookies && !process.env.VERCEL_OIDC_TOKEN && process.env.VR5_PUBLIC !== '1') throw new Error('Preview access credential unavailable');
const headers = !hasCookies && process.env.VERCEL_OIDC_TOKEN ? { 'x-vercel-trusted-oidc-idp-token': process.env.VERCEL_OIDC_TOKEN } : {};
const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' });
if (hasCookies) {
  const cookies = fs.readFileSync(cookieFile, 'utf8').split(/\r?\n/).filter(line => line && (!line.startsWith('#') || line.startsWith('#HttpOnly_'))).map(line => {
    const httpOnly = line.startsWith('#HttpOnly_');
    const [domain, , path, secure, expires, name, value] = line.replace(/^#HttpOnly_/, '').split('\t');
    return { domain, path, name, value, secure: secure === 'TRUE', httpOnly, expires: Number(expires) || -1 };
  });
  await context.addCookies(cookies);
}
// Do not send the Vercel credential to any third-party origin, or save a trace.
await context.route('**/*', route => new URL(route.request().url()).origin === base
  ? route.continue({ headers: { ...route.request().headers(), ...headers } }) : route.continue());
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
  const content = await context.request.get(base + '/api/content', { headers });
  if (!content.headers()['content-type']?.includes('application/json')) throw new Error(`Preview access did not return application JSON (status ${content.status()})`);
  const json = await content.json();
  const auth = await context.request.get(base + '/api/admin-auth', { headers });
  const denied = await context.request.put(base + '/api/content', { headers, data: {} });
  await page.goto(base + '/#products');
  await page.locator('.product-search input').fill('Hạt điều');
  if (await page.locator('.product-card').count() !== 9 || await page.locator('.product-family-photo > img').count() !== 1) throw new Error('Cashew family must show nine SKUs with one shared photograph');
  await expect(page.locator('.site-footer .social-qr-action')).toHaveCount(6);
  await page.locator('.site-footer').getByRole('button', { name: 'Phóng to QR WhatsApp', exact: true }).click();
  await page.locator('.social-qr-dialog img').waitFor();
  await page.keyboard.press('Escape');
  await page.locator('.product-search input').fill('ROS-024');
  await page.locator('.product-open').click();
  await page.locator('.detail-dialog .button-primary').click();
  await page.locator('#contact-name').fill('Kiểm thử ROSIC');
  await page.locator('#contact-phone').fill('+84962284872');
  await page.locator('#contact-email').fill('vr5-preview@example.com');
  await page.locator('#contact form button[type="submit"]').click();
  const href = await page.locator('.request-result').getByRole('link', { name: 'WhatsApp', exact: true }).getAttribute('href');
  if (!new URL(href).searchParams.get('text').includes('ROS-024')) throw new Error('Wrong quote product');
  if (new URL(href).pathname !== '/84962284872') throw new Error('Wrong WhatsApp Business quote recipient');
  await page.locator('.request-result').scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'artifacts/vr5/preview-quote-mobile.png' });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const parent of ['.contact-intro', '.footer-invitation']) {
      for (const key of ['facebook', 'whatsapp', 'wechat']) {
        const actual = await page.locator(`${parent} [data-channel="${key}"] > a`).getAttribute('href');
        if (actual !== SOCIAL_DEFAULTS[key]) throw new Error(`Wrong ${key} link in ${parent}`);
      }
      for (const key of parent === '.contact-intro' ? ['wechat', 'whatsapp'] : []) {
        const actual = await page.locator(`${parent} [data-channel="${key}"] img`).getAttribute('src');
        if (actual !== SOCIAL_QR_DEFAULTS[key]) throw new Error(`Wrong official ${key} QR`);
      }
      if (!(await page.locator(`${parent} [data-channel="tiktok"]`).innerText()).includes('Đang cập nhật')) throw new Error('TikTok must remain pending');
    }
    await page.locator('.contact-intro [data-channel="wechat"] button').click();
    await page.locator('.social-qr-dialog img').waitFor();
    await page.screenshot({ path: `artifacts/vr5/staging-social-qr-${width}.png` });
    await page.keyboard.press('Escape');
  }
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(base + '/admin/');
  await page.getByRole('button', { name: 'Đăng nhập Admin' }).waitFor();
  await page.screenshot({ path: 'artifacts/vr5/preview-admin-login.png' });
  const assets = [];
  for (const file of ['/favicon.svg', '/images/vr5/vietnam-mango-w960-hong-tam-rosic.webp', '/brand-kit/vr5-review.html', '/admin-guide.html', ...Object.values(SOCIAL_QR_DEFAULTS)]) {
    const response = await context.request.get(base + file, { headers });
    assets.push({ file, status: response.status(), bytes: (await response.body()).length });
  }
  const report = { url: base, protectedStaging: process.env.VR5_PUBLIC !== "1", contentStatus: content.status(), cmsReadOk: json.ok === true, publishedProducts: json.data?.products?.length ?? null, adminAuthStatus: auth.status(), unauthenticatedPublishStatus: denied.status(), quoteContainsCorrectCode: true, socialMessageSent: false, mainDomainPromoted: base === "https://rosicglobal.com", cmsPublished: false, assets, pageErrors: errors };
  fs.writeFileSync(base === 'https://rosicglobal.com' ? 'artifacts/vr5/production-smoke.json' : 'artifacts/vr5/preview-smoke.json', JSON.stringify(report, null, 2));
  console.log(report);
} finally { await browser.close(); }
