import "./ProductImageBrand.css";

export function ProductImageBrand({ className = "" }) {
  return (
    <span className={`product-image-brand ${className}`.trim()} aria-hidden="true" />
  );
}
