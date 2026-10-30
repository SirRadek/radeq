# Ověření organického kandidáta — 30. 10. 2026

Jde o vlastní web Radka Širokého, nikoli klientskou referenci. M3 a M4 byly uzavřeny samostatnou nezávislou zdrojovou kritikou APPROVE. Tento soubor dokládá místní kandidát; nepotvrzuje následné zveřejnění, report GA4, indexaci nebo obchodní výsledky.

- Přijatý runtime: build-1793390155578; původní manifest SHA256 f93fbd660ebbde9d5e7115a649515c16abc58e7d9d0fafa4af7fc919eb9487d2. Přenosné relativní zdrojové hashe a úplný veřejný allowlist jsou v publication-manifest.json.
- Oba statické buildy root a /radeq, 24 compiled testů PASS; 16 cílených testů souhlasu, zpráv iframe, kategorizace a validního/nevalidního přijetí formuláře PASS. Cílené typy: 87 souborů,0 errors,0 warnings,6 stávajících hints. M3 navíc provedl4 existující cílené testy a CZ/EN1280/320 browser kontrolu.
- M4 browser skutečně ověřil compiled souhlas, CTA, focus a cross-tab odvolání proti místním náhradám SDK. Externí služby blokovala CSP; nevznikla ostrá poptávka, e-mail nebo analytická konverze. Skutečný SDK přenos a Turnstile tím nejsou ověřeny.
- rq_source je omezená kategorie pozorovaného odkazujícího hostu po analytickém souhlasu, nikoli úplná session/first-touch atribuce. Chybějící či vnitřní odkaz je unknown; Google není důkaz AI. Zdroj se mezi dokumenty neuchovává. Měření bez souhlasu, osobní pole, hledané texty a celé referrery neposíláme.
- Pages je noindex statický náhled bez produkčního API a aktivních providerů. Root build pro radeq.cz a stav skutečného Cloudflare nasazení jsou oddělené. Backendové moduly, bindings, secrets a zákaznická data se v této etapě nemění; D1 migrace z předchozího vydání se neopakuje.

Původní auditní doklady v sousedním 2026-10-30-audit/ zůstávají historickým samostatným důkazem. Nová skutečná vydaná verze a živé kontroly se mají zaznamenat až po provedení; nevyrábět je z existence tohoto balíčku.
