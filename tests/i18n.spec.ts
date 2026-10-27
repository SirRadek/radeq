import { expect, test } from '@playwright/test';

test('CS and EN navigation round-trips through the localized gallery and Czech demos', async ({ page, baseURL }) => {
  const path = (relative: string) => new URL(relative, baseURL!).pathname;
  await page.route('**/api/**', route => route.abort());
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute('lang', 'cs');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL(new URL('en/', baseURL!).href);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Websites and automation that make running your business easier.');
  await expect(page.locator('header nav').getByRole('link', { name: 'Examples', exact: true })).toHaveAttribute('href', path('en/ukazky/'));
  await page.getByRole('link', { name: 'All examples', exact: true }).click();
  await expect(page).toHaveURL(new URL('en/ukazky/', baseURL!).href);
  await expect(page.getByText('All four demos are in Czech.', { exact: false })).toBeVisible();
  await page.locator('.rq-minimal-preview__portal').first().click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'cs');
  await page.getByRole('link', { name: 'Examples in English', exact: true }).click();
  await expect(page).toHaveURL(new URL('en/ukazky/', baseURL!).href);
  await page.locator('header nav').getByRole('link', { name: 'CS', exact: true }).click();
  await expect(page).toHaveURL(new URL('ukazky/', baseURL!).href);
  await expect(page.locator('html')).toHaveAttribute('lang', 'cs');
});
