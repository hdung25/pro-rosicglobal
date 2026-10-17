// Round, high-contrast favicon set generated from the official brand mark.
// Run: node scripts/generate-favicons.mjs
//
// The browser tab and Google results crop icons to a circle and render them
// at 16–48 px, so the mark is drawn large in gold on the brand forest green
// inside a circle, and every raster size is rendered from vector (no upscale).
import fs from "node:fs";
import sharp from "sharp";

const source = fs.readFileSync("public/brand-mark.svg", "utf8");
const path = source.match(/<path[^>]*d="([^"]+)"/)[1];
const FOREST = "#193B30";
const GOLD = "#E2B653";

// brand-mark viewBox is "10 9 445 159"; centre it in a 512 canvas at the given width.
function mark(width, cx = 256, cy = 256, color = GOLD, stroke = 0) {
  const scale = width / 445;
  const height = 159 * scale;
  const x = cx - width / 2 - 10 * scale;
  const y = cy - height / 2 - 9 * scale;
  const outline = stroke ? ` stroke="${color}" stroke-width="${stroke}" stroke-linejoin="round"` : "";
  return `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale.toFixed(4)})"><path d="${path}" fill="${color}" fill-rule="evenodd"${outline}/></g>`;
}

const roundWith = (width, color = GOLD, stroke = 0) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>Hồng Tâm Rosic Global</title><circle cx="256" cy="256" r="256" fill="${FOREST}"/>${mark(width, 256, 256, color, stroke)}</svg>\n`;
const round = roundWith(400);
// At 16–48 px the mark is drawn wider, in a brighter gold and with heavier
// strokes, so it still reads in a light or dark browser tab and in search.
const roundSmall = roundWith(476, "#F2C75C", 10);
// Square artwork for platforms that apply their own mask (iOS, Android maskable).
const square = (markWidth) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="${FOREST}"/>${mark(markWidth)}</svg>\n`;

fs.writeFileSync("public/favicon.svg", roundSmall);
fs.writeFileSync("public/favicon-rosic.svg", round);
fs.writeFileSync("public/brand-kit/rosic-favicon.svg", round);
fs.writeFileSync("public/icons/rosic-app.svg", square(380));

const png = (svg, size) => sharp(Buffer.from(svg), { density: 600 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

const outputs = [
  ["public/favicon-32.png", roundSmall, 32],
  ["public/favicon-48.png", roundSmall, 48],
  ["public/favicon-180.png", round, 180],
  ["public/favicon-96.png", round, 96],
  ["public/favicon.png", round, 192],
  ["public/favicon-512.png", round, 512],
  ["public/favicon-rosic.png", round, 64],
  ["public/icons/rosic-192.png", round, 192],
  ["public/icons/rosic-512.png", round, 512],
  ["public/icons/rosic-apple-180.png", square(380), 180],
  ["public/apple-touch-icon-rosic.png", square(380), 180],
  ["public/icons/rosic-maskable-512.png", square(300), 512],
];
for (const [file, svg, size] of outputs) fs.writeFileSync(file, await png(svg, size));

// favicon.ico with 16, 32 and 48 px PNG entries (supported by all browsers).
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((size) => png(roundSmall, size)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((size, index) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0);
  entry.writeUInt8(size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(images[index].length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += images[index].length;
  return entry;
});
fs.writeFileSync("public/favicon.ico", Buffer.concat([header, ...entries, ...images]));
console.log("favicons written");
