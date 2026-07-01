# Radeq.cz Website Architecture

Last updated: 2026-06-30
Next review: 2026-07-07
Status: active
Slug: `radeq`
Primary repository: `SirRadek/radeq`
Canonical local root: `C:\Users\sirok\Documents\Projects\radeq`
Separation status: `separated`
Visibility: public repository, with private reference assets excluded by policy

## Purpose And Scope

Radeq.cz is a public static website for selling **websites, data and practical automation** for sole traders and small businesses, with supporting proof, pricing, handoff, and lead capture. The current product surface is the Czech route `/`, the English route `/en/`, Czech static public showcase routes under `/ukazky/`, a fixed public homepage offer, a static three-step primary service path, a separate secondary-services block, a pricing section, optional compatibility/demo routes under `/demo/<module>/` and `/en/demo/<module>/`, a light/dark visual mode toggle, an optional 3D mascot enhancement, and a Cloudflare D1-backed lead capture endpoint.

Business positioning lock — **RE-LOCKED by the owner on 2026-06-30** (supersedes the 2026-06-11 complete-websites-only lock; the owner explicitly changed direction, which `offer_positioning_conversion` permits): the public offer is **websites, data and practical automation** (`Weby, data a automatizace`) for sole traders and small businesses. Websites/redesigns remain the accessible entry; **process/data automation is now a co-primary, high-margin pillar — not a secondary path** — provided every automation claim is backed by proof (a case study, a before/after, or a working prototype on the client's real data), never hype and never a guaranteed "zero errors" promise. The paid entry product is `Audit webu nebo procesu — od 2 900 Kč` / `Website or process audit — from 2 900 Kč` (the audit fee is fully credited toward the realization; owner lowered the entry from 4 900 to 2 900 on 2026-07-01 — a small site is ~1 hour of senior time), and the primary CTA starts an audit/website conversation at `#terminal`. **Focus guardrail carried over from 2026-06-11:** the homepage must still read as a clear, focused offer to this audience — not a broad do-everything portfolio; secondary surfaces (WordPress/WooCommerce/Shopify, SEO, migrations, PC support, AI helpers, the 3D mascot) must not sprawl the first viewport or blur the primary CTA. The earlier `Audit webu s plánem` naming and the acquisition plan's `rychlá oprava 2 900–4 900 Kč` framing are both superseded by the single `Audit webu nebo procesu od 2 900 Kč` entry product — which, despite now sharing the 2 900 number, stays an AUDIT (credited, web-or-process), NOT the `rychlá oprava` fix: the kontrola/oprava/rychlá framing remains forbidden, only the price changed.

Out of scope for the current architecture:

- user accounts or authentication
- payments
- autonomous agent execution
- public exposure of private project inventory
- remote mutation from the UI

## System Boundary

In this project:

- Astro static pages and layouts
- React islands for interactive UI
- typed content and style matrix data
- optional Three.js mascot runtime
- Cloudflare Worker `radeq` serving production static assets for `radeq.cz`
- Cloudflare Pages Function-compatible lead handler at `/api/leads`
- Worker adapter at `worker/index.ts` routing `/api/leads` to the existing lead handler and all other requests to static assets
- Cloudflare D1 schema and local integration gate
- Resend (`https://api.resend.com/emails`) for fail-soft lead notifications to `siroky@radeq.cz`, sent from the Worker via `fetch` using the `RESEND_API_KEY` secret (migrated off the Cloudflare `send_email` binding on 2026-07-01; deployed live)
- Playwright and Vitest verification

External to this project:

- Cloudflare account configuration and real production D1 database ID
- Resend account + `radeq.cz` sending-domain verification (DKIM + return-path DNS on Cloudflare) and Resend dashboard delivery logs
- GitHub repository hosting and GitHub Pages deployment environment
- Fastmail human mailbox hosting for `siroky@radeq.cz`, `info@radeq.cz`, and `poptavky@radeq.cz`
- Resend adopted 2026-07-01 as the transactional email provider (replaced the Cloudflare `send_email` binding for deliverability: aligned DKIM for `radeq.cz`, no dependence on the Fastmail-only root SPF)
- future Autopilot dashboard or project inventory system

## Repository Boundary

Radeq is a product project, not the Autopilot control plane. Its canonical source code belongs in its own local root and remote repository:

```text
C:\Users\sirok\Documents\Projects\radeq
SirRadek/radeq
```

Autopilot may track Radeq through registry rows, architecture mirrors, sanitized snapshots, and work-log summaries. Autopilot must not become the canonical home for Radeq runtime code, migrations, deployment configuration, or assets.

Current state: the local Radeq product checkout exists separately at `C:\Users\sirok\Documents\Projects\radeq`. Cleanup PR `https://github.com/SirRadek/radeq/pull/1` was merged into `new` as `ef7053c`, so legacy Autopilot governance files are no longer present on the Radeq default branch.

## Decision Mesh

Project-specific mesh path:

```text
docs/projects/radeq/decision-mesh/
```

Current mesh coverage:

- primary offer positioning, first paid product, CTA hierarchy, and homepage conversion scope
- static public site boundary
- Czech static showcase examples for public-safe proof, rule-based chatbot boundaries, and inquiry-only offer/e-shop examples
- domain email provider research boundary for forwarding, mailbox hosting, transactional mail, and form backend separation
- lead capture and D1 data flow
- optional 3D mascot add-on
- SEO and performance surface
- runtime observability boundary for project-owned logs, deployment evidence, client console symptoms, lead API failures, and performance bottlenecks

This is a control-plane mirror for Radeq architecture evidence. Canonical product runtime code remains in the Radeq repository.

## Runtime Architecture

Static page shell:

- `src/pages/index.astro` renders the Czech route.
- `src/pages/en/index.astro` renders the English route.
- `src/pages/ukazky/index.astro` and `src/pages/ukazky/[example].astro` render the Czech-first static showcase hub and detail pages for chatbot, automation, and offer/e-shop inquiry examples. The chatbot detail uses prepared decision-tree data and a local React island only for visible choice state; it is not a model-backed AI chat and does not submit data before explicit contact.
- `src/pages/demo/[module].astro` renders Czech interactive demo pages. Demo routes are directly addressable compatibility/review surfaces and are not linked from the main homepage decision path. `/demo/service-landing/` remains a shop-only showcase for QA and direct review; `/demo/eshop-offers/`, blog/docs, and team-overview modules remain directly addressable compatibility routes until a separate URL migration removes or redirects them.
- `src/pages/en/demo/[module].astro` renders the English equivalents.
- `src/layouts/BaseLayout.astro` sets global metadata, canonical URLs, alternate links, Open Graph URL metadata, language, global CSS, `MotionOrchestrator`, and the route-level style-source boundary. Public homepage routes use fixed `variant-a`; demo routes opt into stored A/B/C/D style state.
- `src/pages/robots.txt.ts` and `src/pages/sitemap.xml.ts` generate static indexability endpoints from the configured Astro `site` and `base`.

Interactive islands:

- `src/components/StyleVariantToggle.tsx` is hydrated with `client:load` on demo routes and controls `html[data-style]` with four-theme persistence only where `BaseLayout` allows stored style state. Its compact Czech/English menu exposes descriptive names while retaining the stable `variant-a` through `variant-d` storage and event contract.
- `src/components/StyleMatrixSimulator.tsx` is hydrated with `client:load` on demo routes, reads typed presets from `src/data/styleMatrix.ts`, and follows the global style switch instead of owning a separate A/B/C/D picker. The primary and compatibility shop routes use `shopOnly`, so A/B/C/D changes presentation while products, filters, comparison, and demo-cart behavior remain fixed.
- `src/components/ThemeModeToggle.tsx` is hydrated with `client:load` and controls `html[data-theme]` with a light-first default and localStorage persistence.
- `src/components/ContactTerminal.tsx` is hydrated with `client:load` and posts lead payloads to `/api/leads`. Its UI contract includes explicit labels and autocomplete metadata, required/optional guidance, inline localized validation, focus transfer to the first invalid field, and live status feedback. The API payload, persistence, and server validation contracts remain unchanged.
- `src/components/MotionOrchestrator.tsx` tracks active sections, pointer motion, scroll state, and reduced-motion state.
- `src/components/CatGuide.astro`, `src/components/StudioProof.astro`, and `src/components/DemoWorlds.astro` remain retained proposal components but are no longer rendered by the public homepage. The public homepage uses the fixed complete-website offer, pricing, handoff, about, and lead-capture sections.
- `src/components/CoreIsland.tsx` dynamically imports Three.js and `GLTFLoader` only after the user enables the 3D mascot, and exposes asset provenance and budget metadata as non-content `data-*` attributes.
- `src/lib/catMascot.ts` owns the mascot asset manifest for source, license, provenance, byte budget, triangle budget, loading strategy, and SEO role.

Lead API:

- `functions/api/leads.ts` handles `POST /api/leads` and `OPTIONS`.
- `worker/index.ts` adapts the same lead handler for the production Worker runtime and serves static assets through the Worker `ASSETS` binding.
- `src/lib/leads.ts` owns payload creation, validation, field limits, context minimization, and lead IDs.
- `src/lib/leadNotificationEmail.ts` owns the server-side lead notification: it builds the message and POSTs it to Resend (`api.resend.com/emails`) after successful D1 storage, authenticating with the `RESEND_API_KEY` secret (returns `skipped` when the secret is absent; throws on a non-2xx Resend response so the caller logs it fail-soft).
- `migrations/0001_create_leads.sql` defines the D1 `leads` table and indexes.

## Data Flow

Lead capture flow:

```text
Visitor
  -> ContactTerminal form fields
  -> createLeadPayload()
  -> client-side validateLeadSubmission()
  -> fetch POST /api/leads
  -> functions/api/leads.ts
  -> server-side validateLeadSubmission()
  -> minimizeLeadContext()
  -> LEADS_DB.prepare(...).bind(...).run()
  -> D1 table `leads`
  -> Resend POST notification to siroky@radeq.cz via the RESEND_API_KEY secret (owner unified all site emails to siroky@radeq.cz + migrated notifications from the CF send_email binding to Resend on 2026-07-01)
  -> manual export or future dashboard review
```

Lead notification behavior:

- Email is sent only after successful D1 storage.
- The visitor-facing API response remains successful if the email notification fails.
- Email failures are logged with lead ID, error code, and generic message only; customer details are not printed to runtime logs.
- The notification is sent from `siroky@radeq.cz` to `siroky@radeq.cz` via Resend, with `reply_to` set to the visitor's submitted email. Delivery requires the `RESEND_API_KEY` secret AND a Resend-verified `radeq.cz` sending domain (DKIM + return-path DNS records added on Cloudflare — these do not conflict with the Fastmail inbound MX); until both exist the send is skipped/failed fail-soft and the lead is still stored in D1. (All site-facing emails were unified to `siroky@radeq.cz` on 2026-07-01 — visible copy, form notification, and JSON-LD metadata.)
- History: owner requested GitHub-only staging on 2026-06-12 (production rolled back to `747d1ab3-ff49-497b-8cb8-917c67d0153d`). Superseded on 2026-07-01 — the current Worker (Resend notification path + /audit tool + the site rework) is deployed live to production; the notification fires fail-soft once `RESEND_API_KEY` and the Resend sending domain are configured.

Required lead fields:

- `name`
- `email`
- `project_type`
- `message`

Privacy minimization:

- `source_path` is stored as same-origin path without query or hash.
- same-origin `referrer` is stored as path only.
- external `referrer` is stored as origin only.
- `honeypot` must remain empty.

## Integrations

GitHub:

- repository remote is `https://github.com/SirRadek/radeq.git`
- default branch is `new`
- current GitHub Actions workflow deploys GitHub Pages on push to `new`

Cloudflare:

- production `https://radeq.cz` is served by Cloudflare Worker `radeq` with Workers static assets
- Cloudflare Pages project `radeq-cz` remains available for Pages deployments and preview URLs
- `wrangler.worker.example.toml` documents the Worker static-assets deployment shape with a placeholder D1 database ID
- `wrangler.example.toml` remains a Pages-oriented template
- D1 binding name is `LEADS_DB`
- local runtime gate uses `npm run cf:pages:dev`

Vercel:

- no current runtime dependency
- Vercel Workflow remains phase-2 research only

Linear and Docket:

- no current runtime or repository integration is implemented

## Deployment And Environments

Local development:

```powershell
npm run dev
```

Static build:

```powershell
npm run build
```

Local Cloudflare Pages and D1 gate:

```powershell
npm run test:leads:cloudflare
npm run build
npm run cf:d1:migrate:local
npm run cf:pages:dev
```

GitHub Pages path behavior:

- `astro.config.mjs` uses `DEPLOY_TARGET=github-pages`
- GitHub Pages build uses site `https://sirradek.github.io`
- GitHub Pages build uses base `/radeq`
- Preview branch `codex/radeq-ab-c-preview` was temporarily allowed to deploy to the `github-pages` environment for draft PR preview `https://github.com/SirRadek/radeq/pull/2`.

Cloudflare Worker production behavior:

- production site is configured as `https://radeq.cz`
- base path is `/`
- `wrangler.toml` is ignored locally because it contains environment-specific production binding details
- safe committed Worker config lives in `wrangler.worker.example.toml`
- the deployed Worker uses `ASSETS`, `LEADS_DB`, and `MEASURE_RATE_LIMIT` (KV) bindings plus the `PSI_API_KEY`, `TURNSTILE_SECRET`, and `RESEND_API_KEY` secrets; `RESEND_API_KEY` is optional (absent → lead notifications are skipped fail-soft)

Cloudflare Pages path behavior:

- project name is `radeq-cz`
- latest verified production Pages deployment during the 2026-06-12 deploy was `https://787534f2.radeq-cz.pages.dev`, but the apex route was controlled by Worker `radeq`

## Security And Privacy Controls

- No secrets or real D1 database IDs belong in the repository.
- `wrangler.toml` must remain untracked/ignored when it contains production binding IDs.
- `wrangler.example.toml` is a template only.
- D1 binding is required at runtime; missing binding returns a controlled setup error.
- The `RESEND_API_KEY` secret is optional at code level: a missing or failing Resend send cannot lose a stored lead. The send is wrapped in try/catch and only a status-level error (no customer PII, no API key) is logged.
- API responses use JSON, `cache-control: no-store`, and CORS headers for POST/OPTIONS.
- `public/_headers` defines security headers and immutable caching for hashed Astro assets.
- Private original reference assets must not be shipped or sent to external models.
- Public cat reference assets must be approved derivative assets only.
- External model critique must use redacted aliases and no private repo bodies, tokens, customer data, or local account details.

## Verification Gates

Standard local gate:

```powershell
npm run test
npm run typecheck
npm run build
npm run test:e2e
```

Lead pipeline gate:

```powershell
npm run test:leads:cloudflare
npm run build
npm run cf:d1:migrate:local
npm run cf:pages:dev
```

Supplemental checks:

```powershell
node --check scripts/run-local-pages-dev.mjs
git diff --check
```

## Known Gaps And Risks

- Cloudflare lead API remote proof included a single synthetic production test lead submitted during the brief notification deployment on 2026-06-12: `lead_mqb2u5q6_b91abd77`. The Worker was then rolled back at owner request to keep the change GitHub-only for now.
- Wrangler Email Sending beta `list` and `settings` commands returned Cloudflare API `Unauthorized [code: 2036]` under OAuth even though the Worker deploy accepted the `EMAIL` binding. Dashboard mailbox/log review remains the delivery confirmation path.
- No official `@cloudflare/vitest-pool-workers` or Miniflare coverage exists yet.
- Performance budget checks are not automated.
- Automated accessibility checks for `ContactTerminal` and `StyleMatrixSimulator` are not yet expanded.
- The `/autopilot` dashboard route and typed project inventory do not exist yet.
- GitHub Pages workflow, Cloudflare Pages project `radeq-cz`, and Cloudflare Worker `radeq` coexist, so deployment target must be named explicitly in handoffs.
- The business positioning lock and `/ukazky` implementation are reflected in the production Worker runtime as of 2026-06-12.
- The prior WordPress/WooCommerce repair niche from the addendum is explicitly not the selected primary direction after owner correction; complete websites are the selected direction.
- A/B/C/D preview variants are now treated as internal review or portfolio-proof mechanisms unless the owner explicitly approves them as a public homepage control.

## Architecture Change Triggers

Update this file when any of these change:

- route structure or public page responsibilities
- primary offer, paid entry product, target audience, CTA hierarchy, or homepage positioning
- React island hydration strategy
- lead payload contract, validation, minimization, or D1 schema
- Cloudflare binding, migration, or deployment process
- GitHub Actions or deployment target behavior
- 3D mascot asset, runtime loader, or performance strategy
- security/privacy policy or external model disclosure rules
- verification gates or acceptance criteria
- project-specific Decision Mesh nodes, edges, rules, or stop conditions
