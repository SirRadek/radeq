Return ONLY a valid JSON object (no prose/fences). STEP B2 of a ground-up radeq.cz
homepage redesign. The design-system foundation already exists in src/styles/system.css
(tokens --bg #F6F4EE, --ink #16201A, --brand #1E7A41 green, --ink-block #112019,
--lime #CDEE6B, --font-display "Plus Jakarta Sans", --font-body "Inter",
--font-mono JetBrains; primitives .ds-section/.ds-card/.ds-eyebrow/.ds-display/.ds-h2/
.ds-lead/.button-primary/.button-secondary; --r,--r-pill,--sh-1/2,--t,--ease,--section-pad).
REUSE these tokens/primitives. You APPEND to system.css; do not redefine tokens.

## B2 scope: rebuild HERO + add a FIT/AUDIENCE section, fully on-system.

### Current HeroSection.astro (preserve CoreIsland island with client:load + all content fields)
```
---
import type { SiteContent } from '../data/siteContent';
import { withBaseHref } from '../lib/links';
import CoreIsland from './CoreIsland';
interface Props { content: SiteContent['hero']; }
const { content } = Astro.props;
---
<section class="hero-section" id="top" aria-labelledby="hero-title" data-direction="guided-offer-map">
  <div class="hero-copy">
    {content.meta.length>0 && <div class="meta-row" aria-label={content.metaAria}>{content.meta.map((i)=><span>{i}</span>)}</div>}
    <h1 id="hero-title">{content.title}</h1>
    {content.lead && <p>{content.lead}</p>}
    <dl class="hero-proof-rail">{content.proof.map((item)=>(<div><dt>{item.label}</dt><dd>{item.value}</dd></div>))}</dl>
    <div class="hero-actions" aria-label={content.actionsAria} data-cat-platform="hero-actions">
      {content.actions.map((action)=>(<a class={action.variant==='primary'?'button-primary':'button-secondary'} href={withBaseHref(action.href)} data-track={...}>{action.label}</a>))}
    </div>
  </div>
  <div class="core-panel" aria-label={content.coreAria} data-cat-platform="hero-core">
    <div class="core-fallback" aria-hidden="true"><span></span><span></span><span></span></div>
    <CoreIsland copy={content.core} client:load />
    {content.coreCaption && <p class="core-caption">{content.coreCaption}</p>}
  </div>
</section>
```
content.hero has: metaAria, meta[], title, lead, proof[{label,value}], actionsAria,
actions[{href,label,variant}], coreAria, core (passed to CoreIsland), coreCaption.

### Hero rework requirements
- Keep root class `hero-section` + id="top" (anchor/section container relies on it) and
  KEEP `<CoreIsland copy={content.core} client:load />` and withBaseHref() on action hrefs.
- New left-aligned layout: a `.ds-eyebrow`-style kicker built from content.meta (render
  the meta items as small mono tags/eyebrow), then a HUGE display H1 (extreme scale,
  Plus Jakarta 800, max ~13ch, tight tracking), then lead (max ~50ch, --ink-2), then a
  refined proof-rail (3 items, hairline-top, mono label + readable value), then actions
  (primary green pill + secondary).
- Right column = the CoreIsland framed as a tasteful "precision" panel: --surface card,
  1px --line-2 border, --r-lg radius, --sh-2, with a VERY faint 4px DOT-grid background
  inside the panel only (radial-gradient dots, low opacity) + a slow ambient drift gated
  on html[data-motion-ready="true"]; reduced-motion disables it. No url() images, no blue.
- NEUTRALIZE old decoration: add `.hero-section::before{display:none!important}` (kills the
  old animated diagonal ribbon). Ensure no leftover old hero look.
- Responsive: stacks to single column under ~900px (panel below copy or hidden gracefully),
  fluid type, comfortable spacing, 0 horizontal overflow.

### FIT/AUDIENCE section (new on homepage). Current AudienceBand.astro:
```
---
import type { SiteContent } from '../data/siteContent';
interface Props { content: SiteContent['audience']; }
const { content } = Astro.props;
---
<section class="audience-band" aria-labelledby="audience-title">
  <div>{content.sectionCode && <p class="section-code">{content.sectionCode}</p>}<h2 id="audience-title">{content.title}</h2></div>
  <div class="audience-grid">{content.items.map((track)=>(<article><h3>{track.title}</h3><p>{track.signal}</p></article>))}</div>
</section>
```
content.audience = { sectionCode, title, items[{title, signal}] }.
Rework markup to system: section shell (.ds-section), .ds-eyebrow kicker from sectionCode,
.ds-h2 title, and a responsive grid of compact .ds-card items (title in display/h3 + signal
in --ink-2). This is the "who it's for" fit band. On --bg background.

## Return JSON EXACTLY these keys
{
 "herosection_astro": "FULL new src/components/HeroSection.astro",
 "audienceband_astro": "FULL new src/components/AudienceBand.astro",
 "system_css_append": "CSS to APPEND to system.css: a /* Hero */ block + a /* Fit/Audience */ block, reusing tokens, incl. .hero-section::before neutralizer, dot-grid panel, reveal/reduced-motion safe",
 "verify_notes": ["checks after build"]
}
No secrets/logs. Keep CoreIsland client:load. Reuse tokens; coherent with B1 foundation.
