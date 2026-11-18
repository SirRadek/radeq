import { expect, test } from '@playwright/test';

test.beforeEach(async ({ context, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  await context.route('**/*', route => {
    const request = route.request();
    const url = new URL(request.url());
    return url.origin === origin && !url.pathname.includes('/api/') && ['GET', 'HEAD'].includes(request.method())
      ? route.continue()
      : route.abort();
  });
});

const locales = {
  cs: {
    prefix: '',
    jobs: 'DNEŠNÍ POŘADÍ', done: 'Hotovo → další', undo: 'Vrátit poslední dokončení', restart: 'Začít den znovu',
    coffee: 'Mlýnské espresso', basket: 'Ještě jeden šálek?', add: 'Do košíku', another: 'Přidat další',
    single: '1 ks', double: '2 ks', increase: 'Zvýšit počet:', decrease: 'Snížit počet:', remove: 'Odebrat položku:',
    added: 'přidáno do košíku.', quantity: (count: string) => `v košíku ${count}.`, removed: 'odebráno z košíku.', empty: 'Košík je zatím prázdný.',
    checkout: 'Vytvořit modelovou objednávku',
    selection: 'Váš výběr', confirm: 'Potvrdit modelový výběr', confirmed: 'Modelově potvrzeno', reset: 'Vrátit výchozí výběr',
    confirmation: 'Modelový výběr potvrzen pouze zde; rezervace se neodeslala.', unconfirmed: 'Vybráno. Zatím nepotvrzeno.',
    description: 'Popište závadu (nepovinné)', staticNote: /Výběr a shrnutí vyžadují JavaScript/,
    leak: 'Voda teče', leakHeading: 'Netěsnosti a odpady', openContact: 'Kontakt v ukázce',
    services: 'Od kapky po výměnu', contact: 'Typ problému zatím nevybrán.',
  },
  en: {
    prefix: 'en/',
    jobs: 'TODAY’S JOBS', done: 'Done → next', undo: 'Undo last completion', restart: 'Restart the day',
    coffee: 'Mill espresso', basket: 'One more cup?', add: 'Add to basket', another: 'Add another',
    single: '1 pack', double: '2 packs', increase: 'Increase quantity:', decrease: 'Decrease quantity:', remove: 'Remove item:',
    added: 'added to basket.', quantity: (count: string) => `${count} in the basket.`, removed: 'removed from the basket.', empty: 'Your basket is empty.',
    checkout: 'Create demo order',
    selection: 'Your selection', confirm: 'Confirm demo selection', confirmed: 'Confirmed in demo', reset: 'Reset selection',
    confirmation: 'Demo selection confirmed only here; no booking was sent.', unconfirmed: 'Selected. Not yet confirmed.',
    description: 'Describe the problem (optional)', staticNote: /Selection and summaries require JavaScript/,
    leak: 'A leak', leakHeading: 'Leaks and drains', openContact: 'Explore the contact step',
    services: 'From a drip to a replacement', contact: 'No problem type selected yet.',
  },
};

for (const [lang, copy] of Object.entries(locales)) {
  test(`${lang} workshop treats a double click and held Enter as single actions`, async ({ page }) => {
    await page.goto(`${copy.prefix}ukazky/provozni-terminal/`);
    const jobs = page.getByRole('region', { name: copy.jobs });
    const done = page.getByRole('button', { name: copy.done, exact: true });
    const undo = page.getByRole('button', { name: copy.undo, exact: true });

    await done.dblclick();
    await expect(jobs.getByText('1 / 3', { exact: true })).toBeVisible();

    await done.focus();
    await page.keyboard.down('Enter');
    await page.keyboard.down('Enter');
    await page.keyboard.up('Enter');
    await expect(jobs.getByText('2 / 3', { exact: true })).toBeVisible();

    await page.keyboard.down('Enter');
    await page.keyboard.down('Enter');
    await page.keyboard.up('Enter');
    await expect(jobs.getByText('3 / 3', { exact: true })).toBeVisible();
    await expect(undo).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(jobs.getByText('2 / 3', { exact: true })).toBeVisible();
    await expect(done).toBeFocused();

    await page.getByRole('button', { name: copy.restart, exact: true }).click();
    await expect(done).toBeFocused();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await expect(jobs.getByText('2 / 3', { exact: true })).toBeVisible();
  });

  test(`${lang} coffee announces the current basket and includes the visible add label in its name`, async ({ page }) => {
    await page.goto(`${copy.prefix}ukazky/eshop/`);
    const product = page.getByRole('article').filter({ has: page.getByRole('heading', { name: copy.coffee, exact: true }) });
    const add = product.getByRole('button');
    const basket = page.getByRole('region', { name: copy.basket, exact: true });
    const message = basket.getByRole('status');
    const item = `${copy.coffee}, 250 g`;

    await expect(add).toHaveText(copy.add);
    await expect(add).toHaveAccessibleName(`${copy.add}: ${item}`);
    await add.click();
    await expect(message).toHaveText(`${item}: ${copy.added}`);
    const another = `${copy.another} · ${copy.single}`;
    await expect(add).toHaveText(another);
    await expect(add).toHaveAccessibleName(`${another}: ${item}`);

    await basket.getByRole('button', { name: `${copy.increase} ${item}`, exact: true }).click();
    await expect(message).toHaveText(`${item}: ${copy.quantity(copy.double)}`);
    await expect(add).toHaveAccessibleName(`${copy.another} · ${copy.double}: ${item}`);
    await basket.getByRole('button', { name: `${copy.decrease} ${item}`, exact: true }).click();
    await expect(message).toHaveText(`${item}: ${copy.quantity(copy.single)}`);
    await basket.getByRole('button', { name: `${copy.remove} ${item}`, exact: true }).click();
    await expect(message).toHaveText(`${item}: ${copy.removed}`);
    await expect(basket.getByText(copy.empty, { exact: true })).toBeVisible();
    await expect(basket.getByRole('button', { name: copy.checkout, exact: true })).toBeDisabled();
    await expect(add).toHaveAccessibleName(`${copy.add}: ${item}`);
  });

  test(`${lang} booking focuses the confirmation and tabs to reset`, async ({ page }) => {
    await page.goto(`${copy.prefix}ukazky/sluzba/`);
    const selection = page.getByRole('region', { name: copy.selection });
    const message = selection.getByRole('status');
    const reset = selection.getByRole('button', { name: copy.reset, exact: true });

    await selection.getByRole('button', { name: copy.confirm, exact: true }).press('Enter');
    await expect(message).toContainText(copy.confirmation);
    await expect(message).toBeFocused();
    await expect(selection.getByRole('button', { name: copy.confirmed, exact: true })).toBeDisabled();
    await page.keyboard.press('Tab');
    await expect(reset).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(message).toHaveText(copy.unconfirmed);
    await expect(selection.getByRole('button', { name: copy.confirm, exact: true })).toBeEnabled();
  });

  test(`${lang} plumber enables the inputs and renders the local contact summary`, async ({ page }) => {
    await page.goto(`${copy.prefix}ukazky/instalater/`);
    await page.getByRole('radio', { name: copy.leak, exact: true }).check();
    await expect(page.getByRole('heading', { name: copy.leakHeading, exact: true })).toBeVisible();
    const details = lang === 'en' ? 'Water dripping under the sink.' : 'Pod dřezem kape voda.';
    await page.getByRole('textbox', { name: copy.description, exact: true }).fill(details);
    await page.getByRole('button', { name: copy.openContact, exact: true }).click();
    await expect(page.getByText(`${copy.leakHeading} · ${details}`, { exact: true })).toBeVisible();
  });

  test.describe(`${lang} static demos`, () => {
    test.use({ javaScriptEnabled: false });

    test('plumber keeps the service and contact explanation readable with disabled inputs', async ({ page }) => {
      await page.goto(`${copy.prefix}ukazky/instalater/`);
      const radios = page.getByRole('radio');
      await expect(radios).toHaveCount(3);
      for (const radio of await radios.all()) await expect(radio).toBeDisabled();
      await expect(page.getByRole('textbox', { name: copy.description, exact: true })).toBeDisabled();
      await expect(page.getByText(copy.staticNote)).toBeVisible();
      await expect(page.getByRole('heading', { name: copy.services, exact: true })).toBeVisible();
      await expect(page.getByText(copy.contact, { exact: true })).toBeVisible();
    });
  });
}

test.describe('English static workshop', () => {
  test.use({ javaScriptEnabled: false });

  test('renders the initial job title in English', async ({ page }) => {
    await page.goto('en/ukazky/provozni-terminal/');
    const job = page.getByRole('region', { name: 'SAND THE EDGES', exact: true });
    await expect(job.getByText('D-024 · oak shelf', { exact: true })).toBeVisible();
  });
});

const legacyDemos = {
  instalater: 'What needs fixing at home?',
  sluzba: 'What time suits you?',
  'provozni-terminal': 'DAY SHEET',
};

for (const [slug, heading] of Object.entries(legacyDemos)) {
  test(`legacy ${slug} follows from=en within the build base and keeps the fragment`, async ({ page, baseURL }) => {
    await page.goto(`minimalni-navrh/ukazky/${slug}/?from=en#demo`);
    await expect(page).toHaveURL(new URL(`en/ukazky/${slug}/#demo`, baseURL!).href);
    await expect(page.getByRole('heading', { name: heading, level: 1, exact: true })).toBeVisible();
    await page.goto(`minimalni-navrh/ukazky/${slug}/`);
    await expect(page).toHaveURL(new URL(`minimalni-navrh/ukazky/${slug}/`, baseURL!).href);
    await expect(page.locator('html')).toHaveAttribute('lang', 'cs');
  });
}

test('modern English compatibility keeps the service anchor', async ({ page, baseURL }) => {
  await page.goto('ukazky/eshop/?from=en');
  await expect(page).toHaveURL(new URL('en/ukazky/eshop/', baseURL!).href);
  await expect(page.getByRole('link', { name: '← Back to this service on RadeQ' }))
    .toHaveAttribute('href', new URL('en/#sluzba-eshop', baseURL!).pathname + '#sluzba-eshop');
});
