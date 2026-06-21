# Brainstorm — RadeQ.cz V2: víc pohybu, hravosti a interaktivity (à la lepshee.com)

Jsi špičkový UI/motion/interakční designér. Brainstorming, žádný kód (ale technicky
proveditelné na Astro + Cloudflare, statika + malý JS, Astro Islands client:visible).
Piš ČESKY, konkrétně, v Markdownu. Dej SVŮJ nezávislý pohled. Cíl: výrazně živější,
hravější a interaktivnější web, ALE bez ztráty SEO/výkonu a důvěry konzervativních CZ SMB.

## Současný stav V1 (co máme — spíš střídmé)
RadeQ.cz „Racionální digitalizace", jednočlenné studio (analytik/tester), cílovka
živnostníci/malé firmy. Stack Astro+Cloudflare. Vizuál: ivory báze (#F7F4EE), grafit text,
**vínová akcent jen ~5 %** (CTA/logo), Plus Jakarta Sans (nadpisy) + Inter (text) + mono
eyebrows. Logo = wordmark „RadeQ.cz" (vínový ocásek Q). Pohyb je teď MINIMÁLNÍ (jen jemné
scroll-reveal). Karty jsou uniformní mřížky (Co řeším 6, Služby 5, Ceny 3, Ukázky 3).
Sekce naskládané pod sebou, podobné rytmy. Plovoucí „Rychlá navigace" widget.

## Co chce vlastník
VÍC POHYBU, něco HRAVÉHO a INTERAKTIVNÍHO — inspirace **lepshee.com** (odvážná velká
typografie, výrazný pohyb, interaktivní prvky, „živý" pocit). Zaměř se konkrétně na:

1. **Velikost textu / typografická škála:** je současná typografie moc krotká? Kde a jak
   zvětšit/zdramatizovat (hero, sekční nadpisy, čísla cen) — à la lepshee velký display —
   aniž utrpí čitelnost pro SMB a SEO (reálné H1/H2). Konkrétní směr škály.
2. **Barvy / kontrast:** ivory+vínová 5 %+grafit je možná moc plytké. Jak přidat „šťávu":
   tmavý „statement" blok, víc vínové na klíčových místech, druhý akcent, kontrastní momenty,
   barevné přechody mezi sekcemi — ale udržet seriózní/důvěryhodný dojem. Jeden konkrétní směr.
3. **Velikosti a rytmus dlaždic:** uniformní mřížky jsou nudné. Navrhni asymetrii / bento /
   různě velké dlaždice / „featured" dlaždice / velkou interaktivní dlaždici — kde to dává smysl.
4. **Pohyb (konkrétně, proveditelně):** 5–8 konkrétních motion momentů (scroll-reveal stagger,
   hover lift/magnetic CTA, marquee služeb, parallax, cursor-follow akcent, count-up u čísel,
   přechody sekcí, „blueprint" živý prvek…). U každého: efekt, kde, tech náročnost,
   reduced-motion fallback, dopad na výkon (Lighthouse 90+).
5. **Interaktivní hravý prvek (signature):** 1–2 zapamatovatelné interaktivní momenty na
   homepage (lepshee-styl), které sednou k „analytik/tester" brandu (např. mini „od problému
   k řešení" interakce, hravý hero prvek, „osahej si to" mikro-demo). Buildovatelné, lehké.
6. **Rovnováha:** kde hravost POMÁHÁ a kde by UŠKODILA (konzervativní SMB, konverze, výkon).
   2–3 mantinely.

Na konec: TOP 5 změn s nejvyšším poměrem „efekt/riziko", které bys udělal jako první vlnu.
Bez kódu/secrets/logů.
