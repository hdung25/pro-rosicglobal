# Hồng Tâm Rosic Global

Vite + React landing page, redesigned around the supplied HTP brand mark, a light ivory/gold palette, and local agricultural imagery. Existing section anchors are preserved.

## Development

- `npm install`
- `npm run dev`
- `npm run lint`
- `npm run build`
- `npx playwright test`

## Business contacts

Set `VITE_CONTACT_EMAIL`, `VITE_CONTACT_PHONE`, and `VITE_CONTACT_ZALO` to verified business channels before building. These are public client-side values, not secrets. See `.env.example`.

The public form posts to `POST /api/quote`, which validates data on the server
and reports each Make/Resend hand-off accurately. When no delivery channel is
configured, the form explicitly says that the request was not sent and offers
copy/download, email and WhatsApp fallbacks. Configure server-only variables
in `.env.example`; see
[`docs/quote-automation.md`](docs/quote-automation.md) for the request
contract, Make scenario and Resend setup.

## Publishing

The existing `.vercel` link targets `pro-rosicglobal`. Deploy with `vercel deploy --prod --yes` after build and browser checks. Production URL: https://rosicglobal.com/. The canonical URL, crawler policy and sitemap are maintained in `index.html`, `public/robots.txt` and `public/sitemap.xml`.

## Content and design

- `src/data.js`: product catalogue, journey and complete editorial articles.
- `src/components/Contact.jsx`: multilingual B2B quote intake and truthful delivery-status UI.
- `api/quote.js`: Vercel quote intake function, Make forwarding and Resend hand-off.
- `docs/quote-automation.md`: delivery contract, integration configuration and tests.
- `src/contact-config.js`: public contact configuration.
- `docs/assets.md`: image provenance, prompts and limitations.
- `docs/implementation-log.md`: request-by-request change and verification log.
- `docs/redesign.md`: original audit and release checks.

Motion and Radix Dialog supply animation and accessible modal behavior; Lucide supplies icons. Fonts are served locally with Fontsource. Generated/stock images illustrate subjects rather than prove company ownership of facilities or a particular product batch. Unsupported certification, statistics, testimonials and business contact placeholders from the previous implementation were removed.
