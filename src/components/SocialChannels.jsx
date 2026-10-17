import { useEffect, useState } from "react";
import QRCode from "qrcode";
import * as Dialog from "@radix-ui/react-dialog";
import { X, QrCode } from "lucide-react";

import { SOCIAL_DEFAULTS, SOCIAL_QR_WINDOWS, safeSocialLink } from "../social-config";
const labels = { email: "Email", whatsapp: "WhatsApp", linkedin: "LinkedIn", facebook: "Facebook", zalo: "Zalo", wechat: "WeChat", tiktok: "TikTok" };
function Channel({ name, href, qr, language, compact }) {
  const [generated, setGenerated] = useState(null);
  useEffect(() => {
    let active = true;
    if (href) QRCode.toDataURL(href, { width: 256, margin: 4, errorCorrectionLevel: "M" }).then(src => { if (active) setGenerated({ href, src }); }).catch(() => {});
    return () => { active = false; };
  }, [href]);
  const image = typeof qr === "string" && (/^https:\/\//.test(qr) || /^\/[^/]/.test(qr)) ? qr : generated?.href === href ? generated.src : "";
  const window = SOCIAL_QR_WINDOWS[image];
  const previewStyle = window ? { position: "absolute", width: `${window.width / window.size * 100}%`, maxWidth: "none", left: `${-window.left / window.size * 100}%`, top: `${-window.top / window.size * 100}%` } : undefined;
  return <div className={`social-channel${compact ? " social-channel-compact" : ""}`} data-channel={name.toLowerCase()}>
    {href ? <a href={href} target={href.startsWith("https:") ? "_blank" : undefined} rel="noopener noreferrer" aria-label={name}>{name} ↗</a> : <strong>{name}</strong>}
    {image ? <Dialog.Root><Dialog.Trigger className={compact ? "social-qr-action" : "social-qr-preview"} aria-label={`${language === "vi" ? "Phóng to" : "Enlarge"} QR ${name}`}>{compact ? <QrCode size={20} aria-hidden="true" /> : <img src={image} alt={`QR ${name}`} style={previewStyle} width="128" height="128" loading="lazy" />}</Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="social-qr-overlay" /><Dialog.Content className="social-qr-dialog" aria-describedby={undefined}><Dialog.Title>QR {name}</Dialog.Title><img src={image} alt={`QR ${name}`} /><Dialog.Close className="social-qr-close" aria-label={language === "vi" ? "Đóng QR" : "Close QR"}><X size={20} /></Dialog.Close>{href && <a href={href} target="_blank" rel="noopener noreferrer">{name} ↗</a>}<a href={image} target="_blank" rel="noopener noreferrer">{language === "vi" ? "Mở ảnh QR gốc" : "Open original QR image"}</a></Dialog.Content></Dialog.Portal></Dialog.Root> : <span className="social-pending">{language === "vi" ? "Đang cập nhật kênh chính thức" : "Official channel coming soon"}</span>}
  </div>;
}
export default function SocialChannels({ links = SOCIAL_DEFAULTS, qr = {}, language = "vi", compact = false }) {
  return <div className={`social-channel-grid${compact ? " social-channels-compact" : ""}`}>{Object.entries(labels).map(([key, name]) => <Channel key={key} name={name} href={safeSocialLink(links[key])} qr={qr[key]} language={language} compact={compact} />)}</div>;
}
