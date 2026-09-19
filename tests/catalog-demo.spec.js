import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("catalogue demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?demo=catalog");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("opens a larger product detail from a category card and reaches the specification panel", async ({ page }) => {
    const card = page.getByRole("button", { name: "Xem quy cách: Hạt điều nhân" });
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();
    await card.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Hạt điều nhân" })).toBeVisible();
    await expect.poll(() => dialog.locator("img").evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
    await dialog.getByRole("button", { name: "Xem quy cách" }).click();

    await expect(dialog).toHaveCount(0);
    await expect(page.locator("#catalog-specifications")).toBeInViewport();
    await expect(page.getByRole("tab", { name: "Hạt điều nhân" })).toHaveAttribute("aria-selected", "true");
  });

  test("changes the demo language and keeps the layout within a narrow viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/?demo=catalog");
    await page.getByRole("button", { name: "Mở menu" }).click();
    await page.locator(".catalog-mobile-menu").getByLabel("Chọn ngôn ngữ").selectOption("en");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Vietnamese agriculture");

    await page.locator("#catalog-categories").scrollIntoViewIfNeeded();
    await expect(page.locator(".catalog-category-card").first()).toBeVisible();
    const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 1);
  });

  test("has no automatic WCAG A or AA violations on the catalogue landing view", async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("keeps the close control available while a long mobile product detail scrolls", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/?demo=catalog");
    const card = page.getByRole("button", { name: "Xem quy cách: Hoa hồi" });
    await card.scrollIntoViewIfNeeded();
    await card.click();

    const dialog = page.getByRole("dialog");
    await dialog.locator(".catalog-detail-scroll").evaluate((element) => { element.scrollTop = element.scrollHeight; });
    const close = dialog.getByRole("button", { name: "Đóng chi tiết sản phẩm" });
    await expect(close).toBeVisible();
    const box = await close.boundingBox();
    expect(box?.y).toBeGreaterThanOrEqual(0);
    expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(844);
  });

  test("localises category summaries and uses local flag assets for every offered language", async ({ page }) => {
    const picker = page.locator(".catalog-header .language-picker select").first();
    const firstSummary = page.locator(".catalog-category-card").first().locator(".catalog-category-content p");

    for (const language of ["en", "zh", "ko", "ja", "ar", "fr", "de"]) {
      await picker.selectOption(language);
      await expect(page.locator("html")).toHaveAttribute("lang", language);
      await expect(firstSummary).not.toContainText("Điều nhân theo grade");
    }

    await expect(page.locator(".catalog-header .language-picker-flag").first()).toHaveAttribute("src", /\/flags\/de\.svg$/);
  });
});
