import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts', 'tests/**/*.test.mjs'],
    environment: 'node',
    // Several suites compile Astro fixtures and share its generated type directory.
    fileParallelism: false,
  },
});
