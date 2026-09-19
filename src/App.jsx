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
import { LanguagePicker } from "./components/LanguagePicker";
import { useSiteLanguage } from "./language";
import { PRODUCTS, CATEGORIES, ARTICLES, JOURNEY } from "./data";

const NAV = [
  { label: "Trang chủ", href: "#home" },
  { label: "Về chúng tôi", href: "#about" },
  { label: "Hành trình", href: "#journey" },
  { label: "Sản phẩm", href: "#products" },
  { label: "Đối tác", href: "#testimonials" },
  { label: "Tin tức", href: "#blog" },
  { label: "Liên hệ", href: "#contact" },
];

// Keep the public site in a calm, branded holding state while the new release is reviewed.
const MAINTENANCE_MODE = true;

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
function Header({ onFilter }) {
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
          <nav className="nav-left" aria-label="Điều hướng chính">
            {NAV.slice(0, 3).map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={
                  active === item.href.slice(1) ? "location" : undefined
                }
              >
                {item.label}
              </a>
            ))}
          </nav>
          <Brand />
          <nav className="nav-right" aria-label="Sản phẩm và kết nối">
            <div className="nav-dropdown">
              <a
                href="#products"
                aria-current={active === "products" ? "location" : undefined}
              >
                Sản phẩm <ChevronDown size={12} />
              </a>
              <div className="dropdown-panel">
                {CATEGORIES.slice(1).map((category) => (
                  <a
                    key={category.id}
                    href="#products"
                    onClick={() => onFilter(category.id)}
                  >
                    {category.label}
                    <ArrowUpRight size={14} />
                  </a>
                ))}
              </div>
            </div>
            <a href="#testimonials">Đối tác</a>
            <a
              href="#blog"
              aria-current={active === "blog" ? "location" : undefined}
            >
              Tin tức
            </a>
            <a href="#contact" className="nav-contact">
              Liên hệ <ArrowUpRight size={15} />
            </a>
          </nav>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button className="menu-toggle icon-button" aria-label="Mở menu">
                <Menu size={24} />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="dialog-overlay" />
              <Dialog.Content className="mobile-menu">
                <Dialog.Title className="sr-only">Điều hướng</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Khám phá Hồng Tâm Rosic Global
                </Dialog.Description>
                <div className="mobile-menu-top">
                  <Brand />
                  <Dialog.Close asChild>
                    <button className="icon-button" aria-label="Đóng menu">
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
                      {item.label}
                      <ArrowUpRight />
                    </a>
                  ))}
                </nav>
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
function Hero() {
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
          TỪ TÂM VIỆT, VƯƠN TẦM THẾ GIỚI
        </Motion.p>
        <h1>
          <span className="title-line">
            <Motion.span
              initial={reduce ? false : { y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            >
              Tinh hoa từ đất.
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
              Trao gửi bằng tâm.
            </Motion.span>
          </span>
        </h1>
        <Motion.div
          initial={reduce ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          <p className="hero-description">
            Kết nối nông sản Việt với thế giới.
            <br />
            Chăm chút từng mùa vụ, vun đắp những mối quan hệ bền lâu.
          </p>
          <a className="button button-primary" href="#products">
            Khám phá sản phẩm <ArrowUpRight size={18} />
          </a>
        </Motion.div>
      </div>
      <div className="hero-landscape">
        <Motion.img
          src="/images/hero.webp"
          alt="Những đồi chè xanh nối tiếp nhau dưới ánh nắng ban mai"
          fetchPriority="high"
          width="1672"
          height="941"
          style={reduce ? undefined : { y }}
        />
        <div className="landscape-caption">
          <span>Nông sản Việt Nam</span>
          <span>Gieo giá trị. Gặt niềm tin.</span>
          <Leaf size={22} strokeWidth={1.3} />
        </div>
      </div>
    </section>
  );
}
function Marquee() {
  const [paused, setPaused] = useState(false);
  const words = [
    "Trái cây tươi",
    "Rau củ theo mùa",
    "Hạt & ngũ cốc",
    "Nông sản chế biến",
  ];
  return (
    <section
      className={`marquee-section ${paused ? "is-paused" : ""}`}
      aria-label="Các nhóm nông sản"
      aria-description="Chạm hoặc nhấn Enter để dừng hay tiếp tục chuyển động."
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
function Catalog({ category, setCategory, onProduct }) {
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
          <p className="eyebrow">TỪ THIÊN NHIÊN VIỆT NAM</p>
          <h2 className="section-heading">Mỗi mùa, một thức quà.</h2>
          <p>
            Khám phá danh mục nông sản và cùng chúng tôi lựa chọn sản phẩm phù
            hợp với nhu cầu của bạn.
          </p>
        </Reveal>
        <div className="catalog-tools">
          <div className="category-tabs" aria-label="Lọc nhóm sản phẩm">
            {CATEGORIES.map((item) => (
              <button
                key={item.id}
                className={category === item.id ? "active" : ""}
                aria-pressed={category === item.id}
                onClick={() => setCategory(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="product-search">
            <Search size={18} />
            <input
              aria-label="Tìm sản phẩm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm sản phẩm"
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
                      Xem chi tiết <ArrowUpRight size={17} />
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
            <h3>Chưa tìm thấy sản phẩm phù hợp</h3>
            <p>Thử tên ngắn hơn hoặc xem lại toàn bộ danh mục.</p>
            <button
              className="button button-outline"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
            >
              Xem tất cả sản phẩm <ArrowRight size={18} />
            </button>
          </div>
        )}
        <p className="catalog-note">
          Danh mục giới thiệu. Mùa vụ, quy cách và khả năng cung ứng được xác
          nhận khi trao đổi đơn hàng.
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
function Footer({ onPolicy, onFilter }) {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <Brand footer />
          <p className="footer-tagline">
            Gieo giá trị từ tâm.
            <br />
            Kết nối những mùa xanh.
          </p>
        </div>
        <div className="footer-column">
          <h3>Khám phá</h3>
          {NAV.filter((item) => item.href !== "#home").map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
        <div className="footer-column">
          <h3>Sản phẩm</h3>
          {CATEGORIES.slice(1).map((category) => (
            <a
              key={category.id}
              href="#products"
              onClick={() => onFilter(category.id)}
            >
              {category.label}
            </a>
          ))}
        </div>
        <div className="footer-invitation">
          <span>Bắt đầu một kết nối tốt đẹp.</span>
          <a href="#contact">
            Chào Hồng Tâm <ArrowUpRight />
          </a>
          <p>
            Manufacturing with Heart,
            <br />
            Trading with Vision.
          </p>
          <div className="footer-socials" aria-label="Kết nối nhanh">
            <a href="https://wa.me/84962284872" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={16} /></a>
            <a href="https://vn.linkedin.com/company/hong-tam-rosic-global-manufacturing-trading-joint-stock-company" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Network size={16} /></a>
            <a href="mailto:info@rosicglobal.com" aria-label="Email"><Mail size={16} /></a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span className="footer-copyright">Copyright © HONG TAM ROSIC GLOBAL JSC. All rights reserved.</span>
        <div className="footer-bottom-actions">
          <button onClick={onPolicy}>Thông tin & quyền riêng tư</button>
          <a href="#home">
            Về đầu trang <ArrowUp size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
function DetailDialog({ selected, onClose, onQuote }) {
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
            aria-label="Đóng chi tiết"
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
                    <span>Nhóm sản phẩm</span>
                    <strong>{selected.data.group}</strong>
                  </div>
                  <div>
                    <span>Quy cách</span>
                    <strong>Trao đổi theo nhu cầu</strong>
                  </div>
                </div>
                <p className="form-note">
                  Hình ảnh minh họa sản phẩm. Xuất xứ, mùa vụ và thông số được
                  xác nhận theo lô hàng.
                </p>
                <button
                  className="button button-primary"
                  onClick={() => onQuote(selected.data.title)}
                >
                  Yêu cầu sản phẩm này <ArrowUpRight size={18} />
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
              <Dialog.Title>Thông tin & quyền riêng tư</Dialog.Title>
              <Dialog.Description>
                Cách sử dụng nội dung và biểu mẫu trên website.
              </Dialog.Description>
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
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null);
  const [prefilledProduct, setPrefilledProduct] = useState({
    title: "",
    id: 0,
  });
  const reduced = useReducedMotion();
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
      <a className="skip-link" href="#main">
        Đến nội dung chính
      </a>
      <Motion.div
        className="reading-progress"
        style={{ scaleX }}
        aria-hidden="true"
      />
      <Header onFilter={setCategory} />
      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <Catalog
          category={category}
          setCategory={setCategory}
          onProduct={(data) => setSelected({ type: "product", data })}
        />
        <Journey />
        <Partners />
        <Journal onArticle={(data) => setSelected({ type: "article", data })} />
        <Contact
          prefilledProduct={prefilledProduct.title}
          prefillKey={prefilledProduct.id}
          products={PRODUCTS}
        />
      </main>
      <Footer
        onPolicy={() => setSelected({ type: "policy" })}
        onFilter={setCategory}
      />
      <DetailDialog
        selected={selected}
        onClose={() => setSelected(null)}
        onQuote={quote}
      />
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
