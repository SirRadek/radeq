import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

const origin = 'http://127.0.0.1:4202';
const route = `${origin}/minimalni-navrh/`;
const output = resolve(process.env.RADEQ_PREVIEW_EVIDENCE || 'docs/audits/2026-10-08-showcase-form-refinement');
mkdirSync(output, { recursive: true });
const report = { url: route, browser: 'Playwright Chromium; Browser plugin skill not available', cases: [], errors: [], requests: [], responses: [], source_sha256: {} };
for (const file of ['src/pages/minimalni-navrh.astro', 'src/components/MinimalAudience.astro', 'src/styles/minimal-home-preview.css', 'scripts/verify-minimal-home-preview.mjs']) report.source_sha256[file] = createHash('sha256').update(readFileSync(file)).digest('hex');
let browser;
try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined });
  report.executable = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || 'Playwright bundled Chromium';
  for (const [width, height] of [[1440, 900], [360, 800], [768, 900]]) {
    const context = await browser.newContext({ viewport: { width, height }, javaScriptEnabled: false, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('console', message => { if (['error', 'warning'].includes(message.type())) report.errors.push(message.text()); });
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('request', request => report.requests.push(request.url()));
    page.on('response', response => report.responses.push({ url: response.url(), status: response.status() }));
    const response = await page.goto(route, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    assert.equal(page.url(), route);
    assert.equal(await page.title(), 'RadeQ — návrh minimalistické homepage');
    assert.equal(await page.locator('h1').innerText(), 'Weby a automatizace, které usnadňují podnikání.');
    assert.equal(await page.locator('astro-island, canvas, iframe, vite-error-overlay').count(), 0);
    assert.equal(await page.locator('script').count(), 2);
    assert.equal(await page.locator('form').count(), 1);
    assert.ok(await page.locator('[data-audience-toggle]').isDisabled());
    assert.equal(await page.locator('[data-audience-word]').innerText(), 'živnostníky');
    const audienceStyle = await page.locator('[data-minimal-audience]').evaluate(el => {
      const style = getComputedStyle(el);
      return { family: style.fontFamily, weight: style.fontWeight, size: parseFloat(style.fontSize) };
    });
    assert.ok(audienceStyle.family.includes('Cabinet Grotesk'));
    assert.equal(audienceStyle.weight, '400');
    assert.equal(await page.locator('[data-audience-word]').evaluate(el => getComputedStyle(el, '::after').animationName), 'none');
    await page.evaluate(() => document.fonts.ready);
    const typography = await page.evaluate(() => {
      const selectors = ['h1', 'h2', 'body', '.rq-minimal-preview__cta'];
      return selectors.map(selector => {
        const style = getComputedStyle(document.querySelector(selector));
        return { selector, family: style.fontFamily, weight: style.fontWeight, size: parseFloat(style.fontSize) };
      });
    });
    for (const [index, role] of typography.entries()) {
      assert.ok(role.family.includes(index === 0 ? 'Chillax' : 'Cabinet Grotesk'));
      assert.equal(role.weight, ['600', '600', '400', '500'][index]);
    }
    assert.ok(await page.evaluate(() => document.fonts.check('600 16px "Chillax"') && document.fonts.check('400 16px "Cabinet Grotesk"')));
    const noOverflow = () => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
    assert.ok(await noOverflow(), `overflow at ${width}px`);
    assert.equal(await page.locator('nav a').first().evaluate(el => getComputedStyle(el).transitionDuration), '0s');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'RadeQ — domů');
    assert.notEqual(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle), 'none');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Služby');
    await page.keyboard.press('Enter');
    assert.equal(new URL(page.url()).hash, '#sluzby');
    assert.ok(await page.locator('#sluzby').isVisible());
    await page.goto(route, { waitUntil: 'networkidle' });
    await page.screenshot({ path: resolve(output, `render-${width}.png`), fullPage: true });
    await page.evaluate(() => {
      document.documentElement.style.fontSize = `${parseFloat(getComputedStyle(document.documentElement).fontSize) * 2}px`;
    });
    const enlarged = await page.evaluate(() => ['h1', 'h2', 'body', '.rq-minimal-preview__cta'].map(selector => parseFloat(getComputedStyle(document.querySelector(selector)).fontSize)));
    enlarged.forEach((size, index) => assert.ok(Math.abs(size - typography[index].size * 2) <= 1, `200% ${typography[index].selector} at ${width}px`));
    assert.ok(Math.abs(await page.locator('[data-minimal-audience]').evaluate(el => parseFloat(getComputedStyle(el).fontSize)) - audienceStyle.size * 2) <= 1);
    assert.ok(await noOverflow(), `200% text overflow at ${width}px`);
    await page.screenshot({ path: resolve(output, `render-${width}-text200.png`), fullPage: true });
    report.cases.push({ viewport: { width, height }, javascript: false, reduced_motion: true, typography, enlarged, horizontal_overflow: false, keyboard_focus_and_fragment: 'passed', title_and_content: 'passed' });
    await context.close();
  }
  report.animation = [];
  for (const width of [1440, 360]) {
    const animatedContext = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' });
    const animatedPage = await animatedContext.newPage();
    animatedPage.on('pageerror', error => report.errors.push(error.message));
    animatedPage.on('console', message => { if (['error', 'warning'].includes(message.type())) report.errors.push(message.text()); });
    animatedPage.on('request', request => report.requests.push(request.url()));
    await animatedPage.goto(route, { waitUntil: 'networkidle' });
    await animatedPage.evaluate(() => {
      window.__audienceSamples = [];
      const start = performance.now();
      const word = document.querySelector('[data-audience-word]');
      const sample = () => window.__audienceSamples.push({ t: performance.now() - start, word: word.textContent, leadTop: document.querySelector('.rq-minimal-preview__lead').getBoundingClientRect().top });
      sample();
      new MutationObserver(sample).observe(word, { childList: true, subtree: true, characterData: true });
    });
    await animatedPage.waitForFunction(() => window.__audienceSamples.some(s => s.word === 'lokální služby'), undefined, { timeout: 25000 });
    await animatedPage.waitForFunction(() => {
      const samples = window.__audienceSamples;
      const lastWord = samples.findIndex(s => s.word === 'lokální služby');
      return samples.slice(lastWord + 1).some(s => s.word === 'živnostníky');
    }, undefined, { timeout: 10000 });
    const samples = await animatedPage.evaluate(() => window.__audienceSamples);
    assert.ok(Math.max(...samples.map(s => s.leadTop)) - Math.min(...samples.map(s => s.leadTop)) <= 1, `audience layout shift at ${width}`);
    assert.equal(await animatedPage.locator('[data-minimal-audience]').getAttribute('data-state'), 'playing');
    const control = animatedPage.locator('[data-audience-toggle]');
    await control.click();
    assert.equal(await control.getAttribute('aria-pressed'), 'true');
    assert.equal(await control.getAttribute('aria-label'), 'Zapnout střídání cílových skupin');
    const pausedWord = await animatedPage.locator('[data-audience-word]').innerText();
    await animatedPage.waitForTimeout(400);
    assert.equal(await animatedPage.locator('[data-audience-word]').innerText(), pausedWord);
    assert.equal(await animatedPage.locator('[data-audience-word]').evaluate(el => getComputedStyle(el, '::after').animationName), 'none');
    await control.click();
    assert.equal(await control.getAttribute('aria-pressed'), 'false');
    await animatedPage.locator('#kontakt').scrollIntoViewIfNeeded();
    await animatedPage.waitForFunction(() => document.querySelector('[data-minimal-audience]').dataset.state === 'static');
    await animatedPage.evaluate(() => window.scrollTo(0, 0));
    await animatedPage.waitForFunction(() => document.querySelector('[data-minimal-audience]').dataset.state === 'playing');
    await animatedPage.emulateMedia({ reducedMotion: 'reduce' });
    await animatedPage.waitForFunction(() => document.querySelector('[data-minimal-audience]').dataset.state === 'static');
    assert.equal(await animatedPage.locator('[data-audience-word]').innerText(), 'živnostníky');
    assert.ok(await control.isDisabled());
    assert.equal(await animatedPage.locator('.rq-minimal-preview__sr-only').textContent(), 'Pro živnostníky, salony, malé firmy a lokální služby.');
    await animatedPage.reload({ waitUntil: 'networkidle' });
    assert.equal(await animatedPage.locator('[data-minimal-audience]').getAttribute('data-state'), 'static');
    await animatedPage.screenshot({ path: resolve(output, `audience-motion-${width}.png`), fullPage: false });
    report.animation.push({ width, looped: true, samples, pause_resume: 'passed', intersection: 'passed', dynamic_and_initial_reduce: 'passed', layout_shift: false });
    await animatedContext.close();
  }
  report.form = [];
  for (const width of [1440, 360]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    let posts = 0;
    const fixtures = [];
    await context.route('**/api/leads', async intercepted => {
      assert.equal(intercepted.request().method(), 'POST');
      fixtures.push(intercepted.request().postDataJSON());
      posts++;
      await intercepted.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(posts === 1 ? { ok: false, error: 'Testovací chyba' } : { ok: true }) });
    });
    await context.route('https://challenges.cloudflare.com/**', intercepted => intercepted.abort());
    const page = await context.newPage();
    page.on('pageerror', error => report.errors.push(error.message));
    await page.goto(route, { waitUntil: 'networkidle' });
    const form = page.locator('#rq-lead-form');
    await form.scrollIntoViewIfNeeded();
    assert.equal(await form.evaluate(el => el.checkValidity()), false);
    await page.locator('#rq-lead-name').fill('Testovací návštěvník');
    await page.locator('#rq-lead-email').fill('neplatny');
    await page.locator('#rq-lead-need').fill('Izolovaný test formuláře, nikoli skutečná poptávka.');
    assert.equal(await page.locator('#rq-lead-email').evaluate(el => el.validity.typeMismatch), true);
    await page.locator('#rq-lead-email').fill('fixture@example.test');
    assert.equal(await form.evaluate(el => el.checkValidity()), true);
    assert.equal(await page.locator('#rq-lead-current').inputValue(), '');
    await page.locator('.rq-form-optional summary').click();
    assert.ok(await page.locator('#rq-lead-budget').isVisible());
    const radii = await page.evaluate(() => ({ panel: getComputedStyle(document.querySelector('.rq-minimal-preview__form-surface')).borderRadius, input: getComputedStyle(document.querySelector('#rq-lead-name')).borderRadius }));
    assert.equal(radii.panel, '32px');
    assert.equal(radii.input, '16px');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
    await page.locator('.rq-minimal-preview__form-surface').screenshot({ path: resolve(output, `form-${width}.png`) });
    const guarded = await page.locator('#rq-lead-turnstile').count() > 0;
    if (!guarded) {
      await form.locator('button[type="submit"]').click();
      await page.waitForFunction(() => document.querySelector('#rq-lead-status').textContent === 'Testovací chyba');
      assert.ok(await form.isVisible());
      await form.locator('button[type="submit"]').click();
      await page.waitForFunction(() => document.querySelector('#rq-lead-form').hidden);
      assert.ok(await page.locator('#rq-lead-done').isVisible());
      assert.equal(await page.evaluate(() => document.activeElement.id), 'rq-lead-done');
      assert.equal(posts, 2);
      fixtures.forEach(payload => { assert.equal(payload.email, 'fixture@example.test'); assert.equal(payload.project_type, ''); assert.equal(payload.honeypot, ''); });
    }
    report.form.push({ width, validation: 'passed', optional_fields: 'passed', radii, submission: guarded ? 'blocked by Turnstile; not exercised' : 'failure and success with isolated mock', intercepted_posts: posts, real_delivery: 'not tested' });
    await context.close();
  }
  for (const path of ['/kontakt/', '/ukazky/', '/ukazky/instalater/', '/ukazky/sluzba/', '/ukazky/provozni-terminal/', '/soukromi/']) {
    const response = await fetch(`${origin}${path}`);
    assert.equal(response.status, 200, `existing destination ${path}`);
  }
  assert.deepEqual(report.errors, []);
  assert.ok(report.requests.every(url => new URL(url).origin === origin && !new URL(url).pathname.startsWith('/api/')));
  assert.ok(report.responses.every(response => response.status < 400));
  for (const name of ['chillax', 'cabinet-grotesk']) assert.ok(report.responses.some(response => response.url.endsWith(`/fonts/radeq/${name}.woff2`) && response.status === 200));
  report.status = 'passed';
} catch (error) {
  report.status = 'failed';
  report.failure = error.stack;
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  writeFileSync(resolve(output, 'browser-results.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ status: report.status, cases: report.cases.length, failure: report.failure ?? null }));
}
