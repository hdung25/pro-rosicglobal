// The five letters stay in English; each description follows the page language.
const ROSIC_TEXT = {
  R: { vi: "Giữ đúng cam kết trong từng đơn hàng.", en: "We keep our commitments on every order.", zh: "每一笔订单都信守承诺。", ko: "모든 주문에서 약속을 지킵니다.", ja: "すべての注文で約束を守ります。", ar: "نفي بالتزاماتنا في كل طلب.", fr: "Nous tenons nos engagements à chaque commande.", de: "Wir halten unsere Zusagen bei jeder Bestellung." },
  O: { vi: "Truy xuất được nguồn gốc, trân trọng nơi sản phẩm được tạo ra.", en: "Traceable to origin, with respect for where our products come from.", zh: "可追溯至原产地，尊重产品的来源。", ko: "원산지까지 추적할 수 있으며 제품이 온 곳을 존중합니다.", ja: "原産地まで追跡でき、産地への敬意を大切にします。", ar: "منتجات يمكن تتبعها حتى منشئها، مع احترام مصدرها.", fr: "Traçables jusqu’à l’origine, dans le respect de leur provenance.", de: "Bis zum Ursprung rückverfolgbar, mit Respekt für die Herkunft." },
  S: { vi: "Quy cách nhất quán, được xác nhận trước khi giao hàng.", en: "Consistent specifications, confirmed before shipment.", zh: "规格统一，出货前确认。", ko: "일관된 규격을 선적 전에 확인합니다.", ja: "一貫した仕様を出荷前に確認します。", ar: "مواصفات ثابتة يتم تأكيدها قبل الشحن.", fr: "Des spécifications constantes, confirmées avant expédition.", de: "Einheitliche Spezifikationen, vor dem Versand bestätigt." },
  I: { vi: "Vận hành theo chuẩn mực xuất khẩu quốc tế.", en: "Operating to international export standards.", zh: "按照国际出口标准运营。", ko: "국제 수출 기준에 따라 운영합니다.", ja: "国際的な輸出基準に沿って運営します。", ar: "نعمل وفق معايير التصدير الدولية.", fr: "Nous opérons selon les normes internationales d’exportation.", de: "Wir arbeiten nach internationalen Exportstandards." },
  C: { vi: "Lấy nhu cầu của khách hàng làm trọng tâm.", en: "Built around our customers’ needs.", zh: "以客户需求为核心。", ko: "고객의 필요를 중심으로 합니다.", ja: "お客様のニーズを中心に考えます。", ar: "نبني عملنا حول احتياجات عملائنا.", fr: "Pensé autour des besoins de nos clients.", de: "Ausgerichtet auf die Bedürfnisse unserer Kunden." },
};
const ROSIC_WORDS = [["R", "Reliable", "ShieldCheck"], ["O", "Origin", "Leaf"], ["S", "Standardized", "BadgeCheck"], ["I", "International", "Globe2"], ["C", "Customer", "Users"]];
export const ROSIC_VALUES = ROSIC_WORDS.map(([letter, word, icon]) => ({
  letter,
  word,
  icon,
  explanation: ROSIC_TEXT[letter].vi,
  explanationEn: ROSIC_TEXT[letter].en,
  explanations: ROSIC_TEXT[letter],
}));

/** Description in the page language; Vietnamese/English stay editable in Admin. */
export function rosicExplanation(value, language) {
  if (language === "vi") return value.explanation;
  if (language === "en") return value.explanationEn;
  return value.explanations?.[language] ?? ROSIC_TEXT[value.letter]?.[language] ?? value.explanationEn;
}

const headings = {
  vi: ["Khởi từ Tâm", "Vươn bằng Tầm"],
  en: ["Manufacturing with Heart", "Trading with Vision"],
  zh: ["始于初心", "以远见致远"],
  ko: ["진심에서 시작하여", "비전으로 성장합니다"],
  ja: ["心を起点に", "ビジョンで未来へ"],
  ar: ["ننطلق من القلب", "وننمو بالرؤية"],
  fr: ["Ancrés dans le cœur", "Portés par la vision"],
  de: ["Im Herzen verwurzelt", "Mit Weitblick wachsen"],
};

const internationalBlocks = {
  en: ["Hồng Tâm begins with care: ethical business, honest origins and responsibility toward growers, partners and customers. We value Vietnamese agriculture and build lasting relationships through integrity.", "ROSIC connects Vietnamese agriculture with international markets through sourcing, production coordination, packaging and delivery. Quality, traceability and destination-market requirements are agreed with partners for each product and order."],
  zh: ["Hồng Tâm 始于初心：诚信经营、如实说明原产地，对种植者、合作伙伴和客户负责。我们珍视越南农产品的价值，以诚意建立长久的合作关系。", "ROSIC 通过采购、生产协调、包装与交付，将越南农产品连接到国际市场。每种产品和每笔订单的质量、可追溯性及目标市场要求，都与合作伙伴逐项确认。"],
  ko: ["Hồng Tâm은 정직한 경영, 투명한 원산지 정보, 재배자와 파트너 및 고객에 대한 책임에서 출발합니다. 베트남 농산물의 가치를 소중히 여기며 신뢰를 바탕으로 오래가는 관계를 만듭니다.", "ROSIC은 소싱, 생산 조율, 포장 및 배송을 통해 베트남 농산물을 세계 시장과 연결합니다. 품질, 이력 추적 및 수출 시장의 요건은 제품과 주문별로 파트너와 확인합니다."],
  ja: ["Hồng Tâm の出発点は、誠実な商い、正確な原産地情報、生産者・パートナー・お客様への責任です。ベトナムの農産品の価値を大切にし、信頼に基づく長期的な関係を築きます。", "ROSIC は調達、生産調整、包装、配送を通じて、ベトナムの農産品を国際市場へつなぎます。品質、トレーサビリティ、輸出先市場の要件は、商品・注文ごとにパートナーと確認します。"],
  ar: ["تنطلق Hồng Tâm من النزاهة في العمل ووضوح المنشأ والمسؤولية تجاه المزارعين والشركاء والعملاء. نعتز بقيمة المنتجات الزراعية الفيتنامية ونبني علاقات طويلة الأمد على الثقة.", "تربط ROSIC الزراعة الفيتنامية بالأسواق الدولية عبر التوريد وتنسيق الإنتاج والتعبئة والتسليم. نحدد مع الشركاء متطلبات الجودة والتتبع والسوق المستهدف لكل منتج وطلب."],
  fr: ["Hồng Tâm prend racine dans une pratique éthique, la transparence des origines et la responsabilité envers les producteurs, partenaires et clients. Nous valorisons l’agriculture vietnamienne et construisons des relations durables fondées sur l’intégrité.", "ROSIC relie l’agriculture vietnamienne aux marchés internationaux par l’approvisionnement, la coordination de production, le conditionnement et la livraison. Qualité, traçabilité et exigences du marché cible sont convenues avec les partenaires pour chaque produit et commande."],
  de: ["Hồng Tâm beginnt mit verantwortungsvollem Handeln: ehrlicher Herkunft, ethischem Wirtschaften und Verantwortung gegenüber Erzeugern, Partnern und Kunden. Wir schätzen vietnamesische Agrarprodukte und bauen langfristige Beziehungen auf Vertrauen auf.", "ROSIC verbindet die vietnamesische Landwirtschaft durch Beschaffung, Produktionskoordination, Verpackung und Lieferung mit internationalen Märkten. Qualität, Rückverfolgbarkeit und Anforderungen des Zielmarktes werden für jedes Produkt und jeden Auftrag mit den Partnern abgestimmt."],
};

export function brandStoryFor(language, copy) {
  const title = headings[language] || headings.en;
  return {
    title,
    slogan: title.join(" – "),
    blocks: language === "vi" ? [
      "Hồng Tâm bắt đầu từ chữ Tâm: sự tử tế trong kinh doanh, trung thực về nguồn gốc và trách nhiệm với người trồng, đối tác, khách hàng. Chúng tôi trân trọng giá trị nông sản Việt và lấy sự tận tâm làm nền tảng cho mỗi mối quan hệ lâu dài.",
      "ROSIC hướng đến kết nối nông sản Việt với thị trường quốc tế bằng năng lực lựa chọn nguồn hàng, phối hợp sản xuất, đóng gói và giao nhận. Yêu cầu về chất lượng, truy xuất nguồn gốc và tiêu chuẩn của từng thị trường được làm rõ cùng đối tác cho từng sản phẩm, từng đơn hàng.",
    ] : internationalBlocks[language] || [copy.about.first, copy.about.second],
  };
}
