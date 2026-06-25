import { Buffer } from 'node:buffer';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sourcePath = process.argv[2] || 'C:/Users/sirok/Downloads/kocka_body_3d.html';
const outputPath = resolve(__dirname, '../src/data/heroCatPoints.ts');
const sourceStep = 2;
const desktopTarget = 19000;
const lowPowerTarget = 6800;

const html = await readFile(sourcePath, 'utf8');
const imgMatch = html.match(/const\s+IMG\s*=\s*"([^"]+)"/);

if (!imgMatch) {
  throw new Error(`Unable to find embedded IMG data URL in ${sourcePath}`);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  const result = await page.evaluate(
    async ({ imgSrc, sourceStep, desktopTarget, lowPowerTarget }) => {
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
      const alphaThreshold = 40;
      const desktopProfile = {
        base: 0.27,
        outline: 2.18,
        rim: 4.2,
        contrast: 1.48,
        colorVariance: 1.68,
        head: 0.84,
        eye: 2.95,
        rimQuota: 0.1,
        eyeQuota: 0.078,
        headQuota: 0.36,
        coverageQuota: 0.39,
        detailQuota: 0.68,
        detailThreshold: 0.2,
        sizeMin: 0.52,
        sizeMax: 1.48,
        rimSize: 1.38,
        sizeScale: 1,
      };
      const lowPowerProfile = {
        base: 0.22,
        outline: 2.25,
        rim: 4.35,
        contrast: 1.56,
        colorVariance: 1.76,
        head: 0.98,
        eye: 3.08,
        rimQuota: 0.11,
        eyeQuota: 0.086,
        headQuota: 0.38,
        coverageQuota: 0.37,
        detailQuota: 0.64,
        detailThreshold: 0.22,
        sizeMin: 0.58,
        sizeMax: 1.58,
        rimSize: 1.5,
        sizeScale: 1.04,
      };
      const raw = [];

      for (let y = 0; y < canvas.height; y += sourceStep) {
        for (let x = 0; x < canvas.width; x += sourceStep) {
          const offset = (y * canvas.width + x) * 4;
          const alpha = data[offset + 3];
          if (alpha < alphaThreshold) continue;

          const r = data[offset];
          const g = data[offset + 1];
          const b = data[offset + 2];
          const lum = pixelLuma(r, g, b);
          const outline = edgeWeight(x, y);
          const { contrast, colorVariance } = localDetail(x, y, r, g, b, lum);
          const { head, eye } = roiWeights(x, y, lum, contrast);
          const detail = clamp01(
            contrast * 0.48 +
            colorVariance * 0.52 +
            outline * 0.28 +
            head * 0.08 +
            eye * 0.68,
          );
          raw.push({
            index: raw.length,
            x,
            y,
            lum,
            srcR: r,
            srcG: g,
            srcB: b,
            r,
            g,
            b,
            outline,
            contrast,
            colorVariance,
            head,
            eye,
            detail,
            rim: 0,
          });
        }
      }

      if (raw.length < desktopTarget || raw.length < lowPowerTarget) {
        throw new Error(`Only sampled ${raw.length} points; targets are ${desktopTarget}/${lowPowerTarget}`);
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
      const bodySourceCount = raw.length;
      const rimPoints = buildRimPoints(raw, centerX, centerY);
      raw.push(...rimPoints);

      for (const point of raw) {
        const [cr, cg, cb] = adjustColorForHero(point);
        point.r = cr;
        point.g = cg;
        point.b = cb;
      }

      const desktopSelected = selectPointSet(raw, desktopTarget, desktopProfile, 17);
      const lowPowerSelected = selectPointSet(raw, lowPowerTarget, lowPowerProfile, 43);
      const desktop = buildBuffers(desktopSelected, desktopProfile, 17);
      const lowPower = buildBuffers(lowPowerSelected, lowPowerProfile, 43);

      return {
        imageWidth: canvas.width,
        imageHeight: canvas.height,
        sourceCount: bodySourceCount,
        rimSourceCount: rimPoints.length,
        desktop,
        lowPower,
      };

      function buildBuffers(selected, profile, salt) {
        const densities = localSelectionDensities(selected);
        const floats = new Float32Array(selected.length * 3);
        const colors = new Uint8Array(selected.length * 3);
        const sizes = new Float32Array(selected.length);
        const outlines = new Uint8Array(selected.length);
        const details = new Uint8Array(selected.length);
        let minLum = Infinity;
        let maxLum = -Infinity;
        let sumLum = 0;
        let minSize = Infinity;
        let maxSize = -Infinity;
        let sumSize = 0;
        let fineSizeCount = 0;
        let broadSizeCount = 0;
        let outlineCount = 0;
        let rimCount = 0;
        let headCount = 0;
        let eyeCount = 0;
        let contrastCount = 0;
        let colorVarianceCount = 0;

        for (let index = 0; index < selected.length; index += 1) {
          const point = selected[index];
          const offset = index * 3;
          floats[offset] = (point.x - centerX) / span;
          floats[offset + 1] = -(point.y - centerY) / span;
          floats[offset + 2] = (point.lum - 0.5) * 0.24;
          colors[offset] = point.r;
          colors[offset + 1] = point.g;
          colors[offset + 2] = point.b;
          sizes[index] = pointSize(point, densities[index], profile, salt + 101);
          outlines[index] = Math.round(point.outline * 255);
          details[index] = Math.round(point.detail * 255);

          const adjustedLum = (0.2126 * point.r + 0.7152 * point.g + 0.0722 * point.b) / 255;
          const size = sizes[index];
          minLum = Math.min(minLum, adjustedLum);
          maxLum = Math.max(maxLum, adjustedLum);
          sumLum += adjustedLum;
          minSize = Math.min(minSize, size);
          maxSize = Math.max(maxSize, size);
          sumSize += size;
          if (size < 0.8) fineSizeCount += 1;
          if (size > 1.16) broadSizeCount += 1;
          if (point.outline > 0.08) outlineCount += 1;
          if (point.rim > 0.5) rimCount += 1;
          if (point.head > 0.08) headCount += 1;
          if (point.eye > 0.06) eyeCount += 1;
          if (point.contrast > 0.22) contrastCount += 1;
          if (point.colorVariance > 0.18) colorVarianceCount += 1;
        }

        return {
          points: Array.from(floats),
          colors: Array.from(colors),
          sizes: Array.from(sizes),
          outlines: Array.from(outlines),
          details: Array.from(details),
          stats: {
            count: selected.length,
            minLum,
            maxLum,
            avgLum: sumLum / selected.length,
            minSize,
            maxSize,
            avgSize: sumSize / selected.length,
            fineSizeCount,
            broadSizeCount,
            outlineCount,
            rimCount,
            headCount,
            eyeCount,
            contrastCount,
            colorVarianceCount,
          },
        };
      }

      function localSelectionDensities(selected) {
        const radius = 14;
        const radiusSq = radius * radius;
        const cellSize = radius;
        const buckets = new Map();
        const rawDensities = new Float32Array(selected.length);

        for (let index = 0; index < selected.length; index += 1) {
          const point = selected[index];
          const key = densityKey(point.x, point.y, cellSize);
          const bucket = buckets.get(key);
          if (bucket) {
            bucket.push(index);
          } else {
            buckets.set(key, [index]);
          }
        }

        for (let index = 0; index < selected.length; index += 1) {
          const point = selected[index];
          const cx = Math.floor(point.x / cellSize);
          const cy = Math.floor(point.y / cellSize);
          let density = 0;

          for (let gy = cy - 1; gy <= cy + 1; gy += 1) {
            for (let gx = cx - 1; gx <= cx + 1; gx += 1) {
              const bucket = buckets.get(`${gx}:${gy}`);
              if (!bucket) continue;

              for (const neighborIndex of bucket) {
                if (neighborIndex === index) continue;
                const neighbor = selected[neighborIndex];
                const dx = neighbor.x - point.x;
                const dy = neighbor.y - point.y;
                const distanceSq = dx * dx + dy * dy;
                if (distanceSq > radiusSq) continue;
                density += 1 - Math.sqrt(distanceSq) / radius;
              }
            }
          }

          rawDensities[index] = density;
        }

        const sorted = Array.from(rawDensities).sort((a, b) => a - b);
        const low = sorted[Math.floor(sorted.length * 0.12)] ?? 0;
        const high = sorted[Math.floor(sorted.length * 0.88)] ?? 1;
        const span = Math.max(0.001, high - low);
        const densities = new Float32Array(selected.length);

        for (let index = 0; index < selected.length; index += 1) {
          densities[index] = clamp01((rawDensities[index] - low) / span);
        }

        return densities;
      }

      function pointSize(point, density, profile, salt) {
        if (point.rim > 0.5) {
          const rimJitter = (randomUnit(point.x, point.y, salt + 307) - 0.5) * 0.14;
          return clamp(profile.sizeMin, profile.sizeMax, (profile.rimSize + rimJitter) * profile.sizeScale);
        }

        const fineDetail = clamp01(
          point.detail * 0.62 +
          point.contrast * 0.22 +
          point.colorVariance * 0.28 +
          point.eye * 0.52 +
          point.outline * 0.16 +
          density * 0.24,
        );
        const sparseFlat = clamp01(
          (1 - point.detail * 0.72 - point.contrast * 0.18 - point.colorVariance * 0.22) *
          (1 - density * 0.54),
        );
        const depthFill = clamp01((point.lum - 0.5) * 0.24 + 0.12) * 0.08;
        const jitter = (randomUnit(point.x, point.y, salt) - 0.5) * 0.1;
        const size = (
          1.12 +
          sparseFlat * 0.34 +
          depthFill -
          fineDetail * 0.5 -
          density * 0.12 -
          point.eye * 0.12 -
          point.outline * 0.05 +
          jitter
        ) * profile.sizeScale;

        return clamp(profile.sizeMin, profile.sizeMax, size);
      }

      function selectPointSet(points, target, profile, salt) {
        const used = new Uint8Array(points.length);
        const selected = [];

        ensureSpatialQuota(
          Math.round(target * profile.rimQuota),
          (point) => point.rim > 0.5,
          (point) => point.rim * profile.rim + point.outline * profile.outline + point.detail * 0.8,
          Math.max(12, sourceStep * 7),
          salt + 7,
          (point) => point.rim > 0.5,
        );
        ensureQuota(
          Math.round(target * profile.eyeQuota),
          (point) => point.rim < 0.5 && point.eye > 0.06,
          (point) => point.eye * 3.4 + point.contrast * 0.8,
          salt + 11,
        );
        ensureSpatialQuota(
          Math.round(target * profile.coverageQuota),
          (point) => point.rim < 0.5,
          (point) => point.detail * 1.25 + point.colorVariance * 0.72 + point.contrast * 0.58 + point.outline * 0.34,
          Math.max(38, Math.round(Math.min(canvas.width, canvas.height) / 8)),
          salt + 19,
          (point) => point.rim < 0.5,
        );
        ensureQuota(
          Math.round(target * profile.headQuota),
          (point) => point.rim < 0.5 && point.head > 0.08,
          (point) => point.head * 1.5 + point.colorVariance * 0.7 + point.contrast * 0.45,
          salt + 23,
        );
        ensureQuota(
          Math.round(target * profile.detailQuota),
          (point) => point.rim < 0.5 && (
            point.detail > profile.detailThreshold ||
            point.contrast > 0.2 ||
            point.colorVariance > 0.16
          ),
          (point) => point.detail * 1.6 + point.colorVariance * 0.65 + point.contrast * 0.55,
          salt + 37,
        );
        pick(target - selected.length, (point) => point.rim < 0.5, () => 0, salt + 53);
        pick(target - selected.length, () => true, () => 0, salt + 59);

        if (selected.length < target) {
          throw new Error(`Only selected ${selected.length} points; target is ${target}`);
        }

        selected.sort((a, b) => hashPoint(a.x, a.y, salt + 71) - hashPoint(b.x, b.y, salt + 71));
        return selected;

        function ensureQuota(minCount, predicate, extraWeight, quotaSalt) {
          const need = minCount - countSelected(predicate);
          if (need > 0) pick(need, predicate, extraWeight, quotaSalt);
        }

        function countSelected(predicate) {
          let count = 0;
          for (const point of selected) {
            if (predicate(point)) count += 1;
          }
          return count;
        }

        function ensureSpatialQuota(minCount, predicate, extraWeight, cellSize, quotaSalt, countPredicate = predicate) {
          const need = minCount - countSelected(countPredicate);
          if (need <= 0) return;

          const buckets = new Map();
          for (const point of points) {
            if (used[point.index] || !predicate(point)) continue;
            const key = `${Math.floor(point.x / cellSize)}:${Math.floor(point.y / cellSize)}`;
            const bucket = buckets.get(key);
            const entry = {
              point,
              rank: weightedRank(point, selectionWeight(point, profile) + extraWeight(point), quotaSalt),
            };
            if (bucket) {
              bucket.push(entry);
            } else {
              buckets.set(key, [entry]);
            }
          }

          const orderedBuckets = Array.from(buckets.entries())
            .map(([key, bucket]) => ({
              key,
              cursor: 0,
              bucket: bucket.sort((a, b) => a.rank - b.rank || a.point.index - b.point.index),
            }))
            .sort((a, b) => hashString(a.key, quotaSalt) - hashString(b.key, quotaSalt));

          let selectedCount = 0;
          let madeProgress = true;
          while (selectedCount < need && madeProgress) {
            madeProgress = false;
            for (const entry of orderedBuckets) {
              while (entry.cursor < entry.bucket.length && used[entry.bucket[entry.cursor].point.index]) {
                entry.cursor += 1;
              }
              if (entry.cursor >= entry.bucket.length) continue;
              const point = entry.bucket[entry.cursor].point;
              entry.cursor += 1;
              used[point.index] = 1;
              selected.push(point);
              selectedCount += 1;
              madeProgress = true;
              if (selectedCount >= need) break;
            }
          }
        }

        function pick(count, predicate, extraWeight, pickSalt) {
          if (count <= 0) return;
          const scored = [];
          for (const point of points) {
            if (used[point.index] || !predicate(point)) continue;
            const weight = selectionWeight(point, profile) + extraWeight(point);
            scored.push({
              point,
              rank: weightedRank(point, weight, pickSalt),
            });
          }

          scored.sort((a, b) => a.rank - b.rank || a.point.index - b.point.index);
          const take = Math.min(count, scored.length);
          for (let index = 0; index < take; index += 1) {
            const point = scored[index].point;
            used[point.index] = 1;
            selected.push(point);
          }
        }
      }

      function selectionWeight(point, profile) {
        return Math.max(
          0.04,
          profile.base +
          point.rim * profile.rim +
          point.outline * profile.outline +
          point.contrast * profile.contrast +
          point.colorVariance * profile.colorVariance +
          point.head * profile.head +
          point.eye * profile.eye,
        );
      }

      function weightedRank(point, weight, salt) {
        const random = Math.max(1e-7, randomUnit(point.x, point.y, salt));
        return -Math.log(random) / Math.max(0.04, weight);
      }

      function buildRimPoints(bodyPoints, centerX, centerY) {
        const rim = [];

        for (const point of bodyPoints) {
          if (point.outline < 0.08) continue;

          const normal = outwardNormal(point.x, point.y, centerX, centerY);
          const tangentX = -normal.y;
          const tangentY = normal.x;
          const copies = point.outline > 0.34 ? 2 : 1;

          for (let copy = 0; copy < copies; copy += 1) {
            const offsetNoise = randomUnit(point.x + copy * 9, point.y - copy * 13, 607);
            const tangentNoise = randomUnit(point.x - copy * 5, point.y + copy * 17, 613) - 0.5;
            const offset = sourceStep * (1.18 + copy * 0.62 + offsetNoise * 0.38);
            const tangentOffset = tangentNoise * sourceStep * 0.72;
            const x = point.x + normal.x * offset + tangentX * tangentOffset;
            const y = point.y + normal.y * offset + tangentY * tangentOffset;

            rim.push({
              index: bodyPoints.length + rim.length,
              x,
              y,
              lum: clamp01(0.68 + point.outline * 0.12 + (1 - point.lum) * 0.04),
              srcR: 244,
              srcG: 194,
              srcB: 106,
              r: 244,
              g: 194,
              b: 106,
              outline: clamp01(0.9 + point.outline * 0.1),
              contrast: clamp01(point.contrast * 0.45 + 0.32),
              colorVariance: clamp01(point.colorVariance * 0.42 + 0.34),
              head: 0,
              eye: 0,
              detail: clamp01(0.82 + point.outline * 0.12),
              rim: 1,
            });
          }
        }

        return rim;
      }

      function outwardNormal(x, y, centerX, centerY) {
        const step = sourceStep;
        const gx = (
          alphaAt(x + step, y) -
          alphaAt(x - step, y) +
          (alphaAt(x + step, y - step) + alphaAt(x + step, y + step) -
            alphaAt(x - step, y - step) - alphaAt(x - step, y + step)) * 0.5
        );
        const gy = (
          alphaAt(x, y + step) -
          alphaAt(x, y - step) +
          (alphaAt(x - step, y + step) + alphaAt(x + step, y + step) -
            alphaAt(x - step, y - step) - alphaAt(x + step, y - step)) * 0.5
        );
        const length = Math.hypot(gx, gy);

        if (length > 0.001) {
          return { x: -gx / length, y: -gy / length };
        }

        const fallbackX = x - centerX;
        const fallbackY = y - centerY;
        const fallbackLength = Math.hypot(fallbackX, fallbackY) || 1;
        return { x: fallbackX / fallbackLength, y: fallbackY / fallbackLength };
      }

      function alphaAt(x, y) {
        if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return 0;
        return data[(y * canvas.width + x) * 4 + 3];
      }

      function readPixel(x, y) {
        if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return null;
        const offset = (y * canvas.width + x) * 4;
        const a = data[offset + 3];
        const r = data[offset];
        const g = data[offset + 1];
        const b = data[offset + 2];
        return { r, g, b, a, lum: pixelLuma(r, g, b) };
      }

      function localDetail(x, y, r, g, b, lum) {
        const offsets = [
          [-sourceStep, 0],
          [sourceStep, 0],
          [0, -sourceStep],
          [0, sourceStep],
          [-sourceStep, -sourceStep],
          [sourceStep, -sourceStep],
          [-sourceStep, sourceStep],
          [sourceStep, sourceStep],
          [-sourceStep * 2, 0],
          [sourceStep * 2, 0],
          [0, -sourceStep * 2],
          [0, sourceStep * 2],
          [-sourceStep * 3, -sourceStep],
          [sourceStep * 3, sourceStep],
          [-sourceStep, sourceStep * 3],
          [sourceStep, -sourceStep * 3],
        ];
        let lumTotal = 0;
        let colorTotal = 0;
        let maxLum = 0;
        let maxColor = 0;
        let count = 0;

        for (const [dx, dy] of offsets) {
          const pixel = readPixel(x + dx, y + dy);
          if (!pixel || pixel.a < alphaThreshold) continue;
          const lumDelta = Math.abs(pixel.lum - lum);
          const colorDelta = (
            Math.abs(pixel.r - r) +
            Math.abs(pixel.g - g) +
            Math.abs(pixel.b - b)
          ) / (255 * 3);
          lumTotal += lumDelta;
          colorTotal += colorDelta;
          maxLum = Math.max(maxLum, lumDelta);
          maxColor = Math.max(maxColor, colorDelta);
          count += 1;
        }

        const avgLum = count ? lumTotal / count : 0;
        const avgColor = count ? colorTotal / count : 0;
        return {
          contrast: clamp01(avgLum * 4.8 + maxLum * 0.95),
          colorVariance: clamp01(avgColor * 5 + maxColor * 0.6),
        };
      }

      function roiWeights(x, y, lum, contrast) {
        const w = canvas.width;
        const h = canvas.height;
        const head = Math.max(
          rotatedEllipseWeight(x, y, w * 0.29, h * 0.43, w * 0.31, h * 0.24, -0.64),
          rotatedEllipseWeight(x, y, w * 0.25, h * 0.56, w * 0.24, h * 0.16, -0.18),
        );
        const eyeCore = Math.max(
          rotatedEllipseWeight(x, y, w * 0.255, h * 0.555, w * 0.061, h * 0.038, -0.34),
          rotatedEllipseWeight(x, y, w * 0.402, h * 0.36, w * 0.047, h * 0.062, -0.08),
        );
        const eye = clamp01(eyeCore * (0.82 + (1 - lum) * 0.48 + contrast * 0.3));
        return { head, eye };
      }

      function rotatedEllipseWeight(x, y, cx, cy, rx, ry, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const dx = x - cx;
        const dy = y - cy;
        const px = (dx * cos + dy * sin) / rx;
        const py = (-dx * sin + dy * cos) / ry;
        const distance = px * px + py * py;
        return clamp01((1 - distance) * 1.25);
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
          if (alphaAt(x + dx * sourceStep, y + dy * sourceStep) < alphaThreshold) nearEmpty += 1;
          if (alphaAt(x + dx * sourceStep * 2, y + dy * sourceStep * 2) < alphaThreshold) farEmpty += 1;
        }

        return clamp01(nearEmpty * 0.16 + farEmpty * 0.045);
      }

      function adjustColorForHero(point) {
        if (point.rim > 0.5) {
          const px = (point.x - centerX) / span;
          const py = (point.y - centerY) / span;
          const glow = clamp01(0.7 - px * 0.16 - py * 0.12 + point.outline * 0.2);
          return [
            Math.round((0.86 + glow * 0.12) * 255),
            Math.round((0.62 + glow * 0.14) * 255),
            Math.round((0.28 + glow * 0.1) * 255),
          ];
        }

        let rr = point.srcR / 255;
        let gg = point.srcG / 255;
        let bb = point.srcB / 255;
        const lum = luma(rr, gg, bb);
        const px = (point.x - centerX) / span;
        const py = (point.y - centerY) / span;
        const saturation = 1.16 + point.colorVariance * 0.16;
        const contrast = 1.08 + point.contrast * 0.12;
        const keyLight = clamp01(0.52 - px * 0.2 - py * 0.34 + lum * 0.22 + point.detail * 0.08);
        const formShadow = clamp01(0.32 + px * 0.16 + py * 0.28 - lum * 0.18);
        const warmTabby = clamp01((rr * 1.18 + gg * 0.7 - bb * 0.4) * 0.55);

        rr = clamp01(lum + (rr - lum) * saturation);
        gg = clamp01(lum + (gg - lum) * saturation);
        bb = clamp01(lum + (bb - lum) * saturation);

        rr = clamp01((rr - 0.5) * contrast + 0.5);
        gg = clamp01((gg - 0.5) * contrast + 0.5);
        bb = clamp01((bb - 0.5) * contrast + 0.5);

        const shade = 0.86 + keyLight * 0.25 - formShadow * 0.16;
        rr = clamp01(rr * shade + warmTabby * 0.035 + keyLight * 0.018);
        gg = clamp01(gg * shade + warmTabby * 0.018 + keyLight * 0.01);
        bb = clamp01(bb * (shade - warmTabby * 0.045));

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

      function pixelLuma(r, g, b) {
        return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      }

      function clamp01(value) {
        return Math.max(0, Math.min(1, value));
      }

      function clamp(min, max, value) {
        return Math.max(min, Math.min(max, value));
      }

      function densityKey(x, y, cellSize) {
        return `${Math.floor(x / cellSize)}:${Math.floor(y / cellSize)}`;
      }

      function randomUnit(x, y, salt) {
        return (hashPoint(x, y, salt) + 1) / 4294967297;
      }

      function hashPoint(x, y, salt = 0) {
        let n = Math.imul((x | 0) + Math.imul(salt + 1, 0x9e3779b1), 0x85ebca6b) ^
          Math.imul((y | 0) + Math.imul(salt + 1, 0xc2b2ae35), 0x27d4eb2f);
        n ^= n >>> 15;
        n = Math.imul(n, 0x2c1b3c6d);
        n ^= n >>> 12;
        n = Math.imul(n, 0x297a2d39);
        n ^= n >>> 15;
        return n >>> 0;
      }

      function hashString(value, salt = 0) {
        let n = Math.imul(salt + 1, 0x9e3779b1);
        for (let index = 0; index < value.length; index += 1) {
          n ^= value.charCodeAt(index);
          n = Math.imul(n, 0x85ebca6b);
          n ^= n >>> 13;
        }
        return n >>> 0;
      }
    },
    { imgSrc: imgMatch[1], sourceStep, desktopTarget, lowPowerTarget },
  );

  const desktop = encodePointSet(result.desktop);
  const lowPower = encodePointSet(result.lowPower);
  const output = `// Generated by scripts/generate-hero-cat-points.mjs from ${sourcePath.replaceAll('\\', '/')}.
// Source PNG is sampled once through canvas getImageData(step=${sourceStep}); runtime decodes baked positions, RGB colors, point sizes, outline/rim weights, and detail weights.

export const HERO_CAT_SOURCE_STEP = ${sourceStep};
export const HERO_CAT_SOURCE_SAMPLE_COUNT = ${result.sourceCount};
export const HERO_CAT_RIM_SOURCE_COUNT = ${result.rimSourceCount};
export const HERO_CAT_IMAGE_SIZE = { width: ${result.imageWidth}, height: ${result.imageHeight} } as const;
export const HERO_CAT_POINT_COUNT = ${desktopTarget};
export const HERO_CAT_LOW_POWER_POINT_COUNT = ${lowPowerTarget};
export const HERO_CAT_DETAIL_COUNTS = {
  desktop: ${formatStats(result.desktop.stats)},
  lowPower: ${formatStats(result.lowPower.stats)},
} as const;
export const HERO_CAT_POINTS_BASE64 = [
${chunkBase64(desktop.pointsBase64)}
].join('');
export const HERO_CAT_COLORS_BASE64 = [
${chunkBase64(desktop.colorsBase64)}
].join('');
export const HERO_CAT_SIZES_BASE64 = [
${chunkBase64(desktop.sizesBase64)}
].join('');
export const HERO_CAT_OUTLINE_BASE64 = [
${chunkBase64(desktop.outlinesBase64)}
].join('');
export const HERO_CAT_DETAIL_BASE64 = [
${chunkBase64(desktop.detailsBase64)}
].join('');
export const HERO_CAT_LOW_POWER_POINTS_BASE64 = [
${chunkBase64(lowPower.pointsBase64)}
].join('');
export const HERO_CAT_LOW_POWER_COLORS_BASE64 = [
${chunkBase64(lowPower.colorsBase64)}
].join('');
export const HERO_CAT_LOW_POWER_SIZES_BASE64 = [
${chunkBase64(lowPower.sizesBase64)}
].join('');
export const HERO_CAT_LOW_POWER_OUTLINE_BASE64 = [
${chunkBase64(lowPower.outlinesBase64)}
].join('');
export const HERO_CAT_LOW_POWER_DETAIL_BASE64 = [
${chunkBase64(lowPower.detailsBase64)}
].join('');
`;

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output);
  console.log(
    [
      `Generated ${outputPath} from ${result.sourceCount} source points: ${desktopTarget} desktop / ${lowPowerTarget} low-power target`,
      `Generated ${result.rimSourceCount} rim candidates from the alpha contour`,
      `Desktop detail counts: ${formatStatsForLog(result.desktop.stats)}`,
      `Low-power detail counts: ${formatStatsForLog(result.lowPower.stats)}`,
    ].join('\n'),
  );
} finally {
  await browser.close();
}

function encodePointSet(pointSet) {
  const floats = new Float32Array(pointSet.points);
  const colors = new Uint8Array(pointSet.colors);
  const sizes = new Float32Array(pointSet.sizes);
  const outlines = new Uint8Array(pointSet.outlines);
  const details = new Uint8Array(pointSet.details);
  return {
    pointsBase64: Buffer.from(new Uint8Array(floats.buffer)).toString('base64'),
    colorsBase64: Buffer.from(colors).toString('base64'),
    sizesBase64: Buffer.from(new Uint8Array(sizes.buffer)).toString('base64'),
    outlinesBase64: Buffer.from(outlines).toString('base64'),
    detailsBase64: Buffer.from(details).toString('base64'),
  };
}

function formatStats(stats) {
  return `{ count: ${stats.count}, head: ${stats.headCount}, eyes: ${stats.eyeCount}, outline: ${stats.outlineCount}, rim: ${stats.rimCount}, contrast: ${stats.contrastCount}, colorVariance: ${stats.colorVarianceCount}, fineSize: ${stats.fineSizeCount}, broadSize: ${stats.broadSizeCount}, minSize: ${stats.minSize.toFixed(3)}, maxSize: ${stats.maxSize.toFixed(3)}, avgSize: ${stats.avgSize.toFixed(3)}, minLum: ${stats.minLum.toFixed(3)}, maxLum: ${stats.maxLum.toFixed(3)}, avgLum: ${stats.avgLum.toFixed(3)} }`;
}

function formatStatsForLog(stats) {
  return `count=${stats.count}, head=${stats.headCount}, eyes=${stats.eyeCount}, outline=${stats.outlineCount}, rim=${stats.rimCount}, contrast=${stats.contrastCount}, colorVariance=${stats.colorVarianceCount}, size=${stats.minSize.toFixed(3)}/${stats.avgSize.toFixed(3)}/${stats.maxSize.toFixed(3)}, fine=${stats.fineSizeCount}, broad=${stats.broadSizeCount}, lum=${stats.minLum.toFixed(3)}/${stats.avgLum.toFixed(3)}/${stats.maxLum.toFixed(3)}`;
}

function chunkBase64(base64) {
  const chunks = base64.match(/.{1,96}/g) || [];
  return chunks.map((chunk) => `  '${chunk}',`).join('\n');
}
