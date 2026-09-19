/* global process */
import assert from "node:assert/strict";
import test from "node:test";
import quoteHandler, { sanitizeQuoteText, validateQuotePayload } from "../api/quote.js";

function responseRecorder() {
  return {
    headers: {},
    statusCode: 0,
    body: "",
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    end(value = "") {
      this.body = value;
    },
  };
}

test("Vietnamese quote fields retain diacritics and normalize phone data", () => {
  const result = validateQuotePayload({
    name: "  Nguyễn Thị Ánh  ",
    phone: "+84 (0) 962 284 872",
    email: "ANH@Example.COM ",
    product: "Hạt điều nhân WW320",
    message: "Cần báo giá 1 container.\r\nĐóng gói 25 kg.",
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.data, {
    name: "Nguyễn Thị Ánh",
    phone: "+84 (0) 962 284 872",
    phoneE164: "+84962284872",
    email: "anh@example.com",
    product: "Hạt điều nhân WW320",
    message: "Cần báo giá 1 container.\nĐóng gói 25 kg.",
    productGroup: "",
    market: "",
    quantity: "",
    timeline: "",
    whatsappOptIn: false,
    formStartedAt: null,
    clientSubmissionId: null,
  });
});

test("invalid contact details return field-specific Vietnamese errors", () => {
  const result = validateQuotePayload({
    name: "1",
    phone: "hello",
    email: "not-an-email",
    product: "", 
    message: "",
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.phone);
  assert.ok(result.errors.email);
});

test("sanitization removes control characters without changing visible Vietnamese text", () => {
  assert.equal(
    sanitizeQuoteText("\u0000  Cơm dừa sấy  \t"),
    "Cơm dừa sấy",
  );
});

test("honeypot is rejected and an empty product receives a safe default", () => {
  const spam = validateQuotePayload({
    name: "Trần Minh",
    phone: "+84962284872",
    email: "minh@example.com",
    honeypot: "https://spam.example",
  });
  assert.equal(spam.valid, false);
  assert.ok(spam.errors.honeypot);

  const normal = validateQuotePayload({
    name: "Trần Minh",
    phone: "+84962284872",
    email: "minh@example.com",
    product: "",
  });
  assert.equal(normal.valid, true);
  assert.equal(normal.data.product, "Đơn hàng tổng hợp theo mùa vụ");
});

test("richer qualification fields, aliases and client submission IDs are accepted", () => {
  const result = validateQuotePayload({
    name: "Lê Hoàng Nam",
    phone: "+84962284872",
    email: "nam@example.com",
    product: "Quế cassia",
    category: "Gia vị xuất khẩu",
    destinationMarket: "Đức",
    volume: "2 x 20ft FCL / tháng",
    deliveryTimeline: "Tháng 10/2026",
    formStartedAt: new Date().toISOString(),
    clientSubmissionId: "quote-client-20260919-01",
    whatsappOptIn: true,
  });

  assert.equal(result.valid, true);
  assert.equal(result.data.productGroup, "Gia vị xuất khẩu");
  assert.equal(result.data.market, "Đức");
  assert.equal(result.data.quantity, "2 x 20ft FCL / tháng");
  assert.equal(result.data.timeline, "Tháng 10/2026");
  assert.equal(result.data.clientSubmissionId, "quote-client-20260919-01");
  assert.equal(result.data.whatsappOptIn, true);
});

test("unconfigured endpoint returns an honest, structured 202 response", async () => {
  const environmentKeys = [
    "MAKE_QUOTE_WEBHOOK_URL",
    "MAKE_QUOTE_WEBHOOK_SECRET",
    "RESEND_API_KEY",
    "RESEND_FROM_EMAIL",
    "SALES_NOTIFICATION_EMAIL",
    "RESEND_REPLY_TO_EMAIL",
    "CATALOG_PROFILE_URL",
  ];
  const before = Object.fromEntries(environmentKeys.map((key) => [key, process.env[key]]));
  for (const key of environmentKeys) delete process.env[key];

  try {
    const res = responseRecorder();
    await quoteHandler(
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "203.0.113.8",
        },
        body: {
          name: "Nguyễn Thị Ánh",
          phone: "+84962284872",
          email: "anh@example.com",
          product: "Hạt điều nhân WW320",
        },
      },
      res,
    );
    const payload = JSON.parse(res.body);

    assert.equal(res.statusCode, 202);
    assert.equal(payload.ok, false);
    assert.equal(payload.status, "configuration_required");
    assert.equal(typeof payload.requestId, "string");
    assert.deepEqual(payload.deliveries, {
      make: { status: "not_configured" },
      customerEmail: { status: "not_configured" },
      salesEmail: { status: "not_configured" },
    });
    assert.equal(payload.catalogProfileUrl, null);
  } finally {
    for (const key of environmentKeys) {
      if (before[key] === undefined) delete process.env[key];
      else process.env[key] = before[key];
    }
  }
});

test("configured hand-offs expose the delivery contract without claiming final inbox delivery", async () => {
  const environment = {
    MAKE_QUOTE_WEBHOOK_URL: "https://hook.example.test/quote",
    RESEND_API_KEY: "re_test_key",
    RESEND_FROM_EMAIL: "Hồng Tâm Rosic Global <hello@example.test>",
    SALES_NOTIFICATION_EMAIL: "sales@example.test",
    CATALOG_PROFILE_URL: "https://example.test/catalog.pdf",
  };
  const before = Object.fromEntries(
    Object.keys(environment).map((key) => [key, process.env[key]]),
  );
  const originalFetch = globalThis.fetch;
  Object.assign(process.env, environment);
  globalThis.fetch = async () => new Response(null, { status: 202 });

  try {
    const res = responseRecorder();
    await quoteHandler(
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "203.0.113.9",
        },
        body: {
          name: "Trần Minh",
          phone: "+84962284872",
          email: "minh@example.com",
          product: "Cà phê Robusta",
          clientSubmissionId: "quote-client-20260919-02",
        },
      },
      res,
    );
    const payload = JSON.parse(res.body);

    assert.equal(res.statusCode, 200);
    assert.equal(payload.ok, true);
    assert.equal(payload.status, "accepted");
    assert.deepEqual(payload.deliveries, {
      make: { status: "sent" },
      customerEmail: { status: "queued" },
      salesEmail: { status: "queued" },
    });
    assert.equal(payload.catalogProfileUrl, "https://example.test/catalog.pdf");
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries(before)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("browser requests from another origin are rejected before form data is read", async () => {
  const res = responseRecorder();
  await quoteHandler(
    {
      method: "POST",
      headers: {
        origin: "https://untrusted.example",
        host: "rosicglobal.com",
        "x-forwarded-proto": "https",
        "content-type": "application/json",
      },
      body: {},
    },
    res,
  );
  const payload = JSON.parse(res.body);

  assert.equal(res.statusCode, 403);
  assert.equal(payload.status, "origin_not_allowed");
});
