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
    page.getByRole('heading', { name: 'Weby, formuláře a automatizace pro méně ruční práce.' }),
  ).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-measurement-ready', 'true');
  await expect(page.locator('.hero-actions')).toBeVisible();
  await expect(page.locator('.hero-actions').getByRole('link', { name: 'Chci zmapovat problém', exact: true })).toBeVisible();
  await expect(page.locator('.hero-actions').getByRole('link', { name: 'Co umím zjednodušit', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Probrat můj problém', exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'S čím pomáhám', exact: true })).toHaveCount(0);
  await expect(page.locator('.command-nav').getByRole('link', { name: 'Úvod', exact: true })).toHaveCount(0);
  await expect(page.locator('.command-nav').getByRole('link', { name: 'Co řeším', exact: true })).toBeVisible();
  await expect(page.locator('.command-nav').getByRole('link', { name: 'Služby', exact: true })).toBeVisible();
  await expect(page.locator('.command-nav').getByRole('link', { name: 'Jak pracuji', exact: true })).toHaveAttribute(
    'href',
    '#process',
  );
  await expect(page.locator('.command-nav').getByRole('link', { name: 'Ceny', exact: true })).toHaveAttribute(
    'href',
    '#pricing',
  );
  await expect(page.locator('.command-nav').getByRole('link', { name: 'Kontakt', exact: true })).toHaveAttribute(
    'href',
    '#terminal',
  );
  await expect(page.locator('.command-nav').getByRole('link', { name: 'Poptávka', exact: true })).toHaveCount(0);
  await expect(page.locator('.brand-mark--logo-b .radeq-brand-logo')).toBeVisible();
  await expect(page.locator('.brand-mark--logo-b img')).toHaveCount(0);
  await expect(page.locator('link[rel="icon"][media="(prefers-color-scheme: light)"]')).toHaveAttribute(
    'href',
    '/brand/radeq-favicon-b-light.png',
  );
  await expect(page.locator('link[rel="icon"][media="(prefers-color-scheme: dark)"]')).toHaveAttribute(
    'href',
    '/brand/radeq-favicon-b-dark.png',
  );
  await expect(page.locator('link[data-theme-favicon-active]')).toHaveAttribute('href', /radeq-favicon-b-(light|dark)\.png/);
  const homePalette = await page.evaluate(() => {
    const logo = document.querySelector('.radeq-brand-logo');

    return {
      background: getComputedStyle(document.documentElement).getPropertyValue('--page-bg').trim(),
      accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(),
      logoMask: logo ? getComputedStyle(logo).getPropertyValue('-webkit-mask-image') : '',
    };
  });
  expect(homePalette.logoMask).toContain('radeq-logo-b-mask.png');
  expect(['#f7f1e8', '#18110e']).toContain(homePalette.background);
  expect(['#a85f2a', '#d58a4a']).toContain(homePalette.accent);
  await expect(page.getByRole('link', { name: 'Ceny' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Co řeším' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'E-shop demo', exact: true })).toHaveCount(0);
  await expect(page.locator('.style-toggle')).toHaveCount(0);
  await expect(page.locator('#matrix')).toHaveCount(0);
  await expect(page.locator('#services')).toBeVisible();
  await expect(page.locator('.offer-map')).toHaveCount(0);
  await expect(page.locator('#process')).toBeVisible();
  await expect(
    page.getByText('Nejdřív pochopím provoz. Pak navrhnu nejjednodušší řešení.'),
  ).toBeVisible();
  await expect(page.locator('.service-card')).toHaveCount(5);
  await expect(page.locator('.service-addon-card')).toHaveCount(0);
  await expect(page.locator('.service-card a')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Co vám můžu zjednodušit' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Web může být začátek. Ne konec řešení.' })).toHaveCount(0);
  await expect(page.locator('.service-card').first()).toContainText('Výstup');
  await expect(page.locator('.service-card__examples')).toHaveCount(0);
  await expect(page.getByText('připravujeme')).toHaveCount(0);
  await expect(page.locator('main a[href*="/demo/"]')).toHaveCount(0);
  await expect(page.locator('#demos')).toBeVisible();
  await expect(page.locator('.demo-card')).toHaveCount(0);
  await expect(page.locator('#demos')).toContainText('Připravované ukázky řešení');
  await expect(page.locator('#demos')).toContainText('modelové ukázky');
  await expect(page.locator('#demos').getByRole('link')).toHaveCount(0);
  await expect(page.getByText('WordPress servis a opravy')).toHaveCount(0);

  await expect(page.locator('#pricing')).toBeVisible();
  await expect(page.locator('.pricing-card')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Orientační ceny bez překvapení.' })).toBeVisible();
  await expect(page.locator('.pricing-section').getByRole('heading', { name: 'Audit webu nebo procesu' })).toBeVisible();
  await expect(page.getByText('2 900–4 900 Kč')).toBeVisible();
  await expect(page.locator('.pricing-card__price')).toHaveCount(3);
  const priceLineState = await page.locator('.pricing-card__price').evaluateAll((prices) =>
    prices.map((price) => {
      const style = getComputedStyle(price);
      return {
        text: price.textContent?.trim(),
        whiteSpace: style.whiteSpace,
        height: price.getBoundingClientRect().height,
        lineHeight: Number.parseFloat(style.lineHeight),
        overflow: price.scrollWidth > price.clientWidth + 1,
      };
    }),
  );
  expect(priceLineState.every((price) => price.whiteSpace === 'nowrap')).toBe(true);
  expect(priceLineState.every((price) => price.height <= price.lineHeight + 2)).toBe(true);
  expect(priceLineState.every((price) => !price.overflow)).toBe(true);
  await expect(page.locator('.pricing-card a')).toHaveCount(0);
  await expect(page.locator('.pricing-section').getByRole('link', { name: 'Začít auditem' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Začít auditem' })).toHaveCount(0);

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
  await expect(page.locator('html')).toHaveAttribute('data-motion-scene', /top|services|pricing|about|demos|handoff|terminal/);

  const navOrder = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.command-nav a[data-nav-href^="#"]'));
    return links.map((link) => {
      const id = link.dataset.navHref?.slice(1) ?? '';
      const target = document.getElementById(id);
      return {
        id,
        exists: Boolean(target),
        top: target ? Math.round(target.getBoundingClientRect().top + window.scrollY) : -1,
      };
    });
  });
  expect(navOrder.map((item) => item.id)).toEqual(['about', 'services', 'process', 'pricing', 'terminal']);
  expect(navOrder.every((item) => item.exists)).toBe(true);
  for (let index = 1; index < navOrder.length; index += 1) {
    expect(navOrder[index].top).toBeGreaterThan(navOrder[index - 1].top);
  }

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
  await expect(page.locator('html')).toHaveAttribute('data-measurement-ready', 'true');
  await page.evaluate(() => {
    (window as unknown as { __radeqMeasurementEvents: unknown[] }).__radeqMeasurementEvents = [];
    window.addEventListener('radeq:measurement', (event) => {
      (window as unknown as { __radeqMeasurementEvents: unknown[] }).__radeqMeasurementEvents.push(
        (event as CustomEvent).detail,
      );
    });
  });
  await expect(page.locator('#about')).toBeVisible();
  await expect(page.locator('.command-nav').getByRole('link', { name: 'Co řeším' })).toHaveAttribute('href', '#about');
  await expect(
    page.getByRole('heading', { name: 'Kdy to dává smysl' }),
  ).toBeVisible();
  await expect(page.locator('.fit-list li')).toHaveCount(6);
  await expect(page.getByText('poptávky chodí různě a ztrácí se v e-mailech')).toBeVisible();
  await expect(page.getByText('S čím pomohu vedle samotného webu')).toHaveCount(0);
  await expect(page.locator('.about-service-card')).toHaveCount(0);
  await expect(page.getByText('Web není konec řešení, ale vstup do systému.')).toHaveCount(0);
  await expect(page.locator('#brief-name[name="name"]')).toHaveCount(1);
  await expect(page.locator('#brief-email[name="email"]')).toHaveCount(1);
  await expect(page.locator('#brief-project_type[name="project_type"]')).toHaveCount(1);
  await expect(page.locator('#brief-message[name="message"]')).toHaveCount(1);
  await expect(page.locator('form[aria-describedby="brief-required-note"]')).toHaveCount(1);
  await expect(page.getByText('Stačí stručně. Podrobnosti můžeme doplnit později.')).toBeVisible();
  await expect(page.locator('.brief-optional')).toHaveCount(0);
  await expect(page.locator('.pc-brief-panel')).toHaveCount(0);
  await page.getByRole('button', { name: 'Odeslat' }).click();
  await expect(page.locator('.brief-field__error')).toHaveCount(4);
  await expect(page.locator('#brief-name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#brief-name')).toBeFocused();
  await expect(page.getByRole('alert')).toContainText('Doplňte prosím');
  await expect
    .poll(() =>
      page.evaluate(() => (window as unknown as { __radeqMeasurementEvents: unknown[] }).__radeqMeasurementEvents),
    )
    .toContainEqual({ name: 'form_start', route: '/' });
  await page.getByRole('textbox', { name: 'Jméno' }).fill('Jan Siroky');
  await page.getByRole('textbox', { name: 'Kontakt' }).fill('jan@');
  await page.getByRole('combobox', { name: 'Co dnes používáte?' }).selectOption('Tabulky');
  await page.getByRole('textbox', { name: 'Co potřebujete zjednodušit?' }).fill('Potřebuji zjednodušit poptávkovou cestu.');
  await page.getByRole('button', { name: 'Odeslat' }).click();
  await expect(page.locator('#brief-email')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#brief-email-error')).toContainText('Zadejte platnou e-mailovou adresu.');
  await expect(page.locator('#brief-email')).toBeFocused();
  await page.getByRole('textbox', { name: 'Kontakt' }).fill('jan@example.com');
  await expect(page.locator('#brief-project_type')).toHaveValue('Tabulky');
  await expect(page.locator('#brief-message')).toHaveValue('Potřebuji zjednodušit poptávkovou cestu.');

  await page.goto('/');
  await expect(page.getByRole('button', { name: /kočičí vstup|cat entrance/i })).toHaveCount(0);
  await expect(page.locator('.core-panel')).toHaveCount(0);
  await expect(page.locator('.core-canvas')).toHaveCount(0);
  await expect(page.locator('.back-to-top')).toBeVisible();
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
    page.getByRole('heading', { name: 'Weby, formuláře a automatizace pro méně ruční práce.' }),
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
    /automatizací, AI, databázemi/,
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
  expect(sitemapText).toContain('<loc>https://radeq.cz/podminky/</loc>');
  expect(sitemapText).toContain('<loc>https://radeq.cz/gdpr/</loc>');
  expect(sitemapText).toContain('<loc>https://radeq.cz/cookies/</loc>');
});

test('mobile header keeps controls compact without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 920 });
  await page.goto('/');

  await expect(page.locator('.command-nav')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Otevřít menu' })).toBeVisible();
  await page.getByRole('button', { name: 'Otevřít menu' }).click();
  await expect(page.locator('.command-nav')).toBeVisible();
  await expect(page.locator('.command-nav').getByRole('link', { name: 'Co řeším' })).toBeVisible();
  await expect(page.locator('.command-nav').getByRole('link', { name: 'Kontakt' })).toBeVisible();
  await expect(page.locator('.command-nav').getByRole('link', { name: 'Poptávka' })).toHaveCount(0);
  await expect(page.locator('.command-nav a')).toHaveCount(6);
  await expect(page.locator('.language-link')).toBeVisible();
  await expect(page.locator('.language-link')).toHaveText('EN');
  await expect(page.locator('.header-cta')).toHaveCount(0);
  await expect(page.locator('.style-toggle')).toHaveCount(0);
  await expect(page.locator('.theme-toggle')).toBeVisible();
  await expect(page.locator('.service-card')).toHaveCount(5);
  await expect(page.locator('.service-path')).toHaveCSS('grid-template-columns', /^[\d.]+px$/);
  await page.locator('.service-card').first().evaluate((element) => {
    element.scrollIntoView({ block: 'center' });
  });
  await expect(page.locator('.service-card').first()).toHaveClass(/is-forward/);
  await expect(page.locator('.pricing-card')).toHaveCount(3);

  const mobileNavTarget = page.locator('.command-nav').getByRole('link', { name: 'Kontakt' });
  await mobileNavTarget.scrollIntoViewIfNeeded();
  await mobileNavTarget.focus();
  const mobileLayoutState = await page.evaluate(() => {
    const nav = document.querySelector<HTMLElement>('.command-nav')!;
    const target = document.querySelector<HTMLAnchorElement>('.command-nav a[data-nav-href="#terminal"]')!;
    const rect = target.getBoundingClientRect();

    return {
      bodyOverflow: document.body.scrollWidth > window.innerWidth + 1,
      documentOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      navScrollable: nav.scrollWidth > nav.clientWidth,
      targetFullyVisible: rect.left >= 0 && rect.right <= window.innerWidth,
      targetFocused: document.activeElement === target,
    };
  });
  expect(mobileLayoutState.bodyOverflow).toBe(false);
  expect(mobileLayoutState.documentOverflow).toBe(false);
  expect(mobileLayoutState.navScrollable).toBe(false);
  expect(mobileLayoutState.targetFullyVisible).toBe(true);
  expect(mobileLayoutState.targetFocused).toBe(true);

  const mobilePricingColumns = await page.evaluate(() =>
    getComputedStyle(document.querySelector('.pricing-grid')!).gridTemplateColumns.split(' ').filter(Boolean).length,
  );
  expect(mobilePricingColumns).toBe(1);
});

test('homepage keeps tablet and 4k layout from collapsing into mobile composition', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');

  const desktopLayout = await page.evaluate(() => {
    const pricingColumns = getComputedStyle(document.querySelector('.pricing-grid')!).gridTemplateColumns;
    const serviceColumns = getComputedStyle(document.querySelector('.service-path')!).gridTemplateColumns;
    const headingColumns = getComputedStyle(document.querySelector('.section-heading--services')!).gridTemplateColumns;

    return {
      pricingCount: pricingColumns.split(' ').filter(Boolean).length,
      serviceCount: serviceColumns.split(' ').filter(Boolean).length,
      headingCount: headingColumns.split(' ').filter(Boolean).length,
    };
  });

  expect(desktopLayout.pricingCount).toBe(3);
  expect(desktopLayout.serviceCount).toBe(2);
  expect(desktopLayout.headingCount).toBe(2);

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/');

  const tabletLayout = await page.evaluate(() => {
    const pricingColumns = getComputedStyle(document.querySelector('.pricing-grid')!).gridTemplateColumns;
    const serviceColumns = getComputedStyle(document.querySelector('.service-path')!).gridTemplateColumns;
    const headingColumns = getComputedStyle(document.querySelector('.section-heading--services')!).gridTemplateColumns;

    return {
      pricingCount: pricingColumns.split(' ').filter(Boolean).length,
      serviceCount: serviceColumns.split(' ').filter(Boolean).length,
      headingCount: headingColumns.split(' ').filter(Boolean).length,
    };
  });

  expect(tabletLayout.pricingCount).toBe(2);
  expect(tabletLayout.serviceCount).toBe(2);
  expect(tabletLayout.headingCount).toBe(1);

  await page.setViewportSize({ width: 3840, height: 2160 });
  await page.goto('/');

  const fourKLayout = await page.evaluate(() => {
    const pricingColumns = getComputedStyle(document.querySelector('.pricing-grid')!).gridTemplateColumns;
    const serviceColumns = getComputedStyle(document.querySelector('.service-path')!).gridTemplateColumns;
    const headingColumns = getComputedStyle(document.querySelector('.section-heading--services')!).gridTemplateColumns;

    return {
      pricingCount: pricingColumns.split(' ').filter(Boolean).length,
      serviceCount: serviceColumns.split(' ').filter(Boolean).length,
      headingCount: headingColumns.split(' ').filter(Boolean).length,
    };
  });

  expect(fourKLayout.pricingCount).toBe(3);
  expect(fourKLayout.serviceCount).toBe(3);
  expect(fourKLayout.headingCount).toBe(2);
  const desktopHeading = await page.locator('#services-title').boundingBox();
  expect(desktopHeading?.width ?? 0).toBeGreaterThan(560);
});

test('homepage typography hierarchy stays readable and prices fit cards', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');

  const typeState = await page.evaluate(() => {
    const fontSize = (selector: string) => Number.parseFloat(getComputedStyle(document.querySelector(selector)!).fontSize);
    const lineHeight = (selector: string) => Number.parseFloat(getComputedStyle(document.querySelector(selector)!).lineHeight);
    const prices = Array.from(document.querySelectorAll<HTMLElement>('.pricing-card__price')).map((price) => {
      const style = getComputedStyle(price);
      return {
        text: price.textContent?.trim(),
        fontSize: Number.parseFloat(style.fontSize),
        lineHeight: Number.parseFloat(style.lineHeight),
        height: price.getBoundingClientRect().height,
        overflow: price.scrollWidth > price.clientWidth + 1,
        whiteSpace: style.whiteSpace,
      };
    });

    return {
      body: fontSize('body'),
      heroLead: fontSize('.hero-copy p'),
      h1: fontSize('h1'),
      h1Line: lineHeight('h1'),
      h2: fontSize('#services-title'),
      h3: fontSize('.service-card h3'),
      prices,
    };
  });

  expect(typeState.heroLead).toBeGreaterThanOrEqual(typeState.body);
  expect(typeState.h3 / typeState.body).toBeGreaterThanOrEqual(1.2);
  expect(typeState.h2 / typeState.body).toBeGreaterThanOrEqual(2);
  expect(typeState.h1 / typeState.body).toBeGreaterThanOrEqual(3);
  expect(typeState.h1).toBeGreaterThan(typeState.h2);
  expect(typeState.h2).toBeGreaterThan(typeState.h3);
  expect(typeState.h3).toBeGreaterThan(typeState.body);
  expect(typeState.h1Line / typeState.h1).toBeGreaterThanOrEqual(0.95);
  expect(typeState.prices.every((price) => price.whiteSpace === 'nowrap')).toBe(true);
  expect(typeState.prices.every((price) => price.height <= price.lineHeight + 2)).toBe(true);
  expect(typeState.prices.every((price) => !price.overflow)).toBe(true);
});

test('homepage card hover and keyboard focus have visible emphasis', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');

  const serviceCard = page.locator('.service-card').first();
  const serviceBefore = await serviceCard.evaluate((element) => getComputedStyle(element).transform);
  await serviceCard.hover();
  await expect
    .poll(() => serviceCard.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(serviceBefore);
  await serviceCard.focus();
  await expect(serviceCard).toBeFocused();
  await expect
    .poll(() => serviceCard.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(serviceBefore);

  const pricingCard = page.locator('.pricing-card').first();
  const pricingBefore = await pricingCard.evaluate((element) => getComputedStyle(element).transform);
  await pricingCard.hover();
  await expect
    .poll(() => pricingCard.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(pricingBefore);
  await pricingCard.focus();
  await expect(pricingCard).toBeFocused();
  await expect
    .poll(() => pricingCard.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(pricingBefore);
});

test('homepage keeps cat mascot off the public entry on tablet', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/');

  await expect(page.locator('.core-panel')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /kočičí vstup|cat entrance/i })).toHaveCount(0);
});

test('homepage keeps cat mascot off the public entry on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 920 });
  await page.goto('/');

  await expect(page.locator('.core-panel')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /kočičí vstup|cat entrance/i })).toHaveCount(0);
});
