import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ZoomIn } from "lucide-react";
import { ProductImageBrand } from "./ProductImageBrand";

export default function Lightbox({ src, alt, language = "vi", className = "", watermarked = false }) {
  const [open, setOpen] = useState(false);
  const labels = { vi: ["Phóng to ảnh", "Đóng ảnh"], en: ["Enlarge image", "Close image"], zh: ["放大图片", "关闭图片"], ko: ["이미지 확대", "이미지 닫기"], ja: ["画像を拡大", "画像を閉じる"], ar: ["تكبير الصورة", "إغلاق الصورة"], fr: ["Agrandir l’image", "Fermer l’image"], de: ["Bild vergrößern", "Bild schließen"] };
  const [zoom, close] = labels[language] || labels.en;
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={`image-zoom ${className}`} aria-label={`${zoom}: ${alt}`}>
        <img src={src} alt={alt} />
        <span className="image-zoom-hint"><ZoomIn size={20} aria-hidden="true" />{zoom}</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="lightbox-overlay" />
        <Dialog.Content className="image-lightbox" aria-describedby={undefined}>
          <Dialog.Title className="sr-only">{alt}</Dialog.Title>
          <img src={src} alt={alt} />
          {!watermarked && <ProductImageBrand />}
          <Dialog.Close className="lightbox-close" aria-label={close}><X /></Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
