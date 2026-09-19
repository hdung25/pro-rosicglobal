# Nhật ký triển khai chính thức

Tài liệu này ghi lại từng yêu cầu đã nhận, phạm vi thay đổi, trạng thái kiểm tra và các cấu hình bên ngoài cần có. Không ghi bí mật, dữ liệu khách hàng hay URL webhook riêng tư vào đây.

## 2026-09-19 — Bản public catalogue và trải nghiệm khách hàng

| Hạng mục | Trạng thái | Bằng chứng / ghi chú |
| --- | --- | --- |
| Danh mục xuất khẩu 8 nhóm | Hoàn tất | Có tại trang chính, thông tin viết lại và ảnh không gắn thương hiệu đối thủ. |
| Favicon, footer, logo SVG và social links | Hoàn tất | Đã kiểm tra production sau deploy. |
| Chi tiết sản phẩm khi hover/click | Hoàn tất | Mở hộp thoại có ảnh lớn, quy cách và CTA báo giá. |
| Bộ chọn 8 ngôn ngữ | Hoàn tất mã nguồn | Câu chữ B2B được biên tập lại ở 8 ngôn ngữ; cờ Hàn Quốc là Taegukgi SVG nội bộ. |
| Dark/Light Mode | Hoàn tất mã nguồn | Điều khiển có nhãn trợ năng ở header, menu mobile và footer; lưu lựa chọn trên thiết bị, theo system preference khi chưa chọn. |
| Gửi form báo giá tự động | Hoàn tất mã nguồn, chờ credentials | API Vercel + Resend + Make; chỉ xác nhận hand-off khi kênh đã chấp nhận, không giả nhận giao hàng cuối cùng. |
| Ảnh sản phẩm và nhận diện thương hiệu | Hoàn tất mã nguồn | Thay ảnh sai ngữ cảnh bằng ảnh gốc sạch, không logo; lớp nhận diện HỒNG TÂM ROSIC GLOBAL hiển thị nhẹ trên UI, không làm thay đổi quyền sở hữu ảnh nguồn. |
| Catalogue phổ thông và form đa ngôn ngữ | Hoàn tất mã nguồn | 16 sản phẩm phổ thông đổi tên, nhóm, mô tả và alt text theo ngôn ngữ; form hiển thị tên đã dịch nhưng gửi tên nguồn ổn định để không làm sai phân luồng Sales. |
| Thông số tham chiếu đa ngôn ngữ | Hoàn tất mã nguồn | Các số liệu grade, độ ẩm, tạp chất, sàng, đóng gói và hàm lượng liên quan được giữ nguyên trong 7 bản dịch, kèm nhãn địa phương và ghi chú phải xác nhận bằng hợp đồng/mẫu/COA. |

## 2026-09-19 — Lớp giao nhận báo giá trên máy chủ

| Hạng mục | Trạng thái | Bằng chứng / ghi chú |
| --- | --- | --- |
| API `POST /api/quote` | Hoàn tất mã nguồn, chờ cấu hình credentials | Kiểm tra dữ liệu server-side, CORS same-origin, giới hạn tốc độ theo instance, idempotency best-effort và phản hồi có `deliveries` theo từng kênh. |
| Make webhook | Sẵn sàng cấu hình | Payload có `requestId`, dữ liệu phân luồng và HMAC tùy chọn; Make 2xx được ghi là `sent`, không giả nhận WhatsApp/Zalo đã tới. |
| Email Resend | Sẵn sàng cấu hình | Email khách và Sales dùng sender domain đã xác minh; Resend chấp nhận mail được ghi là `queued`, không khẳng định inbox delivery. |
| Catalog/Profile CTA | Sẵn sàng cấu hình | Link HTTPS chỉ hoạt động khi có `CATALOG_PROFILE_URL`; khi trống sẽ hiện placeholder không có link lỗi. |
| Kiểm thử endpoint | Đạt | `npm run test:quote-api`: 8/8; lint riêng API đạt. Chưa chạy gửi thật vì chưa có credentials và không được giả lập gửi đến khách. |

## Luồng báo giá mục tiêu

1. Khách điền tên, email, điện thoại, sản phẩm, thị trường, khối lượng và nhu cầu.
2. Trình duyệt kiểm tra dữ liệu cơ bản; API `/api/quote` kiểm tra lại trên máy chủ.
3. API cấp mã yêu cầu, gửi email xác nhận cho khách và email nội bộ nếu Resend đã được cấu hình.
4. API đẩy payload tối thiểu cần thiết sang webhook Make đã bảo vệ bằng secret.
5. Make phân nhánh theo sản phẩm/thị trường đến đầu mối Sales được chỉ định và có thể kích hoạt thông báo WhatsApp Business/Zalo OA theo quyền đã cấp.
6. Màn hình cảm ơn chỉ hiển thị trạng thái gửi thực tế. Nút `Download Our Catalog/Profile` luôn có sẵn; chỉ hoạt động khi có `CATALOG_PROFILE_URL`.

## Điều kiện để bật gửi thật trên production

- Resend: API key có quyền gửi, domain gửi đã được xác minh và địa chỉ From hợp lệ.
- Make: custom webhook URL và secret để Make lọc request hợp lệ.
- Nội bộ: danh sách người nhận Sales hoặc tài khoản kênh được cấp quyền. WhatsApp Business Cloud API không dùng để gửi vào nhóm WhatsApp; dùng số Business của từng Sales hoặc một kênh nội bộ được hỗ trợ chính thức.
- Khách WhatsApp: opt-in trong form, số theo chuẩn quốc tế và message template đã được Meta phê duyệt.
- Zalo: OA/ZNS hoặc tích hợp đã được doanh nghiệp cấp quyền; không dùng tài khoản cá nhân hoặc bot không chính thức.

## 2026-09-19 — Biên tập đa ngôn ngữ và cờ Hàn Quốc

| Hạng mục | Trạng thái | Bằng chứng / ghi chú |
| --- | --- | --- |
| Nội dung public 8 ngôn ngữ | Hoàn tất mã nguồn | Việt, Anh, Trung, Hàn, Nhật, Ả Rập, Pháp và Đức có câu chữ biên tập theo ngữ cảnh B2B cho header, hero, giới thiệu, hành trình, đối tác, bài viết, catalogue xuất khẩu, modal và footer. Form báo giá được theo dõi trong luồng tích hợp riêng. |
| Dải phản hồi minh họa 8 ngôn ngữ | Hoàn tất mã nguồn | Vai trò, chủ đề, nội dung mẫu, nhãn trợ năng và tuyên bố “minh họa” đều đổi theo ngôn ngữ đang chọn; không gán nội dung cho khách hàng thật. |
| Quy cách xuất khẩu đa ngôn ngữ | Hoàn tất mã nguồn | `src/export-catalog-l10n.js` là nguồn dùng chung cho trang chính và bản phác thảo, tránh hai phiên bản dịch sai lệch nhau. Các số liệu tiếng Việt vẫn được ghi rõ là chỉ tiêu tham chiếu. |
| Cờ Hàn Quốc | Hoàn tất mã nguồn | `public/flags/kr.svg` là SVG nội bộ với nền trắng, Taegeuk đỏ/xanh và bốn quẻ Geon, Gon, Gam, Ri; không dùng ảnh raster hoặc icon thay thế. |
| Privacy copy cho form | Đồng bộ với API | Nội dung nêu đúng: gửi qua hệ thống báo giá để phân luồng Sales và xác nhận email; WhatsApp chỉ gửi khi người dùng opt-in. Không công bố bí mật hoặc cơ chế nội bộ. |
| Theme switcher | Hoàn tất mã nguồn | `copy.theme` có nhãn light/dark và aria-label theo cả 8 ngôn ngữ; lựa chọn được áp dụng vào `html[data-theme]` và lưu trên thiết bị. |

### Phạm vi ngôn ngữ

- Tiếng Việt là nguồn nội dung chuẩn.
- Các bản ngôn ngữ khác được viết lại theo ngữ cảnh giao thương B2B, không dịch từng từ.
- Tên sản phẩm tiếng Việt trong danh mục phổ thông được giữ làm tên hàng nguồn; nhóm hàng, điều hướng, mô tả catalogue xuất khẩu, nội dung biên tập, dải phản hồi minh họa và thông báo hệ thống được bản địa hóa.
- Khi thêm nội dung mới, cập nhật `src/site-copy.js` và `src/export-catalog-l10n.js` trong cùng pull request để tránh màn hình trộn ngôn ngữ.

## Quy tắc cập nhật

- Mỗi yêu cầu mới phải thêm một dòng vào nhật ký này trước khi deploy.
- Mỗi deploy ghi commit, URL production, kiểm tra build/lint/e2e và các biến môi trường mới (chỉ tên biến, không ghi giá trị).
- Nếu một kênh phụ thuộc bên thứ ba chưa có credentials, trạng thái phải là `chờ cấu hình`, không được mô tả là đã gửi.

## 2026-09-19 — UX form báo giá công khai

| Hạng mục | Trạng thái | Bằng chứng / ghi chú |
| --- | --- | --- |
| B2B intake trên trang chính | Hoàn tất mã nguồn | Form gửi JSON same-origin tới `/api/quote` gồm sản phẩm, nhóm hàng, thị trường, sản lượng, thời gian, consent WhatsApp, honeypot, thời điểm mở form và UUID idempotency. |
| Trạng thái giao nhận minh bạch | Hoàn tất mã nguồn | Màn hình cảm ơn đọc trạng thái Make, email khách và email Sales từ `deliveries` (tương thích `channels` cũ); chỉ nói “đã tiếp nhận/đang xử lý”, không nói đã giao thành công. |
| Mapping trạng thái production | Hoàn tất mã nguồn | UI đọc đúng trạng thái thật `sent` từ Make và `queued` từ Resend; vẫn tương thích các tên trạng thái cũ trong test/mock. |
| Fallback khi chưa cấu hình | Hoàn tất mã nguồn | Nếu API không có kênh hoặc lỗi, hiển thị rõ yêu cầu chưa được gửi; cho phép email, WhatsApp, copy và tải bản tóm tắt. |
| Catalog/Profile CTA | Hoàn tất mã nguồn | Nút có đúng nhãn `Download Our Catalog/Profile`; chỉ là link khi API trả HTTPS URL, còn lại disabled placeholder. |
| Đa ngôn ngữ form | Hoàn tất mã nguồn | `src/contact-l10n.js` có nội dung biên tập cho Việt, Anh, Trung, Hàn, Nhật, Ả Rập, Pháp và Đức; control routing dùng cùng nguồn copy. |
| Kiểm thử UX form | Đạt | Playwright mock 2 luồng: hand-off được kênh tiếp nhận và chưa cấu hình; kiểm tra payload, UUID header/body, trạng thái từng kênh, CTA catalog và fallback. |
| RTL consent trên mobile | Hoàn tất mã nguồn | Checkbox WhatsApp dùng flex basis cố định, span co giãn/wrap và margin logic cho RTL; kiểm tra tại viewport 390px với nội dung Ả Rập dài, không còn vượt chiều ngang. |

## 2026-09-19 — Ảnh sản phẩm sạch và lớp nhận diện

| Hạng mục | Trạng thái | Bằng chứng / ghi chú |
| --- | --- | --- |
| Ảnh cà phê xuất khẩu | Hoàn tất | `green-coffee-export.webp` thay ảnh cà phê rang ở nhóm cà phê hạt; mô tả đúng ngữ cảnh cà phê nhân xanh. |
| Ảnh trái cây sấy và điều thành phẩm | Hoàn tất | `dried-fruit-export.webp` và `finished-cashew-export.webp` thay ảnh xoài tươi/điều nhân lặp; không có chữ, logo hay nhãn của bên thứ ba. |
| Ảnh máy móc/đóng gói | Hoàn tất | `agri-processing-line.webp` thay ảnh kho chung ở bước đóng gói và bài viết liên quan; mô tả đây là ảnh minh họa, không phải cơ sở xác nhận của doanh nghiệp. |
| Hero catalogue phác thảo | Hoàn tất | PNG không rõ provenance được bỏ khỏi runtime; `export-categories-hero.webp` là ảnh gốc WebP, nhỏ hơn và có nguồn ghi trong `docs/assets.md`. |
| Khung/watermark giao diện | Hoàn tất | `ProductImageBrand` gắn chip nhận diện nhỏ, `aria-hidden`, không che alt text và không đóng dấu vào bitmap nguồn. |

## Kiểm tra trước deploy

| Kiểm tra | Trạng thái | Ghi chú |
| --- | --- | --- |
| ESLint | Đạt | `npm run lint` sau khi tích hợp ảnh, form, theme và đa ngôn ngữ. |
| Build | Đạt | `npm run build`; chỉ còn cảnh báo chunk Vite thông tin, không có lỗi build. |
| Quote API | Đạt | `npm run test:quote-api`: 8/8. |
| Cấu trúc Vercel Functions | Đạt | Chỉ còn handler `api/quote.js` trong thư mục `/api`; test Node được đặt tại `tests/quote.validation.node.js` để không tạo function ngoài ý muốn. |
| Browser regression | Đạt sau khi cập nhật test cũ | 51 Playwright checks: danh mục, responsive, modal, consent RTL, theme persistence, hình ảnh, 8 ngôn ngữ, thông số tham chiếu và Axe scan. |
