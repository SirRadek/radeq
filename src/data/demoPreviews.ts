export const demoPreviewIds = [
  'seo-audit',
  'workflow-prototype',
  'maintenance',
  'ai-assistant',
  'data-processing',
  'document-conversion',
] as const;

export type DemoPreviewId = (typeof demoPreviewIds)[number];

export const demoPreviewFeatures = ['mobile-toggle', 'logs', 'checks', 'before-after'] as const;

export type DemoPreviewFeature = (typeof demoPreviewFeatures)[number];

export const demoPreviewRoutes = ['/demos/seo-audit', '/demos/workflow-prototype'] as const;

export type DemoPreviewRoute = (typeof demoPreviewRoutes)[number];

export interface DemoPreviewMeta {
  id: DemoPreviewId;
  urlLabel: string;
  features: DemoPreviewFeature[];
}

export function isDemoPreviewId(value: string): value is DemoPreviewId {
  return demoPreviewIds.includes(value as DemoPreviewId);
}
