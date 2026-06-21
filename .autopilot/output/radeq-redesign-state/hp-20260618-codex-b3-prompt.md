Return ONLY a valid JSON object (no prose/fences). STEP B3 of a ground-up radeq.cz
homepage redesign. Design system already in src/styles/system.css. REUSE its tokens
& primitives (--bg,--bg-sunken,--surface,--ink,--ink-2,--brand,--line-2,--font-display,
--font-mono,--r,--r-lg,--sh-1/2,--section-pad,--ease,.ds-section,.ds-card,.ds-eyebrow,
.ds-h2,.ds-lead,.button-primary,.button-secondary). You APPEND to system.css.

## B3 scope: rebuild SERVICES (ServiceCatalog) + ABOUT, fully on-system, real structure.
Both must look clearly NEW and coherent with the hero/header already shipped. Keep all
content + props + hrefs. SERVICES sits on --bg-sunken (alternating rhythm); ABOUT on --bg.

### Current ServiceCatalog.astro (keep content.systems fields, requestLabel, audit routeCopy, hrefs to #terminal)
```
content.systems = { sectionCode, title, lead, guide{eyebrow,title,text,steps[{label,value}]},
  items[{problem,system,output}], requestLabel, secondaryTitle, secondaryLead }
routeCopy (cs/en) = { label,title,text,action } hardcoded for the audit recommendation.
Markup: <section class="service-catalog" id="services-guided">
  .section-heading(section-code + h2 + lead)
  .offer-map: <aside class="offer-map-guide"> (eyebrow, h3, text, .offer-map-guide__recommendation[label,title,text,a→#terminal], <ol> steps[label,value]) </aside>
             <div class="service-path"> primaryItems(first 3) → <article class="service-card"> (.service-card__marker 01/02/03, problem <p>, <h3>system, output <p>, a→#terminal requestLabel) </article> </div>
  .service-addons (if items>3): intro(section-code + h3 secondaryTitle + secondaryLead) + .service-addons__grid → <article class="service-addon-card"> (04.., h4 system, p output, a→#terminal) </article>
```
Rework requirements: keep root `service-catalog` id="services-guided" and `audience-band`-style
section shell. New structure: a clean section header (.ds-eyebrow from sectionCode + big .ds-h2
title + .ds-lead). The guide aside = a refined "start here / audit" panel as a .ds-card with the
recommendation highlighted (brand-tinted) + numbered steps as a clean ordered list (mono step
labels). The 3 primary service cards = .ds-card grid, each with an OVERSIZED faint brand numeral
(01/02/03) marker, a small problem kicker (mono), a display h3 system name, output text, and a
text link "→ requestLabel". Secondary addons = a tighter grid of smaller .ds-card. Consistent
hover lift. Responsive: guide above cards on mobile; cards stack; 0 overflow.

### Current ABOUT markup (inline in index.astro; you return REPLACEMENT markup for this <section>)
```
content.about = { sectionCode, title, lead, profileTitle, profileText,
  principles[{label,value}], servicesTitle, items[{label,title,text}], note }
<section class="about-services" id="about" aria-labelledby="about-title" data-section-signature="about-services">
  .about-services__intro (section-code, h2 about-title, p lead)
  .about-services__profile (section-code profileTitle, p profileText, <dl> principles[dt label, dd value])
  .about-services__services (section-code servicesTitle)
  .about-services__grid → <article>(span label, h3 title, p text)
  p.about-services__note
</section>
```
Rework requirements: keep root `about-services` id="about" + aria-labelledby + data-section-signature.
New editorial 2-column layout: left = intro (.ds-eyebrow sectionCode + .ds-h2 title + .ds-lead) and the
profile (profileText + principles as a clean key/value list with brand accents); right (or below) = the
services grid as compact .ds-card items (mono label + display h3 title + text). note as a muted closing line.
On-system, airy, coherent.

## Return JSON EXACTLY these keys
{
 "servicecatalog_astro": "FULL new src/components/ServiceCatalog.astro (preserve imports: types Locale/SiteContent, the routeCopy const, slicing items 0..3 / 3.., locale prop)",
 "about_section_html": "FULL replacement <section class=\"about-services\" ...>…</section> markup using content.about (Astro expressions ok; it is inlined in index.astro which has `content`)",
 "system_css_append": "CSS to APPEND: /* Services */ block (on --bg-sunken, full-bleed sunken band with inner .ds-section width) + /* About */ block (on --bg), reusing tokens, hover lift, reduced-motion safe, responsive, 0 overflow",
 "verify_notes": ["checks after build"]
}
IMPORTANT: ServiceCatalog keeps `locale` prop + routeCopy + first-3/rest split + all #terminal links.
For the sunken Services band: make the section full-bleed (.ds-bleed) with an inner wrapper constrained
to --maxw, so the alternating background spans full width but content stays aligned. No secrets/logs.
