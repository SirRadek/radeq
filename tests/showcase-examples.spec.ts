import { expect, rejectOptionalCookies, test } from './helpers/local-browser';

const slugs = ['instalater', 'sluzba', 'provozni-terminal', 'eshop'];
const locales = [
  { lang: 'cs', prefix: '', gallery: /Modelová ukázka|Další ukázky/, plumberLabel: 'Popište závadu (nepovinné)',
    symptom: 'Pod dřezem kape voda.', bookingReceipt: 'rezervace se neodeslala', stock: '3 desky',
    add: /do košíku/i, orderReceipt: 'Modelová objednávka', order: 'Objednávka' },
  { lang: 'en', prefix: 'en/', gallery: /Example demo|More examples/, plumberLabel: 'Describe the problem (optional)',
    symptom: 'Water is dripping under the sink.', bookingReceipt: 'no booking was sent', stock: '3 boards',
    add: /Add to basket/i, orderReceipt: 'Demo order', order: 'Order' },
];

for (const locale of locales) {
  const { lang, prefix } = locale;
  test(`${lang} home and gallery expose four localized story portals in order`, async ({ page, baseURL }) => {
    const expected = slugs.map(slug => new URL(`${prefix}ukazky/${slug}/`, baseURL!).pathname);
    await page.goto(prefix || './');
    await rejectOptionalCookies(page);
    const stories = page.locator('details.rq-showcase');
    await expect(stories).toHaveCount(4);
    for (const story of await stories.all()) await story.locator('summary').click();
    const homePortals = page.getByRole('main').locator('a.flow-example, a.secondary-example');
    await expect(homePortals).toHaveCount(4);
    expect(await homePortals.evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(expected);
    for (const portal of await homePortals.all()) await expect(portal).toHaveAccessibleName(/\S/);

    await page.goto(`${prefix}ukazky/`);
    const galleryPortals = page.getByRole('main').locator('a.rq-minimal-preview__portal');
    await expect(galleryPortals).toHaveCount(4);
    expect(await galleryPortals.evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(expected);
    for (const portal of await galleryPortals.all()) await expect(portal).toHaveAccessibleName(/\S/);
  });

  test(`${lang} model demos update local state and return to their gallery`, async ({ page, baseURL, blockedRequests }) => {
    const errors: Error[] = [];
    page.on('pageerror', error => errors.push(error));

    for (const slug of slugs) {
      await page.goto(`${prefix}ukazky/${slug}/`);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), slug)
        .toBeLessThanOrEqual(1);
      const blockedBefore = blockedRequests.length;

      if (slug === 'instalater') {
        await page.getByLabel(locale.plumberLabel).fill(locale.symptom);
        const contact = page.locator('[data-contact]');
        await contact.click();
        await expect(contact).toHaveAttribute('aria-expanded', 'true');
        await expect(page.locator('[data-contact-summary]')).toContainText(locale.symptom);
      } else if (slug === 'sluzba') {
        await page.locator('[data-confirm]').click();
        await expect(page.locator('[data-status]')).toContainText(locale.bookingReceipt);
      } else if (slug === 'provozni-terminal') {
        await page.locator('[data-done]').click();
        await expect(page.locator('[data-done-count]')).toHaveText('1 / 3');
        await expect(page.locator('[data-stock]')).toHaveText(locale.stock);
      } else {
        const addFirst = page.getByRole('button', { name: locale.add }).first();
        await expect(addFirst).toHaveText(locale.add);
        await addFirst.click();
        await expect(page.locator('[data-cart-count]')).toHaveText('1');
        await page.locator('[data-checkout]').click();
        await expect(page.locator('[data-checkout-message]')).toContainText(locale.orderReceipt);
        await page.locator('[data-operator-open]').click();
        await expect(page.locator('[data-order-id]')).toBeVisible();
        await expect(page.locator('[data-order-id]')).toContainText(locale.order);
      }
      expect(blockedRequests.slice(blockedBefore).map(request => `${request.method()} ${request.url()}`)).toEqual([]);
      await page.getByRole('link', { name: locale.gallery }).click();
      await expect(page).toHaveURL(new URL(`${prefix}ukazky/`, baseURL!).href);
    }

    expect(errors).toEqual([]);
  });
}
