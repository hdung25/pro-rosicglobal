# ROSIC VR4

## Giao diện và nội dung

- Banner dùng ảnh tư liệu 2560 × 1440 do khách hàng cung cấp; bản hiển thị WebP 1920px và bản mobile 960px. Typography Gold: “Khởi từ Tâm – Vươn bằng Tầm”, nút viền mảnh dẫn đến `#about`.
- Mục Về chúng tôi có slogan ở đầu và hai khối Khởi từ Tâm / Vươn bằng Tầm. Nội dung mới có bản dịch cho cả 8 ngôn ngữ đang hỗ trợ.
- Dải ROSIC: chữ Gold lớn, mỗi chữ có icon nét mảnh và một tên tiếng Anh. Slogan nằm cạnh dải chữ trên Desktop và phía trên trên Mobile.
- Logo Header/Footer xếp 3 tầng: biểu tượng HTR, ROSIC, slogan tiếng Anh không dấu chấm cuối câu. Favicon SVG, PNG dự phòng, ICO và Apple Touch Icon đã cập nhật.
- Menu “Nhãn hiệu riêng” có bản dịch tương ứng. Danh mục mở: “Lương thực, Thực phẩm khác”; bản Anh “Other Food & Foodstuffs”.
- Theme switch và Back-to-Top cố định hai bên; cuộn dùng hành vi trình duyệt, không can thiệp wheel. Hiệu ứng xuất hiện, hover và phóng ảnh có hỗ trợ reduced motion.
- Thông số sản phẩm xuất hiện khi hover hoặc focus bằng bàn phím. Hộp chi tiết có nút phóng ảnh Lightbox, hỗ trợ Escape và khôi phục focus.

## Admin

- Live Preview dùng chính giao diện website trong iframe, cập nhật từ bản nháp; có Desktop 1440px / Mobile 390px và nút mở vùng xem trước cạnh Xuất bản và Export JSON.
- Live Preview không ghi đè bản đã xuất bản. Chọn ngôn ngữ ngay trong giao diện xem trước để kiểm tra các bản dịch.
- Email, WhatsApp, LinkedIn, Facebook, Zalo, WeChat, TikTok có trường liên kết; kênh để trống được ẩn trên website. Link công khai chỉ nhận HTTP(S) hoặc mailto.
- Bố cục Admin được kiểm tra ở 320, 390, 768, 1280, 1440px; các ô nhập trên điện thoại dùng chữ 16px.
- Xuất bản lưu lên private Vercel Blob qua API xác thực cookie, kiểm tra cùng nguồn; khách truy cập ở trình duyệt khác nhận nội dung đã xuất bản. Bản nháp lưu riêng trên trình duyệt. Đã kiểm tra đăng nhập thật, xuất bản thật và đọc từ trình duyệt độc lập. API công khai không trả sản phẩm nháp hoặc thư viện media. Mỗi lần xuất bản tối đa 4 MB, có thông báo khi vượt giới hạn; nên dọn ảnh không dùng trong thư viện.

## Hình ảnh và tải trang

- 52 ảnh WebP ở 320px / 960px có tên SEO theo sản phẩm và đều dưới 150.000 byte. Danh sách tại `scripts/product-image-manifest.json`.
- Ảnh sản phẩm và ảnh danh mục có ALT; các vị trí phù hợp dùng srcset để chọn kích thước tải.
- Banner mobile: 113.264 byte. Banner desktop: 444.880 byte. Ảnh gốc của khách hàng không bị sửa.
- Font phục vụ tại chỗ, chỉ tải các tập ký tự cần cho giao diện. Các phần Admin, demo, liên hệ và feedback được tách thành các gói riêng.
- Phần ngoài màn hình dùng content-visibility; bộ font tiếng Việt giữ đầy đủ dấu.

## Bảo vệ nội dung và tìm kiếm

- Chặn context menu, copy/cut và kéo ảnh ngoài ô nhập với cảnh báo chính xác `ALERT: Content is protected !!`. Không chặn thao tác nhập liệu trong Admin hoặc biểu mẫu liên hệ.
- Đây là hạn chế thao tác trình duyệt, không phải biện pháp chống tải nội dung tuyệt đối.
- Trang gốc có `meta robots=noindex` theo yêu cầu. `robots.txt` vẫn cho crawler truy cập để đọc chỉ thị này. Khi triển khai, noindex áp dụng cho toàn bộ trang gốc; việc cập nhật trên công cụ tìm kiếm không diễn ra tức thì.

## Tài sản bàn giao

- `public/brand-kit/rosic-logo-stacked.svg`: logo vector 3 tầng.
- `public/brand-kit/rosic-logo-stacked.png`: logo PNG nền trong suốt 1200px.
- `public/brand-kit/rosic-symbol.svg`, `rosic-favicon.svg`: biểu tượng vector.
- `public/brand-kit/brand-guide.txt`: mã màu và font.
- `public/brand-kit/fonts/`: font WOFF2 cùng giấy phép.
- `artifacts/vr4/rosic-brand-kit-vr4.zip`: bộ tài sản đóng gói trên máy hiện tại.

## Kiểm tra

- Build và ESLint thành công.
- Các bài kiểm tra VR4 bao gồm 8 ngôn ngữ, Desktop/Tablet/Mobile, bố cục Admin, preview bản nháp, social links, Lightbox, bảo vệ nội dung và dung lượng ảnh.
- Kiểm tra WCAG AA tự động ở 390px và 1440px, cả trang chính lẫn hộp sản phẩm/chính sách, đã đạt. Đây không thay thế đánh giá khả năng tiếp cận thủ công đầy đủ.
- Đã kiểm tra tải ảnh toàn trang, liên kết nội bộ, tìm/lọc sản phẩm và chuyển sản phẩm sang form yêu cầu.
- Đã triển khai production tại https://rosicglobal.com ngày 27/09/2026. Admin: https://rosicglobal.com/admin/. Bộ kiểm tra production: 20/20 đạt; bản build cục bộ: 18/18 đạt; kiểm tra xác thực và báo giá: 11/11 đạt.
- Lighthouse mobile trên bản build cục bộ với mạng/CPU mô phỏng: 79/100 (ban đầu 53/100), FCP 3,1 giây, LCP 4,1 giây, TBT 130ms, CLS 0,008. Đây là phép đo trong phòng thử nghiệm, không phải số liệu người dùng thật; cần đo lại sau khi triển khai hosting/CDN.

Tham khảo cách phân nhóm và trình bày sản phẩm: [Visimex](https://visimex.com/products/), [Vĩnh Hiệp](https://vinhhiepgl.com/danh-muc-san-pham/hat-ca-phe/). Logo dùng biểu tượng ROSIC hiện có và bố cục từ mẫu khách hàng gửi.

## Các mục cần thông tin từ khách

- Email/webhook nhận báo giá tự động: chờ cấu hình tài khoản dịch vụ. Form hiện thông báo trung thực khi chưa gửi và cung cấp kênh liên hệ trực tiếp.
- Link mạng xã hội chưa có: để trống trong Admin, không tạo đường dẫn giả.
- noindex đang bật theo yêu cầu khách: website có thể bị loại khỏi kết quả Google; ảnh favicon/mô tả trên Google không cập nhật tức thì.

Lighthouse mobile production ngày 27/09/2026: **88/100**, FCP 2,5 giây, LCP 3,2 giây, TBT 160ms, CLS 0,005. Báo cáo: `artifacts/vr4/lighthouse-production.json`. Đây là phép đo lab tại thời điểm kiểm tra, không phải cam kết điểm mọi lần hoặc mọi thiết bị.

## Bổ sung CMS Framework và SEO Image — 27/09/2026

### Cách sử dụng
1. Vào Admin → Danh mục → Thêm danh mục. Nhập tên, mô tả, quy cách, thông số; dùng Đưa lên trước/Đưa xuống sau để đổi thứ tự. Danh mục còn sản phẩm phải chuyển sản phẩm sang nhóm khác trước khi xóa.
2. Vào Sản phẩm → Thêm sản phẩm hoặc chọn sản phẩm hiện có. Chọn nhóm, nhập tên và mã sản phẩm.
3. Điền “Tên tiếng Anh dùng cho ảnh” trước khi tải ảnh, ví dụ `Cashew Nuts W320`. Nếu để trống, hệ thống dùng bản tên tiếng Anh có sẵn của sản phẩm; với tên mới chưa có bản dịch, dùng tên sản phẩm chuyển sang ký tự Latin không dấu. Đây không phải dịch tự động mọi tên sản phẩm.
4. Đổi ảnh: máy chủ xử lý WebP, đặt tên `cashew-nuts-w320-hong-tam-rosic.webp`, đóng logo chìm và dòng bản quyền lên ảnh sản phẩm. Ảnh vuông 1200px, dưới 150KB. Mỗi lần tải có thư mục UUID riêng; ảnh cũ không bị ghi đè và không lỗi bộ nhớ đệm.
5. Kiểm tra bản xem trước rồi Xuất bản. Tải ảnh/lưu nháp không tự đổi nội dung công khai.

- Danh mục CMS áp dụng cho menu, thẻ danh mục và bộ lọc; các nhóm sản phẩm cũ được giữ để không mất dữ liệu. Tên/nội dung mới chưa có bản dịch dùng nội dung quản trị nhập ở các ngôn ngữ khác.
- Thư viện lưu URL thay vì nhúng ảnh base64. Bấm ảnh trong thư viện mở file để kiểm tra; để đổi ảnh sản phẩm, tải ảnh trong chính phần sản phẩm để áp dụng đúng tên/watermark.
- Logo chiếm 25% chiều rộng, alpha 32%, ở góc phải phía dưới; dòng bản quyền ở chân ảnh. Chỉ ảnh sản phẩm có watermark, ảnh danh mục/hero/nội dung không bị đóng dấu sản phẩm.
- API tải ảnh yêu cầu đăng nhập và kiểm tra cùng nguồn. Từ chối file không hợp lệ; URL ảnh xuất ra chỉ phục vụ WebP.
- Đã kiểm tra thật: đăng nhập, tạo sản phẩm nháp, tải ảnh, thay ảnh lần hai, URL độc lập, ảnh công khai 1200px/56.788 byte; nội dung đã xuất bản không bị thay đổi bởi bài thử.
- Đã sửa lỗi phản hồi CMS đến trễ có thể ghi đè thao tác vừa nhập: Admin chờ tải dữ liệu ban đầu trước khi mở vùng chỉnh sửa.

Kiểm tra hoàn tất: 14 bài UI Admin/đa ngôn ngữ và 4 bài xử lý ảnh đạt. Ảnh tải thật từ production sau bản vá font có dung lượng 57.300 byte, 1200 × 1200px, đầy đủ logo và dòng “HONG TAM ROSIC GLOBAL”. Bằng chứng: `artifacts/vr4/cms-framework-production.json`, `artifacts/vr4/live-watermark.webp`.
