/* Perimeter Pest Control — contact form (validation + success, no backend) */
(function () {
  "use strict";

  var form = document.getElementById("contactForm");
  if (!form) return;

  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function setError(fieldId, isError) {
    var f = document.getElementById(fieldId);
    if (f) f.classList.toggle("has-error", !!isError);
  }

  // Clear a field's error as the user corrects it
  form.addEventListener("input", function (e) {
    var field = e.target.closest(".field");
    if (field && field.classList.contains("has-error")) field.classList.remove("has-error");
  });
  form.addEventListener("change", function (e) {
    var field = e.target.closest(".field");
    if (field && field.classList.contains("has-error")) field.classList.remove("has-error");
  });

  var contactError = document.getElementById("contactFormError");
  var submitBtn = form.querySelector('button[type="submit"]');

  function showContactError(msg) {
    if (!contactError) return;
    contactError.textContent = msg;
    contactError.classList.add("is-shown");
    contactError.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function finishContact() {
    document.getElementById("doneName").textContent = val("firstName") || "friend";
    document.getElementById("contactGrid").style.display = "none";
    var done = document.getElementById("contactDone");
    done.classList.add("is-active");
    done.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var firstBad = null;
    function check(fieldId, bad) {
      setError(fieldId, bad);
      if (bad && !firstBad) firstBad = document.getElementById(fieldId);
      return !bad;
    }

    var ok = true;
    ok = check("c-firstName", val("firstName") === "") && ok;
    ok = check("c-lastName", val("lastName") === "") && ok;
    ok = check("c-email", !isEmail(val("email"))) && ok;
    ok = check("c-reason", val("reason") === "") && ok;
    ok = check("c-message", val("message") === "") && ok;
    ok = check("c-consent", !document.getElementById("consent").checked) && ok;

    if (!ok) {
      if (firstBad) {
        firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
        var focusable = firstBad.querySelector("input, select, textarea");
        if (focusable) setTimeout(function () { focusable.focus({ preventScroll: true }); }, 300);
      }
      return;
    }

    // Honeypot: a filled hidden field means a bot — accept quietly, don't send.
    var hp = form.querySelector('input[name="_gotcha"]');
    if (hp && hp.value) { finishContact(); return; }
    if (contactError) contactError.classList.remove("is-shown");

    var payload = {
      form: "contact",
      name: (val("firstName") + " " + val("lastName")).trim(),
      firstName: val("firstName"), lastName: val("lastName"),
      email: val("email"), phone: val("phone"),
      reason: val("reason"), message: val("message")
    };

    window.ppcSubmitForm({
      endpoint: (window.PerimeterConfig || {}).contactEndpoint,
      action: "contact",
      button: submitBtn,
      loadingText: "Sending…",
      payload: payload,
      onSuccess: finishContact,
      onError: function () {
        showContactError("Something went wrong sending your message. Please try again, or email hello@perimeterpest.com.");
      }
    });
  });
})();
