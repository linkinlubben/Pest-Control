/* =========================================================================
   Perimeter Pest Control — integration config
   -------------------------------------------------------------------------
   This is the ONE place you plug in your keys and endpoints. Paste a value
   to switch that integration on; leave it "" (blank) and that feature stays
   in safe "demo mode" (forms show the success screen without sending).

   Nothing else needs to change — the site reads these at runtime.
   ========================================================================= */
window.PerimeterConfig = {
  // Where booking requests are sent. Paste a Formspree form URL
  // (e.g. "https://formspree.io/f/abcdefg"), a webhook, or your CRM endpoint.
  bookingEndpoint: "",

  // Where contact messages are sent (same idea as above).
  contactEndpoint: "",

  // Google Analytics 4 Measurement ID, e.g. "G-XXXXXXXXXX".
  // When set, analytics loads automatically and fires book/call/submit events.
  analyticsId: "",

  // Optional: Google reCAPTCHA v3 site key for extra spam protection.
  // A honeypot field already runs with no key required.
  recaptchaSiteKey: ""
};
