const NAMES = {
  en: {
    "cashew-kernel": "Cashew kernels",
    cassia: "Cassia cinnamon",
    "black-pepper": "Black pepper",
    "star-anise": "Star anise",
    "coffee-bean": "Coffee beans",
    "desiccated-coconut": "Desiccated coconut",
    "dried-fruit": "Dried fruit",
    "fresh-fruit": "Fresh fruit",
    other: "Other",
  },
  zh: {
    "cashew-kernel": "腰果仁",
    cassia: "肉桂",
    "black-pepper": "黑胡椒",
    "star-anise": "八角",
    "coffee-bean": "咖啡豆",
    "desiccated-coconut": "脱水椰蓉",
    "dried-fruit": "水果干",
    "fresh-fruit": "新鲜水果",
    other: "其他",
  },
  ko: {
    "cashew-kernel": "캐슈넛 커널",
    cassia: "카시아 계피",
    "black-pepper": "흑후추",
    "star-anise": "팔각",
    "coffee-bean": "커피 원두",
    "desiccated-coconut": "건조 코코넛 분말",
    "dried-fruit": "건조 과일",
    "fresh-fruit": "신선 과일",
    other: "기타",
  },
  ja: {
    "cashew-kernel": "カシューナッツカーネル",
    cassia: "カシアシナモン",
    "black-pepper": "黒コショウ",
    "star-anise": "八角",
    "coffee-bean": "コーヒー豆",
    "desiccated-coconut": "乾燥ココナッツ",
    "dried-fruit": "ドライフルーツ",
    "fresh-fruit": "生鮮果物",
    other: "その他",
  },
  ar: {
    "cashew-kernel": "لب الكاجو",
    cassia: "قرفة كاسيا",
    "black-pepper": "فلفل أسود",
    "star-anise": "يانسون نجمي",
    "coffee-bean": "حبوب القهوة",
    "desiccated-coconut": "جوز هند مجفف",
    "dried-fruit": "فواكه مجففة",
    "fresh-fruit": "فواكه طازجة",
    other: "أخرى",
  },
  fr: {
    "cashew-kernel": "Amandes de cajou",
    cassia: "Cannelle cassia",
    "black-pepper": "Poivre noir",
    "star-anise": "Badiane",
    "coffee-bean": "Café en grains",
    "desiccated-coconut": "Noix de coco desséchée",
    "dried-fruit": "Fruits séchés",
    "fresh-fruit": "Fruits frais",
    other: "Autres",
  },
  de: {
    "cashew-kernel": "Cashewkerne",
    cassia: "Cassia-Zimt",
    "black-pepper": "Schwarzer Pfeffer",
    "star-anise": "Sternanis",
    "coffee-bean": "Kaffeebohnen",
    "desiccated-coconut": "Kokosraspel",
    "dried-fruit": "Trockenfrüchte",
    "fresh-fruit": "Frisches Obst",
    other: "Weitere",
  },
};

const TECHNICAL_FACTS = {
  "cashew-kernel": [
    ["grades", "WW180 / WW210 / WW240 / WW320 / WW450"],
  ],
  cassia: [
    ["stickMoisture", "≤ 13.5%"],
    ["impurities", "≤ 0.5%"],
    ["powderMoisture", "≤ 12%"],
    ["volatileOil", "2-4%"],
    ["packingWhole", "10-20 kg"],
    ["packingPowder", "20-25 kg"],
  ],
  "black-pepper": [
    ["bulkDensity", "P500: 500-550 g/L"],
    ["moisture", "P500: ≤ 13%"],
    ["impurities", "P500: 0.5-1%"],
    ["screen", "5 mm"],
    ["cleanMoisture", "≤ 12.5%"],
    ["cleanImpurities", "≤ 0.2%"],
  ],
  "star-anise": [
    ["moisture", "≤ 13.5%"],
    ["impurities", "≤ 0.5%"],
    ["autumnSize", "≥ 2.5 cm / ≥ 80%"],
    ["springSize", "≥ 2 cm / ≥ 80%"],
    ["packingWhole", "10 or 20 kg"],
    ["packingBroken", "20-30 kg"],
  ],
  "coffee-bean": [
    ["screenRetention", "S16 / S18: ≥ 90%"],
    ["moisture", "≤ 12.5%"],
    ["impurities", "≤ 0.5%"],
    ["blackBroken", "≤ 2%"],
    ["bagWeight", "60 kg"],
  ],
  "desiccated-coconut": [
    ["highFat", "≥ 62%"],
    ["highFatMoisture", "≤ 3%"],
    ["ffa", "≤ 0.3%"],
    ["lowFat", "≥ 25%"],
    ["lowFatMoisture", "≤ 4.5%"],
  ],
  "dried-fruit": [["shelfLife", "3-6 months"]],
  "fresh-fruit": [],
  other: [],
};

const FACT_COPY = {
  en: {
    title: "Reference figures",
    labels: { grades: "Kernel grades", stickMoisture: "Stick moisture", powderMoisture: "Powder moisture", impurities: "Foreign matter", volatileOil: "Volatile oil", packingWhole: "Whole-product packing", packingPowder: "Powder packing", bulkDensity: "Bulk density", moisture: "Moisture", screen: "Screen size", cleanMoisture: "High-clean grade moisture", cleanImpurities: "High-clean grade impurities", autumnSize: "Autumn crop size", springSize: "Spring crop size", packingBroken: "Broken-product packing", screenRetention: "Screen retention", blackBroken: "Black and broken beans", bagWeight: "Bag weight", highFat: "High-fat content", highFatMoisture: "High-fat moisture", ffa: "Free fatty acids", lowFat: "Low-fat content", lowFatMoisture: "Low-fat moisture", shelfLife: "Indicative shelf life" },
  },
  zh: {
    title: "参考数值",
    labels: { grades: "果仁等级", stickMoisture: "桂皮水分", powderMoisture: "桂粉水分", impurities: "杂质", volatileOil: "挥发油", packingWhole: "整品包装", packingPowder: "粉末包装", bulkDensity: "容重", moisture: "水分", screen: "筛孔尺寸", cleanMoisture: "高洁净等级水分", cleanImpurities: "高洁净等级杂质", autumnSize: "秋季八角尺寸", springSize: "春季八角尺寸", packingBroken: "碎品包装", screenRetention: "筛上保留率", blackBroken: "黑豆及碎豆", bagWeight: "单袋重量", highFat: "高脂含量", highFatMoisture: "高脂产品水分", ffa: "游离脂肪酸", lowFat: "低脂含量", lowFatMoisture: "低脂产品水分", shelfLife: "参考保质期" },
  },
  ko: {
    title: "참고 수치",
    labels: { grades: "커널 등급", stickMoisture: "스틱 수분", powderMoisture: "분말 수분", impurities: "이물질", volatileOil: "휘발성 오일", packingWhole: "원물 포장", packingPowder: "분말 포장", bulkDensity: "용적 밀도", moisture: "수분", screen: "스크린 크기", cleanMoisture: "고정선 등급 수분", cleanImpurities: "고정선 등급 이물질", autumnSize: "가을 수확 크기", springSize: "봄 수확 크기", packingBroken: "파쇄품 포장", screenRetention: "스크린 잔류율", blackBroken: "흑두 및 파쇄두", bagWeight: "포대 중량", highFat: "고지방 함량", highFatMoisture: "고지방 제품 수분", ffa: "유리지방산", lowFat: "저지방 함량", lowFatMoisture: "저지방 제품 수분", shelfLife: "참고 유통기한" },
  },
  ja: {
    title: "参考数値",
    labels: { grades: "カーネル等級", stickMoisture: "スティック水分", powderMoisture: "粉末水分", impurities: "異物", volatileOil: "揮発油", packingWhole: "ホール品の梱包", packingPowder: "粉末の梱包", bulkDensity: "かさ密度", moisture: "水分", screen: "スクリーンサイズ", cleanMoisture: "高精選等級の水分", cleanImpurities: "高精選等級の異物", autumnSize: "秋収穫品のサイズ", springSize: "春収穫品のサイズ", packingBroken: "ブロークン品の梱包", screenRetention: "スクリーン残留率", blackBroken: "黒豆・割れ豆", bagWeight: "袋重量", highFat: "高脂肪含有量", highFatMoisture: "高脂肪品の水分", ffa: "遊離脂肪酸", lowFat: "低脂肪含有量", lowFatMoisture: "低脂肪品の水分", shelfLife: "参考賞味期間" },
  },
  ar: {
    title: "أرقام مرجعية",
    labels: { grades: "درجات اللب", stickMoisture: "رطوبة العيدان", powderMoisture: "رطوبة المسحوق", impurities: "الشوائب", volatileOil: "الزيت الطيار", packingWhole: "تعبئة المنتج الكامل", packingPowder: "تعبئة المسحوق", bulkDensity: "الكثافة الحجمية", moisture: "الرطوبة", screen: "مقاس الغربال", cleanMoisture: "رطوبة الدرجة عالية التنظيف", cleanImpurities: "شوائب الدرجة عالية التنظيف", autumnSize: "حجم محصول الخريف", springSize: "حجم محصول الربيع", packingBroken: "تعبئة المنتج المكسّر", screenRetention: "نسبة الاحتفاظ على الغربال", blackBroken: "الحبوب السوداء والمكسورة", bagWeight: "وزن الكيس", highFat: "محتوى الدهن المرتفع", highFatMoisture: "رطوبة المنتج عالي الدهن", ffa: "الأحماض الدهنية الحرة", lowFat: "محتوى الدهن المنخفض", lowFatMoisture: "رطوبة المنتج منخفض الدهن", shelfLife: "مدة الصلاحية المرجعية" },
  },
  fr: {
    title: "Valeurs de référence",
    labels: { grades: "Grades d’amandes", stickMoisture: "Humidité des bâtons", powderMoisture: "Humidité de la poudre", impurities: "Corps étrangers", volatileOil: "Huile volatile", packingWhole: "Conditionnement du produit entier", packingPowder: "Conditionnement de la poudre", bulkDensity: "Densité apparente", moisture: "Humidité", screen: "Taille de crible", cleanMoisture: "Humidité du grade hautement nettoyé", cleanImpurities: "Impuretés du grade hautement nettoyé", autumnSize: "Taille de la récolte d’automne", springSize: "Taille de la récolte de printemps", packingBroken: "Conditionnement du produit brisé", screenRetention: "Rétention au crible", blackBroken: "Grains noirs et brisés", bagWeight: "Poids du sac", highFat: "Teneur élevée en matières grasses", highFatMoisture: "Humidité du produit riche en matières grasses", ffa: "Acides gras libres", lowFat: "Teneur réduite en matières grasses", lowFatMoisture: "Humidité du produit allégé", shelfLife: "Durée de conservation indicative" },
  },
  de: {
    title: "Referenzwerte",
    labels: { grades: "Kernsortierungen", stickMoisture: "Feuchte der Stangen", powderMoisture: "Feuchte des Pulvers", impurities: "Fremdstoffe", volatileOil: "Ätherisches Öl", packingWhole: "Verpackung ganzer Ware", packingPowder: "Pulververpackung", bulkDensity: "Schüttdichte", moisture: "Feuchte", screen: "Siebgröße", cleanMoisture: "Feuchte hochgereinigter Ware", cleanImpurities: "Fremdstoffe hochgereinigter Ware", autumnSize: "Größe der Herbsternte", springSize: "Größe der Frühlingsernte", packingBroken: "Verpackung gebrochener Ware", screenRetention: "Siebrückhalt", blackBroken: "Schwarze und gebrochene Bohnen", bagWeight: "Sackgewicht", highFat: "Fettgehalt High-Fat", highFatMoisture: "Feuchte High-Fat", ffa: "Freie Fettsäuren", lowFat: "Fettgehalt Low-Fat", lowFatMoisture: "Feuchte Low-Fat", shelfLife: "Richtwert Haltbarkeit" },
  },
};

const LOCALES = {
  en: {
    alt: (name) => `Product photograph of ${name}`,
    description: (name) => `${name} prepared to the agreed grade, form and packing for its destination market.`,
    overview: (name) => `Before we issue a quotation, we align the form, quality checkpoints and packing for ${name}.`,
    forms: "Product form, grade and packing agreed for the intended use.",
    checks: ["Grade and appearance", "Lot-level safety", "Packing and documents"],
    scope: "Product scope", format: "Agreed format", scopeValue: (name) => `The grade, size and processing of ${name} are agreed before quotation.`, quality: "Quality framework", check: "Key checks", qualityValue: "Moisture, foreign matter, safety and product-specific checks are confirmed for each lot.", shipment: "Packing and documents", shipping: "Before dispatch", shippingValue: "Packing, labels, approved sample and COA are confirmed before dispatch.",
    notice: "The figures below are enquiry reference points. Final specifications are confirmed in the contract, approved sample and batch COA.",
  },
  zh: {
    alt: (name) => `${name}产品图片`,
    description: (name) => `${name}可按目标市场确认的等级、形态和包装方式交付。`,
    overview: (name) => `报价前，我们会确认${name}的产品形态、质量检查项和包装要求。`,
    forms: "根据预期用途确认产品形态、等级与包装。",
    checks: ["等级与外观", "批次安全", "包装与文件"],
    scope: "产品范围", format: "确认的形态", scopeValue: (name) => `${name}的等级、尺寸和加工方式在报价前确认。`, quality: "质量框架", check: "关键检查项", qualityValue: "水分、杂质、安全指标及产品专项检查项按批次确认。", shipment: "包装与文件", shipping: "发运前", shippingValue: "发运前确认包装、标签、确认样品和 COA。",
    notice: "以下数值仅作询盘参考。最终规格以合同、确认样品和批次 COA 为准。",
  },
  ko: {
    alt: (name) => `${name} 제품 사진`,
    description: (name) => `${name}은(는) 목표 시장에 맞춰 합의한 등급, 형태와 포장으로 준비합니다.`,
    overview: (name) => `견적 전 ${name}의 제품 형태, 품질 확인 항목과 포장 조건을 함께 정합니다.`,
    forms: "용도에 맞춰 제품 형태, 규격과 포장을 정합니다.",
    checks: ["등급과 외관", "로트별 안전성", "포장 및 서류"],
    scope: "제품 범위", format: "합의된 형태", scopeValue: (name) => `${name}의 등급, 크기와 가공 방식은 견적 전에 합의합니다.`, quality: "품질 기준", check: "주요 확인 항목", qualityValue: "수분, 이물질, 안전성 및 제품별 확인 항목을 로트별로 점검합니다.", shipment: "포장 및 서류", shipping: "출고 전", shippingValue: "출고 전 포장, 라벨, 승인 샘플과 COA를 확인합니다.",
    notice: "아래 수치는 문의를 위한 참고 기준입니다. 최종 사양은 계약, 승인 샘플 및 로트별 COA로 확정됩니다.",
  },
  ja: {
    alt: (name) => `${name}の商品写真`,
    description: (name) => `${name}は、対象市場に合わせて合意した等級、形態、梱包でご用意します。`,
    overview: (name) => `見積もり前に、${name}の形状、品質確認項目、梱包条件をすり合わせます。`,
    forms: "用途に合わせ、商品形態、規格、梱包を確認します。",
    checks: ["等級と外観", "ロットごとの安全性", "梱包と書類"],
    scope: "商品範囲", format: "合意した形態", scopeValue: (name) => `${name}の等級、サイズ、加工方法は見積もり前に合意します。`, quality: "品質の考え方", check: "主な確認項目", qualityValue: "水分、異物、安全性、商品別の確認項目をロットごとに確認します。", shipment: "梱包と書類", shipping: "出荷前", shippingValue: "出荷前に梱包、ラベル、承認サンプル、COAを確認します。",
    notice: "以下の数値はお問い合わせ時の参考値です。最終仕様は契約、承認サンプル、ロットごとの COA で確定します。",
  },
  ar: {
    alt: (name) => `صورة المنتج ${name}`,
    description: (name) => `يُجهّز ${name} وفق الدرجة والشكل والتعبئة المتفق عليها للسوق المستهدف.`,
    overview: (name) => `قبل إصدار عرض السعر، نؤكد شكل ${name} ونقاط الجودة والتعبئة المناسبة له.`,
    forms: "يُتفق على الشكل والمقاس والتعبئة وفق الاستخدام المقصود.",
    checks: ["الدرجة والمظهر", "سلامة كل دفعة", "التعبئة والمستندات"],
    scope: "نطاق المنتج", format: "الشكل المتفق عليه", scopeValue: (name) => `تُتفق درجة ${name} وحجمه وطريقة معالجته قبل عرض السعر.`, quality: "إطار الجودة", check: "نقاط الفحص", qualityValue: "تُؤكد الرطوبة والشوائب والسلامة والفحوص الخاصة بالمنتج لكل دفعة.", shipment: "التعبئة والمستندات", shipping: "قبل الشحن", shippingValue: "تُؤكد التعبئة والملصق والعينة المعتمدة وCOA قبل الشحن.",
    notice: "القيم أدناه نقاط مرجعية للاستفسار. تُعتمد المواصفات النهائية في العقد والعينة المعتمدة وCOA الخاص بكل دفعة.",
  },
  fr: {
    alt: (name) => `Photographie produit de ${name}`,
    description: (name) => `${name} est préparé selon le grade, le format et le conditionnement convenus pour le marché de destination.`,
    overview: (name) => `Avant le devis, nous alignons le format, les contrôles qualité et le conditionnement de ${name}.`,
    forms: "Format produit, grade et conditionnement définis selon l’usage prévu.",
    checks: ["Grade et apparence", "Sécurité du lot", "Conditionnement et documents"],
    scope: "Périmètre produit", format: "Format convenu", scopeValue: (name) => `Le grade, la taille et la transformation de ${name} sont définis avant le devis.`, quality: "Cadre qualité", check: "Contrôles clés", qualityValue: "Humidité, corps étrangers, sécurité et contrôles spécifiques sont confirmés pour chaque lot.", shipment: "Conditionnement et documents", shipping: "Avant expédition", shippingValue: "Conditionnement, étiquetage, échantillon approuvé et COA sont confirmés avant expédition.",
    notice: "Les chiffres ci-dessous sont des repères pour la demande. Les spécifications finales sont confirmées par le contrat, l’échantillon approuvé et le COA du lot.",
  },
  de: {
    alt: (name) => `Produktfotografie von ${name}`,
    description: (name) => `${name} wird nach vereinbartem Grad, Format und Verpackung für den Zielmarkt vorbereitet.`,
    overview: (name) => `Vor dem Angebot stimmen wir Format, Qualitätsprüfungen und Verpackung für ${name} ab.`,
    forms: "Produktform, Qualitätsgrad und Verpackung werden für den vorgesehenen Einsatz vereinbart.",
    checks: ["Grad und Erscheinungsbild", "Chargensicherheit", "Verpackung und Unterlagen"],
    scope: "Produktumfang", format: "Vereinbartes Format", scopeValue: (name) => `Grad, Größe und Verarbeitung von ${name} werden vor dem Angebot vereinbart.`, quality: "Qualitätsrahmen", check: "Wichtige Prüfungen", qualityValue: "Feuchte, Fremdstoffe, Sicherheit und produktspezifische Prüfungen werden je Charge bestätigt.", shipment: "Verpackung und Unterlagen", shipping: "Vor dem Versand", shippingValue: "Verpackung, Etikett, freigegebenes Muster und COA werden vor dem Versand bestätigt.",
    notice: "Die folgenden Werte sind Referenzpunkte für die Anfrage. Die endgültigen Spezifikationen werden im Vertrag, mit Freigabemuster und Chargen-COA bestätigt.",
  },
};

export function localizeExportCategory(category, language) {
  if (language === "vi") {
    return { ...category, sourceTitle: category.title, notice: null };
  }

  const locale = LOCALES[language] ?? LOCALES.en;
  const factCopy = FACT_COPY[language] ?? FACT_COPY.en;
  const title = NAMES[language]?.[category.id] ?? NAMES.en[category.id] ?? category.title;
  const factItems = (TECHNICAL_FACTS[category.id] ?? []).map(([key, value]) => ({
    label: factCopy.labels[key] ?? FACT_COPY.en.labels[key] ?? key,
    value,
  }));
  return {
    ...category,
    sourceTitle: category.title,
    title,
    shortTitle: title,
    alt: locale.alt(title),
    description: locale.description(title),
    overview: locale.overview(title),
    forms: locale.forms,
    checks: locale.checks,
    specGroups: [
      ...(factItems.length ? [{ title: factCopy.title, items: factItems }] : []),
      { title: locale.scope, items: [{ label: locale.format, value: locale.scopeValue(title) }] },
      { title: locale.quality, items: [{ label: locale.check, value: locale.qualityValue }] },
      { title: locale.shipment, items: [{ label: locale.shipping, value: locale.shippingValue }] },
    ],
    notice: locale.notice,
  };
}
