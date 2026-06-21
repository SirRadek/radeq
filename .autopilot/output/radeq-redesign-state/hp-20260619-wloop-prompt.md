RadeQ autopilot — návrh WORKER-LOOPU, kde TY (codex_cli) jsi implementátor s WRITE+DEPLOY právy
a Opus jen reviewuje. Dnes běžíš read-only (`codex exec -o <file> -`, vracíš JSON edits, Opus je
ručně aplikuje → 2× práce + plýtvá Opus limitem). Vlastník chce: codex SÁM edituje soubory,
builduje, commituje, pushuje (push spustí GitHub Pages preview), Opus jen KONTROLUJE před nahráním.

Prostředí: repo `radeq` (Astro), Windows + Git Bash. Branch `autopilot/radeq-v1-2026-06-18`
(NIKDY main/produkce). Build: `DEPLOY_TARGET=github-pages npm.cmd run build`. Push na `autopilot/**`
→ workflow `preview-deploy.yml` → https://sirradek.github.io/radeq/. Stávající kód:
`src/data/delivery-system/cliWorkerCapture.ts` (`captureCodexResponse` volá `codex exec ... -o out -`
v cwd). Pravidlo WORKER-CLI-001: žádný fake vendor; když reálný provider selže, zkus jiný reálný
nebo STOP.

Navrhni KONKRÉTNĚ a BEZPEČNĚ (vrať markdown):
1. **Invokace `codex exec` pro write+git na Windows:** jaké flagy (`--sandbox workspace-write`,
   `--full-auto` vs `--dangerously-bypass-approvals-and-sandbox`, network access pro `git push`,
   `--cd <radeq>` / `-C`), jak spolehlivě nechat codex editovat + spustit npm build + git.
   Jak zachytit shrnutí/diff pro evidenci (stdout/last message).
2. **Git disciplína:** jen tato branch; build-gate (commit jen když build zelený); žádný force;
   žádný main; co dělat při selhání buildu (rollback / nepushovat).
3. **Review gate „Opus kontroluje před nahrátím":** doporuč variantu —
   (a) codex edituje+builduje+commituje, ale NEpushuje → Opus zkontroluje `git diff` + lokální
   preview → push; vs (b) codex udělá vše vč. push a Opus reviewuje live preview + fixuje v další
   smyčce. Doporuč jednu a zdůvodni (cíl: minimum Opus práce, ale zachovat kontrolu před nahráním).
4. **Zapojení do cliWorker/runner:** nová funkce (`captureCodexWriter`?) vs flag na stávající;
   evidence (agent-registry / subagent-evidence); zachování WORKER-CLI-001.
5. **Rizika + pojistky:** secrets/.env, omylem push do main, nekonečná smyčka, dirty tree,
   ztráta neuložené práce. Jak ošetřit.

Konkrétně, stručně, bezpečně. Bez secrets / raw logů.
