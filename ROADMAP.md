# Perimeter — Template Roadmap

Turning this from "a great-looking site" into a template that's **high quality, easy to
use, high-converting, and easy to resell**.

**Priority key:** **P0** = do first (biggest impact per hour) · **P1** = should-have ·
**P2** = polish. Each item notes *why* it matters: 🎯 conversion · ✨ quality ·
🧰 ease-of-use · 💰 sellability.

---

## 🔌 Integration points — REMEMBER, don't "fix"

These are **intentional template seams**, not unfinished work. The forms validate and
show success states client-side on purpose so a buyer wires their own tools. Document
them (done in the README), don't treat them as bugs.

- Booking submit → scheduler/CRM or Formspree/Netlify/Zapier
- Contact submit → email/CRM
- Careers "Apply" → ATS or the current `mailto:`
- Reviews → static, or live via Google Places API
- Analytics → not wired (see P0)

---

## P0 — Highest impact (ship these before selling)

### Convert more visitors
- [ ] **Sticky mobile action bar** — a fixed bottom bar with **Call** + **Book** on
  phones. Single biggest mobile-conversion lever for local service. 🎯
- [ ] **JSON-LD structured data** — `LocalBusiness`, `AggregateRating`, `FAQPage`,
  `JobPosting`. Drives Google rich results and local ranking → free leads. 🎯✨
- [ ] **Analytics + conversion events** — GA4 (or Plausible) with events on Book click,
  form submit, and phone tap. You can't optimize conversion you can't measure. 🎯
- [ ] **Offer/promo module** — a dismissible "$50 off your first service" bar/banner,
  driven by one config value. Proven lead magnet for pest control. 🎯🧰
- [ ] **Real imagery slots** — hero photo, technician headshots, before/after. Add
  `aspect-ratio` + lazy-load placeholders so buyers just drop in images. ✨🧰

### Make it easy to rebrand (→ easy to sell)
- [ ] **One-file brand config** — pull business name, phone, email, address, hours,
  social, and offer text into a single `assets/js/config.js` (or documented block) and
  render into the DOM, so a buyer rebrands in 5 minutes instead of find-and-replace. 🧰💰
- [ ] **De-duplicate header/footer** — 8 hand-copied headers/footers is the #1
  maintenance risk. Move to a tiny build (Eleventy/Astro) *or* a documented JS include
  partial. Keeps the "no build step" promise optional. 🧰✨
- [ ] **`LICENSE` + usage terms** — pick a license (commercial or MIT) so buyers know
  what they're allowed to do. Required for any marketplace. 💰

### Prove it's premium
- [ ] **Live demo** — deploy to GitHub Pages/Netlify and put the URL in the README.
  Buyers buy what they can click. 💰
- [ ] **Social/OG meta + preview image** — `og:image`, Twitter card, canonical URLs per
  page, plus a 1200×630 share image. Links look pro when shared. ✨💰

---

## P1 — Should have

### Conversion & trust
- [ ] Move a condensed **reviews + star rating strip** above the fold on the home hero. 🎯
- [ ] **Objection-handling near the booking CTA** — mini-FAQ / "no payment today" /
  guarantee badge repeated at the point of decision. 🎯
- [ ] **"Request a callback" mini-form** in the footer of every page (name + phone). 🎯
- [ ] **Seasonal / geo banner** — configurable ("Mosquito season is here"). 🎯🧰
- [ ] **Form UX** — submitting spinner state, inline success toast, and a honeypot
  spam-trap field on both forms. ✨🎯
- [ ] **Trust badges row** — licensed/insured, BBB, Google rating, payment logos. 🎯

### Quality & performance
- [ ] **Self-host the fonts** (subset + `woff2`) — removes the external Google Fonts
  request; faster, GDPR-friendlier. ✨
- [ ] **Production build** — minify CSS/JS, add cache headers, compress images. Target
  **Lighthouse 95+** on all four scores (a great selling point). ✨💰
- [ ] **`sitemap.xml` + `robots.txt`** — basic SEO hygiene. ✨
- [ ] **404 page** on-brand. ✨🧰
- [ ] **Cross-browser/device QA** — Safari (iOS), Firefox, Edge; test the booking wizard
  and review filter on real devices. ✨
- [ ] **Accessibility audit** — run axe/Lighthouse a11y; verify focus trap in the mobile
  menu, color-contrast on gold stars & muted text, and keyboard flow through booking. ✨

### Ease of use
- [ ] **Customization guide** — short doc/video: change brand, colors, plans, copy,
  images, and wire a form. Reduces support requests → better reviews → more sales. 🧰💰
- [ ] **2–3 color theme presets** — e.g. "royal blue" (current), "forest green",
  "charcoal + amber" as swappable token sets. 🧰💰

---

## P2 — Polish & upside

- [ ] **Blog / resources section** (SEO engine: "how to get rid of ants", etc.). 🎯💰
- [ ] **Service-area / locations page** with an embedded map + local landing pages
  (huge for local SEO). 🎯💰
- [ ] **Instant-quote / price-estimator** widget (home size → ballpark). 🎯
- [ ] **Live chat / SMS** slot. 🎯
- [ ] **Financing calculator** on the termite plan. 🎯
- [ ] **Multi-language** scaffold. 🧰💰
- [ ] **Cookie/consent banner** (needed once analytics is on). ✨
- [ ] **CHANGELOG.md + versioning** for template updates. 💰
- [ ] **Marketplace assets** — screenshots, feature list, listing copy, cover image. 💰

---

## Suggested first sprint

If the goal is "list it and start selling," do in order:
1. One-file brand config + de-dupe header/footer (makes everything else cheaper) 🧰
2. Structured data + OG meta + analytics (SEO/measurement foundation) 🎯✨
3. Sticky mobile CTA + promo module + reviews-above-fold (the conversion trio) 🎯
4. Self-host fonts + minify → Lighthouse 95+ (the quality proof) ✨
5. Live demo + LICENSE + screenshots (the sellable package) 💰
