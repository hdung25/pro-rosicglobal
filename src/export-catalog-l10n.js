const NAMES = {
  en: {
    "cashew-kernel": "Cashew kernels", cassia: "Cassia cinnamon", "black-pepper": "Black pepper", "star-anise": "Star anise", "coffee-bean": "Coffee beans", "desiccated-coconut": "Desiccated coconut", "dried-fruit": "Dried fruit", "finished-cashew": "Finished cashew",
  },
  zh: {
    "cashew-kernel": "腰果仁", cassia: "肉桂", "black-pepper": "黑胡椒", "star-anise": "八角", "coffee-bean": "咖啡豆", "desiccated-coconut": "椰蓉", "dried-fruit": "水果干", "finished-cashew": "成品腰果",
  },
  ko: {
    "cashew-kernel": "캐슈넛 커널", cassia: "계피", "black-pepper": "흑후추", "star-anise": "팔각", "coffee-bean": "커피 원두", "desiccated-coconut": "건조 코코넛", "dried-fruit": "건과일", "finished-cashew": "가공 캐슈넛",
  },
  ja: {
    "cashew-kernel": "カシューナッツカーネル", cassia: "カシアシナモン", "black-pepper": "黒コショウ", "star-anise": "スターアニス", "coffee-bean": "コーヒー豆", "desiccated-coconut": "乾燥ココナッツ", "dried-fruit": "ドライフルーツ", "finished-cashew": "カシューナッツ製品",
  },
  ar: {
    "cashew-kernel": "أنوية الكاجو", cassia: "قرفة كاسيا", "black-pepper": "فلفل أسود", "star-anise": "يانسون نجمي", "coffee-bean": "حبوب القهوة", "desiccated-coconut": "جوز هند مجفف", "dried-fruit": "فواكه مجففة", "finished-cashew": "كاجو جاهز",
  },
  fr: {
    "cashew-kernel": "Noix de cajou", cassia: "Cannelle cassia", "black-pepper": "Poivre noir", "star-anise": "Badiane", "coffee-bean": "Café en grains", "desiccated-coconut": "Noix de coco séchée", "dried-fruit": "Fruits séchés", "finished-cashew": "Cajou fini",
  },
  de: {
    "cashew-kernel": "Cashewkerne", cassia: "Cassia-Zimt", "black-pepper": "Schwarzer Pfeffer", "star-anise": "Sternanis", "coffee-bean": "Kaffeebohnen", "desiccated-coconut": "Kokosraspel", "dried-fruit": "Trockenfrüchte", "finished-cashew": "Veredeltes Cashew",
  },
};

const LOCALES = {
  en: {
    alt: (name) => `Product photograph of ${name}`,
    description: (name) => `${name} prepared to the agreed grade, format and packing for the target market.`,
    overview: (name) => `Confirm the format, quality checkpoints and packing for ${name} before the quotation is issued.`,
    forms: "Format, size and packing selected for the approved application.",
    checks: ["Grade and appearance", "Lot safety", "Packing and documents"],
    scope: "Product scope", format: "Format", scopeValue: (name) => `${name}: grade, size and processing agreed before quotation.`, quality: "Quality framework", check: "Checks", qualityValue: "Moisture, foreign matter, safety and product-specific checks agreed per lot.", shipment: "Packing and documents", shipping: "Shipment", shippingValue: "Packing, labelling, approved sample and COA confirmed before dispatch.",
    notice: "The figures in the Vietnamese view are reference criteria. Final specifications are confirmed by contract, approved sample and batch COA.",
  },
  zh: {
    alt: (name) => `${name}产品图片`,
    description: (name) => `面向目标市场的${name}，可按约定等级、形态和包装交付。`,
    overview: (name) => `报价前确认${name}的产品形态、质量检查点和包装要求。`,
    forms: "根据核准用途确认形态、规格与包装。",
    checks: ["等级与外观", "批次安全", "包装与文件"],
    scope: "产品范围", format: "形态", scopeValue: (name) => `${name}的等级、尺寸和加工方式在报价前确认。`, quality: "质量框架", check: "检查项", qualityValue: "按产品和批次确认水分、杂质、安全指标及专项要求。", shipment: "包装与文件", shipping: "发货", shippingValue: "发运前确认包装、标签、核准样品和 COA。",
    notice: "越南语视图中的数值仅供询盘参考。最终规格以合同、确认样品和批次 COA 为准。",
  },
  ko: {
    alt: (name) => `${name} 제품 사진`,
    description: (name) => `목표 시장에 맞춰 등급, 형태와 포장이 합의된 ${name}입니다.`,
    overview: (name) => `견적 전 ${name}의 제품 형태, 품질 점검 항목과 포장 조건을 확인합니다.`,
    forms: "승인된 용도에 맞춰 형태, 규격과 포장을 선택합니다.",
    checks: ["등급 및 외관", "로트 안전성", "포장 및 서류"],
    scope: "제품 범위", format: "형태", scopeValue: (name) => `${name}의 등급, 크기와 가공 방식을 견적 전에 합의합니다.`, quality: "품질 기준", check: "점검", qualityValue: "수분, 이물질, 안전성 및 제품별 점검 항목을 로트별로 확인합니다.", shipment: "포장 및 서류", shipping: "출고", shippingValue: "출고 전 포장, 라벨, 승인 샘플과 COA를 확인합니다.",
    notice: "베트남어 보기의 수치는 문의용 참조 기준입니다. 최종 사양은 계약, 승인 샘플 및 로트 COA로 확정됩니다.",
  },
  ja: {
    alt: (name) => `${name}の商品写真`,
    description: (name) => `対象市場に合わせ、等級、形状、梱包を合意した${name}です。`,
    overview: (name) => `見積もり前に、${name}の形状、品質確認項目、梱包条件を確認します。`,
    forms: "承認済み用途に合わせて形状、規格、梱包を選定します。",
    checks: ["等級と外観", "ロットの安全性", "梱包と書類"],
    scope: "製品範囲", format: "形状", scopeValue: (name) => `${name}の等級、サイズ、加工方法は見積もり前に合意します。`, quality: "品質枠組み", check: "確認項目", qualityValue: "水分、異物、安全性、製品別の確認項目をロットごとに確認します。", shipment: "梱包と書類", shipping: "出荷", shippingValue: "出荷前に梱包、ラベル、承認サンプル、COAを確認します。",
    notice: "ベトナム語表示の数値はお問い合わせ時の参考値です。最終仕様は契約、承認サンプル、ロットごとの COA で確定します。",
  },
  ar: {
    alt: (name) => `صورة المنتج ${name}`,
    description: (name) => `${name} مُعد وفق الدرجة والشكل والتعبئة المتفق عليها للسوق المستهدف.`,
    overview: (name) => `يتم تأكيد شكل المنتج ونقاط الجودة والتعبئة الخاصة بـ ${name} قبل إصدار عرض السعر.`,
    forms: "يُحدد الشكل والمقاس والتعبئة وفق الاستخدام المعتمد.",
    checks: ["الدرجة والمظهر", "سلامة الدفعة", "التعبئة والمستندات"],
    scope: "نطاق المنتج", format: "الشكل", scopeValue: (name) => `يتم الاتفاق على درجة ${name} وحجمه وطريقة معالجته قبل عرض السعر.`, quality: "إطار الجودة", check: "الفحوص", qualityValue: "تُتفق الرطوبة والشوائب والسلامة والفحوص الخاصة بالمنتج لكل دفعة.", shipment: "التعبئة والمستندات", shipping: "الشحن", shippingValue: "تُؤكد التعبئة والملصق والعينة المعتمدة وCOA قبل الإرسال.",
    notice: "القيم في العرض الفيتنامي هي معايير مرجعية للاستفسار. تُؤكد المواصفات النهائية بالعقد والعينة المعتمدة وCOA لكل دفعة.",
  },
  fr: {
    alt: (name) => `Photographie produit de ${name}`,
    description: (name) => `${name} préparé selon le grade, le format et le conditionnement convenus pour le marché cible.`,
    overview: (name) => `Confirmez le format, les contrôles qualité et le conditionnement de ${name} avant le devis.`,
    forms: "Format, taille et conditionnement choisis pour l'usage approuvé.",
    checks: ["Grade et apparence", "Sécurité du lot", "Conditionnement et documents"],
    scope: "Périmètre produit", format: "Format", scopeValue: (name) => `Le grade, la taille et la transformation de ${name} sont définis avant le devis.`, quality: "Cadre qualité", check: "Contrôles", qualityValue: "Humidité, corps étrangers, sécurité et contrôles spécifiques sont définis par lot.", shipment: "Conditionnement et documents", shipping: "Expédition", shippingValue: "Conditionnement, étiquetage, échantillon approuvé et COA sont confirmés avant l'envoi.",
    notice: "Les chiffres de la vue vietnamienne sont des repères pour la demande. Les spécifications finales sont confirmées par contrat, échantillon approuvé et COA de lot.",
  },
  de: {
    alt: (name) => `Produktfotografie von ${name}`,
    description: (name) => `${name}, vorbereitet nach vereinbartem Grad, Format und Verpackung für den Zielmarkt.`,
    overview: (name) => `Format, Qualitätsprüfungen und Verpackung für ${name} werden vor dem Angebot abgestimmt.`,
    forms: "Format, Größe und Verpackung werden für die freigegebene Anwendung gewählt.",
    checks: ["Grad und Erscheinungsbild", "Chargensicherheit", "Verpackung und Unterlagen"],
    scope: "Produktumfang", format: "Format", scopeValue: (name) => `Grad, Größe und Verarbeitung von ${name} werden vor dem Angebot vereinbart.`, quality: "Qualitätsrahmen", check: "Prüfpunkte", qualityValue: "Feuchte, Fremdstoffe, Sicherheit und produktspezifische Prüfungen werden je Charge abgestimmt.", shipment: "Verpackung und Unterlagen", shipping: "Versand", shippingValue: "Verpackung, Etikett, freigegebenes Muster und COA werden vor dem Versand bestätigt.",
    notice: "Die Werte in der vietnamesischen Ansicht sind Referenzwerte für die Anfrage. Die endgültigen Spezifikationen werden durch Vertrag, Freigabemuster und Chargen-COA bestätigt.",
  },
};

export function localizeExportCategory(category, language) {
  if (language === "vi") return { ...category, sourceTitle: category.title, notice: null };
  const locale = LOCALES[language] ?? LOCALES.en;
  const title = NAMES[language]?.[category.id] ?? NAMES.en[category.id] ?? category.title;
  return {
    ...category,
    sourceTitle: category.title,
    title,
    alt: locale.alt(title),
    description: locale.description(title),
    overview: locale.overview(title),
    forms: locale.forms,
    checks: locale.checks,
    specGroups: [
      { title: locale.scope, items: [{ label: locale.format, value: locale.scopeValue(title) }] },
      { title: locale.quality, items: [{ label: locale.check, value: locale.qualityValue }] },
      { title: locale.shipment, items: [{ label: locale.shipping, value: locale.shippingValue }] },
    ],
    notice: locale.notice,
  };
}
