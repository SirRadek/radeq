# RadeQ V3 — konkrétní opravy od vlastníka (lock, Codex implementace)

1. **Marquee (carousel) symptomů:** NESMÍ se zastavit při najetí myší — jen ZPOMALIT.
   Musí být NEKONEČNÝ (plynulý seamless loop, žádné viditelné „skoky"/prázdné místo).
2. **Sjednotit pozici textu při zakliknutí komponenty** (diagnostický panel a podobné):
   po kliknutí se obsah zobrazí ve stejné výšce; NESMÍ být vidět předchozí část.
   Na okrajích při scrollu rozmazaný/fade efekt (mask-image edge fade).
3. **Tlačítka/slova přejmenovat + prořezat:** „Probrat to", „Diagnóza", „Mám zájem"
   nahradit jinými; je tam příliš mnoho stejných tlačítek — část zrušit (dedupe CTA).
   (Konkrétní nová slova určím z textace brainstormu.)
4. **Z menu (hlavičky) odstranit tlačítko „Konzultace zdarma".**
5. **Šipky u tlačítek:** pokud mají šipku, musí ukazovat SPRÁVNÝM směrem = DOLŮ (↓),
   ne doprava (→). (Týká se .rq-btn primárních CTA s ::after šipkou apod.)

Pozn.: #2 a #3 souvisí s textace/UX brainstormem → implementovat až po něm; #1, #4, #5
jsou nezávislé a jdou hned.
