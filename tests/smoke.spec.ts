import { expect, test } from '@playwright/test';

// Never issue live leads, measurement or third-party requests from these checks.
test.beforeEach(async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  await page.route('**/*', route => {
    const request = route.request();
    return new URL(request.url()).origin !== origin || /\/api\//.test(request.url()) || request.method() === 'POST'
      ? route.abort() : route.continue();
  });
});

test('home keeps readable metadata, landmarks and a keyboard contact path', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Weby a automatizace, které usnadňují podnikání.');
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.locator('head title')).not.toHaveText('');
  await expect(page.locator('head meta[name="description"]')).toHaveAttribute('content', /\S/);
  const canonical = await page.locator('head link[rel="canonical"]').getAttribute('href');
  expect(new URL(canonical!).pathname).toBe(new URL(page.url()).pathname);
  await expect(page.locator('head meta[property="og:url"]')).toHaveAttribute('content', canonical!);
  const contact = page.locator('.rq-minimal-preview__cta');
  await contact.focus();
  await expect(contact).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#kontakt$/);
  await expect(page.locator('#rq-lead-name')).toBeVisible();
});

test('native form validation rejects empty fields and invalid email without POST', async ({ page }) => {
  const leadRequests: string[] = [];
  page.on('request', request => { if (request.method() === 'POST' && /\/api\/leads/.test(request.url())) leadRequests.push(request.url()); });
  await page.goto('kontakt/');
  const form = page.locator('#rq-lead-form');
  await expect(form.locator('[name="name"], [name="email"], [name="message"]')).toHaveCount(3);
  await expect(form.locator('[name="project_type"]')).not.toHaveAttribute('required');
  await form.getByRole('button', { name: 'Odeslat poptávku' }).click();
  expect(await form.evaluate(node => (node as HTMLFormElement).checkValidity())).toBe(false);
  await expect(form.locator('[name="name"]')).toBeFocused();
  await form.locator('[name="name"]').fill('Test visitor');
  await form.locator('[name="email"]').fill('invalid-email');
  await form.locator('[name="message"]').fill('Fixture only, never submit.');
  await form.getByRole('button', { name: 'Odeslat poptávku' }).click();
  expect(await form.locator('[name="email"]').evaluate(node => (node as HTMLInputElement).validity.typeMismatch)).toBe(true);
  await expect(form.locator('[name="email"]')).toBeFocused();
  expect(leadRequests).toEqual([]);
});
