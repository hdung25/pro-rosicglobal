import { test, expect } from "@playwright/test";
import path from "node:path";

test.beforeEach(async ({ page }) => {
  let authenticated = false;
  await page.route("**/api/admin-auth", async (route) => {
    const request = route.request();
    if (request.method() === "GET") {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ authenticated }) });
      return;
    }
    const body = request.postDataJSON();
    if (body.action === "logout") {
      authenticated = false;
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ authenticated: false }) });
      return;
    }
    authenticated = body.username === "adminrosic" && body.password === "hongtamrosicglobal79";
    await route.fulfill({ status: authenticated ? 200 : 401, contentType: "application/json", body: JSON.stringify(authenticated ? { authenticated: true } : { message: "Tên đăng nhập hoặc mật khẩu không đúng." }) });
  });
});

test("login, edit content, toggle coming soon and publish", async ({ page }) => {
  await page.goto("/admin/");
  await page.getByLabel("Tên đăng nhập").fill("adminrosic");
  await page.getByLabel("Mật khẩu").fill("wrong");
  await page.getByRole("button", { name: "Đăng nhập Admin" }).click();
  await expect(page.getByRole("alert")).toContainText("không đúng");

  await page.getByLabel("Mật khẩu").fill("hongtamrosicglobal79");
  await page.getByRole("button", { name: "Đăng nhập Admin" }).click();
  await expect(page.getByText("Website đang ở trong tầm tay bạn.")).toBeVisible();

  await page.getByRole("button", { name: "Bật Coming Soon" }).click();
  await expect(page.getByRole("button", { name: "Tắt Coming Soon" })).toBeVisible();
  await expect(page.locator(".preview-coming-soon")).toBeVisible();
  await page.getByRole("button", { name: "Tắt Coming Soon" }).click();

  await page.getByRole("button", { name: "Nội dung trang", exact: true }).click();
  await page.getByLabel("Tiêu đề chính").fill("Nội dung cập nhật trực quan");
  await expect(page.locator(".preview-hero h1")).toContainText("Nội dung cập nhật trực quan");
  await page.getByRole("button", { name: "Xuất bản" }).click();
  const published = await page.evaluate(() => JSON.parse(localStorage.getItem("rosic-cms-published-v1")));
  expect(published.content.heroStart).toBe("Nội dung cập nhật trực quan");
  expect(published.settings.maintenanceMode).toBe(false);
});

test("uploads are cropped to locked product and category dimensions", async ({ page }) => {
  await page.goto("/admin/");
  await page.getByLabel("Tên đăng nhập").fill("adminrosic");
  await page.getByLabel("Mật khẩu").fill("hongtamrosicglobal79");
  await page.getByRole("button", { name: "Đăng nhập Admin" }).click();

  await page.getByRole("button", { name: "Sản phẩm", exact: true }).click();
  const source = path.resolve("public/images/hero.webp");
  await page.locator(".product-editor-form input[type=file]").setInputFiles(source);
  await expect(page.getByRole("status")).toContainText("1200 × 1200px");
  const productSize = await page.locator(".product-editor-form .admin-upload-preview img").evaluate((image) => [image.naturalWidth, image.naturalHeight]);
  expect(productSize).toEqual([1200, 1200]);

  await page.getByRole("button", { name: "Danh mục", exact: true }).click();
  await page.locator(".category-editor-form input[type=file]").setInputFiles(source);
  await expect(page.getByRole("status")).toContainText("800 × 800px");
  const categorySize = await page.locator(".category-editor-form .admin-upload-preview img").evaluate((image) => [image.naturalWidth, image.naturalHeight]);
  expect(categorySize).toEqual([800, 800]);
});

test("shows only the four official social configuration fields", async ({ page }) => {
  await page.goto("/admin/");
  await page.getByLabel("Tên đăng nhập").fill("adminrosic");
  await page.getByLabel("Mật khẩu").fill("hongtamrosicglobal79");
  await page.getByRole("button", { name: "Đăng nhập Admin" }).click();
  await page.getByRole("button", { name: "Cài đặt", exact: true }).click();

  await expect(page.getByLabel("WhatsApp · Kênh chính")).toHaveValue("https://wa.me/84962284872");
  await expect(page.getByLabel("Email doanh nghiệp")).toHaveValue("mailto:info@rosicglobal.com");
  await expect(page.getByLabel("LinkedIn · Founder & CEO")).toHaveValue("https://www.linkedin.com/in/clairehong-hongtamrosicglobal/");
  await expect(page.getByLabel("Zalo · Hotline")).toHaveValue("https://zalo.me/84962284872");
  await expect(page.getByText("Facebook", { exact: true })).toHaveCount(0);
  await expect(page.getByText("WeChat", { exact: true })).toHaveCount(0);
  await expect(page.getByText("LINE", { exact: true })).toHaveCount(0);
});
