# Opus rethink — radeq.cz homepage redesign „à la lepshee"

**Datum:** 2026-06-20
**Role:** Opus = architekt / supervisor / rozhodovací analytik. Advisory output — **žádná implementace.**
**Vstupy:** `output/radeq-design-direction-proposal.md`, `radeq-before-after-homepage.md`, `radeq-website-patterns-playbook.md`, `radeq-design-track-backlog.md`, `radeq-compare/`, `radeq-redesign-state/*` (v1–v3.1, w1–w8, 3 kola agy, codex vlny, FIX-LIST-v3, PLAN-v3, FINAL „Transparentní motor"), `radeq-standalone-state/design-direction-opus.md`, reálný strom `C:\Users\sirok\Documents\Projects\radeq`, mesh nody `static_public_site` / `preview_publishing` / `lead_capture_pipeline`.

---

## 0. Diagnóza — proč to drhne (ne proč to vypadá generovaně)

Před/po analýza správně říká: copy a struktura se zlepšily, **design language zůstal generovaný**, protože každé rozhodnutí je *defaultní, ne záměrné*. To je pravda, ale **není to hlavní problém běžící session.** Hlavní problémy jsou tři a všechny jsou procesní:

1. **Koncept se nikdy nezamkne.** Tři dokumenty = tři palety a tři signature mechaniky:
   - `radeq-design-direction-proposal.md` → „Řemeslná preciznost", **terakota** `#C4521A`.
   - `FINAL-koncept-...-transparentni-motor.md` → „Analytik a tester", **vínová + lime**, ROI kalkulačka, „Ukaž pod kapotu" rentgen.
   - `standalone/design-direction-opus.md` → „Confident Blueprint", **indigo + lime**.
   Každé další kolo (v2 → v3 → v3.1, bsa/bsb/bs1/bs2/bs3) místo dokončení **re-otevírá jádro.** To je definice zacyklení.

2. **Ambiciózní interaktivní widgety polykají cykly.** ROI kalkulačka, globální/lokální rentgen toggle, nekonečný marquee diagnostiky — `FIX-LIST-v3` je celý jen o opravách marquee a diagnostického panelu. agy sám doporučil tyto věci do v1 **nedělat**. Tohle jsou ty „dlouhé běhy, co se sekají".

3. **Worker nemůže publikovat preview.** `v31fix-last.md`: `git add/commit` padá na `.git/index.lock: Permission denied`. Bez commitu není push → není GitHub Pages preview → **compare-loop (IS = live preview) nemá co číst.** Loop se zastaví na kroku, který má být automatický.

> Důsledek pro doporučení: design direction je sekundární. **Nejdřív se musí zamknout rozhodnutí a odblokovat preview pipeline**, jinak jakákoli další direction skončí stejně — čtvrtou paletou ve čtvrtém dokumentu.

---

## 1. Iterovat (v2/v3) vs. standalone od nuly — ROZHODNUTÍ

### Doporučení: **Iterovat in-repo redesign. Standalone od nuly NE.**

Ne „iterovat starý web" a ne „stavět vedle". Správný model už fakticky běží na větvi `autopilot/radeq-v1` a jen není pojmenovaný:

> **Greenfield prezentační vrstvu uvnitř reálné Astro app. Reuse platform layer.**
> Nové `Rq*` komponenty + samostatný `rq.css` (čistý designový systém, nezávislý na 6 576 řádcích `global.css`), ale **dědí** routing, `BaseLayout` (SEO/canonical/hreflang), `siteContent.ts`, sitemap/robots generátory, a hlavně **D1 + Worker lead pipeline**.

### Proč ne standalone od nuly

| Co standalone zahodí | Náklad znovupostavení | Hodnota |
|---|---|---|
| D1 + Cloudflare Worker lead capture | dny + nový backend | vysoká (jediný funkční kontakt na ostro) |
| `BaseLayout` SEO systém (canonical, hreflang, OG, sitemap, robots) | dny, snadno rozbít | vysoká |
| Routing `/sluzby` `/kontakt` `/ukazky` `/soukromi` `/en/*` | dny | vysoká (SEO + trust routes) |
| `siteContent.ts` obsahový model | hodiny–dny | střední |
| Astro build/deploy/preview workflow | hotové | vysoká |

Standalone už **jednou spadl** (cold start, žádný reuse) a jeho vlastní art-direction doc přiznává: *žádný reálný kontakt, žádné logo*. Mesh nody (`static_public_site`, `lead_capture_pipeline`, `preview_publishing`) **předpokládají Astro app** — standalone by je všechny obešel, což je přímo proti governance.

### Proč in-repo redesign dává 90 % svobody „od nuly" bez rizika

- **Čistý vizuál:** `rq.css` + `Rq*` komponenty = prázdné plátno, žádný balast z `global.css`. Tohle je ten „fresh start" pocit, který vlastník chce.
- **Bezpečné nasazení:** redesign může žít jako **nová routa nebo za feature-flagem**, dokud není schválen. Starý homepage zůstane netknutý → nulové riziko regrese, plný preview pro porovnání.
- **Jedno SEO, jeden DOM, jeden build** — žádná dvojí údržba (přesně to, co agy vytkl u globálního toggle).

### Riziko iterace a jak ho ošetřit
Riziko = **drift a cruft** (přesně to, co se děje). Mitigace = zámek z §4. Iterace bez zámku = standalone bez reuse; obojí selže. **Zámek je podmínka, ne doplněk.**

---

## 2. Design direction — JEDNA doporučená, ukotvená na reálný obsah

> Pozn. k principu „proces, ne šablona": níže **není** povinná šablona. Je to *jedna doporučená direction k odsouhlasení vlastníkem*. Po odsouhlasení se zamkne (aby se nepřegenerovávala), ale **provedení uvnitř vlny zůstává kreativně volné.** Zamyká se rozhodnutí, ne ruka.

### 2.1 Positioning (doporučuji ponechat z „Transparentní motor")
Vzešel z reálných 3 kol agy a je **obsahově pravdivý** (sedí na vlastníka: solo, „analytik a tester", SMB, transparentní ceny, předání):

> „Nejsem jen kodér — jsem analytik a tester, který problém rozebere na data a složí z něj řešení, kterému rozumíte i po předání."

Sebejistý, konkrétní, ne-generický. **Drž ho.** Hero copy už reálně existuje a funguje: *„Web, který jasně vysvětlí vaši nabídku — a ušetří čas na zbytek."*

### 2.2 Paleta — sjednotit tři návrhy do jednoho
Tři palety jsou hlavní zdroj driftu. Princip napříč všemi je shodný a správný: **teplá ivory báze + grafit + JEDEN sebejistý akcent + JEDEN hravý pop, použitý střídmě (≤ 8–9 %).** Liší se jen akcent.

**Doporučený default (decisive):**
```
--canvas:    #F6F4EF   ivory/písek (teplá, NE zelená, NE indigo-cold) — báze 80 %
--ink:       #1C1A17   grafit, AAA na ivory — text/struktura 15 %
--accent:    #C4521A   terakota — primární CTA, odkazy, čísla, aktivní stav (~8 %)
--pop:       #C8F24E   lime — POUZE diagnostický marker, vždy grafitový text uvnitř (~1 %)
--dark:      #1A1611   teplý uhlík — jeden tmavý „climax" band (ceník/proof/footer)
--muted:     #5B5F68 / borders #E4E2DB
```
**Proč terakota a ne indigo/vínová:**
- **Warm-on-warm je koherentní** s ivory; indigo je studené a stahuje web do generického SaaS-blue moře (přesně „vypadá vygenerovaně").
- **Distinktivnost:** drtivá většina dev/SMB webů je modrá/zelená/černá. Terakota = řemeslo, materiál, teplo — odlišuje.
- **Kontinuita:** produkce má terakotový „pot" mascot (`#a85f2a`) — terakota není skok, je to zostření existující stopy.
- **Vínová** je riskantní sourozenec terakoty (agy: „herní doupě, ne B2B partner") → nabídnout jako „premium alternate", ne default.

**Jediné reálné vlastníkovo rozhodnutí:** terakota vs. indigo. Vyřešit **jedním A/B preview** (dvě `?v=` URL, side-by-side), ne dalším dokumentem. Lime drž jako 1% marker s grafitovým textem — nikdy světlý text na lime.

### 2.3 Typografie (napříč dokumenty už shoda — zamknout)
- **Display/nadpisy:** výrazný grotesk s charakterem (Space Grotesk / General Sans / Syne), weight 700–800, `text-wrap: balance`, hero clamp cap ~6 rem desktop, H2 clamp 40–56 px, eyebrow 13 px mono (technická preciznost).
- **Body:** humanist sans (Inter), **18 px** (klíčové — současný web má slabý heading↔body kontrast), `text-wrap: pretty`, `max-width: ~62ch`.
- **GDPR:** self-host fontů (ne `@import` Google Fonts) — konzervativní SMB + privacy posture.

### 2.4 Prostor (zamknout)
8pt rytmus; sekce 96–128 px desktop / 56–88 mobil; víc whitespace nad hero a mezi sekcemi (současný web je komprimovaný → „levný" pocit). 4K: max-width dle typu sekce (text ~1240, bento/ceník ~1440), mírný root-rem scale > 1920 px, aby web nebyl „nudle v prázdnu".

### 2.5 Motion — „instrumentace, ne ornament" (radikálně zúžit pro v1)
**Toto je nejdůležitější škrt celého rethinku.** Současné tři interaktivní mechaniky (ROI kalkulačka, rentgen toggle, marquee diagnostika) = zdroj všech dlouhých běhů a `FIX-LIST`.

> **v1 = JEDEN signature moment, ne tři.**
> Signature = **hero diagnostická SVG linka** (stroke-draw + signal): čisté SVG/CSS, levné, `IntersectionObserver` + no-JS + `prefers-reduced-motion` safe, pouze `transform`/`opacity`. Plus dělnické mikro-motion: reveal-on-scroll (fade+rise), underline-draw u odkazů, card lift 2–4 px (bez tiltu), focus motion. **Ceník a formulář bez motion.**

ROI kalkulačka a „Ukaž pod kapotu" rentgen → **odsunout do v2 (až web vydělá).** Jsou to dobré nápady, ale jsou to *produktové featury*, ne homepage redesign. Drží celý redesign jako rukojmí.

### 2.6 Struktura sekcí (homepage-hub, už v zásadě odsouhlaseno)
Header (wordmark, nav, bez CTA tlačítka v hlavičce — fix #4) → Hero (H1 + 2 CTA + diagnostická SVG linka) → Fit/„kdy to dává smysl" → Služby (4, karta = výsledek + 3 výstupy) → O mně/Přístup → **tmavý climax band** (proof/ceník) → Ceník (veřejný, transparentní) → Kontakt → Footer. Mělká IA, max 2 kliky. Podstránky se search-intentem: `/tvorba-webu-a-eshopu`, `/automatizace-procesu`, `/ai-agenti-a-data`, `/technicke-seo`, `/cenik`, `/zapisky`.

**Co dělá „profesionální, ne generované" při nejnižší ceně:** bold display typografie + 18px body + jeden záměrný teplý akcent + jeden tmavý band + jedna SVG signature + vzduch. Žádná z těch věcí není kalkulačka.

---

## 3. Kontakt/konverze na statickém preview (bez D1)

GitHub Pages = jen statika; D1 Worker formulář na preview **nefunguje a nemá fungovat** (mesh `PREV-FAIL-005` to označuje jako očekávané — neblokovat). Cíl preview = review *designu a copy*, ne ostrá konverze.

### Doporučení: jedna komponenta, environment-aware action + Calendly jako no-backend konverze
1. **Jeden formulář, přepínatelný cíl.** Komponenta čte cíl z env/hostname:
   - **produkce (radeq.cz / Cloudflare):** `POST /api/leads` → D1 Worker (beze změny pipeline).
   - **preview (`sirradek.github.io`):** degradovat na **`mailto:` + viditelná čestná poznámka** *„Preview režim — na ostro odesílá rovnou do schránky."* Žádný třetí-stranový backend, žádné nové secrets, drží privacy posture. Layout + copy + validace jsou plně viditelné → review-complete.
2. **Calendly (nebo prostý `tel:`/`mailto:`) jako primární „bezpečný přístav".** FINAL koncept správně žádá blbuvzdorné primární CTA. „Rezervujte 15 min" / e-mail **funguje identicky na preview i na ostro bez jakéhokoli backendu** → preview je tím **konverzně kompletní, ne jen mockup.** To je velká výhoda: vlastník vidí reálnou konverzní cestu, ne placeholder.
3. **Co NEdělat:** nezavádět Formspree/Basin jen kvůli preview (nový vendor, nový secret, proti privacy minimalizaci); nesnažit se rozběhat D1 na Pages.

> Pravidlo: **submission target se mění podle prostředí; UI/copy/validace se nemění.** Tím zůstává jeden zdroj pravdy a preview věrně reprezentuje produkci.

---

## 4. Robustnější workflow přes reálné vendory (bez zacyklení a zasekávání)

Reálný loop (`codex_cli` + `agy_cli`) je validovaný (memory 2026-06-18). Problém není *zda* vendoři, ale *disciplína smyčky*. Roleplay dokumenty (GPT/Gemini agenti = Claude) jsou **superseded** — drž reálné vendory.

### 4.1 Tři příčiny zaseknutí → tři tvrdá pravidla

**A) Koncept driftuje → DESIGN LOCK (jeden immutable soubor).**
Vytvořit `docs/projects/radeq/design-lock.md` jako **jediný zdroj pravdy**: positioning, paleta (po A/B), typo, spacing, motion principy, pořadí sekcí, JEDNA signature mechanika, scope v1 vs v2. **Jednou zamčené rozhodnutí je neměnné.** Brainstorm/kritika smí vyplňovat jen *ohraničené otevřené sloty* (copy konkrétní sekce, odstín v rámci A/B), **ne re-otevírat zamčené.** Pokud vendor navrhne re-otevření zámku → **stop a dotaz vlastníka**, ne automatické přijetí. (Disciplína je v procesu; provedení uvnitř vlny volné — sedí na „process rules, not design rules".)

**B) Dlouhé běhy se sekají → BOUNDED WAVES (1 vlna = 1 starost).**
Nikdy „přeredesignuj homepage" v jednom běhu. Vlna = jeden concern (barvy NEBO typo NEBO spacing NEBO jedna komponenta) s: WANT (spec) + acceptance gate + **diff/time budget**. PLAN-v3 už má správný tvar vln 5–9 — **drž ho, ale přestaň přidávat verze (v1/v2/v3 paralelně).** Jedna větev, vlny, ne paralelní koncepty. Když běh překročí budget nebo nedá zelený build → **abort, zmenši scope, opakuj** (nepouštět kalkulačku+toggle+marquee v jednom běhu).

**C) Worker nepublikuje preview → ODDĚLIT „psaní souborů" od „commit+push".**
Toto je konkrétní blocker (`.git/index.lock permission denied`). Codex/agy **píšou jen do working tree**; commit+push (= spouštěč GitHub Pages) dělá **privilegovaný krok**: buď owner-run skript `npm run preview:publish` (add+commit+push), nebo Opus/host s git právy. **Compare-loop nesmí záviset na git právech sandboxovaného workera.** (Alternativa: opravit sandbox git permissions — ale decoupling je robustnější, protože nevyžaduje dávat workeru zápis do `.git`.)

### 4.2 Role (dle taxonomie, memory 2026-06-19)
| Vendor | Role ve smyčce | Tvrdá hranice |
|---|---|---|
| **Opus** | Vlastní Design Lock; píše bounded handoffs (WANT + acceptance); řídí compare-loop WANT↔MĚLO BY↔VYPADÁ (IS čte z **live preview**); odškrtává; sbírá nedostatky | **Nepíše feature kód** (codex-only model) |
| **Codex (`codex_cli`)** | Implementuje vlny v working tree; tech-oponent na feasibility *před* stavbou; write rights | Drží se WANT + acceptance jedné vlny |
| **Antigravity (`agy`, gemini-3.1-pro-high)** | Kreativní + strategický oponent, SEO — **redigovaný kontext**; kritizuje *proti zamčenému spec* | Ne free re-design; `--print` přes file-write capture trick |
| **Qwen** | Privátní lokální worker (citlivý kontext) | — |

### 4.3 Anti-loop invarianty (checklist do governance)
1. Design Lock je append-only; zamčené rozhodnutí immutable.
2. Každá vlna: max diff budget + musí skončit zeleným buildem + **musí vyprodukovat preview URL** před další vlnou.
3. Kritické kolo (agy) max 1–2× na vlnu a **jen actionable diffy**, ne nová vize.
4. Re-otevření zámku = stop + dotaz vlastníka.
5. Verze se nemnoží: jedna větev, vlny — ne v1/v2/v3 paralelně.
6. Compare-loop IS vždy z live preview (`?v=<commit>`), ne ze staré paměti.

### 4.4 Pipeline (jeden průchod)
```
LOCK (Opus+owner, 1×) → WAVE PLAN (Opus) →
  pro každou vlnu:
    feasibility (Codex, krátké) → implement (Codex, working tree, bounded) →
    PUBLISH PREVIEW (privilegovaný krok, oddělený od workera) →
    COMPARE (Opus čte live preview: WANT↔MĚLO BY↔VYPADÁ) →
    check-off + deficiencies → [1 kritika agy jen když Opus flagne mezeru]
```

---

## 5. Animation bake-off (Codex vs Antigravity) — má smysl?

### Doporučení: **Ano, ale úzký a time-boxed — a ve „fair" variantě, kde implementuje jen Codex.**

Motion je jediná oblast, kde „feel" jde špatně zachytit v proze → malý head-to-head může najít lepší signature než jeden vendor sám. Plný bake-off ale = přesně to zacyklení. Proto:

- **Bake-off JEN pro jednu věc:** hero diagnostická SVG signature (nejvyšší páka, nejvíc „feel"-dependentní). Ne celý motion systém.
- **Fér varianta (doporučená kvůli agy `--print` křehkosti při emitování souborů):**
  **agy navrhne 2–3 motion *koncepty*** (jeho silná stránka = kreativní oponent) → **Codex implementuje vybraný + jeden alternativní** (jediný spolehlivý implementer) → **Opus + owner vyberou z live preview side-by-side.** Tj. bake-off *konceptů*, ne dvou implementací.
- **Identická acceptance pro obě varianty** (Lighthouse 90+, 0 overflow, reduced-motion parita, jen transform/opacity) → soudí se **feel, ne korektnost.**
- **Výstup:** dvě `?v=` URL, vlastník klikne vítěze; dobré nápady poraženého se složí do finální.
- **Time-box:** 1 vlna, pevný budget. Když nedá zelený build → abort, ne donekonečna.

Plná varianta „oba implementují" má smysl jen pokud se potvrdí, že agy umí spolehlivě emitovat soubory přes capture trick; jinak je to risk dalšího zaseknutí. **Default = agy koncepty, Codex implementace.**

---

## 6. Doporučená cesta + první krok

### Cesta (jedna věta)
**Iteruj in-repo redesign (greenfield `rq.*` prezentace nad reálným Astro/D1 platform layerem), zamkni JEDEN koncept (terakota + analytik/tester positioning + jedna SVG signature, kalkulačka až v2), odděl publish-preview od sandboxovaného workera, a žeň vlny přes Codex s agy jako ohraničeným kritikem — bez množení verzí.**

### Doporučený PRVNÍ krok (vše ostatní je downstream)
**Zastav generování a ZAMKNI design + odblokuj preview.** Konkrétně, v jednom sezení:
1. Opus sepíše `docs/projects/radeq/design-lock.md` z této syntézy (positioning, paleta-mimo-akcent, typo, spacing, motion principy, sekce, scope v1/v2).
2. **Jeden A/B preview** terakota vs. indigo → vlastník rozhodne akcent → doplnit do zámku.
3. **Opravit/obejít commit blocker** (`preview:publish` skript nebo git práva), aby compare-loop běžel.

Dokud zámek a preview pipeline nestojí, jakákoli další direction skončí čtvrtou paletou ve čtvrtém dokumentu.

---

*Advisory output. Žádné produkční ani repo změny neprovedeny. Roleplay-vendor dokumenty (GPT/Gemini = Claude agenti) jsou superseded reálným `codex_cli`+`agy_cli` loopem. Verifikace a vlastníkova rozhodnutí (akcent, scope) předcházejí implementaci.*

---

## 7. Další poznatky — brainstorm 2026-06-20 (Codex + Opus)

> **Metoda:** nezávislý brainstorm „dalších poznatků, které §0–6 nepokrývá". Reálný `codex_cli`
> (read-only) + Opus. **Antigravity (Gemini) lane je PENDING** — runner spadl, protože autopilot
> repo byl přepnut z větve `codex/autopilot-safe-move-20260612` na `main` (worker soubory
> `cliWorker.ts`/`checkCompletionMatrix.ts` na `main` nejsou), a přímé `agy --print
> --dangerously-skip-permissions` blokuje auto-mode classifier (ochrana proti autonomním loopům).
> Gemini SEO/kreativní lane se doplní po odblokování. **Silná shoda Codex↔Opus napříč body níže.**

### 7.1 Měření úspěchu — severka = KVALITA poptávek, ne návštěvnost
Redesign „funguje", když přijde **víc dobře sedících poptávek**, ne víc pageviews. Konkrétní
privacy-first sada (Codex+Opus): `lead_count` (form/mailto/booking kliky) · `qualified_lead_count`
(ručně po 1. čtení) · `lead_score` 0–3 (fit/rozpočet/naléhavost/srozumitelnost) · `source`
(dobrovolná otázka „jak jste se sem dostal?" místo trackování) · `search_visibility` (Search
Console + Seznam Webmaster — dotazy/stránky, ne lidé) · `form_health` (selhání submitu, bounce,
spam, nedoručené notifikace) · `decision_latency` (dny poptávka→hovor→zaplacený audit). **Stack:**
Cloudflare Web Analytics (cookieless, bez consent banneru) + Search Console + Seznam Webmaster +
D1 + ruční CSV/MD log. Žádné cookies/heatmapy/remarketing. **Baseline:** ručně sepsat posledních
30–90 dní (počet, kvalita, zdroje); hodnotit po 6–8 týdnech, SEO po ~3 měsících. **Formulář je
měřicí + kvalifikační nástroj**, ne jen schránka.

### 7.2 Důvěra bez referencí — ukázat ARTEFAKTY práce
Nejsilnější levná náhrada referencí = veřejné artefakty metody (Codex+Opus): anonymizovaný
„audit jedné stránky" (PDF/HTML) · ukázka **předávací dokumentace** (přístupy, deploy, zálohy,
co při výpadku) · veřejný checklist „jak testuji web před předáním" · **`/pod-kapotou/`** = radeq
audituje sám sebe (výkon, a11y, formulář, bezpečnost) · modelový projekt jasně označený jako
modelový · osobní fotka + IČO + „neplátce DPH" bez schovávání. Záruka **úzká a věcná** (oprava
chyb v rozsahu X dní, audit započitatelný, klient vlastní doménu/kód/přístupy), ne „spokojenost
zaručena". **P0 BLOKER (Opus):** na živém preview jsou placeholdery „Radek [PŘÍJMENÍ]",
„[DOPLNIT TELEFON]", „IČO [DOPLNIT]", „[MĚSTO]" — ničí důvěru a **blokují produkci**; vyřešit s
vlastníkem dřív než cokoliv designového.

### 7.3 SEO / akvizice — cílit na BOLEST, ne na službu
Homepage není SEO motor. v1 má připravit strukturu pro 6–10 **pain-intent** podstránek
(Codex): `/audit-webu/` („web nepřináší poptávky", „audit webu cena") · `/redesign-webu/` ·
`/weby-pro-spolky/` · `/weby-pro-zivnostniky/` · `/automatizace-male-firmy/` · `/pece-o-web/` ·
`/pod-kapotou/`. „Tvorba webu" je přeplněná; vyhrávají dotazy jako „nechodí poptávky z webu",
„pomalý web", „formulář neposílá e-maily", „web se nezobrazuje na Seznamu", „kolik stojí údržba
webu". **Seznam** (~konzervativní demografie = přesně radeq cílovka): sitemap v robots.txt, čisté
texty mimo obrázky, přirozená čeština, schema — statické Astro je tu výhoda. **Levný externí
footprint:** Firmy.cz + Google Business Profile + osobní LinkedIn + pár oborových odkazů > 40 blogů.
„Web jako ukázka": každá `/ukazky/*` stránka = long-tail landing pro svůj intent.

### 7.4 Riziko solo kapacity — přiznaná kapacita = řízení, ne slabina
§0–6 to neřešilo. Skrytá kapacita působí jako riziko; **přiznaná působí jako kontrola kvality**
(Codex+Opus). Konkrétní messaging: „Beru omezený počet projektů, aby měl každý jasný výstup" ·
„Běžná odpověď do 2 prac. dnů" · „Aktuální start realizací: <měsíc/kvartál>" · „Rychlé zásahy
řeším u klientů v měsíční péči". **Neslibovat záložní tým, pokud neexistuje.** Odpověď na „co když
onemocníte" = **předávací balík + klient vlastní účty/kód/doménu** — tj. „bez závislosti na
dodavateli" (už v copy) otočit z featury na **trust signal proti solo-riziku**.

### 7.5 ⚠️ Ceník — DECISION POINT (tenze s dřívějším rozhodnutím vlastníka)
Codex tvrdě: **„od 9 900 Kč" přitahuje špatné leady a rámuje práci jako levnou**; lepší „typicky
25–60 tis. podle rozsahu; menší zásahy po auditu", cenu vysvětlit přes rozhodovací faktory (počet
stránek, kdo dodává texty, e-shop/automatizace, migrace, úroveň testování, péče); hodinovku
nedávat jako hlavní ceník (zvyšuje strach z nekontrolovaných nákladů). **POZOR:** vlastník dříve
v session explicitně zvolil **levnější „od" variantu** („levnější je lepší, vyšší cenu zmínit
v detailu"). Tohle je **skutečný rozpor k rozhodnutí vlastníkem**, ne tichá změna — Opus to
nepřepisuje. Kompromis k zvážení: ponechat nízký vstup přes **placený audit jako vstupní produkt**
(nízké riziko klienta, vysoká kvalifikace), ale realizační ceny posunout na „typicky od–do" místo
holého minima. **Audit = vstupní produkt** je shoda obou (Codex+Opus): placená diagnostika
s jasným výstupem, započitatelná do realizace — filtruje „okukávače", tvoří závazek.

### 7.6 AI messaging — opatrně u konzervativní cílovky (nový bod, Codex)
„AI" může konzervativního klienta znervóznit. V copy vést přes **„automatizace rutiny, méně
přepisování, přehled v datech"**; AI až jako nástroj **s hranicemi** (nad schválenými podklady).
Dnešní prominentní „Data a AI pomocníci" zvážit přerámovat na užitek, ne technologii.

### 7.7 Konverze / formulář / doručitelnost (nové, hlavně Codex)
Formulář se neptá jen „napište zprávu" → **kvalifikační otázky**: co dnes nefunguje, typ
organizace, kdy to potřebujete, orientační rozpočet (volitelně), preferovaná odpověď. **E-mail
deliverability je tichý zabiják leadů:** SPF/DKIM/DMARC, notifikace z vlastní domény, `reply-to`
na klienta, log nedoručení, záložní mailto. **GDPR minimalismus:** jasný účel + doba uchování +
správce u formuláře; žádný skrytý newsletter opt-in; bez marketingových cookies → **žádný cookie
banner**. „Poslední aktualizace" u ceníku/kapacity/procesu — zastaralé info ničí důvěru víc než
chybějící animace.

### 7.8 Governance failure-modes + Definition of Done + CUTOVER (Codex+Opus)
**Failure-modes design-locku:** může zamknout špatnou hypotézu → potřebuje **escape hatch**
(co se smí znovu otevřít, když měření/test ukáže problém); příliš vágní lock nehlídá (musí mít
konkrétní hodnoty, ne principy); lock bez odkazů z vln → drift se vrátí (každý handoff cituje
sekci locku). **Bounded waves:** musí být **vertikální řezy (celá sekce), ne horizontální (jedna
vlastnost přes vše)** — jinak švy/„bordel" (Opus). Po každých 2–3 vlnách **„přečti homepage jako
klient za 90 s"** (Codex). A/B preview barev = volba směru, **ne validace trhu** → mikrotest se
**3 lidmi z cílovky** („Co nabízí? Věřili byste mu? Co dál?"). **Definition of Done celého
redesignu** (Codex): jasná první akce + záložní kontakt; všechny CTA fungují na produkci i
preview; **lead notifikace dorazí se správným reply-to**; Search Console/Seznam/sitemap/robots
připravené; mobil/klávesnice/kontrast/reduced-motion/200% zoom OK; Lighthouse/CWV bez regrese;
404/canonical/OG/metadata; právní minimum + retenční pravidla leadů; obsah má vlastníka + datum
revize; **vlastník umí říct, podle čeho za 8 týdnů pozná, že to funguje.** **Největší slepé místo
(Opus):** chybí **plán cutoveru na produkci radeq.cz** — vše žije na preview, který NENÍ produkce.
Bez kritérií a plánu přechodu = „věčné preview divadlo". Definovat cutover teď.

### 7.9 Rozhodnutí pro vlastníka (z §7)
1. **Ceník:** ponechat „od" (vlastníkova dřívější volba) vs posun na „typicky od–do" + audit jako vstup? (§7.5)
2. **`/en/`:** zrušit (CZ cílovka) vs ponechat? Obě (Codex+Opus): bez důkazu poptávky **nedělat plnou angličtinu**. (§7 G)
3. **Placeholdery (jméno/IČO/telefon/město):** P0 — doplnit reálné, jinak nelze na produkci. (§7.2)
4. **Design-lock escape hatch:** schválit pravidlo „kdy se smí lock znovu otevřít". (§7.8)
5. **Production cutover:** kdy a podle čeho redesign přejde z preview na ostrou radeq.cz. (§7.8)

### 7.10 Doplnění — Antigravity (Gemini 3.1 Pro) lane (přidáno 2026-06-20, po obnově runneru)
Gemini četla reálné projektové soubory (`architecture.md`, `rules.yaml`, `work-log.md`), takže
nese projektově konkrétní delty nad rámec Codex+Opus. NOVÉ body (neopakuje 7.1–7.9):

- **Měření (ostřejší než 7.1):** i „cookieless" Cloudflare Web Analytics může být pod přísným
  výkladem **ÚOOÚ** zpracování síťových identifikátorů → riziko nutnosti lišty; konzervativní
  cílovka navíc lištu = okamžitý bounce. **Lepší: bezsíťová server-side analytika** — Cloudflare
  **Worker při routingu inkrementuje anonymní agregovaná počítadla v D1/KV** (např. počet návštěv
  `/kontakt`/den), bez IP/UA → 100% legální, nulový dopad na výkon, **žádný banner**. + do lead
  payloadu přidat `fill_time_seconds` / `validation_attempts` (tření formuláře bez sledování neodhodlaných).
- **Důvěra (rozšiřuje 7.2):** **„80bodový checklist kvality"** jako sekce/stránka (Playwright
  testy, rychlostní limity, WCAG, validace, security hlavičky) — deklarace, kterou „lepič šablon"
  nezvládne. **Živý self-benchmark** v patičce („tento web: Lighthouse 100/100, A+ security,
  <200 ms — stejnou péči dostane váš projekt"). **6měsíční technická záruka** (oprava zobrazení/
  formulářů zdarma) — adresuje největší strach konzervativce: „freelancer po zaplacení zmizí".
- **SEO (rozšiřuje 7.3):** SeznamBot **špatně renderuje JS** → čisté HTML kritické (Astro OK) +
  **Firmy.cz = zdroj lokální autority pro Seznam**. **Defenzivní srovnávací stránky:**
  `/srovnani/wordpress-vs-staticky-web`, `/srovnani/webnode-vs-reseni-na-miru` (cílit na lidi už
  frustrované existujícím řešením — vyšší konverzní intent než „tvorba webu").
- **Solo (copy k 7.4):** „Komunikujete přímo s autorem kódu, ne s projekťákem. Dělám max. jeden
  velký web naráz." + transparentní fronta + explicitní handoff-bez-zámku: „když zítra skončím,
  máte čistý kód v Astro/Reactu na svém Cloudflare účtu, kdokoliv naváže — nejste na mně závislí."
- **Ceník — TCO kotvení (řeší tenzi 7.5!):** konzervativec srovnává 40 tis. vs Webnode pár stovek/měs.
  **3letá TCO tabulka:** statický web na Cloudflare = **0 Kč/měs provoz** vs WordPress 1–2 tis./měs
  → za 3 roky je „dražší" statický web **levnější**. Tím lze obhájit vyšší realizační cenu, aniž
  se opouští vstupní nízké riziko. Audit přejmenovat na **„Vstupní analýza s plánem oprav"** +
  garance „nenajdu ≥3 konkrétní chyby → neplatíte; rozhodnete se pro redesign → cena se odečte".
- **Governance (k 7.8):** **„Default Placeholder Lock"** — když owner nedodá asset (fotka/text),
  automaticky sémantický placeholder, aby šlo vlnu uzavřít a netvořil se bottleneck na straně
  klienta. Done navíc: Lighthouse **>95 mobil** na core cestách + **Playwright e2e odeslání leadu
  v produkčním režimu** + vyřešené SPF/DKIM.
- **Antispam bez captchy:** honeypot + **time-on-page token** (submit <3 s = bot); Turnstile jen
  jako fail-safe (captcha frustruje starší uživatele).
- **⚠️ KRITICKÁ doručitelnost leadů (Gemini z `rules.yaml`):** MX je zamčené na **Fastmail**; pokud
  Worker posílá notifikace leadů z domény `radeq.cz` přes Cloudflare, ale **SPF neobsahuje
  Cloudflare**, přijímací servery to zahodí jako spoofing → **tiše ztracené leady**. SPF musí
  zahrnout OBOJE: `v=spf1 include:spf.messagingengine.com include:_spf.mx.cloudflare.net -all`
  (+ DKIM/DMARC). **Vysoký dopad, nízká práce — ověřit hned.**

> **Konvergence napříč Codex+Gemini+Opus (vysoká jistota):** audit jako placený vstupní produkt;
> proof = artefakty procesu (checklist + self-benchmark) místo referencí; SEO přes bolest/srovnání,
> ne „tvorba webu"; solo otočit na přednost + handoff-bez-zámku; `/en/` odložit; SPF/deliverability
> a lead-notifikace jako Definition-of-Done bloker; placeholdery dořešit, jinak nelze na produkci.

*Addendum 7 advisory (Codex + Gemini 3.1 Pro + Opus — všechny tři reálné lane kompletní). Žádné repo/produkční změny. Rozhodnutí ze 7.9 (+ TCO/ceník, SPF fix) předcházejí implementaci.*
