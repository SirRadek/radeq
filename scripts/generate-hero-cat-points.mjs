import { Buffer } from 'node:buffer';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sourcePath = process.argv[2] || 'C:/Users/sirok/Downloads/kocka_body.png';
const outputPath = resolve(__dirname, '../src/data/heroCatPoints.ts');

const alphaThreshold = 40;
const backgroundMaxRgbThreshold = 3;
const depthAmp = 0.35;
const colorSaturation = 1.04;
const colorContrast = 1.03;
const profiles = [
  { key: 'max', constPrefix: 'HERO_CAT_MAX', step: 3, sizeScale: 0.9 },
  { key: 'desktop', constPrefix: 'HERO_CAT', step: 4, sizeScale: 1 },
  { key: 'lowPower', constPrefix: 'HERO_CAT_LOW_POWER', step: 6, sizeScale: 1.15 },
  { key: 'ultraLowPower', constPrefix: 'HERO_CAT_ULTRA_LOW_POWER', step: 8, sizeScale: 1.3 },
];

const imgSrc = await loadImageSource(sourcePath);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  const result = await page.evaluate(
    async ({
      imgSrc,
      alphaThreshold,
      backgroundMaxRgbThreshold,
      colorContrast,
      colorSaturation,
      depthAmp,
      profiles,
    }) => {
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
      const maxDimension = Math.max(canvas.width, canvas.height) || 1;
      const pointSets = {};

      for (const profile of profiles) {
        pointSets[profile.key] = buildPointSet(profile);
      }

      return {
        imageWidth: canvas.width,
        imageHeight: canvas.height,
        depthAmp,
        alphaThreshold,
        backgroundMaxRgbThreshold,
        profiles: pointSets,
      };

      function buildPointSet(profile) {
        const positions = [];
        const colors = [];
        const sizes = [];
        const details = [];
        const step = profile.step;
        let minLum = Infinity;
        let maxLum = -Infinity;
        let sumLum = 0;
        let minDepth = Infinity;
        let maxDepth = -Infinity;
        let sumDepth = 0;
        let minSize = Infinity;
        let maxSize = -Infinity;
        let sumSize = 0;
        let detailCount = 0;
        let edgeCount = 0;
        let darkCount = 0;
        let fineSizeCount = 0;
        let broadSizeCount = 0;

        for (let y = 0; y < canvas.height; y += step) {
          for (let x = 0; x < canvas.width; x += step) {
            if (!isSourcePixelAt(x, y)) continue;

            const offset = (y * canvas.width + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const luma = pixelLuma(r, g, b);
            const depth = (luma - 0.5) * depthAmp;
            const detail = localDetail(x, y, r, g, b, luma, step);
            const edge = edgeWeight(x, y, step);
            const size = pointSize(x, y, luma, detail, edge, profile);
            const [cr, cg, cb] = adjustColor(r, g, b);

            positions.push(
              (x - canvas.width / 2) / maxDimension,
              -(y - canvas.height / 2) / maxDimension,
              depth,
            );
            colors.push(cr, cg, cb);
            sizes.push(size);
            details.push(Math.round(clamp01(Math.max(detail, edge * 0.7)) * 255));

            minLum = Math.min(minLum, luma);
            maxLum = Math.max(maxLum, luma);
            sumLum += luma;
            minDepth = Math.min(minDepth, depth);
            maxDepth = Math.max(maxDepth, depth);
            sumDepth += depth;
            minSize = Math.min(minSize, size);
            maxSize = Math.max(maxSize, size);
            sumSize += size;
            if (detail > 0.34) detailCount += 1;
            if (edge > 0.18) edgeCount += 1;
            if (luma < 0.3) darkCount += 1;
            if (size < 0.78 * profile.sizeScale) fineSizeCount += 1;
            if (size > 1.16 * profile.sizeScale) broadSizeCount += 1;
          }
        }

        const count = sizes.length;
        return {
          step,
          points: positions,
          colors,
          sizes,
          details,
          stats: {
            count,
            step,
            detailCount,
            edgeCount,
            darkCount,
            fineSizeCount,
            broadSizeCount,
            minLum: count ? minLum : 0,
            maxLum: count ? maxLum : 0,
            avgLum: count ? sumLum / count : 0,
            minDepth: count ? minDepth : 0,
            maxDepth: count ? maxDepth : 0,
            avgDepth: count ? sumDepth / count : 0,
            minSize: count ? minSize : 0,
            maxSize: count ? maxSize : 0,
            avgSize: count ? sumSize / count : 0,
          },
        };
      }

      function pointSize(x, y, luma, detail, edge, profile) {
        const darkness = clamp01((0.48 - luma) * 1.75);
        const fine = clamp01(detail * 0.74 + edge * 0.5 + darkness * 0.24);
        const flatFur = clamp01(1 - detail * 1.45 - edge * 1.1 - darkness * 0.5);
        const jitter = (randomUnit(x, y, profile.step * 97 + 13) - 0.5) * 0.06;
        return clamp(0.5, 1.42, 1.08 + flatFur * 0.1 - fine * 0.5 + jitter) * profile.sizeScale;
      }

      function localDetail(x, y, r, g, b, luma, step) {
        const offsets = [
          [-step, 0],
          [step, 0],
          [0, -step],
          [0, step],
          [-step, -step],
          [step, -step],
          [-step, step],
          [step, step],
          [-step * 2, 0],
          [step * 2, 0],
          [0, -step * 2],
          [0, step * 2],
        ];
        let lumaTotal = 0;
        let colorTotal = 0;
        let maxLuma = 0;
        let maxColor = 0;
        let count = 0;

        for (const [dx, dy] of offsets) {
          const pixel = readPixel(x + dx, y + dy);
          if (!pixel) continue;
          const lumaDelta = Math.abs(pixel.luma - luma);
          const colorDelta = (
            Math.abs(pixel.r - r) +
            Math.abs(pixel.g - g) +
            Math.abs(pixel.b - b)
          ) / (255 * 3);
          lumaTotal += lumaDelta;
          colorTotal += colorDelta;
          maxLuma = Math.max(maxLuma, lumaDelta);
          maxColor = Math.max(maxColor, colorDelta);
          count += 1;
        }

        if (!count) return 0;
        return clamp01(
          (lumaTotal / count) * 4.8 +
          maxLuma * 0.9 +
          (colorTotal / count) * 3.6 +
          maxColor * 0.45,
        );
      }

      function edgeWeight(x, y, step) {
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
          if (!isSourcePixelAt(x + dx * step, y + dy * step)) nearEmpty += 1;
          if (!isSourcePixelAt(x + dx * step * 2, y + dy * step * 2)) farEmpty += 1;
        }

        return clamp01(nearEmpty * 0.13 + farEmpty * 0.04);
      }

      function adjustColor(r, g, b) {
        let rr = r / 255;
        let gg = g / 255;
        let bb = b / 255;
        const luma = 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;

        rr = clamp01(luma + (rr - luma) * colorSaturation);
        gg = clamp01(luma + (gg - luma) * colorSaturation);
        bb = clamp01(luma + (bb - luma) * colorSaturation);

        rr = clamp01((rr - 0.5) * colorContrast + 0.5);
        gg = clamp01((gg - 0.5) * colorContrast + 0.5);
        bb = clamp01((bb - 0.5) * colorContrast + 0.5);

        return [
          Math.round(rr * 255),
          Math.round(gg * 255),
          Math.round(bb * 255),
        ];
      }

      function readPixel(x, y) {
        if (!isSourcePixelAt(x, y)) return null;
        const sx = Math.floor(x);
        const sy = Math.floor(y);
        const offset = (sy * canvas.width + sx) * 4;
        const r = data[offset];
        const g = data[offset + 1];
        const b = data[offset + 2];
        return { r, g, b, luma: pixelLuma(r, g, b) };
      }

      function isSourcePixelAt(x, y) {
        const sx = Math.floor(x);
        const sy = Math.floor(y);
        if (sx < 0 || sy < 0 || sx >= canvas.width || sy >= canvas.height) return false;
        const offset = (sy * canvas.width + sx) * 4;
        if (data[offset + 3] < alphaThreshold) return false;
        return Math.max(data[offset], data[offset + 1], data[offset + 2]) > backgroundMaxRgbThreshold;
      }

      function pixelLuma(r, g, b) {
        return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      }

      function clamp01(value) {
        return Math.max(0, Math.min(1, value));
      }

      function clamp(min, max, value) {
        return Math.max(min, Math.min(max, value));
      }

      function randomUnit(x, y, salt) {
        let n = Math.imul((x | 0) + Math.imul(salt + 1, 0x9e3779b1), 0x85ebca6b) ^
          Math.imul((y | 0) + Math.imul(salt + 1, 0xc2b2ae35), 0x27d4eb2f);
        n ^= n >>> 15;
        n = Math.imul(n, 0x2c1b3c6d);
        n ^= n >>> 12;
        n = Math.imul(n, 0x297a2d39);
        n ^= n >>> 15;
        return (n >>> 0) / 4294967295;
      }
    },
    {
      imgSrc,
      alphaThreshold,
      backgroundMaxRgbThreshold,
      colorContrast,
      colorSaturation,
      depthAmp,
      profiles,
    },
  );

  const encodedProfiles = Object.fromEntries(
    profiles.map((profile) => [profile.key, encodePointSet(result.profiles[profile.key])]),
  );
  const output = `// Generated by scripts/generate-hero-cat-points.mjs from ${sourcePath.replaceAll('\\', '/')}.
// Faithful masked pixel sampling: alpha >= ${result.alphaThreshold}, max(rgb) > ${result.backgroundMaxRgbThreshold}, no ROI, quotas, contours, or synthetic rim points.

export const HERO_CAT_IMAGE_SIZE = { width: ${result.imageWidth}, height: ${result.imageHeight} } as const;
export const HERO_CAT_DEPTH_AMP = ${result.depthAmp};
export const HERO_CAT_PROFILE_STEPS = ${JSON.stringify(profileSteps(result.profiles), null, 2)} as const;
export const HERO_CAT_SOURCE_STEP = ${result.profiles.desktop.step};
export const HERO_CAT_SOURCE_SAMPLE_COUNT = ${result.profiles.desktop.stats.count};
export const HERO_CAT_POINT_COUNT = ${result.profiles.desktop.stats.count};
export const HERO_CAT_MAX_POINT_COUNT = ${result.profiles.max.stats.count};
export const HERO_CAT_LOW_POWER_POINT_COUNT = ${result.profiles.lowPower.stats.count};
export const HERO_CAT_ULTRA_LOW_POWER_POINT_COUNT = ${result.profiles.ultraLowPower.stats.count};
export const HERO_CAT_DETAIL_COUNTS = {
  max: ${formatStats(result.profiles.max.stats)},
  desktop: ${formatStats(result.profiles.desktop.stats)},
  lowPower: ${formatStats(result.profiles.lowPower.stats)},
  ultraLowPower: ${formatStats(result.profiles.ultraLowPower.stats)},
} as const;
${profiles.map((profile) => formatProfileExport(profile, encodedProfiles[profile.key])).join('\n')}`;

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output);
  console.log(
    [
      `Generated ${outputPath} from ${sourcePath}`,
      `Image: ${result.imageWidth}x${result.imageHeight}, mask alpha>=${result.alphaThreshold} && max(rgb)>${result.backgroundMaxRgbThreshold}, depthAmp=${result.depthAmp}`,
      profiles.map((profile) => `${profile.key}: step=${result.profiles[profile.key].step}, count=${result.profiles[profile.key].stats.count}, ${formatStatsForLog(result.profiles[profile.key].stats)}`).join('\n'),
      'ROI/quota/importance/contour/rim systems are not used.',
    ].join('\n'),
  );
} finally {
  await browser.close();
}

async function loadImageSource(path) {
  const bytes = await readFile(path);
  if (path.toLowerCase().endsWith('.html')) {
    const html = bytes.toString('utf8');
    const imgMatch = html.match(/const\s+IMG\s*=\s*"([^"]+)"/);
    if (!imgMatch) {
      throw new Error(`Unable to find embedded IMG data URL in ${path}`);
    }
    return imgMatch[1];
  }

  return `data:${mimeForPath(path)};base64,${bytes.toString('base64')}`;
}

function mimeForPath(path) {
  const lower = path.toLowerCase();
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'image/png';
}

function encodePointSet(pointSet) {
  const floats = new Float32Array(pointSet.points);
  const colors = new Uint8Array(pointSet.colors);
  const sizes = new Float32Array(pointSet.sizes);
  const details = new Uint8Array(pointSet.details);
  return {
    pointsBase64: Buffer.from(new Uint8Array(floats.buffer)).toString('base64'),
    colorsBase64: Buffer.from(colors).toString('base64'),
    sizesBase64: Buffer.from(new Uint8Array(sizes.buffer)).toString('base64'),
    detailsBase64: Buffer.from(details).toString('base64'),
  };
}

function profileSteps(pointSets) {
  return {
    max: pointSets.max.step,
    desktop: pointSets.desktop.step,
    lowPower: pointSets.lowPower.step,
    ultraLowPower: pointSets.ultraLowPower.step,
  };
}

function formatProfileExport(profile, encoded) {
  return `export const ${profile.constPrefix}_POINTS_BASE64 = [
${chunkBase64(encoded.pointsBase64)}
].join('');
export const ${profile.constPrefix}_COLORS_BASE64 = [
${chunkBase64(encoded.colorsBase64)}
].join('');
export const ${profile.constPrefix}_SIZES_BASE64 = [
${chunkBase64(encoded.sizesBase64)}
].join('');
export const ${profile.constPrefix}_DETAIL_BASE64 = [
${chunkBase64(encoded.detailsBase64)}
].join('');
`;
}

function formatStats(stats) {
  return `{ count: ${stats.count}, step: ${stats.step}, detail: ${stats.detailCount}, edges: ${stats.edgeCount}, dark: ${stats.darkCount}, fineSize: ${stats.fineSizeCount}, broadSize: ${stats.broadSizeCount}, minSize: ${stats.minSize.toFixed(3)}, maxSize: ${stats.maxSize.toFixed(3)}, avgSize: ${stats.avgSize.toFixed(3)}, minDepth: ${stats.minDepth.toFixed(3)}, maxDepth: ${stats.maxDepth.toFixed(3)}, avgDepth: ${stats.avgDepth.toFixed(3)}, minLum: ${stats.minLum.toFixed(3)}, maxLum: ${stats.maxLum.toFixed(3)}, avgLum: ${stats.avgLum.toFixed(3)} }`;
}

function formatStatsForLog(stats) {
  return `detail=${stats.detailCount}, edges=${stats.edgeCount}, dark=${stats.darkCount}, size=${stats.minSize.toFixed(3)}/${stats.avgSize.toFixed(3)}/${stats.maxSize.toFixed(3)}, depth=${stats.minDepth.toFixed(3)}/${stats.avgDepth.toFixed(3)}/${stats.maxDepth.toFixed(3)}, lum=${stats.minLum.toFixed(3)}/${stats.avgLum.toFixed(3)}/${stats.maxLum.toFixed(3)}`;
}

function chunkBase64(base64) {
  const chunks = base64.match(/.{1,96}/g) || [];
  return chunks.map((chunk) => `  '${chunk}',`).join('\n');
}
