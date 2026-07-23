/* ============================================================================
   calculators.js — PLASMIC score (TTP) and blood / plasma volume.
   Pure client-side; nothing entered here is stored or transmitted.

   CLINICAL CONSTANTS live in the two blocks marked "DATA" below — edit those to
   adjust thresholds or interpretation bands.
   ============================================================================ */
(function () {
  "use strict";
  var RUI = window.TMREFUI;
  if (!RUI) { if (window.console) console.error("TMREFUI missing — calculators not loaded"); return; }
  var el = RUI.el, clear = RUI.clear, seg = RUI.seg, field = RUI.field, copyText = RUI.copyText;

  /* ==========================================================================
     DATA — PLASMIC score (Bendapudi et al., Lancet Haematol 2017)
     Seven variables, 1 point each. Note: items 3 and 4 score a point for the
     ABSENCE of the feature — the labels below are written as the scoring
     condition, so "Yes" always means +1.
     ========================================================================== */
  var PLASMIC_ITEMS = [
    { id: "plt",    label: "Platelet count < 30 ×10⁹/L",
      help: "Point if the platelet count is below 30." },
    { id: "hem",    label: "Evidence of hemolysis",
      help: "Reticulocytes > 2.5%, OR undetectable haptoglobin, OR indirect bilirubin > 2.0 mg/dL." },
    { id: "nocx",   label: "No active cancer in the past year",
      help: "Point if the patient does NOT have active cancer." },
    { id: "notx",   label: "No history of solid-organ or stem-cell transplant",
      help: "Point if the patient has NOT had a transplant." },
    { id: "mcv",    label: "MCV < 90 fL",
      help: "Mean corpuscular volume below 90 femtolitres." },
    { id: "inr",    label: "INR < 1.5",
      help: "International normalized ratio below 1.5." },
    { id: "cr",     label: "Creatinine < 2.0 mg/dL",
      help: "Serum creatinine below 2.0 mg/dL (≈177 µmol/L)." }
  ];
  var PLASMIC_BANDS = [
    { max: 4, key: "low",  name: "Low risk (0–4)",
      text: "Severe ADAMTS13 deficiency is unlikely. Actively pursue alternative causes of thrombotic microangiopathy (e.g., DIC, complement-mediated HUS/aHUS, malignancy, drug- or transplant-associated TMA, severe hypertension).",
      action: "Plasma exchange is generally not indicated on this basis alone — but clinical judgement overrides the score." },
    { max: 5, key: "int",  name: "Intermediate risk (5)",
      text: "Indeterminate probability of severe ADAMTS13 deficiency. The score does not settle the question in this range.",
      action: "Send ADAMTS13 activity and consider empiric plasma exchange if clinical suspicion for TTP is meaningful — discuss with the apheresis/transfusion medicine physician now." },
    { max: 7, key: "high", name: "High risk (6–7)",
      text: "High probability of severe ADAMTS13 deficiency (TTP).",
      action: "Send ADAMTS13 activity and inhibitor, and start urgent therapeutic plasma exchange — do not wait for the ADAMTS13 result. Add corticosteroids; hold platelet transfusion unless there is life-threatening bleeding." }
  ];
  var PLASMIC_NOTE = "PLASMIC score — Bendapudi PK et al., Lancet Haematology 2017. Validated in adults with suspected thrombotic microangiopathy; it estimates the probability of severe ADAMTS13 deficiency and does not replace ADAMTS13 testing or clinical judgement.";

  function bandFor(score) {
    for (var i = 0; i < PLASMIC_BANDS.length; i++) if (score <= PLASMIC_BANDS[i].max) return PLASMIC_BANDS[i];
    return PLASMIC_BANDS[PLASMIC_BANDS.length - 1];
  }

  function renderPlasmic(mount) {
    var picks = {};   // id -> true/false/undefined
    var grid = el("div", { class: "ref-grid" });
    var left = el("div", { class: "ref-controls" });
    var right = el("div", { class: "ref-report surface", "aria-live": "polite" });
    grid.appendChild(left); grid.appendChild(right);
    clear(mount); mount.appendChild(grid);

    var card = el("div", { class: "surface ref-card" }, el("h4", {}, "Seven variables — one click each"));
    PLASMIC_ITEMS.forEach(function (it) {
      var row = el("div", { class: "calc-crit" });
      row.appendChild(el("div", { class: "calc-crit-l" },
        el("strong", {}, it.label), el("span", {}, it.help)));
      var opts = el("div", { class: "calc-opts" });
      [{ v: false, l: "No" }, { v: true, l: "Yes" }].forEach(function (o) {
        var b = el("button", { class: "calc-opt", type: "button", on: { click: function () {
          picks[it.id] = o.v;
          opts.querySelectorAll(".calc-opt").forEach(function (x) { x.classList.remove("sel"); });
          b.classList.add("sel"); draw();
        } } }, o.l, o.v ? el("em", {}, "+1") : null);
        opts.appendChild(b);
      });
      row.appendChild(opts);
      card.appendChild(row);
    });
    left.appendChild(card);

    function draw() {
      var answered = 0, score = 0;
      PLASMIC_ITEMS.forEach(function (it) {
        if (picks[it.id] !== undefined) { answered++; if (picks[it.id]) score++; }
      });
      clear(right);
      right.appendChild(el("div", { class: "ref-report-head" },
        el("span", { class: "kicker" }, "PLASMIC score"),
        el("button", { class: "btn btn--ghost btn--sm", type: "button",
          on: { click: function () { copyText(plasmicText(score, answered)); } } }, "Copy")));

      if (answered < PLASMIC_ITEMS.length) {
        right.appendChild(el("div", { class: "score-wrap" },
          el("div", {}, el("span", { class: "score-num" }, String(score)), el("span", { class: "score-den" }, " / 7")),
          el("p", { class: "muted-note", style: "margin-top:10px" },
            answered + " of " + PLASMIC_ITEMS.length + " answered — complete all seven for an interpretation.")));
        right.appendChild(el("p", { class: "ref-disclaimer" }, PLASMIC_NOTE));
        return;
      }
      var band = bandFor(score);
      right.appendChild(el("div", { class: "score-wrap" },
        el("div", {}, el("span", { class: "score-num" }, String(score)), el("span", { class: "score-den" }, " / 7")),
        el("div", {}, el("span", { class: "score-band band-" + band.key }, band.name))));
      var s1 = el("div", { class: "ref-sec" }, el("h5", {}, "Interpretation"));
      s1.appendChild(el("p", { style: "font-size:.88rem; line-height:1.5" }, band.text));
      right.appendChild(s1);
      var s2 = el("div", { class: "ref-sec" }, el("h5", {}, "What to do"));
      s2.appendChild(el("p", { style: "font-size:.88rem; line-height:1.5" }, band.action));
      right.appendChild(s2);
      right.appendChild(el("p", { class: "ref-disclaimer" }, PLASMIC_NOTE));
    }

    function plasmicText(score, answered) {
      var L = ["PLASMIC SCORE — probability of severe ADAMTS13 deficiency", ""];
      PLASMIC_ITEMS.forEach(function (it) {
        var v = picks[it.id];
        L.push("  " + (v === undefined ? "[ ? ]" : (v ? "[+1]" : "[ 0 ]")) + " " + it.label);
      });
      L.push("", "SCORE: " + score + " / 7" + (answered < 7 ? "  (incomplete — " + answered + "/7 answered)" : ""));
      if (answered === 7) {
        var b = bandFor(score);
        L.push("BAND: " + b.name, "", "INTERPRETATION", "  " + b.text, "", "WHAT TO DO", "  " + b.action);
      }
      L.push("", PLASMIC_NOTE);
      return L.join("\n");
    }
    draw();
  }

  /* ==========================================================================
     DATA — Blood & plasma volume
     Nadler's formula (Nadler, Hidalgo & Bloch, Surgery 1962):
       male   TBV(L) = 0.3669 * h^3 + 0.03219 * w + 0.6041
       female TBV(L) = 0.3561 * h^3 + 0.03308 * w + 0.1833
       h = height in METRES, w = weight in KILOGRAMS.
     Plasma volume = TBV * (1 - haematocrit fraction);  RBC volume = TBV * Hct.
     TPE removal fraction after n plasma volumes exchanged = 1 - e^(-n).
     ========================================================================== */
  var NADLER = {
    male:   { h3: 0.3669, w: 0.03219, c: 0.6041 },
    female: { h3: 0.3561, w: 0.03308, c: 0.1833 }
  };
  function tbvLitres(sex, heightM, weightKg) {
    var k = NADLER[sex] || NADLER.male;
    return k.h3 * Math.pow(heightM, 3) + k.w * weightKg + k.c;
  }

  function renderVolumes(mount) {
    var st = { sex: "male", h: "", hUnit: "cm", w: "", wUnit: "kg", hct: "" };

    var grid = el("div", { class: "ref-grid" });
    var left = el("div", { class: "ref-controls" });
    var right = el("div", { class: "ref-report surface", "aria-live": "polite" });
    grid.appendChild(left); grid.appendChild(right);
    clear(mount); mount.appendChild(grid);

    var card = el("div", { class: "surface ref-card" }, el("h4", {}, "Patient"));
    card.appendChild(field("Sex", seg([{ value: "male", label: "Male" }, { value: "female", label: "Female" }],
      st.sex, function (v) { st.sex = v; draw(); }), "Nadler's formula uses sex-specific coefficients."));

    function numRow(labelText, key, unitKey, units, placeholder, help) {
      var input = el("input", { class: "ref-input", type: "number", inputmode: "decimal", min: "0",
        placeholder: placeholder, on: { input: function () { st[key] = input.value; draw(); } } });
      var wrap = el("div", { class: "calc-num" }, input);
      if (units) {
        wrap.appendChild(seg(units.map(function (u) { return { value: u, label: u }; }), st[unitKey],
          function (v) { st[unitKey] = v; draw(); }));
      }
      card.appendChild(field(labelText, wrap, help));
    }
    numRow("Height", "h", "hUnit", ["cm", "in"], "e.g. 175", null);
    numRow("Weight", "w", "wUnit", ["kg", "lb"], "e.g. 70", null);
    numRow("Hematocrit", "hct", null, null, "e.g. 30", "Enter as a percentage (e.g. 30 for 30%). Needed for plasma and red-cell volume.");
    left.appendChild(card);

    function fmt(n, d) { return n.toLocaleString(undefined, { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }

    function draw() {
      clear(right);
      var hRaw = parseFloat(st.h), wRaw = parseFloat(st.w), hctRaw = parseFloat(st.hct);
      var heightM = st.hUnit === "in" ? (hRaw * 2.54) / 100 : hRaw / 100;
      var weightKg = st.wUnit === "lb" ? wRaw * 0.45359237 : wRaw;

      right.appendChild(el("div", { class: "ref-report-head" },
        el("span", { class: "kicker" }, "Volumes"),
        el("button", { class: "btn btn--ghost btn--sm", type: "button",
          on: { click: function () { copyText(volText()); } } }, "Copy")));

      if (!(heightM > 0) || !(weightKg > 0)) {
        right.appendChild(el("p", { class: "muted-note" }, "Enter height and weight to calculate total blood volume. Add a hematocrit for plasma and red-cell volume."));
        right.appendChild(el("p", { class: "ref-disclaimer" }, volNote()));
        return;
      }
      var tbvL = tbvLitres(st.sex, heightM, weightKg);
      var tbvMl = tbvL * 1000;
      var out = el("div", { class: "calc-out" });
      out.appendChild(el("div", { class: "calc-cell hero" },
        el("strong", {}, fmt(tbvMl) + " mL"), el("span", {}, "Total blood volume (" + tbvL.toFixed(2) + " L · " + (tbvMl / weightKg).toFixed(0) + " mL/kg)")));

      var hctOk = hctRaw > 0 && hctRaw < 100;
      if (hctOk) {
        var hct = hctRaw / 100;
        var tpv = tbvMl * (1 - hct), rcv = tbvMl * hct;
        out.appendChild(el("div", { class: "calc-cell" }, el("strong", {}, fmt(tpv) + " mL"), el("span", {}, "Plasma volume")));
        out.appendChild(el("div", { class: "calc-cell" }, el("strong", {}, fmt(rcv) + " mL"), el("span", {}, "Red cell volume")));
        out.appendChild(el("div", { class: "calc-cell" }, el("strong", {}, fmt(tpv) + " mL"), el("span", {}, "1.0 plasma-volume exchange · removes ~63%")));
        out.appendChild(el("div", { class: "calc-cell" }, el("strong", {}, fmt(tpv * 1.5) + " mL"), el("span", {}, "1.5 plasma-volume exchange · removes ~78%")));
      }
      right.appendChild(out);

      if (!hctOk) right.appendChild(el("p", { class: "muted-note", style: "margin-top:10px" }, "Add a hematocrit (1–99%) for plasma volume, red-cell volume, and TPE exchange volumes."));
      else {
        var s = el("div", { class: "ref-sec" }, el("h5", {}, "Apheresis note"));
        s.appendChild(el("p", { style: "font-size:.86rem; line-height:1.5; color:var(--muted)" },
          "A standard therapeutic plasma exchange treats 1.0–1.5 plasma volumes. Removal of an intravascular substance follows 1 − e⁻ⁿ, so ~63% is removed at 1.0 PV and ~78% at 1.5 PV — beyond ~1.5 PV the added benefit falls off sharply."));
        right.appendChild(s);
      }
      right.appendChild(el("p", { class: "ref-disclaimer" }, volNote()));
    }

    function volNote() {
      return "Total blood volume by Nadler's formula (Surgery, 1962), using height in metres and weight in kilograms. " +
        "Plasma volume = blood volume × (1 − hematocrit). These are estimates for adults; they are not validated for children, " +
        "pregnancy, or extremes of body habitus — correlate clinically.";
    }
    function volText() {
      var hRaw = parseFloat(st.h), wRaw = parseFloat(st.w), hctRaw = parseFloat(st.hct);
      var heightM = st.hUnit === "in" ? (hRaw * 2.54) / 100 : hRaw / 100;
      var weightKg = st.wUnit === "lb" ? wRaw * 0.45359237 : wRaw;
      var L = ["BLOOD & PLASMA VOLUME", ""];
      L.push("Sex: " + st.sex + " · Height: " + (st.h || "—") + " " + st.hUnit + " · Weight: " + (st.w || "—") + " " + st.wUnit + " · Hct: " + (st.hct || "—") + "%");
      if (heightM > 0 && weightKg > 0) {
        var tbvMl = tbvLitres(st.sex, heightM, weightKg) * 1000;
        L.push("", "Total blood volume: " + fmt(tbvMl) + " mL (" + (tbvMl / 1000).toFixed(2) + " L; " + (tbvMl / weightKg).toFixed(0) + " mL/kg)");
        if (hctRaw > 0 && hctRaw < 100) {
          var tpv = tbvMl * (1 - hctRaw / 100);
          L.push("Plasma volume: " + fmt(tpv) + " mL");
          L.push("Red cell volume: " + fmt(tbvMl - tpv) + " mL");
          L.push("TPE 1.0 plasma volume: " + fmt(tpv) + " mL (removes ~63%)");
          L.push("TPE 1.5 plasma volumes: " + fmt(tpv * 1.5) + " mL (removes ~78%)");
        }
      }
      L.push("", volNote());
      return L.join("\n");
    }
    draw();
  }

  /* ---------------------------------------------------------------- boot */
  function boot() {
    var mount = (RUI && RUI.safeMount) ? RUI.safeMount : function (id, fn) {
      var m = document.getElementById(id); if (!m) return;
      try { fn(m); } catch (e) { if (window.console) console.error(id, e); }
    };
    mount("calc-plasmic", renderPlasmic);
    mount("calc-volumes", renderVolumes);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
