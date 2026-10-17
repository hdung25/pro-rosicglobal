import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 1920, height: 970 } });

test("topbar controls stay contained and group cards are large enough to read", async ({ page }) => {
  await page.goto("/");
  const containment = await page.evaluate(() => {
    const bar = document.querySelector(".topbar").getBoundingClientRect();
    return [".topbar .language-cell", ".topbar .theme-cell"].map((selector) => {
      const box = document.querySelector(selector).getBoundingClientRect();
      return { top: box.top >= bar.top, bottom: box.bottom <= bar.bottom, width: box.width };
    });
  });
  for (const item of containment) {
    expect(item.top).toBe(true);
    expect(item.bottom).toBe(true);
  }
  expect(Math.abs(containment[0].width - containment[1].width)).toBeLessThan(1);

  await page.locator("#export-catalog").scrollIntoViewIfNeeded();
  // Round group images in one strip: each stays large enough to recognise.
  const mediaWidth = await page.locator(".gcard__media").first().evaluate((node) => node.getBoundingClientRect().width);
  expect(mediaWidth).toBeGreaterThanOrEqual(110);
  expect(await page.locator(".gcard__name").first().evaluate((node) => parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(13);
});

test("desktop quote dialog keeps every field and the send buttons reachable within its scroll region", async ({ page }) => {
  await page.goto("/san-pham/que/que-dieu");
  await page.locator(".product-detail__actions .button-primary").click();
  const dialog = page.locator(".quote-dialog");
  await expect(dialog).toBeVisible();
  const metrics = await page.locator(".quote-dialog__body").evaluate((node) => ({
    overflowY: getComputedStyle(node).overflowY,
    bottom: node.getBoundingClientRect().bottom,
  }));
  expect(metrics.overflowY).toBe("auto");
  expect(metrics.bottom).toBeLessThanOrEqual(970);
  const send = dialog.locator(".quote-send--whatsapp");
  await send.scrollIntoViewIfNeeded();
  await expect(send).toBeInViewport();
});
