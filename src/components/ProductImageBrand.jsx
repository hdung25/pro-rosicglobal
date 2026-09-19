import "./ProductImageBrand.css";

/**
 * A display-only source label for catalogue imagery. It intentionally lives in
 * the page layer rather than being baked into an image file, so visual assets
 * remain traceable and can be replaced by verified company photography later.
 */
export function ProductImageBrand({ className = "" }) {
  return (
    <span className={`product-image-brand ${className}`.trim()} aria-hidden="true">
      HỒNG TÂM ROSIC GLOBAL
    </span>
  );
}
