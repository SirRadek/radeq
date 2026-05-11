# Free Lead Capture on Cloudflare

## Goal

Store leads from the CLI Contact Terminal without paid email sending.

## Architecture

```text
Static Astro page
  -> /api/leads Cloudflare Pages Function
  -> LEADS_DB Cloudflare D1 database
  -> manual export / dashboard review
```

Email notification is intentionally not part of v1. Cloudflare D1 stores the lead first, so delivery does not depend on a mailbox, SMTP provider, or paid outbound email feature.

## Data Contract

The terminal sends this JSON shape to `POST /api/leads`:

```json
{
  "name": "Jan Siroky",
  "email": "siroky@radeq.cz",
  "company": "Radeq.cz",
  "project_type": "Service Landing",
  "audience": "Micro-SaaS founders",
  "deadline": "Q3",
  "current_url": "https://example.com",
  "budget_range": "50k-100k CZK",
  "message": "Need fast lead routing.",
  "source_path": "/",
  "referrer": "",
  "locale": "cs-CZ",
  "honeypot": ""
}
```

Required fields:

- `name`
- `email`
- `project_type`
- `message`

## Cloudflare Setup

1. Create the D1 database.

```powershell
# docs/autopilot/free-lead-capture-cloudflare.md
npx wrangler d1 create radeq-leads
```

2. Copy `wrangler.example.toml` to `wrangler.toml` and replace `database_id`.

```powershell
# docs/autopilot/free-lead-capture-cloudflare.md
Copy-Item .\wrangler.example.toml .\wrangler.toml
```

3. Apply the schema migration.

```powershell
# docs/autopilot/free-lead-capture-cloudflare.md
npx wrangler d1 execute radeq-leads --remote --file .\migrations\0001_create_leads.sql
```

4. In Cloudflare Pages, bind the D1 database to the Pages project with this binding name:

```text
LEADS_DB
```

5. Deploy the site. The endpoint path is:

```text
/api/leads
```

## Local Function Test

Astro preview serves the static build, but it does not emulate Cloudflare Pages Functions. For the API, use Wrangler Pages dev after building:

```powershell
# docs/autopilot/free-lead-capture-cloudflare.md
npm run build
npx wrangler pages dev .\dist
```

If `LEADS_DB` is not bound, the function returns:

```json
{
  "ok": false,
  "error": "Lead storage is not configured. Bind a Cloudflare D1 database as LEADS_DB."
}
```

## Mail Identity Recommendation

Use `siroky@radeq.cz` as the main human mailbox later.

Recommended aliases:

```text
kontakt@radeq.cz -> siroky@radeq.cz
contact@radeq.cz -> siroky@radeq.cz
info@radeq.cz    -> siroky@radeq.cz
```

The lead system does not require paid mail. Notifications can be added later from the stored D1 lead queue.
