import { useState } from "react";
export default function AdminProductTranslation({ product, onChange, category = false }) {
  const [language, setLanguage] = useState("en");
  const translation = product.translations?.[language] || {};
  const fields = category ? [["title", "Tên"], ["shortTitle", "Tên ngắn"], ["description", "Mô tả"], ["overview", "Giới thiệu"], ["forms", "Quy cách"], ["alt", "ALT ảnh"]] : [["title", "Tên"], ["short", "Mô tả ngắn"], ["description", "Mô tả chi tiết"], ["alt", "ALT ảnh"]];
  return <details><summary>{category ? "Bản dịch danh mục" : "Bản dịch sản phẩm"}</summary><label className="admin-field"><span>Ngôn ngữ bản dịch</span><select value={language} onChange={event => setLanguage(event.target.value)}>{["en", "zh", "ko", "ja", "ar", "fr", "de"].map(key => <option key={key}>{key}</option>)}</select></label>{fields.map(([key, label]) => <label className="admin-field" key={key}><span>{label} · {language}</span><textarea value={translation[key] || ""} placeholder="Để trống để dùng bản mặc định" onChange={event => onChange("translations", { ...product.translations, [language]: { ...translation, [key]: event.target.value } })} /></label>)}</details>;
}
