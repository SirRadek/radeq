# Responsive scaling repair — RadeQ, 2026-10-28

Owner requests functional scaling at smaller widths and explicitly asks for agents builder, critic, verifier. This is a local repair of the selected studio index, no deploy/commit/push. Existing app snapshot, no Git bootstrap. Three named roles authorized by this latest owner direction; no recursive delegation. Current sealed baseline build-1793213914531.

Observed before editing: owner's actual IAB panel498x562, document scrollWidth483 (no global overflow), cards451x336, previews are cut by fixed image height/object-fit:cover. Prior width-only overflow checks did not prove full thumbnail visibility or readable composition at intermediate widths. Mobile naturally scrolls vertically; do not shrink all text to fit all content into one viewport or clip content.

## Goal and repair strategy

- Preserve original brand, chosen left rail/grouped footer, real CZ/EN copy/prices/demo links/native disclosures.
- Make actual preview images scale entirely into their containers with intrinsic proportions; no forced crop and no squeezed text/images. A bounded desktop size may use containment, not cover crop. Avoid huge full-width mobile preview; choose card layout/columns from usable content width.
- Find intermediate widths where hero, tiles, workflow, pricing, form or footer need fewer columns. Use explicit min-width:0/wrapping and content-driven grid breakpoints; avoid hidden overflow as a false fix.
- Check whole home and legal shared shell, open/closed menu and all cards, optional form, EN long labels, low viewport heights. Preserve labels44px controls and natural vertical growth.
- Critic reviews this plan/hash first independently as required by project AGENTS, then one implementation review. Builder owns only CSS/layout changes + focused regression checks. Verifier is independent, owns browser validation and new responsive evidence, does not edit app sources. Parent integrates and runs the shared build gate once after the final coherent patch. No overlapping builds: previous concurrent Astro fixture tests caused resource timeouts.

## Roles, paths and bounds

Builder: app/src/styles/studio.css, service-stories.css; existing home stylesheet/scoped component styles only if a demonstrated related cause requires them. No backend/data/email/consent logic. Budget24k incremental retrieved context, reassess48k; 10 turns/30 tool envelopes/two materially different repair attempts; report≤1500tokens plus local log.
Critic: native gpt-6.1-sol medium per project review rule, read-only app; plan and final focused review to docs/design/2026-10-28-responsive/. Budget12k/24k context;8turns/20tool envelopes/two attempts; report≤1200tokens. No browser until agreed, no build.
Verifier: preserve parent profile, independent read-only source/browser; baseline strategy now, actual browser after parent handoff. Budget16k/32k context;10turns/30tool envelopes/two attempts; report≤1500tokens. Exclusive CUA ownership during verification to avoid cross-tab/viewport interference. Evidence in project per owner Autopilot rule. Do not send forms/solve CAPTCHA/enable measurement. Browser plugin absent; use existing CUA in-app browser2 only, fresh capability handles and actual viewport measurements, reset before returning.

## Acceptance

Reproduce before/after for narrow owner-like498x562 plus320,390,601,768,900,1024,1099/1100,1280 widths. Include320px reflow, a low desktop height, and125/200% equivalent reflow; report true native zoom as untested if unsupported. Assert viewport matches requested width before screenshots (previous stale capability was a trap). No document overflow, local clipped text/controls or overlapping components; image rendered box fits entire intrinsic image (contain or equal intrinsic ratio), not merely scrollWidth. CZ/EN home/card/form/footer, keyboard/native menu, hash return, legal shared shell. Exact legal/source backend hashes remain unchanged.

Record primary source review and independent rendered verdict; repair material finding once, targeted recheck only. Required gate node scripts/verify-themed-demos.mjs (root/subpath builds,24compiledtests,typecheck). Reuse unrelated unit receipts; run narrow meaningful regression checks for changed behavior without CSS-value mirror tests. Final manifest/hashes, updated PREVZETI and design-qa.md, same local preview URL for owner.
