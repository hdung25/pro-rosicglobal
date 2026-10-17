export function productSrcSet(src) {
  return src?.includes("-w960-hong-tam-rosic.webp")
    ? `${src.replace("-w960-", "-w320-")} 320w, ${src} 960w`
    : undefined;
}

// Only replace known bundled defaults. Uploaded/customer image URLs remain intact.
export function vr5ProductImage(src) {
  return /^\/images\/vietnam-(mango|coffee|black-pepper)-w(320|960)-hong-tam-rosic\.webp$/.test(src || "")
    ? src.replace("/images/", "/images/vr5/") : src;
}
