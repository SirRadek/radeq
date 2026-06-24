import { Buffer } from 'node:buffer';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sourcePath = process.argv[2] || 'C:/Users/sirok/Downloads/kocka_body_3d.html';
const outputPath = resolve(__dirname, '../src/data/heroCatPoints.ts');
const sourceStep = 4;
const desktopTarget = 7000;
const lowPowerTarget = 2400;

const html = await readFile(sourcePath, 'utf8');
const imgMatch = html.match(/const\s+IMG\s*=\s*"([^"]+)"/);

if (!imgMatch) {
  throw new Error(`Unable to find embedded IMG data URL in ${sourcePath}`);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  const result = await page.evaluate(
    async ({ imgSrc, sourceStep, desktopTarget }) => {
      const image = new Image();
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () => reject(new Error('Unable to decode source cat PNG'));
        image.src = imgSrc;
      });

      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d', { willReadFrequently: true });

      if (!context) {
        throw new Error('Canvas 2D context is unavailable');
      }

      context.drawImage(image, 0, 0);
      const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
      const raw = [];

      for (let y = 0; y < canvas.height; y += sourceStep) {
        for (let x = 0; x < canvas.width; x += sourceStep) {
          const offset = (y * canvas.width + x) * 4;
          const alpha = data[offset + 3];
          if (alpha < 40) continue;

          const r = data[offset];
          const g = data[offset + 1];
          const b = data[offset + 2];
          const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          const [cr, cg, cb] = adjustColorForHero(r, g, b);
          raw.push({
            x,
            y,
            lum,
            r: cr,
            g: cg,
            b: cb,
            outline: edgeWeight(x, y),
            rank: hashPoint(x, y),
          });
        }
      }

      if (raw.length < desktopTarget) {
        throw new Error(`Only sampled ${raw.length} points; target is ${desktopTarget}`);
      }

      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;

      for (const point of raw) {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      }

      const centerX = (minX + maxX) * 0.5;
      const centerY = (minY + maxY) * 0.5;
      const span = Math.max(maxX - minX, maxY - minY) || 1;
      const selected = raw.sort((a, b) => a.rank - b.rank).slice(0, desktopTarget);
      const floats = new Float32Array(selected.length * 3);
      const colors = new Uint8Array(selected.length * 3);
      const outlines = new Uint8Array(selected.length);
      let minLum = Infinity;
      let maxLum = -Infinity;
      let sumLum = 0;
      let outlineCount = 0;

      for (let index = 0; index < selected.length; index += 1) {
        const point = selected[index];
        const offset = index * 3;
        floats[offset] = (point.x - centerX) / span;
        floats[offset + 1] = -(point.y - centerY) / span;
        floats[offset + 2] = (point.lum - 0.5) * 0.24;
        colors[offset] = point.r;
        colors[offset + 1] = point.g;
        colors[offset + 2] = point.b;
        outlines[index] = Math.round(point.outline * 255);

        const adjustedLum = (0.2126 * point.r + 0.7152 * point.g + 0.0722 * point.b) / 255;
        minLum = Math.min(minLum, adjustedLum);
        maxLum = Math.max(maxLum, adjustedLum);
        sumLum += adjustedLum;
        if (point.outline > 0.08) outlineCount += 1;
      }

      return {
        imageWidth: canvas.width,
        imageHeight: canvas.height,
        sourceCount: raw.length,
        points: Array.from(floats),
        colors: Array.from(colors),
        outlines: Array.from(outlines),
        colorStats: {
          minLum,
          maxLum,
          avgLum: sumLum / selected.length,
          outlineCount,
        },
      };

      function alphaAt(x, y) {
        if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return 0;
        return data[(y * canvas.width + x) * 4 + 3];
      }

      function edgeWeight(x, y) {
        const dirs = [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
        ];
        let nearEmpty = 0;
        let farEmpty = 0;

        for (const [dx, dy] of dirs) {
          if (alphaAt(x + dx * sourceStep, y + dy * sourceStep) < 40) nearEmpty += 1;
          if (alphaAt(x + dx * sourceStep * 2, y + dy * sourceStep * 2) < 40) farEmpty += 1;
        }

        return clamp01(nearEmpty * 0.16 + farEmpty * 0.045);
      }

      function adjustColorForHero(r, g, b) {
        let rr = r / 255;
        let gg = g / 255;
        let bb = b / 255;
        const lum = luma(rr, gg, bb);
        const saturation = 1.04;
        const contrast = 1.02;

        rr = clamp01(lum + (rr - lum) * saturation);
        gg = clamp01(lum + (gg - lum) * saturation);
        bb = clamp01(lum + (bb - lum) * saturation);

        rr = clamp01((rr - 0.5) * contrast + 0.5);
        gg = clamp01((gg - 0.5) * contrast + 0.5);
        bb = clamp01((bb - 0.5) * contrast + 0.5);

        const finalLum = luma(rr, gg, bb);
        if (finalLum > 0.9) {
          const factor = 0.9 / finalLum;
          rr *= factor;
          gg *= factor;
          bb *= factor;
        }

        return [
          Math.round(clamp01(rr) * 255),
          Math.round(clamp01(gg) * 255),
          Math.round(clamp01(bb) * 255),
        ];
      }

      function luma(r, g, b) {
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      }

      function clamp01(value) {
        return Math.max(0, Math.min(1, value));
      }

      function hashPoint(x, y) {
        let n = Math.imul(x + 0x9e3779b9, 0x85ebca6b) ^ Math.imul(y + 0xc2b2ae35, 0x27d4eb2f);
        n ^= n >>> 15;
        n = Math.imul(n, 0x2c1b3c6d);
        n ^= n >>> 12;
        n = Math.imul(n, 0x297a2d39);
        n ^= n >>> 15;
        return n >>> 0;
      }
    },
    { imgSrc: imgMatch[1], sourceStep, desktopTarget },
  );

  const floats = new Float32Array(result.points);
  const colors = new Uint8Array(result.colors);
  const outlines = new Uint8Array(result.outlines);
  const base64 = Buffer.from(new Uint8Array(floats.buffer)).toString('base64');
  const colorBase64 = Buffer.from(colors).toString('base64');
  const outlineBase64 = Buffer.from(outlines).toString('base64');
  const output = `// Generated by scripts/generate-hero-cat-points.mjs from ${sourcePath.replaceAll('\\', '/')}.
// Source PNG is sampled once through canvas getImageData(step=${sourceStep}); runtime decodes baked positions, RGB colors, and outline weights.

export const HERO_CAT_SOURCE_STEP = ${sourceStep};
export const HERO_CAT_SOURCE_SAMPLE_COUNT = ${result.sourceCount};
export const HERO_CAT_IMAGE_SIZE = { width: ${result.imageWidth}, height: ${result.imageHeight} } as const;
export const HERO_CAT_POINT_COUNT = ${desktopTarget};
export const HERO_CAT_LOW_POWER_POINT_COUNT = ${lowPowerTarget};
export const HERO_CAT_POINTS_BASE64 = [
${chunkBase64(base64)}
].join('');
export const HERO_CAT_COLORS_BASE64 = [
${chunkBase64(colorBase64)}
].join('');
export const HERO_CAT_OUTLINE_BASE64 = [
${chunkBase64(outlineBase64)}
].join('');
`;

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output);
  console.log(
    [
      `Generated ${outputPath} from ${result.sourceCount} source points: ${desktopTarget} desktop / ${lowPowerTarget} low-power target`,
      `Adjusted color luminance min=${result.colorStats.minLum.toFixed(3)} max=${result.colorStats.maxLum.toFixed(3)} avg=${result.colorStats.avgLum.toFixed(3)}`,
      `Outline-weighted points=${result.colorStats.outlineCount}`,
    ].join('\n'),
  );
} finally {
  await browser.close();
}

function chunkBase64(base64) {
  const chunks = base64.match(/.{1,96}/g) || [];
  return chunks.map((chunk) => `  '${chunk}',`).join('\n');
}
