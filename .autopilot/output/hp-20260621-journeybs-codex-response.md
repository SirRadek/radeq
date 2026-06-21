## Doporučení

Hero nechat jako **klidný důvěryhodný hook**: větší čitelné labely, token **„Řešení“**, krátký pohyb po křivce, ale bez vysvětlovacích boxů.

Plnou interaktivní cestu dát do samostatné sekce hned pod hero nebo spojit s **„Jak pracuji“**. Tam má být prostor pro texty, checkpointy, mobilní expandy a konkrétní odpovědi na otázky klienta.

Důvod: hero má prodat první dojem, H1 a CTA. Důvěru nevzbudí složitost v prvním viewportu, ale jasný proces, konkrétní výstupy a pocit, že klient ví, co se bude dít.

## A. Hero vs. samostatná sekce

### Hero

Použít jako první signál:

- větší labely: **Váš problém → Rozbor → Návrh → Stavba → Test → Předání → Výsledek**
- token **„Řešení“** jde po křivce
- lime jen na aktivní bod a finální **„Výsledek · ověřeno“**
- žádné dlouhé popisy
- max. jeden krátký podtext typu: **„Postup od problému k ověřenému výsledku.“**

Hero má působit: „má to řád, není to náhodná tvorba webu“.

### Samostatná sekce

Doporučený název:

- **Jak se z problému stane ověřené řešení**
- nebo kratší: **Cesta k výsledku**
- nebo věcně: **Jak pracuji**

Tady má být plná interakce:

- vlevo/nahoře checkpointy
- vpravo/dole detail aktivní fáze
- na mobilu akordeon
- všechno čitelné i bez animace a bez JS

## B. Interakční model

### Doporučený model

Použít kombinaci:

- desktop: hover + focus nad checkpointem zobrazí detail
- mobil: tap/expand přes akordeon
- scroll: pouze jemné zvýraznění průchodu, ne jako jediný způsob čtení
- no-JS: všechny fáze zůstanou viditelné jako statická časová osa

### Token „Řešení“

Doporučení:

- v hero: **krátká CSS animace jednou po načtení**, pak klid
- po zastavení zůstane token u **„Výsledek · ověřeno“**
- žádný nekonečný autoplay loop, ten může působit reklamně a rušit CTA
- při `prefers-reduced-motion`: token staticky u první nebo finální fáze
- v samostatné sekci: token se přesune na aktivní checkpoint podle hoveru, focusu nebo tapu

### Přístupnost

- každý checkpoint jako skutečný `button` nebo `summary`
- focus stav stejně viditelný jako hover
- aktivní fáze: `aria-current="step"` nebo jasný stav v textu
- detailní panel propojit přes `aria-controls`
- bez JS použít `details/summary` nebo statický seznam
- animovat jen `transform` a `opacity`
- žádné informace nesmí být dostupné pouze přes hover

## C. Obsah fází

| Fáze | Text pro detail |
|---|---|
| **Rozbor** | **Co řešíme:** co nefunguje, kdo to používá, kde vzniká ztráta času nebo důvěry. **Délka:** obvykle 1 až 3 pracovní dny podle rozsahu. **Jak probíhá:** krátký hovor, projití současného webu/procesu, dotazy k cíli a omezením. **Co z toho máte:** jasně pojmenovaný problém, priority a návrh dalšího postupu bez mlhy. |
| **Návrh** | **Co řešíme:** co má vzniknout, pro koho, v jakém pořadí a co se naopak dělat nebude. **Délka:** obvykle 2 až 5 pracovních dnů. **Jak probíhá:** připravím strukturu, obsahové bloky, hlavní akce a technické řešení. Probereme rizika a rozsah. **Co z toho máte:** konkrétní plán, odhad pracnosti a méně překvapení během stavby. |
| **Stavba** | **Co řešíme:** samotné vytvoření webu nebo úpravy, obsah, rozhraní, responzivitu a základní technické nastavení. **Délka:** menší úpravy dny, běžný web spíš týdny. **Jak probíhá:** pracuji po částech, průběžně ukazuji hotové kusy a držím se schváleného rozsahu. **Co z toho máte:** viditelný postup a možnost včas zachytit věci, které by později bolely. |
| **Test** | **Co řešíme:** jestli web funguje na mobilu, v prohlížečích, jestli texty dávají smysl a důležité akce jdou dokončit. **Délka:** obvykle 1 až 3 pracovní dny. **Jak probíhá:** kontrola responzivity, rychlosti, formulářů, odkazů, základní přístupnosti a reálných scénářů. **Co z toho máte:** méně chyb po spuštění a jistotu, že výsledek není jen hezký obrázek. |
| **Předání** | **Co řešíme:** spuštění, přístupy, základní zaškolení, provozní informace a co dělat po předání. **Délka:** obvykle 1 pracovní den, u složitějších věcí podle domluvy. **Jak probíhá:** předám přehled, vysvětlím údržbu, sepíšu důležité body a ověřím, že je výsledek použitelný. **Co z toho máte:** víte, co máte, jak s tím zacházet a na koho se obrátit, když bude potřeba úprava. |

## D. Trust prvky navíc

### U každé fáze

Přidat malé věcné štítky:

- **Výstup:** rozbor, návrh, funkční část, testovací protokol, předávací poznámky
- **Vaše role:** dodat podklady, potvrdit směr, vyzkoušet výsledek
- **Moje role:** rozebrat, navrhnout, postavit, otestovat, předat
- **Riziko:** co může práci zdržet

### U celku

Důvěru zvedne konkrétnost:

- **Jeden člověk od rozboru po test:** analytik i tester je stejná osoba, nic se neztratí mezi rolemi
- **Bez skrytého „nějak to dopadne“:** každá fáze má výstup
- **Test před předáním:** výsledek se nekončí stavbou, ale ověřením
- **Předávací poznámky:** klient ví, co bylo uděláno a co zůstává na později
- **Možnost následné podpory:** „Po předání nezmizím. Menší úpravy a provozní dotazy řešíme podle domluvy.“

Vyhnout se slovu „garance“, pokud není přesně definovaná. Lepší je:

- **„Ověřím hlavní scénáře před spuštěním.“**
- **„Předám seznam provedených kontrol.“**
- **„Na známá omezení upozorním předem.“**

## E. Typografie a vizuál

### Labely v hero

- nepoužívat malé mono jako hlavní popisky
- použít běžný sans-serif, střední řez
- velikost desktop zhruba 14 až 16 px
- důležité body 16 až 18 px
- mobil graf klidně skrýt, ale pod hero dát textovou cestu nebo odkaz na sekci
- mono nechat maximálně pro drobné technické štítky typu **„ověřeno“**

### Aktivní checkpoint

- aktivní bod: větší tečka, vyšší kontrast, jemný lime okraj
- aktivní label: tmavší text nebo semibold
- neaktivní labely: čitelné, ne příliš šedé
- lime používat jen pro token, aktivní bod a finální výsledek
- žádné zářící efekty ani neon

### Token „Řešení“

- token jako malý pevný štítek, ne velká kapsle
- text: **Řešení**
- při pohybu jen `transform`
- stín velmi jemný nebo žádný
- na konci se vizuálně spojí s **„Výsledek · ověřeno“**

## F. Co nedělat

- Nedávat plné vysvětlovací karty přímo do hero.
- Nedělat nekonečně běžící animaci tokenu.
- Neschovávat důležité informace jen za hover.
- Nepoužívat moc lime prvků, ztratí význam.
- Nedělat z toho „startupový“ stepper s přehnanými ikonami.
- Nepřidávat 3D, canvas ani těžké knihovny.
- Nevyrábět falešné metriky typu „100% jistota“.
- Nepřehánět délky fází, raději uvést orientační rozsah.
- Nenechat malé mono popisky jako hlavní informační vrstvu.
- Nezvětšit graf tak, že začne konkurovat H1 a CTA.

## Finální směr

Nejsilnější řešení: **hero ukáže cestu, samostatná sekce vysvětlí důvěru**.

Hero má být stručný vizuální důkaz řádu. Sekce pod ním má být konkrétní odpověď na tiché otázky konzervativního klienta: co se bude dít, jak dlouho to může trvat, co mám dodat, co dostanu a jak poznám, že je hotovo.