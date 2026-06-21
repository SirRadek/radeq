Return ONLY a valid JSON object (no prose/fences). RadeQ.cz V2 — Vlna 2a: přetvoř sekci
„Co řeším" na DRAMATICKÝ tmavý full-bleed asymetrický „problem wall". Toto má být VIDITELNÝ
skok od dosavadního střídmého layoutu (uživatel řekl, že Vlna 1 byla „nic moc"). Namespace
`rq-`, žádné staré class names. Vrátíš náhradu markupu sekce + CSS append. Vanilla/CSS,
reduced-motion + no-JS safe, 0 horizontal overflow.

## Dostupné z předchozích vln (REUSE)
Tokeny: --rq-bg #F7F4EE, --rq-ink #1C1A17, --rq-ink-2, --rq-surface, --rq-burgundy #7A1F2B,
--rq-burgundy-strong, --rq-lime #C7E04A, --rq-lime-ink #2A3508, --rq-display, --rq-mono, --rq-r.
Třídy: .rq-statement (full-bleed tmavý blok: width:100vw; margin-inline:calc(50% - 50vw);
tmavé pozadí; světlý text) + .rq-statement__inner (max(...) wrapper), .rq-flag (lime štítek),
.rq-eyebrow, .rq-h2/.rq-display, reveal hook `[data-rq-reveal]` (+ stagger `--rq-i`), .rq-hoverable.

## Současná sekce (NAHRADÍŠ ji celou)
```
<section id="co-resim" class="rq-section rq-pain">
  <p class="rq-eyebrow">Co řeším</p>
  <h2 class="rq-h2">Poznáte se v některém z těchto bodů?</h2>
  <div class="rq-pain__grid" data-rq-reveal aria-label="Typické problémy, které řeším">
    <article class="rq-card rq-pain__card"><p>{symptom}</p><a class="rq-pain__link" href="#sluzby">Zobrazit vhodné řešení</a></article>
    … 6× (symptomy:) "Poptávky se ztrácí v e-mailech a ručně je přepisuju." / "Web nevysvětluje
    nabídku a nevodí zákazníky." / "Data přepisuju mezi tabulkami pořád dokola." / "Potřebuju
    jednoduchou evidenci nebo přehled." / "Chci využít AI prakticky a bezpečně." / "Nevím, kde
    začít, ale vím, že mě to brzdí."
  </div>
</section>
```

## Cíl (nový vzhled)
- Celá sekce = **tmavý full-bleed blok** (.rq-statement styl: near-black/grafit s nádechem vínové,
  světlý text). Dramatický kontrast po světlém hero. Vnitřní wrapper max(--rq-maxw).
- Nadpis VELKÝ (.rq-display nebo blízko), např. eyebrow „Co řeším" + H2 „Tohle vás nejspíš brzdí."
- **Asymetrický bento grid** (NE 6 stejných karet): 1 VELKÁ featured dlaždice (span 2 sloupce/řádky)
  s nejsilnějším problémem („Web jen existuje, ale nevydělává.") + 5 menších. Různé velikosti.
  CSS grid s grid-template-areas nebo span. Na mobilu se elegantně stackuje (1 sloupec).
- Každá dlaždice: malý **lime .rq-flag** „nalezen problém" + text symptomu + jemný odkaz
  „Co s tím" → #sluzby. Featured má větší text.
- Hover: jemný lift/posun (.rq-hoverable), případně lime akcent na okraji.
- Reveal se stagger (data-rq-reveal + --rq-i na dlaždicích), reduced-motion safe.
- Kontrast textu na tmavé OK (WCAG); lime jen jako akcent/štítek, ne velký text.

## Vrať JSON PŘESNĚ:
{
 "section_html":"FULL nová <section id=\"co-resim\" …>…</section> (nahradí současnou)",
 "rq_css_append":"CSS pro tento tmavý bento problem wall (rq- prefix, asymetrie přes grid-areas/span, mobil stack, hover, reduced-motion, 0 overflow)",
 "verify_notes":["co Opus zkontroluje (tmavý kontrast, asymetrie viditelná, lime štítky, čitelnost, mobil)"]
}
Bez secrets/logů, žádné staré class names.
