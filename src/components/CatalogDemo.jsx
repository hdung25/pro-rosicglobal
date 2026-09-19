import { useMemo, useState } from "react";
import { motion as Motion, MotionConfig, useReducedMotion } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  FileCheck2,
  Leaf,
  Network,
  Mail,
  Menu,
  MessageCircle,
  PackageCheck,
  ScanSearch,
  X,
} from "lucide-react";
import { EXPORT_CATEGORIES, EXPORT_SPEC_NOTICE } from "../export-catalog";
import { localizeExportCategory } from "../export-catalog-l10n";
import { useSiteLanguage } from "../language";
import { LanguagePicker } from "./LanguagePicker";
import { ProductImageBrand } from "./ProductImageBrand";
import "./CatalogDemo.css";

const COMPANY_LINKEDIN =
  "https://vn.linkedin.com/company/hong-tam-rosic-global-manufacturing-trading-joint-stock-company";

const COPY = {
  vi: {
    home: "Trang chủ",
    categories: "Danh mục",
    standards: "Quy cách",
    compare: "So sánh header",
    contact: "Liên hệ",
    menu: "Mở menu",
    close: "Đóng menu",
    demo: "Bản phác thảo trang trong",
    optionOne: "Phương án 1",
    optionTwo: "Phương án 2",
    optionOneDetail: "Logo giữa, menu tách hai bên",
    optionTwoDetail: "Logo giữa, menu thành một hàng dưới",
    heroKicker: "Danh mục xuất khẩu",
    heroStart: "Nông sản Việt, chuẩn bị cho",
    heroAccent: "mỗi thị trường.",
    heroBody: "Tám nhóm hàng được tổ chức theo quy cách giao dịch, từ nguyên liệu đến phương án đóng gói.",
    explore: "Khám phá nhóm hàng",
    factOne: "8 nhóm hàng trọng tâm",
    factTwo: "Quy cách theo hợp đồng",
    rail: ["Truy xuất nguồn hàng", "Kiểm tra theo lô", "Quy cách rõ ràng", "Đóng gói theo thị trường"],
    categoryTitle: "Tám nhóm hàng cho trao đổi B2B.",
    categoryBody: "Mỗi nhóm dẫn tới phần chỉ tiêu cần chốt, để cuộc trao đổi bắt đầu từ thông tin có thể hành động.",
    openSpec: "Xem quy cách",
    specTitle: "Thông số cần thống nhất trước khi chào giá.",
    specBody: "Chọn một nhóm hàng để xem khung kiểm tra và những điểm cần làm rõ với đơn hàng.",
    form: "Dạng hàng",
    keyChecks: "Điểm cần kiểm tra",
    askSpec: "Yêu cầu quy cách",
    askHint: "Gửi nhu cầu tới đội ngũ xuất khẩu",
    noticeTitle: "Lưu ý cho bản demo",
    headerTitle: "Hai cách đặt logo cho trang trong.",
    headerBody: "Cả hai đều giữ logo ở trung tâm. Chọn phương án để xem trực tiếp trên đúng bố cục trang.",
    social: "Kết nối nhanh",
    footerLead: "Trao đổi nhu cầu về quy cách, hồ sơ và lịch hàng.",
    footerContact: "Liên hệ đội ngũ",
    backTop: "Về đầu trang",
    technicalLanguage: "Các thông số chi tiết được xác nhận bằng ngôn ngữ hợp đồng và COA của lô hàng.",
  },
  en: {
    home: "Home",
    categories: "Categories",
    standards: "Specifications",
    compare: "Header options",
    contact: "Contact",
    menu: "Open menu",
    close: "Close menu",
    demo: "Inner-page layout study",
    optionOne: "Option 1",
    optionTwo: "Option 2",
    optionOneDetail: "Centred logo with split navigation",
    optionTwoDetail: "Centred logo with one navigation row below",
    heroKicker: "Export catalogue",
    heroStart: "Vietnamese agriculture, prepared for",
    heroAccent: "every market.",
    heroBody: "Eight product families are organised around trade-ready specifications, from raw material to packing options.",
    explore: "Explore product families",
    factOne: "8 core product families",
    factTwo: "Contract-led specifications",
    rail: ["Source traceability", "Lot-based checks", "Clear specifications", "Market-ready packing"],
    categoryTitle: "Eight product families for B2B trade.",
    categoryBody: "Each family leads to the checks that matter, so the conversation starts with information your team can use.",
    openSpec: "View specifications",
    specTitle: "What to align before a quotation.",
    specBody: "Choose a product family to review its quality framework and the points to clarify for an order.",
    form: "Product format",
    keyChecks: "Key checks",
    askSpec: "Request specifications",
    askHint: "Send your requirement to the export team",
    noticeTitle: "Demo note",
    headerTitle: "Two logo layouts for inner pages.",
    headerBody: "Both keep the logo centred. Select an option to review it in the actual page structure.",
    social: "Quick links",
    footerLead: "Discuss specifications, documentation and shipment timing.",
    footerContact: "Contact the team",
    backTop: "Back to top",
    technicalLanguage: "Detailed specifications are confirmed in the contract language and the batch COA.",
  },
  zh: {
    home: "首页",
    categories: "产品类别",
    standards: "规格",
    compare: "页眉方案",
    contact: "联系",
    menu: "打开菜单",
    close: "关闭菜单",
    demo: "内页布局方案",
    optionOne: "方案 1",
    optionTwo: "方案 2",
    optionOneDetail: "居中标志，两侧导航",
    optionTwoDetail: "居中标志，下方单行导航",
    heroKicker: "出口产品目录",
    heroStart: "越南农产品，服务于",
    heroAccent: "每一个市场。",
    heroBody: "八大产品类别围绕贸易规格组织，从原料到包装方式均可清晰沟通。",
    explore: "查看产品类别",
    factOne: "8 个核心产品类别",
    factTwo: "以合同为准的规格",
    rail: ["来源可追溯", "批次检验", "规格清晰", "适配市场的包装"],
    categoryTitle: "面向 B2B 贸易的八大产品类别。",
    categoryBody: "每个类别都通往需确认的质量要点，让沟通从可执行的信息开始。",
    openSpec: "查看规格",
    specTitle: "报价前需要确认的参数。",
    specBody: "选择产品类别，查看质量框架及订单中需澄清的项目。",
    form: "产品形态",
    keyChecks: "重点检查项",
    askSpec: "索取规格",
    askHint: "将需求发送给出口团队",
    noticeTitle: "演示说明",
    headerTitle: "内页标志的两种布局。",
    headerBody: "两个方案均将标志置于中央。选择方案即可在实际页面结构中比较。",
    social: "快捷链接",
    footerLead: "沟通规格、文件与发货时间。",
    footerContact: "联系团队",
    backTop: "返回顶部",
    technicalLanguage: "详细规格以合同语言和每批 COA 为准。",
  },
  ko: {
    home: "홈",
    categories: "카테고리",
    standards: "사양",
    compare: "헤더 비교",
    contact: "문의",
    menu: "메뉴 열기",
    close: "메뉴 닫기",
    demo: "내부 페이지 레이아웃",
    optionOne: "안 1",
    optionTwo: "안 2",
    optionOneDetail: "중앙 로고와 양쪽 내비게이션",
    optionTwoDetail: "중앙 로고와 하단 한 줄 내비게이션",
    heroKicker: "수출 카탈로그",
    heroStart: "베트남 농산물,",
    heroAccent: "모든 시장을 위해 준비합니다.",
    heroBody: "8개 제품군을 원료부터 포장 방식까지 거래 사양 중심으로 구성했습니다.",
    explore: "제품군 살펴보기",
    factOne: "8개 핵심 제품군",
    factTwo: "계약 기준 사양",
    rail: ["원산지 추적", "로트별 검사", "명확한 사양", "시장 맞춤 포장"],
    categoryTitle: "B2B 거래를 위한 8개 제품군.",
    categoryBody: "각 제품군은 주문 전 확인할 항목으로 이어져 실무적인 논의를 돕습니다.",
    openSpec: "사양 보기",
    specTitle: "견적 전에 맞춰야 할 사양.",
    specBody: "제품군을 선택해 품질 기준과 주문 전 확인 사항을 검토하세요.",
    form: "제품 형태",
    keyChecks: "주요 확인 항목",
    askSpec: "사양 요청",
    askHint: "수출팀에 요구사항 보내기",
    noticeTitle: "데모 안내",
    headerTitle: "내부 페이지용 로고 배치 두 가지.",
    headerBody: "두 안 모두 로고를 중앙에 둡니다. 실제 페이지 구조에서 바로 비교할 수 있습니다.",
    social: "빠른 연결",
    footerLead: "사양, 서류, 출고 일정을 논의하세요.",
    footerContact: "팀에 문의하기",
    backTop: "맨 위로",
    technicalLanguage: "세부 사양은 계약 언어와 각 로트의 COA로 확정됩니다.",
  },
  ja: {
    home: "ホーム",
    categories: "カテゴリー",
    standards: "仕様",
    compare: "ヘッダー比較",
    contact: "お問い合わせ",
    menu: "メニューを開く",
    close: "メニューを閉じる",
    demo: "内ページのレイアウト案",
    optionOne: "案 1",
    optionTwo: "案 2",
    optionOneDetail: "中央ロゴと左右に分けたナビゲーション",
    optionTwoDetail: "中央ロゴと下段一列のナビゲーション",
    heroKicker: "輸出カタログ",
    heroStart: "ベトナムの農産品を、",
    heroAccent: "あらゆる市場へ。",
    heroBody: "原料から包装方式まで、8つの製品群を取引仕様に沿って整理しました。",
    explore: "製品群を見る",
    factOne: "8つの主要製品群",
    factTwo: "契約に基づく仕様",
    rail: ["原産地の追跡", "ロットごとの検査", "明確な仕様", "市場向け包装"],
    categoryTitle: "B2B取引のための8つの製品群。",
    categoryBody: "各製品群から必要な確認項目へ進み、実務に役立つ対話を始められます。",
    openSpec: "仕様を見る",
    specTitle: "見積もり前に合わせる仕様。",
    specBody: "製品群を選択し、品質枠組みと注文前の確認事項を確認してください。",
    form: "製品形態",
    keyChecks: "確認項目",
    askSpec: "仕様を依頼",
    askHint: "輸出チームへ要件を送る",
    noticeTitle: "デモの注記",
    headerTitle: "内ページ向けのロゴ配置を2案用意しました。",
    headerBody: "どちらもロゴを中央に置きます。実際のページ構成で比較できます。",
    social: "クイックリンク",
    footerLead: "仕様、書類、出荷時期についてご相談ください。",
    footerContact: "チームに連絡",
    backTop: "ページ上部へ",
    technicalLanguage: "詳細仕様は契約言語と各ロットのCOAで確定します。",
  },
  ar: {
    home: "الرئيسية",
    categories: "الفئات",
    standards: "المواصفات",
    compare: "خيارات الترويسة",
    contact: "اتصل بنا",
    menu: "فتح القائمة",
    close: "إغلاق القائمة",
    demo: "دراسة تخطيط الصفحة الداخلية",
    optionOne: "الخيار 1",
    optionTwo: "الخيار 2",
    optionOneDetail: "شعار في الوسط وقائمة من الجانبين",
    optionTwoDetail: "شعار في الوسط وقائمة واحدة في الأسفل",
    heroKicker: "كتالوج التصدير",
    heroStart: "منتجات زراعية فيتنامية، جاهزة",
    heroAccent: "لكل سوق.",
    heroBody: "ثماني عائلات من المنتجات منظمة حول مواصفات تجارية، من المادة الخام إلى خيارات التعبئة.",
    explore: "استكشف عائلات المنتجات",
    factOne: "8 عائلات منتجات أساسية",
    factTwo: "مواصفات حسب العقد",
    rail: ["تتبع المصدر", "فحص حسب الدفعة", "مواصفات واضحة", "تعبئة مناسبة للسوق"],
    categoryTitle: "ثماني عائلات منتجات للتجارة بين الشركات.",
    categoryBody: "تقودك كل عائلة إلى نقاط الفحص المهمة لبدء الحوار بمعلومات قابلة للتنفيذ.",
    openSpec: "عرض المواصفات",
    specTitle: "ما يجب توحيده قبل عرض السعر.",
    specBody: "اختر عائلة منتجات لمراجعة إطار الجودة والنقاط التي يجب توضيحها للطلب.",
    form: "شكل المنتج",
    keyChecks: "نقاط الفحص",
    askSpec: "طلب المواصفات",
    askHint: "أرسل متطلباتك إلى فريق التصدير",
    noticeTitle: "ملاحظة العرض",
    headerTitle: "طريقتان لوضع الشعار في الصفحات الداخلية.",
    headerBody: "يحافظ الخياران على الشعار في الوسط. اختر أحدهما لمراجعته ضمن هيكل الصفحة الفعلي.",
    social: "روابط سريعة",
    footerLead: "ناقش المواصفات والوثائق وموعد الشحن.",
    footerContact: "تواصل مع الفريق",
    backTop: "العودة للأعلى",
    technicalLanguage: "تُعتمد المواصفات التفصيلية بلغة العقد وCOA الخاص بكل دفعة.",
  },
  fr: {
    home: "Accueil",
    categories: "Catégories",
    standards: "Spécifications",
    compare: "Options d'en-tête",
    contact: "Contact",
    menu: "Ouvrir le menu",
    close: "Fermer le menu",
    demo: "Étude de page intérieure",
    optionOne: "Option 1",
    optionTwo: "Option 2",
    optionOneDetail: "Logo centré avec navigation répartie",
    optionTwoDetail: "Logo centré avec une navigation sous le logo",
    heroKicker: "Catalogue export",
    heroStart: "L'agriculture vietnamienne, prête pour",
    heroAccent: "chaque marché.",
    heroBody: "Huit familles de produits sont organisées autour de spécifications commerciales, de la matière première au conditionnement.",
    explore: "Explorer les familles",
    factOne: "8 familles principales",
    factTwo: "Spécifications contractuelles",
    rail: ["Traçabilité de l'origine", "Contrôles par lot", "Spécifications claires", "Conditionnement adapté"],
    categoryTitle: "Huit familles de produits pour le B2B.",
    categoryBody: "Chaque famille mène aux contrôles à clarifier afin de commencer sur des informations exploitables.",
    openSpec: "Voir les spécifications",
    specTitle: "Les points à aligner avant le devis.",
    specBody: "Choisissez une famille afin de consulter son cadre qualité et les points à confirmer pour la commande.",
    form: "Format produit",
    keyChecks: "Contrôles clés",
    askSpec: "Demander les spécifications",
    askHint: "Envoyer votre besoin à l'équipe export",
    noticeTitle: "Note de démo",
    headerTitle: "Deux placements du logo pour les pages intérieures.",
    headerBody: "Les deux maintiennent le logo au centre. Sélectionnez une option pour la comparer dans la structure réelle.",
    social: "Liens rapides",
    footerLead: "Échangez sur les spécifications, documents et calendriers d'expédition.",
    footerContact: "Contacter l'équipe",
    backTop: "Haut de page",
    technicalLanguage: "Les spécifications détaillées sont confirmées dans la langue du contrat et le COA du lot.",
  },
  de: {
    home: "Startseite",
    categories: "Kategorien",
    standards: "Spezifikationen",
    compare: "Header-Optionen",
    contact: "Kontakt",
    menu: "Menü öffnen",
    close: "Menü schließen",
    demo: "Studie für Innenseiten",
    optionOne: "Variante 1",
    optionTwo: "Variante 2",
    optionOneDetail: "Zentriertes Logo mit geteilter Navigation",
    optionTwoDetail: "Zentriertes Logo mit einer Navigation darunter",
    heroKicker: "Exportkatalog",
    heroStart: "Vietnamesische Agrarprodukte, bereit für",
    heroAccent: "jeden Markt.",
    heroBody: "Acht Produktfamilien sind nach handelstauglichen Spezifikationen organisiert, vom Rohstoff bis zur Verpackung.",
    explore: "Produktfamilien entdecken",
    factOne: "8 Kernproduktfamilien",
    factTwo: "Vertraglich definierte Spezifikationen",
    rail: ["Herkunft nachvollziehbar", "Chargenprüfung", "Klare Spezifikationen", "Marktfähige Verpackung"],
    categoryTitle: "Acht Produktfamilien für den B2B-Handel.",
    categoryBody: "Jede Familie führt zu den relevanten Prüfpunkten, damit Gespräche mit umsetzbaren Angaben beginnen.",
    openSpec: "Spezifikationen ansehen",
    specTitle: "Vor dem Angebot abzustimmende Punkte.",
    specBody: "Wählen Sie eine Produktfamilie, um den Qualitätsrahmen und die offenen Punkte für eine Bestellung zu prüfen.",
    form: "Produktform",
    keyChecks: "Wichtige Prüfungen",
    askSpec: "Spezifikationen anfragen",
    askHint: "Anforderung an das Exportteam senden",
    noticeTitle: "Demo-Hinweis",
    headerTitle: "Zwei Logo-Layouts für Innenseiten.",
    headerBody: "Beide halten das Logo in der Mitte. Wählen Sie eine Variante für den Vergleich im echten Seitenaufbau.",
    social: "Schnellzugriff",
    footerLead: "Besprechen Sie Spezifikationen, Unterlagen und Versandtermine.",
    footerContact: "Team kontaktieren",
    backTop: "Nach oben",
    technicalLanguage: "Detaillierte Spezifikationen werden in Vertragssprache und im COA jeder Charge bestätigt.",
  },
};

function categoryName(category, language) {
  return localizeExportCategory(category, language).title;
}

function categoryContent(category, language) {
  const localized = localizeExportCategory(category, language);
  return {
    alt: localized.alt,
    description: localized.description,
    overview: localized.overview,
    forms: localized.forms,
    checks: localized.checks,
    groups: localized.specGroups,
    notice: localized.notice ?? EXPORT_SPEC_NOTICE,
  };
}

const ACCESSIBILITY_COPY = {
  vi: { skip: "Đi tới nội dung", navigation: "Điều hướng danh mục", highlights: "Điểm nổi bật của danh mục", rail: "Nguyên tắc danh mục xuất khẩu", closeDetail: "Đóng chi tiết sản phẩm", language: "Chọn ngôn ngữ" },
  en: { skip: "Skip to content", navigation: "Catalogue navigation", highlights: "Catalogue highlights", rail: "Export catalogue principles", closeDetail: "Close product details", language: "Choose language" },
  zh: { skip: "跳至内容", navigation: "产品目录导航", highlights: "目录重点", rail: "出口目录原则", closeDetail: "关闭产品详情", language: "选择语言" },
  ko: { skip: "본문으로 건너뛰기", navigation: "카탈로그 탐색", highlights: "카탈로그 주요 정보", rail: "수출 카탈로그 원칙", closeDetail: "제품 상세 닫기", language: "언어 선택" },
  ja: { skip: "本文へ移動", navigation: "カタログナビゲーション", highlights: "カタログのポイント", rail: "輸出カタログの方針", closeDetail: "商品詳細を閉じる", language: "言語を選択" },
  ar: { skip: "الانتقال إلى المحتوى", navigation: "التنقل في الكتالوج", highlights: "أبرز ما في الكتالوج", rail: "مبادئ كتالوج التصدير", closeDetail: "إغلاق تفاصيل المنتج", language: "اختر اللغة" },
  fr: { skip: "Aller au contenu", navigation: "Navigation du catalogue", highlights: "Points forts du catalogue", rail: "Principes du catalogue export", closeDetail: "Fermer les détails du produit", language: "Choisir la langue" },
  de: { skip: "Zum Inhalt springen", navigation: "Katalognavigation", highlights: "Katalog-Highlights", rail: "Grundsätze des Exportkatalogs", closeDetail: "Produktdetails schließen", language: "Sprache auswählen" },
};

function scrollToId(id, reduced) {
  document.querySelector(id)?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
}

function CatalogBrand() {
  return (
    <a className="catalog-brand" href="#catalog-home" aria-label="Hồng Tâm Rosic Global">
      <img src="/brand-mark.svg" alt="Hồng Tâm Rosic Global" width="445" height="159" />
      <span>HỒNG TÂM ROSIC GLOBAL</span>
    </a>
  );
}

function CatalogHeader({ copy, labels, headerVariant, onHeaderVariant, language, onLanguage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = [
    { href: "#catalog-home", label: copy.home },
    { href: "#catalog-categories", label: copy.categories },
    { href: "#catalog-specifications", label: copy.standards },
    { href: "#catalog-header-options", label: copy.compare },
    { href: "#catalog-contact", label: copy.contact },
  ];
  const leftNav = nav.slice(0, 2);
  const rightNav = nav.slice(2);

  const closeMenu = () => setMenuOpen(false);
  const navigation = (items, className) => (
    <nav className={className} aria-label={labels.navigation}>
      {items.map((item) => (
        <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>
      ))}
    </nav>
  );

  return (
    <>
      <header className={`catalog-header ${headerVariant === "split" ? "catalog-header-split" : "catalog-header-stacked"}`}>
        <div className="catalog-header-shell">
          {headerVariant === "split" ? (
            <>
              {navigation(leftNav, "catalog-nav catalog-nav-left")}
              <CatalogBrand />
              <div className="catalog-header-right">
                {navigation(rightNav, "catalog-nav catalog-nav-right")}
                <LanguagePicker compact language={language} onChange={onLanguage} label={labels.language} />
              </div>
            </>
          ) : (
            <>
              <div className="catalog-stacked-top">
                <CatalogBrand />
                <LanguagePicker compact language={language} onChange={onLanguage} label={labels.language} />
              </div>
              {navigation(nav, "catalog-nav catalog-nav-stacked")}
            </>
          )}
          <button className="catalog-menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="catalog-mobile-menu" aria-label={menuOpen ? copy.close : copy.menu}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>
      <div id="catalog-mobile-menu" className={`catalog-mobile-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="catalog-mobile-menu-inner">
          {navigation(nav, "catalog-mobile-nav")}
          <LanguagePicker language={language} onChange={onLanguage} label={labels.language} />
        </div>
      </div>
      <div className="catalog-variant-strip" aria-label={copy.compare}>
        <span>{copy.demo}</span>
        <div className="catalog-variant-controls">
          <button type="button" className={headerVariant === "split" ? "is-active" : ""} onClick={() => onHeaderVariant("split")} aria-pressed={headerVariant === "split"}>{copy.optionOne}</button>
          <button type="button" className={headerVariant === "stacked" ? "is-active" : ""} onClick={() => onHeaderVariant("stacked")} aria-pressed={headerVariant === "stacked"}>{copy.optionTwo}</button>
        </div>
      </div>
    </>
  );
}

function SocialLinks({ copy }) {
  const socials = [
    { label: "WhatsApp", href: "https://wa.me/84962284872", icon: <MessageCircle size={18} strokeWidth={1.8} aria-hidden="true" />, external: true },
    { label: "LinkedIn", href: COMPANY_LINKEDIN, icon: <Network size={18} strokeWidth={1.8} aria-hidden="true" />, external: true },
    { label: "Email", href: "mailto:info@rosicglobal.com", icon: <Mail size={18} strokeWidth={1.8} aria-hidden="true" />, external: false },
  ];
  return (
    <div className="catalog-socials" aria-label={copy.social}>
      <span>{copy.social}</span>
      <div>
        {socials.map(({ label, href, icon, external }) => (
          <a key={label} href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} aria-label={label}>
            {icon}
          </a>
        ))}
      </div>
    </div>
  );
}

function CategoryDetailDialog({ category, content, copy, labels, language, onClose, onViewSpecifications }) {
  const reduced = useReducedMotion();
  const title = category ? categoryName(category, language) : "";
  return (
    <Dialog.Root open={Boolean(category)} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="catalog-detail-overlay" />
        <Dialog.Content className="catalog-detail-dialog">
          <Dialog.Close className="catalog-detail-close" aria-label={labels.closeDetail}><X size={21} /></Dialog.Close>
          {category && (
            <div className="catalog-detail-scroll">
              <div className="catalog-detail-visual"><img src={category.image} alt={content.alt} width="1200" height="900" /><ProductImageBrand /></div>
              <div className="catalog-detail-content">
                <p className="catalog-kicker">{category.number} · {copy.standards}</p>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Description>{content.overview}</Dialog.Description>
                <div className="catalog-detail-groups">
                  {content.groups.map((group) => (
                    <section key={group.title}>
                      <h3>{group.title}</h3>
                      {group.items.map((item) => <p key={item.label}><strong>{item.label}</strong><span>{item.value}</span></p>)}
                    </section>
                  ))}
                </div>
                <button className="catalog-detail-action" type="button" onClick={() => { onViewSpecifications(category.id); onClose(); requestAnimationFrame(() => scrollToId("#catalog-specifications", reduced)); }}>
                  {copy.openSpec}<ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function CatalogDemo() {
  const reduced = useReducedMotion();
  const [language, setLanguage] = useSiteLanguage("vi");
  const [headerVariant, setHeaderVariant] = useState("split");
  const [activeId, setActiveId] = useState(EXPORT_CATEGORIES[0].id);
  const [detailCategory, setDetailCategory] = useState(null);
  const copy = COPY[language] ?? COPY.vi;
  const labels = ACCESSIBILITY_COPY[language] ?? ACCESSIBILITY_COPY.vi;
  const activeCategory = useMemo(
    () => EXPORT_CATEGORIES.find((category) => category.id === activeId) ?? EXPORT_CATEGORIES[0],
    [activeId],
  );
  const activeContent = useMemo(
    () => categoryContent(activeCategory, language),
    [activeCategory, language],
  );

  const selectCategory = (id, shouldScroll = false) => {
    setActiveId(id);
    if (shouldScroll) requestAnimationFrame(() => scrollToId("#catalog-specifications", reduced));
  };

  const handleSpecKeyDown = (event, index) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0
      : event.key === "End" ? EXPORT_CATEGORIES.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + EXPORT_CATEGORIES.length) % EXPORT_CATEGORIES.length;
    const nextCategory = EXPORT_CATEGORIES[nextIndex];
    selectCategory(nextCategory.id);
    requestAnimationFrame(() => document.getElementById(`catalog-tab-${nextCategory.id}`)?.focus());
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="catalog-demo" lang={language} dir={language === "ar" ? "rtl" : "ltr"}>
        <a className="catalog-skip-link" href="#catalog-main">{labels.skip}</a>
        <CatalogHeader copy={copy} labels={labels} headerVariant={headerVariant} onHeaderVariant={setHeaderVariant} language={language} onLanguage={setLanguage} />
        <main id="catalog-main">
          <section id="catalog-home" className="catalog-hero">
            <div className="catalog-wrap catalog-hero-grid">
              <Motion.div className="catalog-hero-copy" initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
                <p className="catalog-kicker">{copy.heroKicker}</p>
                <h1>{copy.heroStart} <em>{copy.heroAccent}</em></h1>
                <p>{copy.heroBody}</p>
                <a className="catalog-primary-link" href="#catalog-categories">{copy.explore}<ArrowRight size={18} aria-hidden="true" /></a>
                <div className="catalog-hero-facts" aria-label={labels.highlights}>
                  <span><Leaf size={16} aria-hidden="true" />{copy.factOne}</span>
                  <span><FileCheck2 size={16} aria-hidden="true" />{copy.factTwo}</span>
                </div>
              </Motion.div>
              <Motion.figure className="catalog-hero-image" initial={reduced ? false : { opacity: 0, scale: 0.975 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>
                <img src="/images/export-categories-hero.webp" alt={language === "vi" ? "Hạt điều, quế, tiêu, hoa hồi, cà phê, dừa và trái cây sấy trong bố cục nông sản xuất khẩu" : `${copy.heroKicker}: ${copy.factOne}`} width="1668" height="939" fetchPriority="high" />
              </Motion.figure>
            </div>
          </section>

          <div className="catalog-rail" aria-label={labels.rail}>
            <div className="catalog-rail-track">
              {[...copy.rail, ...copy.rail].map((item, index) => <span key={`${item}-${index}`}><Check size={15} aria-hidden="true" />{item}</span>)}
            </div>
          </div>

          <section id="catalog-categories" className="catalog-categories catalog-section">
            <div className="catalog-wrap">
              <div className="catalog-section-heading">
                <h2>{copy.categoryTitle}</h2>
                <p>{copy.categoryBody}</p>
              </div>
              <div className="catalog-category-grid">
                {EXPORT_CATEGORIES.map((category, index) => {
                  const content = categoryContent(category, language);
                  return (
                    <Motion.article className={`catalog-category-card catalog-category-${index + 1}`} key={category.id} initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.48, delay: (index % 4) * 0.05 }}>
                      <button type="button" onClick={() => setDetailCategory(category)} aria-label={`${copy.openSpec}: ${categoryName(category, language)}`}>
                        <div className="catalog-category-image">
                          <img src={category.image} alt={content.alt} width="800" height="640" loading="lazy" />
                          <ProductImageBrand />
                          <span className="catalog-detail-tab">{copy.openSpec}<ArrowUpRight size={16} aria-hidden="true" /></span>
                        </div>
                        <div className="catalog-category-content">
                          <span className="catalog-category-number">{category.number}</span>
                          <h3>{categoryName(category, language)}</h3>
                          <p>{content.description}</p>
                          <span className="catalog-card-link">{copy.openSpec}<ChevronRight size={17} aria-hidden="true" /></span>
                        </div>
                      </button>
                    </Motion.article>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="catalog-specifications" className="catalog-specifications catalog-section">
            <div className="catalog-wrap">
              <div className="catalog-spec-intro">
                <p className="catalog-kicker">{copy.standards}</p>
                <h2>{copy.specTitle}</h2>
                <p>{copy.specBody}</p>
              </div>
              <div className="catalog-spec-picker" role="tablist" aria-label={copy.categories}>
                {EXPORT_CATEGORIES.map((category, index) => (
                  <button id={`catalog-tab-${category.id}`} key={category.id} type="button" role="tab" aria-controls={`catalog-panel-${category.id}`} aria-selected={activeId === category.id} tabIndex={activeId === category.id ? 0 : -1} className={activeId === category.id ? "is-active" : ""} onClick={() => selectCategory(category.id)} onKeyDown={(event) => handleSpecKeyDown(event, index)}>{categoryName(category, language)}</button>
                ))}
              </div>
              <Motion.div id={`catalog-panel-${activeCategory.id}`} aria-labelledby={`catalog-tab-${activeCategory.id}`} className="catalog-spec-panel" key={activeCategory.id} role="tabpanel" initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }}>
                <div className="catalog-spec-identity">
                  <img src={activeCategory.image} alt={activeContent.alt} width="600" height="500" />
                  <div>
                    <span>{activeCategory.number}</span>
                    <h3>{categoryName(activeCategory, language)}</h3>
                    <p>{activeContent.overview}</p>
                    <div className="catalog-format"><PackageCheck size={18} aria-hidden="true" /><div><strong>{copy.form}</strong><span>{activeContent.forms}</span></div></div>
                  </div>
                </div>
                <div className="catalog-spec-groups">
                  {activeContent.groups.map((group) => (
                    <article key={group.title}>
                      <h4>{group.title}</h4>
                      <dl>
                        {group.items.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
                      </dl>
                    </article>
                  ))}
                </div>
                <div className="catalog-spec-bottom">
                  <div className="catalog-checks"><ScanSearch size={19} aria-hidden="true" /><div><strong>{copy.keyChecks}</strong><span>{activeContent.checks.join(" · ")}</span></div></div>
                  <div className="catalog-spec-notice"><strong>{copy.noticeTitle}</strong><p>{activeContent.notice}</p><p>{copy.technicalLanguage}</p></div>
                  <a className="catalog-primary-link" href={`mailto:info@rosicglobal.com?subject=${encodeURIComponent(`${categoryName(activeCategory, language)} - specification request`)}`}>{copy.askSpec}<ArrowUpRight size={18} aria-hidden="true" /><small>{copy.askHint}</small></a>
                </div>
              </Motion.div>
            </div>
          </section>

          <section id="catalog-header-options" className="catalog-header-options catalog-section">
            <div className="catalog-wrap catalog-header-options-grid">
              <div>
                <p className="catalog-kicker">{copy.compare}</p>
                <h2>{copy.headerTitle}</h2>
                <p>{copy.headerBody}</p>
              </div>
              <div className="catalog-option-list">
                <button type="button" className={headerVariant === "split" ? "is-active" : ""} onClick={() => { setHeaderVariant("split"); scrollToId("#catalog-home", reduced); }}>
                  <span>01</span><div><strong>{copy.optionOne}</strong><small>{copy.optionOneDetail}</small></div><ArrowUpRight size={18} aria-hidden="true" />
                </button>
                <button type="button" className={headerVariant === "stacked" ? "is-active" : ""} onClick={() => { setHeaderVariant("stacked"); scrollToId("#catalog-home", reduced); }}>
                  <span>02</span><div><strong>{copy.optionTwo}</strong><small>{copy.optionTwoDetail}</small></div><ArrowUpRight size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          </section>
        </main>
        <footer id="catalog-contact" className="catalog-footer">
          <div className="catalog-wrap catalog-footer-main">
            <div>
              <CatalogBrand />
              <p>{copy.footerLead}</p>
              <a className="catalog-footer-contact" href="mailto:info@rosicglobal.com">{copy.footerContact}<ArrowUpRight size={18} aria-hidden="true" /></a>
            </div>
            <SocialLinks copy={copy} />
            <LanguagePicker language={language} onChange={setLanguage} label={labels.language} />
          </div>
          <div className="catalog-footer-bottom"><span>Copyright © HONG TAM ROSIC GLOBAL JSC. All rights reserved.</span><a href="#catalog-home">{copy.backTop}<ArrowUpRight size={15} aria-hidden="true" /></a></div>
        </footer>
        <CategoryDetailDialog category={detailCategory} content={detailCategory ? categoryContent(detailCategory, language) : null} copy={copy} labels={labels} language={language} onClose={() => setDetailCategory(null)} onViewSpecifications={(id) => setActiveId(id)} />
      </div>
    </MotionConfig>
  );
}
