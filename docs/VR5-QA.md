# VR5 — Kết quả kiểm chứng

Ngày 16/10/2026, múi giờ Asia/Bangkok.

## Kiểm tra local

| Bộ kiểm tra | Kết quả |
|---|---|
| Toàn bộ Playwright ban đầu, 95 kịch bản | 89 đạt; 6 lỗi được điều tra. 4 lỗi do kỳ vọng một sản phẩm điều/luồng cũ, 1 lỗi ảnh tràn chặn CTA thật, 1 lỗi tương phản logo mobile. |
| Chạy lại đúng 6 bài lỗi sau sửa | 6/6 đạt; giữ kiểm tra WCAG AA và thao tác click thật, không force click hoặc bỏ kiểm tra. |
| Sau bổ sung xử lý dữ liệu CMS cũ | 18/18 bài liên quan đạt, gồm 2 bài mới: bảo toàn ảnh riêng của khách và không khôi phục sản phẩm đã xóa trong VR5. Tổng 97 kịch bản UI đã được kiểm qua các lượt; đây không phải một lượt chạy toàn bộ 97 bài cùng lúc. |
| Node: báo giá, xác thực, xử lý ảnh, kiểm mã, migration, editor | 18/18 đạt. |
| ESLint | Đạt. |
| Vite build local và Vercel | Đạt; còn cảnh báo bundle chính trên 500KB và cơ sở dữ liệu Browserslist cũ. Không có cam kết Lighthouse mới. |
| Video hướng dẫn | WebM 28,84 giây, 1440×1000, mở được bằng trình duyệt; API đăng nhập/xuất bản trong video là mô phỏng. |

Các độ rộng đã kiểm trong bộ bài: 320, 360, 390, 768, 1280, 1440, 1920, 2560px; 8 ngôn ngữ, light/dark, điều hướng và đóng hộp bằng bàn phím, copy/download yêu cầu, preview desktop/mobile và ảnh WebP dưới 150KB.

## Hosting thật

- Preview thường: `pro-rosicglobal-3b75cbsi3-ha-huy-dungs-projects.vercel.app`. Preview không được cấp biến CMS riêng nên API CMS trả 503. Không dùng preview này làm bằng chứng CMS hoạt động.
- Staging dùng cấu hình production, tạo bằng `vercel deploy --prod --skip-domain --yes`: [mở staging](https://pro-rosicglobal-fdgf6u746-ha-huy-dungs-projects.vercel.app).
- Deployment: `dpl_FdksvTcD3DuoKW6nanNQ7DgbZAAv`, trạng thái READY. Alias duy nhất được CLI inspect liệt kê là hostname dự án `pro-rosicglobal-ha-huy-dungs-projects.vercel.app`; không có tên miền rosicglobal.com trong alias của bản này.
- Kiểm độc lập tên miền chính: HTTP 200 và vẫn dùng `/assets/index-DB3mrlL0.js`; staging VR5 dùng `/assets/index-CfjRea6G.js`. Chưa promote VR5 lên tên miền chính.
- Smoke staging dùng quyền truy cập Vercel hiện có, không mock API: đọc CMS 200, 16 bản ghi sản phẩm gốc, endpoint phiên Admin 200, PUT xuất bản không có cookie Admin bị từ chối 401. Không gửi PUT hợp lệ, không xuất bản lại dữ liệu đang lưu.
- Từ sản phẩm Arabica rang ROS-024 đến form và nội dung WhatsApp đúng mã trên điện thoại. Không bấm Gửi trong WhatsApp, không khẳng định công ty đã nhận tin.
- Favicon, ảnh xoài mới, trang duyệt logo/watermark, hướng dẫn CMS đều HTTP 200. Ảnh xoài 960px 53.546 byte. Không có lỗi JavaScript trong luồng smoke.
- Bằng chứng: `artifacts/vr5/preview-smoke.json`, `preview-quote-mobile.png`, `preview-admin-login.png`. Không đưa cookie, OIDC token, file môi trường hay trace có thông tin xác thực vào gói bàn giao.

## Còn chờ nghiệm thu

Đã cập nhật Facebook, WhatsApp Business và WeChat theo thông tin khách gửi 16/10; hai QR chính thức giải mã đúng cả ảnh gốc và ảnh chụp desktop/mobile. TikTok để chờ, sửa được trong Admin. Xem `VR5-SOCIAL-UPDATE.md`.

Còn thực gửi/nhận từ máy tính và điện thoại với xác nhận bên nhận; duyệt logo/watermark/ảnh; xác nhận grade và ảnh thực từng biến thể; kiểm thao tác Admin có xác thực trên server; đối chiếu màn hình 01/04; buổi bàn giao. Xem đầy đủ từng dòng tại `VR5-CHECKLIST.md`.


## Phát hành chính thức sau phản hồi footer và ảnh lặp

Ngày 16/10/2026 đã đưa dpl_5zsVcqjnUNAnnwLX1KnmucjLibxY lên cả rosicglobal.com/www.rosicglobal.com. Thông tin “chưa promote” phía trên là lịch sử kiểm staging. Footer dùng link và nút mở QR; danh sách biến thể dùng một ảnh chung và giữ từng SKU riêng. 14 bài UI liên quan đạt qua hai lượt; lint/build đạt. Smoke trực tiếp tên miền thật đạt CMS, QR, báo giá, 9 mã điều / 1 ảnh, không pageerror. Xem production-smoke.json và production-layout.json trong artifacts/vr5. Không xuất bản lại dữ liệu CMS và chưa kiểm gửi/nhận tin nhắn hai phía.


## Mobile/PWA — kết quả mới nhất

Đã rà đủ 7 nhóm và làm sâu 4 nhóm theo VR5-MOBILE-REVIEW.md. Bộ cuối mobile/responsive/theme/footer/WCAG 32/32; quét 160/160 bố cục; PWA/VR5 10/10; kiểm bổ sung select/RTL Chrome 3/3 và WebKit trên website thật 4/4. Đã sửa lỗi native select tràn trên WebKit 320px; không ép click hoặc bỏ kiểm. Deployment cuối dpl_9PB76T3vScHLhqiWC6iVFzTmrZWi, cả apex/www dùng index-CYZptioB.js. PWA thật qua thử offline/reconnect; chưa cài native lên điện thoại vật lý. Còn các mục nghiệm thu ngoài website trong checklist.
