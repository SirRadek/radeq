# Radeq.cz — Component Inventory

**Verze:** 2026-06-18 (větev: `autopilot/design-direction-2026-06-18`)

---

## Architektura stylů

| Soubor | Účel |
|---|---|
| `src/styles/global.css` | Jediný CSS soubor (6100+ řádků). `@import "tailwindcss"`, pak `@theme`, `:root`, variant bloky, komponenty, animace. |
| `src/styles/tokens.css` | Design direction layer (přidán DT1). Nové tokeny, utility třídy. Importován PO global.css v BaseLayout. |

**CSS custom properties — klíčové:**
- `--accent`, `--accent-2`, `--accent-ink` — primární a sekundární akcent, text na akcentu
- `--page-bg`, `--panel-bg`, `--panel-strong` — pozadí hierarchie
- `--text-main`, `--text-muted` — typografická hierarchie
- `--line`, `--line-strong` — border/separator barvy
- `--size-display` (DT1) — H1 display font-size
- `--reveal-duration`, `--reveal-easing` (DT1) — section reveal animace

**Varianty (data-style):** variant-a (zelená), variant-b (teal), variant-c (amber), variant-d (sea green)  
**Témata (data-theme):** light, dark

---

## Layout

### `src/layouts/BaseLayout.astro`

**Účel:** Shell stránky. Importuje global.css + tokens.css. Mountuje React ostrovy.

**Klíčové attrs HTML:** `data-style="variant-a"`, `data-theme="light"`, `data-style-source="fixed|stored"`

**Ostrovy (client:load):**
- `MeasurementTracker` — sbírá metriky (bez JS blokování)
- `MotionOrchestrator` — scroll tracking, `data-motion-scene`, `--motion-progress`

**Script (inline):** obnovuje uložený theme/style z localStorage  
**Script (po slotu):** IO reveal — přidává `.is-revealed` na `main section:not(.hero-section)` při vstupu do viewportu

---

## Komponenty homepage (pořadí v index.astro)

### `src/components/CommandHeader.astro`

**Účel:** Navigace (nav bar). Obsahuje logo, nav links a přepínač variant/theme.  
**CSS třídy:** `.command-header`, `.nav-*`  
**Key CSS vars:** `--accent` pro aktivní stav

---

### `src/components/HeroSection.astro`

**Účel:** Hero sekce. H1 výzva, lead, proof rail (price anchors), CTA tlačítka.  
**CSS třídy:** `.hero-section`, `.hero-proof-rail`, `.button-primary`, `.button-secondary`  
**Key CSS vars:** `--accent` (button-primary bg, proof rail dt color), `--size-display` (H1 font-size po DT3)  
**Section:** `<section class="hero-section" id="top">`  
**IO reveal:** NE — hero je viditelný ihned (má `.hero-section` třídu, IO observer ji skipuje)

---

### `src/components/ServiceCatalog.astro`

**Účel:** Katalog cest k webu. `offer-map-guide` (průvodce) + `.service-path` grid s `.service-card`.  
**Content key:** `siteContent['systems']`  
**CSS třídy:** `.service-catalog`, `.offer-map`, `.offer-map-guide`, `.service-path`, `.service-card`, `.service-card__marker`, `.service-addons`  
**Key CSS vars:** `--accent` (border, gradients, marker čísla)  
**Section:** `<section class="service-catalog" id="services-guided">`  
**IO reveal:** ANO — `.service-catalog` je `main section` bez `.hero-section`

**Service card struktura:**
```html
<article class="service-card" data-cat-platform="service-card-N">
  <div class="service-card__marker"><span>01</span></div>
  <p>{item.problem}</p>
  <h3>{item.system}</h3>
  <p>{item.output}</p>
  <a href="#terminal">{content.requestLabel}</a>
</article>
```
**DT6:** `.service-card__marker` je po DT6 `position: absolute; top-right`, čísla jsou 3.5–5rem, opacity 0.1 — dekorativní watermark.

---

### `src/components/PricingSection.astro`

**Účel:** Ceník s pricing cards. 4 balíčky (Audit, Startovací web, Redesign, Webová péče).  
**CSS třídy:** `.pricing-section`, `.pricing-card` (předpoklad — neověřeno)  
**IO reveal:** ANO

---

### AboutSection (inline v index.astro, řádek 34-69)

**Účel:** Profil autora, principy práce, doplňkové služby.  
**CSS třídy:** `.about-services`, `.about-services__intro`, `.about-services__profile`, `.about-services__grid`, `.section--alternate` (DT8)  
**DT8:** Má `.section--alternate` → `background: var(--panel-strong)`, border-top/bottom.  
**IO reveal:** ANO  
**Poznámka:** Není samostatný komponent — obsah je přímo v `index.astro`.

---

### `src/components/HandoffStandard.astro`

**Účel:** Proof sekce — jak vypadá předání, standardy kvality.  
**IO reveal:** ANO

---

### ContactTerminal (`src/components/ContactTerminal.tsx`)

**Účel:** Kontaktní formulář (React island). Odesílá do Cloudflare Worker + D1.  
**Hydration:** `client:load`  
**Poznámka:** Formulář nefunguje na GitHub Pages (D1 Worker není k dispozici) — očekávané chování.

---

## Utility komponenty

| Soubor | Účel |
|---|---|
| `src/components/RadeqBrandLogo.astro` | SVG logo |
| `src/components/StyleVariantToggle.tsx` | Přepínač variant a/b/c/d |
| `src/components/ThemeModeToggle.tsx` | Light/dark toggle |
| `src/components/MeasurementTracker.tsx` | Neviditelný measurement island |
| `src/components/MotionOrchestrator.tsx` | Scroll scene tracker |

---

## Datová vrstva

| Soubor | Klíč | Sekce |
|---|---|---|
| `src/data/siteContent.ts` | `cs.hero` | HeroSection (CZ) |
| `src/data/siteContent.ts` | `cs.systems` | ServiceCatalog (CZ) |
| `src/data/siteContent.ts` | `cs.pricing` | PricingSection (CZ) |
| `src/data/siteContent.ts` | `cs.about` | AboutSection inline (CZ) |
| `src/data/siteContent.ts` | `cs.handoff` | HandoffStandard (CZ) |
| `src/data/siteContent.ts` | `cs.terminal` | ContactTerminal (CZ) |
| `src/data/siteContent.ts` | `en.*` | Symetricky pro EN (`/en/`) |

---

## Poznámky pro budoucí implementace

1. `global.css` je velmi velký (6100+ řádků). Před editací vždy použít `rg` k nalezení přesných řádků.
2. `--accent` v variant-a je ZELENÁ (#257a3e). Terracotta (#C4521A) je v tokens.css jako komentovaná varianta — k rozhodnutí vlastníka.
3. `hero-section` má `.hero-section` CSS třídu — IO reveal observer ji skipuje, hero je viditelný ihned.
4. `service-card__marker` je `position: absolute` — `.service-card` musí mít `position: relative` (má).
5. ContactTerminal (`#terminal`) je anchor pro CTA tlačítka v ServiceCatalog.
6. Produkce: Cloudflare Worker + D1. GitHub Pages: statický build bez Worker.
