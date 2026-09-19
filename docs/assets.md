# Website image assets

Prepared 2026-09-05. All shipped image files are local under `public/images/`; the site has no runtime dependency on an external image host for these assets.

## Final assets

| File | Dimensions | Bytes | Provenance |
| --- | --- | --- | --- |
| `hero.webp` | 1672 × 941 | 333612 | Built-in imagegen, original filename `exec-1163386e-1306-4d18-8eda-68a69890a696.png` |
| `produce.webp` | 1536 × 1024 | 206822 | Built-in imagegen, original `exec-d002b649-53d1-42eb-a741-3d92cc4551a0.png` |
| `melon.webp` | 900 × 900 | 94138 | Built-in imagegen, original `exec-74fac56d-e24d-4702-af63-d48cabc6a3a8.png` |
| `dragonfruit.webp` | 900 × 900 | 89378 | Built-in imagegen, original `exec-afab36f8-941c-48a6-8b1f-0808b8f580df.png` |
| `avocado.webp` | 900 × 900 | 56354 | Built-in imagegen, original `exec-6f203911-d782-4949-ab52-f68be83bf63f.png` |
| `cashews.webp` | 900 × 900 | 66728 | Built-in imagegen, original `exec-8f34ba9f-de90-4dd9-b65c-aea71ad9b878.png` |
| `vegetables.webp` | 900 × 900 | 170758 | Built-in imagegen, original `exec-e231d374-da56-4b49-9f8b-f4a3e1e69729.png` |
| `cordyceps.webp` | 900 × 900 | 87992 | Built-in imagegen, original `exec-eea186f0-39e4-402a-8696-a2667e442757.png` |
| `mango.webp` | 900 × 675 | 14082 | Existing Unsplash source, yellow mango visually verified |
| `coffee.webp` | 900 × 600 | 19370 | Unsplash photo by User_Pascal, coffee in white ceramic bowl |
| `logistics.webp` | 1400 × 933 | 325934 | Existing Unsplash source, bright warehouse visually verified |

Generated images are editorial illustrations of agricultural subjects. They are not documentary evidence of a particular company-owned farm, facility, product batch, cultivar, certification, or origin. Stock images likewise illustrate their subject; they do not identify the depicted facilities or products as the company's own.

Original generated images remain under `C:/Users/Admin/.codex/generated_images/01a0726b-9313-72f1-be58-6a45488324e4/`. The selected images were encoded to WebP using the bundled Sharp package at quality 85, effort 5, with aspect ratio preserved and product images reduced to 900px width. No visual retouching, compositing, cropping, or color editing was performed outside imagegen.

## Stock sources

- Mango: [original Unsplash image](https://images.unsplash.com/photo-1553279768-865429fa0078?w=900&q=85&fm=jpg). This source was already used by the repository; a fresh download confirmed it loads and depicts a golden-yellow mango on a light surface.
- Coffee: [Coffee beans rest in a white ceramic bowl, by User_Pascal](https://unsplash.com/photos/coffee-beans-rest-in-a-white-ceramic-bowl-dUL28dt-sc0), published May 26, 2025. [Source image](https://images.unsplash.com/photo-1748291180741-fdbb04387a86?w=900&q=85&fm=jpg). The source page explicitly marks it free under the [Unsplash License](https://unsplash.com/license).
- Logistics: [original Unsplash image](https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&q=85&fm=jpg). This source was already used by the repository; a fresh download confirmed a bright, orderly warehouse.

## Inspection and replacement decisions

Every final asset was visually inspected. Key corrections: the dragonfruit cross-section is red/magenta, the avocado has an elongated form, melon has netted rind and orange flesh, vegetables are whole raw produce, and cordyceps is shown as orange club-shaped fruiting bodies rather than pills. Subject appearance is illustrative; exact cultivars cannot be certified from an image.

Real photographic alternatives were checked first where practical. The old cashew URL was broken (the correct free Unsplash photo is [Jenn Kosar's cashew bowl](https://unsplash.com/photos/cashew-nut-lot-on-blue-ceramic-bowl-FhXZSP-4ARg)); it was visually too dark for this design. A correctly identified [fresh Cordyceps militaris photograph by Fumikas Sagisavas](https://commons.wikimedia.org/wiki/File:Fresh_cordyceps_militaris.jpg), CC0, was also inspected but rejected because the plastic packaging, poor framing, and contrast did not suit the catalog. Those unused downloaded alternatives are not shipped.

## Exact final generation prompts

Mode for every prompt below: built-in `image_gen.imagegen`, one call per final image, no reference image. No fallback CLI or external image-generation API was used.

### hero.webp

Use case: photorealistic-natural. Asset type: wide editorial website hero photograph for Hong Tam Rosic Global Vietnamese agricultural export brand. Create a truly natural-looking, high-end landscape photograph of lush tea-growing hills in the Vietnamese Central Highlands in fresh morning sunshine. Wide 16:9 landscape framing, looking across curved, orderly tea rows with varied lively green leaves in the foreground and rolling green agricultural hills into the distance, a faint thin morning haze at the far horizon only, soft pale blue sky occupying upper quarter. Bright and open, gentle golden sun from one side, real leaf texture, subtle imperfections and organic spacing, believable camera optics, rich but realistic greens. A quiet dirt path winds through the farm. Documentary travel magazine photography, captured on a professional full-frame camera 35mm lens, clear daylight exposure. Scene fills the entire frame, no layouts, no type or logos. Avoid darkness, excessive mist, sunset orange casts, heavy vignettes, teal color grading, plastic-looking synthetic landscape, overly smooth hills, over-saturation, generic CGI or fantasy. Output as a single 16:9 landscape image, ideally 1920x1080 or nearest supported wide resolution.

### produce.webp

Use case: photorealistic-natural. Asset type: premium editorial food photography for a bright Vietnamese agricultural export website. Create a single beautiful horizontal 3:2 real-life-feeling still life photograph. On a warm off-white limestone kitchen surface with a light natural linen cloth, artfully but casually arranged fresh Vietnamese agricultural produce: whole golden yellow mangoes and one neatly sliced mango cheek, one whole pink dragon fruit and one cut half with unmistakable vivid RED MAGENTA flesh and tiny black seeds, a netted cantaloupe melon with one orange flesh wedge, a dark green elongated avocado with one green flesh half and large brown pit, small plain ceramic bowls of golden cashew nuts and roasted coffee beans. The fruit is the hero, generously sized with air around the arrangement, no distracting extra items. Inviting bright diffused window daylight from left, soft distinct shadows, pale cream background, subtle natural textures, believable proportions, slightly imperfect fruit skin. Editorial magazine photography, professional full-frame camera, 50mm lens, natural delicious food texture. Clean considered composition with warm ivory and lively green and golden fruit color. No hands, no people, no text, no letters, no packaging, no label, no logos, no watermark. Avoid artificial gloss, CGI, oversaturation, awkward duplicate fruit, dark moody background, black surface, excessive garnishes or scattered clutter.

### melon.webp

Use case: photorealistic-natural. Asset type: premium catalog product photograph for Vietnamese agricultural export website. Single square photograph of a beautiful ripe netted cantaloupe melon with a delicate green stem, together with one thick cut wedge showing rich orange flesh and a small natural cluster of seeds. One whole melon, one wedge only. The melon is naturally grown with true netted beige rind over green skin; realistic scale. Resting on light warm ivory limestone tabletop against plain light creamy off-white backdrop, softly curved horizon. Tasteful bright diffused morning window light from upper left and soft grounded shadows, subtle blemishes, real juicy texture, sophisticated editorial food photography with a full-frame camera 85mm lens. Centered composition, product fills 70 percent frame with plenty of breathing room, entire subjects fit inside image. No text, labels, brand, stickers, plastic wrapping, hands, extra fruits, dark background or moody grading. Avoid CGI shine and too-perfect plastic fruit. True natural photography feeling.

### dragonfruit.webp

Use case: photorealistic-natural. Asset type: premium catalog product photograph for Vietnamese agricultural export website. Single square close studio photograph of a red-flesh Vietnamese dragonfruit: one whole ripe oval pink dragonfruit with gently curling green-tipped scales sits behind one neatly sliced cross-section HALF dragonfruit. The half faces camera and MUST have vivid deep magenta RED flesh with tiny black seeds, not white flesh. Resting on light warm ivory limestone tabletop against plain creamy off-white backdrop. Beautiful soft morning window daylight from upper left, soft grounded shadows, subtle blemishes in fruit skin and real juicy seed texture. Professional editorial food photograph, full-frame camera 85mm lens. Centered arrangement of exactly one whole and one half fruit filling 70 percent frame with ample breathing room. No text, labels, brand, stickers, hands, extra fruits, dark background, black surface, heavy color grade, CGI gloss or plastic-looking fruit. Delicious vivid pink and magenta balanced by natural quiet cream background.

### avocado.webp

Use case: photorealistic-natural. Asset type: premium catalog product photograph for Vietnamese agricultural export website. Single square studio photograph of two naturally elongated Vietnamese 034 avocados, approximately twice as long as typical Hass avocados, smooth medium dark green pebbled skins. One whole slender long-necked pear shaped avocado sits behind one elongated avocado half cut lengthwise with creamy yellow-green flesh and a glossy natural brown rounded pit. Exactly one whole and one half; both entire subjects fully visible. Resting on light warm ivory limestone tabletop against plain creamy off-white backdrop. Beautiful soft bright morning window daylight from upper left, grounded gentle shadows, subtle tiny blemishes and real avocado flesh texture. Professional editorial food photograph on full-frame 85mm lens. Centered composition fills 70 percent frame with breathing room. No labels, text, sticker, hand, dishes, extra fruits, pink backdrop, dark backdrop, dramatic light, CGI gloss or plastic fruit. Realistic delicious fresh produce texture and precise plant anatomy.

### cashews.webp

Use case: photorealistic-natural. Asset type: premium agricultural catalog food photograph. Single square photograph of a generous small ivory ceramic bowl of golden dry roasted cashew nuts, with five cashews casually resting beside the bowl. Beautiful actual cashew shapes, whole curved kidney-shaped kernels with imperfect contours and subtle roasted texture. Simple warm ivory limestone table, creamy off-white backdrop, soft natural morning window light from upper left, gently grounded shadows. Thoughtfully composed product fills 65 percent of square image, complete bowl fits in image with ample negative space. Magazine food photography with professional camera, 85mm lens. Inviting bright appearance, warm natural food colors, realistic pores. No extra ingredients, herbs, other nuts, dishes, labels, writing, packaging, logos, artificial shine, dark surfaces or CGI. Natural photographic feel.

### vegetables.webp

Use case: photorealistic-natural. Asset type: premium catalog product food photograph. A single square photograph of freshly harvested Vietnamese highland vegetables gently arranged on a light warm ivory limestone table: one small head of lettuce, a cluster of red cherry tomatoes still on the vine, one golden yellow bell pepper, one red bell pepper, one broccoli crown and two slim carrots with fresh green tops. Whole raw vegetables, never a prepared salad or cooked dish. Natural imperfect forms, matte pepper skin with gentle highlights, crisp leaf details. Soft bright diffused window daylight from upper left, subtle grounded shadows, plain warm off-white backdrop, quietly beautiful considered composition with natural variation and breathing room. Editorial food magazine photograph shot full-frame 50mm lens, realistic texture and proportions. No text, logos, labels, packaging, people, stickers, bowls, dishes, cutlery, overly glossy CGI, dark background or moody lighting.

### cordyceps.webp

Use case: photorealistic-natural. Asset type: premium agricultural catalog photograph of actual fresh Cordyceps militaris mushrooms. Single square close-up photo of a small cluster of cultivated bright golden-orange Cordyceps militaris fruiting bodies, slender finger-shaped 3-6cm clubs with rounded slightly enlarged tips and fine bumpy texture. They grow upright together from a small pale ivory culture substrate, placed in a shallow plain ivory ceramic dish. Realistic botanical forms: delicate orange vertical clubs, NO cap-shaped mushrooms, no pills, no capsules, no powders. Warm off-white limestone tabletop and creamy off-white simple backdrop with soft bright window daylight from upper left. Elegant natural editorial product photograph, professional 85mm lens, gently grounded shadow, orange subjects crisp with believable natural irregularities. Composition centered and occupies 65 percent frame with ample light background. No text, medicine packaging, labels, plastic wrapping, black background, dramatic light, cartoon, CGI, oversaturated colors or miraculous health symbolism. It must look like a straightforward beautiful fresh fungi photograph.


## Product catalog expansion — 2026-09-06

Eight new editorial product images were generated using the built-in `image_gen.imagegen` tool, one independent call per subject with no references. Originals remain in the generated-images directory listed above. All eight were visually inspected, then encoded as 900 × 900 WebP at quality 85 / effort 5 using bundled Sharp. Only size and encoding changed; there was no visual retouching outside imagegen. These are illustrative product visuals, not photographs of verified company stock or evidence of a particular cultivar, origin, certification or available inventory.

| Final file | Bytes | Original generation file |
| --- | --- | --- |
| `pineapple.webp` | 72798 | `exec-3bb15d31-9717-4fe9-b8a0-80efa226caf0.png` |
| `passionfruit.webp` | 106320 | `exec-f46bf096-a177-4f9b-996b-ef49a49660d4.png` |
| `banana.webp` | 56362 | `exec-b2da80dd-10e4-48ac-a8ab-24f34a711e6f.png` |
| `pomelo.webp` | 99770 | `exec-70c9ab35-e58c-40f7-b01a-d4816b16c05c.png` |
| `durian.webp` | 118108 | `exec-55321826-fa00-46fb-9d6f-15cfdf6aceca.png` |
| `sweetpotato.webp` | 68878 | `exec-b546dd78-1a39-4eca-b7d8-5b4ccaa5a8d8.png` |
| `rice.webp` | 55290 | `exec-0513a3e2-05d5-4631-a5bf-5f9f9825c7b1.png` |
| `pepper.webp` | 70572 | `exec-854a56f3-272c-4db7-9a5d-ba47d20fed3c.png` |

### Exact expansion prompts

#### pineapple.webp

Use case: photorealistic-natural. Asset type: premium agricultural export product catalog photograph, square composition. A ripe whole pineapple with natural golden yellow textured diamond skin and a crown of fresh pointed green leaves, beside two thick juicy yellow pineapple slices with the skin removed. Exactly one whole pineapple and two slices, the entire green crown and fruit fully visible, centered and filling about 65 percent of the square with generous breathing room. On a warm ivory limestone tabletop with a plain light cream backdrop, bright diffused morning window daylight from upper left, soft realistic grounded shadows. Believable imperfect fruit skin, fine leaf fibers and juicy flesh texture. Natural editorial food photography with a professional full-frame camera and 85mm lens, warm cream and gold palette, fresh and appetizing. No text, logos, labels, stickers, origin stamps, hands, packaging, additional fruits, overly glossy plastic surfaces, CGI, dark backgrounds, or heavy color grading.

#### passionfruit.webp

Use case: photorealistic-natural. Asset type: premium agricultural product catalog photograph. Single square composition of three whole ripe purple passion fruits with natural lightly dimpled and subtly wrinkled deep plum skin, together with one passionfruit half facing camera that clearly shows glossy golden yellow orange pulp and many small black seeds. Entire fruits fully visible, casually arranged centered on a warm ivory limestone tabletop with a plain light creamy backdrop, product filling 65 percent frame and ample breathing room. Bright diffused morning daylight from upper left, soft grounded shadows, vivid but believable colors, real fruit imperfections and juicy translucent seed texture. Premium editorial food photograph on full-frame camera 85mm lens. Exactly whole passionfruits and one half, no other fruit, no cutlery, no hands, no text, origin or certification labels, no logo, sticker or packaging. Avoid artificial gloss, CGI, excessive symmetry, black backdrop and moody color grading.

#### banana.webp

Use case: photorealistic-natural. Asset type: premium agricultural product catalog photograph. Single square image of one compact natural bunch of seven small ripe Vietnamese-style sweet bananas, shorter and plumper than typical large supermarket bananas, connected at a real brown-green crown. Gentle natural curve, golden yellow skin with a few tiny brown freckles and faint green at crown, believable imperfect peels. The whole bunch fully visible centered on light warm ivory limestone surface against simple pale cream background, occupying 65 percent frame with clear breathing room. Soft bright morning window light from upper left, subtle grounded shadow, real photographic textures and proportions. Editorial food magazine photograph, full-frame camera with 85mm lens. No peeled fruit, extra fruits, hands, labels, stickers, certification, origin marks, logos, packaging or text. Avoid CGI, plastic shine, exaggerated flawless skin, dark background and heavy grading.

#### pomelo.webp

Use case: photorealistic-natural. Asset type: premium agricultural export product catalog photograph. Single square photograph showing one whole fresh green pomelo with naturally pebbled green rind and a small stem leaf, beside one cut pomelo half and three peeled pale pink segments. The half shows thick white pith surrounding fresh pale blush-pink juicy citrus flesh, botanically plausible pomelo anatomy, generous translucent juice vesicles. Entire subjects fully visible, centered with breathing room on warm ivory limestone tabletop against clean light cream backdrop. Bright diffused morning window light from upper left, gentle grounded shadows, organic imperfections and realistic edible texture. Premium editorial food photography on full-frame 85mm lens, fresh light palette. No red grapefruit-like saturated flesh, oranges, lemons, other fruits, knife, hands, packaging, text, origin or certification labels, sticker or logo. Avoid CGI gloss, black background and moody lighting.

#### durian.webp

Use case: photorealistic-natural. Asset type: premium agricultural product catalog photograph. Single square photo of a ripe durian with natural olive green and golden brown spiky husk, partially split open along its seam to reveal plump golden yellow creamy durian pods inside thick pale ivory inner rind. One connected opened durian and one small separated husk section containing two golden pods in front. Botanically convincing short angular durian spikes, natural woody stem, soft folds and texture in yellow flesh. Entire subjects fully visible, centered filling 65 percent frame with breathing room. Warm ivory limestone tabletop, plain light cream backdrop, bright diffused morning window daylight from upper left, soft grounded shadow. Natural premium editorial food photograph, professional full-frame camera 85mm lens. No jackfruit, no other produce, hands, knife, text, packaging, stickers, origin or certification marks, logo, CGI gloss, dark moody setting or exaggerated symmetry.

#### sweetpotato.webp

Use case: photorealistic-natural. Asset type: premium agricultural product catalog food photograph. Single square image of three whole slender purple-red skinned sweet potatoes with gentle irregular curves and tiny earthy skin marks, beside one sweet potato cut in half showing firm rich golden yellow-orange flesh. Raw fresh sweet potatoes, not cooked, with realistic natural plant texture. Whole objects and cut ends fully visible, artful simple centered arrangement on warm ivory limestone tabletop against a pale cream backdrop, occupying 65 percent frame with generous breathing room. Soft bright morning window daylight from upper left, gentle grounded shadows. Editorial food photograph shot with full-frame 85mm lens, believable proportions and quiet bright palette. No ordinary white potatoes, no purple interior, no hands, knife, plates, labels, logos, packaging, text, origin/certification symbols, plastic CGI sheen, black background or dramatic heavy grading.

#### rice.webp

Use case: photorealistic-natural. Asset type: premium agricultural product catalog photograph. Single square studio photograph of a shallow simple ivory ceramic bowl generously filled with clean uncooked white long-grain rice, a small restrained scattering of a dozen rice grains on the table near bowl. Rice grains naturally ivory white and semi-translucent with pointed ends, separate dry grains, NOT cooked rice. Entire bowl fully visible, centered, filling about 60 percent of square frame with plenty of breathing room. On a warm ivory limestone tabletop against a plain pale cream backdrop, bright diffused morning daylight from upper left, subtle grounded shadows. Premium natural editorial food photograph with professional full-frame camera 85mm lens, realistic rice size and slight natural variation. No other food, garnish, chopsticks, hands, packaging, text, logos, origin or certification label. Avoid dark backgrounds, heavy grading, CGI texture, overly perfect uniform grains or glossy cooked appearance.

#### pepper.webp

Use case: photorealistic-natural. Asset type: premium agricultural export product catalog photograph. Single square image of a small shallow plain ivory ceramic bowl filled with real dried black peppercorns, a few peppercorns casually scattered close to bowl and one small natural fresh green pepper spike with a single dark green leaf laid gently alongside. Correct botany of black pepper Piper nigrum: tiny wrinkled round black-brown peppercorns, green spike carrying small spherical green berries. Entire composition fully visible and centered with ample breathing room, occupying 60 percent frame. Warm ivory limestone tabletop, simple light creamy background, bright diffused morning window daylight from upper left and soft grounded shadows. Realistic wrinkled peppercorn texture, natural leaf veins, premium editorial food photography on professional 85mm lens, believable scale. No chili peppers, no ground powder, no mixed red/white peppercorn blend, no packaging, labels, text, origin or certification marks, logos, hands, CGI gloss, black background or moody lighting.

## Export-category image correction — 2026-09-19

The export grid needed subject-specific visuals rather than reusing a mixed-product still life. The following original, logo-free imagegen assets were resized to 1280px wide and encoded as WebP at quality 86 / effort 5 for faster delivery while keeping enough detail for the product dialog. They are illustrative only and do not identify Hồng Tâm inventory, farms, certifications, or a product batch.

| Final file | Source generation | Subject |
| --- | --- | --- |
| `cassia-export.webp` | `exec-c173349f-6658-4af0-9fe8-5081618d35a4.png` | Cassia sticks and bark |
| `star-anise-export.webp` | `exec-c6cbb72d-de74-4b0a-a8be-662e6bb7fa1d.png` | Whole dried star anise |
| `desiccated-coconut-export.webp` | `exec-8f067e7e-1765-46fc-aff8-218773cea226.png` | Desiccated coconut |

Generation directory: `C:/Users/Admin/.codex/generated_images/01a07265-c257-7d30-b689-454748c7045f/`.

## Product-image audit and replacement manifest — 2026-09-19

This audit covers every product-facing image that is currently shipped under
`public/images/` and the image assignments in `src/data.js`,
`src/products-extra.js`, and `src/export-catalog.js`. It was performed from
the local final files at their rendered crop, not only from filenames or
metadata. The goal is to keep an export catalogue visually credible while
avoiding third-party logos, copied competitor imagery, hidden watermarks, and
product/description mismatches.

### What can remain

| Asset / use | Audit result | Reason |
| --- | --- | --- |
| `cashews.webp` for raw cashew kernels | Keep | Original, bright, close enough to show whole kernels and free of visible text or branding. |
| `cassia-export.webp` | Keep | Original subject-specific cassia visual; bark, sticks and neutral ground are clearly readable. |
| `pepper.webp` | Keep | Original subject-specific black pepper visual; whole peppercorns and a pepper spike make the category unambiguous. |
| `star-anise-export.webp` | Keep | Original subject-specific whole-star-anise visual, without product packaging or third-party marks. |
| `desiccated-coconut-export.webp` | Keep | Original subject-specific visual, with no visible branding and a clear dried-coconut texture. |
| `hero.webp`, `produce.webp`, and the fresh-fruit product images | Keep for their present editorial/fresh-produce placements | Their local provenance is recorded above and the subject shown matches the surrounding content. |

### Corrections completed after the audit

| Previous assignment | Reason for replacement | Clean asset now shipped | Placement |
| --- | --- | --- | --- |
| `coffee.webp` for export category 05 | A roasted-bean stock photo did not match green-bean grading. | `green-coffee-export.webp`, original and logo-free. | Export category 05; the stock photo stays only with the separate “Cà phê rang” card. |
| `mango.webp` for export category 07 “Trái cây sấy” | A fresh mango did not represent a dried-fruit SKU. | `dried-fruit-export.webp`, original and logo-free. | Export category 07 and its detail view; the fresh mango stays with the fresh-fruit card. |
| `cashews.webp` for export category 08 “Điều thành phẩm” | It duplicated the raw-kernel visual for a finished-good category. | `finished-cashew-export.webp`, original roasted cashews beside a blank kraft pouch. | Export category 08 and its detail view. |
| `vegetables.webp` / `logistics.webp` in packing content | Neither represented food-grade sorting and packing equipment. | `agri-processing-line.webp`, original, bright and logo-free. | The packaging journey step and packing/shipping article. |
| `export-categories-hero-v1.png` | The legacy 2.36 MB PNG lacked recorded provenance. | `export-categories-hero.webp`, original, 259,106-byte WebP. | Review-only catalogue hero. The untracked-source PNG is removed from the runtime. |

All replacements were visually inspected at card and large-view crops. They
are illustrative artwork, never evidence of company facilities, inventory,
certification, a particular batch, or country of origin.

### Requirements for each planned original

1. Generate one image per file, without a reference image, typography, text,
   label, certification seal, logo, QR code, watermark, or recognisable
   packaging artwork.
2. Use an open, bright, neutral presentation that matches the existing warm
   ivory catalogue surface. Preserve believable crop/food texture and avoid
   glossy CGI, cinematic darkness, dramatic vignettes, or artificial neon
   colour.
3. Inspect the rendered image at desktop-card, mobile-card, and large-dialog
   crops. Reject it when a crop hides the product, contains malformed food
   anatomy, text-like artefacts, brand-like markings, or unsafe visual claims.
4. Save the original generation identifier and exact prompt in this document;
   encode the accepted result to WebP with dimensions suitable for the largest
   dialog placement. Mark it as illustrative, never as proof of inventory,
   certification, facility, origin, or available stock.

### Accepted original replacements — 2026-09-19

The five assets below were created with the built-in image-generation workflow,
without reference images. They were visually checked for product clarity,
absence of text/logos/third-party marks and card/dialog crops, then encoded as
WebP at quality 86 / effort 5. Originals remain in
`C:/Users/Admin/.codex/generated_images/01a07265-c257-7d30-b689-454748c7045f/`.

| Final file | Dimensions | Bytes | Source generation | Public use |
| --- | --- | ---: | --- | --- |
| `agri-processing-line.webp` | 1440 × 960 | 194,446 | `exec-ea4e6832-ff37-49d4-bc4e-ef1aee961fe1.png` | Packing journey and article |
| `green-coffee-export.webp` | 1254 × 1254 | 155,728 | `exec-bb13b212-8f13-45b1-b893-bc6d22b34014.png` | Green coffee export category |
| `dried-fruit-export.webp` | 1254 × 1254 | 189,452 | `exec-f71adcaa-74f8-4a2d-8cd2-2e46910b71e1.png` | Dried-fruit export category |
| `finished-cashew-export.webp` | 1254 × 1254 | 141,696 | `exec-e6fd448f-7746-4693-b91b-5e328fb30f27.png` | Finished-cashew export category |
| `export-categories-hero.webp` | 1668 × 939 | 259,106 | `exec-477e34c3-4986-4bdf-bfde-8ab6e1e761cf.png` | Review-only catalogue hero |

#### Generation prompts

- **`agri-processing-line.webp`** — “Premium editorial website photograph for a Vietnamese agricultural export company: a bright, clean food-grade agricultural processing and export-packing line in a modern Vietnam-based facility; stainless sorting conveyors and inspection tables, plain kraft cartons and neutral woven sacks, with natural cashew kernels and cinnamon sticks in separate clean trays. No people, hands, screens, text, labels, logos, flags or watermarks. Warm daylight plus neutral industrial light, off-white walls, realistic documentary photography, horizontal 3:2 framing; avoid CGI, dark grading and product claims.”
- **`green-coffee-export.webp`** — “Premium square export-catalogue product photograph of unroasted pale jade-green Arabica/Robusta beans in a plain ivory grading tray, with a few beans scattered on a warm ivory limestone surface. Bright soft daylight, real bean texture and empty space for a card. No roasted beans, cup, packaging, tools, people, text, barcode, logos, watermark or certification marks; no claim of farm, facility, certification or origin.”
- **`dried-fruit-export.webp`** — “Premium square export-catalogue photograph of genuinely dried products only: golden dried mango strips, pale banana chips and dried pineapple rings in three unbranded ivory trays. The pieces must visibly read as dry rather than fresh fruit or candy. Bright ivory surface, soft daylight and clean food-grade editorial style. No retail pouch, label, text, logo, watermark, people, utensils, dark grading, CGI or product claims.”
- **`finished-cashew-export.webp`** — “Premium square finished-product photograph of ready-to-eat lightly toasted cashew kernels in a shallow ivory dish with one completely blank kraft stand-up pouch behind. Natural toasted texture, no spices, coatings or other nuts; warm ivory surface, bright soft daylight. No printed pouch, label, barcode, logo, watermark, people, dark setting, CGI or claims about a company, formula, certification, inventory or origin.”
- **`export-categories-hero.webp`** — “Wide 16:9 original export-catalogue still life on warm ivory limestone: separate, crop-safe groups of raw cashew kernels, cassia sticks, black pepper with one green spike, whole dried star anise, green coffee beans, desiccated coconut, dried mango strips and toasted cashews. Bright natural magazine photography, plain cream background, real food texture and clear negative space. No bowls with writing, packaging, labels, text, logos, watermark, badges, people, dark filter, CGI or claims of a particular company, farm, factory, certificate or origin.”

### Brand treatment: display layer, not false ownership claim

The requested “HONG TAM ROSIC” watermark or frame should be added by the web
interface as a small, accessible overlay in each product image wrapper rather
than baked into the source bitmap. This keeps the original asset traceable,
does not obscure the product, and avoids suggesting that an external stock
photograph becomes company-owned simply because a watermark was added.

Recommended treatment:

- a compact `HỒNG TÂM ROSIC GLOBAL` wordmark on a translucent warm-charcoal
  chip at the image's top-right corner;
- `aria-hidden="true"` and `pointer-events: none`, so the real image alt text
  remains the accessible description;
- opacity/contrast sufficient over both light and dark product photos, with a
  plain border rather than a large transparent logo across food;
- the existing hover zoom and only a restrained warm-neutral gradient. Do not
  apply a heavy colour filter, because it changes buyers' perception of the
  product's real colour.

In an exportable brochure, add the same frame in the document template. It is
still a display treatment, not a statement of ownership or a replacement for
licensing/provenance.

### Source and licensing rule

The preferred replacement source is an original image generated in the project
workflow or a company-provided photograph with written permission. If a stock
image is proposed, record the direct source URL, license, author where shown,
date checked, visible-brand inspection, and every shipped crop before it is
accepted. Do not use competitor site imagery, social-media reposts, a search
thumbnail, or a picture merely because a third-party watermark has been
covered.
