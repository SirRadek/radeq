Zde je můj nezávislý pohled špičkového designéra na tvůj návrh V2. Tvá výchozí kostra (ivory, grafit, vínová, lime, bento, 3 fonty) je z pohledu art direkce **vynikající**. Má to technický, analytický, ale přitom velmi seriózní a prémiový "SMB-friendly" nádech. Pojďme to ale dotáhnout k naprosté dokonalosti, aby web nejen dobře vypadal, ale hlavně bezchybně fungoval na jakémkoliv zařízení od iPhonu po 4K monitor.---### 1. Barvy — kontrast a viditelnost
Současná paleta má obrovský potenciál, ale skrývá úskalí v kontrastu a hierarchii:
*   **Základ (Grafit na Ivory):** Perfektní. Kombinace `#1C1A17` a `#F7F4EE` je měkčí než čistá černobílá, snižuje únavu očí a působí prémiově. Kontrastní poměr je přes 13:1 (bohatě splňuje WCAG AAA).
*   **Vínová (#7A1F2B):** Velmi seriózní a důvěryhodná barva. Používej ji **výhradně na interaktivní prvky a konverze** (primární tlačítka, aktivní stavy, hlavní odkazy). Vínová na Ivory projde bez problémů (WCAG AA/AAA). *Doporučení:* Vyhni se vínovému textu na tmavém pozadí (problem wall) – tam by zanikla.
*   **Diagnostická Lime (#C7E04A):** Toto je tvůj "zvýrazňovač". Protože je hodně světlá a zářivá:
    *   **NEpoužívej** ji pro text na světlém pozadí (Ivory) – nečitelné.
    *   Používej ji jako **pozadí pro štítky**, ale text uvnitř štítku musí být tvůj Grafit (`#1C1A17`).
    *   Na tmavém Problem Wallu bude Lime text/ikony svítit naprosto fantasticky.
*   **Tmavý Problem Wall:** Pokud je pozadí Grafit, nepoužívej čistě bílý text. Použij svou Ivory (`#F7F4EE`) nebo lehce ztlumenou bílou (např. s 10% opacitou grafitu), aby to nerezalo do očí. Pro sekundární texty na tmavém pozadí použij světle šedou (např. `#A09E9A`), abys vytvořil vizuální hierarchii.### 2. Textace a formát
Cílovka CZ SMB nemá čas na marketingovou vatu. Potřebují vědět: Co děláš? Jak mi to pomůže? Kolik to stojí?
*   **Tón:** Věcný, diagnostický, mírně asertivní (jsi analytik/tester, ty nacházíš chyby, které je stojí peníze).
*   **Délka a formát:**
    *   **Nadpisy (H2):** Krátké, úderné, zaměřené na bolest nebo výsledek (např. *"Procesy, které vás brzdí"*, nikoliv *"Naše nabídka optimalizace procesů"*).
    *   **Odstavce:** Maximálně 2–3 věty. Pokud je text delší, nikdo v SMB ho číst nebude.
    *   **Odrážky:** Tvoje hlavní zbraň. Místo bloku textu v sekci Služby použij checkboxy nebo bullety s JetBrains Mono ikonkou. Je to skenovatelné a technické.### 3. Typografická škála (Velikost písma)
Kombinace *Plus Jakarta* (H), *Inter* (Body) a *JetBrains* (Mono) je skvělá. Musí ale mít jasný kontrast ve velikostech.
*   **Desktop (base):**
    *   **Hero (H1):** `64px – 80px` (Plus Jakarta, tight tracking `-0.02em`, tight leading `1.1`). Musí dominovat.
    *   **H2 (Sekce):** `40px – 48px` (Plus Jakarta).
    *   **H3 (Bento karty):** `24px` (Plus Jakarta).
    *   **Body:** `18px` (Inter, leading `1.6`). Pro konzervativní SMB, kde sedí často starší majitelé firem, je 18px absolutní základ. Dnes už 16px na desktopu působí drobně.
    *   **Body sekundární:** `16px` (Inter).
    *   **Eyebrow/Štítky:** `13px – 14px` (JetBrains Mono, uppercase, letter-spacing `0.05em`).
***Mobil:**
    *   H1: `36px – 42px`, H2: `28px – 32px`, H3: `20px`, Body: `16px`.

### 4. Zalamování textu (Text-wrap & Layout)
Tady se láme průměrný web a špičkový design:
*   **Nadpisy:** Globálně nasaď v CSS `text-wrap: balance;`. Zabrání to jednomu osamocenému slovu na novém řádku a vytvoří hezké, symetrické bloky nadpisů.
*   **Odstavce (Body):** Nastav maximální šířku řádku: `max-width: 65ch;` (nebo 60ch). Lidské oko na monitoru nedokáže komfortně sledovat řádek delší než cca 75 znaků. Zároveň nasaď `text-wrap: pretty;` (nový CSS standar
rd), který eliminuje "sirotky" (posledníosamocená slova) na konci odstavců.
*   **Hero:** Tady na automatiku nespoléhej. Použij ruční zalomení `<br class="hidden md:block">`, abys přesně kontroloval, jak zní a vypadá hlavní hook na desktopu vs. na mobilu.

### 5. Odsazení a vertikální rytmus (Spacing)
SMB segment vyžaduje přehlednost. Příliš nahuštěný web působí levně a zmateně.
*   Zaveď striktní **8pt scale** (8, 16, 24, 32, 48, 64, 96, 128, 160).
*   **Mezi sekcemi:** Neboj se obřích mezer. Na desktopu klidně `128px` až `160px` margin. Odděluje to myšlenky.
*   **Uvnitř sekce (nadpis vs. grid):** `64px`.
*   **Bento box padding:** `32px` až `40px` (zajišťuje, že obsah v kartě dýchá).
*   **Mobil:** Mezery mezi sekcemi sniž na `80px – 96px`, bento padding na `24px`.

### 6. Responzivita 1080p →4K (Jak nebýt "nudle uprostřed")
Limit `1140px` je na dnešní poměry pro technologický/analytický web zbytečně svazující (1140px byl standard v éře Bootstrapu 3). Velké monitory (1440p, 4K) tvoří u B2B segmentu obrovské procento.

*   **Zvedni Max-width:** Posuň strop obsahu na `1280px` nebo klidně `1440px`.
***Container Queries pro Bento:** Použij CSS Container Queries pro tvůj Bento grid. Karty by se neměly primárně přeskládávat podle šířky okna, ale podle šířky *svého kontejneru*. To zachrání layout při natahování grid
du.
*   **Fluidní typografie s capem:**Použij `clamp()`, ale *neškáluj do nekonečna*.
    *   *Příklad pro H1:* `font-size: clamp(2.25rem, 5vw, 5rem);` – na 4K se zastaví na 80px (5rem). Nenech písmo růst na 150px, vypadá to pak jako rozbitý web.
*   **"Full-bleed" strategie (Tmavé sekce, Marquee):**
    *   Pozadí sekcí (Problem wall, Footer) musí jít vždy od okraje k okraji (`width: 100vw`, `margin-left: calc(50% - 50vw)`).
    *   **Obsah uvnitř:** Stále uzamčen v tvém max-width kontejneru (`max-w-7xl mx-auto`).
*   **Zvětšení proporcí pro 4K (High-end trik):** Aby web na 32" 4K monitoru nevypadal ztraceně, můžeš místo obřího zvětšování max-width dynamicky zvednout "base font size" na `html` elementu přes media query.
    *   Do 1920px (1080p): `html { font-size: 16px; }`
    *Nad 1920px (1440p/4K): `html { font-size: 18px; }` (nebo 20px).
    *   Pokud používáš na vše (spacing, text) jednotky `rem`, **celý web se proporcionálně zvětší**, jako by uživatel použil zoom v prohlížeči. Max-width (např. 80rem) bude najednou fyzicky širší, texty čitelnější, bento
o karty robustnější. Nevznikne prázdno.

---

### TOP 5 změn s nejvyšším poměrem efekt / riziko
1.  **Zahoď 1140px a nasaď root REM škálování na velké monitory:** Změň max-width kontejneru na `80rem` (1280px) nebo `90rem` (1440px). Přidej media query pro monitory nad 1920px, která mírně zvedne base font size (`font
t-size: 112.5%` na kořenovém elementu). Celý web se na 4K elegantně a bez práce zvětší.
2.  **Dogmatická textová obrana:** Hned na začátku napiš do CSS globální pravidla: `h1, h2, h3, h4 { text-wrap: balance; }` a `p { text-wrap: pretty; max-width: 65ch; }`. Web instantně získá sazbu jako z magazínu.
3.**Třídění barevných rolí:** Vínová výhradně kliká a prodává. Lime výhradně upozorňuje, analyzuje a diagnostikuje (a vždy s grafitovým textem uvnitř). Nedovol jim, aby o pozornost soutěžily na jednom místě.
4.  **18px Body text na desktopu:** Majitelé SMB často nenosí brýle k počítači, i když by měli. 18px Inter je zachrání a tvůj web si podvědomě oblíbí, protože se jim "prostě dobře čte".
5.  **Rozvolnění prostoru:** Nastav masivní vertikální odsazení sekcí (desktop minimálně 128px). "Racionální digitalizace" musí působit organizovaně. Vzduch mezi sekcemi funguje jako kognitivní restart před dalším argume
entem.