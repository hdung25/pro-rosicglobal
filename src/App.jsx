import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion as Motion,
  MotionConfig,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  Leaf,
  Sprout,
  PackageCheck,
  Globe2,
  Menu,
  X,
  Search,
  Plus,
  Minus,
  Network,
  Mail,
  MessageCircle,
} from "lucide-react";
import Contact from "./components/Contact";
import Feedback from "./components/Feedback";
import CatalogDemo from "./components/CatalogDemo";
import OfficialExportCatalog from "./components/OfficialExportCatalog";
import { LanguagePicker } from "./components/LanguagePicker";
import { useSiteLanguage } from "./language";
import { PRODUCTS, CATEGORIES, ARTICLES, JOURNEY } from "./data";
import { EXPORT_CATEGORIES } from "./export-catalog";

const NAV = [
  { key: "home", label: "Trang chủ", href: "#home" },
  { key: "about", label: "Về chúng tôi", href: "#about" },
  { key: "journey", label: "Hành trình", href: "#journey" },
  { key: "products", label: "Sản phẩm", href: "#products" },
  { key: "partners", label: "Đối tác", href: "#testimonials" },
  { key: "journal", label: "Tin tức", href: "#blog" },
  { key: "contact", label: "Liên hệ", href: "#contact" },
];

const SITE_UI_COPY = {
  vi: {
    skip: "Đến nội dung chính",
    nav: { home: "Trang chủ", about: "Về chúng tôi", journey: "Hành trình", products: "Sản phẩm", partners: "Đối tác", journal: "Tin tức", contact: "Liên hệ" },
    exportCatalog: "Danh mục xuất khẩu",
    language: "Chọn ngôn ngữ",
    openMenu: "Mở menu",
    closeMenu: "Đóng menu",
    primaryNavigation: "Điều hướng chính",
    mobileMenuTitle: "Điều hướng",
    productNavigation: "Sản phẩm và kết nối",
    hero: { eyebrow: "TỪ TÂM VIỆT, VƯƠN TẦM THẾ GIỚI", start: "Tinh hoa từ đất.", accent: "Trao gửi bằng tâm.", first: "Kết nối nông sản Việt với thế giới.", second: "Chăm chút từng mùa vụ, vun đắp những mối quan hệ bền lâu.", cta: "Khám phá danh mục xuất khẩu", origin: "Nông sản Việt Nam", caption: "Gieo giá trị. Gặt niềm tin." },
    marquee: ["Trái cây tươi", "Rau củ theo mùa", "Hạt & ngũ cốc", "Nông sản chế biến"],
    marqueeLabel: "Các nhóm nông sản",
    marqueeHelp: "Chạm hoặc nhấn Enter để dừng hay tiếp tục chuyển động.",
    catalog: { eyebrow: "TỪ THIÊN NHIÊN VIỆT NAM", title: "Mỗi mùa, một thức quà.", body: "Khám phá danh mục nông sản và cùng chúng tôi lựa chọn sản phẩm phù hợp với nhu cầu của bạn.", filter: "Lọc nhóm sản phẩm", search: "Tìm sản phẩm", detail: "Xem chi tiết", noResultTitle: "Chưa tìm thấy sản phẩm phù hợp", noResultBody: "Thử tên ngắn hơn hoặc xem lại toàn bộ danh mục.", reset: "Xem tất cả sản phẩm", note: "Danh mục giới thiệu. Mùa vụ, quy cách và khả năng cung ứng được xác nhận khi trao đổi đơn hàng." },
    tabs: { all: "Tất cả", fruit: "Trái cây tươi", vegetables: "Rau củ theo mùa", nuts: "Hạt & ngũ cốc", processed: "Nông sản chế biến" },
    footer: { tagline: ["Gieo giá trị từ tâm.", "Kết nối những mùa xanh."], explore: "Khám phá", products: "Sản phẩm", invitation: "Bắt đầu một kết nối tốt đẹp.", greeting: "Chào Hồng Tâm", social: "Kết nối nhanh", privacy: "Thông tin & quyền riêng tư", backTop: "Về đầu trang" },
    dialog: { close: "Đóng chi tiết", productGroup: "Nhóm sản phẩm", format: "Quy cách", formatValue: "Trao đổi theo nhu cầu", imageNote: "Hình ảnh minh họa sản phẩm. Xuất xứ, mùa vụ và thông số được xác nhận theo lô hàng.", request: "Yêu cầu sản phẩm này", policyTitle: "Thông tin & quyền riêng tư", policyLead: "Cách sử dụng nội dung và biểu mẫu trên website." },
  },
  en: {
    skip: "Skip to main content",
    nav: { home: "Home", about: "About", journey: "Journey", products: "Products", partners: "Partners", journal: "Journal", contact: "Contact" },
    exportCatalog: "Export catalogue",
    language: "Choose language",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    primaryNavigation: "Primary navigation",
    productNavigation: "Products and contact",
    hero: { eyebrow: "FROM VIETNAM, FOR THE WORLD", start: "Grown with care.", accent: "Shared with purpose.", first: "Connecting Vietnamese agricultural products with the world.", second: "Caring for every season and building lasting partnerships.", cta: "Explore export catalogue", origin: "Vietnamese agriculture", caption: "Grow value. Earn trust." },
    marquee: ["Fresh fruit", "Seasonal vegetables", "Nuts & grains", "Processed agriculture"],
    marqueeLabel: "Agricultural categories",
    marqueeHelp: "Touch or press Enter to pause or resume the movement.",
    catalog: { eyebrow: "FROM VIETNAMESE NATURE", title: "A gift from every season.", body: "Explore our agricultural selection and find the right product for your needs.", filter: "Filter product groups", search: "Search products", detail: "View details", noResultTitle: "No matching product found", noResultBody: "Try a shorter term or return to the full catalogue.", reset: "View all products", note: "This is an introductory catalogue. Seasonality, packing and availability are confirmed for each enquiry." },
    tabs: { all: "All", fruit: "Fresh fruit", vegetables: "Seasonal vegetables", nuts: "Nuts & grains", processed: "Processed products" },
    footer: { tagline: ["Growing value with care.", "Connecting greener seasons."], explore: "Explore", products: "Products", invitation: "Start a meaningful connection.", greeting: "Hello, Hồng Tâm", social: "Quick links", privacy: "Information & privacy", backTop: "Back to top" },
    dialog: { close: "Close details", productGroup: "Product group", format: "Format", formatValue: "Discussed to suit your requirement", imageNote: "Product image for illustration. Origin, seasonality and specifications are confirmed by batch.", request: "Request this product", policyTitle: "Information & privacy", policyLead: "How website content and enquiry forms are used." },
  },
  zh: {
    skip: "跳到主要内容", nav: { home: "首页", about: "关于我们", journey: "流程", products: "产品", partners: "合作伙伴", journal: "资讯", contact: "联系" }, exportCatalog: "出口目录", language: "选择语言", openMenu: "打开菜单", closeMenu: "关闭菜单", primaryNavigation: "主导航", productNavigation: "产品与联系", hero: { eyebrow: "源自越南，走向世界", start: "源于土地的精华。", accent: "以真心分享。", first: "连接越南农产品与世界。", second: "珍视每一个产季，建立长期合作。", cta: "查看出口目录", origin: "越南农产品", caption: "播种价值，收获信任。" }, marquee: ["新鲜水果", "时令蔬菜", "坚果与谷物", "加工农产品"], marqueeLabel: "农产品类别", marqueeHelp: "点击或按 Enter 暂停或继续滚动。", catalog: { eyebrow: "来自越南自然", title: "每个季节都有一份礼物。", body: "浏览农产品目录，为您的需求选择合适的产品。", filter: "筛选产品类别", search: "搜索产品", detail: "查看详情", noResultTitle: "未找到匹配产品", noResultBody: "请尝试更短的关键词或查看全部目录。", reset: "查看全部产品", note: "此目录用于介绍。季节、包装和供应情况以每次询盘确认为准。" }, tabs: { all: "全部", fruit: "新鲜水果", vegetables: "时令蔬菜", nuts: "坚果与谷物", processed: "加工农产品" }, footer: { tagline: ["用心创造价值。", "连接丰收的季节。"], explore: "探索", products: "产品", invitation: "开启美好的连接。", greeting: "您好，Hồng Tâm", social: "快捷链接", privacy: "信息与隐私", backTop: "返回顶部" }, dialog: { close: "关闭详情", productGroup: "产品类别", format: "规格", formatValue: "根据需求沟通确认", imageNote: "产品图片仅供展示。原产地、季节和规格按批次确认。", request: "询问此产品", policyTitle: "信息与隐私", policyLead: "网站内容和询盘表单的使用方式。" },
  },
  ko: {
    skip: "본문으로 건너뛰기", nav: { home: "홈", about: "회사 소개", journey: "과정", products: "제품", partners: "파트너", journal: "소식", contact: "문의" }, exportCatalog: "수출 카탈로그", language: "언어 선택", openMenu: "메뉴 열기", closeMenu: "메뉴 닫기", primaryNavigation: "주요 탐색", productNavigation: "제품 및 문의", hero: { eyebrow: "베트남에서 세계로", start: "땅에서 온 정성.", accent: "마음으로 전합니다.", first: "베트남 농산물과 세계를 연결합니다.", second: "매 시즌을 세심하게 돌보고 오래가는 관계를 만듭니다.", cta: "수출 카탈로그 보기", origin: "베트남 농산물", caption: "가치를 키우고 신뢰를 얻습니다." }, marquee: ["신선 과일", "제철 채소", "견과류와 곡물", "가공 농산물"], marqueeLabel: "농산물 카테고리", marqueeHelp: "터치하거나 Enter를 눌러 이동을 멈추거나 다시 시작하세요.", catalog: { eyebrow: "베트남 자연에서", title: "계절마다 특별한 선물.", body: "농산물 컬렉션을 살펴보고 필요에 맞는 제품을 찾아보세요.", filter: "제품군 필터", search: "제품 검색", detail: "상세 보기", noResultTitle: "일치하는 제품이 없습니다", noResultBody: "더 짧은 검색어를 사용하거나 전체 카탈로그를 확인하세요.", reset: "모든 제품 보기", note: "소개용 카탈로그입니다. 계절, 포장 및 공급 가능 여부는 문의별로 확인됩니다." }, tabs: { all: "전체", fruit: "신선 과일", vegetables: "제철 채소", nuts: "견과류와 곡물", processed: "가공 농산물" }, footer: { tagline: ["정성으로 가치를 키웁니다.", "푸른 계절을 연결합니다."], explore: "둘러보기", products: "제품", invitation: "좋은 연결을 시작하세요.", greeting: "Hồng Tâm에 문의", social: "빠른 연결", privacy: "정보 및 개인정보", backTop: "맨 위로" }, dialog: { close: "상세 닫기", productGroup: "제품군", format: "형태", formatValue: "요구사항에 맞춰 협의", imageNote: "제품 이미지는 참고용입니다. 원산지, 시즌 및 사양은 로트별로 확인됩니다.", request: "이 제품 문의", policyTitle: "정보 및 개인정보", policyLead: "웹사이트 내용 및 문의 양식의 사용 방식입니다." },
  },
  ja: {
    skip: "本文へ移動", nav: { home: "ホーム", about: "私たちについて", journey: "プロセス", products: "商品", partners: "パートナー", journal: "お知らせ", contact: "お問い合わせ" }, exportCatalog: "輸出カタログ", language: "言語を選択", openMenu: "メニューを開く", closeMenu: "メニューを閉じる", primaryNavigation: "メインナビゲーション", productNavigation: "商品とお問い合わせ", hero: { eyebrow: "ベトナムから世界へ", start: "大地からの恵み。", accent: "心を込めて届けます。", first: "ベトナムの農産品を世界へつなぎます。", second: "一つひとつの季節を大切にし、長い関係を育てます。", cta: "輸出カタログを見る", origin: "ベトナムの農産品", caption: "価値を育て、信頼を得る。" }, marquee: ["生鮮果物", "季節の野菜", "ナッツと穀物", "加工農産品"], marqueeLabel: "農産品カテゴリー", marqueeHelp: "タップまたは Enter キーで動きを一時停止・再開できます。", catalog: { eyebrow: "ベトナムの自然から", title: "季節ごとの贈りもの。", body: "農産品のラインアップを見て、用途に合う商品をお選びください。", filter: "商品グループを絞り込む", search: "商品を検索", detail: "詳細を見る", noResultTitle: "該当する商品がありません", noResultBody: "短い検索語を試すか、全カタログをご覧ください。", reset: "すべての商品を見る", note: "紹介用カタログです。季節、梱包、供給可否はお問い合わせごとに確認します。" }, tabs: { all: "すべて", fruit: "生鮮果物", vegetables: "季節の野菜", nuts: "ナッツと穀物", processed: "加工農産品" }, footer: { tagline: ["心で価値を育てます。", "豊かな季節をつなぎます。"], explore: "見る", products: "商品", invitation: "よいご縁を始めましょう。", greeting: "Hồng Tâmに相談", social: "クイックリンク", privacy: "情報とプライバシー", backTop: "ページ上部へ" }, dialog: { close: "詳細を閉じる", productGroup: "商品グループ", format: "形態", formatValue: "ご要望に合わせてご相談", imageNote: "商品画像はイメージです。原産地、季節、仕様はロットごとに確認されます。", request: "この商品を問い合わせる", policyTitle: "情報とプライバシー", policyLead: "ウェブサイトの内容とお問い合わせフォームの利用方法。" },
  },
  ar: {
    skip: "انتقل إلى المحتوى الرئيسي", nav: { home: "الرئيسية", about: "من نحن", journey: "رحلتنا", products: "المنتجات", partners: "الشركاء", journal: "المجلة", contact: "اتصل بنا" }, exportCatalog: "كتالوج التصدير", language: "اختر اللغة", openMenu: "فتح القائمة", closeMenu: "إغلاق القائمة", primaryNavigation: "التنقل الرئيسي", productNavigation: "المنتجات والتواصل", hero: { eyebrow: "من فيتنام إلى العالم", start: "خلاصة الأرض.", accent: "نقدمها بإخلاص.", first: "نصل المنتجات الزراعية الفيتنامية بالعالم.", second: "نعتني بكل موسم ونبني شراكات طويلة الأمد.", cta: "استكشف كتالوج التصدير", origin: "الزراعة الفيتنامية", caption: "نزرع القيمة ونحصد الثقة." }, marquee: ["فواكه طازجة", "خضروات موسمية", "مكسرات وحبوب", "منتجات زراعية مصنّعة"], marqueeLabel: "فئات المنتجات الزراعية", marqueeHelp: "المس أو اضغط Enter لإيقاف الحركة أو استئنافها.", catalog: { eyebrow: "من طبيعة فيتنام", title: "هدية من كل موسم.", body: "استكشف مجموعتنا الزراعية واختر المنتج المناسب لاحتياجاتك.", filter: "تصفية مجموعات المنتجات", search: "ابحث عن منتجات", detail: "عرض التفاصيل", noResultTitle: "لم يتم العثور على منتج مطابق", noResultBody: "جرّب مصطلحًا أقصر أو عد إلى الكتالوج الكامل.", reset: "عرض كل المنتجات", note: "هذا كتالوج تعريفي. يتم تأكيد الموسم والتعبئة والتوافر لكل استفسار." }, tabs: { all: "الكل", fruit: "فواكه طازجة", vegetables: "خضروات موسمية", nuts: "مكسرات وحبوب", processed: "منتجات مصنّعة" }, footer: { tagline: ["ننمي القيمة بعناية.", "نصل المواسم الخضراء."], explore: "استكشف", products: "المنتجات", invitation: "ابدأ تواصلاً مثمرًا.", greeting: "تواصل مع Hồng Tâm", social: "روابط سريعة", privacy: "المعلومات والخصوصية", backTop: "العودة للأعلى" }, dialog: { close: "إغلاق التفاصيل", productGroup: "مجموعة المنتجات", format: "الشكل", formatValue: "يتم الاتفاق وفق احتياجكم", imageNote: "صورة المنتج للتوضيح. يتم تأكيد المنشأ والموسم والمواصفات لكل دفعة.", request: "اطلب هذا المنتج", policyTitle: "المعلومات والخصوصية", policyLead: "كيفية استخدام محتوى الموقع ونماذج الاستفسار." },
  },
  fr: {
    skip: "Aller au contenu principal", nav: { home: "Accueil", about: "À propos", journey: "Parcours", products: "Produits", partners: "Partenaires", journal: "Actualités", contact: "Contact" }, exportCatalog: "Catalogue export", language: "Choisir la langue", openMenu: "Ouvrir le menu", closeMenu: "Fermer le menu", primaryNavigation: "Navigation principale", productNavigation: "Produits et contact", hero: { eyebrow: "DU VIETNAM VERS LE MONDE", start: "L'essence de la terre.", accent: "Partagée avec cœur.", first: "Nous relions les produits agricoles vietnamiens au monde.", second: "Nous prenons soin de chaque saison et construisons des relations durables.", cta: "Voir le catalogue export", origin: "Agriculture vietnamienne", caption: "Cultiver la valeur. Gagner la confiance." }, marquee: ["Fruits frais", "Légumes de saison", "Noix et céréales", "Produits transformés"], marqueeLabel: "Catégories agricoles", marqueeHelp: "Touchez ou appuyez sur Entrée pour arrêter ou reprendre le mouvement.", catalog: { eyebrow: "DE LA NATURE VIETNAMIENNE", title: "Un cadeau à chaque saison.", body: "Découvrez notre sélection agricole et trouvez le produit adapté à vos besoins.", filter: "Filtrer les familles de produits", search: "Rechercher des produits", detail: "Voir les détails", noResultTitle: "Aucun produit correspondant", noResultBody: "Essayez un terme plus court ou consultez le catalogue complet.", reset: "Voir tous les produits", note: "Catalogue de présentation. Saisonnalité, conditionnement et disponibilité sont confirmés pour chaque demande." }, tabs: { all: "Tous", fruit: "Fruits frais", vegetables: "Légumes de saison", nuts: "Noix et céréales", processed: "Produits transformés" }, footer: { tagline: ["Cultiver la valeur avec soin.", "Relier les saisons vertes."], explore: "Découvrir", products: "Produits", invitation: "Créons un beau lien.", greeting: "Bonjour, Hồng Tâm", social: "Liens rapides", privacy: "Informations et confidentialité", backTop: "Haut de page" }, dialog: { close: "Fermer les détails", productGroup: "Famille de produits", format: "Format", formatValue: "À définir selon votre besoin", imageNote: "Image produit à titre illustratif. Origine, saisonnalité et spécifications sont confirmées par lot.", request: "Demander ce produit", policyTitle: "Informations et confidentialité", policyLead: "Utilisation du contenu du site et des formulaires de demande." },
  },
  de: {
    skip: "Zum Hauptinhalt", nav: { home: "Startseite", about: "Über uns", journey: "Ablauf", products: "Produkte", partners: "Partner", journal: "Journal", contact: "Kontakt" }, exportCatalog: "Exportkatalog", language: "Sprache wählen", openMenu: "Menü öffnen", closeMenu: "Menü schließen", primaryNavigation: "Hauptnavigation", productNavigation: "Produkte und Kontakt", hero: { eyebrow: "AUS VIETNAM FÜR DIE WELT", start: "Essenz der Erde.", accent: "Mit Herz weitergegeben.", first: "Wir verbinden vietnamesische Agrarprodukte mit der Welt.", second: "Wir pflegen jede Saison und schaffen langfristige Partnerschaften.", cta: "Exportkatalog entdecken", origin: "Vietnamesische Landwirtschaft", caption: "Werte wachsen lassen. Vertrauen gewinnen." }, marquee: ["Frisches Obst", "Saisongemüse", "Nüsse & Getreide", "Verarbeitete Agrarprodukte"], marqueeLabel: "Agrarproduktgruppen", marqueeHelp: "Berühren oder Enter drücken, um die Bewegung anzuhalten oder fortzusetzen.", catalog: { eyebrow: "AUS VIETNAMS NATUR", title: "Ein Geschenk jeder Saison.", body: "Entdecken Sie unsere Agrarauswahl und finden Sie das passende Produkt für Ihren Bedarf.", filter: "Produktgruppen filtern", search: "Produkte suchen", detail: "Details ansehen", noResultTitle: "Kein passendes Produkt gefunden", noResultBody: "Versuchen Sie einen kürzeren Begriff oder öffnen Sie den Gesamtkatalog.", reset: "Alle Produkte ansehen", note: "Einführungskatalog. Saison, Verpackung und Verfügbarkeit werden je Anfrage bestätigt." }, tabs: { all: "Alle", fruit: "Frisches Obst", vegetables: "Saisongemüse", nuts: "Nüsse & Getreide", processed: "Verarbeitete Produkte" }, footer: { tagline: ["Werte mit Sorgfalt entwickeln.", "Grüne Jahreszeiten verbinden."], explore: "Entdecken", products: "Produkte", invitation: "Beginnen wir eine gute Verbindung.", greeting: "Hallo, Hồng Tâm", social: "Schnellzugriff", privacy: "Informationen & Datenschutz", backTop: "Nach oben" }, dialog: { close: "Details schließen", productGroup: "Produktgruppe", format: "Format", formatValue: "Nach Ihrem Bedarf abstimmen", imageNote: "Produktbild zur Illustration. Herkunft, Saison und Spezifikationen werden je Charge bestätigt.", request: "Dieses Produkt anfragen", policyTitle: "Informationen & Datenschutz", policyLead: "Wie Website-Inhalte und Anfrageformulare verwendet werden." },
  },
};

function siteCopyFor(language) {
  return SITE_UI_COPY[language] ?? SITE_UI_COPY.en;
}

// Keep the public site in a calm, branded holding state while the new release is reviewed.
const MAINTENANCE_MODE = false;

const MAINTENANCE_COPY = {
  vi: {
    badge: "Sắp ra mắt",
    eyebrow: "HỒNG TÂM ROSIC GLOBAL · VIỆT NAM",
    title: "Website của chúng tôi đang được nâng cấp.",
    accent: "Hẹn gặp lại bạn sớm.",
    body: "Chúng tôi đang hoàn thiện trải nghiệm tốt hơn cho khách hàng và đối tác. Cảm ơn bạn đã kiên nhẫn chờ đợi.",
    contact: "Với các yêu cầu hiện tại, vui lòng liên hệ trực tiếp",
    social: "Kết nối nhanh",
    slogan: "Manufacturing with Heart, Trading with Vision",
  },
  en: {
    badge: "Coming soon",
    eyebrow: "HỒNG TÂM ROSIC GLOBAL · VIETNAM",
    title: "Our website is being upgraded.",
    accent: "We’ll be back soon.",
    body: "We’re carefully polishing a better experience for our partners and customers. Thank you for your patience while we make the next chapter ready.",
    contact: "For current enquiries, please reach us directly",
    social: "Quick links",
    slogan: "Manufacturing with Heart, Trading with Vision",
  },
  zh: {
    badge: "即将上线",
    eyebrow: "HỒNG TÂM ROSIC GLOBAL · 越南",
    title: "我们的网站正在升级。",
    accent: "很快与您见面。",
    body: "我们正在为合作伙伴和客户优化更好的体验。感谢您的耐心等待。",
    contact: "如有当前需求，请直接联系我们",
    social: "快捷链接",
    slogan: "Manufacturing with Heart, Trading with Vision",
  },
  ko: {
    badge: "곧 공개",
    eyebrow: "HỒNG TÂM ROSIC GLOBAL · 베트남",
    title: "웹사이트를 새롭게 준비하고 있습니다.",
    accent: "곧 다시 찾아뵙겠습니다.",
    body: "파트너와 고객을 위한 더 나은 경험을 세심하게 준비하고 있습니다. 기다려 주셔서 감사합니다.",
    contact: "현재 문의는 아래 채널로 직접 연락해 주세요",
    social: "빠른 연결",
    slogan: "Manufacturing with Heart, Trading with Vision",
  },
  ja: {
    badge: "近日公開",
    eyebrow: "HỒNG TÂM ROSIC GLOBAL · ベトナム",
    title: "ウェブサイトをアップグレード中です。",
    accent: "まもなく公開します。",
    body: "パートナーとお客様により良い体験をお届けできるよう、サイトを整えています。お待ちいただきありがとうございます。",
    contact: "現在のお問い合わせは直接ご連絡ください",
    social: "クイックリンク",
    slogan: "Manufacturing with Heart, Trading with Vision",
  },
  ar: {
    badge: "قريبًا",
    eyebrow: "HỒNG TÂM ROSIC GLOBAL · فيتنام",
    title: "موقعنا قيد التطوير.",
    accent: "سنعود قريبًا.",
    body: "نعمل بعناية على تجربة أفضل لشركائنا وعملائنا. شكرًا لصبركم أثناء تجهيز المرحلة القادمة.",
    contact: "للاستفسارات الحالية، يرجى التواصل معنا مباشرة",
    social: "روابط سريعة",
    slogan: "Manufacturing with Heart, Trading with Vision",
  },
  fr: {
    badge: "Bientôt disponible",
    eyebrow: "HỒNG TÂM ROSIC GLOBAL · VIETNAM",
    title: "Notre site est en cours de mise à niveau.",
    accent: "Nous revenons bientôt.",
    body: "Nous préparons avec soin une meilleure expérience pour nos partenaires et nos clients. Merci de votre patience.",
    contact: "Pour toute demande actuelle, contactez-nous directement",
    social: "Liens rapides",
    slogan: "Manufacturing with Heart, Trading with Vision",
  },
  de: {
    badge: "Demnächst verfügbar",
    eyebrow: "HỒNG TÂM ROSIC GLOBAL · VIETNAM",
    title: "Unsere Website wird überarbeitet.",
    accent: "Wir sind bald wieder da.",
    body: "Wir bereiten sorgfältig ein besseres Erlebnis für Partner und Kunden vor. Vielen Dank für Ihre Geduld.",
    contact: "Für aktuelle Anfragen kontaktieren Sie uns bitte direkt",
    social: "Schnellzugriff",
    slogan: "Manufacturing with Heart, Trading with Vision",
  },
};

function Brand({ footer = false }) {
  return (
    <a
      className={`brand ${footer ? "brand-footer" : ""}`}
      href="#home"
      aria-label="Hồng Tâm Rosic Global, trang chủ"
    >
      <img
        className="brand-mark"
        src="/brand-mark.svg"
        alt="Biểu trưng Hồng Tâm"
        width="445"
        height="159"
      />
      <span className="brand-name">
        HỒNG TÂM <span>ROSIC GLOBAL</span>
      </span>
    </a>
  );
}

function MaintenancePage() {
  const [language, setLanguage] = useSiteLanguage("en");
  const copy = MAINTENANCE_COPY[language] ?? MAINTENANCE_COPY.en;
  return (
    <MotionConfig reducedMotion="user">
      <main className="maintenance-page" lang={language} dir={language === "ar" ? "rtl" : "ltr"}>
        <div className="maintenance-orbit maintenance-orbit-one" aria-hidden="true" />
        <div className="maintenance-orbit maintenance-orbit-two" aria-hidden="true" />
        <section className="maintenance-shell" aria-labelledby="maintenance-title">
          <div className="maintenance-topline">
            <a className="maintenance-brand" href="/" aria-label="Hồng Tâm Rosic Global">
              <img src="/brand-mark.svg" alt="Hồng Tâm Rosic Global" width="445" height="159" />
            </a>
            <div className="maintenance-utilities">
              <LanguagePicker compact language={language} onChange={setLanguage} />
              <span className="maintenance-badge"><span aria-hidden="true" /> {copy.badge}</span>
            </div>
          </div>
          <div className="maintenance-content">
            <p className="maintenance-eyebrow">{copy.eyebrow}</p>
            <h1 id="maintenance-title">{copy.title}<br /><em>{copy.accent}</em></h1>
            <p className="maintenance-copy">
              {copy.body}
            </p>
            <div className="maintenance-contact-card">
              <p className="maintenance-contact-label">{copy.contact}</p>
              <div className="maintenance-actions">
                <a className="maintenance-action maintenance-action-primary" href="https://wa.me/84962284872" target="_blank" rel="noreferrer">
                  <span>WhatsApp +84 962 284 872</span><ArrowUpRight size={18} aria-hidden="true" />
                </a>
                <a className="maintenance-action" href="mailto:info@rosicglobal.com">
                  <span>info@rosicglobal.com</span><ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="maintenance-footer-row">
              <p className="maintenance-footer">{copy.slogan}</p>
              <div className="maintenance-socials" aria-label={copy.social}>
                <a href="https://wa.me/84962284872" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={17} /></a>
                <a href="https://vn.linkedin.com/company/hong-tam-rosic-global-manufacturing-trading-joint-stock-company" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Network size={17} /></a>
                <a href="mailto:info@rosicglobal.com" aria-label="Email"><Mail size={17} /></a>
              </div>
            </div>
          </div>
          <p className="maintenance-copyright">Copyright © HONG TAM ROSIC GLOBAL JSC. All rights reserved.</p>
          <div className="maintenance-signal" aria-hidden="true">
            <span /><span /><span />
          </div>
        </section>
      </main>
    </MotionConfig>
  );
}
function Reveal({ children, className = "", delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <Motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Motion.div>
  );
}
function Header({ onFilter, language, onLanguage, copy }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    NAV.forEach((item) => {
      const node = document.querySelector(item.href);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <div className="topbar">
        Manufacturing with Heart, Trading with Vision
      </div>
      <header className="site-header">
        <div className="nav-shell container">
          <nav className="nav-left" aria-label={copy.primaryNavigation}>
            {NAV.slice(0, 3).map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={
                  active === item.href.slice(1) ? "location" : undefined
                }
              >
                {copy.nav[item.key]}
              </a>
            ))}
          </nav>
          <Brand />
          <nav className="nav-right" aria-label={copy.productNavigation}>
            <div className="nav-dropdown">
              <a
                href="#products"
                aria-current={active === "products" ? "location" : undefined}
              >
                {copy.nav.products} <ChevronDown size={12} />
              </a>
              <div className="dropdown-panel">
                {CATEGORIES.slice(1).map((category) => (
                  <a
                    key={category.id}
                    href="#products"
                    onClick={() => onFilter(category.id)}
                  >
                    {copy.tabs[category.id] ?? category.label}
                    <ArrowUpRight size={14} />
                  </a>
                ))}
                <a href="#export-catalog">
                  {copy.exportCatalog}
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
            <a href="#testimonials">{copy.nav.partners}</a>
            <a
              href="#blog"
              aria-current={active === "blog" ? "location" : undefined}
            >
              {copy.nav.journal}
            </a>
            <a href="#contact" className="nav-contact">
              {copy.nav.contact} <ArrowUpRight size={15} />
            </a>
            <LanguagePicker
              compact
              className="header-language"
              language={language}
              onChange={onLanguage}
              label={copy.language}
            />
          </nav>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button className="menu-toggle icon-button" aria-label={copy.openMenu}>
                <Menu size={24} />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="dialog-overlay" />
              <Dialog.Content className="mobile-menu">
                <Dialog.Title className="sr-only">{copy.mobileMenuTitle ?? copy.primaryNavigation}</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Khám phá Hồng Tâm Rosic Global
                </Dialog.Description>
                <div className="mobile-menu-top">
                  <Brand />
                  <Dialog.Close asChild>
                    <button className="icon-button" aria-label={copy.closeMenu}>
                      <X />
                    </button>
                  </Dialog.Close>
                </div>
                <nav>
                  {NAV.map((item, index) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                    >
                      <span>0{index + 1}</span>
                      {copy.nav[item.key]}
                      <ArrowUpRight />
                    </a>
                  ))}
                </nav>
                <a className="mobile-export-link" href="#export-catalog" onClick={() => setOpen(false)}>
                  <span>08</span>
                  {copy.exportCatalog}
                  <ArrowUpRight />
                </a>
                <LanguagePicker
                  className="mobile-language"
                  language={language}
                  onChange={onLanguage}
                  label={copy.language}
                />
                <p>
                  Manufacturing with Heart,
                  <br />
                  Trading with Vision.
                </p>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </header>
    </>
  );
}
function Hero({ copy }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  return (
    <section id="home" className="hero-section" ref={ref}>
      <div className="hero-copy container">
        <Motion.p
          className="eyebrow"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <span className="eyebrow-line" />
          {copy.hero.eyebrow}
        </Motion.p>
        <h1>
          <span className="title-line">
            <Motion.span
              initial={reduce ? false : { y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            >
              {copy.hero.start}
            </Motion.span>
          </span>
          <span className="title-line title-accent">
            <Motion.span
              initial={reduce ? false : { y: "105%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.95,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {copy.hero.accent}
            </Motion.span>
          </span>
        </h1>
        <Motion.div
          initial={reduce ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          <p className="hero-description">
            {copy.hero.first}
            <br />
            {copy.hero.second}
          </p>
          <a className="button button-primary" href="#export-catalog">
            {copy.hero.cta} <ArrowUpRight size={18} />
          </a>
        </Motion.div>
      </div>
      <div className="hero-landscape">
        <Motion.img
          src="/images/hero.webp"
          alt={copy.hero.origin}
          fetchPriority="high"
          width="1672"
          height="941"
          style={reduce ? undefined : { y }}
        />
        <div className="landscape-caption">
          <span>{copy.hero.origin}</span>
          <span>{copy.hero.caption}</span>
          <Leaf size={22} strokeWidth={1.3} />
        </div>
      </div>
    </section>
  );
}
function Marquee({ copy }) {
  const [paused, setPaused] = useState(false);
  const words = copy.marquee;
  return (
    <section
      className={`marquee-section ${paused ? "is-paused" : ""}`}
      aria-label={copy.marqueeLabel}
      aria-description={copy.marqueeHelp}
      tabIndex={0}
      onClick={() => setPaused((value) => !value)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setPaused((value) => !value);
        }
      }}
    >
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div
            className="marquee-group"
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
          >
            {words.map((word) => (
              <span key={word}>
                {word}
                <Sprout
                  className="marquee-flower"
                  aria-hidden="true"
                  strokeWidth={1.2}
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
function About() {
  return (
    <section id="about" className="about-section section-pad">
      <div className="container about-grid">
        <Reveal className="about-photo">
          <img
            src="/images/produce.webp"
            alt="Xoài, thanh long ruột đỏ, dưa lưới, bơ, hạt điều và cà phê trên nền sáng"
            loading="lazy"
            width="1536"
            height="1024"
          />
          <div className="photo-border" aria-hidden="true" />
        </Reveal>
        <Reveal className="about-copy">
          <p className="eyebrow">CÂU CHUYỆN HỒNG TÂM</p>
          <h2 className="section-heading">
            Gốc rễ Việt Nam.
            <br />
            Tầm nhìn toàn cầu.
          </h2>
          <p>
            Chúng tôi tin rằng giá trị của nông sản bắt đầu từ sự tận tâm với
            đất, với người trồng và với từng sản phẩm.
          </p>
          <p>
            Hồng Tâm Rosic Global kết nối nguồn nông sản Việt với nhu cầu của
            đối tác trong nước và quốc tế. Mỗi cuộc hợp tác bắt đầu bằng việc
            hiểu đúng nhu cầu, trao đổi rõ ràng và cùng xây dựng một hướng đi
            lâu dài.
          </p>
          <a className="text-link" href="#journey">
            Khám phá hành trình của chúng tôi <ArrowUpRight size={18} />
          </a>
          <div className="about-signature">
            <span>Hồng Tâm</span>
            <p>
              Manufacturing with Heart,
              <br />
              Trading with Vision.
            </p>
          </div>
        </Reveal>
      </div>
      <Reveal className="container values-band">
        <div>
          <Sprout />
          <h3>Từ nguồn trồng</h3>
          <p>Quan tâm đến xuất xứ.</p>
        </div>
        <div>
          <PackageCheck />
          <h3>Đến từng sản phẩm</h3>
          <p>Chăm chút khâu lựa chọn.</p>
        </div>
        <div>
          <Globe2 />
          <h3>Qua mỗi kết nối</h3>
          <p>Hướng đến hợp tác dài lâu.</p>
        </div>
      </Reveal>
    </section>
  );
}
function Catalog({ category, setCategory, onProduct, copy }) {
  const [query, setQuery] = useState("");
  const normalize = (value) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d");
  const visible = PRODUCTS.filter(
    (product) =>
      (category === "all" || category === product.category) &&
      normalize(product.title).includes(normalize(query.trim())),
  );
  return (
    <section id="products" className="catalog-section section-pad">
      <div className="container">
        <Reveal className="section-intro">
          <p className="eyebrow">{copy.catalog.eyebrow}</p>
          <h2 className="section-heading">{copy.catalog.title}</h2>
          <p>{copy.catalog.body}</p>
        </Reveal>
        <div className="catalog-tools">
          <div className="category-tabs" aria-label={copy.catalog.filter}>
            {CATEGORIES.map((item) => (
              <button
                key={item.id}
                className={category === item.id ? "active" : ""}
                aria-pressed={category === item.id}
                onClick={() => setCategory(item.id)}
              >
                {copy.tabs[item.id] ?? item.label}
              </button>
            ))}
          </div>
          <label className="product-search">
            <Search size={18} />
            <input
              aria-label={copy.catalog.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy.catalog.search}
              type="search"
            />
          </label>
        </div>
        <p className="sr-only" role="status">
          {visible.length} sản phẩm
        </p>
        <Motion.div layout className="product-grid">
          <AnimatePresence mode="popLayout">
            {visible.map((product, index) => (
              <Motion.article
                layout
                className="product-card"
                key={product.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: index * 0.035 }}
              >
                <button
                  className="product-open"
                  onClick={() => onProduct(product)}
                  aria-label={`Xem ${product.title}`}
                >
                  <div className="product-image">
                    <img
                      src={product.image}
                      alt={product.alt}
                      loading="lazy"
                      width="640"
                      height="640"
                    />
                    <span className="product-detail-tab">
                      {copy.catalog.detail} <ArrowUpRight size={17} />
                    </span>
                  </div>
                  <div className="product-meta">
                    <span>{product.group}</span>
                    <span>
                      {String(PRODUCTS.indexOf(product) + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3>{product.title}</h3>
                  <p>{product.short}</p>
                </button>
              </Motion.article>
            ))}
          </AnimatePresence>
        </Motion.div>
        {!visible.length && (
          <div className="empty-state">
            <Search size={32} />
            <h3>{copy.catalog.noResultTitle}</h3>
            <p>{copy.catalog.noResultBody}</p>
            <button
              className="button button-outline"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
            >
              {copy.catalog.reset} <ArrowRight size={18} />
            </button>
          </div>
        )}
        <p className="catalog-note">
          {copy.catalog.note}
        </p>
      </div>
    </section>
  );
}
function Journey() {
  const [step, setStep] = useState(0);
  const current = JOURNEY[step];
  return (
    <section id="journey" className="journey-section section-pad">
      <div className="container">
        <Reveal className="section-intro">
          <h2 className="section-heading">
            Một hành trình.
            <br />
            Vẹn nguyên sự tận tâm.
          </h2>
          <p>
            Từ lựa chọn nguồn hàng đến trao gửi sản phẩm, mỗi bước đều cần sự
            thấu hiểu và phối hợp.
          </p>
        </Reveal>
        <div className="journey-layout">
          <div className="journey-steps" aria-label="Các bước trong hành trình">
            {JOURNEY.map((item, index) => (
              <button
                key={item.title}
                className={`journey-step ${step === index ? "active" : ""}`}
                aria-expanded={step === index}
                aria-controls="journey-panel"
                onClick={() => setStep(index)}
              >
                <span className="step-number">0{index + 1}</span>
                <span>
                  <span className="step-title">{item.title}</span>
                  <span className="step-description">{item.description}</span>
                </span>
                <span className="step-icon">
                  {step === index ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>
            ))}
          </div>
          <div
            className="journey-visual"
            role="region"
            id="journey-panel"
            aria-label={current.title}
          >
            <AnimatePresence mode="wait">
              <Motion.div
                key={step}
                className="journey-photo"
                initial={{ opacity: 0, scale: 1.025 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              >
                <img
                  src={current.image}
                  alt={current.alt}
                  loading="lazy"
                  width="800"
                  height="800"
                />
                <div className="journey-image-caption">
                  <span>0{step + 1} / 04</span>
                  <span>{current.caption}</span>
                </div>
              </Motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
function Partners() {
  return (
    <section id="testimonials" className="partners-section section-pad">
      <div className="container">
        <Reveal className="partners-statement">
          <Globe2 size={38} strokeWidth={1} />
          <h2>
            Đi xa hơn,
            <br />
            khi đi <span>cùng nhau.</span>
          </h2>
          <p>
            Từ nhà phân phối, đơn vị bán lẻ đến đối tác nhập khẩu, chúng tôi
            luôn trân trọng những kết nối cùng chung giá trị.
          </p>
          <a href="#contact" className="text-link">
            Trao đổi cơ hội hợp tác <ArrowUpRight size={18} />
          </a>
        </Reveal>
      </div>
      <Feedback />
      <div className="container">
        <div id="stats" className="partner-types">
          <span>Nhà phân phối</span>
          <span>Bán lẻ & thực phẩm</span>
          <span>Đối tác nhập khẩu</span>
          <span>Đơn vị sản xuất</span>
        </div>
        <div id="certifications" className="quality-note">
          <PackageCheck size={22} />
          <div>
            <h3>Rõ ràng ngay từ đầu</h3>
            <p>
              Xuất xứ, quy cách, hồ sơ chất lượng và điều kiện giao hàng cần
              được đối chiếu cho từng sản phẩm và từng đơn hàng.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
function Journal({ onArticle }) {
  return (
    <section id="blog" className="journal-section section-pad">
      <div className="container">
        <Reveal className="section-intro">
          <h2 className="section-heading">Chuyện từ những mùa xanh.</h2>
          <p>
            Những góc nhìn về sản phẩm, nguồn trồng và cách bắt đầu một cuộc hợp
            tác.
          </p>
        </Reveal>
        <div className="journal-grid">
          {ARTICLES.map((article, index) => (
            <Reveal
              key={article.id}
              delay={index * 0.1}
              className={`journal-card journal-card-${index}`}
            >
              <button onClick={() => onArticle(article)}>
                <div className="journal-image">
                  <img
                    src={article.image}
                    alt={article.alt}
                    loading="lazy"
                    width="800"
                    height="600"
                  />
                </div>
                <div className="journal-meta">
                  <span>{article.category}</span>
                  <span>{article.readTime} phút đọc</span>
                </div>
                <h3>{article.title}</h3>
                <span className="text-link">
                  Đọc câu chuyện <ArrowUpRight size={18} />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function Footer({ onPolicy, onFilter, language, onLanguage, copy }) {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <Brand footer />
          <p className="footer-tagline">
            {copy.footer.tagline[0]}
            <br />
            {copy.footer.tagline[1]}
          </p>
        </div>
        <div className="footer-column">
          <h3>{copy.footer.explore}</h3>
          {NAV.filter((item) => item.href !== "#home").map((item) => (
            <a key={item.href} href={item.href}>
              {copy.nav[item.key]}
            </a>
          ))}
        </div>
        <div className="footer-column">
          <h3>{copy.footer.products}</h3>
          <a href="#export-catalog">{copy.exportCatalog}</a>
          {CATEGORIES.slice(1).map((category) => (
            <a
              key={category.id}
              href="#products"
              onClick={() => onFilter(category.id)}
            >
              {copy.tabs[category.id] ?? category.label}
            </a>
          ))}
        </div>
        <div className="footer-invitation">
          <span>{copy.footer.invitation}</span>
          <a href="#contact">
            {copy.footer.greeting} <ArrowUpRight />
          </a>
          <p>
            Manufacturing with Heart,
            <br />
            Trading with Vision.
          </p>
          <div className="footer-socials" aria-label={copy.footer.social}>
            <a href="https://wa.me/84962284872" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={16} /></a>
            <a href="https://vn.linkedin.com/company/hong-tam-rosic-global-manufacturing-trading-joint-stock-company" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Network size={16} /></a>
            <a href="mailto:info@rosicglobal.com" aria-label="Email"><Mail size={16} /></a>
          </div>
          <LanguagePicker
            compact
            className="footer-language"
            language={language}
            onChange={onLanguage}
            label={copy.language}
          />
        </div>
      </div>
      <div className="container footer-bottom">
        <span className="footer-copyright">Copyright © HONG TAM ROSIC GLOBAL JSC. All rights reserved.</span>
        <div className="footer-bottom-actions">
          <button onClick={onPolicy}>{copy.footer.privacy}</button>
          <a href="#home">
            {copy.footer.backTop} <ArrowUp size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
function DetailDialog({ selected, onClose, onQuote, copy }) {
  const lastFocused = useRef(null);
  useEffect(() => {
    if (selected) lastFocused.current = document.activeElement;
  }, [selected]);
  return (
    <Dialog.Root
      open={!!selected}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content
          className={`detail-dialog ${selected?.type === "product" ? "product-dialog" : "article-dialog"}`}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            lastFocused.current?.focus({ preventScroll: true });
          }}
        >
          <Dialog.Close
            className="dialog-close icon-button"
            aria-label={copy.dialog.close}
          >
            <X />
          </Dialog.Close>
          {selected?.type === "product" ? (
            <>
              <img
                className="detail-image"
                src={selected.data.image}
                alt={selected.data.alt}
              />
              <div className="detail-body">
                <p className="eyebrow">{selected.data.group}</p>
                <Dialog.Title>{selected.data.title}</Dialog.Title>
                <Dialog.Description>
                  {selected.data.description}
                </Dialog.Description>
                <div className="product-detail-facts">
                  <div>
                    <span>{copy.dialog.productGroup}</span>
                    <strong>{selected.data.group}</strong>
                  </div>
                  <div>
                    <span>{copy.dialog.format}</span>
                    <strong>{copy.dialog.formatValue}</strong>
                  </div>
                </div>
                <p className="form-note">
                  {copy.dialog.imageNote}
                </p>
                <button
                  className="button button-primary"
                  onClick={() => onQuote(selected.data.title)}
                >
                  {copy.dialog.request} <ArrowUpRight size={18} />
                </button>
              </div>
            </>
          ) : selected?.type === "article" ? (
            <>
              <img
                className="article-cover"
                src={selected.data.image}
                alt={selected.data.alt}
              />
              <div className="detail-body">
                <p className="eyebrow">{selected.data.category}</p>
                <Dialog.Title>{selected.data.title}</Dialog.Title>
                <Dialog.Description>{selected.data.excerpt}</Dialog.Description>
                {selected.data.sections.map((section) => (
                  <div className="article-section" key={section.title}>
                    <h3>{section.title}</h3>
                    <p>{section.body}</p>
                  </div>
                ))}
                <a className="text-link" href="#contact" onClick={onClose}>
                  Cùng trao đổi thêm <ArrowUpRight size={18} />
                </a>
              </div>
            </>
          ) : (
            <div className="detail-body">
              <Dialog.Title>{copy.dialog.policyTitle}</Dialog.Title>
              <Dialog.Description>{copy.dialog.policyLead}</Dialog.Description>
              <div className="article-section">
                <h3>Thông tin sản phẩm</h3>
                <p>
                  Danh mục và ảnh được dùng để giới thiệu nhóm sản phẩm. Một số
                  hình ảnh minh họa được tạo bằng công cụ AI. Ảnh không xác nhận
                  một vùng trồng hay cơ sở thuộc sở hữu doanh nghiệp. Thông số,
                  nguồn gốc, hồ sơ chất lượng và khả năng cung ứng cần được xác
                  nhận khi trao đổi.
                </p>
              </div>
              <div className="article-section">
                <h3>Yêu cầu báo giá</h3>
                <p>
                  Biểu mẫu giúp bạn soạn nội dung yêu cầu. Website không tự động
                  gửi thông tin và không lưu biểu mẫu trên máy chủ. Chỉ khi bạn
                  chọn gửi trong ứng dụng email hoặc chia sẻ tệp, thông tin mới
                  rời khỏi thiết bị theo thao tác của bạn.
                </p>
              </div>
              <div className="article-section">
                <h3>Nội dung tham khảo</h3>
                <p>
                  Các bài viết là nội dung giới thiệu và hướng dẫn trao đổi đơn
                  hàng; không phải hồ sơ chứng nhận hoặc thông báo kết quả kinh
                  doanh.
                </p>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
function SiteApp() {
  const [language, setLanguage] = useSiteLanguage("vi");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null);
  const [prefilledProduct, setPrefilledProduct] = useState({
    title: "",
    id: 0,
  });
  const reduced = useReducedMotion();
  const copy = siteCopyFor(language);
  useEffect(() => {
    const scrollHome = () => {
      if (window.location.hash === "#home")
        window.scrollTo({ top: 0, behavior: "instant" });
    };
    const onHomeLink = (event) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      if (!event.target.closest('a[href="#home"]')) return;
      event.preventDefault();
      if (window.location.hash !== "#home")
        window.history.pushState(null, "", "#home");
      window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
    };
    scrollHome();
    document.addEventListener("click", onHomeLink);
    window.addEventListener("hashchange", scrollHome);
    return () => {
      document.removeEventListener("click", onHomeLink);
      window.removeEventListener("hashchange", scrollHome);
    };
  }, [reduced]);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 35 });
  const quote = (title) => {
    setSelected(null);
    setPrefilledProduct((previous) => ({ title, id: previous.id + 1 }));
    requestAnimationFrame(() => {
      document
        .querySelector("#contact")
        ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
      window.history.replaceState(null, "", "#contact");
    });
  };
  return (
    <MotionConfig reducedMotion="user">
      <div className="site-app" lang={language} dir={language === "ar" ? "rtl" : "ltr"}>
      <a className="skip-link" href="#main">
        {copy.skip}
      </a>
      <Motion.div
        className="reading-progress"
        style={{ scaleX }}
        aria-hidden="true"
      />
      <Header
        onFilter={setCategory}
        language={language}
        onLanguage={setLanguage}
        copy={copy}
      />
      <main id="main">
        <Hero copy={copy} />
        <Marquee copy={copy} />
        <About />
        <OfficialExportCatalog
          language={language}
          onRequestQuote={({ sourceTitle, title }) => quote(sourceTitle ?? title)}
        />
        <Catalog
          category={category}
          setCategory={setCategory}
          onProduct={(data) => setSelected({ type: "product", data })}
          copy={copy}
        />
        <Journey />
        <Partners />
        <Journal onArticle={(data) => setSelected({ type: "article", data })} />
        <Contact
          prefilledProduct={prefilledProduct.title}
          prefillKey={prefilledProduct.id}
          products={[...PRODUCTS, ...EXPORT_CATEGORIES]}
        />
      </main>
      <Footer
        onPolicy={() => setSelected({ type: "policy" })}
        onFilter={setCategory}
        language={language}
        onLanguage={setLanguage}
        copy={copy}
      />
      <DetailDialog
        selected={selected}
        onClose={() => setSelected(null)}
        onQuote={quote}
        copy={copy}
      />
      </div>
    </MotionConfig>
  );
}

export default function App() {
  const demoView =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("demo")
      : null;
  if (demoView === "catalog") return <CatalogDemo />;
  return MAINTENANCE_MODE ? <MaintenancePage /> : <SiteApp />;
}
