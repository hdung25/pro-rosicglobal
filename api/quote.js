/* global Buffer, process */
import { createHmac, randomUUID } from "node:crypto";

/**
 * Quote intake endpoint for Vercel's Node.js Serverless Runtime.
 *
 * This function deliberately does not persist leads. A configured Make
 * webhook and/or Resend account is the durable hand-off. The JSON response
 * therefore describes only what this invocation actually handed off; it
 * never treats a missing integration as a sent quote.
 */

const MAX_BODY_BYTES = 12 * 1024;
const DEFAULT_PRODUCT = "Đơn hàng tổng hợp theo mùa vụ";
const RATE_LIMIT_DEFAULT_MAX = 5;
const RATE_LIMIT_DEFAULT_WINDOW_SECONDS = 10 * 60;
const OUTBOUND_TIMEOUT_MS = 8_000;
const IDEMPOTENCY_TTL_MS = 10 * 60 * 1000;

// These Maps are an extra guard for a warm function instance only. They are
// not a distributed or durable rate limit / idempotency store.
const rateLimitEntries = new Map();
const idempotencyEntries = new Map();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const PHONE_PATTERN = /^\+?[\d\s().-]+$/u;
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\p{Zs}.'’-]*$/u;

function firstHeaderValue(value) {
  if (Array.isArray(value)) return value[0] || "";
  return typeof value === "string" ? value : "";
}

function clampInteger(value, fallback, minimum, maximum) {
  const parsed = Number.parseInt(String(value || ""), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, minimum), maximum);
}

function getRateLimitConfig() {
  return {
    max: clampInteger(
      process.env.QUOTE_RATE_LIMIT_MAX,
      RATE_LIMIT_DEFAULT_MAX,
      1,
      50,
    ),
    windowMs:
      clampInteger(
        process.env.QUOTE_RATE_LIMIT_WINDOW_SECONDS,
        RATE_LIMIT_DEFAULT_WINDOW_SECONDS,
        60,
        3_600,
      ) * 1000,
  };
}

function cleanupExpiredEntries(now) {
  for (const [key, entry] of rateLimitEntries) {
    if (entry.resetAt <= now) rateLimitEntries.delete(key);
  }
  for (const [key, entry] of idempotencyEntries) {
    if (entry.expiresAt <= now) idempotencyEntries.delete(key);
  }
}

function getClientIp(req) {
  const forwarded = firstHeaderValue(req.headers["x-forwarded-for"]);
  if (forwarded) return forwarded.split(",")[0].trim() || "unknown";
  return firstHeaderValue(req.headers["x-real-ip"]) || "unknown";
}

function consumeRateLimit(key) {
  const now = Date.now();
  cleanupExpiredEntries(now);
  const { max, windowMs } = getRateLimitConfig();
  const existing = rateLimitEntries.get(key);
  const entry =
    existing && existing.resetAt > now
      ? existing
      : { count: 0, resetAt: now + windowMs };

  if (entry.count >= max) {
    return {
      allowed: false,
      limit: max,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  rateLimitEntries.set(key, entry);
  return {
    allowed: true,
    limit: max,
    remaining: Math.max(0, max - entry.count),
    retryAfter: 0,
  };
}

function normalizedOrigin(value) {
  if (!value || value === "null") return "";
  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
}

function expectedOrigin(req) {
  const host = firstHeaderValue(req.headers["x-forwarded-host"]) || firstHeaderValue(req.headers.host);
  if (!host) return "";
  const protocol = (
    firstHeaderValue(req.headers["x-forwarded-proto"]) ||
    (req.socket?.encrypted ? "https" : "http")
  )
    .split(",")[0]
    .trim();
  return normalizedOrigin(`${protocol}://${host}`);
}

function isSameOriginRequest(req) {
  const rawOrigin = firstHeaderValue(req.headers.origin);
  const origin = normalizedOrigin(rawOrigin);
  // Non-browser clients such as the documented curl smoke test do not send an
  // Origin header. They remain allowed, while browser cross-origin requests do
  // not receive CORS permission.
  if (!rawOrigin) return true;
  if (!origin) return false;
  return origin === expectedOrigin(req);
}

function corsHeaders(req) {
  const origin = normalizedOrigin(firstHeaderValue(req.headers.origin));
  return origin && origin === expectedOrigin(req)
    ? {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Idempotency-Key",
        Vary: "Origin",
      }
    : {};
}

function sendJson(res, statusCode, payload, headers = {}) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value);
  }
  res.end(JSON.stringify(payload));
}

function errorPayload(code, message, requestId, details) {
  return {
    ok: false,
    status: code,
    requestId,
    message,
    ...(details ? { errors: details } : {}),
  };
}

async function parseJsonBody(req) {
  const contentLength = Number.parseInt(
    firstHeaderValue(req.headers["content-length"]),
    10,
  );
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    const error = new Error("body_too_large");
    error.code = "body_too_large";
    throw error;
  }

  let body = req.body;
  if (body === undefined) {
    body = await new Promise((resolve, reject) => {
      const chunks = [];
      let size = 0;
      req.on("data", (chunk) => {
        size += chunk.length;
        if (size > MAX_BODY_BYTES) {
          const error = new Error("body_too_large");
          error.code = "body_too_large";
          reject(error);
          req.destroy();
          return;
        }
        chunks.push(chunk);
      });
      req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      req.on("error", reject);
    });
  }

  if (Buffer.isBuffer(body)) body = body.toString("utf8");
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      const error = new Error("invalid_json");
      error.code = "invalid_json";
      throw error;
    }
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    const error = new Error("invalid_json");
    error.code = "invalid_json";
    throw error;
  }
  return body;
}

/**
 * Normalizes human-entered text without removing Vietnamese diacritics.
 * HTML is escaped at rendering time rather than destructively changing the
 * customer's message here.
 */
export function sanitizeQuoteText(value, { multiline = false } = {}) {
  if (typeof value !== "string") return "";
  const normalized = value
    .normalize("NFKC")
    .replace(/\r\n?/gu, "\n")
    .replace(/\p{Cc}/gu, (character) => (character === "\n" ? "\n" : ""))
    .replace(/\u200B/gu, "");

  if (multiline) {
    return normalized
      .replace(/[\t ]+/gu, " ")
      .replace(/ *\n */gu, "\n")
      .replace(/\n{3,}/gu, "\n\n")
      .trim();
  }
  return normalized.replace(/\s+/gu, " ").trim();
}

function normalizedPhone(value) {
  const compact = value.replace(/[\s().-]/gu, "");
  const digits = compact.replace(/\D/gu, "");
  // Vietnamese business cards commonly write +84 (0) xxx. Remove only that
  // explicitly written trunk marker when creating the Make-facing E.164 value.
  if (/^\+84\s*\(0\)/u.test(value)) return `+84${digits.slice(3)}`;
  if (compact.startsWith("+")) return `+${digits}`;
  if (compact.startsWith("00")) return `+${digits.slice(2)}`;
  return digits;
}

function validEmail(value) {
  return EMAIL_PATTERN.test(value) && value.length <= 200;
}

/**
 * Validates the fields currently collected by Contact.jsx. It accepts a
 * future `whatsappOptIn` boolean but does not send a WhatsApp message itself.
 */
export function validateQuotePayload(input) {
  const errors = {};
  const source = input && typeof input === "object" && !Array.isArray(input) ? input : {};

  const name = sanitizeQuoteText(source.name);
  if (!name) {
    errors.name = "Vui lòng nhập họ và tên của bạn.";
  } else if (Array.from(name).length > 100) {
    errors.name = "Họ và tên không được vượt quá 100 ký tự.";
  } else if (Array.from(name).length < 2 || !NAME_PATTERN.test(name)) {
    errors.name = "Họ và tên chỉ nên gồm chữ cái, khoảng trắng và dấu câu thông dụng.";
  }

  const rawPhone = sanitizeQuoteText(source.phone);
  const phoneDigits = rawPhone.replace(/\D/gu, "");
  if (!rawPhone) {
    errors.phone = "Vui lòng nhập số điện thoại hoặc WhatsApp.";
  } else if (
    rawPhone.length > 25 ||
    !PHONE_PATTERN.test(rawPhone) ||
    phoneDigits.length < 8 ||
    phoneDigits.length > 15
  ) {
    errors.phone = "Số điện thoại cần có 8–15 chữ số, có thể kèm mã quốc gia.";
  }

  const unsanitizedEmail = typeof source.email === "string" ? source.email.trim() : "";
  const email = unsanitizedEmail.toLowerCase();
  if (!email) {
    errors.email = "Vui lòng nhập email liên hệ.";
  } else if (/\s/u.test(email) || !validEmail(email)) {
    errors.email = "Vui lòng nhập đúng định dạng email.";
  }

  const product =
    sanitizeQuoteText(source.product ?? source.productName) || DEFAULT_PRODUCT;
  if (Array.from(product).length > 160) {
    errors.product = "Tên sản phẩm không được vượt quá 160 ký tự.";
  }

  const message = sanitizeQuoteText(source.message, { multiline: true });
  if (Array.from(message).length > 4_000) {
    errors.message = "Yêu cầu chi tiết không được vượt quá 4.000 ký tự.";
  }

  const optionalFields = [
    ["productGroup", "Nhóm sản phẩm", source.productGroup ?? source.category, 160],
    ["market", "Thị trường", source.market ?? source.destinationMarket, 160],
    ["quantity", "Sản lượng", source.quantity ?? source.volume, 160],
    ["timeline", "Thời gian", source.timeline ?? source.deliveryTimeline, 160],
  ];
  const optionalData = {};
  for (const [field, label, value, maxLength] of optionalFields) {
    const normalized = sanitizeQuoteText(value);
    if (Array.from(normalized).length > maxLength) {
      errors[field] = `${label} không được vượt quá ${maxLength} ký tự.`;
    }
    optionalData[field] = normalized;
  }

  // Accept `website` as a legacy alias while the new form uses `honeypot`.
  const honeypot = [source.honeypot, source.website]
    .map((value) => sanitizeQuoteText(value))
    .find(Boolean);
  if (honeypot) {
    errors.honeypot = "Trường này phải để trống.";
  }

  const rawStartedAt = sanitizeQuoteText(source.formStartedAt);
  let formStartedAt = null;
  if (rawStartedAt) {
    const parsedStartedAt = Date.parse(rawStartedAt);
    const now = Date.now();
    if (
      !Number.isFinite(parsedStartedAt) ||
      parsedStartedAt > now + 5 * 60 * 1000 ||
      parsedStartedAt < now - 48 * 60 * 60 * 1000
    ) {
      errors.formStartedAt = "Thời điểm bắt đầu biểu mẫu không hợp lệ.";
    } else {
      formStartedAt = new Date(parsedStartedAt).toISOString();
    }
  }

  const clientSubmissionId = sanitizeQuoteText(
    source.clientSubmissionId ?? source.submissionId,
  );
  if (clientSubmissionId && !validIdempotencyKey(clientSubmissionId)) {
    errors.clientSubmissionId = "Mã gửi biểu mẫu không hợp lệ.";
  }

  if (Object.keys(errors).length > 0) return { valid: false, errors };

  const normalized = normalizedPhone(rawPhone);
  return {
    valid: true,
    data: {
      name,
      phone: rawPhone,
      phoneE164: normalized.startsWith("+") ? normalized : null,
      email,
      product,
      message,
      ...optionalData,
      whatsappOptIn: source.whatsappOptIn === true,
      formStartedAt,
      clientSubmissionId: clientSubmissionId || null,
    },
  };
}

function validHttpsUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

function validMailbox(value) {
  if (!value) return "";
  const trimmed = value.trim();
  const displayMatch = trimmed.match(/<([^<>]+)>$/u);
  const address = (displayMatch ? displayMatch[1] : trimmed).trim().toLowerCase();
  return validEmail(address) ? trimmed : "";
}

function parseSalesRecipients(value) {
  return String(value || "")
    .split(/[;,]/u)
    .map((item) => item.trim().toLowerCase())
    .filter((item) => validEmail(item))
    .slice(0, 10);
}

function getConfiguredIntegrations() {
  const makeWebhookUrl = validHttpsUrl(process.env.MAKE_QUOTE_WEBHOOK_URL);
  const resendApiKey = String(process.env.RESEND_API_KEY || "").trim();
  const resendFromEmail = validMailbox(process.env.RESEND_FROM_EMAIL || "");
  const salesRecipients = parseSalesRecipients(process.env.SALES_NOTIFICATION_EMAIL);
  const replyToEmail = validMailbox(process.env.RESEND_REPLY_TO_EMAIL || "");
  const resendReady = Boolean(resendApiKey && resendFromEmail);

  return {
    makeWebhookUrl,
    makeWebhookSecret: String(process.env.MAKE_QUOTE_WEBHOOK_SECRET || ""),
    resendApiKey,
    resendFromEmail,
    resendReady,
    salesRecipients,
    replyToEmail,
    catalogProfileUrl: validHttpsUrl(process.env.CATALOG_PROFILE_URL),
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/gu, "&amp;")
    .replace(/</gu, "&lt;")
    .replace(/>/gu, "&gt;")
    .replace(/"/gu, "&quot;")
    .replace(/'/gu, "&#39;");
}

function quoteRows(quote) {
  const message = quote.message || "Vui lòng trao đổi thêm về quy cách và nhu cầu cung ứng.";
  const fields = [
    ["Họ và tên", quote.name],
    ["Số điện thoại / WhatsApp", quote.phone],
    ["Email liên hệ", quote.email],
    ["Sản phẩm quan tâm", quote.product],
    ...(quote.productGroup ? [["Nhóm sản phẩm", quote.productGroup]] : []),
    ...(quote.market ? [["Thị trường", quote.market]] : []),
    ...(quote.quantity ? [["Sản lượng dự kiến", quote.quantity]] : []),
    ...(quote.timeline ? [["Thời gian mong muốn", quote.timeline]] : []),
    ["Yêu cầu chi tiết", message],
  ];
  return fields
    .map(
      ([label, value]) =>
        `<tr><th style="padding:9px 12px;text-align:left;vertical-align:top;background:#f7f4ed;color:#283226;font-size:13px">${escapeHtml(label)}</th><td style="padding:9px 12px;color:#283226;font-size:14px;white-space:pre-line">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
}

function quoteText(quote) {
  return [
    `Họ và tên: ${quote.name}`,
    `Số điện thoại / WhatsApp: ${quote.phone}`,
    `Email liên hệ: ${quote.email}`,
    `Sản phẩm quan tâm: ${quote.product}`,
    ...(quote.productGroup ? [`Nhóm sản phẩm: ${quote.productGroup}`] : []),
    ...(quote.market ? [`Thị trường: ${quote.market}`] : []),
    ...(quote.quantity ? [`Sản lượng dự kiến: ${quote.quantity}`] : []),
    ...(quote.timeline ? [`Thời gian mong muốn: ${quote.timeline}`] : []),
    "",
    "Yêu cầu chi tiết:",
    quote.message || "Vui lòng trao đổi thêm về quy cách và nhu cầu cung ứng.",
  ].join("\n");
}

function profileCtaHtml(catalogProfileUrl) {
  if (!catalogProfileUrl) {
    return `<span style="display:inline-block;padding:12px 18px;border:1px solid #c8c3b5;border-radius:6px;color:#7c766a;background:#f5f3ee;font:600 14px Arial,sans-serif" aria-disabled="true">Download Our Catalog/Profile</span><p style="margin:10px 0 0;color:#6b695f;font:13px Arial,sans-serif">Catalog/Profile sẽ sớm được cập nhật.</p>`;
  }
  return `<a href="${escapeHtml(catalogProfileUrl)}" style="display:inline-block;padding:12px 18px;border-radius:6px;background:#b78c31;color:#fff;text-decoration:none;font:600 14px Arial,sans-serif">Download Our Catalog/Profile</a>`;
}

function customerEmail({ quote, catalogProfileUrl, requestId, replyTo, from }) {
  const text = [
    "Cảm ơn bạn đã gửi yêu cầu báo giá đến Hồng Tâm Rosic Global.",
    "Chúng tôi đã nhận được thông tin dưới đây và sẽ phản hồi theo nhu cầu của bạn.",
    "",
    quoteText(quote),
    "",
    catalogProfileUrl
      ? `Download Our Catalog/Profile: ${catalogProfileUrl}`
      : "Download Our Catalog/Profile: sẽ sớm được cập nhật.",
    "",
    `Mã yêu cầu: ${requestId}`,
  ].join("\n");

  return {
    from,
    to: [quote.email],
    ...(replyTo ? { reply_to: replyTo } : {}),
    subject: "Cảm ơn bạn đã gửi yêu cầu báo giá | Hồng Tâm Rosic Global",
    text,
    html: `<main style="max-width:640px;margin:0 auto;padding:24px;background:#fffdf7;color:#283226;font-family:Arial,sans-serif"><p style="margin:0 0 14px;font-size:21px;font-weight:700">Cảm ơn bạn đã liên hệ.</p><p style="line-height:1.6">Hồng Tâm Rosic Global đã nhận được yêu cầu báo giá của bạn. Nội dung bạn gửi:</p><table role="presentation" style="width:100%;border-collapse:collapse;border:1px solid #e5dfd0">${quoteRows(quote)}</table><p style="margin:24px 0 12px">${profileCtaHtml(catalogProfileUrl)}</p><p style="color:#777268;font-size:12px">Mã yêu cầu: ${escapeHtml(requestId)}</p></main>`,
  };
}

function salesEmail({ quote, catalogProfileUrl, requestId, from, recipients }) {
  const whatsappStatus = quote.whatsappOptIn
    ? "Khách đã đồng ý nhận cập nhật qua WhatsApp."
    : "Chưa có xác nhận đồng ý nhận cập nhật qua WhatsApp.";
  return {
    from,
    to: recipients,
    reply_to: quote.email,
    subject: `Yêu cầu báo giá mới — ${quote.product}`,
    text: [
      "Có yêu cầu báo giá mới từ website.",
      "",
      quoteText(quote),
      "",
      whatsappStatus,
      `Mã yêu cầu: ${requestId}`,
      catalogProfileUrl ? `Catalog/Profile: ${catalogProfileUrl}` : "Catalog/Profile: chưa gắn link.",
    ].join("\n"),
    html: `<main style="max-width:640px;margin:0 auto;padding:24px;background:#fffdf7;color:#283226;font-family:Arial,sans-serif"><p style="margin:0 0 14px;font-size:21px;font-weight:700">Yêu cầu báo giá mới</p><table role="presentation" style="width:100%;border-collapse:collapse;border:1px solid #e5dfd0">${quoteRows(quote)}</table><p style="margin:18px 0;color:#6b695f;font-size:13px">${escapeHtml(whatsappStatus)}</p><p style="color:#777268;font-size:12px">Mã yêu cầu: ${escapeHtml(requestId)}</p></main>`,
  };
}

async function postJson(url, body, headers = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OUTBOUND_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    return { accepted: response.ok, statusCode: response.status };
  } catch {
    return { accepted: false, statusCode: 0 };
  } finally {
    clearTimeout(timeout);
  }
}

async function forwardToMake({ quote, requestId, integrations }) {
  if (!integrations.makeWebhookUrl) return { status: "not_configured" };
  const payload = {
    event: "quote.submitted",
    requestId,
    submittedAt: new Date().toISOString(),
    source: { site: "rosicglobal.com", endpoint: "/api/quote" },
    quote,
  };
  const serialized = JSON.stringify(payload);
  const signature = integrations.makeWebhookSecret
    ? createHmac("sha256", integrations.makeWebhookSecret).update(serialized).digest("hex")
    : "";
  const result = await postJson(integrations.makeWebhookUrl, payload, {
    "X-Quote-Event": "quote.submitted",
    ...(signature ? { "X-Quote-Signature": `sha256=${signature}` } : {}),
  });
  if (!result.accepted) {
    console.error("[quote] Make hand-off failed", { requestId, statusCode: result.statusCode });
    return { status: "failed" };
  }
  // `sent` means this API sent the payload to Make and Make accepted it. It
  // cannot prove that a later WhatsApp/Zalo module delivered a message.
  return { status: "sent" };
}

async function sendWithResend({ type, quote, requestId, integrations }) {
  const configured =
    type === "customerEmail"
      ? integrations.resendReady
      : integrations.resendReady && integrations.salesRecipients.length > 0;
  if (!configured) return { status: "not_configured" };

  const replyTo = integrations.replyToEmail || integrations.salesRecipients[0] || "";
  const email =
    type === "customerEmail"
      ? customerEmail({
          quote,
          catalogProfileUrl: integrations.catalogProfileUrl,
          requestId,
          replyTo,
          from: integrations.resendFromEmail,
        })
      : salesEmail({
          quote,
          catalogProfileUrl: integrations.catalogProfileUrl,
          requestId,
          from: integrations.resendFromEmail,
          recipients: integrations.salesRecipients,
        });
  const result = await postJson("https://api.resend.com/emails", email, {
    Authorization: `Bearer ${integrations.resendApiKey}`,
  });
  if (!result.accepted) {
    console.error("[quote] Resend hand-off failed", { requestId, type, statusCode: result.statusCode });
    return { status: "failed" };
  }
  // Resend accepts transactional email for asynchronous processing. Final
  // delivery, bounce and complaint status must be read from Resend webhooks.
  return { status: "queued" };
}

function responseForDeliveries({ requestId, deliveries, catalogProfileUrl }) {
  const statuses = Object.values(deliveries).map((delivery) => delivery.status);
  const configuredCount = statuses.filter((status) => status !== "not_configured").length;
  const acceptedCount = statuses.filter((status) => status === "sent" || status === "queued").length;

  if (configuredCount === 0) {
    return {
      statusCode: 202,
      payload: {
        ok: false,
        status: "configuration_required",
        requestId,
        message:
          "Hệ thống chưa được cấu hình để chuyển yêu cầu. Yêu cầu này chưa được gửi đến Sales hoặc email khách hàng.",
        deliveries,
        catalogProfileUrl: catalogProfileUrl || null,
      },
    };
  }

  if (acceptedCount === configuredCount) {
    return {
      statusCode: 200,
      payload: {
        ok: true,
        status: "accepted",
        requestId,
        message:
          "Yêu cầu đã được chuyển tới các kênh đang hoạt động. Trạng thái giao nhận cuối cùng được theo dõi trong Make hoặc Resend.",
        deliveries,
        catalogProfileUrl: catalogProfileUrl || null,
      },
    };
  }

  if (acceptedCount > 0) {
    return {
      statusCode: 202,
      payload: {
        ok: false,
        status: "partially_accepted",
        requestId,
        message:
          "Yêu cầu mới được chuyển một phần. Kiểm tra trạng thái từng kênh trước khi xác nhận với khách.",
        deliveries,
        catalogProfileUrl: catalogProfileUrl || null,
      },
    };
  }

  return {
    statusCode: 502,
    payload: {
      ok: false,
      status: "delivery_failed",
      requestId,
      message:
        "Không thể chuyển yêu cầu tới các kênh đã cấu hình. Yêu cầu chưa được xác nhận gửi; vui lòng thử lại hoặc dùng kênh liên hệ dự phòng.",
      deliveries,
      catalogProfileUrl: catalogProfileUrl || null,
    },
  };
}

function validIdempotencyKey(value) {
  return /^[A-Za-z0-9._-]{8,128}$/u.test(value);
}

function cacheResponse(key, response) {
  if (!key) return;
  idempotencyEntries.set(key, {
    ...response,
    expiresAt: Date.now() + IDEMPOTENCY_TTL_MS,
  });
}

export default async function handler(req, res) {
  const requestId = randomUUID();
  if (!isSameOriginRequest(req)) {
    sendJson(
      res,
      403,
      errorPayload("origin_not_allowed", "Origin không được phép gọi endpoint này.", requestId),
    );
    return;
  }

  const headers = corsHeaders(req);
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
    res.setHeader("Cache-Control", "no-store");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(
      res,
      405,
      errorPayload("method_not_allowed", "Chỉ hỗ trợ phương thức POST.", requestId),
      { ...headers, Allow: "POST, OPTIONS" },
    );
    return;
  }

  const contentType = firstHeaderValue(req.headers["content-type"]).toLowerCase();
  if (!contentType.startsWith("application/json")) {
    sendJson(
      res,
      415,
      errorPayload("unsupported_media_type", "Endpoint chỉ nhận application/json.", requestId),
      headers,
    );
    return;
  }

  const rate = consumeRateLimit(getClientIp(req));
  const rateHeaders = {
    ...headers,
    "X-RateLimit-Limit": String(rate.limit),
    "X-RateLimit-Remaining": String(rate.remaining),
  };
  if (!rate.allowed) {
    sendJson(
      res,
      429,
      errorPayload("rate_limited", "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.", requestId),
      { ...rateHeaders, "Retry-After": String(rate.retryAfter) },
    );
    return;
  }

  let body;
  try {
    body = await parseJsonBody(req);
  } catch (error) {
    const tooLarge = error?.code === "body_too_large";
    sendJson(
      res,
      tooLarge ? 413 : 400,
      errorPayload(
        tooLarge ? "payload_too_large" : "invalid_json",
        tooLarge
          ? "Nội dung yêu cầu quá lớn."
          : "Nội dung gửi lên không đúng định dạng JSON.",
        requestId,
      ),
      rateHeaders,
    );
    return;
  }

  const validation = validateQuotePayload(body);
  if (!validation.valid) {
    sendJson(
      res,
      422,
      errorPayload(
        "validation_failed",
        "Vui lòng kiểm tra lại các trường được đánh dấu.",
        requestId,
        validation.errors,
      ),
      rateHeaders,
    );
    return;
  }

  const idempotencyHeader = firstHeaderValue(req.headers["idempotency-key"]);
  if (idempotencyHeader && !validIdempotencyKey(idempotencyHeader)) {
    sendJson(
      res,
      400,
      errorPayload(
        "invalid_idempotency_key",
        "Idempotency-Key chỉ gồm chữ, số, dấu chấm, gạch dưới hoặc gạch ngang.",
        requestId,
      ),
      rateHeaders,
    );
    return;
  }

  const idempotencyKey = idempotencyHeader || validation.data.clientSubmissionId || "";
  const scopedIdempotencyKey = idempotencyKey ? `${getClientIp(req)}:${idempotencyKey}` : "";
  const cached = scopedIdempotencyKey ? idempotencyEntries.get(scopedIdempotencyKey) : null;
  if (cached && cached.expiresAt > Date.now()) {
    sendJson(res, cached.statusCode, cached.payload, {
      ...rateHeaders,
      "Idempotency-Replayed": "true",
    });
    return;
  }

  const integrations = getConfiguredIntegrations();
  const [make, customerEmail, salesEmail] = await Promise.all([
    forwardToMake({ quote: validation.data, requestId, integrations }),
    sendWithResend({ type: "customerEmail", quote: validation.data, requestId, integrations }),
    sendWithResend({ type: "salesEmail", quote: validation.data, requestId, integrations }),
  ]);
  const response = responseForDeliveries({
    requestId,
    deliveries: { make, customerEmail, salesEmail },
    catalogProfileUrl: integrations.catalogProfileUrl,
  });
  cacheResponse(scopedIdempotencyKey, response);
  sendJson(res, response.statusCode, response.payload, rateHeaders);
}
