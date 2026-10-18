import { useEffect, useId, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Building2, Check, ClipboardList, Mail, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { ZaloIcon } from "./ZaloIcon";
import { mergeText } from "../cms/content-overrides";
import { CONTACT } from "../contact-config";
import SocialChannels from "./SocialChannels";
import { safeSocialLink, SOCIAL_DEFAULTS, whatsappQuoteLink } from "../social-config";
import { contactCopyFor, routingCopyFor } from "../contact-l10n";
import { catalogCopyFor } from "../catalog-copy";

const FALLBACK_EMAIL = "info@rosicglobal.com";
const FALLBACK_PHONE = "+84962284872";
const GENERAL = "general";

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validPhone(value) {
  const digits = value.replace(/\D/g, "");
  return /^\+?[\d\s().-]+$/.test(value) && digits.length >= 8 && digits.length <= 15;
}

function createSubmissionId() {
  return globalThis.crypto?.randomUUID?.() || `quote-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

/** Turn the selected option key into a readable product line for the message. */
function describeSelection(key, products, groups, general) {
  if (!key || key === GENERAL) return general;
  if (key.startsWith("group:")) return groups.find((group) => `group:${group.id}` === key)?.title || general;
  const product = products.find((item) => item.id === key);
  return product ? `${product.code} · ${product.title}` : general;
}

function composeMessage(values, form) {
  const { lines } = form;
  const details = [
    [lines.product, values.productLine],
    [lines.quantity, values.quantity],
    [lines.market, values.market],
    [lines.note, values.note],
  ].filter(([, value]) => value).map(([label, value]) => `- ${label}: ${value}`);
  const contact = [
    [lines.name, values.name],
    [lines.phone, values.phone],
    [lines.email, values.email],
  ].filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`);
  return [form.greeting, "", form.intro, ...details, "", ...contact, "", form.closing].join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * One-step quotation form (customer items 37–41): the visitor fills in their
 * details, accepts the privacy policy and presses send. WhatsApp or the email
 * app opens directly with the prepared message, where it can still be edited.
 * Zalo cannot be prefilled, so its button copies the message first.
 */
// What the visitor typed survives closing and reopening the quote dialog
// (kept in memory only for this page view, never stored).
let quoteDraft = null;

export function QuoteForm({
  prefillKey = "",
  prefillNonce = 0,
  products = [],
  groups = [],
  language = "vi",
  socialLinks = SOCIAL_DEFAULTS,
  textOverrides,
  onPolicy,
  autoFocus = false,
}) {
  const copy = mergeText(contactCopyFor(language), textOverrides?.contact);
  const form = catalogCopyFor(language).form;
  const uid = useId().replace(/:/g, "");
  const formRef = useRef(null);
  const validKeys = useMemo(() => new Set([GENERAL, ...products.map((item) => item.id), ...groups.map((group) => `group:${group.id}`)]), [products, groups]);
  const [values, setValues] = useState(() => ({ name: "", phone: "", email: "", quantity: "", market: "", note: "", consent: false, ...quoteDraft, product: validKeys.has(prefillKey) ? prefillKey : quoteDraft?.product && validKeys.has(quoteDraft.product) ? quoteDraft.product : GENERAL }));
  useEffect(() => { quoteDraft = values; }, [values]);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [startedAt] = useState(() => new Date().toISOString());

  // Prefill the product being viewed — also when "Request a quotation" is
  // pressed again for another product on the same page.
  const validKeysRef = useRef(validKeys);
  useEffect(() => { validKeysRef.current = validKeys; }, [validKeys]);
  useEffect(() => {
    if (!prefillKey || !validKeysRef.current.has(prefillKey)) return undefined;
    const frame = window.requestAnimationFrame(() => setValues((current) => ({ ...current, product: prefillKey })));
    return () => window.cancelAnimationFrame(frame);
  }, [prefillKey, prefillNonce]);

  const productLine = describeSelection(values.product, products, groups, form.general);
  const text = composeMessage({ ...values, productLine }, form);

  const configuredEmail = socialLinks.email?.replace(/^mailto:/, "");
  const email = validEmail(configuredEmail || "") ? configuredEmail : validEmail(CONTACT.email) ? CONTACT.email : FALLBACK_EMAIL;
  const phone = validPhone(CONTACT.phone) ? CONTACT.phone : FALLBACK_PHONE;
  const zalo = safeSocialLink(socialLinks.zalo ?? CONTACT.zalo);
  const whatsappBase = safeSocialLink(socialLinks.whatsapp) || `https://wa.me/${phone.replace(/\D/g, "")}`;
  const whatsapp = whatsappQuoteLink(whatsappBase, text);
  const subject = `${language === "vi" ? "Yêu cầu báo giá" : "Quotation request"} – ${productLine}`;
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  const id = (name) => `quote-${uid}-${name}`;

  const update = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    setStatus("");
    if (errors[field]) setErrors((current) => ({ ...current, [field]: "" }));
  };

  function validate() {
    const next = {};
    const name = values.name.trim();
    if (!(/^[\p{L}\p{M}][\p{L}\p{M}\p{Zs}.'’-]*$/u.test(name) && Array.from(name).length >= 2)) next.name = copy.validation.name;
    if (!validPhone(values.phone.trim())) next.phone = copy.validation.phone;
    if (values.email.trim() && !validEmail(values.email.trim())) next.email = copy.validation.email;
    if (!values.consent) next.consent = form.consentError;
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) formRef.current?.elements.namedItem(first)?.focus();
    return !first;
  }

  // Optional lead capture when the server channel is configured; never blocks
  // or replaces the visitor's own WhatsApp/email message.
  function recordLead(channel) {
    if (import.meta.env.VITE_QUOTE_SERVER_ENABLED !== "true") return;
    try {
      const submission = createSubmissionId();
      fetch("/api/quote", {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json", "Idempotency-Key": submission },
        body: JSON.stringify({ name: values.name.trim(), phone: values.phone.trim(), email: values.email.trim(), product: productLine, productGroup: "", market: values.market.trim(), quantity: values.quantity.trim(), timeline: "", message: text, whatsappOptIn: channel === "whatsapp", honeypot: formRef.current?.elements.namedItem("honeypot")?.value || "", formStartedAt: startedAt, clientSubmissionId: submission }),
      }).catch(() => {});
    } catch { /* The visitor's own channel is the source of truth. */ }
  }

  async function send(channel) {
    if (!validate()) return;
    if (formRef.current?.elements.namedItem("honeypot")?.value) return;
    recordLead(channel);
    if (channel === "whatsapp" && whatsapp.href) window.open(whatsapp.href, "_blank", "noopener,noreferrer");
    if (channel === "email") window.location.assign(mailto);
    if (channel === "zalo") {
      try { await navigator.clipboard.writeText(text); } catch { /* Clipboard may be blocked; Zalo still opens. */ }
      if (zalo) window.open(zalo, "_blank", "noopener,noreferrer");
      setStatus(form.zaloCopied);
      return;
    }
    setStatus(form.sent);
  }

  const field = (name, label, props = {}) => (
    <div className={`quote-field${errors[name] ? " has-error" : ""}${props.full ? " quote-field--full" : ""}`}>
      <label htmlFor={id(name)}>{label}{props.required && <span aria-hidden="true"> *</span>}</label>
      <input
        id={id(name)}
        name={name}
        value={values[name]}
        onChange={update(name)}
        aria-invalid={errors[name] ? "true" : undefined}
        aria-describedby={errors[name] ? `${id(name)}-error` : undefined}
        autoComplete="off"
        required={props.required}
        type={props.type}
        inputMode={props.inputMode}
        maxLength={props.maxLength}
        autoFocus={props.autoFocus}
      />
      {errors[name] && <p id={`${id(name)}-error`} className="quote-error">{errors[name]}</p>}
    </div>
  );

  return (
    <form ref={formRef} className="quote-form" noValidate onSubmit={(event) => { event.preventDefault(); send("whatsapp"); }}>
      <div className="quote-grid">
        {field("name", copy.fields.name.label, { required: true, maxLength: 100, autoFocus })}
        {field("phone", copy.fields.phone.label, { required: true, type: "tel", inputMode: "tel", maxLength: 25 })}
        {field("email", copy.fields.email.label, { type: "email", maxLength: 200 })}
        <div className="quote-field">
          <label htmlFor={id("product")}>{form.product}</label>
          <select id={id("product")} name="product" value={values.product} onChange={update("product")}>
            <option value={GENERAL}>{form.general}</option>
            {groups.map((group) => {
              const items = products.filter((item) => item.category === group.id);
              return (
                <optgroup key={group.id} label={group.title}>
                  <option value={`group:${group.id}`}>{group.title}{items.length ? ` (${items.length})` : ""}</option>
                  {items.map((item) => <option key={item.id} value={item.id}>{item.code} · {item.title}</option>)}
                </optgroup>
              );
            })}
          </select>
        </div>
        {field("quantity", form.quantity, { maxLength: 160 })}
        {field("market", form.market, { maxLength: 160 })}
        {field("note", form.note, { maxLength: 600, full: true })}
        <div className={`quote-field quote-field--full quote-consent${errors.consent ? " has-error" : ""}`}>
          <label className="quote-consent__label" htmlFor={id("consent")}>
            <input id={id("consent")} name="consent" type="checkbox" checked={values.consent} onChange={update("consent")} aria-invalid={errors.consent ? "true" : undefined} aria-describedby={errors.consent ? `${id("consent")}-error` : undefined} />
            <span>
              {form.consent[0]}
              <button type="button" className="quote-link" onClick={onPolicy}>{form.consent[1]}</button>
              {form.consent[2]}<span aria-hidden="true"> *</span>
            </span>
          </label>
          {errors.consent && <p id={`${id("consent")}-error`} className="quote-error">{errors.consent}</p>}
        </div>
        <div className="contact-honeypot" aria-hidden="true">
          <label htmlFor={id("website")}>Website</label>
          <input id={id("website")} name="honeypot" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </div>
      <div className="quote-actions">
        <button type="submit" className="button button-primary quote-send quote-send--whatsapp"><FaWhatsapp size={19} aria-hidden="true" />{form.sendWhatsapp}</button>
        <button type="button" className="button button-outline quote-send" onClick={() => send("email")}><Mail size={18} aria-hidden="true" />{form.sendEmail}</button>
        {zalo && <button type="button" className="button button-outline quote-send quote-send--zalo" onClick={() => send("zalo")}><ZaloIcon size={18} aria-hidden="true" />{form.zaloButton}</button>}
      </div>
      <p className="quote-status" role="status" aria-live="polite">{status && <><Check size={15} aria-hidden="true" />{status}</>}</p>
      <p className="form-note">{copy.notes.required}</p>
    </form>
  );
}

/** "Request a quotation" opens the form in place instead of leaving the page. */
export function QuoteDialog({ open, onOpenChange, title, subtitle, ...formProps }) {
  const form = catalogCopyFor(formProps.language).form;
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay quote-overlay" />
        <Dialog.Content className="quote-dialog">
          <header className="quote-dialog__head">
            <div>
              <Dialog.Title>{title || form.dialogTitle}</Dialog.Title>
              <Dialog.Description>{subtitle || form.lead}</Dialog.Description>
            </div>
            <Dialog.Close className="dialog-close icon-button" aria-label={form.close}><X /></Dialog.Close>
          </header>
          <div className="quote-dialog__body">
            <QuoteForm {...formProps} autoFocus />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function Contact({
  sectionId = "contact",
  socialLinks = SOCIAL_DEFAULTS,
  socialQr,
  textOverrides,
  language = "vi",
  ...formProps
}) {
  const copy = mergeText(contactCopyFor(language), textOverrides?.contact);
  const routing = mergeText(routingCopyFor(language), textOverrides?.routing);
  const form = catalogCopyFor(language).form;
  const configuredEmail = socialLinks.email?.replace(/^mailto:/, "");
  const email = validEmail(configuredEmail || "") ? configuredEmail : validEmail(CONTACT.email) ? CONTACT.email : FALLBACK_EMAIL;
  const phone = validPhone(CONTACT.phone) ? CONTACT.phone : FALLBACK_PHONE;
  return (
    <section id={sectionId || undefined} className="contact-section section-pad" aria-labelledby="contact-heading">
      <div className="container contact-grid">
        <div className="contact-intro">
          <h2 id="contact-heading" className="section-heading">{copy.heading}<br /><span>{routing.accent}</span></h2>
          <p>{copy.intro}</p>
          <ul className="contact-points">
            <li><Building2 size={20} strokeWidth={1.6} aria-hidden="true" /><span><strong>{routing.b2b[0]}</strong><br />{routing.b2b[1]}</span></li>
            <li><ClipboardList size={20} strokeWidth={1.6} aria-hidden="true" /><span><strong>{routing.needs[0]}</strong><br />{routing.needs[1]}</span></li>
          </ul>
          <div className="contact-channels">
            <a href={`mailto:${email}`}><Mail size={18} aria-hidden="true" />{email}</a>
            <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}><FaWhatsapp size={17} aria-hidden="true" />{phone}</a>
          </div>
          <SocialChannels links={socialLinks} qr={socialQr} language={language} className="contact-social" />
          <p className="form-note">{copy.notes.privacy}</p>
        </div>
        <div className="contact-form quote-card">
          <h3>{form.title}</h3>
          <p className="quote-lead">{form.lead}</p>
          <QuoteForm language={language} socialLinks={socialLinks} textOverrides={textOverrides} {...formProps} />
        </div>
      </div>
    </section>
  );
}
