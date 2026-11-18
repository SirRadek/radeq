import { expect, test as base, type BrowserContext, type Page, type Request } from '@playwright/test';

export async function isolateBrowser(
  context: BrowserContext,
  baseURL: string,
  onBlocked?: (request: Request) => void,
) {
  const origin = new URL(baseURL).origin;
  await context.route('**/*', route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin === origin && ['GET', 'HEAD'].includes(request.method()) && !/^\/api(?:\/|$)/i.test(url.pathname)) {
      return route.continue();
    }
    onBlocked?.(request);
    return route.abort();
  });
}

export const test = base.extend<{ blockedRequests: Request[] }>({
  blockedRequests: [async ({ context, baseURL }, use) => {
    const blocked: Request[] = [];
    await isolateBrowser(context, baseURL!, request => blocked.push(request));
    await use(blocked);
  }, { auto: true }],
});

export async function rejectOptionalCookies(page: Page) {
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: /^(Reject optional|Odmítnout volitelné)$/ }).click();
  await expect(dialog).toBeHidden();
}

export { expect };
