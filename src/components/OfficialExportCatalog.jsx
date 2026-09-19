import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  FileCheck2,
  PackageCheck,
  X,
} from "lucide-react";
import { EXPORT_CATEGORIES, EXPORT_SPEC_NOTICE } from "../export-catalog";
import { localizeExportCategory } from "../export-catalog-l10n";
import "./OfficialExportCatalog.css";

const SECTION_COPY = {
  vi: {
    eyebrow: "DANH MỤC XUẤT KHẨU",
    title: <>Từ vùng nguyên liệu đến<br /><em>quy cách giao thương.</em></>,
    lead: "Tám nhóm hàng được trình bày theo những thông tin cần chốt trước khi chào giá: dạng hàng, chỉ tiêu tham chiếu và phương án đóng gói.",
    category: "Nhóm hàng xuất khẩu",
    detail: "Xem chi tiết",
    viewSpec: "Xem quy cách",
    notice: "Lưu ý quy cách",
    quote: "Gửi yêu cầu báo giá",
    productFormat: "Dạng hàng",
    checks: "Điểm cần kiểm tra",
    requestSpec: "Yêu cầu quy cách",
    close: "Đóng chi tiết sản phẩm",
  },
  en: {
    eyebrow: "EXPORT CATALOGUE",
    title: <>From growing regions to<br /><em>trade-ready specifications.</em></>,
    lead: "Eight product families are organised around the points to align before a quotation: formats, reference checks and packing options.",
    category: "Export product family",
    detail: "View details",
    viewSpec: "View specifications",
    notice: "Specification note",
    quote: "Request a quotation",
    productFormat: "Product format",
    checks: "Key checks",
    requestSpec: "Request specifications",
    close: "Close product details",
  },
  zh: { eyebrow: "出口产品目录", title: <>从产区到<br /><em>贸易规格。</em></>, lead: "八大产品类别围绕报价前需要确认的信息组织：产品形态、参考检查项和包装方案。", category: "出口产品类别", detail: "查看详情", viewSpec: "查看规格", notice: "规格说明", quote: "索取报价", productFormat: "产品形态", checks: "重点检查项", requestSpec: "索取规格", close: "关闭产品详情" },
  ko: { eyebrow: "수출 카탈로그", title: <>원산지부터<br /><em>거래 사양까지.</em></>, lead: "8개 제품군은 견적 전 확인해야 할 제품 형태, 기준 점검 항목, 포장 방법을 중심으로 구성했습니다.", category: "수출 제품군", detail: "상세 보기", viewSpec: "사양 보기", notice: "사양 안내", quote: "견적 요청", productFormat: "제품 형태", checks: "주요 확인 항목", requestSpec: "사양 요청", close: "제품 상세 닫기" },
  ja: { eyebrow: "輸出カタログ", title: <>産地から<br /><em>取引仕様まで。</em></>, lead: "8つの製品群を、見積もり前に確認する形状、参考確認項目、梱包方法に沿って整理しました。", category: "輸出製品群", detail: "詳細を見る", viewSpec: "仕様を見る", notice: "仕様に関する注記", quote: "見積もりを依頼", productFormat: "製品形態", checks: "確認項目", requestSpec: "仕様を依頼", close: "商品詳細を閉じる" },
  ar: { eyebrow: "كتالوج التصدير", title: <>من مناطق الزراعة إلى<br /><em>مواصفات التجارة.</em></>, lead: "تنظم ثماني عائلات من المنتجات حول ما يجب تأكيده قبل عرض السعر: الشكل، نقاط الفحص المرجعية وخيارات التعبئة.", category: "فئة منتجات التصدير", detail: "عرض التفاصيل", viewSpec: "عرض المواصفات", notice: "ملاحظة المواصفات", quote: "طلب عرض سعر", productFormat: "شكل المنتج", checks: "نقاط الفحص", requestSpec: "طلب المواصفات", close: "إغلاق تفاصيل المنتج" },
  fr: { eyebrow: "CATALOGUE EXPORT", title: <>Des régions de culture aux<br /><em>spécifications commerciales.</em></>, lead: "Huit familles de produits structurées autour des points à valider avant un devis : formats, contrôles de référence et conditionnement.", category: "Famille export", detail: "Voir les détails", viewSpec: "Voir les spécifications", notice: "Note de spécification", quote: "Demander un devis", productFormat: "Format produit", checks: "Points de contrôle", requestSpec: "Demander les spécifications", close: "Fermer les détails produit" },
  de: { eyebrow: "EXPORTKATALOG", title: <>Von Anbaugebieten zu<br /><em>handelstauglichen Spezifikationen.</em></>, lead: "Acht Produktfamilien, geordnet nach den Punkten vor einem Angebot: Format, Referenzprüfungen und Verpackungsoptionen.", category: "Exportproduktgruppe", detail: "Details ansehen", viewSpec: "Spezifikationen ansehen", notice: "Spezifikationshinweis", quote: "Angebot anfragen", productFormat: "Produktformat", checks: "Wichtige Prüfungen", requestSpec: "Spezifikationen anfragen", close: "Produktdetails schließen" },
};

/**
 * Export-category catalogue intended for the public SiteApp.
 *
 * `onRequestQuote` lets the shell prefill or focus its contact form without
 * coupling this section to a particular form implementation.
 */
export default function OfficialExportCatalog({ onRequestQuote, language = "vi" }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const copy = SECTION_COPY[language] ?? SECTION_COPY.vi;
  const categories = EXPORT_CATEGORIES.map((category) => localizeExportCategory(category, language));

  const requestQuote = (category) => {
    setSelectedCategory(null);
    onRequestQuote?.(category);
  };

  return (
    <section
      id="export-catalog"
      className="official-export-catalog"
      aria-labelledby="official-export-title"
      lang={language}
    >
      <div className="official-export-catalog__glow" aria-hidden="true" />
      <div className="container official-export-catalog__inner">
        <header className="official-export-catalog__heading">
          <div>
            <p className="official-export-catalog__eyebrow">
              {copy.eyebrow}
            </p>
            <h2 id="official-export-title">{copy.title}</h2>
          </div>
          <p>{copy.lead}</p>
        </header>

        <div
          className="official-export-catalog__cards"
          aria-label={copy.category}
        >
          {categories.map((category) => (
            <article
              className={`official-export-card official-export-card--${category.id}`}
              key={category.id}
            >
              <button
                type="button"
                className="official-export-card__open"
                onClick={() => setSelectedCategory(category)}
                aria-haspopup="dialog"
                aria-label={`${copy.viewSpec}: ${category.title}`}
              >
                <div className="official-export-card__image">
                  <img
                    src={category.image}
                    alt={category.alt}
                    loading="lazy"
                    width="960"
                    height="640"
                  />
                  <span className="official-export-card__number">
                    {category.number}
                  </span>
                  <span className="official-export-card__detail" aria-hidden="true">
                    {copy.detail} <ArrowUpRight size={15} />
                  </span>
                </div>
                <div className="official-export-card__content">
                  <span>{copy.category}</span>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  <span className="official-export-card__link">
                    {copy.viewSpec} <ChevronRight size={15} />
                  </span>
                </div>
              </button>
            </article>
          ))}
        </div>

        <aside className="official-export-catalog__notice" aria-label={copy.notice}>
          <FileCheck2 size={20} aria-hidden="true" />
          <p>{categories[0]?.notice ?? EXPORT_SPEC_NOTICE}</p>
          <a href="#contact">
            {copy.quote} <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </aside>
      </div>

      <CategoryDialog
        category={selectedCategory}
        copy={copy}
        onClose={() => setSelectedCategory(null)}
        onRequestQuote={requestQuote}
      />
    </section>
  );
}

function CategoryDialog({ category, copy, onClose, onRequestQuote }) {
  return (
    <Dialog.Root open={Boolean(category)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="official-export-dialog__overlay" />
        {category && (
          <Dialog.Content className="official-export-dialog__content">
            <Dialog.Close asChild>
              <button
                className="official-export-dialog__close"
                type="button"
                aria-label={copy.close}
              >
                <X size={19} aria-hidden="true" />
              </button>
            </Dialog.Close>

            <div className="official-export-dialog__scroll">
              <div className="official-export-dialog__visual">
                <img src={category.image} alt={category.alt} />
                <span>{category.number}</span>
              </div>

              <div className="official-export-dialog__body">
                <p className="official-export-catalog__eyebrow">{copy.category}</p>
                <Dialog.Title>{category.title}</Dialog.Title>
                <Dialog.Description>{category.overview}</Dialog.Description>

                <div className="official-export-dialog__summary">
                  <PackageCheck size={19} aria-hidden="true" />
                  <div>
                    <strong>{copy.productFormat}</strong>
                    <span>{category.forms}</span>
                  </div>
                </div>

                <div className="official-export-dialog__groups">
                  {category.specGroups.map((group) => (
                    <section key={group.title}>
                      <h3>{group.title}</h3>
                      <dl>
                        {group.items.map((item) => (
                          <div key={item.label}>
                            <dt>{item.label}</dt>
                            <dd>{item.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </section>
                  ))}
                </div>

                <div className="official-export-dialog__checks">
                  <strong>{copy.checks}</strong>
                  <div>
                    {category.checks.map((check) => (
                      <span key={check}>
                        <Check size={13} aria-hidden="true" />
                        {check}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="official-export-dialog__reference">
                  <FileCheck2 size={17} aria-hidden="true" />
                  <p>{category.notice ?? EXPORT_SPEC_NOTICE}</p>
                </div>

                <button
                  className="official-export-dialog__action"
                  type="button"
                  onClick={() => onRequestQuote(category)}
                >
                  {copy.requestSpec} <ArrowUpRight size={17} aria-hidden="true" />
                </button>
              </div>
            </div>
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
}
