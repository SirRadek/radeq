# radeq.cz rework — synthesized proposal (2026-07-01)

Multi-provider brainstorm: **codex + gemini** (both with local radeq access) + a **4-lens Opus workflow**
(acquisition / design / tool / adversarial-risk). This document is the synthesis. It is advisory input for the
owner, not an implementation. It stays inside the 2026-06-30 positioning lock
(`.autopilot/decision-mesh/nodes/offer_positioning_conversion.yaml`).

---

## 0. The one decision this brainstorm surfaced (read first)

There is a real tension the providers split on:

- **codex + gemini:** make the "measure your website" tool the **hero / spine** of the site, now.
- **Opus adversarial + acquisition lenses:** **do not** — and they backed it with *your own docs*:
  `docs/acquisition/master-plan-radeq.md:90-98` puts the free audit tool in **FÁZE 2/3**, and the
  "Co teď NEdělat" list literally says *"Stavět scraper / free audit tool jako první věc"* and *"Kompletní
  audity zdarma bez dalšího kroku."* The real bottleneck is **outreach volume** (počet oslovení/týden), not tooling.

**The resolution all six actually support once you separate two questions:**
- *Is the tool a good asset?* → **Yes, unanimously** — as PROOF-of-competence + a warm-lead accelerator.
- *Should it be the primary hero CTA, built first?* → **No.** It should be **secondary** (beside, not replacing,
  the paid-audit CTA) and **Phase 2** (after the mobile-debt fix + after manual outreach validates which findings
  actually make prospects reply). That honors your own plan and dodges four traps (below).

**Recommended path: mobile-debt fix FIRST (this week), redesign the surface, THEN the tool as a secondary,
PSI-only, lead-gated widget.** Rationale follows.

---

## 1. Why not "tool as hero, now" — the four traps (Opus adversarial)

1. **Cannibalization (deepest lock risk).** A free, instant on-page mini-audit returning CWV+mobile+SEO looks, to
   an OSVČ visitor, *indistinguishable from "the audit."* It trains the buyer you want to charge that the audit is
   a free automated thing, and anchors 4 900 Kč as expensive for "the same report." This reframes the paid entry's
   *perceived substance* from senior human judgment to an automated score — deeper than the naming stop-condition
   `paid_entry_reframed_as_fix_or_renamed`.
2. **Wrong-margin pull.** The scanner measures **web perf/SEO = the low-margin half.** The high-margin pillar
   (data/process automation) is invisible to any URL scanner — you can't detect "this firm retypes orders into
   Excel" from PageSpeed. As the hero, the tool structurally narrows radeq to "a webař who measures speed,"
   undercutting the re-locked triad.
3. **CTA conflict.** A "Změřit web" button co-equal with "start the audit" = two primary CTAs above the fold =
   `cta_generic_or_conflicting`.
4. **Build-trap vs the bottleneck.** Building it first consumes the sprint's outreach hours — the one true
   bottleneck — while producing low-intent traffic a solo operator can't follow up at volume.

**The counterpoint (kept honest):** the hook is genuinely strong *as proof + reason-to-engage*. The disagreement
is only sequencing and role, not whether to build it.

---

## 2. What all six converge on (the safe core)

- **PSI-API-only.** Official Google PageSpeed Insights API v5. **No scraping, no headless render, no third-party
  crawl.** The Worker ideally never fetches the target itself (kills SSRF); Google is the only thing that touches
  the third party. Measure only a URL the visitor **submits about their own site**.
- **Diagnosis, never a verdict.** Never render the raw 0-100 score, a grade, or a fix-promise. Map to qualitative
  bands ("na reálných návštěvnících se web jeví pomalý"), each finding framed **"tohle bych prověřil první."**
- **Reuse, don't rebuild.** The existing `RqProblemDiagnostic.astro` tablist-carousel (accessible, reduced-motion
  guarded, four-part symptom→cause→verify→step voice) IS the results UI. Static `csProblems` become the honest
  fallback + example state. The tool then *visually embodies* the positioning.
- **Lead-gated + anonymous measuring.** Measuring writes nothing to D1 (anonymous, no PII, no third-party-data
  problem). A lead is created only when the visitor submits the existing ContactTerminal — pre-filled with
  `current_url` (column already exists, validated at `leads.ts:129`) + a one-line finding summary in `message`;
  `source_path=/audit` for free. **No D1 schema change, no score column** for the MVP.
- **Fix the conversion-lethal mobile debt** (prerequisite for anything to convert): hamburger nav (none today,
  `rq.css:446` just `display:none`s the nav ≤860px), the ONE CTA above the fold on ≤480, 44px tap targets, a 14px
  text floor for secondary labels, and **delete** the two broken journey carousels (repair is costlier + riskier
  for a solo op than deletion).
- **Retire the WebGL cat** from the hero/first viewport; keep the already-gated engine + clean-room provenance
  behind a small footer opt-in. Spend zero further Three.js effort.
- **Owner-dependencies:** a free Google PSI API key; final Czech consent/privacy wording; ≥1 **real** automation
  case study (the tool being clever is NOT proof of the automation pillar).

---

## 3. Site spine + IA (reconciled)

One funnel, one primary CTA:

1. **Hero** — value line keeps the triad. **Primary CTA = the paid-audit conversation** (today's `#kontakt` /
   "Napsat poptávku"). **Secondary, beside it = the URL-measure box** (self-qualifying proof entry), not a rival.
2. **Live diagnosis** — the reused tablist-carousel populated from the visitor's real PSI signals (or the honest
   `csProblems` fallback / "neměřeno" when a signal is absent — common for low-traffic OSVČ sites).
3. **Automation qualifier** — one self-declared, non-measured prompt: *"Přepisujete objednávky/poptávky ručně?"*
   → routes automation-interested leads into the same form with `project_type` pre-set. Recovers the high-margin
   lane the scanner can't see.
4. **Human handoff** — "tohle je strojový náhled, ne verdikt. Placený audit (od 4 900 Kč) projdu ručně a dostanete
   plán — poplatek se odečte z realizace." → the single CTA, pre-filled with the measured URL + summary.
5. **Proof** — the linked (honest, archetype-labeled) demos; a real case study when it exists.
6. **Contact** — final fallback only, not a competing primary destination.

---

## 4. Redesign direction — "the quiet instrument" (Opus design + codex)

The OSVČ buyer chooses between a cheap templated Wix site and a loud agency; radeq wins by looking like **neither —
a calm, competent tool that measures.**

- **Tokens:** promote the diagnostic's warm system into global `rq.css :root` — paper `#F7F4EE`, ink `#1C1A17`,
  ONE burgundy accent `#7A1F2B`, lime `#C7E04A` reserved as the *"measured / live"* signal color, **JetBrains Mono
  used ONLY on data/labels/metrics** (the secret weapon — reads "this person measures things").
- **References as a parts bin, NOT a theme:** services/editorial refs (Craig Mod, Derek Sivers) for calm typographic
  restraint; commerce refs (Muji/Aesop/Everlane) for warm paper + one confident accent; dashboard refs for the
  result surface. Aceternity/Uiverse = at most one hero backdrop + a focus ring. **Resist breadth-flexing**
  (`homepage_reads_as_broad_portfolio`).
- **Typography debt (precise):** body is already fine (`rq.css:2933` clamp 17-19px). The real "13px" problem is the
  secondary text — `--rq-eyebrow` 0.8125rem + a swarm of 0.72-0.82rem labels. Floor readable text at **0.875rem
  (14px)**; reserve 0.75rem strictly for all-caps mono eyebrows.
- **Motion = ONE role** (the instrument thinks, then reveals): submit → compositor-only CSS scanning bar → results
  via the existing `panelFadeIn` + a WAAPI count-up (repoint the one already in `RqMotion.astro:595`) → SVG
  `stroke-dashoffset` metric dials (rung: SVG, not Canvas/WebGL). Retire the magnetic pointer jitter
  (`RqMotion.astro:324`) — agency-flash slop. Everything reduced-motion-safe with a static fallback. Honesty:
  a missing signal shows "neměřeno", never a fake animated 90.

---

## 5. The measurement tool — concrete (codex + Opus tool)

- **Files:** `functions/api/audit.ts` (sibling to `leads.ts`) + `src/pages/audit.astro` (+ `/en/audit`) with one
  `client:load` React island (reuse the ContactTerminal hydration pattern).
- **Signals (one PSI call):** PSI v5 `strategy=mobile`, categories performance+seo+best-practices → Lighthouse lab
  + CrUX `loadingExperience` field data (real CWV: LCP/INP/CLS + FAST/AVERAGE/SLOW) + on-page SEO audits (missing
  title/meta description, viewport, is-crawlable, image-alt). Segment lives on mobile → mobile strategy.
- **Defer:** SPF/DKIM/DMARC/DNS checks (gemini's idea) — high false-positive risk + needs a direct fetch that
  reopens SSRF; leave to the human audit. The deprecated Mobile-Friendly Test API is dead — derive mobile-fitness
  from the PSI `viewport` audit.
- **Honest failure states (typed enum, never a fake number):** `no_field_data` (CrUX absent — "web nemá dost
  návštěv pro reálná data, ukážu jen laboratorní odhad"), `unreachable`, `psi_error`/`psi_quota`, `invalid_url`.
  Each still shows the human-audit CTA, so a failed measurement still converts.
- **Security/abuse:** PSI key as a Cloudflare secret; extend `isHttpUrl` (`leads.ts:160`) into `isPublicHttpUrl`
  that blocks SSRF (IP literals, localhost, private/loopback/link-local ranges) IF any direct fetch is ever added;
  KV rate-limit (~5/10min/IP + a global daily cap to protect the free quota); fire-on-click only (never on
  keystroke); 6h per-host KV cache; add Turnstile only if logs show hammering.

---

## 6. Phasing (the reconciled sequence)

- **Phase 0 — this week, highest leverage, zero legal risk (do this regardless):** the **mobile-debt fix pass** on
  the current homepage — hamburger nav, ONE CTA above the fold ≤480, 44px tap targets, 14px text floor, **delete**
  the two broken carousels. This is the real conversion win *now* and the clean single-CTA funnel the tool later
  plugs into. (This is also the natural continuation of the scale-up + positioning work already shipped.)
- **Phase 1 — redesign the surface:** the "quiet instrument" token/design pass; retire the cat to a footer toggle.
- **Phase 2 — the tool (after Phase 0 + some manual outreach validates which findings convert):** the thin
  PSI-only, score-suppressed, lead-gated widget as the **secondary** hero element + the **landing surface** for
  warm/referral outreach (turns "kouknu zdarma" into "už jsem koukl"). It becomes the artifact you paste into
  Webtrh / Shoptet Poradna / LinkedIn answers.
- **Phase 3 — only if evidence justifies:** an `audit_runs` table (host only, never full URL), richer signals.

**Single highest-leverage first change:** the Phase-0 mobile fix. **NOT** the tool.

---

## 7. What NOT to build (adversarial)

No hosted scraper / prospect-crawler on the domain (the outbound tool stays a LOCAL thing the owner runs by hand —
hosting it invites ÚOOÚ §7 / abuse exposure onto production). No headless screenshot of third-party sites. No score
column in D1. No numeric grade / letter in the UI. No second primary CTA. No accounts / dashboard / audit-history
(architecture.md forbids auth/accounts). No motion that isn't reduced-motion-safe + compositor-only. No "AI
automatizace" proof claims until a real case study exists (`automation_claim_backed_by_proof`).

---

## 8. Lock alignment (green if the above holds)

Paid entry stays "Audit webu nebo procesu od 4 900 Kč" (audit, credited, not reframed) · ONE non-conflicting CTA ·
no forbidden promise (no PageSpeed number/ranking/zero-error — enforced as a *content rule* on dynamic output) ·
PSI-only + submitted-URL = consent by construction, no scraping · lead-gated storage (no third-party-data problem)
· solo-deliverable (tool teases, human delivers) · automation pillar still needs a real case study.

## 9. Owner decisions / needs
1. **Sequencing (the §0 decision):** mobile-first + tool-as-secondary-Phase-2 [recommended] vs tool-as-hero-now.
2. Provision a free **Google PSI API key** (→ Cloudflare secret).
3. Final **Czech consent + privacy** wording for the measure input.
4. A **real automation case study** (unlocks proof for the co-primary pillar).
5. Approve **delete** (not repair) of the broken journey carousels.
