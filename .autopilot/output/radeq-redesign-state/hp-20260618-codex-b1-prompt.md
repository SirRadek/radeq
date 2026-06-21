Return ONLY a valid JSON object (no prose, no markdown fences). Senior front-end
engineer. This is STEP B1 of a full ground-up homepage redesign for an Astro +
Tailwind v4 site (radeq.cz, Czech studio). Output is applied verbatim by the supervisor.

## Your job in B1: the design-system FOUNDATION + global chrome
Create `src/styles/system.css` = the authoritative design system, imported in
BaseLayout AFTER global.css (so it overrides the old look). In B1 implement ONLY:
tokens, canvas reset, base typography, links, buttons, shared section/eyebrow/card
primitives, the reworked sticky header/nav, and a NEW dark footer. Later steps
(B2–B5) will ADD section-specific rules to this same file, so structure it with
clear section comments and reusable primitives.

## CRITICAL: neutralize the old busy canvas
global.css paints animated multi-layer pink/purple/cyan gradients on `body`,
`body::before`, `body::after` (a major source of the generic feel). In system.css:
set `html, body { background: var(--bg) !important; }`, and
`body::before, body::after { display: none !important; }`. Also `html,body{overflow-x:clip}`.

## Design tokens (define on :root; ALSO remap key legacy vars so not-yet-restyled
## elements shift on-system). Light theme is the only canvas.
--bg:#F6F4EE; --bg-sunken:#EEEAE0; --surface:#FFFFFF; --surface-2:#FBFAF6;
--ink:#16201A; --ink-2:#515B53; --line:#E3DED2; --line-2:#D2DBCE;
--brand:#1E7A41; --brand-strong:#155C31; --brand-tint:#E7F1E8;
--ink-block:#112019; --on-dark:#EEF4EA; --on-dark-muted:#9FB0A2; --lime:#CDEE6B;
--font-display:"Plus Jakarta Sans",var(--font-sans,system-ui);
--font-body:"Inter",system-ui,sans-serif; (mono = existing "JetBrains Mono")
--maxw:1140px; --section-pad:clamp(4.5rem,9vw,9rem); --gutter:clamp(1rem,4vw,2rem);
--r-sm:10px; --r:16px; --r-lg:24px; --r-pill:999px;
--sh-1:0 1px 2px rgba(20,30,22,.06),0 8px 24px -12px rgba(20,30,22,.12);
--sh-2:0 2px 4px rgba(20,30,22,.06),0 24px 48px -20px rgba(20,30,22,.20);
--t-fast:180ms; --t:320ms; --ease:cubic-bezier(0.16,1,0.3,1);
ALSO remap legacy: --page-bg:var(--bg); --text-main:var(--ink); --text-muted:var(--ink-2);
--accent:var(--brand); --panel-bg:var(--surface); --panel-strong:var(--bg-sunken);
--line:var(--line); (set these inside html[data-theme="light"] to beat existing specificity).

## Typography (EXTREME scale contrast — anti-generic)
body → font-family var(--font-body); color var(--ink); font-size clamp(1rem,1.05vw,1.125rem);
line-height 1.62. h1,h2,h3 → var(--font-display); color var(--ink); font-weight 800;
letter-spacing -0.02em; line-height 1.0. Provide utility classes:
.ds-eyebrow (mono, .72rem, uppercase, letter-spacing .14em, color var(--brand),
  with a leading "—" via ::before) — used for section kickers/labels.
.ds-display (clamp(2.9rem,6vw,5rem)), .ds-h2 (clamp(2.2rem,4.6vw,3.6rem)),
.ds-lead (clamp(1.05rem,1.6vw,1.25rem), color var(--ink-2), max-width 52ch).
NOTE: prices later use display font, NOT mono.

## Shared primitives (used by later steps)
.ds-section { width:min(100% - 2*var(--gutter),var(--maxw)); margin-inline:auto;
  padding-block:var(--section-pad); } and a full-bleed helper .ds-bleed
{ width:100vw; margin-inline:calc(50% - 50vw); }. A surface card primitive
.ds-card { background:var(--surface); border:1px solid var(--line-2); border-radius:var(--r);
  box-shadow:var(--sh-1); transition:transform var(--t) var(--ease),box-shadow var(--t) var(--ease),border-color var(--t) var(--ease); }
.ds-card:hover { transform:translateY(-4px); box-shadow:var(--sh-2); border-color:color-mix(in srgb,var(--brand) 35%,var(--line-2)); }
Buttons: .button-primary (pill: border-radius:var(--r-pill); background:var(--brand);
  color:#fff; padding:.85rem 1.4rem; font-family:var(--font-body); font-weight:600;
  inline-flex; gap:.5rem; + ::after "→" sliding 4px on hover; hover background:var(--brand-strong))
.button-secondary (pill, transparent, 1px solid var(--line-2), color var(--ink), hover border brand).
Reduced-motion: disable transforms/animations.

## Reworked sticky header (rework markup + CSS)
Current CommandHeader.astro (preserve ALL props + the two island toggles + language
link + CTA; you may restructure markup/classes):
```
---
import type { SiteContent } from '../data/siteContent';
import type { Locale } from '../data/locales';
import { getEpochOptions } from '../data/styleMatrix';
import StyleVariantToggle from './StyleVariantToggle';
import ThemeModeToggle from './ThemeModeToggle';
interface Props { content: SiteContent['header']; alternatePath?: string; alternateLabel?: string; locale: Locale; homePath?: string; showStyleToggle?: boolean; }
const { content, alternatePath, alternateLabel, locale, homePath, showStyleToggle = true } = Astro.props;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const alternateHref = alternatePath ? `${basePath}${alternatePath}` : undefined;
const styleOptions = getEpochOptions(locale);
const resolveHref = (href) => { if (homePath && href.startsWith('#')) return `${basePath}${homePath}${href}`; return href.startsWith('/') ? `${basePath}${href}` : href; };
---
<header class="command-header" ...> brand-mark(Radeq.cz + pulse) · nav(content.navItems) · header-actions(StyleVariantToggle if showStyleToggle, ThemeModeToggle, language-link, header-cta href="#terminal") </header>
```
New header: slim, sticky top:0, z-index high, translucent var(--bg) backdrop-filter blur,
1px bottom var(--line), padding-block .7rem, content width min(100%-2gutter,var(--maxw-wide,1280px)).
Brand wordmark in display 700. Nav links in body font, small, --ink-2 → --ink on hover,
subtle. Keep both toggle islands but make them quiet (small). CTA = .button-primary small.
Mobile (<860px): hide the nav links row (keep brand + CTA + toggles); keep it clean.

## NEW Footer component `src/components/Footer.astro`
Full-bleed dark (.ds-bleed, background var(--ink-block), color var(--on-dark)).
Props: { content: SiteContent['header']; locale: Locale }. Use content.navItems for a
nav column. Columns: (1) brand "Radeq.cz" + one-line Czech tagline about craft/precision;
(2) "Navigace" = nav links; (3) "Spojení" = a CTA link to #terminal ("Napsat poptávku")
+ link to #pricing. Bottom fine-print row: "© 2026 Radeq.cz" + a muted note. Lime accents
for links on hover. Resolve in-page hrefs with basePath like the header. Tasteful, calm.

## Return JSON EXACTLY these keys
{
 "system_css": "FULL contents of src/styles/system.css (B1 foundation+chrome only)",
 "commandheader_astro": "FULL new src/components/CommandHeader.astro",
 "footer_astro": "FULL new src/components/Footer.astro",
 "baselayout_font_head_html": "<link> tags for Plus Jakarta Sans + Inter (preconnect + one css2 stylesheet, display=swap)",
 "baselayout_import_line": "import line for system.css (added AFTER global.css import)",
 "index_footer_import_and_usage": "the import line + the <Footer .../> tag to add at end of <main> or after it in index.astro, with exact props",
 "verify_notes": ["what supervisor should check after build"]
}
Czech copy natural. No secrets/logs. Reuse existing tokens; do not invent a parallel system.
