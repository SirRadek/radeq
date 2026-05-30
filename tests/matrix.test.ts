import { describe, expect, it } from 'vitest';
import {
  DEFAULT_MATRIX_SELECTION,
  getMatrixPreset,
  getRuntimeStyle,
  listMatrixPresets,
} from '../src/lib/matrix';

describe('style matrix logic', () => {
  it('defaults to the B proposal service landing recommendation', () => {
    const preset = getMatrixPreset(DEFAULT_MATRIX_SELECTION);

    expect(preset.selection).toEqual({
      moduleId: 'service-landing',
      epochId: 'variant-b',
    });
    expect(preset.cta).toContain('poptávku');
    expect(preset.proofTag).toBe('Request path');
    expect(preset.proofPoints).toHaveLength(3);
    expect(preset.headline).toContain('Nabídka');
  });

  it('serves localized copy for Czech and English matrix presets', () => {
    const selection = {
      moduleId: 'service-landing' as const,
      epochId: 'variant-b' as const,
    };

    const czechPreset = getMatrixPreset(selection, 'cs');
    const englishPreset = getMatrixPreset(selection, 'en');

    expect(czechPreset.headline).toContain('Nabídka');
    expect(czechPreset.proofPoints[0]?.label).toBe('Co návštěvník pochopí');
    expect(englishPreset.headline).toContain('offer');
    expect(englishPreset.proofPoints[0]?.label).toBe('What the visitor understands');
  });

  it('contains every module and proposal variant combination', () => {
    expect(listMatrixPresets()).toHaveLength(16);
  });

  it('returns stable runtime CSS variables for a preset', () => {
    const style = getRuntimeStyle({
      moduleId: 'admin-dashboard',
      epochId: 'variant-c',
    });

    expect(style['--matrix-accent']).toMatch(/^#/);
    expect(style['--matrix-motion']).toBe('workflow-pulse');
    expect(style['--matrix-density']).toBe('dense');
  });

  it('includes the D studio proposal as a distinct layout', () => {
    const preset = getMatrixPreset({
      moduleId: 'service-landing',
      epochId: 'variant-d',
    });

    expect(preset.design.layout).toBe('studio');
    expect(preset.tokens.fontMode).toBe('studio');
    expect(preset.tokens.motion).toBe('decision-map');
  });
});
