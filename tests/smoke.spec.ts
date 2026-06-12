import { expect, test, type Page } from '@playwright/test';

async function selectTheme(page: Page, name: RegExp) {
  const trigger = page.locator('.style-toggle__trigger');

  if ((await trigger.getAttribute('aria-expanded')) !== 'true') {
    await trigger.click();
  }

  await page.getByRole('menuitemradio', { name }).click();
}

test('homepage core flow works', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Web pro malé firmy, kterému rozumíte vy i vaši zákazníci.' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Weby' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ukázky' })).toHaveAttribute('href', '/ukazky/');
  await expect(page.getByRole('link', { name: 'Ceny' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'O nás' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'E-shop demo', exact: true })).toHaveCount(0);
  await expect(page.locator('.style-toggle')).toHaveCount(0);
  await expect(page.locator('#matrix')).toHaveCount(0);
  await expect(page.locator('#services')).toBeVisible();
  await expect(page.locator('.offer-map')).toBeVisible();
  await expect(page.getByText('Nejdřív cíl. Potom struktura. Až pak stavba.')).toBeVisible();
  await expect(page.locator('.service-card')).toHaveCount(3);
  await expect(page.locator('.service-addon-card')).toHaveCount(5);
  await expect(page.getByRole('heading', { name: 'Nejdřív vybereme správnou cestu k webu.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Doplňkově pomohu i s provozem okolo webu.' })).toBeVisible();
  await expect(page.locator('main a[href*="/demo/"]')).toHaveCount(0);
  await expect(page.locator('main a[href*="/ukazky/"]')).toHaveCount(0);
  await expect(page.getByText('WordPress servis a opravy')).toHaveCount(0);

  await expect(page.locator('#pricing')).toBeVisible();
  await expect(page.locator('.pricing-card')).toHaveCount(4);
  await expect(page.getByRole('heading', { name: 'Ceny ukazuji dopředu, aby bylo jasné, o jakém rozsahu se bavíme.' })).toBeVisible();
  await expect(page.locator('.pricing-section').getByRole('heading', { name: 'Audit webu s plánem' })).toBeVisible();
  await expect(page.getByText('2 900-4 900 Kč')).toBeVisible();
  await expect(page.locator('.pricing-section').getByRole('link', { name: 'Začít auditem' })).toBeVisible();

  await expect(page.locator('.theme-toggle')).toHaveAttribute('data-hydrated', 'true');
  await expect(page.locator('.theme-toggle__coin')).toBeVisible();
  await expect(page.locator('.theme-toggle__face--light')).toHaveCount(1);
  await expect(page.locator('.theme-toggle__face--dark')).toHaveCount(1);
  await expect(page.locator('.theme-toggle__star')).toHaveCount(3);
  await expect(page.getByRole('switch', { name: /Světlý/ })).toHaveAttribute('aria-checked', 'false');
  await page.getByRole('switch', { name: /Světlý/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('switch', { name: /Tmavý/ })).toHaveAttribute('aria-checked', 'true');
  await page.getByRole('switch', { name: /Tmavý/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('html')).toHaveAttribute('data-motion-ready', /true|reduced/);
  await expect(page.locator('html')).toHaveAttribute('data-motion-scene', /top|services|pricing|handoff|terminal/);

  await page.goto('/demo/service-landing/');
  await expect(page).toHaveURL(/\/demo\/service-landing\/$/);
  await expect(page.locator('#matrix')).toHaveAttribute('data-hydrated', 'true');
  await expect(page.locator('.style-toggle')).toHaveAttribute('data-hydrated', 'true');
  await expect(page.getByRole('heading', { name: 'E-shop ukázka' })).toBeVisible();
  await expect(page.locator('.matrix-control-group--modules')).toHaveCount(0);
  await expect(page.locator('.module-style-picker')).toHaveCount(0);
  await expect(page.locator('.style-chip')).toHaveCount(0);
  await expect(page.locator('.matrix-preview')).toHaveAttribute('data-module', 'service-landing');
  await expect(page.locator('.matrix-preview')).toHaveClass(/matrix-preview--shop/);
  await expect(page.locator('.shop-product')).toHaveCount(3);
  await expect(page.locator('.shop-product__price')).toHaveCount(3);
  const shopProductNames = await page.locator('.shop-product h4').allTextContents();

  for (const style of [
    /^B \/ Kočičí průvodce/,
    /^C \/ Studio důkazů/,
    /^D \/ Demo světy/,
    /^A \/ Jasná mapa/,
  ]) {
    await selectTheme(page, style);
    await expect(page.locator('.matrix-preview')).toHaveAttribute('data-module', 'service-landing');
    await expect(page.locator('.matrix-preview')).toHaveClass(/matrix-preview--shop/);
    await expect(page.locator('.shop-product h4')).toHaveText(shopProductNames);
  }

  await expect(page.locator('.shop-compare__items > div')).toHaveCount(2);
  await expect(page.locator('.shop-cart')).toHaveAttribute('aria-live', 'polite');
  await page.locator('.shop-action--primary').first().click();
  await expect(page.locator('.matrix-preview')).toHaveAttribute('data-cart-state', 'selected');
  await expect(page.locator('.shop-cart h4')).toHaveText('Focus Mini');
  await expect(page.getByRole('link', { name: 'Nezávazně poptat sestavu' })).toBeVisible();
  await page.locator('.shop-product').nth(2).getByRole('button', { name: 'Porovnat' }).click();
  await expect(page.locator('.shop-compare__items')).toContainText('Upgrade Kit');

  await page.goto('/');
  await expect(page.locator('#about')).toBeVisible();
  await expect(page.locator('.command-nav').getByRole('link', { name: 'O nás' })).toHaveAttribute('href', '#about');
  await expect(
    page.getByRole('heading', { name: 'Jeden člověk pro obsah, techniku i klidné vysvětlení.' }),
  ).toBeVisible();
  await expect(page.locator('.about-services__profile dl > div')).toHaveCount(3);
  await expect(page.getByText('Jeden kontakt')).toBeVisible();
  await expect(page.getByText('S čím pomohu kromě nového webu')).toBeVisible();
  await expect(page.getByText('Rychlá pomoc se starším webem')).toBeVisible();
  await expect(page.getByText('Formuláře, data a jednoduché AI pomocníky')).toBeVisible();

  await expect(page.locator('#brief-name[name="name"]')).toHaveCount(1);
  await expect(page.locator('#brief-email[name="email"]')).toHaveCount(1);
  await expect(page.locator('#brief-project_type[name="project_type"]')).toHaveCount(1);
  await expect(page.locator('#brief-message[name="message"]')).toHaveCount(1);
  await expect(page.locator('form[aria-describedby="brief-required-note"]')).toHaveCount(1);
  await expect(page.getByText('Pole označená jako povinná je potřeba vyplnit.')).toBeVisible();
  await page.getByRole('button', { name: 'Odeslat poptávku' }).click();
  await expect(page.locator('.brief-field__error')).toHaveCount(4);
  await expect(page.locator('#brief-name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#brief-name')).toBeFocused();
  await expect(page.getByRole('alert')).toContainText('Doplňte prosím');

  await page.getByRole('textbox', { name: 'Jméno' }).fill('Jan Siroky');
  await page.getByRole('textbox', { name: 'E-mail' }).fill('jan@');
  await page.getByRole('combobox', { name: 'Typ projektu' }).selectOption('Formuláře, data a automatizace');
  await page.getByRole('textbox', { name: 'Zpráva' }).fill('Potřebuji zjednodušit poptávkovou cestu.');
  await page.getByRole('button', { name: 'Odeslat poptávku' }).click();
  await expect(page.locator('#brief-email')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#brief-email-error')).toContainText('Zadejte platnou e-mailovou adresu.');
  await expect(page.locator('#brief-email')).toBeFocused();
  await page.getByRole('textbox', { name: 'E-mail' }).fill('jan@example.com');
  await expect(page.getByText('Typ projektu: Formuláře, data a automatizace')).toBeVisible();
  await expect(page.getByText('Zpráva: Potřebuji zjednodušit poptávkovou cestu.')).toBeVisible();

  await page.goto('/');
  await page.getByRole('button', { name: 'Spustit kočičku' }).click();
  await expect(page.getByRole('button', { name: 'Spustit kočičku' })).toHaveCount(0);
  const mascot = page.locator('.core-canvas');
  await expect(page.locator('.core-canvas canvas')).toBeVisible();
  await expect(mascot).toHaveAttribute('data-model-source', /local:\/\/radeq-ginger-ghost/);
  await expect(mascot).toHaveAttribute('data-model-provenance', 'project-owned-generated');
  await expect(mascot).toHaveAttribute('data-model-loading-strategy', 'user-activated-progressive-enhancement');
  await expect(mascot).toHaveAttribute('data-model-seo-role', 'decorative-helper');
  await expect(mascot).toHaveAttribute('data-model-bytes', '775080');
  await expect(mascot).toHaveAttribute('data-model-budget-bytes', '1200000');
  await expect(mascot).toHaveAttribute('data-cat-rig-version', /custom-contract-v1|legacy-quaternius-v1/);
  await expect(mascot).toHaveAttribute('data-cat-rig-quality', /contract|legacy|partial/);
  await expect(mascot).toHaveAttribute('data-cat-texture', 'procedural-tabby-v1');
  await expect(mascot).toHaveAttribute('data-cat-motion', 'platform');
  await expect(mascot).toHaveAttribute('data-cat-scene', /top|services|pricing|terminal|handoff|section/);
  await expect(mascot).toHaveAttribute('data-cat-facing', /left|right/);
  await expect(mascot).toHaveAttribute('data-cat-hunt-state', /idle|watching|stalk|laser|prePounce/);
  await expect(mascot).toHaveAttribute('data-cat-pointer-speed', /^\d+\.\d{3}$/);
  await expect(mascot).toHaveAttribute('data-cat-front-crouch', /^\d+\.\d{3}$/);
  await expect(mascot).toHaveAttribute('data-cat-air-dive', /^-?\d+\.\d{3}$/);
  await expect(mascot).toHaveAttribute('data-cat-turn-yaw', /^-?\d+\.\d{3}$/);
  await expect(mascot).toHaveAttribute('data-platform-count', /^[1-9]\d*$/);
  await expect(mascot).toHaveAttribute('data-platform-id', /hero|service|pricing|handoff|contact/);
  await expect(mascot).toHaveAttribute('data-mascot-state', /idle|watching/);
  await page.mouse.move(60, 140);
  await expect(mascot).toHaveAttribute('data-pointer-active', 'true');
  await expect(mascot).toHaveAttribute('data-pointer-mode', 'viewport');
  await expect(mascot).toHaveAttribute('data-mascot-state', 'watching');

  const box = await mascot.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x - 12, box!.y - 12);
  await mascot.hover({ position: { x: box!.width * 0.8, y: box!.height * 0.35 } });
  await expect(mascot).toHaveAttribute('data-mascot-state', 'watching');
  await page.mouse.down();
  await expect(mascot).toHaveAttribute('data-mascot-state', 'petting');
  await page.mouse.up();
});

test('homepage keeps one public offer even when a demo style is stored', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('radeq-style-variant', 'variant-d');
  });

  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('data-style', 'variant-a');
  await expect(page.locator('html')).toHaveAttribute('data-style-source', 'fixed');
  await expect(page.locator('.style-toggle')).toHaveCount(0);
  await expect(
    page.getByRole('heading', { name: 'Web pro malé firmy, kterému rozumíte vy i vaši zákazníci.' }),
  ).toBeVisible();
  await expect(page.locator('.service-catalog')).toBeVisible();
  await expect(page.locator('.pricing-section')).toBeVisible();
  await expect(page.locator('.cat-guide')).toHaveCount(0);
  await expect(page.locator('.studio-proof')).toHaveCount(0);
  await expect(page.locator('.demo-worlds')).toHaveCount(0);
});

test('demo route style variants keep distinct visual languages', async ({ page }) => {
  await page.goto('/demo/service-landing/');
  await expect(page.locator('.style-toggle')).toHaveAttribute('data-hydrated', 'true');

  const variants = [
    { button: /^A \//, style: 'variant-a', expected: 'linear-gradient' },
    { button: /^B \//, style: 'variant-b', expected: 'radial-gradient' },
    { button: /^C \//, style: 'variant-c', expected: 'linear-gradient' },
    { button: /^D \//, style: 'variant-d', expected: 'repeating' },
  ];

  const backgrounds: string[] = [];

  for (const variant of variants) {
    await selectTheme(page, variant.button);
    await expect(page.locator('html')).toHaveAttribute('data-style', variant.style);
    const background = await page.evaluate(() => getComputedStyle(document.body).backgroundImage);
    expect(background).toContain(variant.expected);
    backgrounds.push(background);
  }

  expect(new Set(backgrounds).size).toBe(4);
});

test('seo metadata and indexability endpoints are exposed', async ({ page, request }) => {
  await page.goto('/');

  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', 'https://radeq.cz/');
  await expect(page.locator('head meta[property="og:url"]')).toHaveAttribute('content', 'https://radeq.cz/');
  await expect(page.locator('head meta[name="description"]')).toHaveAttribute(
    'content',
    /firemní weby, redesigny a webovou péči/,
  );

  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain('Sitemap: https://radeq.cz/sitemap.xml');

  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain('<loc>https://radeq.cz/</loc>');
  expect(sitemapText).toContain('<loc>https://radeq.cz/en/</loc>');
  expect(sitemapText).toContain('<loc>https://radeq.cz/ukazky/</loc>');
  expect(sitemapText).toContain('<loc>https://radeq.cz/ukazky/chatbot/</loc>');
  expect(sitemapText).toContain('<loc>https://radeq.cz/ukazky/automatizace/</loc>');
  expect(sitemapText).toContain('<loc>https://radeq.cz/ukazky/nabidka-eshop/</loc>');
  expect(sitemapText).toContain('<loc>https://radeq.cz/demo/service-landing/</loc>');
});

test('mobile header keeps controls compact without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 920 });
  await page.goto('/');

  await expect(page.locator('.command-nav')).toBeVisible();
  await expect(page.locator('.command-nav').getByRole('link', { name: 'O nás' })).toBeVisible();
  await expect(page.locator('.header-cta')).toBeHidden();
  await expect(page.locator('.style-toggle')).toHaveCount(0);
  await expect(page.locator('.theme-toggle')).toBeVisible();
  await expect(page.locator('.pricing-card')).toHaveCount(4);

  const hasOverflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth + 1);
  expect(hasOverflow).toBe(false);
});

test('core panel keeps decorative fallback clipped on tablet', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/');

  await expect(page.locator('.core-panel')).toHaveCSS('overflow', 'hidden');
});

test('3D cat launch is hydrated for an immediate first-viewport click', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /kočičku|cat/i }).click();

  await expect(page.locator('.core-canvas canvas')).toBeVisible({ timeout: 10_000 });
  await expect(page.locator('.core-canvas')).toHaveAttribute('data-mascot-state', /idle|watching/);
});

test('3D cat launch respects reduced motion without leaving a blank panel', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  await page.getByRole('button', { name: /kočičku|cat/i }).click();

  await expect(page.locator('.core-canvas canvas')).toHaveCount(0);
  await expect(page.locator('.core-load-state')).toContainText(/motion|pohyb/i);
});
