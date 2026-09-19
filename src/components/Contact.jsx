import { cloneElement, isValidElement, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  Copy,
  LoaderCircle,
  Mail,
  MessageCircle,
} from "lucide-react";
import { CONTACT } from "../contact-config";
import { contactCopyFor, routingCopyFor } from "../contact-l10n";

const GENERAL_REQUEST = "Đơn hàng tổng hợp theo mùa vụ";
const PARTNERSHIP_REQUEST = "Hợp tác vùng trồng & cung ứng";
const FALLBACK_EMAIL = "info@rosicglobal.com";
const FALLBACK_PHONE = "+84962284872";

const PRODUCT_GROUPS = [
  ["", "unspecified"],
  ["Hạt & ngũ cốc", "nuts"],
  ["Gia vị xuất khẩu", "spices"],
  ["Cà phê", "coffee"],
  ["Cơm dừa & nông sản chế biến", "processed"],
  ["Trái cây sấy", "driedFruit"],
  ["Trái cây tươi", "freshFruit"],
  ["Rau củ theo mùa", "vegetables"],
  ["Hợp tác vùng trồng & cung ứng", "partnership"],
];

const TIMELINES = [
  ["", "unspecified"],
  ["Cần báo giá trước", "quoteFirst"],
  ["Trong 2 tuần", "twoWeeks"],
  ["Trong 30 ngày", "thirtyDays"],
  ["Theo mùa vụ / kế hoạch dài hạn", "seasonal"],
];

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validPhone(value) {
  const digits = value.replace(/\D/g, "");
  return /^\+?[\d\s().-]+$/.test(value) && digits.length >= 8 && digits.length <= 15;
}

function createSubmissionId() {
  const uuid = globalThis.crypto?.randomUUID?.();
  return uuid || `quote-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function inferProductGroup(title, products) {
  const product = products.find((item) => (item.sourceTitle ?? item.title) === title);
  if (product?.sourceGroup || product?.group) return product.sourceGroup ?? product.group;
  const normalized = String(title || "").toLocaleLowerCase("vi");
  if (normalized.includes("điều")) return "Hạt & ngũ cốc";
  if (normalized.includes("quế") || normalized.includes("tiêu") || normalized.includes("hồi")) return "Gia vị xuất khẩu";
  if (normalized.includes("cà phê")) return "Cà phê";
  if (normalized.includes("dừa")) return "Cơm dừa & nông sản chế biến";
  if (normalized.includes("sấy")) return "Trái cây sấy";
  if (normalized.includes("xoài") || normalized.includes("thanh long") || normalized.includes("dưa") || normalized.includes("bơ")) return "Trái cây tươi";
  if (normalized.includes("rau")) return "Rau củ theo mùa";
  if (title === PARTNERSHIP_REQUEST) return "Hợp tác vùng trồng & cung ứng";
  return "";
}

function contactView(language) {
  const copy = contactCopyFor(language);
  const routing = routingCopyFor(language);
  return {
    copy,
    routing,
    heading: [copy.heading, routing.accent],
    fields: {
      name: [copy.fields.name.label, copy.fields.name.placeholder],
      phone: [copy.fields.phone.label, copy.fields.phone.placeholder],
      email: [copy.fields.email.label, copy.fields.email.placeholder],
      product: copy.fields.product.label,
      productGroup: routing.productGroup,
      market: [copy.fields.market.label, copy.fields.market.placeholder],
      quantity: [copy.fields.quantity.label, copy.fields.quantity.placeholder],
      timeline: copy.fields.timeline.label,
      message: [copy.fields.message.label, copy.fields.message.placeholder],
    },
    result: {
      accepted: [copy.success.heading, `${copy.success.body} ${routing.noFinalDelivery}`],
      partial: [copy.error.heading, copy.delivery.partiallyAccepted],
      configuration: [copy.fallback.heading, copy.fallback.body],
      failed: [copy.error.heading, copy.delivery.deliveryFailed],
      rate: [copy.error.heading, routing.rate],
      network: [copy.error.heading, routing.network],
      generic: [copy.error.heading, copy.error.body],
      requestId: copy.success.requestId,
      channelTitle: copy.success.deliveryTitle,
      channels: copy.channels,
      status: {
        sent: copy.delivery.sent,
        queued: copy.delivery.queued,
        accepted_by_make: copy.delivery.sent,
        accepted_by_resend: copy.delivery.queued,
        not_configured: copy.delivery.notConfigured,
        failed: copy.delivery.failed,
        not_reported: copy.delivery.pending,
      },
      profileHelp: copy.catalog.help,
      fallbackTitle: routing.fallbackTitle,
      fallbackBody: routing.fallbackBody,
      email: copy.actions.openEmail,
      whatsapp: copy.channels.whatsapp,
      download: copy.actions.download,
      copy: copy.actions.copy,
      copied: copy.actions.copied,
      copyFailed: copy.actions.copyFailed,
      tryAgain: copy.actions.tryAgain,
      profileUnavailable: copy.catalog.comingSoon,
    },
  };
}

function formatRequest(request, view) {
  const { labels, defaultMessage } = view.copy.summary;
  const localLabels = { ...labels, productGroup: view.fields.productGroup };
  const optional = ["productGroup", "market", "quantity", "timeline"]
    .filter((field) => request[field])
    .map((field) => `${localLabels[field]}: ${request[field]}`);
  return [
    "HONG TAM ROSIC GLOBAL - QUOTE REQUEST",
    "",
    `${localLabels.name}: ${request.name}`,
    `${localLabels.phone}: ${request.phone}`,
    `${localLabels.email}: ${request.email}`,
    `${localLabels.product}: ${request.product}`,
    ...optional,
    "",
    `${localLabels.message}:`,
    request.message || defaultMessage,
    "",
    `${view.copy.consent.whatsapp}: ${request.whatsappOptIn ? "Yes" : "No"}`,
  ].join("\n");
}

function channelStatus(channels, key) {
  const channel = channels?.[key];
  return typeof channel === "string" ? channel : channel?.status || "not_reported";
}

function safeHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

function resultType(payload) {
  const status = payload?.status;
  if (status === "accepted") return "accepted";
  if (status === "partially_accepted") return "partial";
  if (status === "configuration_required") return "configuration";
  if (status === "delivery_failed") return "failed";
  if (status === "rate_limited") return "rate";
  return "generic";
}

export default function Contact({
  prefilledProduct = "",
  prefillKey = 0,
  products = [],
  language = "vi",
}) {
  const view = contactView(language);
  const { copy, routing, fields } = view;
  const formRef = useRef(null);
  const resultPanel = useRef(null);
  const appliedPrefill = useRef("");
  const productTitles = useMemo(
    () => products.map((item) => item.sourceTitle ?? item.title),
    [products],
  );
  const initialProduct = productTitles.includes(prefilledProduct) ? prefilledProduct : GENERAL_REQUEST;
  const [product, setProduct] = useState(initialProduct);
  const [productGroup, setProductGroup] = useState(() => inferProductGroup(initialProduct, products));
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [copyStatus, setCopyStatus] = useState("");
  const [formStartedAt, setFormStartedAt] = useState(() => new Date().toISOString());
  const [clientSubmissionId, setClientSubmissionId] = useState(createSubmissionId);

  const email = validEmail(CONTACT.email) ? CONTACT.email : FALLBACK_EMAIL;
  const phone = validPhone(CONTACT.phone) ? CONTACT.phone : FALLBACK_PHONE;
  const zalo = /^https:\/\/(?:zalo\.me|chat\.zalo\.me)(?:\/|$)/i.test(CONTACT.zalo) ? CONTACT.zalo : "";
  const whatsappNumber = phone.replace(/\D/g, "");

  useEffect(() => {
    const identity = `${prefillKey}:${prefilledProduct}`;
    if (!prefilledProduct || appliedPrefill.current === identity || !productTitles.includes(prefilledProduct)) return;
    appliedPrefill.current = identity;
    const frame = window.requestAnimationFrame(() => {
      setProduct(prefilledProduct);
      const inferred = inferProductGroup(prefilledProduct, products);
      if (inferred) setProductGroup(inferred);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [prefillKey, prefilledProduct, productTitles, products]);

  useEffect(() => {
    if (result) resultPanel.current?.focus({ preventScroll: true });
  }, [result]);

  function newAttempt() {
    setResult(null);
    setCopyStatus("");
    setClientSubmissionId(createSubmissionId());
    setFormStartedAt(new Date().toISOString());
  }

  function onFormChange(event) {
    const field = event.target.name;
    if (result) newAttempt();
    if (fieldErrors[field]) {
      event.target.setCustomValidity?.("");
      setFieldErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  function checkName(input) {
    const value = input.value.trim();
    const valid = /^[\p{L}\p{M}][\p{L}\p{M}\p{Zs}.'’-]*$/u.test(value) && Array.from(value).length >= 2;
    input.setCustomValidity(value && !valid ? copy.validation.name : "");
  }

  function checkPhone(input) {
    const value = input.value.trim();
    input.setCustomValidity(value && !validPhone(value) ? copy.validation.phone : "");
  }

  function applyServerErrors(errors) {
    if (!errors || typeof errors !== "object" || !formRef.current) return false;
    const supported = Object.entries(errors).filter(([field]) =>
      ["name", "phone", "email", "product", "productGroup", "market", "quantity", "timeline", "message"].includes(field),
    );
    if (!supported.length) return false;
    const form = formRef.current;
    const localized = supported.map(([field, message]) => [
      field,
      copy.validation[field] || String(message),
    ]);
    setFieldErrors(Object.fromEntries(localized));
    localized.forEach(([field, message]) => {
      const control = form.elements.namedItem(field);
      if (control && "setCustomValidity" in control) control.setCustomValidity(message);
    });
    window.requestAnimationFrame(() => {
      const control = form.elements.namedItem(localized[0][0]);
      control?.focus?.();
      control?.reportValidity?.();
    });
    return true;
  }

  async function onSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.elements.namedItem("name");
    const phoneControl = form.elements.namedItem("phone");
    if (name instanceof HTMLInputElement) checkName(name);
    if (phoneControl instanceof HTMLInputElement) checkPhone(phoneControl);
    if (!form.reportValidity()) return;

    const fieldsData = new FormData(form);
    const request = {
      name: String(fieldsData.get("name") || "").trim(),
      phone: String(fieldsData.get("phone") || "").trim(),
      email: String(fieldsData.get("email") || "").trim(),
      product: product || GENERAL_REQUEST,
      productGroup: productGroup || "",
      market: String(fieldsData.get("market") || "").trim(),
      quantity: String(fieldsData.get("quantity") || "").trim(),
      timeline: String(fieldsData.get("timeline") || "").trim(),
      message: String(fieldsData.get("message") || "").trim(),
      whatsappOptIn: fieldsData.get("whatsappOptIn") === "on",
      honeypot: String(fieldsData.get("honeypot") || ""),
      formStartedAt: new Date(formStartedAt).toISOString(),
      clientSubmissionId,
    };

    setSubmitting(true);
    setResult(null);
    setCopyStatus("");
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": clientSubmissionId,
        },
        body: JSON.stringify(request),
      });
      let payload = {};
      try {
        payload = await response.json();
      } catch {
        payload = {};
      }
      if (response.status === 422 && applyServerErrors(payload.errors)) return;
      if (payload.errors && applyServerErrors(payload.errors)) return;
      setResult({ type: resultType(payload), request, response: payload, httpStatus: response.status });
    } catch {
      setResult({ type: "network", request, response: {}, httpStatus: 0 });
    } finally {
      setSubmitting(false);
    }
  }

  function retrySubmission() {
    setResult(null);
    setCopyStatus("");
    window.requestAnimationFrame(() => formRef.current?.querySelector('button[type="submit"]')?.focus());
  }

  async function copyRequest() {
    if (!result?.request) return;
    try {
      await navigator.clipboard.writeText(formatRequest(result.request, view));
      setCopyStatus(view.result.copied);
    } catch {
      setCopyStatus(view.result.copyFailed);
    }
  }

  function downloadRequest() {
    if (!result?.request) return;
    const file = new Blob(["\uFEFF", formatRequest(result.request, view)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "yeu-cau-bao-gia-hong-tam.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
  }

  const response = result?.response || {};
  const channels = response.deliveries || response.channels || {};
  const hasChannels = Object.keys(channels).length > 0;
  const summary = result?.request ? formatRequest(result.request, view) : "";
  const [resultTitle, resultBody] = result ? view.result[result.type] || view.result.generic : [];
  const catalogProfileUrl = safeHttpsUrl(response.catalogProfile?.url || response.catalogProfileUrl);
  const mailto = `mailto:${email}?subject=${encodeURIComponent(`Quote request - ${result?.request?.product || GENERAL_REQUEST}`)}&body=${encodeURIComponent(summary)}`;
  const whatsapp = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(summary)}` : "";

  return (
    <section id="contact" className="contact-section section-pad" aria-labelledby="contact-heading">
      <div className="container contact-grid">
        <div className="contact-intro">
          <h2 id="contact-heading" className="section-heading">{view.heading[0]}<br /><span>{view.heading[1]}</span></h2>
          <p>{copy.intro}</p>
          <ul className="contact-points">
            <li><ArrowUpRight size={20} aria-hidden="true" /><span><strong>{routing.b2b[0]}</strong><br />{routing.b2b[1]}</span></li>
            <li><ArrowUpRight size={20} aria-hidden="true" /><span><strong>{routing.needs[0]}</strong><br />{routing.needs[1]}</span></li>
          </ul>
          <div className="contact-channels">
            <a href={`mailto:${email}`}><Mail size={18} aria-hidden="true" />{email}</a>
            <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a>
            {zalo && <a href={zalo} target="_blank" rel="noopener noreferrer">{copy.channels.zalo} <ArrowUpRight size={16} aria-hidden="true" /></a>}
          </div>
          <p className="form-note">{copy.notes.legal} {copy.notes.privacy}</p>
        </div>

        <div className="contact-form">
          <h3>{copy.formTitle}</h3>
          <form ref={formRef} onSubmit={onSubmit} onChange={onFormChange} aria-busy={submitting}>
            <div className="form-grid">
              <Field label={fields.name[0]} id="contact-name" error={fieldErrors.name} required>
                <input id="contact-name" name="name" type="text" autoComplete="name" placeholder={fields.name[1]} required maxLength={100} onInput={(event) => checkName(event.currentTarget)} />
              </Field>
              <Field label={fields.phone[0]} id="contact-phone" error={fieldErrors.phone} required>
                <input id="contact-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder={fields.phone[1]} required minLength={8} maxLength={25} onInput={(event) => checkPhone(event.currentTarget)} />
              </Field>
              <Field label={fields.email[0]} id="contact-email" error={fieldErrors.email} required>
                <input id="contact-email" name="email" type="email" autoComplete="email" placeholder={fields.email[1]} required maxLength={200} />
              </Field>
              <Field label={fields.product} id="contact-product" error={fieldErrors.product}>
                <select id="contact-product" name="product" value={product} onChange={(event) => {
                  const next = event.target.value;
                  setProduct(next);
                  const inferred = inferProductGroup(next, products);
                  if (inferred) setProductGroup(inferred);
                }}>
                  <option value={GENERAL_REQUEST}>{routing.generalRequest}</option>
                  {products.map((item) => <option key={item.id} value={item.sourceTitle ?? item.title}>{item.title}</option>)}
                  <option value={PARTNERSHIP_REQUEST}>{routing.partnershipRequest}</option>
                </select>
              </Field>
              <Field label={fields.productGroup} id="contact-product-group" error={fieldErrors.productGroup}>
                <select id="contact-product-group" name="productGroup" value={productGroup} onChange={(event) => setProductGroup(event.target.value)}>
                  {PRODUCT_GROUPS.map(([value, key], index) => <option key={key} value={value}>{routing.groups[index]}</option>)}
                </select>
              </Field>
              <Field label={fields.market[0]} id="contact-market" error={fieldErrors.market}>
                <input id="contact-market" name="market" type="text" list="contact-market-options" placeholder={fields.market[1]} maxLength={160} />
                <datalist id="contact-market-options">{routing.marketOptions.map((market) => <option key={market} value={market} />)}</datalist>
              </Field>
              <Field label={fields.quantity[0]} id="contact-quantity" error={fieldErrors.quantity}>
                <input id="contact-quantity" name="quantity" type="text" placeholder={fields.quantity[1]} maxLength={160} />
              </Field>
              <Field label={fields.timeline} id="contact-timeline" error={fieldErrors.timeline}>
                <select id="contact-timeline" name="timeline">{TIMELINES.map(([value, key], index) => <option key={key} value={value}>{routing.timelines[index]}</option>)}</select>
              </Field>
              <Field label={fields.message[0]} id="contact-message" error={fieldErrors.message} full>
                <textarea id="contact-message" name="message" rows={4} maxLength={4000} placeholder={fields.message[1]} />
              </Field>
              <div className="field field-full form-consent">
                <label htmlFor="contact-whatsapp-opt-in" className="checkbox-label">
                  <input id="contact-whatsapp-opt-in" name="whatsappOptIn" type="checkbox" />
                  <span>{copy.consent.whatsapp}</span>
                </label>
                <p className="form-note form-consent-note">{copy.consent.help}</p>
              </div>
              <div className="contact-honeypot" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input id="contact-website" name="honeypot" type="text" tabIndex={-1} autoComplete="off" />
              </div>
            </div>
            <button type="submit" className="button button-primary" disabled={submitting}>
              {submitting ? <LoaderCircle className="quote-spinner" size={18} aria-hidden="true" /> : <ArrowUpRight size={18} aria-hidden="true" />}
              {submitting ? copy.actions.sending : copy.actions.submit}
            </button>
            <p id="contact-form-note" className="form-note">{copy.notes.required} {copy.notes.legal}</p>
          </form>

          {result && (
            <div className={`request-result request-result--${result.type}`} ref={resultPanel} tabIndex={-1} role="region" aria-labelledby="request-result-title">
              <h4 id="request-result-title">
                {result.type === "accepted" ? <Check size={19} aria-hidden="true" /> : <AlertCircle size={19} aria-hidden="true" />}
                {resultTitle}
              </h4>
              <p>{resultBody}</p>
              {response.requestId && <p className="request-id"><strong>{view.result.requestId}:</strong> {response.requestId}</p>}
              {hasChannels && <section className="delivery-statuses" aria-labelledby="delivery-status-title">
                <h5 id="delivery-status-title">{view.result.channelTitle}</h5>
                {["make", "customerEmail", "salesEmail"].map((key) => {
                  const status = channelStatus(channels, key);
                  return <div className="delivery-status" key={key} data-status={status}><span>{view.result.channels[key]}</span><strong>{view.result.status[status] || view.result.status.not_reported}</strong></div>;
                })}
              </section>}
              <pre className="request-summary">{summary}</pre>
              <div className="request-actions quote-profile-action">
                {catalogProfileUrl
                  ? <a className="button button-primary" href={catalogProfileUrl} target="_blank" rel="noopener noreferrer">Download Our Catalog/Profile <ArrowUpRight size={17} aria-hidden="true" /></a>
                  : <button type="button" className="button button-outline quote-profile-placeholder" disabled aria-describedby="catalog-profile-help">Download Our Catalog/Profile</button>}
                {!catalogProfileUrl && <p id="catalog-profile-help" className="form-note quote-profile-help">{view.result.profileHelp}</p>}
              </div>
              <section className="quote-fallback" aria-labelledby="quote-fallback-title">
                <h5 id="quote-fallback-title">{view.result.fallbackTitle}</h5>
                <p>{view.result.fallbackBody}</p>
                <div className="request-actions">
                  <a className="button button-outline" href={mailto}><Mail size={17} aria-hidden="true" />{view.result.email}</a>
                  {whatsapp && <a className="button button-outline" href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} aria-hidden="true" />{view.result.whatsapp}</a>}
                  <button type="button" className="button button-outline" onClick={downloadRequest}><ArrowDownToLine size={17} aria-hidden="true" />{view.result.download}</button>
                  <button type="button" className="button button-outline" onClick={copyRequest}><Copy size={17} aria-hidden="true" />{view.result.copy}</button>
                  {result.type !== "accepted" && <button type="button" className="button button-outline" onClick={retrySubmission}>{view.result.tryAgain}</button>}
                </div>
                <p className="form-note" role="status" aria-live="polite">{copyStatus}</p>
              </section>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, id, error, required = false, full = false, children }) {
  const control = isValidElement(children)
    ? cloneElement(children, {
        "aria-invalid": error ? "true" : undefined,
        "aria-describedby": error ? `${id}-error` : undefined,
      })
    : children;
  return (
    <div className={`field${full ? " field-full" : ""}`}>
      <label htmlFor={id}>{label}{required && <> <span aria-hidden="true">*</span></>}</label>
      {control}
      {error && <p id={`${id}-error`} className="field-error">{error}</p>}
    </div>
  );
}
