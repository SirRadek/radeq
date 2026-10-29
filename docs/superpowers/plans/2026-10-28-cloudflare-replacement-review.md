# Independent plan review — Cloudflare replacement

**Verdict: needs_changes. Local implementation may proceed. Production upload and old-deployment deletion must wait for the concrete release safeguards below.**

Reviewer: existing native gpt-6.1-sol / medium worker, 28 October 2026. Reviewed plan SHA-256 **4DAABF055772379802E7B133EC52E027C0E71D5E57402C46597C0EF9BF08550F**, verified directly. Scope: plan plus current `RqContactForm.astro`, `RqLayout.astro`, `MeasurementTracker.tsx`, `measurement.ts`, Czech privacy page and `functions/api/leads.ts`. Read-only; no credential reads, remote mutation, builds, implementation or subagents. This review does not supersede the owner's existing authorization to publish.

## Required plan amendments

### P1 — Bind the backend that will actually execute to the release artifact

Task1 establishes project/bindings and Task5 proposes uploading a root artifact with existing API routes preserved. That does not yet define how Pages Functions are retained. An upload can package local `functions/`, generated `_worker.js` and route configuration together with static files; unchanged local source does not prove equality to deployed code. The current local handler writes D1 and sends through Resend, so an accidental backend replacement has persistence/email impact.

Add a hard gate before preview and production: identify the exact upload command, working directory, functions/worker compilation source, routes and output, then record a manifest covering static assets **and executable backend**. Capture or otherwise establish the current production backend identity, compare it with the backend to be uploaded, and explicitly account for any difference. If identity cannot be obtained, compatibility tests alone must not be described as proof that the same backend was retained: resolve whether the upload can preserve the existing executable backend, or stop production pending a separately reviewed backend replacement consistent with owner scope. Include route-collision checks so `/api/leads` cannot become an Astro fallback/404 or static file.

The same preview gate must establish that preview cannot reach production D1, production KV or Resend; a different branch name is not isolation. An isolated local/mock test may prove frontend behavior without deploying a mail-capable preview handler. Missing/unknown critical bindings remain a production blocker as the plan already requires.

### P1 — Define a usable rollback and a retained recovery window

“Available rollback/source evidence locally” is weaker than a restorable release. Once an old Pages deployment is deleted, its static files plus executable Functions might not be recoverable from screenshots, hashes or source of uncertain identity. The plan currently schedules retirement without stating what remains deployable.

Before production mutation, record the current production deployment/alias, relevant project/environment configuration, and an exact supported rollback method. Retain at least one verified restorable previous release through a defined observation window; check that its backend remains compatible with the unchanged data. Hashes establish identity but cannot restore missing bytes. Do not delete the only usable rollback deployment until an independently deployable copy of its frontend/backend exists and restoration steps are verified to the degree possible without switching production. Inventory deletion targets and exclusions by exact ID. The owner has authorized replacement/cleanup; this is a sequencing safeguard, not a demand for redundant authorization.

### P2 — Make successful receipt and notification failure separate acceptance cases

Task3 correctly bases conversion on a successful backend receipt. Add the existing handler's exact contract to Task4: `functions/api/leads.ts` returns201 with `{ok:true,leadId}` **after storage even when notification or visitor confirmation email fails**. The UI must say the enquiry was received/stored and must not promise inbox delivery or a confirmation email solely from201. Tests should cover201 with email failure, non201 JSON, malformed/non-JSON response, retry, and a delayed response with repeated submit attempts. Client locking prevents concurrent clicks; it does not establish server idempotency after a connection is lost following storage. Keep that limitation explicit unless a backend change is separately scoped.

### P2 — Make legal and provider verification an evidenced gate

The consumer scope is appropriately framed: an enquiry is non-binding and the individual contract supplies applicable pre-contract/withdrawal material before acceptance. Add current **official** source verification for identity/ARES, ČOI ADR and withdrawal/pre-contract requirements, plus actual provider processing/transfer disclosures and current GA4/Sklik configuration APIs. Record facts and verification dates. The plan is not a legal certification; do not present a generic cooperation page as completing all later individual consumer-contract obligations.

For consent tests, explicitly include rejection stored across navigation, expiry/storage failure returning to denied, withdrawal while a third-party loader is pending, and revocation after a provider has already loaded. Prevent both automatic and custom future events, including full referrer/page location collection; do not assume removing the script node unloads initialized trackers. Use provider-supported controls where available and verify observed requests. These are targeted acceptance additions to the existing strong consent design.

## What can proceed now

Proceed locally with contact-form locking/errors/bounds, draft removal, thumbnail repair, paired metadata, identity/legal drafts backed by official sources, consent implementation with disabled integrations when real IDs are absent, and isolated tests/rendering. The plan already correctly separates analytics from advertising consent, forbids pre-consent pings, avoids mandatory enquiry consent, preserves demo semantics and distinguishes preview indexing from production.

Pending GA4/Sklik/verification IDs do not block independent local work. Do not silently waive requested analytics activation at launch: establish and record whether the authorized release may ship with those integrations disabled if IDs remain unavailable. Backend upload identity, preview isolation and a usable rollback are release blockers regardless of analytics readiness. Enforcing the six-month unsuccessful-enquiry policy must include the actual operational deletion procedure and treatment of copies in email/backups, without inventing a new automated job or deleting contractual records. No additional user approval is required for work already authorized; ask only for facts/decisions that cannot be established from current accounts and evidence.

## Targeted re-review — revised Workers plan

**Verdict: accepted for implementation, subject to the plan's explicit pre-promotion verification gates. No additional material plan blocker identified.**

Reviewed revised plan SHA-256 **E2B5763727CF1AAB20D60C65193F57B47B7B91219116632BC7FF244362CA95C2** on 28 October 2026, plus `worker-before/source-manifest.json`, `settings.json`, `deployments.json`, version/subdomain inventory and targeted code in downloaded `modules/index.js`. This is the one targeted plan re-review justified by the serious discovery that the live custom domain belongs to Worker `radeq`, rather than the unrelated Pages project. It is not a final implementation or release approval.

The revised architecture resolves the two earlier P1 planning blockers. It now identifies a preserved executable module, exact Worker/account, D1/KV IDs, compatibility date, nonbundled wrapper and asset routing, version upload before promotion, and an exact retained rollback version. The downloaded module's actual SHA-256 is **c80dd654a4775cc1a49a84ec8de4b8b24b643377574cb789caeaaec4379dd67a**, matching the proposed preserved module. Settings corroborate D1 `50e2c98b-9ecc-4d28-a674-4fa8b44b7a78`, KV `5cd5df0326a7478cbfb3f84d001af783`, ASSETS and compatibility date2026-06-11. Current deployment inventory identifies version `8f661eab-32da-47b3-b4a9-f55926c7b425` at100%. Its continued retrievability and associated assets must still be checked at release time as the plan requires.

Targeted backend inspection supports the frontend compatibility adjustment: `index.js:20` requires `project_type`; lines1086–1102 route only `/api/leads` and `/api/measure`, with POST/OPTIONS handlers; line1121 falls through to `env.ASSETS.fetch(request)`. Thus a disclosed generic project category can preserve the actual backend contract without silently substituting local API code. Source immutability must hold through the final upload, not merely through the original download.

The revision also addresses201 receipt versus email delivery, non-idempotent retry limits, official-source evidence, operational retention and consent-loader/revocation races. The current Sklik SEM choice is explicitly reflected. This review checks inclusion of those gates; it does not independently certify every cited legal/provider source or the provider configuration.

Final implementation review should focus on the following already-required gates:

- Compare exact backend bytes before/after upload and ensure neither local `functions/` nor a generated worker replaces them. Check emitted module/config/asset manifests and remote binding/secret **names**, without exposing values.
- Exercise the nonproduction host denial against **both API endpoints and all HTTP methods**, including OPTIONS. The wrapper must reject before executing the original backend; use mocks that fail on any D1/KV/external-fetch access. Exact normalized hostname comparison must not admit suffix matches, user-controlled forwarded headers or arbitrary `*.workers.dev` hosts. Preview response noindex must include asset and error responses.
- Verify `run_worker_first`/ASSETS behavior, no accidental SPA fallback on API routes, and unchanged production requests/env for the preserved handler. Host-gate testing cannot be replaced by merely checking that preview HTML contains no form.
- Promote precisely the independently reviewed, previewed version ID at100%; recheck target/config/bindings and rollback availability immediately before promotion. Keep the previous version and its assets at least7days and record any limitation on historical preview exposure instead of deleting the recovery copy.

Local implementation may continue now. Missing public analytics IDs still permit disabled integration development, but activation claims and launch dependencies must remain explicit. Existing owner publication authorization remains valid; this acceptance adds no redundant permission step. The final patch review and actual release checks remain outstanding.
