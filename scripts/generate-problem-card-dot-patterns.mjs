import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import ts from 'typescript';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOME_DATA_PATH = path.join(ROOT, 'src', 'data', 'home.ts');
const OUTPUT_PATH = path.join(ROOT, 'src', 'data', 'problemCardDotPatterns.ts');

const sourceText = readFileSync(HOME_DATA_PATH, 'utf8');
const sourceFile = ts.createSourceFile(HOME_DATA_PATH, sourceText, ts.ScriptTarget.Latest, true);

const WIDTH = 160;
const HEIGHT = 144;
const TILE_COUNT = 92;
const FOCAL_TILE_COUNT = 42;
const FOCAL_GLYPH_TILE_COUNT = 36;
const MOTIF_TILE_COUNT = 36;
const FINE_TEXTURE_TILE_COUNT = 64;
const SPARK_TILE_COUNT = 14;
const GRID = 2;

const CHAMPAGNE_GOLD = '#E5C453';
const CHAMPAGNE_LIGHT = '#FFF4C6';
const DEEP_BURGUNDY = '#3A0F16';
const BURGUNDY = '#5E1926';
const OXBLOOD = '#7A1F2B';

const genreLayouts = {
  comedy: [
    { x: 0.26, y: 0.28, sx: 0.16, sy: 0.18, weight: 1.05 },
    { x: 0.58, y: 0.46, sx: 0.22, sy: 0.22, weight: 1.2 },
    { x: 0.76, y: 0.72, sx: 0.13, sy: 0.16, weight: 0.8 },
  ],
  western: [
    { x: 0.2, y: 0.68, sx: 0.18, sy: 0.16, weight: 0.95 },
    { x: 0.5, y: 0.48, sx: 0.2, sy: 0.18, weight: 1.18 },
    { x: 0.78, y: 0.3, sx: 0.15, sy: 0.15, weight: 0.9 },
  ],
  horror: [
    { x: 0.42, y: 0.24, sx: 0.15, sy: 0.2, weight: 1 },
    { x: 0.52, y: 0.57, sx: 0.2, sy: 0.25, weight: 1.25 },
    { x: 0.7, y: 0.78, sx: 0.1, sy: 0.12, weight: 0.7 },
  ],
  drama: [
    { x: 0.3, y: 0.42, sx: 0.2, sy: 0.2, weight: 1 },
    { x: 0.62, y: 0.38, sx: 0.18, sy: 0.18, weight: 1 },
    { x: 0.52, y: 0.7, sx: 0.18, sy: 0.14, weight: 0.88 },
  ],
  'silent-film': [
    { x: 0.22, y: 0.36, sx: 0.09, sy: 0.28, weight: 0.95 },
    { x: 0.5, y: 0.5, sx: 0.16, sy: 0.22, weight: 1.1 },
    { x: 0.78, y: 0.38, sx: 0.09, sy: 0.28, weight: 0.95 },
  ],
  detective: [
    { x: 0.28, y: 0.3, sx: 0.18, sy: 0.16, weight: 0.9 },
    { x: 0.68, y: 0.34, sx: 0.15, sy: 0.17, weight: 0.95 },
    { x: 0.52, y: 0.68, sx: 0.22, sy: 0.18, weight: 1.2 },
  ],
};

const genrePosterMotifs = {
  comedy: {
    focal: { x: 0.56, y: 0.36 },
    glyph: 'diagonal-slab',
    fields: [
      { shape: 'diagonal', x: 0.02, y: 0.05, w: 0.94, h: 0.62, slope: 0.44, thickness: 0.2, count: 34, size: 2, color: 'primary', altColor: 'gold', altChance: 0.32, minOpacity: 0.1, maxOpacity: 0.22 },
      { shape: 'rect', x: 0.54, y: 0.08, w: 0.34, h: 0.26, count: 18, size: 2, color: 'accent', altColor: 'light', altChance: 0.22, minOpacity: 0.09, maxOpacity: 0.2 },
      { shape: 'ellipse', x: 0.39, y: 0.24, w: 0.34, h: 0.3, count: 18, size: 2, color: 'light', altColor: 'gold', altChance: 0.36, minOpacity: 0.11, maxOpacity: 0.26 },
    ],
    bands: [
      { x: 0.16, y: 0.22, dx: 0.105, dy: 0.052, size: 6, count: 6, jitter: 0.035 },
      { x: 0.32, y: 0.74, dx: 0.095, dy: -0.036, size: 4, count: 5, jitter: 0.04 },
    ],
  },
  western: {
    focal: { x: 0.48, y: 0.62 },
    glyph: 'sun-horizon',
    fields: [
      { shape: 'rect', x: 0.02, y: 0.58, w: 0.96, h: 0.2, count: 34, size: 2, color: 'gold', altColor: 'primary', altChance: 0.28, minOpacity: 0.1, maxOpacity: 0.23 },
      { shape: 'diagonal', x: 0.06, y: 0.38, w: 0.88, h: 0.46, slope: -0.16, thickness: 0.16, count: 24, size: 2, color: 'secondary', altColor: 'deep', altChance: 0.18, minOpacity: 0.1, maxOpacity: 0.24 },
      { shape: 'ellipse', x: 0.34, y: 0.46, w: 0.3, h: 0.24, count: 18, size: 2, color: 'light', altColor: 'gold', altChance: 0.38, minOpacity: 0.1, maxOpacity: 0.25 },
    ],
    bands: [
      { x: 0.12, y: 0.68, dx: 0.108, dy: -0.01, size: 6, count: 8, jitter: 0.022 },
      { x: 0.2, y: 0.82, dx: 0.105, dy: 0.004, size: 4, count: 7, jitter: 0.018 },
    ],
  },
  horror: {
    focal: { x: 0.52, y: 0.5 },
    glyph: 'doorway',
    fields: [
      { shape: 'beam', x: 0.24, y: 0.02, w: 0.52, h: 0.96, apexX: 0.5, spread: 0.46, thickness: 0.06, count: 34, size: 2, color: 'accent', altColor: 'gold', altChance: 0.18, minOpacity: 0.09, maxOpacity: 0.22 },
      { shape: 'frame', x: 0.36, y: 0.15, w: 0.34, h: 0.68, thickness: 0.18, count: 24, size: 2, color: 'deep', altColor: 'light', altChance: 0.2, minOpacity: 0.1, maxOpacity: 0.24 },
      { shape: 'diagonal', x: 0.48, y: 0.07, w: 0.34, h: 0.84, slope: 0.55, thickness: 0.1, count: 20, size: 2, color: 'primary', altColor: 'light', altChance: 0.14, minOpacity: 0.1, maxOpacity: 0.25 },
    ],
    bands: [
      { x: 0.32, y: 0.16, dx: 0.046, dy: 0.1, size: 6, count: 8, jitter: 0.026 },
      { x: 0.62, y: 0.22, dx: -0.038, dy: 0.096, size: 4, count: 6, jitter: 0.028 },
    ],
  },
  drama: {
    focal: { x: 0.48, y: 0.46 },
    glyph: 'split-spine',
    fields: [
      { shape: 'rect', x: 0.24, y: 0.14, w: 0.22, h: 0.72, count: 26, size: 2, color: 'light', altColor: 'primary', altChance: 0.24, minOpacity: 0.09, maxOpacity: 0.21 },
      { shape: 'rect', x: 0.56, y: 0.1, w: 0.22, h: 0.74, count: 26, size: 2, color: 'secondary', altColor: 'deep', altChance: 0.18, minOpacity: 0.09, maxOpacity: 0.22 },
      { shape: 'ellipse', x: 0.37, y: 0.28, w: 0.28, h: 0.36, count: 20, size: 2, color: 'gold', altColor: 'light', altChance: 0.26, minOpacity: 0.09, maxOpacity: 0.22 },
    ],
    bands: [
      { x: 0.28, y: 0.22, dx: 0.006, dy: 0.098, size: 4, count: 7, jitter: 0.032 },
      { x: 0.7, y: 0.18, dx: -0.012, dy: 0.096, size: 4, count: 7, jitter: 0.03 },
    ],
  },
  'silent-film': {
    focal: { x: 0.5, y: 0.5 },
    glyph: 'film-gate',
    fields: [
      { shape: 'frame', x: 0.12, y: 0.08, w: 0.76, h: 0.8, thickness: 0.16, count: 36, size: 2, color: 'light', altColor: 'gold', altChance: 0.24, minOpacity: 0.09, maxOpacity: 0.22 },
      { shape: 'rect', x: 0.16, y: 0.1, w: 0.1, h: 0.78, count: 20, size: 2, color: 'primary', altColor: 'deep', altChance: 0.18, minOpacity: 0.08, maxOpacity: 0.2 },
      { shape: 'rect', x: 0.74, y: 0.1, w: 0.1, h: 0.78, count: 20, size: 2, color: 'gold', altColor: 'light', altChance: 0.28, minOpacity: 0.09, maxOpacity: 0.23 },
    ],
    bands: [
      { x: 0.2, y: 0.18, dx: 0, dy: 0.09, size: 5, count: 8, jitter: 0.016 },
      { x: 0.78, y: 0.18, dx: 0, dy: 0.09, size: 5, count: 8, jitter: 0.016 },
    ],
  },
  detective: {
    focal: { x: 0.54, y: 0.6 },
    glyph: 'spiral',
    fields: [
      { shape: 'beam', x: 0.08, y: 0.08, w: 0.84, h: 0.78, apexX: 0.18, spread: 0.5, thickness: 0.06, count: 34, size: 2, color: 'secondary', altColor: 'gold', altChance: 0.22, minOpacity: 0.09, maxOpacity: 0.21 },
      { shape: 'diagonal', x: 0.12, y: 0.14, w: 0.72, h: 0.5, slope: 0.18, thickness: 0.16, count: 22, size: 2, color: 'gold', altColor: 'light', altChance: 0.26, minOpacity: 0.1, maxOpacity: 0.23 },
      { shape: 'ellipse', x: 0.38, y: 0.44, w: 0.32, h: 0.32, count: 20, size: 2, color: 'light', altColor: 'primary', altChance: 0.22, minOpacity: 0.09, maxOpacity: 0.21 },
    ],
    bands: [
      { x: 0.2, y: 0.24, dx: 0.092, dy: 0.012, size: 4, count: 8, jitter: 0.024 },
      { x: 0.24, y: 0.4, dx: 0.086, dy: 0.018, size: 4, count: 7, jitter: 0.026 },
    ],
  },
};

const genreTonePalettes = {
  comedy: ['#F4D03F', '#FFB13B', '#FFE16A', '#D94F3D'],
  western: ['#D2B48C', '#B8793D', '#8F5633', '#E0C07A'],
  horror: ['#C0392B', '#8E1B22', '#D84A3A', '#F0B38C'],
  drama: ['#AAB7B8', '#6F8790', '#C3D2D0', '#53727A'],
  'silent-film': ['#7F8C8D', '#C8C0AE', '#E7D7AF', '#555C60'],
  detective: ['#2E4053', '#4C6A78', '#1D2934', '#B58A42'],
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const hashString = (value) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const mulberry32 = (seed) => {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const gaussian = (random) => {
  const u = 1 - random();
  const v = 1 - random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

const weightedPick = (clusters, random) => {
  const total = clusters.reduce((sum, cluster) => sum + cluster.weight, 0);
  let cursor = random() * total;
  for (const cluster of clusters) {
    cursor -= cluster.weight;
    if (cursor <= 0) return cluster;
  }
  return clusters[clusters.length - 1];
};

const normalizeHex = (hex) => {
  const value = hex.replace('#', '').trim();
  if (value.length === 3) {
    return value.split('').map((char) => char + char).join('');
  }
  return value;
};

const hexToRgb = (hex) => {
  const value = normalizeHex(hex);
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
};

const rgbToHex = ({ r, g, b }) => `#${[r, g, b].map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0')).join('')}`;

const mixColor = (from, to, amount) => {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  return rgbToHex({
    r: a.r + (b.r - a.r) * amount,
    g: a.g + (b.g - a.g) * amount,
    b: a.b + (b.b - a.b) * amount,
  });
};

const getVariableInitializer = (name) => {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name) {
        return declaration.initializer;
      }
    }
  }
  throw new Error(`Cannot find variable "${name}" in ${HOME_DATA_PATH}`);
};

const getPropertyName = (name) => {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  return undefined;
};

const getStringProperty = (objectLiteral, propertyName) => {
  const property = objectLiteral.properties.find((candidate) => (
    ts.isPropertyAssignment(candidate)
      && getPropertyName(candidate.name) === propertyName
      && ts.isStringLiteral(candidate.initializer)
  ));

  if (!property || !ts.isPropertyAssignment(property) || !ts.isStringLiteral(property.initializer)) {
    throw new Error(`Cannot read "${propertyName}" from problem item.`);
  }

  return property.initializer.text;
};

const getGenreColors = () => {
  const initializer = getVariableInitializer('problemGenreColors');
  if (!initializer || !ts.isObjectLiteralExpression(initializer)) {
    throw new Error('problemGenreColors must be an object literal.');
  }

  const colors = new Map();
  for (const property of initializer.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    const name = getPropertyName(property.name);
    if (!name || !ts.isStringLiteral(property.initializer)) continue;
    colors.set(name, property.initializer.text);
  }

  return colors;
};

const resolveGenreColor = (objectLiteral, colors) => {
  const property = objectLiteral.properties.find((candidate) => (
    ts.isPropertyAssignment(candidate) && getPropertyName(candidate.name) === 'genreColor'
  ));

  if (!property || !ts.isPropertyAssignment(property)) {
    throw new Error('Cannot read genreColor from problem item.');
  }

  const expression = property.initializer;
  if (ts.isStringLiteral(expression)) return expression.text;

  if (ts.isPropertyAccessExpression(expression) && expression.expression.getText(sourceFile) === 'problemGenreColors') {
    return colors.get(expression.name.text);
  }

  if (ts.isElementAccessExpression(expression) && expression.expression.getText(sourceFile) === 'problemGenreColors') {
    const argument = expression.argumentExpression;
    if (argument && ts.isStringLiteral(argument)) return colors.get(argument.text);
  }

  throw new Error(`Unsupported genreColor expression: ${expression.getText(sourceFile)}`);
};

const getProblems = (variableName = 'csProblems') => {
  const colors = getGenreColors();
  const initializer = getVariableInitializer(variableName);
  if (!initializer || !ts.isArrayLiteralExpression(initializer)) {
    throw new Error(`${variableName} must be an array literal.`);
  }

  return initializer.elements.map((element, index) => {
    if (!ts.isObjectLiteralExpression(element)) {
      throw new Error(`${variableName} problem at index ${index} must be an object literal.`);
    }

    const genreKey = getStringProperty(element, 'genreKey');
    return {
      id: getStringProperty(element, 'id'),
      genreKey,
      genreColor: resolveGenreColor(element, colors),
      index,
    };
  });
};

const validateProblemParity = (csProblems, enProblems) => {
  if (csProblems.length !== enProblems.length) {
    throw new Error(`Problem count mismatch: cs=${csProblems.length}, en=${enProblems.length}`);
  }

  csProblems.forEach((problem, index) => {
    const translatedProblem = enProblems[index];
    const mismatch = ['id', 'genreKey', 'genreColor'].find((key) => problem[key] !== translatedProblem[key]);
    if (mismatch) {
      throw new Error(`Problem parity mismatch at index ${index} for "${mismatch}": cs=${problem[mismatch]}, en=${translatedProblem[mismatch]}`);
    }
  });
};

const snapToGrid = (value) => Math.round(value / GRID) * GRID;

const formatNumber = (value) => Number.parseFloat(value.toFixed(2)).toString();

const createTile = ({ x, y, size, fill, opacity }) => {
  const tileSize = clamp(snapToGrid(size), GRID, 14);
  const tileX = clamp(snapToGrid(x), 0, WIDTH - tileSize);
  const tileY = clamp(snapToGrid(y), 0, HEIGHT - tileSize);

  return `<rect x="${formatNumber(tileX)}" y="${formatNumber(tileY)}" width="${formatNumber(tileSize)}" height="${formatNumber(tileSize)}" fill="${fill}" opacity="${opacity.toFixed(2)}"/>`;
};

const buildPalette = (genreKey, genreColor) => {
  const tones = genreTonePalettes[genreKey] ?? genreTonePalettes.drama;

  return [
    { fill: mixColor(genreColor, CHAMPAGNE_LIGHT, 0.24), weight: 1.15, minOpacity: 0.22, maxOpacity: 0.48 },
    { fill: tones[0], weight: 1.1, minOpacity: 0.2, maxOpacity: 0.46 },
    { fill: tones[1], weight: 0.88, minOpacity: 0.18, maxOpacity: 0.42 },
    { fill: tones[2], weight: 0.74, minOpacity: 0.18, maxOpacity: 0.4 },
    { fill: tones[3], weight: 0.62, minOpacity: 0.16, maxOpacity: 0.36 },
    { fill: CHAMPAGNE_GOLD, weight: 0.82, minOpacity: 0.2, maxOpacity: 0.5 },
    { fill: CHAMPAGNE_LIGHT, weight: 0.56, minOpacity: 0.14, maxOpacity: 0.34 },
    { fill: mixColor(BURGUNDY, genreColor, 0.18), weight: 0.82, minOpacity: 0.16, maxOpacity: 0.42 },
    { fill: mixColor(OXBLOOD, genreColor, 0.14), weight: 0.72, minOpacity: 0.16, maxOpacity: 0.4 },
    { fill: DEEP_BURGUNDY, weight: 0.58, minOpacity: 0.12, maxOpacity: 0.34 },
  ];
};

const buildFieldPalette = (genreKey, genreColor) => {
  const tones = genreTonePalettes[genreKey] ?? genreTonePalettes.drama;

  return {
    key: mixColor(genreColor, CHAMPAGNE_LIGHT, 0.18),
    primary: tones[0],
    secondary: tones[1],
    tertiary: tones[2],
    accent: tones[3],
    gold: CHAMPAGNE_GOLD,
    light: CHAMPAGNE_LIGHT,
    burgundy: mixColor(BURGUNDY, genreColor, 0.26),
    deep: mixColor(DEEP_BURGUNDY, genreColor, 0.18),
  };
};

const pickPaletteTile = (palette, random, opacityBoost = 0) => {
  const tile = weightedPick(palette, random);
  return {
    fill: tile.fill,
    opacity: clamp(tile.minOpacity + random() * (tile.maxOpacity - tile.minOpacity) + opacityBoost, 0.1, 0.56),
  };
};

const pickFieldFill = (fieldPalette, field, random) => {
  const colorKey = field.altColor && random() < (field.altChance ?? 0.24)
    ? field.altColor
    : field.color;

  return fieldPalette[colorKey] ?? fieldPalette.key;
};

const chooseTileSize = (random, emphasis = 0) => {
  const roll = random() + emphasis;
  if (roll > 1.12) return 12;
  if (roll > 0.92) return 10;
  if (roll > 0.64) return 8;
  if (roll > 0.28) return 6;
  return 4;
};

const choosePosterPixelSize = (random, baseSize = 2, emphasis = 0) => {
  const roll = random() + emphasis;
  if (roll > 1.05) return baseSize + 6;
  if (roll > 0.78) return baseSize + 4;
  if (roll > 0.36) return baseSize + 2;
  return baseSize;
};

const isPointInPosterField = (field, localX, localY) => {
  switch (field.shape) {
    case 'diagonal': {
      const lineY = 0.5 + (localX - 0.5) * (field.slope ?? 0);
      return Math.abs(localY - lineY) <= (field.thickness ?? 0.18);
    }
    case 'ellipse': {
      const dx = (localX - 0.5) / 0.5;
      const dy = (localY - 0.5) / 0.5;
      return dx * dx + dy * dy <= 1;
    }
    case 'frame': {
      const thickness = field.thickness ?? 0.14;
      return (
        localX <= thickness
        || localX >= 1 - thickness
        || localY <= thickness
        || localY >= 1 - thickness
      );
    }
    case 'beam': {
      const apexX = field.apexX ?? 0.5;
      const spread = field.spread ?? 0.44;
      const baseWidth = field.thickness ?? 0.08;
      const halfWidth = baseWidth + localY * spread;
      return Math.abs(localX - apexX) <= halfWidth;
    }
    case 'rect':
    default:
      return true;
  }
};

const createPosterFieldTiles = ({ fields = [], fieldPalette, random, variant }) => {
  const tiles = [];

  for (const [fieldIndex, field] of fields.entries()) {
    let created = 0;
    let attempts = 0;
    const maxAttempts = field.count * 18;

    while (created < field.count && attempts < maxAttempts) {
      attempts += 1;
      const localX = random();
      const localY = random();

      if (!isPointInPosterField(field, localX, localY)) continue;

      const jitter = field.jitter ?? 0.012;
      const drift = ((variant + fieldIndex * 19) % 11) * 0.0016;
      const x = (field.x + localX * field.w + (random() - 0.5) * jitter + drift) * WIDTH;
      const y = (field.y + localY * field.h + (random() - 0.5) * jitter - drift) * HEIGHT;
      const centerFalloff = 1 - Math.min(1, Math.hypot(localX - 0.5, localY - 0.5) * 1.45);
      const fill = pickFieldFill(fieldPalette, field, random);
      const opacity = clamp(
        (field.minOpacity ?? 0.09)
          + random() * ((field.maxOpacity ?? 0.22) - (field.minOpacity ?? 0.09))
          + centerFalloff * 0.035,
        0.07,
        0.32,
      );

      tiles.push(createTile({
        x,
        y,
        size: choosePosterPixelSize(random, field.size ?? 2, field.shape === 'ellipse' ? 0.08 : 0),
        fill,
        opacity,
      }));
      created += 1;
    }
  }

  return tiles;
};

const createFocalGlyphTiles = ({ kind, focalPoint, fieldPalette, random, variant }) => {
  const tiles = [];
  const pushTile = ({ x, y, role = 'gold', size = 2, opacity = 0.2, emphasis = 0 }) => {
    tiles.push(createTile({
      x: x * WIDTH,
      y: y * HEIGHT,
      size: choosePosterPixelSize(random, size, emphasis),
      fill: fieldPalette[role] ?? fieldPalette.gold,
      opacity: clamp(opacity + (random() - 0.5) * 0.08, 0.1, 0.34),
    }));
  };

  switch (kind) {
    case 'diagonal-slab': {
      for (let index = 0; index < FOCAL_GLYPH_TILE_COUNT; index += 1) {
        const t = index / (FOCAL_GLYPH_TILE_COUNT - 1);
        const lane = (index % 3) - 1;
        pushTile({
          x: 0.12 + t * 0.78 + (random() - 0.5) * 0.018,
          y: 0.18 + t * 0.34 + lane * 0.024 + (random() - 0.5) * 0.018,
          role: index % 5 === 0 ? 'gold' : (index % 2 === 0 ? 'primary' : 'accent'),
          size: 2,
          opacity: 0.19,
          emphasis: index % 7 === 0 ? 0.16 : 0,
        });
      }
      break;
    }
    case 'sun-horizon': {
      const sunTiles = Math.round(FOCAL_GLYPH_TILE_COUNT * 0.64);
      for (let index = 0; index < sunTiles; index += 1) {
        const angle = index * Math.PI * (3 - Math.sqrt(5)) + variant * 0.001;
        const radius = Math.sqrt(random()) * 0.15;
        pushTile({
          x: focalPoint.x + Math.cos(angle) * radius * 1.28,
          y: focalPoint.y + Math.sin(angle) * radius * 0.72,
          role: index % 4 === 0 ? 'light' : 'gold',
          size: 2,
          opacity: 0.2,
          emphasis: 0.04,
        });
      }
      for (let index = sunTiles; index < FOCAL_GLYPH_TILE_COUNT; index += 1) {
        const t = (index - sunTiles) / (FOCAL_GLYPH_TILE_COUNT - sunTiles - 1);
        pushTile({
          x: 0.18 + t * 0.64,
          y: focalPoint.y + 0.13 + ((index % 3) - 1) * 0.03,
          role: index % 3 === 0 ? 'secondary' : 'gold',
          size: 2,
          opacity: 0.17,
        });
      }
      break;
    }
    case 'doorway': {
      const frameTiles = Math.round(FOCAL_GLYPH_TILE_COUNT * 0.7);
      for (let index = 0; index < frameTiles; index += 1) {
        const t = index / (frameTiles - 1);
        const side = index % 3;
        pushTile({
          x: side === 0 ? focalPoint.x - 0.13 : (side === 1 ? focalPoint.x + 0.13 : focalPoint.x - 0.13 + t * 0.26),
          y: side === 2 ? focalPoint.y - 0.24 : focalPoint.y - 0.24 + t * 0.48,
          role: side === 2 ? 'light' : 'accent',
          size: 2,
          opacity: 0.18,
          emphasis: side === 2 ? 0.1 : 0,
        });
      }
      for (let index = frameTiles; index < FOCAL_GLYPH_TILE_COUNT; index += 1) {
        const t = (index - frameTiles) / (FOCAL_GLYPH_TILE_COUNT - frameTiles - 1);
        pushTile({
          x: focalPoint.x - 0.05 + t * 0.22,
          y: focalPoint.y - 0.28 + t * 0.56,
          role: index % 4 === 0 ? 'gold' : 'primary',
          size: 2,
          opacity: 0.2,
          emphasis: 0.04,
        });
      }
      break;
    }
    case 'split-spine': {
      const spineTiles = Math.round(FOCAL_GLYPH_TILE_COUNT * 0.52);
      for (let index = 0; index < spineTiles; index += 1) {
        const t = index / (spineTiles - 1);
        pushTile({
          x: focalPoint.x + Math.sin(t * Math.PI * 2) * 0.008,
          y: 0.17 + t * 0.66,
          role: index % 4 === 0 ? 'light' : 'gold',
          size: 2,
          opacity: 0.18,
        });
      }
      for (let index = spineTiles; index < FOCAL_GLYPH_TILE_COUNT; index += 1) {
        const side = index % 2 === 0 ? -1 : 1;
        pushTile({
          x: focalPoint.x + side * (0.1 + random() * 0.06),
          y: focalPoint.y + gaussian(random) * 0.16,
          role: side < 0 ? 'light' : 'secondary',
          size: 2,
          opacity: 0.17,
          emphasis: 0.02,
        });
      }
      break;
    }
    case 'film-gate': {
      for (let index = 0; index < FOCAL_GLYPH_TILE_COUNT; index += 1) {
        const t = (index % 9) / 8;
        const edge = Math.floor(index / 9);
        const verticalEdge = edge === 0 || edge === 1;
        pushTile({
          x: verticalEdge ? (edge === 0 ? 0.2 : 0.8) : 0.2 + t * 0.6,
          y: verticalEdge ? 0.16 + t * 0.68 : (edge === 2 ? 0.16 : 0.84),
          role: index % 5 === 0 ? 'gold' : 'light',
          size: 2,
          opacity: 0.16,
          emphasis: index % 6 === 0 ? 0.08 : 0,
        });
      }
      break;
    }
    case 'spiral': {
      for (let index = 0; index < FOCAL_GLYPH_TILE_COUNT; index += 1) {
        const t = index / (FOCAL_GLYPH_TILE_COUNT - 1);
        const angle = 0.9 + index * 0.55 + variant * 0.0007;
        const radius = 0.02 + t * 0.22;
        pushTile({
          x: focalPoint.x + Math.cos(angle) * radius * 0.88,
          y: focalPoint.y + Math.sin(angle) * radius,
          role: index % 4 === 0 ? 'gold' : (index % 3 === 0 ? 'light' : 'secondary'),
          size: 2,
          opacity: 0.2 - t * 0.04,
          emphasis: index % 8 === 0 ? 0.12 : 0,
        });
      }
      break;
    }
    default: {
      for (let index = 0; index < FOCAL_GLYPH_TILE_COUNT; index += 1) {
        const angle = index * Math.PI * (3 - Math.sqrt(5));
        const radius = Math.sqrt(random()) * 0.16;
        pushTile({
          x: focalPoint.x + Math.cos(angle) * radius,
          y: focalPoint.y + Math.sin(angle) * radius,
          role: index % 3 === 0 ? 'gold' : 'light',
          size: 2,
          opacity: 0.18,
        });
      }
    }
  }

  return tiles;
};

const createFineTextureTiles = ({ focalPoint, fieldPalette, palette, random }) => {
  const tiles = [];

  for (let tileIndex = 0; tileIndex < FINE_TEXTURE_TILE_COUNT; tileIndex += 1) {
    const nearFocal = random() < 0.58;
    const x = nearFocal
      ? focalPoint.x + gaussian(random) * 0.2
      : random();
    const y = nearFocal
      ? focalPoint.y + gaussian(random) * 0.18
      : random();
    const distanceToFocal = Math.hypot((x - focalPoint.x) / 0.34, (y - focalPoint.y) / 0.3);
    const useGold = random() < 0.2;
    const picked = useGold
      ? { fill: fieldPalette.gold, opacity: 0.12 + random() * 0.12 }
      : pickPaletteTile(palette, random, distanceToFocal < 0.9 ? -0.08 : -0.12);

    tiles.push(createTile({
      x: x * WIDTH,
      y: y * HEIGHT,
      size: random() < 0.78 ? 2 : 4,
      fill: picked.fill,
      opacity: clamp(picked.opacity, 0.07, distanceToFocal < 0.9 ? 0.26 : 0.2),
    }));
  }

  return tiles;
};

const createPatternSvg = ({ id, genreKey, genreColor }) => {
  const random = mulberry32(hashString(`${id}:${genreKey}:${genreColor}:poster-tiles`));
  const variant = hashString(`${id}:poster-variant`);
  const baseClusters = genreLayouts[genreKey] ?? genreLayouts.drama;
  const motif = genrePosterMotifs[genreKey] ?? genrePosterMotifs.drama;
  const palette = buildPalette(genreKey, genreColor);
  const fieldPalette = buildFieldPalette(genreKey, genreColor);
  const clusters = baseClusters.map((cluster) => ({
    ...cluster,
    x: clamp(cluster.x + (random() - 0.5) * 0.16, 0.16, 0.84),
    y: clamp(cluster.y + (random() - 0.5) * 0.16, 0.16, 0.84),
  }));

  const focalPoint = {
    x: clamp(motif.focal.x + (random() - 0.5) * 0.13, 0.24, 0.76),
    y: clamp(motif.focal.y + (random() - 0.5) * 0.13, 0.22, 0.78),
  };

  const tiles = [
    ...createPosterFieldTiles({
      fields: motif.fields,
      fieldPalette,
      random,
      variant,
    }),
    ...createFineTextureTiles({
      focalPoint,
      fieldPalette,
      palette,
      random,
    }),
  ];

  const totalBandCount = motif.bands.reduce((sum, band) => sum + band.count, 0);
  for (const [bandIndex, band] of motif.bands.entries()) {
    const count = Math.max(4, Math.round((MOTIF_TILE_COUNT * band.count) / totalBandCount));
    for (let tileIndex = 0; tileIndex < count; tileIndex += 1) {
      const picked = pickPaletteTile(palette, random, -0.04);
      const size = band.size + (random() > 0.7 ? 2 : 0);
      const stepOffset = tileIndex + (variant % 4) * 0.14;
      const x = (band.x + band.dx * stepOffset + (random() - 0.5) * band.jitter) * WIDTH;
      const y = (band.y + band.dy * stepOffset + (random() - 0.5) * band.jitter) * HEIGHT;
      tiles.push(createTile({
        x,
        y,
        size,
        fill: picked.fill,
        opacity: clamp(picked.opacity - (bandIndex % 2) * 0.03, 0.1, 0.42),
      }));
    }
  }

  for (let tileIndex = 0; tileIndex < TILE_COUNT; tileIndex += 1) {
    const cluster = weightedPick(clusters, random);
    const anglePush = (variant % 5) * 0.12;
    const rawX = cluster.x + gaussian(random) * cluster.sx + Math.cos(tileIndex * 0.51 + anglePush) * 0.018;
    const rawY = cluster.y + gaussian(random) * cluster.sy + Math.sin(tileIndex * 0.43 + anglePush) * 0.018;
    const distanceToFocal = Math.hypot((rawX - focalPoint.x) / 0.32, (rawY - focalPoint.y) / 0.28);
    const picked = pickPaletteTile(palette, random, distanceToFocal < 0.78 ? 0.02 : -0.04);
    tiles.push(createTile({
      x: rawX * WIDTH,
      y: rawY * HEIGHT,
      size: chooseTileSize(random, distanceToFocal < 0.72 ? 0.16 : 0),
      fill: picked.fill,
      opacity: clamp(picked.opacity, 0.1, distanceToFocal < 0.78 ? 0.5 : 0.38),
    }));
  }

  for (let tileIndex = 0; tileIndex < FOCAL_TILE_COUNT; tileIndex += 1) {
    const angle = tileIndex * Math.PI * (3 - Math.sqrt(5)) + random() * 0.5;
    const radius = Math.sqrt(random()) * (0.12 + (variant % 3) * 0.018);
    const x = (focalPoint.x + Math.cos(angle) * radius * 1.18 + gaussian(random) * 0.012) * WIDTH;
    const y = (focalPoint.y + Math.sin(angle) * radius * 0.9 + gaussian(random) * 0.012) * HEIGHT;
    const picked = pickPaletteTile(palette, random, tileIndex < 8 ? 0.05 : 0.01);
    tiles.push(createTile({
      x,
      y,
      size: chooseTileSize(random, tileIndex % 5 === 0 ? 0.34 : 0.1),
      fill: picked.fill,
      opacity: clamp(picked.opacity, 0.16, 0.54),
    }));
  }

  tiles.push(...createFocalGlyphTiles({
    kind: motif.glyph,
    focalPoint,
    fieldPalette,
    random,
    variant,
  }));

  for (let sparkIndex = 0; sparkIndex < SPARK_TILE_COUNT; sparkIndex += 1) {
    const sparklePalette = [
      { fill: CHAMPAGNE_GOLD, weight: 1.4, minOpacity: 0.18, maxOpacity: 0.38 },
      { fill: CHAMPAGNE_LIGHT, weight: 0.75, minOpacity: 0.14, maxOpacity: 0.3 },
      { fill: mixColor(CHAMPAGNE_GOLD, genreColor, 0.38), weight: 1, minOpacity: 0.16, maxOpacity: 0.34 },
    ];
    const picked = pickPaletteTile(sparklePalette, random, 0);
    tiles.push(createTile({
      x: 6 + random() * (WIDTH - 12),
      y: 6 + random() * (HEIGHT - 12),
      size: random() > 0.7 ? 4 : 2,
      fill: picked.fill,
      opacity: picked.opacity,
    }));
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" shape-rendering="crispEdges">${tiles.join('')}</svg>`;
};

const encodeSvg = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

const problems = getProblems('csProblems');
validateProblemParity(problems, getProblems('enProblems'));
const entries = problems.map((problem) => {
  const svg = createPatternSvg(problem);
  return [problem.id, encodeSvg(svg)];
});

const output = [
  '/* Generated by scripts/generate-problem-card-dot-patterns.mjs. Do not edit manually. */',
  '',
  'export const problemCardDotPatterns = {',
  ...entries.map(([id, pattern]) => `  '${id}': '${pattern}',`),
  '} as const;',
  '',
  'export type ProblemCardDotPatternId = keyof typeof problemCardDotPatterns;',
  '',
  `export const fallbackProblemCardDotPattern = problemCardDotPatterns['${entries[0][0]}'];`,
  '',
].join('\n');

writeFileSync(OUTPUT_PATH, output, 'utf8');
console.log(`Generated ${entries.length} problem card dot patterns in ${path.relative(ROOT, OUTPUT_PATH)}`);
