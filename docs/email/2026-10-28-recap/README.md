# Návrh potvrzení poptávky · 28. 10. 2026

Aktualizace 19:01 CET: vlastník návrh schválil, dvě nezávislé kritiky prošly a CZ/EN HTML i text jsou napojeny a nasazeny na radeq.cz. Aktuální náhledy ze skutečného release handleru jsou v `integrated/confirmation-cs.html`, `integrated/confirmation-en.html` a sousedních PNG. EN úvod a odkaz loga byly doladěny. [Záznam vydání a ověření](../../deployments/2026-10-28-email-release/RELEASE.md), `IMPLEMENTATION.md` a `review-*.md` popisují aktuální stav. Níže je zachován historický popis původního samostatného návrhu; tvrzení o chybějícím napojení se vztahují k tomuto dřívějšímu kroku. Nové skutečné doručení do schránky po změně nebylo ověřeno.

Samostatný návrh zákaznického rekapitulačního e-mailu v češtině a angličtině. Žádná implementace v aplikaci ani publikace. Backend, notifikace majitele, D1/KV, konfigurace odesílání a secrets zůstaly mimo tento úkol. Nebyl odeslán žádný e-mail.

## Co posoudit

- `confirmation-cs.html` a `confirmation-en.html`: kompletní návrhy e-mailu.
- `confirmation-cs.txt` a `confirmation-en.txt`: rovnocenné textové varianty.
- `preview-cs-desktop.png`, `preview-cs-mobile.png`, `preview-en-desktop.png`, `preview-en-mobile.png`: skutečné lokální náhledy při šířkách 860 a 320 px.
- `fixture.json`: výhradně smyšlená poptávka od `jana@example.test`.
- `generate-proposals.mjs`: reprodukovatelný generátor návrhů; neobsahuje odesílání ani přístup k backendu.
- `verify-previews.mjs` a `verification.json`: provedené kontroly a jejich výsledek.

Vizuální návaznost: krémová `#f7f4ee`, vínová `#7a1f2b`, inkoust `#1c1a17`, textové logo **RadeQ.cz**. Velký klidný nadpis, jedna rekapitulace, osobní podpis a přímá odpověď. Použity systémové fonty Georgia/Arial, protože e-mail nemá stahovat webové fonty. Rozvržení používá prezentační tabulky a inline styly, včetně podmíněné 600px tabulky pro MS Outlook. Nejsou zde obrázky, externí fonty, skripty, tracking pixely ani měřicí parametry.

Předmět návrhu: **Poptávka dorazila — RadeQ.cz** / **Enquiry received — RadeQ.cz**. Text potvrzuje jen doručení, rekapituluje projekt a zprávu, slibuje odpověď do 1 pracovního dne a vyzývá k odpovědi na e-mail. Patička výslovně odděluje doručení od objednávky, platby a smlouvy. Anglický formulář přepíná jazyk obálky; obsah napsaný návštěvníkem se nepřekládá. EN fixture je samostatný smyšlený příklad, nikoli návrh automatického překladu vstupu.

## Doporučené následné napojení

Současný autoritativní zdroj je `app/src/lib/leadNotificationEmail.ts`, nikoli `leadEmails.ts`. Aktivní přesná kopie backendu obsahuje odpovídající `createLeadConfirmationEmail` v `app/release/production-backend.js`. Tento návrh žádný z nich nemění. Napojení je samostatný další krok, který musí respektovat ochranu současné přesné kopie backendu a samostatné review změny odesílání.

| Položka návrhu | Existující vstup / chování | Při napojení |
| --- | --- | --- |
| Příjemce | `lead.email` | Použít již validovaný příjemce; nevkládat jej do HTML atributů. |
| Oslovení | `lead.name` | HTML escape; v textové variantě obyčejný text. |
| Projekt | `lead.project_type` | HTML escape; prázdný údaj zobrazit jako „Neuvedeno“ / „Not specified“. |
| Zpráva | `lead.message` | Nejprve escape, potom převést odřádkování na `<br>`; uchovat text a pořadí odstavců. |
| Jazyk | `lead.locale.toLowerCase().startsWith('en')` | Zachovat přesné současné pravidlo; ostatní locale vedou do CZ. |
| Odesílatel | `confirmationFrom` | Zachovat současnou ověřenou identitu. |
| Odpověď | `notificationTo` = `siroky@radeq.cz` | Zachovat skutečnou hlavičku `reply_to`, nejen viditelný odkaz. |
| Transport | `postToResend` nyní posílá `text` | Přidat volitelné `html` do typu a JSON payloadu jen u zákaznického potvrzení; vždy zachovat `text`. |
| Notifikace majitele | `createLeadNotificationEmail` | Zachovat příjemce, `replyTo: lead.email`, předmět a úplnou současnou textovou rekapitulaci. |
| Potvrzení úspěchu | Současný backendový životní cyklus | Neměnit zápis poptávky, pořadí odesílání, idempotenci ani zpracování chyby kvůli vzhledu. |

Generátor ukazuje HTML escape pro `& < > " '`. Vstupy nikdy nepovažovat za důvěryhodné HTML, ani projektový typ; nepoužívat interpolaci do CSS, raw HTML či URL. Odkazy v návrhu jsou pouze pevné `https://radeq.cz/` a `mailto:siroky@radeq.cz`. Uživatelské URL v textu neobohacovat automatickým odkazem. Pokud se později přidá odkaz z uživatelského vstupu, vyžaduje zvláštní validaci schématu/cíle i escape atributu; samotný HTML escape nestačí. Předměty návrhu jsou pevné řetězce bez uživatelských vstupů.

Před případným nasazením ověřit payload přes mock transport: současná interní notifikace musí zůstat stejná; CZ/EN zákaznická zpráva má správného příjemce, Reply-To, HTML i text. Dále otestovat české diakritiky, chybějící volitelný typ, HTML ve vstupu, limity současného formuláře (jméno 90, typ 120, zpráva 1200 znaků), chybové větve a stávající locale. Pak provést samostatný test doručení do skutečných schránek podle schváleného postupu. Tady se tento krok neprováděl.

## Ověření návrhu

Z kořene pracovního prostoru:

```powershell
node docs/email/2026-10-28-recap/generate-proposals.mjs
node docs/email/2026-10-28-recap/verify-previews.mjs
```

Vykreslení používá již instalovaný Playwright/Chromium v `app/node_modules`, lokální `setContent` a blokaci veškerých síťových požadavků. Naměřeno **0 síťových požadavků**, **0 odeslaných e-mailů**. Obě jazykové varianty při 860/320 px nemají vodorovný přetok. Zkontrolována hierarchie nadpisů, prezentační tabulky, oba pevné odkazy a jejich ovladatelnost klávesnicí, escape škodlivého syntetického HTML, 500znakový nepřerušený řetězec při 320 px, chybějící typ projektu a zachování locale pravidla. Návrhy mají přibližně 5 kB, bez externích zdrojů.

Omezení: jde o skutečný browser náhled, nikoli důkaz vykreslení v e-mailových klientech. Outlook desktop, Gmail, Apple Mail, dark mode, doručitelnost, chování přepisovaných odkazů a klientské automatické rozpoznávání textových URL nebyly ověřeny. Podmíněný MSO layout a inline styly jsou příprava pro kompatibilitu, nikoli potvrzená kompatibilita všech klientů.
