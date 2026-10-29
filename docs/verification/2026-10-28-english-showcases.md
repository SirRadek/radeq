# English showcases — execution receipt, Windows 2026-10-28

Owner scope: English homepage miniatures and all four complete interactive examples. Local implementation in `app/`; original transfer remains the baseline. No commit, push, deployment or production change.

Reviewed plan: `../superpowers/plans/2026-10-28-english-showcases.md`, SHA-256 `8501221D9EB9A8227A3415D33F25DD822A33356871721E9247386AD5873C3E05`. Independent native gpt-6.1-sol / medium review accepted it; receipt is alongside the plan. Plan was retained unchanged. Implementation and primary final inspection were performed in the main context.

## Results

- `npm test -- --reporter=dot --maxWorkers=1`: **120 passed**, 20 test files passed, 3 compiled suites skipped in the unit-only run. Evidence: `2026-10-28-unit.log`.
- `node scripts/verify-themed-demos.mjs`: **exit 0**, fresh root and `/radeq` builds, 42 pages each; **24 compiled tests passed**, 5 files. Astro scoped check: **79 files, 0 errors, 0 warnings, 6 hints** in existing portfolio/service/blog code. Build receipt: `2026-10-28-build.log`; detailed logs beside the manifest.
- Final manifest: `app/docs/audits/2026-10-09-themed-demos/build-1793195077266/artifact-manifest.json` (relative to workspace). Sources and compiled outputs sealed by the existing verification script; preview startup checks both against SHA-256.
- Initial red tests observed missing English routes/links and Czech CSV header before implementation. Unit run under competing builds hit fixture timeouts; serial execution passed without weakening assertions or increasing timeouts. Windows subprocess entrypoints and fixture/typecheck path separators were corrected.
- Final primary inspection confirmed fixed known locale routes, static English return links, text-only user descriptions, and unchanged plumber/booking/workshop state modules and package lock versus transfer baseline.

## Browser checks

Actual local pages were exercised through the in-app browser, including English plumber problem selection/contact summary; booking empty availability, reset and confirmed appointment; workshop done/undo/all-complete stock transitions; coffee basket/order/packing/ready/reset. Final build additionally checked filter → Ethiopia Sidamo 500 g → basket: **CZK 499**, **1 pack**, English accessible status; restart restored the initial state and language switch opened the intact Czech shop.

Desktop 1280px homepage and all examples were inspected. At 320px, homepage, plumber, booking and workshop reported zero horizontal overflow and were visually inspected; coffee catalog was also visually checked at 320px. English homepage uses three real screenshots captured from English examples. Final booking miniature visibly shows English date, selected time and label. Home and coffee console checks returned no warnings/errors. `2026-10-28-english-home.png` records the visible English miniatures.

Root and subpath compiled contracts verify all four English pages, language, noindex, static headings/returns, EN gallery/home links, screenshot assets, and retained Czech routes/assets. Existing reduced-motion CSS was preserved; runtime reduced-motion emulation, 200% zoom and backend behavior were not newly checked.

## Local handoff

`http://127.0.0.1:4394/radeq/en/` serves the final verified subpath build. CZ home, EN home and all four EN pages returned HTTP 200. Served booking image SHA-256 matches its source: `10A0CA1B3820D5ABFC24949CADACF1FBEDD1A7F229BB1C9C04B457EAA59E723B`.

`start-preview.ps1` starts `serve-app-preview.py`; it binds only 127.0.0.1 and rejects changed source/artifact hashes. Prior original preview was stopped only after PID/command identity check, and replaced with this server (PID 28344 at handoff; always recheck identity before stopping). Temporary 4395/4396 preview processes were cleaned up with identity checks.

Original `verify-package.py`: **384 packaged files match SHA-256**. Original archive on D: and sealed transfer evidence were retained. Project Mesh remains unavailable; deferred observer/logging/Context Manager were not installed.
