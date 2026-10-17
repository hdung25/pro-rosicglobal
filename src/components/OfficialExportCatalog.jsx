import { productSrcSet } from "../product-images";
import Lightbox from "./Lightbox";
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
import { ProductImageBrand } from "./ProductImageBrand";
import "./OfficialExportCatalog.css";

import { EXPORT_SECTION_COPY } from "../export-section-copy";
import { mergeText } from "../cms/content-overrides";

/**
 * Export-category catalogue intended for the public SiteApp.
 *
 * `onRequestQuote` lets the shell prefill or focus its contact form without
 * coupling this section to a particular form implementation.
 */
export default function OfficialExportCatalog({ onRequestQuote, onProduct, products = [], textOverrides, language = "vi", categoriesData = EXPORT_CATEGORIES, sectionId = "export-catalog" }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const copy = mergeText(EXPORT_SECTION_COPY[language] ?? EXPORT_SECTION_COPY.vi, textOverrides);
  const categories = categoriesData.map((category) => localizeExportCategory(category, language));

  const requestQuote = (category) => {
    setSelectedCategory(null);
    onRequestQuote?.(category);
  };

  return (
    <section
      id={sectionId}
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

        <div className="official-export-thumbnails" aria-label={copy.category}>
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              aria-label={`${copy.category}: ${category.title}`}
            >
              <span className="official-export-thumbnail__image">
                <img src={category.image} srcSet={productSrcSet(category.image)} sizes="180px" alt={category.alt} loading="lazy" width="180" height="180" />
              </span>
              <span>{category.shortTitle ?? category.title}</span>
            </button>
          ))}
        </div>

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
                    srcSet={productSrcSet(category.image)}
                    sizes="(max-width: 600px) 90vw, 320px"
                    alt={category.alt}
                    loading="lazy"
                    width="960"
                    height="640"
                  />
                  <ProductImageBrand />
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
        products={products.filter(product => product.category === selectedCategory?.id || ({ "cashew-kernel": ["cashews"], "coffee-bean": ["coffee", "greencoffee"], "black-pepper": ["pepper"], "fresh-fruit": ["mango", "dragonfruit", "melon", "avocado", "pineapple", "passionfruit", "banana", "pomelo", "durian"] }[selectedCategory?.id] || []).includes(product.id))}
        onProduct={product => { setSelectedCategory(null); onProduct?.(product); }}
        categories={categories}
        onCategory={setSelectedCategory}
        language={language}
        category={selectedCategory}
        copy={copy}
        onClose={() => setSelectedCategory(null)}
        onRequestQuote={requestQuote}
      />
    </section>
  );
}

function CategoryDialog({ category, copy, onClose, onRequestQuote, language, products, onProduct, categories, onCategory }) {
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
                <Lightbox src={category.image} alt={category.alt} language={language} />
                <ProductImageBrand />
                <span className="official-export-dialog__number">{category.number}</span>
              </div>

              <div className="official-export-dialog__body">
                <label className="product-switcher">{language === "vi" ? "Chuyển nhóm hàng" : "Switch category"}<select value={category.id} onChange={event => onCategory(categories.find(item => item.id === event.target.value))}>{categories.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
                <p className="official-export-catalog__eyebrow">{copy.category}</p>
                <Dialog.Title>{category.title}</Dialog.Title>
                <Dialog.Description>{category.overview}</Dialog.Description>
                {products.length > 0 && <section className="category-variants"><h3>{language === "vi" ? "Sản phẩm trong nhóm" : "Products in this category"}</h3>{products.map(product => <button type="button" key={product.id} onClick={() => onProduct(product)}><span>{product.code}</span> {product.title}<ChevronRight size={16} /></button>)}</section>}

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
