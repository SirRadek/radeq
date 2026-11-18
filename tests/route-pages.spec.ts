import { expect, rejectOptionalCookies, test } from './helpers/local-browser';

const locales = [
  {
    lang: 'cs', prefix: '', gallery: 'Ukázky', services: 'Služby', desktopNav: 'Hlavní navigace', mobileNav: 'Mobilní navigace',
    routes: [
      ['./', 'Méně papírování. Více času na vaši práci.'], ['kontakt/', 'Napište mi'],
      ['sluzby/', 'Co pro vás udělám'], ['soukromi/', 'Soukromí a cookies'],
    ],
  },
  {
    lang: 'en', prefix: 'en/', gallery: 'Examples', services: 'Services', desktopNav: 'Main navigation', mobileNav: 'Mobile navigation',
    routes: [
      ['', 'Less paperwork. More time for your work.'], ['kontakt/', 'Get in touch'],
      ['sluzby/', "What I'll do for you"], ['soukromi/', 'Privacy and cookies'],
    ],
  },
];

for (const { lang, prefix, gallery, services, desktopNav, mobileNav, routes } of locales) {
  test(`${lang} public pages preserve landmarks, navigation and viewport readability`, async ({ page, baseURL, isMobile }) => {
    for (const [path, heading] of routes) {
      const response = await page.goto(prefix + path);
      expect(response?.status(), prefix + path).toBe(200);
      if (path === routes[0][0]) await rejectOptionalCookies(page);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.getByRole('main').getByRole('heading', { name: heading, level: 1 })).toBeVisible();
      await expect(page.getByRole('contentinfo').getByRole('link', { name: gallery, exact: true }))
        .toHaveAttribute('href', new URL(`${prefix}ukazky/`, baseURL!).pathname);
      await expect(page.locator('head meta[name="description"]')).toHaveAttribute('content', /\S/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), prefix + path)
        .toBeLessThanOrEqual(1);
    }

    const header = page.getByRole('banner');
    const menu = header.getByText('Menu', { exact: true });
    if (isMobile) await menu.click();
    const nav = header.getByRole('navigation', { name: isMobile ? mobileNav : desktopNav });
    await nav.getByRole('link', { name: services, exact: true }).click();
    await expect(page).toHaveURL(new URL(`${prefix}#sluzby`, baseURL!).href);
    await expect(page.locator('#sluzby')).toBeVisible();
    if (isMobile) await expect(header.locator('details')).not.toHaveAttribute('open');
  });
}

test('legacy portfolio URL leads to the Czech gallery', async ({ page, baseURL }) => {
  await page.goto('portfolio/');
  await expect(page).toHaveURL(new URL('ukazky/', baseURL!).href);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Čtyři situace\.\s*Čtyři promyšlená řešení\./);
});
