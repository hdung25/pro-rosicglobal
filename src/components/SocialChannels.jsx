import { createElement, useEffect, useState } from "react";
import QRCode from "qrcode";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, X } from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaTiktok, FaWeixin, FaWhatsapp } from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { SiZalo } from "react-icons/si";
import { SOCIAL_DEFAULTS, SOCIAL_QR_WINDOWS, safeSocialLink } from "../social-config";

const CHANNELS = [
  ["whatsapp", "WhatsApp", FaWhatsapp],
  ["zalo", "Zalo", SiZalo],
  ["wechat", "WeChat", FaWeixin],
  ["email", "Email", HiOutlineEnvelope],
  ["linkedin", "LinkedIn", FaLinkedinIn],
  ["facebook", "Facebook", FaFacebookF],
  ["tiktok", "TikTok", FaTiktok],
];

const COPY = {
  vi: { open: "Mở", scan: "Quét mã để kết nối", close: "Đóng", group: "Kênh liên hệ chính thức" },
  en: { open: "Open", scan: "Scan to connect", close: "Close", group: "Official channels" },
};

function useQr(href, supplied) {
  const [generated, setGenerated] = useState(null);
  const usable = typeof supplied === "string" && (/^https:\/\//.test(supplied) || /^\/[^/]/.test(supplied)) ? supplied : "";
  useEffect(() => {
    let active = true;
    if (href && !usable) QRCode.toDataURL(href, { width: 320, margin: 3, errorCorrectionLevel: "M" }).then((src) => { if (active) setGenerated({ href, src }); }).catch(() => {});
    return () => { active = false; };
  }, [href, usable]);
  return usable || (generated?.href === href ? generated.src : "");
}

function Channel({ id, name, icon, href, qr, copy }) {
  const image = useQr(href, qr);
  const qrWindow = SOCIAL_QR_WINDOWS[image];
  // Customer-supplied QR artwork contains margins; crop to the code itself.
  const crop = qrWindow ? { position: "absolute", width: `${(qrWindow.width / qrWindow.size) * 100}%`, maxWidth: "none", left: `${(-qrWindow.left / qrWindow.size) * 100}%`, top: `${(-qrWindow.top / qrWindow.size) * 100}%` } : undefined;
  return (
    <Dialog.Root>
      <Dialog.Trigger className="social-icon" data-channel={id} aria-label={name} title={name}>
        {createElement(icon, { size: 18, "aria-hidden": true })}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="social-qr-overlay" />
        <Dialog.Content className="social-qr-dialog social-popup" aria-describedby={undefined}>
          <Dialog.Title><span className="social-popup__icon">{createElement(icon, { size: 20, "aria-hidden": true })}</span>{name}</Dialog.Title>
          {image && (
            <figure className="social-popup__qr">
              <span className="social-popup__code">{qrWindow ? <img src={image} alt={`QR ${name}`} style={crop} /> : <img src={image} alt={`QR ${name}`} />}</span>
              <figcaption>{copy.scan}</figcaption>
            </figure>
          )}
          <a className="button button-primary social-popup__open" href={href} target={href.startsWith("https:") ? "_blank" : undefined} rel="noopener noreferrer">
            {copy.open} {name}<ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <Dialog.Close className="social-qr-close" aria-label={copy.close}><X size={20} /></Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * One row of brand icons; each opens its own popup with the QR code and a
 * button to open the channel. Channels without a link are hidden.
 */
export default function SocialChannels({ links = SOCIAL_DEFAULTS, qr = {}, language = "vi", className = "" }) {
  const copy = COPY[language] ?? COPY.en;
  const available = CHANNELS.map(([id, name, icon]) => ({ id, name, icon, href: safeSocialLink(links[id]) })).filter((item) => item.href);
  return (
    <div className={`social-icons ${className}`.trim()} role="group" aria-label={copy.group}>
      {available.map((item) => <Channel key={item.id} {...item} qr={qr[item.id]} copy={copy} />)}
    </div>
  );
}
