import { expect, test } from "@playwright/test";

test("theme preference is accessible, persists, and uses the site token", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  const toggle = page.locator(".header-theme");
  const before = await page.locator("html").getAttribute("data-theme");
  expect(["light", "dark"]).toContain(before);
  await expect(toggle).toHaveAttribute("aria-checked", before === "dark" ? "true" : "false");

  await toggle.click();
  const after = before === "dark" ? "light" : "dark";
  await expect(page.locator("html")).toHaveAttribute("data-theme", after);
  await expect(toggle).toHaveAttribute("aria-checked", after === "dark" ? "true" : "false");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("rosic-theme"))).toBe(after);

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", after);
});

test("Arabic mobile form, menu utilities, and branded export images fit the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: "Mở menu", exact: true }).click();
  await page.locator(".mobile-language select").selectOption("ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("switch", { name: /الوضع/ })).toBeVisible();
  await page.locator(".mobile-menu .icon-button").click();

  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.locator(".form-consent .checkbox-label")).toBeVisible();
  await expect.poll(() => page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }))).toMatchObject({ scroll: 390, client: 390 });

  await page.locator("#export-catalog").scrollIntoViewIfNeeded();
  await expect(page.locator(".official-export-card .product-image-brand")).toHaveCount(8);
  await page.locator(".official-export-card").first().getByRole("button").click();
  await expect(page.getByRole("dialog").locator(".product-image-brand")).toBeVisible();
});
