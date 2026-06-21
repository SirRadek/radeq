# radeq.cz redesign — Opus design decision record

**Date:** 2026-06-18 · **Decider:** Opus supervisor (architecture/design authority)
**Inputs:** real `agy_cli` Gemini 3.1 Pro (High) brainstorm + real `codex_cli`
feasibility (both via runCliWorker, evidence in this folder).
**Branch:** `autopilot/lepshee-redesign-2026-06-18` (off `new`). No main, no prod.

## Direction: "Řemeslná preciznost" — confident, structured, airy

A clear leap from the current generic look, achieved with bounded, low-risk moves
that both vendors agreed on. Conversion mechanics (pricing table + inquiry form)
stay fully intact and legible.

## Decisions

1. **Palette — KEEP GREEN.** Both vendors independently argued green
   (`#257a3e`) signals growth/reliability/financial-safety for Czech SMBs;
   terracotta rejected. Warm the light base slightly toward sand for character.
   Reuse existing `global.css` palette + dark-theme tokens — no new color system.

2. **Typography — the headline leap.** Add ONE display font: **Plus Jakarta Sans**
   (weights 800), via `<head>` preconnect + `display=swap` in BaseLayout. Apply
   only to H1/section headings via a `--font-display` token. Body font unchanged.
   H1 to display scale (existing `--size-display`) at weight 800, tight tracking.

3. **Hero signature anchor — blueprint, not blob.** A precise, slow ambient
   geometric "blueprint/wireframe" motif (CSS/SVG, ~not photos). Signals
   automation/systems craft. CSS-only, `prefers-reduced-motion` aware.

4. **Motion — three restrained moments, reuse MotionOrchestrator.**
   (a) section reveal: `opacity 0 / translateY(20px) → 0`, ~0.7s ease-out-expo,
   keyed off existing `html[data-motion-ready]` — NO second observer;
   (b) card hover: subtle lift + shadow (no scale);
   (c) hero anchor: very slow ambient loop. All disabled under reduced-motion.

5. **Section rhythm — macro-blocks.** Increase section padding (extend
   `--space-section`), alternate backgrounds into 3 visual chapters:
   warm-white (hero+audience) → faint green-grey tint (services/showcase) →
   ONE dark charcoal-green statement band.

6. **Dark statement block — Opus reconciliation of the one disagreement.**
   agy wanted pricing+form INSIDE the dark block; Codex flagged contrast/legibility
   risk (`#257a3e` on dark) and "do not bury pricing/form". **Decision:** the dark
   block is a confident closing **statement + CTA band that leads INTO** the
   pricing/contact sections — pricing table and inquiry form stay on the light
   surface for maximum legibility and trust. We get the dramatic dark anchor
   WITHOUT risking conversion contrast. Scope dark styling to that section only;
   never toggle the global theme.

## Hard guardrails (from Codex, enforced in review)
- All internal asset/link URLs through `withBaseHref()`; font URLs stay absolute.
- No `background-image: url('/...')` (breaks under base=`/radeq`).
- Keep pricing + ContactTerminal present and legible.
- Build green + Pages preview under base=`/radeq` before publish.

## Implementation plan (Codex authors, Opus reviews+applies+builds)
- Step 1: tokens.css + global.css (font token, hero headline, reveal/hover CSS,
  dark-block styles, warmer base) + BaseLayout `<head>` font link.
- Step 2: HeroSection.astro (display headline + blueprint anchor).
- Step 3: index.astro (section rhythm classes + insert dark statement band).
After each: `npm run build` + visual/asset check.
