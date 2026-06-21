Return ONLY a valid JSON object (no prose/fences). RadeQ.cz V2 — Vlna 3a: SIGNATURE
interaktivní prvek „Diagnostický panel: od problému k řešení". Astro komponenta
`src/components/RqDiagnostic.astro` (markup + scoped <style> + vanilla <script>). Vloží se
na homepage ZA sekci #co-resim, PŘED #sluzby. Namespace `rq-`. Sedí k brandu analytik/tester
(diagnóza). Vanilla JS, ŽÁDNÝ framework. PŘÍSTUPNÉ + NO-JS fallback (bez JS musí být obsah
čitelný) + reduced-motion safe + 0 horizontal overflow.

## Dostupné tokeny (reuse): --rq-bg, --rq-bg-sunken, --rq-surface, --rq-ink, --rq-ink-2,
--rq-line, --rq-burgundy, --rq-burgundy-strong, --rq-burgundy-tint, --rq-lime #C7E04A,
--rq-lime-ink #2A3508, --rq-display, --rq-mono, --rq-r, --rq-r-pill, --rq-ease. Třídy
.rq-eyebrow, .rq-h2, .rq-lead, .rq-flag, .rq-btn/--primary/--ghost, [data-rq-reveal].

## Vzhled + chování
- Sekce (.rq-section, id="diagnostika", na --rq-bg nebo sunken): eyebrow „Od problému k řešení",
  H2 „Vyberte, co vás trápí — ukážu první krok." + krátký lead.
- Dvě části (na desktopu vedle sebe, na mobilu pod sebou):
  LEVÁ = seznam problémů jako klikací tlačítka (role=tablist / aria-selected). PRAVÁ = panel
  výstupu (role=tabpanel), který se po kliknutí/klávesnici přepne. Aktivní problém má lime/vínový
  akcent + malý lime „.rq-flag" stav „Diagnóza".
- Výstupní panel pro každý problém ukáže: **Pravděpodobná příčina**, **Co ověřím**,
  **První praktický krok**, a odkaz **„Tohle typicky řeším přes: <Služba>"** → #sluzby
  (+ CTA „Probrat to" → #kontakt).
- Přechod jen jemný fade/opacity (reduced-motion: žádný). Bez scrolljackingu.
- NO-JS fallback: bez JS ať je vidět aspoň první problém s jeho výstupem (např. první tab/panel
  defaultně viditelný; ostatní panely přístupné, ne navždy skryté — použij techniku, kde panely
  jsou v DOMu a JS jen řídí zobrazení; bez JS zobraz všechny nebo první). Dbej na sémantiku/SEO
  (texty jsou reálný obsah v DOMu).

## Obsah (použij PŘESNĚ tyto, česky)
1. Problém: „Lidi chodí na web, ale nepoptávají."
   - Příčina: Nejasná nabídka a slabé výzvy k akci; návštěvník neví, co má udělat.
   - Co ověřím: cestu od příchodu ke kontaktu, srozumitelnost nabídky a jestli se vůbec měří.
   - První krok: krátký audit a úprava struktury + jasné CTA. — Služba: Web a redesign / Audit
2. Problém: „Web je pomalý."
   - Příčina: těžké šablony a skripty, neoptimalizované načítání.
   - Co ověřím: Core Web Vitals, váhu stránky a co blokuje vykreslení.
   - První krok: rychlostní audit a optimalizace nebo lehčí web. — Služba: Audit / Redesign
3. Problém: „Všechno přepisuju ručně."
   - Příčina: nepropojené nástroje — maily, tabulky, formuláře.
   - Co ověřím: kde vzniká ruční práce a kolik času bere.
   - První krok: navrhnout nejmenší automatizaci jednoho toku. — Služba: Automatizace procesů
4. Problém: „Nevím, co na webu měřit."
   - Příčina: chybí jednoduché měření cílů (poptávka, telefon).
   - Co ověřím: co je vlastně cíl a jestli se dnes sleduje.
   - První krok: nastavit přehledné měření bez přehnané analytiky. — Služba: Data a AI / Audit
5. Problém: „Nevím, kde začít."
   - Příčina: moc možností a žádná priorita.
   - Co ověřím: současný stav a co nejvíc brzdí práci.
   - První krok: krátký audit, který dá jasné pořadí kroků. — Služba: Audit

## Vrať JSON PŘESNĚ:
{
 "rqdiagnostic_astro":"FULL src/components/RqDiagnostic.astro (markup + scoped style + vanilla script, no-JS + reduced-motion safe, a11y)",
 "index_import":"import RqDiagnostic from '../components/RqDiagnostic.astro';",
 "index_insert":{"find":"…existující řetězec v index.astro, ZA který se vloží <RqDiagnostic /> (mezi #co-resim a #sluzby)…","replace":"…ten řetězec + \\n<RqDiagnostic />…"},
 "verify_notes":["co Opus zkontroluje (klik přepíná, no-JS první vidět, a11y, lime stav, mobil, 0 overflow)"]
}
Bez secrets/logů, žádné staré class names.
