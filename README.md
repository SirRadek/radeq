# Radeq.cz Website

Static Astro site for Radeq.cz, built for Cloudflare Pages.

## Stack

- Astro static output
- React islands for interactive UI
- TypeScript
- Tailwind CSS v4
- Three.js loaded only for the optional 3D enhancement
- Cloudflare Pages Functions + D1 contract for lead capture

## Local Development

```powershell
npm install
npm run dev
```

## Checks

```powershell
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## Routes

- `/` Czech version
- `/en/` English version

## Cloudflare

The site builds to `dist/`.

Lead capture uses the Pages Function at `/api/leads` and expects a D1 binding named `LEADS_DB`.

Use `wrangler.example.toml` as the template for local Cloudflare setup.
