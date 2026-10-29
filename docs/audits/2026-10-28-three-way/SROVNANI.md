# RadeQ — místní práce, GitHub a radeq.cz

Stav zachycený 28. 10. 2026. Audit je uzavřen s omezením AGY podle pokynu vlastníka. Tři nezávislé recenze Codex jsou dokončené; nelze tvrdit shodu šesti modelů. Zdrojový web, GitHub ani produkce nebyly tímto auditem upraveny nebo publikovány.

Místní verze nabízí nejucelenější anglické ukázky a klidnější vstupní stránku. GitHub Pages zveřejňuje starší minimalistickou variantu. Skutečná doména radeq.cz provozuje jinou, rozsáhlejší prezentaci s potvrzenými nedostatky anglické lokalizace a mobilního přepínání jazyka. Rozdíl verzí sám o sobě není chyba. Před vydáním je třeba vyřešit několik místních detailů a jednoznačný postup publikace.

## Co přesně jsme porovnali

| Povrch | Identita a vzhled | Anglické ukázky |
|---|---|---|
| Místní `app/`, náhled `127.0.0.1:4394/radeq/` | Snapshot bez původní Git historie; manifest `build-1793195077266`. Minimalistický design V3/Stopa, pět převzatých změn a nová lokalizace. | EN galerie, čtyři celé ukázky i tři miniatury. Všech 22 kontrolovaných URL odpovědělo 200. |
| [GitHub Pages](https://sirradek.github.io/radeq/) | Publikační větev `codex/radeq-clean-pages-20261013`, SHA `d862c63a3bfdf99fc37409a5d7b499f4affd32b4`. Starší minimalistický web. | EN galerie existuje, miniatury a detaily jsou české s výslovným upozorněním. Čtyři přímé EN detailní adresy vracejí 404. |
| [radeq.cz](https://radeq.cz/) | Rozsáhlejší web s diagnostickým karuselem, kartami služeb a delšími texty. Aktuální nasazený commit neznáme. | EN navigace Examples vede do české galerie. EN galerie a čtyři EN detailní adresy vracejí 404. |

GitHub má navíc odlišnou **výchozí větev `new`** na SHA `827388a33555db811251a6a8190af7997a916129`; ta není totožná s aktuální publikací Pages. Deployment Pages `7363829524` uvádí publikační SHA, stav success a čas `2026-10-27T16:13:30Z`; [běh workflow](https://github.com/SirRadek/radeq/actions/runs/40538735313). Vrácené CZ a EN homepage se bajtově shodují s připnutým `site/` této publikace. Takto byly ověřeny dvě homepage, nikoli všechny veřejné soubory. Podrobnosti: [Sol](sol-deployment.md), [provenance](github/provenance.json), [HTTP matice](http/matrix.json).

## Potvrzené vady

### 1. P2 — Anglický karusel radeq.cz obsahuje české popisky

Na [anglickém úvodu](https://radeq.cz/en/#co-resim) zůstává `DOPAD NA PROVOZ: KRITICKÝ` a počítadlo `1 z 21`. Po kliknutí na Next problem se změní anglický nadpis a obsah panelu, ale český dopad a `2 z 21` zůstanou. Jde o aktuálně reprodukovanou částečnou lokalizaci produkce, nikoli o vadu nové místní minimalistické stránky, která tento karusel nemá.

Dopad: anglický návštěvník nerozumí hodnocení závažnosti a web působí nedokončeně. Nejmenší oprava: lokalizovat popisek, hodnoty závažnosti i spojku počítadla ve všech stavech karuselu. Jistota vysoká. Důkaz: [první panel](browser/live-en-problem-panel.png), [další panel](browser/live-en-problem-next.png), odpovídající JSON.

### 2. P2 — Na mobilním radeq.cz chybí dostupný přepínač jazyka

Při šířce 390 px na [radeq.cz/en/](https://radeq.cz/en/) byl otevřen Menu. Zobrazuje sedm navigačních cest, ale žádné CZ. Odkaz CZ v DOM existuje s `href="/"`, avšak má `display:none` a není viditelný ani po otevření menu. Samotná existence odkazu v HTML proto není důkaz dostupnosti ovládání.

Dopad: mobilní návštěvník nemá v této navigaci cestu do druhého jazyka. Nejmenší oprava: přidat jazykovou volbu do otevřeného mobilního menu nebo ji zachovat mimo něj; ověřit oba směry. Jistota vysoká pro ověřený EN→CZ stav; druhý směr nebyl interakčně ověřen. Důkaz: [otevřené menu](browser/live-en-mobile-menu.png), [viditelnost odkazu](browser/live-en-mobile-language-proof.json). Místní a Pages mobilní úvody jazykovou volbu zobrazují.

### 3. P3 — Místní miniatura instalatéra překrývá poslední řádek titulku

Na místní EN stránce služeb zasahuje modré `Send an enquiry` do `at home?`. Odkaz zůstává funkčně dostupný, samotná plná ukázka má nadpis čitelný. Vada se týká malého ilustračního náhledu.

Důkaz: [místní služby](browser/local-en-services.png), `app/src/components/ServiceStories.astro:55–58`, `app/src/styles/service-stories.css:70–73`. Nejmenší oprava: upravit výřez nebo polohu akčního pruhu, pak ověřit desktop, mobil a fáze animace. Jistota vysoká pro zachycený desktopový stav. Terra nález označila za P3; Luna jej zaznamenala, ale nepovažovala za samostatnou funkční vadu. Syntéza jej přijímá jako vizuální drobnost, nikoli chybu fungování dema.

### 4. P3 — Sekundární EN stránky nemají jazyková metadata dvojic

Služby, Kontakt a Soukromí mají `lang="en"` a vlastní canonical, ale chybí `rel="alternate" hreflang` k existujícím českým protějškům. Zdrojová místa: `app/src/pages/en/sluzby/index.astro:55`, `en/kontakt/index.astro:25`, `en/soukromi/index.astro:24`. `RqLayout.astro:12–14,39–44` tuto možnost podporuje. Nález je doložen zdroji a uloženým HTML; nevytváří chybnou navigaci.

Nejmenší oprava: doplnit párové props a ověřit vzájemné značky v CZ i EN. Jistota vysoká pro absenci značek, velikost SEO dopadu neměřena. Úmyslné `noindex,nofollow` místního subpath náhledu a Pages je správně; tento nález je relevantní především pro budoucí produkční výstup. Detail: [Luna](luna-details.md).

## Rozdíly verzí a rozhodnutí před publikací

**P2 — Anglické ukázky jsou hotové místně, veřejně zatím chybějí.** Na radeq.cz vede EN Examples do českého obsahu; očekávané EN cíle jsou 404. Pages na český obsah upozorňuje a používá existující CZ cíle, takže nejde o rozbité současné odkazy Pages. Při budoucím vydání je třeba zveřejnit routy, klientské soubory a obrázky najednou a až potom měnit veřejné odkazy. Bez takového vydání zůstane veřejný web v češtině. Zdroj: HTTP matice a všechny tři recenze Codex.

**P2 — Návrh certifikátů je dosud rozhodnutí vlastníka.** Místní `MinimalHomePage.astro:80–84` otevřeně uvádí `Placement preview`, že doklady nejsou doplněny, a návrh prostoru pro 3–8 certifikátů. Není to falešné tvrzení o kvalifikaci. Před zveřejněním je ale třeba doplnit skutečné doklady nebo tento návrh skrýt; interní instrukce nepatří do hotové prezentace. Důkaz: [otevřená sekce](browser/local-en-certificates.png). Tato položka není nynější vadou radeq.cz.

**P1 pro příští release — Dvě odlišné publikační cesty mohou změnit Pages.** Výchozí větev `new` obsahuje [deploy.yml](https://github.com/SirRadek/radeq/blob/827388a33555db811251a6a8190af7997a916129/.github/workflows/deploy.yml#L3), spouštěný push nebo ručně, a deployuje do stejného `github-pages` prostředí, přestože používá jiný starší zdroj. Pozorovaný poslední deployment je správný publikační snapshot; žádný rollback jsme nezjistili. Možnost samovolného spuštění závisí také na neověřených ochranách prostředí. Před dalším vydáním zvolit jednu autoritativní cestu a starší cestu odstranit nebo omezit. Vysoká jistota v odlišnosti kódu, střední v možnosti běhu bez dalšího zásahu. Solův P1 je budoucí riziko publikace, nikoli důkaz současného kritického výpadku webu.

**P2 pro příští release — Samotný push zdrojů nezaručí nový web.** Publikační [clean-pages.yml:21–29](https://github.com/SirRadek/radeq/blob/d862c63a3bfdf99fc37409a5d7b499f4affd32b4/.github/workflows/clean-pages.yml#L21) nahrává uložené `site/`; neprovádí build, testy ani kontrolu vazby na manifest. Nový místní ověřený výstup leží jinde. Při příštím schváleném vydání je nutné převést schválený artefakt a ověřit hashe nebo zavést jednotný build/test/upload. Není prokázán vnitřní nesoulad zdrojů a `site/` ve starém připnutém snapshotu, protože jsme jej znovu nesestavovali. Důkaz: Solova recenze a workflow.

## Vizuál a texty: co zachovat

Místní i Pages úvod mají klidnou krémovo-vínovou paletu, jasnou hierarchii, cenu a hlavní CTA viditelné v prvním zachyceném desktopovém i mobilním výřezu. Na radeq.cz dominuje širší navigace, dlouhé vysvětlování a velký volný prostor v úvodu; hlavní CTA v zachyceném prvním výřezu 1280×900 ani 390×844 není. To je rozdíl použitelnosti a návrhový kompromis, nikoli prokázaná nefunkčnost tlačítka. Místní varianta lépe podporuje rychlou orientaci; produkce poskytuje více diagnostického kontextu. Bez měření nelze tvrdit vyšší konverze nebo rychlost načítání.

Příklady u místních služeb mají jasný kontext a skutečně anglické miniatury. Modelová data jsou označena, rezervace odlišuje výběr od potvrzení a dílna ukazuje vazbu dokončení práce na spotřebu. Plné ukázky mají odlišné oborové styly: modrý instalatér, jemná fyzioterapie, tmavá dílna a teplá pražírna. To podporuje demonstraci šíře práce; není důvod je mechanicky sjednocovat s hlavní vínovou stránkou.

Hlavní pracovník navíc v tomto auditu otevřel a osobně vizuálně prohlédl úvodní obrazovky všech čtyř místních EN ukázek: [instalatér](browser/local-en-plumber-demo.png), [rezervace](browser/local-en-booking-demo.png), [dílna](browser/local-en-workshop-demo.png), [pražírna](browser/local-en-coffee-demo.png). Anglické nadpisy a ovládání jsou v těchto stavech konzistentní, horizontální overflow je 0 a konzole nehlásila chyby. Toto není nový průchod všemi dynamickými stavy. Předchozí Windows ověření toků je samostatně doloženo v `docs/verification/2026-10-28-english-showcases.md`.

Také živá česká ukázka instalatéra je zcela jiná: dlouhá modelová stránka s nabídkou služeb a kontakty namísto místního stručného interaktivního postupu. Důkaz: [radeq.cz](browser/live-cs-plumber-demo.png), [Pages](browser/pages-cs-plumber-demo.png), [místní EN](browser/local-en-plumber-demo.png). Jde o různé návrhy a obsah, ne pouze přeložené kopie stejné publikace.

## Které modely skutečně dodaly recenzi

| Požadavek | Skutečný běh | Výsledek a důvěryhodnost |
|---|---|---|
| 6.1 Sol medium | `gpt-6.1-sol`, medium | Dokončená samostatná recenze původu nasazení, workflow a rozdílů zdrojů. [Zpráva](sol-deployment.md). |
| 6.1 Terra high | `gpt-6.1-terra`, high | Dokončená samostatná vizuální recenze uložených screenshotů, poté jeden cílený dodatek veřejných mobilů. [Zpráva](terra-visual.md). |
| 6 Luna high | `gpt-6-luna`, high | Dokončená samostatná recenze textů, tras a metadat. [Zpráva](luna-details.md). |
| Gemini 3.8 high přes AGY | CLI nabízelo `gemini-3.8-flash-high`, spuštěn tento přesný identifikátor | Vrátilo shrnutí předání a po jedné opravě rozsahu i srovnání. To však nadále čerpá hlavně historické podklady, místy směšuje místní a publikovanou verzi a předkládá stará měření jako ověření. Přijato pouze jako doplňkový názor s kontrolou jednotlivých tvrzení. [Surový text](agy/gemini-corrected-raw.response.md). |
| Sonnet Thinking přes AGY | `claude-sonnet-4-6`, CLI jej označuje Claude Sonnet 4.6 (Thinking) | Po blokaci příkazových nástrojů individuální kvóta vyčerpána. Srovnávací zpráva nevznikla. [Terminálový důkaz](agy/sonnet-interactive-terminal.json). |
| Opus Thinking přes AGY | `claude-opus-4-6-thinking` | Vznikla recenze předávacích podkladů, nikoli požadované aktuální srovnání. Cílené dokončení skončilo kvótou 429 RESOURCE_EXHAUSTED. [Výsledek](agy/opus-corrected-raw.log). |

AGY `status: SUCCESS` označuje dokončení volání, nikoli splnění auditu. První headless pokusy žádaly nepovolený RunCommand a neposkytly zprávu. Další běhy překročily zamýšlený rozsah čtení a nepřinesly požadovanou samostatnost; Opus v textu uvádí i výzkumného subagenta přes zákaz dalšího delegování. Nejsou proto započítány jako plnohodnotné nezávislé revize. Kvótu nebylo možné vyřešit změnou oprávnění a nebyl použit jiný model, placené API nebo jiný účet. Vlastník zvolil uzavření s omezením.

Z odpovědi Gemini **nepřebíráme jako nové výsledky** shodu 94 veřejných souborů, konkrétní velikosti HTML, kontroly 40 URL/228 odkazů, nové klávesnicové testy ani ověřené reduced-motion. Odkazují na historické předání a překračují nynější důkaz. Shoda dvou homepage je nově doložena Solem; problém jazyka a mobilního menu nově ověřil hlavní pracovník. Počet script tagů či velikost HTML by samy o sobě stejně neprokazovaly rychlost načítání.

## Rozsah ověření a mezery

Aktuální audit zahrnuje 66 HTTP zachycení, metadata, připnuté archivy dvou větví, veřejné deployment záznamy a uložené prohlížečové PNG/JSON pro CZ/EN desktop a mobil, služby, galerii a reprezentativní ukázky. Nové interakční ověření provedl hlavní pracovník u produkčního menu a karuselu. Native recenzenti pracovali se sdílenými důkazy a zdroji; Terra osobně četla obrázky, neovládala browser. Neslibujeme šest samostatných průchodů prohlížečem.

Předchozí kontrola této místní implementace: 120 unit a 24 compiled testů prošlo, oba buildy po 42 stránkách, Astro 79 souborů bez chyb a varování se šesti hints. Kvůli čtecímu auditu nebyly opakovány. Po auditu je znovu porovnána identita zdrojů a subpath artefaktů proti přijatému manifestu; skutečný výsledek a počty jsou v [completion-receipt.json](completion-receipt.json).

Neověřeno: odesílání formulářů a backend, dostupnost kontaktů, výkon/CWV, nativní zoom 200 %, runtime reduced-motion, všechny mobilní stavy všech dem, ochrany GitHub prostředí a přesný commit produkce radeq.cz. Obfuskované záznamy produkční konzole samy neprokazují rozbitou funkci. Záznamy mají čas a URL, ale živý web se může později změnit.

## Doporučené pořadí případné další práce

1. Místně opravit drobný překryv miniatury, doplnit jazyková metadata a rozhodnout o certifikátech.
2. Před dalším vydáním sjednotit autoritativní release cestu a prokázat, které ověřené soubory se mají publikovat. Zachovat schválený minimalistický směr.
3. Novou anglickou sadu vydat vcelku až v samostatně autorizovaném rozsahu. Pro radeq.cz výslovně rozhodnout, zda má přijmout nový design, nebo se má dále udržovat současná prezentace.
4. Pokud zůstane současný web radeq.cz, opravit jeho české zbytky v EN karuselu a jazykové přepínání na mobilu.

Žádná z těchto oprav ani publikace není v tomto auditu provedena. Výstup je porovnání s konkrétními podklady pro další rozhodnutí.
