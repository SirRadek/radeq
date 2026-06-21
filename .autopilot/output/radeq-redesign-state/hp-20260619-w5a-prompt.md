Return ONLY a valid JSON object (no prose/fences). RadeQ.cz V3 — Vlna 5a: CTA rename/dedupe
+ odebrání header CTA + šipky DOLŮ. Vracíš pole edits {file, find, replace} (PŘESNÉ shody,
Opus aplikuje) + případně CSS. Namespace `rq-`. Cíl: méně duplicitních tlačítek, jasnější
slovesa, šipky u in‑page CTA míří DOLŮ (↓), protože scrollují k formuláři #kontakt.

## Přesné současné řetězce (najdi je v `find`)
### src/pages/index.astro
- Header: `cta: 'Konzultace zdarma'`  → odebrat header CTA. (viz RqHeader níže — render jen když je cta)
  Edit: `<RqHeader content={{ navItems: nav, cta: 'Konzultace zdarma' }} alternateLabel="EN" alternatePath="/en/" />`
  → `<RqHeader content={{ navItems: nav }} alternateLabel="EN" alternatePath="/en/" />`
- Hero primární: `<a class="rq-btn rq-btn--primary" href="#kontakt" data-rq-magnetic>Domluvit 15min konzultaci</a>`
  → text „Napsat poptávku" (ponech třídy + data-rq-magnetic).
- Hero sekundární: `<a class="rq-btn rq-btn--ghost" href="#sluzby">Podívat se na ukázky</a>`
  → text „Ukázky práce" a href="#ukazky-teaser".
- Služby — ZRUŠIT 5× tlačítko „Mám zájem" a udělat celé karty klikatelné na #kontakt:
  řádky `<a class="rq-btn rq-btn--primary rq-offer__link" href="#kontakt">Mám zájem</a>` a
  4× `<a class="rq-offer__link" href="#kontakt">Mám zájem</a>` → ODSTRANIT tyto <a>.
  Karty `<article class="rq-card rq-offer">` (featured možná `rq-offer--featured`) změnit tak,
  aby byly klikací: navrhni přístupné řešení (např. „stretched link" — do karty přidej
  `<a class="rq-offer__cover" href="#kontakt" aria-label="Mám zájem o tuto službu — napsat poptávku"></a>`
  + CSS, kde `.rq-offer{position:relative}` a `.rq-offer__cover{position:absolute;inset:0}`).
  Vrať i potřebné edits na <article> + CSS pro cover/hover.
- Ceník — 3× „Mám zájem" přejmenovat ať NEjsou stejné (dle tarifu):
  `<a class="rq-btn rq-btn--ghost" href="#kontakt">Mám zájem</a>` (Klid) → „Chci Klid";
  `<a class="rq-btn rq-btn--primary" href="#kontakt">Mám zájem</a>` (Růst, featured) → „Chci Růst";
  druhý `<a class="rq-btn rq-btn--ghost" href="#kontakt">Mám zájem</a>` (Partner) → „Chci Partner".
  (Pozn.: dva ghosty mají stejný find — vyřeš edits tak, aby seděly oba; klidně rozliš dle pořadí
  nebo navrhni jiný spolehlivý find. Pokud nejde rozlišit find, vrať místo toho FULL nové
  markupy 3 tarifních CTA bloků s kontextem okolního textu.)

### src/components/RqDiagnostic.astro
- `<a class="rq-btn rq-btn--primary" href="#kontakt">Probrat to</a>` → text „Napsat poptávku".
- `<span class="rq-flag rq-diagnostic__state" ...>Diagnóza</span>` → „Rozbor".
- `<span class="rq-flag">Diagnóza</span>` → „Rozbor".

### src/components/RqHeader.astro — render CTA jen když existuje content.cta
Najdi: `<a class="rq-btn rq-btn--primary" href={resolve("/#kontakt")}>{content.cta}</a>`
→ obal podmínkou: `{content.cta && <a class="rq-btn rq-btn--primary" href={resolve("/#kontakt")}>{content.cta}</a>}`
(a uprav typ Props tak, aby cta bylo volitelné — pokud je v interface `cta: string`, změň na `cta?: string`.)

### src/styles/rq.css — šipky DOLŮ
- `.rq-btn--primary::after { content: "→"; … }` → `content: "↓";`
- `.rq-btn--primary:hover::after { … }` (posun) → posun na osu Y (translateY) místo X.
- VÝJIMKA: tlačítko odeslání formuláře (`button[type="submit"].rq-btn--primary` v kontaktu)
  NEMÁ mít šipku → přidej pravidlo `.rq-btn--primary[type="submit"]::after,
  .rq-contact-form .rq-btn--primary::after { content: none; }`.

## Vrať JSON PŘESNĚ:
{
 "edits":[{"file":"src/pages/index.astro","find":"…","replace":"…"}, … všechny výše …],
 "rq_css_append":"CSS pro .rq-offer__cover (stretched link, hover) + šipky ↓ úpravy + submit výjimka",
 "verify_notes":["co Opus zkontroluje (žádné Mám zájem ×5, karty klikací, header bez CTA, šipky ↓, Rozbor, ceník 3 různé CTA)"]
}
Bez secrets/logů, žádné staré class names.
