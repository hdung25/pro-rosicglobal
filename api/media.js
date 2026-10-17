import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import { get, put } from "@vercel/blob";
import { cookieValue, sameOrigin, verifySessionToken } from "./admin-auth.js";
import { imageFilename, prepareImage } from "../lib/product-image.js";

export default async function handler(req, res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  try {
    if (req.method === "GET") {
      const { id, filename } = req.query;
      if (!/^[a-f0-9-]{36}$/.test(id || "") || !/^[a-z0-9-]+-hong-tam-rosic\.webp$/.test(filename || "")) return res.status(404).end();
      const blob = await get(`media/${id}/${filename}`, { access: "private" });
      if (!blob) return res.status(404).end();
      res.setHeader("Content-Type", "image/webp");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return res.status(200).send(Buffer.from(await new Response(blob.stream).arrayBuffer()));
    }
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "POST") return res.status(405).end();
    if (!sameOrigin(req) || !verifySessionToken(cookieValue(req))) return res.status(401).json({ message: "Vui lòng đăng nhập lại." });
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!body || !/^data:image\/(webp|jpeg|png);base64,/.test(body.src || "") || body.src.length > 4_000_000) return res.status(400).json({ message: "Ảnh tải lên không hợp lệ." });
    const { output, ...metadata } = await prepareImage(Buffer.from(body.src.split(",")[1], "base64"), body.preset);
    const filename = imageFilename(body.name);
    const id = randomUUID();
    await put(`media/${id}/${filename}`, output, { access: "private", contentType: "image/webp", addRandomSuffix: false });
    return res.status(201).json({ ...metadata, id, name: filename, src: `/media/${id}/${filename}`, preset: body.preset });
  } catch {
    return res.status(422).json({ message: "Không thể xử lý hoặc lưu ảnh. Vui lòng dùng ảnh JPG, PNG, WebP khác và thử lại." });
  }
}
