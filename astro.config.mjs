// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// @ts-expect-error Astro loads this config in Node, but this project does not ship Node typings.
const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages';

// https://astro.build/config
export default defineConfig({
  site: isGitHubPages ? 'https://sirradek.github.io' : 'https://radeq.cz',
  base: isGitHubPages ? '/radeq' : '/',
  devToolbar: {
    enabled: false,
  },
  integrations: [react()],
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
