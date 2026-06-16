# RadeQ Project Work Log

## 2026-06-16 Homepage polish

Scope: nav order, section structure, service catalog, pricing, footer, focus states, and responsive layout.

Decisions:
- Homepage navigation is orientation, not a sales CTA. Keep it in page order: intro, problem framing, services, process, pricing, examples.
- Do not duplicate service tiles in adjacent sections. About explains the approach; service catalog carries the service taxonomy.
- Keep "process" close to pricing because it explains how price ranges become a real scope.
- Pricing cards do not link repeatedly to the form. Contact remains lower on the page.
- Cards need consistent hover, focus-visible, and viewport-center emphasis.
- Tablet is not stretched mobile. Keep service and pricing comparison in two columns until small mobile.
- Footer should carry trust data: clear email, owner, ICO, address, legal links, and copyright.

Verification:
- Astro typecheck, static build, Vitest, Playwright route/smoke tests.
- Runtime layout audit at mobile, tablet, desktop, and 4K checked nav, card counts, columns, footer contact, and overflow.

## 2026-06-16 Completion audit loop

Scope: final checklist pass after the first homepage polish preview.

Decisions:
- The top navigation ended with examples, so the homepage needs an examples section before contact instead of sending the user away from the page sequence.
- The full examples page remains useful, but it belongs as a secondary link inside the examples section.
- The homepage nav target for Ukazky/Work is `#demos`; route pages resolve it back to `/#demos`.

Verification to keep:
- Assert the homepage renders the demos section after pricing.
- Assert the nav target is `#demos` and route-page anchors point home.
- Keep the examples section public-safe: no private repository identifiers or raw client/project internals.
- Assert hash targets exist and their page positions increase in nav order: top, about, services, process, pricing, demos.
- Assert mobile nav can scroll/focus the final item without page overflow.
- Assert service/pricing grids at mobile, tablet, desktop, and 4K, plus visible hover/focus emphasis on cards.

Follow-up corrections from the loop:
- Moved the pricing anchor to the price-card area so `#process` comes before `#pricing` in real page geometry.
- Replaced the generic Czech homepage demo cards with the real public showcase links: chatbot, automation, and offer simplification.
- Removed the "in preparation" suffix from service-card example labels because public examples now exist.
