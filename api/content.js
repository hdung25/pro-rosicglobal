import { get, put } from "@vercel/blob";
import { cookieValue, sameOrigin, verifySessionToken } from "./admin-auth.js";
import { validateCatalog } from "../lib/catalog-validation.js";

const PATH = "cms/published.json";
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (!["GET", "PUT"].includes(req.method)) return res.status(405).json({ ok: false });
  try {
    if (req.method === "GET") {
      const blob = await get(PATH, { access: "private", useCache: false });
      const data = blob ? JSON.parse(await new Response(blob.stream).text()) : null;
      const isAdmin = verifySessionToken(cookieValue(req));
      const visible = data && !isAdmin ? { ...data, products: data.products.filter(product => product.status === "published"), media: [] } : data;
      return res.status(200).json({ ok: true, data: visible });
    }
    if (!sameOrigin(req) || !verifySessionToken(cookieValue(req))) return res.status(401).json({ ok: false, message: "Vui lòng đăng nhập lại." });
    const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!data || !Array.isArray(data.products) || !Array.isArray(data.categories) || !data.content || !data.settings || !Array.isArray(data.media)) return res.status(400).json({ ok: false, message: "Dữ liệu nội dung không hợp lệ." });
    const catalogError = validateCatalog(data.products);
    if (catalogError) return res.status(422).json({ ok: false, message: catalogError });
    const payload = { ...data, publishedAt: new Date().toISOString() };
    const body = JSON.stringify(payload);
    if (new TextEncoder().encode(body).length > 4_000_000) return res.status(413).json({ ok: false, message: "Nội dung vượt 4 MB. Hãy giảm ảnh trong thư viện trước khi xuất bản." });
    await put(PATH, body, { access: "private", allowOverwrite: true, addRandomSuffix: false, contentType: "application/json" });
    return res.status(200).json({ ok: true, publishedAt: payload.publishedAt });
  } catch {
    return res.status(503).json({ ok: false, message: "Chưa thể lưu nội dung lên máy chủ. Bản nháp vẫn được giữ; vui lòng thử lại." });
  }
}
