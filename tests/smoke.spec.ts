import { expect, rejectOptionalCookies, test } from './helpers/local-browser';

const locales = [
  { path: '', heading: 'Méně papírování. Více času na vaši práci.', cta: 'Probrat projekt', submit: 'Odeslat poptávku' },
  { path: 'en/', heading: 'Less paperwork. More time for your work.', cta: 'Discuss your project', submit: 'Send enquiry' },
];

for (const { path, heading, cta, submit } of locales) {
  test.describe(`${path || 'CS'} contact before client initialization`, () => {
    test.use({ javaScriptEnabled: false });
    test('offers email and keeps the JSON form inactive on both entry points', async ({ page, blockedRequests }) => {
      for (const route of [path || './', `${path}kontakt/`]) {
        await page.goto(route);
        const form = page.locator('#rq-lead-form');
        const email = page.locator('#rq-lead-fallback a');
        await expect(form).toBeHidden();
        await expect(form.locator('[type=submit]')).toBeDisabled();
        await expect(email).toBeVisible();
        await expect(email).toHaveAttribute('href', /^mailto:.+@radeq\.cz$/);
      }
      expect(blockedRequests.filter(request => request.method() === 'POST')).toEqual([]);
    });
  });

  test(`${path || 'CS'} home keeps readable metadata, landmarks and a keyboard contact path`, async ({ page }) => {
    await page.goto(path || './');
    await rejectOptionalCookies(page);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page).toHaveTitle(/\S/);
    await expect(page.locator('head meta[name="description"]')).toHaveAttribute('content', /\S/);
    const canonical = await page.locator('head link[rel="canonical"]').getAttribute('href');
    expect(new URL(canonical!).pathname).toBe(new URL(page.url()).pathname);
    await expect(page.locator('head meta[property="og:url"]')).toHaveAttribute('content', canonical!);
    const contact = page.getByRole('link', { name: cta, exact: true });
    await contact.focus();
    await expect(contact).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#kontakt$/);
    await expect(page.locator('#rq-lead-name')).toBeVisible();
    await expect(page.locator('#rq-lead-fallback')).toBeHidden();
  });

  test(`${path || 'CS'} native form validation rejects empty fields and invalid email without POST`, async ({ page, blockedRequests }) => {
    await page.goto(`${path}kontakt/`);
    await rejectOptionalCookies(page);
    const form = page.locator('#rq-lead-form');
    await expect(form.locator('[name="name"], [name="email"], [name="message"]')).toHaveCount(3);
    await expect(form.locator('[name="project_type"]')).not.toHaveAttribute('required');
    const submitButton = form.getByRole('button', { name: submit, exact: true });
    await submitButton.click();
    expect(await form.evaluate(node => (node as HTMLFormElement).checkValidity())).toBe(false);
    await expect(form.locator('[name="name"]')).toBeFocused();
    await form.locator('[name="name"]').fill('Test visitor');
    await form.locator('[name="email"]').fill('invalid-email');
    await form.locator('[name="message"]').fill('Local browser test');
    await submitButton.click();
    expect(await form.locator('[name="email"]').evaluate(node => (node as HTMLInputElement).validity.typeMismatch)).toBe(true);
    await expect(form.locator('[name="email"]')).toBeFocused();
    expect(blockedRequests.filter(request => request.method() === 'POST')).toEqual([]);
  });
}
