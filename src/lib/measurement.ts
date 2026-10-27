export const measurementEvents = [
  'cta_primary_click',
  'showcase_click',
  'form_start',
  'form_submit_success',
  'email_click',
  'audit_click',
  'quick_fix_click',
] as const;

export type MeasurementEventName = (typeof measurementEvents)[number];

export interface MeasurementEvent {
  name: MeasurementEventName;
  route: string;
}

export function createMeasurementEvent(
  name: MeasurementEventName,
  input: Record<string, unknown>,
): MeasurementEvent {
  const route = typeof input.route === 'string' && input.route.startsWith('/') ? input.route.slice(0, 160) : '/';

  return { name, route };
}

export function dispatchMeasurementEvent(name: MeasurementEventName, route?: string): void {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent('radeq:measurement', {
      detail: createMeasurementEvent(name, { route: route ?? window.location.pathname }),
    }),
  );
}
