# VR5 — Cập nhật kênh chính thức ngày 16/10/2026

Đã tiếp nhận thông tin khách gửi lúc 21:51–21:55 và cập nhật chân trang, trang Liên hệ, cấu hình Admin.

| Kênh | Giá trị |
|---|---|
| Facebook | https://www.facebook.com/share/1Dq8KnnGEK/ |
| WhatsApp Business | https://wa.me/message/CYXCER7RBB6SJ1 |
| WeChat, giải mã từ QR khách gửi | https://u.wechat.com/kGlbznJOnP2UQ2A5cKAgU4U |
| TikTok | Để trống; hiển thị “Đang cập nhật kênh chính thức” |

Hai ảnh QR gốc được giữ nguyên trong `public/images/social/`. Thẻ hiển thị vùng mã vuông có khoảng trắng; bấm mã để xem toàn bộ ảnh gốc. Giải mã bằng zxing-cpp cả ảnh gốc và bốn ảnh chụp thẻ ở 1440px/390px đều cho đúng đích. Kết quả và SHA-256: `artifacts/vr5/social-qr-verification.json`.

Trang chính thức WhatsApp Business trả về tên Hong Tam Rosic Global Jsc và đích số 84962284872. Nút báo giá dùng số đã đối chiếu này để đính kèm nội dung/mã sản phẩm. Link mạng xã hội và QR vẫn giữ short link khách cung cấp. Nếu Admin đổi sang short link khác chưa xác định số, site mở chính link mới và hướng dẫn sao chép nội dung, không chuyển ngầm về số cũ.

Admin → Cài đặt: sửa từng link và QR chính thức; TikTok đã có sẵn ô. Thay link sẽ bỏ QR cũ của kênh để tránh quét nhầm người nhận, sau đó tự tạo QR theo link mới nếu chưa nhập ảnh riêng. Xem trước desktop/mobile và xuất bản để lưu thay đổi. Cấu hình CMS phiên bản 2 được cập nhật khi đọc; bản 3 tôn trọng cả giá trị tùy chỉnh và ô chủ động để trống.

Kiểm chứng bổ sung: 3 bài UI cập nhật mạng xã hội, 8 bài VR5, 5 bài hồi quy Admin/liên hệ/WCAG đều đạt; 5 bài Node kiểm migration/quote/editor đạt; lint và build đạt. Bộ UI Admin dùng API mô phỏng. Chưa gửi tin nhắn thật và chưa có bằng chứng bên công ty nhận tin; các mục này vẫn chờ nghiệm thu hai phía.

QR liên hệ giữ PNG nguyên bản, không áp pipeline ảnh sản phẩm WebP/watermark để giữ mã khách đã cấp.

## Kiểm chứng trên staging thật

- Bản cập nhật: https://pro-rosicglobal-dd2td8npa-ha-huy-dungs-projects.vercel.app — deployment `dpl_CxZG7k7ixgtGn94BeBUfvHNYj2yp`, READY, có bảo vệ đăng nhập Vercel.
- Smoke không mock API: CMS 200 với 16 bản ghi gốc; link Facebook/WhatsApp/WeChat, hai QR và trạng thái chờ TikTok đúng ở cả footer và Liên hệ tại 390/1440px. Mở được hộp QR nguyên bản.
- Báo giá ROS-024 có đúng mã và đích WhatsApp đã đối chiếu. Không gửi tin nhắn; không xuất bản dữ liệu CMS. PUT chưa đăng nhập bị từ chối 401. Không có lỗi JavaScript trong luồng kiểm.
- Ảnh chứng minh: `artifacts/vr5/staging-social-qr-390.png`, `staging-social-qr-1440.png`, `preview-quote-mobile.png`; báo cáo `preview-smoke.json`.
- Tên miền rosicglobal.com vẫn HTTP 200 với bundle `/assets/index-DB3mrlL0.js`. Chưa đưa bản VR5 lên tên miền chính.
