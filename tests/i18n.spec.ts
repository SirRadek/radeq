import { expect, rejectOptionalCookies, test } from './helpers/local-browser';

test('CS and EN navigation preserves the gallery and individual localized demos', async ({ page, baseURL }) => {
  const url = (relative: string) => new URL(relative, baseURL!).href;
  const language = (name: string) => page.getByRole('banner').getByRole('link', { name, exact: true });

  await page.goto('./');
  await rejectOptionalCookies(page);
  await expect(page.locator('html')).toHaveAttribute('lang', 'cs');
  await language('EN').click();
  await expect(page).toHaveURL(url('en/'));
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Less paperwork. More time for your work.');
  await page.getByRole('contentinfo').getByRole('link', { name: 'Examples', exact: true }).click();
  await expect(page).toHaveURL(url('en/ukazky/'));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Four situations\.\s*Four thoughtful solutions\./);

  await page.getByRole('main').getByRole('link', { name: /What needs fixing at home/ }).click();
  await expect(page).toHaveURL(url('en/ukazky/instalater/'));
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('link', { name: 'Česky', exact: true }).click();
  await expect(page).toHaveURL(url('ukazky/instalater/'));
  await expect(page.locator('html')).toHaveAttribute('lang', 'cs');
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL(url('en/ukazky/instalater/'));
  await page.getByRole('link', { name: 'Example demo', exact: true }).click();
  await expect(page).toHaveURL(url('en/ukazky/'));
  await language('CS').click();
  await expect(page).toHaveURL(url('ukazky/'));
  await expect(page.locator('html')).toHaveAttribute('lang', 'cs');
});
