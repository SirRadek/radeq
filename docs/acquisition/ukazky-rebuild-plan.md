# Přestavba /ukazky — plán (Fáze 2)

> Výstup dvoufázového multivendor brainstormingu (Opus 4.8 + codex GPT-5.5 xhigh + Gemini 3.1 pro),
> podložený reálnou praxí majitele (bez vymyšlených referencí) a sladěný s decision-mesh governance
> (review 2026-07-08 — `/ukazky/ai-lab` a simulovaný checkout jsou nově povolené pod pojistkami).
> Autoservis chatbot pilot (`832259f`) = **throwaway**, hledání směru.

## Pozicování (jedna věta)
> „Kóduji weby, e-shopy a automatizace pro živnostníky a firmy — od základu, čistým kódem.
> Vše předám do tvého plného vlastnictví, nezamykám tě k sobě, a mluvím řečí reálného provozu,
> kterým jsem sám prošel."

Narativ: **poctivý řemeslník, co místo dřeva/kovu pracuje s kódem a daty** — proti levným šablonářům
(křehké, zamčené, měsíční poplatky) i proti neosobním agenturám (junioři píšou drahý full-service).

## Reframe: z „portfolia" na „demo scénáře / technickou laboratoř"
Úvod natvrdo: *„Nejsou to klientské reference. Jsou to klikatelná technická dema nad demo daty —
ukazuju strukturu, správu, bezpečnost, předání a limity. Můžeš si to proklikat a změřit."*
Ukázky jsou **prominentní** (odkaz v nav + proof strip na homepage), ale **sekundární** k web-nabídce
(`RAD-SHOWCASE-001`).

### Mechanika u každého dema (jádro důkazu)
- **živé mini-admin rozhraní** (klient reálně klikne — „zvládnu to používat?");
- tlačítko **„Pod kapotou / X-Ray"** → architektonický **diagram** (Formulář → Worker → D1/Sheets →
  e-mail/export) + **10–20 řádků čistého kódu** + **provozní náklady** (často 0 Kč/měs. Cloudflare Free)
  + štítek **„co je živé vs co je ilustrační"**.

## 3 demo scénáře (každý = reálný kus CV)
| # | Demo | Důkaz z praxe | Co dokazuje |
|---|---|---|---|
| **1 — vlajkový** | **Dílenský / provozní terminál** — evidence výroby, skladu, docházky; mobilní rychlá tlačítka + admin přehled | 4 roky CNC + zástupce mistra (evidence zakázek/skladu/docházky) | umí osekat těžké ERP na bleskovou appku pro lidi z provozu |
| **2** | **Lehký e-shop** — katalog + **poptávka** + admin s exportem do účetnictví (XML) + **simulovaný/test-mode checkout** (bez reálné platby/PII) | vlastní e-shop (anonymně) + správa e-shopů/CRM | e-shop = systém, co předá čistá data účetní bez ručního přepisování |
| **3** | **Zabezpečený průvodce poptávkou** — pravidlový default; volitelně `/ukazky/ai-lab` živé LLM s **obranou proti prompt-injection + security panelem** (pod pojistkami) | testování 10+ chatbotů pro veřejnou správu/enterprise (anonymně, vč. prompt-injection) | rozumí bezpečnosti a limitům AI — bezpečné systémy s lidskou kontrolou |

Plus **radeq.cz sám** jako živý důkaz (rychlost, tvrzený formulář Turnstile+rate-limit+DKIM, živý `/audit`)
a **autopilot** jako signál (opatrně: „vlastní systém pro řízení AI nástrojů s governance a bezpečností").

## Triáda důvěry (hotové formulace, napříč webem)
1. **Plné předání, žádný lock-in:** „Píšu na otevřených technologiích, vše běží na tvém hostingu a doméně.
   Kdykoli mě nahradíš jakýmkoli JS vývojářem. Nedržím tvá data jako rukojmí."
2. **Pragmatická bezpečnost:** „Žádné těžké neaktualizované pluginy. Formuláře chráním Turnstile + rate-limity,
   nastavuju zálohy a informuju o nových hrozbách."
3. **Čestné limity:** „Jsem sólista. Na robustní systém pro stovky lidí nebo 24/7 podporu ti na rovinu řeknu,
   že nejsem správný partner."

## Parta + eskalace = seniorita
- „Kóduji a stavím architekturu. Na vizuál a texty mám stálou parťačku (UX/copy), rád spolupracuju i s tvým
  grafikem — každý dělá to, v čem je nejlepší."
- „Když projekt přeroste kapacitu jednoho člověka, nenechám tě ve štychu — spolupracuju s předními českými
  vývojářskými a AI studii a projekt umím zaštítit." → z limitu se stává záruka stability.

## Web „za 25 000 Kč" (ČR 2026 standard — codex rešerše: AITOM/Mioweb/Shoptet/FastCentrik)
**V ceně:** 1–5 stran responzivně čistým kódem · SEO základ · formulář + anti-spam · analytika (GA4/GSC) ·
launch checklist · **předání + manuál (vlastnictví)** · lehká pozáruční podpora.
**Explicitně mimo:** brand strategie, profi copy/foto, reklamy, pokročilé SEO, e-shop platby, integrace,
právní texty. → „od základu kódem + poctivé předání + bezpečnost" je **nad** WP-šablonovým standardem.

## Rozhodnutí majitele (zamčeno)
- **PilsnerCBD** → anonymně („provozoval jsem vlastní e-shop", bez CBD kontextu).
- **DIA / EVA / DSSP** → anonymně („testování/vývoj chatbotů pro státní a enterprise projekty vč. bezpečnosti").
- **Tým** → „sólo + parta na dosah" (přítelkyně = design/text; velké projekty → tekies/dnai).

## Pořadí stavby (sólo + parťačka)
1. **Trust vrstva** (copy — vlastnictví/předání + bezpečnost + limity + stack) — bez buildu, nejvyšší ROI důvěry.
2. **Retrofit** stávajících ukázek na „demo scénáře" + X-Ray bloky.
3. **Vlajkový = Scénář 1 (dílenský terminál)** — nejsilnější, nejméně okoukané téma; živý admin + diagram.
4. **Paralelně (design track):** WebGL/2.5D showcase = důkaz designového umu.
5. Správcovský systém e-shopů/domén (až uzraje) → headline reálné aktivum.

**Nejvyšší konvikce (shoda 3 providerů):** `/ukazky` má dokazovat **systémové myšlení + předání**,
ne pestrost designu. Vítězné demo = **živý admin/workflow + diagram**, opřený o reálnou bezpečnost a `/audit`.
