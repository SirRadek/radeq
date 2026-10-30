# Podmínky koordinovaného vydání — 30. 10. 2026

Tato dokumentace popisuje veřejný zdrojový/statický balíček a bezpečné pořadí aktivace. Není sama dokladem provedené vzdálené migrace, Cloudflare deploye nebo postdeploy testů. GitHub nasazení dokládá přesný commit a úspěšný Pages workflow; stav radeq.cz má samostatný release protokol.

## Potvrzený stav přípravy

Migrace 0001 (migrations/0001_atomic_quotas.sql) byla 30. 10. 2026 aplikována na existující vzdálený LEADS_DB; Wrangler skončil exit 0. Finální produkční verze zatím nebyla aktivována. Maintenance verze be3ffc1e-712b-43c7-82c3-f98227d684fd také zatím není aktivní; její moduly a bindings byly ověřeny. Tento stav není tvrzením o hotovém finálním deployi ani o postdeploy testech.

## Pořadí

- Zachovat přesnou předchozí Worker verzi/module set, konfiguraci a soukromý návrat mimo veřejný repozitář. Předem ověřit skutečný vzdálený stav a existující LEADS_DB/D1, KV, secrets a domény. Žádný přenos autentizace.
- Posoudit přechod starých aktivních KV čítačů: nová D1 tabulka nemá jejich historii, takže hranice releasu může obnovit allowance. Časování/ochrana přechodu je samostatný provozní gate.
- Aplikovat aditivní migrations/0001_atomic_quotas.sql do existujícího LEADS_DB před aktivací nového runtime; ověřit tabulku abuse_quotas, její constraints a index abuse_quotas_expiry. Nepřepisovat tabulku leads, nevytvářet jiný binding.
- Aktivovat přesně přijatý root frontend a úplný Worker module set z release/, včetně atomic-quotas.js. Bez schématu nový kód záměrně selže bezpečně 503 před uložením/PSI. Při chybě potvrzení po uložené poptávce zachovává 201.
- Publikovat přesný /radeq site/ přes stávající větev/workflow; výchozí new zůstává. Ověřit živé bajty, CZ/EN, metadata, hlavičky a dostupnost bez falešných konverzí či skutečných zákaznických podání.
- Bezpečný návrat po aktivaci D1 runtime vede na připravenou maintenance verzi be3ffc1e-712b-43c7-82c3-f98227d684fd: stará statika, API vrací 503. D1 ani KV při návratu nemazat ani neobnovovat ze starého snapshotu; zachovat tabulku leads, zákaznické údaje i quota stav. Původní e1793e7a-6884-4fc7-bcb2-c9a693d860c7 zachovat jako baseline, nikoli jako automatický plný rollback API. Plné legacy API lze znovu zapnout až po samostatné reconciliaci quota stavu a schválení tohoto přechodu. GitHub návrat řešit novou opravnou revizí předchozího veřejného stromu, nikoli přepsáním historie. Soukromé rollback soubory nezveřejňovat.

## Provoz po vydání

Limity lead 2/24 h, measurement 5/10 min, confirmation 1/příjemce/24 h a 50 celkem/24 h zůstávají. Pseudonymní D1 klíče jsou odvozené jednosměrným otiskem, nejsou anonymní. Expirace kvótu resetuje; fyzický cleanup je dávkový při požadavcích a při neaktivitě může doběhnout později. Ruční měsíční retence neúspěšných poptávek po 6 měsících je jiná povinnost než cleanup čítačů. Neprohlašovat provedené zákaznické výmazy, DPA či aktuální indexaci bez důkazu.
