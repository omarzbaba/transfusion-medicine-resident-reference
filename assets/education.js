/* ============================================================================
   education.js — teaching content + interactions for the EDUCATION page:
   question bank, checkpoints, cases, glossary, and their renderers.
   Loaded only by index.html. Shared chrome lives in shell.js.
   ============================================================================ */
"use strict";
(function(){
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const KEYS = ['A','B','C','D','E'];
const PILLAR_NAME = { blood:'Blood bank', coag:'Coagulation', aph:'Apheresis' };

/* ============================================================
   DATA — QUESTIONS
   ============================================================ */
const QUESTIONS = [
  { id:'b1', pillar:'blood', diff:'easy',
    stem:'A 22-year-old woman arrives hypotensive and bleeding after a crash. There is no blood type on file and she is exsanguinating. What do you release first?',
    opts:['O-negative red cells (emergency release)','AB-positive red cells','Type-specific blood after a full crossmatch','The patient’s own banked autologous units'],
    answer:0,
    explain:'With no time to type, give uncrossmatched O red cells — O-negative for a woman of child-bearing potential — plus AB plasma. Lab testing catches up afterward.',
    wrong:'AB red cells are the universal recipient, not donor. A full crossmatch takes too long in hemorrhage, and she has no autologous units.',
    pearl:'O is the universal red-cell donor; reserve scarce O-negative for emergencies and child-bearing-age women.' },
  { id:'b2', pillar:'blood', diff:'easy',
    stem:'Which blood group is the universal plasma donor?',
    opts:['O','A','B','AB'],
    answer:3,
    explain:'AB plasma contains neither anti-A nor anti-B antibodies, so it can be given to any recipient.',
    wrong:'O is the universal RED-CELL donor — its plasma actually has both antibodies, so it is the worst plasma donor.',
    pearl:'Plasma compatibility is the mirror image of red cells: AB donates plasma to everyone; O receives plasma from everyone.' },
  { id:'b3', pillar:'blood', diff:'easy',
    stem:'About how much will one unit of packed red cells raise an average adult’s hemoglobin?',
    opts:['~0.3 g/dL','~1 g/dL','~3 g/dL','~5 g/dL'],
    answer:1,
    explain:'One unit raises hemoglobin by roughly 1 g/dL (hematocrit ~3%).',
    wrong:'0.3 and 3–5 g/dL over- or under-estimate the effect of a single standard unit.',
    pearl:'“Why give two when one will do?” — transfuse one unit and reassess before ordering more.' },
  { id:'b4', pillar:'blood', diff:'moderate',
    stem:'A bleeding patient in DIC has a fibrinogen of 80 mg/dL. Which product most directly corrects this?',
    opts:['Cryoprecipitate','Packed red blood cells','Platelets','Normal saline bolus'],
    answer:0,
    explain:'Cryoprecipitate is the concentrated fibrinogen product (also FVIII, vWF, FXIII) and is the targeted choice for hypofibrinogenemia.',
    wrong:'Red cells and saline do nothing for fibrinogen; platelets address counts, not fibrinogen.',
    pearl:'Low fibrinogen in a bleeding patient → think cryoprecipitate.' },
  { id:'b5', pillar:'blood', diff:'moderate',
    stem:'Ten minutes into a red-cell transfusion a patient develops fever, flank pain, hypotension, and dark urine. Your first action?',
    opts:['Give acetaminophen and continue','Stop the transfusion immediately','Slow the rate and observe','Give a diuretic'],
    answer:1,
    explain:'This is an acute hemolytic (ABO) reaction — usually a clerical error. Stop the transfusion at once, keep the line open with saline, recheck identification, and notify the blood bank.',
    wrong:'Continuing or merely slowing delivers more incompatible blood; a diuretic does not address the hemolysis and delays the essential first step.',
    pearl:'For ANY suspected reaction, stopping the transfusion first is never the wrong move.' },
  { id:'b6', pillar:'blood', diff:'moderate',
    stem:'An elderly patient with heart failure becomes dyspneic and hypertensive with pulmonary edema after 2 quick units. Most likely reaction?',
    opts:['TRALI','Anaphylaxis','TACO (circulatory overload)','Acute hemolytic reaction'],
    answer:2,
    explain:'Hypertension, raised filling pressures, and pulmonary edema after rapid/large-volume transfusion in a cardiac patient is classic TACO.',
    wrong:'TRALI shows NORMAL filling pressures; anaphylaxis brings hypotension and urticaria; hemolysis brings fever and dark urine.',
    pearl:'TACO is too much volume (diurese, transfuse slowly); TRALI is lung injury (support).' },
  { id:'b7', pillar:'blood', diff:'integrative',
    stem:'A stem-cell transplant recipient needs red cells. Which modification prevents transfusion-associated graft-versus-host disease?',
    opts:['Leukoreduction','Irradiation','Washing','CMV-negative selection'],
    answer:1,
    explain:'Gamma irradiation disables donor lymphocytes so they cannot engraft and attack the host — the mechanism of TA-GVHD.',
    wrong:'Leukoreduction lowers febrile reactions/CMV; washing removes plasma proteins; CMV-negative units prevent CMV — none reliably prevents TA-GVHD.',
    pearl:'Severely immunocompromised, neonates, and directed/relative donations need IRRADIATED products.' },
  { id:'b8', pillar:'blood', diff:'moderate',
    stem:'An IgA-deficient patient had anaphylaxis with a prior transfusion. Which product is safest next time?',
    opts:['Irradiated red cells','Leukoreduced red cells','Washed red cells','CMV-negative red cells'],
    answer:2,
    explain:'Washing removes residual plasma proteins (including IgA), preventing anti-IgA–mediated anaphylaxis. IgA-deficient units are an alternative.',
    wrong:'Irradiation, leukoreduction, and CMV-negative selection do not remove the offending plasma proteins.',
    pearl:'Recurrent severe allergic/anaphylactic reactions or IgA deficiency → washed products.' },

  { id:'c1', pillar:'coag', diff:'easy',
    stem:'The PT/INR is used primarily to monitor which therapy?',
    opts:['Unfractionated heparin','Warfarin','Low-molecular-weight heparin','Aspirin'],
    answer:1,
    explain:'PT/INR reflects the extrinsic/common pathway and is the standard monitor for warfarin.',
    wrong:'Unfractionated heparin is followed by aPTT; LMWH by anti-Xa; aspirin is not monitored by a routine coagulation time.',
    pearl:'PT = extrinsic/common (warfarin, vitamin K, liver). aPTT = intrinsic/common (heparin, hemophilia).' },
  { id:'c2', pillar:'coag', diff:'easy',
    stem:'A young man has bled into joints since childhood. aPTT is prolonged, PT normal, and the aPTT corrects on a mixing study. Most likely?',
    opts:['Disseminated intravascular coagulation','Hemophilia (factor VIII or IX deficiency)','Warfarin effect','Vitamin K deficiency'],
    answer:1,
    explain:'Isolated long aPTT, normal PT, lifelong deep bleeds, and correction on mixing point to a factor deficiency — hemophilia A (VIII) or B (IX).',
    wrong:'DIC prolongs both tests and lowers platelets/fibrinogen; warfarin and vitamin K deficiency prolong the PT.',
    pearl:'Corrects on mixing = deficiency. Hemophilia is X-linked with deep (joint/muscle) bleeding.' },
  { id:'c3', pillar:'coag', diff:'moderate',
    stem:'A prolonged aPTT does NOT correct when mixed 1:1 with normal plasma. Best interpretation?',
    opts:['A factor deficiency','An inhibitor (e.g., factor antibody or lupus anticoagulant)','Simple vitamin K deficiency','The sample was contaminated and is uninterpretable'],
    answer:1,
    explain:'Failure to correct means something in the patient’s plasma neutralizes the factor even when normal plasma is added — an inhibitor.',
    wrong:'A deficiency would correct once normal plasma supplies the factor; vitamin K deficiency prolongs PT and corrects on mixing.',
    pearl:'Long aPTT? Mix it. Corrects = deficiency; doesn’t correct = inhibitor.' },
  { id:'c4', pillar:'coag', diff:'moderate',
    stem:'A septic ICU patient has low platelets, low fibrinogen, prolonged PT and aPTT, very high D-dimer, and schistocytes. Diagnosis?',
    opts:['Disseminated intravascular coagulation','Thrombotic thrombocytopenic purpura','Isolated vitamin K deficiency','Hemophilia A'],
    answer:0,
    explain:'Simultaneous consumption of platelets, fibrinogen, and factors with a high D-dimer is the consumptive picture of DIC, usually triggered by sepsis.',
    wrong:'TTP leaves PT/aPTT and fibrinogen NORMAL; vitamin K deficiency and hemophilia do not consume fibrinogen or platelets.',
    pearl:'DIC consumes everything; the normal coagulation panel is what separates TTP from DIC.' },
  { id:'c5', pillar:'coag', diff:'moderate',
    stem:'In a cirrhotic patient with a prolonged PT, which factor is typically preserved and helps distinguish liver disease from DIC?',
    opts:['Factor II','Factor VII','Factor VIII','Factor X'],
    answer:2,
    explain:'Factor VIII is made largely by endothelium, so it is normal or high in liver disease but low in DIC (where it is consumed).',
    wrong:'Factors II, VII, and X are synthesized by the liver and fall in hepatic failure.',
    pearl:'Normal/high factor VIII + prolonged PT → liver disease rather than DIC.' },
  { id:'c6', pillar:'coag', diff:'moderate',
    stem:'Which set of clotting factors depends on vitamin K?',
    opts:['II, VII, IX, X','VIII and von Willebrand factor','V and fibrinogen','XI and XII'],
    answer:0,
    explain:'Factors II, VII, IX, and X (plus proteins C and S) require vitamin K for γ-carboxylation; warfarin blocks this.',
    wrong:'Factor VIII/vWF, factor V/fibrinogen, and the contact factors are not vitamin K–dependent.',
    pearl:'Because factor VII has the shortest half-life, the PT/INR rises first in vitamin K deficiency or early warfarin.' },
  { id:'c7', pillar:'coag', diff:'integrative',
    stem:'A patient has easy bruising and mucosal bleeding, a NORMAL platelet count, and a normal/only mildly prolonged aPTT. Most likely category?',
    opts:['Immune thrombocytopenia (ITP)','A platelet function defect / von Willebrand disease','Disseminated intravascular coagulation','Factor X deficiency'],
    answer:1,
    explain:'Mucocutaneous bleeding with a normal count points to a qualitative problem — platelet dysfunction (aspirin, uremia) or von Willebrand disease.',
    wrong:'ITP and DIC lower the platelet count; an isolated factor X deficiency prolongs both PT and aPTT and causes deeper bleeding.',
    pearl:'Platelet COUNT ≠ platelet FUNCTION — a normal CBC never excludes a functional defect.' },
  { id:'c8', pillar:'coag', diff:'integrative',
    stem:'A well patient with no bleeding history has a surprising isolated prolonged aPTT drawn from a central line. Best next step?',
    opts:['Start an urgent factor-deficiency work-up','Transfuse FFP empirically','Redraw peripherally to exclude heparin contamination / a preanalytic artifact','Give vitamin K'],
    answer:2,
    explain:'A line draw can be contaminated with heparin and an underfilled tube falsely prolongs the aPTT. Confirm the result before any work-up or treatment.',
    wrong:'Working up, transfusing, or giving vitamin K before excluding a bad sample wastes resources and may harm the patient.',
    pearl:'Rule out the bad tube before chasing a coagulopathy — the commonest “coagulopathy” on the wards is preanalytic.' },

  { id:'a1', pillar:'aph', diff:'easy',
    stem:'What is the default replacement fluid for most therapeutic plasma exchanges?',
    opts:['Albumin','Plasma (FFP) every time','Normal saline alone','Packed red blood cells'],
    answer:0,
    explain:'Albumin (5%) is the standard replacement — no infectious or allergic risk of plasma — except where factors are needed.',
    wrong:'Plasma is reserved for TTP or active coagulopathy; saline alone cannot maintain oncotic pressure; red cells are not a volume replacement here.',
    pearl:'Albumin is the default; TTP is the classic reason to replace with plasma instead.' },
  { id:'a2', pillar:'aph', diff:'moderate',
    stem:'A confused young woman has platelets 14k, schistocytes, very high LDH, and NORMAL PT/aPTT. The most urgent therapy is:',
    opts:['Platelet transfusion','Therapeutic plasma exchange with plasma replacement','Heparin infusion','Observation pending ADAMTS13 results'],
    answer:1,
    explain:'This is TTP. Urgent plasma exchange removes the anti-ADAMTS13 antibody and ultra-large vWF multimers and replaces the enzyme — it is lifesaving (ASFA Category I). Do not wait for ADAMTS13 to result.',
    wrong:'Platelets can worsen microthrombosis; heparin treats clotting of a different mechanism; waiting risks death.',
    pearl:'MAHA + thrombocytopenia with a normal coagulation panel → start plasma exchange now; hold platelets.' },
  { id:'a3', pillar:'aph', diff:'moderate',
    stem:'A patient with sickle cell disease has an acute ischemic stroke with a high HbS. Best transfusion strategy?',
    opts:['Simple transfusion to hemoglobin 12 g/dL','Red cell exchange','Plasma exchange','Platelet transfusion'],
    answer:1,
    explain:'Red cell exchange rapidly lowers the HbS percentage while avoiding the hyperviscosity and iron loading of aggressive simple transfusion.',
    wrong:'Pushing the hemoglobin up with simple transfusion raises viscosity dangerously; plasma exchange and platelets do not address sickled red cells.',
    pearl:'Sickle stroke or acute chest → red cell EXCHANGE, not a big simple transfusion.' },
  { id:'a4', pillar:'aph', diff:'moderate',
    stem:'Midway through apheresis a patient reports perioral and fingertip tingling. Most likely cause?',
    opts:['Air embolism','Citrate-induced hypocalcemia','TRALI','Hemolysis'],
    answer:1,
    explain:'Citrate anticoagulant chelates calcium, producing hypocalcemia — the most common apheresis complication. Slow the rate and give calcium.',
    wrong:'Air embolism and hemolysis are rare and present differently; TRALI is a transfusion lung injury, not a tingling syndrome.',
    pearl:'Perioral/fingertip tingling during apheresis = citrate hypocalcemia until proven otherwise.' },
  { id:'a5', pillar:'aph', diff:'integrative',
    stem:'A patient with AML has a WBC of 350k with dyspnea and confusion (leukostasis). Which procedure addresses the acute problem?',
    opts:['Plasma exchange','Red cell exchange','Leukapheresis','Plateletpheresis'],
    answer:2,
    explain:'Leukapheresis (cytapheresis) rapidly reduces the circulating blast burden to relieve symptomatic hyperleukocytosis while definitive chemotherapy begins.',
    wrong:'Plasma and red cell exchange target plasma factors and red cells; plateletpheresis removes platelets, not white cells.',
    pearl:'Too many of one cell, causing symptoms now → cytapheresis (leukapheresis here).' },
  { id:'a6', pillar:'aph', diff:'moderate',
    stem:'Why are platelet transfusions generally avoided in TTP?',
    opts:['They are simply ineffective','They can fuel ongoing microthrombosis','They cause ABO incompatibility','They block plasma exchange'],
    answer:1,
    explain:'Adding platelets to a process driven by platelet microthrombi can worsen organ ischemia; reserve them for life-threatening bleeding.',
    wrong:'The concern is harm from added thrombosis, not ineffectiveness, ABO issues, or interference with exchange.',
    pearl:'In TTP, platelets are “fuel to the fire” — treat with plasma exchange instead.' }
];

const CHECKPOINTS = [
  { id:'bc1', pillar:'blood', diff:'easy',
    stem:'Which unit is the universal RED-CELL donor in an emergency?',
    opts:['AB positive','O negative','A negative','O positive'],
    answer:1,
    explain:'O-negative red cells lack A, B, and D antigens, so they are safe to give before the type is known.',
    wrong:'AB is the universal recipient; A-negative is type-specific; O-positive risks anti-D in D-negative women.',
    pearl:'O-negative for emergencies and child-bearing-age women; O-positive is acceptable for many males to conserve supply.' },
  { id:'bc2', pillar:'blood', diff:'easy',
    stem:'What is the first step in any suspected transfusion reaction?',
    opts:['Call the attending','Stop the transfusion','Give acetaminophen','Draw blood cultures'],
    answer:1,
    explain:'Stop the transfusion first, keep the line open with saline, then evaluate and notify the blood bank.',
    wrong:'The other steps may follow, but none should precede stopping the infusion.',
    pearl:'Stopping the transfusion is never the wrong first move.' },
  { id:'cc1', pillar:'coag', diff:'easy',
    stem:'The aPTT primarily reflects which pathway(s)?',
    opts:['Extrinsic only','Intrinsic + common','Fibrinolysis','Platelet function'],
    answer:1,
    explain:'The aPTT measures the intrinsic (XII, XI, IX, VIII) plus common (X, V, II, fibrinogen) pathway.',
    wrong:'The extrinsic pathway is the PT; aPTT does not measure fibrinolysis or platelet function.',
    pearl:'PT = extrinsic/common; aPTT = intrinsic/common.' },
  { id:'cc2', pillar:'coag', diff:'moderate',
    stem:'A prolonged aPTT corrects after a 1:1 mix with normal plasma. This indicates:',
    opts:['An inhibitor','A factor deficiency','A lupus anticoagulant','Disseminated intravascular coagulation'],
    answer:1,
    explain:'Correction means the missing factor was supplied by normal plasma — a deficiency.',
    wrong:'Inhibitors and lupus anticoagulant do NOT correct; DIC is a consumptive process affecting multiple tests.',
    pearl:'Corrects = deficiency; doesn’t correct = inhibitor.' },
  { id:'ac1', pillar:'aph', diff:'easy',
    stem:'In TTP, what replacement fluid is used during plasma exchange?',
    opts:['Albumin','Plasma (FFP)','Normal saline','Packed red cells'],
    answer:1,
    explain:'Plasma replacement supplies ADAMTS13 while the exchange removes the antibody and ultra-large multimers.',
    wrong:'Albumin (the usual default) contains no ADAMTS13; saline and red cells do not treat TTP.',
    pearl:'TTP is the classic indication to replace with plasma rather than albumin.' },
  { id:'ac2', pillar:'aph', diff:'easy',
    stem:'In one phrase, therapeutic apheresis is best described as:',
    opts:['A whole-blood transfusion','Selectively removing or exchanging one blood component','Dialysis of urea and creatinine','A bone-marrow biopsy'],
    answer:1,
    explain:'A machine separates blood, removes or swaps the problematic component, and returns the rest.',
    wrong:'It is not a transfusion, not renal dialysis, and not a marrow procedure.',
    pearl:'Remove or exchange one part; return the rest — that one idea covers every modality.' }
];

/* ============================================================
   DATA — CASES
   ============================================================ */
const CASES = [
  { slot:'blood', tagClass:'blood', tagLabel:'Blood bank', title:'The trauma bay',
    blurb:'24-year-old after a motorcycle crash: BP 80/50, HR 130, obvious external hemorrhage. No blood type on file.',
    steps:[
      { label:'What do you release now?', prompt:'She is exsanguinating and there is no time to type and screen. What blood goes up?',
        reveal:'<strong>Emergency-release O red cells</strong> (O-negative because she could be pregnant) and <strong>AB plasma</strong>, uncrossmatched. Activate the massive transfusion protocol — don’t wait for the lab.' },
      { label:'How do you keep resuscitating?', prompt:'Units are running. What ratio and what do you send to the lab?',
        reveal:'Resuscitate in a balanced <strong>1 : 1 : 1</strong> ratio of red cells : plasma : platelets. Send a type &amp; screen so the lab can switch to type-specific blood as soon as it’s available.' },
      { label:'A new problem at unit 8', prompt:'After many units she develops perioral tingling and a prolonged QT. Why — and what do you do?',
        reveal:'Citrate in stored blood chelates calcium → <strong>hypocalcemia</strong>. Give IV calcium, keep her warm, and watch potassium and pH (the lethal triad: cold, acidotic, coagulopathic).' }
    ]},
  { slot:'coag', tagClass:'coag', tagLabel:'Coagulation', title:'The pre-op panel that won’t make sense',
    blurb:'30-year-old man for elective surgery. Routine aPTT is 62s, PT normal. He feels well and has no bleeding history.',
    labs:[ {k:'aPTT',v:'62 s',s:'hi'}, {k:'PT',v:'12 s'}, {k:'Platelets',v:'240k'} ],
    steps:[
      { label:'First move before cancelling', prompt:'Do you cancel the case for an abnormal aPTT?',
        reveal:'First make sure it’s real. Exclude a <strong>heparin-contaminated line draw</strong> or an underfilled tube — redraw peripherally. A well patient with no bleeding history and an isolated long aPTT is often preanalytic or a lupus anticoagulant.' },
      { label:'The redraw confirms it', prompt:'Peripheral aPTT is still 60s. What single test sorts this out?',
        reveal:'A <strong>mixing study</strong>. Corrects → factor deficiency. Doesn’t correct → inhibitor (a factor antibody or a lupus anticoagulant).' },
      { label:'It does not correct', prompt:'The mix fails to correct and he has never bled. Interpretation — and does surgery proceed?',
        reveal:'Think <strong>lupus anticoagulant</strong>: a long aPTT with a <em>thrombotic</em>, not bleeding, tendency. Confirm with dRVVT and antiphospholipid antibodies. Unlike a true factor deficiency, it generally does not mean he will bleed at surgery.' }
    ]},
  { slot:'aph', tagClass:'aph', tagLabel:'Apheresis', title:'The 2 a.m. consult',
    blurb:'Medicine pages: 28-year-old woman, new headache and confusion. Platelets 14k, hemoglobin 7.5 with schistocytes, LDH very high, creatinine mildly elevated. PT and aPTT normal.',
    labs:[ {k:'Plt',v:'14k',s:'lo'}, {k:'Schistocytes',v:'present'}, {k:'LDH',v:'↑↑',s:'hi'}, {k:'PT/aPTT',v:'normal'} ],
    steps:[
      { label:'The can’t-miss diagnosis', prompt:'What is the diagnosis you cannot afford to miss?',
        reveal:'<strong>TTP</strong> — microangiopathic hemolytic anemia + thrombocytopenia with a <em>normal</em> coagulation panel (which separates it from DIC). Don’t wait for ADAMTS13 to return.' },
      { label:'The team wants platelets', prompt:'They ask you to transfuse platelets for the count of 14k. Your answer?',
        reveal:'Hold platelets unless there is life-threatening bleeding — they can worsen the microthrombosis. The treatment is plasma exchange, not platelets.' },
      { label:'Set it up', prompt:'What do you arrange, and with which replacement fluid?',
        reveal:'Urgent <strong>therapeutic plasma exchange with PLASMA replacement</strong> (ASFA Category I), daily until platelets recover, plus steroids. Arrange large-bore access and monitor calcium between runs.' }
    ]},
  { slot:'lab', tagClass:'mixed', tagLabel:'Integrated', title:'Falling hemoglobin, three days later',
    blurb:'A 60-year-old woman transfused 2 units three days ago for a GI bleed now has a quietly dropping hemoglobin, mild jaundice, and dark urine. She otherwise feels okay.',
    steps:[
      { label:'Acute or delayed?', prompt:'Is this an acute reaction or something slower?',
        reveal:'A <strong>delayed hemolytic transfusion reaction</strong> — an anamnestic antibody response days later, often to a minor antigen (e.g., Kidd). Hemoglobin falls, bilirubin and LDH rise, and the direct antiglobulin test (DAT) turns positive.' },
      { label:'What changes going forward', prompt:'How does this affect her future transfusions?',
        reveal:'The blood bank identifies the antibody and provides <strong>antigen-negative units</strong> from now on. This is exactly why the antibody screen and a careful transfusion history matter.' }
    ]},
  { slot:'lab', tagClass:'mixed', tagLabel:'Integrated', title:'Cirrhosis meets the proceduralist',
    blurb:'A patient with cirrhosis has an INR of 1.8. Interventional radiology wants to place a line and asks you to “fix the coags” with FFP first. The patient is not bleeding.',
    labs:[ {k:'INR',v:'1.8',s:'hi'}, {k:'Platelets',v:'95k'}, {k:'Bleeding',v:'none'} ],
    steps:[
      { label:'Does the number predict bleeding?', prompt:'Does an INR of 1.8 in cirrhosis reliably predict procedural bleeding?',
        reveal:'No. Liver disease lowers <em>both</em> pro- and anti-coagulant factors — hemostasis is “rebalanced.” The INR was designed for warfarin, not to gauge bleeding risk in cirrhosis.' },
      { label:'A better move than prophylactic FFP', prompt:'What’s the wiser approach than reflexive FFP?',
        reveal:'Avoid transfusing for a number alone — FFP rarely normalizes the INR and adds volume (risking TACO and higher portal pressure). Treat bleeding if it occurs, consider fibrinogen if it’s low, and follow procedure-specific guidance.' }
    ]}
];

/* ============================================================
   DATA — GLOSSARY
   ============================================================ */
const GLOSSARY = [
  { term:'ABO system', def:'The major red-cell antigen groups (A, B, AB, O). You naturally make antibodies against the antigens you lack.', must:true },
  { term:'Rh / D antigen', def:'The clinically important Rh antigen. D-negative patients can form anti-D after exposure, risking hemolytic disease of the newborn.', must:true },
  { term:'Type & screen', def:'Determines ABO/Rh and screens the patient’s plasma for unexpected red-cell antibodies. The default pre-transfusion test.', must:true },
  { term:'Crossmatch', def:'Tests/reserves specific donor units against the patient’s plasma; ordered when transfusion is likely.', must:true },
  { term:'Emergency release', abbr:'O-neg', def:'Uncrossmatched O red cells (and AB plasma) released immediately when there is no time to type.', must:true },
  { term:'Packed red blood cells', abbr:'pRBC', def:'Concentrated red cells for oxygen-carrying capacity; one unit raises hemoglobin ~1 g/dL.', must:true },
  { term:'Platelets', def:'Component for low or dysfunctional platelets; stored warm (highest sepsis risk); one dose raises count ~30–50k.', must:true },
  { term:'Fresh frozen plasma', abbr:'FFP', def:'Contains all coagulation factors; for multi-factor deficiency, DIC, liver disease, massive transfusion.', must:true },
  { term:'Cryoprecipitate', def:'Concentrated fibrinogen (plus FVIII, vWF, FXIII); given for hypofibrinogenemia.', must:true },
  { term:'Leukoreduction', def:'Removal of white cells; reduces febrile reactions, CMV transmission, and HLA alloimmunization.' },
  { term:'Irradiation', def:'Disables donor lymphocytes to prevent transfusion-associated GVHD in immunocompromised patients, neonates, and directed donations.' },
  { term:'CMV-safe', def:'CMV-negative or leukoreduced units for CMV-negative at-risk patients (pregnancy, transplant, neonates).' },
  { term:'Washed product', def:'Plasma proteins removed by saline washing; for IgA deficiency or severe recurrent allergic reactions.' },
  { term:'Massive transfusion protocol', abbr:'MTP', def:'Balanced 1:1:1 resuscitation for major hemorrhage; watch calcium, potassium, and temperature.' },
  { term:'Acute hemolytic reaction', abbr:'AHTR', def:'ABO-incompatible hemolysis, usually a clerical error: fever, flank pain, dark urine, hypotension. Stop the transfusion.', must:true },
  { term:'Febrile non-hemolytic reaction', abbr:'FNHTR', def:'The most common reaction: fever/chills from cytokines and donor white cells; reduced by leukoreduction.' },
  { term:'TACO', def:'Transfusion-associated circulatory overload — volume overload with hypertension and pulmonary edema; transfuse slowly and diurese.', must:true },
  { term:'TRALI', def:'Transfusion-related acute lung injury within 6 h: hypoxemia, bilateral infiltrates, normal filling pressures. Leading cause of transfusion death.', must:true },
  { term:'TA-GVHD', def:'Transfusion-associated graft-versus-host disease; donor lymphocytes attack the host. Prevented by irradiation.' },
  { term:'Direct antiglobulin test', abbr:'DAT', def:'The “direct Coombs” test; detects antibody bound to the patient’s red cells — positive in immune hemolysis.' },
  { term:'PT / INR', def:'Prothrombin time / international normalized ratio — the extrinsic + common pathway; monitors warfarin.', must:true },
  { term:'aPTT', def:'Activated partial thromboplastin time — the intrinsic + common pathway; affected by heparin, hemophilia, vWD, lupus anticoagulant.', must:true },
  { term:'Fibrinogen', def:'The final clot substrate; low in DIC, severe liver disease, and obstetric hemorrhage.' },
  { term:'D-dimer', def:'A fibrin breakdown product — sensitive but not specific; most useful when normal to help exclude clot.' },
  { term:'Mixing study', def:'Patient plasma mixed 1:1 with normal plasma. Corrects → factor deficiency; fails to correct → inhibitor.', must:true },
  { term:'Factor assay', def:'Quantifies a specific clotting factor’s activity once the screening tests have localized the problem.' },
  { term:'Lupus anticoagulant', def:'An antiphospholipid antibody that prolongs the aPTT in vitro but promotes clotting in vivo — the classic paradox.' },
  { term:'Disseminated intravascular coagulation', abbr:'DIC', def:'Systemic consumption of platelets and factors: low platelets/fibrinogen, prolonged PT/aPTT, high D-dimer, schistocytes.', must:true },
  { term:'Thrombocytopenia', def:'Low platelets from decreased production, increased destruction (ITP, TTP, HIT, DIC), or splenic sequestration.' },
  { term:'von Willebrand disease', abbr:'vWD', def:'The most common inherited bleeding disorder; mucocutaneous bleeding; may mildly prolong the aPTT.' },
  { term:'Hemophilia', def:'X-linked deficiency of factor VIII (A) or IX (B): isolated long aPTT, deep joint/muscle bleeds, corrects on mixing.' },
  { term:'Therapeutic plasma exchange', abbr:'TPE', def:'Removes plasma (and a pathologic antibody or paraprotein), replacing it with albumin or plasma.', must:true },
  { term:'Red cell exchange', abbr:'RCE', def:'Swaps the patient’s red cells for donor cells; lowers HbS% in sickle stroke/acute chest without hyperviscosity.', must:true },
  { term:'Leukapheresis', def:'Cytapheresis that removes white cells to relieve symptomatic hyperleukocytosis (leukostasis).' },
  { term:'ADAMTS13', def:'The enzyme that cleaves von Willebrand multimers; its deficiency (usually autoantibody) causes TTP.', must:true },
  { term:'Thrombotic thrombocytopenic purpura', abbr:'TTP', def:'MAHA + thrombocytopenia with a normal coagulation panel; treat with urgent plasma exchange, not platelets.', must:true },
  { term:'Citrate toxicity', def:'The anticoagulant citrate chelates calcium during apheresis → hypocalcemia (perioral/fingertip tingling).' },
  { term:'ASFA category', def:'A I–IV ranking of apheresis indications: I first-line, II second-line, III individualized, IV ineffective/harmful.' },
  { term:'HPC collection', def:'Apheresis collection of CD34+ hematopoietic progenitor (stem) cells after mobilization, for transplant.' }
];

/* ============================================================
   QUIZ ENGINE
   ============================================================ */
const STATE = { answered:new Set(), correct:0 };
const RING_C = 97.4;
let currentFilter = 'all';

function buildQuestion(q){
  const card = document.createElement('article');
  card.className = 'q'; card.dataset.pillar = q.pillar; card.dataset.qid = q.id;
  const meta = document.createElement('div'); meta.className = 'q-meta';
  meta.innerHTML = '<span class="q-diff '+q.diff+'">'+q.diff+'</span><span class="q-pillar">'+(PILLAR_NAME[q.pillar]||'')+'</span>';
  const stem = document.createElement('p'); stem.className = 'q-stem'; stem.innerHTML = q.stem;
  const opts = document.createElement('div'); opts.className = 'q-opts';
  const explain = document.createElement('div'); explain.className = 'q-explain';
  q.opts.forEach((text,i)=>{
    const b = document.createElement('button');
    b.className = 'opt'; b.type = 'button';
    b.innerHTML = '<span class="opt-key">'+KEYS[i]+'</span><span>'+text+'</span>';
    b.addEventListener('click', ()=> answerQuestion(q, card, opts, explain, i));
    opts.appendChild(b);
  });
  card.append(meta, stem, opts, explain);
  return card;
}

function answerQuestion(q, card, opts, explain, choice){
  if(card.dataset.done) return;
  card.dataset.done = '1';
  const btns = [...opts.children];
  btns.forEach((b,i)=>{
    b.disabled = true;
    if(i === q.answer){ b.classList.add('is-correct'); b.insertAdjacentHTML('beforeend','<span class="opt-mark">✓</span>'); }
    else if(i === choice){ b.classList.add('is-wrong'); b.insertAdjacentHTML('beforeend','<span class="opt-mark">✗</span>'); }
  });
  const ok = choice === q.answer;
  STATE.answered.add(q.id); if(ok) STATE.correct++;
  explain.innerHTML =
    '<div class="verdict '+(ok?'ok':'no')+'">'+(ok?'✓ Correct':'✗ Not quite')+'</div>'+
    '<p><strong>'+KEYS[q.answer]+' is correct.</strong> '+q.explain+'</p>'+
    '<p class="why-wrong">'+q.wrong+'</p>'+
    '<div class="callout callout--pearl"><span class="tag tag--pearl">Teaching pearl</span><p>'+q.pearl+'</p></div>';
  explain.classList.add('show');
  updateProgress();
}

function renderQuiz(){
  STATE.answered.clear(); STATE.correct = 0;
  const bank = $('#quizBank'); bank.innerHTML = '';
  QUESTIONS.forEach(q => bank.appendChild(buildQuestion(q)));
  $$('[data-checkpoint]').forEach(box=>{
    box.innerHTML = '';
    CHECKPOINTS.filter(q => q.pillar === box.dataset.checkpoint).forEach(q => box.appendChild(buildQuestion(q)));
  });
  applyFilter(currentFilter);
  updateProgress();
}

function applyFilter(f){
  currentFilter = f;
  $$('#quizBank .q').forEach(card=>{
    card.style.display = (f === 'all' || card.dataset.pillar === f) ? '' : 'none';
  });
}

function updateProgress(){
  const total = $$('.q').length;
  const ans = STATE.answered.size;
  const frac = total ? ans/total : 0;
  const ring = $('#ring');
  if(ring) ring.style.strokeDashoffset = (RING_C * (1 - frac)).toFixed(1);
  const pct = $('#progPct'); if(pct) pct.textContent = Math.round(frac*100)+'%';
  const lbl = $('#progLabel'); if(lbl) lbl.textContent = ans+' / '+total+' answered';
  const sc = $('#qScore'); if(sc) sc.textContent = STATE.correct;
  const qa = $('#qAnswered'); if(qa) qa.textContent = ans;
}

/* ============================================================
   CASES
   ============================================================ */
function buildCase(c){
  const wrap = document.createElement('article'); wrap.className = 'case';
  const labs = c.labs ? '<div class="labs">'+c.labs.map(l=>'<span class="lab '+(l.s||'')+'"><span class="k">'+l.k+'</span><span class="v">'+l.v+'</span></span>').join('')+'</div>' : '';
  wrap.innerHTML = '<div class="case-head"><span class="case-tag '+c.tagClass+'">'+c.tagLabel+'</span><div><h4>'+c.title+'</h4><p>'+c.blurb+'</p></div></div><div class="case-body">'+labs+'</div>';
  const body = wrap.querySelector('.case-body');
  c.steps.forEach((s,i)=>{
    const step = document.createElement('div'); step.className = 'case-step';
    step.innerHTML =
      '<div class="label">Step '+(i+1)+' · '+s.label+'</div>'+
      '<p class="prompt">'+s.prompt+'</p>'+
      '<div class="case-controls"><button class="btn btn--ghost btn--sm" type="button">Reveal reasoning</button></div>'+
      '<div class="case-reveal">'+s.reveal+'</div>';
    const btn = step.querySelector('button'); const rev = step.querySelector('.case-reveal');
    btn.addEventListener('click', ()=>{ const open = rev.classList.toggle('show'); btn.textContent = open ? 'Hide reasoning' : 'Reveal reasoning'; });
    body.appendChild(step);
  });
  return wrap;
}
function renderCases(){
  $$('[data-case-slot]').forEach(slot=>{
    const where = slot.dataset.caseSlot;
    CASES.filter(c => c.slot === where).forEach(c => slot.appendChild(buildCase(c)));
  });
}

/* ============================================================
   GLOSSARY
   ============================================================ */
function renderGloss(filter){
  const list = $('#glossList'); if(!list) return;
  const f = (filter||'').trim().toLowerCase();
  const items = GLOSSARY.filter(g => !f || (g.term+' '+(g.abbr||'')+' '+g.def).toLowerCase().includes(f))
                        .sort((a,b)=> a.term.localeCompare(b.term));
  if(!items.length){ list.innerHTML = '<div class="gloss-empty">No terms match “'+filter+'”.</div>'; return; }
  list.innerHTML = items.map(g =>
    '<div class="gloss-item'+(g.must?' mustknow':'')+'"><div class="term">'+g.term+(g.abbr?'<span class="abbr">'+g.abbr+'</span>':'')+'</div><div class="def">'+g.def+'</div></div>'
  ).join('');
}

/* ============================================================
   STATS + INIT
   ============================================================ */
function fillStats(){
  const setT=(id,v)=>{ const el=$('#'+id); if(el) el.textContent=v; };
  setT('statCases', CASES.length);
  setT('statQ', QUESTIONS.length + CHECKPOINTS.length);
  setT('statGloss', GLOSSARY.length);
}

renderQuiz();
renderCases();
renderGloss('');
fillStats();
const gs = $('#glossSearch'); if(gs) gs.addEventListener('input', e=> renderGloss(e.target.value));
const qr = $('#quizReset'); if(qr) qr.addEventListener('click', renderQuiz);
$$('#quizFilters .chip').forEach(chip=>{
  chip.addEventListener('click', ()=>{
    $$('#quizFilters .chip').forEach(c=> c.classList.remove('is-active'));
    chip.classList.add('is-active');
    applyFilter(chip.dataset.filter);
  });
});
})();
