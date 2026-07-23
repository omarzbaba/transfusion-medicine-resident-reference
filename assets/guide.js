/* ============================================================================
   guide.js — first-visit welcome tour + "what's new" release notes.

   Behaviour, all driven by assets/updates.js:
     - Never used it before        -> the welcome guide (4 short steps)
     - Used an older version       -> "What's new" listing everything since
     - Up to date                  -> nothing
     - The ? button in the header  -> reopens the welcome guide anytime

   Runs on both pages. Self-contained: no dependency on the tool helpers.
   ============================================================================ */
(function () {
  "use strict";

  var KEY = "tm-seen-version";
  var U = window.TMUPDATES || { version: "0", releases: [] };

  /* ---------------- tiny DOM helper (standalone) ---------------- */
  function el(tag, attrs) {
    var n = document.createElement(tag);
    attrs = attrs || {};
    for (var k in attrs) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k === "on") { for (var e in v) n.addEventListener(e, v[e]); }
      else n.setAttribute(k, v);
    }
    for (var i = 2; i < arguments.length; i++) add(n, arguments[i]);
    return n;
  }
  function add(n, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { add(n, x); }); return; }
    n.appendChild(typeof c === "object" ? c : document.createTextNode(String(c)));
  }
  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function seen() { try { return localStorage.getItem(KEY); } catch (e) { return "skip"; } }

  /* ---------------- welcome tour content ---------------- */
  function bullets(items) {
    var ul = el("ul", { class: "gd-list" });
    items.forEach(function (t) { ul.appendChild(el("li", {}, t)); });
    return ul;
  }
  var TOUR = [
    { kicker: "Welcome", title: "Your blood bank rotation, in one place",
      build: function () {
        return [
          el("p", {}, "This is a working reference for the transfusion medicine and blood bank rotation — built by residents, for residents."),
          el("p", {}, "It has two halves. ", el("strong", {}, "Education"), " teaches the foundations. ", el("strong", {}, "Tools"), " is what you actually open when you're on call. Switch between them with the tabs at the top of the page."),
          el("p", { class: "muted-note" }, "Takes about a minute to skim this guide. You can reopen it anytime from the ? button in the header.")
        ];
      } },
    { kicker: "Step 1 of 3", title: "Education — learn the framework",
      build: function () {
        return [
          el("p", {}, "Start here if the rotation is new to you. It's built to be read top to bottom, or dipped into."),
          bullets([
            "Three foundations: blood bank, coagulation, and apheresis.",
            "Interactive cases that reveal one step at a time — decide before you peek.",
            "A scored quiz where every answer is explained, including why the wrong ones are wrong.",
            "A searchable glossary and a final recap of the highest-yield points."
          ])
        ];
      } },
    { kicker: "Step 2 of 3", title: "Tools — what you open on call",
      build: function () {
        return [
          el("p", {}, "Seven interactive tools. Set the clinical context and each one builds a copy-ready answer."),
          el("div", { class: "gd-group" }, "Blood bank"),
          bullets([
            "Platelet request — approve / not indicated against standard thresholds.",
            "Transfusion reaction — triages AHTR, TACO, TRALI, septic and more.",
            "Blood for the OR — the MSBOS, with antigen-negative and ABO donor-pool maths.",
            "Antibody panel ID — a structured workup plus how to read a panel."
          ]),
          el("div", { class: "gd-group" }, "Apheresis"),
          bullets(["Apheresis & ASFA — a consult note builder over all 166 ASFA indications."]),
          el("div", { class: "gd-group" }, "Calculators"),
          bullets([
            "PLASMIC score — TTP probability, one click per criterion.",
            "Blood & plasma volume — with plasma-exchange dosing."
          ])
        ];
      } },
    { kicker: "Step 3 of 3", title: "Using it safely",
      build: function () {
        return [
          el("p", {}, "This is ", el("strong", {}, "decision support, not a protocol."), " It's built for a trained resident or physician who is already reasoning about the case."),
          bullets([
            "The MSBOS is institution-specific; ASFA follows the 9th edition (2023); donor frequencies are population estimates.",
            "Verify against current institutional policy before acting on a patient.",
            "The attending / blood bank physician is always the final decision-maker."
          ]),
          el("p", { class: "muted-note" }, "The footer shows when the clinical content was last reviewed. Reopen this guide anytime from the ? button.")
        ];
      } }
  ];

  /* ---------------- modal shell ---------------- */
  var openEl = null, lastFocus = null;

  function close() {
    if (!openEl) return;
    var b = openEl; openEl = null;
    b.classList.remove("in");
    store(U.version);
    setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 220);
    document.removeEventListener("keydown", onKey);
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }
  function onKey(e) {
    if (e.key === "Escape") { close(); return; }
    if (e.key !== "Tab" || !openEl) return;
    var f = openEl.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function shell(labelId) {
    var backdrop = el("div", { class: "gd-backdrop", role: "dialog", "aria-modal": "true", "aria-labelledby": labelId,
      on: { click: function (e) { if (e.target === backdrop) close(); } } });
    var modal = el("div", { class: "gd-modal" });
    backdrop.appendChild(modal);
    lastFocus = document.activeElement;
    document.body.appendChild(backdrop);
    requestAnimationFrame(function () { backdrop.classList.add("in"); });
    document.addEventListener("keydown", onKey);
    openEl = backdrop;
    return modal;
  }

  /* ---------------- the welcome tour ---------------- */
  function openTour() {
    if (openEl) close();
    var i = 0;
    var modal = shell("gd-title");
    var head = el("div", { class: "gd-head" });
    var kicker = el("span", { class: "gd-kicker" });
    head.appendChild(kicker);
    head.appendChild(el("button", { class: "gd-close", type: "button", "aria-label": "Close", on: { click: close } }, "✕"));
    var body = el("div", { class: "gd-body" });
    var h = el("h2", { id: "gd-title" });
    var content = el("div", { class: "gd-content" });
    body.appendChild(h); body.appendChild(content);
    var dots = el("div", { class: "gd-dots" });
    var backBtn = el("button", { class: "btn btn--ghost btn--sm", type: "button", on: { click: function () { if (i > 0) { i--; draw(); } } } }, "Back");
    var nextBtn = el("button", { class: "btn btn--primary btn--sm", type: "button",
      on: { click: function () { if (i < TOUR.length - 1) { i++; draw(); } else close(); } } }, "Next");
    var foot = el("div", { class: "gd-foot" }, dots, el("div", { class: "gd-actions" }, backBtn, nextBtn));
    modal.appendChild(head); modal.appendChild(body); modal.appendChild(foot);

    function draw() {
      var step = TOUR[i];
      kicker.textContent = step.kicker;
      h.textContent = step.title;
      while (content.firstChild) content.removeChild(content.firstChild);
      add(content, step.build());
      while (dots.firstChild) dots.removeChild(dots.firstChild);
      TOUR.forEach(function (_, n) { dots.appendChild(el("span", { class: "gd-dot" + (n === i ? " on" : "") })); });
      backBtn.style.visibility = i === 0 ? "hidden" : "visible";
      nextBtn.textContent = i === TOUR.length - 1 ? "Get started" : "Next";
      body.scrollTop = 0;
    }
    draw();
    nextBtn.focus();
  }

  /* ---------------- what's new ---------------- */
  function releasesSince(v) {
    var rel = U.releases || [];
    for (var i = 0; i < rel.length; i++) if (rel[i].v === v) return rel.slice(0, i);
    return rel.slice(0, 1); // unknown/old version — just show the latest
  }
  function openWhatsNew(list) {
    if (openEl) close();
    var modal = shell("gd-title");
    var head = el("div", { class: "gd-head" },
      el("span", { class: "gd-kicker" }, "What's new"),
      el("button", { class: "gd-close", type: "button", "aria-label": "Close", on: { click: close } }, "✕"));
    var content = el("div", { class: "gd-content" });
    list.forEach(function (r) {
      var box = el("div", { class: "gd-rel" },
        el("h3", {}, r.title || ("Version " + r.v)),
        el("div", { class: "gd-when" }, "Version " + r.v + " · " + (r.date || "")));
      box.appendChild(bullets(r.items || []));
      content.appendChild(box);
    });
    var body = el("div", { class: "gd-body" }, el("h2", { id: "gd-title" }, "The dashboard has been updated"), content);
    var okBtn = el("button", { class: "btn btn--primary btn--sm", type: "button", on: { click: close } }, "Got it");
    var tourBtn = el("button", { class: "btn btn--ghost btn--sm", type: "button", on: { click: function () { close(); setTimeout(openTour, 240); } } }, "Take the tour");
    var foot = el("div", { class: "gd-foot" }, el("div", {}), el("div", { class: "gd-actions" }, tourBtn, okBtn));
    modal.appendChild(head); modal.appendChild(body); modal.appendChild(foot);
    okBtn.focus();
  }

  /* ---------------- boot ---------------- */
  function boot() {
    var btn = document.getElementById("guideBtn");
    if (btn) btn.addEventListener("click", openTour);

    var s = seen();
    if (s === "skip") return;               // storage unavailable — never nag
    if (!s) { openTour(); return; }         // first visit
    if (s !== U.version) {
      var list = releasesSince(s);
      if (list.length) openWhatsNew(list); else store(U.version);
    }
  }

  window.TMGUIDE = { open: openTour, whatsNew: function () { openWhatsNew((U.releases || []).slice(0, 1)); } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
