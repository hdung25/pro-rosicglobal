import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Mail, RotateCcw } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { SiZalo } from "react-icons/si";
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
  ].filter(([, value]) => value).map(([label, value]) => `- ${label}: ${value}`);
  const contact = [
    [lines.name, values.name],
    [lines.phone, values.phone],
    [lines.email, values.email],
  ].filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`);
  return [form.greeting, "", form.intro, ...details, "", ...contact, "", form.closing].join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * One-step quotation request (customer item 19): the visitor fills in their
 * details, the WhatsApp/email message is prepared live in an editable box,
 * and one click on "Send" opens the chosen app with that message.
 */
export default function Contact({
  sectionId = "contact",
  prefillKey = "",
  prefillNonce = 0,
  products = [],
  groups = [],
  language = "vi",
  socialLinks = SOCIAL_DEFAULTS,
  socialQr,
  textOverrides,
  compact = false,
}) {
  const copy = mergeText(contactCopyFor(language), textOverrides?.contact);
  const routing = mergeText(routingCopyFor(language), textOverrides?.routing);
  const form = catalogCopyFor(language).form;
  const formRef = useRef(null);
  const messageRef = useRef(null);
  const validKeys = useMemo(() => new Set([GENERAL, ...products.map((item) => item.id), ...groups.map((group) => `group:${group.id}`)]), [products, groups]);
  const [values, setValues] = useState({ name: "", phone: "", email: "", quantity: "", market: "", product: validKeys.has(prefillKey) ? prefillKey : GENERAL });
  const [message, setMessage] = useState("");
  const [edited, setEdited] = useState(false);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [startedAt] = useState(() => new Date().toISOString());

  // Prefill the product being viewed (item 20) — also when the visitor
  // presses "Request a quotation" again for another product on the same page.
  const validKeysRef = useRef(validKeys);
  useEffect(() => { validKeysRef.current = validKeys; }, [validKeys]);
  useEffect(() => {
    if (!prefillKey || !validKeysRef.current.has(prefillKey)) return undefined;
    const frame = window.requestAnimationFrame(() => setValues((current) => ({ ...current, product: prefillKey })));
    return () => window.cancelAnimationFrame(frame);
  }, [prefillKey, prefillNonce]);

  const productLine = describeSelection(values.product, products, groups, form.general);
  const composed = composeMessage({ ...values, productLine }, form);
  const text = edited ? message : composed;

  const configuredEmail = socialLinks.email?.replace(/^mailto:/, "");
  const email = validEmail(configuredEmail || "") ? configuredEmail : validEmail(CONTACT.email) ? CONTACT.email : FALLBACK_EMAIL;
  const phone = validPhone(CONTACT.phone) ? CONTACT.phone : FALLBACK_PHONE;
  const zalo = safeSocialLink(socialLinks.zalo ?? CONTACT.zalo);
  const whatsappBase = safeSocialLink(socialLinks.whatsapp) || `https://wa.me/${phone.replace(/\D/g, "")}`;
  const whatsapp = whatsappQuoteLink(whatsappBase, text);
  const subject = `${language === "vi" ? "Yêu cầu báo giá" : "Quotation request"} – ${productLine}`;
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;

  const update = (field) => (event) => {
    const value = event.target.value;
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
      const id = createSubmissionId();
      fetch("/api/quote", {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json", "Idempotency-Key": id },
        body: JSON.stringify({ name: values.name.trim(), phone: values.phone.trim(), email: values.email.trim(), product: productLine, productGroup: "", market: values.market.trim(), quantity: values.quantity.trim(), timeline: "", message: text, whatsappOptIn: channel === "whatsapp", honeypot: formRef.current?.elements.namedItem("honeypot")?.value || "", formStartedAt: startedAt, clientSubmissionId: id }),
      }).catch(() => {});
    } catch { /* The visitor's own channel is the source of truth. */ }
  }

  function send(channel) {
    if (!validate()) return;
    if (formRef.current?.elements.namedItem("honeypot")?.value) return;
    recordLead(channel);
    if (channel === "whatsapp" && whatsapp.href) window.open(whatsapp.href, "_blank", "noopener,noreferrer");
    if (channel === "email") window.location.assign(mailto);
    setStatus(form.sent);
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(form.copied);
    } catch {
      messageRef.current?.select();
    }
  }

  const field = (name, label, props = {}) => (
    <div className={`quote-field${errors[name] ? " has-error" : ""}`}>
      <label htmlFor={`quote-${name}`}>{label}{props.required && <span aria-hidden="true"> *</span>}</label>
      <input id={`quote-${name}`} name={name} value={values[name]} onChange={update(name)} aria-invalid={errors[name] ? "true" : undefined} aria-describedby={errors[name] ? `quote-${name}-error` : undefined} {...props} />
      {errors[name] && <p id={`quote-${name}-error`} className="quote-error">{errors[name]}</p>}
    </div>
  );

  return (
    <section id={sectionId || undefined} className={`contact-section section-pad${compact ? " contact-section--compact" : ""}`} aria-labelledby={`${sectionId || "contact"}-heading`}>
      <div className="container contact-grid">
        <div className="contact-intro">
          <h2 id={`${sectionId || "contact"}-heading`} className="section-heading">{copy.heading}<br /><span>{routing.accent}</span></h2>
          <p>{copy.intro}</p>
          {!compact && <ul className="contact-points">
            <li><ArrowUpRight size={20} aria-hidden="true" /><span><strong>{routing.b2b[0]}</strong><br />{routing.b2b[1]}</span></li>
            <li><ArrowUpRight size={20} aria-hidden="true" /><span><strong>{routing.needs[0]}</strong><br />{routing.needs[1]}</span></li>
          </ul>}
          <div className="contact-channels">
            <a href={`mailto:${email}`}><Mail size={18} aria-hidden="true" />{email}</a>
            <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}><FaWhatsapp size={17} aria-hidden="true" />{phone}</a>
            {zalo && <a href={zalo} target="_blank" rel="noopener noreferrer"><SiZalo size={18} aria-hidden="true" />{copy.channels.zalo}</a>}
          </div>
          <p className="form-note">{copy.notes.privacy}</p>
          {!compact && <SocialChannels links={socialLinks} qr={socialQr} language={language} />}
        </div>

        <div className="contact-form quote-card">
          <h3>{form.title}</h3>
          <p className="quote-lead">{form.lead}</p>
          <form ref={formRef} noValidate onSubmit={(event) => { event.preventDefault(); send("whatsapp"); }}>
            <div className="quote-grid">
              {field("name", copy.fields.name.label, { required: true, autoComplete: "name", maxLength: 100 })}
              {field("phone", copy.fields.phone.label, { required: true, type: "tel", inputMode: "tel", autoComplete: "tel", maxLength: 25 })}
              {field("email", copy.fields.email.label, { type: "email", autoComplete: "email", maxLength: 200 })}
              <div className="quote-field">
                <label htmlFor="quote-product">{form.product}</label>
                <select id="quote-product" name="product" value={values.product} onChange={update("product")}>
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
              {field("quantity", form.quantity, { maxLength: 160, autoComplete: "off" })}
              {field("market", form.market, { maxLength: 160, autoComplete: "off" })}
              <div className="quote-field quote-field--full">
                <label htmlFor="quote-message">{form.message}</label>
                <textarea
                  id="quote-message"
                  ref={messageRef}
                  name="message"
                  rows={9}
                  maxLength={4000}
                  value={text}
                  onChange={(event) => { setEdited(true); setMessage(event.target.value); setStatus(""); }}
                  aria-describedby="quote-message-help"
                />
                <p id="quote-message-help" className="quote-help">
                  {edited && composed !== message ? form.edited : form.messageHelp}
                  {edited && <button type="button" className="quote-link" onClick={() => { setEdited(false); setMessage(""); }}><RotateCcw size={13} aria-hidden="true" />{form.resetMessage}</button>}
                </p>
              </div>
              <div className="contact-honeypot" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input id="contact-website" name="honeypot" type="text" tabIndex={-1} autoComplete="off" />
              </div>
            </div>
            <div className="quote-actions">
              <button type="submit" className="button button-primary quote-send quote-send--whatsapp"><FaWhatsapp size={19} aria-hidden="true" />{form.sendWhatsapp}</button>
              <button type="button" className="button button-outline quote-send" onClick={() => send("email")}><Mail size={18} aria-hidden="true" />{form.sendEmail}</button>
              <button type="button" className="button button-outline quote-icon" onClick={copyMessage} aria-label={form.copy} title={form.copy}><Copy size={18} aria-hidden="true" /></button>
            </div>
            {zalo && <a className="quote-zalo" href={zalo} target="_blank" rel="noopener noreferrer"><SiZalo size={16} aria-hidden="true" />{form.zalo}</a>}
            <p className="quote-status" role="status" aria-live="polite">{status && <><Check size={15} aria-hidden="true" />{status}</>}</p>
            <p className="form-note">{copy.notes.required} {copy.notes.legal}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
