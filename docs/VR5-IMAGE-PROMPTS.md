# Ảnh VR5 — nguồn và prompt

Công cụ: built-in ImageGen (không dùng CLI/API key). Ảnh sản phẩm gốc là đích chỉnh; ảnh `vietnam-black-pepper-w960-hong-tam-rosic.webp` là tham chiếu vật liệu/màu nền, không lấy hạt tiêu đưa vào ảnh mới.

Prompt chung, dùng riêng cho mỗi ảnh:

> Edit target: image 1 only. Image 2 is background material/color reference only. Replace only the background in image 1 with warm light beige natural travertine stone matching image 2. [INVARIANT] Photorealistic export product catalogue photograph, soft natural light, square composition, full subject visible centered with generous margins. No new props, no pepper from reference 2, no typography, no watermark. Preserve product identity.

INVARIANT cho xoài:

> Preserve the exact single yellow mango, its shape, skin, orientation and natural shadow.

INVARIANT cho cà phê:

> Preserve the exact white ceramic boat-shaped bowl and roasted coffee beans, quantities, orientation and natural shadow.

Đầu ra đã kiểm bằng mắt, chuyển WebP để dùng trong dự án:

- `public/images/vr5/vietnam-mango-w320-hong-tam-rosic.webp` và bản w960.
- `public/images/vr5/vietnam-coffee-w320-hong-tam-rosic.webp` và bản w960.
- `public/images/vr5/vietnam-black-pepper-w320-hong-tam-rosic.webp` và bản w960: chỉ chuẩn hóa kích thước/nén từ ảnh đá be có sẵn, không sinh ảnh tiêu mới.

Watermark được đóng sau bằng Sharp + đường vector của biểu tượng ROSIC; ba mẫu trong `artifacts/vr5/watermark-*.webp`. Các ảnh thay nền là đề xuất chờ duyệt, không phải bằng chứng về lô hàng hay phân loại giống cà phê.
