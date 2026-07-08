# Perimeter — Pest Control site starter

## What this is

A reusable, **per-client** marketing + booking website built as a static site. It is a
framework the owner **copies and customizes for each pest-control client** — it is *not*
a template being sold, and not a themed product. "Perimeter Pest Control" is placeholder
branding. Treat the codebase as a starting point that gets re-skinned and wired up per
client, not as a finished product.

Live demo: https://linkinlubben.github.io/Pest-Control/ (GitHub Pages, deploy-from-branch).

## Stack

- Plain **HTML + CSS + vanilla JS**. No framework, no bundler, no runtime dependencies.
  The deployed site is just static files.
- Node is used **only for dev tooling** (`scripts/build.mjs`, `scripts/verify.mjs`).
  The single dev dependency is `puppeteer-core`.
- Fonts from Google Fonts: **Bricolage Grotesque** (display), **Instrument Sans** (body),
  **IBM Plex Mono** (data/labels). They degrade to system sans/mono offline.

## Commands

```bash
npm run build     # sync partials/header + footer into every *.html, stamp active nav
npm run verify    # Puppeteer: screenshot every page ×3 widths + run assertions
npm run serve     # python3 -m http.server 8000
```

`npm run verify` screenshots each page at mobile/tablet/desktop into `shots/` and asserts:
no console errors, no horizontal overflow, no broken internal links/assets, both forms
reach success (and an empty contact submit is blocked), and the reviews filter works.
It needs a local Chrome — set `CHROME_PATH=/path/to/chrome` if it isn't auto-detected.

## Architecture & conventions

### Design tokens (re-theming)
Every color, font, radius, spacing, shadow, and easing value is a CSS custom property in
`:root` at the top of [`assets/css/styles.css`](assets/css/styles.css). **Re-theme by
editing tokens, not by hunting for literals.** Change `--brand` (#2C6BB6) to re-skin the
whole site. `--safe` (emerald #1FA971) is reserved for the "guaranteed / safe for kids &
pets" moments only; `--gold` is review stars only; `--danger` is comparison "no" + form
errors. When adding CSS, use existing tokens — don't hardcode a new hex/px if a token
fits. Spacing/sizing favors **increments of 8**.

### Shared header/footer — build step
The header and footer are single-sourced in [`partials/header.html`](partials/header.html)
and [`partials/footer.html`](partials/footer.html). **Never hand-edit the `<header>` /
`<footer>` block inside a page** — edit the partial, then run `npm run build`. The build
injects each partial between `<!-- @header -->…<!-- @/header -->` markers (or the raw
block on first run) and stamps `aria-current="page"` on the nav link whose `data-nav`
matches the page, via the `ACTIVE` map in `scripts/build.mjs`. Output stays plain static
HTML. Top nav is kept to six items; Reviews and Careers live in the footer.

### Integration config — one file
[`assets/js/config.js`](assets/js/config.js) is the **only** place keys/endpoints go
(`bookingEndpoint`, `contactEndpoint`, `analyticsId`, `recaptchaSiteKey`). It loads
before `main.js` on every page. **Blank value = safe "demo mode"** (forms show the
success screen without sending; analytics/reCAPTCHA stay off). Going live is meant to be
"just paste the keys" — no other code changes.

### Forms
`window.ppcSubmitForm(opts)` in [`assets/js/main.js`](assets/js/main.js) is the shared
submitter: no endpoint → demo mode; with endpoint → POSTs JSON with a sending →
success/error state, and adds a reCAPTCHA token when configured. Page handlers
[`booking.js`](assets/js/booking.js) / [`contact.js`](assets/js/contact.js) do their own
validation + honeypot check (`_gotcha`) first, then call it. Booking is a guided 4-step
UI (plan → property → schedule → confirm) with a live summary; deep-link via
`booking.html?plan=yard-enjoyment&step=3`.

### JS style
Vanilla, progressive enhancement. Each concern is an IIFE with `"use strict"`; ES5-flavored
(`var`, `.forEach`), no build/transpile. Everything degrades gracefully when a hook or
config value is absent. `main.js` holds: UI behaviors (sticky header, mobile menu, scroll
reveal), the integrations block (analytics/`ppcTrack`/`ppcRecaptcha`/`ppcSubmitForm`), and
the phone auto-formatter (`input[type="tel"]` → `123-456-7890`).

### SEO / metadata
Every page ships a full head: unique title + description, canonical, Open Graph, Twitter
card, and JSON-LD (`LocalBusiness`, `FAQPage`, `AggregateRating`+`Review`, `JobPosting`)
plus `sitemap.xml`, `robots.txt`, `site.webmanifest`, and `assets/icons/favicon.svg`.
Keep new pages consistent with this pattern.

### Signature motifs
The dashed "treated perimeter" line and the house-inside-a-dashed-circle brandmark
(header/footer SVG + favicon) are the visual identity. Preserve them when restyling.

## Placeholders — how to treat them

The following are **intentional placeholders** meant to be swapped per client, not bugs:
`perimeterpest.com` (canonical/OG/sitemap/robots/JSON-LD), the name `Perimeter`, phone
`(800) 555-0199`, `hello@perimeterpest.com`, the sample legal copy in
`privacy.html` / `terms.html` / `cookies.html` (`[bracketed]`), and the demo review/team
content. **Do not repeatedly warn about these** — the owner knows they change later. Give
**one consolidated pre-launch checklist only when the owner signals a client build is
done**, not scattered reminders throughout.

## Gotchas

- **Edit partials, then `npm run build`** — hand-edited header/footer in a page get
  overwritten, and skipping the build leaves pages stale.
- **Mobile screenshots need CDP device metrics.** Chrome headless enforces a ~500px min
  window width, so a 390px `--window-size` PNG crops a 500px layout (false "overflow").
  `verify.mjs` uses `Emulation.setDeviceMetricsOverride` for true mobile.
- **GitHub Pages = deploy-from-branch** (`main` / root) + `.nojekyll`. Do **not** add a
  `.github/workflows/*` Actions file — the auth token lacks `workflow` scope and the push
  is rejected. Manifest/asset paths are relative for this reason.

## Deferred / future

- **Higgsfield MCP imagery** (deferred by owner): once connected, generate on-brand
  pest-control photos and drop them into the `.media` photo slots (they already have a
  branded placeholder) and replace `assets/img/protected-home.svg`.
- See [`ROADMAP.md`](ROADMAP.md) for the quality/conversion/sellability checklist.
