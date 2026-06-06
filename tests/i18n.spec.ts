import { expect, test } from '@playwright/test';

test('Czech and English routes expose localized first viewport and matrix copy', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'cs');
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', 'https://radeq.cz/');
  await expect(page.locator('head link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://radeq.cz/en/');
  await expect(
    page.getByRole('heading', { name: 'Nabídka, kterou si zákazník projde na první scroll bez slovníku.' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'EN', exact: true })).toHaveAttribute('href', '/en/');
  await expect(page.getByRole('heading', { name: 'Vyberte, kde se zákazník ztrácí.' })).toBeVisible();

  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', 'https://radeq.cz/en/');
  await expect(page.locator('head link[rel="alternate"][hreflang="cs"]')).toHaveAttribute('href', 'https://radeq.cz/');
  await expect(
    page.getByRole('heading', { name: 'An offer buyers understand on the first scroll without a glossary.' }),
  ).toBeVisible();
  await expect(page.locator('.style-toggle__trigger')).toHaveAccessibleName('Themes: Clear Map');
  await page.locator('.style-toggle__trigger').click();
  await expect(page.getByRole('menuitemradio', { name: /^B \/ Cat Guide/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('heading', { name: 'Choose where the buyer gets stuck.' })).toBeVisible();
  await expect(page.locator('.command-nav').getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about');
  await expect(
    page.getByRole('heading', { name: 'A small studio. Direct communication. Work you understand.' }),
  ).toBeVisible();
  await expect(page.locator('.about-services__profile dl > div')).toHaveCount(3);
  await expect(page.getByRole('link', { name: 'Shop demo', exact: true })).toHaveAttribute(
    'href',
    '/en/demo/service-landing/',
  );
  await expect(page.locator('main a[href*="/en/demo/"]:not([href$="/en/demo/service-landing/"])')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'CZ', exact: true })).toHaveAttribute('href', '/');

  await page.goto('/en/demo/service-landing/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { name: 'Shop preview' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Choose a build without decoding specifications.' })).toBeVisible();
  await expect(page.locator('.matrix-control-group--modules')).toHaveCount(0);
  await expect(page.locator('.matrix-preview--shop')).toHaveAttribute('data-module', 'service-landing');
  await expect(page.locator('.shop-product')).toHaveCount(3);
  await expect(page.getByRole('button', { name: 'Add to cart' })).toHaveCount(3);
  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await expect(page.getByRole('link', { name: 'Request this build' })).toBeVisible();
  await expect(page.getByText('This preview does not place an order or process payment.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'CZ', exact: true })).toHaveAttribute('href', '/demo/service-landing/');
});
