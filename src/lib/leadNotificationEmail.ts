import type { LeadSubmission } from './leads';

export interface SendEmailBinding {
  send(message: LeadNotificationMessage): Promise<unknown>;
}

export interface LeadNotificationMessage {
  to: string;
  from: {
    email: string;
    name: string;
  };
  replyTo: {
    email: string;
    name: string;
  };
  subject: string;
  text: string;
}

const notificationTo = 'poptavky@radeq.cz';
const notificationFrom = {
  email: 'poptavky@radeq.cz',
  name: 'Radeq.cz poptávky',
};

export async function sendLeadNotificationEmail(
  email: SendEmailBinding | undefined,
  lead: LeadSubmission,
  leadId: string,
  createdAt: string,
): Promise<'sent' | 'skipped'> {
  if (!email) return 'skipped';

  await email.send(createLeadNotificationEmail(lead, leadId, createdAt));
  return 'sent';
}

export function createLeadNotificationEmail(
  lead: LeadSubmission,
  leadId: string,
  createdAt: string,
): LeadNotificationMessage {
  return {
    to: notificationTo,
    from: notificationFrom,
    replyTo: {
      email: lead.email,
      name: lead.name,
    },
    subject: cleanSubject(`Nová poptávka: ${lead.project_type} - ${lead.name}`),
    text: [
      'Nová poptávka z Radeq.cz',
      '',
      `ID: ${leadId}`,
      `Čas: ${createdAt}`,
      `Typ projektu: ${lead.project_type}`,
      `Jméno: ${lead.name}`,
      `E-mail: ${lead.email}`,
      optionalLine('Firma', lead.company),
      optionalLine('Publikum', lead.audience),
      optionalLine('Termín', lead.deadline),
      optionalLine('Současná URL', lead.current_url),
      optionalLine('Rozpočet', lead.budget_range),
      optionalLine('Zdrojová cesta', lead.source_path),
      '',
      'Zpráva:',
      lead.message,
    ]
      .filter(Boolean)
      .join('\n'),
  };
}

function optionalLine(label: string, value: string): string {
  return value ? `${label}: ${value}` : '';
}

function cleanSubject(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 140);
}
