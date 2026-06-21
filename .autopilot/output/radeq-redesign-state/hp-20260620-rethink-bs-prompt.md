RadeQ.cz — brainstorm DALŠÍCH POZNATKŮ k existující strategické rozvaze (redesign homepage).
Kritizuj ze SVÉ nejsilnější role a hlavně **přines NOVÉ poznatky / slepá místa / rizika /
příležitosti, které rozvaha NEpokrývá.** NEopakuj, co už je níže. Vrať čistý markdown.

## Kontext (redigovaný souhrn už hotové rozvahy — ber jako dané)
radeq.cz = web solo dodavatele (analytik + tester) pro konzervativní české ŽL / malé firmy /
spolky. Nabídka: weby/redesign, e-shopy, automatizace procesů, data + praktická AI, audit,
měsíční péče. Stack: Astro (static) + React islands + Tailwind, lead formulář → Cloudflare
Worker/D1 na produkci; sdílený GitHub Pages PREVIEW (ne produkce). Redesign běží jako čistá
prezentační vrstva (`rq.*` komponenty + vlastní `rq.css`) nad reálným platform layerem.

Rozvaha už ROZHODLA (neřeš znovu, ber jako zamčené):
1. **Iterovat in-repo** (greenfield prezentace nad reálným Astro/D1), NE standalone od nuly.
2. **Positioning:** „analytik a tester, který problém rozebere na data a složí řešení, kterému
   rozumíte i po předání." Sebejistý, konkrétní.
3. **Paleta:** teplá ivory báze + grafit text + JEDEN sebejistý akcent + JEDEN hravý pop (lime,
   ~1 %, vždy grafit text). Akcent = terakota (default) vs indigo (alternativa) → rozhodne se
   jedním A/B preview. Plus jeden tmavý „climax" band.
4. **Typo:** výrazný grotesk nadpisy + Inter 18px body, text-wrap balance/pretty, ~62ch.
5. **Motion v1 = JEDEN signature** (hero diagnostická SVG linka), zbytek dělnické mikro-motion;
   ROI kalkulačka + „rentgen" toggle odsunuto do v2. Jen transform/opacity, reduced-motion safe.
6. **Konverze na preview:** jeden formulář, environment-aware (produkce → D1 Worker; preview →
   mailto + čestná poznámka); + „bezpečný přístav" CTA (rezervace 15 min / e-mail) co funguje
   všude bez backendu.
7. **Governance proti zacyklení:** jeden immutable „design-lock" (zamčená rozhodnutí, append-only);
   bounded waves (1 vlna = 1 starost, diff budget, zelený build, preview URL před další vlnou);
   publish-preview ODDĚLENÝ od sandboxovaného workera (worker píše jen do working tree, commit+push
   dělá privilegovaný krok); agy = ohraničený kritik proti zamčenému spec, ne free re-design.
8. **Animation bake-off** úzký a time-boxed: agy navrhne 2–3 motion KONCEPTY, Codex implementuje
   vybraný + 1 alternativu, owner vybere z live preview.

## CO OD TEBE CHCI — další poznatky v těchto osách (vyber, kde máš co říct):
A. **Měření úspěchu** — jak poznáme, že redesign reálně FUNGUJE (ne „líbí se")? Jaké signály,
   metriky, kvalita leadů, baseline před/po, bez invazivního trackingu (privacy-first, GDPR,
   konzervativní cílovka)? Co měřit na statickém webu bez analytického molochu?
B. **Důvěra / proof bez referencí** — radeq zatím nemá veřejné reference. Čím budovat důvěru u
   konzervativního českého klienta (IČO, neplátce DPH, záruka, ukázkové projekty, „pod kapotou",
   osobní tvář)? Co je nejúčinnější a levné?
C. **SEO / akvizice** — český trh, Seznam.cz i Google, lokální + oborové search-intent podstránky,
   „web jako ukázka". Konkrétní, ne obecně. Kde je největší organická páka pro solo dodavatele?
D. **Riziko solo kapacity** — web prodává služby, co dělá 1 člověk. Jak v messagingu/UX ošetřit
   dostupnost, čekací dobu, „co když onemocní", škálování, aby to nebrzdilo důvěru ani konverzi?
E. **Ceník / balíčkování / kotvení** — psychologie cen pro tuto cílovku, „od" ceny vs fixní,
   audit jako nízkorizikový vstup, měsíční péče. Slepá místa v cenotvorbě.
F. **Slepá místa governance** — kde se „design-lock + bounded waves" může sám zaseknout nebo
   selhat? Failure modes, které rozvaha nevidí. Jak poznat „hotovo" (definice done celého redesignu)?
G. **Cokoliv dalšího**, co je podle tebe důležité a chybí (např. i18n /en/ smysl, údržba obsahu
   vlastníkem, výkon/přístupnost jako akceptační brána, konkurenční odlišení na CZ trhu, právní/
   GDPR text, e-mail deliverability leadů, antispam formuláře).

Buď konkrétní a stručný, řezni do priorit (co má největší dopad za nejmíň práce). Bez secrets.
