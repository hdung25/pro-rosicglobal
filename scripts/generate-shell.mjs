// Static first-paint shell for the home page (top bar, header and hero).
// The SPA needs its JavaScript bundle before anything shows, which left the
// hero blank for ~2 s on mid-range phones. This snapshot of the rendered
// Vietnamese home top is written into index.html so the banner paints with the
// CSS; React replaces it on mount with identical markup.
//
// Run after a production build with a preview server on :4174:
//   npm run build && npx vite preview --port 4174 & node scripts/generate-shell.mjs
import fs from "node:fs";
import { chromium } from "@playwright/test";

const base = process.argv[2] || "http://localhost:4174";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => { localStorage.setItem("rosic-language", "vi"); localStorage.setItem("rosic-theme", "light"); });
await page.route("**/api/content", (route) => route.fulfill({ json: { ok: true, data: null } }));
await page.goto(base + "/");
await page.locator(".hero-section img").waitFor();
const shell = await page.evaluate(() => {
  const top = document.querySelector(".site-top").cloneNode(true);
  const hero = document.querySelector("#home").cloneNode(true);
  for (const node of [top, hero]) {
    node.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    node.querySelectorAll("#product-menu, .mega-menu, .top-cell").forEach((el) => el.remove());
  }
  hero.removeAttribute("id");
  return `<div class="site-app" id="app-shell" inert aria-hidden="true">${top.outerHTML}<main>${hero.outerHTML}</main></div>`;
});
await browser.close();

const file = "index.html";
const html = fs.readFileSync(file, "utf8");
const start = "<!-- shell:start -->";
const end = "<!-- shell:end -->";
const guard = `<script>
      // Only the Vietnamese home page matches the shell; other pages and
      // languages wait for the app instead of flashing a different page.
      (() => {
        let language = "vi";
        try { language = localStorage.getItem("rosic-language") || "vi"; } catch { /* default */ }
        if (location.pathname !== "/" || language !== "vi") document.getElementById("app-shell")?.remove();
      })();
    </script>`;
const block = `${start}${shell}${end}`;
const next = html.includes(start)
  ? html.replace(new RegExp(`${start}[\\s\\S]*?${end}`), () => block)
  : html.replace('<div id="root"></div>', () => `<div id="root">${block}</div>\n    ${guard}`);
fs.writeFileSync(file, next);
console.log(`shell written (${shell.length} bytes)`);
