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
const confirmationFrom = 'Radeq.cz <siroky@radeq.cz>';
const resendEndpoint = 'https://api.resend.com/emails';

async function postToResend(
  apiKey: string,
  message: LeadNotificationMessage,
  fetchImpl: typeof fetch,
): Promise<'sent'> {
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

// Owner-facing notification: a new lead landed.
export async function sendLeadNotificationEmail(
  apiKey: string | undefined,
  lead: LeadSubmission,
  leadId: string,
  createdAt: string,
  fetchImpl: typeof fetch = fetch,
): Promise<'sent' | 'skipped'> {
  if (!apiKey) return 'skipped';
  return postToResend(apiKey, createLeadNotificationEmail(lead, leadId, createdAt), fetchImpl);
}

// Visitor-facing confirmation: acknowledge the submitted inquiry in their locale.
export async function sendLeadConfirmationEmail(
  apiKey: string | undefined,
  lead: LeadSubmission,
  fetchImpl: typeof fetch = fetch,
): Promise<'sent' | 'skipped'> {
  if (!apiKey) return 'skipped';
  return postToResend(apiKey, createLeadConfirmationEmail(lead), fetchImpl);
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

export function createLeadConfirmationEmail(lead: LeadSubmission): LeadNotificationMessage {
  const english = lead.locale.toLowerCase().startsWith('en');
  return english ? englishConfirmation(lead) : czechConfirmation(lead);
}

function czechConfirmation(lead: LeadSubmission): LeadNotificationMessage {
  return {
    to: lead.email,
    from: confirmationFrom,
    replyTo: notificationTo,
    subject: 'Děkujeme za vaši poptávku — Radeq.cz',
    text: [
      `Dobrý den ${lead.name},`,
      '',
      'děkuji za vaši poptávku přes radeq.cz — v pořádku dorazila a co nejdřív se vám ozvu (obvykle do jednoho pracovního dne).',
      '',
      'Co jste odeslal(a):',
      `Typ: ${lead.project_type}`,
      `Zpráva: ${lead.message}`,
      '',
      'Kdybyste chtěl(a) cokoli doplnit, stačí odpovědět na tento e-mail.',
      '',
      'Radek Široký',
      'radeq.cz · siroky@radeq.cz',
    ].join('\n'),
  };
}

function englishConfirmation(lead: LeadSubmission): LeadNotificationMessage {
  return {
    to: lead.email,
    from: confirmationFrom,
    replyTo: notificationTo,
    subject: 'Thanks for your inquiry — Radeq.cz',
    text: [
      `Hi ${lead.name},`,
      '',
      "thanks for your inquiry via radeq.cz — it arrived safely and I'll get back to you soon (usually within one business day).",
      '',
      'What you sent:',
      `Type: ${lead.project_type}`,
      `Message: ${lead.message}`,
      '',
      'If you would like to add anything, just reply to this email.',
      '',
      'Radek Široký',
      'radeq.cz · siroky@radeq.cz',
    ].join('\n'),
  };
}

function optionalLine(label: string, value: string): string {
  return value ? `${label}: ${value}` : '';
}

function cleanSubject(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 140);
}
