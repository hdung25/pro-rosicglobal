// Customer review, October 2026 — one check per numbered item.
import { test, expect } from "@playwright/test";
import { DEFAULT_PRODUCTS, GROUPS, GROUP_NAMES, SPEC_KEYS } from "../src/catalog-v6.js";

test.beforeEach(async ({ page, context }) => {
  // Keep WhatsApp hand-offs inside the test environment.
  await context.route(/https:\/\/(wa\.me|api\.whatsapp\.com)\//, (route) => route.fulfill({ contentType: "text/html", body: "<title>WhatsApp</title>" }));
  await page.addInitScript(() => {
    if (!localStorage.getItem("rosic-language")) localStorage.setItem("rosic-language", "vi");
  });
  await page.route("**/api/content", (route) => route.fulfill({ json: { ok: true, data: null } }));
});

const radius = (locator) => locator.evaluate((node) => getComputedStyle(node).borderTopLeftRadius);

test("1 · frames, buttons, selected chips, quote form and CTA share one radius in light and dark", async ({ page }) => {
  for (const theme of ["light", "dark"]) {
    await page.addInitScript((value) => localStorage.setItem("rosic-theme", value), theme);
    await page.goto("/san-pham/ho-tieu/tieu-den-faq");
    const values = new Set([
      await radius(page.locator(".product-detail__actions .button-primary")),
      await radius(page.locator(".product-detail__actions .button-outline")),
      await radius(page.locator(".spec-table")),
      await radius(page.locator(".pcard__link").first()),
      await radius(page.locator(".theme-switch")),
    ]);
    await page.locator("#contact .contact-form").scrollIntoViewIfNeeded();
    values.add(await radius(page.locator("#contact .contact-form")));
    values.add(await radius(page.locator("#quote-name")));
    values.add(await radius(page.locator(".quote-send--whatsapp")));
    await page.goto("/#products");
    values.add(await radius(page.locator(".chip[aria-pressed=true]")));
    expect([...values], theme).toEqual(["10px"]);
  }
});

test("2 · Arabic: theme and back-to-top controls never cover navigation text", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("rosic-language", "ar"));
  await page.goto("/");
  const theme = await page.locator(".topbar .theme-switch").boundingBox();
  const header = await page.locator(".site-header").boundingBox();
  expect(theme.y + theme.height).toBeLessThanOrEqual(header.y + 1);
  await expect(page.locator(".floating-tools")).toHaveCount(0);
  await page.mouse.wheel(0, 2600);
  const button = page.locator(".back-to-top");
  await expect(button).toHaveClass(/is-visible/);
  const box = await button.boundingBox();
  const viewport = page.viewportSize();
  expect(box.x).toBeLessThan(viewport.width / 2); // inline-end is the left edge in RTL
  expect(box.y).toBeGreaterThan(viewport.height - 120);
});

test("3 · back-to-top hides while the quotation CTA is on screen", async ({ page }) => {
  await page.goto("/san-pham/que/que-dieu");
  await page.locator("#contact .quote-actions").scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 60);
  await expect(page.locator(".back-to-top")).not.toHaveClass(/is-visible/);
});

test("4 · logo has no slogan and ROSIC uses Cormorant Garamond", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".site-header .brand-slogan")).toHaveCount(0);
  const font = await page.locator(".site-header .brand-name").evaluate((node) => getComputedStyle(node).fontFamily);
  expect(font).toContain("Cormorant Garamond");
});

test("5 · header has four labelled links either side, including Nhãn hiệu riêng", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".nav-left > *")).toHaveCount(4);
  await expect(page.locator(".nav-right > a")).toHaveCount(4);
  await expect(page.locator(".nav-left")).toContainText("Nhãn hiệu riêng");
  await expect(page.locator(".theme-switch")).toContainText("Sáng");
  await expect(page.locator(".theme-switch")).toContainText("Tối");
  const left = await page.locator(".nav-left").boundingBox();
  const right = await page.locator(".nav-right").boundingBox();
  const brand = await page.locator(".site-header .brand").boundingBox();
  const leftGap = brand.x - (left.x + left.width);
  const rightGap = right.x - (brand.x + brand.width);
  expect(Math.abs(leftGap - rightGap)).toBeLessThan(4);
});

test("6 · watermark is centred on the picture in card, Quick View, product page and zoom", async ({ page }) => {
  const centred = async (frame) => {
    const [outer, mark] = await Promise.all([frame.boundingBox(), frame.locator(".product-image-brand__mark").boundingBox()]);
    const brand = await frame.locator(".product-image-brand").evaluate((node) => {
      const rect = [...node.children].map((child) => child.getBoundingClientRect());
      const top = Math.min(...rect.map((r) => r.top));
      const bottom = Math.max(...rect.map((r) => r.bottom));
      return { cy: (top + bottom) / 2 };
    });
    expect(Math.abs(mark.x + mark.width / 2 - (outer.x + outer.width / 2))).toBeLessThan(2);
    expect(Math.abs(brand.cy - (outer.y + outer.height / 2))).toBeLessThan(2);
  };
  await page.goto("/#products");
  await centred(page.locator(".v6-finder .pcard .media-frame").first());
  await page.goto("/#export-catalog");
  await page.locator(".gcard").first().getByRole("button").click();
  await centred(page.locator(".quick-view .pcard .media-frame").first());
  await page.goto("/san-pham/hoa-hoi/hoi-vu-thu");
  await centred(page.locator(".product-detail__media .image-zoom"));
  await page.locator(".product-detail__media .image-zoom").click();
  await centred(page.locator(".lightbox-frame"));
});

test("7 · Vietnamese pages say Mã sản phẩm, never PRODUCT CODE", async ({ page }) => {
  await page.goto("/san-pham/ca-phe");
  await expect(page.locator("main")).not.toContainText(/product code/i);
  await expect(page.locator(".pcard__meta").first()).toContainText("Mã sản phẩm");
});

test("8 · product menu opens on click and stays open until a choice is made", async ({ page }) => {
  await page.goto("/");
  const trigger = page.locator(".products-menu-trigger");
  const panel = page.locator("#product-menu");
  await trigger.click();
  await expect(panel).toBeVisible();
  await page.mouse.move(10, 600);
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(300);
  await expect(panel).toBeVisible();
  await panel.getByRole("link", { name: /Hoa hồi/ }).click();
  await expect(page).toHaveURL(/\/san-pham\/hoa-hoi$/);
  await expect(panel).toBeHidden();
});

test("9–10 · menu, group cards and filter chips list the same groups; a group opens its own page", async ({ page }) => {
  await page.goto("/");
  await page.locator(".products-menu-trigger").click();
  const menu = await page.locator(".mega-menu__text strong").allTextContents();
  await page.keyboard.press("Escape");
  await page.goto("/#products");
  const chips = (await page.locator(".v6-finder .chip").allTextContents()).slice(1).map((text) => text.replace(/\d+$/, "").trim());
  const cards = await page.locator(".gcard h3").allTextContents();
  const expected = GROUPS.map((group) => GROUP_NAMES.vi[group.id]);
  expect(menu).toEqual(expected);
  expect(chips).toEqual(expected);
  expect(cards).toEqual(expected);
  await page.locator(".gcard h3 a", { hasText: "Quế" }).click();
  await expect(page).toHaveURL(/\/san-pham\/que$/);
  await expect(page.locator(".group-hero h1")).toHaveText("Quế");
  await expect(page.locator(".group-products .pcard")).toHaveCount(9);
});

test("11–12 · Quick View lists every sub-product and closing keeps the scroll position", async ({ page }) => {
  await page.goto("/#export-catalog");
  await page.mouse.wheel(0, 250);
  await page.waitForTimeout(200);
  const before = await page.evaluate(() => window.scrollY);
  await page.locator(".gcard", { hasText: "Cà phê" }).getByRole("button", { name: "Xem nhanh" }).click();
  const cards = page.locator(".quick-view .pcard");
  await expect(cards).toHaveCount(DEFAULT_PRODUCTS.filter((item) => item.category === "coffee-bean").length);
  for (const card of await cards.all()) {
    await expect(card.locator("img")).toBeVisible();
    await expect(card.locator(".pcard__title")).not.toBeEmpty();
    await expect(card.locator(".pcard__cta")).toHaveText(/Xem chi tiết/);
  }
  await page.keyboard.press("Escape");
  await expect(page.locator(".quick-view")).toHaveCount(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(before);
});

test("13–15 · product page: full spec table, visible quote CTA, related products from the same group only", async ({ page }) => {
  await page.goto("/san-pham/que/que-thanh");
  await expect(page.locator(".spec-table > div")).toHaveCount(SPEC_KEYS.length);
  for (const label of ["Mã sản phẩm", "Độ ẩm", "Tạp chất", "Độ dày / quy cách", "Màu sắc", "Đóng gói", "Hệ số xếp container", "Quy chuẩn áp dụng"])
    await expect(page.locator(".spec-table")).toContainText(label);
  await page.mouse.wheel(0, 1100);
  await expect(page.locator(".quote-bar")).toHaveClass(/is-visible/);
  const related = await page.locator(".related .pcard__link").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(related.length).toBe(8);
  for (const href of related) expect(href).toMatch(/^\/san-pham\/que\//);
  await page.locator(".related .pcard__link").first().click();
  await expect(page).toHaveURL(/\/san-pham\/que\/que-vun$/);
});

test("16–17 · search runs on Enter only; clearing the box shows every product and resets the chip", async ({ page }) => {
  await page.goto("/#products");
  const finder = page.locator(".v6-finder");
  const input = finder.getByRole("searchbox");
  await expect(input).toHaveAttribute("autocomplete", "off");
  await finder.locator(".chip", { hasText: "Hoa hồi" }).click();
  await expect(finder.locator(".pcard")).toHaveCount(4);
  await input.fill("tiêu");
  await expect(finder.locator(".pcard")).toHaveCount(4); // typing alone changes nothing
  await input.press("Enter");
  await expect(finder.locator(".pcard")).toHaveCount(6);
  await expect(finder.locator(".finder-count")).toContainText("tiêu");
  await input.fill("quế");
  await finder.getByRole("button", { name: "Tìm" }).click();
  await expect(finder.locator(".pcard")).toHaveCount(9);
  await input.fill("");
  await expect(finder.locator(".chip").first()).toHaveAttribute("aria-pressed", "true");
  await expect(finder.locator(".finder-count")).toHaveText(`${DEFAULT_PRODUCTS.length} sản phẩm`);
  await expect(finder.locator(".v6-empty")).toHaveCount(0);
});

test("19–20 · one-step quote: product prefilled, editable message, WhatsApp opens with that message", async ({ page, context }) => {
  await page.goto("/san-pham/com-dua/com-dua-say-hat-beo");
  await page.locator(".product-detail__actions .button-primary").click();
  const form = page.locator("#contact");
  await expect(form.locator("#quote-product")).toHaveValue("com-dua-say-hat-beo");
  for (const id of ["#quote-name", "#quote-phone", "#quote-email", "#quote-quantity", "#quote-market"])
    await expect(form.locator(id)).toHaveValue("");
  await form.locator("#quote-name").fill("Nguyen An");
  await form.locator("#quote-phone").fill("+84 912 345 678");
  await form.locator("#quote-quantity").fill("1 x 20ft");
  const message = form.locator("#quote-message");
  await expect(message).toHaveValue(/ROS-503 · Cơm dừa sấy khô hạt béo/);
  await expect(message).toHaveValue(/1 x 20ft/);
  await message.fill(`${await message.inputValue()}\nCần mẫu trước.`);
  const popup = context.waitForEvent("page");
  await form.getByRole("button", { name: "Gửi qua WhatsApp" }).click();
  const whatsapp = await popup;
  const url = new URL(whatsapp.url());
  expect(url.hostname).toMatch(/wa\.me|whatsapp\.com/);
  expect(url.searchParams.get("text")).toContain("Cần mẫu trước.");
  expect(url.searchParams.get("text")).toContain("ROS-503");
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

test("Favicon is round and served at 48 px multiples for Google", async ({ page, request }) => {
  await page.goto("/");
  const icons = await page.locator('link[rel="icon"]').evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(icons.some((href) => href.startsWith("/favicon-48.png"))).toBeTruthy();
  const svg = await (await request.get("/favicon.svg")).text();
  expect(svg).toContain("<circle");
});

test("WCAG AA: home, Quick View, group page, product page and policy in light and dark", async ({ page }) => {
  test.setTimeout(120_000);
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
    await page.locator(".gcard").first().getByRole("button", { name: "Xem nhanh" }).click();
    await scan(`${theme} quick view`);
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Thông tin & quyền riêng tư", exact: true }).click();
    await scan(`${theme} policy`);
    await page.keyboard.press("Escape");
    await page.goto("/san-pham/que");
    await scan(`${theme} group`);
    await page.goto("/san-pham/que/que-dieu");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await scan(`${theme} product`);
  }
});
