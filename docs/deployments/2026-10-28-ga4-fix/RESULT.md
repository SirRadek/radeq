# Ověření GA4 — 28. 10. 2026, 18:43 CET

## Výsledek

Spouštění a skutečný přenos GA4 na https://radeq.cz jsou potvrzeny. Chyba v kódu při tomto testu nebyla reprodukována, proto nebyl proveden zbytečný patch ani nové nasazení. Produkční verze zůstává `e566287d-1c83-4202-990c-c8d26a0274ad`.

Vlastník výslovně požádal o jiný způsob ověření po blokaci CUA ovládání Edge kvůli neurčitelné URL. Použit samostatný nainstalovaný Playwright/Chromium s čistým kontextem, konkrétní veřejnou adresou a bez přihlášených účtů. Nejde o obcházení ochrany či automatické řešení CAPTCHA. Formulář se neodesílal. Původní Browser plugin v této relaci není dostupný; nynější alternativní síťové ověření výslovně zadal vlastník.

`verify-live-network.mjs` a `network-verification.json` obsahují šest úspěšných kontrol skutečné produkce (bez náhrad SDK či sběrného endpointu):

1. Nový návštěvník:žádný požadavek GA4 ani Seznam před souhlasem.
2. Odmítnutí přetrvává při přechodu CZ→EN:žádné volitelné požadavky.
3. Samostatný analytický souhlas:Google SDK `https://www.googletagmanager.com/gtag/js?id=G-LGSP8QDS9T` HTTP200. Jeden skutečný POST `https://region1.google-analytics.com/g/collect` pro `tid=G-LGSP8QDS9T`, `en=page_view`, `dl=https://radeq.cz/en/`, HTTP204. Žádný Seznam.
4. Přechod EN→CZ s uloženým souhlasem:druhý jediný page_view s HTTP204. `dl=https://radeq.cz/`;syntetický query/hash a příchozí referrer nejsou odeslány.
5. Odvolání souhlasu odstraní rámec a přetrvává na další stránce:žádný další volitelný požadavek.
6. Přístupné vlastní GA cookies jsou po odvolání odstraněny.

První orientační `probe-live.mjs`/`live-probe.json` rovněž zachytil SDK200/collect204. Obsahuje interní diagnostiku Turnstile při automatizovaném prohlížení; nebyla klasifikována jako chyba GA. Ani tento test neřešil CAPTCHA nebo neposílal poptávku. U204 může Chromium navíc vykázat ERR_ABORTED při dokončování prázdného těla; potvrzený síťový status z Googlu je204. Závěrečný test hodnotí skutečnou odpověď endpointu, nikoli úspěch čtení jeho těla.

## Rozsah důkazu

HTTP204 potvrzuje přenos na Google. Vlastník následně potvrdil aktivního uživatele v účtu GA4, ale zatím nevidí „akci“. Tím je potvrzen i příjem návštěvy v přehledu; zobrazení konkrétního názvu události či klíčové události dosud není vlastníkem potvrzeno. Kliknutí na tlačítka nejsou implementovaným měřením. `page_view` je návštěva stránky, `generate_lead` až úspěšně přijatá poptávka s analytickým souhlasem; pro kartu klíčových událostí je nutné tuto událost v účtu označit. Nepředstírá se oprava či nové nasazení. Úvodní stránka Analytics a běžné denní reporty nemusí ukázat okamžitá data. Google popisuje ověření pomocí Network/Realtime a zpoždění standardních přehledů:

- https://developers.google.com/analytics/devguides/collection/ga4/troubleshoot
- https://support.google.com/analytics/answer/11198161?hl=en

Nebyla odeslána falešná konverze generate_lead do skutečné GA4 ani testovací e-mail. Doplněn nový `verify-conversion.mjs` nad přesným publikovaným root artefaktem:izolovaný localhost s náhradním API a inertními SDK,nové úspěšné odeslání s analytickým souhlasem emituje přesně1`generate_lead`,pouze `page_location` a prázdný `page_referrer`,bez vstupů formuláře. `conversion-fixture/result.json`:PASS,GA konverzní volání1,příspěvky3(chyba,retry,pak GA souhlas). Nejde o ostré konverzní ověření. Společné dosavadní fixture kontroly souhlasů/chyb/retry/mobilu rovněž prošly; nebylo potřeba opakovat build183 nezměněných zdrojů. Jejich otisky stále souhlasí s manifestem publikovaného sestavení.

## E-mail

Vlastník potvrdil skutečné doručení oznámení na siroky@radeq.cz i potvrzení na adresu odesílatele. Poptávku odeslal z anglické stránky, proto je anglické potvrzení očekávané chování. Původní backend vybírá jazyk podle locale; čeština z české stránky zůstává zachována. Nový vizuální návrh dokončen odděleně v `docs/email/2026-10-28-recap/`, dosud bez změny produkční rozesílky. Samostatný agent pouze v této složce; primární kontrola HTML/textu/CZdesktop snímku bez materiální vady. Návrhy vCZ/EN,plaintext,stolní860px/mobil320px,escape syntetickéhoHTML/dlouhýtext/locale;0sítí/0odeslanýchzpráv. Skutečné Outlook/Gmail/AppleMail/darkmode dosud neověřené. Otevření HTML vCodex panelu vrátilo queued; neslibuje se viditelné otevření.
