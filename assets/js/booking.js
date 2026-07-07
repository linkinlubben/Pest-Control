/* Perimeter Pest Control — booking wizard */
(function () {
  "use strict";

  var form = document.getElementById("bookingForm");
  if (!form) return;

  var PLAN_LABELS = {
    "home-protection": "Home Protection",
    "yard-enjoyment": "Yard Enjoyment",
    "termite-defense": "Termite Defense",
    "inspection": "Free inspection"
  };

  var panels = Array.prototype.slice.call(form.querySelectorAll(".step-panel"));
  var stepNodes = Array.prototype.slice.call(document.querySelectorAll("#stepper li:not(.rail-wrap)"));
  var backBtn = document.getElementById("backBtn");
  var nextBtn = document.getElementById("nextBtn");
  var confirmBtn = document.getElementById("confirmBtn");
  var TOTAL = panels.length;
  var current = 1;

  /* ---- Preselect plan from ?plan= ---- */
  var params = new URLSearchParams(window.location.search);
  var wantPlan = params.get("plan");
  if (wantPlan) {
    var preset = form.querySelector('input[name="plan"][value="' + wantPlan + '"]');
    if (preset) preset.checked = true;
  }

  /* ---- Date input: no earlier than today ---- */
  var dateInput = document.getElementById("date");
  if (dateInput) {
    var t = new Date();
    var iso = t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");
    dateInput.min = iso;
  }

  /* ---- Step display ---- */
  function showStep(n, doScroll) {
    current = Math.min(Math.max(n, 1), TOTAL);
    panels.forEach(function (p) {
      p.classList.toggle("is-active", Number(p.dataset.step) === current);
    });
    stepNodes.forEach(function (li, i) {
      var stepNum = i + 1;
      li.dataset.state = stepNum < current ? "done" : (stepNum === current ? "active" : "upcoming");
    });
    backBtn.hidden = current === 1;
    nextBtn.hidden = current === TOTAL;
    confirmBtn.hidden = current !== TOTAL;
    if (current === TOTAL) buildReview();
    if (doScroll) {
      var anchor = document.getElementById("bookingIntro");
      if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  /* ---- Validation helpers ---- */
  function setFieldError(fieldEl, isError) {
    if (fieldEl) fieldEl.classList.toggle("has-error", !!isError);
  }
  function valById(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function digits(v) { return (v.match(/\d/g) || []).length; }

  function validateStep(n) {
    var ok = true;
    var firstBad = null;
    function fail(el) { if (!firstBad && el) firstBad = el; ok = false; }

    if (n === 1) {
      var planPicked = form.querySelector('input[name="plan"]:checked');
      var planErr = document.getElementById("planError");
      planErr.classList.toggle("show", !planPicked);
      if (!planPicked) { fail(planErr); }
    }

    if (n === 2) {
      var address = document.getElementById("f-address");
      var addrBad = valById("address") === "";
      setFieldError(address, addrBad); if (addrBad) fail(address);

      var city = document.getElementById("f-city");
      var cityBad = valById("city") === "";
      setFieldError(city, cityBad); if (cityBad) fail(city);

      var zip = document.getElementById("f-zip");
      var zipBad = !/^\d{5}$/.test(valById("zip"));
      setFieldError(zip, zipBad); if (zipBad) fail(zip);

      var propPicked = form.querySelector('input[name="propertyType"]:checked');
      var propField = document.getElementById("propTypeGroup").closest(".field");
      setFieldError(propField, !propPicked); if (!propPicked) fail(propField);
    }

    if (n === 3) {
      var fn = document.getElementById("f-firstName");
      var fnBad = valById("firstName") === ""; setFieldError(fn, fnBad); if (fnBad) fail(fn);
      var ln = document.getElementById("f-lastName");
      var lnBad = valById("lastName") === ""; setFieldError(ln, lnBad); if (lnBad) fail(ln);
      var em = document.getElementById("f-email");
      var emBad = !isEmail(valById("email")); setFieldError(em, emBad); if (emBad) fail(em);
      var ph = document.getElementById("f-phone");
      var phBad = digits(valById("phone")) < 10; setFieldError(ph, phBad); if (phBad) fail(ph);
      var dt = document.getElementById("f-date");
      var dtVal = valById("date");
      var dtBad = dtVal === "" || (dateInput.min && dtVal < dateInput.min);
      setFieldError(dt, dtBad); if (dtBad) fail(dt);
      var winPicked = form.querySelector('input[name="window"]:checked');
      var winField = document.getElementById("windowGroup").closest(".field");
      setFieldError(winField, !winPicked); if (!winPicked) fail(winField);
    }

    if (n === 4) {
      var consent = document.getElementById("consent");
      var conField = document.getElementById("f-consent");
      setFieldError(conField, !consent.checked); if (!consent.checked) fail(conField);
    }

    if (!ok && firstBad) {
      firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
      var focusable = firstBad.querySelector("input, select, textarea");
      if (focusable) setTimeout(function () { focusable.focus({ preventScroll: true }); }, 300);
    }
    return ok;
  }

  /* ---- Live summary ---- */
  function fmtDate(v) {
    if (!v) return "";
    var parts = v.split("-");
    var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }
  function setSum(key, value) {
    var el = document.querySelector('[data-sum="' + key + '"]');
    if (!el) return;
    var has = value && value.length;
    el.textContent = has ? value : (key === "plan" ? "Not selected" : "—");
    el.classList.toggle("is-empty", !has);
  }
  function updateSummary() {
    var plan = form.querySelector('input[name="plan"]:checked');
    setSum("plan", plan ? PLAN_LABELS[plan.value] : "");
    setSum("cycle", plan ? plan.dataset.cycle : "");
    var propType = form.querySelector('input[name="propertyType"]:checked');
    var city = valById("city");
    var prop = "";
    if (propType) prop = propType.value + (city ? " · " + city : "");
    else if (city) prop = city;
    setSum("property", prop);
    setSum("date", fmtDate(valById("date")));
    var win = form.querySelector('input[name="window"]:checked');
    setSum("window", win ? win.value : "");
  }
  form.addEventListener("change", updateSummary);
  form.addEventListener("input", updateSummary);

  /* ---- Review recap (step 4) ---- */
  function checkedValues(name) {
    return Array.prototype.slice.call(form.querySelectorAll('input[name="' + name + '"]:checked')).map(function (i) { return i.value; });
  }
  function row(k, v) {
    return '<div class="sum-line"><span class="k">' + k + '</span><span class="v">' + (v || "—") + '</span></div>';
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }

  function collect() {
    var plan = form.querySelector('input[name="plan"]:checked');
    var propType = form.querySelector('input[name="propertyType"]:checked');
    var win = form.querySelector('input[name="window"]:checked');
    var concerns = checkedValues("concerns");
    return {
      plan: plan ? PLAN_LABELS[plan.value] : "",
      cycle: plan ? plan.dataset.cycle : "",
      name: (valById("firstName") + " " + valById("lastName")).trim(),
      email: valById("email"),
      phone: valById("phone"),
      address: valById("address"),
      cityzip: [valById("city"), valById("zip")].filter(Boolean).join(" "),
      propType: propType ? propType.value : "",
      size: valById("homeSize"),
      concerns: concerns.join(", "),
      date: fmtDate(valById("date")),
      window: win ? win.value : "",
      notes: valById("notes")
    };
  }

  function buildReview() {
    var d = collect();
    var html = "";
    html += row("Plan", esc(d.plan) + (d.cycle ? ' <span style="color:var(--slate);font-weight:400">· ' + esc(d.cycle) + "</span>" : ""));
    html += row("Name", esc(d.name));
    html += row("Contact", esc(d.email) + (d.phone ? " · " + esc(d.phone) : ""));
    html += row("Address", esc(d.address) + (d.cityzip ? ", " + esc(d.cityzip) : ""));
    html += row("Property", esc(d.propType) + (d.size ? " · " + esc(d.size) : ""));
    if (d.concerns) html += row("Concerns", esc(d.concerns));
    html += row("Date", esc(d.date));
    html += row("Window", esc(d.window));
    if (d.notes) html += row("Notes", esc(d.notes));
    document.getElementById("reviewRecap").innerHTML = html;
  }

  /* ---- Navigation ---- */
  nextBtn.addEventListener("click", function () {
    if (validateStep(current)) showStep(current + 1, true);
  });
  backBtn.addEventListener("click", function () { showStep(current - 1, true); });

  // clear a field's error as the user corrects it
  form.addEventListener("input", function (e) {
    var field = e.target.closest(".field");
    if (field && field.classList.contains("has-error")) field.classList.remove("has-error");
    if (e.target.name === "plan") document.getElementById("planError").classList.remove("show");
  });
  form.addEventListener("change", function (e) {
    if (e.target.name === "propertyType") { var f = document.getElementById("propTypeGroup").closest(".field"); if (f) f.classList.remove("has-error"); }
    if (e.target.name === "window") { var w = document.getElementById("windowGroup").closest(".field"); if (w) w.classList.remove("has-error"); }
    if (e.target.name === "consent") document.getElementById("f-consent").classList.remove("has-error");
  });

  /* ---- Submit ---- */
  var bookingError = document.getElementById("bookingFormError");

  function showBookingError(msg) {
    if (!bookingError) return;
    bookingError.textContent = msg;
    bookingError.classList.add("is-shown");
    bookingError.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function finishBooking(d, ref) {
    document.getElementById("doneName").textContent = valById("firstName") || "friend";
    var html = "";
    html += row("Reference", '<span style="font-family:var(--font-mono)">' + ref + "</span>");
    html += row("Plan", esc(d.plan));
    html += row("Date", esc(d.date) + (d.window ? " · " + esc(d.window) : ""));
    html += row("Address", esc(d.address) + (d.cityzip ? ", " + esc(d.cityzip) : ""));
    document.getElementById("doneRecap").innerHTML = html;
    document.getElementById("bookingLayout").style.display = "none";
    document.getElementById("bookingIntro").style.display = "none";
    var done = document.getElementById("bookingDone");
    done.classList.add("is-active");
    done.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // validate all steps in order; jump to the first that fails
    for (var s = 1; s <= TOTAL; s++) {
      if (!validateStep(s)) { showStep(s, true); return; }
    }
    var d = collect();
    var ref = "PPC-" + String(Math.floor(100000 + Math.random() * 900000));

    // Honeypot: a filled hidden field means a bot — accept quietly, don't send.
    var hp = form.querySelector('input[name="_gotcha"]');
    if (hp && hp.value) { finishBooking(d, ref); return; }
    if (bookingError) bookingError.classList.remove("is-shown");

    var payload = {
      form: "booking", reference: ref, plan: d.plan, billing: d.cycle,
      name: d.name, email: d.email, phone: d.phone,
      address: d.address, cityZip: d.cityzip, propertyType: d.propType, homeSize: d.size,
      concerns: d.concerns, date: d.date, arrivalWindow: d.window, notes: d.notes
    };

    window.ppcSubmitForm({
      endpoint: (window.PerimeterConfig || {}).bookingEndpoint,
      action: "booking",
      button: confirmBtn,
      loadingText: "Sending…",
      payload: payload,
      onSuccess: function () { finishBooking(d, ref); },
      onError: function () {
        showBookingError("Something went wrong sending your request. Please try again, or call us at (800) 555-0199.");
      }
    });
  });

  /* ---- Init ---- */
  updateSummary();
  var startStep = parseInt(params.get("step"), 10);
  showStep(startStep >= 1 && startStep <= TOTAL ? startStep : 1, false);
})();
