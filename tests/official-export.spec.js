import { expect, test } from "@playwright/test";

test.describe("official export catalogue", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#export-catalog")).toBeVisible();
  });

  test("places all eight export categories on the official root and opens a detailed product view", async ({ page }) => {
    const cards = page.locator(".official-export-card");
    await expect(cards).toHaveCount(8);

    const starAnise = page.getByRole("button", { name: "Xem quy cách: Hoa hồi" });
    await starAnise.scrollIntoViewIfNeeded();
    await starAnise.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Hoa hồi" })).toBeVisible();
    await expect(dialog).toContainText("Độ ẩm tham chiếu");
    await expect.poll(() => dialog.locator("img").evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);

    await dialog.getByRole("button", { name: "Yêu cầu quy cách" }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.locator("#contact select").first()).toHaveValue("Hoa hồi");
  });

  test("makes every requested language available on the official header and localises the export surface", async ({ page }) => {
    const picker = page.locator(".header-language select");
    await expect(picker.locator("option")).toHaveCount(8);

    await picker.selectOption("en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("#official-export-title")).toContainText("trade-ready specifications");
    await expect(page.locator(".official-export-card h3").first()).toHaveText("Cashew kernels");
    await expect(page.locator(".official-export-catalog__notice")).toContainText("Final specifications are confirmed");
  });

  test("keeps the category grid and Arabic mobile menu within the viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Mở menu" }).click();
    await page.locator(".mobile-language select").selectOption("ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await page.locator(".mobile-menu button").click();
    await page.locator("#export-catalog").scrollIntoViewIfNeeded();
    await expect(page.locator(".official-export-card").first()).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 1);
  });
});
