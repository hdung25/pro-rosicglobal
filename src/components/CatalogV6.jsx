import { createElement, useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, ArrowUpRight, ChevronRight, FileCheck2, PackageSearch, Search, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { CATEGORY_ICONS, categoryIconKey } from "../category-icons";
import { groupPath, productPath, searchCatalog, SPEC_KEYS, SPEC_LABELS, SPEC_NOTICE } from "../catalog-v6";
import { productSrcSet } from "../product-images";
import { safeSocialLink, whatsappQuoteLink } from "../social-config";
import { ProductImageBrand } from "./ProductImageBrand";
import Lightbox from "./Lightbox";

const PAGE_SIZE = 12;

export function GroupIcon({ group, size = 20, className }) {
  return createElement(CATEGORY_ICONS[categoryIconKey(group)], { size, className, strokeWidth: 1.5, "aria-hidden": true });
}

/** Image + centred watermark inside one frame that hugs the picture. */
export function ProductMedia({ src, alt, watermarked = false, sizes = "(max-width: 600px) 45vw, 300px", className = "", eager = false }) {
  return (
    <span className={`media-frame ${className}`.trim()}>
      <img src={src} srcSet={productSrcSet(src)} sizes={sizes} alt={alt} loading={eager ? undefined : "lazy"} width="640" height="640" />
      {!watermarked && <ProductImageBrand />}
    </span>
  );
}

export function ProductCard({ product, copy, groupTitle, onOpen }) {
  return (
    <article className="pcard">
      <a className="pcard__link" href={productPath(product)} onClick={onOpen}>
        <ProductMedia src={product.image} alt={product.alt} watermarked={product.imageAsset?.watermarked} />
        <span className="pcard__body">
          <span className="pcard__meta"><span>{copy.card.code}</span><strong>{product.code}</strong></span>
          <span className="pcard__title" dir="auto">{product.title}</span>
          {groupTitle && <span className="pcard__group">{groupTitle}</span>}
          <span className="pcard__cta">{copy.card.view}<ArrowUpRight size={15} aria-hidden="true" /></span>
        </span>
      </a>
    </article>
  );
}

function SectionHead({ eyebrow, title, lead, id }) {
  return (
    <header className="v6-head">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="section-heading">{title}</h2>
      {lead && <p className="v6-head__lead">{lead}</p>}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Home: product groups with Quick View                                */
/* ------------------------------------------------------------------ */

export function GroupsSection({ groups, products, copy }) {
  const [quickGroup, setQuickGroup] = useState(null);
  const trigger = useRef(null);
  return (
    <section className="v6-groups section-pad" aria-labelledby="v6-groups-title">
      <div className="container">
        <SectionHead eyebrow={copy.groups.eyebrow} title={copy.groups.title} lead={copy.groups.lead} id="v6-groups-title" />
        <div className="group-grid">
          {groups.map((group, index) => (
            <article className="gcard" key={group.id}>
              <a className="gcard__media" href={groupPath(group.id)} tabIndex={-1} aria-hidden="true">
                <ProductMedia src={group.image} alt={group.alt} watermarked={group.imageAsset?.watermarked} sizes="(max-width: 600px) 90vw, 420px" />
                <span className="gcard__number">{String(index + 1).padStart(2, "0")}</span>
              </a>
              <div className="gcard__body">
                <span className="gcard__count"><GroupIcon group={group} size={16} />{copy.groups.count(group.count)}</span>
                <h3><a href={groupPath(group.id)}>{group.title}</a></h3>
                <p dir="auto">{group.description}</p>
                <div className="gcard__actions">
                  <button type="button" className="button button-outline" onClick={(event) => { trigger.current = event.currentTarget; setQuickGroup(group); }} aria-haspopup="dialog">
                    {copy.groups.quickView}
                  </button>
                  <a className="button button-primary" href={groupPath(group.id)}>{copy.groups.openGroup}<ArrowRight size={17} aria-hidden="true" /></a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <QuickView
        group={quickGroup}
        products={products.filter((product) => product.category === quickGroup?.id)}
        copy={copy}
        onClose={() => setQuickGroup(null)}
        returnFocus={trigger}
      />
    </section>
  );
}

/**
 * Quick View lists every sub-product of the group (customer item 11). Closing
 * returns focus to the button without scrolling, so the page stays exactly
 * where it was (item 12).
 */
export function QuickView({ group, products, copy, onClose, returnFocus }) {
  return (
    <Dialog.Root open={Boolean(group)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay quick-overlay" />
        {group && (
          <Dialog.Content
            className="quick-view"
            onCloseAutoFocus={(event) => { event.preventDefault(); returnFocus?.current?.focus({ preventScroll: true }); }}
          >
            <header className="quick-view__head">
              <ProductMedia src={group.image} alt="" watermarked={group.imageAsset?.watermarked} className="quick-view__thumb" sizes="96px" eager />
              <div>
                <p className="eyebrow">{copy.groups.count(products.length)}</p>
                <Dialog.Title>{copy.quick.title(group.title)}</Dialog.Title>
                <Dialog.Description>{group.description}</Dialog.Description>
              </div>
              <a className="button button-primary quick-view__open" href={groupPath(group.id)} onClick={onClose}>{copy.quick.openGroup}<ArrowRight size={17} aria-hidden="true" /></a>
              <Dialog.Close className="dialog-close icon-button" aria-label={copy.quick.close}><X /></Dialog.Close>
            </header>
            <div className="quick-view__body">
              {products.length
                ? <div className="product-grid-v6 product-grid-v6--quick">{products.map((product) => <ProductCard key={product.id} product={product} copy={copy} onOpen={onClose} />)}</div>
                : <p className="v6-empty"><PackageSearch size={22} aria-hidden="true" />{copy.quick.empty}</p>}
            </div>
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ------------------------------------------------------------------ */
/* Home: product finder (chips = header menu, submitted search)         */
/* ------------------------------------------------------------------ */

export function ProductFinder({ groups, products, copy }) {
  const [group, setGroup] = useState("all");
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const groupTitles = useMemo(() => Object.fromEntries(groups.map((item) => [item.id, item.title])), [groups]);
  // "All" interleaves the groups so the first rows show the whole range.
  const mixed = useMemo(() => {
    const queues = groups.map((item) => products.filter((product) => product.category === item.id));
    const out = [];
    for (let index = 0; out.length < products.length && index < products.length; index += 1)
      for (const queue of queues) if (queue[index]) out.push(queue[index]);
    return out;
  }, [groups, products]);
  const inGroup = group === "all" ? mixed : products.filter((product) => product.category === group);
  const visible = searchCatalog(inGroup, groups, query);
  const paged = group === "all" && !query ? visible.slice(0, limit) : visible;

  const chooseGroup = (id) => { setGroup(id); setLimit(PAGE_SIZE); };
  const reset = () => { setDraft(""); setQuery(""); setGroup("all"); setLimit(PAGE_SIZE); };

  return (
    <section className="v6-finder section-pad" aria-labelledby="v6-finder-title">
      <div className="container">
        <SectionHead eyebrow={copy.finder.eyebrow} title={copy.finder.title} lead={copy.finder.lead} id="v6-finder-title" />
        <form
          className="finder-search"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            const value = draft.trim();
            setQuery(value);
            if (value) setGroup("all");
          }}
        >
          <Search size={19} aria-hidden="true" />
          <input
            type="search"
            name="q"
            value={draft}
            aria-label={copy.finder.searchLabel}
            placeholder={copy.finder.search}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="search"
            onChange={(event) => {
              const value = event.target.value;
              setDraft(value);
              // Clearing the box shows every product again and drops the chip (item 17).
              if (!value.trim()) { setQuery(""); setGroup("all"); setLimit(PAGE_SIZE); }
            }}
          />
          {draft && <button type="button" className="finder-search__clear" onClick={reset} aria-label={copy.finder.clear}><X size={17} /></button>}
          <button type="submit" className="button button-primary finder-search__submit">{copy.finder.submit}</button>
        </form>
        <div className="chip-row" role="group" aria-label={copy.finder.filter}>
          <button type="button" className="chip" aria-pressed={group === "all"} onClick={() => chooseGroup("all")}>
            {copy.finder.all}<span>{products.length}</span>
          </button>
          {groups.map((item) => (
            <button type="button" key={item.id} className="chip" aria-pressed={group === item.id} onClick={() => chooseGroup(item.id)}>
              <GroupIcon group={item} size={16} />{item.title}<span>{item.count}</span>
            </button>
          ))}
        </div>
        <p className="finder-count" role="status">{copy.finder.results(visible.length, query)}</p>
        {visible.length ? (
          <div className="product-grid-v6">
            {paged.map((product) => <ProductCard key={product.id} product={product} copy={copy} groupTitle={groupTitles[product.category]} />)}
          </div>
        ) : (
          <div className="v6-empty v6-empty--block">
            <PackageSearch size={30} aria-hidden="true" />
            <h3>{query ? copy.finder.none : copy.group.emptyTitle}</h3>
            <p>{query ? copy.finder.noneBody(query) : copy.group.emptyBody}</p>
            <button type="button" className="button button-outline" onClick={reset}>{copy.finder.reset}<ArrowRight size={17} aria-hidden="true" /></button>
          </div>
        )}
        {paged.length < visible.length && (
          <div className="finder-more">
            <button type="button" className="button button-outline" onClick={() => setLimit((value) => value + PAGE_SIZE)}>
              {copy.finder.more(Math.min(PAGE_SIZE, visible.length - paged.length))}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Group & product pages                                               */
/* ------------------------------------------------------------------ */

function Breadcrumbs({ items, label }) {
  return (
    <nav className="crumbs container" aria-label={label}>
      <ol>
        {items.map((item, index) => (
          <li key={item.label}>
            {item.href && index < items.length - 1 ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}
            {index < items.length - 1 && <ChevronRight size={14} aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function OtherGroups({ groups, current, copy }) {
  const others = groups.filter((group) => group.id !== current);
  if (!others.length) return null;
  return (
    <section className="other-groups container" aria-labelledby="other-groups-title">
      <h2 id="other-groups-title">{copy.group.other}</h2>
      <div className="other-groups__list">
        {others.map((group) => (
          <a key={group.id} href={groupPath(group.id)} className="other-groups__item">
            <GroupIcon group={group} size={18} />
            <span>{group.title}</span>
            <small>{copy.groups.count(group.count)}</small>
          </a>
        ))}
      </div>
    </section>
  );
}

export function NotFound({ copy, title }) {
  return (
    <section className="v6-notfound container section-pad">
      <PackageSearch size={36} aria-hidden="true" />
      <h1>{title}</h1>
      <a className="button button-primary" href="/san-pham">{copy.group.back}<ArrowRight size={17} aria-hidden="true" /></a>
    </section>
  );
}

export function GroupPage({ group, groups, products, copy, language, onQuote, contact }) {
  const items = products.filter((product) => product.category === group.id);
  const number = String(groups.findIndex((item) => item.id === group.id) + 1).padStart(2, "0");
  return (
    <>
      <Breadcrumbs label={copy.products} items={[{ label: copy.home, href: "/" }, { label: copy.products, href: "/san-pham" }, { label: group.title }]} />
      <section className="group-hero container" aria-labelledby="group-title">
        <div className="group-hero__media">
          <ProductMedia src={group.image} alt={group.alt} watermarked={group.imageAsset?.watermarked} sizes="(max-width: 900px) 100vw, 1320px" eager />
        </div>
        <div className="group-hero__copy">
          <p className="eyebrow">{copy.group.eyebrow} · {number}</p>
          <h1 id="group-title">{group.title}</h1>
          <p>{group.description}</p>
          <div className="group-hero__actions">
            <a className="button button-primary" href="#contact" onClick={() => onQuote(`group:${group.id}`)}>{copy.group.quote}<ArrowUpRight size={17} aria-hidden="true" /></a>
            {items.length > 0 && <a className="button button-outline group-hero__count" href="#group-products">{copy.groups.count(items.length)}</a>}
          </div>
        </div>
      </section>
      <section id="group-products" className="container group-products" aria-labelledby="group-products-title">
        <h2 id="group-products-title" className="v6-subtitle">{copy.group.listTitle}</h2>
        {items.length ? (
          <div className="product-grid-v6">{items.map((product) => <ProductCard key={product.id} product={product} copy={copy} />)}</div>
        ) : (
          <div className="v6-empty v6-empty--block">
            <PackageSearch size={30} aria-hidden="true" />
            <h3>{copy.group.emptyTitle}</h3>
            <p>{copy.group.emptyBody}</p>
            <a className="button button-primary" href="#contact" onClick={() => onQuote(`group:${group.id}`)}>{copy.group.quote}<ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
        )}
        <p className="spec-notice"><FileCheck2 size={17} aria-hidden="true" />{SPEC_NOTICE[language] ?? SPEC_NOTICE.en}</p>
      </section>
      <OtherGroups groups={groups} current={group.id} copy={copy} />
      {contact}
    </>
  );
}

export function SpecTable({ product, language }) {
  const labels = SPEC_LABELS[language] ?? SPEC_LABELS.en;
  return (
    <dl className="spec-table">
      {SPEC_KEYS.map((key) => {
        const value = key === "code" ? product.code : product.specs?.[key];
        return (
          <div key={key} className={value ? undefined : "is-empty"}>
            <dt>{labels[key]}</dt>
            <dd dir="auto">{value || labels.notApplicable}</dd>
          </div>
        );
      })}
    </dl>
  );
}

/**
 * A quotation bar stays reachable while the visitor reads the specifications
 * (item 14). It hides while the page's own CTA or the form is on screen.
 */
function StickyQuote({ product, copy, ctaRef, onQuote }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const cta = ctaRef.current;
      if (!cta) return;
      // The form is lazy-loaded, so it is looked up on every measurement.
      const form = document.querySelector("#contact .contact-form");
      const ctaPassed = cta.getBoundingClientRect().bottom < 0;
      const formOnScreen = form ? form.getBoundingClientRect().top < window.innerHeight - 40 : false;
      setVisible(ctaPassed && !formOnScreen);
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
  }, [ctaRef, product.id]);
  useEffect(() => {
    document.documentElement.classList.toggle("has-quote-bar", visible);
    return () => document.documentElement.classList.remove("has-quote-bar");
  }, [visible]);
  return (
    <div className={`quote-bar${visible ? " is-visible" : ""}`} aria-hidden={!visible}>
      <div className="container quote-bar__inner">
        <ProductMedia src={product.image} alt="" watermarked className="quote-bar__thumb" sizes="56px" />
        <span className="quote-bar__text"><strong dir="auto">{product.title}</strong><small>{product.code}</small></span>
        <a className="button button-primary" href="#contact" tabIndex={visible ? 0 : -1} onClick={() => onQuote(product.id)}>{copy.form.sticky}<ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
    </div>
  );
}

export function ProductPage({ product, group, related, copy, language, onQuote, contact, socialLinks }) {
  const ctaRef = useRef(null);
  const whatsapp = whatsappQuoteLink(safeSocialLink(socialLinks?.whatsapp) || "https://wa.me/84962284872", `${language === "vi" ? "Xin chào, tôi quan tâm sản phẩm" : "Hello, I am interested in"} ${product.code} · ${product.title}`);
  return (
    <>
      <Breadcrumbs label={copy.products} items={[{ label: copy.home, href: "/" }, { label: copy.products, href: "/san-pham" }, { label: group.title, href: groupPath(group.id) }, { label: product.title }]} />
      <section className="product-detail container" aria-labelledby="product-title">
        <div className="product-detail__media">
          <Lightbox src={product.image} srcSet={productSrcSet(product.image)} sizes="(max-width: 900px) 100vw, 640px" alt={product.alt} language={language} watermarked={product.imageAsset?.watermarked} />
          <p className="form-note">{copy.product.imageNote}</p>
        </div>
        <div className="product-detail__info">
          <a className="product-detail__group" href={groupPath(group.id)}><GroupIcon group={group} size={16} />{group.title}</a>
          <h1 id="product-title" dir="auto">{product.title}</h1>
          <p className="product-detail__code">{copy.card.code}: <strong>{product.code}</strong></p>
          <p className="product-detail__lead" dir="auto">{product.description}</p>
          <div className="product-detail__actions" ref={ctaRef}>
            <a className="button button-primary" href="#contact" onClick={() => onQuote(product.id)}>{copy.product.quote}<ArrowUpRight size={18} aria-hidden="true" /></a>
            {whatsapp.href && <a className="button button-outline" href={whatsapp.href} target="_blank" rel="noopener noreferrer"><FaWhatsapp size={18} aria-hidden="true" />{copy.product.whatsapp}</a>}
          </div>
          <h2 className="v6-subtitle">{copy.product.specs}</h2>
          <SpecTable product={product} language={language} />
          <p className="spec-notice"><FileCheck2 size={17} aria-hidden="true" />{SPEC_NOTICE[language] ?? SPEC_NOTICE.en}</p>
        </div>
      </section>
      {related.length > 0 && (
        <section className="related container" aria-labelledby="related-title">
          <div className="related__head">
            <div>
              <h2 id="related-title" className="v6-subtitle">{copy.product.related}</h2>
              <p>{copy.product.relatedLead}</p>
            </div>
            <a className="text-link" href={groupPath(group.id)}>{group.title}<ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
          <div className="product-grid-v6">{related.map((item) => <ProductCard key={item.id} product={item} copy={copy} />)}</div>
        </section>
      )}
      {contact}
      <StickyQuote product={product} copy={copy} ctaRef={ctaRef} onQuote={onQuote} />
    </>
  );
}
