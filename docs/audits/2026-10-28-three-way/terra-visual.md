# Nezávislé vizuální review — Terra

Model/effort: zadáno gpt-6.1-terra / high; samostatný runtime údaj zde nemám. Záběry připravil hlavní pracovník, já je osobně prohlédl přes view_image; neovládal jsem prohlížeč. Šlo o vizuální a cílené zdrojové review, nikoli nové interakční testování.

## Zjištění

**P2 — Veřejné GitHub Pages mají v angličtině český obsah ukázek (známý rozdíl verzí, vysoká jistota).** Na `https://sirradek.github.io/radeq/en/#sluzby` snímky `browser/pages-en-services.png` a `browser/pages-en-services-lower.png` ukazují „Co doma zlobí?“, „Vybráno“ a „ZABROUSIT HRANY“, zatímco okolní rozhraní je anglické. Stránka výslovně uvádí, že interaktivní příklady jsou česky, což zabraňuje překvapení, ale anglický návštěvník nemůže ukázky přirozeně projít. Připnutý publikovaný zdroj `github/radeq-d862c63a3bfdf99fc37409a5d7b499f4affd32b4/src/components/ServiceStories.astro:37,53,63` volí české cesty/obrázky a upozornění. Lokální `browser/local-en-services.png` a `local-en-services-lower.png` již zobrazují anglické tři miniatury; volba obrázků a jazykové cesty je v `app/src/components/ServiceStories.astro:37–38,52–54`. Vhodný další krok je ponechat lokalizaci v místním stavu a při případném samostatně schváleném vydání ověřit, že se dostane i do publikovaného artefaktu. Toto není závada lokální implementace ani oprávnění k publikaci.

**P3 — Akční vrstva překrývá nadpis anglické miniatury instalatéra (lokálně, vysoká jistota vizuálního pozorování).** V `browser/local-en-services.png` modrý pruh „Send an enquiry“ zasahuje do spodního řádku „at home?“ obrázku. Funkční odkaz a okolní označení zůstávají viditelné; problém je v kvalitě malého náhledu, ne v prokázané chybě samotného dema. Překryv vytváří `app/src/components/ServiceStories.astro:55–58` a trvale umístěná `.demo-action` v `app/src/styles/service-stories.css:70–73`. Zvážit jiný výřez/polohu pruhu, aby zůstala celá věta čitelná, a ověřit desktop i mobil a fáze animace. Rozsah v jiných stavech nebyl tímto záběrem ověřen.

**P2 — Rozhodnutí o důvěryhodnosti před vydáním: návrhové certifikáty (lokálně, vysoká jistota).** `browser/local-en-certificates.png` ukazuje otevřený blok „Learning and certificates“, viditelně označený „Placement preview“ a vysvětlující, že doklady zatím nejsou doplněné; žádné konkrétní ocenění si nevymýšlí. Je to výslovně dosud neschválený návrh, ne falešné tvrzení ani současná produkční závada. Při vydání by ale interní plán „Space for 3–8 certificates“ působil jako nedokončený obsah v části budující důvěru. `app/src/components/MinimalHomePage.astro:80–84`; před případnou publikací rozhodnout o skrytí či vyplnění skutečnými ověřenými doklady podle vlastníka.

P1: V prohlédnutých záběrech jsem neprokázal závažné vizuální selhání.

## Co funguje a vědomé kompromisy

Lokální CZ/EN a GitHub Pages desktop mají konzistentní krémovo-vínovou paletu, dobře čitelnou hierarchii, dostatečně nápadné hlavní CTA a cenu; struktura vedlejších cest vysvětluje nabídku bez dalších karet (`local-cs-desktop.png`, `pages-cs-desktop.png`, `local-en-desktop.png`, `pages-en-desktop.png`). EN lokální služba a tři miniatury jsou v pozorovaných záběrech anglicky, výslovně označené jako modelové; cesta k poptávce končí jejím doručením (`ServiceStories.astro:14–15,61–64`). Rezervační miniatura viditelně říká „Selected“, ne že nastalo potvrzení (`local-en-services-lower.png`).

Na lokálních snímcích 390 px (`local-cs-mobile.png`, `local-en-mobile.png`) jsou texty úvodu, navigace, hlavní akce i odkaz na placený audit viditelné a bez pozorovaného horizontálního ořezu. To samo nedokazuje přístupnost při zoomu ani kvalitu celého mobilního webu. Galerie `local-en-gallery.png` má výrazný nadpis, srozumitelně uvádí fiktivní údaje a odděluje ukázky od klientských referencí. Velký nadpis a rozestupy vedou k tomu, že na prvním desktopovém záběru jsou vidět jen první dva příběhy: je to návrhový kompromis skenovatelnosti vůči expresivní typografii, nikoli chyba.

Skutečná `https://radeq.cz/` je zobrazením a strukturou jiná prezentace: snímky `live-cs-desktop.png`, `live-en-desktop.png` a `live-cs-services.png` ukazují rozsáhlejší navigaci, jiné logo/měřítko a služby v kartách. Nabízí širší obsah rychleji, ale desktopový blok služeb má velkou prázdnou kartu a je hustší; místní verze je klidnější a její postupy propojují službu s konkrétním modelem. Jde o designové hodnocení, nikoli důkaz chybné produkce nebo identity deploymentu. Zákazník přecházející mezi doménami se může setkat s odlišnou nabídkovou prezentací a navigací; sjednocení případně patří k vědomému rozhodnutí vlastníka, ne k tomuto review.

## Meze

Zkoumal jsem uvedené uložené desktopové a lokální mobilní snímky a cílené zdroje, nikoli kompletní živé interakce, demo průchody, mobilní průchody Pages/produkce, klávesnici, zoom či backend. Tři EN miniatury jsem viděl, samotné čtyři EN demo obrazovky tím nejsou vizuálně ověřené. Nezjištěné problémy tedy nelze vyloučit. Porovnání ponechává rozhodnutí o publikaci a náhledu certifikátů vlastníkovi.

## Cílený dodatek — veřejné mobilní úvody

Osobně jsem prohlédl také `browser/pages-cs-mobile.png`, `pages-en-mobile.png`, `live-cs-mobile.png` a `live-en-mobile.png` při 390 px. Pages i místní úvod ukazují čitelnou navigaci a primární CTA bez zjevného horizontálního ořezu. Na Pages je placený audit až za vysvětlením „Kde můžeme začít?“, zatímco místní verze jej přesouvá přímo pod hlavní akce; na pořízených záběrech se ale vejde do výřezu obou veřejných jazyků. To je pozorovaný rozdíl v pořadí, nikoli samostatně prokázaná závada.

Na skutečné doméně se oba mobilní úvody zobrazují s kompaktním menu, dlouhým volným prostorem pod popisem a bez hlavního CTA v zachyceném prvním výřezu. Návštěvník musí za akcí níž; jde o vizuální kompromis starší prezentace. Tyto statické snímky neprokazují obsah otevřeného menu ani dostupnost jazykového přepínače po jeho otevření; to vyžaduje samostatné interakční ověření. Nehodnotím podle nich celé mobilní stránky ani fungování navigace.
