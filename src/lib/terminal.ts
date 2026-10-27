export interface TerminalBrief {
  name: string;
  email: string;
  company: string;
  project_type: string;
  audience: string;
  deadline: string;
  current_url: string;
  budget_range: string;
  message: string;
}

export type BriefField = keyof TerminalBrief;

export type BriefSummaryLabels = Record<BriefField, string>;

export type TerminalCommand =
  | { ok: true; type: 'set'; field: BriefField; value: string }
  | { ok: true; type: 'summary' | 'help' | 'clear' | 'submit' }
  | { ok: false; error: string };

const fields: BriefField[] = [
  'name',
  'email',
  'company',
  'project_type',
  'audience',
  'deadline',
  'current_url',
  'budget_range',
  'message',
];

export function createEmptyBrief(): TerminalBrief {
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
  };
}

export function parseTerminalCommand(input: string): TerminalCommand {
  const trimmed = input.trim();

  if (!trimmed) {
    return { ok: false, error: 'Command is empty.' };
  }

  if (trimmed === 'help') {
    return { ok: true, type: 'help' };
  }

  if (trimmed === 'summary') {
    return { ok: true, type: 'summary' };
  }

  if (trimmed === 'clear') {
    return { ok: true, type: 'clear' };
  }

  if (trimmed === 'submit') {
    return { ok: true, type: 'submit' };
  }

  const match = trimmed.match(/^set\s+([a-z_]+)\s+(.+)$/i);
  if (!match) {
    return { ok: false, error: `Unknown command: ${trimmed}` };
  }

  const [, rawField, rawValue] = match;
  if (!fields.includes(rawField as BriefField)) {
    return { ok: false, error: `Unsupported field: ${rawField}` };
  }

  return {
    ok: true,
    type: 'set',
    field: rawField as BriefField,
    value: rawValue.trim(),
  };
}

export function updateBriefFromCommand(brief: TerminalBrief, command: TerminalCommand): TerminalBrief {
  if (!command.ok || command.type !== 'set') {
    return brief;
  }

  return {
    ...brief,
    [command.field]: command.value,
  };
}

const defaultSummaryLabels: BriefSummaryLabels = {
  name: 'Name',
  email: 'Email',
  company: 'Company',
  project_type: 'Project',
  audience: 'Audience',
  deadline: 'Deadline',
  current_url: 'Current URL',
  budget_range: 'Budget',
  message: 'Message',
};

export function generateBriefSummary(
  brief: TerminalBrief,
  labels: BriefSummaryLabels = defaultSummaryLabels,
  emptyValue = 'not set',
): string {
  const lines = [
    `${labels.name}: ${brief.name || emptyValue}`,
    `${labels.email}: ${brief.email || emptyValue}`,
    `${labels.company}: ${brief.company || emptyValue}`,
    `${labels.project_type}: ${brief.project_type || emptyValue}`,
    `${labels.audience}: ${brief.audience || emptyValue}`,
    `${labels.deadline}: ${brief.deadline || emptyValue}`,
    `${labels.current_url}: ${brief.current_url || emptyValue}`,
    `${labels.budget_range}: ${brief.budget_range || emptyValue}`,
    `${labels.message}: ${brief.message || emptyValue}`,
  ];

  return lines.join('\n');
}
