import { expect, test } from '@playwright/test';

const publicRoutes = [
  { path: '/kontakt/', heading: 'Kontakt' },
  { path: '/sluzby/', heading: 'Služby' },
  { path: '/portfolio/', heading: 'Ukázky práce' },
  { path: '/soukromi/', heading: 'Soukromí a poptávky' },
];

const legalRoutes = [
  { path: '/podminky/', heading: 'Podmínky spolupráce' },
  { path: '/gdpr/', heading: 'GDPR a osobní údaje' },
  { path: '/cookies/', heading: 'Cookies a měření' },
];

for (const route of publicRoutes) {
  test(`${route.path} uses the current public shell`, async ({ page }) => {
    await page.goto(route.path);

    await expect(page.getByRole('heading', { name: route.heading, level: 1 })).toBeVisible();
    await expect(page.locator('.command-nav')).toBeVisible();
    await expect(page.locator('#terminal')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Probrat můj problém' })).toBeVisible();
    await expect(page.locator('.command-nav').getByRole('link', { name: 'Služby' })).toHaveAttribute(
      'href',
      '/#services',
    );
    await expect(page.locator('main a[href*="/demo/"]')).toHaveCount(0);
  });
}

for (const route of legalRoutes) {
  test(`${route.path} exposes the legal information shell`, async ({ page }) => {
    await page.goto(route.path);

    await expect(page.getByRole('heading', { name: route.heading, level: 1 })).toBeVisible();
    await expect(page.locator('.command-nav')).toBeVisible();
    await expect(page.getByRole('link', { name: /Napsat/ })).toBeVisible();
    await expect(page.locator('#terminal')).toHaveCount(0);
    await expect(page.locator('.site-footer')).toContainText('info@radeq.cz');
    await expect(page.locator('main a[href*="/demo/"]')).toHaveCount(0);
  });
}

test('new public routes fit mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const route of publicRoutes) {
    await page.goto(route.path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow, `${route.path} has horizontal overflow`).toBe(false);
  }

  for (const route of legalRoutes) {
    await page.goto(route.path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow, `${route.path} has horizontal overflow`).toBe(false);
  }
});

test('sitemap exposes the public route pages', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  const sitemapText = await sitemap.text();

  for (const route of [...publicRoutes, ...legalRoutes]) {
    expect(sitemapText).toContain(`<loc>https://radeq.cz${route.path}</loc>`);
  }
});
