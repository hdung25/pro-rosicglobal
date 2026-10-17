import { createElement } from "react";
import { Apple, Carrot, Coffee, Package, PackageCheck, Sprout, Wheat, Layers } from "lucide-react";

/*
 * Product-group icons drawn to resemble the real product (customer item 24),
 * in the same 24px / round-stroke style as the lucide set used elsewhere.
 */
function drawn(name, children) {
  const Icon = ({ size = 24, strokeWidth = 1.5, className, ...rest }) =>
    createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: ["lucide", className].filter(Boolean).join(" "),
      ...rest,
    }, ...children.map((child, index) => createElement(child[0], { key: index, ...child[1] })));
  Icon.displayName = name;
  return Icon;
}

/** A cluster of peppercorns on a short stem. */
const Peppercorns = drawn("Peppercorns", [
  ["path", { d: "M12 2.5v3.2M12 5.7c-1.8-.6-3.2-.3-4 .8" }],
  ["circle", { cx: 9, cy: 9.5, r: 2.4 }],
  ["circle", { cx: 14.6, cy: 8.6, r: 2.4 }],
  ["circle", { cx: 7.4, cy: 14.6, r: 2.4 }],
  ["circle", { cx: 12.4, cy: 14, r: 2.4 }],
  ["circle", { cx: 17.2, cy: 13.6, r: 2.2 }],
  ["circle", { cx: 10.2, cy: 19.2, r: 2.2 }],
  ["circle", { cx: 15.2, cy: 18.6, r: 2.2 }],
]);

/** Eight-pointed star anise with seeds in the pods. */
const StarAnise = drawn("StarAnise", [
  ["path", { d: "M12 1.8 13.4 8.6 18.4 4 15.4 10 22.2 12 15.4 14 18.4 20 13.4 15.4 12 22.2 10.6 15.4 5.6 20 8.6 14 1.8 12 8.6 10 5.6 4 10.6 8.6Z" }],
  ["circle", { cx: 12, cy: 12, r: 1.6 }],
]);

/** Two rolled cassia sticks with spiral ends. */
const CassiaSticks = drawn("CassiaSticks", [
  ["path", { d: "M4.2 9.8 15.6 3.2a2.4 2.4 0 0 1 2.4 4.2L6.6 14a2.4 2.4 0 0 1-2.4-4.2Z" }],
  ["path", { d: "M5.6 12.2c-.5-.9.2-1.6.9-1.4" }],
  ["path", { d: "M6.2 16.8 17.6 10.2a2.4 2.4 0 0 1 2.4 4.2L8.6 21a2.4 2.4 0 0 1-2.4-4.2Z" }],
  ["path", { d: "M7.6 19.2c-.5-.9.2-1.6.9-1.4" }],
]);

/** A halved coconut: shell, white flesh and the hollow centre. */
const CoconutHalf = drawn("CoconutHalf", [
  ["path", { d: "M2.5 11.5h19a9.5 9.5 0 0 1-19 0Z" }],
  ["path", { d: "M5.6 11.5a6.4 6.4 0 0 0 12.8 0" }],
  ["path", { d: "M8.5 7.5c1-1.6 2.2-2.5 3.5-2.5s2.5.9 3.5 2.5" }],
  ["path", { d: "M12 5V3" }],
]);

/** A cashew kernel (kidney shape) with its centre line. */
const CashewKernel = drawn("CashewKernel", [
  ["path", { d: "M8.2 4.2c-3.6 2.4-4.8 7.6-2.2 11.4 2.6 3.8 8.4 5 12.2 2.4 2.3-1.6 2.7-4.3.9-5.3-1.6-.9-3.4.1-4.9-.6-1.7-.8-1.6-3-2.1-4.9-.6-2.5-2.3-4.1-3.9-3Z" }],
  ["path", { d: "M8.4 8.2c-.9 2.4-.3 5 1.6 6.8" }],
]);

/** Dried fruit: overlapping dried slices with segments. */
const DriedSlices = drawn("DriedSlices", [
  ["circle", { cx: 9, cy: 10, r: 6.5 }],
  ["circle", { cx: 9, cy: 10, r: 1.2 }],
  ["path", { d: "M9 3.5v5.3M9 11.2v5.3M2.5 10h5.3M10.2 10h5.3M4.4 5.4l3.7 3.7M9.9 10.9l3.7 3.7M13.6 5.4 9.9 9.1M8.1 10.9l-3.7 3.7" }],
  ["path", { d: "M14.6 12.6a6.5 6.5 0 1 1-1.8 8.6" }],
]);

/** A bowl of rice with grains on top. */
const RiceBowl = drawn("RiceBowl", [
  ["path", { d: "M3 12h18a9 9 0 0 1-18 0Z" }],
  ["path", { d: "M8 21h8" }],
  ["path", { d: "M6.5 12c.2-2.6 2.6-4.6 5.5-4.6s5.3 2 5.5 4.6" }],
  ["path", { d: "M9.2 9.6l.6.8M12 8.6v1M14.8 9.6l-.6.8M7.6 11.2l.7.4M16.4 11.2l-.7.4" }],
]);

export const CATEGORY_ICONS = {
  apple: Apple,
  carrot: Carrot,
  coffee: Coffee,
  package: Package,
  processed: PackageCheck,
  sprout: Sprout,
  wheat: Wheat,
  layers: Layers,
  pepper: Peppercorns,
  anise: StarAnise,
  cassia: CassiaSticks,
  coconut: CoconutHalf,
  cashew: CashewKernel,
  dried: DriedSlices,
  rice: RiceBowl,
  // Older CMS values keep working and map to the new drawings.
  flower: StarAnise,
  spice: Peppercorns,
  nut: CashewKernel,
};
export const CATEGORY_ICON_LABELS = { apple: "Trái cây", coffee: "Cà phê", pepper: "Hạt tiêu", anise: "Hoa hồi", cassia: "Quế", coconut: "Cơm dừa", cashew: "Hạt điều", dried: "Trái cây sấy", rice: "Gạo / lương thực", wheat: "Ngũ cốc", carrot: "Rau củ", sprout: "Nông sản", processed: "Chế biến", package: "Thực phẩm khác" };
const byId = { "cashew-kernel": "cashew", cassia: "cassia", "black-pepper": "pepper", "star-anise": "anise", "coffee-bean": "coffee", "desiccated-coconut": "coconut", "dried-fruit": "dried", "fresh-fruit": "apple", fruit: "apple", vegetables: "carrot", nuts: "cashew", processed: "processed", other: "rice" };
export function categoryIconKey(category = {}) {
  if (category.icon && CATEGORY_ICONS[category.icon]) return category.icon;
  if (byId[category.id]) return byId[category.id];
  const text = `${category.shortTitle || ""} ${category.title || ""}`.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").toLowerCase();
  for (const [pattern, key] of [[/coffee|ca phe/, "coffee"], [/coconut|dua/, "coconut"], [/cashew|dieu/, "cashew"], [/anise|hoi/, "anise"], [/cinnamon|cassia|que/, "cassia"], [/pepper|tieu|spice|gia vi/, "pepper"], [/rice|gao|luong thuc/, "rice"], [/grain|ngu coc/, "wheat"], [/dried|say/, "dried"], [/processed|che bien/, "processed"], [/vegetable|rau|cu theo mua/, "carrot"], [/fruit|trai cay/, "apple"]]) {
    if (pattern.test(text)) return key;
  }
  return "package";
}
