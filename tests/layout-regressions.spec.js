import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 1920, height: 970 } });

test("topbar controls stay contained and category thumbnails are larger", async ({ page }) => {
  await page.goto("/");
  const containment = await page.evaluate(() => {
    const bar = document.querySelector(".topbar").getBoundingClientRect();
    const picker = document.querySelector(".topbar-language").getBoundingClientRect();
    return { barTop: bar.top, barBottom: bar.bottom, pickerTop: picker.top, pickerBottom: picker.bottom, width: picker.width };
  });
  expect(containment.pickerTop).toBeGreaterThanOrEqual(containment.barTop);
  expect(containment.pickerBottom).toBeLessThanOrEqual(containment.barBottom);
  expect(containment.width).toBeLessThanOrEqual(96);

  await page.locator("#export-catalog").scrollIntoViewIfNeeded();
  const thumbnailWidth = await page.locator(".official-export-thumbnail__image").first().evaluate((node) => node.getBoundingClientRect().width);
  expect(thumbnailWidth).toBeGreaterThanOrEqual(120);
});

test("desktop category popup presents all information without an inner scrollbar", async ({ page }) => {
  await page.goto("/");
  await page.locator("#export-catalog").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /Hoa hồi/ }).first().click();
  await expect(page.locator(".official-export-dialog__content")).toBeVisible();
  const metrics = await page.locator(".official-export-dialog__scroll").evaluate((node) => ({
    clientHeight: node.clientHeight,
    scrollHeight: node.scrollHeight,
    overflowY: getComputedStyle(node).overflowY,
    bottom: node.getBoundingClientRect().bottom,
  }));
  expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.clientHeight + 1);
  expect(metrics.overflowY).toBe("hidden");
  expect(metrics.bottom).toBeLessThanOrEqual(970);
  await expect(page.locator(".official-export-dialog__action")).toBeInViewport();
});
