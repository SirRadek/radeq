Použil jsem Decision Mesh jako read-only routing pro UX/web dopad a beru to jako no-code brainstorm. Můj verdikt: V2 má dobrý základ. Největší riziko není „málo designu“, ale příliš jemné kontrasty, moc dlouhá textace a fixní šířka 1140px, která na 4K začne působit jako úzký sloupek uprostřed plochy.

**1. Barvy**
Současná paleta je principiálně správná: ivory + grafit + vínová + lime dává seriózní, zapamatovatelný kontrast. Jen bych ji zostřil.

Doporučení:

- `#1C1A17` na `#F7F4EE` je velmi dobře čitelné, pravděpodobně vysoko nad WCAG AA.
- Pro sekundární text na ivory nepoužívat moc světlou šedohnědou. Bezpečný rozsah: `#4F4942` až `#5F574E`. Nad `#776F65` už začne menší text působit měkce.
- Vínová `#7A1F2B` na ivory je dobrá pro CTA, odkazy, čísla, aktivní stavy. Nepoužíval bych ji na dlouhé odstavce.
- Vínovou stáhnout ze 12 % spíš na 7-9 %. Nechat ji pro rozhodovací body: hlavní CTA, doporučený tarif, aktivní diagnostický stav, linky/čísla v procesu.
- Lime `#C7E04A` je silný signál, ale nesmí nést bílý text. Použít grafitový text `#1C1A17`, případně tmavě olivový `#263000`.
- Na tmavém problem wallu nepoužívat čistě bílý text. Lepší: hlavní text `#F1EDE4`, sekundární `#C9BFB1`, linky/štítky lime. Sekundární text pod `#A89E91` už bude na tmavém pozadí slabý.
- Tmavý wall nedělat čistě černý. Ideální je teplý uhlík: `#171411`, `#1D1915`, karty `#242018`, linky/bordery `rgba(247,244,238,.12-.18)`.

Lime bych používal jen jako diagnostický marker: „nalezen problém“, bod v checklistu, stav v panelu, drobná linka v marquee. Ne jako obecnou dekoraci.

**2. Textace**
Pro konzervativní SMB bych šel méně do „brandové stylizace“ a víc do konkrétního užitku. Tón: klidný, věcný, trochu lidský. Žádné startupové „transformujeme váš byznys“.

Hero bych postavil takto:

- H1: krátký, konkrétní, bez abstrakce.
- Perex: 1-2 věty, co přesně děláš a pro koho.
- Důkaz / omezení: „Analýza, testování a drobné automatizace pro menší firmy. Bez zbytečné agenturní režie.“

Možná lepší než samotné „Racionální digitalizace“:

- „Najdu, kde vám digitální procesy zbytečně brzdí práci.“
- „Racionální digitalizace pro menší firmy.“
- „Méně ruční práce. Méně chyb. Jasnější systém.“

Sekce:

- Problem wall: krátké symptomové věty, ne odstavce. Např. „Data se přepisují ručně“, „Nikdo neví, která tabulka je poslední“, „Web sbírá poptávky, ale nejdou zpracovat“.
- Diagnostický panel: nechat interaktivní, ale texty zkrátit. Každý stav max 1 věta + 2-3 odrážky.
- Služby: každá služba by měla mít název, jednu větu výsledku, 3 konkrétní výstupy. Ne obecný popis.
- Jak pracuji: 3 kroky jsou ideální. Každý krok: sloveso na začátku. „Zmapuji“, „Ověřím“, „Předám“.
- Ceník: konzervativní SMB chce vědět, co dostane, kdy, a co není zahrnuté. Doporučuji méně marketingu, víc hranic rozsahu.

**3. Velikost písma**
Současný obří hero může fungovat, ale nesmí vypadat jako portfolio designéra. Pro analytika/testera bych šel na dramatickou, ale kontrolovanou typografii.

Doporučená škála:

- Hero H1 desktop: 76-104px, line-height 0.96-1.02.
- Hero H1 4K: max 118-132px, ale jen pokud má krátké řádky.
- Hero H1 mobil: 42-52px.
- H2 desktop: 44-60px.
- H2 mobil: 32-38px.
- H3 desktop: 22-28px.
- H3 mobil: 20-24px.
- Body desktop: 17-18px, line-height 1.55-1.65.
- Body mobil: 16.5-17px.
- Menší popisky: 14-15px, ne méně pro důležité informace.
- Eyebrow / štítky: 12-13px, uppercase jen s větším trackingem.
- Ceny: číslo 44-60px desktop, 36-44px mobil; měna a období výrazně menší.

Plus Jakarta Sans používat pro hero a H2. Inter pro delší text je správně. JetBrains Mono jen na štítky a diagnostické prvky, ne na běžné věty.

**4. Zalamování**
Největší riziko jsou dlouhé české fráze v hero, kartách a cenících. Čeština má delší slova a horší náhodné zlomy než angličtina.

Doporučení:

- Hero ručně zalomit do 2-3 významových řádků. Nečekat, že automatika vždy vyjde.
- H1 držet na cca 10-14 slov max.
- H2 max 2 řádky. Pokud má víc, zkrátit text.
- Odstavce: 52-68ch, u úvodních perexů 45-58ch.
- Karty: 28-42ch.
- Ceník: benefitové odrážky krátké, ideálně do jednoho řádku na desktopu.
- `text-wrap: balance` pro H1/H2/kartové nadpisy.
- `text-wrap: pretty` pro odstavce a perexy.
- U hero bych plánoval pevné významové zlomy, např. „Racionální digitalizace / pro menší firmy“ nebo „Najdu místa, / kde systém brzdí práci“.

**5. Spacing**
V2 sekční skladba je dlouhá, takže rytmus musí stránku zrychlovat. Ne každá sekce potřebuje stejný vertikální padding.

Doporučený rytmus:

- Hero: 96-140px top/bottom desktop, mobil 64-88px.
- Běžné sekce: 88-120px desktop, mobil 56-80px.
- Tmavý problem wall: 112-144px, protože je to silný předěl.
- Mezera mezi nadpisem sekce a obsahem: 32-48px.
- Mezera mezi eyebrow a H2: 10-16px.
- Mezera H2 → perex: 16-24px.
- Grid gap desktop: 20-32px.
- Card padding: 24-32px desktop, 18-24px mobil.
- U ceníku víc vnitřní struktury než víc paddingu: řádky, skupiny, jasný CTA blok.

Spacing škála: 4, 8, 12, 16, 24, 32, 48, 64, 88, 112, 144, 192. Pro tenhle web bych nepoužíval moc mnoho mezihodnot.

**6. 4K Responzivita**
Nezvětšoval bych všechno lineárně. Na 4K má stránka působit klidně a sebevědomě, ne jako roztažený plakát.

Strategie:

- Zachovat čitelnost textu přes `ch` limity. Odstavce nikdy neroztahovat přes cca 70ch.
- Zvýšit globální max-width podle typu sekce:
  - textové sekce: 1140-1280px maximum,
  - bento/problem/pricing/case studies: 1280-1440px,
  - velmi vizuální/full-bleed pásy: vnitřní obsah max 1520-1600px.
- Nad 1920px neroztahovat line-length, ale přidat počet sloupců, větší mezery, větší vizuální prvky, širší diagnostický panel.
- 1140px ponechat pro 1080p/menší notebooky. Pro 1440p zvednout na 1240-1320px. Pro 4K strop 1520-1600px, ne víc.
- Typografii škálovat přes clamp s vyšším stropem jen pro display/H1/H2. Body text maximálně na 19-20px.
- Spacing může růst víc než body text. Na 4K raději větší sekční dech než obří odstavce.
- Full-bleed tmavé bloky a marquee musí vždy jít přes celou šířku viewportu. Vnitřní obsah centrovat a škálovat. Na 4K může mít dark wall jemnější velkoformátový grid/linie v pozadí, ale ne dekorativní chaos.
- Container queries použít pro karty/panely, ne jen viewport. Diagnostický panel se má přeuspořádat podle vlastní šířky: úzký = stacked, střední = 2 sloupce, široký = sidebar + výsledek + metriky.
- Na 4K přidat horizontální kompozici: např. problem wall jako 12sloupcový layout s jedním dominantním problémem a menšími symptomy okolo. Ne jen stejný 3sloupec uprostřed prázdna.

**TOP 5 změn efekt/riziko**

1. Ztmavit sekundární texty a definovat bezpečné kontrastní tokeny pro light/dark/lime.
2. Zkrátit hero a sekční texty na konkrétní SMB jazyk: problém, výstup, rozsah, další krok.
3. Rozšířit max-width pro 1440p/4K podle typu sekce, ale držet odstavce přes `ch`.
4. Nastavit fluidní H1/H2 a spacing s vyšším 4K stropem; body text škálovat jen mírně.
5. Používat vínovou méně, ale rozhodněji: CTA, doporučený tarif, aktivní stav, klíčová čísla. Lime jen jako diagnostický signál.