import { useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Image as ImageIcon,
  Images,
  LayoutDashboard,
  Monitor,
  Package,
  Plus,
  Save,
  Search,
  Settings,
  Smartphone,
  Trash2,
  Upload,
  UploadCloud,
} from "lucide-react";
import { PRODUCTS } from "../data";
import { EXPORT_CATEGORIES } from "../export-catalog";
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
  aboutTitle: "Chăm chút từ nguồn trồng. Vững vàng trên hành trình toàn cầu.",
  aboutBody: "Chúng tôi đồng hành cùng đối tác từ lựa chọn nguồn hàng, thống nhất quy cách đến đóng gói và giao nhận.",
  footerTitle: "Cùng bắt đầu một cơ hội hợp tác mới.",
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
    if (saved?.products && saved?.content) return saved;
  } catch {
    // Corrupt browser data falls back to a safe seed.
  }
  return { products: seedProducts, content: DEFAULT_CONTENT, social: DEFAULT_SOCIAL, media: [], updatedAt: null };
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { id: "products", label: "Sản phẩm", icon: Package },
  { id: "content", label: "Nội dung trang", icon: FileText },
  { id: "media", label: "Thư viện media", icon: Images },
  { id: "settings", label: "Cài đặt", icon: Settings },
];

export default function AdminPanel() {
  const [data, setData] = useState(readState);
  const [section, setSection] = useState("dashboard");
  const [selectedId, setSelectedId] = useState(data.products[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const [device, setDevice] = useState("desktop");
  const [notice, setNotice] = useState("");
  const [publishedAt, setPublishedAt] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PUBLISHED_KEY))?.publishedAt ?? null; } catch { return null; }
  });
  const importRef = useRef(null);
  const mediaRef = useRef(null);

  const selected = data.products.find((product) => product.id === selectedId) ?? null;
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
    flash("Đã xuất bản cho bản xem trước trên trình duyệt này");
  };
  const updateProduct = (field, value) => updateData((current) => ({
    ...current,
    products: current.products.map((product) => product.id === selectedId ? { ...product, [field]: value } : product),
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
  const readImage = (file, callback) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return flash("Ảnh cần nhỏ hơn 2 MB để lưu trong trình duyệt");
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
  };
  const uploadProductImage = (file) => readImage(file, (src) => {
    updateProduct("image", src);
    updateData((current) => ({ ...current, media: [{ id: crypto.randomUUID(), name: file.name, src }, ...current.media] }));
    flash("Đã thêm ảnh vào sản phẩm và thư viện");
  });
  const uploadMedia = (file) => readImage(file, (src) => {
    updateData((current) => ({ ...current, media: [{ id: crypto.randomUUID(), name: file.name, src }, ...current.media] }));
    flash("Đã thêm ảnh vào thư viện");
  });
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
              <Icon size={18} />{label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-note">
          <span>Lưu trữ hiện tại</span>
          <strong>Trình duyệt cục bộ</strong>
          <p>Kết nối database và đăng nhập để đồng bộ đa thiết bị.</p>
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <span className="admin-breadcrumb">ROSIC CMS / {NAV_ITEMS.find((item) => item.id === section)?.label}</span>
            <strong>{data.updatedAt ? "Có thay đổi trong bản nháp" : "Dữ liệu gốc của website"}</strong>
          </div>
          <div className="admin-top-actions">
            <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} />Mở website</a>
            <button className="admin-button secondary" onClick={saveDraft}><Save size={16} />Lưu nháp</button>
            <button className="admin-button primary" onClick={publish}><CheckCircle2 size={16} />Xuất bản</button>
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
                      <div className="admin-upload-preview">
                        <img src={selected.image} alt={selected.alt} />
                        <label><UploadCloud size={18} />Đổi ảnh<input type="file" accept="image/*" onChange={(event) => uploadProductImage(event.target.files?.[0])} /></label>
                      </div>
                      <Field label="Tên sản phẩm"><input value={selected.title} onChange={(e) => updateProduct("title", e.target.value)} /></Field>
                      <div className="admin-form-grid">
                        <Field label="Mã sản phẩm"><input value={selected.code} onChange={(e) => updateProduct("code", e.target.value)} /></Field>
                        <Field label="Trạng thái"><select value={selected.status} onChange={(e) => updateProduct("status", e.target.value)}><option value="published">Đã xuất bản</option><option value="draft">Bản nháp</option></select></Field>
                      </div>
                      <div className="admin-form-grid">
                        <Field label="Nhóm sản phẩm"><select value={selected.category} onChange={(e) => updateProduct("category", e.target.value)}>{EXPORT_CATEGORIES.map((item) => <option key={item.id} value={item.id}>{item.shortTitle}</option>)}</select></Field>
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
            {section === "content" && <ContentEditor data={data} updateData={updateData} />}
            {section === "media" && (
              <div className="admin-section">
                <div className="admin-section-header"><div><span>Media</span><h1>Thư viện hình ảnh</h1></div><button className="admin-button primary" onClick={() => mediaRef.current?.click()}><Upload size={17} />Tải ảnh lên</button></div>
                <input ref={mediaRef} hidden type="file" accept="image/*" onChange={(event) => uploadMedia(event.target.files?.[0])} />
                {data.media.length ? <div className="admin-media-grid">{data.media.map((asset) => <button key={asset.id} onClick={() => { if (selectedId) updateProduct("image", asset.src); flash("Đã dùng ảnh cho sản phẩm đang chọn"); }}><img src={asset.src} alt="" /><span>{asset.name}</span></button>)}</div> : <Empty icon={ImageIcon} title="Thư viện chưa có ảnh" body="Tải ảnh lên tối đa 2 MB. Ảnh sẽ có thể gán trực tiếp cho sản phẩm." />}
              </div>
            )}
            {section === "settings" && (
              <div className="admin-section">
                <div className="admin-section-header"><div><span>Hệ thống</span><h1>Cài đặt website</h1></div></div>
                <div className="admin-form settings-form">
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
            <LivePreview content={data.content} product={selected ?? data.products[0]} device={device} />
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
      <div className="admin-quick-actions">
        <div><h2>Thao tác nhanh</h2><p>Bắt đầu từ những việc thường dùng nhất.</p></div>
        <button onClick={addProduct}><Plus />Thêm sản phẩm</button>
        <button onClick={() => setSection("content")}><FileText />Chỉnh nội dung trang</button>
        <button onClick={() => setSection("media")}><UploadCloud />Tải hình ảnh</button>
      </div>
    </div>
  );
}

function ContentEditor({ data, updateData }) {
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
        <h2>Giới thiệu và Footer</h2>
        <Field label="Tiêu đề giới thiệu"><input value={data.content.aboutTitle} onChange={(e) => update("aboutTitle", e.target.value)} /></Field>
        <Field label="Nội dung giới thiệu"><textarea rows="4" value={data.content.aboutBody} onChange={(e) => update("aboutBody", e.target.value)} /></Field>
        <Field label="Lời mời cuối trang"><input value={data.content.footerTitle} onChange={(e) => update("footerTitle", e.target.value)} /></Field>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <label className="admin-field"><span>{label}</span>{children}</label>;
}

function Empty({ icon: Icon, title, body }) {
  return <div className="admin-empty"><Icon size={30} /><h2>{title}</h2><p>{body}</p></div>;
}

function LivePreview({ content, product, device }) {
  return (
    <div className="preview-stage">
      <div className="preview-browser">
        <div className="preview-browser-bar"><span /><span /><span /><small>rosicglobal.com</small></div>
        <div className="preview-site">
          <div className="preview-topbar">{content.topbar}</div>
          <div className="preview-nav"><span>TRANG CHỦ</span><span>SẢN PHẨM</span><div><img src="/brand-mark.svg" alt="" /><b>HỒNG TÂM ROSIC</b></div><span>OEM/ODM</span><span>LIÊN HỆ</span></div>
          <section className="preview-hero"><div><small>{content.heroEyebrow}</small><h1>{content.heroStart}<br /><em>{content.heroAccent}</em></h1><p>{content.heroBody}</p><button>{content.heroCta}</button></div><img src="/images/hero.webp" alt="" /></section>
          <section className="preview-products"><small>DANH MỤC SẢN PHẨM</small><h2>{content.aboutTitle}</h2>{product && <article><div><img src={product.image} alt="" /><span>HỒNG TÂM ROSIC</span><b>Quick View Product</b></div><small>PRODUCT CODE&nbsp;&nbsp;{product.code}</small><h3>{product.title}</h3><button>View Product</button></article>}</section>
          <footer>{content.footerTitle}<strong>HỒNG TÂM ROSIC</strong></footer>
        </div>
      </div>
      {device === "mobile" && <span className="preview-device-label">375 px</span>}
    </div>
  );
}
