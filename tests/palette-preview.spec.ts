import { expect, test } from '@playwright/test';

test('palette preview switches homepage colors and exposes mode-aware favicons', async ({ page }) => {
  await page.goto('/preview/palety/');

  await expect(page.locator('html')).toHaveAttribute('data-palette-preview', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'walnut');
  await expect(page.locator('html')).toHaveAttribute('data-preview-theme-preference', 'auto');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'auto');
  await expect(page.locator('head meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.locator('link[rel="icon"][media="(prefers-color-scheme: light)"]')).toHaveAttribute(
    'href',
    '/brand/radeq-favicon-b-light.png',
  );
  await expect(page.locator('link[rel="icon"][media="(prefers-color-scheme: dark)"]')).toHaveAttribute(
    'href',
    '/brand/radeq-favicon-b-dark.png',
  );
  await expect(page.locator('.brand-mark--logo-b .radeq-brand-logo')).toBeVisible();
  await expect(page.locator('.brand-mark--logo-b img')).toHaveCount(0);
  await expect(page.locator('.palette-preview-panel .radeq-brand-logo')).toHaveCount(0);
  await expect(
    page.getByRole('heading', { name: 'Praktická IT pomoc pro lidi a firmy, které chtějí méně ruční práce.' }),
  ).toBeVisible();

  const initialAccent = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim());
  expect(initialAccent).toBe('#a85f2a');
  const logoVisual = await page.evaluate(() => {
    const shell = document.querySelector('.brand-mark--logo-b');
    const logo = document.querySelector('.radeq-brand-logo');
    const shellStyle = shell ? getComputedStyle(shell) : undefined;
    const logoStyle = logo ? getComputedStyle(logo) : undefined;

    return {
      shellBackground: shellStyle?.backgroundColor,
      logoBackground: logoStyle?.backgroundImage,
      logoMask: logoStyle?.getPropertyValue('-webkit-mask-image') || logoStyle?.maskImage,
    };
  });
  expect(logoVisual.shellBackground).toBe('rgba(0, 0, 0, 0)');
  expect(logoVisual.logoMask).toContain('radeq-logo-b-mask.png');
  expect(logoVisual.logoBackground).toContain('rgb(36, 25, 20)');
  expect(logoVisual.logoBackground).toContain('rgb(168, 95, 42)');

  await page.getByRole('button', { name: /C Walnut \+ royal blue/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'royal');
  await expect(page.getByRole('button', { name: /C Walnut \+ royal blue/ })).toHaveAttribute('aria-pressed', 'true');
  const royalAccent2 = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent-2').trim());
  expect(royalAccent2).toBe('#1d4e89');

  await page.getByRole('button', { name: /Tmavý/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-preview-theme-preference', 'dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('link[data-preview-favicon-active]')).toHaveAttribute(
    'href',
    '/brand/radeq-favicon-b-dark.png',
  );

  await page.getByRole('button', { name: /Světlý/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-preview-theme-preference', 'light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('link[data-preview-favicon-active]')).toHaveAttribute(
    'href',
    '/brand/radeq-favicon-b-light.png',
  );
});

test('palette preview auto mode follows prefers-color-scheme for page colors', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/preview/palety/');

  await expect(page.locator('html')).toHaveAttribute('data-preview-theme-preference', 'auto');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'auto');

  const autoAccent = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim());
  const autoBackground = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--page-bg').trim());
  const logoBackground = await page.evaluate(() => {
    const logo = document.querySelector('.radeq-brand-logo');
    return logo ? getComputedStyle(logo).backgroundImage : '';
  });
  expect(autoAccent).toBe('#d58a4a');
  expect(autoBackground).toBe('#18110e');
  expect(logoBackground).toContain('rgb(246, 239, 230)');
  expect(logoBackground).toContain('rgb(213, 138, 74)');
  await expect(page.locator('link[data-preview-favicon-active]')).toHaveAttribute(
    'href',
    '/brand/radeq-favicon-b-dark.png',
  );
});

test('palette preview fits mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 920 });
  await page.goto('/preview/palety/');

  await expect(page.locator('.palette-preview-panel')).toBeVisible();
  await expect(page.locator('.palette-preview-panel [data-palette-preview-option]')).toHaveCount(4);

  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(hasOverflow).toBe(false);
});
