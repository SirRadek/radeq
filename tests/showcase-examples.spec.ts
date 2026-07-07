import { expect, test } from '@playwright/test';

const showcaseRoutes = [
  { path: '/ukazky/', heading: 'Ukázky praktických řešení pro web, poptávky a ruční práci' },
  { path: '/ukazky/automatizace/', heading: 'Automatizace, která ubere ruční přepisování' },
  { path: '/ukazky/nabidka-eshop/', heading: 'Nabídka, která zkracuje rozhodování' },
];

test('showcase pages are static-readable and SEO-indexable', async ({ page }) => {
  for (const route of showcaseRoutes) {
    await page.goto(route.path);
    await expect(page.locator('html')).toHaveAttribute('lang', 'cs');
    await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', `https://radeq.cz${route.path}`);
    await expect(page.locator('head link[rel="alternate"][hreflang="en"]')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: route.heading })).toBeVisible();
    await expect(page.locator('.style-toggle')).toHaveCount(0);
    await expect(page.locator('#matrix')).toHaveCount(0);
    await expect(page.locator('#terminal')).toBeVisible();
  }
});

test('stored demo style does not affect showcase pages', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('radeq-style-variant', 'variant-d');
  });

  await page.goto('/ukazky/automatizace/');
  await expect(page.locator('html')).toHaveAttribute('data-style', 'variant-a');
  await expect(page.locator('html')).toHaveAttribute('data-style-source', 'fixed');
  await expect(page.locator('.style-toggle')).toHaveCount(0);
});

test('chatbot guide is rule-based and does not submit data before handoff', async ({ page }) => {
  const apiRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/api/leads')) {
      apiRequests.push(request.url());
    }
  });

  await page.goto('/ukazky/chatbot/');
  await expect(page.getByRole('heading', { name: 'Co potřebuje vaše auto?' })).toBeVisible();
  // Rule-based decision tree rendered in-browser: options, not a free-text field.
  await expect(page.locator('.guide textarea')).toHaveCount(0);
  await expect(page.locator('.guide input')).toHaveCount(0);
  await page.getByRole('button', { name: 'STK a emise' }).click();
  await page.getByRole('button', { name: 'Jen se chci připravit' }).click();
  // A prepared answer + explicit-action CTA appears; nothing is submitted automatically.
  await expect(page.getByRole('link', { name: 'Objednat termín' })).toBeVisible();
  expect(apiRequests).toHaveLength(0);
  await page.getByRole('button', { name: 'Začít znovu' }).click();
  await expect(page.getByRole('button', { name: 'STK a emise' })).toBeVisible();
  expect(apiRequests).toHaveLength(0);
});

test('showcase pages avoid payment and sensitive-data prompts', async ({ page }) => {
  const forbiddenVisibleText = [/platební karta/i, /rodné číslo/i, /api klíč/i, /heslo/i, /zadejte přístup/i];

  for (const route of showcaseRoutes) {
    await page.goto(route.path);
    for (const pattern of forbiddenVisibleText) {
      await expect(page.getByText(pattern)).toHaveCount(0);
    }
  }

  await page.goto('/ukazky/nabidka-eshop/');
  await expect(page.getByText('není závazná objednávka')).toBeVisible();
  await expect(page.getByText('Nezadávají se platební')).toBeVisible();
});

test('showcase pages fit mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 920 });

  for (const route of showcaseRoutes) {
    await page.goto(route.path);
    const hasOverflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth + 1);
    expect(hasOverflow).toBe(false);
  }
});

test('showcase typography stays compact and scannable', async ({ page }) => {
  await page.goto('/ukazky/');
  const heroFontSize = await page.locator('.showcase-hero h1').evaluate((element) => {
    return Number.parseFloat(window.getComputedStyle(element).fontSize);
  });
  const cardHeadingFontSize = await page.locator('.showcase-card h2').first().evaluate((element) => {
    return Number.parseFloat(window.getComputedStyle(element).fontSize);
  });

  expect(heroFontSize).toBeLessThanOrEqual(46);
  expect(cardHeadingFontSize).toBeLessThanOrEqual(20);

  await page.setViewportSize({ width: 390, height: 920 });
  await page.goto('/ukazky/');
  const mobileHeroFontSize = await page.locator('.showcase-hero h1').evaluate((element) => {
    return Number.parseFloat(window.getComputedStyle(element).fontSize);
  });

  expect(mobileHeroFontSize).toBeLessThanOrEqual(32);
});

test('sitemap exposes the showcase routes', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  const sitemapText = await sitemap.text();

  expect(sitemapText).toContain('<loc>https://radeq.cz/ukazky/</loc>');
  expect(sitemapText).toContain('<loc>https://radeq.cz/ukazky/chatbot/</loc>');
  expect(sitemapText).toContain('<loc>https://radeq.cz/ukazky/automatizace/</loc>');
  expect(sitemapText).toContain('<loc>https://radeq.cz/ukazky/nabidka-eshop/</loc>');
});
