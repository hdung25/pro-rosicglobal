import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { ProductImageBrand } from "./ProductImageBrand";

/**
 * Zoomable product image. Both the thumbnail and the enlarged view wrap the
 * image in a frame that hugs it, so the watermark stays centred on the picture.
 * When the picture is shown smaller than its own resolution (phones), tapping
 * it switches to full size inside a scrollable view so details can be read.
 */
export default function Lightbox({ src, srcSet, sizes, alt, language = "vi", className = "", watermarked = false }) {
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [canZoom, setCanZoom] = useState(false);
  const labels = {
    vi: ["Phóng to ảnh", "Đóng ảnh", "Thu nhỏ ảnh"],
    en: ["Enlarge image", "Close image", "Fit image to screen"],
    zh: ["放大图片", "关闭图片", "缩小图片"],
    ko: ["이미지 확대", "이미지 닫기", "이미지 축소"],
    ja: ["画像を拡大", "画像を閉じる", "画像を縮小"],
    ar: ["تكبير الصورة", "إغلاق الصورة", "تصغير الصورة"],
    fr: ["Agrandir l’image", "Fermer l’image", "Ajuster l’image à l’écran"],
    de: ["Bild vergrößern", "Bild schließen", "Bild einpassen"],
  };
  const [zoom, close, fit] = labels[language] || labels.en;
  const scroller = useRef(null);
  // Open the full-size view on the centre of the picture.
  useEffect(() => {
    const node = scroller.current;
    if (!zoomed || !node) return;
    node.scrollTo({ left: (node.scrollWidth - node.clientWidth) / 2, top: (node.scrollHeight - node.clientHeight) / 2 });
  }, [zoomed]);
  const measure = (image) => setCanZoom(image.naturalWidth > image.clientWidth + 40);
  return (
    <Dialog.Root open={open} onOpenChange={(value) => { setOpen(value); if (!value) setZoomed(false); }}>
      <Dialog.Trigger className={`image-zoom media-frame ${className}`} aria-label={`${zoom}: ${alt}`}>
        <img src={src} srcSet={srcSet} sizes={sizes} alt={alt} />
        {!watermarked && <ProductImageBrand />}
        <span className="image-zoom-hint"><ZoomIn size={18} aria-hidden="true" /><span>{zoom}</span></span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="lightbox-overlay" />
        <Dialog.Content className={`image-lightbox${zoomed ? " is-zoomed" : ""}`} aria-describedby={undefined}>
          <Dialog.Title className="sr-only">{alt}</Dialog.Title>
          <div className="lightbox-scroller" ref={scroller}>
            <button
              type="button"
              className="lightbox-frame"
              onClick={() => (canZoom || zoomed) && setZoomed((value) => !value)}
              aria-label={zoomed ? fit : zoom}
              aria-pressed={zoomed}
              disabled={!canZoom && !zoomed}
            >
              <img src={src} alt={alt} onLoad={(event) => measure(event.currentTarget)} />
              {!watermarked && <ProductImageBrand />}
            </button>
          </div>
          {(canZoom || zoomed) && (
            <span className="lightbox-hint" aria-hidden="true">{zoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}{zoomed ? fit : zoom}</span>
          )}
          <Dialog.Close className="lightbox-close" aria-label={close}><X /></Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
