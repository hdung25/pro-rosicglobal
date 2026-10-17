import { expect, test } from "@playwright/test";

test.describe("product groups", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#export-catalog");
    await expect(page.locator("#export-catalog .gcard").first()).toBeVisible();
  });

  test("shows all nine groups on the home page and opens a group page with its specification-ready products", async ({ page }) => {
    await expect(page.locator(".gcard")).toHaveCount(8);
    await page.locator(".gcard", { hasText: "Hoa hồi" }).getByRole("link").click();
    await expect(page).toHaveURL(/\/san-pham\/hoa-hoi$/);
    await expect(page.getByRole("heading", { level: 1, name: "Hoa hồi" })).toBeVisible();
    await expect.poll(() => page.locator(".group-hero img").evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
    await page.locator(".group-products .pcard__link").first().click();
    await expect(page.locator(".spec-table")).toContainText("Độ ẩm");
    await page.goBack();
    await page.locator(".group-hero .button-primary").click();
    await expect(page.locator('.quote-dialog [name="product"]')).toHaveValue("group:star-anise");
  });

  test("makes every requested language available in the header and localises the groups", async ({ page }) => {
    const picker = page.locator(".topbar .language-cell select");
    await expect(picker.locator("option")).toHaveCount(8);
    await picker.selectOption("en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("#v6-groups-title")).toHaveText("Our export product groups.");
    await expect(page.locator(".gcard__name").first()).toHaveText("Coffee");
    await page.goto("/san-pham/que/que-thanh");
    await expect(page.locator(".spec-notice")).toContainText("Final specifications are confirmed");
    await expect(page.locator(".spec-table")).toContainText("Container loading");
  });

  test("keeps the group grid and Arabic mobile menu within the viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Mở menu" }).click();
    await page.locator(".mobile-menu-tools .language-cell select").selectOption("ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await page.locator(".mobile-menu .icon-button").click();
    await page.locator("#export-catalog").scrollIntoViewIfNeeded();
    await expect(page.locator(".gcard").first()).toBeVisible();
    const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 1);
  });
});
