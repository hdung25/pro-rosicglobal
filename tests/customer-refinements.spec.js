import { test, expect } from "@playwright/test";
import { EXPORT_CATEGORIES } from "../src/export-catalog.js";
import { PRODUCTS } from "../src/data.js";
import { DEFAULT_PRODUCTS, GROUPS } from "../src/catalog-v6.js";
import { categoryIconKey } from "../src/category-icons.js";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("rosic-language", "vi"));
  await page.route("**/api/content", route => route.fulfill({ json: { ok: true, data: null } }));
});

test("product menu lists every group, stays open while scrolling and closes on selection, outside click and Escape", async ({ page }) => {
  await page.goto("/");
  const trigger = page.locator(".products-menu-trigger");
  const panel = page.locator("#product-menu");
  await trigger.click();
  await expect(panel).toBeVisible();
  await expect(panel.locator(".mega-menu__grid a")).toHaveCount(GROUPS.length);
  for (const [index, group] of GROUPS.entries()) {
    if (!(await panel.isVisible())) await trigger.click();
    await panel.locator(".mega-menu__grid a").nth(index).click();
    await expect(panel).toBeHidden();
    await expect(page).toHaveURL(new RegExp(`/san-pham/${group.slug}$`));
    const expected = DEFAULT_PRODUCTS.filter(item => item.category === group.id).length;
    await expect(page.locator(".group-products .pcard")).toHaveCount(expected);
  }
  await trigger.click();
  await page.mouse.wheel(0, 300);
  await expect(panel).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.locator("main").click({ position: { x: 5, y: 400 } });
  await expect(panel).toBeHidden();
});

test("a category added in Admin renders in menu, chips and its own page, keeping its product code", async ({ page }) => {
  const newCategory = { ...EXPORT_CATEGORIES[0], id: "tea-review", shortTitle: "Trà mới", title: "Trà mới", icon: "coffee" };
  await page.route("**/api/content", route => route.fulfill({ json: { ok: true, data: { categories: [...EXPORT_CATEGORIES, newCategory], products: [{ ...PRODUCTS[0], id: "tea-product", title: "Trà mới nguyên lá", category: "tea-review", code: "TEA-2026", status: "published" }] } } }));
  await page.goto("/");
  await page.locator(".products-menu-trigger").click();
  await expect(page.locator(".mega-menu__grid a")).toHaveCount(10);
  await page.locator(".mega-menu__grid a").last().click();
  await expect(page).toHaveURL(/\/san-pham\/tea-review$/);
  await expect(page.locator(".group-products .pcard__meta")).toContainText("TEA-2026");
  await page.goto("/#products");
  await expect(page.locator(".v6-finder .chip")).toHaveCount(11);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".menu-toggle").click();
  await expect(page.locator(".mobile-category-menu a")).toHaveCount(10);
  await page.locator(".mobile-category-menu a").last().click();
  await expect(page.locator(".mobile-menu")).toHaveCount(0);
  await expect(page.locator(".group-products .pcard__meta")).toContainText("TEA-2026");
});

test("mobile footer language is compact, ROSIC labels fit, hero is upright and menus are unboxed", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".hero-copy .eyebrow-line")).toHaveCount(0);
  expect(await page.locator(".title-accent").evaluate(node => getComputedStyle(node).fontStyle)).toBe("normal");
  await expect(page.locator(".nav-right a").last()).toHaveCSS("border-top-width", "0px");
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
