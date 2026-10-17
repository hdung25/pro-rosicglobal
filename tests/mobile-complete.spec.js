import { test, expect } from '@playwright/test';

const screens = [[280,653],[320,568],[360,640],[375,667],[390,844],[412,915],[430,932],[540,720],[600,960],[768,1024],[820,1180],[912,1368],[568,320],[667,375],[844,390]];
for (const [width, height] of screens) {
  test(`touch journey, quote, QR and installation ${width}x${height}`, async ({ browser }) => {
    const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, viewport: { width, height }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await context.route(/https:\/\/(wa\.me|api\.whatsapp\.com)\//, route => route.fulfill({ contentType: 'text/html', body: '<title>WhatsApp</title>' }));
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    if (new URL(test.info().project.use.baseURL).hostname === '127.0.0.1') await page.route('**/api/content', route => route.fulfill({ json: { ok: true, data: null } }));
    await page.goto('/');
    for (const hash of ['home','products','private-label','about','testimonials','journey','blog','contact']) {
      await page.locator('.menu-toggle').tap();
      await page.locator(`.mobile-menu nav a[href="#${hash}"]`).tap();
      await expect(page.locator('.mobile-menu')).toHaveCount(0);
      await expect(page).toHaveURL(new RegExp(`#${hash}$`));
    }
    await page.locator('.menu-toggle').tap();
    await page.locator('.mobile-language select').selectOption('en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await page.locator('.mobile-language select').selectOption('vi');
    await page.locator('.mobile-menu-top button').tap();
    // Submitted search by product code, then the product page.
    await page.locator('#products').scrollIntoViewIfNeeded();
    await page.locator('.finder-search input').fill('ROS-030');
    await page.locator('.finder-search__submit').tap();
    await expect(page.locator('.v6-finder .pcard')).toHaveCount(1);
    await page.locator('.v6-finder .pcard__link').tap();
    await expect(page).toHaveURL(/\/san-pham\/hat-dieu\//);
    await page.locator('.product-detail__media .image-zoom').tap();
    await expect(page.locator('.image-lightbox')).toBeVisible();
    await page.locator('.lightbox-close').tap();
    const cta = page.locator('.product-detail__actions .button-primary');
    await cta.scrollIntoViewIfNeeded();
    await cta.tap();
    await expect(page.locator('#quote-product')).toHaveValue('cashew-1-2');
    await page.locator('#quote-name').fill('Khách kiểm thử');
    await page.locator('#quote-phone').fill('+84962284872');
    await page.locator('#quote-email').fill('mobile@example.com');
    await expect(page.locator('#quote-message')).toHaveValue(/ROS-030/);
    const [whatsapp] = await Promise.all([context.waitForEvent('page'), page.locator('.quote-send--whatsapp').tap()]);
    expect(new URL(whatsapp.url()).searchParams.get('text')).toContain('ROS-030');
    await whatsapp.close();
    for (const key of ['email','whatsapp','linkedin','facebook','zalo','wechat']) {
      await page.locator(`.footer-invitation [data-channel="${key}"] button`).tap();
      await expect(page.locator('.social-qr-dialog img')).toBeVisible();
      await page.locator('.social-qr-close').tap();
    }
    await page.locator('.install-app-button').tap();
    await expect(page.locator('.install-app-dialog')).toContainText('iPhone / iPad');
    await page.locator('.install-app-dialog .social-qr-close').tap();
    const undersized = await page.locator('.menu-toggle, .theme-switch button, .topbar .language-picker select, .crumbs a, .product-detail__actions a, .quote-field select, .quote-actions button, .quote-zalo, .footer-column a, .footer-invitation .social-channel > a, .social-qr-action, .install-app-button').evaluateAll(elements => elements.filter(e => {
      const box = e.getBoundingClientRect();
      return box.width && box.height && (box.width < 43.9 || box.height < 43.9);
    }).map(e => ({ text: e.textContent.trim(), height: e.getBoundingClientRect().height, width: e.getBoundingClientRect().width })));
    expect(undersized).toEqual([]);
    await expect.poll(() => page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, width: innerWidth }))).toEqual({ scrollWidth: width, width });
    await page.goto('/#products');
    const finderTargets = await page.locator('.v6-finder :is(.chip, .finder-search input, .finder-search__submit)').evaluateAll(elements => elements.filter(e => {
      const box = e.getBoundingClientRect();
      return box.width && box.height && box.height < 43.9;
    }).length);
    expect(finderTargets).toBe(0);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
    if ([320,390,768,844].includes(width)) await page.screenshot({ path: `artifacts/vr5/mobile-polish-${width}x${height}.png` });
    await context.close();
  });
}

test('motion respects the device preference', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.menu-toggle').click();
  await expect(page.locator('.mobile-menu')).toHaveCSS('animation-name', 'none');
  await page.keyboard.press('Escape');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.locator('.menu-toggle').click();
  await expect(page.locator('.mobile-menu')).toHaveCSS('animation-name', 'rosic-menu-in');
});

test('Arabic compact header keeps menu and display controls apart', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  await page.locator('.menu-toggle').click();
  await page.locator('.mobile-language select').selectOption('ar');
  await page.locator('.mobile-menu-top button').click();
  await page.locator('.menu-toggle').click();
  await expect(page.locator('.mobile-menu')).toBeVisible();
  await page.locator('.mobile-menu-top button').click();
  const toggle = await page.locator('.menu-toggle').boundingBox();
  const theme = page.locator('.topbar .theme-switch');
  const themeBox = await theme.boundingBox();
  expect(themeBox.y + themeBox.height).toBeLessThanOrEqual(toggle.y);
  const current = await page.locator('html').getAttribute('data-theme');
  await theme.getByRole('button', { name: current === 'dark' ? 'فاتح' : 'داكن' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
});
