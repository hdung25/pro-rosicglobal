import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ZoomIn } from "lucide-react";
import { ProductImageBrand } from "./ProductImageBrand";

/**
 * Zoomable product image. Both the thumbnail and the enlarged view wrap the
 * image in a frame that hugs it, so the watermark stays centred on the picture.
 */
export default function Lightbox({ src, srcSet, sizes, alt, language = "vi", className = "", watermarked = false }) {
  const [open, setOpen] = useState(false);
  const labels = { vi: ["Phóng to ảnh", "Đóng ảnh"], en: ["Enlarge image", "Close image"], zh: ["放大图片", "关闭图片"], ko: ["이미지 확대", "이미지 닫기"], ja: ["画像を拡大", "画像を閉じる"], ar: ["تكبير الصورة", "إغلاق الصورة"], fr: ["Agrandir l’image", "Fermer l’image"], de: ["Bild vergrößern", "Bild schließen"] };
  const [zoom, close] = labels[language] || labels.en;
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={`image-zoom media-frame ${className}`} aria-label={`${zoom}: ${alt}`}>
        <img src={src} srcSet={srcSet} sizes={sizes} alt={alt} />
        {!watermarked && <ProductImageBrand />}
        <span className="image-zoom-hint"><ZoomIn size={18} aria-hidden="true" /><span>{zoom}</span></span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="lightbox-overlay" />
        <Dialog.Content className="image-lightbox" aria-describedby={undefined}>
          <Dialog.Title className="sr-only">{alt}</Dialog.Title>
          <span className="lightbox-frame">
            <img src={src} alt={alt} />
            {!watermarked && <ProductImageBrand />}
          </span>
          <Dialog.Close className="lightbox-close" aria-label={close}><X /></Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
