/* Perimeter Pest Control — shared UI behaviors (progressive enhancement) */
(function () {
  "use strict";

  /* Sticky header shadow once scrolled */
  var header = document.getElementById("siteHeader");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Mobile menu toggle */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");
  if (toggle && menu) {
    var setOpen = function (open) {
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () {
      setOpen(!menu.classList.contains("is-open"));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* Scroll reveal */
  var reveals = document.querySelectorAll("[data-reveal]");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }
})();

/* =========================================================================
   Integrations — analytics, spam protection, and a shared form submitter.
   Reads assets/js/config.js. Everything degrades gracefully when unset.
   ========================================================================= */
(function () {
  "use strict";
  var CONFIG = window.PerimeterConfig || {};

  /* ---- Analytics (GA4) — loads only when a Measurement ID is provided ---- */
  window.ppcTrack = function (name, params) {
    try { if (typeof window.gtag === "function") window.gtag("event", name, params || {}); } catch (e) {}
  };
  if (CONFIG.analyticsId) {
    var ga = document.createElement("script");
    ga.async = true;
    ga.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(CONFIG.analyticsId);
    document.head.appendChild(ga);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", CONFIG.analyticsId);
  }

  /* ---- reCAPTCHA v3 (optional) ---- */
  if (CONFIG.recaptchaSiteKey) {
    var rc = document.createElement("script");
    rc.src = "https://www.google.com/recaptcha/api.js?render=" + encodeURIComponent(CONFIG.recaptchaSiteKey);
    document.head.appendChild(rc);
  }
  window.ppcRecaptcha = function (action) {
    return new Promise(function (resolve) {
      if (!CONFIG.recaptchaSiteKey || typeof grecaptcha === "undefined") return resolve(null);
      try {
        grecaptcha.ready(function () {
          grecaptcha.execute(CONFIG.recaptchaSiteKey, { action: action }).then(resolve, function () { resolve(null); });
        });
      } catch (e) { resolve(null); }
    });
  };

  /* ---- Conversion event tracking on key links ---- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (href.indexOf("tel:") === 0) window.ppcTrack("phone_click");
    else if (/booking\.html/.test(href)) window.ppcTrack("book_click");
  });

  /* ---- Shared form submitter --------------------------------------------
     opts: { endpoint, payload, button, action, onSuccess, onError }
     - No endpoint  -> "demo mode": fires onSuccess immediately (no network).
     - With endpoint -> POSTs JSON, shows a loading state, handles failure.
     Returns a Promise. Callers do their own validation + honeypot check first. */
  function setLoading(btn, on, loadingText) {
    if (!btn) return;
    if (on) {
      btn.setAttribute("data-prev-html", btn.innerHTML);
      btn.innerHTML = loadingText || "Sending…";
      btn.setAttribute("data-loading", "true");
      btn.disabled = true;
    } else {
      var prev = btn.getAttribute("data-prev-html");
      if (prev !== null) btn.innerHTML = prev;
      btn.removeAttribute("data-loading");
      btn.removeAttribute("data-prev-html");
      btn.disabled = false;
    }
  }

  window.ppcSubmitForm = function (opts) {
    var action = opts.action || "form";
    if (!opts.endpoint) {
      window.ppcTrack(action + "_submit", { mode: "demo" });
      return Promise.resolve().then(function () { opts.onSuccess && opts.onSuccess(); });
    }
    setLoading(opts.button, true, opts.loadingText);
    return (window.ppcRecaptcha ? window.ppcRecaptcha(action) : Promise.resolve(null))
      .then(function (token) {
        var body = opts.payload || {};
        if (token) body.recaptchaToken = token;
        return fetch(opts.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(body)
        });
      })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        setLoading(opts.button, false);
        window.ppcTrack(action + "_submit", { mode: "live" });
        opts.onSuccess && opts.onSuccess();
      })
      .catch(function (err) {
        setLoading(opts.button, false);
        opts.onError && opts.onError(err);
      });
  };
})();

/* =========================================================================
   Auto-format phone inputs as 123-456-7890 while typing
   ========================================================================= */
(function () {
  "use strict";
  function format(value) {
    var d = value.replace(/\D/g, "").slice(0, 10);
    if (d.length > 6) return d.slice(0, 3) + "-" + d.slice(3, 6) + "-" + d.slice(6);
    if (d.length > 3) return d.slice(0, 3) + "-" + d.slice(3);
    return d;
  }
  document.querySelectorAll('input[type="tel"]').forEach(function (el) {
    el.addEventListener("input", function () {
      var atEnd = el.selectionStart === el.value.length;
      var formatted = format(el.value);
      if (formatted === el.value) return;
      el.value = formatted;
      if (atEnd) el.setSelectionRange(formatted.length, formatted.length);
    });
  });
})();

