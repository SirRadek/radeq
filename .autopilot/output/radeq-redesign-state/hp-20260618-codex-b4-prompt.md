Return ONLY a valid JSON object (no prose/fences). STEP B4 of a ground-up radeq.cz
homepage redesign. Design system in src/styles/system.css — REUSE tokens/primitives
(--bg,--bg-sunken,--surface,--ink,--ink-block,--ink-2,--brand,--brand-tint,--lime,
--on-dark,--on-dark-muted,--line-2,--font-display,--font-mono,--r,--r-lg,--r-pill,
--sh-1/2,--section-pad,--ease,.ds-section,.ds-bleed,.ds-card,.ds-eyebrow,.ds-h2,
.ds-lead,.button-primary,.button-secondary). You APPEND to system.css.

## B4 scope: rebuild PRICING (stays LIGHT, ultra-clear) + PROOF/HANDOFF (the DARK climax).
Both must look new and coherent with hero/services/about already shipped.

### PRICING — current PricingSection.astro (preserve content + props + #terminal links + data-track)
```
content.pricing = { sectionCode, title, lead, items[{price, name, text, includes[], cta, featured}], note }
<section class="pricing-section" id="pricing" aria-labelledby="pricing-title" data-section-signature="pricing">
  .section-heading.pricing-section__heading: <div>(section-code, h2 pricing-title)</div> <p>lead</p>
  .pricing-grid: items.map → <article class:list={['pricing-card', item.featured && 'pricing-card--featured']}>
     <div>(<span>price</span>, h3 name, p text)</div>
     <ul>includes.map → <li>include</li></ul>
     <a href="#terminal" data-track={item.featured?'audit_click':undefined}>cta</a>
  </article>
  {note && <p class="pricing-section__note">note</p>}
```
Rework (stays on --bg LIGHT): section shell with .ds-eyebrow + big .ds-h2 + .ds-lead.
3 cards in .ds-card grid; the featured (middle) card visually elevated: --brand-tint background
or brand 1px border + a small "Doporučeno"/"Recommended" ribbon/pill (CS: "Doporučeno").
PRICE must be in --font-display, bold, large (NOT mono) — clear and undeniable. Card: price,
display h3 name, text, then an includes <ul> where each <li> gets a green check marker (CSS
::before, no images). CTA = .button-primary (pill, green) for featured, .button-secondary for
others; keep href="#terminal" and data-track. note as muted closing line. Keep id="pricing".
Keep root class `pricing-section`. Conservative-SMB clarity is paramount — high contrast.

### PROOF/HANDOFF — current HandoffStandard.astro (this becomes the DARK climax band)
```
content.handoff = { sectionCode, title, lead, items[] (string[]) }
<section class="handoff-section" id="handoff" aria-labelledby="handoff-title">
  <div>(section-code, h2 handoff-title, p lead)</div>
  <ul class="handoff-list">items.map → <li>item</li></ul>
</section>
```
Rework into a FULL-BLEED DARK section (the one mid-page dark climax): keep root class
`handoff-section` id="handoff". Make it full-bleed via .ds-bleed with background:var(--ink-block)
(set on the ELEMENT, not a pseudo-element — section-root pseudos are globally neutralized).
Inner wrapper constrained to --maxw. Text in --on-dark / --on-dark-muted. .ds-eyebrow + a big
display h2 (use --lime or --on-dark, NOT green text on dark) + lead. items as a refined grid/list
of "proof points" each with a --lime check/marker. Optionally one .button-* but not required.
This is the premium narrative climax — confident, calm, high contrast. 0 overflow.

## Return JSON EXACTLY these keys
{
 "pricingsection_astro": "FULL new src/components/PricingSection.astro (keep interface Props { content: SiteContent['pricing']; }, import type SiteContent from '../data/siteContent')",
 "handoffstandard_astro": "FULL new src/components/HandoffStandard.astro (keep interface Props { content: SiteContent['handoff']; }, import type from '../data/siteContent')",
 "system_css_append": "CSS to APPEND: /* Pricing */ (light, featured emphasis, display price, green check list) + /* Proof/Handoff (dark climax) */ (full-bleed --ink-block via element bg, lime accents). reduced-motion safe, responsive, 0 overflow",
 "verify_notes": ["checks after build"]
}
CRITICAL: never use green (#1E7A41) as text on the dark band (contrast); use --lime or --on-dark.
Keep all #terminal hrefs + data-track. import paths must be '../data/siteContent'. No secrets/logs.
