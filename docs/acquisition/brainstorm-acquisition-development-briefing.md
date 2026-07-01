# RADEQ.CZ — ACQUISITION SYSTEM DEVELOPMENT (brainstorm briefing)

You are one of several model families (gpt5.5-xhigh / opus-4.8-ultracode / gemini-3.x) brainstorming the
**development of Radeq.cz's customer-acquisition system**. You have READ access to the radeq repo (cwd) and
the materials below — **VERIFY every claim against the real files + the radeq Decision Mesh; do not trust this
briefing blindly.** This develops a REAL one-person business with a 0 Kč budget, not an abstract exercise. Be
decisive and grounded, not a survey. Where you disagree with the plan or the briefing, say so with the file.
2 rounds: round 1 = independent take; round 2 = the other families' outputs as opposition.

## What this is
Radek Široký (Radeq.cz) is a senior web developer + AI-automation specialist who needs paying work with **zero
ad budget**. A separate planning session produced a finalized 0-budget acquisition master plan + an organic
playbook + a CRM lead tracker (now consolidated into this folder). Your job is to **develop that strategy into
an executable, partly-tooled system** — and, first, to resolve a real conflict it has with the live website.

## WHERE EVERYTHING IS (read these first)
- **The plan:** `docs/acquisition/master-plan-radeq.md` (the consolidated winning plan: channel priority,
  two-tier offer, lead scoring, manual messages, 14-day sprint, "when to automate").
- **The organic playbook:** `docs/acquisition/organicky-playbook.md` (4 organic engines: reactivation+referral,
  problem-scan+mini-audit, content+communities, own free `/audit` tool).
- **The CRM:** `docs/acquisition/CRM-leady-radeq.xlsx` + its generator `docs/acquisition/build_crm.py`
  (Leady sheet: 5-factor lead score, status/channel dropdowns, ≥7 green / ≤4 red; Návod sheet).
- **The live site governance (CRITICAL — the plan may contradict it):**
  `.autopilot/decision-mesh/nodes/offer_positioning_conversion.yaml`,
  `.autopilot/decision-mesh/nodes/lead_capture_pipeline.yaml`,
  `.autopilot/decision-mesh/nodes/seo_performance_surface.yaml`, and `.autopilot/architecture.md`.
- **The site:** an Astro static site (Czech `/`, English `/en/`, `/ukazky/`), a Cloudflare D1-backed lead
  capture endpoint (`functions/api/leads.ts`), a light/dark toggle, an optional 3D mascot.

## THE CENTRAL TENSION (resolve this first)
The live site's positioning was **locked by the owner on 2026-06-11** (`offer_positioning_conversion.yaml` +
`architecture.md`):
- **Primary public offer = COMPLETE WEBSITES + redesigns for small businesses.** Paid entry product =
  **"Audit webu s plánem" / "Website audit with a plan"**. Primary CTA = start a website conversation at `#terminal`.
- AI/automation, WordPress/WooCommerce repairs, migrations are **SECONDARY** and must NOT dominate the first
  viewport or CTA. Stop conditions include `primary_offer_unclear`, `secondary_services_dominate_first_viewport`,
  `homepage_reads_as_broad_portfolio`, `paid_entry_product_unapproved`.

The **new acquisition plan pulls the other way**: it positions **senior dev + AI AUTOMATION as the high-margin
moat / thinnest-competition niche**, with a **low-barrier "quick web check & fix 2 900–4 900 Kč"** entry, and
**every cold/reactivation message opens with automation** ("kromě vývoje webů teď dělám hlavně AI automatizace").

→ If applied to the site as-is, the plan would trip the locked node. So the first question is the owner's to
settle, but yours to frame sharply.

---

## OBJECTIVE 1 — Reconcile positioning, then stress-test the offer + messages
1. **Is the automation-led plan a deliberate owner RE-DIRECTION or unreconciled drift?** The node says the
   complete-websites lock holds "unless the owner explicitly changes direction again." Lay out the cleanest
   coherent positioning that (a) keeps the public homepage compliant with `offer_positioning_conversion` OR (b)
   requires a specific, minimal owner re-lock — and say exactly which homepage/offer fields would change. Do NOT
   silently let the cold-outreach pitch and the public site say different things.
2. **Can both be true?** e.g. public site = complete-websites entry; outbound/referral pitch = automation moat.
   Is that coherent or schizophrenic? What is the smallest change that makes the funnel consistent end-to-end
   (site ↔ message ↔ paid entry product ↔ upsell)?
3. **Stress-test the offer + the 3 message templates** (reactivation / partner-referral / mini-audit) against
   real conversion: what is weak, generic, or risky? Specifically check the **legal exposure** (CZ zák. 480/2004
   §7 — the plan already flags this), the **garance wording** ("neúčtuji, fakturuju až po předvedení"), and the
   **"AI automation moat" claim** (is it credible/defensible for a solo dev, or over-promised?).

## OBJECTIVE 2 — Phase-2 tooling: design + build sequence (respect "validate before you build")
The plan's core discipline: **do NOT build the acquisition machine before ≥30–50 manual outreaches prove which
problems trigger replies + ≥1 paid job.** Honor that — but design what gets built, and in what order:
1. **The free `/audit` tool** (lead magnet on radeq.cz): URL in → PageSpeed/Lighthouse API + mobile/HTTPS/meta +
   SPF/DKIM/DMARC checks → human-readable report + CTA. Design it as an Astro route + a Cloudflare function;
   reconcile with the existing `seo_performance_surface` and `lead_capture_pipeline` (D1) governance — does it
   feed the same D1 lead store? Is it phase-2 or phase-3 (the plan says 3)?
2. **The scraper → Lighthouse → AI-audit pipeline** (the owner's own stack, not paid tools): how to find regional
   firms by sector, filter by visible problems, and AI-generate a 1-page audit — WITHOUT bulk cold email
   (delivery only via the firm's contact form / LinkedIn). What is the thinnest viable version? What can be reused
   from radeq's existing code?
3. **The CRM**: the plan ships a **manual xlsx** tracker, but radeq already has a **Cloudflare D1 lead store**.
   Reconcile: manual xlsx for outbound prospecting vs D1 for inbound captured leads — keep both, merge, or graduate
   the xlsx into D1? Define the smallest workflow that doesn't double-enter.
4. Flag every build recommendation **[do-now]** (cheap, validates the offer) / **[phase-2]** (after validation) /
   **[phase-3]** (after a repeatable paid flow). The owner's ethos: do not build speculative infrastructure.

## OBJECTIVE 3 — Execution, measurement, and the single highest-leverage move
1. **Is the 14-day sprint realistic for one person?** Name the true bottleneck (the plan says: number of
   outreaches/week, not the plan). What in the day-by-day is over-scoped or out of order?
2. **Lead scoring + CRM workflow:** is the 5-factor rubric (visible problem / manual admin / ability to pay /
   reachable decision-maker / referral path; target 7+) sound and actually fillable at speed? Does "manual admin"
   correctly steer toward the high-margin automation work?
3. **Measurement / kill-or-iterate signals:** the plan's rule is "0 replies from 20 specific outreaches =
   targeting/message/offer problem, not 'too little advertising'." Define the concrete weekly metrics + the
   decision rule for pivoting the message vs the channel vs the offer.
4. End with the **single highest-leverage move for the next 14 days** and a yes/no on whether the offer is ready
   to take cold, or needs a re-lock with the owner first.

---

## What to produce (per family, round 1)
A decisive, file-grounded report: (O1) the positioning verdict — re-direction vs drift, the coherent end-to-end
funnel, and the offer/message/legal stress-test; (O2) the tooling design + [do-now]/[phase-2]/[phase-3] build
sequence reconciled with radeq's existing Astro + D1 + mesh; (O3) the execution critique + metrics + the single
highest-leverage move + the ready-for-cold verdict (yes / yes-with-N-fixes / no). Disagreement and what everyone
else will miss are worth more than agreement. This is a real business with no budget — protect the owner's time.
