import { Buffer } from 'node:buffer';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sourcePath = process.argv[2] || 'C:/Users/sirok/Downloads/kocka_body.png';
const outputPath = resolve(__dirname, '../src/data/heroCatPoints.ts');
const sourceStep = 2;
const desktopTarget = 17000;
const lowPowerTarget = 6000;

const imgSrc = await loadImageSource(sourcePath);

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
      const backgroundMaxRgbThreshold = 3;
      const catRoi = {
        // Owner-calibratable high-res source ratios. Coordinates are normalized to kocka_body.png.
        head: { x: 0.3, y: 0.23, rx: 0.16, ry: 0.15, angle: -0.42 },
        leftEye: { x: 0.26, y: 0.252, rx: 0.028, ry: 0.022, angle: -0.38 },
        rightEye: { x: 0.349, y: 0.207, rx: 0.025, ry: 0.021, angle: -0.12 },
        nose: { x: 0.444, y: 0.575, rx: 0.036, ry: 0.028, angle: -0.58 },
      };
      const desktopProfile = {
        base: 0.27,
        outline: 2.34,
        contrast: 1.54,
        colorVariance: 1.74,
        head: 0.9,
        eye: 3.36,
        nose: 2.3,
        eyeQuota: 0.086,
        headQuota: 0.34,
        coverageQuota: 0.39,
        detailQuota: 0.66,
        detailThreshold: 0.2,
        sizeMin: 0.45,
        sizeMax: 1.55,
        sizeScale: 1,
      };
      const lowPowerProfile = {
        base: 0.22,
        outline: 2.4,
        contrast: 1.62,
        colorVariance: 1.82,
        head: 1.02,
        eye: 3.52,
        nose: 2.44,
        eyeQuota: 0.09,
        headQuota: 0.36,
        coverageQuota: 0.37,
        detailQuota: 0.63,
        detailThreshold: 0.22,
        sizeMin: 0.45,
        sizeMax: 1.55,
        sizeScale: 1.02,
      };
      const raw = [];

      for (let y = 0; y < canvas.height; y += sourceStep) {
        for (let x = 0; x < canvas.width; x += sourceStep) {
          const offset = (y * canvas.width + x) * 4;
          const alpha = data[offset + 3];
          if (!isSourcePixelAt(x, y)) continue;

          const r = data[offset];
          const g = data[offset + 1];
          const b = data[offset + 2];
          const lum = pixelLuma(r, g, b);
          const outline = edgeWeight(x, y);
          const { contrast, colorVariance } = localDetail(x, y, r, g, b, lum);
          const { head, eye, leftEye, rightEye, nose } = roiWeights(x, y, lum, contrast);
          const detail = clamp01(
            contrast * 0.48 +
            colorVariance * 0.52 +
            outline * 0.28 +
            head * 0.08 +
            eye * 0.7 +
            nose * 0.34,
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
            leftEye,
            rightEye,
            nose,
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
        rimSourceCount: 0,
        roi: catRoi,
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
        let leftEyeCount = 0;
        let rightEyeCount = 0;
        let noseCount = 0;
        let leftEyeX = 0;
        let leftEyeY = 0;
        let leftEyeWeight = 0;
        let rightEyeX = 0;
        let rightEyeY = 0;
        let rightEyeWeight = 0;
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
          if (point.leftEye > 0.06) {
            leftEyeCount += 1;
            leftEyeX += point.x * point.leftEye;
            leftEyeY += point.y * point.leftEye;
            leftEyeWeight += point.leftEye;
          }
          if (point.rightEye > 0.06) {
            rightEyeCount += 1;
            rightEyeX += point.x * point.rightEye;
            rightEyeY += point.y * point.rightEye;
            rightEyeWeight += point.rightEye;
          }
          if (point.nose > 0.06) noseCount += 1;
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
            leftEyeCount,
            rightEyeCount,
            noseCount,
            leftEyeCentroid: weightedCentroid(leftEyeX, leftEyeY, leftEyeWeight),
            rightEyeCentroid: weightedCentroid(rightEyeX, rightEyeY, rightEyeWeight),
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
        const feature = Math.max(point.eye, point.nose);
        const fineDetail = clamp01(
          point.detail * 0.62 +
          point.contrast * 0.22 +
          point.colorVariance * 0.28 +
          point.eye * 0.52 +
          point.nose * 0.28 +
          point.outline * 0.16 +
          density * 0.24,
        );
        const sparseFlat = clamp01(
          (1 - point.detail * 0.72 - point.contrast * 0.18 - point.colorVariance * 0.22) *
          (1 - density * 0.54),
        );
        const depthFill = clamp01((point.lum - 0.5) * 0.24 + 0.12) * 0.08;
        const jitter = (randomUnit(point.x, point.y, salt) - 0.5) * 0.1;
        let size;

        if (feature > 0.06) {
          size = 0.78 - feature * 0.18 - fineDetail * 0.12 + jitter * 0.52;
          return clamp(0.45, 0.85, size * profile.sizeScale);
        }

        if (point.outline > 0.12) {
          size = 1.08 + point.outline * 0.34 + sparseFlat * 0.12 + jitter;
          return clamp(1, 1.55, size * profile.sizeScale);
        }

        if (
          fineDetail > 0.64 ||
          (point.contrast > 0.46 && point.colorVariance > 0.38 && density > 0.34)
        ) {
          size = 1.02 - fineDetail * 0.22 - density * 0.06 + jitter * 0.62;
          return clamp(0.55, 1.05, size * profile.sizeScale);
        }

        size = 1.02 + sparseFlat * 0.16 + depthFill - density * 0.03 + jitter;
        return clamp(0.85, 1.25, size * profile.sizeScale);
      }

      function selectPointSet(points, target, profile, salt) {
        const used = new Uint8Array(points.length);
        const selected = [];

        const eyeQuota = Math.round(target * profile.eyeQuota);
        ensureQuota(
          Math.round(eyeQuota * 0.45),
          (point) => point.leftEye > 0.06,
          (point) => point.leftEye * 3.8 + point.contrast * 0.9 + (1 - point.lum) * 0.36,
          salt + 7,
        );
        ensureQuota(
          Math.round(eyeQuota * 0.45),
          (point) => point.rightEye > 0.06,
          (point) => point.rightEye * 3.8 + point.contrast * 0.9 + (1 - point.lum) * 0.36,
          salt + 9,
        );
        ensureQuota(
          eyeQuota,
          (point) => point.eye > 0.06,
          (point) => point.eye * 3.5 + point.contrast * 0.8,
          salt + 11,
        );
        ensureSpatialQuota(
          Math.round(target * profile.coverageQuota),
          () => true,
          (point) => point.detail * 1.25 + point.colorVariance * 0.72 + point.contrast * 0.58 + point.outline * 0.34,
          Math.max(38, Math.round(Math.min(canvas.width, canvas.height) / 8)),
          salt + 19,
        );
        ensureQuota(
          Math.round(target * profile.headQuota),
          (point) => point.head > 0.08,
          (point) => point.head * 1.5 + point.colorVariance * 0.7 + point.contrast * 0.45,
          salt + 23,
        );
        ensureQuota(
          Math.round(target * profile.detailQuota),
          (point) => (
            point.detail > profile.detailThreshold ||
            point.contrast > 0.2 ||
            point.colorVariance > 0.16
          ),
          (point) => point.detail * 1.6 + point.colorVariance * 0.65 + point.contrast * 0.55,
          salt + 37,
        );
        pick(target - selected.length, () => true, () => 0, salt + 53);
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
          point.outline * profile.outline +
          point.contrast * profile.contrast +
          point.colorVariance * profile.colorVariance +
          point.head * profile.head +
          point.eye * profile.eye +
          point.nose * profile.nose,
        );
      }

      function weightedRank(point, weight, salt) {
        const random = Math.max(1e-7, randomUnit(point.x, point.y, salt));
        return -Math.log(random) / Math.max(0.04, weight);
      }

      function sourceMaskAt(x, y) {
        return isSourcePixelAt(x, y) ? 255 : 0;
      }

      function isSourcePixelAt(x, y) {
        if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return 0;
        const offset = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
        const alpha = data[offset + 3];
        if (alpha < alphaThreshold) return false;
        return Math.max(data[offset], data[offset + 1], data[offset + 2]) > backgroundMaxRgbThreshold;
      }

      function readPixel(x, y) {
        if (!isSourcePixelAt(x, y)) return null;
        const offset = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
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
          if (!pixel) continue;
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
        const head = roiEllipseWeight(x, y, catRoi.head, w, h);
        const darkFeature = clamp01((0.32 - lum) * 3.4 + contrast * 0.28);
        const eyeTone = 0.42 + darkFeature * 0.82;
        const leftEye = clamp01(roiEllipseWeight(x, y, catRoi.leftEye, w, h) * eyeTone);
        const rightEye = clamp01(roiEllipseWeight(x, y, catRoi.rightEye, w, h) * eyeTone);
        const eye = Math.max(leftEye, rightEye);
        const nose = clamp01(roiEllipseWeight(x, y, catRoi.nose, w, h) * (0.76 + contrast * 0.36));
        return { head, eye, leftEye, rightEye, nose };
      }

      function roiEllipseWeight(x, y, roi, width, height) {
        return rotatedEllipseWeight(
          x,
          y,
          width * roi.x,
          height * roi.y,
          width * roi.rx,
          height * roi.ry,
          roi.angle,
        );
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
          if (sourceMaskAt(x + dx * sourceStep, y + dy * sourceStep) < alphaThreshold) nearEmpty += 1;
          if (sourceMaskAt(x + dx * sourceStep * 2, y + dy * sourceStep * 2) < alphaThreshold) farEmpty += 1;
        }

        return clamp01(nearEmpty * 0.16 + farEmpty * 0.045);
      }

      function adjustColorForHero(point) {
        let rr = point.srcR / 255;
        let gg = point.srcG / 255;
        let bb = point.srcB / 255;
        const lum = luma(rr, gg, bb);
        const px = (point.x - centerX) / span;
        const py = (point.y - centerY) / span;
        const saturation = 1.28 + point.colorVariance * 0.24 + point.detail * 0.06;
        const contrast = 1.16 + point.contrast * 0.2;
        const keyLight = clamp01(0.5 - px * 0.18 - py * 0.32 + lum * 0.2 + point.detail * 0.07);
        const formShadow = clamp01(0.36 + px * 0.18 + py * 0.3 - lum * 0.16 + point.outline * 0.16);
        const warmTabby = clamp01((rr * 1.28 + gg * 0.72 - bb * 0.42) * 0.6);

        rr = clamp01(lum + (rr - lum) * saturation);
        gg = clamp01(lum + (gg - lum) * saturation);
        bb = clamp01(lum + (bb - lum) * saturation);

        rr = clamp01((rr - 0.5) * contrast + 0.5);
        gg = clamp01((gg - 0.5) * contrast + 0.5);
        bb = clamp01((bb - 0.5) * contrast + 0.5);

        const shade = 0.82 + keyLight * 0.27 - formShadow * 0.22;
        rr = clamp01(rr * shade + warmTabby * 0.055 + keyLight * 0.016);
        gg = clamp01(gg * shade + warmTabby * 0.024 + keyLight * 0.009);
        bb = clamp01(bb * (shade - warmTabby * 0.06));

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

      function weightedCentroid(sumX, sumY, weight) {
        if (weight <= 0) return null;
        const x = sumX / weight;
        const y = sumY / weight;
        return { x, y, nx: x / canvas.width, ny: y / canvas.height };
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
    { imgSrc, sourceStep, desktopTarget, lowPowerTarget },
  );

  const desktop = encodePointSet(result.desktop);
  const lowPower = encodePointSet(result.lowPower);
  const output = `// Generated by scripts/generate-hero-cat-points.mjs from ${sourcePath.replaceAll('\\', '/')}.
// Source PNG is sampled once through canvas getImageData(step=${sourceStep}); runtime decodes baked positions, RGB colors, point sizes, outline weights, and detail weights.

export const HERO_CAT_SOURCE_STEP = ${sourceStep};
export const HERO_CAT_SOURCE_SAMPLE_COUNT = ${result.sourceCount};
export const HERO_CAT_RIM_SOURCE_COUNT = ${result.rimSourceCount};
export const HERO_CAT_IMAGE_SIZE = { width: ${result.imageWidth}, height: ${result.imageHeight} } as const;
export const HERO_CAT_POINT_COUNT = ${desktopTarget};
export const HERO_CAT_LOW_POWER_POINT_COUNT = ${lowPowerTarget};
export const HERO_CAT_ROI = ${JSON.stringify(result.roi, null, 2)} as const;
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
      `Synthetic rim candidates disabled: ${result.rimSourceCount}`,
      `Desktop detail counts: ${formatStatsForLog(result.desktop.stats)}`,
      `Low-power detail counts: ${formatStatsForLog(result.lowPower.stats)}`,
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
  return `{ count: ${stats.count}, head: ${stats.headCount}, eyes: ${stats.eyeCount}, leftEye: ${stats.leftEyeCount}, rightEye: ${stats.rightEyeCount}, nose: ${stats.noseCount}, outline: ${stats.outlineCount}, rim: ${stats.rimCount}, contrast: ${stats.contrastCount}, colorVariance: ${stats.colorVarianceCount}, fineSize: ${stats.fineSizeCount}, broadSize: ${stats.broadSizeCount}, minSize: ${stats.minSize.toFixed(3)}, maxSize: ${stats.maxSize.toFixed(3)}, avgSize: ${stats.avgSize.toFixed(3)}, minLum: ${stats.minLum.toFixed(3)}, maxLum: ${stats.maxLum.toFixed(3)}, avgLum: ${stats.avgLum.toFixed(3)}, leftEyeCentroid: ${formatCentroid(stats.leftEyeCentroid)}, rightEyeCentroid: ${formatCentroid(stats.rightEyeCentroid)} }`;
}

function formatStatsForLog(stats) {
  return `count=${stats.count}, head=${stats.headCount}, eyes=${stats.eyeCount} (L=${stats.leftEyeCount} ${formatCentroidForLog(stats.leftEyeCentroid)}, R=${stats.rightEyeCount} ${formatCentroidForLog(stats.rightEyeCentroid)}), nose=${stats.noseCount}, outline=${stats.outlineCount}, rim=${stats.rimCount}, contrast=${stats.contrastCount}, colorVariance=${stats.colorVarianceCount}, size=${stats.minSize.toFixed(3)}/${stats.avgSize.toFixed(3)}/${stats.maxSize.toFixed(3)}, fine=${stats.fineSizeCount}, broad=${stats.broadSizeCount}, lum=${stats.minLum.toFixed(3)}/${stats.avgLum.toFixed(3)}/${stats.maxLum.toFixed(3)}`;
}

function formatCentroid(centroid) {
  if (!centroid) return 'null';
  return `{ x: ${centroid.x.toFixed(1)}, y: ${centroid.y.toFixed(1)}, nx: ${centroid.nx.toFixed(4)}, ny: ${centroid.ny.toFixed(4)} }`;
}

function formatCentroidForLog(centroid) {
  if (!centroid) return 'n/a';
  return `@${centroid.nx.toFixed(4)},${centroid.ny.toFixed(4)}`;
}

function chunkBase64(base64) {
  const chunks = base64.match(/.{1,96}/g) || [];
  return chunks.map((chunk) => `  '${chunk}',`).join('\n');
}
