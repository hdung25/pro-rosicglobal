import { test, expect } from "@playwright/test";
test("public root serves the official catalogue and keeps direct contact available", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Tinh hoa từ đất");
  await expect(page.locator("#export-catalog")).toBeVisible();
  await expect(page.locator("#contact form")).toBeVisible();
  await expect(page.locator(".footer-socials a[href='https://wa.me/84962284872']")).toBeVisible();
  await expect(page.locator("a[href='mailto:info@rosicglobal.com']").first()).toBeVisible();
  await expect(page.getByText("Copyright © HONG TAM ROSIC GLOBAL JSC. All rights reserved.")).toBeVisible();
});
