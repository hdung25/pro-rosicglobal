import { test, expect } from "@playwright/test";
import path from "node:path";
import { Buffer } from "node:buffer";
import { prepareImage, imageFilename } from "../lib/product-image.js";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("rosic-language", "vi"));
  await page.route("**/api/media", async route => {
    const body = route.request().postDataJSON();
    const { output, ...metadata } = await prepareImage(Buffer.from(body.src.split(",")[1], "base64"), body.preset);
    await route.fulfill({ status: 201, json: { ...metadata, name: imageFilename(body.name), src: `data:image/webp;base64,${output.toString("base64")}` } });
  });
  let published = null;
  await page.route("**/api/content", async route => {
    if (route.request().method() === "PUT") published = { ...route.request().postDataJSON(), publishedAt: new Date().toISOString() };
    await route.fulfill({ json: { ok: true, data: published, publishedAt: published?.publishedAt } });
  });
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
  await expect(page.frameLocator("iframe").locator(".maintenance-page")).toBeVisible();
  await page.getByRole("button", { name: "Tắt Coming Soon" }).click();

  await page.getByRole("button", { name: "Nội dung trang", exact: true }).click();
  await page.getByLabel("Tiêu đề chính").fill("Nội dung cập nhật trực quan");
  await expect(page.frameLocator("iframe").locator("h1")).toContainText("Nội dung cập nhật trực quan");
  await page.getByRole("button", { name: "Xuất bản" }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("rosic-cms-published-v1"))?.content.heroStart)).toBe("Nội dung cập nhật trực quan");
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

test("shows official social links and keeps TikTok pending", async ({ page }) => {
  await page.goto("/admin/");
  await page.getByLabel("Tên đăng nhập").fill("adminrosic");
  await page.getByLabel("Mật khẩu").fill("hongtamrosicglobal79");
  await page.getByRole("button", { name: "Đăng nhập Admin" }).click();
  await page.getByRole("button", { name: "Cài đặt", exact: true }).click();

  await expect(page.getByLabel("WhatsApp · Kênh chính", { exact: true })).toHaveValue("https://wa.me/message/CYXCER7RBB6SJ1");
  await expect(page.getByLabel("Email doanh nghiệp", { exact: true })).toHaveValue("mailto:info@rosicglobal.com");
  await expect(page.getByLabel("LinkedIn · Founder & CEO", { exact: true })).toHaveValue("https://www.linkedin.com/in/clairehong-hongtamrosicglobal/");
  await expect(page.getByLabel("Zalo · Hotline", { exact: true })).toHaveValue("https://zalo.me/84962284872");
  await expect(page.getByLabel("Facebook", { exact: true })).toHaveValue("https://www.facebook.com/share/1Dq8KnnGEK/");
  await expect(page.getByLabel("WeChat", { exact: true })).toHaveValue("https://u.wechat.com/kGlbznJOnP2UQ2A5cKAgU4U");
  await expect(page.getByLabel("TikTok", { exact: true })).toHaveValue("");
});

test("dynamic categories add, reorder, protect assigned products and delete", async ({ page }) => {
  await page.route("**/api/admin-auth", route => route.fulfill({ json: { authenticated: true } }));
  await page.goto("/admin/");
  await page.getByRole("button", { name: "Danh mục", exact: true }).click();
  await page.getByRole("button", { name: "Thêm danh mục", exact: true }).click();
  await page.getByLabel("Tên danh mục", { exact: true }).fill("Hạt mới VR4");
  await page.getByLabel("Tiêu đề đầy đủ", { exact: true }).fill("Hạt mới VR4");
  await expect(page.locator('.admin-category-list button')).toHaveCount(10);
  await page.getByRole("button", { name: "Đưa lên trước" }).click();
  await expect(page.locator('.admin-category-list button').nth(8)).toContainText("Hạt mới VR4");
  const preview = page.frameLocator('iframe');
  await expect(preview.locator('.gcard')).toHaveCount(10);
  await expect(preview.locator('.gcard').nth(8)).toContainText("Hạt mới VR4");
  await preview.locator('.topbar-language select').selectOption('en');
  await expect(preview.locator('.gcard').nth(8)).toContainText("Hạt mới VR4");
  await preview.locator('.topbar-language select').selectOption('vi');
  await page.getByRole("button", { name: "Sản phẩm", exact: true }).click();
  await page.getByRole("button", { name: "Thêm sản phẩm", exact: true }).click();
  await page.getByRole("combobox", { name: "Nhóm sản phẩm", exact: true }).selectOption({ label: "Hạt mới VR4" });
  await page.getByRole("button", { name: "Danh mục", exact: true }).click();
  await page.locator('.admin-category-list button').filter({ hasText: "Hạt mới VR4" }).click();
  await page.getByTitle("Xóa danh mục", { exact: true }).click();
  await expect(page.getByRole("status")).toContainText("chuyển sản phẩm");
  await page.getByRole("button", { name: "Sản phẩm", exact: true }).click();
  await page.getByRole("combobox", { name: "Nhóm sản phẩm", exact: true }).selectOption({ index: 0 });
  await page.getByRole("button", { name: "Danh mục", exact: true }).click();
  page.once('dialog', dialog => dialog.accept());
  await page.getByTitle("Xóa danh mục", { exact: true }).click();
  await expect(page.locator('.admin-category-list button')).toHaveCount(9);
  await expect(preview.locator('.gcard')).toHaveCount(9);
});

test("admin waits for saved server data before allowing new edits", async ({ page }) => {
  await page.route("**/api/admin-auth", route => route.fulfill({ json: { authenticated: true } }));
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  await page.route("**/api/content", async route => { await gate; await route.fulfill({ json: { ok: true, data: null } }); });
  await page.goto('/admin/');
  await expect(page.getByRole('button', { name: 'Sản phẩm', exact: true })).toHaveCount(0);
  release();
  await page.getByRole('button', { name: 'Sản phẩm', exact: true }).click();
  await page.getByRole('button', { name: 'Thêm sản phẩm', exact: true }).click();
  await expect(page.locator('.product-editor-form')).toBeVisible();
});
