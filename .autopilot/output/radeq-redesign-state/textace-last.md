Hotovo až po build, ale commit nešel vytvořit kvůli sandbox právům k `.git`.

Build: OK  
Příkaz: `$env:DEPLOY_TARGET='github-pages'; npm.cmd run build`  
Poznámka: Vite vypsal jen warning o větším chunku.

Runtime kontrola overflow: OK pro desktop, mobile, reduced-motion i mobile no-JS.

Změněné soubory:
- `src/pages/index.astro`
- `src/styles/rq.css`

Shrnutí:
- Služby v `#sluzby` mají nový formát `Výsledek` + 3 výstupy.
- Kroky v `#jak-pracuji` jsou ve slovesném tvaru s podtitulky.
- Ceny, hero, zeď problémů, ceník a záruka zůstaly bez zásahu.

Commit: nevytvořen. `git add`/`git commit` selhaly na `Unable to create .git/index.lock: Permission denied`. Push neproběhl.