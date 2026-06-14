import { defaultLocale, type Locale } from '../data/locales';
import { buildMatrixPresets, type MatrixPreset, type MatrixSelection } from '../data/styleMatrix';

export const DEFAULT_MATRIX_SELECTION: MatrixSelection = {
  moduleId: 'service-landing',
  epochId: 'variant-a',
};

export type RuntimeStyle = Record<
  '--matrix-accent' | '--matrix-accent-2' | '--matrix-surface' | '--matrix-border' | '--matrix-font' | '--matrix-motion' | '--matrix-density',
  string
>;

export function listMatrixPresets(locale: Locale = defaultLocale): MatrixPreset[] {
  return buildMatrixPresets(locale);
}

export function getMatrixPreset(selection: MatrixSelection, locale: Locale = defaultLocale): MatrixPreset {
  const preset = listMatrixPresets(locale).find(
    (item) => item.selection.moduleId === selection.moduleId && item.selection.epochId === selection.epochId,
  );

  if (!preset) {
    throw new Error(`Unknown matrix preset: ${selection.moduleId}/${selection.epochId}`);
  }

  return preset;
}

export function getRuntimeStyle(selection: MatrixSelection, locale: Locale = defaultLocale): RuntimeStyle {
  const { tokens } = getMatrixPreset(selection, locale);

  return {
    '--matrix-accent': tokens.accent,
    '--matrix-accent-2': tokens.accent2,
    '--matrix-surface': tokens.surface,
    '--matrix-border': tokens.border,
    '--matrix-font': tokens.fontMode,
    '--matrix-motion': tokens.motion,
    '--matrix-density': tokens.density,
  };
}
