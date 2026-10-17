import { expect, test } from "@playwright/test";

test("theme preference is accessible, persists, and uses the site token", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  const control = page.locator(".topbar .theme-switch");
  const before = await page.locator("html").getAttribute("data-theme");
  expect(["light", "dark"]).toContain(before);
  await expect(control.getByRole("button", { name: before === "dark" ? "Tối" : "Sáng" })).toHaveAttribute("aria-pressed", "true");

  const after = before === "dark" ? "light" : "dark";
  await control.getByRole("button", { name: after === "dark" ? "Tối" : "Sáng" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", after);
  await expect(control.getByRole("button", { name: after === "dark" ? "Tối" : "Sáng" })).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("rosic-theme"))).toBe(after);

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", after);
});

test("Arabic mobile form, menu utilities, and watermarked group images fit the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: "Mở menu", exact: true }).click();
  await page.locator(".mobile-language select").selectOption("ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator(".mobile-menu .theme-switch").getByRole("button", { name: "داكن" })).toBeVisible();
  await page.locator(".mobile-menu .icon-button").click();

  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.locator("#quote-message")).toBeVisible();
  await expect.poll(() => page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }))).toMatchObject({ scroll: 390, client: 390 });

  await page.locator("#export-catalog").scrollIntoViewIfNeeded();
  await expect(page.locator(".gcard .product-image-brand")).toHaveCount(9);
  await page.locator(".gcard").first().getByRole("button").click();
  await expect(page.getByRole("dialog").locator(".product-image-brand").first()).toBeVisible();
});
