// Customer reviews, October 2026 — numbers refer to the 18/10 checklist.
import { test, expect } from "@playwright/test";
import { DEFAULT_PRODUCTS, GROUPS, GROUP_NAMES, SPEC_KEYS } from "../src/catalog-v6.js";

const LISTED = GROUPS.filter((group) => DEFAULT_PRODUCTS.some((product) => product.category === group.id));

test.beforeEach(async ({ page, context }) => {
  // Keep WhatsApp/Zalo hand-offs inside the test environment.
  await context.route(/https:\/\/(wa\.me|api\.whatsapp\.com|zalo\.me)\//, (route) => route.fulfill({ contentType: "text/html", body: "<title>Channel</title>" }));
  await page.addInitScript(() => {
    if (!localStorage.getItem("rosic-language")) localStorage.setItem("rosic-language", "vi");
  });
  await page.route("**/api/content", (route) => route.fulfill({ json: { ok: true, data: null } }));
});

const radius = (locator) => locator.evaluate((node) => getComputedStyle(node).borderTopLeftRadius);
const field = (scope, name) => scope.locator(`[name="${name}"]`);

test("Top bar: theme and language are equal cells, page-coloured bar, back-to-top only after scrolling (items 1–5, 10)", async ({ page }) => {
  await page.goto("/");
  const bar = await page.locator(".topbar").evaluate((node) => getComputedStyle(node).backgroundColor);
  const paper = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
  expect(bar).toBe(paper);
  const theme = await page.locator(".topbar .theme-cell").boundingBox();
  const language = await page.locator(".topbar .language-cell").boundingBox();
  expect(Math.abs(theme.height - language.height)).toBeLessThan(1);
  expect(Math.abs(theme.width - language.width)).toBeLessThan(2);
  expect(await radius(page.locator(".topbar .theme-cell"))).toBe(await radius(page.locator(".topbar .language-cell")));
  await expect(page.locator(".topbar .top-cell")).toHaveCount(0);
  await expect(page.locator(".back-to-top, .floating-tools")).toHaveCount(0);
  await page.mouse.wheel(0, 1500);
  const top = page.locator(".topbar .top-cell");
  await expect(top).toBeVisible();
  await expect(page.locator(".topbar")).toBeInViewport();
  await top.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test("Arabic: the display tools stay in the top bar and never cover navigation text (item 10)", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("rosic-language", "ar"));
  await page.goto("/");
  const tools = await page.locator(".topbar .top-tools").boundingBox();
  const header = await page.locator(".site-header").boundingBox();
  expect(tools.y + tools.height).toBeLessThanOrEqual(header.y + 1);
});

test("Mobile menu has two levels and the same items as desktop, in Vietnamese and English (items 1, 9, 23)", async ({ page }) => {
  for (const language of ["vi", "en"]) {
    await page.addInitScript((value) => localStorage.setItem("rosic-language", value), language);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const desktop = [...await page.locator(".nav-left > a, .nav-left .products-menu-trigger").allTextContents(), ...await page.locator(".nav-right > a").allTextContents()].map((text) => text.trim());
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator(".menu-toggle").click();
    const menu = page.locator(".mobile-menu");
    const mobile = (await menu.locator(".mobile-nav > .mobile-nav__item, .mobile-nav__group > .mobile-nav__item").allTextContents()).map((text) => text.replace(/^0\d/, "").trim());
    expect(mobile.sort()).toEqual(desktop.sort());
    await expect(menu.locator(".mobile-nav__sub")).toBeHidden();
    await menu.locator(".mobile-nav__group > button").click();
    await expect(menu.locator(".mobile-nav__sub a")).toHaveCount(LISTED.length);
    await menu.locator(".mobile-nav__sub a").first().click();
    await expect(page).toHaveURL(/\/san-pham\/ca-phe$/);
  }
});

test("One radius for buttons, inputs, cards and frames in light and dark, incl. hero and journey buttons (items 6, 17)", async ({ page }) => {
  for (const theme of ["light", "dark"]) {
    await page.addInitScript((value) => localStorage.setItem("rosic-theme", value), theme);
    await page.goto("/");
    const values = new Set([
      await radius(page.locator(".hero-about-button")),
      await radius(page.locator(".about-journey-button")),
      await radius(page.locator(".topbar .theme-cell")),
    ]);
    await page.goto("/san-pham/ho-tieu/tieu-den-faq");
    values.add(await radius(page.locator(".product-detail__actions .button-primary")));
    values.add(await radius(page.locator(".spec-table")));
    values.add(await radius(page.locator(".pcard__link").first()));
    await page.locator(".product-detail__actions .button-primary").click();
    const dialog = page.locator(".quote-dialog");
    values.add(await radius(field(dialog, "name")));
    values.add(await radius(dialog.locator(".quote-send--whatsapp")));
    values.add(await radius(dialog));
    await page.keyboard.press("Escape");
    await page.goto("/#products");
    values.add(await radius(page.locator(".chip[aria-pressed=true]")));
    expect([...values], theme).toEqual(["10px"]);
  }
});

test("Logo without slogan; headings in Cormorant Garamond, body copy in Be Vietnam Pro (items 7, 16, 26; review 19/10)", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".site-header .brand-slogan")).toHaveCount(0);
  // Review 19/10: every heading uses the logo face; all body copy uses the text face.
  const font = (selector) => page.locator(selector).first().evaluate((node) => getComputedStyle(node).fontFamily);
  for (const selector of [".site-header .brand-name", ".hero-copy h1", ".about-story-heading .section-heading", ".about-pillars h3", "#export-catalog h2", "#journey h2", "#contact h2"])
    expect(await font(selector), selector).toContain("Cormorant Garamond");
  for (const selector of [".about-pillars p", ".hero-description", "#export-catalog p:not(.eyebrow)", ".about-story-heading .eyebrow"])
    expect(await font(selector), selector).toContain("Be Vietnam Pro");
  await page.evaluate(() => localStorage.setItem("rosic-language", "en"));
  await page.reload();
  await expect(page.locator(".hero-copy h1")).toHaveText(/Manufacturing with Heart\s*Trading with Vision/);
});

test("Round favicon set at 32, 48, 96 and 180 px (item 8)", async ({ page, request }) => {
  await page.goto("/");
  const icons = await page.locator('link[rel="icon"]').evaluateAll((links) => links.map((link) => link.getAttribute("sizes")));
  for (const size of ["32x32", "48x48", "96x96", "180x180"]) expect(icons).toContain(size);
  expect(await (await request.get("/favicon.svg")).text()).toContain("<circle");
});

test("Vietnamese pages say Mã sản phẩm, never PRODUCT CODE (item 11)", async ({ page }) => {
  await page.goto("/san-pham/ca-phe");
  await expect(page.locator("main")).not.toContainText(/product code/i);
  await expect(page.locator(".pcard__meta").first()).toContainText("Mã sản phẩm");
});

test("Browser auto-translation does not blank the product page (item 12)", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/san-pham/que/que-thanh");
  const translate = () => page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) if (walker.currentNode.textContent.trim()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const font = document.createElement("font");
      font.textContent = node.textContent.toUpperCase();
      node.parentNode.replaceChild(font, node);
    }
  });
  await translate();
  for (const name of ["QUẾ VỤN", "QUẾ ỐNG"]) {
    await page.locator(".related .pcard__link", { hasText: name }).first().click();
    await translate();
  }
  await expect(page.locator("h1")).not.toBeEmpty();
  expect(await page.locator("main").innerText()).not.toBe("");
  expect(errors).toEqual([]);
});

test("Hero photo is static: no parallax transform (item 13)", async ({ page }) => {
  await page.goto("/");
  const before = await page.locator(".hero-landscape img").evaluate((img) => getComputedStyle(img).transform);
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(200);
  expect(await page.locator(".hero-landscape img").evaluate((img) => getComputedStyle(img).transform)).toBe(before);
});

test("Watermark is centred in thumbnail, product page and zoom (item 14)", async ({ page }) => {
  const centred = async (frame) => {
    const [outer, mark] = await Promise.all([frame.boundingBox(), frame.locator(".product-image-brand__mark").boundingBox()]);
    const brand = await frame.locator(".product-image-brand").evaluate((node) => {
      const rects = [...node.children].filter((child) => getComputedStyle(child).display !== "none").map((child) => child.getBoundingClientRect());
      return (Math.min(...rects.map((r) => r.top)) + Math.max(...rects.map((r) => r.bottom))) / 2;
    });
    expect(Math.abs(mark.x + mark.width / 2 - (outer.x + outer.width / 2))).toBeLessThan(2);
    expect(Math.abs(brand - (outer.y + outer.height / 2))).toBeLessThan(2);
  };
  await page.goto("/#products");
  await centred(page.locator(".v6-finder .pcard .media-frame").first());
  await page.goto("/san-pham/hoa-hoi/hoi-vu-thu");
  await centred(page.locator(".product-detail__media .image-zoom"));
  await page.locator(".product-detail__media .image-zoom").click();
  await centred(page.locator(".lightbox-frame"));
});

test("ROSIC: five English words on one line, descriptions follow the page language (item 15)", async ({ page }) => {
  for (const [language, sample] of [["vi", "Giữ đúng cam kết"], ["en", "We keep our commitments on every order."], ["fr", "Nous tenons nos engagements"], ["ja", "約束を守ります"]]) {
    await page.addInitScript((value) => localStorage.setItem("rosic-language", value), language);
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await expect(page.locator(".rosic-word")).toHaveText(["Reliable", "Origin", "Standardized", "International", "Customer"]);
      const tops = await page.locator(".rosic-values li").evaluateAll((items) => items.map((item) => Math.round(item.getBoundingClientRect().top)));
      expect(new Set(tops).size, `${language} ${width}`).toBe(1);
      const overlaps = await page.locator(".rosic-word").evaluateAll((words) => words.some((word, index) => index && word.getBoundingClientRect().left < words[index - 1].getBoundingClientRect().right));
      expect(overlaps).toBe(false);
      await expect(page.locator(".rosic-section")).toContainText(sample);
    }
  }
});

test("Product finder heading is the CMS text and is not clipped (item 18)", async ({ page }) => {
  await page.goto("/#products");
  const heading = page.locator("#v6-finder-title");
  await expect(heading).toHaveText("Mỗi mùa, một thức quà.");
  expect(await heading.evaluate((node) => node.scrollHeight <= node.clientHeight + 1)).toBe(true);
});

test("Group strip: image (with the product watermark) and name only; no CTA, no marquee, no Quick View; opens the group page (items 19–21, 29, 30; review 18/10 item 7)", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".marquee-section")).toHaveCount(0);
  await page.goto("/#export-catalog");
  const cards = page.locator(".group-strip .gcard");
  await expect(cards).toHaveCount(LISTED.length);
  await expect(page.locator(".group-strip").getByRole("button")).toHaveCount(0);
  await expect(cards.first().locator("img")).toHaveCount(1);
  await expect(cards.first().locator(".gcard__cta")).toHaveCount(0);
  await expect(cards.first().locator(".product-image-brand__name")).toBeVisible();
  await expect(cards.first().locator("p")).toHaveCount(0);
  await cards.filter({ hasText: "Quế" }).locator("a").click();
  await expect(page).toHaveURL(/\/san-pham\/que$/);
  await expect(page.locator(".group-hero img").first()).toBeVisible();
  await expect(page.locator(".group-products .pcard")).toHaveCount(4);
  await page.locator(".group-products .finder-more button").click();
  await expect(page.locator(".group-products .pcard")).toHaveCount(9);
});

test("Mobile group strip scrolls without a grey scrollbar (item 21)", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#export-catalog");
  const strip = page.locator(".group-strip");
  expect(await strip.evaluate((node) => getComputedStyle(node).scrollbarWidth)).toBe("none");
  expect(await strip.evaluate((node) => node.scrollWidth > node.clientWidth)).toBe(true);
});

test("Product group icons are the redrawn product shapes (item 24)", async ({ page }) => {
  await page.goto("/");
  await page.locator(".products-menu-trigger").click();
  const icons = await page.locator(".mega-menu__icon svg").evaluateAll((svgs) => svgs.map((svg) => svg.innerHTML));
  expect(new Set(icons).size).toBe(icons.length);
});

test("Dried fruit is hidden from menu, strip, chips and footer until it has products (item 25)", async ({ page }) => {
  await page.goto("/#products");
  for (const selector of [".mega-menu", ".group-strip", ".chip-row", ".site-footer"])
    await expect(page.locator(selector)).not.toContainText("Trái cây sấy");
  await expect(page.locator("body")).not.toContainText("Đang cập nhật");
});

test("Search runs on Enter only; clearing shows every product and resets the chip (items 27–28)", async ({ page }) => {
  await page.goto("/#products");
  const finder = page.locator(".v6-finder");
  const input = finder.getByRole("searchbox");
  await expect(input).toHaveAttribute("autocomplete", "off");
  await finder.locator(".chip", { hasText: "Hoa hồi" }).click();
  await expect(finder.locator(".pcard")).toHaveCount(4);
  await input.fill("tiêu");
  await expect(finder.locator(".pcard")).toHaveCount(4);
  await input.press("Enter");
  await expect(finder.locator(".pcard")).toHaveCount(6);
  await input.fill("");
  await expect(finder.locator(".chip").first()).toHaveAttribute("aria-pressed", "true");
  await expect(finder.locator(".finder-count")).toHaveText(`${DEFAULT_PRODUCTS.length} sản phẩm`);
  await expect(finder.locator(".v6-empty")).toHaveCount(0);
});

test("Product page: full specs, quote CTA opens the form in place, related products from the same group (items 32–35)", async ({ page }) => {
  await page.goto("/san-pham/que/que-thanh");
  await expect(page.locator(".spec-table > div")).toHaveCount(SPEC_KEYS.length);
  for (const label of ["Mã sản phẩm", "Độ ẩm", "Tạp chất", "Độ dày / quy cách", "Màu sắc", "Đóng gói", "Hệ số xếp container", "Quy chuẩn áp dụng"])
    await expect(page.locator(".spec-table")).toContainText(label);
  await page.mouse.wheel(0, 1100);
  const bar = page.locator(".quote-bar");
  await expect(bar).toHaveClass(/is-visible/);
  await bar.getByRole("button").click();
  await expect(page.locator(".quote-dialog")).toBeVisible();
  await expect(page).toHaveURL(/\/san-pham\/que\/que-thanh$/);
  await expect(field(page.locator(".quote-dialog"), "product")).toHaveValue("que-thanh");
  await page.keyboard.press("Escape");
  await expect(page.locator(".related .pcard")).toHaveCount(4);
  await page.locator(".related .finder-more button").click();
  const related = await page.locator(".related .pcard__link").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(related.length).toBe(8);
  for (const href of related) expect(href).toMatch(/^\/san-pham\/que\//);
});

test("Coffee: size 13/16/18 in Clean and non-clean, then broken and roasted (item 36)", async ({ page }) => {
  await page.goto("/san-pham/ca-phe");
  await page.locator(".group-products .finder-more button").click();
  await expect(page.locator(".group-products .pcard__title")).toHaveText([
    "Cà phê nhân xanh size 13 – Clean", "Cà phê nhân xanh size 13 – Không clean",
    "Cà phê nhân xanh size 16 – Clean", "Cà phê nhân xanh size 16 – Không clean",
    "Cà phê nhân xanh size 18 – Clean", "Cà phê nhân xanh size 18 – Không clean",
    "Cà phê nhân xanh hạt vỡ", "Cà phê rang xay",
  ]);
});

test("One-step quote: consent required, WhatsApp opens directly, Zalo copies first, no stored values (items 37–41)", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/san-pham/com-dua/com-dua-say-hat-beo");
  await page.locator(".product-detail__actions .button-primary").click();
  const form = page.locator(".quote-dialog");
  await expect(field(form, "product")).toHaveValue("com-dua-say-hat-beo");
  for (const name of ["name", "phone", "email", "quantity", "market", "note"]) {
    await expect(field(form, name)).toHaveValue("");
    await expect(field(form, name)).toHaveAttribute("autocomplete", "off");
  }
  await expect(form.locator("textarea")).toHaveCount(0);
  await expect(form.getByRole("button", { name: /Tải|Thử gửi lại/ })).toHaveCount(0);
  await field(form, "name").fill("Nguyen An");
  await field(form, "phone").fill("+84 912 345 678");
  await field(form, "quantity").fill("1 x 20ft");
  await field(form, "note").fill("Cần mẫu trước.");
  let popups = 0;
  context.on("page", () => { popups += 1; });
  await form.getByRole("button", { name: "Gửi qua WhatsApp" }).click();
  await expect(form.locator(".quote-error")).toContainText("chính sách bảo mật");
  expect(popups).toBe(0);
  await form.getByRole("button", { name: "Chính sách bảo mật" }).click();
  await expect(page.getByRole("dialog", { name: "Thông tin & quyền riêng tư" })).toBeVisible();
  await page.keyboard.press("Escape");
  await field(form, "consent").check();
  const [whatsapp] = await Promise.all([context.waitForEvent("page"), form.getByRole("button", { name: "Gửi qua WhatsApp" }).click()]);
  const text = new URL(whatsapp.url()).searchParams.get("text");
  expect(text).toContain("ROS-503 · Cơm dừa sấy khô hạt béo");
  expect(text).toContain("Cần mẫu trước.");
  await whatsapp.close();
  const [zalo] = await Promise.all([context.waitForEvent("page"), form.getByRole("button", { name: /Zalo/ }).click()]);
  await zalo.close();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("ROS-503");
  await expect(form.locator(".quote-status")).toContainText("Zalo");
});

test("Footer: official slogan, social icons with popups, empty channels hidden, shared display tools (items 42–46)", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator(".site-footer");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer.locator(".footer-tagline")).toHaveText("Manufacturing with Heart, Trading with Vision");
  await expect(footer).not.toContainText("Gieo giá trị từ tâm");
  await expect(footer.locator(".brand-mark")).toHaveAttribute("src", /\.svg$/);
  await expect(footer.locator(".social-icon[data-channel=tiktok]")).toHaveCount(0);
  await expect(footer.locator("img[alt^='QR']")).toHaveCount(0);
  await footer.locator(".social-icon[data-channel=whatsapp]").click();
  await expect(page.locator(".social-popup img")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(footer.locator(".footer-tools .theme-cell")).toBeVisible();
  await expect(footer.locator(".footer-tools .top-cell")).toBeVisible();
});

test("Back from a product page returns to the same place on the home page", async ({ page }) => {
  await page.goto("/#products");
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(200);
  const before = await page.evaluate(() => window.scrollY);
  await page.locator(".v6-finder .pcard__link").nth(2).click();
  await expect(page).toHaveURL(/\/san-pham\//);
  await page.goBack();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before - 5);
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThan(5);
});

test("WCAG AA: home, group page, product page, quote dialog and policy in light and dark", async ({ page }) => {
  test.setTimeout(150_000);
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  const scan = async (label) => {
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(result.violations.map((v) => ({ label, id: v.id, nodes: v.nodes.map((n) => `${n.target} ${n.failureSummary}`) }))).toEqual([]);
  };
  for (const theme of ["light", "dark"]) {
    await page.addInitScript((value) => localStorage.setItem("rosic-theme", value), theme);
    await page.goto("/");
    for (const id of ["about", "export-catalog", "products", "private-label", "journey", "testimonials", "blog", "contact"])
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await scan(`${theme} home`);
    await page.getByRole("button", { name: "Thông tin & quyền riêng tư", exact: true }).click();
    await scan(`${theme} policy`);
    await page.keyboard.press("Escape");
    await page.goto("/san-pham/que");
    await scan(`${theme} group`);
    await page.goto("/san-pham/que/que-dieu");
    await scan(`${theme} product`);
    await page.locator(".product-detail__actions .button-primary").click();
    await scan(`${theme} quote dialog`);
  }
});

test("Brand naming: page copy and older CMS text say ROSIC, not Hồng Tâm (review 19/10)", async ({ page }) => {
  const content = { brandStoryVersion: 4, heroEyebrow: "HỒNG TÂM ROSIC  · VIỆT NAM", aboutBody: "Hồng Tâm bắt đầu từ chữ Tâm: sự tử tế trong kinh doanh." };
  await page.route("**/api/content", (route) => route.fulfill({ json: { ok: true, data: { content, settings: {}, products: [], categories: [] } } }));
  await page.goto("/");
  await expect(page.locator(".hero-copy .eyebrow")).toHaveText("ROSIC · VIỆT NAM");
  await expect(page.locator(".about-pillars")).toContainText("ROSIC bắt đầu từ chữ Tâm");
  for (const language of ["vi", "fr"]) {
    await page.evaluate((value) => localStorage.setItem("rosic-language", value), language);
    await page.reload();
    for (let y = 0; y < 12000; y += 1200) await page.mouse.wheel(0, 1200);
    const text = await page.evaluate(() => document.body.innerText.normalize("NFC"));
    expect(text.match(/.{0,40}(Hồng Tâm|HỒNG TÂM).{0,40}/gu) ?? [], language).toEqual([]);
  }
});

test("Review 20/10: CTAs without arrows, four products per group, Back keeps the chosen group, footer rows line up", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#products");
  const finder = page.locator(".v6-finder");
  await finder.locator(".chip", { hasText: "Hạt tiêu" }).click();
  await expect(finder.locator(".pcard")).toHaveCount(4);
  await finder.locator(".finder-more button").click();
  await expect(finder.locator(".pcard")).toHaveCount(6);
  // No arrow inside any call-to-action, and labels stay inside their frame.
  for (const cta of await page.locator(".pcard__cta, .button").all()) {
    if (!(await cta.isVisible())) continue;
    expect(await cta.locator("svg[class*='arrow']").evaluateAll((icons) => icons.filter((icon) => icon.getBoundingClientRect().width > 0).length)).toBe(0);
    expect(await cta.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
  }
  await finder.locator(".pcard__link").nth(5).click();
  await expect(page).toHaveURL(/\/san-pham\/ho-tieu\//);
  await page.goBack();
  await expect(finder.locator(".chip", { hasText: "Hạt tiêu" })).toHaveAttribute("aria-pressed", "true");
  await expect(finder.locator(".pcard")).toHaveCount(6);
  // Footer: Home is a plain link; both lists start on the same row.
  await page.setViewportSize({ width: 1440, height: 900 });
  const columns = page.locator(".site-footer .footer-column");
  await expect(columns.first().locator("h3")).toHaveCount(0);
  const tops = await columns.evaluateAll((cols) => cols.map((col) => Math.round(col.querySelector("a").getBoundingClientRect().top)));
  expect(tops[0]).toBe(tops[1]);
  // Brand letters and product codes are not run through page translators.
  await expect(page.locator(".rosic-letter").first()).toHaveAttribute("translate", "no");
});
