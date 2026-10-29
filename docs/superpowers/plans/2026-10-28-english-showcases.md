# English showcases implementation plan

**Goal:** English homepage thumbnails and all four linked demos are fully English, including interactions, with Czech versions preserved.
**Architecture:** Keep the sealed transfer package unchanged; copy its source snapshot to `app/` as the active editable project. Share the existing Astro components between Czech routes and four generated `/en/ukazky/<slug>/` routes via a `lang` prop. Translate at render time and in client renderers using a shared explicit translation catalogue; keep all simulation state logic intact. Use real screenshots of English demos for English thumbnails.
**Tech stack:** Existing Astro 6, vanilla client scripts, Vitest, existing browser tooling. Node 24, existing lockfile.
**Spec:** Owner request in current chat, clarified: miniatures AND full interactive examples.

## Constraints

- Local changes only; no commit/push/deploy, no production/backend/network submission or payment changes.
- Keep original transfer, original CSS/design, fixed fictional scenarios, model-only warnings, noindex, keyboard support and reduced motion.
- Preserve Czech entry points. New English routes and return/gallery/home links must work with both `/` and `/radeq` bases and without JavaScript.
- Keep CZK prices; translate currency presentation, dates, accessible labels and client status messages, not just static headings. Export labels may be English through an optional locale argument while retaining CSV escaping.
- Existing `?from=en` Czech links can redirect only to fixed known English counterparts for backwards compatibility; new links use English paths directly.

## Review focus

- Client updates must not restore Czech labels after changing service/day, resetting or finishing a job.
- English documents and links work without JavaScript; user text remains text, no HTML translation injection.
- Booking selection and confirmation remain distinct; workshop stock/undo and coffee order progression are unchanged.
- All four English examples are reachable from English gallery/home and return to the corresponding English service.
- Miniatures show actual English demo text and preserve crop, cursor placement and mobile sizing.

## Task 1: Localized documents and interactions

Files: `app/src/components/showcases/*.astro`, `app/src/components/themed-demos/{DemoThemeDocument,DemoThemeHeader}.astro`, client renderers, new `demo-i18n.mjs`, `app/src/components/ServiceReturn.astro`, new `app/src/pages/en/ukazky/[demo].astro`, `app/src/lib/coffee-orders.ts` if needed.

- [ ] Copy source to `app/` excluding sealed `site/`. Install locked npm dependencies.
- [ ] Add compiled behavior tests for English document lang, headings, fixed links and localized initial state; run against sealed preview to observe missing English routes.
- [ ] Add `lang?: 'cs'|'en'` (default cs), shared catalogue and English static routes. Translate all visible/accessibility text in four demos and their clients. Leave state transition logic intact.
- [ ] Exercise all four English flows in browser (plumber summary/reset, booking empty slots/confirm/reset, workshop done/undo/finish/reset, coffee filter/variant/cart/order/packing/ready/reset). Check Czech still works.

## Task 2: English miniatures, integration and verification

Files: `app/src/components/{ServiceStories,MinimalGallery}.astro`, new English screenshot assets under `app/public/images/services/`, compiled contracts, root `AGENTS.md`, `PREVZETI.md`, preview launcher.

- [ ] Update English homepage/gallery links, remove obsolete Czech-only notices and update existing compiled contracts for both locales.
- [ ] Capture real rendered English plumber/booking/workshop images matching current crops; preserve original Czech assets. Select locale-specific assets in ServiceStories.
- [ ] Build root and `/radeq` outputs with fresh local manifest; run unit + compiled tests and scoped Astro checks. Use direct Node entrypoints on Windows if historical npm spawn script is incompatible.
- [ ] Verify actual desktop and 320px mobile homepage/demo rendering, interactions, no relevant console errors, English miniatures and reduced motion.
- [ ] Replace local port 4394 preview only after final build is verified, checking old process identity before stopping it. Update active source path and restart instructions; preserve sealed baseline and describe real verification evidence.

## Review receipt

Independent plan review required by transferred project rules; hash is recorded with the review result. Implementation stays in this context. One targeted final review only if new findings justify it under owner economy rules.
