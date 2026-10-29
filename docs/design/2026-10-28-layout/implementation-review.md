# Studio index — targeted implementation review

2026-10-28 · independent native gpt-6.1-sol / medium · one bounded source review, no delegation or application edits.

**Verdict: source changes accepted; verification gate still pending at review time.** No material functional, accessibility or cascade defect found in the inspected implementation. Actual rendered acceptance belongs to the parent's current browser QA; this report does not assert visual success or native animated-tab support.

## Findings

- **Required verification repair:** the latest `verify-themed-demos` run reports 22 compiled tests passing and two failing. Both fail at `app/tests/public-preview-contract.test.mjs:34`, which still expects twelve workflow nodes instead of the selected four tiles' sixteen. Its immediately following three-cursor expectation also describes removed decorative overlays. Update only those explicitly superseded three-row/decorative expectations, retain workflow meaning and working-demo checks, then rerun the gate. This is outdated test coverage rather than evidence of broken app behavior. Parent notified with the exact failing locations.
- No other actionable material source findings in the requested scope.

## Checked implementation

- Header switches between a fixed scrollable desktop rail and native mobile disclosure; inactive desktop/mobile navigation uses `display:none` appropriately. Current/alternate language remain visible. Global flex wrapping is retained on mobile. Footer groups retain legal/tool links, genuine contact URLs and root-only cookie-settings button with its existing hook and preview exclusion.
- Four closed native disclosures use noninteractive summaries and separate demo links. The three established IDs remain; `sluzba-eshop`, `ServiceReturn` and `CoffeeDemoDocument` agree, and the English return fixture was intentionally updated. Initial and changed hashes open the matching details before scrolling. These explicit service fragments target the details themselves; no new hidden descendant anchor is introduced.
- Root/subpath resolution remains consistent, and `RqLayout` keeps existing canonical/alternate metadata and consent/preview channel conditions. No API, email transport, consent or measurement code change was needed for these presentation changes.
- Compact form styles match the real first/second name/email field positions, retain existing `[hidden]` behavior, labels, optional details, validation/status, security widget and natural vertical growth. Mobile overrides return the form to one column. The legal component's scoped selectors override global section spacing; explicit trusted sentence boundaries preserve complete HTML. The legal unit test checks exact rejoined source and ordered complete links across all four legal documents.
- Favicon keeps original icon links intact, adds a temporary icon only after frame generation, uses generation checks to prevent late async insertion after cancellation, clears timers/removes its temporary link on hide/reduced motion/pagehide, and falls back on errors. Local frames are cached, with no request per frame. Its tests cover finite completion, hidden/reduced initial state, pending-decode cancellation and decode failure. Color-scheme events use the same cancellation path; actual browser icon choice/animation remains a documented runtime limitation.

## Evidence and limits

Independently read `unit.log`: **141 tests passed**, three test files skipped; warning concerns the existing absent production-backend source map. Independently read current `build.log` and latest `green.log`/`green-error.log`: **22/24 compiled tests passed**, two obsolete expectations above. No duplicate build/test run, form submission, consent acceptance, deployment, backend edits or browser session takeover performed by reviewer.

Reviewed components/layout, `studio.css`, `service-stories.css`, `legal-paragraphs.mjs`, `favicon-motion.mjs`, their relevant tests, ServiceReturn and CoffeeDemoDocument. Review is bounded to current source; final acceptance still requires the repaired build gate and parent's actual CZ/EN desktop/mobile/keyboard/overflow QA.

## Source identity at review

SHA-256 (paths relative to `app/`):

| Source | SHA-256 |
|---|---|
| src/components/RqHeader.astro | 58c0714a3d48ce38db4d9e3d29a8926b272d2f2e1f4ed28c290f2041e49685db |
| src/components/RqFooter.astro | 2d06c7916d142ca2f84aa6320e491a43fef3b862e11ad78a1e185a539dd5fba9 |
| src/components/ServiceStories.astro | 243fc44fa8ff7d41b611140d169a65255b504a8c6703a656d693c1380ecd01a4 |
| src/components/LegalPage.astro | d39586f721c33380ebed47ad330a19a44ef48093277664e2f8211b5e2bc41e16 |
| src/layouts/RqLayout.astro | 9ab06b958410636e9177f2fc5084fe9b46b6add2bc35f31bc49118ad38f48066 |
| src/styles/studio.css | 837bfb7093ee7cc9f7a9f944fb12e429496664db9879e73c4434b3758f77c3da |
| src/styles/service-stories.css | 9e2961ebdee2e20d5d043b8b9dd3d18f624c249008362489327aaa8dd9e57b8b |
| src/lib/legal-paragraphs.mjs | d1a659baf585aa8c0f4dfcbcadb67696e6cb4b0d2e9ed6fb4a2828334877866a |
| src/lib/favicon-motion.mjs | ec6a86b9c47ab4550f00e509199dc1d58cd6d290ba4ae0bccfe9d50ef601ca90 |
| src/components/ServiceReturn.astro | 1be493214bc539b632175bff694e56291b7cd7921590b595d4b621f38088a739 |
| src/components/showcases/CoffeeDemoDocument.astro | aca687efc43b34c0a4fe1e0ea5585b32b43c193c4c0cfa42c2c4c79851d3e5ee |
