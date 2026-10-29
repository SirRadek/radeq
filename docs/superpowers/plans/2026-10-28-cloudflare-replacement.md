# RadeQ Cloudflare replacement implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Do not spawn implementation workers. One independent native Sol medium reviewer handles plan and final patch review.

**Goal:** Replace the public radeq.cz frontend with the accepted local minimalist CZ/EN website, retaining the existing lead backend/data and introducing verified metadata, consent-based GA4/Sklik, privacy and cooperation information.

**Architecture:** Astro root assets on existing Cloudflare Worker radeq (account 010410e6274eaf7df61aba234a2d25f4). Preserve exact downloaded production backend module (SHA256 c80dd654a4775cc1a49a84ec8de4b8b24b643377574cb789caeaaec4379dd67a) under release/production-backend.js. A reviewed outer entry imports it without bundling, denies /api/* on non-radeq.cz preview hosts and adds X-Robots-Tag there. Production API passes unchanged request/env to the preserved backend. ASSETS serves the new static build; run_worker_first=true protects API routing. D1 LEADS_DB=50e2c98b-9ecc-4d28-a674-4fa8b44b7a78 and KV MEASURE_RATE_LIMIT=5cd5df0326a7478cbfb3f84d001af783 stay bound. --keep-vars preserves operational vars; secret bindings inherited. Compatibility date stays 2026-06-11. Stale Pages radeq-cz is unrelated and excluded. New immutable preview first, then production promotion after checks and independent review. Existing /radeq preview remains isolated. Replace the public site completely; retain a local release record and rollback evidence before retiring superseded deployments. Do not delete backend resources, leads, secrets, DNS zone, email configuration or unrelated projects.

**Tech Stack:** Existing Astro 6.3.1, TypeScript, vanilla form/consent JavaScript, Vitest, Cloudflare Worker with preserved API module, Wrangler 4.90.1, current Cloudflare account and third-party measurement accounts only.

**Spec:** Owner instruction in this chat 2026-10-28 authorizes form preparation, found fixes, Cloudflare publication and replacement/removal of previous website. Subsequent answers: accepts consumers as well as businesses; not VAT registered; unsuccessful enquiries retained 6 months from last contact; wants Google Analytics, Seznam Webmaster and Sklik (including advertising measurement). These later instructions supersede previous no-publication notes. Existing audit: docs/audits/2026-10-28-three-way/SROVNANI.md.

## Global constraints

- Active source C:/Users/sirok/Documents/ChatGPT/RadeQ/app; no upstream Git history, no original snapshot edits. Accepted source/artifact manifest build-1793195077266 is the pre-change baseline.
- Preserve Stopa/V3 cream #f7f4ee, wine #7a1f2b, ink #1c1a17, original logo, Chillax600 H1 and Cabinet Grotesk600/400/500.
- Preserve all four fictional demo behaviors, English translation, CZK prices, truthful selection/confirmation and no-send/no-pay labels.
- No invented certificates, clients, identifiers, analytics accounts, ownership tokens, delivery confirmations or legal compliance guarantees.
- Only verified existing Cloudflare project/account; review actual current production settings before mutation. Same API payload/storage/email/bot protection; no database migration or deletion. Compare available deployment source/build identity; if deployed backend identity cannot be proven, record it and verify compatibility before any replacement.
- Consumers: enquiry is non-binding and creates no order/contract. Provide identity/contact, prices not subject to VAT, complaints/ADR and pre-contract process; actual individual scope, payment, timing and consumer withdrawal instructions/form supplied before accepting an order. No blanket waiver of consumer rights or prechecked GDPR consent.
- GA4 analytics and Sklik marketing are separate optional purposes, initially denied. No third-party measurement fetch, cookie, beacon or cookieless ping before respective consent. Equal accept/reject, accessible settings and withdrawal; do not send enquiry contents, email, name, URL query/hash or arbitrary tracking strings.
- Seznam/Google ownership verification tags only for known real tokens. Cloudflare analytics only when its real configuration is verified; avoid duplicate automatic/manual beacon. Missing measurement IDs block claiming those integrations active; continue independent implementation.
- Task context soft24k/reassess48k incremental, two attempts with changed strategy per blocker; final review roughly2k words/24calls/8turns, no nested agents or paid API/model fallback. Owner/system overhead unknown. Mesh remains project_mesh_missing; no observer installation.

## Review focus

- Production submits only once, handles 201 vs 4xx/5xx truthfully, retains input on error, allows retry, respects HTML validation and server length limits.
- Missing/expired Turnstile never degrades to an unprotected submission. No live CAPTCHA automation or fake tokens. No test email to a third party; end-to-end mail testing only to owner-controlled verified address when needed.
- Fresh visitor and explicit reject issue zero GA4/Sklik requests; distinct purpose choices respected; revocation disables future events and clears accessible own-domain measurement cookies without breaking the form.
- Indexability is correct by target: preview noindex, production selfcanonical/hreflang/sitemap only real indexable pages; fictional/noindex demos excluded; old important paths retained or deliberately redirected, no blanket redirect disguising errors.
- Publication cannot overwrite backend secrets/bindings or delete active/new deployment, production data or unrelated resources; full before/after hashes and verification bound to exact upload.

## Tasks

### 1. Establish release identity and required external values

Files: docs/deployments/2026-10-28-cloudflare/; AGENTS.md and PREVZETI.md authority/checkpoint only.

- [ ] Preserve pre-change manifest and scoped baseline hashes. Record new owner authorization and subsequent legal/analytics answers.
- [ ] Restore Wrangler OAuth (owner completed login). Query actual Worker radeq, custom domain and production version/deployment, environment variable names/types, D1/KV, public Turnstile and measurement/verification values. Never print or commit secret values. Existing project is observed, not guessed.
- [ ] Read current live tags/config and only relevant source to discover real GA4/Sklik/verification IDs. If absent, use supported authenticated account UI or request exact missing public IDs from owner; no fictitious placeholders in active production code.
- [ ] Resolve safe preview bindings and deployment capture/rollback capability before external mutation; do not copy production leads into tests.

### 2. Implement coherent frontend, metadata and legal corrections

Files: RqContactForm.astro, MinimalHomePage.astro, ServiceStories/styles, RqMetadata/RqLayout, RqFooter, paired CS/EN service/contact/privacy pages; new paired cooperation page and shared identity/privacy content; sitemap.xml.ts; public _headers/_redirects as actually needed. Backend functions remain unchanged unless a proven compatibility defect requires separate scoped review.

- [ ] Add meaningful failing tests for repeated submit/failed response, metadata pairings, draft certificate absence, non-indexable sitemap exclusion and legal form information. For low-impact CSS/text use rendered checks, not mirror tests.
- [ ] Hide certificate proposal from released pages; repair thumbnail overlap while preserving real EN screenshot and visible full headline. Do not fake certificates.
- [ ] Keep existing minimalist form, add field bounds, privacy/cooperation links and clear non-binding explanation; disable repeated submits, restore retry on errors, localize generic backend failures instead of exposing configuration messages. No mandatory consent to process necessary enquiries. Minimize source/referrer tracking to path/origin, retaining required API shape.
- [ ] Add reciprocal canonical/hreflang, real ownership meta when available, structured business identity and accurate sitemap. Reuse existing canonical/OG implementation; no duplicate conflicting tags. Retain existing valuable routes/notes and legal links in footer. No unrequested content expansion or promises of ranking.
- [ ] Replace vague anonymous/privacy copy with controller identity verified in ARES, purposes/legal basis, fields, six-month unsuccessful-enquiry policy, actual Cloudflare/Resend/Google/Seznam recipients, transfers safeguards only as supported, rights/ÚOOÚ contact, necessary anti-abuse processing and optional measurement. Explain retention is operational policy; verify/enforce actual deletion process instead of inventing an automated job. Customer/order documents follow applicable retention obligations, not automatic6months.
- [ ] Add concise CZ/EN cooperation/consumer information with non-VAT prices, individually agreed scope, non-binding enquiry, complaints at owner contact, ČOI ADR and case-specific pre-contract withdrawal information. No obsolete EU ODR link, fabricated business-register claim or universal terms pasted from an e-shop.

### 3. Implement consent-based measurement and tests

Files: focused consent client module/component/styles and tests; production measurement/verification configuration shared with metadata; form success event and CTA hooks.

- [ ] Failing behavioral tests: denied default, independent analytics/marketing toggles, stored preferences, accepted pageview, one valid enquiry success conversion, no form input/query parameters in payload, no tracking on failed submission, withdrawal and storage-failure handling. Use explicit dependency injection for external script/network test seams.
- [ ] Minimal accessible consent panel fitting existing design; accept all/reject optional equal weight, per-purpose settings, footer reopen,180day decision validity. Store only necessary preference locally. Honor explicit rejection without background measurement calls.
- [ ] Load GA4 only after analytics consent with known G-ID; disable Google advertising features, automatic form capture and query/hash data. Load current Sklik SEM sul.js only after marketing consent with verified IDs; conversion uses successful backend receipt, not click/failed response. Avoid inventing conversion value. Seznam Webmaster verification does not require advertising consent.
- [ ] If values still missing, build integration disabled and clearly record pending IDs; do not call it active or represent unavailable integrations as deployed. Decide launch dependency explicitly from owner replies and actual access.

### 4. Validate and independent review

- [ ] Run affected Vitest suites and backend API compatibility tests, then accepted verify-themed-demos.mjs for root/subpath build/typecheck/compiled gates. Update obsolete contract tests only for intended changes. No weakening unrelated tests. Exact results/logs in release evidence.
- [ ] Render production root build with actual field layout on desktop/mobile, CS/EN, privacy/cooperation pages and corrected thumbnail. Test form success/error/retry using local isolated handler/mocked external transport, consent reject/accept/separate/revoke and request recording. Root CUA available; deterministic Playwright may test isolated local fixtures per existing repo workflow. No live CAPTCHA automation or third-party form spam.
- [ ] Independent native Sol medium final patch review, bounded to changed source, tests, legal facts and release config. Fix material findings and at most one targeted re-review unless new serious issue.
- [ ] Verify final source/artifact hashes match exact checked build and release target. No production upload on a failed gate or unknown critical binding.

### 5. Publish new preview, switch production and retire old site

- [ ] Exact command from app/: node <cached-wrangler>/bin/wrangler.js versions upload --config wrangler.jsonc --keep-vars. Config main=release/index.js, no_bundle=true, explicit ESModule rules, ASSETS directory points to exact verified root build, run_worker_first=true. No Pages Functions compilation or local functions upload. Hash all assets, backend, wrapper and config. Check /api route collisions before upload. Confirm remote binding names/IDs, compat and secrets names after upload and before promotion. Version upload does not change production traffic.
- [ ] Preview version URLs share production resources: outer wrapper must return 403 for ALL /api/* before invoking original backend on nonproduction hosts, and X-Robots-Tag noindex,nofollow on all preview responses. No production write or email on preview. Local integration tests cover host gate and exact backend hash. All mock form tests run locally. Public Turnstile test key never ships; production build uses observed real key 0x4AAAAAADuCM9qkDGmWKvsw.
- [ ] Verify immutable preview CSS/assets, main CZ/EN, all four demos, legal pages, SEO and request-level consent. Promote exact previewed version with versions deploy <NEW_VERSION>@100% --config wrangler.jsonc. Record deploy ID and production before/after source/asset identity.
- [ ] Rollback target is existing retained version 8f661eab-32da-47b3-b4a9-f55926c7b425 (deployment a036cfc2-29fd-4eb5-9af6-c2d0290f2280), exact downloaded source already backed up. Verify version detail remains retrievable before promotion; retain this restorable Cloudflare version with its assets for at least 7 days after launch. Restore command: wrangler versions deploy 8f661eab-32da-47b3-b4a9-f55926c7b425@100% --config wrangler.jsonc. Do not delete only-restorable version or private rollback bytes. New version must remove old frontend from custom-domain and workers.dev active traffic. Historical version public preview URLs can be disabled with per-version has_preview=false only through supported verified API, or record limitation without deleting recovery version. No DNS/shared resources mutation or stale Pages project cleanup.
- [ ] Check production bytes/routes/canonical/hreflang/sitemap/robots, safe invalid API request (no D1/KV write), and form UX. Human solves any real CAPTCHA; no spam/email to third parties. Report actual activation, QA and remaining facts, update checkpoints.

## Concrete acceptance additions from independent review

- 201 {ok:true,leadId} means stored, even when email fails: UI must promise receipt only. Cover delayed repeated submit, 201-without-email, JSON errors, non-JSON/malformed and retry. No backend idempotency guarantee after lost response.
- Blank project_type is accepted locally but production module requires it. UI remains optional; disclose generic category used when blank (General enquiry / Obecná poptávka), without claiming a specific customer interest. Preserve downloaded backend unchanged. Test against that exact module using isolated D1/KV/fetch mocks.
- Consent: rejection persists across navigation; expired/corrupt/unavailable storage defaults denied; withdrawal while loader pending and after provider initialized must prevent automatic/custom future events. No full referrer/query capture. If SDK cannot guarantee revocation, reload same page after saving revoked preferences, before further events. Sanitize URL before any optional SDK load and restore visible URL only after safe handling; prefer provider-supported page-location/referrer overrides. Do not load SDK if real config absent.
- Official legal/technical sources checked 2026-10-28: ARES REST /08748811 (sole trader Radek Široký, Nezamyslova274/10,12800Praha2); user non-VAT; GDPR Art13 EUR-Lex; ČOI precontract/ADR; Cloudflare customer DPA; Resend DPA; Google GA4 views; Sklik SEM base/consent/conversions. No claim legal certification or completed future individual consumer contract.
- Retention: operational monthly review of unsuccessful leads at 6 months from last substantive contact, including inbox/sent copies; no destructive run during launch. Contract/legal records kept separately under applicable obligations; backups age out by actual provider policy, no invented purge timer. Document owner procedure rather than invent automation.
