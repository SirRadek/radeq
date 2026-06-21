Return ONLY a valid JSON object, no prose, no markdown fences.

You are a senior front-end engineer assessing implementation feasibility for a
homepage redesign. Do NOT write the full implementation now — assess and plan.

## Stack (facts)
- Astro (output: "static"), React islands, Cloudflare, D1.
- GitHub Pages preview build uses base="/radeq", site="https://sirradek.github.io".
  Local/prod build uses base="/". Asset URLs MUST go through the existing
  `withBaseHref()` helper in src/lib/links.ts — never hardcode "/".
- Styling: src/styles/global.css (palette tokens incl. green accent #257a3e and
  a dark theme) + src/styles/tokens.css (display type scale, --space-section,
  --reveal-duration). Both imported in src/layouts/BaseLayout.astro.
- Motion: src/components/MotionOrchestrator.tsx already runs client:load, picks
  scenes from `main section`, sets data-motion-ready / data-motion-scene on
  <html>, and honors prefers-reduced-motion.
- Homepage = src/pages/index.astro composing: HeroSection.astro (+ CoreIsland.tsx
  island), AudienceBand, ServiceCatalog, SelectedSystems, StudioProof,
  PricingSection, ContactTerminal.tsx. Content comes from src/data/siteContent.ts.

## Redesign goal
A striking-but-conservative homepage upgrade in the "craftsman's precision"
direction inspired by lepshee.com: bolder display headline, one signature visual
anchor, restrained scroll-reveal + hover motion, more intentional spacing/section
rhythm, optionally ONE dark "statement" block — WITHOUT removing pricing or the
inquiry form, and keeping Czech-SMB trust. Must keep build green and Pages preview
working under base="/radeq".

## Assess and return JSON with EXACTLY these keys
{
  "overall_feasibility": "high|medium|low",
  "reuse": ["existing files/helpers/tokens to build ON rather than replace"],
  "scroll_reveal_approach": "how to add section reveal given MotionOrchestrator already exists — extend it vs add CSS; concrete",
  "display_font_loading": "how to load ONE Google display font in Astro static without layout shift / blocking; concrete",
  "dark_statement_block": "lowest-risk way to add one dark section on a light page given existing theme tokens",
  "base_href_risks": ["specific places where base=/radeq could break (fonts, images, links) and how to avoid"],
  "file_plan": [{"path": "...", "change": "...", "risk": "low|med|high"}],
  "build_verify_steps": ["ordered local commands to prove it builds + preview works"],
  "gotchas": ["stack-specific traps to avoid"]
}
No secrets, no logs, no raw file dumps.
