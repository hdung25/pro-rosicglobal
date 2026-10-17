import { Apple, Carrot, Coffee, Flower2, Nut, Package, PackageCheck, Sprout, Wheat, CircleDot, Layers, Flame } from "lucide-react";

export const CATEGORY_ICONS = { apple: Apple, carrot: Carrot, coffee: Coffee, flower: Flower2, nut: Nut, package: Package, processed: PackageCheck, sprout: Sprout, wheat: Wheat, coconut: CircleDot, layers: Layers, spice: Flame };
export const CATEGORY_ICON_LABELS = { apple: "Trái cây", carrot: "Rau củ", coffee: "Cà phê", flower: "Hoa hồi", nut: "Hạt", package: "Thực phẩm khác", processed: "Chế biến", sprout: "Nông sản", wheat: "Ngũ cốc", coconut: "Dừa", layers: "Quế", spice: "Gia vị" };
const byId = { "cashew-kernel": "nut", cassia: "layers", "black-pepper": "spice", "star-anise": "flower", "coffee-bean": "coffee", "desiccated-coconut": "coconut", "dried-fruit": "processed", "fresh-fruit": "apple", fruit: "apple", vegetables: "carrot", nuts: "nut", processed: "processed", other: "package" };
export function categoryIconKey(category = {}) {
  if (category.icon && CATEGORY_ICONS[category.icon]) return category.icon;
  if (byId[category.id]) return byId[category.id];
  const text = `${category.shortTitle || ""} ${category.title || ""}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase();
  for (const [pattern, key] of [[/coffee|ca phe/, "coffee"], [/coconut|dua/, "coconut"], [/cashew|nut|hat/, "nut"], [/anise|hoi/, "flower"], [/cinnamon|cassia|que/, "layers"], [/pepper|tieu|spice|gia vi/, "spice"], [/rice|grain|gao|ngu coc/, "wheat"], [/dried|processed|say|che bien/, "processed"], [/vegetable|rau|cu theo mua/, "carrot"], [/fruit|trai cay/, "apple"]]) {
    if (pattern.test(text)) return key;
  }
  return "package";
}
