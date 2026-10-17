import { test, expect } from "@playwright/test";
import { EXPORT_CATEGORIES } from "../src/export-catalog.js";
import { PRODUCTS } from "../src/data.js";
import { categoryIconKey } from "../src/category-icons.js";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("rosic-language", "vi"));
  await page.route("**/api/content", route => route.fulfill({ json: { ok: true, data: null } }));
});

test("product menu filters the selected family and closes on selection, outside click, Escape and scrolling", async ({ page }) => {
  await page.goto("/");
  const trigger = page.locator(".products-menu-trigger");
  const panel = page.locator("#product-menu");
  await trigger.click();
  await expect(panel).toBeVisible();
  const columns = await panel.evaluate(node => getComputedStyle(node).gridTemplateColumns.split(" ").length);
  expect(columns).toBe(5);
  const categoryIds = EXPORT_CATEGORIES.map(item => item.id);
  for (const id of categoryIds) {
    await page.locator(".floating-back-top").click();
    await trigger.click();
    await panel.locator("a").nth(categoryIds.indexOf(id) + 1).click();
    await expect(panel).toBeHidden();
    await expect(page.locator(".catalog-section .category-tabs button[aria-pressed=true]")).toHaveCount(1);
    await expect(page.locator(".catalog-section .product-card").first()).toBeVisible();
    if (id === "cashew-kernel") {
      await expect(page.locator(".catalog-section .product-card h3")).toHaveCount(9);
      await page.locator(".catalog-section .product-open").first().click();
      await expect(page.locator(".catalog-spec-groups")).toContainText("Hạt điều 10 xanh · nguyên");
      await page.keyboard.press("Escape");
    }
  }
  await page.locator(".floating-back-top").click();
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.locator("h1").click();
  await expect(panel).toBeHidden();
  await trigger.click();
  await page.mouse.wheel(0, 300);
  await expect(panel).toBeHidden();
});

test("ten CMS categories render automatically, product code is preserved, and mobile navigation selects the correct family", async ({ page }) => {
  const newCategory = { ...EXPORT_CATEGORIES[0], id: "tea-review", shortTitle: "Trà mới", title: "Trà mới", icon: "coffee" };
  await page.route("**/api/content", route => route.fulfill({ json: { ok: true, data: { categories: [...EXPORT_CATEGORIES, newCategory], products: [{ ...PRODUCTS[0], id: "tea-product", title: "Trà mới nguyên lá", category: "tea-review", code: "TEA-2026", status: "published" }] } } }));
  await page.goto("/");
  await page.locator(".products-menu-trigger").click();
  await expect(page.locator("#product-menu a")).toHaveCount(11);
  await page.locator("#product-menu a").last().click();
  await expect(page.locator(".catalog-section .product-meta")).toContainText("TEA-2026");
  await expect(page.locator(".official-export-card")).toHaveCount(10);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".menu-toggle").click();
  await expect(page.locator(".mobile-category-menu a")).toHaveCount(10);
  await page.locator(".mobile-category-menu a").last().click();
  await expect(page.locator(".mobile-menu")).toHaveCount(0);
  await expect(page.locator(".catalog-section .product-meta")).toContainText("TEA-2026");
});

test("mobile footer language is compact, ROSIC labels fit, hero is upright and menus are unboxed", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".hero-copy .eyebrow-line")).toHaveCount(0);
  expect(await page.locator(".title-accent").evaluate(node => getComputedStyle(node).fontStyle)).toBe("normal");
  expect(await page.locator(".nav-contact").evaluate(node => getComputedStyle(node).borderTopWidth)).toBe("0px");
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.locator(".site-footer").scrollIntoViewIfNeeded();
    const box = await page.locator(".footer-language").boundingBox();
    expect(box.width).toBeLessThan(110);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const labels = await page.locator(".rosic-word").evaluateAll(nodes => nodes.map(node => node.scrollWidth <= node.clientWidth));
    expect(labels.every(Boolean)).toBe(true);
    await page.screenshot({ path: `artifacts/customer-revision/footer-${width}.png` });
  }
});

test("automatic icons classify content and respect the CMS override", () => {
  expect(categoryIconKey({ title: "Trái cây tươi" })).toBe("apple");
  expect(categoryIconKey({ title: "Rau củ theo mùa" })).toBe("carrot");
  expect(categoryIconKey({ title: "Nông sản chế biến" })).toBe("processed");
  expect(categoryIconKey({ id: "cashew-kernel", icon: "coffee" })).toBe("coffee");
  expect(categoryIconKey({ title: "Một nhóm mới" })).toBe("package");
});

test("CMS server read failure blocks editing without changing a saved draft", async ({ page }) => {
  await page.route("**/api/admin-auth", route => route.fulfill({ json: { authenticated: true } }));
  await page.route("**/api/content", route => route.fulfill({ status: 503, json: { ok: false } }));
  await page.addInitScript(() => localStorage.setItem("rosic-cms-draft-v1", JSON.stringify({ sentinel: "keep-my-draft" })));
  await page.goto("/admin/");
  await expect(page.getByRole("alert")).toContainText("Chưa tải được nội dung");
  await expect(page.getByRole("button", { name: "Xuất bản", exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("rosic-cms-draft-v1")).sentinel)).toBe("keep-my-draft");
});
