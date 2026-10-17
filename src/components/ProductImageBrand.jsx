import "./ProductImageBrand.css";

/**
 * Centred watermark (logo + name as one unit). It must be rendered inside a
 * positioned frame that hugs the image, so the mark sits in the visual centre
 * of the picture in every view: card thumbnail, Quick View, product page and
 * the zoomed lightbox.
 */
export function ProductImageBrand({ className = "" }) {
  return (
    <span className={`product-image-brand ${className}`.trim()} aria-hidden="true">
      <span className="product-image-brand__mark" />
      <span className="product-image-brand__name">ROSIC</span>
    </span>
  );
}
