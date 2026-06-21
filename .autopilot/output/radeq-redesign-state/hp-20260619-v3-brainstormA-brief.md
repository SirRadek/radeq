# Brainstorm A — RadeQ.cz V3: barvy, textace, 4K responzivita

Jsi špičkový vizuální + typografický + responzivní designér. Brainstorming, žádný kód
(ale proveditelné na Astro + Cloudflare, CSS/clamp/container queries). Piš ČESKY, konkrétně,
Markdown. Dej SVŮJ nezávislý pohled.

## Současný stav (V2, hotová „kostra")
RadeQ.cz „Racionální digitalizace", jednočlenné studio (analytik/tester), cílovka CZ SMB.
Vizuál: ivory báze (#F7F4EE), grafit text (#1C1A17), **vínová akcent ~12 %** (#7A1F2B),
diagnostický **lime** (#C7E04A) na štítky „nalezen problém". Fonty Plus Jakarta Sans (nadpisy,
obří hero), Inter (text), JetBrains Mono (eyebrows/štítky). Sekce: hero → marquee symptomů →
tmavý problem wall (bento, lime štítky) → interaktivní diagnostický panel → bento Služby →
„Jak pracuji" (3 kroky + blueprint linka + záruční blok) → ceník (3 tarify) → ukázky (1 velká
+ 2 malé) → kontakt formulář → tmavá patička. Max šířka obsahu 1140px.

## Zaměření (dej konkrétní doporučení)
1. **Barvy — kontrast a viditelnost:** je současná paleta dost čitelná/kontrastní? Kde je
   text málo viditelný (např. ink-2 na ivory, světlý text na tmavém problem wallu, lime
   čitelnost)? Splňuje to WCAG AA? Navrhni konkrétní úpravy odstínů/kontrastů, aby to bylo
   ostré a dobře viditelné, ale pořád seriózní. Kde přidat/ubrat vínovou.
2. **Textace (obsah) + formát:** je délka a tón textů vhodná pro konzervativní SMB? Kde
   zkrátit/zpřesnit/zlidštit. Formát: nadpisy vs. odstavce vs. odrážky — kde co.
3. **Velikost písma:** je hero/H2 škála OK, nebo přehnaná/málo? Body 16–18px? Doporuč
   konkrétní velikosti pro hero/H2/H3/body/eyebrow/ceny (desktop i mobil).
4. **Zalamování (text-wrap):** kde hrozí ošklivé zlomy/sirotci; doporuč `text-wrap: balance`
   /`pretty`, max-width na řádek (ch), ruční zlomy v hero.
5. **Odsazení / spacing:** je vertikální rytmus mezi sekcemi a uvnitř (padding, gap) vyvážený?
   Kde víc/míň vzduchu. Doporuč spacing škálu.
6. **Responzivita do 4K (1080p → 4K, stejný poměr):** jak zařídit, aby web na velkých
   monitorech (1440p, 4K) NEvypadal ztracený v prázdnu ani roztažený. Konkrétně: zvedat
   --maxw na větších breakpointech? škálovat typografii/spacing přes clamp s vyšším stropem?
   container queries? jak vyladit FULL-BLEED pozadí (tmavé bloky, marquee) na 4K. Doporuč
   konkrétní strategii (breakpointy, max-width strop, scale tokenů).

Na konec: TOP 5 změn s nejvyšším poměrem efekt/riziko (barvy+text+4K). Bez kódu/secrets/logů.
