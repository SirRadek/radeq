**Doporučení: dvoufázový writer loop.** Codex má write práva a dělá implementaci + build + commit na branchi. Push se provede až po Opus review, ideálně deterministickým runnerem po explicitním `approved`. Tím odpadá ruční aplikování JSON editů, ale pořád existuje kontrola před nahráním na GitHub Pages.

Oficiální Codex CLI docs říkají, že `--full-auto` je starší kompatibilní cesta; pro non-interactive běh preferuj `codex exec --sandbox workspace-write`. Pro write + network bez promptů je potřeba `--sandbox danger-full-access` nebo `--dangerously-bypass-approvals-and-sandbox`, ale jen v izolovaném runneru. Viz OpenAI docs: [CLI reference](https://developers.openai.com/codex/cli/reference), [Agent approvals/security](https://developers.openai.com/codex/agent-approvals-security), [advanced config](https://developers.openai.com/codex/config-advanced).

## 1. Invokace `codex exec` na Windows

### Bezpečný default: edit + build, bez push

Použít pro writer fázi:

```powershell
codex exec `
  -C "C:\Programovani\radeq" `
  --sandbox workspace-write `
  -c approval_policy="never" `
  -c sandbox_workspace_write.network_access=true `
  -o ".autopilot\codex-last-message.md" `
  "Implementuj zadaný task end-to-end. 
   Pracuj pouze na branchi autopilot/radeq-v1-2026-06-18.
   Neprováděj git push.
   Před commitem spusť: `$env:DEPLOY_TARGET='github-pages'; npm.cmd run build.
   Commitni pouze pokud build projde.
   Na konci vrať stručné shrnutí, build výsledek, commit hash a seznam změněných souborů."
```

Poznámky:

- Použij `-C` / `--cd` na repo root, ne `cwd` odvozené implicitně.
- `--sandbox workspace-write` stačí pro editace a build.
- `sandbox_workspace_write.network_access=true` je potřeba, pokud build nebo npm skripty vyžadují síť. Pokud `node_modules` už existuje a build síť nepotřebuje, nech síť vypnutou.
- `--full-auto` nepoužívat jako primární API.
- `-o` zachytí poslední zprávu pro evidenci; diff a metadata ale generuj deterministicky mimo Codex.

### Pokud má Codex opravdu dělat i `git push`

Spouštět pouze v izolovaném pracovním klonu bez secrets:

```powershell
codex exec `
  -C "C:\Programovani\radeq" `
  --sandbox danger-full-access `
  -c approval_policy="never" `
  -o ".autopilot\codex-last-message.md" `
  "Implementuj task, spusť build, commitni a pushni pouze na origin autopilot/radeq-v1-2026-06-18.
   Nikdy nepřepínej na main, nikdy nepoužívej force push.
   Před push ověř: git branch --show-current == autopilot/radeq-v1-2026-06-18.
   Push pouze pokud build projde."
```

`--dangerously-bypass-approvals-and-sandbox` / `--yolo` bych nedával do běžného desktop runneru. Je to varianta jen pro izolovaný clone/container, protože bez sandboxu může proces číst dostupné secrets i systémové soubory.

### Evidence

Po každém běhu runner uloží redigované artefakty:

```powershell
git status --short
git diff --stat HEAD~1..HEAD
git diff --name-only HEAD~1..HEAD
git show --summary --format=fuller --no-patch HEAD
```

Neukládat raw terminálové logy, `.env`, tokeny, celé prompt transcripty ani build logy se secrets. Stačí `last-message`, exit code, build command, commit hash, changed files, diff stat.

## 2. Git disciplína

Tvrdá pravidla v runneru, ne jen v promptu:

- Povolená branch přesně: `autopilot/radeq-v1-2026-06-18`.
- Před startem: `git branch --show-current`.
- Pokud branch není povolená: STOP.
- Před editací: `git status --porcelain`.
- Pokud dirty tree není prázdný: STOP, nebo vytvořit samostatný worktree/clone.
- Build gate: commit jen po zeleném `DEPLOY_TARGET=github-pages npm.cmd run build`.
- Push gate: push jen po Opus approval.
- Nikdy `--force`, `--force-with-lease`, reset main, checkout main, ani push bez explicitního refspecu.
- Push vždy explicitně:

```powershell
git push origin HEAD:refs/heads/autopilot/radeq-v1-2026-06-18
```

Při selhání buildu:

- necommitovat, nepushovat;
- neprovádět automatický rollback, pokud existoval předchozí dirty stav;
- pokud runner začal z čistého stromu, může udělat cleanup pouze vlastních změn přes vytvořený patch/worktree discard;
- uložit evidence packet: failed step, changed files, exit code, stručné shrnutí, žádné raw secrets/logy.

## 3. Review gate

Doporučuji variantu **(a): Codex edituje + builduje + commituje, ale NEpushuje; Opus reviewuje commit; runner pushne až po approval**.

Důvod:

- Splňuje „Opus kontroluje před nahráním“ doslova.
- Opus už neručně aplikuje edity; kontroluje jen hotový commit, diff stat a lokální preview.
- Chybný výstup se nedostane na GitHub Pages preview.
- Deploy právo zůstává automatizované, ale za review gatem.

Praktický flow:

1. `captureCodexWriter` spustí Codex.
2. Codex upraví soubory, spustí build, vytvoří commit.
3. Runner vytvoří review packet: commit hash, diff stat, changed files, build ok, preview instrukce.
4. Opus odpoví `approved` / `changes_requested`.
5. Při `approved` runner provede explicitní push.
6. Při `changes_requested` vzniká další worker task proti aktuálnímu commitu.

Varianta (b) je rychlejší, ale porušuje požadavek kontroly před uploadem. Hodí se až pro low-risk režim po několika stabilních cyklech.

## 4. Zapojení do `cliWorker/runner`

Doporučuji novou funkci, ne flag na `captureCodexResponse`:

```ts
captureCodexWriter({
  repoPath,
  branch: "autopilot/radeq-v1-2026-06-18",
  task,
  mode: "commit_no_push",
  buildCommand: "DEPLOY_TARGET=github-pages npm.cmd run build",
})
```

Proč nová funkce:

- `captureCodexResponse` dnes znamená read-only JSON edits.
- Writer má jiné invarianty: branch guard, dirty-tree guard, build gate, commit gate, optional push gate.
- Menší riziko, že někdo omylem zapne write režim u starého workeru.

Evidence ukládat do `subagent-evidence` / agent registry jako strukturovaný záznam:

```json
{
  "worker": "codex_cli",
  "mode": "writer_commit_no_push",
  "repo": "radeq",
  "branch": "autopilot/radeq-v1-2026-06-18",
  "buildCommand": "DEPLOY_TARGET=github-pages npm.cmd run build",
  "buildStatus": "passed",
  "commit": "<hash>",
  "changedFiles": [],
  "diffStatPath": "<redacted artifact path>",
  "pushStatus": "waiting_review"
}
```

WORKER-CLI-001 zachovat takto:

- žádný fake vendor;
- pokud Codex CLI selže, záznam `provider_run_failed`;
- fallback jen na jiného reálného providera po ověření dostupnosti/ceny/scope;
- žádné simulování Codex výstupu Opusem.

## 5. Rizika + pojistky

- **Secrets / `.env`:** runner zakáže staging souborů podle denylistu: `.env*`, `*.pem`, `*.key`, token/cache adresáře, raw logs. Před commitem kontrola `git diff --cached --name-only`.
- **Push do main:** před push kontrola branch + explicitní refspec na `refs/heads/autopilot/...`; pokud remote branch není autopilot, STOP.
- **Force push:** blokovat argumenty obsahující `--force`, `--force-with-lease`, `+refs/`.
- **Dirty tree:** nezačínat nad dirty stromem. Nejbezpečnější je per-task `git worktree add` z povolené branche.
- **Ztráta práce:** nepoužívat `git reset --hard` v hlavním checkoutu. Cleanup jen ve throwaway worktree.
- **Nekonečná smyčka:** max 2 writer pokusy na jeden task, max 1 fix pass po Opus `changes_requested`, potom `blocked`.
- **Build fail:** žádný commit/push; uložit pouze redigované shrnutí.
- **Codex neposlechne prompt:** branch/build/push pravidla musí být v runneru jako deterministic preflight/postflight, ne jen v promptu.
- **Network/deploy práva:** `danger-full-access` jen v izolovaném clone/containeru. Desktop default má být `workspace-write`, push provádí runner po review.