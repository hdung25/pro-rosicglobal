# VR5 — Rà soát mobile, chuyển động và PWA

Ngày 16/10/2026. Đọc cùng VR5-CHECKLIST.md; tài liệu này ghi phạm vi thực làm, không thay cho xác nhận nghiệm thu của khách.

## Phạm vi làm sâu

Ưu tiên 4/7 nhóm theo yêu cầu: (1) báo giá, (2) sản phẩm, (3) điều hướng/chuyển động, (6) thiết kế chung. Ba nhóm còn lại được đối chiếu lại; không đánh dấu hoàn tất những việc cần thông tin hoặc xác nhận ngoài website.

| Nhóm | Xử lý/đối chiếu trong lượt này | Còn cần nghiệm thu |
|---|---|---|
| 1. Báo giá | Thao tác chạm từ mã điều → ảnh lớn → chuyển Arabica ROS-024 → form → WhatsApp có đúng mã; không tự gửi tin. Vùng nhập/select/nút gửi đủ lớn, chữ nhập 16px. | Hai thiết bị gửi thật, công ty xác nhận nhận và ảnh chụp hai phía. |
| 2. Sản phẩm | Giữ mỗi SKU riêng; một ảnh chung tránh lặp. Mã ROS hiện trên điện thoại. Kiểm cuộn hộp sản phẩm, chuyển hàng, zoom/đóng/CTA cả màn hình ngang thấp. Cỡ 280–359px chuyển thẻ thành một cột. | Xác nhận grade, ảnh thật cho từng biến thể và duyệt ảnh nền be. |
| 3. Điều hướng, chuyển động | Chạm đủ 7 mục menu. Tablet tới 1100px dùng menu gọn; sửa trường hợp 912px chưa có nút menu. Menu trượt + mục vào lần lượt; banner mở khung ảnh; nút có phản hồi chạm, hover desktop nhẹ. Không chuyển động bố cục khi tìm kiếm. Dừng hiệu ứng mới với reduced motion. | Chưa có ảnh đúng vị trí nhãn 01/04; không tự thêm slider không thuộc bố cục hiện tại. |
| 4. Thương hiệu | Icon PWA mới từ biểu tượng vector gốc + chữ ROSIC Manrope 600 chuyển thành đường vector; đúng ba màu #193B30/#A77C30/#F4D780. Xuất PNG 180/192/512 và bản maskable. Logo chính giữ hiện trạng. | Khách duyệt logo trước/sau và ba mẫu watermark đã bàn giao. |
| 5. Mạng xã hội | Giữ 7 vị trí; Facebook/WhatsApp/WeChat theo thông tin đã cấp. Chạm mở đủ 6 QR đã cấu hình. Link/QR có vùng chạm tối thiểu 44px. TikTok vẫn chờ, sửa trong Admin. | Link TikTok chính thức. |
| 6. Thiết kế chung | Header không chen logo/nút ở màn hình hẹp; xét safe area, bàn phím nhập qua font 16px, ô chọn native, khoảng cách đọc và vùng chạm. Menu/hộp thoại cuộn theo 100dvh; giữ đóng hộp và khôi phục focus. Rà light/dark, RTL và 8 ngôn ngữ. | Kiểm cài đặt/hiển thị trên iPhone và Android vật lý của khách; mô phỏng không chứng minh mọi máy thực tế. |
| 7. Admin | Chạy lại sáu màn hình ở 320/390/768/1280/1440px. Giữ preview desktop/mobile, bản nháp và dữ liệu đã xuất bản tách nhau; không ghi CMS thật trong kiểm thử. | Kiểm đăng nhập/upload/publish có xác thực trên server, chốt trường nội dung khóa, buổi bàn giao. |

## PWA

- Nút “Thêm ROSIC vào màn hình chính” ở footer: dùng hộp cài của trình duyệt nếu có; hướng dẫn Safari/iPhone, Chrome/Android và mở ngoài Zalo/Facebook khi chưa có.
- Không tự bật popup cài đặt. Khi chạy standalone hoặc nhận sự kiện đã cài, nút được ẩn.
- Manifest có id/scope, standalone, màu thương hiệu, icon thường + maskable và shortcut Sản phẩm/Báo giá; Apple touch icon 180px.
- Service worker chỉ lưu màn hình mất mạng và hai icon. HTML luôn lấy từ mạng; không lưu API, Admin, preview hay form. Ngoại tuyến hiển thị trạng thái rõ ràng và nút thử lại; không báo đã gửi yêu cầu. Không cam kết xem toàn bộ catalogue ngoại tuyến.
- Không tự reload giữa lúc khách đang nhập form; bản service worker mới chờ vòng đời trình duyệt. sw.js và manifest được yêu cầu kiểm tra lại trên server.
- Tham khảo nền tảng: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable và https://web.dev/learn/pwa/web-app-manifest.

## Bằng chứng kiểm tra

- 15 cấu hình chạm: 280×653, 320×568, 360×640, 375×667, 390×844, 412×915, 430×932, 540×720, 600×960, 768×1024, 820×1180, 912×1368; ngang 568×320, 667×375, 844×390. Mỗi cấu hình kiểm menu, ngôn ngữ, SKU/zoom/báo giá, 6 QR và hướng dẫn cài; kèm đo các nút chính >=44px.
- Lượt cuối bộ mobile/responsive/theme/footer/WCAG: 32/32 đạt. Hai lỗi ban đầu là test chạy đồng thời dùng chung thư mục trace và điểm chuyển menu 912px; đã tách đầu ra, sửa breakpoint và chạy lại. Không bỏ/force thao tác chạm.
- Quét 20 độ rộng 280–2560px × 8 ngôn ngữ = 160 bố cục; chờ ngôn ngữ/font/layout ổn định trước đo, không có tràn ngang hoặc cắt ngang tiêu đề. File mobile-width-language-audit.json.
- PWA: kiểm đăng ký worker, đúng icon/manifest, ngắt mạng → màn hình offline → kết nối lại → website; cache chỉ có đúng ba file công khai.
- WCAG AA tự động ở 390/1440px cho trang, chi tiết sản phẩm/chính sách; kiểm bổ sung riêng hộp hướng dẫn PWA và trả focus.
- Đây là Chrome mô phỏng viewport/touch, không phải 15 điện thoại vật lý, không thay cho kiểm Safari iOS/Chrome Android thật. Không có số Lighthouse mới hoặc bằng chứng hộp cài hệ điều hành trên điện thoại thật.


## Kiểm trên website chính thức

Deployment dpl_9PB76T3vScHLhqiWC6iVFzTmrZWi — https://rosicglobal.com, build index-CYZptioB.js. Bốn bài luồng chạm thực tế trên 320×568, 390×844, 912×1368, 844×390 đạt, dùng CMS thật và không ghi dữ liệu. Smoke CMS 200/16 bản ghi, không lỗi JavaScript, yêu cầu WhatsApp đúng ROS-024. PWA trên tên miền thật: manifest/worker/icon 200; worker kiểm soát trang; đúng kích thước icon; hướng dẫn cài, trả focus, offline và reconnect đều đạt. Browser chạy phiên kiểm thử riêng, chẩn đoán cài đặt chỉ trả in-incognito; không có thao tác cài native và không dùng kết quả này để tuyên bố đã cài trên iPhone/Android.

Bằng chứng: artifacts/vr5/production-pwa.json, production-pwa-install.png, production-pwa-offline.png, production-smoke.json. Kết quả bổ sung local PWA/VR5 10/10 đạt. Còn các mục nghiệm thu ngoài website trong bảng phía trên.


## Bổ sung WebKit / Safari engine

Đã cài WebKit 26.6 cho kiểm thử, chạy luồng thao tác giống Chrome. Phát hiện lỗi 320px sau khi chọn tên sản phẩm dài: native select làm vùng vẽ tràn 12px mặc dù hộp select có đúng chiều rộng. Chỉ đặt width/ellipsis chưa khắc phục; đã chuyển appearance của ô chọn sang giao diện mũi tên SVG, vẫn dùng select native và picker của hệ điều hành. Bản sửa qua 3 luồng WebKit sạch ở 320×568, 390×844 và 844×390. Có bổ sung vị trí controls RTL và kiểm mở lại menu/chuyển theme tiếng Ả Rập ở 320px. Không coi WebKit trên Windows là iPhone vật lý. Các bài không force click, không bỏ kiểm tràn.


Bản cuối đã lên cả rosicglobal.com và www.rosicglobal.com (HTTP 200, cùng index-CYZptioB.js), deployment dpl_9PB76T3vScHLhqiWC6iVFzTmrZWi. Bốn bài WebKit trên tên miền thật (320/390/ngang/RTL) đạt; ba bài Chrome kiểm lại select/RTL đạt. PWA trên bản cuối kiểm lại icon, worker, offline, reconnect và trả focus đạt. Không có thay đổi dữ liệu CMS.

Chạy lại: `npx playwright test tests/mobile-complete.spec.js tests/vr4-responsive.spec.js tests/theme-and-rtl.spec.js`; PWA production-build local chạy `npm run build`, `npm run preview -- --port 4173`, rồi `npx playwright test tests/pwa.spec.js`. WebKit: `npx playwright install webkit`, rồi `npx playwright test --config playwright.webkit.config.js tests/mobile-complete.spec.js`. Đặt PLAYWRIGHT_BASE_URL=https://rosicglobal.com khi kiểm tên miền thật; các bài luồng mobile tự bỏ mock API ở hostname thật. `node scripts/verify-pwa-production.mjs` kiểm PWA thật.
