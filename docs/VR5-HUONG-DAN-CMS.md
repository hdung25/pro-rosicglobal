# Hướng dẫn CMS VR5

Video: `artifacts/vr5/huong-dan-cms-vr5.webm`. Video có phụ đề hướng dẫn ngay trên màn hình, không có thuyết minh. Phiên đăng nhập và xuất bản trong video là mô phỏng local, không dùng tài khoản thật hay thay dữ liệu production.

1. **Sao lưu trước khi sửa lớn.** Admin → Cài đặt → Xuất bản sao JSON. Bản nháp chỉ nằm trong trình duyệt, không phải bản sao lưu máy chủ.
2. **Mỗi hàng/biến thể một sản phẩm.** Sản phẩm → Thêm sản phẩm → chọn nhóm → nhập tên, mã ROS-xxx, mô tả, quy cách thông qua nhóm và ALT. Không gộp Robusta/Arabica hoặc điều các cỡ thành một bản ghi. Khi tạo mới, hệ thống đề xuất mã tiếp theo; xuất bản kiểm tra trùng mã.
3. **Tải ảnh.** Nhập tên tiếng Anh dùng cho ảnh trước; tải ảnh trong phần sản phẩm để áp dụng pipeline watermark và tên. Ảnh sản phẩm 1200×1200 WebP dưới 150KB; danh mục 800×800; hero 1920×1080; nội dung 1600×1200. Ảnh upload sản phẩm mới có logo/info nằm trong file; không phải chỉ lớp phủ giao diện. Điền ALT mô tả chính xác chủ thể.
4. **Bản dịch sản phẩm/danh mục.** Mở Bản dịch, chọn ngôn ngữ rồi sửa từng trường. Để trống dùng nội dung mặc định; không mặc định đây là dịch tự động chính xác cho mọi hàng mới.
5. **Quản lý nhóm.** Danh mục → Thêm danh mục; nhập tên ngắn/tên đầy đủ, mô tả, icon và thông số. Dùng Đưa lên trước/Đưa xuống sau. Muốn xóa nhóm, chuyển hoặc xóa hết sản phẩm đang thuộc nhóm trước.
6. **Sửa nội dung trang.** Các trường đầu trang dành cho phần giới thiệu tiếng Việt và hình ảnh. Phần Nội dung chi tiết · 8 ngôn ngữ cho phép sửa từng ngôn ngữ trong các nhóm: `copy` (menu, nhãn, CTA, chính sách), `story`, `values`, `journey`, `articles`, `contact`, `routing`, `exportCatalogue`, `feedback`. Tên đường dẫn trường giúp xác định đúng vị trí. Không thay đổi nội dung phản hồi minh họa thành lời chứng thực thật nếu chưa có xác nhận.
7. **Sửa kênh liên hệ.** Cài đặt → nhập link chính thức. Email nhập mailto:; WhatsApp dùng https://wa.me/số-quốc-tế. Link có sẵn được tạo QR ngay trên trình duyệt. Nếu nền tảng cấp QR riêng (đặc biệt WeChat), tải ảnh vào kho ảnh phù hợp rồi dán URL ảnh QR vào trường QR chính thức. Bấm link và quét QR bằng điện thoại để xác nhận đúng đích. Kênh trống hiện “đang cập nhật”.
8. **Kiểm báo giá.** Từ sản phẩm bấm yêu cầu → kiểm mã/tên hàng trong form → điền yêu cầu → chọn kênh → chuẩn bị yêu cầu → mở WhatsApp/Zalo/email. Với Zalo, sao chép nội dung và dán vào chat. Phải bấm Gửi trong ứng dụng. Công ty kiểm tin đến rồi mới xác nhận phép thử thành công.
9. **Preview trước xuất bản.** Chọn Desktop 1440px và Điện thoại 390px. Kiểm menu, đoạn dài, ảnh, dark mode, nút CTA và bản dịch. Preview dùng dữ liệu nháp, chưa đổi website công khai.
10. **Xuất bản.** Bấm Xuất bản, chờ thông báo thành công. Nếu có lỗi mã/ALT hoặc máy chủ, sửa và thử lại; không giả định đã lưu. Mở cửa sổ độc lập để kiểm nội dung công khai, vì bản nháp trên máy mình không chứng minh máy chủ đã cập nhật.

Buổi bàn giao trực tiếp: chưa diễn ra. Nội dung đề xuất: 15 phút quản lý hàng/ảnh, 15 phút nội dung/bản dịch, 10 phút preview/xuất bản/sao lưu, 10 phút kiểm nhận báo giá và hỏi đáp. Chốt lịch với người phụ trách công ty khi đủ tài khoản/link chính thức.
