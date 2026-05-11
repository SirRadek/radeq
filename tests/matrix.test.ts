import { describe, expect, it } from 'vitest';
import {
  DEFAULT_MATRIX_SELECTION,
  getMatrixPreset,
  getRuntimeStyle,
  listMatrixPresets,
} from '../src/lib/matrix';

describe('style matrix logic', () => {
  it('defaults to the industrial service landing recommendation', () => {
    const preset = getMatrixPreset(DEFAULT_MATRIX_SELECTION);

    expect(preset.selection).toEqual({
      moduleId: 'service-landing',
      epochId: 'industrial',
    });
    expect(preset.cta).toContain('poptávku');
    expect(preset.proofTag).toBe('Request path');
    expect(preset.proofPoints).toHaveLength(3);
    expect(preset.headline).toContain('Nabídka');
  });

  it('serves localized copy for Czech and English matrix presets', () => {
    const selection = {
      moduleId: 'service-landing' as const,
      epochId: 'industrial' as const,
    };

    const czechPreset = getMatrixPreset(selection, 'cs');
    const englishPreset = getMatrixPreset(selection, 'en');

    expect(czechPreset.headline).toContain('Nabídka');
    expect(czechPreset.proofPoints[0]?.label).toBe('Co návštěvník pochopí');
    expect(englishPreset.headline).toContain('offer');
    expect(englishPreset.proofPoints[0]?.label).toBe('What the visitor understands');
  });

  it('contains every module and epoch combination', () => {
    expect(listMatrixPresets()).toHaveLength(16);
  });

  it('returns stable runtime CSS variables for a preset', () => {
    const style = getRuntimeStyle({
      moduleId: 'admin-dashboard',
      epochId: 'cyber-2036',
    });

    expect(style['--matrix-accent']).toMatch(/^#/);
    expect(style['--matrix-motion']).toBe('holo-shift');
    expect(style['--matrix-density']).toBe('dense');
  });
});
