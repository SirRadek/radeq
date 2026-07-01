**O1 Verdict**
This is unreconciled drift unless Radek explicitly re-locks the offer. The active mesh still asks whether changes preserve the public offer, paid entry product, CTA hierarchy, and homepage scope, with stop conditions for unclear primary offer, unapproved paid product, conflicting CTA, and secondary services dominating the first viewport: [offer_positioning_conversion.yaml](C:/Programování/Projects/radeq/.autopilot/decision-mesh/nodes/offer_positioning_conversion.yaml:4), [offer_positioning_conversion.yaml](C:/Programování/Projects/radeq/.autopilot/decision-mesh/nodes/offer_positioning_conversion.yaml:50). The architecture lock says homepage primary is complete websites/redesigns, with automation/AI secondary: [architecture.md](C:/Programování/Projects/radeq/.autopilot/architecture.md:16). The acquisition plan instead says entry = quick web check/fix `2 900–4 900 Kč`, upsell = AI automation moat, and every message should mention automation: [master-plan-radeq.md](C:/Programování/Projects/radeq/docs/acquisition/master-plan-radeq.md:20).

The clean compliant funnel is:

`message` → “I help small firms fix the website/request path and the manual work around it”  
`site` → website/redesign/audit remains first public path  
`paid entry` → `Audit webu s plánem` / current live wording `Audit webu nebo procesu od 4 900 Kč`  
`upsell` → smallest proven next step: fix CTA/form/speed/deliverability or prototype one automation

Both can be true only if automation is a diagnostic outcome, not the headline. “Kromě webů teď dělám hlavně AI automatizace” is not coherent with the locked public site. Current live/repo already softens the lock with “Weby, data a automatizace…” in the H1 and pricing beside websites: [home.ts](C:/Programování/Projects/radeq/src/data/home.ts:1137), [home.ts](C:/Programování/Projects/radeq/src/data/home.ts:1278), and live `https://radeq.cz/`. I would not push further automation-led copy without a re-lock.

If Radek deliberately re-locks, update exactly: mesh objective/stop conditions, [architecture.md](C:/Programování/Projects/radeq/.autopilot/architecture.md:16), homepage SEO/H1/lead/CTA/proof/pricing in [home.ts](C:/Programování/Projects/radeq/src/data/home.ts:1118), `/sluzby` metadata and hero in [sluzby/index.astro](C:/Programování/Projects/radeq/src/pages/sluzby/index.astro:52), English equivalents, sitemap/SEO checks, and the paid entry product name.

**Message Stress Test**
Reactivation: too broad and hype-prone. Replace “hlavně AI automatizace” with “řeším weby, poptávky a ruční přepisování okolo nich”. Ask for one intro, not “rád kouknu zdarma” open-ended.

Partner/referral: strongest warm channel, but needs written terms: scope, white-label/client ownership, 10–15% only after paid invoice, no hidden client data sharing.

Mini-audit: best cold format, but only if every claim is observed. Avoid “formulář zřejmě neodesílá” unless tested. Use one specific issue, one ask, no attachment-heavy pitch, no follow-up chain.

Legal: the plan is right to ban bulk cold email. ÚOOÚ says publicly available email is not enough for marketing email; opt-in or own-customer exception is required. See ÚOOÚ FAQ and §7: https://uoou.gov.cz/cinnost/obchodni-sdeleni/casto-kladene-otazky-k-zakonu-c-4802004-sb and https://www.zakonyprolidi.cz/cs/2004-480#p7. Contact forms/LinkedIn are not magic safe harbors; keep it one-off, specific, identified, and maintain a “nekontaktovat” list.

Guarantee: “neúčtuji, když nenajdu 3 body” is OK if scoped. “Fakturuju až po předvedení” is safe only for tiny fixes with acceptance criteria. For bigger work use staged delivery/payment. Avoid “zaplatíte až po výsledku”.

AI moat: credible as “senior dev + small practical automations with human control”. Not credible yet as the public moat without case studies.

**O2 Build Sequence**
[do-now] Do not build `/audit`, scraper, dashboard, or D1 prospect CRM. Use current site/contact path and one manual audit template. Fix only copy/message alignment.

[do-now] Use XLSX for outbound prospects. I verified the workbook has `Leady` and `Návod & skórování`, score formulas, score coloring, and status/channel dropdowns. D1 is inbound only: `/api/leads` validates/stores submitted leads in one `leads` table: [functions/api/leads.ts](C:/Programování/Projects/radeq/functions/api/leads.ts:47), [migrations/0001_create_leads.sql](C:/Programování/Projects/radeq/migrations/0001_create_leads.sql:1). Avoid double entry: prospect lives in XLSX until reply/call; inbound form lead lives in D1.

[phase-2] After 30–50 manual outreaches plus one paid job or repeated positive replies, build the thinnest scraper pipeline: CSV of manually selected firms → normalize URL → Playwright/mobile screenshot → cheap HTML checks → PageSpeed/Lighthouse for top candidates → AI draft of 3 findings → human edit → delivery via contact form/LinkedIn only. Existing repo can reuse TypeScript patterns and Playwright; no existing scraper exists.

[phase-3] `/audit` lead magnet. The master plan correctly says free audit tool is phase 3: [master-plan-radeq.md](C:/Programování/Projects/radeq/docs/acquisition/master-plan-radeq.md:90). The organic playbook conflicts by starting it day 8: [organicky-playbook.md](C:/Programování/Projects/radeq/docs/acquisition/organicky-playbook.md:64). Design: `src/pages/audit.astro` + `functions/api/audit.ts`; normalize URL, block SSRF/private IPs, rate limit, run PageSpeed/mobile/HTTPS/meta/DNS checks, show non-indexed report, then CTA posts explicit lead to existing `/api/leads` with `current_url` and `source_path=/audit`. Store reports only in a new `audit_runs` table if phase-3 evidence justifies it. This touches lead and SEO mesh gates: [lead_capture_pipeline.yaml](C:/Programování/Projects/radeq/.autopilot/decision-mesh/nodes/lead_capture_pipeline.yaml:4), [seo_performance_surface.yaml](C:/Programování/Projects/radeq/.autopilot/decision-mesh/nodes/seo_performance_surface.yaml:4).

**O3 Execution**
The 14-day sprint is realistic only if the build work is cut. Bottleneck is not planning; it is 25–40 high-quality outreaches and follow-up discipline. Over-scoped: day 1 landing, day 8 `/audit`, and “15 audits + scraping” before reply evidence. Better: 15 warm reactivations, 5–8 partner asks, 8–12 cold mini-audits, one public post only from real findings.

The scoring rubric is sound and fast enough if treated as triage, not precision. “Manual admin” is the right high-margin signal, but it must be evidence-based: forms, email orders, PDFs, repeated bookings, “send us details by email”, visible B2B workflow. Score in 2 minutes; deep-audit only `7+`.

Weekly metrics: sent by channel, time per audit, score band, problem category, replies, positive replies, calls, paid audits offered, paid audits sold, revenue, objections, and “do not contact”. Decision rule: 0 replies from 20 specific cold audits means pause cold and change targeting/message/offer. Warm replies but no calls means CTA is weak. Calls but no paid audit means entry offer/scope/pricing is weak. Replies mostly about admin/automation are evidence for a later owner re-lock, not permission to relock today.

Single highest-leverage next move: owner locks one sentence before outreach: “RadeQ helps small businesses improve the website path to enquiries and remove manual work around it; first step is a paid website/process audit with a clear plan.” Then send the first 20 warm/referral messages and 10 manual mini-audits.

Ready for cold: **yes-with-fixes** for specific mini-audits. **No** for automation-led cold as written until the owner explicitly re-locks the public positioning.