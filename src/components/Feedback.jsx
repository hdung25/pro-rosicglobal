import { useState } from "react";
import { Quote } from "lucide-react";
import "./Feedback.css";

// Layout examples are clearly marked and never attributed to real people or companies.
const SAMPLE_IDS = ["distribution", "retail", "import", "foodservice", "processing", "growing", "procurement", "food"];
const INITIALS = ["PP", "BL", "NK", "NH", "CB", "VT", "TM", "TP"];

const FEEDBACK_COPY = {
  vi: {
    heading: "Lắng nghe để cùng phát triển.",
    disclosure: "Nội dung minh họa cách trình bày phản hồi, chưa phải đánh giá khách hàng thực tế.",
    region: "Phản hồi minh họa",
    help: "Chạm hoặc nhấn Enter để dừng hay tiếp tục. Di chuột hoặc đặt tiêu điểm vào đây để dừng chuyển động.",
    samples: [
      ["Đối tác phân phối", "Danh mục sản phẩm", "Một danh mục rõ ràng giúp chúng tôi dễ chọn sản phẩm phù hợp cho từng mùa và từng nhóm khách hàng."],
      ["Đơn vị bán lẻ", "Thông tin sản phẩm", "Chúng tôi trân trọng cách giới thiệu ngắn gọn, hình ảnh đúng sản phẩm và những thông tin dễ đối chiếu."],
      ["Đối tác nhập khẩu", "Trao đổi nhu cầu", "Việc làm rõ quy cách và lịch nhận ngay từ đầu là nền tảng cho một cuộc hợp tác thuận lợi."],
      ["Nhà hàng & dịch vụ", "Lựa chọn theo mùa", "Những gợi ý theo mùa giúp đội ngũ có thêm cảm hứng xây dựng thực đơn và lựa chọn nguyên liệu."],
      ["Đơn vị chế biến", "Quy cách nguyên liệu", "Điều chúng tôi quan tâm là sự rõ ràng về nguyên liệu, mẫu sản phẩm và cách chuẩn bị cho từng đơn hàng."],
      ["Đối tác vùng trồng", "Kết nối lâu dài", "Một mối quan hệ tốt bắt đầu từ việc lắng nghe nhu cầu của nhau và cùng thống nhất hướng đi."],
      ["Đơn vị thu mua", "Chuẩn bị đơn hàng", "Có thể tổng hợp nhu cầu trong một bản yêu cầu giúp việc trao đổi giữa các bộ phận trở nên thuận tiện hơn."],
      ["Đối tác thực phẩm", "Sự đồng hành", "Chúng tôi luôn tìm kiếm những kết nối coi trọng sự minh bạch, trao đổi cởi mở và tinh thần đồng hành."],
    ],
  },
  en: {
    heading: "Listening helps partnerships grow.",
    disclosure: "These cards demonstrate the feedback layout; they are not customer testimonials.",
    region: "Illustrative feedback",
    help: "Tap or press Enter to pause or resume. Hover or focus the rail to pause its movement.",
    samples: [
      ["Distribution partner", "Product range", "A clear range makes it easier to select the right products for each season and customer segment."],
      ["Retail team", "Product information", "We value concise introductions, truthful product imagery and information that is easy to compare."],
      ["Import partner", "Requirement alignment", "Agreeing specifications and receiving timing early gives a partnership a practical foundation."],
      ["Food-service team", "Seasonal selection", "Seasonal suggestions give our team useful ideas for menus and ingredient planning."],
      ["Processing partner", "Raw material specification", "We look for clarity around raw materials, samples and the preparation required for each order."],
      ["Growing-region partner", "Long-term coordination", "A good relationship starts by listening carefully to each other's needs and agreeing the direction together."],
      ["Procurement team", "Order preparation", "Bringing requirements together in one brief makes cross-team discussion more efficient."],
      ["Food-sector partner", "Working together", "We seek connections that value transparency, open communication and a collaborative spirit."],
    ],
  },
  zh: {
    heading: "认真倾听，才能共同成长。",
    disclosure: "以下内容仅用于演示反馈呈现方式，并非真实客户评价。",
    region: "示例反馈",
    help: "轻触或按 Enter 键可暂停或继续；悬停或聚焦时，滚动内容会暂停。",
    samples: [
      ["分销合作伙伴", "产品目录", "清晰的产品目录能帮助我们按季节和客户群体更快地选择合适的产品。"],
      ["零售团队", "产品信息", "我们看重简洁的介绍、与实物相符的产品图片以及便于比较的信息。"],
      ["进口合作伙伴", "需求沟通", "及早明确规格与收货时间，为顺畅合作打下务实基础。"],
      ["餐饮服务团队", "时令选择", "按季节提供的建议，能为菜单和原料规划带来有用的灵感。"],
      ["加工合作伙伴", "原料规格", "我们关注原料、样品以及每笔订单准备方式是否清晰明确。"],
      ["产区合作伙伴", "长期协作", "良好的关系始于认真倾听彼此需求，并共同明确前进方向。"],
      ["采购团队", "订单准备", "将需求汇总在一份清晰的说明中，可让各部门之间的沟通更高效。"],
      ["食品行业合作伙伴", "共同前行", "我们希望与重视透明、坦诚沟通和合作精神的伙伴建立联系。"],
    ],
  },
  ko: {
    heading: "경청으로 더 나은 협업을 만듭니다.",
    disclosure: "아래 내용은 후기 표현 방식을 보여 주는 예시이며, 실제 고객 후기가 아닙니다.",
    region: "예시 피드백",
    help: "터치하거나 Enter 키를 눌러 일시 정지 또는 재생할 수 있습니다. 마우스를 올리거나 초점을 두면 움직임이 멈춥니다.",
    samples: [
      ["유통 파트너", "제품 구성", "명확한 제품 구성이 있으면 계절과 고객군에 맞는 품목을 더 쉽게 고를 수 있습니다."],
      ["리테일 팀", "제품 정보", "간결한 소개, 실제 제품에 가까운 이미지, 비교하기 쉬운 정보를 중요하게 생각합니다."],
      ["수입 파트너", "요구사항 조율", "초기에 규격과 입고 일정을 분명히 하면 원활한 협업의 기반이 됩니다."],
      ["식음 서비스 팀", "제철 품목 선택", "계절에 맞춘 제안은 메뉴와 원재료 계획을 세우는 데 좋은 영감을 줍니다."],
      ["가공 파트너", "원료 규격", "원료, 샘플, 주문별 준비 방식이 명확하게 정리되는 점을 중요하게 봅니다."],
      ["산지 파트너", "장기 협업", "좋은 관계는 서로의 필요를 잘 듣고 함께 방향을 맞추는 데서 시작됩니다."],
      ["구매 팀", "주문 준비", "요구사항을 하나의 브리프로 정리하면 부서 간 소통이 훨씬 수월해집니다."],
      ["식품 업계 파트너", "함께하는 가치", "투명성, 열린 소통, 협업의 태도를 소중히 여기는 연결을 찾고 있습니다."],
    ],
  },
  ja: {
    heading: "耳を傾け、より良い協業へ。",
    disclosure: "以下はレビュー表示のための例であり、実際のお客様の声ではありません。",
    region: "表示例のフィードバック",
    help: "タップまたは Enter キーで一時停止・再開できます。ホバーまたはフォーカス中は動きが止まります。",
    samples: [
      ["流通パートナー", "商品ラインアップ", "分かりやすい商品構成があると、季節や顧客層に合う商品を選びやすくなります。"],
      ["小売チーム", "商品情報", "簡潔な紹介、実物に沿った画像、比較しやすい情報を大切にしています。"],
      ["輸入パートナー", "要件のすり合わせ", "仕様と入荷時期を早めに明確にすることが、円滑な協業の土台になります。"],
      ["フードサービスチーム", "季節の選定", "季節に合わせた提案は、メニューや原材料の計画に役立つヒントになります。"],
      ["加工パートナー", "原料仕様", "原料、サンプル、各注文に向けた準備が明確であることを重視します。"],
      ["産地パートナー", "長期的な連携", "良い関係は、お互いの要望を丁寧に聞き、方向性を共有することから始まります。"],
      ["調達チーム", "注文準備", "要件を一つのブリーフにまとめることで、部署間のやり取りが進めやすくなります。"],
      ["食品業界パートナー", "ともに進むこと", "透明性、率直な対話、協力する姿勢を大切にするつながりを求めています。"],
    ],
  },
  ar: {
    heading: "بالإنصات نبني شراكات أقوى.",
    disclosure: "المحتوى التالي مثال لطريقة عرض الآراء، وليس شهادات حقيقية من العملاء.",
    region: "آراء توضيحية",
    help: "المس أو اضغط Enter للإيقاف أو المتابعة. يتوقف التحريك عند المرور بالمؤشر أو عند التركيز على الشريط.",
    samples: [
      ["شريك توزيع", "تشكيلة المنتجات", "تساعدنا التشكيلة الواضحة على اختيار المنتجات المناسبة لكل موسم ولكل شريحة من العملاء."],
      ["فريق التجزئة", "معلومات المنتج", "نقدّر التعريف المختصر والصور المطابقة للمنتج والمعلومات السهلة للمقارنة."],
      ["شريك استيراد", "مواءمة المتطلبات", "يوفّر توضيح المواصفات وموعد الاستلام مبكراً أساساً عملياً لتعاون سلس."],
      ["فريق خدمات الأغذية", "اختيار المنتجات الموسمية", "تمنح المقترحات الموسمية فريقنا أفكاراً مفيدة لتخطيط القوائم والمكونات."],
      ["شريك التصنيع", "مواصفات المواد الخام", "نبحث عن وضوح في المواد الخام والعينات وطريقة التحضير المطلوبة لكل طلب."],
      ["شريك منطقة زراعية", "تنسيق طويل الأمد", "تبدأ العلاقة الجيدة بالاستماع إلى احتياجات بعضنا وتحديد الاتجاه معاً."],
      ["فريق المشتريات", "إعداد الطلب", "جمع المتطلبات في موجز واحد يجعل التواصل بين الأقسام أكثر سهولة وكفاءة."],
      ["شريك قطاع الأغذية", "العمل معاً", "نسعى إلى علاقات تقدّر الشفافية والحوار المفتوح وروح التعاون."],
    ],
  },
  fr: {
    heading: "Écouter pour mieux avancer ensemble.",
    disclosure: "Ces contenus illustrent la présentation des avis ; ils ne constituent pas des témoignages clients réels.",
    region: "Avis illustratifs",
    help: "Touchez ou appuyez sur Entrée pour arrêter ou reprendre le défilement. Le mouvement s'arrête au survol ou à la prise de focus.",
    samples: [
      ["Partenaire distributeur", "Gamme de produits", "Une gamme claire facilite le choix des produits adaptés à chaque saison et à chaque segment de clientèle."],
      ["Équipe retail", "Informations produit", "Nous apprécions une présentation concise, des images fidèles au produit et des informations faciles à comparer."],
      ["Partenaire importateur", "Alignement des besoins", "Clarifier tôt les spécifications et la date de réception donne une base concrète à une collaboration fluide."],
      ["Équipe restauration", "Choix saisonnier", "Les suggestions de saison apportent des idées utiles pour les menus et la planification des ingrédients."],
      ["Partenaire de transformation", "Spécification matière première", "Nous recherchons de la clarté sur les matières premières, les échantillons et la préparation de chaque commande."],
      ["Partenaire de région de culture", "Coordination durable", "Une bonne relation commence par l'écoute des besoins de chacun et une direction partagée."],
      ["Équipe achats", "Préparation de commande", "Rassembler les besoins dans un même brief rend les échanges entre équipes plus efficaces."],
      ["Partenaire agroalimentaire", "Travailler ensemble", "Nous recherchons des liens qui valorisent la transparence, le dialogue ouvert et l'esprit de coopération."],
    ],
  },
  de: {
    heading: "Zuhören schafft bessere Partnerschaften.",
    disclosure: "Diese Inhalte zeigen beispielhaft die Darstellung von Rückmeldungen; sie sind keine echten Kundenstimmen.",
    region: "Beispielhafte Rückmeldungen",
    help: "Berühren Sie die Leiste oder drücken Sie Enter, um die Bewegung anzuhalten oder fortzusetzen. Bei Hover oder Fokus pausiert sie.",
    samples: [
      ["Vertriebspartner", "Produktsortiment", "Ein klar aufgebautes Sortiment erleichtert die Auswahl passender Produkte für Saison und Kundengruppe."],
      ["Retail-Team", "Produktinformationen", "Wir schätzen prägnante Vorstellungen, produktnahe Bilder und Informationen, die sich leicht vergleichen lassen."],
      ["Importpartner", "Anforderungen abstimmen", "Frühzeitig geklärte Spezifikationen und Wareneingänge schaffen eine solide Grundlage für eine reibungslose Zusammenarbeit."],
      ["Foodservice-Team", "Saisonale Auswahl", "Saisonale Empfehlungen liefern unserem Team hilfreiche Ideen für Menü- und Zutatenplanung."],
      ["Verarbeitungspartner", "Rohwarenspezifikation", "Für uns zählen klare Angaben zu Rohwaren, Mustern und der Vorbereitung jeder Bestellung."],
      ["Anbauregionspartner", "Langfristige Abstimmung", "Eine gute Beziehung beginnt damit, einander zuzuhören und die Richtung gemeinsam festzulegen."],
      ["Einkaufsteam", "Bestellvorbereitung", "Ein gemeinsames Briefing bündelt Anforderungen und macht die Abstimmung zwischen Teams effizienter."],
      ["Lebensmittelpartner", "Gemeinsam arbeiten", "Wir suchen Verbindungen, die Transparenz, offenen Austausch und einen partnerschaftlichen Geist schätzen."],
    ],
  },
};

function localizedSamples(language) {
  const copy = FEEDBACK_COPY[language] ?? FEEDBACK_COPY.en;
  return copy.samples.map(([role, topic, text], index) => ({
    id: SAMPLE_IDS[index],
    initials: INITIALS[index],
    role,
    topic,
    text,
  }));
}

function FeedbackCard({ item, tone, sampleLabel }) {
  return (
    <article className={`feedback-card feedback-tone-${tone}`}>
      <div className="feedback-card-top">
        <Quote size={25} strokeWidth={1.2} aria-hidden="true" />
        <span>{item.topic}</span>
      </div>
      <blockquote>{item.text}</blockquote>
      <div className="feedback-author">
        <span className="feedback-avatar" aria-hidden="true">
          {item.initials}
        </span>
        <div>
          <h4>{item.role}</h4>
          <p>{sampleLabel}</p>
        </div>
      </div>
    </article>
  );
}

export default function Feedback({ language = "vi" }) {
  const [paused, setPaused] = useState(false);
  const copy = FEEDBACK_COPY[language] ?? FEEDBACK_COPY.en;
  const samples = localizedSamples(language);

  return (
    <div
      className={`feedback-section ${paused ? "feedback-paused" : ""}`}
      aria-labelledby="feedback-title"
    >
      <div className="feedback-heading container">
        <div>
          <h3 id="feedback-title">{copy.heading}</h3>
          <p className="feedback-disclosure">{copy.disclosure}</p>
        </div>
      </div>
      <div
        className="feedback-rails"
        tabIndex={0}
        role="region"
        aria-label={copy.region}
        aria-description={copy.help}
        onClick={() => setPaused((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setPaused((value) => !value);
          }
        }}
      >
        {[samples.slice(0, 4), samples.slice(4)].map((row, rowIndex) => (
          <div className={`feedback-rail feedback-rail-${rowIndex}`} key={rowIndex}>
            <div className="feedback-track">
              {[0, 1].map((copyIndex) => (
                <div
                  className="feedback-set"
                  key={copyIndex}
                  aria-hidden={copyIndex ? true : undefined}
                >
                  {row.map((item, index) => (
                    <FeedbackCard
                      item={item}
                      tone={(index + rowIndex) % 3}
                      sampleLabel={copy.region}
                      key={item.id}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
