import { expect, test } from '@playwright/test';

for (const locale of ['cs', 'en']) {
  const path = locale === 'cs' ? 'audit/' : 'en/audit/';
  const contact = locale === 'cs' ? '/#kontakt' : '/en/#kontakt';

  test.describe(`automatic check in ${locale}`, () => {
    test.beforeEach(async ({ context, baseURL }) => {
      const origin = new URL(baseURL!).origin;
      await context.route('**/*', route => {
        const url = new URL(route.request().url());
        return url.origin === origin && !url.pathname.startsWith('/api/')
          ? route.continue() : route.abort();
      });
    });

    test('explains empty input and offers contact when verification cannot load', async ({ page }) => {
      const api: string[] = [];
      page.on('request', request => {
        if (new URL(request.url()).pathname.startsWith('/api/')) api.push(request.url());
      });
      await page.goto(path);
      await page.locator('#rq-consent button[value="reject"]').click();
      const submit = page.locator('.audit-tool__submit');
      await submit.click();
      await expect(page.locator('.audit-tool__status')).toHaveAttribute('data-status', 'invalid_url');
      await page.locator('#audit-url').fill('example.org');
      await submit.click();
      await expect(page.locator('.audit-tool__status a')).toHaveAttribute('href', contact);
      expect(api).toEqual([]);
    });

    test.describe('with JavaScript disabled', () => {
      test.use({ javaScriptEnabled: false });
      test('provides a contact link and keeps the address out of the page URL', async ({ page }) => {
        await page.goto(path);
        await expect(page.locator('#audit-url')).toBeDisabled();
        await expect(page.locator('.audit-tool__submit')).toBeDisabled();
        await expect(page.locator('.audit-tool noscript a')).toBeVisible();
        await expect(page.locator('.audit-tool noscript a')).toHaveAttribute('href', contact);
        expect(new URL(page.url()).search).toBe('');
      });
    });
  });
}
