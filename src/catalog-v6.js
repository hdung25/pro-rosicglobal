/**
 * Catalogue v6 — one taxonomy for the header menu, the filter chips, group
 * pages, Quick View, product pages and the quotation form.
 *
 * Group ids intentionally match the export categories already stored in the
 * CMS, so images and titles edited in Admin keep working. Product codes are
 * stable: fresh fruit and cashew keep their published codes, every other
 * sub-product uses a range per group (coffee 1xx, pepper 2xx, …).
 *
 * Figures are reference specifications for an enquiry. Final values are
 * confirmed by contract, approved sample and lot COA (see SPEC_NOTICE).
 */
import { PRODUCTS } from "./data";
import { VR5_VARIANTS } from "./vr5-catalog";
import { localizeExportCategory } from "./export-catalog-l10n";
import { PRODUCT_NAMES } from "./product-l10n";

export const CATALOG_VERSION = 6;

const IMG = (name) => `/images/vietnam-${name}-w960-hong-tam-rosic.webp`;

/** Group order follows the customer's list; slugs are used in /san-pham/... */
export const GROUPS = [
  { id: "coffee-bean", slug: "ca-phe", image: IMG("green-coffee-beans") },
  { id: "black-pepper", slug: "ho-tieu", image: IMG("black-pepper") },
  { id: "star-anise", slug: "hoa-hoi", image: IMG("star-anise") },
  { id: "cassia", slug: "que", image: IMG("cassia-cinnamon") },
  { id: "desiccated-coconut", slug: "com-dua", image: IMG("desiccated-coconut") },
  { id: "cashew-kernel", slug: "hat-dieu", image: IMG("cashew-nuts") },
  { id: "fresh-fruit", slug: "trai-cay-tuoi", image: IMG("produce") },
  { id: "dried-fruit", slug: "trai-cay-say", image: IMG("dried-fruit") },
  { id: "other", slug: "luong-thuc-thuc-pham", image: IMG("rice") },
];

export const GROUP_NAMES = {
  vi: { "coffee-bean": "Cà phê", "black-pepper": "Hạt tiêu", "star-anise": "Hoa hồi", cassia: "Quế", "desiccated-coconut": "Cơm dừa", "cashew-kernel": "Hạt điều", "fresh-fruit": "Trái cây tươi", "dried-fruit": "Trái cây sấy", other: "Lương thực, thực phẩm khác" },
  en: { "coffee-bean": "Coffee", "black-pepper": "Black & white pepper", "star-anise": "Star anise", cassia: "Cassia", "desiccated-coconut": "Desiccated coconut", "cashew-kernel": "Cashew nuts", "fresh-fruit": "Fresh fruit", "dried-fruit": "Dried fruit", other: "Rice & other foodstuffs" },
  zh: { "coffee-bean": "咖啡", "black-pepper": "胡椒", "star-anise": "八角", cassia: "肉桂", "desiccated-coconut": "椰蓉", "cashew-kernel": "腰果", "fresh-fruit": "新鲜水果", "dried-fruit": "水果干", other: "大米及其他食品" },
  ko: { "coffee-bean": "커피", "black-pepper": "후추", "star-anise": "팔각", cassia: "계피(카시아)", "desiccated-coconut": "건조 코코넛", "cashew-kernel": "캐슈넛", "fresh-fruit": "신선 과일", "dried-fruit": "건조 과일", other: "쌀 및 기타 식품" },
  ja: { "coffee-bean": "コーヒー", "black-pepper": "コショウ", "star-anise": "八角", cassia: "カシア", "desiccated-coconut": "乾燥ココナッツ", "cashew-kernel": "カシューナッツ", "fresh-fruit": "生鮮果物", "dried-fruit": "ドライフルーツ", other: "米・その他食品" },
  ar: { "coffee-bean": "القهوة", "black-pepper": "الفلفل", "star-anise": "اليانسون النجمي", cassia: "القرفة الكاسيا", "desiccated-coconut": "جوز الهند المجفف", "cashew-kernel": "الكاجو", "fresh-fruit": "فواكه طازجة", "dried-fruit": "فواكه مجففة", other: "الأرز وأغذية أخرى" },
  fr: { "coffee-bean": "Café", "black-pepper": "Poivre", "star-anise": "Badiane", cassia: "Cannelle cassia", "desiccated-coconut": "Noix de coco râpée", "cashew-kernel": "Noix de cajou", "fresh-fruit": "Fruits frais", "dried-fruit": "Fruits séchés", other: "Riz et autres denrées" },
  de: { "coffee-bean": "Kaffee", "black-pepper": "Pfeffer", "star-anise": "Sternanis", cassia: "Cassia-Zimt", "desiccated-coconut": "Kokosraspeln", "cashew-kernel": "Cashewkerne", "fresh-fruit": "Frisches Obst", "dried-fruit": "Trockenfrüchte", other: "Reis & weitere Lebensmittel" },
};

export const GROUP_INTRO = {
  "coffee-bean": {
    vi: "Robusta nhân xanh theo sàng 13, 16, 18 ở hai mức làm sạch, hạt vỡ và cà phê rang xay theo yêu cầu.",
    en: "Green Robusta by screen 13, 16 and 18 in cleaned and standard grades, broken beans and roasted & ground coffee to order.",
  },
  "black-pepper": {
    vi: "Tiêu đen FAQ, tiêu sạch ASTA, tiêu trắng và các dòng tiêu nhẹ, tiêu đinh, tiêu pin cho ngành gia vị.",
    en: "Black pepper FAQ, ASTA-cleaned pepper, white pepper and light, pinhead and pin pepper for the spice trade.",
  },
  "star-anise": {
    vi: "Hoa hồi nguyên cánh, hồi vụ thu, hồi vụ xuân và hồi vỡ — chọn theo mùa vụ, kích thước cánh và tỷ lệ vỡ.",
    en: "Whole star anise, autumn and spring crops and broken star anise — selected by crop, petal size and broken ratio.",
  },
  cassia: {
    vi: "Chín quy cách quế từ quế thanh, quế ống, quế điếu đến quế cắt vuông và quế bào vỏ cho ngành gia vị, đồ uống.",
    en: "Nine cassia formats, from split, tube and cigarette cassia to square-cut and scraped cassia for spice and beverage makers.",
  },
  "desiccated-coconut": {
    vi: "Cơm dừa sấy khô hạt mịn, hạt thường, hạt béo và hạt ít béo cho bánh kẹo, thực phẩm và đồ uống.",
    en: "Fine, medium, high-fat and low-fat desiccated coconut for confectionery, food and beverage applications.",
  },
  "cashew-kernel": {
    vi: "Hạt điều theo cỡ và dạng nguyên, cánh, vỡ; grade và tỷ lệ lỗi được chốt bằng mẫu trước báo giá.",
    en: "Cashew kernels by size in whole, split and piece formats; grade and defect ratio are agreed by sample before quotation.",
  },
  "fresh-fruit": {
    vi: "Trái cây nhiệt đới theo mùa cho kênh nhập khẩu, bán lẻ và chế biến, đóng gói theo yêu cầu thị trường đích.",
    en: "Seasonal tropical fruit for import, retail and processing channels, packed to destination-market requirements.",
  },
  "dried-fruit": {
    vi: "Dòng trái cây sấy giòn và sấy dẻo. Danh sách sản phẩm chi tiết đang được bổ sung.",
    en: "Crispy and soft dried fruit lines. The detailed product list is being prepared.",
  },
  other: {
    vi: "Gạo trắng xuất khẩu 5% tấm và các mặt hàng lương thực, thực phẩm theo yêu cầu riêng.",
    en: "White export rice with 5% broken and other foodstuffs sourced to your specification.",
  },
};

/** Spec rows always shown, in this order (customer item 13). */
export const SPEC_KEYS = ["code", "moisture", "impurity", "size", "color", "packing", "container", "standard"];

export const SPEC_LABELS = {
  vi: { code: "Mã sản phẩm", moisture: "Độ ẩm", impurity: "Tạp chất", size: "Độ dày / quy cách", color: "Màu sắc", packing: "Đóng gói", container: "Hệ số xếp container", standard: "Quy chuẩn áp dụng", notApplicable: "Không áp dụng" },
  en: { code: "Product code", moisture: "Moisture", impurity: "Foreign matter", size: "Size / thickness / format", color: "Colour", packing: "Packing", container: "Container loading", standard: "Applicable standard", notApplicable: "Not applicable" },
  zh: { code: "产品编号", moisture: "水分", impurity: "杂质", size: "厚度 / 规格", color: "颜色", packing: "包装", container: "装柜量", standard: "适用标准", notApplicable: "不适用" },
  ko: { code: "제품 코드", moisture: "수분", impurity: "이물질", size: "두께 / 규격", color: "색상", packing: "포장", container: "컨테이너 적재량", standard: "적용 기준", notApplicable: "해당 없음" },
  ja: { code: "商品コード", moisture: "水分", impurity: "異物", size: "厚さ / 規格", color: "色", packing: "梱包", container: "コンテナ積載量", standard: "適用規格", notApplicable: "該当なし" },
  ar: { code: "رمز المنتج", moisture: "الرطوبة", impurity: "الشوائب", size: "السماكة / المواصفة", color: "اللون", packing: "التعبئة", container: "سعة الحاوية", standard: "المعيار المطبق", notApplicable: "لا ينطبق" },
  fr: { code: "Code produit", moisture: "Humidité", impurity: "Impuretés", size: "Épaisseur / calibre", color: "Couleur", packing: "Conditionnement", container: "Chargement conteneur", standard: "Norme applicable", notApplicable: "Sans objet" },
  de: { code: "Produktcode", moisture: "Feuchtigkeit", impurity: "Fremdbestandteile", size: "Stärke / Format", color: "Farbe", packing: "Verpackung", container: "Containerbeladung", standard: "Angewandte Norm", notApplicable: "Nicht zutreffend" },
};

export const SPEC_NOTICE = {
  vi: "Thông số là chỉ tiêu tham chiếu để bắt đầu báo giá. Quy cách cuối cùng được xác nhận bằng hợp đồng, mẫu duyệt và COA của từng lô hàng.",
  en: "Figures are reference specifications for an enquiry. Final specifications are confirmed by contract, approved sample and the COA of each lot.",
};

/* ------------------------------------------------------------------ */
/* Product records. `t` = [vi, en]. Strings shared by both are plain. */
/* ------------------------------------------------------------------ */

const NA = null; // rendered as "Không áp dụng"
const t = (vi, en) => ({ vi, en: en ?? vi });

const greenCoffee = (screen, mm, clean) => ({
  moisture: t("Tối đa 12,5%", "12.5% max"),
  impurity: clean ? t("Tối đa 0,1% · hạt đen vỡ tối đa 0,5%", "0.1% max · black & broken 0.5% max")
    : screen === 13 ? t("Tối đa 1% · hạt đen vỡ tối đa 5%", "1% max · black & broken 5% max")
      : t("Tối đa 0,5% · hạt đen vỡ tối đa 2%", "0.5% max · black & broken 2% max"),
  size: t(`Sàng ${screen} (${mm} mm): tối thiểu 90% trên sàng`, `Screen ${screen} (${mm} mm): 90% min above screen`),
  color: t("Xanh xám tự nhiên, đồng màu", "Natural greyish green, even colour"),
  packing: t("Bao đay 60 kg, bao PP 50 kg hoặc container lót bulk", "60 kg jute bags, 50 kg PP bags or bulk liner"),
  container: t("20'FCL: 19,2 tấn đóng bao (320 bao × 60 kg) · 21,6 tấn bulk", "20'FCL: 19.2 t in bags (320 × 60 kg) · 21.6 t in bulk"),
  standard: t("TCVN 4193:2014 · ISO 10470", "TCVN 4193:2014 · ISO 10470"),
});

const pepperBase = {
  color: t("Đen đến nâu đen tự nhiên", "Natural black to dark brown"),
  packing: t("Bao PP 25 kg hoặc 50 kg, có lớp lót PE theo yêu cầu", "25 kg or 50 kg PP bags, PE liner on request"),
  standard: t("TCVN 7036:2008 · ISO 959-1", "TCVN 7036:2008 · ISO 959-1"),
};

const aniseBase = {
  moisture: t("Tối đa 13,5%", "13.5% max"),
  impurity: t("Tối đa 0,5%", "0.5% max"),
  color: t("Nâu đỏ tự nhiên, không nấm mốc", "Natural reddish brown, mould-free"),
  packing: t("Thùng carton 10 kg hoặc bao PP 20 kg", "10 kg cartons or 20 kg PP bags"),
  container: t("20'FCL: khoảng 5–6 tấn · 40'HC: khoảng 11–12 tấn", "20'FCL: approx. 5–6 t · 40'HC: approx. 11–12 t"),
  standard: t("ISO 11178:1995 (Star anise — Specification)", "ISO 11178:1995 (Star anise — Specification)"),
};

const cassiaBase = {
  moisture: t("Tối đa 13,5%", "13.5% max"),
  impurity: t("Tối đa 0,5% · dầu bay hơi 2–4%", "0.5% max · volatile oil 2–4%"),
  color: t("Nâu đỏ tự nhiên ở mặt vỏ", "Natural reddish brown bark"),
  packing: t("Thùng carton 10 kg hoặc bao PP 20–25 kg", "10 kg cartons or 20–25 kg PP bags"),
  standard: t("ISO 6538:1997 (Cassia — Vietnamese type)", "ISO 6538:1997 (Cassia — Vietnamese type)"),
};

const scraped = t("Nâu vàng sáng (đã bào lớp vỏ ngoài)", "Light golden brown (outer bark scraped)");

const coconutBase = {
  impurity: t("Đốm nâu/đen tối đa 15 đốm/100 g · không lẫn tạp chất lạ", "Specks 15 per 100 g max · no foreign matter"),
  color: t("Trắng tự nhiên", "Natural white"),
  packing: t("Bao kraft nhiều lớp 25 kg, lót PE", "25 kg multi-wall kraft bags with PE liner"),
  container: t("20'FCL: khoảng 12 tấn · 40'HC: khoảng 25 tấn", "20'FCL: approx. 12 t · 40'HC: approx. 25 t"),
  standard: t("CODEX STAN 177-1991 · tiêu chuẩn APCC", "CODEX STAN 177-1991 · APCC standard"),
};

const freshFruit = (size, color, packing, container) => ({
  moisture: NA,
  impurity: NA,
  size,
  color,
  packing,
  container,
  standard: t("Kiểm dịch thực vật, mã số vùng trồng & cơ sở đóng gói; GlobalG.A.P./VietGAP theo thị trường", "Phytosanitary certificate, registered growing area & packhouse codes; GlobalG.A.P./VietGAP per market"),
});

const rice = (length, color) => ({
  moisture: t("Tối đa 14%", "14% max"),
  impurity: t("Tối đa 0,1% · tấm tối đa 5% · thóc tối đa 10 hạt/kg", "0.1% max · broken 5% max · paddy 10 grains/kg max"),
  size: t(`Chiều dài hạt trung bình ${length} · xát kỹ, đánh bóng 2 lần`, `Average grain length ${length} · well milled, double polished`),
  color,
  packing: t("Bao PP 25 kg / 50 kg, in nhãn theo yêu cầu", "25 kg / 50 kg PP bags, private print on request"),
  container: t("20'FCL: khoảng 25 tấn", "20'FCL: approx. 25 t"),
  standard: t("TCVN 11888:2017 (Gạo trắng)", "TCVN 11888:2017 (White rice)"),
});

const cashewSpecs = (size, formVi, formEn) => ({
  moisture: t("Tối đa 5%", "5% max"),
  impurity: t("Không lẫn tạp chất lạ · tỷ lệ lỗi chốt theo grade", "No foreign matter · defect ratio agreed per grade"),
  size: t(`Cỡ ${size} · dạng ${formVi} (xác nhận bằng mẫu, không tự quy đổi sang chuẩn WW)`, `Size ${size.replace("xanh", "green")} · ${formEn} (confirmed by sample, not auto-mapped to WW grades)`),
  color: t("Trắng ngà đến ngà vàng tự nhiên", "Natural white to ivory"),
  packing: t("Túi PE/PA hút chân không hoặc nạp CO₂ 22,68 kg (50 lbs), thùng carton", "Vacuum or CO₂-flushed PE/PA bags of 22.68 kg (50 lbs) in cartons"),
  container: t("20'FCL: 700 thùng ≈ 15,88 tấn", "20'FCL: 700 cartons ≈ 15.88 t"),
  standard: t("TCVN 4850:2010 · AFI Specifications", "TCVN 4850:2010 · AFI Specifications"),
});

function p(group, id, code, image, title, short, specs) {
  return {
    id, code, category: group, image,
    title: title.vi, short: short.vi, description: short.vi,
    alt: title.vi,
    specs: Object.fromEntries(Object.entries(specs).map(([key, value]) => [key, value?.vi ?? value])),
    translations: {
      en: {
        title: title.en, short: short.en, description: short.en, alt: title.en,
        specs: Object.fromEntries(Object.entries(specs).map(([key, value]) => [key, value?.en ?? value])),
      },
    },
  };
}

const COFFEE = [
  p("coffee-bean", "ca-phe-nhan-xanh-s13-clean", "ROS-101", IMG("green-coffee-beans"), t("Cà phê nhân xanh size 13 – Clean", "Green Robusta size 13 – Clean"), t("Robusta sàng 13 đã làm sạch cho cà phê hòa tan và blend giá cạnh tranh.", "Cleaned screen 13 Robusta for soluble coffee and competitive blends."), { ...greenCoffee(13, "5,2", true), impurity: t("Tối đa 0,5% · hạt đen vỡ tối đa 2%", "0.5% max · black & broken 2% max") }),
  p("coffee-bean", "ca-phe-nhan-xanh-s13", "ROS-102", IMG("green-coffee-beans"), t("Cà phê nhân xanh size 13 – Không clean", "Green Robusta size 13 – Non-clean"), t("Robusta sàng 13 quy cách tiêu chuẩn cho chế biến công nghiệp.", "Screen 13 Robusta in standard quality for industrial processing."), { ...greenCoffee(13, "5,2", false), moisture: t("Tối đa 13%", "13% max") }),
  p("coffee-bean", "ca-phe-nhan-xanh-s16-clean", "ROS-103", IMG("green-coffee-beans"), t("Cà phê nhân xanh size 16 – Clean", "Green Robusta size 16 – Clean"), t("Robusta sàng 16 đã làm sạch, hạt đều, phù hợp blend và rang công nghiệp.", "Cleaned screen 16 Robusta with uniform beans for blends and industrial roasting."), greenCoffee(16, "6,3", true)),
  p("coffee-bean", "ca-phe-nhan-xanh-s16", "ROS-104", IMG("green-coffee-beans"), t("Cà phê nhân xanh size 16 – Không clean", "Green Robusta size 16 – Non-clean"), t("Robusta sàng 16 quy cách tiêu chuẩn, chốt tỷ lệ lỗi theo hợp đồng.", "Screen 16 Robusta in standard quality, defect ratio agreed in the contract."), greenCoffee(16, "6,3", false)),
  p("coffee-bean", "ca-phe-nhan-xanh-s18-clean", "ROS-105", IMG("green-coffee-beans"), t("Cà phê nhân xanh size 18 – Clean", "Green Robusta size 18 – Clean"), t("Robusta sàng 18 đã làm sạch kỹ, tỷ lệ đen vỡ và tạp chất thấp cho rang xay cao cấp.", "Screen 18 Robusta, thoroughly cleaned with low black, broken and foreign matter for premium roasting."), greenCoffee(18, "7,1", true)),
  p("coffee-bean", "ca-phe-nhan-xanh-s18", "ROS-106", IMG("green-coffee-beans"), t("Cà phê nhân xanh size 18 – Không clean", "Green Robusta size 18 – Non-clean"), t("Robusta sàng 18 quy cách tiêu chuẩn xuất khẩu, chưa qua công đoạn làm sạch bổ sung.", "Screen 18 Robusta in standard export quality without additional cleaning."), greenCoffee(18, "7,1", false)),
  p("coffee-bean", "ca-phe-nhan-xanh-vo", "ROS-107", IMG("green-coffee-beans"), t("Cà phê nhân xanh hạt vỡ", "Green Robusta broken beans"), t("Hạt vỡ và hạt nhỏ sau phân loại, dùng cho cà phê hòa tan và chiết xuất.", "Broken and small beans from grading, used for soluble coffee and extraction."), {
    moisture: t("Tối đa 13%", "13% max"),
    impurity: t("Tối đa 1%", "1% max"),
    size: t("Hạt vỡ tối thiểu 80% · lọt sàng 12", "Broken beans 80% min · below screen 12"),
    color: t("Xanh xám đến nâu nhạt", "Greyish green to light brown"),
    packing: t("Bao PP 50 kg hoặc bao đay 60 kg", "50 kg PP or 60 kg jute bags"),
    container: t("20'FCL: khoảng 19–20 tấn", "20'FCL: approx. 19–20 t"),
    standard: t("TCVN 4193:2014", "TCVN 4193:2014"),
  }),
  p("coffee-bean", "ca-phe-rang-xay", "ROS-108", "/images/vr5/vietnam-coffee-w960-hong-tam-rosic.webp", t("Cà phê rang xay", "Roasted & ground coffee"), t("Rang theo profile khách chọn, dạng hạt hoặc xay theo phương pháp pha; đóng gói nhãn riêng.", "Roasted to your profile, whole bean or ground for the brewing method; private-label packing available."), {
    moisture: t("Tối đa 5%", "5% max"),
    impurity: t("Không lẫn tạp chất · không phụ gia", "No foreign matter · no additives"),
    size: t("Hạt nguyên hoặc xay mịn / vừa / thô theo cách pha", "Whole bean or fine / medium / coarse grind"),
    color: t("Nâu cánh gián đến nâu đậm theo mức rang", "Medium to dark brown by roast level"),
    packing: t("Túi van một chiều 250 g / 500 g / 1 kg, thùng carton", "One-way valve bags 250 g / 500 g / 1 kg in cartons"),
    container: t("20'FCL: khoảng 8–10 tấn tùy quy cách thùng", "20'FCL: approx. 8–10 t depending on carton"),
    standard: t("TCVN 5250:2015 (cà phê rang) · TCVN 5251:2015 (cà phê bột)", "TCVN 5250:2015 (roasted) · TCVN 5251:2015 (ground)"),
  }),
];

const PEPPER = [
  p("black-pepper", "tieu-den-faq", "ROS-201", IMG("black-pepper"), t("Tiêu đen FAQ", "Black pepper FAQ"), t("Tiêu đen chất lượng trung bình khá (FAQ) 500–550 g/l, dòng hàng phổ biến nhất cho xuất khẩu.", "Fair-average-quality black pepper 500–550 g/l, the most traded export grade."), {
    ...pepperBase,
    moisture: t("Tối đa 13,5%", "13.5% max"),
    impurity: t("Tối đa 1% · hạt nhẹ tối đa 5%", "1% max · light berries 5% max"),
    size: t("Dung trọng 500 g/l hoặc 550 g/l", "Bulk density 500 g/l or 550 g/l"),
    container: t("20'FCL: khoảng 13–14 tấn", "20'FCL: approx. 13–14 t"),
  }),
  p("black-pepper", "tieu-sach-asta", "ROS-202", IMG("black-pepper"), t("Tiêu sạch ASTA", "ASTA-cleaned black pepper"), t("Tiêu đen làm sạch theo chuẩn ASTA cho thị trường Mỹ, EU; có thể tiệt trùng hơi nước.", "Black pepper cleaned to ASTA requirements for the US and EU; steam sterilisation available."), {
    ...pepperBase,
    moisture: t("Tối đa 12,5%", "12.5% max"),
    impurity: t("Tối đa 0,2% · đạt chỉ tiêu sạch ASTA", "0.2% max · meets ASTA cleanliness"),
    size: t("Dung trọng 550–570 g/l", "Bulk density 550–570 g/l"),
    color: t("Đen đồng nhất", "Uniform black"),
    container: t("20'FCL: khoảng 14–15 tấn", "20'FCL: approx. 14–15 t"),
    standard: t("ASTA Cleanliness Specifications · ESA (EU)", "ASTA Cleanliness Specifications · ESA (EU)"),
  }),
  p("black-pepper", "tieu-trang", "ROS-203", "/images/vr5/vietnam-black-pepper-w960-hong-tam-rosic.webp", t("Tiêu trắng", "White pepper"), t("Tiêu sọ đã bóc vỏ, mùi thơm sạch, dùng cho gia vị cao cấp và thực phẩm sáng màu.", "Decorticated white pepper with a clean aroma for premium seasoning and light-coloured foods."), {
    ...pepperBase,
    moisture: t("Tối đa 13%", "13% max"),
    impurity: t("Tối đa 0,2% · hạt đen tối đa 1%", "0.2% max · black berries 1% max"),
    size: t("Dung trọng 600–630 g/l", "Bulk density 600–630 g/l"),
    color: t("Trắng ngà đến vàng kem", "Ivory to creamy white"),
    container: t("20'FCL: khoảng 16–17 tấn", "20'FCL: approx. 16–17 t"),
    standard: t("TCVN 7037:2002 · ISO 959-2", "TCVN 7037:2002 · ISO 959-2"),
  }),
  p("black-pepper", "tieu-nhe", "ROS-204", IMG("black-pepper"), t("Tiêu nhẹ", "Light pepper"), t("Hạt tiêu lép, nhẹ sau phân loại, dùng cho chiết xuất dầu tiêu và tiêu xay giá cạnh tranh.", "Light, hollow berries from grading, used for oleoresin extraction and value ground pepper."), {
    ...pepperBase,
    moisture: t("Tối đa 14%", "14% max"),
    impurity: t("Tối đa 2%", "2% max"),
    size: t("Dung trọng 200–300 g/l", "Bulk density 200–300 g/l"),
    color: t("Nâu đen đến nâu nhạt", "Dark to light brown"),
    container: t("20'FCL: khoảng 8–10 tấn", "20'FCL: approx. 8–10 t"),
    standard: t("Theo hợp đồng và mẫu duyệt", "Per contract and approved sample"),
  }),
  p("black-pepper", "tieu-dinh", "ROS-205", IMG("black-pepper"), t("Tiêu đinh", "Tieu dinh pepper (small berries)"), t("Hạt tiêu nhỏ, chắc, tách riêng sau sàng; cỡ hạt chốt theo mẫu duyệt.", "Small, firm berries separated after screening; berry size agreed by sample."), {
    ...pepperBase,
    moisture: t("Tối đa 13,5%", "13.5% max"),
    impurity: t("Tối đa 1%", "1% max"),
    size: t("Hạt nhỏ, kích cỡ chốt theo mẫu duyệt", "Small berries, size agreed by sample"),
    container: t("20'FCL: khoảng 12–13 tấn", "20'FCL: approx. 12–13 t"),
    standard: t("TCVN 7036:2008 · theo mẫu duyệt", "TCVN 7036:2008 · per approved sample"),
  }),
  p("black-pepper", "tieu-pin", "ROS-206", IMG("black-pepper"), t("Tiêu pin (1–2,5 mm)", "Pin pepper (1–2.5 mm)"), t("Tiêu hạt rất nhỏ 1–2,5 mm cho xay bột và gia vị trộn.", "Very small 1–2.5 mm berries for grinding and seasoning blends."), {
    ...pepperBase,
    moisture: t("Tối đa 13,5%", "13.5% max"),
    impurity: t("Tối đa 1%", "1% max"),
    size: t("Cỡ hạt 1–2,5 mm", "Berry size 1–2.5 mm"),
    container: t("20'FCL: khoảng 12–13 tấn", "20'FCL: approx. 12–13 t"),
  }),
];

const ANISE = [
  p("star-anise", "hoa-hoi-nguyen-canh", "ROS-301", IMG("star-anise"), t("Hoa hồi nguyên cánh", "Whole star anise"), t("Hoa hồi đủ cánh, màu đẹp, hương thơm đậm cho gia vị nguyên và chiết xuất.", "Complete star anise with good colour and strong aroma for whole spice and extraction."), {
    ...aniseBase,
    size: t("Đủ 6–8 cánh, nguyên bông tối thiểu 80%", "6–8 petals, whole stars 80% min"),
  }),
  p("star-anise", "hoi-vu-thu", "ROS-302", IMG("star-anise"), t("Hồi vụ thu", "Autumn-crop star anise"), t("Hồi thu hoạch vụ thu (tháng 8–10): cánh to, dày, hàm lượng tinh dầu cao.", "Harvested in autumn (Aug–Oct): large, thick petals with high essential-oil content."), {
    ...aniseBase,
    size: t("Cánh từ 2,5 cm, nguyên bông tối thiểu 80%", "Petals 2.5 cm and up, whole stars 80% min"),
    color: t("Nâu đỏ đậm tự nhiên", "Natural deep reddish brown"),
  }),
  p("star-anise", "hoi-vu-xuan", "ROS-303", IMG("star-anise"), t("Hồi vụ xuân", "Spring-crop star anise"), t("Hồi vụ xuân (tháng 3–4): cánh nhỏ hơn, giá cạnh tranh cho gia vị xay.", "Spring crop (Mar–Apr): smaller petals at a competitive price for ground spice."), {
    ...aniseBase,
    size: t("Cánh từ 2 cm, nguyên bông tối thiểu 80%", "Petals 2 cm and up, whole stars 80% min"),
    color: t("Nâu đỏ sáng tự nhiên", "Natural light reddish brown"),
  }),
  p("star-anise", "hoi-vo", "ROS-304", IMG("star-anise"), t("Hồi vỡ", "Broken star anise"), t("Cánh hồi rời và hồi vỡ sau phân loại, dùng cho xay bột và chưng cất tinh dầu.", "Loose petals and broken stars from grading, for grinding and oil distillation."), {
    ...aniseBase,
    impurity: t("Tối đa 1%", "1% max"),
    size: t("Cánh rời, tỷ lệ vỡ và kích thước chốt bằng mẫu", "Loose petals; broken ratio and size agreed by sample"),
    packing: t("Bao PP 20–30 kg", "20–30 kg PP bags"),
    container: t("20'FCL: khoảng 7–8 tấn", "20'FCL: approx. 7–8 t"),
  }),
];

const CASSIA = [
  p("cassia", "que-thanh", "ROS-401", IMG("cassia-cinnamon"), t("Quế thanh", "Split cassia"), t("Quế bóc tách thành thanh dẹt, dày đều, dùng cho gia vị nguyên và xay bột.", "Flat split cassia of even thickness for whole spice and grinding."), {
    ...cassiaBase,
    size: t("Dài 30–50 cm · rộng 2–5 cm · dày 1,5–3 mm", "Length 30–50 cm · width 2–5 cm · thickness 1.5–3 mm"),
    container: t("20'FCL: khoảng 10–11 tấn", "20'FCL: approx. 10–11 t"),
  }),
  p("cassia", "que-vun", "ROS-402", IMG("cassia-cinnamon"), t("Quế vụn", "Broken cassia"), t("Mảnh quế vụn sau phân loại, nguyên liệu kinh tế cho xay bột và chiết xuất.", "Broken cassia pieces from grading, an economical input for grinding and extraction."), {
    ...cassiaBase,
    moisture: t("Tối đa 14%", "14% max"),
    impurity: t("Tối đa 1% · dầu bay hơi 1,5–3%", "1% max · volatile oil 1.5–3%"),
    size: t("Mảnh 2–10 cm, dày 1–3 mm", "Pieces 2–10 cm, 1–3 mm thick"),
    packing: t("Bao PP 25–30 kg", "25–30 kg PP bags"),
    container: t("20'FCL: khoảng 11–12 tấn", "20'FCL: approx. 11–12 t"),
  }),
  p("cassia", "que-ong", "ROS-403", IMG("cassia-cinnamon"), t("Quế ống", "Tube cassia"), t("Vỏ quế cuộn tròn tự nhiên thành ống, hình thức đẹp cho bán lẻ và trang trí món.", "Bark naturally rolled into tubes, attractive for retail and presentation."), {
    ...cassiaBase,
    size: t("Dài 30–40 cm · đường kính ống 1,5–3 cm · dày 1–2 mm", "Length 30–40 cm · tube Ø 1.5–3 cm · thickness 1–2 mm"),
    container: t("20'FCL: khoảng 7–8 tấn", "20'FCL: approx. 7–8 t"),
  }),
  p("cassia", "que-cat-tron", "ROS-404", IMG("cassia-cinnamon"), t("Quế cắt tròn", "Round-cut cassia"), t("Ống quế cắt khúc đều theo chiều dài đặt hàng, tiện đóng gói bán lẻ.", "Cassia tubes cut into even lengths to order, ready for retail packing."), {
    ...cassiaBase,
    size: t("Cắt đoạn 4–10 cm theo yêu cầu · đường kính 1–3 cm", "Cut lengths 4–10 cm to order · Ø 1–3 cm"),
    container: t("20'FCL: khoảng 8–9 tấn", "20'FCL: approx. 8–9 t"),
  }),
  p("cassia", "que-bao-vo", "ROS-405", IMG("cassia-cinnamon"), t("Quế bào vỏ", "Scraped cassia"), t("Quế đã bào lớp vỏ ngoài, màu sáng, hương ngọt dịu cho thị trường khó tính.", "Cassia with the outer bark scraped off — lighter colour and a sweeter aroma for demanding markets."), {
    ...cassiaBase,
    size: t("Thanh dài 30–40 cm · dày 1–2 mm", "Sticks 30–40 cm · thickness 1–2 mm"),
    color: scraped,
    container: t("20'FCL: khoảng 8 tấn", "20'FCL: approx. 8 t"),
  }),
  p("cassia", "que-cat-vuong-con-vo", "ROS-406", IMG("cassia-cinnamon"), t("Quế cắt vuông còn vỏ", "Square-cut cassia (unscraped)"), t("Quế cắt miếng vuông giữ lớp vỏ ngoài, dùng cho trà, đồ uống và gia vị túi lọc.", "Square-cut cassia with bark retained, for tea, beverages and spice infusions."), {
    ...cassiaBase,
    size: t("Miếng 4 × 4 cm hoặc 5 × 5 cm · dày 2–4 mm", "Pieces 4 × 4 cm or 5 × 5 cm · thickness 2–4 mm"),
    packing: t("Bao PP 25 kg hoặc thùng carton 10 kg", "25 kg PP bags or 10 kg cartons"),
    container: t("20'FCL: khoảng 10–12 tấn", "20'FCL: approx. 10–12 t"),
  }),
  p("cassia", "que-cat-vuong-bao-vo", "ROS-407", IMG("cassia-cinnamon"), t("Quế cắt vuông bào vỏ", "Square-cut cassia (scraped)"), t("Quế cắt vuông đã bào vỏ, màu sáng đều, hợp sản phẩm cao cấp.", "Scraped square-cut cassia with even light colour for premium products."), {
    ...cassiaBase,
    size: t("Miếng 4 × 4 cm hoặc 5 × 5 cm · dày 2–4 mm", "Pieces 4 × 4 cm or 5 × 5 cm · thickness 2–4 mm"),
    color: scraped,
    packing: t("Bao PP 25 kg hoặc thùng carton 10 kg", "25 kg PP bags or 10 kg cartons"),
    container: t("20'FCL: khoảng 10–12 tấn", "20'FCL: approx. 10–12 t"),
  }),
  p("cassia", "que-bao-ong-sao", "ROS-408", IMG("cassia-cinnamon"), t("Quế bào ống sáo", "Scraped tube cassia"), t("Quế bào vỏ cuộn tròn đều như ống sáo, hình thức đẹp cho bán lẻ cao cấp.", "Scraped cassia rolled into even, flute-like tubes for premium retail."), {
    ...cassiaBase,
    size: t("Dài 30–40 cm (hoặc cắt theo yêu cầu) · đường kính 1–2 cm", "Length 30–40 cm (or cut to order) · Ø 1–2 cm"),
    color: scraped,
    container: t("20'FCL: khoảng 7–8 tấn", "20'FCL: approx. 7–8 t"),
  }),
  p("cassia", "que-dieu", "ROS-409", IMG("cassia-cinnamon"), t("Quế điếu", "Cigarette cassia"), t("Quế cuộn chặt dạng điếu, kích thước đồng đều cho đóng gói bán lẻ.", "Tightly rolled cigarette cassia of uniform size for retail packing."), {
    ...cassiaBase,
    size: t("Dài 8–10 cm (6–30 cm theo yêu cầu) · đường kính 0,8–1,2 cm", "Length 8–10 cm (6–30 cm to order) · Ø 0.8–1.2 cm"),
    container: t("20'FCL: khoảng 7–8 tấn", "20'FCL: approx. 7–8 t"),
  }),
];

const COCONUT = [
  p("desiccated-coconut", "com-dua-say-hat-min", "ROS-501", IMG("desiccated-coconut"), t("Cơm dừa sấy khô hạt mịn", "Desiccated coconut — fine grade"), t("Hạt mịn đều cho nhân bánh, kem và thực phẩm cần bề mặt mịn.", "Even fine granules for fillings, creams and smooth-textured foods."), {
    ...coconutBase,
    moisture: t("Tối đa 3% · béo tối thiểu 60% · FFA tối đa 0,3%", "3% max · fat 60% min · FFA 0.3% max"),
    size: t("Hạt mịn (Fine), lọt sàng khoảng 1 mm", "Fine grade, approx. 1 mm granules"),
  }),
  p("desiccated-coconut", "com-dua-say-hat-thuong", "ROS-502", IMG("desiccated-coconut"), t("Cơm dừa sấy khô hạt thường", "Desiccated coconut — medium grade"), t("Hạt cỡ trung (Medium) đa dụng cho bánh kẹo, phủ mặt và ngũ cốc.", "Versatile medium granules for confectionery, toppings and cereals."), {
    ...coconutBase,
    moisture: t("Tối đa 3% · béo tối thiểu 60% · FFA tối đa 0,3%", "3% max · fat 60% min · FFA 0.3% max"),
    size: t("Hạt thường (Medium), khoảng 1,5–3 mm", "Medium grade, approx. 1.5–3 mm"),
  }),
  p("desiccated-coconut", "com-dua-say-hat-beo", "ROS-503", IMG("desiccated-coconut"), t("Cơm dừa sấy khô hạt béo", "Desiccated coconut — high fat"), t("Hàm lượng béo cao, vị dừa đậm cho bánh kẹo và sữa dừa hoàn nguyên.", "High fat content and rich flavour for confectionery and reconstituted coconut milk."), {
    ...coconutBase,
    moisture: t("Tối đa 3% · béo tối thiểu 62% · FFA tối đa 0,3%", "3% max · fat 62% min · FFA 0.3% max"),
    size: t("Hạt mịn hoặc thường theo yêu cầu", "Fine or medium to order"),
  }),
  p("desiccated-coconut", "com-dua-say-hat-it-beo", "ROS-504", IMG("desiccated-coconut"), t("Cơm dừa sấy khô hạt ít béo", "Desiccated coconut — low fat"), t("Đã tách bớt béo, phù hợp ngũ cốc, bánh nướng và sản phẩm giảm béo.", "Partially defatted for cereals, bakery and reduced-fat products."), {
    ...coconutBase,
    moisture: t("Tối đa 4,5% · béo 25–35%", "4.5% max · fat 25–35%"),
    size: t("Hạt mịn hoặc thường theo yêu cầu", "Fine or medium to order"),
  }),
];

const CASHEW = VR5_VARIANTS.filter((item) => item.category === "cashew-kernel").map((item) => {
  const [, size, form] = item.title.match(/^Hạt điều (.+) · (.+)$/) || [];
  const formEn = { nguyên: "whole", cánh: "splits", vỡ: "pieces" }[form] || form;
  return p("cashew-kernel", item.id, item.code, item.image,
    t(item.title, item.englishTitle),
    t(`Hạt điều cỡ ${size}, dạng ${form}. Grade xuất khẩu, tỷ lệ lỗi và mẫu thực tế được xác nhận trước báo giá.`, `Cashew kernels size ${size.replace("xanh", "green")}, ${formEn}. Export grade, defect ratio and physical sample are confirmed before quotation.`),
    cashewSpecs(size, form, formEn));
});

const FRUIT_SPECS = {
  mango: freshFruit(t("300–600 g/quả, phân size theo đơn hàng", "300–600 g per fruit, sized to order"), t("Vỏ xanh chuyển vàng theo độ chín", "Green turning yellow with ripeness"), t("Thùng carton 5 kg hoặc 10 kg, lưới xốp", "5 kg or 10 kg cartons with foam nets"), t("40'RF: khoảng 18–20 tấn", "40'RF: approx. 18–20 t")),
  dragonfruit: freshFruit(t("350–600 g/quả", "350–600 g per fruit"), t("Vỏ đỏ tươi, tai xanh, ruột đỏ", "Bright red skin, green bracts, red flesh"), t("Thùng carton 5 kg hoặc 10 kg", "5 kg or 10 kg cartons"), t("40'RF: khoảng 20 tấn", "40'RF: approx. 20 t")),
  melon: freshFruit(t("1,2–2 kg/quả", "1.2–2 kg per fruit"), t("Vỏ lưới đều, ruột cam", "Even netting, orange flesh"), t("Thùng carton 8–10 kg", "8–10 kg cartons"), t("40'RF: khoảng 18 tấn", "40'RF: approx. 18 t")),
  avocado: freshFruit(t("250–500 g/quả", "250–500 g per fruit"), t("Vỏ xanh bóng, thịt vàng bơ", "Glossy green skin, buttery yellow flesh"), t("Thùng carton 4–10 kg", "4–10 kg cartons"), t("40'RF: khoảng 18–20 tấn", "40'RF: approx. 18–20 t")),
  pineapple: freshFruit(t("1–1,8 kg/quả", "1–1.8 kg per fruit"), t("Vỏ xanh chuyển vàng, thịt vàng", "Green-to-yellow skin, golden flesh"), t("Thùng carton 10–12 kg", "10–12 kg cartons"), t("40'RF: khoảng 20 tấn", "40'RF: approx. 20 t")),
  passionfruit: freshFruit(t("60–100 g/quả", "60–100 g per fruit"), t("Vỏ tím, ruột vàng", "Purple skin, yellow pulp"), t("Thùng carton 3–5 kg", "3–5 kg cartons"), t("40'RF: khoảng 12–15 tấn", "40'RF: approx. 12–15 t")),
  banana: freshFruit(t("Ngón 18–24 cm, nải 1–2 kg", "Fingers 18–24 cm, clusters 1–2 kg"), t("Vỏ xanh già khi xuất", "Mature green at shipment"), t("Thùng carton 13 kg", "13 kg cartons"), t("40'RF: khoảng 1.540 thùng ≈ 20 tấn", "40'RF: approx. 1,540 cartons ≈ 20 t")),
  pomelo: freshFruit(t("1–2 kg/quả", "1–2 kg per fruit"), t("Vỏ xanh đến vàng, tép hồng hoặc trắng", "Green to yellow skin, pink or white segments"), t("Thùng carton 10–15 kg", "10–15 kg cartons"), t("40'RF: khoảng 20–22 tấn", "40'RF: approx. 20–22 t")),
  durian: freshFruit(t("2–5 kg/quả", "2–5 kg per fruit"), t("Vỏ xanh, cơm vàng", "Green husk, yellow flesh"), t("Thùng carton 15–18 kg", "15–18 kg cartons"), t("40'RF: khoảng 18 tấn", "40'RF: approx. 18 t")),
};

const FRUIT_NAMES_EN = { mango: "Mango", dragonfruit: "Red-fleshed dragon fruit", melon: "Netted melon", avocado: "Fresh avocado", pineapple: "Fresh pineapple", passionfruit: "Passion fruit", banana: "Cavendish banana", pomelo: "Fresh pomelo", durian: "Durian" };

const FRUIT = Object.keys(FRUIT_SPECS).map((id) => {
  const source = PRODUCTS.find((item) => item.id === id);
  return p("fresh-fruit", id, source.code || `ROS-${String(PRODUCTS.indexOf(source) + 1).padStart(3, "0")}`, source.image,
    t(source.title, FRUIT_NAMES_EN[id]),
    t(source.short ? `${source.short} ${source.description.split(". ")[0]}.` : source.description, `${FRUIT_NAMES_EN[id]} from Vietnam's growing regions, sized, ripened and packed to destination requirements.`),
    FRUIT_SPECS[id]);
});

const FOOD = [
  p("other", "gao-504-5-tam", "ROS-801", IMG("rice"), t("Gạo 504 5% tấm", "Vietnamese white rice IR504, 5% broken"), t("Gạo trắng hạt dài IR50404, 5% tấm, xát kỹ – nguồn cung ổn định cho thị trường châu Á, châu Phi.", "Long-grain IR50404 white rice, 5% broken, well milled — a steady supply for Asian and African markets."), rice("≥ 6,0 mm", t("Trắng trong, hạt đều", "Translucent white, uniform grains"))),
  p("other", "gao-dt8-5-tam", "ROS-802", IMG("rice"), t("Gạo DT8 5% tấm", "Vietnamese fragrant rice DT8, 5% broken"), t("Gạo thơm Đài Thơm 8, hạt dài, cơm mềm, 5% tấm cho phân khúc gạo thơm.", "Dai Thom 8 fragrant long-grain rice, soft cooked texture, 5% broken for the fragrant segment."), rice("≥ 6,6 mm", t("Trắng trong, thơm nhẹ", "Translucent white, light fragrance"))),
];

export const DEFAULT_PRODUCTS = [...COFFEE, ...PEPPER, ...ANISE, ...CASSIA, ...COCONUT, ...CASHEW, ...FRUIT, ...FOOD]
  .map((product) => ({ ...product, group: GROUP_NAMES.vi[product.category], status: "published" }));

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function normalizeText(value = "") {
  return String(value).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/\s+/g, " ").trim();
}

export const groupBySlug = (slug) => GROUPS.find((group) => group.slug === slug);
export const groupById = (id) => GROUPS.find((group) => group.id === id);

export function groupPath(groupId) {
  return `/san-pham/${groupById(groupId)?.slug ?? groupId}`;
}

export function productPath(product) {
  return `${groupPath(product.category)}/${product.id}`;
}

/**
 * Localise a group, merging any CMS category overrides (image, titles,
 * description, translations) on top of the built-in record.
 */
export function localizeGroup(group, language, cmsCategory, preferCms = false) {
  const base = GROUP_NAMES[language] ?? GROUP_NAMES.en;
  const translation = cmsCategory?.translations?.[language] || {};
  const vi = language === "vi";
  const cmsTitle = vi ? cmsCategory?.shortTitle : translation.shortTitle || translation.title;
  const title = (cmsTitle && cmsTitle !== "Other" ? cmsTitle : null) || base[group.id] || GROUP_NAMES.en[group.id] || cmsCategory?.shortTitle || cmsCategory?.title || group.id;
  const intro = GROUP_INTRO[group.id];
  const cmsDescription = vi ? cmsCategory?.description : translation.description;
  return {
    ...group,
    title,
    sourceTitle: GROUP_NAMES.vi[group.id] ?? cmsCategory?.shortTitle ?? title,
    image: cmsCategory?.image || group.image,
    imageAsset: cmsCategory?.imageAsset,
    alt: (vi ? cmsCategory?.alt : translation.alt) || title,
    // vi/en have written intros; other locales use the reviewed export-catalogue copy.
    // Text saved by Admin in the v6 catalogue wins; otherwise the written intro.
    description: vi
      ? (preferCms && cmsDescription) || intro?.vi || cmsDescription || cmsCategory?.short || ""
      : cmsDescription || (language === "en" ? intro?.en : intro && localizeExportCategory({ id: group.id, title: GROUP_NAMES.vi[group.id], specGroups: [] }, language).description) || intro?.en || cmsCategory?.description || "",
  };
}

/** Localise a product record (CMS or built-in) for display. */
export function localizeCatalogProduct(product, language) {
  const vi = language === "vi";
  const translation = product.translations?.[language] || (vi ? null : product.translations?.en) || {};
  const pick = (key) => (vi ? product[key] : translation[key]?.trim?.() ? translation[key] : product[key]);
  // Fresh fruit already has reviewed names in every locale.
  const knownName = !vi && language !== "en" ? PRODUCT_NAMES[language]?.[product.id] : null;
  const specs = {};
  for (const key of SPEC_KEYS) {
    if (key === "code") continue;
    const own = product.specs?.[key];
    const translated = translation.specs?.[key];
    specs[key] = vi ? own ?? null : translated?.trim?.() ? translated : own ?? null;
  }
  return {
    ...product,
    sourceTitle: product.title,
    title: product.translations?.[language]?.title?.trim?.() || knownName || pick("title"),
    short: pick("short"),
    description: pick("description") || pick("short"),
    alt: pick("alt") || pick("title"),
    specs,
  };
}

/**
 * Build the public catalogue from CMS data. CMS products saved before v6 use
 * the retired fruit/vegetable/nuts taxonomy, so they are replaced by the
 * built-in v6 records; images uploaded for fresh fruit are kept.
 */
export function buildCatalog(cms, language = "vi") {
  const cmsCategories = Array.isArray(cms?.categories) ? cms.categories : [];
  const isV6 = cms?.catalogVersion >= CATALOG_VERSION;
  const hidden = new Set(cmsCategories.filter((item) => item.status === "draft").map((item) => item.id));
  // Categories added in Admin get their own page; ids double as URL slugs.
  const custom = cmsCategories.filter((item) => !GROUPS.some((group) => group.id === item.id))
    .map((item) => ({ id: item.id, slug: item.id, image: item.image, icon: item.icon }));
  // A v6 CMS keeps the order chosen in Admin; older data follows the customer's list.
  const ordered = isV6 && cmsCategories.length
    ? [...cmsCategories.map((item) => GROUPS.find((group) => group.id === item.id) ?? custom.find((group) => group.id === item.id)), ...GROUPS.filter((group) => !cmsCategories.some((item) => item.id === group.id))]
    : [...GROUPS, ...custom];
  const groups = ordered.filter((group) => group && !hidden.has(group.id))
    .map((group) => ({ icon: cmsCategories.find((item) => item.id === group.id)?.icon, ...localizeGroup(group, language, cmsCategories.find((item) => item.id === group.id), isV6) }));
  let source = DEFAULT_PRODUCTS;
  if (cms?.catalogVersion >= CATALOG_VERSION && Array.isArray(cms.products)) {
    source = cms.products;
  } else if (Array.isArray(cms?.products)) {
    const legacyImages = Object.fromEntries(cms.products.filter((item) => item.image?.startsWith("/media/")).map((item) => [item.id, item.image]));
    const customIds = new Set(custom.map((group) => group.id));
    source = [
      ...DEFAULT_PRODUCTS.map((product) => (legacyImages[product.id] ? { ...product, image: legacyImages[product.id] } : product)),
      ...cms.products.filter((product) => customIds.has(product.category)),
    ];
  }
  const groupIds = new Set(groups.map((group) => group.id));
  const products = source
    .filter((product) => product.status !== "draft" && groupIds.has(product.category))
    .map((product) => localizeCatalogProduct(product, language));
  return {
    groups: groups.map((group) => ({ ...group, count: products.filter((product) => product.category === group.id).length })),
    products,
  };
}

/**
 * Submitted search: matches a product name (any language field we hold), its
 * code, or a group name — a group match returns every product in that group.
 */
export function searchCatalog(products, groups, query) {
  const needle = normalizeText(query);
  if (!needle) return products;
  const matchedGroups = new Set(groups.filter((group) => normalizeText(`${group.title} ${group.sourceTitle}`).includes(needle)).map((group) => group.id));
  return products.filter((product) => matchedGroups.has(product.category)
    || normalizeText(`${product.title} ${product.sourceTitle} ${product.code} ${product.translations?.en?.title ?? ""}`).includes(needle));
}
