export interface LeadSubmission {
  name: string;
  email: string;
  company: string;
  project_type: string;
  audience: string;
  deadline: string;
  current_url: string;
  budget_range: string;
  message: string;
  source_path: string;
  referrer: string;
  locale: string;
  honeypot: string;
}

export type LeadBriefInput = Pick<
  LeadSubmission,
  'name' | 'email' | 'company' | 'project_type' | 'audience' | 'deadline' | 'current_url' | 'budget_range' | 'message'
>;

export interface LeadPayloadContext {
  href: string;
  locale: string;
  referrer?: string;
}

export interface StoredLead extends LeadSubmission {
  id: string;
  created_at: string;
  status: 'new';
}

export type LeadValidationResult =
  | { ok: true; data: LeadSubmission }
  | { ok: false; errors: string[] };

export const leadFieldLimits: Record<keyof LeadSubmission, number> = {
  name: 90,
  email: 160,
  company: 120,
  project_type: 120,
  audience: 180,
  deadline: 80,
  current_url: 240,
  budget_range: 80,
  message: 1200,
  source_path: 240,
  referrer: 320,
  locale: 32,
  honeypot: 120,
};

const requiredFields = ['name', 'email', 'project_type', 'message'] as const satisfies ReadonlyArray<
  keyof LeadSubmission
>;

const leadFields = Object.keys(leadFieldLimits) as Array<keyof LeadSubmission>;

export function createEmptyLeadSubmission(): LeadSubmission {
  return {
    name: '',
    email: '',
    company: '',
    project_type: '',
    audience: '',
    deadline: '',
    current_url: '',
    budget_range: '',
    message: '',
    source_path: '',
    referrer: '',
    locale: '',
    honeypot: '',
  };
}

export function createLeadId(now = Date.now()): string {
  const randomPart =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `lead_${now.toString(36)}_${randomPart}`;
}

export function createLeadPayload(brief: LeadBriefInput, context: LeadPayloadContext): LeadSubmission {
  const url = new URL(context.href);

  return {
    ...brief,
    source_path: `${url.pathname}${url.search}`,
    referrer: context.referrer ?? '',
    locale: context.locale,
    honeypot: '',
  };
}

export function normalizeLeadSubmission(input: unknown): LeadSubmission {
  const source = isObjectRecord(input) ? input : {};
  const normalized = createEmptyLeadSubmission();

  for (const field of leadFields) {
    normalized[field] = sanitizeField(source[field], leadFieldLimits[field]);
  }

  normalized.email = normalized.email.toLowerCase();
  return normalized;
}

export function validateLeadSubmission(input: unknown): LeadValidationResult {
  const data = normalizeLeadSubmission(input);
  const errors: string[] = [];

  if (data.honeypot) {
    errors.push('Spam filter rejected this submission.');
  }

  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (data.email && !isLikelyEmail(data.email)) {
    errors.push('Email does not look valid.');
  }

  if (data.current_url && !isHttpUrl(data.current_url)) {
    errors.push('Current URL must start with http:// or https://.');
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data };
}

export function getMissingLeadFields(input: Pick<LeadSubmission, (typeof requiredFields)[number]>) {
  return requiredFields.filter((field) => !sanitizeField(input[field], leadFieldLimits[field]));
}

function sanitizeField(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function isLikelyEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
