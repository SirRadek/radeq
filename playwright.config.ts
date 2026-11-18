import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.RADEQ_E2E_PORT ?? '4322');
const baseURL = `http://127.0.0.1:${port}/`;

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  testIgnore: '**/themed-demos.spec.ts',
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${port}`,
    env: { DEPLOY_TARGET: '' },
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  use: {
    baseURL,
    serviceWorkers: 'block',
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH },
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
});
