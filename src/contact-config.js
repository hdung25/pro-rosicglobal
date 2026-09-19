// The public contacts below were supplied for the live website. Deployment
// environment values can replace them without exposing any server secret.
export const CONTACT = {
  email: (import.meta.env.VITE_CONTACT_EMAIL || "info@rosicglobal.com").trim(),
  phone: (import.meta.env.VITE_CONTACT_PHONE || "+84962284872").trim(),
  zalo: (import.meta.env.VITE_CONTACT_ZALO || "").trim(),
};
