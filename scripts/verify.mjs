/* =========================================================================
   Perimeter — visual + behavior verify loop (Puppeteer)
   Screenshots every page at 3 widths, and asserts:
     - no console / page errors
     - no horizontal overflow
     - no broken internal links or assets
     - booking + contact forms reach success (demo mode)
     - contact blocks an empty submit
     - the reviews filter narrows correctly
   Run:  npm run verify        (screenshots land in ./shots)
   Uses your installed Chrome via puppeteer-core (set CHROME_PATH to override).
   ========================================================================= */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const SHOTS = path.join(ROOT, "shots");
const PORT = 8123;
const BASE = `http://localhost:${PORT}`;

const WIDTHS = [
  { name: "mobile", w: 390, h: 844, mobile: true },
  { name: "tablet", w: 834, h: 1112, mobile: true },
  { name: "desktop", w: 1280, h: 900, mobile: false },
];
const PAGES = [
  "index.html", "plans.html", "booking.html", "pests.html", "reviews.html",
  "about.html", "careers.html", "contact.html",
  "privacy.html", "terms.html", "cookies.html", "404.html",
];

const failures = [];
const fail = (msg) => { failures.push(msg); };

/* ---- locate Chrome ---- */
function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  ].filter(Boolean);
  return candidates.find((c) => fs.existsSync(c)) || null;
}

/* ---- tiny static file server ---- */
const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".mjs": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".json": "application/json",
  ".webmanifest": "application/manifest+json", ".xml": "application/xml",
  ".txt": "text/plain", ".ico": "image/x-icon",
};
function startServer() {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p.endsWith("/")) p += "index.html";
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); return res.end("Not found");
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

const setForm = `function set(id,v){var e=document.getElementById(id);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));}`;

async function main() {
  const chrome = findChrome();
  if (!chrome) {
    console.error("Could not find Chrome. Install Google Chrome, or set CHROME_PATH=/path/to/chrome");
    process.exit(2);
  }
  fs.mkdirSync(SHOTS, { recursive: true });
  const server = await startServer();
  const browser = await puppeteer.launch({
    executablePath: chrome, headless: true,
    args: ["--no-sandbox", "--hide-scrollbars"],
  });

  const linkTargets = new Set();

  console.log("Screenshotting pages at 3 widths…");
  for (const pageFile of PAGES) {
    for (const vp of WIDTHS) {
      const page = await browser.newPage();
      await page.setViewport({ width: vp.w, height: vp.h, isMobile: vp.mobile, deviceScaleFactor: 1 });
      const errs = [];
      page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
      page.on("pageerror", (e) => errs.push("pageerror: " + e.message));

      const resp = await page.goto(`${BASE}/${pageFile}`, { waitUntil: "networkidle2", timeout: 30000 }).catch(() => null);
      if (!resp) { fail(`${pageFile} @${vp.name}: failed to load`); await page.close(); continue; }

      await page.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-in")));
      await new Promise((r) => setTimeout(r, 250));

      await page.screenshot({ path: path.join(SHOTS, `${pageFile.replace(".html", "")}-${vp.name}.png`), fullPage: true });

      const box = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      if (box.sw > box.cw + 1) fail(`${pageFile} @${vp.name}: horizontal overflow (${box.sw} > ${box.cw})`);
      if (errs.length) fail(`${pageFile} @${vp.name}: console error(s): ${errs.join(" | ")}`);

      if (vp.name === "desktop") {
        const urls = await page.evaluate(() => {
          const out = [];
          document.querySelectorAll("a[href], link[href], script[src], img[src]").forEach((el) => {
            const u = el.getAttribute("href") || el.getAttribute("src");
            if (u) out.push(u);
          });
          return out;
        });
        urls.forEach((u) => linkTargets.add(u));
      }
      await page.close();
    }
    console.log(`  ✓ ${pageFile}`);
  }

  /* ---- broken link / asset check ---- */
  console.log("Checking internal links & assets…");
  for (const u of linkTargets) {
    if (/^(https?:|mailto:|tel:|data:|#)/.test(u)) continue;
    const clean = u.split("#")[0].split("?")[0];
    if (!clean) continue;
    const url = new URL(clean, BASE + "/").toString();
    try {
      const r = await fetch(url);
      if (!r.ok) fail(`broken link/asset: ${u} -> HTTP ${r.status}`);
    } catch (e) {
      fail(`broken link/asset: ${u} (${e.message})`);
    }
  }

  /* ---- behavior: booking demo E2E ---- */
  console.log("Driving forms & filters…");
  {
    const page = await browser.newPage();
    await page.goto(`${BASE}/booking.html?plan=home-protection`, { waitUntil: "networkidle2" });
    await page.evaluate(setForm + `
      document.querySelector('input[name="plan"][value="home-protection"]').checked = true;
      set('address','123 Maple Street'); set('city','Springfield'); set('zip','00000');
      document.querySelector('input[name="propertyType"][value="Single-family home"]').checked = true;
      set('firstName','Jordan'); set('lastName','Rivera'); set('email','jordan@email.com'); set('phone','(555) 123-4567');
      var d = new Date(Date.now() + 3*864e5).toISOString().slice(0,10); set('date', d);
      document.querySelector('input[name="window"][value^="Morning"]').checked = true;
      document.getElementById('consent').checked = true;
      document.getElementById('bookingForm').requestSubmit();
    `);
    await page.waitForSelector("#bookingDone.is-active", { timeout: 5000 }).catch(() => fail("booking: did not reach success screen"));
    await page.close();
  }

  /* ---- behavior: contact (empty blocked + valid succeeds) ---- */
  {
    const page = await browser.newPage();
    await page.goto(`${BASE}/contact.html`, { waitUntil: "networkidle2" });
    await page.evaluate(() => document.getElementById("contactForm").requestSubmit());
    if (await page.evaluate(() => document.getElementById("contactDone").classList.contains("is-active"))) {
      fail("contact: empty form wrongly succeeded");
    }
    await page.evaluate(setForm + `
      set('firstName','Jordan'); set('lastName','Rivera'); set('email','jordan@email.com');
      set('reason','A general question'); set('message','Ants in the kitchen.');
      document.getElementById('consent').checked = true;
      document.getElementById('contactForm').requestSubmit();
    `);
    await page.waitForSelector("#contactDone.is-active", { timeout: 5000 }).catch(() => fail("contact: valid form did not succeed"));
    await page.close();
  }

  /* ---- behavior: reviews filter ---- */
  {
    const page = await browser.newPage();
    await page.goto(`${BASE}/reviews.html`, { waitUntil: "networkidle2" });
    const r = await page.evaluate(() => {
      var before = document.querySelectorAll(".review:not(.is-hidden)").length;
      document.querySelector('.filter-chip[data-filter="termite"]').click();
      var shown = document.querySelectorAll(".review:not(.is-hidden)");
      var onlyT = Array.prototype.every.call(shown, (c) => c.dataset.cat === "termite");
      return { before: before, after: shown.length, onlyT: onlyT };
    });
    if (!(r.after > 0 && r.after < r.before && r.onlyT)) fail("reviews: filter did not narrow to the selected category");
    await page.close();
  }

  await browser.close();
  server.close();

  console.log(`\nScreenshots → ${path.relative(process.cwd(), SHOTS)}/`);
  if (failures.length) {
    console.error(`\n❌ ${failures.length} issue(s) found:`);
    failures.forEach((f) => console.error("   - " + f));
    process.exit(1);
  }
  console.log("\n✅ All checks passed.");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
