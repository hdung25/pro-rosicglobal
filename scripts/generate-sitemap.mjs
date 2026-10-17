// Writes public/sitemap.xml with the home page, every product group page and
// every product page. Run after changing the built-in catalogue:
//   node --import ./scripts/resolve-src.mjs scripts/generate-sitemap.mjs
import fs from "node:fs";
import { DEFAULT_PRODUCTS, GROUPS, groupPath, productPath } from "../src/catalog-v6.js";

const ORIGIN = "https://rosicglobal.com";
const today = new Date().toISOString().slice(0, 10);
const url = (path, priority, changefreq = "monthly") =>
  `  <url>\n    <loc>${ORIGIN}${path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
const entries = [
  url("/", "1.0", "weekly"),
  ...GROUPS.map((group) => url(groupPath(group.id), "0.8")),
  ...DEFAULT_PRODUCTS.map((product) => url(productPath(product), "0.6")),
];
fs.writeFileSync("public/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`);
console.log(`sitemap: ${entries.length} URLs`);
