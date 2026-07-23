/* ============================================================================
   updates.js — the version number and release notes shown to users.

   WHEN YOU SHIP A CHANGE:
     1. Add a new entry at the TOP of `releases` (newest first).
     2. Set `version` to match that new entry's `v`.
   Anyone who last used an older version gets a "What's new" pop-up listing
   everything released since. First-time visitors get the welcome guide instead.
   ============================================================================ */
window.TMUPDATES = {
  version: "1.2.0",
  releases: [
    {
      v: "1.2.0",
      date: "July 2026",
      title: "Tools split out, and three new calculators",
      items: [
        "Split into two pages — Education and Tools — with a switch at the top, so the on-call tools aren't buried in the teaching material.",
        "New PLASMIC score calculator for TTP, with one-click criteria and a live risk band.",
        "New blood & plasma volume calculator, including plasma-exchange dosing at 1.0 and 1.5 plasma volumes.",
        "ASFA guidelines and therapeutic apheresis are now one place: Apheresis & ASFA.",
        "Clinical constants independently re-verified against the primary sources (PLASMIC, Nadler)."
      ]
    },
    {
      v: "1.1.0",
      date: "June 2026",
      title: "Sharper blood-prep maths and a sturdier build",
      items: [
        "Blood for the OR now accounts for the ABO-compatible donor pool, not just antigen-negative frequency.",
        "Donor frequencies standardised on the White donor population.",
        "The dashboard now fails visibly rather than blankly — a bad data edit shows a plain message instead of a blank page."
      ]
    },
    {
      v: "1.0.0",
      date: "June 2026",
      title: "First release",
      items: [
        "Foundations: blood bank, coagulation, and apheresis, with cases, a scored quiz, and a glossary.",
        "Reference tools: platelet approval, transfusion-reaction workup, ASFA, MSBOS blood prep, and antibody panel ID."
      ]
    }
  ]
};
