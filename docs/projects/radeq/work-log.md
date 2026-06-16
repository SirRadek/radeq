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
