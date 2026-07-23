# Blood Bank & Transfusion Medicine — Resident Reference

An onboarding + clinical decision-support dashboard for pathology residents on the **Henry Ford Pathology Residency** transfusion medicine / blood bank rotation. It has two layers:

1. **Foundations** — a resident-level orientation to the three pillars (blood bank, coagulation, apheresis), with interactive cases, a quiz center, a glossary, and a recap.
2. **Clinical reference & decision support** — six interactive tools (reference only; no case logging, no patient data):

| Tab | What it does |
|---|---|
| **Platelet requests** | Approval / appropriateness engine — indication + setting + platelet band → approve / not-indicated note against AABB/BSH thresholds. |
| **Transfusion reactions** | Sign + clerical/DAT/ABO workup → triages AHTR · FNHTR · TACO · TRALI · allergic · septic · delayed, with next steps; plus a searchable 14-reaction catalog. |
| **ASFA guidelines** | All 166 ASFA 9th-ed. (2023) indications — searchable, category-filterable, click a row for prescription details. |
| **Blood for the OR (MSBOS)** | HFHS Surgical Blood Ordering Schedule + Hgb adjustment + alloantibody antigen-negative frequencies (linkage-aware Rh, White donor pool) + recipient-ABO donor-pool sizing → crossmatch recommendation + donor-screening burden. |
| **Antibody panel ID** | Structured workup composer + the quick method for reading a panel. |
| **Therapeutic apheresis** | Searchable ASFA lookup that auto-fills category/grade/procedure/course → copy a consult or progress note. |

## 📦 Handing this off / hosting it yourself

**See [`HANDOFF.md`](HANDOFF.md)** — a step-by-step, non-technical guide (no coding, browser only) for putting this dashboard on your **own** free GitHub account with a live web link, so it runs independently of anyone else.

## ⚠️ Scope & safety

- **Institutional content.** Embeds the HFHS MSBOS (policy `PCR-PALM-TRM-5.050`) and local approval logic. It is institutional clinical-reference material (not PHI). Verify against current policy before clinical use.
- **No patient data.** Reference only — the composers build copy-ready note *skeletons* in-memory; nothing is stored or transmitted.
- **Decision support, not protocol.** MSBOS is institution-specific; ASFA follows the 9th ed. (2023); antigen frequencies are population estimates (standardized on the White donor pool). The attending / blood bank physician is the final decision-maker.

## File structure

Two pages, switched by the **Education | Tools** tabs in the header:

```
.
├── index.html                     # EDUCATION page — pillars, cases, quiz, glossary, recap
├── tools.html                     # TOOLS page — the clinical calculators / decision support
├── assets/
│   ├── app.css                    # shared design system (restyle both pages here)
│   ├── shell.js                   # shared chrome: theme, nav, scroll-spy, reveal
│   ├── education.js               # question bank, cases, glossary + their renderers
│   └── reference/
│       ├── refdata.js             # clinical knowledge (MSBOS, ASFA, panels, reactions) — edit to update
│       ├── abo.data.js            # ABO donor prevalences (editable)
│       ├── engine.js              # panel interpreter + MSBOS/Rh compute
│       ├── reference.js           # UI: platelet, transfusion reactions + catalog, ASFA
│       ├── reference2.js          # UI: MSBOS, antibody ID, apheresis note builder
│       └── calculators.js         # UI: PLASMIC score, blood & plasma volume
├── docs/  (setup & maintenance guide)   ·   HANDOFF.md   ·   PLANNING.md   ·   README.md
```

Splitting the pages keeps the on-call tools fast (the education page no longer loads the ~200 KB clinical dataset, and vice-versa) and gives residents a bookmarkable `tools.html`.

Everything is **vanilla JS + CSS** — no build step, no dependencies, no network calls. It runs equally as a hosted site or by opening `index.html` locally (double-click).

## Run it locally

```bash
python3 -m http.server 8147     # then visit http://localhost:8147
```
…or just double-click `index.html`.

## Edit the clinical knowledge

Clinical data lives in `assets/reference/refdata.js` (`window.TMREF` — `bloodprep`, `asfaInd`, `asfaProto`, `txn`, `plateletPanel`, `tmPanel`) and `abo.data.js`. Edit the values to refine a threshold, add a surgery, or update an ASFA row. Review any clinical-data change with the blood bank before use.

## Deploy

**Live (reference copy):** https://omarzbaba.github.io/transfusion-medicine-resident-reference/ — public GitHub Pages (`main` / root). To run your own independent copy, follow [`HANDOFF.md`](HANDOFF.md).

## Credits

**Created by Omar Z. Baba, MD** — Clinical Pathologist · Pathology Informaticist · Clinical Pathology Resident, PGY-III · Department of Pathology & Laboratory Medicine, Henry Ford Health.

© 2026 Omar Z. Baba, MD. All rights reserved. Made available for educational and clinical-reference use within the Henry Ford Pathology Residency — see [`LICENSE`](LICENSE). Commercial use or redistribution requires prior written permission.
