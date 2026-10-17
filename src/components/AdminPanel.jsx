import { SOCIAL_DEFAULTS, SOCIAL_CONFIG_VERSION, configuredSocial, configuredSocialQr } from "../social-config";
import { vr5ProductImage } from "../product-images";
import { localizeProducts } from "../product-l10n";
import { createElement, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Image as ImageIcon,
  Images,
  LayoutDashboard,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Monitor,
  Package,
  Power,
  Plus,
  Save,
  Search,
  Settings,
  Smartphone,
  Shapes,
  Trash2,
  Upload,
  UploadCloud,
} from "lucide-react";
import { validateCatalog } from "../../lib/catalog-validation";
import { ARTICLES, JOURNEY } from "../data";
import { EXPORT_CATEGORIES } from "../export-catalog";
import { CATALOG_VERSION, DEFAULT_PRODUCTS, GROUP_INTRO, GROUP_NAMES, GROUPS, SPEC_KEYS, SPEC_LABELS } from "../catalog-v6";
import { IMAGE_PRESETS, processCmsImage } from "../cms/image-processing";
import "./AdminPanel.css";
import { brandStoryFor } from "../brand-story";
import { siteCopyFor } from "../site-copy";
import AdminProductTranslation from "./AdminProductTranslation";
import AdminTextEditor from "./AdminTextEditor";
import AdminLivePreview from "./AdminLivePreview";
import { CATEGORY_ICONS, CATEGORY_ICON_LABELS, categoryIconKey } from "../category-icons";

const DRAFT_KEY = "rosic-cms-draft-v1";
const PUBLISHED_KEY = "rosic-cms-published-v1";

const defaultStory = brandStoryFor("vi", siteCopyFor("vi"));
const DEFAULT_CONTENT = {
  brandStoryVersion: 4,
  aboutVision: defaultStory.blocks[1],
  topbar: "Manufacturing with Heart, Trading with Vision",
  heroEyebrow: "HỒNG TÂM ROSIC GLOBAL · VIỆT NAM",
  heroStart: "Khởi từ Tâm",
  heroAccent: "Vươn bằng Tầm",
  heroBody: "Kết nối nguồn nông sản Việt Nam với các đối tác quốc tế bằng chất lượng, sự rõ ràng và trách nhiệm.",
  heroCta: "Về chúng tôi",
  heroImage: "/images/rosic-terraces.webp",
  aboutTitle: "Chăm chút từ nguồn trồng. Vững vàng trên hành trình toàn cầu.",
  aboutBody: defaultStory.blocks[0],
  aboutImage: "/images/vietnam-produce-w960-hong-tam-rosic.webp",
  catalogTitle: "Mỗi mùa, một thức quà.",
  catalogBody: "Khám phá danh mục nông sản và cùng chúng tôi lựa chọn sản phẩm phù hợp với nhu cầu của bạn.",
  journeyTitleStart: "Một hành trình.",
  journeyTitleAccent: "Vẹn nguyên sự tận tâm.",
  journeyLead: "Từ lựa chọn nguồn hàng đến trao gửi sản phẩm, mỗi bước đều cần sự thấu hiểu và phối hợp.",
  journeyImages: JOURNEY.map((item) => item.image),
  partnersTitleStart: "Đi xa hơn,",
  partnersTitleAccent: "khi đi cùng nhau.",
  partnersLead: "Từ nhà phân phối, đơn vị bán lẻ đến đối tác nhập khẩu, chúng tôi luôn trân trọng những kết nối cùng chung giá trị.",
  journalTitle: "Chuyện từ những mùa xanh.",
  journalLead: "Những góc nhìn về sản phẩm, nguồn trồng và cách bắt đầu một cuộc hợp tác.",
  articleImages: ARTICLES.map((item) => item.image),
  footerTitle: "Cùng bắt đầu một cơ hội hợp tác mới.",
};

const DEFAULT_SETTINGS = {
  maintenanceMode: false,
  siteName: "HỒNG TÂM ROSIC",
};

const DEFAULT_SOCIAL = SOCIAL_DEFAULTS;

const SOCIAL_FIELDS = [
  { key: "facebook", label: "Facebook", placeholder: "https://www.facebook.com/..." },
  { key: "wechat", label: "WeChat", placeholder: "https://... (trang hoặc mã QR WeChat)" },
  { key: "tiktok", label: "TikTok", placeholder: "https://www.tiktok.com/@..." },
  { key: "whatsapp", label: "WhatsApp · Kênh chính", placeholder: "https://wa.me/message/... hoặc https://wa.me/84..." },
  { key: "email", label: "Email doanh nghiệp", placeholder: "mailto:info@rosicglobal.com" },
  { key: "linkedin", label: "LinkedIn · Founder & CEO", placeholder: "https://www.linkedin.com/in/..." },
  { key: "zalo", label: "Zalo · Hotline", placeholder: "https://zalo.me/84962284872" },
];

// Catalogue v6: nine groups (menu = page = filter chips) and their sub-products.
const seedProducts = DEFAULT_PRODUCTS.map((product) => ({ ...product }));

const seedCategories = GROUPS.map((group, index) => {
  const base = EXPORT_CATEGORIES.find((category) => category.id === group.id) ?? {};
  return {
    ...base,
    id: group.id,
    number: String(index + 1).padStart(2, "0"),
    title: base.title && base.title !== "Other" ? base.title : GROUP_NAMES.vi[group.id],
    shortTitle: GROUP_NAMES.vi[group.id],
    description: GROUP_INTRO[group.id]?.vi ?? base.description,
    image: group.image,
    code: `CAT-${String(index + 1).padStart(2, "0")}`,
    status: "published",
  };
});

const SPEC_FIELDS = SPEC_KEYS.filter((key) => key !== "code");

/** Pre-v6 products used the retired fruit/vegetable taxonomy; replace them
 *  with the v6 list but keep any photo the team uploaded for the same id. */
function migrateProducts(saved) {
  if (saved?.catalogVersion >= CATALOG_VERSION && Array.isArray(saved.products)) return saved.products;
  const uploaded = Object.fromEntries((saved?.products || []).filter((item) => item.image?.startsWith("/media/")).map((item) => [item.id, item]));
  return seedProducts.map((product) => (uploaded[product.id] ? { ...product, image: uploaded[product.id].image, imageAsset: uploaded[product.id].imageAsset } : product));
}

/** Keep edited categories and custom ones, add any missing v6 group, retire
 *  the "Other" label and (once, from older data) refresh built-in group intros
 *  so they describe the new sub-product lists. */
function migrateCategories(saved) {
  const list = Array.isArray(saved?.categories) ? saved.categories : seedCategories;
  const upgrading = !(saved?.catalogVersion >= CATALOG_VERSION);
  const merged = [...list, ...seedCategories.filter((seed) => !list.some((item) => item.id === seed.id))];
  return merged.map((item) => {
    let next = item;
    if (item.id === "other" && (!item.shortTitle || item.shortTitle === "Other")) next = { ...next, title: GROUP_NAMES.vi.other, shortTitle: GROUP_NAMES.vi.other };
    if (upgrading && GROUP_INTRO[item.id]) next = { ...next, description: GROUP_INTRO[item.id].vi };
    return next;
  });
}

const emptyProduct = (index) => ({
  id: `product-${Date.now()}`,
  code: `ROS-${String(index + 1).padStart(3, "0")}`,
  title: "Sản phẩm mới",
  category: "other",
  group: "Other",
  image: "/images/produce.webp",
  alt: "Hình ảnh sản phẩm",
  short: "Mô tả ngắn của sản phẩm.",
  description: "Thông tin chi tiết sản phẩm.",
  specs: {},
  translations: {},
  status: "draft",
});

function readState() {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY));
    if (saved?.products && saved?.content) {
      return {
        ...saved,
        products: migrateProducts(saved).map(item => ({ ...item, image: vr5ProductImage(item.image) })),
        catalogVersion: CATALOG_VERSION,
        categories: migrateCategories(saved).map(item => ({ ...item, image: vr5ProductImage(item.image) })),
        content: { ...DEFAULT_CONTENT, ...saved.content, ...(saved.content.brandStoryVersion === 4 ? {} : { brandStoryVersion: 4, heroStart: DEFAULT_CONTENT.heroStart, heroAccent: DEFAULT_CONTENT.heroAccent, heroCta: DEFAULT_CONTENT.heroCta, aboutBody: DEFAULT_CONTENT.aboutBody }) },
        social: configuredSocial(saved.social, saved.socialConfigVersion),
        socialQr: configuredSocialQr(saved.socialQr, configuredSocial(saved.social, saved.socialConfigVersion)),
        socialConfigVersion: SOCIAL_CONFIG_VERSION,
        settings: { ...DEFAULT_SETTINGS, ...saved.settings },
        media: Array.isArray(saved.media) ? saved.media : [],
      };
    }
  } catch {
    // Corrupt browser data falls back to a safe seed.
  }
  return { catalogVersion: CATALOG_VERSION, products: seedProducts, categories: seedCategories, content: DEFAULT_CONTENT, social: DEFAULT_SOCIAL, socialQr: configuredSocialQr(null, DEFAULT_SOCIAL), socialConfigVersion: SOCIAL_CONFIG_VERSION, settings: DEFAULT_SETTINGS, media: [], updatedAt: null };
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { id: "products", label: "Sản phẩm", icon: Package },
  { id: "categories", label: "Danh mục", icon: Shapes },
  { id: "content", label: "Nội dung trang", icon: FileText },
  { id: "media", label: "Thư viện media", icon: Images },
  { id: "settings", label: "Cài đặt", icon: Settings },
];

export default function AdminPanel() {
  const [authState, setAuthState] = useState("checking");

  useEffect(() => {
    let active = true;
    fetch("/api/admin-auth", { credentials: "same-origin" })
      .then((response) => response.json())
      .then((result) => active && setAuthState(result.authenticated ? "authenticated" : "guest"))
      .catch(() => active && setAuthState("guest"));
    return () => { active = false; };
  }, []);

  if (authState === "checking") return <AdminAuthLoading />;
  if (authState !== "authenticated") return <AdminLogin onSuccess={() => setAuthState("authenticated")} />;

  return <AdminWorkspace onLogout={() => setAuthState("guest")} />;
}

function AdminAuthLoading() {
  return <div className="admin-auth-screen"><div className="admin-auth-loading"><LoaderCircle size={28} /><span>Đang kiểm tra phiên đăng nhập...</span></div></div>;
}

function AdminLogin({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin-auth", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();
      if (!response.ok || !result.authenticated) throw new Error(result.message || "Không thể đăng nhập.");
      onSuccess();
    } catch (requestError) {
      setError(requestError.message || "Không thể đăng nhập. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-auth-screen">
      <section className="admin-login-card">
        <div className="admin-login-brand"><img src="/brand-mark.svg" alt="" /><span>HỒNG TÂM <strong>ROSIC</strong><small>Content Studio</small></span></div>
        <div className="admin-login-intro"><span>KHU VỰC QUẢN TRỊ</span><h1>Chào mừng trở lại.</h1><p>Đăng nhập để quản lý sản phẩm, hình ảnh và toàn bộ nội dung website.</p></div>
        <form onSubmit={submit}>
          <Field label="Tên đăng nhập"><input autoFocus autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required /></Field>
          <Field label="Mật khẩu"><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></Field>
          {error && <p className="admin-login-error" role="alert">{error}</p>}
          <button className="admin-login-submit" disabled={loading} type="submit">{loading ? <LoaderCircle size={18} /> : <LockKeyhole size={18} />}{loading ? "Đang đăng nhập..." : "Đăng nhập Admin"}</button>
        </form>
        <p className="admin-login-help">Phiên đăng nhập được bảo vệ bằng cookie HttpOnly và tự hết hạn sau 8 giờ.</p>
      </section>
    </main>
  );
}

function AdminWorkspace({ onLogout }) {
  const [data, setData] = useState(readState);
  const [section, setSection] = useState("dashboard");
  const [selectedId, setSelectedId] = useState(data.products[0]?.id ?? null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(data.categories[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const [device, setDevice] = useState("desktop");
  const [mediaPreset, setMediaPreset] = useState("product");
  const [processingImage, setProcessingImage] = useState(false);
  const [notice, setNotice] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [publishedAt, setPublishedAt] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PUBLISHED_KEY))?.publishedAt ?? null; } catch { return null; }
  });
  useEffect(() => {
    let active = true;
    fetch("/api/content").then(r => { if (!r.ok) throw new Error("content_load_failed"); return r.json(); }).then(result => {
      if (!result.ok) throw new Error("content_load_failed");
      if (!active || !result.data) return;
      const saved = readState();
      if (!saved.updatedAt || saved.updatedAt <= result.data.publishedAt) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(result.data));
        setData(readState());
      }
      setPublishedAt(result.data.publishedAt);
    }).catch(() => { if (active) setLoadError(true); }).finally(() => { if (active) setInitializing(false); });
    return () => { active = false; };
  }, []);
  const importRef = useRef(null);
  const mediaRef = useRef(null);
  const previewRef = useRef(null);
  const showPreview = () => previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const selected = data.products.find((product) => product.id === selectedId) ?? null;
  const selectedCategory = data.categories.find((category) => category.id === selectedCategoryId) ?? null;
  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    return data.products.filter((product) => !value || `${product.title} ${product.code} ${product.group}`.toLowerCase().includes(value));
  }, [data.products, query]);

  const updateData = (recipe) => setData((current) => ({ ...recipe(current), updatedAt: new Date().toISOString() }));
  const flash = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };
  const saveDraft = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    flash("Đã lưu bản nháp trên trình duyệt");
  };
  const publish = async (nextData = data) => {
    if (publishing) return;
    const catalogError = validateCatalog(nextData.products);
    if (catalogError) { flash(catalogError); return; }
    setPublishing(true);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(nextData));
    try {
      const response = await fetch("/api/content", { method: "PUT", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(nextData) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.message || "Không thể xuất bản. Vui lòng thử lại.");
      const payload = { ...nextData, publishedAt: result.publishedAt };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
      localStorage.setItem(PUBLISHED_KEY, JSON.stringify(payload));
      setData(payload);
      setPublishedAt(payload.publishedAt);
      if ("BroadcastChannel" in window) {
        const channel = new BroadcastChannel("rosic-cms");
        channel.postMessage(payload);
        channel.close();
      }
      flash("Đã xuất bản lên website cho mọi khách truy cập");
    } catch (error) {
      flash(error.message || "Chưa thể kết nối máy chủ. Bản nháp đã được giữ.");
    } finally { setPublishing(false); }
  };
  const updateProduct = (field, value) => updateData((current) => ({
    ...current,
    products: current.products.map((product) => product.id === selectedId ? { ...product, [field]: value } : product),
  }));
  const updateCategory = (field, value) => updateData((current) => ({
    ...current,
    categories: current.categories.map((category) => category.id === selectedCategoryId ? { ...category, [field]: value } : category),
  }));
  const addProduct = () => {
    const product = { ...emptyProduct(Math.max(0, ...data.products.map(item => Number(item.code?.slice(4)) || 0))), category: data.categories[0]?.id || "other" };
    updateData((current) => ({ ...current, products: [product, ...current.products] }));
    setSelectedId(product.id);
    setSection("products");
  };
  const addCategory = () => {
    const category = { id: `category-${crypto.randomUUID()}`, number: String(data.categories.length + 1).padStart(2, "0"), code: `CAT-${Date.now().toString().slice(-6)}`, title: "Danh mục mới", shortTitle: "Danh mục mới", image: "/images/produce.webp", alt: "Danh mục mới", description: "", overview: "", forms: "", checks: [], specGroups: [], status: "published" };
    updateData(current => ({ ...current, categories: [...current.categories, category] }));
    setSelectedCategoryId(category.id);
  };
  const removeCategory = () => {
    if (!selectedCategory) return;
    if (data.products.some(product => product.category === selectedCategory.id)) { flash("Hãy chuyển sản phẩm sang danh mục khác trước khi xóa danh mục này."); return; }
    if (!window.confirm(`Xóa danh mục “${selectedCategory.shortTitle}”?`)) return;
    const categories = data.categories.filter(item => item.id !== selectedCategory.id);
    updateData(current => ({ ...current, categories }));
    setSelectedCategoryId(categories[0]?.id || null);
  };
  const moveCategory = direction => {
    const categories = [...data.categories];
    const index = categories.findIndex(item => item.id === selectedCategoryId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= categories.length) return;
    [categories[index], categories[target]] = [categories[target], categories[index]];
    updateData(current => ({ ...current, categories }));
  };
  const removeProduct = () => {
    if (!selected || !window.confirm(`Xóa sản phẩm “${selected.title}”?`)) return;
    const next = data.products.filter((product) => product.id !== selected.id);
    updateData((current) => ({ ...current, products: next }));
    setSelectedId(next[0]?.id ?? null);
  };
  const processImage = async (file, preset, onReady, name = file?.name?.replace(/\.[^.]+$/, "")) => {
    if (!file) return;
    setProcessingImage(true);
    try {
      const prepared = await processCmsImage(file, preset);
      const response = await fetch("/api/media", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ src: prepared.src, preset, name }) });
      const asset = await response.json();
      if (!response.ok) throw new Error(asset.message || "Không thể lưu ảnh lên máy chủ");
      const mediaAsset = { id: crypto.randomUUID(), name: file.name, ...asset };
      updateData((current) => ({ ...current, media: [mediaAsset, ...current.media] }));
      onReady?.(asset.src, asset);
      flash(`Đã lưu ${asset.name} · ${asset.width} × ${asset.height}px${asset.watermarked ? " · có watermark" : ""}`);
    } catch (error) {
      flash(error.message === "image_too_large" ? "Ảnh gốc cần nhỏ hơn 12 MB" : error.message === "image_compression_limit" ? "Ảnh quá nhiều chi tiết để nén dưới 150KB. Vui lòng chọn ảnh khác." : error.message || "Không thể xử lý file ảnh này");
    } finally {
      setProcessingImage(false);
    }
  };
  const uploadProductImage = (file) => {
    const targetId = selectedId;
    const name = selected?.imageEnglishName?.trim() || selected?.translations?.en?.title?.trim() || (selected ? localizeProducts([selected], "en")[0].title : "product");
    return processImage(file, "product", (src, asset) => updateData(current => ({ ...current, products: current.products.map(product => product.id === targetId ? { ...product, image: src, imageAsset: asset, alt: product.alt || product.title } : product) })), name);
  };
  const uploadCategoryImage = (file) => {
    const targetId = selectedCategoryId;
    return processImage(file, "category", src => updateData(current => ({ ...current, categories: current.categories.map(item => item.id === targetId ? { ...item, image: src } : item) })), selectedCategory?.shortTitle);
  };
  const uploadContentImage = (file, preset, field) => processImage(file, preset, (src) => updateData((current) => ({ ...current, content: { ...current.content, [field]: src } })));
  const uploadCollectionImage = (file, field, index) => processImage(file, "content", (src) => updateData((current) => {
    const images = [...(current.content[field] || [])];
    images[index] = src;
    return { ...current, content: { ...current.content, [field]: images } };
  }));
  const uploadMedia = (file) => processImage(file, mediaPreset);
  const toggleMaintenance = () => {
    publish({ ...data, settings: { ...data.settings, maintenanceMode: !data.settings.maintenanceMode }, updatedAt: new Date().toISOString() });
  };
  const logout = async () => {
    try { await fetch("/api/admin-auth", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) }); } catch { /* Session still closes in the UI. */ }
    onLogout();
  };
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rosic-cms-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const importJson = async (file) => {
    try {
      const payload = JSON.parse(await file.text());
      if (!Array.isArray(payload.products) || !Array.isArray(payload.categories) || !payload.content || !payload.settings || !Array.isArray(payload.media)) throw new Error("invalid");
      setData({
        ...payload,
        social: configuredSocial(payload.social, payload.socialConfigVersion),
        socialQr: configuredSocialQr(payload.socialQr, configuredSocial(payload.social, payload.socialConfigVersion)),
        socialConfigVersion: SOCIAL_CONFIG_VERSION,
      });
      setSelectedId(payload.products[0]?.id ?? null);
      localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
      flash("Đã nhập dữ liệu CMS");
    } catch {
      flash("File JSON không đúng cấu trúc CMS");
    }
  };

  if (initializing) return <AdminAuthLoading />;
  if (loadError) return <div className="admin-auth-screen"><div className="admin-auth-loading" role="alert"><p>Chưa tải được nội dung đã xuất bản. Bản nháp vẫn được giữ. Hãy tải lại để tránh ghi đè dữ liệu trên máy chủ.</p><button className="admin-button" onClick={() => window.location.reload()}>Tải lại nội dung</button></div></div>;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/" aria-label="Mở website">
          <img src="/brand-mark.svg" alt="" />
          <span>HỒNG TÂM <strong>ROSIC</strong><small>Content Studio</small></span>
        </a>
        <nav aria-label="Điều hướng quản trị">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button key={id} className={section === id ? "active" : ""} onClick={() => setSection(id)}>
              {createElement(Icon, { size: 18 })}{label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-note">
          <span>TRẠNG THÁI WEBSITE</span>
          <strong>{data.settings.maintenanceMode ? "Đang Coming Soon" : "Đang hoạt động"}</strong>
          <p>Xuất bản để cập nhật website cho mọi khách truy cập. Bản nháp lưu riêng trên trình duyệt.</p>
          <a href="/admin-guide.html" target="_blank" rel="noreferrer">Hướng dẫn CMS &amp; hình ảnh ↗</a>
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <span className="admin-breadcrumb">ROSIC CMS / {NAV_ITEMS.find((item) => item.id === section)?.label}</span>
            <strong>{data.updatedAt ? "Có thay đổi trong bản nháp" : "Dữ liệu gốc của website"}</strong>
          </div>
          <div className="admin-top-actions">
            <button className={`admin-button maintenance ${data.settings.maintenanceMode ? "is-on" : ""}`} onClick={toggleMaintenance} aria-pressed={data.settings.maintenanceMode}><Power size={16} />{data.settings.maintenanceMode ? "Tắt Coming Soon" : "Bật Coming Soon"}</button>
            <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} />Mở website</a>
            <button className="admin-button secondary" onClick={saveDraft}><Save size={16} />Lưu nháp</button>
            <button className="admin-button secondary" onClick={showPreview}><Eye size={16} />Xem trước Desktop/Mobile</button>
            <button className="admin-button primary" disabled={publishing || processingImage} onClick={() => publish()}><CheckCircle2 size={16} />Xuất bản</button>
            <button className="admin-logout" onClick={logout} title="Đăng xuất" aria-label="Đăng xuất"><LogOut size={17} /></button>
          </div>
        </header>

        {notice && <div className="admin-toast" role="status">{notice}</div>}

        <main className="admin-main">
          <section className="admin-editor">
            {section === "dashboard" && (
              <Dashboard data={data} publishedAt={publishedAt} setSection={setSection} addProduct={addProduct} />
            )}
            {section === "products" && (
              <div className="admin-section">
                <div className="admin-section-header">
                  <div><span>Sản phẩm</span><h1>Quản lý danh mục</h1></div>
                  <button className="admin-button primary" onClick={addProduct}><Plus size={17} />Thêm sản phẩm</button>
                </div>
                <div className="admin-product-workbench">
                  <div className="admin-product-list">
                    <label className="admin-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên hoặc mã sản phẩm" /></label>
                    <div>
                      {filtered.map((product) => (
                        <button key={product.id} className={product.id === selectedId ? "active" : ""} onClick={() => setSelectedId(product.id)}>
                          <img src={product.image} alt="" />
                          <span><strong>{product.title}</strong><small>{product.code} · {product.status === "published" ? "Đã xuất bản" : "Bản nháp"}</small></span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {selected ? (
                    <div className="admin-form product-editor-form">
                      <div className="admin-form-title"><div><span>Chi tiết sản phẩm</span><h2>{selected.title}</h2></div><button className="danger-icon" onClick={removeProduct} title="Xóa sản phẩm"><Trash2 size={18} /></button></div>
                      <ImageGuide preset="product" />
                      <div className="admin-upload-preview admin-upload-preview--square">
                        <img src={selected.image} alt={selected.alt} />
                        <label><UploadCloud size={18} />{processingImage ? "Đang xử lý" : "Đổi ảnh"}<input type="file" accept="image/*" disabled={processingImage} onChange={(event) => uploadProductImage(event.target.files?.[0])} /></label>
                      </div>
                      <Field label="Tên sản phẩm"><input value={selected.title} onChange={(e) => updateProduct("title", e.target.value)} /></Field>
                      <div className="admin-form-grid">
                        <Field label="Mã sản phẩm"><input value={selected.code} onChange={(e) => updateProduct("code", e.target.value)} /></Field>
                        <Field label="Trạng thái"><select value={selected.status} onChange={(e) => updateProduct("status", e.target.value)}><option value="published">Đã xuất bản</option><option value="draft">Bản nháp</option></select></Field>
                      </div>
                      <div className="admin-form-grid">
                        <Field label="Tên tiếng Anh dùng cho ảnh"><input value={selected.imageEnglishName || ""} placeholder="Ví dụ: cashew nuts w320" onChange={(e) => updateProduct("imageEnglishName", e.target.value)} /></Field><p className="admin-field-hint">Nhập tên trước khi tải ảnh. Tên file tự thêm -hong-tam-rosic.webp; ảnh sản phẩm được đóng logo chìm. Nếu để trống, dùng tên sản phẩm đã bỏ dấu.</p><Field label="Nhóm sản phẩm"><select value={selected.category} onChange={(e) => { updateProduct("category", e.target.value); updateProduct("group", data.categories.find(item => item.id === e.target.value)?.shortTitle || e.target.value); }}>{!data.categories.some(item => item.id === selected.category) && <option value={selected.category}>{selected.group || selected.category}</option>}{data.categories.map((item) => <option key={item.id} value={item.id}>{item.shortTitle}</option>)}</select></Field>
                        <Field label="Nhãn nhóm"><input value={selected.group} onChange={(e) => updateProduct("group", e.target.value)} /></Field>
                      </div>
                      <Field label="Mô tả ngắn"><textarea rows="3" value={selected.short} onChange={(e) => updateProduct("short", e.target.value)} /></Field>
                      <Field label="Thông tin chi tiết"><textarea rows="6" value={selected.description} onChange={(e) => updateProduct("description", e.target.value)} /></Field>
                      <fieldset className="admin-spec-fields">
                        <legend>Thông số kỹ thuật (hiển thị trên trang chi tiết)</legend>
                        <p className="admin-field-hint">Mã sản phẩm lấy từ ô “Mã sản phẩm”. Để trống mục nào thì trang chi tiết hiện “Không áp dụng”.</p>
                        {SPEC_FIELDS.map((key) => (
                          <Field key={key} label={SPEC_LABELS.vi[key]}><input value={selected.specs?.[key] || ""} onChange={(e) => updateProduct("specs", { ...selected.specs, [key]: e.target.value })} /></Field>
                        ))}
                      </fieldset>
                      <AdminProductTranslation product={selected} onChange={updateProduct} specKeys={SPEC_FIELDS} specLabels={SPEC_LABELS.vi} />
                      <Field label="Mô tả ảnh (SEO/Accessibility)"><input value={selected.alt} onChange={(e) => updateProduct("alt", e.target.value)} /></Field>
                    </div>
                  ) : <Empty icon={Package} title="Chưa có sản phẩm" body="Thêm sản phẩm đầu tiên để bắt đầu." />}
                </div>
              </div>
            )}
            {section === "categories" && (
              <div className="admin-section">
                <div className="admin-section-header"><div><span>Danh mục</span><h1>{data.categories.length} danh mục sản phẩm</h1><p>Thêm, chỉnh sửa và sắp xếp danh mục. Xuất bản để cập nhật website.</p></div><button className="admin-button primary" onClick={addCategory}><Plus size={16} />Thêm danh mục</button></div>
                <div className="admin-product-workbench">
                  <div className="admin-product-list admin-category-list"><div>{data.categories.map((category) => <button key={category.id} className={category.id === selectedCategoryId ? "active" : ""} onClick={() => setSelectedCategoryId(category.id)}><img src={category.image} alt="" /><span><strong>{category.shortTitle}</strong><small>{category.code}</small></span></button>)}</div></div>
                  {selectedCategory ? <div className="admin-form category-editor-form">
                    <div className="admin-form-title"><div><span>Chi tiết danh mục</span><h2>{selectedCategory.shortTitle}</h2></div><button className="danger-icon" onClick={removeCategory} title="Xóa danh mục"><Trash2 size={18} /></button></div><div className="admin-form-grid"><button className="admin-button" onClick={() => moveCategory(-1)}>Đưa lên trước</button><button className="admin-button" onClick={() => moveCategory(1)}>Đưa xuống sau</button></div>
                    <ImageGuide preset="category" />
                    <div className="admin-upload-preview admin-upload-preview--category"><img src={selectedCategory.image} alt={selectedCategory.alt || selectedCategory.shortTitle} /><label><UploadCloud size={18} />{processingImage ? "Đang xử lý" : "Đổi ảnh"}<input type="file" accept="image/*" disabled={processingImage} onChange={(event) => uploadCategoryImage(event.target.files?.[0])} /></label></div>
                    <div className="admin-form-grid"><Field label="Tên danh mục"><input value={selectedCategory.shortTitle} onChange={(e) => updateCategory("shortTitle", e.target.value)} /></Field><Field label="Mã danh mục"><input value={selectedCategory.code} onChange={(e) => updateCategory("code", e.target.value)} /></Field></div>
                    <AdminProductTranslation product={selectedCategory} onChange={updateCategory} category />
                    <Field label="Tiêu đề đầy đủ"><input value={selectedCategory.title} onChange={(e) => updateCategory("title", e.target.value)} /></Field>
                    <Field label="Icon danh mục"><select value={selectedCategory.icon || "auto"} onChange={e => updateCategory("icon", e.target.value)}><option value="auto">Tự động theo nội dung</option>{Object.entries(CATEGORY_ICON_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></Field>
                    <p className="admin-field-hint">{createElement(CATEGORY_ICONS[categoryIconKey(selectedCategory)], { size: 22, "aria-hidden": true })} Icon áp dụng cho menu và dải danh mục. Bố cục tự co giãn khi thêm hoặc sắp xếp nhóm.</p>
                    <Field label="Mô tả ngắn"><textarea rows="4" value={selectedCategory.description || ""} onChange={(e) => updateCategory("description", e.target.value)} /></Field>
                    <Field label="Giới thiệu chi tiết"><textarea rows="3" value={selectedCategory.overview || ""} onChange={e => updateCategory("overview", e.target.value)} /></Field>
                    <Field label="Quy cách sản phẩm"><input value={selectedCategory.forms || ""} onChange={e => updateCategory("forms", e.target.value)} /></Field>
                    <Field label="Tiêu chí kiểm tra (mỗi dòng một mục)"><textarea rows="3" value={(selectedCategory.checks || []).join("\n")} onChange={e => updateCategory("checks", e.target.value.split("\n"))} /></Field>
                    <Field label="Thông số (mỗi dòng: Tên | Giá trị)"><textarea rows="5" value={(selectedCategory.specGroups || []).flatMap(group => group.items.map(item => `${item.label} | ${item.value}`)).join("\n")} onChange={e => updateCategory("specGroups", [{ title: "Thông số sản phẩm", items: e.target.value.split("\n").map(line => { const [label, ...values] = line.split("|"); return { label, value: values.join("|") }; }) }])} /></Field>
                    <Field label="Mô tả ảnh"><input value={selectedCategory.alt || ""} onChange={(e) => updateCategory("alt", e.target.value)} /></Field>
                  </div> : <Empty icon={Shapes} title="Chưa có danh mục" body="Dữ liệu danh mục chưa sẵn sàng." />}
                </div>
              </div>
            )}
            {section === "content" && <ContentEditor data={data} updateData={updateData} uploadContentImage={uploadContentImage} uploadCollectionImage={uploadCollectionImage} processingImage={processingImage} />}
            {section === "media" && (
              <div className="admin-section">
                <div className="admin-section-header"><div><span>Media</span><h1>Thư viện hình ảnh</h1></div><button className="admin-button primary" onClick={() => mediaRef.current?.click()}><Upload size={17} />Tải ảnh lên</button></div>
                <div className="admin-media-toolbar"><Field label="Tự động cắt theo loại ảnh"><select value={mediaPreset} onChange={(event) => setMediaPreset(event.target.value)}>{Object.entries(IMAGE_PRESETS).map(([key, preset]) => <option key={key} value={key}>{preset.label} · {preset.width} × {preset.height}px</option>)}</select></Field><ImageGuide preset={mediaPreset} /></div>
                <input ref={mediaRef} hidden type="file" accept="image/*" onChange={(event) => uploadMedia(event.target.files?.[0])} />
                {data.media.length ? <div className="admin-media-grid">{data.media.map((asset) => <button key={asset.id} onClick={() => window.open(asset.src, "_blank", "noopener,noreferrer")}><img src={asset.src} alt="" /><span>{asset.name}<small>{asset.width ? `${asset.width} × ${asset.height}px` : "Ảnh đã lưu"}</small></span></button>)}</div> : <Empty icon={ImageIcon} title="Thư viện chưa có ảnh" body="Tải ảnh gốc tối đa 12 MB. Hệ thống tự cắt và ép đúng tỷ lệ đã chọn." />}
              </div>
            )}
            {section === "settings" && (
              <div className="admin-section">
                <div className="admin-section-header"><div><span>Hệ thống</span><h1>Cài đặt website</h1></div></div>
                <div className="admin-form settings-form">
                  <div className="admin-setting-row"><div><Power size={20} /><span><strong>Chế độ Coming Soon</strong><small>Ẩn giao diện chính và hiển thị trang đang hoàn thiện.</small></span></div><button className={`admin-switch ${data.settings.maintenanceMode ? "active" : ""}`} aria-pressed={data.settings.maintenanceMode} onClick={toggleMaintenance}><span /></button></div>
                  <div className="admin-social-heading"><div><h2>Liên kết chính thức</h2><p>Điền liên kết cho Email, WhatsApp, LinkedIn, Facebook, Zalo, WeChat và TikTok. Link đã điền có QR tự tạo. Kênh để trống hiện trạng thái đang cập nhật. Có thể nhập URL ảnh QR chính thức riêng.</p></div></div>
                  {SOCIAL_FIELDS.map(({ key, label, placeholder }) => <div key={key}><Field label={label}><input value={data.social[key] || ""} placeholder={placeholder} onChange={(e) => updateData((current) => ({ ...current, social: { ...current.social, [key]: e.target.value }, socialQr: { ...current.socialQr, [key]: "" } }))} /></Field><Field label={`QR chính thức · ${label}`}><input value={data.socialQr?.[key] || ""} placeholder="https://… ảnh QR (để trống để tự tạo từ link)" onChange={event => updateData(current => ({ ...current, socialQr: { ...current.socialQr, [key]: event.target.value } }))} /></Field></div>)}
                  <div className="admin-backup-actions">
                    <button className="admin-button secondary" onClick={showPreview}><Eye size={16} />Xem trước Desktop/Mobile</button>
                    <button className="admin-button secondary" onClick={exportJson}><Download size={16} />Xuất bản sao JSON</button>
                    <button className="admin-button secondary" onClick={() => importRef.current?.click()}><Upload size={16} />Nhập dữ liệu JSON</button>
                    <input ref={importRef} hidden type="file" accept="application/json" onChange={(event) => event.target.files?.[0] && importJson(event.target.files[0])} />
                  </div>
                </div>
              </div>
            )}
          </section>

          <aside ref={previewRef} className={`admin-preview ${device}`}>
            <div className="admin-preview-head">
              <span><Eye size={16} />Xem trước trực quan</span>
              <div><button className={device === "desktop" ? "active" : ""} onClick={() => setDevice("desktop")} aria-label="Desktop"><Monitor size={16} /></button><button className={device === "mobile" ? "active" : ""} onClick={() => setDevice("mobile")} aria-label="Điện thoại"><Smartphone size={16} /></button></div>
            </div>
            <AdminLivePreview data={data} device={device} />
          </aside>
        </main>
      </div>
    </div>
  );
}

function Dashboard({ data, publishedAt, setSection, addProduct }) {
  const published = data.products.filter((item) => item.status === "published").length;
  return (
    <div className="admin-section dashboard-section">
      <div className="admin-section-header"><div><span>Chào mừng trở lại</span><h1>Website đang ở trong tầm tay bạn.</h1><p>Quản lý sản phẩm, nội dung và hình ảnh trong một không gian trực quan.</p></div></div>
      <div className="admin-stat-grid">
        <article><Package /><span>Tổng sản phẩm</span><strong>{data.products.length}</strong><small>{published} đang hiển thị</small></article>
        <article><FileText /><span>Khối nội dung</span><strong>{Object.keys(data.content).length}</strong><small>Có thể chỉnh trực tiếp</small></article>
        <article><Images /><span>Ảnh đã tải</span><strong>{data.media.length}</strong><small>Trong thư viện local</small></article>
        <article><CheckCircle2 /><span>Lần xuất bản gần nhất</span><strong className="date-value">{publishedAt ? new Date(publishedAt).toLocaleDateString("vi-VN") : "Chưa có"}</strong><small>{publishedAt ? new Date(publishedAt).toLocaleTimeString("vi-VN") : "Hãy kiểm tra trước khi xuất bản"}</small></article>
      </div>
      <div className={`admin-status-banner ${data.settings.maintenanceMode ? "warning" : "live"}`}><Power size={20} /><div><strong>{data.settings.maintenanceMode ? "Website đang hiển thị Coming Soon" : "Website công khai đang hoạt động"}</strong><p>Có thể bật hoặc tắt tức thì bằng nút trên thanh công cụ.</p></div></div>
      <div className="admin-image-guides"><div><h2>Chuẩn ảnh đã khóa sẵn</h2><p>Ảnh gốc được tự động crop giữa, scale và nén WebP để không làm xô lệch giao diện.</p></div>{Object.keys(IMAGE_PRESETS).map((key) => <ImageGuide key={key} preset={key} />)}</div>
      <div className="admin-quick-actions">
        <div><h2>Thao tác nhanh</h2><p>Bắt đầu từ những việc thường dùng nhất.</p></div>
        <button onClick={addProduct}><Plus />Thêm sản phẩm</button>
        <button onClick={() => setSection("content")}><FileText />Chỉnh nội dung trang</button>
        <button onClick={() => setSection("media")}><UploadCloud />Tải hình ảnh</button>
      </div>
    </div>
  );
}

function ContentEditor({ data, updateData, uploadContentImage, uploadCollectionImage, processingImage }) {
  const update = (key, value) => updateData((current) => ({ ...current, content: { ...current.content, [key]: value } }));
  return (
    <div className="admin-section">
      <div className="admin-section-header"><div><span>Content</span><h1>Chỉnh sửa nội dung trang</h1><p>Nội dung bên phải cập nhật ngay khi bạn nhập.</p></div></div>
      <div className="admin-form content-form">
        <h2>Topbar và Hero</h2>
        <Field label="Thông điệp topbar"><input value={data.content.topbar} onChange={(e) => update("topbar", e.target.value)} /></Field>
        <Field label="Nhãn giới thiệu"><input value={data.content.heroEyebrow} onChange={(e) => update("heroEyebrow", e.target.value)} /></Field>
        <div className="admin-form-grid"><Field label="Tiêu đề chính"><input value={data.content.heroStart} onChange={(e) => update("heroStart", e.target.value)} /></Field><Field label="Dòng nhấn"><input value={data.content.heroAccent} onChange={(e) => update("heroAccent", e.target.value)} /></Field></div>
        <Field label="Mô tả Hero"><textarea rows="4" value={data.content.heroBody} onChange={(e) => update("heroBody", e.target.value)} /></Field>
        <Field label="Nút chính"><input value={data.content.heroCta} onChange={(e) => update("heroCta", e.target.value)} /></Field>
        <ImageGuide preset="hero" />
        <div className="admin-upload-preview admin-upload-preview--hero"><img src={data.content.heroImage} alt="Ảnh Hero" /><label><UploadCloud size={18} />{processingImage ? "Đang xử lý" : "Đổi ảnh Hero"}<input type="file" accept="image/*" disabled={processingImage} onChange={(event) => uploadContentImage(event.target.files?.[0], "hero", "heroImage")} /></label></div>
        <h2>Giới thiệu và Footer</h2>
        <p>Slogan đồng bộ từ hai dòng tiêu đề Hero ở trên sang phần giới thiệu và khối ROSIC.</p>
        <Field label="Khởi từ Tâm: nội dung"><textarea rows="4" value={data.content.aboutBody} onChange={(e) => update("aboutBody", e.target.value)} /></Field>
        <Field label="Vươn bằng Tầm: nội dung"><textarea rows="4" value={data.content.aboutVision} onChange={(e) => update("aboutVision", e.target.value)} /></Field>
        <ImageGuide preset="content" />
        <div className="admin-upload-preview"><img src={data.content.aboutImage} alt="Ảnh giới thiệu" /><label><UploadCloud size={18} />{processingImage ? "Đang xử lý" : "Đổi ảnh giới thiệu"}<input type="file" accept="image/*" disabled={processingImage} onChange={(event) => uploadContentImage(event.target.files?.[0], "content", "aboutImage")} /></label></div>
        <h2>Danh mục và Hành trình</h2>
        <Field label="Tiêu đề danh mục"><input value={data.content.catalogTitle} onChange={(e) => update("catalogTitle", e.target.value)} /></Field>
        <Field label="Mô tả danh mục"><textarea rows="3" value={data.content.catalogBody} onChange={(e) => update("catalogBody", e.target.value)} /></Field>
        <div className="admin-form-grid"><Field label="Tiêu đề hành trình"><input value={data.content.journeyTitleStart} onChange={(e) => update("journeyTitleStart", e.target.value)} /></Field><Field label="Dòng nhấn hành trình"><input value={data.content.journeyTitleAccent} onChange={(e) => update("journeyTitleAccent", e.target.value)} /></Field></div>
        <Field label="Mô tả hành trình"><textarea rows="3" value={data.content.journeyLead} onChange={(e) => update("journeyLead", e.target.value)} /></Field>
        <ImageGuide preset="content" />
        <div className="admin-section-image-grid">{JOURNEY.map((item, index) => <SectionImageUpload key={item.title} label={`Hành trình 0${index + 1}`} src={data.content.journeyImages?.[index] || item.image} disabled={processingImage} onFile={(file) => uploadCollectionImage(file, "journeyImages", index)} />)}</div>
        <h2>Đối tác và Tin tức</h2>
        <div className="admin-form-grid"><Field label="Tiêu đề đối tác"><input value={data.content.partnersTitleStart} onChange={(e) => update("partnersTitleStart", e.target.value)} /></Field><Field label="Dòng nhấn đối tác"><input value={data.content.partnersTitleAccent} onChange={(e) => update("partnersTitleAccent", e.target.value)} /></Field></div>
        <Field label="Mô tả đối tác"><textarea rows="3" value={data.content.partnersLead} onChange={(e) => update("partnersLead", e.target.value)} /></Field>
        <Field label="Tiêu đề tin tức"><input value={data.content.journalTitle} onChange={(e) => update("journalTitle", e.target.value)} /></Field>
        <Field label="Mô tả tin tức"><textarea rows="3" value={data.content.journalLead} onChange={(e) => update("journalLead", e.target.value)} /></Field>
        <div className="admin-section-image-grid">{ARTICLES.map((item, index) => <SectionImageUpload key={item.id} label={`Tin tức 0${index + 1}`} src={data.content.articleImages?.[index] || item.image} disabled={processingImage} onFile={(file) => uploadCollectionImage(file, "articleImages", index)} />)}</div>
        <Field label="Lời mời cuối trang"><input value={data.content.footerTitle} onChange={(e) => update("footerTitle", e.target.value)} /></Field>
        <AdminTextEditor data={data} updateData={updateData} />
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <label className="admin-field"><span>{label}</span>{children}</label>;
}

function ImageGuide({ preset }) {
  const guide = IMAGE_PRESETS[preset] ?? IMAGE_PRESETS.product;
  return <div className="admin-image-guide"><ImageIcon size={18} /><span><strong>{guide.label}</strong><small>Khuyên dùng {guide.width} × {guide.height}px · tỷ lệ {guide.ratio} · {guide.shape}</small></span></div>;
}

function SectionImageUpload({ label, src, onFile, disabled }) {
  return <div className="admin-section-image"><img src={src} alt="" /><span>{label}</span><label><UploadCloud size={15} />Đổi ảnh<input type="file" accept="image/*" disabled={disabled} onChange={(event) => onFile(event.target.files?.[0])} /></label></div>;
}

function Empty({ icon: Icon, title, body }) {
  return <div className="admin-empty">{createElement(Icon, { size: 30 })}<h2>{title}</h2><p>{body}</p></div>;
}
