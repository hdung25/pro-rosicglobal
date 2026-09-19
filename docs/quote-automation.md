# Quote form delivery and automation

## What this endpoint does

`POST /api/quote` is a Vercel Node.js Function that validates the public quote
form, keeps Vietnamese diacritics intact, strips control characters, and
passes the normalized submission to the integrations that are actually
configured.

It does **not** store leads itself. The durable record must be Make, Resend,
or a CRM connected from Make. This is intentional: the browser must never be
told that a quote was sent when no receiving system is configured.

`Contact.jsx` is connected to this endpoint with a same-origin JSON request,
an idempotency key and explicit customer-facing delivery states. When the
endpoint has no configured channel, the UI remains honest: it says the request
was not sent and exposes copy/download, email and WhatsApp fallbacks.

## Request contract for the frontend

Send same-origin JSON to `/api/quote`:

```json
{
  "name": "Nguyễn Thị Ánh",
  "phone": "+84962284872",
  "email": "anh@example.com",
  "product": "Hạt điều nhân WW320",
  "productGroup": "Điều xuất khẩu",
  "market": "Đức",
  "quantity": "1 x 20ft FCL",
  "timeline": "Tháng 10/2026",
  "message": "Cần báo giá 1 container, đóng gói 25 kg.",
  "whatsappOptIn": false,
  "honeypot": "",
  "formStartedAt": "2026-09-19T03:30:00.000Z",
  "clientSubmissionId": "quote-client-20260919-01"
}
```

`honeypot` is a hidden field and must remain empty. `website` is accepted as a
legacy alias. `productGroup` / `category`, `market` / `destinationMarket`,
`quantity` / `volume`, `timeline` / `deliveryTimeline`, and
`clientSubmissionId` / `submissionId` are accepted aliases to keep a future
form migration stable. The frontend sends the same fresh `clientSubmissionId`
as the `Idempotency-Key` request header to reduce accidental duplicate sends on
a warm function instance.

Required validation:

| Field | Rule |
| --- | --- |
| `name` | Required, 2–100 visible characters; Vietnamese letters and common name punctuation are accepted. |
| `phone` | Required; 8–15 digits, with optional `+`, spaces, parentheses, dots or dashes. `phoneE164` is included for Make only when the customer entered an international `+` or `00` prefix. |
| `email` | Required, up to 200 characters, valid mail shape. |
| `product` | Optional, up to 160 characters; defaults to `Đơn hàng tổng hợp theo mùa vụ`. |
| `productGroup`, `market`, `quantity`, `timeline` | Optional qualification fields, each up to 160 characters. |
| `message` | Optional, up to 4,000 characters. |
| `whatsappOptIn` | Optional boolean. Do not set it to `true` unless the form displays a clear consent checkbox. |
| `formStartedAt` | Optional ISO timestamp. It must be within the last 48 hours and no more than 5 minutes in the future. |
| `clientSubmissionId` | Optional 8–128 character client request key. The API uses it as a best-effort idempotency key when the header is absent. |

The endpoint requires `Content-Type: application/json`, accepts same-origin
requests only, returns `Cache-Control: no-store`, and never exposes secret
values. It applies a best-effort per-instance rate limit (default 5 requests
per IP per 10 minutes). Vercel functions can run on multiple instances, so
use Vercel WAF or a shared rate-limit store when a hard, distributed limit is
needed.

### Response states that the UI must respect

| HTTP / `status` | Meaning | Customer-facing UI |
| --- | --- | --- |
| `200` / `accepted` | Every configured channel accepted the hand-off. Make and Resend final delivery still happens asynchronously. | Show a thank-you state, with the request ID. |
| `202` / `partially_accepted` | At least one configured channel accepted it; another failed. | Do not say all notifications were sent. Show a neutral partial status and request ID. |
| `202` / `configuration_required` | No Make or Resend delivery channel is configured. The lead was **not** sent or stored by this API. | Keep the existing copy/download/mailto fallback and state that submission is not yet available. |
| `502` / `delivery_failed` | All configured hand-offs failed. | State that the request was not confirmed as sent; offer retry and fallback contact methods. |
| `422` / `validation_failed` | One or more form fields are invalid. | Attach returned `errors` to the matching fields. |
| `429` / `rate_limited` | The in-memory rate limit was reached. | Respect `Retry-After`; do not auto-retry. |

Every response includes the stable contract
`{ ok, requestId, deliveries: { make, customerEmail, salesEmail },
catalogProfileUrl, message }`. A delivery is one of `not_configured`,
`failed`, `sent`, or `queued`. `sent` means Make accepted the webhook; `queued`
means Resend accepted an email for asynchronous delivery. Neither one proves a
final WhatsApp, Zalo, or inbox delivery in the synchronous browser response.

## Environment variables

Set server-only values in **Vercel → Project → Settings → Environment
Variables → Production**. Do not use a `VITE_` prefix for any secret.

| Variable | Required for | Notes |
| --- | --- | --- |
| `MAKE_QUOTE_WEBHOOK_URL` | Make forwarding | A full HTTPS Custom Webhook URL. |
| `MAKE_QUOTE_WEBHOOK_SECRET` | Optional Make integrity header | Generates `X-Quote-Signature: sha256=…`; only set it if the receiving scenario/proxy verifies it. |
| `RESEND_API_KEY` | Both transactional emails | Server-side Resend API key. |
| `RESEND_FROM_EMAIL` | Both transactional emails | A sender on a verified Resend domain, for example `Hồng Tâm Rosic Global <hello@rosicglobal.com>`. |
| `SALES_NOTIFICATION_EMAIL` | Internal sales email | One or more email addresses separated by commas or semicolons. |
| `RESEND_REPLY_TO_EMAIL` | Optional customer acknowledgement reply route | Falls back to the first sales email when omitted. |
| `CATALOG_PROFILE_URL` | Catalog/Profile button | Optional public HTTPS PDF or landing-page URL. Empty values render a disabled placeholder instead of an empty link. |
| `QUOTE_RATE_LIMIT_MAX` | Optional rate-limit tuning | Default `5`; allowed range 1–50. |
| `QUOTE_RATE_LIMIT_WINDOW_SECONDS` | Optional rate-limit tuning | Default `600`; allowed range 60–3,600. |

## Resend configuration

1. Add and verify the sending domain in Resend. Complete SPF and DKIM before
   using it in `RESEND_FROM_EMAIL`.
2. Create a production API key with the narrowest practical permission and add
   it only to Vercel Production environment variables.
3. Add a Resend webhook for `email.delivered`, `email.bounced`, and
   `email.complained` if the business needs delivery reporting. The API response
   only confirms that Resend accepted the message.
4. The customer acknowledgement contains the submitted name, phone, email,
   product, and message. It includes a real **Download Our Catalog/Profile**
   button only after `CATALOG_PROFILE_URL` contains a public HTTPS link. Before
   that, it displays a disabled placeholder, avoiding a broken empty URL.

## Make scenario: recommended implementation

Use Make as the durable intake and orchestration point, not as a claim that a
WhatsApp or Zalo message has already arrived.

1. Create **Webhooks → Custom webhook** in Make and place its HTTPS URL in
   `MAKE_QUOTE_WEBHOOK_URL`.
2. Receive this payload: `event`, `requestId`, `submittedAt`, `source`, and
   `quote` (`name`, `phone`, `phoneE164`, `email`, `product`, `productGroup`,
   `market`, `quantity`, `timeline`, `message`, `whatsappOptIn`,
   `formStartedAt`, `clientSubmissionId`). Filter on `event = quote.submitted`.
3. Immediately de-duplicate `requestId` in a Make Data Store or CRM table.
   Store `requestId` before any fan-out route. This protects against retries
   across serverless instances; the API’s in-memory idempotency cache is only a
   convenience, not a durable guarantee.
4. Use a Router with separate monitored routes:
   - **Sales email / CRM:** Create the sales lead and notify the assigned owner.
   - **Internal WhatsApp:** Send to designated individual Sales numbers using
     an approved WhatsApp Business Platform / Meta Cloud API template, or route
     the notification into an approved shared inbox. Include request ID, name,
     product, phone, email and message.
   - **Internal Zalo:** Use a verified Zalo Official Account/API or the
     organization’s approved connector. Map the same fields and keep the
     request ID in the message/card.
   - **Customer WhatsApp acknowledgement:** run only when `phoneE164` exists,
     `whatsappOptIn` is `true`, and the business has an approved customer
     template and lawful consent record.
5. Attach Make error handlers to alert Sales by email/CRM and write failures
   against the same `requestId`. Do not retry after an unknown downstream
   send without a dedupe check.
6. Return a fast 2xx response from the webhook path. The website times out
   outbound calls after 8 seconds and reports a failed Make hand-off honestly.

### WhatsApp and Zalo constraints

- A normal WhatsApp account or WhatsApp group cannot be automated reliably by
  this website. Meta’s WhatsApp Business Platform generally sends to individual
  opted-in recipients and requires approved templates outside the customer
  service window; it does not provide a general “post into any group” API.
  Use named individual Sales recipients or an approved shared inbox unless the
  organization has a separately approved group-capable solution.
- The system cannot discover whether an entered phone number has WhatsApp.
  A customer message must use a valid E.164 number, explicit opt-in, an
  approved business sender and template, plus delivery-status webhooks.
- Zalo group and OA messaging permissions depend on the account/API product.
  Do not connect a personal Zalo account or assume a bot can post to a group.
  Confirm the client’s verified Zalo OA / approved API scope first. Make can
  then call the supported connector or HTTP API.

## Security and privacy checklist

- Keep Make and Resend credentials only in Vercel environment variables.
- Do not log raw lead data in Vercel logs. The function logs only request ID,
  channel name, and provider status code on hand-off failures.
- Display a privacy notice and an explicit WhatsApp consent checkbox before
  adding `whatsappOptIn` to the public form.
- Establish retention, access and deletion rules in the CRM/Make destination;
  the API itself does not retain leads.
- Configure Vercel WAF and a distributed rate limit before a high-traffic
  launch.

## Local validation and curl smoke test

Run the validation tests without sending an email or a webhook:

```powershell
npm run test:quote-api
```

After `vercel dev` is running and test credentials are configured, send a
single smoke request:

```powershell
$body = @{
  name = 'Nguyễn Thị Ánh'
  phone = '+84962284872'
  email = 'anh@example.com'
  product = 'Hạt điều nhân WW320'
  productGroup = 'Điều xuất khẩu'
  market = 'Đức'
  quantity = '1 x 20ft FCL'
  timeline = 'Tháng 10/2026'
  message = 'Cần báo giá thử nghiệm; không dùng cho đơn hàng thật.'
  honeypot = ''
  whatsappOptIn = $false
  formStartedAt = (Get-Date).ToUniversalTime().ToString('o')
  clientSubmissionId = 'quote-smoke-20260919-01'
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri 'http://localhost:3000/api/quote' `
  -ContentType 'application/json' `
  -Headers @{ 'Idempotency-Key' = 'quote-smoke-20260919-01' } `
  -Body $body
```

Verify the returned `deliveries` object before checking Make/Resend dashboards.
Do not use a real customer address for the first smoke test.
