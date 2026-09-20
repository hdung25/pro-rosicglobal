/* global Buffer, process */
import {
  createHmac,
  pbkdf2Sync,
  timingSafeEqual,
} from "node:crypto";

const ADMIN_USERNAME = "adminrosic";
const PASSWORD_RECORD = "5da764c01e5e1f294752b217958d0688:73c1aeac0cb64f41a89784e1e57bcd06e5a0c82a2eb719520b6d299aee837247";
const FALLBACK_SESSION_SECRET = "2d752089227bcf2d4068ae001466307bb75d69e7fe0c446ea1343d6106ab70f4";
const COOKIE_NAME = "rosic_admin_session";
const SESSION_SECONDS = 8 * 60 * 60;
const attempts = new Map();

function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && timingSafeEqual(a, b);
}

export function verifyAdminCredentials(username, password) {
  const configuredUsername = String(process.env.ADMIN_USERNAME || ADMIN_USERNAME);
  const [salt, expected] = String(process.env.ADMIN_PASSWORD_HASH || PASSWORD_RECORD).split(":");
  if (!salt || !expected || !safeEqual(username, configuredUsername)) return false;
  const actual = pbkdf2Sync(String(password || ""), salt, 210_000, 32, "sha256").toString("hex");
  return safeEqual(actual, expected);
}

function sessionSecret() {
  return String(process.env.ADMIN_SESSION_SECRET || FALLBACK_SESSION_SECRET);
}

function signature(payload) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function createSessionToken(now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ user: ADMIN_USERNAME, exp: now + SESSION_SECONDS * 1000 })).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function verifySessionToken(token, now = Date.now()) {
  if (!token || typeof token !== "string") return false;
  const [payload, receivedSignature] = token.split(".");
  if (!payload || !receivedSignature || !safeEqual(signature(payload), receivedSignature)) return false;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return session.user === ADMIN_USERNAME && Number(session.exp) > now;
  } catch {
    return false;
  }
}

function cookieValue(req) {
  const cookies = String(req.headers.cookie || "").split(";");
  for (const cookie of cookies) {
    const [name, ...value] = cookie.trim().split("=");
    if (name === COOKIE_NAME) return decodeURIComponent(value.join("="));
  }
  return "";
}

function expectedOrigin(req) {
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim();
  const protocol = String(req.headers["x-forwarded-proto"] || (req.socket?.encrypted ? "https" : "http")).split(",")[0].trim();
  return host ? `${protocol}://${host}` : "";
}

function sameOrigin(req) {
  const origin = String(req.headers.origin || "");
  return !origin || origin === expectedOrigin(req);
}

function clientIp(req) {
  return String(req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || "unknown").split(",")[0].trim();
}

function consumeAttempt(ip) {
  const now = Date.now();
  const existing = attempts.get(ip);
  const entry = existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + 15 * 60 * 1000 };
  if (entry.count >= 8) return false;
  entry.count += 1;
  attempts.set(ip, entry);
  return true;
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "object") return req.body;
  try { return JSON.parse(req.body); } catch { return {}; }
}

function send(res, status, payload, headers = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  res.end(JSON.stringify(payload));
}

function sessionCookie(token, req) {
  const secure = String(req.headers["x-forwarded-proto"] || "").includes("https") || process.env.VERCEL;
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_SECONDS}${secure ? "; Secure" : ""}`;
}

export default async function handler(req, res) {
  if (!sameOrigin(req)) return send(res, 403, { ok: false, message: "Yêu cầu không cùng nguồn." });

  if (req.method === "GET") {
    return send(res, 200, { ok: true, authenticated: verifySessionToken(cookieValue(req)) });
  }
  if (req.method !== "POST") return send(res, 405, { ok: false, message: "Method not allowed." }, { Allow: "GET, POST" });

  const body = parseBody(req);
  if (body.action === "logout") {
    return send(res, 200, { ok: true, authenticated: false }, {
      "Set-Cookie": `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`,
    });
  }
  if (!consumeAttempt(clientIp(req))) return send(res, 429, { ok: false, message: "Quá nhiều lần đăng nhập. Vui lòng thử lại sau." });

  if (!verifyAdminCredentials(String(body.username || ""), String(body.password || ""))) {
    return send(res, 401, { ok: false, message: "Tên đăng nhập hoặc mật khẩu không đúng." });
  }

  const token = createSessionToken();
  return send(res, 200, { ok: true, authenticated: true, user: ADMIN_USERNAME }, {
    "Set-Cookie": sessionCookie(token, req),
  });
}
