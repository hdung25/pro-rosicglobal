# VR5 — Checklist xử lý và nghiệm thu

Ngày lập: 16/10/2026. Phạm vi: mã nguồn, kiểm thử tại workspace `D:\pro-rosicglobal` và smoke test staging Vercel.

**Bản chính thức hiện tại (16/10/2026):** https://rosicglobal.com và https://www.rosicglobal.com — deployment dpl_27SPSLug3v2An4wgmv42dyX76mft. Đã gán alias và kiểm trực tiếp: CMS đọc 200/16 bản ghi, 9 mã điều cùng 1 ảnh nhóm, footer QR gọn, báo giá ROS-024 đúng mã, không lỗi JS. Không PUT xuất bản dữ liệu CMS; chưa kiểm gửi/nhận tin nhắn hai phía. Các ghi chú staging bên dưới là kết quả trước phát hành.

**Phân biệt triển khai và nghiệm thu:** bản production đã được kiểm riêng theo báo cáo phát hành; điều đó không chứng minh công ty đã nhận tin báo giá hay khách đã duyệt logo/ảnh. Facebook, WhatsApp và WeChat đã được cấp; TikTok vẫn chờ.

Quy ước: **Đã sửa** = có thay đổi trong mã nguồn; **Đã kiểm** = có phép kiểm/bằng chứng; **Chờ** = chưa được coi là hoàn tất nghiệm thu. Ảnh trong `artifacts/vr5/` là ảnh trình duyệt local, không phải ảnh tin nhắn đã vào tài khoản công ty.

## 1. Báo giá và kênh nhận miễn phí

| ID | Yêu cầu | Xử lý / tiêu chí nghiệm thu |
|---|---|---|
| Q01 | Bỏ chặn “chưa cấu hình xong” | Đã sửa: mặc định dùng luồng liên hệ trực tiếp, không phụ thuộc Make/Resend. API cũ giữ cho cấu hình riêng; tùy chọn chỉ hiện khi bật `VITE_QUOTE_SERVER_ENABLED=true`. |
| Q02 | Phương án cụ thể | WhatsApp mở tin nhắn soạn sẵn có thông tin khách, mã/tên hàng, lượng, thị trường, thời gian và lời nhắn. Zalo dùng sao chép nội dung rồi mở đúng kênh để dán/gửi. Email dùng bản nháp mailto. Người dùng bấm Gửi trong ứng dụng. Website chỉ báo “sẵn sàng để gửi”. |
| Q03 | Nút từng sản phẩm gửi đúng hàng | Đã kiểm 1440/390/320px: tìm ROS-021 → mở Robusta → chuyển Arabica rang → form chọn đúng sản phẩm → nội dung WhatsApp chứa ROS-024 và đúng tên. Ảnh `quote-1440.png`, `quote-390.png`, `quote-320.png`. |
| Q04 | Kiểm thử gửi/nhận thật | Đã nhận link WhatsApp Business chính thức và đối chiếu số từ trang WhatsApp. **Chờ** một lần gửi từ thiết bị có WhatsApp/Zalo, kiểm tra trong hộp thư công ty. Kiểm tra URL/nội dung trong trình duyệt không thay thế bước này. Không có ảnh xác nhận nhận tin thật trong bộ bằng chứng hiện tại. |
| Q05 | Có đường lui khi ứng dụng không mở | Đã sửa: các nút mở lại kênh, sao chép, tải nội dung TXT, email. Không xóa dữ liệu vừa nhập khi tạo bản yêu cầu. |

Giải pháp theo cơ chế [WhatsApp click to chat chính thức](https://faq.whatsapp.com/5913398998672934). Không tích hợp tính năng tự động gửi WhatsApp/Zalo từ website và không tuyên bố đã gửi thay người dùng.

## 2. Sản phẩm và điều hướng

| ID | Yêu cầu | Xử lý / tiêu chí nghiệm thu |
|---|---|---|
| P01 | Robusta / Arabica, nhân xanh / rang | Đã sửa và kiểm: 4 bản ghi, mã ROS-021–024; nhóm cà phê mở danh sách 4 hàng. |
| P02 | Điều 10 xanh, 16, 18 × nguyên, cánh, vỡ | Đã sửa và kiểm: 9 bản ghi ROS-025–033. Giữ nguyên tên cỡ khách đưa; không tự suy ra WW180/WW320. **Chờ** khách duyệt cách gọi, mẫu và quy cách thực tế. |
| P03 | Không gộp biến thể thành một sản phẩm | Nhóm điều/cà phê có danh sách chọn hàng con; catalogue tổng cũng có thẻ riêng. Sản phẩm con dùng thông tin riêng, tránh hiển thị thông số Robusta trên Arabica. Các nhóm còn lại tiếp tục chỉnh số biến thể thực bán trong Admin. |
| P04 | Chuyển sản phẩm ngay trong chi tiết | Đã sửa và kiểm: bộ chọn mã + tên trong hộp chi tiết; bộ chọn chuyển nhóm trong hộp nhóm hàng. |
| P05 | Mobile cuộn đủ và chạm được CTA | Đã sửa và kiểm: một vùng cuộn theo chiều cao viewport, không khóa overflow; ảnh `category-mobile-scroll.png`. |
| P06 | Bảng thông số dark mode | Đã sửa và kiểm: nền xanh đậm, chữ sáng cho các nhóm thông số và vùng tổng quan. Ảnh `category-dark.png`. |
| P07 | Số ảnh không đè ảnh; zoom cố định | Đã bỏ số thứ tự trang trí phủ ảnh; nút zoom ở góc ảnh, tách khỏi nút đóng trên mobile. |
| P08 | Thẻ đồng bộ ảnh trên/chữ dưới | Đã sửa mọi thẻ xuất khẩu, gồm Cashew kernels; bỏ bố cục đặc biệt của điều/cà phê, bỏ giới hạn 3 dòng mô tả. |
| P09 | Nền đá be | Đã đổi nền xoài/cà phê rang theo ảnh tiêu đá be hiện có. 6 WebP 320/960px từ 7.480 đến 59.700 byte. Ảnh nguồn cũ được giữ. **Chờ duyệt ảnh** vì đây là bản đổi nền bằng AI. |
| P10 | Quy ước mã | Mã chuẩn ROS-xxx, biến thể mới ROS-021–033. Mã đã cấp cho hàng cũ được giữ; kiểm tra trùng/sai mã ở giao diện xuất bản và API. Mã CAT chỉ dùng quản trị danh mục, không dùng làm mã sản phẩm công khai. |

## 3. Hiển thị, chuyển động, điều hướng

| ID | Yêu cầu | Xử lý / tiêu chí nghiệm thu |
|---|---|---|
| U01 | Khám phá hành trình không trắng | Đã sửa tải nội dung ngay khi bấm liên kết nội bộ và bỏ content-visibility ở các đích chính. Đã kiểm link tại Về chúng tôi tới đúng tiêu đề Hành trình. |
| U02 | Tìm kiếm có kết quả hoặc xem tất cả | Đã sửa tìm theo tên có/không dấu, tên gốc, nhóm và mã. Kết quả rỗng có nút bỏ tìm/lọc để xem lại toàn bộ. |
| U03 | Ảnh không chạy khi gõ | Đã bỏ Motion layout/popLayout/exit và độ trễ theo số thứ tự ở kết quả tìm kiếm. |
| U04 | Slide ổn định | Hành trình chuyển theo thao tác người dùng; giữ reduced motion. Cần khách duyệt cảm nhận chuyển động trên điện thoại thực tế. |
| U05 | Chữ chạy không chồng lúc lặp | Hai nhóm chữ có kích thước tự nhiên, không co; nhịp vòng 70 giây và khoảng cuối nhóm cố định; reduced motion dừng chạy. |
| U06 | From growing regions cân đối | Hàng thumbnail dùng chung kích thước ảnh và kiểu chữ; trên mobile cuộn ngang có điểm dừng. |
| U07 | Danh mục xuất khẩu một bố cục | Đã sửa thẻ điều/cà phê cùng cấu trúc ảnh trên/chữ dưới như các thẻ khác. |
| U08 | 01/04 và giới thiệu trong khung bo tròn | **Cần đối chiếu đúng ảnh khách phản ánh**: bản hiện tại không có slider tự chạy với nhãn 01/04. Banner là ảnh đơn; Hành trình là 4 bước bấm chọn. Không tự thêm slider khác chỉ để có bộ đếm. |
| U09 | Nút theme/lên đầu không che CTA | Chuyển cả hai nút vào vùng riêng của header, 42px mỗi nút; không còn phủ lên nội dung khi cuộn. Ẩn khi mở dialog. |

## 4. Nhận diện

| ID | Yêu cầu | Xử lý / tiêu chí nghiệm thu |
|---|---|---|
| B01 | Logo, ROSIC, tagline thẳng hàng | Đã sửa khối logo căn giữa, ROSIC/tagline dùng Manrope; giữ biểu tượng vector hiện có. **Chờ duyệt trước/sau** trong bộ bằng chứng. |
| B02 | ROSIC cân đối biểu tượng | Đã đặt tỷ lệ chữ/biểu tượng riêng desktop/mobile. Không coi thiết kế đã được khách duyệt. |
| B03 | Tiếng Anh không dấu | Logo vector ký hiệu + ROSIC + tagline tiếng Anh đều không có dấu tiếng Việt; thuộc tính ALT theo ngôn ngữ. |
| B04 | Màu đúng | Token nhận diện #A77C30, #193B30, #F4D780; bảng tối có nền/chữ tương ứng. Các màu trung tính phụ vẫn phục vụ độ tương phản. |
| B05 | Favicon vector rõ | Giữ SVG vector và các PNG/ICO đã có. Cần kiểm cache/favicon trên production sau triển khai; không hứa Google đổi ngay. |
| B06 | Watermark đồng đều, 3 mẫu | Logo trung tâm tăng alpha từ 16% lên 60%, bổ sung dòng HONG TAM ROSIC GLOBAL bằng đường vector trên ảnh upload. Overlay giao diện và Lightbox có nhận diện. Ba mẫu `watermark-mango.webp`, `watermark-coffee.webp`, `watermark-black-pepper.webp` cần khách duyệt độ đậm. |
| B07 | Icon theo danh mục có chuyển động | Giữ hệ phân loại icon tự động/CMS override; chuyển động hover nhẹ trên menu và dải chữ, tôn trọng reduced motion. Thumbnail ảnh vẫn là ảnh sản phẩm. |

## 5. Mạng xã hội và liên hệ

| ID | Yêu cầu | Xử lý / tiêu chí nghiệm thu |
|---|---|---|
| S01 | Đủ 7 kênh ở footer và liên hệ | Đã sửa và kiểm đủ Email, WhatsApp, LinkedIn, Facebook, Zalo, WeChat, TikTok ở cả hai vị trí. Kênh thiếu có trạng thái cập nhật, không tạo link giả. |
| S02 | Link bấm + QR quét | Đã cập nhật Facebook, WhatsApp Business và WeChat theo thông tin khách gửi 16/10. Giữ nguyên 2 PNG QR chính thức; bấm phóng to ảnh gốc. Bốn ảnh chụp QR ở 1440/390px giải mã đúng. Kênh còn lại tạo QR tại trình duyệt. TikTok chờ link; xem VR5-SOCIAL-UPDATE.md. |
| S03 | WeChat/QR chính thức riêng | Admin có trường URL ảnh QR riêng từng kênh, có thể dùng song song link; khi để trống ảnh, QR được tạo từ link. QR WeChat do nền tảng cung cấp nên dùng ảnh chính thức. |
| S04 | Đồng bộ kênh nhận báo giá | Form lấy WhatsApp/Zalo/email từ Admin. WhatsApp Business khách gửi đã đối chiếu đích 84962284872 để đính kèm đúng yêu cầu sản phẩm. Đổi link sẽ bỏ QR cũ; short link mới chưa xác định số có hướng dẫn sao chép nội dung và mở đúng link mới. |

## 6. Thiết kế và nội dung chung

| ID | Yêu cầu | Xử lý / tiêu chí nghiệm thu |
|---|---|---|
| D01 | CTA chính/phụ/text link | Nút chính nền thương hiệu, nút phụ viền/nền trong, liên kết chữ giữ hệ hiện có. Luồng báo giá có nút nổi bật cho kênh vừa chọn. |
| D02 | Bỏ in nghiêng mọi ngôn ngữ | Đã chặn font-style italic cho em/i/title-accent trên giao diện. |
| D03 | Ngôn ngữ/liên hệ bỏ khung vuông | Giữ picker/contact menu không khung theo CSS hiện có, kiểm cả nền tối. |
| D04 | Khoảng cách khối trang chủ | Chuẩn hóa section spacing theo desktop/mobile, trả lại padding mobile hai bên đều; nhóm ROSIC có giải thích xuống dòng thay vì tràn chữ. |
| D05 | Menu đúng thứ tự | Trang chủ → Sản phẩm → Về chúng tôi → Đối tác → Hành trình → Tin tức → Liên hệ. Bỏ mục Nhãn hiệu riêng khỏi NAV chính; vẫn có danh mục xuất khẩu ở phần nội dung/footer. |
| D06 | Slogan đúng vị trí | Giữ ở banner/Về chúng tôi/khối ROSIC, chỉnh qua nội dung CMS; cần duyệt tổng thể bằng ảnh desktop/mobile. |
| D07 | 5 từ cùng loại từ, có giải thích | Reliable, Origin-conscious, Standardized, Integrity-driven, Customer-centric: đều tính từ/cụm tính từ. Mỗi từ có câu giải thích VI/EN, có thể sửa trong CMS. Không dùng Organic để ngụ ý chứng nhận hữu cơ chưa được cung cấp. |
| D08 | Customer- hiển thị đủ | Bỏ white-space nowrap của từ dài, cho xuống dòng trong ô; không cắt dấu gạch hoặc phần Centric. |

## 7. Admin và bàn giao

| ID | Yêu cầu | Xử lý / tiêu chí nghiệm thu |
|---|---|---|
| A01 | Chỉnh nội dung hiển thị | Bổ sung editor phân nhóm theo 8 ngôn ngữ cho site copy/menu/CTA, câu chuyện, giá trị ROSIC, 4 bước hành trình, bài viết/chính sách, form liên hệ, nhãn báo giá trực tiếp, catalogue xuất khẩu và phản hồi minh họa. Sản phẩm/danh mục có editor bản dịch riêng; ảnh hành trình/tin tức đồng bộ qua các ngôn ngữ. Các nhãn hệ thống và tài sản vector còn cần đối chiếu trong phần “Giới hạn”. |
| A02 | Watermark tự động đậm + chuẩn tên | Đã sửa pipeline server; ảnh sản phẩm upload mới có logo/info bằng pixel, vẫn thấy khi mở trực tiếp URL. Tên file loại dấu/ký tự đặc biệt và thêm hong-tam-rosic.webp. Không tự xử lý lại toàn bộ ảnh đã upload ở production. |
| A03 | WebP <150KB + ALT + kích thước | Pipeline từ chối file không nén được dưới 150.000 byte; lưu width/height/bytes. Upload product 1200×1200; CMS có ALT bắt buộc khi xuất bản. Ảnh mới trong bộ VR5 cũng đều dưới giới hạn. |
| A04 | Thêm/bớt danh mục/thẻ/sản phẩm | Giữ CRUD danh mục/sản phẩm và chặn xóa danh mục còn hàng. Bổ sung version dữ liệu để biến thể đã xóa không tự quay lại khi refresh. “Thẻ” hiện là các thẻ sản phẩm/danh mục, chưa có hệ taxonomy tag độc lập. |
| A05 | Preview desktop/mobile | Giữ iframe dùng chính site với dữ liệu nháp; đã kiểm sửa câu chuyện hiện trong preview, không ghi vào published. |
| A06 | Chặn sai mã trước publish | Bổ sung kiểm mã ROS-xxx, ID/mã không trùng, tên/ALT không trống ở client và API. Tạo mới lấy số lớn nhất đang có để tránh trùng do xóa hàng. |
| A07 | Video hướng dẫn CMS | Video minh họa local kèm hướng dẫn bằng chữ; bản ghi dùng phiên Admin mô phỏng để không lộ tài khoản thật, không coi đây là bài thử lưu lên máy chủ production. |
| A08 | Buổi bàn giao | **Chờ lịch và người tham dự từ khách.** Chưa có buổi trực tiếp, chưa đánh dấu hoàn tất. |

## Giới hạn phải đóng trước nghiệm thu toàn bộ

1. Đã triển khai lên tên miền chính và kiểm CMS đọc thật, màn hình đăng nhập, từ chối publish không đăng nhập. Còn kiểm đăng nhập/upload/xuất bản bằng tài khoản quản trị được cấp; không dùng API mô phỏng thay cho bài nghiệm thu này.
2. Đã nhận Facebook, WhatsApp, QR WhatsApp và WeChat; TikTok để chờ theo yêu cầu. Còn thực hiện một yêu cầu desktop và một yêu cầu điện thoại; bên công ty xác nhận nhận đúng nội dung, chụp hai phía.
3. Khách duyệt logo trước/sau, 3 watermark và 2 ảnh đổi nền. Xác nhận tên cỡ điều và quy cách/ảnh thật từng biến thể; ảnh hiện tái sử dụng ảnh minh họa cùng nhóm.
4. CMS đã mở phần văn bản biên tập của trang, catalogue xuất khẩu và phản hồi minh họa. Logo vector, copyright cố định, nhãn thao tác hệ thống/tiện ích, thông báo lỗi và cấu trúc layout vẫn là phần mã nguồn. **Không tuyên bố mọi pixel/nhãn hệ thống đều chỉnh được**; cần thống nhất danh sách trường khóa trước nghiệm thu A01.
5. Danh mục con đang có đủ 13 biến thể khách nêu; các nhóm hàng khác cần khách xác nhận danh sách SKU thực bán. Không suy đoán thêm sản phẩm hoặc thông số chứng nhận.
6. Cần đối chiếu màn hình 01/04 khách phản ánh với bản đúng; cần buổi bàn giao và xác nhận nghiệm thu thực tế.

## Cách chạy lại kiểm tra

```powershell
npm run dev -- --host 127.0.0.1
# Trong terminal khác:
npx playwright test tests/vr5.spec.js tests/admin.spec.js tests/vr4-responsive.spec.js tests/theme-and-rtl.spec.js tests/layout-regressions.spec.js
node --test tests/vr5.validation.node.js tests/product-image.validation.node.js tests/quote.validation.node.js tests/admin-auth.validation.node.js
npm run lint
npm run build
```

Các bài CMS UI dùng API mô phỏng, còn bài xử lý ảnh gọi pipeline Sharp thật. Không dùng số bài pass để thay cho xác nhận gửi/nhận mạng xã hội hay quyền truy cập server production.


## Rà soát mobile và PWA bổ sung

Đã rà lại cả 7 nhóm và làm sâu 4 nhóm báo giá/sản phẩm/điều hướng/thiết kế chung. Chi tiết, ma trận màn hình, thay đổi vùng chạm, hiệu ứng, PWA và các mục còn chờ: [VR5-MOBILE-REVIEW.md](VR5-MOBILE-REVIEW.md). Không coi kết quả mô phỏng là kiểm chứng mọi thiết bị vật lý.
