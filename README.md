# Perimeter — Pest Control Website Template

A clean, responsive marketing + booking template for a pest control company.
No build step: plain HTML, one token-driven CSS system, and light vanilla JS.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero with a **"See our plans"** CTA, trust strip, plan preview, 4-step process, guarantee, seasonal pest calendar, CTA band. |
| `plans.html` | Full plan detail (Home Protection · Yard Enjoyment · Termite Defense), "every plan includes" band, FAQ. |
| `booking.html` | Guided 4-step booking UI (plan → property → schedule → confirm) with a live summary rail. |
| `about.html` | Story, values, by-the-numbers, team, and credentials. |
| `contact.html` | Contact form (validated, with success state) + direct-contact card. |

`Reviews` / `Careers` are still marked **soon** in the footer — stubs to build next.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

Fonts (Bricolage Grotesque, Instrument Sans, IBM Plex Mono) load from Google Fonts;
offline they fall back to system sans/mono gracefully.

## Customize

- **Brand & colors** — every color, font, radius, and spacing value is a CSS custom
  property at the top of [`assets/css/styles.css`](assets/css/styles.css) under `:root`.
  Change `--brand` to re-skin the whole site. `--safe` (emerald) is reserved for the
  "guaranteed / safe for kids & pets" moments only.
- **Company name** — search for `Perimeter` / `Perimeter Pest Control`, the phone
  `(800) 555-0199`, and `hello@perimeterpest.com`.
- **Plans** — plan content lives in the `.plan` cards in `index.html` and `plans.html`.
  The booking plan options are the `<label class="choice choice-plan">` blocks in
  `booking.html`.
- **Booking** — [`assets/js/booking.js`](assets/js/booking.js) handles step
  navigation, validation, the live summary, and the success screen. It does **not**
  submit anywhere yet — wire the `form.submit` handler to your CRM / email endpoint.
  A plan can be pre-selected via `booking.html?plan=yard-enjoyment`; you can deep-link
  a step with `&step=3`.

## Accessibility

Semantic landmarks, a single `h1` per page, a skip link, labels on every control,
`aria-label`s on icon-only buttons, visible focus rings, and `prefers-reduced-motion`
is honored throughout.

> Demo copy. `Sentricon®` is a trademark of its respective owner.
