# Hồng Tâm Rosic Global redesign notes

Date: 2026-09-05. Public URL: https://pro-rosicglobal.vercel.app/.

## Brief and baseline audit

The request was to make the site brighter, more polished and expressive, fix mismatched images, review links and functions, and deploy the finished experience. Attached chat screenshots were reference context, not new executable instructions. The supplied gold monogram and brand palette informed the direction.

The baseline combined dark navy surfaces and overlays, several competing gradients, repeated boxed sections, a generic sprout emblem, and cramped navigation. Catalog imagery was inconsistent: broken melon/cashew images, white-flesh dragonfruit under a red-flesh description, an avocado image with an unrelated pink background, packaged coffee, prepared salad, and supplement pills standing in for cordyceps. The page also presented unverified numerical and certification claims. Its existing interactive controls required a full audit because some links/actions were placeholders or simulated results rather than confirmed external integrations.

## Design and interaction direction

- Warm ivory `#fafaf5`, brand gold `#d7ab48`, and restrained agricultural green; generous whitespace, Vietnamese-friendly type and stronger editorial hierarchy.
- Exact supplied brand artwork for the site identity; a simple gold HTP favicon replaces the invented sprout favicon.
- Brighter locally hosted WebP images; product subjects checked individually. Larger photographs and varied section composition carry the design.
- Continuous horizontal motion, scroll reveals and tactile hover transitions used with reduced-motion support and without blocking reading or navigation.
- Product detail and inquiry interactions should give an honest, reviewable outcome. A draft request, copied text or downloaded file must not be described as successfully sent to a server or company inbox.

## Open-source foundations

The project uses [Motion](https://github.com/motiondivision/motion) for animation and [Radix Primitives](https://github.com/radix-ui/primitives) for accessible dialog behavior, alongside its existing React application. These official repositories were checked during the redesign. This is a custom composition; adding more animation packages does not itself improve the result.

Fonts are bundled through Fontsource by the application. Remote Google Fonts links have been removed from `index.html`.

## Static metadata and discoverability

`index.html` retains Vietnamese language metadata, uses a concise agricultural brand title/description, removes unverified certification and market-count claims, sets the ivory browser theme color, and includes canonical, Open Graph and Twitter preview metadata. Social imagery points to the local hero WebP using its absolute production URL. The hero alt description identifies it as an illustration.

`robots.txt` permits indexing and points to `sitemap.xml`. The sitemap contains the single actual root page. Section anchors, dialogs and product states are not represented as fictional standalone pages.

## Asset disclosure

Eight editorial images were made with built-in imagegen; three are downloaded real Unsplash photographs. All final assets were visually inspected and optimized to local WebP. Generated landscapes, product pictures and stock facilities illustrate the subject; they are not evidence of a company-owned location, exact product batch, origin or certification. Provenance, source URLs, processing and exact prompts are documented in [assets.md](assets.md).

## QA notes

Completed for the static asset/metadata work: verified all eleven final WebP files decode and show the intended subjects; checked declared hero dimensions; checked the canonical, sitemap and social URL targets agree; confirmed metadata contains no remote font stylesheet and no unsupported certification/market-count claim.

The release verification must cover desktop and mobile layout, header/menu navigation, every section link, product filtering and detail dialogs, inquiry validation and its actual output, keyboard focus and Escape handling, reduced-motion mode, image loading, browser console/network errors, and the deployed root/robots/sitemap responses. Build, lint, browser results and production verification should be recorded by the release owner after the full application changes are complete; this note does not claim those checks passed before they ran.

## Release verification (2026-09-06, Asia/Bangkok)

- `npm run lint` passes. Generated Playwright artifacts are excluded from lint rather than scanned as application source.
- `npm run build` passes, including the final contrast and anchor-offset changes. Production JS is about 129 KB gzip; CSS about 12 KB gzip. No production dependency vulnerabilities were reported by `npm audit --omit=dev` during this change.
- 24 functional/responsive checks passed. After the last fixes, 5 affected checks passed again, including product-to-form scrolling, repeating the same product selection, article-to-contact navigation, image loading and runtime errors.
- Axe WCAG 2/2.1 A/AA scans reported zero automatic violations for the page, product dialog and policy dialog at 390px and 1440px (six scans). Automated audits are not a claim of comprehensive accessibility certification.
- Layouts and interactions were checked at 360, 390, 768 and 1440px. Desktop/mobile screenshots were inspected; all product and editorial subjects were checked.
- Production deployment `dpl_DQ2E5k9vrLJCCZYmiCb6do19YP32` is READY and aliased to https://pro-rosicglobal.vercel.app/. Immutable URL: https://pro-rosicglobal-rii8es6lt-ha-huy-dungs-projects.vercel.app/.
- Public root, robots.txt, sitemap.xml, favicon.svg and hero.webp returned HTTP 200 with appropriate content types after deployment.

### Remaining owner input

No verified receiving email, phone or Zalo account was provided. Placeholder contact details were removed. The deployed form creates a local reviewable request with copy/download and explicitly says it has not been sent. Configure the public VITE_CONTACT_* values with verified business information and rebuild to enable the email-compose/contact links. Sending remains an explicit visitor action in their email application; no backend inbox delivery is claimed.

Post-deployment smoke: 4/4 checks passed on the public alias (images/anchors/runtime errors; repeated product prefill and contact scroll; form validation, clipboard and download without network submission; mobile 390px navigation/modal/overflow).

## Operational update — 2026-09-19

The historical notes above describe the earlier static/draft release. The
official root is now active, not a maintenance page. `Contact.jsx` posts to
`/api/quote` and truthfully exposes Make/Resend hand-off state, with a no-send
fallback when credentials are absent. The current integration contract,
required provider setup and verification are maintained in
[`quote-automation.md`](quote-automation.md) and
[`implementation-log.md`](implementation-log.md); image provenance and the
2026-09-19 replacement audit are maintained in [`assets.md`](assets.md).

## Polish release 2026-09-06

Production dpl_DcgwpVYLF5xJm72YZ9XgtSEi6WPi, public alias unchanged. Explicit hero width and centered margins fix the wide-screen aspect-ratio/max-height defect; checked at1920/2560/390. Reading sizes/spacing unified.16 products with8 additional local WebP images.8 clearly labelled sample feedback items in two continuous rails; no fabricated personal portraits or real testimonial claims. Visible pause icons removed per user; tap, hover, focus and keyboard can pause, reduced motion disables drift. Supplied logo deterministically traced into transparent pure-vector brand-mark.svg, reused for SVG/PNG/ICO favicon and touch icon under new URLs to bypass old icon cache. Lint/build, focused motion regression and production smoke passed. Business contact configuration remains pending from the previous release.
