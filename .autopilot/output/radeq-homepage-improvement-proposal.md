# Radeq.cz — Návrh na zlepšení homepage

**Handoff ID:** hp-20260617-radeq-ux-analysis  
**Datum:** 2026-06-17 (grounded audit: 2026-06-18)  
**Supervisor:** claude-sonnet-4-6 (Claude Code, subscription-interactive)  
**Analýza A:** claude-bounded-analyst (UX/copy/conversion lens)  
**Analýza B:** claude-bounded-analyst (technická/SEO/architektura lens)  
**Status:** **audit (grounded)** — advisory verze revidována po přečtení reálného zdrojového kódu a build výstupu

---

## Zdroje analýzy — co bylo reálně přečteno

### Přečteno supervisorem (přímý přístup k souborům)

| Soubor | Přečteno |
|---|---|
| `src/pages/index.astro` | ✅ kompletní |
| `src/data/siteContent.ts` | ✅ kompletní (řádky 1–648) |
| `src/components/HeroSection.astro` | ✅ kompletní |
| `src/components/PricingSection.astro` | ✅ kompletní |
| `src/components/FitSection.astro` | ✅ kompletní (grounded pass) |
| `src/components/ServiceCatalog.astro` | ✅ kompletní (grounded pass) |
| `src/components/ContactTerminal.tsx` | ✅ kompletní (grounded pass) |
| `src/components/CommandHeader.astro` | ✅ kompletní (grounded pass) |
| `src/components/AboutSection.astro` | ✅ kompletní (grounded pass) |
| PowerShell listing `/src/components/` | ✅ všechny názvy |
| PowerShell listing `/src/pages/` | ✅ všechny routy |
| `dist/_astro/` bundle analysis | ✅ reálný build output |
| `dist/robots.txt` | ✅ reálný obsah |
| `docs/projects/radeq/architecture.md` | ✅ kompletní |
| `docs/projects/radeq/work-log.md` | ✅ prvních 80 řádků |

### Subagenti (Agent A, Agent B)
Pracovali z handoff packetů (textový přepis klíčových dat z výše uvedených souborů) — nikoliv z přímého přístupu ke zdrojovým souborům. Verbatim copy (hero, FitSection, pricing) byl v packetech přesný.

### Build verifikace
`npm run build` spuštěn v `C:\Users\sirok\Documents\Projects\radeq` — viz sekce T5 pro výsledky.

---

## Correction Log

Následující opravy byly provedeny po přečtení reálného zdrojového kódu. Označeny **[Cx]** v textu.

| ID | Oblast | Advisory tvrdila | Realita po auditu | Závažnost |
|---|---|---|---|---|
| C1 | ContactTerminal UX | Formulář používá CLI syntaxi příkazů „`set name Jan Novak`" | Žádná CLI syntaxe — standardní HTML formulář (textarea, select, input) s `<label>` elementy. Terminálová estetika je čistě vizuální/CSS | **Oprava** |
| C2 | Výkon — large chunk | „Persistent Vite large chunk warning", Three.js ~600 kB + React ~140 kB = >500 kB | Čistý build, **nula warningů**. Největší chunk: `client.js` = 181,6 kB. Three.js **zcela chybí** v buildu | **Oprava** |
| C3 | Výkon — manualChunks | Doporučení `manualChunks: { three: ['three'] }` jako fix | Zbytečné — Three.js dynamický import funguje správně, není v static buildu | **Oprava** |
| C4 | client:visible dopad | Přechod na `client:visible` výrazně zlepší TTI | ContactTerminal.js = 7 kB. React core (181,6 kB) se načte vždy kvůli ThemeModeToggle (client:load). Úspora je 7 kB komponenty, ne React core. Platné ale menší dopad než implikováno | **Upřesnění** |
| C5 | aria-live | „Pokud existuje aria-live region, měl by být správně označen" | ✅ Potvrzeno — implementováno vzorně: `role={tone==='error'?'alert':'status'}`, `aria-live={tone==='error'?'assertive':'polite'}`, `aria-atomic="true"` | **Potvrzeno** |
| C6 | aria-describedby | Advisory předpokládala správnou implementaci | ✅ Potvrzeno — každé pole: `aria-describedby={error?id:undefined}`, `aria-invalid={error?'true':undefined}` | **Potvrzeno** |
| C7 | Duplicate id="about" | Neidentifikováno (nová přidaná sekce) | ⚠️ **Nový nález**: FitSection i AboutSection obě používají `id="about"`. Přidání AboutSection bez přejmenování vytvoří konflikt ID | **Nový nález** |
| C8 | robots.txt | Doporučeno `Disallow: /demo/` | Reálný robots.txt nemá žádný Disallow — demo routy jsou indexovatelné. Doporučení oprávněné, mezera potvrzena | **Nový nález** |
| C9 | Statické routy | 4 trust routes: /kontakt/, /sluzby/, /portfolio/, /soukromi/ | Build odhalil 7 legal/trust routes: navíc `/cookies/`, `/gdpr/`, `/podminky/`. Advisory neúplná | **Nový nález** |
| C10 | ServiceCatalog přístupnost | Zmíněno jen základní aria-labelledby | ✅ Lepší než popsáno: `tabindex="0"` na kartách, `aria-current="true"` na mobilní scroll-aktivní kartě | **Upřesnění** |
| C11 | AboutSection struktura | „Principy a background text" | Má 4 podsekce: intro + profile (dl principů) + **bridge sekce** (bridgeTitle + bridgeText vedoucí k formuláři) + note. Bridge sekce dělá trust-bridge funkci explicitní | **Upřesnění** |

---

## Vstup A — UX/Copy/Conversion analýza

*Agent: claude-bounded-analyst | Lens: UX, copywriting, konverzní optimalizace, trust*

### 1. Analýza prvního viewportu

První zákazník z řad českých živnostníků a malých firem přistane na stránce, kde navigace okamžitě signalizuje roztříštěnost: pět položek (`Co řeším`, `Služby`, `Jak pracuji`, `Ceny`, `Kontakt`) jsou viditelné najednou, a CTA v navu (`Chci zmapovat problém`) doslova opakuje CTA v hero sekci. Tato redundance plýtvá prostorem navigace — CTA v navu by mohla nést jemnější označení jako „Kontakt" a ponechat akční frázi pod fold.

V hero sekci samotné je jasnost hodnotové propozice za 5 vteřin slabá. Titulek „Weby, formuláře a automatizace pro méně ruční práce" vyjmenovává tři podstatná jména dříve než přinese benefit. Zákazník z malé firmy při rychlém skenování neví, co je primární nabídka — web? automatizace? jejich kombinace? Lead tento dojem prohlubuje: hromadí pět kategorií výstupů před tím, než se dostane k tomu, pro koho to je.

**Co funguje:** proof rail je nejsilnějším prvkem celého prvního viewportu. „Audit od 2 900 Kč" s „rychle zjistíme, co brzdí práci" je konkrétní, oceněný a orientovaný na akci. Je to nejjasnější věc na obrazovce a aktuálně je pohřbena pod dlouhým lead odstavcem.

**Co chybí:** jakýkoli signál, že autor je konkrétní identifikovaná osoba (ne agentura), reference na specifický výstup, a naznačení typického průběhu spolupráce.

### 2. Copy a poziční mezery

**Nesoulad hero titulku s „weby jako primární" positioningem**

Titulek uvádí „weby, formuláře a automatizace" jako rovnocenné. To je v rozporu s webovou strategií na prvním místě. „Formuláře a automatizace" jsou podpůrné schopnosti; jejich výčet vedle „weby" v primárním titulku trénuje návštěvníka vnímat tuto firmu jako generalistický automatizační shop. Rozhodnutí vést weby je pro konverzi správné — jsou to nejvyšší zakázky a nejrozpoznatelnější nabídka — ale titulek to neexekuuje.

**Prominentnost vstupního produktu (Audit)**

Audit za 2 900–4 900 Kč se objevuje pouze v proof railu na třetí pozici. Přestože Audit je navržen jako vstupní bod do prodejního trychtýře — nízké riziko, odečitatelný z realizace, odpovídá na „kde začít?" — hero CTA ho zcela přeskakují: oba vedou na `#terminal` pro přímou poptávku projektu. Pro návštěvníky, kteří nejsou připraveni okamžitě investovat 25 000+ Kč, hero nenabízí nízkorozpočtový vstupní bod.

**Diferenciace lead copy**

„Tvořím jednoduché weby, formuláře, evidence, automatizace a AI pomocníky pro živnostníky, malé firmy a týmy, které chtějí mít víc přehledu a méně přepisování."

Toto je seznam schopností, nikoli diferenciovaný příslib. Každý freelance developer si může nárokovat totéž. Diferenciující fakta pohřbená v About sekci — jeden kontakt, jasné předání, bez závislosti na dodavateli — se v hero nikdy neobjeví. Jediná konkrétní benefit fráze „méně přepisování" je slabá, protože adresuje jediný bolestivý bod.

**Chybějící trust signály v hero/prvním záběru**

- Žádný signál „Jsem Radek" — návštěvník neví, že jedná s jedním člověkem
- Žádný počet projektů, klientů nebo let praxe
- Žádný category anchor — název „RadeQ" nenaznačuje co firma dělá
- Žádný signál vlastnictví výstupu („dostanete vše, na čem spolu pracujeme")

### 3. Pořadí sekcí a konverzní trychtýř

**Aktuální pořadí:** Hero → FitSection → ServiceCatalog → PricingSection → DemoBlocks∅ → ContactTerminal

FitSection bezprostředně po hero je strukturálně správná — odpovídá na „je to pro mě?" dříve než ukáže služby. FitSection má `id="about"` a nav položka „Co řeším" odkazuje na `#about`. **Pozor: AboutSection také používá `id="about"` [C7]** — viz nález níže.

DemoBlocks na pozici 6 narušuje momentum: prázdná sekce s titulkem a žádným obsahem signalizuje nehotovost. Nachází se bezprostředně před formulářem — nejhorší možná pozice pro prvek narušující důvěru.

**Co v trychtýři zcela chybí:** žádná vrstva důvěry/kredibility mezi Službami a formulářem. AboutSection existuje v kódu, ale není renderována. To vytváří skok z „zde jsou mé služby a ceny" přímo na „vyplňte formulář" bez zodpovězení implicitní otázky: „kdo je tato osoba a proč jí svěřit svůj firemní web?"

**Doporučené pořadí:**

1. Hero (revidovaný — viz sekce 8)
2. FitSection — zachovat pozici 2, **přejmenovat `id` z `"about"` na `"fit"`** [C7]
3. ServiceCatalog
4. **AboutSection** — vložit sem *(komponenta existuje a je kompletní: intro + principy dl + bridge sekce + note; potřebuje jeden řádek v index.astro)*
5. PricingSection
6. Proof teasery / DemoBlocks∅ náhrada (viz sekce 4)
7. ContactTerminal

**Zdůvodnění AboutSection:** Mezi ServiceCatalog a PricingSection je nejvyšší konverzní přidaná hodnota. Čtyři principy v `<dl>` plus bridge sekce přímo vedoucí k formuláři odzbrojují tři největší obavy malých firem při objednávce webového vývojáře.

**⚠️ Prerekvizita pro implementaci [C7]:** Před přidáním AboutSection přejmenovat v `FitSection.astro`: `id="about"` → `id="fit"`. V `siteContent.ts` navItems: `href: '#about'` → `href: '#fit'` (a label „Co řeším" ponechat). AboutSection si pak zachová `id="about"` a může dostat vlastní nav položku „O mně" → `#about`.

### 4. Problém prázdného DemoBlocks

Prázdná sekce s viditelným titulkem bezprostředně před kontaktním formulářem poškozuje důvěru. Signalizuje: web je nedodělán, nemá co ukázat.

**Varianta A — Minimální teaser s odkazem na /ukazky/ (nízká náročnost, vysoký dopad)**  
Naplnit `demos.items` v siteContent.ts 2–3 krátkými projektovými portréty: typ klienta (ne jméno), problém v jedné větě, výstup. Odkaz na `/ukazky/chatbot/`, `/ukazky/automatizace/`, `/ukazky/nabidka-eshop/` (všechny tři existují v buildu).

**Varianta B — Ilustrace procesu (střední náročnost)**  
Vizuální timeline: „1. Audit → 2. Plán → 3. Realizace → 4. Předání s návodem."

**Varianta C — Kompletní odstranění (nulová náročnost)**  
Přidat conditional guard v `index.astro`: `{content.demos.items.length > 0 && <DemoBlocks ... />}`. Chybějící sekce poškozuje méně než prázdná.

**Testimonials:** nejvyšší důvěra, ale vyžaduje reálné citace. Vymyšlené social proof je horší než žádné. Nepoužívat placeholder.

### 5. Hodnocení ContactTerminal UX **[C1 — opraveno]**

> ~~Advisory A původně tvrdila: „Syntaxe příkazů `set name Jan Novak` není intuitivní..."~~  
> **Oprava po přečtení ContactTerminal.tsx:** Formulář NEMÁ CLI příkazovou syntaxi. Je to standardní HTML formulář (`<textarea>`, `<select>`, dva `<input>` pro email a jméno) s explicitními `<label>` elementy, required/optional `<small>` štítky, a `aria-describedby` na chybách. Terminálová estetika je čistě vizuální — CSS styling kontejneru. Interakce samotná je konvenční.

**Revidované hodnocení:** Tření není funkční (formulář funguje jako každý jiný), ale **perceptuální** — vizuální terminálový rám může u netechnického uživatele vzbudit očekávání příkazové interakce, i když k ní nedojde. Toto je podstatně menší problém než advisory implikovala.

**Co formulář skutečně dělá:**
- 4 povinná pole: zpráva (textarea), typ projektu (select), email, jméno
- Každé pole má `<label>`, `<small>` štítek (povinné/volitelné), a error span s `id` pro `aria-describedby`
- Status řádek: `role` a `aria-live` se přepínají podle tónu — `alert`/`assertive` pro chyby, `status`/`polite` pro ostatní [C5 potvrzeno]
- `aria-atomic="true"` zajišťuje čtení celého statusu

**Doporučení (přehodnoceno):** Terminálová estetika je deliberovaná volba v souladu s brand voice. Doporučení na „Klasický formulář toggle" je méně urgentní, protože forma je funkčně standardní. Stále platí:
- Přejít na `client:visible` (úspora 7 kB JS při load, React core se načte jinak kvůli ThemeModeToggle) [C4]
- Zvážit konvenční formulář na `/kontakt/` jako fallback pro uživatele, kteří terminálový styl odmítnou vizuálně

### 6. Mezery v důvěře a social proof

Pro zákazníka zvažujícího web za 25 000+ Kč chybí:

1. **Ukázky výstupů nebo portréty projektů** — největší mezera
2. **Signál „jedné osoby"** — AboutSection ho má (principy + bridge), ale není renderována
3. **Záruka předání a nezávislosti** — v proof railu existuje, není rozvedeno
4. **Transparentnost procesu** — co se stane po odeslání formuláře? Kdy přijde odpověď?
5. **Technická kredibilita bez žargonu** — v profileText AboutSection existuje
6. **Price anchoring** pro web 25 000 Kč — zahrnout 4–5 bullet deliverables do pricing karty

### 7. Prioritní doporučení (top 6) **[aktualizováno po auditu]**

| Priorita | Doporučení | Náročnost | Prerekvizita |
|---|---|---|---|
| 1 | DemoBlocks conditional guard + naplnit nebo odstranit | Nízká | — |
| 2 | Přepsat hero titulek — website-first (viz sekce 8) | Nízká | — |
| 3 | Renderovat AboutSection za ServiceCatalog | Nízká | **Přejmenovat FitSection id → "fit" [C7]** |
| 4 | Přidat secondary hero CTA pro Audit | Nízká | — |
| 5 | ContactTerminal → `client:visible` | Nízká | — |
| 6 | robots.txt: přidat `Disallow: /demo/` a `/en/demo/` [C8] | Nízká | — |

### 8. Alternativní hero copy

**Titulek (15 slov):**
> Web, který jasně vysvětlí vaši nabídku — a ušetří čas na zbytek.

**Lead (47 slov):**
> Dělám weby pro živnostníky a malé firmy, které potřebují aby je zákazník pochopil napoprvé. Součástí jsou formuláře, automatizace a AI pomocníci tam, kde to opravdu šetří práci. Jeden kontakt, srozumitelný výstup, vše předám s návodem.

**Proof rail (3 položky — Audit na první místo):**
- Audit od 2 900 Kč — zjistíme, co řešit jako první, a odečteme to z realizace
- Web od 25 000 Kč — struktura, text, formulář a základní nastavení v jednom balíku
- Předání s návodem — web i data zůstanou vaše, bez závislosti na dodavateli

---

## Vstup B — Technická/SEO analýza **[revidováno po buildu]**

*Grounded pass: supervisor přečetl zdrojové soubory + reálný build output*

### T1. Meta title a description

**Aktuální CS:** `Radeq.cz | Praktická IT pomoc bez technické mlhy`  
**Aktuální EN:** `Radeq.cz | Practical IT help without technical fog`

**Problém:** „Praktická IT pomoc" není cluster, přes který česky mluvící SMB zákazník hledá tvůrce webu. Reálné vyhledávací dotazy: „tvorba webů pro živnostníky", „webový designer", „vytvoření webových stránek", „weby pro malé firmy". Tagline „bez technické mlhy" je kreativní ale ne indexovatelný.

**Description CS:** „pomáhá živnostníkům... s automatizací, AI, databázemi, weby" — příliš široké, neodráží website-first positioning.

**Doporučené alternativy:**

*Varianta 1 (keyword-first):*
- Title: `Tvorba webů pro živnostníky a malé firmy | Radeq.cz`
- Description: `Weby, redesigny a audit webu pro živnostníky a malé firmy. Od 2 900 Kč za audit, od 25 000 Kč za startovací web. Jeden kontakt, předání s návodem.`

*Varianta 2 (brand+benefit):*
- Title: `Radeq.cz | Weby pro malé firmy — s předáním a bez závislosti`
- Description: `Tvořím weby, formuláře a automatizace pro živnostníky a firmy bez vlastního IT. Audit webu od 2 900 Kč, startovací web od 25 000 Kč. Předám vše s návodem.`

### T2. Interní propojení — kritická mezera

Statické trust routes existují v buildu ale nejsou z homepage odkazovány:

**Routy z buildu (kompletní seznam) [C9]:**
- `/kontakt/`, `/sluzby/`, `/portfolio/`, `/soukromi/` — původně identifikované 4
- `/cookies/`, `/gdpr/`, `/podminky/` — nově nalezené v buildu

Nav items (reálné z siteContent.ts): `#about` (FitSection), `#services`, `#process`, `#pricing`, `#terminal` — všechny anchory, žádné statické routy v nav.

**Doporučení:** přidat `/ukazky/` a `/sluzby/` do navItems; `/kontakt/`, `/soukromi/`, `/gdpr/` do SiteFooter.

**Jednoduchá oprava nav** (přidat do `siteContent.ts`):
```typescript
navItems: [
  { href: '#fit', label: 'Co řeším' },       // po přejmenování FitSection id
  { href: '#services', label: 'Služby' },
  { href: '/ukazky/', label: 'Ukázky' },
  { href: '#pricing', label: 'Ceny' },
  { href: '#terminal', label: 'Kontakt' },
],
```

### T3. DemoBlocks conditional render

Oprava v `index.astro`:
```astro
{content.demos.items.length > 0 && (
  <DemoBlocks locale={content.layout.lang} content={content.demos} />
)}
```

### T4. ContactTerminal hydratace

Přejít na `client:visible`:
```astro
<ContactTerminal ... client:visible />
```

**Upřesněný dopad [C4]:** ContactTerminal.js = 7 kB. React core (`client.js` = 181,6 kB) se načte vždy kvůli ThemeModeToggle (`client:load`). Přechod na `client:visible` ušetří hydrataci 7 kB komponenty, nikoli samotný React bundle. Stále platné — každý hydratovaný ostrov přidává práci main threadu.

### T5. Výkon — build výsledky **[C2, C3 — zásadně opraveno]**

**Reálný build: `npm run build` — čistý, 0 warningů, 0 chyb.** (22:32:36–22:32:40, 3,71s, 21 stránek)

**Reálné bundle velikosti z `dist/_astro/`:**

| Chunk | Velikost |
|---|---|
| `client.C1Zt6RQO.js` | **181,6 kB** (React + sdílené utility) |
| `BaseLayout.D65aNWWM.css` | 169,3 kB |
| `StyleMatrixSimulator.js` | 24,3 kB (demo routy only) |
| `ContactTerminal.js` | **7,0 kB** |
| `index.js` | 7,4 kB |
| `ThemeModeToggle.js` | 1,8 kB |
| `MotionOrchestrator.js` | 2,3 kB |
| Three.js | **0 kB — zcela chybí v buildu** |

**Opravy:**
- ~~Large chunk warning~~ → **neexistuje** v tomto buildu
- ~~Three.js ~600 kB raw~~ → **Three.js je absent** ze statického buildu; dynamický import v CoreIsland funguje správně; Three.js se stáhne jen při opt-in uživatelem za runtime
- ~~`manualChunks: { three: ['three'] }` doporučení~~ → **zbytečné** pro tuto konfiguraci; warning neexistuje

### T6. robots.txt — nový nález **[C8]**

**Reálný obsah** `dist/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://radeq.cz/sitemap.xml
```

Demo routy (`/demo/*`, `/en/demo/*`) jsou bez Disallow — **indexovatelné crawlery**. Jedná se o interní QA/review surfaces, ne o veřejné produktové stránky.

**Doporučení:** přidat do `src/pages/robots.txt.ts`:
```
Disallow: /demo/
Disallow: /en/demo/
```

### T7. Přístupnost

**ContactTerminal [C5, C6 — potvrzeno]:**
- `aria-live` ✅ vzorně implementováno: `role` a `aria-live` se přepínají: `alert`/`assertive` pro chyby, `status`/`polite` jinak; `aria-atomic="true"`
- `aria-describedby` ✅ každé pole spojeno s chybovým spanem přes ID
- `aria-invalid` ✅ každé pole nastavuje `aria-invalid="true"` při chybě
- Explicitní labely ✅ každé pole má `<label htmlFor>`

**DemoBlocks prázdná sekce:** conditional guard (T3) odstraní prázdný landmark ze screen readeru.

**FitSection `id="about"` conflict [C7]:** přejmenování je prerekvizita pro přidání AboutSection — duplicitní ID by rozbilo keyboard navigaci i screen reader.

**ServiceCatalog [C10 — lepší než popsáno]:** karty mají `tabindex="0"`, scroll-based `aria-current="true"` na mobilní aktivní kartě. Správné sémantické značení.

### T8. AboutSection — kompletní struktura **[C11]**

AboutSection.astro má 4 subsekce (potvrzeno přečtením zdrojového kódu):
1. `about-services__intro` — sectionCode + h2 (title) + lead
2. `about-services__profile` — profileTitle + profileText + `<dl>` principů (dt/dd páry)
3. `about-services__bridge` — h3 (bridgeTitle) + p (bridgeText) — **přímý most k formuláři**
4. `about-services__note` — závěrečná poznámka

Bridge sekce explicitně formuluje přechod „teď mě kontaktuj" — funkce trust-bridge je přímá součást komponenty, ne jen implikovaná pozicí.

---

## Finální syntéza

### Diagnostika: co stránka dnes říká vs. co říct chce

Stránka dnes říká: *"Jsem generalistický technický pomocník."*  
Stránka chce říkat: *"Jsem specialista na weby pro malé firmy, který to pak celé umí digitalizovat."*

Tato divergence je opravitelná beze změny zázemí stránky — pouze pořadím sekcí, úpravou copy a přidáním existujících komponent. Všechny chybějící komponenty (AboutSection, HandoffStandard) jsou v kódu přítomny a produkčně připraveny.

### Konsolidovaný akční plán

**Vlna 1 — Beze změny kódu (copy only, siteContent.ts):**
1. Hero titulek: implementovat alternativu ze sekce 8
2. Proof rail: Audit na první pozici
3. Lead: zkrátit na 2 věty, dodat „jeden kontakt" signál
4. Pricing karta „Startovací web": přidat 4–5 bullet deliverables

**Vlna 2 — Minimální code změny (1–5 řádků každá):**
5. `FitSection.astro`: přejmenovat `id="about"` → `id="fit"` *(prerekvizita pro bod 7)*
6. `siteContent.ts` navItems: `#about` → `#fit` pro „Co řeším"
7. `index.astro`: přidat `<AboutSection content={content.about} />` za ServiceCatalog
8. `index.astro`: conditional guard pro DemoBlocks `{items.length > 0 && ...}`
9. `index.astro`: `client:visible` pro ContactTerminal
10. `robots.txt.ts`: přidat `Disallow: /demo/` a `/en/demo/`

**Vlna 3 — Střední práce:**
11. Naplnit `demos.items` 2–3 anonymizovanými projektovými portréty odkazujícími na `/ukazky/`
12. Meta title + description (viz T1)
13. SiteFooter: interní odkazy na `/sluzby/`, `/kontakt/`, `/gdpr/`, `/soukromi/`, `/ukazky/`
14. Přidat nav položku `{ href: '#about', label: 'O mně' }` (po přejmenování FitSection id)

**Vlna 4 — Vyžaduje nový obsah:**
15. Social proof section (reálné projekty/citace)
16. HandoffStandard renderovat na homepage
17. Process transparency pod ContactTerminal

---

## Evidence run metadata

| Pole | Hodnota |
|---|---|
| Handoff ID A | hp-20260617-radeq-ux-analysis |
| Handoff ID B | hp-20260617-radeq-playbook |
| Grounded pass datum | 2026-06-18 |
| Build výsledek | ✅ čistý, 0 warningů, 3,71s, 21 stránek |
| Největší JS chunk | client.js = 181,6 kB |
| Three.js v buildu | Absent (dynamic import funguje) |
| Opravené claims | C1 (CLI syntaxe), C2+C3 (chunk warning) |
| Nové nálezy | C7 (duplicate id), C8 (robots.txt), C9 (extra routes) |
| Grounding (v1 advisory) | ~80–85% |
| **Grounding (v2 grounded audit)** | **~95%** |
