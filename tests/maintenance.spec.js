import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("public root stays in a contactable maintenance state", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Our website is being upgraded");
  await expect(page.locator(".maintenance-actions a[href='https://wa.me/84962284872']")).toBeVisible();
  await expect(page.locator(".maintenance-actions a[href='mailto:info@rosicglobal.com']")).toBeVisible();
  await expect(page.getByText("Copyright © HONG TAM ROSIC GLOBAL JSC. All rights reserved.")).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
