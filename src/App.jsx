import { createElement, lazy, Suspense, useEffect, useRef, useState } from "react";
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
import { FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { SiZalo } from "react-icons/si";
import Contact from "./components/Contact";
import Feedback from "./components/Feedback";
import CatalogDemo from "./components/CatalogDemo";
import OfficialExportCatalog from "./components/OfficialExportCatalog";
import { LanguagePicker } from "./components/LanguagePicker";
import { ProductImageBrand } from "./components/ProductImageBrand";
import { ThemeToggle } from "./components/ThemeToggle";
import { useSiteLanguage } from "./language";
import { useSiteTheme } from "./theme";
import { PRODUCTS, CATEGORIES, ARTICLES, JOURNEY } from "./data";
import { EXPORT_CATEGORIES } from "./export-catalog";
import { localizeExportCategory } from "./export-catalog-l10n";
import { localizeProducts } from "./product-l10n";
import {
  localizeArticle,
  localizeJourneyItem,
  siteCopyFor,
} from "./site-copy";

const AdminPanel = lazy(() => import("./components/AdminPanel"));

const NAV = [
  { key: "home", label: "Trang chủ", href: "#home" },
  { key: "products", label: "Sản phẩm", href: "#products" },
  { key: "about", label: "Về chúng tôi", href: "#about" },
  { key: "partners", label: "Đối tác", href: "#testimonials" },
  { key: "oem", label: "OEM/ODM", href: "#export-catalog" },
  { key: "journey", label: "Hành trình", href: "#journey" },
  { key: "journal", label: "Tin tức", href: "#blog" },
  { key: "contact", label: "Liên hệ", href: "#contact" },
];

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/clairehong-hongtamrosicglobal/", icon: FaLinkedinIn, external: true },
  { label: "WhatsApp", href: "https://wa.me/84962284872", icon: FaWhatsapp, external: true },
  { label: "Email", href: "mailto:info@rosicglobal.com", icon: HiOutlineEnvelope },
  { label: "Zalo", href: "https://zalo.me/84962284872", icon: SiZalo, external: true },
];

const DEFAULT_PUBLIC_SOCIAL = Object.fromEntries(
  SOCIAL_LINKS.map(({ label, href }) => [label.toLowerCase(), href]),
);

const navLabel = (copy, item) => copy.nav[item.key] ?? item.label;

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

function Brand({ footer = false, copy, language = "vi" }) {
  const brandCopy = copy?.brand;
  const international = language !== "vi";
  return (
    <a
      className={`brand ${footer ? "brand-footer" : ""}`}
      href="#home"
      aria-label={brandCopy?.homeLabel ?? "Hồng Tâm Rosic Global, trang chủ"}
    >
      <img
        className="brand-mark"
        src="/brand-mark.svg"
        alt={brandCopy?.logoAlt ?? "Biểu trưng Hồng Tâm"}
        width="445"
        height="159"
      />
      <span className="brand-name">
        {international ? "HONG TAM" : "HỒNG TÂM"} <span>ROSIC</span>
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
                <a href="https://www.linkedin.com/in/clairehong-hongtamrosicglobal/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Network size={17} /></a>
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
function Header({ language, onLanguage, theme, onThemeChange, copy, exportCategories = EXPORT_CATEGORIES }) {
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
        <div className="topbar-inner container">
          <ThemeToggle
            className="topbar-theme"
            theme={theme}
            onThemeChange={onThemeChange}
            labels={copy.theme}
          />
          <span className="topbar-message">{copy.brand.topbar}</span>
          <LanguagePicker
            compact
            className="topbar-language"
            language={language}
            onChange={onLanguage}
            label={copy.language}
          />
        </div>
      </div>
      <header className="site-header">
        <div className="nav-shell container">
          <nav className="nav-left" aria-label={copy.primaryNavigation}>
            {NAV.slice(0, 4).map((item) => item.key === "products" ? (
              <div className="nav-dropdown" key={item.href}>
                <a href={item.href} aria-current={active === "products" ? "location" : undefined}>
                  {navLabel(copy, item)} <ChevronDown size={12} />
                </a>
                <div className="dropdown-panel">
                  {exportCategories.map((category) => (
                    <a key={category.id} href="#export-catalog">
                      {localizeExportCategory(category, language).shortTitle ?? localizeExportCategory(category, language).title}
                      <ArrowUpRight size={14} />
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a key={item.href} href={item.href} aria-current={active === item.href.slice(1) ? "location" : undefined}>
                {navLabel(copy, item)}
              </a>
            ))}
          </nav>
          <Brand copy={copy} language={language} />
          <nav className="nav-right" aria-label={copy.productNavigation}>
            {NAV.slice(4).map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={item.key === "contact" ? "nav-contact" : undefined}
                aria-current={active === item.href.slice(1) ? "location" : undefined}
              >
                {navLabel(copy, item)} {item.key === "contact" && <ArrowUpRight size={15} />}
              </a>
            ))}
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
                  {copy.brand.mobileDescription}
                </Dialog.Description>
                <div className="mobile-menu-top">
                  <Brand copy={copy} language={language} />
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
                      {navLabel(copy, item)}
                      <ArrowUpRight />
                    </a>
                  ))}
                </nav>
                <p>
                  {copy.brand.topbar}
                </p>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </header>
    </>
  );
}
function Hero({ copy, image = "/images/hero.webp" }) {
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
          src={image}
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
function About({ copy, image = "/images/produce.webp" }) {
  return (
    <section id="about" className="about-section section-pad">
      <div className="container about-grid">
        <Reveal className="about-photo">
          <img
            src={image}
            alt={copy.about.alt}
            loading="lazy"
            width="1536"
            height="1024"
          />
          <div className="photo-border" aria-hidden="true" />
        </Reveal>
        <Reveal className="about-copy">
          <p className="eyebrow">{copy.about.eyebrow}</p>
          <h2 className="section-heading">
            {copy.about.title[0]}
            <br />
            {copy.about.title[1]}
          </h2>
          <p>{copy.about.first}</p>
          <p>{copy.about.second}</p>
          <a className="text-link" href="#journey">
            {copy.about.link} <ArrowUpRight size={18} />
          </a>
          <div className="about-signature">
            <span>Hồng Tâm</span>
            <p>{copy.brand.topbar}</p>
          </div>
        </Reveal>
      </div>
      <Reveal className="container values-band">
        <div>
          <Sprout />
          <h3>{copy.about.values[0].title}</h3>
          <p>{copy.about.values[0].body}</p>
        </div>
        <div>
          <PackageCheck />
          <h3>{copy.about.values[1].title}</h3>
          <p>{copy.about.values[1].body}</p>
        </div>
        <div>
          <Globe2 />
          <h3>{copy.about.values[2].title}</h3>
          <p>{copy.about.values[2].body}</p>
        </div>
      </Reveal>
    </section>
  );
}
function Catalog({ category, setCategory, onProduct, copy, products }) {
  const [query, setQuery] = useState("");
  const normalize = (value) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d");
  const visible = products.filter(
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
          {copy.catalog.resultCount(visible.length)}
        </p>
        <Motion.div layout className="product-grid">
          <AnimatePresence mode="popLayout">
            {visible.map((product, index) => (
              <Motion.article
                layout
                className="product-card"
                key={product.id}
                initial={{ y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: index * 0.035 }}
              >
                <button
                  className="product-open"
                  onClick={() => onProduct(product)}
                  aria-label={copy.catalog.viewProduct(product.title)}
                >
                  <div className="product-image">
                    <img
                      src={product.image}
                      alt={product.alt}
                      loading="lazy"
                      width="640"
                      height="640"
                    />
                    <ProductImageBrand />
                    <span className="product-detail-tab product-quick-view">
                      {copy.catalog.quickView ?? "Quick View Product"} <ArrowUpRight size={17} />
                    </span>
                  </div>
                  <div className="product-meta">
                    <span>{copy.catalog.productCode ?? "Product Code"}</span>
                    <span>ROS-{String(products.findIndex((item) => item.id === product.id) + 1).padStart(3, "0")}</span>
                  </div>
                  <h3>{product.title}</h3>
                  <span className="product-view-link">
                    {copy.catalog.viewLabel ?? "View Product"} <ArrowUpRight size={15} />
                  </span>
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
function Journey({ copy, language, images }) {
  const [step, setStep] = useState(0);
  const steps = JOURNEY.map((item, index) => ({
    ...localizeJourneyItem(item, index, language),
    image: images?.[index] || item.image,
  }));
  const current = steps[step];
  return (
    <section id="journey" className="journey-section section-pad">
      <div className="container">
        <Reveal className="section-intro">
          <h2 className="section-heading">
            {copy.journey.title[0]}
            <br />
            {copy.journey.title[1]}
          </h2>
          <p>{copy.journey.lead}</p>
        </Reveal>
        <div className="journey-layout">
          <div className="journey-steps" aria-label={copy.journey.label}>
            {steps.map((item, index) => (
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
function Partners({ copy, language }) {
  return (
    <section id="testimonials" className="partners-section section-pad">
      <div className="container">
        <Reveal className="partners-statement">
          <Globe2 size={38} strokeWidth={1} />
          <h2>
            {copy.partners.title[0]}
            <br />
            <span>{copy.partners.title[1]}</span>
          </h2>
          <p>{copy.partners.lead}</p>
          <a href="#contact" className="text-link">
            {copy.partners.link} <ArrowUpRight size={18} />
          </a>
        </Reveal>
      </div>
      <Feedback language={language} />
      <div className="container">
        <div id="stats" className="partner-types">
          {copy.partners.types.map((type) => (
            <span key={type}>{type}</span>
          ))}
        </div>
        <div id="certifications" className="quality-note">
          <PackageCheck size={22} />
          <div>
            <h3>{copy.partners.qualityTitle}</h3>
            <p>{copy.partners.qualityBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
function Journal({ onArticle, copy, language, images }) {
  const articles = ARTICLES.map((article, index) => ({ ...localizeArticle(article, language), image: images?.[index] || article.image }));
  return (
    <section id="blog" className="journal-section section-pad">
      <div className="container">
        <Reveal className="section-intro">
          <h2 className="section-heading">{copy.journal.title}</h2>
          <p>{copy.journal.lead}</p>
        </Reveal>
        <div className="journal-grid">
          {articles.map((article, index) => (
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
                  <span>{copy.journal.minutes(article.readTime)}</span>
                </div>
                <h3>{article.title}</h3>
                <span className="text-link">
                  {copy.journal.read} <ArrowUpRight size={18} />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function Footer({ onPolicy, onFilter, language, onLanguage, theme, onThemeChange, copy, socialLinks }) {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <Brand footer copy={copy} language={language} />
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
              {navLabel(copy, item)}
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
          <p>{copy.brand.topbar}</p>
          <div className="footer-socials" aria-label={copy.footer.social}>
            {SOCIAL_LINKS.map(({ label, href, icon: Icon, external }) => {
              const configuredHref = socialLinks?.[label.toLowerCase()] || href;
              return (
              <a
                key={label}
                href={configuredHref}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                aria-label={label}
                title={label}
              >
                {createElement(Icon, { size: 17, "aria-hidden": true })}
              </a>
            );})}
          </div>
          <LanguagePicker
            compact
            className="footer-language"
            language={language}
            onChange={onLanguage}
            label={copy.language}
          />
          <ThemeToggle
            className="footer-theme"
            theme={theme}
            onThemeChange={onThemeChange}
            labels={copy.theme}
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
              <div className="detail-image-wrap">
                <img
                  className="detail-image"
                  src={selected.data.image}
                  alt={selected.data.alt}
                />
                <ProductImageBrand />
              </div>
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
                  onClick={() => onQuote(selected.data.sourceTitle ?? selected.data.title)}
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
                  {copy.dialog.articleCta} <ArrowUpRight size={18} />
                </a>
              </div>
            </>
          ) : (
            <div className="detail-body">
              <Dialog.Title>{copy.dialog.policyTitle}</Dialog.Title>
              <Dialog.Description>{copy.dialog.policyLead}</Dialog.Description>
              {copy.dialog.policySections.map((section) => (
                <div className="article-section" key={section.title}>
                  <h3>{section.title}</h3>
                  <p>{section.body}</p>
                </div>
              ))}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
function SiteApp({ cms }) {
  const [language, setLanguage] = useSiteLanguage("vi");
  const { theme, setTheme } = useSiteTheme();
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null);
  const [prefilledProduct, setPrefilledProduct] = useState({
    title: "",
    id: 0,
  });
  const reduced = useReducedMotion();
  const baseCopy = siteCopyFor(language);
  const copy = language === "vi" && cms?.content ? {
    ...baseCopy,
    brand: { ...baseCopy.brand, topbar: cms.content.topbar || baseCopy.brand.topbar },
    hero: {
      ...baseCopy.hero,
      eyebrow: cms.content.heroEyebrow || baseCopy.hero.eyebrow,
      start: cms.content.heroStart || baseCopy.hero.start,
      accent: cms.content.heroAccent || baseCopy.hero.accent,
      first: cms.content.heroBody || baseCopy.hero.first,
      second: "",
      cta: cms.content.heroCta || baseCopy.hero.cta,
    },
    about: {
      ...baseCopy.about,
      title: [cms.content.aboutTitle || baseCopy.about.title[0], ""],
      first: cms.content.aboutBody || baseCopy.about.first,
    },
    catalog: {
      ...baseCopy.catalog,
      title: cms.content.catalogTitle || baseCopy.catalog.title,
      body: cms.content.catalogBody || baseCopy.catalog.body,
    },
    journey: {
      ...baseCopy.journey,
      title: [cms.content.journeyTitleStart || baseCopy.journey.title[0], cms.content.journeyTitleAccent || baseCopy.journey.title[1]],
      lead: cms.content.journeyLead || baseCopy.journey.lead,
    },
    partners: {
      ...baseCopy.partners,
      title: [cms.content.partnersTitleStart || baseCopy.partners.title[0], cms.content.partnersTitleAccent || baseCopy.partners.title[1]],
      lead: cms.content.partnersLead || baseCopy.partners.lead,
    },
    journal: {
      ...baseCopy.journal,
      title: cms.content.journalTitle || baseCopy.journal.title,
      lead: cms.content.journalLead || baseCopy.journal.lead,
    },
    footer: {
      ...baseCopy.footer,
      invitation: cms.content.footerTitle || baseCopy.footer.invitation,
    },
  } : baseCopy;
  const localizedProducts = language === "vi" && cms?.products
    ? cms.products.filter((product) => product.status !== "draft")
    : localizeProducts(PRODUCTS, language);
  const sourceExportCategories = language === "vi" && cms?.categories?.length ? cms.categories : EXPORT_CATEGORIES;
  const localizedExportCategories = sourceExportCategories.map((categoryItem) =>
    localizeExportCategory(categoryItem, language),
  );
  const socialLinks = cms?.socialConfigVersion === 2
    ? { ...DEFAULT_PUBLIC_SOCIAL, ...cms.social }
    : DEFAULT_PUBLIC_SOCIAL;
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
        language={language}
        onLanguage={setLanguage}
        theme={theme}
        onThemeChange={setTheme}
        copy={copy}
        exportCategories={sourceExportCategories}
      />
      <main id="main">
        <Hero copy={copy} image={cms?.content?.heroImage} />
        <Marquee copy={copy} />
        <About copy={copy} image={cms?.content?.aboutImage} />
        <OfficialExportCatalog
          language={language}
          categoriesData={sourceExportCategories}
          onRequestQuote={({ sourceTitle, title }) => quote(sourceTitle ?? title)}
        />
        <Catalog
          category={category}
          setCategory={setCategory}
          onProduct={(data) => setSelected({ type: "product", data })}
          copy={copy}
          products={localizedProducts}
        />
        <Journey copy={copy} language={language} images={language === "vi" ? cms?.content?.journeyImages : null} />
        <Partners copy={copy} language={language} />
        <Journal
          copy={copy}
          language={language}
          images={language === "vi" ? cms?.content?.articleImages : null}
          onArticle={(data) => setSelected({ type: "article", data })}
        />
        <Contact
          prefilledProduct={prefilledProduct.title}
          prefillKey={prefilledProduct.id}
          products={[...localizedProducts, ...localizedExportCategories]}
          language={language}
        />
      </main>
      <Footer
        onPolicy={() => setSelected({ type: "policy" })}
        onFilter={setCategory}
        language={language}
        onLanguage={setLanguage}
        theme={theme}
        onThemeChange={setTheme}
        copy={copy}
        socialLinks={socialLinks}
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

function readPublishedCms() {
  try { return JSON.parse(window.localStorage.getItem("rosic-cms-published-v1")); }
  catch { return null; }
}

function usePublishedCms() {
  const [cms, setCms] = useState(readPublishedCms);
  useEffect(() => {
    const sync = () => setCms(readPublishedCms());
    window.addEventListener("storage", sync);
    const channel = "BroadcastChannel" in window ? new BroadcastChannel("rosic-cms") : null;
    if (channel) channel.onmessage = (event) => setCms(event.data || readPublishedCms());
    return () => {
      window.removeEventListener("storage", sync);
      channel?.close();
    };
  }, []);
  return cms;
}

export default function App() {
  const cms = usePublishedCms();
  const adminView =
    typeof window !== "undefined" &&
    (window.location.pathname.replace(/\/$/, "") === "/admin" ||
      new URLSearchParams(window.location.search).get("admin") === "1");
  if (adminView) return (
    <Suspense fallback={<div className="admin-loading">Đang mở ROSIC Content Studio...</div>}>
      <AdminPanel />
    </Suspense>
  );
  const demoView =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("demo")
      : null;
  if (demoView === "catalog") return <CatalogDemo />;
  return MAINTENANCE_MODE || cms?.settings?.maintenanceMode ? <MaintenancePage /> : <SiteApp cms={cms} />;
}
