// Add verified business contacts through the deployment environment.
// Empty values intentionally keep the quote request in local draft mode.
export const CONTACT = {
  email: (import.meta.env.VITE_CONTACT_EMAIL || "").trim(),
  phone: (import.meta.env.VITE_CONTACT_PHONE || "").trim(),
  zalo: (import.meta.env.VITE_CONTACT_ZALO || "").trim(),
};
