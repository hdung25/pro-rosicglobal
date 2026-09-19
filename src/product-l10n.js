/**
 * Localized presentation fields for the general product grid.
 *
 * Product records in data.js remain the Vietnamese source of truth for IDs,
 * image paths and any future technical metadata. This module only overlays
 * human-facing copy so a locale change never changes product identity.
 */
const PRODUCT_NAMES = {
  en: {
    mango: "Mango",
    dragonfruit: "Red-fleshed dragon fruit",
    melon: "Netted melon",
    avocado: "Fresh avocado",
    cashews: "Cashew nuts",
    coffee: "Roasted coffee",
    vegetables: "Seasonal vegetables",
    cordyceps: "Cordyceps",
    pineapple: "Fresh pineapple",
    passionfruit: "Passion fruit",
    banana: "Ripe bananas",
    pomelo: "Fresh pomelo",
    durian: "Durian",
    sweetpotato: "Sweet potato",
    rice: "White rice",
    pepper: "Black pepper",
  },
  zh: {
    mango: "芒果",
    dragonfruit: "红心火龙果",
    melon: "网纹甜瓜",
    avocado: "新鲜牛油果",
    cashews: "腰果",
    coffee: "烘焙咖啡",
    vegetables: "时令蔬菜",
    cordyceps: "冬虫夏草",
    pineapple: "新鲜菠萝",
    passionfruit: "百香果",
    banana: "成熟香蕉",
    pomelo: "新鲜柚子",
    durian: "榴莲",
    sweetpotato: "红薯",
    rice: "白米",
    pepper: "黑胡椒",
  },
  ko: {
    mango: "망고",
    dragonfruit: "레드 드래곤프루트",
    melon: "네트멜론",
    avocado: "신선 아보카도",
    cashews: "캐슈넛",
    coffee: "로스팅 커피",
    vegetables: "제철 채소",
    cordyceps: "동충하초",
    pineapple: "신선 파인애플",
    passionfruit: "패션프루트",
    banana: "잘 익은 바나나",
    pomelo: "신선 포멜로",
    durian: "두리안",
    sweetpotato: "고구마",
    rice: "백미",
    pepper: "흑후추",
  },
  ja: {
    mango: "マンゴー",
    dragonfruit: "レッドドラゴンフルーツ",
    melon: "網目メロン",
    avocado: "生アボカド",
    cashews: "カシューナッツ",
    coffee: "焙煎コーヒー",
    vegetables: "季節野菜",
    cordyceps: "冬虫夏草",
    pineapple: "生パイナップル",
    passionfruit: "パッションフルーツ",
    banana: "完熟バナナ",
    pomelo: "生ポメロ",
    durian: "ドリアン",
    sweetpotato: "さつまいも",
    rice: "白米",
    pepper: "黒コショウ",
  },
  ar: {
    mango: "مانجو",
    dragonfruit: "فاكهة التنين الحمراء",
    melon: "شمام شبكي",
    avocado: "أفوكادو طازج",
    cashews: "كاجو",
    coffee: "قهوة محمصة",
    vegetables: "خضروات موسمية",
    cordyceps: "كورديسيبس",
    pineapple: "أناناس طازج",
    passionfruit: "باشن فروت",
    banana: "موز ناضج",
    pomelo: "بوميلو طازج",
    durian: "دوريان",
    sweetpotato: "بطاطا حلوة",
    rice: "أرز أبيض",
    pepper: "فلفل أسود",
  },
  fr: {
    mango: "Mangue",
    dragonfruit: "Pitaya à chair rouge",
    melon: "Melon brodé",
    avocado: "Avocat frais",
    cashews: "Noix de cajou",
    coffee: "Café torréfié",
    vegetables: "Légumes de saison",
    cordyceps: "Cordyceps",
    pineapple: "Ananas frais",
    passionfruit: "Fruit de la passion",
    banana: "Bananes mûres",
    pomelo: "Pomelo frais",
    durian: "Durian",
    sweetpotato: "Patate douce",
    rice: "Riz blanc",
    pepper: "Poivre noir",
  },
  de: {
    mango: "Mango",
    dragonfruit: "Rotfleischige Drachenfrucht",
    melon: "Netzmelone",
    avocado: "Frische Avocado",
    cashews: "Cashewnüsse",
    coffee: "Gerösteter Kaffee",
    vegetables: "Saisongemüse",
    cordyceps: "Cordyceps",
    pineapple: "Frische Ananas",
    passionfruit: "Passionsfrucht",
    banana: "Reife Bananen",
    pomelo: "Frische Pomelo",
    durian: "Durian",
    sweetpotato: "Süßkartoffel",
    rice: "Weißer Reis",
    pepper: "Schwarzer Pfeffer",
  },
};

const GROUP_LABELS = {
  en: {
    fruit: "Fresh fruit",
    vegetables: "Seasonal vegetables",
    nuts: "Nuts & grains",
    processed: "Processed agricultural products",
  },
  zh: {
    fruit: "新鲜水果",
    vegetables: "时令蔬菜",
    nuts: "坚果与谷物",
    processed: "加工农产品",
  },
  ko: {
    fruit: "신선 과일",
    vegetables: "제철 채소",
    nuts: "견과류 및 곡물",
    processed: "가공 농산물",
  },
  ja: {
    fruit: "生鮮果物",
    vegetables: "季節野菜",
    nuts: "ナッツ・穀物",
    processed: "加工農産品",
  },
  ar: {
    fruit: "فواكه طازجة",
    vegetables: "خضروات موسمية",
    nuts: "مكسرات وحبوب",
    processed: "منتجات زراعية معالجة",
  },
  fr: {
    fruit: "Fruits frais",
    vegetables: "Légumes de saison",
    nuts: "Fruits à coque et céréales",
    processed: "Produits agricoles transformés",
  },
  de: {
    fruit: "Frisches Obst",
    vegetables: "Saisongemüse",
    nuts: "Nüsse und Getreide",
    processed: "Verarbeitete Agrarprodukte",
  },
};

const PRODUCT_COPY = {
  en: {
    alt: (name) => "Product photograph of " + name,
    short: {
      fruit: "Tropical freshness, planned around harvest and destination needs.",
      vegetables: "Seasonal variety, prepared around handling and delivery timing.",
      nuts: "A familiar staple, matched to the intended grade and pack.",
      processed: "A prepared product, discussed around format, packing and market needs.",
    },
    description: {
      fruit: (name) => name + " is presented for B2B enquiries. Variety, maturity window, packing and destination requirements are aligned before a batch is confirmed.",
      vegetables: (name) => name + " is introduced for wholesale and food-service enquiries. Product selection, handling, packing and delivery timing are agreed for each order.",
      nuts: (name) => name + " can be discussed by grade, form and packing. Final lot requirements are confirmed with the intended use and destination market.",
      processed: (name) => name + " is introduced as a product range for enquiry. We align the intended format, quality checkpoints, packing and destination requirements before confirmation.",
    },
  },
  zh: {
    alt: (name) => name + "产品图片",
    short: {
      fruit: "呈现热带新鲜风味，并围绕采收期与目的地需求沟通。",
      vegetables: "围绕处理方式与交付时间规划的时令选择。",
      nuts: "日常食材，按预期等级和包装方式沟通。",
      processed: "围绕产品形态、包装与市场需求沟通的加工产品。",
    },
    description: {
      fruit: (name) => name + "面向 B2B 询盘展示。确认批次前，我们会沟通品种、成熟度、包装和目的地要求。",
      vegetables: (name) => name + "适用于批发和餐饮采购沟通。每笔订单会确认品类、处理方式、包装和交付时间。",
      nuts: (name) => name + "可按等级、产品形态和包装方式沟通。最终批次要求会结合用途与目的地市场确认。",
      processed: (name) => name + "作为询盘产品系列展示。确认前，我们会沟通产品形态、质量关注点、包装与目的地要求。",
    },
  },
  ko: {
    alt: (name) => name + " 제품 사진",
    short: {
      fruit: "수확 시기와 도착지 요구에 맞춰 소개하는 열대 과일입니다.",
      vegetables: "취급 방식과 납품 일정에 맞춰 제안하는 제철 품목입니다.",
      nuts: "용도에 맞는 등급과 포장으로 상담하는 친숙한 식재료입니다.",
      processed: "형태, 포장과 시장 요구를 함께 살피는 가공 농산물입니다.",
    },
    description: {
      fruit: (name) => name + "은(는) B2B 상담을 위해 소개하는 제품입니다. 품종, 숙도, 포장 및 도착지 요구 사항을 합의한 뒤 로트를 확인합니다.",
      vegetables: (name) => name + "은(는) 도매와 식자재 상담을 위한 품목입니다. 품종, 취급 방식, 포장과 납품 일정을 주문별로 조율합니다.",
      nuts: (name) => name + "은(는) 등급, 형태와 포장 기준으로 상담할 수 있습니다. 최종 로트 조건은 용도와 도착 시장에 맞춰 확인합니다.",
      processed: (name) => name + "은(는) 문의를 위한 제품군으로 소개합니다. 확정 전 제품 형태, 품질 확인 항목, 포장과 도착지 요구를 함께 조율합니다.",
    },
  },
  ja: {
    alt: (name) => name + "の商品写真",
    short: {
      fruit: "収穫時期と仕向け地の条件に合わせてご案内するトロピカルフルーツです。",
      vegetables: "取り扱い方法と納品時期に合わせてご提案する季節の品目です。",
      nuts: "用途に合わせた等級と梱包でご相談いただける定番食材です。",
      processed: "形態、梱包、マーケットの要件を確認する加工農産品です。",
    },
    description: {
      fruit: (name) => name + "はB2Bのお問い合わせ向けにご紹介する商品です。品種、熟度、梱包、仕向け地の要件をすり合わせてからロットを確認します。",
      vegetables: (name) => name + "は卸売・業務用のお問い合わせに向けた品目です。品種、取り扱い、梱包、納品時期を注文ごとに確認します。",
      nuts: (name) => name + "は等級、形態、梱包についてご相談いただけます。最終ロットの条件は用途と仕向け地に合わせて確認します。",
      processed: (name) => name + "はお問い合わせ用の商品群としてご紹介します。確定前に商品形態、品質確認項目、梱包、仕向け地の要件を確認します。",
    },
  },
  ar: {
    alt: (name) => "صورة المنتج " + name,
    short: {
      fruit: "فواكه استوائية نعرضها وفق موسم الحصاد ومتطلبات سوق الوجهة.",
      vegetables: "خيار موسمي يُخطط له بحسب أسلوب التداول وموعد التسليم.",
      nuts: "منتج مألوف نناقش درجته وتعبئته وفق الاستخدام المقصود.",
      processed: "منتج معالج تُراجع هيئته وتعبئته ومتطلبات سوقه.",
    },
    description: {
      fruit: (name) => "يُعرض " + name + " لاستفسارات الأعمال. نؤكد الصنف ودرجة النضج والتعبئة ومتطلبات سوق الوجهة قبل اعتماد الدفعة.",
      vegetables: (name) => "يُعرض " + name + " لاستفسارات الجملة وخدمات الأغذية. ننسق الصنف والتجهيز والتعبئة وموعد التسليم لكل طلب.",
      nuts: (name) => "يمكن مناقشة " + name + " بحسب الدرجة والشكل والتعبئة. تُؤكد متطلبات الدفعة النهائية وفق الاستخدام وسوق الوجهة.",
      processed: (name) => "يُعرض " + name + " كفئة منتج للاستفسار. ننسق الشكل ونقاط الجودة والتعبئة ومتطلبات سوق الوجهة قبل التأكيد.",
    },
  },
  fr: {
    alt: (name) => "Photographie produit de " + name,
    short: {
      fruit: "Une fraîcheur tropicale pensée selon la récolte et le marché de destination.",
      vegetables: "Une sélection de saison préparée selon la manutention et le calendrier de livraison.",
      nuts: "Un produit familier, défini selon le grade et le conditionnement recherchés.",
      processed: "Un produit transformé à cadrer selon le format, le conditionnement et le marché.",
    },
    description: {
      fruit: (name) => name + " est présenté pour les demandes B2B. Variété, fenêtre de maturité, conditionnement et exigences du marché de destination sont alignés avant confirmation du lot.",
      vegetables: (name) => name + " est proposé pour les échanges avec le commerce de gros et la restauration. La sélection, la manutention, le conditionnement et le calendrier de livraison sont précisés pour chaque commande.",
      nuts: (name) => name + " peut être discuté selon le grade, le format et le conditionnement. Les exigences du lot final sont confirmées selon l'usage et le marché de destination.",
      processed: (name) => name + " est présenté comme une famille de produits pour votre demande. Nous alignons le format, les contrôles qualité, le conditionnement et les exigences de destination avant confirmation.",
    },
  },
  de: {
    alt: (name) => "Produktfotografie von " + name,
    short: {
      fruit: "Tropische Frische, geplant nach Erntefenster und Zielmarkt.",
      vegetables: "Saisonale Auswahl, abgestimmt auf Handling und Liefertermin.",
      nuts: "Ein vertrautes Produkt, abgestimmt auf gewünschten Grad und Verpackung.",
      processed: "Ein verarbeitetes Produkt, besprochen nach Format, Verpackung und Marktbedarf.",
    },
    description: {
      fruit: (name) => name + " wird für B2B-Anfragen vorgestellt. Sorte, Reifezeitraum, Verpackung und Anforderungen des Zielmarkts werden vor Bestätigung einer Charge abgestimmt.",
      vegetables: (name) => name + " ist für Großhandel und Foodservice vorgesehen. Auswahl, Handling, Verpackung und Liefertermin werden je Auftrag vereinbart.",
      nuts: (name) => name + " kann nach Grad, Form und Verpackung besprochen werden. Die Anforderungen der finalen Charge werden mit dem Verwendungszweck und Zielmarkt bestätigt.",
      processed: (name) => name + " wird als Produktgruppe für Anfragen vorgestellt. Vor der Bestätigung stimmen wir Format, Qualitätsprüfungen, Verpackung und Anforderungen des Zielmarkts ab.",
    },
  },
};

/**
 * Returns a new display record while preserving the original stable product
 * identifier, source image path and source-language fields for operational use.
 */
export function localizeProduct(product, language = "vi") {
  if (!product || typeof product !== "object") return product;

  const localized = {
    ...product,
    sourceTitle: product.title,
    sourceGroup: product.group,
  };

  if (language === "vi") return localized;

  const locale = PRODUCT_COPY[language] ?? PRODUCT_COPY.en;
  const title =
    PRODUCT_NAMES[language]?.[product.id] ??
    PRODUCT_NAMES.en[product.id] ??
    product.title;
  const category = product.category;

  return {
    ...localized,
    title,
    group:
      GROUP_LABELS[language]?.[category] ??
      GROUP_LABELS.en[category] ??
      product.group,
    alt: locale.alt(title),
    short: locale.short[category] ?? locale.short.processed,
    description:
      locale.description[category]?.(title) ??
      locale.description.processed(title),
  };
}

export function localizeProducts(products, language = "vi") {
  return products.map((product) => localizeProduct(product, language));
}

