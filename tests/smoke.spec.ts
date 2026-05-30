import { expect, test } from '@playwright/test';

test('homepage core flow works', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Web, kterému zákazník rozumí na první scroll.' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Vyzkoušet web' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Co dostanete' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Matrix' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Důkazy' })).toHaveCount(0);
  await expect(page.getByText('Rychlý web')).toHaveCount(0);
  await expect(page.getByText('VYBERTE TYP WEBU')).toHaveCount(0);
  await expect(page.getByText('servo-lock')).toHaveCount(0);
  await expect(page.locator('#matrix')).toHaveAttribute('data-hydrated', 'true');
  await expect(page.getByText('Co chcete postavit')).toHaveCount(0);
  await expect(page.getByText(/Jakou .* chcete vid/)).toBeVisible();
  await expect(page.getByText('Návrh A/B/C/D')).toBeVisible();
  await expect(page.locator('.matrix-control-group--styles')).toHaveCount(0);
  await expect(page.locator('.module-style-picker')).toHaveCount(1);
  await expect(page.locator('.module-style-picker .style-chip')).toHaveCount(4);
  await expect(page.locator('.matrix-preview')).toHaveClass(/matrix-preview--motion/);
  await expect(page.locator('.motion-flow-field')).toBeVisible();
  await expect(page.locator('.motion-route li')).toHaveCount(3);
  await expect(page.getByRole('button', { name: 'Světlý' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Tmavý' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Světlý' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('html')).toHaveAttribute('data-motion-ready', /true|reduced/);
  await expect(page.locator('html')).toHaveAttribute('data-motion-scene', /top|matrix|section|audience|demo|handoff|systems|terminal/);

  await page.getByRole('button', { name: 'A / Důvěra' }).click();
  await expect(page.locator('.matrix-preview')).toHaveAttribute('data-style', 'variant-a');
  await expect(page.locator('.matrix-preview')).toHaveClass(/matrix-preview--trust/);
  await expect(page.locator('.trust-page-sheet')).toBeVisible();

  await page.getByRole('button', { name: /Přehled pro tým/ }).click();
  await page.getByRole('button', { name: 'C / Důkaz' }).click();
  await expect(
    page.getByRole('heading', {
      name: 'Interní rozhraní, které ukáže stav práce dřív, než se z něj stane problém.',
    }),
  ).toBeVisible();
  await expect(page.getByText('Co jde sledovat')).toBeVisible();
  await expect(page.locator('.matrix-preview')).toHaveAttribute('data-module', 'admin-dashboard');
  await expect(page.locator('.matrix-preview')).toHaveAttribute('data-style', 'variant-c');
  await expect(page.locator('.matrix-preview')).toHaveClass(/matrix-preview--proof/);
  await expect(page.locator('.proof-metrics div')).toHaveCount(3);
  await expect(page.locator('.proof-timeline li')).toHaveCount(5);
  await expect(page.locator('.module-style-picker')).toHaveCount(1);
  await expect(page.locator('.module-style-picker .style-chip')).toHaveCount(4);

  await page.getByRole('button', { name: /E-shop/ }).click();
  await expect(page.locator('.matrix-preview')).toHaveAttribute('data-module', 'eshop-offers');
  await expect(page.locator('.proof-board')).toBeVisible();
  await expect(page.locator('.proof-check')).toHaveCount(3);

  await page.getByRole('button', { name: 'D / Studio' }).click();
  await expect(page.locator('.matrix-preview')).toHaveAttribute('data-style', 'variant-d');
  await expect(page.locator('.matrix-preview')).toHaveClass(/matrix-preview--studio/);
  await expect(page.locator('.studio-configurator')).toBeVisible();
  await expect(page.locator('.studio-outcome-map')).toBeVisible();

  await page.getByRole('textbox', { name: 'Jméno' }).fill('Jan Siroky');
  await page.getByRole('textbox', { name: 'E-mail' }).fill('jan@example.com');
  await page.getByRole('combobox', { name: 'Typ projektu' }).selectOption('Data, databáze a formuláře');
  await page.getByRole('textbox', { name: 'Zpráva' }).fill('Potřebuji zjednodušit poptávkovou cestu.');
  await expect(page.getByText('Typ projektu: Data, databáze a formuláře')).toBeVisible();
  await expect(page.getByText('Zpráva: Potřebuji zjednodušit poptávkovou cestu.')).toBeVisible();

  await page.getByRole('button', { name: 'Spustit kočičku' }).click();
  await expect(page.getByRole('button', { name: 'Spustit kočičku' })).toHaveCount(0);
  const mascot = page.locator('.core-canvas');
  await expect(page.locator('.core-canvas canvas')).toBeVisible();
  await expect(mascot).toHaveAttribute('data-model-source', /local:\/\/radeq-ginger-ghost/);
  await expect(mascot).toHaveAttribute('data-cat-rig-version', /custom-contract-v1|legacy-quaternius-v1/);
  await expect(mascot).toHaveAttribute('data-cat-rig-quality', /contract|legacy|partial/);
  await expect(mascot).toHaveAttribute('data-cat-texture', 'procedural-tabby-v1');
  await expect(mascot).toHaveAttribute('data-cat-motion', 'platform');
  await expect(mascot).toHaveAttribute('data-cat-scene', /top|matrix|terminal|section|audience|demo|handoff|systems/);
  await expect(mascot).toHaveAttribute('data-cat-facing', /left|right/);
  await expect(mascot).toHaveAttribute('data-cat-hunt-state', /idle|watching|stalk|laser|prePounce/);
  await expect(mascot).toHaveAttribute('data-cat-pointer-speed', /^\d+\.\d{3}$/);
  await expect(mascot).toHaveAttribute('data-cat-front-crouch', /^\d+\.\d{3}$/);
  await expect(mascot).toHaveAttribute('data-cat-air-dive', /^-?\d+\.\d{3}$/);
  await expect(mascot).toHaveAttribute('data-cat-turn-yaw', /^-?\d+\.\d{3}$/);
  await expect(mascot).toHaveAttribute('data-platform-count', /^[1-9]\d*$/);
  await expect(mascot).toHaveAttribute('data-platform-id', /hero|matrix|audience|demo|handoff|system|contact/);
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
