import { expect, test } from '@playwright/test';

const slugs = ['instalater', 'sluzba', 'provozni-terminal', 'eshop'];

test('home and both galleries keep the four story portals in order', async ({ page, baseURL }) => {
  await page.route('**/api/**', route => route.abort());
  const expected = slugs.map(slug => new URL(`ukazky/${slug}/`, baseURL!).pathname);
  for (const path of ['./', 'en/', 'ukazky/', 'en/ukazky/']) {
    await page.goto(path);
    const portals = page.locator('.rq-minimal-preview__portal');
    await expect(portals).toHaveCount(4);
    expect(await portals.evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(expected);
    for (const portal of await portals.all()) await expect(portal).toHaveAccessibleName(/\S/);
  }
});

test('all four demos change local state and return to the English gallery without external actions', async ({ page, baseURL }) => {
  const unexpected: string[] = [];
  const origin = new URL(baseURL!).origin;
  await page.route('**/*', route => {
    const request = route.request();
    if (new URL(request.url()).origin !== origin || /\/api\//.test(request.url()) || !['GET', 'HEAD'].includes(request.method())) {
      unexpected.push(`${request.method()} ${request.url()}`);
      return route.abort();
    }
    return route.continue();
  });
  for (const slug of slugs) {
    await page.goto(`ukazky/${slug}/`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'cs');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    if (slug === 'instalater') {
      await page.getByLabel('Popište závadu (nepovinné)').fill('Pod dřezem kape voda.');
      await page.locator('[data-contact]').click();
      await expect(page.locator('[data-contact]')).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('[data-contact-summary]')).toContainText('Pod dřezem kape voda.');
    } else if (slug === 'sluzba') {
      await page.locator('[data-confirm]').click();
      await expect(page.locator('[data-status]')).toContainText('potvrzen');
    } else if (slug === 'provozni-terminal') {
      await page.locator('[data-done]').click();
      await expect(page.locator('[data-done-count]')).toHaveText('1 / 3');
      await expect(page.locator('[data-stock]')).toHaveText('3 desky');
    } else {
      await page.getByRole('button', { name: 'Do košíku', exact: true }).first().click();
      await expect(page.locator('[data-cart-count]')).toHaveText('1');
      await page.locator('[data-checkout]').click();
      await expect(page.locator('[data-checkout-message]')).toContainText('Modelová objednávka');
      await page.locator('[data-operator-open]').click();
      await expect(page.locator('[data-order-id]')).toBeVisible();
      await expect(page.locator('[data-order-id]')).toContainText('Objednávka');
    }
    await page.getByRole('link', { name: 'Examples in English', exact: true }).click();
    await expect(page).toHaveURL(new URL('en/ukazky/', baseURL!).href);
  }
  expect(unexpected).toEqual([]);
});
