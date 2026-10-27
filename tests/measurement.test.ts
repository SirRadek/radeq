import { describe, expect, it } from 'vitest';
import { createMeasurementEvent, measurementEvents } from '../src/lib/measurement';

describe('measurement event contract', () => {
  it('allows only privacy-safe event names', () => {
    expect(measurementEvents).toEqual([
      'cta_primary_click',
      'showcase_click',
      'form_start',
      'form_submit_success',
      'email_click',
      'audit_click',
      'quick_fix_click',
    ]);
  });

  it('strips personal details from payloads', () => {
    expect(
      createMeasurementEvent('form_submit_success', {
        email: 'client@example.com',
        message: 'Private message',
        project_type: 'Audit webu s plánem',
        route: '/kontakt/',
      }),
    ).toEqual({ name: 'form_submit_success', route: '/kontakt/' });
  });

  it('falls back to root for invalid routes', () => {
    expect(createMeasurementEvent('cta_primary_click', { route: 42 })).toEqual({
      name: 'cta_primary_click',
      route: '/',
    });
  });
});
