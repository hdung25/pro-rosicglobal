import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import AxeBuilder from '@axe-core/playwright'
import { PRODUCTS, CATEGORIES, JOURNEY, ARTICLES } from '../src/data.js'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('all rendered images load, internal links resolve, and the page has no runtime errors', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const images = page.locator('img')
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded()
    await expect.poll(() => image.evaluate(node => node.complete && node.naturalWidth > 0)).toBe(true)
    if ((await image.getAttribute('aria-hidden')) !== 'true') {
      await expect(image).toHaveAttribute('alt', /.+/)
    }
  }
  const links = await page.locator('a[href]').evaluateAll(anchors => anchors.map(a => a.getAttribute('href')))
  for (const href of links) {
    expect(href).not.toBe('#')
    if (href.startsWith('#')) await expect(page.locator(href)).toHaveCount(1)
  }
  for (const id of ['about', 'journey', 'products', 'testimonials', 'blog', 'contact', 'home']) {
    await page.locator(`.site-footer a[href="#${id}"]`).first().click()
    await expect(page).toHaveURL(new RegExp(`#${id}$`))
    await expect(page.locator(`#${id}`)).toBeInViewport()
  }
  expect(errors).toEqual([])
})

test('category filters, accent-insensitive search, empty state and reset work together', async ({ page }) => {
  for (const category of CATEGORIES) {
    await page.locator('.category-tabs').getByRole('button', { name: category.label, exact: true }).click()
    const count = category.id === 'all' ? PRODUCTS.length : PRODUCTS.filter(p => p.category === category.id).length
    await expect(page.locator('.product-card')).toHaveCount(count)
    await expect(page.locator('.category-tabs button[aria-pressed="true"]')).toHaveText(category.label)
  }
  await page.locator('.category-tabs').getByRole('button', { name: 'Tất cả', exact: true }).click()
  const search = page.getByRole('searchbox', { name: 'Tìm sản phẩm' })
  await search.fill('  DONG TRUNG HA THAO  ')
  await expect(page.locator('.product-card')).toHaveCount(1)
  await expect(page.getByRole('button', { name: 'Xem Đông trùng hạ thảo', exact: true })).toBeVisible()
  await search.fill('hat dieu')
  await expect(page.locator('.product-card')).toHaveCount(1)
  await expect(page.getByRole('button', { name: 'Xem Hạt điều', exact: true })).toBeVisible()
  await page.locator('.category-tabs').getByRole('button', { name: 'Trái cây tươi', exact: true }).click()
  await expect(page.locator('.product-card')).toHaveCount(0)
  await expect(page.getByText('Chưa tìm thấy sản phẩm phù hợp', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Xem tất cả sản phẩm', exact: true }).click()
  await expect(search).toHaveValue('')
  await expect(page.locator('.product-card')).toHaveCount(PRODUCTS.length)
  await expect(page.locator('.category-tabs button[aria-pressed="true"]')).toHaveText('Tất cả')
})

for (const product of PRODUCTS) {
  test(`product detail: ${product.title}; keyboard close restores focus`, async ({ page }) => {
    const trigger = page.getByRole('button', { name: `Xem ${product.title}`, exact: true })
    await trigger.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { name: product.title, exact: true })).toBeVisible()
    await expect(dialog).toContainText(product.description)
    await expect.poll(() => dialog.locator('img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true)
    await page.keyboard.press('Tab')
    await expect.poll(() => dialog.evaluate(node => node.contains(document.activeElement))).toBe(true)
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(trigger).toBeFocused()
  })
}

test('product request selects the correct product and reaches the contact form', async ({ page }) => {
  await page.getByRole('button', { name: 'Xem Thanh long ruột đỏ', exact: true }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Yêu cầu sản phẩm này' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByLabel('Sản phẩm quan tâm', { exact: true })).toHaveValue('Thanh long ruột đỏ')
  await expect(page).toHaveURL(/#contact$/)
  await expect(page.locator('#contact')).toBeInViewport()
  await page.getByLabel('Họ và tên').fill('Giữ nguyên tên đã nhập')
  await page.getByLabel('Sản phẩm quan tâm', { exact: true }).selectOption('Hạt điều')
  await page.getByRole('button', { name: 'Xem Thanh long ruột đỏ', exact: true }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Yêu cầu sản phẩm này' }).click()
  await expect(page.getByLabel('Sản phẩm quan tâm', { exact: true })).toHaveValue('Thanh long ruột đỏ')
  await expect(page.getByLabel('Họ và tên')).toHaveValue('Giữ nguyên tên đã nhập')
  await expect(page.locator('#contact')).toBeInViewport()
})

test('article contact CTA reaches contact after closing the dialog', async ({ page }) => {
  await page.locator('.journal-card button').first().click()
  await page.getByRole('dialog').getByRole('link', { name: 'Cùng trao đổi thêm' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page).toHaveURL(/#contact$/)
  await expect(page.locator('#contact')).toBeInViewport()
})

test('header category dropdown and footer category links apply their filters', async ({ page }) => {
  const dropdown = page.locator('.nav-dropdown')
  await dropdown.getByRole('link', { name: 'Sản phẩm', exact: true }).focus()
  await page.keyboard.press('Tab')
  await expect(dropdown.getByRole('link', { name: 'Trái cây tươi', exact: true })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('.product-card')).toHaveCount(PRODUCTS.filter(product => product.category === 'fruit').length)
  await expect(page.locator('#products')).toBeInViewport()
  await page.locator('.site-footer').getByRole('link', { name: 'Nông sản chế biến', exact: true }).click()
  await expect(page.locator('.product-card')).toHaveCount(PRODUCTS.filter(product => product.category === 'processed').length)
  await expect(page.locator('.category-tabs button[aria-pressed="true"]')).toHaveText('Nông sản chế biến')
  await expect(page.locator('#products')).toBeInViewport()
})

test('all four journey steps reveal the corresponding image and description', async ({ page }) => {
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
  await expect(dialog).toContainText('hệ thống báo giá để phân luồng')
  await dialog.getByRole('button', { name: 'Đóng chi tiết', exact: true }).click()
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test('quote form validates, sends the complete B2B contract, and reports accepted channels truthfully', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  const requests = []
  await page.route('**/api/quote', async route => {
    const request = route.request()
    requests.push({
      body: JSON.parse(request.postData() || '{}'),
      idempotencyKey: request.headers()['idempotency-key'],
    })
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        status: 'accepted',
        requestId: 'quote-ui-accepted-01',
        deliveries: {
          make: { status: 'sent' },
          customerEmail: { status: 'queued' },
          salesEmail: { status: 'queued' },
        },
        catalogProfile: {
          status: 'available',
          url: 'https://files.example.com/hong-tam-profile.pdf',
        },
      }),
    })
  })
  const form = page.locator('#contact form')
  const submit = form.getByRole('button', { name: 'Gửi yêu cầu báo giá', exact: true })
  await submit.click()
  await expect(page.locator('.request-result')).toHaveCount(0)
  await expect(page.getByLabel('Họ và tên')).toBeFocused()
  await page.getByLabel('Họ và tên').fill('QA Kiểm tra')
  await page.getByLabel('Số điện thoại / WhatsApp').fill('abcdefgh')
  await page.getByLabel('Email liên hệ').fill('qa@example.com')
  await submit.click()
  await expect(page.locator('.request-result')).toHaveCount(0)
  await expect(page.getByLabel('Số điện thoại / WhatsApp')).toBeFocused()
  await expect.poll(() => page.getByLabel('Số điện thoại / WhatsApp').evaluate(input => input.validationMessage)).toContain('8-15')
  await page.getByLabel('Số điện thoại / WhatsApp').fill('+84 912 345 678')
  await page.getByLabel('Email liên hệ').fill('invalid-email')
  await submit.click()
  await expect(page.locator('.request-result')).toHaveCount(0)
  await expect(page.getByLabel('Email liên hệ')).toBeFocused()
  await page.getByLabel('Email liên hệ').fill('qa@example.com')
  await page.getByLabel('Sản phẩm quan tâm', { exact: true }).selectOption('Hạt điều')
  await page.getByLabel('Thị trường đích').fill('Đức')
  await page.getByLabel('Sản lượng dự kiến').fill('1 × 20’ FCL')
  await page.getByLabel('Thời gian mong muốn').selectOption('Trong 30 ngày')
  await page.getByLabel('Yêu cầu chi tiết').fill('Yêu cầu kiểm tra nội bộ, 200 kg, bao bì 5 kg.\nGiao dự kiến tháng 10.')
  await page.getByLabel('Tôi đồng ý nhận cập nhật về yêu cầu này qua WhatsApp.').check()
  await submit.click()
  await expect.poll(() => requests.length).toBe(1)
  expect(requests[0].body).toMatchObject({
    name: 'QA Kiểm tra',
    phone: '+84 912 345 678',
    email: 'qa@example.com',
    product: 'Hạt điều',
    market: 'Đức',
    quantity: '1 × 20’ FCL',
    timeline: 'Trong 30 ngày',
    whatsappOptIn: true,
    honeypot: '',
  })
  expect(requests[0].body.productGroup).toBeTruthy()
  expect(requests[0].body.formStartedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  expect(requests[0].body.clientSubmissionId).toMatch(/^[A-Za-z0-9._-]{8,128}$/)
  expect(requests[0].idempotencyKey).toBe(requests[0].body.clientSubmissionId)
  const result = page.getByRole('region', { name: 'Cảm ơn bạn đã gửi yêu cầu.' })
  await expect(result).toBeVisible()
  await expect(result).toBeFocused()
  await expect(result).toContainText('Mã yêu cầu: quote-ui-accepted-01')
  await expect(result).toContainText('Đã chuyển tới kênh này.')
  await expect(result).toContainText('Đã được nhà cung cấp email tiếp nhận để xử lý.')
  await expect(result.getByRole('link', { name: 'Download Our Catalog/Profile', exact: true })).toHaveAttribute('href', 'https://files.example.com/hong-tam-profile.pdf')
  const summary = await page.locator('.request-summary').innerText()
  expect(summary).toContain('Sản phẩm quan tâm: Hạt điều')
  expect(summary).toContain('Thị trường đích: Đức')
  expect(summary).toContain('QA Kiểm tra')
  await result.getByRole('button', { name: 'Sao chép nội dung', exact: true }).click()
  await expect(result).toContainText('Đã sao chép nội dung')
  expect((await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n')).toBe(summary)
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    result.getByRole('button', { name: 'Tải yêu cầu .txt', exact: true }).click(),
  ])
  expect(download.suggestedFilename()).toBe('yeu-cau-bao-gia-hong-tam.txt')
  const downloadPath = await download.path()
  expect((await readFile(downloadPath, 'utf8')).replace(/^\uFEFF/, '')).toBe(summary)
  await page.getByLabel('Yêu cầu chi tiết').fill('Nhu cầu đã thay đổi.')
  await expect(result).toHaveCount(0)
})

test('quote form gives an explicit no-send fallback when delivery is not configured', async ({ page }) => {
  await page.route('**/api/quote', async route => {
    await route.fulfill({
      status: 202,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: false,
        status: 'configuration_required',
        requestId: 'quote-ui-config-01',
        deliveries: {
          make: { status: 'not_configured' },
          customerEmail: { status: 'not_configured' },
          salesEmail: { status: 'not_configured' },
        },
        catalogProfile: { status: 'placeholder', url: null },
      }),
    })
  })
  await page.getByLabel('Họ và tên').fill('Nguyễn Thị Ánh')
  await page.getByLabel('Số điện thoại / WhatsApp').fill('+84962284872')
  await page.getByLabel('Email liên hệ').fill('anh@example.com')
  await page.getByRole('button', { name: 'Gửi yêu cầu báo giá', exact: true }).click()
  const result = page.getByRole('region', { name: 'Kênh gửi trực tuyến đang chờ cấu hình.' })
  await expect(result).toContainText('Nội dung này chưa được chuyển đến Sales')
  await expect(result).toContainText('Chưa được cấu hình')
  await expect(result.getByRole('button', { name: 'Download Our Catalog/Profile', exact: true })).toBeDisabled()
  await expect(result.getByRole('link', { name: 'Mở ứng dụng email', exact: true })).toHaveAttribute('href', /^mailto:info@rosicglobal\.com/)
  await expect(result.getByRole('link', { name: 'WhatsApp', exact: true })).toHaveAttribute('href', /^https:\/\/wa\.me\/84962284872/)
})

for (const width of [360, 390, 768, 1440, 1920, 2560]) {
  test(`layout fits ${width}px, menu and detail stay usable`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    for (const id of ['home', 'about', 'products', 'journey', 'testimonials', 'blog', 'contact']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded()
      const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
      expect(dimensions.scroll, `Overflow at #${id} on ${width}px`).toBeLessThanOrEqual(dimensions.client + 1)
    }
    if (width < 1100) {
      const open = page.getByRole('button', { name: 'Mở menu', exact: true })
      await open.click()
      const menu = page.getByRole('dialog', { name: 'Điều hướng', exact: true })
      await expect(menu).toBeVisible()
      const menuBox = await menu.boundingBox()
      expect(menuBox.x).toBeGreaterThanOrEqual(-1)
      expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(width + 1)
      await menu.getByRole('link', { name: /Sản phẩm/ }).click()
      await expect(menu).toHaveCount(0)
      await expect(page).toHaveURL(/#products$/)
      await expect(page.locator('#products')).toBeInViewport()
      await open.click()
      await page.keyboard.press('Escape')
      await expect(menu).toHaveCount(0)
      await expect(open).toBeFocused()
    }
    await page.getByRole('button', { name: 'Xem Xoài chín vàng', exact: true }).click()
    const detail = page.getByRole('dialog')
    await expect.poll(() => detail.locator('img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true)
    const box = await detail.boundingBox()
    expect(box.x).toBeGreaterThanOrEqual(-1)
    expect(box.x + box.width).toBeLessThanOrEqual(width + 1)
    await expect(detail.getByRole('button', { name: 'Yêu cầu sản phẩm này' })).toBeVisible()
    await page.screenshot({ path: testInfo.outputPath(`product-${width}.png`) })
    await page.keyboard.press('Escape')
    await page.locator('#home').scrollIntoViewIfNeeded()
    await page.screenshot({ path: testInfo.outputPath(`home-${width}.png`), fullPage: true })
  })
}

test('motion rails pause by touch or keyboard without a corner button', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.marquee-control')).toHaveCount(0);
  const rail=page.locator('.marquee-section');
  await rail.focus(); await page.keyboard.press('Enter');
  await expect(rail).toHaveClass(/is-paused/);
  const feedback=page.locator('.feedback-rails');
  await feedback.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('.feedback-section')).toHaveClass(/feedback-paused/);
  await page.emulateMedia({ reducedMotion:'reduce' });
  await expect.poll(()=>page.locator('.marquee-track').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
});

for (const width of [390, 1440]) {
  test(`WCAG AA automated audit at ${width}px, product and policy dialogs`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/')
    for (const id of ['home', 'about', 'products', 'journey', 'testimonials', 'blog', 'contact']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    }
    const scan = async name => {
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
      await testInfo.attach(`${name}-${width}.json`, { body: JSON.stringify(result.violations, null, 2), contentType: 'application/json' })
      expect(result.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }))).toEqual([])
    }
    await scan('page')
    await page.getByRole('button', { name: 'Xem Xoài chín vàng', exact: true }).click()
    await scan('product')
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: 'Thông tin & quyền riêng tư', exact: true }).click()
    await scan('policy')
  })
}
