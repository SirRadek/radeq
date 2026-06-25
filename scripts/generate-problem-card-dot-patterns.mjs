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
const DOT_COUNT = 34;

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

const getProblems = () => {
  const colors = getGenreColors();
  const initializer = getVariableInitializer('csProblems');
  if (!initializer || !ts.isArrayLiteralExpression(initializer)) {
    throw new Error('csProblems must be an array literal.');
  }

  return initializer.elements.map((element, index) => {
    if (!ts.isObjectLiteralExpression(element)) {
      throw new Error(`Problem at index ${index} must be an object literal.`);
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

const createDot = ({ x, y, radius, fill, opacity }) => (
  `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${radius.toFixed(2)}" fill="${fill}" opacity="${opacity.toFixed(2)}"/>`
);

const createPatternSvg = ({ id, genreKey, genreColor, index }) => {
  const random = mulberry32(hashString(`${id}:${genreKey}:${index}`));
  const baseClusters = genreLayouts[genreKey] ?? genreLayouts.drama;
  const clusters = baseClusters.map((cluster) => ({
    ...cluster,
    x: clamp(cluster.x + (random() - 0.5) * 0.16, 0.16, 0.84),
    y: clamp(cluster.y + (random() - 0.5) * 0.16, 0.16, 0.84),
  }));

  const palette = [
    mixColor(genreColor, '#fff8d6', 0.3),
    mixColor(genreColor, '#f4d03f', 0.38),
    mixColor(genreColor, '#ffffff', 0.58),
    '#fff4c6',
  ];

  const dots = [];
  for (let dotIndex = 0; dotIndex < DOT_COUNT; dotIndex += 1) {
    const cluster = weightedPick(clusters, random);
    const anglePush = (index % 5) * 0.12;
    const x = clamp((cluster.x + gaussian(random) * cluster.sx + Math.cos(dotIndex * 0.51 + anglePush) * 0.018) * WIDTH, 5, WIDTH - 5);
    const y = clamp((cluster.y + gaussian(random) * cluster.sy + Math.sin(dotIndex * 0.43 + anglePush) * 0.018) * HEIGHT, 5, HEIGHT - 5);
    const radius = 0.55 + random() * 1.75 + (dotIndex % 9 === 0 ? 0.55 : 0);
    const opacity = 0.2 + random() * 0.5;
    const fill = palette[Math.floor(random() * palette.length)];
    dots.push(createDot({ x, y, radius, fill, opacity }));
  }

  for (let sparkIndex = 0; sparkIndex < 6; sparkIndex += 1) {
    dots.push(createDot({
      x: 8 + random() * (WIDTH - 16),
      y: 8 + random() * (HEIGHT - 16),
      radius: 0.42 + random() * 0.72,
      fill: palette[sparkIndex % palette.length],
      opacity: 0.18 + random() * 0.28,
    }));
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}">${dots.join('')}</svg>`;
};

const encodeSvg = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

const problems = getProblems();
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
