export const SOCIAL_CONFIG_VERSION = 3;
export const SOCIAL_DEFAULTS = {
  email: "mailto:info@rosicglobal.com", whatsapp: "https://wa.me/message/CYXCER7RBB6SJ1",
  linkedin: "https://www.linkedin.com/in/clairehong-hongtamrosicglobal/",
  facebook: "https://www.facebook.com/share/1Dq8KnnGEK/", zalo: "https://zalo.me/84962284872", wechat: "https://u.wechat.com/kGlbznJOnP2UQ2A5cKAgU4U", tiktok: "",
};
export const SOCIAL_QR_DEFAULTS = {
  wechat: "/images/social/rosic-wechat-official.png",
  whatsapp: "/images/social/rosic-whatsapp-official.png",
};
// Display-only windows around the codes, including their white quiet zones.
// The original customer PNG remains unchanged and is used in the zoom dialog.
export const SOCIAL_QR_WINDOWS = {
  "/images/social/rosic-wechat-official.png": { left: 110, top: 326, size: 730, width: 950 },
  "/images/social/rosic-whatsapp-official.png": { left: 180, top: 463, size: 360, width: 720 },
};

export function configuredSocial(source, version) {
  const links = { ...SOCIAL_DEFAULTS, ...(version >= 2 ? source : {}) };
  if (version === 2) {
    if (!links.facebook) links.facebook = SOCIAL_DEFAULTS.facebook;
    if (!links.wechat) links.wechat = SOCIAL_DEFAULTS.wechat;
    if (links.whatsapp === "https://wa.me/84962284872") links.whatsapp = SOCIAL_DEFAULTS.whatsapp;
  }
  return links;
}

export function configuredSocialQr(source, links) {
  return Object.fromEntries(Object.keys(SOCIAL_DEFAULTS).map(key => {
    const supplied = source?.[key];
    const original = SOCIAL_QR_DEFAULTS[key];
    if (supplied === original && links[key] !== SOCIAL_DEFAULTS[key]) return [key, ""];
    return [key, supplied ?? (links[key] === SOCIAL_DEFAULTS[key] ? original : "") ?? ""];
  }));
}

export function whatsappQuoteLink(link, summary) {
  const safe = safeSocialLink(link);
  if (!safe) return { href: "", prefilled: false };
  const url = new URL(safe);
  // This Business short link was resolved against its official WhatsApp page.
  // Unknown short links must not silently fall back to an old recipient number.
  if (url.hostname === "wa.me" && url.pathname.replace(/\/$/, "") === "/message/CYXCER7RBB6SJ1") url.pathname = "/84962284872";
  const prefilled = url.hostname === "wa.me" && /^\/\d{8,15}\/?$/.test(url.pathname);
  if (prefilled) url.searchParams.set("text", summary);
  return { href: url.toString(), prefilled };
}
export function safeSocialLink(value) {
  if (typeof value !== "string") return "";
  try { const url = new URL(value); return ["https:", "mailto:"].includes(url.protocol) ? value : ""; } catch { return ""; }
}
