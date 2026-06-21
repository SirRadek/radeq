Return ONLY a valid JSON object (no prose, no markdown fences). You are a senior
front-end engineer implementing a bounded, reviewable homepage redesign for an
Astro + Tailwind v4 site. Your output will be applied verbatim by the supervisor.

## Approach (FIXED — do not deviate)
Do NOT rewrite the 6098-line global.css. Implement an ADDITIVE override layer in a
new file `src/styles/redesign.css`, imported AFTER global.css in BaseLayout. Reuse
existing CSS custom properties and the existing `html[data-motion-ready="true"]`
switch (set by MotionOrchestrator). All motion must have prefers-reduced-motion
fallbacks. Keep the green accent. Keep pricing + contact form fully legible.

## Existing facts you must respect
- BaseLayout.astro currently has `<head>` with metas + an inline theme script, and
  imports only `'../styles/global.css'`. Body renders <MeasurementTracker/>,
  <MotionOrchestrator/>, <slot/>. The <html> is data-theme="light" data-style="variant-a".
- Light theme tokens (variant-a): --page-bg #f7f9f4; --text-main #10170f;
  --text-muted #536056; --panel-bg #ffffff; --panel-strong #eef4ea; --line #d6e0d3;
  --accent #257a3e (GREEN); --accent-2 #007b83; --accent-ink #ffffff; --radius 8px;
  --max-width 1180px; --font-sans Inter,system-ui; --font-mono "JetBrains Mono".
  (Inter/JetBrains are NOT actually loaded yet — only system fallback renders.)
- Sections share a centered container:
  `.hero-section,.about-services,.pricing-section,... { width:min(100% - 2rem,var(--max-width)); margin:0 auto; scroll-margin-top:5.75rem; }`
- h1 { font-size:clamp(2.75rem,5.1vw,4.55rem); line-height:1; } — NO explicit
  font-family or weight (inherits). h2 { clamp(2.2rem,5vw,4.3rem); }.
- .meta-row,.section-code use --font-mono, uppercase, color:var(--accent).
- .button-primary { border:1px solid var(--accent); border-radius:8px; color:var(--accent-ink); background:var(--accent); font-family:var(--font-mono); min-height:44px; padding:.8rem 1rem; }
- .hero-section is a 2-col grid; .hero-copy holds meta-row, h1, p, .hero-proof-rail, .hero-actions; right col is .core-panel (a React island).
- index.astro <main> order: <div class="proposal-stage"><HeroSection/><ServiceCatalog/></div>, <PricingSection/>, <section class="about-services" id="about">…</section>, <HandoffStandard/>, <ContactTerminal/>.

## Design direction to implement ("Řemeslná preciznost")
1. DISPLAY FONT: load Plus Jakarta Sans (weights 600;700;800) from Google in
   BaseLayout <head> (preconnect to fonts.googleapis.com + fonts.gstatic.com
   crossorigin, then stylesheet with display=swap). In redesign.css define
   `--font-display:"Plus Jakarta Sans",var(--font-sans);` and apply it to h1,h2
   (and hero h1) with font-weight:800 and letter-spacing:-0.02em. Body stays sans.
2. HERO HEADLINE LEAP: bump hero h1 scale slightly (e.g. clamp(2.9rem,5.6vw,5rem)),
   weight 800, tight tracking, balanced wrap.
3. SIGNATURE ANCHOR (blueprint, CSS-only): add a precise, faint "blueprint grid"
   motif behind the hero using a redesign.css `.hero-section::after` (or layered
   gradients/repeating-linear-gradient) in --accent at low opacity, with a VERY
   slow ambient drift animation (e.g. 24s ease-in-out infinite alternate), pointer-
   events:none, hidden under reduced-motion. Do NOT use url('/...') images.
4. SECTION REVEAL (reuse motion switch, no new JS): when
   `html[data-motion-ready="true"]`, give `main > *` (and key sections) an initial
   opacity:0; transform:translateY(20px); and reveal to opacity:1;translateY(0)
   over ~.7s cubic-bezier(0.16,1,0.3,1). Provide a sane non-JS/reduced-motion
   fallback (fully visible). Keep it simple and robust — a transition the
   orchestrator's readiness flag triggers, not a per-element observer.
5. CARD HOVER LIFT: service/pricing/about article cards get a subtle
   translateY(-4px) + deeper shadow on hover (no scale), .2s ease.
6. PILL CTA: .button-primary → border-radius:999px; more horizontal padding;
   subtle background-shift + a sliding inline arrow on hover (e.g. ::after "→"
   that translates 4px). Keep min 44px target and green.
7. DARK STATEMENT BAND: provide HTML for a NEW full-bleed section
   `<section class="statement-band">` to insert in index.astro BETWEEN the
   about-services section and <HandoffStandard/>. It must be a confident closing
   STATEMENT + a CTA that links to #pricing (or the contact form) — it must NOT
   contain the pricing table or the form itself. Style it in redesign.css as a
   full-viewport-width dark charcoal-green band (own scoped dark colors; do NOT
   toggle the global theme), with an inner container capped at --max-width,
   large display headline, and a pill CTA whose contrast is safe on dark (use a
   light/lime CTA or white text — verify #257a3e is NOT used as text on dark).
   Use Czech copy fitting a one-person studio (confident statement, e.g. about
   craft/precision/automation) + a CTA label like "Spočítat řešení" linking to
   "#pricing". Make full-bleed via margin-inline:calc(50% - 50vw); width:100vw.
8. WARMER BASE (optional, tiny): you MAY nudge --page-bg via a scoped rule to a
   slightly warmer off-white ONLY if low-risk; otherwise leave the base as-is.

## Return JSON with EXACTLY these keys
{
  "redesign_css": "FULL contents of src/styles/redesign.css",
  "baselayout_font_head_html": "exact <link> tags to insert into <head> (preconnect + stylesheet)",
  "baselayout_import_line": "the exact import statement to add for redesign.css",
  "index_statement_band_html": "the full <section class=\"statement-band\">…</section> markup (Czech copy)",
  "index_insert_marker": "the exact existing line in index.astro AFTER which to insert the band",
  "verify_notes": ["things the supervisor should check after build"]
}
Czech copy must be natural. No secrets, no logs.
