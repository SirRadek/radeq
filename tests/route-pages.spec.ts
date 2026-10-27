import { expect, test } from '@playwright/test';

const publicRoutes = [
  { path: './', heading: 'Weby a automatizace, které usnadňují podnikání.' },
  { path: 'kontakt/', heading: 'Napište mi' },
  { path: 'sluzby/', heading: 'Co pro vás udělám' },
  { path: 'soukromi/', heading: 'Soukromí a poptávky' },
];

test('public pages preserve headings, shared gallery navigation and mobile readability', async ({ page, baseURL }) => {
  await page.route('**/api/**', route => route.abort());
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 920 });
    for (const route of publicRoutes) {
      await page.goto(route.path);
      await expect(page.getByRole('heading', { name: route.heading, level: 1 })).toBeVisible();
      await expect(page.locator('header nav').getByRole('link', { name: 'Ukázky', exact: true })).toHaveAttribute('href', new URL('ukazky/', baseURL!).pathname);
      await expect(page.locator('head meta[name="description"]')).toHaveAttribute('content', /\S/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), route.path).toBeLessThanOrEqual(1);
    }
  }
  await page.goto('portfolio/');
  await expect(page).toHaveURL(new URL('ukazky/', baseURL!).href);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Čtyři situace\.\s*Čtyři promyšlená řešení\./);
});
