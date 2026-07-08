/* =========================================================================
   Perimeter — build: sync the shared header/footer into every page.
   Edit partials/header.html or partials/footer.html once, then run:
       npm run build
   It replaces the header/footer region of each top-level *.html (matching the
   markers, or the raw <header>/<footer> block on first run) and stamps the
   active nav item for that page. Output stays plain static HTML.
   ========================================================================= */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const header = fs.readFileSync(path.join(ROOT, "partials/header.html"), "utf8").replace(/\s+$/, "");
const footer = fs.readFileSync(path.join(ROOT, "partials/footer.html"), "utf8").replace(/\s+$/, "");

// page → the nav link (by data-nav value) to mark aria-current
const ACTIVE = {
  "index.html": "index.html",
  "plans.html": "plans.html",
  "pests.html": "pests.html",
  "about.html": "about.html",
  "contact.html": "contact.html",
};

const HEADER_RE = /<!-- @header -->[\s\S]*?<!-- @\/header -->|<header class="site-header"[\s\S]*?<\/header>/;
const FOOTER_RE = /<!-- @footer -->[\s\S]*?<!-- @\/footer -->|<footer class="site-footer"[\s\S]*?<\/footer>/;

const pages = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
let count = 0, warns = 0;

for (const page of pages) {
  const file = path.join(ROOT, page);
  let html = fs.readFileSync(file, "utf8");

  let h = header;
  const active = ACTIVE[page];
  if (active) h = h.split(`data-nav="${active}"`).join(`data-nav="${active}" aria-current="page"`);

  if (HEADER_RE.test(html)) {
    html = html.replace(HEADER_RE, () => `<!-- @header -->\n${h}\n  <!-- @/header -->`);
  } else { console.warn(`  ! ${page}: no header region found`); warns++; }

  if (FOOTER_RE.test(html)) {
    html = html.replace(FOOTER_RE, () => `<!-- @footer -->\n${footer}\n  <!-- @/footer -->`);
  } else { console.warn(`  ! ${page}: no footer region found`); warns++; }

  fs.writeFileSync(file, html);
  count++;
  console.log(`  ✓ ${page}${active ? "  (active: " + active + ")" : ""}`);
}

console.log(`\nSynced header/footer into ${count} pages${warns ? ` (${warns} warning(s))` : ""}.`);
