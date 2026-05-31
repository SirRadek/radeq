import { expect, test } from '@playwright/test';

test('Czech and English routes expose localized first viewport and matrix copy', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'cs');
  await expect(
    page.getByRole('heading', { name: 'Web, kterému zákazník rozumí na první scroll.' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'EN', exact: true })).toHaveAttribute('href', '/en/');
  await expect(page.getByRole('heading', { name: 'Co umíme postavit a vylepšit.' })).toBeVisible();

  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(
    page.getByRole('heading', { name: 'A website buyers understand on the first scroll.' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What we can build and improve.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'CZ', exact: true })).toHaveAttribute('href', '/');

  await page.goto('/en/demo/admin-dashboard/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { name: 'Team overview' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Team overview/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'CZ', exact: true })).toHaveAttribute('href', '/demo/admin-dashboard/');
});
