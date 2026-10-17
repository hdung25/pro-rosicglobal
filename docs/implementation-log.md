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

## 2026-09-27 — VR4 production audit
- Yêu cầu: triển khai VR4, kiểm tra đầy đủ feedback khách hàng, bố cục 8 ngôn ngữ và Admin.
- Bổ sung lưu nội dung xuất bản lên private Vercel Blob, xác thực cookie và kiểm tra cùng nguồn cho thao tác ghi; bản nháp vẫn lưu riêng.
- Biến môi trường production: ADMIN_SESSION_SECRET, BLOB_READ_WRITE_TOKEN. Không ghi giá trị bí mật vào log.
- Đang kiểm tra build, lint, giao diện đa kích thước và luồng production. Kênh gửi email/webhook báo giá: chờ cấu hình.

## Kết quả production cuối — 27/09/2026
- URL: https://rosicglobal.com; Admin: https://rosicglobal.com/admin/.
- Deployment: dpl_6uRLkzyasCX29JhqBSbuKpxKpqS3 (READY), https://pro-rosicglobal-7sxbqrrzm-ha-huy-dungs-projects.vercel.app.
- Git base: 0f24594; triển khai working tree VR4 chưa commit.
- Build/lint đạt. UI build 18/18; production 20/20; xác thực/báo giá Node 11/11. Sau bản vá lọc dữ liệu public, kiểm tra API 200, ẩn draft/media và từ chối ghi không đăng nhập 401.
- Đăng nhập thật, xuất bản thật và đọc nội dung từ browser context độc lập đã đạt.
- Lighthouse mobile production: 88/100, FCP 2,5s, LCP 3,2s, TBT 160ms, CLS 0,005. Phép đo lab, không phải số liệu người dùng thực tế.
- Production dependencies: npm audit --omit=dev không có cảnh báo.
- Chờ cấu hình: dịch vụ email/webhook nhận báo giá và URL các kênh mạng xã hội khách chưa cung cấp.

## 2026-09-27 — CMS động và SEO Image Framework bổ sung VR4
- Thêm/xóa/sắp xếp danh mục, chỉnh thông số; chặn xóa danh mục còn sản phẩm. Dữ liệu CMS quyết định danh mục ở mọi ngôn ngữ.
- API xử lý ảnh có xác thực: WebP dưới 150KB, tên theo sản phẩm hoặc tên tiếng Anh do quản trị nhập, hậu tố hong-tam-rosic, UUID ở thư mục để không ghi đè ảnh cùng tên.
- Watermark logo chìm 25% chiều rộng và dòng bản quyền được đóng trực tiếp trong ảnh sản phẩm. Ảnh lưu Blob, CMS lưu URL thay vì ảnh base64.
- Kiểm tra trước deploy: lint/build, xử lý ảnh thật, UI thêm/xóa danh mục, 8 ngôn ngữ và Admin. Không thay đổi nội dung production bằng dữ liệu thử nghiệm.

### Kết quả CMS/Image production
- Production: https://rosicglobal.com, deployment dpl_CjjGw8drVFW5UvQawSDc6XaincUW (READY), https://pro-rosicglobal-51z772tkb-ha-huy-dungs-projects.vercel.app.
- Git base 0f24594, working tree VR4 chưa commit. Không thêm biến môi trường; dùng storage và session đã cấu hình.
- Build/lint đạt. Kiểm tra UI Admin/8 ngôn ngữ 14/14 đạt; kiểm tra tên ảnh, pixel watermark và ảnh lỗi 3/3 đạt.
- Upload thật qua Admin và thay ảnh lần hai đạt; từ chối upload không đăng nhập 401; ảnh tải riêng 200 image/webp. Nội dung production được giữ nguyên trong bài thử.
- Đã sửa race khi CMS trả dữ liệu chậm; chữ watermark chuyển thành vector outlines để không phụ thuộc font trên Vercel.
- Backend/API media và tài sản watermark là thay đổi code; các lần thay sản phẩm/danh mục tiếp theo do Admin điều khiển, không cần sửa code/deploy.

- Bản hoàn tất CMS/Image: dpl_CgtvDihXgjzFe59RKHUSdbJeRe1y, https://pro-rosicglobal-77i7mjjcd-ha-huy-dungs-projects.vercel.app, alias https://rosicglobal.com (READY). Build thành công; 14 bài UI và 4 bài xử lý ảnh đạt. Upload/thay ảnh thật sau bản vá chữ vector đạt, ảnh 57.300 byte và 1200 × 1200px; đã xem trực tiếp file tải từ production.

## Chỉnh theo phản hồi khách 10–20 — 05/10/2026

- Product menu: 5 cột desktop, 10 nhóm chiếm 2 hàng danh mục; mục xem tất cả riêng. Mobile có lưới 2 cột. Chọn nhóm lọc catalogue, đóng menu ngay; ngoài vùng, mouseleave, Escape, cuộn, resize và đổi hash cũng đóng. Không dựa vào CSS focus-within để giữ hộp mở.
- Giữ mã sản phẩm từ CMS, bỏ bộ lọc trái cây trùng tên. Chi tiết sản phẩm hiển thị quy cách/grade của danh mục liên kết (ví dụ WW320), thông tin chỉ là tham chiếu như hồ sơ danh mục hiện có. Nhóm chưa có SKU hiển thị hồ sơ nhóm, không tạo SKU giả.
- Thu gọn bộ chọn ngôn ngữ, bỏ viền và mũi tên của ngôn ngữ/header contact; cân tỷ lệ biểu tượng/wordmark ROSIC cả portal menu.
- Hero dùng chữ thẳng sans-serif, bỏ gạch trang trí. CTA chung kích thước, bo góc và nền theo ngữ cảnh; nút trong dialog cũng được đồng bộ và kiểm tra tương phản.
- ROSIC values trên mobile bố trí 3 + 2; Customer-Centric giữ nguyên một dòng. Gold #A77C30, Gold sáng #F4D780 trên nền Forest #193B30.
- Icon danh mục tự nhận diện ID/tên hoặc chọn trong CMS; áp dụng cho menu và marquee, bố cục thumbnail/card tự mở rộng theo số nhóm. Copy không còn cố định 'chín nhóm'.
- Backend tên ảnh bỏ đuôi gốc/dấu/ký tự lạ và suffix branding lặp; preset lạ bị từ chối để không bỏ qua watermark. Giữ WebP 1200x1200, dưới 150.000 byte, logo chìm giữa cho ảnh sản phẩm; các preset khác giữ mục đích riêng.
- CMS không cho sửa/xuất bản khi tải bản máy chủ thất bại, giữ bản nháp. Sửa vòng lặp /admin/ do static entry trỏ lại /admin; entry dẫn đến /?admin=1, đăng nhập và preview thật đã đạt.
- Hướng dẫn công khai không chứa dữ liệu nội bộ tại /admin-guide.html, liên kết từ sidebar CMS.

Xác minh: 33 bài UI sau phần bổ sung quy cách đạt (8 ngôn ngữ, responsive, sản phẩm, upload, CMS, WCAG AA mobile/desktop); 15 bài Node cho ảnh, xác thực và báo giá đạt. Các lỗi điều hướng/filter của vòng kiểm tra trước đã được sửa và kiểm tra lại. Browser smoke thật trên deployment và rosicglobal.com đạt (VI/EN/AR, 320/390/1440px, Admin/preview/guide), không có pageerror trong các luồng đó. Upload thật trên Vercel xác nhận tên chuẩn, ảnh WebP/watermark và từ chối không xác thực/preset lạ. Không gọi PUT xuất bản CMS trong quá trình triển khai.

Deployment cuối: dpl_5yMWRxu2UNyUDhM86GDmYTokv2Q3, URL pro-rosicglobal-fd1u4042a-ha-huy-dungs-projects.vercel.app, promote thành công lên rosicglobal.com. Build/lint đạt; runtime error scan trên deployment cuối không tìm thấy log lỗi tại lúc kiểm tra. Bản dữ liệu CMS sau deploy khớp hoàn toàn bản sao lưu có xác thực trước deploy: 9 nhóm, 16 sản phẩm. Dữ liệu gốc không được sửa để ép thành 10 nhóm; test riêng xác minh 10 nhóm CMS hoạt động. Bằng chứng và backup riêng nằm trong artifacts/customer-revision (được gitignore).


## VR5 — Thu gọn footer, giảm lặp ảnh và phát hành 16/10/2026

Yêu cầu: footer quá dài, ảnh các biến thể lặp nhiều, triển khai đúng rosicglobal.com. Footer thay thẻ QR lớn bằng link và nút mở QR 44px; bỏ dãy icon trùng, danh mục desktop chia hai cột. Danh sách sản phẩm dùng một ảnh chung khi các sản phẩm cùng danh mục có cùng ảnh; từng SKU vẫn có tên, mã, mô tả và nút chi tiết riêng. Tìm theo mã vẫn hiển thị đúng một sản phẩm và ảnh của sản phẩm đó. Khôi phục mã ROS trên mobile (CSS cũ đã ẩn mã).

Kiểm: 14 bài UI được kiểm qua hai lượt, 13 đạt lượt đầu; bài 320px phát hiện footer cao quá mức và được sửa khoảng cách/chia cột trước khi cả 3 bài kích thước mới đạt. Lint/build đạt. Base commit 0f24594e04017d56654324396d5d4803b394936a kèm thay đổi VR5 trong working tree. Không thêm biến môi trường. Dữ liệu CMS không được xuất bản lại.

Bản sẵn sàng phát hành: dpl_5nM5gShoKAV2MefcsLEpuW4dMEQy, https://pro-rosicglobal-q9fv4hcc3-ha-huy-dungs-projects.vercel.app. Kết quả promote và kiểm tên miền thật ghi bổ sung sau khi thực hiện.


Đã phát hành chính thức: CLI promote báo nhầm team; gán alias trực tiếp thành công cho cả rosicglobal.com và www.rosicglobal.com đến cùng bản dpl_5nM5gShoKAV2MefcsLEpuW4dMEQy. Smoke trên rosicglobal.com không cookie Vercel, không mock API: CMS 200/16 bản ghi; Admin 200; ghi CMS không đăng nhập bị từ chối 401; đủ link chính thức và QR, TikTok chờ; 9 SKU điều / 1 ảnh chung; yêu cầu ROS-024 đúng mã/đích WhatsApp; không lỗi JS. Không gửi tin nhắn, không PUT xuất bản nội dung CMS. Bằng chứng: artifacts/vr5/production-smoke.json, production-layout.json và production-footer/catal​og-*.png.


Tinh chỉnh cuối: footer chỉ giữ bốn nhóm hàng chính và link danh mục xuất khẩu đầy đủ, giảm chiều cao mobile 390px từ 1119 còn 931px; desktop 524px. Ba bài 320/390/1440 và bài filter từ footer đều đạt; mã ROS hiển thị trên mobile. Deployment cuối dpl_5zsVcqjnUNAnnwLX1KnmucjLibxY, https://pro-rosicglobal-ozv2pb1l2-ha-huy-dungs-projects.vercel.app, deploy production thành công với alias rosicglobal.com. Cả apex và www HTTP 200 cùng /assets/index-DiwDQKyN.js. Thư viện QR tạo mã bất đồng bộ; smoke chờ đủ nút QR trước khi kiểm. Bằng chứng mới được ghi đè bằng ảnh tên miền thật.


## VR5 — Mobile/PWA làm sâu ngày 16/10/2026

Yêu cầu: kiểm giao diện nhiều cỡ thiết bị, từng nút mobile, hiệu ứng và PWA/icon; rà lại đủ 7 nhóm VR5. Tập trung 4 nhóm 1/2/3/6, đối chiếu nhóm 4/5/7 và ghi các mục chờ tại docs/VR5-MOBILE-REVIEW.md. Sửa vùng chạm tối thiểu 44px (nhiều điều khiển 48px), menu tablet 1100px, header nhỏ và safe area, cỡ chữ nhập liệu, cuộn dialog/màn ngang, thẻ một cột dưới 360px. Hiệu ứng menu tuần tự, hero mở ảnh, phản hồi nhấn và hover desktop; reduced-motion và tìm kiếm vẫn ổn định.

PWA: manifest, icon vector Manrope 600 + biểu tượng gốc, PNG thường/maskable/Apple; nút cài/hướng dẫn trong footer, khôi phục focus, standalone ẩn nút. Worker chỉ cache trang offline và 2 icon, bỏ qua API/Admin/query; không cache HTML nên không giữ website cũ. Không có tự reload khi khách nhập form. Không thêm biến môi trường hoặc thay đổi dữ liệu CMS production.

Kiểm local: 32/32 bài mobile/theme/responsive/footer/WCAG cuối đạt; 160/160 bố cục (20 độ rộng × 8 ngôn ngữ) đạt sau chờ layout/font. PWA offline/reconnect và cache whitelist đạt; hướng dẫn cài qua WCAG, viewport 320px, trả focus. Lint và build đạt, cảnh báo bundle >500KB/Browserslist còn như trước. Chưa kiểm cài đặt trên điện thoại vật lý; chưa gửi/nhận WhatsApp thật. Kết quả server và deployment được ghi bổ sung sau phát hành.


Đã deploy production dpl_48gof8fXTD8amjAUm3gCQmNJGNqx, https://pro-rosicglobal-6xw0f5ay9-ha-huy-dungs-projects.vercel.app, alias rosicglobal.com. Bốn bài touch trên tên miền thật đạt; smoke CMS/quote/QR đạt. PWA chính thức có worker kiểm soát, manifest/3 icon đúng, cache whitelist 3 file, offline/reconnect và trả focus đạt. Kiểm bổ sung local PWA+VR5 10/10. Dữ liệu CMS không thay đổi, không gửi tin nhắn. Bằng chứng production-pwa.json và docs/VR5-MOBILE-REVIEW.md.


Bổ sung sau kiểm Safari engine: WebKit 26.6 phát hiện native select ở 320px làm vùng vẽ tràn sau khi chọn sản phẩm tên dài, trong khi hộp có đúng width. Sửa appearance và mũi tên SVG của select, giữ picker hệ điều hành; kiểm 3 luồng WebKit sạch đạt. Sửa vị trí floating tools RTL để không đè nút menu, kiểm mở lại menu/chuyển theme ở tiếng Ả Rập 320px. Bản vá cuối triển khai và xác minh riêng bên dưới.


Bản cuối mobile/PWA: dpl_9PB76T3vScHLhqiWC6iVFzTmrZWi, https://pro-rosicglobal-aq84lec1q-ha-huy-dungs-projects.vercel.app; rosicglobal.com và www.rosicglobal.com đều HTTP 200 với index-CYZptioB.js. WebKit trên website thật 4/4 đạt (320/390/ngang/RTL), Chrome bổ sung 3/3 đạt, PWA production kiểm lại đạt. Xem báo cáo VR5-MOBILE-REVIEW.md. Không thay CMS hoặc gửi tin nhắn.


## VR5 — Nút chọn ngôn ngữ chế độ tối, 16/10/2026

Phản hồi: mảng nền vuông của picker ở topbar không hòa với giao diện tối. Sửa rule ghi đè nền dark bằng control trong suốt ở cả hai theme; thêm chevron rõ chức năng, vùng chạm 44px, topbar 48px tránh cắt control, hover nhẹ và focus ring vàng nằm trong bo tròn để không bị overflow topbar cắt. Áp dụng nhất quán cho header/menu/footer. Kiểm local desktop 1440px và mobile 390px: nền rgba(0,0,0,0), vùng chạm cao 44px, đổi EN thành công; đã xem ảnh thực. Lint/build đạt; không thay đổi dữ liệu CMS.

Đã deploy dpl_27SPSLug3v2An4wgmv42dyX76mft lên rosicglobal.com, bundle index-9LDtDwKE.js. Kiểm trên website thật ở 320/390/1440px bằng Chrome và WebKit: nền picker trong suốt, chevron hiện, vùng chạm 44px và đổi EN thành công. Bằng chứng language-dark-verification.json và language-dark-production-*.png.
