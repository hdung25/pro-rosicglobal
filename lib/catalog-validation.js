export function validateCatalog(products) {
  const ids = new Set();
  const codes = new Set();
  for (const product of products) {
    if (!product.id || ids.has(product.id)) return "ID sản phẩm bị thiếu hoặc trùng.";
    if (!/^ROS-\d{3}$/.test(product.code || "") || codes.has(product.code)) return "Mã sản phẩm phải có dạng ROS-001 và không được trùng.";
    if (!product.title?.trim() || !product.alt?.trim()) return "Mỗi sản phẩm cần tên và ALT ảnh trước khi xuất bản.";
    ids.add(product.id);
    codes.add(product.code);
  }
  return "";
}
