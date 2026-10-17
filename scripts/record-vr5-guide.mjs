import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

// Demo data only. Auth and publication are mocked so the guide never changes production.
const folder = path.resolve('artifacts/vr5');
fs.mkdirSync(folder, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, recordVideo: { dir: folder, size: { width: 1440, height: 1000 } }, reducedMotion: 'reduce' });
const page = await context.newPage();
await page.route('**/api/admin-auth', route => route.fulfill({ json: { authenticated: true } }));
await page.route('**/api/content', route => route.fulfill({ json: { ok: true, data: null, publishedAt: new Date().toISOString() } }));
await page.goto('http://127.0.0.1:5173/admin/');
async function caption(text) {
  await page.evaluate(text => {
    let note = document.getElementById('guide-caption');
    if (!note) { note = document.createElement('aside'); note.id = 'guide-caption'; document.body.append(note); }
    note.textContent = text;
    Object.assign(note.style, { position: 'fixed', inset: 'auto 20px 15px 20px', zIndex: 9999, background: '#193B30', color: '#F4D780', padding: '18px 24px', font: '16px/1.6 sans-serif', borderRadius: '8px', pointerEvents: 'none' });
  }, text);
  await page.waitForTimeout(2500);
}
await caption('ROSIC VR5 · Hướng dẫn CMS. Đây là bản minh họa local; đăng nhập và xuất bản dùng API mô phỏng.');
await page.getByRole('button', { name: 'Sản phẩm', exact: true }).click();
await caption('1. Sản phẩm: chọn hàng để sửa tên, mã, ảnh, nhóm, mô tả và ALT. Mỗi biến thể có một mã riêng.');
await page.getByRole('button', { name: 'Thêm sản phẩm', exact: true }).click();
await page.getByLabel('Tên sản phẩm', { exact: true }).fill('Sản phẩm hướng dẫn VR5');
await caption('2. Thêm hàng mới: giữ trạng thái Bản nháp trong lúc chuẩn bị. Nhập tên tiếng Anh trước khi tải ảnh để tên file đúng.');
await page.getByLabel('Mô tả ảnh (SEO/Accessibility)', { exact: true }).fill('Ảnh sản phẩm dùng cho video hướng dẫn CMS ROSIC');
await page.getByText('Bản dịch sản phẩm', { exact: true }).click();
await caption('3. Mở Bản dịch sản phẩm: chọn ngôn ngữ rồi nhập tên, mô tả, ALT. Để trống dùng bản mặc định.');
await page.getByRole('button', { name: 'Danh mục', exact: true }).click();
await caption('4. Danh mục: thêm nhóm, chọn icon, đổi thứ tự, chỉnh quy cách. Chuyển hết sản phẩm khỏi nhóm trước khi xóa nhóm.');
await page.getByRole('button', { name: 'Nội dung trang', exact: true }).click();
await page.getByLabel('Tiêu đề chính', { exact: true }).fill('Khởi từ Tâm · Bản nháp');
await caption('5. Nội dung trang: sửa tiêu đề và câu chuyện. Live Preview cập nhật theo bản nháp, khách công khai chưa thấy thay đổi.');
await page.getByRole('button', { name: 'Điện thoại', exact: true }).click();
await caption('6. Chọn Điện thoại để kiểm tra bản 390px; chọn Desktop để xem bản 1440px. Kiểm menu, nút và nội dung dài trước xuất bản.');
await page.getByRole('button', { name: 'Cài đặt', exact: true }).click();
await page.getByLabel('Facebook', { exact: true }).scrollIntoViewIfNeeded();
await caption('7. Liên hệ: nhập link chính thức của từng kênh. Có link thì website tự tạo QR; có thể nhập URL ảnh QR chính thức riêng.');
await page.getByRole('button', { name: 'Lưu nháp', exact: true }).click();
await caption('8. Lưu nháp chỉ giữ trên trình duyệt này. Xuất bản mới lưu lên máy chủ cho khách. Hãy xuất bản sao JSON trước các lần sửa lớn.');
await page.getByRole('button', { name: 'Xuất bản', exact: true }).click();
await caption('9. Đây là xuất bản MÔ PHỎNG. Khi làm thật, chờ thông báo thành công rồi kiểm website trong cửa sổ riêng và thử báo giá.');
const video = page.video();
await context.close();
await video.saveAs(path.join(folder, 'huong-dan-cms-vr5.webm'));
await browser.close();
console.log('Saved artifacts/vr5/huong-dan-cms-vr5.webm');
