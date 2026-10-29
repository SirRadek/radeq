# Studio index and compact showcase tiles — implementation plan

> Inline execution in the existing snapshot; no Git history/worktree bootstrap, commit, push or deployment. Later owner's selection of concept3 with smaller expandable tiles is the design authority. Apply executing-plans within this accepted reversible scope, without another approval gate.

**Goal:** Implement left desktop navigation and grouped footer from concept3, with four compact native disclosure tiles, shorter legal reading and form layout; prepare original-logo favicon motion.
**Architecture:** Reuse existing Astro layout/components, actual model screenshots, locale data and backend unchanged. Add a final shared studio stylesheet; native details/summary for tile and mobile menu behavior. Keep real form markup/transport/security, adjust presentation only. Root and subpath builds retain their existing privacy separation.
**Spec:** `docs/design/2026-10-28-layout/ROZBOR.md` plus owner's selected refinement and `refined-index.png` in that folder. Preserve brand, real prices, four workflow meanings and CTA destinations. Generated demo photography/copy are illustrative and must not replace actual demos.

## Tasks

- [x] Review this plan independently using native gpt-6.1-sol medium as required by authoritative project rules; bind review to SHA256. Parent implements, one bounded reviewer, no recursive delegation/model changes for implementation.
- [x] Add a meaningful compiled fixture check first for four native disclosure tiles, default-closed state, separate links, localized actual images and all workflow outcomes. Update outdated three-row ordering/decoration expectations only where the design explicitly changes them. Run to observe RED. Do not add mirror tests for CSS values.
- [x] RqHeader: desktop left rail; mobile native expandable menu, visible current language/alternate URL, visible focus and44px controls. RqFooter: logo/identity and Kontakt/Prohlédnout/Informace groups; preserve cookie settings, legal/tool links, localized labels.
- [x] ServiceStories: reuse three existing stories, add first-class e-shop fourth tile with existing demo and a new actual screenshot in both locales. Details/summary with preview/title/one-line benefit; expanded paragraph, four-stage journey and separate direct demo link. Hash deep-link opens matching details on initial load and hashchange; native no-JS disclosure remains usable. No invented screenshots, giant open previews or fake actions.
- [x] Shared studio.css imported last: left rail>=1100px and bounded content, reduced section gaps/type scale, compact form with name/email row at usable width, full-width textarea110px, retained labels/Turnstile/legal/status and safe mobile single column. No fixed heights/inner scroll/content clipping. LegalPage:60–65ch, remove additive global section padding, short paragraphs by existing sentence boundaries with exact text retained, localized table of contents and stable anchors. Keep consent UI unaffected.
- [x] Favicon: reuse existing light/dark RQ PNG; one short gentle pulse with JS-generated same-origin-image canvas frames, no repeated network/frame, stop/reset on hidden/reduced-motion/pagehide; fallback to original link without JS or decode failure. Behavior tests of lifecycle with mocked clock/DOM/canvas (no external data).
- [x] Run affected tests and required verify-themed-demos root/subpath compiled/typecheck gate. Render actual local site in CUA at1280x720,390x844,320x740 and EN; verify no horizontal overflow, open/close/key focus, hash navigation, links, form footprint and legal line width. Do not send form, solve CAPTCHA or accept analytics. If CUA lacks reduced-motion/zoom emulation, unit/lifecycle tests cover motion and record native zoom limitation.
- [x] One targeted final review by same reviewer, and design-QA combined visual reference/render comparison. Fix material findings once, rerun justified checks, seal final source manifest. Update PREVZETI and evidence. Open verified local preview for owner; production version remains e1793e7a.

## Review focus and limits

Long EN labels,320px and200% equivalent reflow must not hide navigation/form controls. Optional details/status/CAPTCHA may expand form naturally, not be clipped to a height target. Explicit URL anchors must reveal hidden service prose. All four localized demos remain directly reachable. Mobile and no-JS navigation/disclosures use native controls. Retain legal exact words and field validation; no fake successful lead. Favicon link changes alone are not proof of native tab animation across browsers.

Resource class: coupled frontend implementation; existing parent model/provider/effort retained. One direct bounded reviewer, no recursion; incremental context24k/review48k, no observers or paid APIs. Progress recorded here, evidence in `docs/design/2026-10-28-layout/`.


## Outcome — 28 October 2026

Implemented locally. Plan review and one targeted source review accepted; superseded three-row/cursor expectations were repaired. Subsequent visual QA replaced tight thumbnail crops with actual wide CS/EN renders and reduced closed cards to280px; workflow rows no longer inherit large global list padding. Final source/build hashes match `verification.json`. Root/subpath gate24/24, Astro0errors/0warnings; new legal/fav tests6/6. Initial full141/141; final concurrent fixture timeouts were isolated and all three affected files passed serially24/24. No timeout was hidden or raised.

Actual rendered checks and comparisons: project-root `design-qa.md`, `docs/design/2026-10-28-layout/visual-comparison.png`. Local previews4394subpath and4395root. No production change, commit or push. Native tab favicon support/200% browser zoom remain explicit evidence limitations, not claimed successes.
