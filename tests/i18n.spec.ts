import { expect, test } from '@playwright/test';

test('Czech and English routes expose localized first viewport and matrix copy', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'cs');
  await expect(
    page.getByRole('heading', { name: 'Weby, které vypadají dobře, rychle se hýbou a pomáhají prodávat.' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'EN', exact: true })).toHaveAttribute('href', '/en/');

  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(
    page.getByRole('heading', { name: 'Websites that look sharp, move smoothly, and help sell.' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: /Team overview/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'CZ', exact: true })).toHaveAttribute('href', '/');
});
