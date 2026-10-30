# Aktuální přenosné předání — 30. 10. 2026

Toto předání, AGENTS.md a aktuální CHANGELOG mají přednost před historickým předáním z 29.října. Publikační větev je codex/radeq-clean-pages-20261013; výchozí new se nemění. Starý checkout zachovat. Zdroj je v kořeni, nikoli app/. Neaplikovat LOCAL-CHANGES.patch znovu.

## Obnovení na dalším PC

1. Klonovat uvedenou publikační větev do nové složky.
2. Spustit node tools/verify-publication.mjs. Kontrola porovnává přesné relativní SHA256 zdrojů, site/ i dokumentace.
3. Spustit python tools/serve-verified-preview.py --port 4394; otevřít /radeq/ a /radeq/en/. Pythonový náhled je read-only a nemá API.
4. Pro vývoj Node>=22.23.4 (doporučeno 24), npm ci a npm run dev -- --host 127.0.0.1. Nové ověření: node scripts/verify-themed-demos.mjs; vytvoří nový místní manifest. Nezacházet se starými cestami jako s aktuálními.

Neprovádět automaticky další publikaci, migraci či cleanup pouze kvůli obnovení. Přihlášení poskytovatelů řešit standardním loginem na cílovém PC; tokeny a cookies se nepřenášejí.

## Obsah revize

Všechny čtyři opravy přístupnosti, aktualizovaný lock, přenosná migrace, společný quota modul, skutečný Worker a testy jsou obsaženy. Zdrojový součet má 206 položek; site/ je přesný 117 souborový /radeq výstup přijatého buildu build-1793375135964. Manifest zdrojového běhu:07e7ea616855edfd1de03859a94b9a4f23ebc7d2fead9ed9311100c8cb581b8a. Relativní hashe jsou v publication-manifest.json.

GitHub má noindex, prázdnou sitemapu, e-mailový kontakt a žádný skutečný lead backend. Root produkční varianta má formulář/souhlasy/API. GitHub workflow odesílá site/, nepřekládá zdroje a nemigruje Cloudflare. Skutečný stav Cloudflare i konkrétní migrační protokol musí ověřit osoba provádějící samostatný koordinovaný release; nelze jej odvodit z přítomnosti těchto souborů.

## Nasazení a návrat

[Podmínky vydání](../../deployments/2026-10-30-audit-release/README.md) vyžadují před novým Workerem migraci na existující LEADS_DB, ověření schématu/indexu a kompletního module setu. Zachovat D1/KV/secrets a předchozí návratovou verzi. Tabulku leads ani zákaznické údaje nemažte. Kvóty mají nový stav oproti starým KV čítačům; release musí řešit bezpečné časování/přechod.

Soukromé provozní rollbacky a exporty zůstávají mimo tento repozitář. Historické doklady popisují tehdejší stav a staré verze; nejsou dnešním deploy receipt. Ruční retenci zákazníků, smlouvy/DPA a skutečnou indexaci GSC nelze označit za ověřené bez provozních důkazů.

## Doložené kontroly a meze

[Souhrn kandidáta](../../verification/2026-10-30-audit/README.md). Kontroly byly provedeny nad přesným zdrojovým kandidátem před přenosem. Nový clone ani kontrola hashů je znovu nespouští. Jedna existující unit skip položka a 6 typových hints jsou přiznány. Safari/Firefox, skutečná čtečka, nativní zoom, živá doručitelnost/challenge/PSI/advertising a cross-region timing nebyly prohlášeny za otestované.
