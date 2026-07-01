# radeq /audit tool — launch checklist (owner-only Cloudflare steps)

Everything that needs YOUR Cloudflare account/auth to go live (Claude can't do these from here — they need
`wrangler login` / your dashboard). The code is ready + gated: the tool already works without any of these; each
one hardens or enables a piece. Run these on the machine where `wrangler` is logged in.

## 1. PSI API key — ✅ DONE
- Stored as a Cloudflare secret (production) + locally in `.gitignore`d `.dev.vars` for testing.
- (If you ever need to re-set it: `wrangler secret put PSI_API_KEY`.)

## 2. KV rate-limit (recommended before public launch)
The code already uses a KV rate-limit IF the `MEASURE_RATE_LIMIT` binding exists (else an isolate-local fallback).
Create the namespace + bind it:
```bash
wrangler kv namespace create MEASURE_RATE_LIMIT
# copy the printed id, then add to wrangler.toml (this file is gitignored/local):
```
```toml
[[kv_namespaces]]
binding = "MEASURE_RATE_LIMIT"
id = "<paste-the-id-here>"
```
Redeploy after adding it. (Limit is 5 measurements / 10 min / IP — tune in `functions/api/measure.ts`
`RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_SECONDS`.)

## 3. Turnstile (optional anti-abuse — prevents the public tool being used as a free PSI proxy)
Code is wired + GATED: without keys it's inert (tool works as-is); with keys it's enforced.
1. Cloudflare dashboard → Turnstile → add a widget for `radeq.cz` → get the **site key** (public) + **secret key**.
2. Set the public site key as a BUILD env var (Pages/Worker build settings, or `.env`):
   `PUBLIC_TURNSTILE_SITE_KEY=<site-key>`   (rebuild so it's baked into the frontend)
3. Set the secret as a Cloudflare secret:
   `wrangler secret put TURNSTILE_SECRET`   (paste the secret key)
- With both set, `/api/measure` returns `verification_failed` for missing/invalid tokens; the widget shows on
  `/audit`. Leave them unset to keep the tool open (rate-limit still applies).

## 4. Deploy
```bash
wrangler deploy          # deploys worker/index.ts + the built ./dist assets
```
(Run `npm run build` first so `dist/` is fresh.)

## 5. Push the branch
```bash
git push origin new      # then merge to your production branch / trigger your deploy flow
```
(4 new commits: governance re-lock · web rework · /audit tool · docs.)

## 6. Post-deploy smoke test
- Open `https://radeq.cz/audit`, measure a real URL → confirm: qualitative findings (NO score/number), honest
  "no field data" fallback for low-traffic sites, the "Chci lidský audit od 4 900 Kč" CTA pre-fills the contact
  form with the URL, the automation qualifier shows.
- Try a private URL (e.g. `http://localhost`) → must be rejected (`invalid_url`).
- Confirm the homepage: hero primary CTA above the fold on a phone, scale-up on a wide monitor, mascot OFF by
  default (footer toggle turns it on).

## Notes
- `.dev.vars` (your local PSI key) and `wrangler.toml` (your D1/KV ids) are gitignored — they stay off GitHub.
- The CRM `.xlsx` is gitignored (may hold lead data) — keep it out of git.
