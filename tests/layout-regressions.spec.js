import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 1920, height: 970 } });

test("topbar controls stay contained and group cards are large enough to read", async ({ page }) => {
  await page.goto("/");
  const containment = await page.evaluate(() => {
    const bar = document.querySelector(".topbar").getBoundingClientRect();
    return [".topbar-language", ".topbar .theme-switch"].map((selector) => {
      const box = document.querySelector(selector).getBoundingClientRect();
      return { top: box.top >= bar.top, bottom: box.bottom <= bar.bottom, width: box.width };
    });
  });
  for (const item of containment) {
    expect(item.top).toBe(true);
    expect(item.bottom).toBe(true);
  }
  expect(containment[0].width).toBeLessThanOrEqual(96);

  await page.locator("#export-catalog").scrollIntoViewIfNeeded();
  const cardWidth = await page.locator(".gcard").first().evaluate((node) => node.getBoundingClientRect().width);
  expect(cardWidth).toBeGreaterThanOrEqual(280);
});

test("desktop Quick View keeps every product and the group link reachable within its scroll region", async ({ page }) => {
  await page.goto("/#export-catalog");
  await page.locator(".gcard", { hasText: "Quế" }).getByRole("button", { name: "Xem nhanh" }).click();
  const dialog = page.locator(".quick-view");
  await expect(dialog).toBeVisible();
  const metrics = await page.locator(".quick-view__body").evaluate((node) => ({
    overflowY: getComputedStyle(node).overflowY,
    bottom: node.getBoundingClientRect().bottom,
  }));
  expect(metrics.overflowY).toBe("auto");
  expect(metrics.bottom).toBeLessThanOrEqual(970);
  await expect(page.locator(".quick-view__open")).toBeInViewport();
  const last = page.locator(".quick-view .pcard").last();
  await last.scrollIntoViewIfNeeded();
  await expect(last).toBeInViewport();
});
