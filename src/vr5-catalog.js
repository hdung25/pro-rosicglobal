// Stable identifiers: new variants never renumber existing products.
const coffee = [
  ["robusta-green", "Robusta nhân xanh", "Robusta green beans", "green-coffee-beans"],
  ["robusta-roasted", "Robusta rang theo yêu cầu", "Robusta roasted to order", "coffee"],
  ["arabica-green", "Arabica nhân xanh", "Arabica green beans", "green-coffee-beans"],
  ["arabica-roasted", "Arabica rang theo yêu cầu", "Arabica roasted to order", "coffee"],
];
export const VR5_VARIANTS = [
  ...coffee.map(([id, title, englishTitle, image], index) => ({
    id, title: `Cà phê ${title}`, englishTitle: `Coffee · ${englishTitle}`,
    code: `ROS-${String(21 + index).padStart(3, "0")}`, category: "coffee-bean", group: "Cà phê",
    image: `/images/${image === "coffee" ? "vr5/" : ""}vietnam-${image}-w960-hong-tam-rosic.webp`,
    alt: `Cà phê ${title}`, short: title,
    description: `${title}. Sàng, phương pháp sơ chế, mức rang, bao gói và mẫu duyệt được xác nhận riêng theo đơn hàng.`,
  })),
  ...["10 xanh", "16", "18"].flatMap((size, sizeIndex) => ["nguyên", "cánh", "vỡ"].map((form, formIndex) => ({
    id: `cashew-${sizeIndex}-${formIndex}`, code: `ROS-${String(25 + sizeIndex * 3 + formIndex).padStart(3, "0")}`,
    title: `Hạt điều ${size} · ${form}`, englishTitle: `Cashew ${size.replace("xanh", "green")} · ${["whole", "splits", "pieces"][formIndex]}`,
    category: "cashew-kernel", group: "Hạt & ngũ cốc",
    image: "/images/vietnam-cashew-nuts-w960-hong-tam-rosic.webp", alt: `Hạt điều ${size}, dạng ${form}`,
    short: `Cỡ ${size} · dạng ${form}`,
    description: `Hạt điều cỡ ${size}, dạng ${form} theo yêu cầu khách hàng. Tên cỡ thương mại, grade xuất khẩu, tỷ lệ lỗi và mẫu thực tế cần được xác nhận trước báo giá; không quy đổi tự động sang chuẩn WW.`,
  }))),
];

export function upgradeProducts(products) {
  if (products.some(product => product.id === "robusta-green")) return products;
  const coded = products.map((product, index) => ({ ...product, code: product.code || `ROS-${String(index + 1).padStart(3, "0")}` }));
  const expanded = coded.flatMap(product => {
    if (["coffee", "greencoffee"].includes(product.id)) return [];
    if (product.id === "cashews") return [];
    return [product];
  });
  const present = new Set(expanded.map(product => product.id));
  return [...expanded, ...VR5_VARIANTS.filter(product => !present.has(product.id)).map(product => ({ ...product, status: "published" }))]
    .map((product, index) => ({ ...product, code: product.code || `ROS-${String(index + 1).padStart(3, "0")}` }));
}
