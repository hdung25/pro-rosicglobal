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

Without a verified email, the form creates a reviewable local request with download/copy. With one, the review also offers a mailto link. The visitor completes sending in their own email application. There is no backend submission or false sent confirmation.

## Publishing

The existing `.vercel` link targets `pro-rosicglobal`. Deploy with `vercel deploy --prod --yes` after build and browser checks. Production URL: https://rosicglobal.com/. The canonical URL, crawler policy and sitemap are maintained in `index.html`, `public/robots.txt` and `public/sitemap.xml`.

## Content and design

- `src/data.js`: product catalogue, journey and complete editorial articles.
- `src/components/Contact.jsx`: validated local quote draft flow.
- `src/contact-config.js`: public contact configuration.
- `docs/assets.md`: image provenance, prompts and limitations.
- `docs/redesign.md`: original audit and release checks.

Motion and Radix Dialog supply animation and accessible modal behavior; Lucide supplies icons. Fonts are served locally with Fontsource. Generated/stock images illustrate subjects rather than prove company ownership of facilities or a particular product batch. Unsupported certification, statistics, testimonials and business contact placeholders from the previous implementation were removed.
