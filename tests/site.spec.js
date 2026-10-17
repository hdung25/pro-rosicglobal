import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { JOURNEY, ARTICLES } from '../src/data.js'
import { DEFAULT_PRODUCTS, GROUPS, GROUP_NAMES, productPath, groupPath } from '../src/catalog-v6.js'

const SECTIONS = ['home', 'about', 'export-catalog', 'products', 'private-label', 'journey', 'testimonials', 'blog', 'contact']

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('all rendered images load, internal links resolve, and the page has no runtime errors', async ({ page }) => {
  test.setTimeout(120_000)
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  for (const id of SECTIONS) await page.locator(`#${id}`).scrollIntoViewIfNeeded()
  const images = page.locator('img')
  for (const image of await images.all()) {
    if (!(await image.isVisible())) continue
    await image.scrollIntoViewIfNeeded()
    await expect.poll(() => image.evaluate(node => node.complete && node.naturalWidth > 0)).toBe(true)
    if ((await image.getAttribute('aria-hidden')) !== 'true' && !(await image.evaluate(node => node.closest('[aria-hidden="true"]'))))
      await expect(image).toHaveAttribute('alt', /.+/)
  }
  const links = await page.locator('a[href]').evaluateAll(anchors => anchors.map(a => a.getAttribute('href')))
  for (const href of links) {
    expect(href).not.toBe('#')
    if (href.startsWith('#')) await expect(page.locator(href)).toHaveCount(1)
    if (href.startsWith('/san-pham/')) expect(GROUPS.some(group => href.startsWith(groupPath(group.id)))).toBe(true)
  }
  for (const id of ['about', 'private-label', 'journey', 'products', 'testimonials', 'blog', 'contact', 'home']) {
    await page.locator(`.site-footer a[href="#${id}"]`).first().click()
    await expect(page).toHaveURL(new RegExp(`#${id}$`))
    await expect(page.locator(`#${id}`)).toBeInViewport()
  }
  expect(errors).toEqual([])
})

test('group chips, accent-insensitive submitted search, empty state and reset work together', async ({ page }) => {
  await page.locator('#products').scrollIntoViewIfNeeded()
  const finder = page.locator('.v6-finder')
  for (const group of GROUPS) {
    await finder.locator('.chip', { hasText: GROUP_NAMES.vi[group.id] }).click()
    const expected = DEFAULT_PRODUCTS.filter(product => product.category === group.id).length
    if (expected) await expect(finder.locator('.pcard')).toHaveCount(expected)
    else await expect(finder.locator('.v6-empty')).toBeVisible()
    await expect(finder.locator('.chip[aria-pressed="true"]')).toContainText(GROUP_NAMES.vi[group.id])
  }
  const search = finder.getByRole('searchbox', { name: 'Tìm sản phẩm' })
  await search.fill('  QUE DIEU  ')
  await search.press('Enter')
  await expect(finder.locator('.pcard')).toHaveCount(1)
  await expect(finder.locator('.pcard__title')).toHaveText('Quế điếu')
  await search.fill('s18')
  await search.press('Enter')
  await expect(finder.locator('.pcard')).toHaveCount(2)
  await search.fill('khong co san pham nay')
  await search.press('Enter')
  await expect(finder.getByText('Không tìm thấy sản phẩm phù hợp', { exact: true })).toBeVisible()
  await finder.getByRole('button', { name: 'Xem tất cả sản phẩm', exact: true }).click()
  await expect(search).toHaveValue('')
  await expect(finder.locator('.chip[aria-pressed="true"]')).toContainText('Tất cả')
  await expect(finder.locator('.finder-count')).toHaveText(`${DEFAULT_PRODUCTS.length} sản phẩm`)
})

for (const product of DEFAULT_PRODUCTS) {
  test(`product page: ${product.title}`, async ({ page }) => {
    await page.goto(productPath(product))
    await expect(page.getByRole('heading', { level: 1, name: product.title, exact: true })).toBeVisible()
    await expect(page.locator('.product-detail__lead')).toHaveText(product.description)
    await expect.poll(() => page.locator('.product-detail__media img').first().evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true)
    await expect(page.locator('.spec-table > div')).toHaveCount(8)
    await expect(page.locator('.spec-table > div').first()).toContainText(product.code)
    for (const href of await page.locator('.related .pcard__link').evaluateAll(links => links.map(link => link.getAttribute('href'))))
      expect(href.startsWith(`${groupPath(product.category)}/`)).toBe(true)
  })
}

test('quote CTA selects the viewed product, keeps typed details and reaches the form', async ({ page }) => {
  await page.goto('/san-pham/trai-cay-tuoi/dragonfruit')
  const cta = page.locator('.product-detail__actions').getByRole('link', { name: 'Yêu cầu báo giá' })
  await cta.click()
  const product = page.getByLabel('Sản phẩm quan tâm', { exact: true })
  await expect(product).toHaveValue('dragonfruit')
  await expect(page).toHaveURL(/#contact$/)
  await expect(page.locator('#contact')).toBeInViewport()
  await page.getByLabel('Họ và tên').fill('Giữ nguyên tên đã nhập')
  await product.selectOption('cashew-1-0')
  await cta.click()
  await expect(product).toHaveValue('dragonfruit')
  await expect(page.getByLabel('Họ và tên')).toHaveValue('Giữ nguyên tên đã nhập')
})

test('article contact CTA reaches contact after closing the dialog', async ({ page }) => {
  await page.locator('#blog').scrollIntoViewIfNeeded()
  await page.locator('.journal-card button').first().click()
  await page.getByRole('dialog').getByRole('link', { name: 'Cùng trao đổi thêm' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page).toHaveURL(/#contact$/)
  await expect(page.locator('#contact')).toBeInViewport()
})

test('header product menu and footer product links open the group pages', async ({ page }) => {
  await page.locator('.products-menu-trigger').click()
  await page.locator('.mega-menu a', { hasText: 'Hạt tiêu' }).click()
  await expect(page).toHaveURL(/\/san-pham\/ho-tieu$/)
  await expect(page.locator('.mega-menu')).toBeHidden()
  await expect(page.locator('.group-products .pcard')).toHaveCount(6)
  await page.locator('.site-footer').getByRole('link', { name: 'Cơm dừa', exact: true }).click()
  await expect(page).toHaveURL(/\/san-pham\/com-dua$/)
  await expect(page.locator('.group-hero h1')).toHaveText('Cơm dừa')
  await page.locator('.site-footer').getByRole('link', { name: 'Tin tức', exact: true }).click()
  await expect(page).toHaveURL(/\/#blog$/)
  await expect(page.locator('#blog')).toBeInViewport()
})

test('all four journey steps reveal the corresponding image and description', async ({ page }) => {
  await page.locator('#journey').scrollIntoViewIfNeeded()
  for (const item of JOURNEY) {
    const trigger = page.locator('.journey-step').filter({ hasText: item.title })
    await trigger.click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('.journey-step[aria-expanded="true"]')).toHaveCount(1)
    const panel = page.getByRole('region', { name: item.title, exact: true })
    await expect(panel).toBeVisible()
    await expect(panel.locator('img')).toHaveAttribute('src', item.image)
    await expect.poll(() => panel.locator('img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true)
    await expect(panel).toContainText(item.caption)
    await expect(trigger.locator('.step-description')).toBeVisible()
  }
})

for (const article of ARTICLES) {
  test(`article detail: ${article.title}`, async ({ page }) => {
    await page.locator('#blog').scrollIntoViewIfNeeded()
    const trigger = page.locator('.journal-card button').filter({ hasText: article.title })
    await trigger.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('heading', { name: article.title, exact: true })).toBeVisible()
    await expect(dialog).toContainText(article.excerpt)
    for (const section of article.sections) await expect(dialog).toContainText(section.body)
    await expect.poll(() => dialog.locator('img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true)
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(trigger).toBeFocused()
  })
}

test('privacy dialog explains quote routing and closes accessibly', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Thông tin & quyền riêng tư', exact: true })
  await trigger.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('heading', { name: 'Thông tin & quyền riêng tư', exact: true })).toBeVisible()
  await expect(dialog).toContainText('chuyển sang kênh liên hệ')
  await dialog.getByRole('button', { name: 'Đóng chi tiết', exact: true }).click()
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test('quote validates input before opening an app and copies the prepared message', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  const requests = []
  await page.route('**/api/quote', route => { requests.push(route.request()); return route.abort() })
  await page.locator('#contact').scrollIntoViewIfNeeded()
  const form = page.locator('#contact')
  const whatsapp = form.getByRole('button', { name: 'Gửi qua WhatsApp' })
  let popups = 0
  context.on('page', () => { popups += 1 })
  await whatsapp.click()
  await expect(form.locator('#quote-name-error')).toBeVisible()
  await form.locator('#quote-name').fill('QA Kiểm tra')
  await form.locator('#quote-phone').fill('abcdefgh')
  await whatsapp.click()
  await expect(form.locator('#quote-phone-error')).toBeVisible()
  expect(popups).toBe(0)
  await form.locator('#quote-phone').fill('+84 912 345 678')
  await form.locator('#quote-email').fill('qa@example.com')
  await form.locator('#quote-product').selectOption('cashew-1-0')
  await form.locator('#quote-market').fill('Đức')
  await form.locator('#quote-quantity').fill('1 container')
  const message = await form.locator('#quote-message').inputValue()
  expect(message).toContain('ROS-028 · Hạt điều 16 · nguyên')
  expect(message).toContain('Thị trường/cảng nhận: Đức')
  expect(message).toContain('QA Kiểm tra')
  await form.getByRole('button', { name: 'Sao chép tin nhắn' }).click()
  await expect(form.locator('.quote-status')).toContainText('Đã sao chép tin nhắn')
  expect((await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n')).toBe(message)
  expect(requests).toHaveLength(0)
})

test('quote works without an API: Zalo and email channels are offered', async ({ page }) => {
  await page.route('**/api/quote', route => route.abort())
  await page.locator('#contact').scrollIntoViewIfNeeded()
  const form = page.locator('#contact')
  await expect(form.getByRole('link', { name: /Mở Zalo/ })).toHaveAttribute('href', /^https:\/\/zalo\.me\//)
  await expect(form.getByRole('button', { name: 'Gửi qua Email' })).toBeVisible()
  await expect(form.getByRole('link', { name: 'info@rosicglobal.com' })).toHaveAttribute('href', 'mailto:info@rosicglobal.com')
})

for (const width of [360, 390, 768, 1440, 1920, 2560]) {
  test(`layout fits ${width}px, menu, group and product pages stay usable`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const noOverflow = async (label) => {
      const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
      expect(dimensions.scroll, `Overflow at ${label} on ${width}px`).toBeLessThanOrEqual(dimensions.client + 1)
    }
    for (const id of SECTIONS) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded()
      await noOverflow(`#${id}`)
    }
    if (width < 1220) {
      const open = page.getByRole('button', { name: 'Mở menu', exact: true })
      await open.click()
      const menu = page.getByRole('dialog', { name: 'Điều hướng', exact: true })
      await expect(menu).toBeVisible()
      const menuBox = await menu.boundingBox()
      expect(menuBox.x).toBeGreaterThanOrEqual(-1)
      expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(width + 1)
      await menu.locator('nav').getByRole('link', { name: /Sản phẩm/ }).click()
      await expect(menu).toHaveCount(0)
      await expect(page).toHaveURL(/#products$/)
      await expect(page.locator('#products')).toBeInViewport()
      await open.click()
      await page.keyboard.press('Escape')
      await expect(menu).toHaveCount(0)
      await expect(open).toBeFocused()
    }
    await page.goto('/san-pham/que')
    await noOverflow('group page')
    await page.goto('/san-pham/trai-cay-tuoi/mango')
    await expect.poll(() => page.locator('.product-detail__media img').first().evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true)
    await noOverflow('product page')
    await expect(page.locator('.product-detail__actions').getByRole('link', { name: 'Yêu cầu báo giá' })).toBeVisible()
    await page.screenshot({ path: testInfo.outputPath(`product-${width}.png`) })
  })
}

test('motion rails pause by touch or keyboard without a corner button', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.marquee-control')).toHaveCount(0);
  const rail=page.locator('.marquee-section');
  await rail.focus(); await page.keyboard.press('Enter');
  await expect(rail).toHaveClass(/is-paused/);
  await page.locator('#testimonials').scrollIntoViewIfNeeded();
  const feedback=page.locator('.feedback-rails');
  await feedback.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('.feedback-section')).toHaveClass(/feedback-paused/);
  await page.emulateMedia({ reducedMotion:'reduce' });
  await expect.poll(()=>page.locator('.marquee-track').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
});

for (const width of [390, 1440]) {
  test(`WCAG AA automated audit at ${width}px: page, product page and policy dialog`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/')
    for (const id of SECTIONS) await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    const scan = async name => {
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
      await testInfo.attach(`${name}-${width}.json`, { body: JSON.stringify(result.violations, null, 2), contentType: 'application/json' })
      expect(result.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }))).toEqual([])
    }
    await scan('page')
    await page.getByRole('button', { name: 'Thông tin & quyền riêng tư', exact: true }).click()
    await scan('policy')
    await page.keyboard.press('Escape')
    await page.goto('/san-pham/trai-cay-tuoi/mango')
    await scan('product')
  })
}
