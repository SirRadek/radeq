Zde je strategická oponentura a návrh nových poznatků, rizik a příležitostí pro redesignhomepage webu **radeq.cz**. Analýza vychází z existujícího kontextu zapsaného v [architecture.md](file:///C:/Programov%C3%A1n%C3%AD/Codex/docs/projects/radeq/architecture.md) a [rules.yaml](file:///C:/Programov%C3%A1n%C3%AD/Codex/docs/projects/radeq/decision-mesh/rules.yaml), přičemž se zaměřuje výhradně na nezmapovaná místa s vysokým poměrem dopad/úsilí.---### A. Měření úspěchu (Bez cookies a analytického molochu)*   **Slepé místo: GDPR šedá zóna u „privacy-first“ nástrojů.** I Cloudflare Web Analytics bez cookies může být pod přísným výkladem českého ÚOOÚ vnímáno jako zpracování síťových identifikátorů vyžadující lištu. Konzervativní cílovka navíc cookie lišty nesnáší (okamžitý bounce).
*   **Příležitost: Zcela bezsíťové server-side měření.** Místo načítání externích skriptů využít to, že web běží na Cloudflare Workeru. Worker může při směrování požadavků inkrementovat anonymní agregovaná počítadla přímo v Cloudflare D1 (nebo KV) – např. počet návštěv `/kontakt` za den, bez ukládání IP adres či User-Agentů. Tím vznikne 100% legální analytika s nulovým dopadem na výkon klienta a s nulovou nutností cookie lišty.
*   **Mikro-konverzní signály v leadu:** V komponentě [ContactTerminal.tsx](file:///C:/Programov%C3%A1n%C3%AD/Codex/src/components/ContactTerminal.tsx) měřit chování lokálně (čas strávený na formuláři, případné opravy chyb) a odeslat tato metadata *pouze* tehdy, když uživatel formulář reálně odešle (jako součást payloadu `metadata: { fill_time_seconds: X, validation_attempts: Y }`). Neruší to soukromí neodhodlaných, ale dává to přesnou zpětnou vazbu o tření ve formuláři.### B. Důvěra a proof bez referencí (Pro české IČO)*   **Příležitost: „Proces jako produkt“ (Transparentní checklist).** Pokud chybí loga známých klientů, je nutné prodat metodiku. Vytvořit dedikovanou sekci nebo podstránku prezentující „Můj standard kvality: 80bodový checklist, kterým projde každý můj web před spuštěním“ (zahrnující testování v Playwright, rychlostní limity, přístupnost WCAG, validaci formulářů, bezpečnostní hlavičky). Ukazuje to extrémní profesionalitu, kterou běžný WordPress „lepič šablon“ nedokáže deklarovat.
*   **Technický benchmark (Web jako reference):** Umístit do patičky nebo k ceníku dynamický odkaz na audit samotného webu radeq.cz. Např. *„Tento web běží s výkonem 100/100 v Lighthouse, má A+ hodnocení bezpečnosti a načítá se pod 200 ms. Stejnou péči dostane i váš projekt.“*
*   **Záruka na kód (Technical Warranty):** Snížit riziko solo dodavatele tím, že copy explicitně nabídne „6 měsíců záruku na technickou funkčnost“ (oprava chyb v zobrazení nebo odesílání formulářů zdarma). Konzervativní klient se nejvíce bojí toho, že freelancer po odevzdání a zaplacení přestane komunikovat.### C. SEO a akvizice (Seznam.cz vs. Google)*   **Slepé místo: Ignorování specifik Seznam.cz.** Malé české firmy a starší živnostníci stále aktivně používají Seznam.cz (často jako výchozí domovskou stránku). SeznamBot je technologicky jednodušší než Googlebot, hůře renderuje JavaScript a silně preferuje čistou sémantiku a přímé odkazy.
    *   *Řešení:* [BaseLayout.astro](file:///C:/Programov%C3%A1n%C3%AD/Codex/src/layouts/BaseLayout.astro) musí striktně generovat čisté HTML (což Astro nativně dělá) a klíčové je provázat web s profilem na *Firmy.cz*, o
odkud Seznam čerpá nejsilnější lokální autoritu.
*   **Příležitost: Defenzivní srovnávací SEO.** Místo drahých klíčových slov typu „tvorba webu“ cílit na lidi, kteří už mají problém s existujícím řešením. Vytvořit cílené mikro-stránky pro long-tail dotazy:
    *   `/srovnani/wordpress-vs-staticky-web` (pro ty, co nebaví neustálé aktualizace pluginů a bezpečnostní záplaty).
    *   `/srovnani/webnode-vs-reseni-na-miru` (pro ty, co narážejí na limity krabicových řešení).

### D. Riziko solo kapacity (Messaging pro 1 člověka)

*   **Riziko: Strach ze „single point of failure“ (nemoc, přetížení).** Pokud klient vidí, že vše dělá jeden člověk, bojí se, zda projekt dokončí včas.
*   **Příležitost: Přiznaná exkluzivita a transparentní fronta.** Nehrát si na agenturu. Otočit solo kapacitu jako výhodu:
    *   Zavést na webu transparentní stav kapacity: *„Aktuálněpracuji na jednom projektu. Přijímám rezervace na termíny od [Datum].“*
    *   Deklarovat otevřeně: *„Komunikujete přímo s autorem kódu, ne s projekťákem. Dělám maximálně jeden velký web naráz, abych se mu mohl věnovat na 100 %.“*
*   **Technická nezávislost (Handoff bez zámku):** Explicitně v textu uvést, že web je postaven na standardních moderních technologiích bez proprietárního CMS. *„Pokud zítra skončím, předám vám čistý kód v Astro/Reactu n
na vašem vlastním Cloudflare účtu. Jakýkoliv jiný vývojářmůže okamžitě pokračovat. Nejste na mně závislí.“*

### E. Ceník a psychologie cenotvorby

*   **Slepé místo: Chybějící kotvení „celkových nákladů na vlastnictví“ (TCO).** Konzervativní klient vidí cenu za vývoj (např. 40 000 Kč) jako vysokou ve srovnání s Webnode za pár stovek měsíčně.
    *   *Řešení:* Vytvořit kalkulačku nebo tabulku porovnávající celkové náklady za 3 roky. Ukázat, že Astro web běžící na Cloudflare Pages/Workers má **provozní náklady 0 Kč měsíčně** (vejde se do Free tieru), zatímco W
WordPress s hostingem a placenou správou stojí 1 000–2 000 Kč měsíčně. V horizontu 3 let je statický web levnější.
*   **Riziko u produktu „Audit webu s plánem“:** Audit se špatně prodává, protože klient se bojí, že dostane 30stránkové PDF plné technického žargonu, kterému nerozumí.
    *   *Řešení:* Přejmenovat / prezentovat jako *„Vstupní analýza s plánem oprav“* s garancí: *„Pokud v analýze nenajdu alespoň 3 konkrétní chyby zpomalující váš web nebo snižující konverze, neplatíte nic. Pokud se rozh
hodnete pro redesign u mě, cena analýzy se odečte z ceny projektu.“*

### F. Slepá místa governance (Řízeníprocesu)

*   **Riziko zacyklení na straně klienta:** Systém `design-lock` a `bounded waves` popsaný v [work-log.md](file:///C:/Programov%C3%A1n%C3%AD/Codex/docs/projects/radeq/work-log.md) skvěle chrání vývojáře před zacyklením. 
 Nechrání však před situací, kdy klient (owner) nedodá podklady (fotku, texty) a vývoj se zastaví.
    *   *Řešení:* Zavést pravidlo „Default Placeholder Lock“ v governance. Pokud chybí finální asset, automaticky se nasadí sémantická textová náhrada nebo SVG placeholder, aby bylo možné vlnu uzavřít, otestovat a posuno
out se na další build.
*   **Definice „Hotovo“ (Done) pro redesign:** Chybí jasná akceptační brána pro finální nasazení. Doporučuji definovat jako:
    1. Všechny core cesty (`/`, `/kontakt`, `/sluzby`, `/portfolio`, `/soukromi`) dosahují v Lighthouse skóre výkonu >95 na mobilu.
    2. Úspěšný e2e test odeslání leadu v Playwright v produkčním režimu.
    3. Vyřešené a otestované SPF/DKIM záznamy pro odesílací doménu.

### G. Ostatní (i18n, antispam, doručitelnost)

*   **i18n (/en/) paradox:** Pro solo dodavatele cílícího na konzervativní české ŽL a malé firmy je anglická verze webu v první fázi zbytečnou zátěží. Zdvojnásobuje údržbu obsahu, testování layoutu a tříští SEO.
    *   *Doporučení:* Anglickou mutaci `/en/` zcela odložit nebo nahradit jedinou statickou jednostránkovou vizitkou (např. odkazující na LinkedIn), a uvolněnou kapacitu věnovat raději detailnějšímu popisu českých ukázko
ových projektů.
*   **Antispam bez otravné Captchy:** Použití Turnstile nebo reCAPTCHA ničí UX a u starších uživatelů vyvolává frustraci.
    *   *Řešení:* Využít kombinaci existujícího honeypotu s **Time-on-Page kryptografickým tokenem**. V [ContactTerminal.tsx](file:///C:/Programov%C3%A1n%C3%AD/Codex/src/components/ContactTerminal.tsx) vyhodnotit čas od 
 vykreslení formuláře do jeho odeslání (pokud je pod 3 sekundy, jde o bota). Turnstile zapojit jako fail-safe pouze v případě, že selže pasivní ochrana.
*   **Doručitelnost leadů (SPF/DKIM/DMARC konflikt):** Lead API odesílá notifikace na `poptavky@radeq.cz`. Pokud je odesílatelem také `poptavky@radeq.cz` (nebo jiná adresa na stejné doméně odesílaná z Cloudflare Workeru)
), ale MX záznamy ukazují na Fastmail (jak je locked v [rules.yaml](file:///C:/Programov%C3%A1n%C3%AD/Codex/docs/projects/radeq/decision-mesh/rules.yaml#L111-L117)), poštovní servery příjemce zprávu zahodí jako spoofing. 
    *   *Řešení:* SPF záznam domény `radeq.cz` musí explicitně obsahovat jak Fastmail, tak Cloudflare odesílací IP rozsahy: `v=spf1 include:outbound.mailhostbox.com include:spf.messagingengine.com include:cloudflare.net 
 -all`.

---

### Shrnutí práce v tomto kroku
1. Analyzoval jsem projektovou architekturu [architecture.md](file:///C:/Programov%C3%A1n%C3%AD/Codex/docs/projects/radeq/architecture.md), pravidla rozhodovací sítě [rules.yaml](file:///C:/Programov%C3%A1n%C3%AD/Codex/d
docs/projects/radeq/decision-mesh/rules.yaml) a historii vývoje v [work-log.md](file:///C:/Programov%C3%A1n%C3%AD/Codex/docs/projects/radeq/work-log.md).
2. Připravil jsem konkrétní strategické a technické podněty (GDPR-safe serverová analytika, proces jako produkt, Seznam.cz SEO specifika, redukce solo-rizika skrz otevřenost, TCO cenové kotvení a kritické nastavení SPF p
pro doručitelnost leadů).
3. Podněty jsou připravené k zapracování do strategického plánu nebo přímo do kódu v dalších vlnách redesignu.