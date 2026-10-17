import { createElement, lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion as Motion,
  MotionConfig,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  Leaf,
  PackageCheck,
  Globe2,
  Menu,
  X,
  Plus,
  Minus,
  Moon,
  Sun,
  ShieldCheck,
  BadgeCheck,
  HeartHandshake,
  Users,
  Boxes,
  PenTool,
  ClipboardCheck,
  Ship,
} from "lucide-react";
import { FaLinkedinIn, FaWhatsapp, FaFacebookF, FaWeixin, FaTiktok } from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { SiZalo } from "react-icons/si";
import { productSrcSet } from "./product-images";
import DeferredContent from "./components/DeferredContent";
import ContentProtection from "./components/ContentProtection";
import { LanguagePicker } from "./components/LanguagePicker";
import { useSiteLanguage } from "./language";
import { useSiteTheme } from "./theme";
import { ARTICLES, JOURNEY } from "./data";
import {
  localizeArticle,
  localizeJourneyItem,
  siteCopyFor,
} from "./site-copy";

import { ROSIC_VALUES, brandStoryFor } from "./brand-story";
import "./components/ThemeToggle.css";
import "./brand-story.css";
import "./vr4.css";
import "./customer-refinements.css";
import "./vr5.css";
import "./mobile-polish.css";
import "./catalog-v6.css";
import { mergeText } from "./cms/content-overrides";
import SocialChannels from "./components/SocialChannels";
import InstallApp from "./components/InstallApp";
import { SOCIAL_DEFAULTS, configuredSocial, configuredSocialQr } from "./social-config";
import { buildCatalog, groupPath } from "./catalog-v6";
import { catalogCopyFor } from "./catalog-copy";
import { navigate, useLinkInterception, useRoute, useScrollRestoration } from "./router";
import { GroupIcon, GroupPage, GroupsSection, NotFound, ProductFinder, ProductPage } from "./components/CatalogV6";

const AdminPanel = lazy(() => import("./components/AdminPanel"));
const CatalogDemo = lazy(() => import("./components/CatalogDemo"));
const Contact = lazy(() => import("./components/Contact"));
const Feedback = lazy(() => import("./components/Feedback"));

// Four links either side of the centred logo keep the header balanced.
const NAV = [
  { key: "home", label: "Trang chủ", href: "#home" },
  { key: "products", label: "Sản phẩm", href: "#products" },
  { key: "privateLabel", label: "Nhãn hiệu riêng", href: "#private-label" },
  { key: "about", label: "Về chúng tôi", href: "#about" },
  { key: "partners", label: "Đối tác", href: "#testimonials" },
  { key: "journey", label: "Hành trình", href: "#journey" },
  { key: "journal", label: "Tin tức", href: "#blog" },
  { key: "contact", label: "Liên hệ", href: "#contact" },
];

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/clairehong-hongtamrosicglobal/", icon: FaLinkedinIn, external: true },
  { label: "WhatsApp", href: SOCIAL_DEFAULTS.whatsapp, icon: FaWhatsapp, external: true },
  { label: "Email", href: "mailto:info@rosicglobal.com", icon: HiOutlineEnvelope },
  { label: "Facebook", href: SOCIAL_DEFAULTS.facebook, icon: FaFacebookF, external: true },
  { label: "WeChat", href: SOCIAL_DEFAULTS.wechat, icon: FaWeixin, external: true },
  { label: "TikTok", href: "", icon: FaTiktok, external: true },
  { label: "Zalo", href: "https://zalo.me/84962284872", icon: SiZalo, external: true },
];


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

// Logo lock-up: mark + ROSIC set in Cormorant Garamond SemiBold, no slogan.
function Brand({ footer = false, copy, home = true }) {
  const brandCopy = copy?.brand;
  return (
    <a
      className={`brand ${footer ? "brand-footer" : ""}`}
      href={home ? "#home" : "/"}
      aria-label={brandCopy?.homeLabel ?? "Hồng Tâm Rosic Global, trang chủ"}
    >
      <img
        className="brand-mark"
        src="/brand-mark.svg"
        alt={brandCopy?.logoAlt ?? "Biểu trưng Hồng Tâm Rosic Global"}
        width="445"
        height="159"
      />
      <span className="brand-name">ROSIC</span>
    </a>
  );
}

/** Labelled light/dark switch: two clear options instead of an unlabeled icon. */
function ThemeSwitch({ theme, onThemeChange, labels, className = "" }) {
  return (
    <div className={`theme-switch ${className}`.trim()} role="group" aria-label={labels.label}>
      <button type="button" aria-pressed={theme !== "dark"} onClick={() => onThemeChange("light")}>
        <Sun size={14} aria-hidden="true" /><span>{labels.light}</span>
      </button>
      <button type="button" aria-pressed={theme === "dark"} onClick={() => onThemeChange("dark")}>
        <Moon size={14} aria-hidden="true" /><span>{labels.dark}</span>
      </button>
    </div>
  );
}

/**
 * Back-to-top sits in the bottom corner and steps aside whenever a call to
 * action, the quotation form or the footer is on screen, so it never covers
 * an arrow or a button (customer item 3).
 */
function BackToTop({ label, path }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let frame = 0;
    // The button occupies the bottom ~90px of the viewport; hide it while any
    // CTA area overlaps that band.
    const measure = () => {
      frame = 0;
      const band = window.innerHeight - 96;
      const blocked = [...document.querySelectorAll(".contact-form, .site-footer, .private-label__cta, .finder-more, .quote-actions")]
        .some((node) => {
          const rect = node.getBoundingClientRect();
          return rect.top < window.innerHeight && rect.bottom > band;
        });
      setVisible(window.scrollY > 700 && !blocked);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(measure); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    measure();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [path]);
  return (
    <button
      type="button"
      className={`back-to-top${visible ? " is-visible" : ""}`}
      aria-label={label}
      title={label}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}
    >
      <ArrowUp size={19} aria-hidden="true" />
    </button>
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
              <img src="/brand-kit/rosic-logo-stacked.svg" alt="Hồng Tâm Rosic Global" width="600" height="370" />
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
                <a href="https://wa.me/84962284872" target="_blank" rel="noreferrer" aria-label="WhatsApp"><FaWhatsapp size={17} /></a>
                <a href="https://www.linkedin.com/in/clairehong-hongtamrosicglobal/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedinIn size={17} /></a>
                <a href="mailto:info@rosicglobal.com" aria-label="Email"><HiOutlineEnvelope size={17} /></a>
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
function Header({ language, onLanguage, theme, onThemeChange, copy, catalogCopy, groups, onHome }) {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const href = (hash) => (onHome ? hash : `/${hash}`);
  // The product menu opens on click and stays open until the visitor picks an
  // item, clicks elsewhere or presses Escape (customer item 8). It no longer
  // closes on hover-out or scroll.
  useEffect(() => {
    if (!productsOpen) return undefined;
    const outside = (event) => { if (!dropdownRef.current?.contains(event.target)) setProductsOpen(false); };
    const escape = (event) => { if (event.key === "Escape") { setProductsOpen(false); triggerRef.current?.focus(); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [productsOpen]);
  const [active, setActive] = useState("home");
  useEffect(() => {
    if (!onHome) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    const observeSections = () => {
      observer.disconnect();
      NAV.forEach((item) => {
        const node = document.querySelector(item.href);
        if (node) observer.observe(node);
      });
    };
    observeSections();
    window.addEventListener("rosic:content-ready", observeSections);
    return () => { observer.disconnect(); window.removeEventListener("rosic:content-ready", observeSections); };
  }, [onHome]);
  const current = onHome ? active : "products";
  const isCurrent = (item) => current === item.href.slice(1) || (item.key === "products" && current === "export-catalog");
  const link = (item) => (
    <a key={item.key} href={href(item.href)} aria-current={isCurrent(item) ? "location" : undefined}>
      {navLabel(copy, item)}
    </a>
  );
  return (
    <>
      <div className="topbar">
        <div className="topbar-inner container">
          <ThemeSwitch className="topbar-theme" theme={theme} onThemeChange={onThemeChange} labels={catalogCopy.theme} />
          <span className="topbar-message">{copy.brand.topbar}</span>
          <LanguagePicker
            compact
            className="topbar-language header-language"
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
              <div className={`nav-dropdown${productsOpen ? " is-open" : ""}`} key={item.key} ref={dropdownRef}>
                <button
                  ref={triggerRef}
                  type="button"
                  className="products-menu-trigger"
                  aria-expanded={productsOpen}
                  aria-controls="product-menu"
                  aria-current={isCurrent(item) ? "location" : undefined}
                  onClick={() => setProductsOpen((value) => !value)}
                  onKeyDown={(event) => {
                    if (event.key !== "ArrowDown") return;
                    event.preventDefault();
                    setProductsOpen(true);
                    requestAnimationFrame(() => dropdownRef.current?.querySelector(".mega-menu a")?.focus());
                  }}
                >
                  {navLabel(copy, item)} <ChevronDown size={13} aria-hidden="true" />
                </button>
                <div id="product-menu" className="mega-menu" hidden={!productsOpen}>
                  <p className="mega-menu__title">{catalogCopy.nav.productsMenu}</p>
                  <div className="mega-menu__grid">
                    {groups.map((group) => (
                      <a key={group.id} href={groupPath(group.id)} onClick={() => setProductsOpen(false)}>
                        <span className="mega-menu__icon"><GroupIcon group={group} size={20} /></span>
                        <span className="mega-menu__text"><strong>{group.title}</strong><small>{catalogCopy.groups.count(group.count)}</small></span>
                      </a>
                    ))}
                  </div>
                  <a className="mega-menu__all" href="/san-pham" onClick={() => setProductsOpen(false)}>
                    {catalogCopy.nav.allProducts}<ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>
            ) : link(item))}
          </nav>
          <Brand copy={copy} language={language} home={onHome} />
          <nav className="nav-right" aria-label={copy.productNavigation}>
            {NAV.slice(4).map(link)}
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
                  <Brand copy={copy} language={language} home={onHome} />
                  <Dialog.Close asChild>
                    <button className="icon-button" aria-label={copy.closeMenu}>
                      <X />
                    </button>
                  </Dialog.Close>
                </div>
                <nav>
                  {NAV.map((item, index) => (
                    <a
                      key={item.key}
                      href={href(item.href)}
                      style={{ "--menu-index": index }}
                      onClick={() => setOpen(false)}
                    >
                      <span>0{index + 1}</span>
                      {navLabel(copy, item)}
                      <ArrowUpRight />
                    </a>
                  ))}
                </nav>
                <p className="mobile-category-title">{catalogCopy.nav.productsMenu}</p>
                <div className="mobile-category-menu">
                  {groups.map((group) => (
                    <a key={group.id} href={groupPath(group.id)} onClick={() => setOpen(false)}>
                      <GroupIcon group={group} size={18} />
                      <span>{group.title}</span>
                    </a>
                  ))}
                </div>
                <div className="mobile-menu-tools">
                  <ThemeSwitch theme={theme} onThemeChange={onThemeChange} labels={catalogCopy.theme} />
                  <LanguagePicker
                    compact
                    className="mobile-language"
                    language={language}
                    onChange={onLanguage}
                    label={copy.language}
                  />
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </header>
    </>
  );
}
function Hero({ copy, story, image = "/images/rosic-terraces.webp" }) {
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
          {copy.hero.eyebrow}
        </Motion.p>
        <h1>
          <span className="title-line">
            <Motion.span
              initial={reduce ? false : { y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            >
              {story.title[0]}
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
              {story.title[1]}
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
          <a className="button hero-about-button" href="#about">
            {copy.hero.aboutCta || copy.nav.about} <ArrowUpRight size={18} />
          </a>
        </Motion.div>
      </div>
      <div className="hero-landscape">
        <Motion.img
          src={image}
          srcSet={image === "/images/rosic-terraces.webp" ? "/images/rosic-terraces-mobile.webp 960w, /images/rosic-terraces.webp 1920w" : undefined}
          sizes="100vw"
          alt={copy.hero.origin}
          fetchPriority="high"
          width="2560"
          height="1440"
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
function Marquee({ copy, categories }) {
  const [paused, setPaused] = useState(false);
  const words = categories?.length ? categories : copy.marquee.map((title, index) => ({ id: ["processed", "fruit", "vegetables", "nuts"][index], title }));
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
            {words.map((category) => (
              <span key={category.id || category.title}>
                {category.shortTitle ?? category.title}
                <GroupIcon group={category} className="marquee-flower" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
function RosicValues({ story, language, values = ROSIC_VALUES }) {
  const reduce = useReducedMotion();
  const icons = { ShieldCheck, Leaf, BadgeCheck, HeartHandshake, Users };
  return (
    <section className="rosic-section" aria-label="ROSIC">
      <div className="container rosic-layout">
        <p className="rosic-slogan">{story.title[0]}<br /><em>{story.title[1]}</em></p>
        <ul className="rosic-values" dir="ltr">
          {values.map(({ letter, word, icon, explanation, explanationEn }, index) => (
            <Motion.li key={letter} initial={reduce ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.07 }}>
              <span className="rosic-letter">{letter}</span>
              {createElement(icons[icon], { size: 23, strokeWidth: 1.2, 'aria-hidden': true })}
              <span className="rosic-word">{word}</span><span className="rosic-explanation">{language === "vi" ? explanation : explanationEn}</span>
            </Motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
function About({ copy, story, image = "/images/vietnam-produce-w960-hong-tam-rosic.webp" }) {
  return (
    <section id="about" className="about-section section-pad">
      <div className="container">
        <Reveal className="about-story-heading">
          <p className="eyebrow">{copy.about.eyebrow}</p>
          <h2 className="section-heading">{story.slogan}</h2>
        </Reveal>
        <div className="about-grid">
          <Reveal className="about-photo">
            <img src={image} srcSet={productSrcSet(image)} sizes="(max-width: 600px) 90vw, 480px" alt={copy.about.alt} loading="lazy" width="1536" height="1024" />
            <div className="photo-border" aria-hidden="true" />
          </Reveal>
          <Reveal className="about-copy">
            <div className="about-pillars">
              {story.title.map((title, index) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{story.blocks[index]}</p>
                </article>
              ))}
            </div>
            <a className="text-link" href="#journey">{copy.about.link} <ArrowUpRight size={18} /></a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
const PRIVATE_LABEL_ICONS = [Boxes, PenTool, ClipboardCheck, Ship];

/** "Nhãn hiệu riêng" — the OEM/ODM offer now has its own header link and section. */
function PrivateLabel({ copy, image = "/images/vietnam-processed-foods-w960-hong-tam-rosic.webp" }) {
  const content = copy.privateLabel;
  return (
    <section className="private-label section-pad" aria-labelledby="private-label-title">
      <div className="container private-label__grid">
        <Reveal className="private-label__media">
          <img src={image} srcSet={productSrcSet(image)} sizes="(max-width: 900px) 90vw, 560px" alt={content.imageAlt} loading="lazy" width="960" height="960" />
        </Reveal>
        <Reveal className="private-label__copy">
          <p className="eyebrow">{content.eyebrow}</p>
          <h2 id="private-label-title" className="section-heading">{content.title}</h2>
          <p className="private-label__lead">{content.lead}</p>
          <ol className="private-label__steps">
            {content.steps.map((step, index) => (
              <li key={step.title}>
                <span className="private-label__icon">{createElement(PRIVATE_LABEL_ICONS[index], { size: 20, strokeWidth: 1.6, "aria-hidden": true })}</span>
                <span><strong>{step.title}</strong>{step.body}</span>
              </li>
            ))}
          </ol>
          <a className="button button-primary private-label__cta" href="#contact">{content.cta}<ArrowUpRight size={18} aria-hidden="true" /></a>
        </Reveal>
      </div>
    </section>
  );
}
function Journey({ copy, language, images, text }) {
  const [step, setStep] = useState(0);
  const steps = JOURNEY.map((item, index) => ({
    ...mergeText(localizeJourneyItem(item, index, language), text?.[index]),
    image: images?.[index] || item.image,
  }));
  const current = steps[step];
  return (
    <section className="journey-section section-pad">
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
function Partners({ copy, language, textOverrides }) {
  return (
    <section className="partners-section section-pad">
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
      <Suspense fallback={<div className="deferred-feedback" aria-busy="true" />}><Feedback language={language} textOverrides={textOverrides} /></Suspense>
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
function Journal({ onArticle, copy, language, images, text }) {
  const articles = ARTICLES.map((article, index) => ({ ...mergeText(localizeArticle(article, language), text?.[index]), image: images?.[index] || article.image }));
  return (
    <section className="journal-section section-pad">
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
function Footer({ onPolicy, language, onLanguage, copy, socialLinks, socialQr, groups, onHome }) {
  const href = (hash) => (onHome ? hash : `/${hash}`);
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <Brand footer copy={copy} language={language} home={onHome} />
          <p className="footer-tagline">
            {copy.footer.tagline[0]}
            <br />
            {copy.footer.tagline[1]}
          </p>
        </div>
        <div className="footer-column">
          <h3>{copy.footer.explore}</h3>
          {NAV.filter((item) => item.href !== "#home").map((item) => (
            <a key={item.key} href={href(item.href)}>
              {navLabel(copy, item)}
            </a>
          ))}
        </div>
        <div className="footer-column">
          <h3>{copy.footer.products}</h3>
          {groups.map((group) => (
            <a key={group.id} href={groupPath(group.id)}>{group.title}</a>
          ))}
        </div>
        <div className="footer-invitation">
          <span>{copy.footer.invitation}</span>
          <a href={href("#contact")}>
            {copy.footer.greeting} <ArrowUpRight />
          </a>
          <p>{copy.brand.topbar}</p>
          <SocialChannels compact links={socialLinks} qr={socialQr} language={language} />
          <InstallApp language={language} />
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
          <a href={onHome ? "#home" : "/"}>
            {copy.footer.backTop} <ArrowUp size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
function DetailDialog({ selected, onClose, copy }) {
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
          className="detail-dialog article-dialog"
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
          {selected?.type === "article" ? (
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

const DEFAULT_TITLE = "Hồng Tâm Rosic Global | Nông sản Việt Nam xuất khẩu";

/** Page title + description for group and product pages (search results). */
function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | Hồng Tâm Rosic Global` : DEFAULT_TITLE;
    const meta = document.querySelector('meta[name="description"]');
    const previous = meta?.getAttribute("content");
    if (meta && description) meta.setAttribute("content", description);
    return () => { if (meta && previous) meta.setAttribute("content", previous); };
  }, [title, description]);
}

function SiteApp({ cms, preview = false }) {
  const [language, setLanguage] = useSiteLanguage("vi");
  const { theme, setTheme } = useSiteTheme();
  const route = useRoute();
  useLinkInterception();
  useScrollRestoration();
  const [selected, setSelected] = useState(null);
  const [prefill, setPrefill] = useState({ key: "", nonce: 0 });
  const baseCopy = siteCopyFor(language);
  const catalogCopy = catalogCopyFor(language);
  let copy = language === "vi" && cms?.content ? {
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
      aboutCta: cms.content.brandStoryVersion === 4 ? cms.content.heroCta : null,
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
  copy = mergeText(copy, cms?.textOverrides?.[language]?.copy);
  copy = { ...copy, nav: { ...copy.nav, privateLabel: catalogCopy.nav.privateLabel } };
  let story = brandStoryFor(language, copy);
  if (language === "vi" && cms?.content?.brandStoryVersion === 4) {
    story.title = [cms.content.heroStart || story.title[0], cms.content.heroAccent || story.title[1]];
    story.slogan = story.title.join(" – ");
    story.blocks = [cms.content.aboutBody || story.blocks[0], cms.content.aboutVision || story.blocks[1]];
  }
  story = mergeText(story, cms?.textOverrides?.[language]?.story);
  const { groups, products } = useMemo(() => buildCatalog(cms, language), [cms, language]);
  const socialLinks = configuredSocial(cms?.social, cms?.socialConfigVersion);
  const socialQr = configuredSocialQr(cms?.socialQr, socialLinks);

  const onHome = route.kind === "home";
  // Built-in groups and groups added in Admin both resolve by slug.
  const activeGroup = route.groupSlug ? groups.find((item) => item.slug === route.groupSlug) : null;
  const product = route.kind === "product" && activeGroup ? products.find((item) => item.id === route.productId && item.category === activeGroup.id) : null;
  usePageMeta(product?.title ?? activeGroup?.title, product ? `${product.code} · ${product.description}` : activeGroup?.description);

  useEffect(() => {
    if (!onHome) return undefined;
    const scrollHome = () => {
      if (window.location.hash === "#home")
        window.scrollTo({ top: 0, behavior: "instant" });
    };
    const onHomeLink = (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!event.target.closest('a[href="#home"]')) return;
      event.preventDefault();
      if (window.location.hash !== "#home") window.history.pushState(null, "", "#home");
      window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    };
    scrollHome();
    document.addEventListener("click", onHomeLink);
    window.addEventListener("hashchange", scrollHome);
    return () => {
      document.removeEventListener("click", onHomeLink);
      window.removeEventListener("hashchange", scrollHome);
    };
  }, [onHome]);
  // A "/san-pham" deep link opens the home page at the product finder.
  useEffect(() => {
    if (route.kind === "home" && route.hash) navigate(`/#${route.hash}`, { replace: true });
  }, [route.kind, route.hash]);

  const { scrollYProgress } = useScroll();
  const quote = (key) => setPrefill((previous) => ({ key, nonce: previous.nonce + 1 }));
  const contact = (key, compact = false) => (
    <Suspense fallback={<section className="deferred-contact" aria-busy="true" />}>
      <Contact
        sectionId={onHome ? null : "contact"}
        prefillKey={prefill.key || key}
        prefillNonce={prefill.nonce}
        products={products}
        groups={groups}
        language={language}
        socialLinks={socialLinks}
        socialQr={socialQr}
        textOverrides={cms?.textOverrides?.[language]}
        compact={compact}
      />
    </Suspense>
  );

  let page;
  if (onHome) {
    page = (
      <>
        <Hero copy={copy} story={story} image={cms?.content?.heroImage === "/images/hero.webp" ? undefined : cms?.content?.heroImage} />
        <Marquee copy={copy} categories={groups} />
        <RosicValues story={story} language={language} values={mergeText(ROSIC_VALUES, cms?.textOverrides?.[language]?.values)} />
        <About copy={copy} story={story} image={cms?.content?.aboutImage === "/images/produce.webp" ? undefined : cms?.content?.aboutImage} />
        <DeferredContent>
          <GroupsSection groups={groups} products={products} copy={catalogCopy} />
          <ProductFinder groups={groups} products={products} copy={catalogCopy} />
          <PrivateLabel copy={catalogCopy} />
          <Journey copy={copy} language={language} text={cms?.textOverrides?.[language]?.journey} images={cms?.content?.journeyImages} />
          <Partners copy={copy} language={language} textOverrides={cms?.textOverrides?.[language]?.feedback} />
          <Journal
            text={cms?.textOverrides?.[language]?.articles}
            copy={copy}
            language={language}
            images={cms?.content?.articleImages}
            onArticle={(data) => setSelected({ type: "article", data })}
          />
          {contact("")}
        </DeferredContent>
      </>
    );
  } else if (route.kind === "group" && activeGroup) {
    page = <GroupPage key={activeGroup.id} group={activeGroup} groups={groups} products={products} copy={catalogCopy} language={language} onQuote={quote} contact={contact(`group:${activeGroup.id}`, true)} />;
  } else if (product) {
    const related = products.filter((item) => item.category === product.category && item.id !== product.id);
    page = <ProductPage key={product.id} product={product} group={activeGroup} related={related} copy={catalogCopy} language={language} onQuote={quote} socialLinks={socialLinks} contact={contact(product.id, true)} />;
  } else {
    page = <NotFound copy={catalogCopy} title={route.kind === "product" ? catalogCopy.product.notFound : catalogCopy.group.notFound} />;
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className={`site-app${onHome ? "" : " site-app--subpage"}`} lang={language} dir={language === "ar" ? "rtl" : "ltr"}>
        <ContentProtection disabled={preview} />
        <a className="skip-link" href="#main">
          {copy.skip}
        </a>
        <Motion.div
          className="reading-progress"
          style={{ scaleX: scrollYProgress }}
          aria-hidden="true"
        />
        <Header
          language={language}
          onLanguage={setLanguage}
          theme={theme}
          onThemeChange={setTheme}
          copy={copy}
          catalogCopy={catalogCopy}
          groups={groups}
          onHome={onHome}
        />
        <main id="main" key={route.path}>
          {page}
        </main>
        <Footer
          groups={groups}
          onHome={onHome}
          onPolicy={() => setSelected({ type: "policy" })}
          language={language}
          onLanguage={setLanguage}
          copy={copy}
          socialLinks={socialLinks}
          socialQr={socialQr}
        />
        <BackToTop label={catalogCopy.backTop} path={route.path} />
        <DetailDialog
          selected={selected}
          onClose={() => setSelected(null)}
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
  const [cms, setCms] = useState(() => import.meta.env.DEV ? readPublishedCms() : null);
  useEffect(() => {
    const sync = () => {
      fetch("/api/content").then(r => r.json()).then(result => { if (result.ok) setCms(result.data); }).catch(() => {});
    };
    sync();
    window.addEventListener("focus", sync);
    window.addEventListener("storage", sync);
    const channel = "BroadcastChannel" in window ? new BroadcastChannel("rosic-cms") : null;
    if (channel) channel.onmessage = (event) => setCms(event.data || readPublishedCms());
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
      channel?.close();
    };
  }, []);
  return cms;
}

function DraftPreview() {
  const [draft, setDraft] = useState(null);
  useEffect(() => {
    const receive = (event) => {
      if (event.origin !== window.location.origin || event.source !== window.parent || event.data?.type !== "rosic-preview-data") return;
      setDraft(event.data.data);
    };
    window.addEventListener("message", receive);
    window.parent.postMessage({ type: "rosic-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);
  if (!draft) return <p>Đang tải bản xem trước…</p>;
  return draft.settings?.maintenanceMode ? <MaintenancePage /> : <SiteApp cms={draft} preview />;
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
  if (new URLSearchParams(window.location.search).get("preview") === "1" && window.parent !== window) return <DraftPreview />;
  if (demoView === "catalog") return <Suspense fallback={<div className="admin-loading">ROSIC…</div>}><CatalogDemo /></Suspense>;
  return MAINTENANCE_MODE || cms?.settings?.maintenanceMode ? <MaintenancePage /> : <SiteApp cms={cms} />;
}
