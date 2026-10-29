# Detailní nezávislý audit — Luna

**Model / úsilí:** gpt-6-luna, high (dle zadání).  
**Rozsah:** texty a jazykové přepínače, anglické ukázky a jejich návratové odkazy, routy sekundárních stránek, canonical/hreflang/robots. Kontroloval jsem aktivní `app/`, připnuté GitHub Pages HTTP/HTML zachycení a produkční `radeq.cz` HTTP/HTML zachycení z 28. 10. 2026. Nečetl jsem ostatní reviewerské zprávy ani nepoužíval prohlížeč. Zdrojové soubory jsem neměnil; tento soubor je moje zpráva.

## Zjištění

### P2 — Anglická stránka v produkci nevede do anglické galerie a cílová anglická sada zatím na radeq.cz chybí

**Povrch:** veřejná produkce `radeq.cz`; lokalizované cíle existují v místním zdrojovém buildu, ale nejsou všechny veřejně dostupné.  
**Důkaz:** anglický úvod `https://radeq.cz/en/` má odkaz `Examples` s cílem `/ukazky/`, takže návštěvníka přepne na českou galerii. HTTP matice z 28. 10. 2026 vrací `200` pro `https://radeq.cz/ukazky/`, ale `404` pro `/en/ukazky/` a také pro všechny čtyři anglické detaily: `/en/ukazky/instalater/`, `/en/ukazky/sluzba/`, `/en/ukazky/provozni-terminal/`, `/en/ukazky/eshop/`. Zachycený produkční `/en/sluzby/` také odkazuje na `/ukazky/`. Naproti tomu místní buildu vrací `200` na `/radeq/en/ukazky/` a všechny čtyři podstránky. GitHub Pages zachycení má index `/en/ukazky/` jako `200`, ale všechny čtyři EN detailní routy jako `404`.

**Dopad:** anglicky mluvící návštěvník na aktuálním webu nedostane anglické příklady. Na produkci je přepnut na českou galerii; přímé otevření očekávané anglické cesty skončí 404. Tato část místního zdroje je funkční, jde tedy o rozdíl mezi lokálním záměrem a veřejným stavem, ne o chybu tras v `app/`.

**Nejmenší náprava:** před změnou produkčního odkazu zpřístupnit celou anglickou sadu tras včetně čtyř detailů. Pokud se jejich publikace odkládá, ponechat v produkční anglické navigaci odkaz na dostupný cíl nebo odkaz na příklady dočasně skrýt. Jde o doporučení pro rozhodnutí o vydání, nikoli o žádost o deploy.

**Jistota:** vysoká pro HTTP stavy a cíle; stavy jsou snímek z uvedeného data. Neodvozuji z podobnosti obsahu, která revize byla nasazena.

### P3 — Anglické stránky Služby, Kontakt a Soukromí nemají hreflang vazbu na české protějšky

**Povrch:** místní zdrojový výstup, zachycené GitHub Pages i produkční `/en/sluzby/`.  
**Důkaz:** EN HTML u těchto stránek má vlastní canonical a `<html lang="en">`, ale nemá žádný `rel="alternate" hreflang`. Stejné chybění je v zachycených EN routách pro Kontakt a Soukromí. České protějšky existují (`/sluzby/`, `/kontakt/`, `/soukromi/`) a viditelné jazykové přepínače už mezi dvojicemi navigují. V `app/src/pages/en/sluzby/index.astro:55`, `app/src/pages/en/kontakt/index.astro:25` a `app/src/pages/en/soukromi/index.astro:24` volání `RqLayout` nedodává lokalizované cesty. Rozvržení už tuto možnost podporuje v `app/src/layouts/RqLayout.astro:12-14,39-44`; podobné propojení má EN homepage, audit i galerie.

**Dopad:** vyhledávačům chybí výslovné propojení ekvivalentních jazykových verzí těchto tří podstránek. Viditelné přepínání jazyka, `lang` a canonical jsou v pořádku, takže nejde o zablokování stránky ani o chybný canonical; dopad je omezený na jazykové cílení/indexační signály.

**Nejmenší náprava:** doplnit u každé z těchto EN stránek `canonicalPath`, `alternatePath` a odpovídající `alternateLang` a zkontrolovat reciproční značky v českém protějšku.  
**Jistota:** vysoká pro chybějící značky a existenci párů; nízká až střední pro velikost SEO dopadu.

## Ověření tras, textů a metadat

- V zachycené lokální matici všech 4 českých demo-detailů i jejich 4 EN protějšků odpovídá HTTP stav `200`. Galerijní odkazy v `app/src/components/MinimalGallery.astro:5-10` sestavují český či `/en/` prefix konzistentně. Zpětné odkazy z demo detailů cílí na `#sluzba-web`, `#sluzba-terminy` nebo `#sluzba-data`; tyto identifikátory odpovídají článkům v `ServiceStories.astro`. Tlačítka přepnutí jazyka vedou na existující protějšek. Nezaznamenal jsem chybný lokální cíl ani neexistující anchor v této sadě.
- Rychlá kontrola všech statických `t("…")` klíčů ve showcase/theme souborech proti slovníku v `app/src/components/themed-demos/demo-i18n.mjs` našla jediný klíč bez překladu: `espresso`. Jde o běžné anglické slovo shodné s českým názvem, takže se neprojeví jako český text. Kontrola zachyceného EN rozhraní hlavní stránky a galerie našla jako text s českou diakritikou pouze vlastní jméno „Radek Široký“. Nezjistil jsem návrat českého UI textu při dostupných statických textech; dynamické interakční stavy jsem nespouštěl.
- Anglická galerie má popis, že jde o fiktivní data, nikoli klientské reference (`app/src/components/MinimalGallery.astro:14-15`). Demo dokumenty explicitně označují data jako fiktivní a jejich `robots` pravidlo `noindex,nofollow` je přítomné v `DemoThemeDocument.astro:8` a `CoffeeDemoDocument.astro:12`. To je v souladu s požadavkem na noindex demo stránek, nikoli únik noindex na hlavní lokalizované stránky.
- Hlavní česká/anglická stránka a česká/anglická galerie mají správné self-canonical, vzájemné `hreflang` i `x-default` na český protějšek. Produkční homepage je při HTTP záběru `robots.txt` povolena; zachycený soubor obsahuje `Allow: /`. V dostupných stabilních stránkách jsem nenašel canonical směřující na jinou locale nebo omylem nasazený `noindex`.
- Obrazové podklady jsem prohlédl u místního EN přehledu služeb a galerie na desktopu. Galerijní text a hierarchie působí uceleně; v miniatuře instalatéra překrývá spodní část titulku modré tlačítko, ale jde o ilustrační screenshot a z jediného desktopového záběru to nepovažuji za samostatnou vadu. Nevytvářel jsem nový viewport ani interakční relaci.

## Co zachovat

Lokalizační práce v `app/` je v porovnaných statických stavech konzistentní: EN galerie i čtyři anglické demo stránky používají anglické nadpisy, ovládací text, popisy, stavy a přesné částky v CZK. Sdělení „nic se neodesílá“ / „nothing is sent“ je přítomné v modelech i v jejich společném dokumentu. Příklady se správně nepředstírají jako klientské reference. Demo stránky zůstávají `noindex,nofollow`, zatímco hlavní a galerijní stránky mají indexační metadata.

## Závěr a omezení

Pro lokální zdroj jsem nenašel závažnou překladovou chybu ani chybnou trasu. Nejvýraznější nesoulad je aktuální veřejná dostupnost: produkční anglická navigace míří do češtiny a očekávané EN demo cíle vracejí 404; vydání těchto nových EN tras by mělo být koordinováno jako celek. Druhý nález je menší SEO vylepšení pro tři sekundární EN stránky. Rozsah nezahrnoval odeslání formulářů, dynamické klikací scénáře, mobilní EN screenshoty ani kontrolu externích CMS/SEO dat. Veřejné HTTP a HTML závěry popisují pouze zachycený stav z 28. 10. 2026.
