// Shared pure visitor email renderer. No transport, secrets or tracking.
const copy = {
  cs: {
    subject: 'Poptávka dorazila — RadeQ.cz',
    preheader: 'Děkuji za zprávu. Ozvu se vám do 1 pracovního dne.',
    status: 'POPTÁVKA DORAZILA',
    heading: 'Děkuji za vaši<br>poptávku.',
    greeting: (name) => `Dobrý den, ${name},`,
    intro: 'vaše zpráva je u mě. Podívám se na ni a ozvu se vám do 1 pracovního dne.',
    summary: 'Kopie vaší poptávky',
    project: 'Projekt',
    unspecified: 'Neuvedeno',
    message: 'Vaše zpráva',
    nextTitle: 'Co bude dál',
    next: 'Probereme, co potřebujete, a domluvíme další postup. Pokud bude něco chybět, doptám se.',
    reply: 'Chcete něco doplnit? Stačí odpovědět na tento e-mail.',
    note: 'Tento e-mail potvrzuje přijetí poptávky. Nepotvrzuje objednávku, platbu ani uzavření smlouvy.',
    textHeading: 'Děkuji za vaši poptávku.',
  },
  en: {
    subject: 'Enquiry received — RadeQ.cz',
    preheader: 'Thank you for your message. I’ll reply within 1 working day.',
    status: 'ENQUIRY RECEIVED',
    heading: 'Thank you for<br>your enquiry.',
    greeting: (name) => `Hello ${name},`,
    intro: 'I’ve received your message. I’ll take a look and reply within 1 working day.',
    summary: 'A copy of your enquiry',
    project: 'Project',
    unspecified: 'Not specified',
    message: 'Your message',
    nextTitle: 'What happens next',
    next: 'We’ll discuss what you need and agree on the next step. If I need any more details, I’ll ask.',
    reply: 'Anything to add? Just reply to this email.',
    note: 'This email confirms receipt of your enquiry. It does not confirm an order, a payment or a contract.',
    textHeading: 'Thank you for your enquiry.',
  },
};

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

// Same routing rule as the current confirmation. User strings only enter text nodes.
export function renderConfirmationEmail(lead) {
  const lang = lead.locale.toLowerCase().startsWith('en') ? 'en' : 'cs';
  const c = copy[lang];
  const greeting = c.greeting(escapeHtml(lead.name));
  const project = lead.project_type.trim() || c.unspecified;
  const message = escapeHtml(lead.message).replace(/\r\n|\r|\n/g, '<br>');
  const html = `<!doctype html>
<html lang="${lang}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>${c.subject}</title></head>
<body style="margin:0;padding:0;width:100%;background-color:#f7f4ee;color:#1c1a17;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<div style="display:none;font-size:1px;line-height:1px;color:#f7f4ee;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${c.preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f7f4ee" style="width:100%;border-collapse:collapse;background-color:#f7f4ee;">
<tr><td align="center" style="padding:28px 12px;">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;border-collapse:collapse;table-layout:fixed;">
<tr><td style="padding:0 20px 22px;font-family:Arial,Helvetica,sans-serif;"><a href="${lang === 'en' ? 'https://radeq.cz/en/' : 'https://radeq.cz/'}" style="font-size:27px;line-height:34px;font-weight:700;letter-spacing:-1px;color:#7a1f2b;text-decoration:none;">RadeQ.cz</a></td></tr>
<tr><td bgcolor="#ffffff" style="padding:32px 24px 30px;border-top:3px solid #7a1f2b;background-color:#ffffff;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;table-layout:fixed;">
<tr><td style="padding:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:17px;font-weight:700;letter-spacing:1.5px;color:#7a1f2b;">${c.status}</td></tr>
<tr><td style="padding:0 0 24px;"><h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:36px;line-height:41px;font-weight:400;letter-spacing:-1px;color:#1c1a17;">${c.heading}</h1></td></tr>
<tr><td style="padding:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:25px;overflow-wrap:anywhere;word-wrap:break-word;">${greeting}</td></tr>
<tr><td style="padding:0 0 28px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:25px;color:#46413b;">${c.intro}</td></tr>
<tr><td bgcolor="#f7f4ee" style="padding:22px 20px;border-left:2px solid #7a1f2b;background-color:#f7f4ee;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;table-layout:fixed;">
<tr><td style="padding:0 0 22px;"><h2 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:17px;line-height:24px;font-weight:700;">${c.summary}</h2></td></tr>
<tr><td style="padding:0 0 5px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#625a51;">${c.project}</td></tr>
<tr><td style="padding:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;font-weight:700;overflow-wrap:anywhere;word-wrap:break-word;">${escapeHtml(project)}</td></tr>
<tr><td style="padding:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#625a51;">${c.message}</td></tr>
<tr><td style="padding:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;overflow-wrap:anywhere;word-wrap:break-word;">${message}</td></tr>
</table></td></tr>
<tr><td style="padding:28px 0 8px;"><h2 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:25px;font-weight:700;">${c.nextTitle}</h2></td></tr>
<tr><td style="padding:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#46413b;">${c.next}</td></tr>
<tr><td style="padding:0 0 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#46413b;">${c.reply}</td></tr>
<tr><td style="padding:0 0 4px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:29px;color:#1c1a17;">Radek Široký</td></tr>
<tr><td style="padding:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:24px;"><a href="mailto:siroky@radeq.cz" style="color:#7a1f2b;text-decoration:underline;">siroky@radeq.cz</a></td></tr>
</table></td></tr>
<tr><td style="padding:20px 20px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:19px;color:#625a51;">${c.note}</td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table>
</body></html>`;
  const text = [c.textHeading, '', c.greeting(lead.name), '', c.intro, '', c.summary, `${c.project}: ${project}`, '', `${c.message}:`, lead.message, '', c.nextTitle, c.next, '', c.reply, '', 'Radek Široký', 'RadeQ.cz · siroky@radeq.cz', '', c.note].join('\n');
  return { lang, subject: c.subject, html, text };
}

