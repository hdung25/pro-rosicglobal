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
import { ARTICLES, JOURNEY, PRODUCTS } from "../data";
import { EXPORT_CATEGORIES } from "../export-catalog";
import { IMAGE_PRESETS, processCmsImage } from "../cms/image-processing";
import "./AdminPanel.css";

const DRAFT_KEY = "rosic-cms-draft-v1";
const PUBLISHED_KEY = "rosic-cms-published-v1";

const DEFAULT_CONTENT = {
  topbar: "Manufacturing with Heart, Trading with Vision",
  heroEyebrow: "HỒNG TÂM ROSIC GLOBAL · VIỆT NAM",
  heroStart: "Tinh hoa nông sản",
  heroAccent: "từ trái tim Việt Nam.",
  heroBody: "Kết nối nguồn nông sản Việt Nam với các đối tác quốc tế bằng chất lượng, sự rõ ràng và trách nhiệm.",
  heroCta: "Khám phá sản phẩm",
  heroImage: "/images/hero.webp",
  aboutTitle: "Chăm chút từ nguồn trồng. Vững vàng trên hành trình toàn cầu.",
  aboutBody: "Chúng tôi đồng hành cùng đối tác từ lựa chọn nguồn hàng, thống nhất quy cách đến đóng gói và giao nhận.",
  aboutImage: "/images/produce.webp",
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

const DEFAULT_SOCIAL = {
  linkedin: "https://vn.linkedin.com/company/hong-tam-rosic-global-manufacturing-trading-joint-stock-company",
  whatsapp: "https://wa.me/84962284872",
  email: "mailto:info@rosicglobal.com",
  facebook: "https://www.facebook.com/rosicglobal",
  zalo: "https://zalo.me/84962284872",
  wechat: "",
  line: "",
};

const seedProducts = PRODUCTS.map((product, index) => ({
  ...product,
  code: `ROS-${String(index + 1).padStart(3, "0")}`,
  status: "published",
}));

const seedCategories = EXPORT_CATEGORIES.map((category) => ({
  ...category,
  code: `CAT-${category.number}`,
  status: "published",
}));

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
  status: "draft",
});

function readState() {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY));
    if (saved?.products && saved?.content) {
      return {
        ...saved,
        categories: Array.isArray(saved.categories) ? saved.categories : seedCategories,
        content: { ...DEFAULT_CONTENT, ...saved.content },
        social: { ...DEFAULT_SOCIAL, ...saved.social },
        settings: { ...DEFAULT_SETTINGS, ...saved.settings },
        media: Array.isArray(saved.media) ? saved.media : [],
      };
    }
  } catch {
    // Corrupt browser data falls back to a safe seed.
  }
  return { products: seedProducts, categories: seedCategories, content: DEFAULT_CONTENT, social: DEFAULT_SOCIAL, settings: DEFAULT_SETTINGS, media: [], updatedAt: null };
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
  const [publishedAt, setPublishedAt] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PUBLISHED_KEY))?.publishedAt ?? null; } catch { return null; }
  });
  const importRef = useRef(null);
  const mediaRef = useRef(null);

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
  const publish = () => {
    const payload = { ...data, publishedAt: new Date().toISOString() };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(payload));
    setData(payload);
    setPublishedAt(payload.publishedAt);
    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel("rosic-cms");
      channel.postMessage(payload);
      channel.close();
    }
    flash("Đã xuất bản và đồng bộ ngay sang giao diện website");
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
    const product = emptyProduct(data.products.length);
    updateData((current) => ({ ...current, products: [product, ...current.products] }));
    setSelectedId(product.id);
    setSection("products");
  };
  const removeProduct = () => {
    if (!selected || !window.confirm(`Xóa sản phẩm “${selected.title}”?`)) return;
    const next = data.products.filter((product) => product.id !== selected.id);
    updateData((current) => ({ ...current, products: next }));
    setSelectedId(next[0]?.id ?? null);
  };
  const processImage = async (file, preset, onReady) => {
    if (!file) return;
    setProcessingImage(true);
    try {
      const asset = await processCmsImage(file, preset);
      const mediaAsset = { id: crypto.randomUUID(), name: file.name, ...asset };
      updateData((current) => ({ ...current, media: [mediaAsset, ...current.media] }));
      onReady?.(asset.src);
      flash(`Đã tự cắt ảnh về ${asset.width} × ${asset.height}px`);
    } catch (error) {
      flash(error.message === "image_too_large" ? "Ảnh gốc cần nhỏ hơn 12 MB" : "Không thể xử lý file ảnh này");
    } finally {
      setProcessingImage(false);
    }
  };
  const uploadProductImage = (file) => processImage(file, "product", (src) => updateProduct("image", src));
  const uploadCategoryImage = (file) => processImage(file, "category", (src) => updateCategory("image", src));
  const uploadContentImage = (file, preset, field) => processImage(file, preset, (src) => updateData((current) => ({ ...current, content: { ...current.content, [field]: src } })));
  const uploadCollectionImage = (file, field, index) => processImage(file, "content", (src) => updateData((current) => {
    const images = [...(current.content[field] || [])];
    images[index] = src;
    return { ...current, content: { ...current.content, [field]: images } };
  }));
  const uploadMedia = (file) => processImage(file, mediaPreset);
  const toggleMaintenance = () => {
    const nextValue = !data.settings.maintenanceMode;
    const payload = { ...data, settings: { ...data.settings, maintenanceMode: nextValue }, updatedAt: new Date().toISOString(), publishedAt: new Date().toISOString() };
    setData(payload);
    setPublishedAt(payload.publishedAt);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(payload));
    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel("rosic-cms");
      channel.postMessage(payload);
      channel.close();
    }
    flash(nextValue ? "Đã bật trang Coming Soon" : "Đã mở lại website công khai");
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
      if (!Array.isArray(payload.products) || !payload.content) throw new Error("invalid");
      setData(payload);
      setSelectedId(payload.products[0]?.id ?? null);
      localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
      flash("Đã nhập dữ liệu CMS");
    } catch {
      flash("File JSON không đúng cấu trúc CMS");
    }
  };

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
          <p>Nội dung đã xuất bản đồng bộ tức thì sang tab website trong cùng trình duyệt.</p>
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
            <button className="admin-button primary" onClick={publish}><CheckCircle2 size={16} />Xuất bản</button>
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
                        <Field label="Nhóm sản phẩm"><select value={selected.category} onChange={(e) => updateProduct("category", e.target.value)}>{data.categories.map((item) => <option key={item.id} value={item.id}>{item.shortTitle}</option>)}</select></Field>
                        <Field label="Nhãn nhóm"><input value={selected.group} onChange={(e) => updateProduct("group", e.target.value)} /></Field>
                      </div>
                      <Field label="Mô tả ngắn"><textarea rows="3" value={selected.short} onChange={(e) => updateProduct("short", e.target.value)} /></Field>
                      <Field label="Thông tin chi tiết"><textarea rows="6" value={selected.description} onChange={(e) => updateProduct("description", e.target.value)} /></Field>
                      <Field label="Mô tả ảnh (SEO/Accessibility)"><input value={selected.alt} onChange={(e) => updateProduct("alt", e.target.value)} /></Field>
                    </div>
                  ) : <Empty icon={Package} title="Chưa có sản phẩm" body="Thêm sản phẩm đầu tiên để bắt đầu." />}
                </div>
              </div>
            )}
            {section === "categories" && (
              <div className="admin-section">
                <div className="admin-section-header"><div><span>Danh mục</span><h1>9 nhóm sản phẩm xuất khẩu</h1><p>Ảnh tải lên được tự động cắt vuông và hiển thị tròn ngoài website.</p></div></div>
                <div className="admin-product-workbench">
                  <div className="admin-product-list admin-category-list"><div>{data.categories.map((category) => <button key={category.id} className={category.id === selectedCategoryId ? "active" : ""} onClick={() => setSelectedCategoryId(category.id)}><img src={category.image} alt="" /><span><strong>{category.shortTitle}</strong><small>{category.code}</small></span></button>)}</div></div>
                  {selectedCategory ? <div className="admin-form category-editor-form">
                    <div className="admin-form-title"><div><span>Chi tiết danh mục</span><h2>{selectedCategory.shortTitle}</h2></div></div>
                    <ImageGuide preset="category" />
                    <div className="admin-upload-preview admin-upload-preview--category"><img src={selectedCategory.image} alt={selectedCategory.alt || selectedCategory.shortTitle} /><label><UploadCloud size={18} />{processingImage ? "Đang xử lý" : "Đổi ảnh"}<input type="file" accept="image/*" disabled={processingImage} onChange={(event) => uploadCategoryImage(event.target.files?.[0])} /></label></div>
                    <div className="admin-form-grid"><Field label="Tên danh mục"><input value={selectedCategory.shortTitle} onChange={(e) => updateCategory("shortTitle", e.target.value)} /></Field><Field label="Mã danh mục"><input value={selectedCategory.code} onChange={(e) => updateCategory("code", e.target.value)} /></Field></div>
                    <Field label="Tiêu đề đầy đủ"><input value={selectedCategory.title} onChange={(e) => updateCategory("title", e.target.value)} /></Field>
                    <Field label="Mô tả ngắn"><textarea rows="4" value={selectedCategory.short || ""} onChange={(e) => updateCategory("short", e.target.value)} /></Field>
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
                {data.media.length ? <div className="admin-media-grid">{data.media.map((asset) => <button key={asset.id} onClick={() => { if (selectedId) updateProduct("image", asset.src); flash("Đã dùng ảnh cho sản phẩm đang chọn"); }}><img src={asset.src} alt="" /><span>{asset.name}<small>{asset.width ? `${asset.width} × ${asset.height}px` : "Ảnh đã lưu"}</small></span></button>)}</div> : <Empty icon={ImageIcon} title="Thư viện chưa có ảnh" body="Tải ảnh gốc tối đa 12 MB. Hệ thống tự cắt và ép đúng tỷ lệ đã chọn." />}
              </div>
            )}
            {section === "settings" && (
              <div className="admin-section">
                <div className="admin-section-header"><div><span>Hệ thống</span><h1>Cài đặt website</h1></div></div>
                <div className="admin-form settings-form">
                  <div className="admin-setting-row"><div><Power size={20} /><span><strong>Chế độ Coming Soon</strong><small>Ẩn giao diện chính và hiển thị trang đang hoàn thiện.</small></span></div><button className={`admin-switch ${data.settings.maintenanceMode ? "active" : ""}`} aria-pressed={data.settings.maintenanceMode} onClick={toggleMaintenance}><span /></button></div>
                  <h2>Liên kết Social Media</h2>
                  {Object.entries(data.social).map(([key, value]) => <Field key={key} label={key.toUpperCase()}><input value={value} placeholder="Dán đường dẫn tài khoản" onChange={(e) => updateData((current) => ({ ...current, social: { ...current.social, [key]: e.target.value } }))} /></Field>)}
                  <div className="admin-backup-actions">
                    <button className="admin-button secondary" onClick={exportJson}><Download size={16} />Xuất bản sao JSON</button>
                    <button className="admin-button secondary" onClick={() => importRef.current?.click()}><Upload size={16} />Nhập dữ liệu JSON</button>
                    <input ref={importRef} hidden type="file" accept="application/json" onChange={(event) => event.target.files?.[0] && importJson(event.target.files[0])} />
                  </div>
                </div>
              </div>
            )}
          </section>

          <aside className={`admin-preview ${device}`}>
            <div className="admin-preview-head">
              <span><Eye size={16} />Xem trước trực quan</span>
              <div><button className={device === "desktop" ? "active" : ""} onClick={() => setDevice("desktop")} aria-label="Desktop"><Monitor size={16} /></button><button className={device === "mobile" ? "active" : ""} onClick={() => setDevice("mobile")} aria-label="Điện thoại"><Smartphone size={16} /></button></div>
            </div>
            <LivePreview content={data.content} product={selected ?? data.products[0]} category={selectedCategory ?? data.categories[0]} device={device} maintenanceMode={data.settings.maintenanceMode} />
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
        <Field label="Tiêu đề giới thiệu"><input value={data.content.aboutTitle} onChange={(e) => update("aboutTitle", e.target.value)} /></Field>
        <Field label="Nội dung giới thiệu"><textarea rows="4" value={data.content.aboutBody} onChange={(e) => update("aboutBody", e.target.value)} /></Field>
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

function LivePreview({ content, product, category, device, maintenanceMode }) {
  return (
    <div className="preview-stage">
      <div className="preview-browser">
        <div className="preview-browser-bar"><span /><span /><span /><small>rosicglobal.com</small></div>
        {maintenanceMode ? <div className="preview-coming-soon"><img src="/brand-mark.svg" alt="" /><small>HỒNG TÂM ROSIC GLOBAL</small><h2>Coming soon</h2><p>Website đang được hoàn thiện.</p></div> : <div className="preview-site">
          <div className="preview-topbar">{content.topbar}</div>
          <div className="preview-nav"><span>TRANG CHỦ</span><span>SẢN PHẨM</span><div><img src="/brand-mark.svg" alt="" /><b>HỒNG TÂM ROSIC</b></div><span>OEM/ODM</span><span>LIÊN HỆ</span></div>
          <section className="preview-hero"><div><small>{content.heroEyebrow}</small><h1>{content.heroStart}<br /><em>{content.heroAccent}</em></h1><p>{content.heroBody}</p><button>{content.heroCta}</button></div><img src={content.heroImage || "/images/hero.webp"} alt="" /></section>
          <section className="preview-products"><small>DANH MỤC SẢN PHẨM</small><h2>{content.aboutTitle}</h2>{category && <div className="preview-category"><img src={category.image} alt="" /><strong>{category.shortTitle}</strong></div>}{product && <article><div><img src={product.image} alt="" /><span>HỒNG TÂM ROSIC</span><b>Quick View Product</b></div><small>PRODUCT CODE&nbsp;&nbsp;{product.code}</small><h3>{product.title}</h3><button>View Product</button></article>}</section>
          <footer>{content.footerTitle}<strong>HỒNG TÂM ROSIC</strong></footer>
        </div>}
      </div>
      {device === "mobile" && <span className="preview-device-label">375 px</span>}
    </div>
  );
}
