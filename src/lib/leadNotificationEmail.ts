import type { LeadSubmission } from './leads';

export interface LeadNotificationMessage {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  text: string;
}

const notificationTo = 'siroky@radeq.cz';
const notificationFrom = 'Radeq.cz poptávky <siroky@radeq.cz>';
const resendEndpoint = 'https://api.resend.com/emails';

export async function sendLeadNotificationEmail(
  apiKey: string | undefined,
  lead: LeadSubmission,
  leadId: string,
  createdAt: string,
  fetchImpl: typeof fetch = fetch,
): Promise<'sent' | 'skipped'> {
  if (!apiKey) return 'skipped';

  const message = createLeadNotificationEmail(lead, leadId, createdAt);
  const response = await fetchImpl(resendEndpoint, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: message.from,
      to: message.to,
      reply_to: message.replyTo,
      subject: message.subject,
      text: message.text,
    }),
  });

  if (!response.ok) {
    let detail = '';
    try {
      detail = (await response.text()).slice(0, 200);
    } catch {
      // Response body not readable; the status code alone is enough to diagnose.
    }
    throw new Error(`resend_http_${response.status}${detail ? ` ${detail}` : ''}`);
  }

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
    replyTo: lead.email,
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
