import { expect, test } from "@playwright/test";

test("Korean uses reviewed public copy and a locally served Taegukgi", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/");

  const picker = page.locator(".header-language select");
  await picker.selectOption("ko");

  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await expect(page.locator(".topbar")).toContainText("정성으로 만들고");
  await expect(page.locator("#about")).toContainText("베트남에 뿌리내리고");
  await expect(page.locator("#journey")).toContainText("모든 단계에 담은 정성");
  await page.locator("#testimonials").scrollIntoViewIfNeeded();
  await expect(page.locator("#feedback-title")).toHaveText("경청으로 더 나은 협업을 만듭니다.");
  await expect(page.getByRole("region", { name: "예시 피드백" })).toBeVisible();

  const flag = page.locator(".header-language .language-picker-flag");
  await expect(flag).toHaveAttribute("src", /\/flags\/kr\.svg$/);
  await expect.poll(() => flag.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);

  await page.locator("#blog").scrollIntoViewIfNeeded();
  await expect(page.locator("#blog")).toContainText("풍요로운 계절에서 전하는 이야기");

  await page.locator(".site-footer").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "정보 및 개인정보", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("영업팀 배정과 이메일 확인");
});

test("every supported locale supplies human-facing theme and editorial copy", async () => {
  const { SITE_UI_COPY } = await import("../src/site-copy.js");
  const languages = ["vi", "en", "zh", "ko", "ja", "ar", "fr", "de"];

  for (const language of languages) {
    const copy = SITE_UI_COPY[language];
    expect(copy.theme.switchToDark).toBeTruthy();
    expect(copy.theme.switchToLight).toBeTruthy();
    expect(copy.about.title).toHaveLength(2);
    expect(copy.journey.steps).toHaveLength(4);
    expect(Object.keys(copy.journal.articles)).toHaveLength(3);
    expect(copy.dialog.policySections).toHaveLength(3);
  }
});

test("English localizes the general catalogue, quote choices, and numeric export references", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/");
  await page.locator(".header-language select").selectOption("en");

  await expect(page.locator("#products h3").first()).toHaveText("Mango");
  await expect(page.locator("#products")).not.toContainText("Xoài chín vàng");

  const productSelect = page.locator("#contact-product");
  await expect(productSelect.locator("option").first()).toHaveText("Mixed seasonal order");
  await expect(productSelect.locator("option").filter({ hasText: "Black pepper" })).toHaveCount(2);

  await page.getByRole("button", { name: /Star anise$/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Reference figures");
  await expect(dialog).toContainText("13.5%");
  await expect(dialog).toContainText("2.5 cm");
});
