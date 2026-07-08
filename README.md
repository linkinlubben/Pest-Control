# Perimeter — Pest Control Website Template

A clean, responsive marketing + booking template for a pest control company.
No build step: plain HTML, one token-driven CSS system, and light vanilla JS.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero with a **"See our plans"** CTA, trust strip, plan preview, 4-step process, guarantee, seasonal pest calendar, CTA band. |
| `plans.html` | Full plan detail (Home Protection · Yard Enjoyment · Termite Defense), "every plan includes" band, FAQ. |
| `booking.html` | Guided 4-step booking UI (plan → property → schedule → confirm) with a live summary rail. |
| `about.html` | Story, founder quote, values, by-the-numbers, story timeline, team, credentials. |
| `contact.html` | Contact form (validated, with success state) + direct-contact card. |
| `pests.html` | Pest field guide — 8 pest profiles (signs, why it matters, which plan). |
| `reviews.html` | Rating breakdown + filterable wall of reviews (`reviews.js`). |
| `careers.html` | Perks, open roles (Apply → mailto), hiring steps, team quote. |

The home page also carries a "Spot the signs" teaser and customer reviews; the plans page adds a Perimeter-vs-one-off-vs-DIY comparison table. All eight pages are live — no `soon` stubs remain. Reviews and Careers live in the footer (the top nav is kept to six items).

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

Fonts (Bricolage Grotesque, Instrument Sans, IBM Plex Mono) load from Google Fonts;
offline they fall back to system sans/mono gracefully.

## Verify (screenshots + checks)

A Puppeteer-driven loop renders and tests the whole site:

```bash
npm install      # once (uses your installed Chrome via puppeteer-core — no big download)
npm run verify
```

It screenshots every page at **mobile / tablet / desktop** into `shots/` for eyeballing,
and asserts: no console errors, no horizontal overflow, no broken internal links or
assets, both forms reach success (and an empty contact submit is blocked), and the
reviews filter works. Exit code is non-zero on any failure, so it drops straight into CI
later. Set `CHROME_PATH=/path/to/chrome` if Chrome isn't found automatically.

## Customize

- **Brand & colors** — every color, font, radius, and spacing value is a CSS custom
  property at the top of [`assets/css/styles.css`](assets/css/styles.css) under `:root`.
  Change `--brand` to re-skin the whole site. `--safe` (emerald) is reserved for the
  "guaranteed / safe for kids & pets" moments only.
- **Company name** — search for `Perimeter` / `Perimeter Pest Control`, the phone
  `(800) 555-0199`, and `hello@perimeterpest.com`.
- **Domain** — the site uses `https://perimeterpest.com` as a placeholder in every
  canonical URL, Open Graph tag, `sitemap.xml`, `robots.txt`, and JSON-LD block.
  **Replace it with your real domain before launch** (a single find-and-replace).
- **Legal pages** — `privacy.html`, `terms.html`, and `cookies.html` are sample text
  with `[bracketed placeholders]`. Fill them in and have them reviewed by counsel.
- **Header & footer** — shared across all pages. Edit once in
  [`partials/header.html`](partials/header.html) / [`partials/footer.html`](partials/footer.html),
  then run **`npm run build`** to sync them into every page (output stays plain static
  HTML; the active nav item is stamped per page automatically).
- **Images** — the home illustration is [`assets/img/protected-home.svg`](assets/img/protected-home.svg).
  Photo slots use `.media` with a branded placeholder — swap in a real photo by adding
  `<img src="…" alt="…">` inside the `.media` element (e.g. the "Team photo" slot on About).
- **Plans** — plan content lives in the `.plan` cards in `index.html` and `plans.html`.
  The booking plan options are the `<label class="choice choice-plan">` blocks in
  `booking.html`.
- **Booking** — [`assets/js/booking.js`](assets/js/booking.js) handles step
  navigation, validation, the live summary, and the success screen. A plan can be
  pre-selected via `booking.html?plan=yard-enjoyment`; deep-link a step with `&step=3`.

## Integration points

By design, this template ships **front-end only** — forms validate and show a success
state client-side but don't send anything yet. That's intentional: it keeps the template
tool-agnostic so you can connect whatever stack you already use. Each seam is one small,
clearly-marked handler:

| Where | File | Hook it to |
| --- | --- | --- |
| Booking request | `assets/js/booking.js` (`form.addEventListener("submit", …)`) | Your scheduler/CRM (Jobber, Housecall Pro, ServiceTitan), or Formspree / Netlify Forms / a Zapier webhook |
| Contact message | `assets/js/contact.js` (submit handler) | Same as above, or a plain email endpoint |
| Careers "Apply" | `mailto:careers@…` links in `careers.html` | An ATS/job board, or leave as mailto |
| Reviews | static cards in `reviews.html` | Optionally pull live from the Google Places API |
| Analytics | none yet | Add GA4 / Meta Pixel and fire events on Book / Call / submit |

### Going live — just paste your keys

The plumbing is already built. Everything is driven from one file,
[`assets/js/config.js`](assets/js/config.js) — no other code changes:

| Config value | What to paste | Effect |
| --- | --- | --- |
| `bookingEndpoint` / `contactEndpoint` | A Formspree form URL, webhook, or CRM endpoint | Forms `POST` JSON there with a sending → success (or error) state. Blank = demo mode. |
| `analyticsId` | Your GA4 Measurement ID (`G-…`) | Analytics loads automatically and fires `book_click`, `phone_click`, and `*_submit` events. |
| `recaptchaSiteKey` | *(optional)* reCAPTCHA v3 site key | Adds a token to submissions. A honeypot field already blocks basic spam with no key. |

Both forms already validate, show a spinner while sending, and surface a friendly error
if the endpoint fails. See [`ROADMAP.md`](ROADMAP.md) for the full quality/conversion checklist.

## SEO &amp; metadata

Every page ships search-ready:

- Unique `<title>` + meta description, **canonical**, **Open Graph**, and **Twitter
  card** tags, all pointing at a branded 1200×630 share image (`assets/og/og-default.png`).
- **JSON-LD structured data**: `LocalBusiness` (home/contact) with aggregate rating,
  `FAQPage` (plans), `AggregateRating` + `Review` (reviews), and `JobPosting` (careers)
  — the markup Google uses for rich results.
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, and an SVG favicon.
- A `noindex` on-brand `404.html`, plus `privacy.html` / `terms.html` / `cookies.html`.

After launch, submit `sitemap.xml` in Google Search Console and validate the structured
data with Google's Rich Results Test.

## Accessibility

Semantic landmarks, a single `h1` per page, a skip link, labels on every control,
`aria-label`s on icon-only buttons, visible focus rings, and `prefers-reduced-motion`
is honored throughout.

> Demo copy. `Sentricon®` is a trademark of its respective owner.
