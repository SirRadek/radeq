import { parse } from 'parse5';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
export const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
export const hasAttr = (node, name) => node.attrs?.some(a => a.name === name) ?? false;
export function nodes(node) { return [node, ...(node.childNodes ?? []).flatMap(nodes)]; }
export function text(node) { return node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join(''); }
export const documentNodes = html => nodes(parse(html, { sourceCodeLocationInfo: true }));
export function assertContactContract(html, locale, oldOptions) {
  const all = documentNodes(html), select = all.find(n => n.tagName === 'select' && attr(n, 'name') === 'project_type');
  assert.ok(select, 'category select exists'); assert.ok(!hasAttr(select, 'required'), 'category optional');
  const options = nodes(select).filter(n => n.tagName === 'option');
  assert.ok(hasAttr(options[0], 'value'), 'blank option has explicit value attribute');
  assert.deepEqual(options.map(n => [attr(n, 'value'), text(n)]), [['', locale === 'cs' ? 'Bez výběru' : 'No selection'], ...oldOptions.map(v => [v, v])]);
  const label = all.find(n => n.tagName === 'label' && attr(n, 'for') === attr(select, 'id'));
  assert.equal(text(label), locale === 'cs' ? 'O jaký projekt jde? (nepovinné)' : 'What kind of project is it? (optional)');
  for (const name of ['name', 'email', 'message']) {
    const control = all.find(n => ['input', 'textarea'].includes(n.tagName) && attr(n, 'name') === name);
    assert.ok(control && hasAttr(control, 'required'), `${name} required`);
  }
}
export function assert404Contract(html, base, dist, root) {
  const all = documentNodes(html);
  for (const tag of ['html', 'body', 'header', 'main', 'h1', 'footer']) {
    const matches = all.filter(n => n.tagName === tag); assert.equal(matches.length, 1, tag);
    assert.ok(matches[0].sourceCodeLocation?.startTag && matches[0].sourceCodeLocation?.endTag, `explicit ${tag} shell`);
  }
  assert.equal(text(all.find(n => n.tagName === 'h1')), 'Tuhle stránku se nepodařilo najít.');
  const main = all.find(n => n.tagName === 'main'), footer = all.find(n => n.tagName === 'footer');
  for (const [label, path] of [['Domů', ''], ['S čím pomohu', 'sluzby/'], ['Kontakt', 'kontakt/']]) assert.ok(nodes(main).some(n => n.tagName === 'a' && attr(n, 'href') === `${base}${path}` && text(n).trim() === label), label);
  assert.ok(all.some(n => n.tagName === 'meta' && attr(n, 'name') === 'robots' && attr(n, 'content') === 'noindex,nofollow'));
  for (const n of all) {
    assert.ok(!['form', 'script', 'astro-island'].includes(n.tagName), 'inactive page');
    assert.ok(!hasAttr(n, 'http-equiv') && attr(n, 'rel') !== 'canonical', 'no refresh/canonical');
    assert.ok(!(n.attrs ?? []).some(a => a.name.startsWith('client:')), 'no island hydration');
  }
  function localResource(value) {
    if (value === '#') return;
    assert.ok(!value.includes('/api/'), 'no API resource'); assert.ok(value.startsWith(base), `base local ${value}`);
    const [url, fragment] = value.split('#'); const local = url.slice(base.length);
    const target = join(dist, local.endsWith('/') ? `${local}index.html` : local || 'index.html');
    assert.ok(existsSync(target), `resource exists ${value}`);
    if (fragment) assert.ok(documentNodes(readFileSync(target, 'utf8')).some(n => attr(n, 'id') === fragment), `fragment ${value}`);
  }
  let css = all.filter(n => n.tagName === 'style').map(text).join('\n');
  for (const n of all) {
    if (hasAttr(n, 'style')) css += '\n' + attr(n, 'style');
    for (const name of ['href', 'src', 'action', 'poster', 'data']) if (hasAttr(n, name)) localResource(attr(n, name));
    if (hasAttr(n, 'srcset')) for (const item of attr(n, 'srcset').split(',')) localResource(item.trim().split(/\s+/)[0]);
    if (n.tagName === 'link' && attr(n, 'rel') === 'stylesheet') css += '\n' + readFileSync(join(dist, attr(n, 'href').slice(base.length)), 'utf8');
  }
  // Namespace attributes are not resources; CSS references remain checked in every emitted surface.
  for (const m of css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]*))\s*\)/gi)) localResource(m[1] ?? m[2] ?? m[3]);
  for (const m of css.matchAll(/@import\s+(?:"([^"]*)"|'([^']*)')/gi)) localResource(m[1] ?? m[2]);
  assert.match(css, /focus-visible/); assert.match(css, /#f7f4ee/); assert.match(css, /#7a1f2b/);
  for (const font of ['Inter-latin-ext', 'Inter-latin', 'PlusJakartaSans-latin-ext', 'PlusJakartaSans-latin']) {
    assert.ok(css.includes(`${base}paper-stack/assets/brand-fonts/${font}.woff2`));
    assert.deepEqual(readFileSync(join(dist, `paper-stack/assets/brand-fonts/${font}.woff2`)), readFileSync(join(root, `public/paper-stack/assets/brand-fonts/${font}.woff2`)));
  }
  for (const id of ['situace', 'pristup', 'about', 'contact']) assert.ok(nodes(footer).some(n => n.tagName === 'a' && attr(n, 'href') === `${base}#${id}`));
}
export function archiveCompiled(dist, target, log) {
  mkdirSync(target, { recursive: true }); const manifest = {};
  function archive(dir, prefix = '') {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const relative = prefix + entry.name, source = join(dir, entry.name);
      if (entry.isDirectory()) { archive(source, relative + '/'); continue; }
      const bytes = readFileSync(source), opaque = `${Object.keys(manifest).length}.opaque.bin`;
      writeFileSync(join(target, opaque), bytes); manifest[relative] = { opaque, sha256: createHash('sha256').update(bytes).digest('hex') };
    }
  }
  archive(dist); writeFileSync(join(target, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n'); writeFileSync(join(target, 'build.log'), log);
}
