import { quoteFlowCopyFor } from "../quote-flow-copy";
import { EXPORT_SECTION_COPY } from "../export-section-copy";
import { FEEDBACK_COPY } from "../feedback-copy";
import { useState } from "react";
import { siteCopyFor } from "../site-copy";
import { brandStoryFor, ROSIC_VALUES } from "../brand-story";
import { JOURNEY, ARTICLES } from "../data";
import { localizeJourneyItem, localizeArticle } from "../site-copy";
import { contactCopyFor, routingCopyFor } from "../contact-l10n";
import { mergeText, setTextPath } from "../cms/content-overrides";

// Plain Vietnamese names for the most edited groups and fields.
const GROUP_LABELS = { articles: "Tin tức · tiêu đề và nội dung bài viết", journey: "Hành trình", story: "Câu chuyện ROSIC", copy: "Nội dung chung của trang", values: "Giá trị ROSIC", contact: "Liên hệ", routing: "Liên hệ · định hướng", feedback: "Phản hồi khách hàng", exportCatalogue: "Danh mục xuất khẩu", quoteFlow: "Báo giá" };
const FIELD_LABELS = { title: "Tiêu đề", excerpt: "Tóm tắt", category: "Chuyên mục", date: "Ngày", readTime: "Thời gian đọc", sections: "Đoạn", heading: "Tiêu đề đoạn", body: "Nội dung", caption: "Chú thích ảnh", alt: "Mô tả ảnh (ALT)", description: "Mô tả" };
const pathLabel = (path) => path.map((key) => (/^\d+$/.test(key) ? `Mục ${Number(key) + 1}` : FIELD_LABELS[key] ?? key)).join(" › ");

function Fields({ base, patch, path = [], onChange }) {
  if (typeof base === "string") {
    const value = typeof patch === "string" ? patch : base;
    return <label className="admin-field"><span>{pathLabel(path)}</span><textarea rows={value.length > 150 ? 4 : 2} value={value} onChange={event => onChange(path, event.target.value)} /></label>;
  }
  if (!base || typeof base !== "object") return null;
  return Object.entries(base).map(([key, value]) => <Fields key={key} base={value} patch={patch?.[key]} path={[...path, key]} onChange={onChange} />);
}
export default function AdminTextEditor({ data, updateData }) {
  const [language, setLanguage] = useState("vi");
  const copy = siteCopyFor(language);
  // News articles first: their titles and bodies are edited most often.
  const groups = { articles: ARTICLES.map(item => localizeArticle(item, language)),
    quoteFlow: quoteFlowCopyFor(language), exportCatalogue: EXPORT_SECTION_COPY[language], feedback: FEEDBACK_COPY[language], copy, story: brandStoryFor(language, copy), values: ROSIC_VALUES,
    journey: JOURNEY.map((item, index) => localizeJourneyItem(item, index, language)),
    contact: contactCopyFor(language), routing: routingCopyFor(language),
  };
  const patch = data.textOverrides?.[language] || {};
  return <section className="admin-section"><h2>Nội dung chi tiết · 8 ngôn ngữ</h2><p>Chỉnh nhãn nút, menu, câu chuyện, bài viết, giá trị ROSIC, thông tin liên hệ và nội dung từng bước. Nội dung lưu riêng cho mỗi ngôn ngữ; kiểm tra Live Preview trước khi xuất bản.</p>
    <label className="admin-field"><span>Ngôn ngữ nội dung</span><select value={language} onChange={event => setLanguage(event.target.value)}>{["vi", "en", "zh", "ko", "ja", "ar", "fr", "de"].map(key => <option key={key}>{key}</option>)}</select></label>
    {Object.entries(groups).map(([key, value]) => <details key={`${language}-${key}`}><summary>{GROUP_LABELS[key] ?? key}</summary><Fields base={mergeText(value, patch[key])} onChange={(path, text) => updateData(current => ({ ...current, textOverrides: { ...current.textOverrides, [language]: setTextPath(current.textOverrides?.[language], [key, ...path], text) } }))} /></details>)}
  </section>;
}
