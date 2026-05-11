import { useMemo, useState } from 'react';
import type { Locale } from '../data/locales';
import type { SiteContent } from '../data/siteContent';
import { createLeadPayload, getMissingLeadFields, validateLeadSubmission } from '../lib/leads';
import {
  createEmptyBrief,
  generateBriefSummary,
  type BriefField,
  type BriefSummaryLabels,
  type TerminalBrief,
} from '../lib/terminal';

interface Props {
  locale: Locale;
  content: SiteContent['terminal'];
}

const optionalFields = ['company', 'current_url', 'budget_range', 'deadline', 'audience'] as const satisfies BriefField[];

export default function ContactTerminal({ locale, content }: Props) {
  const [brief, setBrief] = useState<TerminalBrief>(() => createEmptyBrief());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(content.readyStatus);

  const summaryLabels = content.fieldLabels as BriefSummaryLabels;
  const emptySummaryValue = locale === 'cs' ? 'nenastaveno' : 'not set';
  const summary = useMemo(
    () => generateBriefSummary(brief, summaryLabels, emptySummaryValue),
    [brief, emptySummaryValue, summaryLabels],
  );

  function updateField(field: BriefField, value: string) {
    setBrief((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submitForm(event: { preventDefault: () => void }) {
    event.preventDefault();
    await submitBrief();
  }

  async function submitBrief() {
    if (isSubmitting) return;

    const missing = getMissingLeadFields(brief);
    if (missing.length > 0) {
      const error = `${content.missingRequiredPrefix}: ${missing.map((field) => fieldLabel(field, content)).join(', ')}`;
      setStatus(error);
      return;
    }

    const payload = createLeadPayload(brief, {
      href: window.location.href,
      locale,
      referrer: document.referrer,
    });
    const validation = validateLeadSubmission(payload);
    if (!validation.ok) {
      setStatus(validation.errors.join(' '));
      return;
    }

    setIsSubmitting(true);
    setStatus(content.sendingStatus);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const responseType = response.headers.get('content-type') || '';
      if (!responseType.includes('application/json')) {
        throw new Error(content.apiUnavailable);
      }

      const result = (await response.json()) as { ok?: boolean; leadId?: string; error?: string; details?: string[] };

      if (!response.ok || !result.ok) {
        const details = result.details?.length ? ` ${result.details.join(' ')}` : '';
        throw new Error(`${result.error || content.apiUnavailable}${details}`);
      }

      setStatus(locale === 'cs' ? `Poptávka uložena: ${result.leadId}` : `Request stored: ${result.leadId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : content.apiUnavailable;
      setStatus(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="terminal-section" id="terminal" aria-labelledby="terminal-title">
      <div>
        {content.sectionCode ? <p className="section-code">{content.sectionCode}</p> : null}
        <h2 id="terminal-title">{content.title}</h2>
        <p>
          {content.leadPrefix}
          {content.leadCommand ? (
            <>
              {' '}
              <code>{content.leadCommand}</code> {content.leadSuffix}
            </>
          ) : null}
        </p>
      </div>

      <div className="terminal-grid">
        <form
          onSubmit={submitForm}
          className="terminal-window brief-form"
          aria-label={content.regionAria}
          data-cat-platform="contact-form"
        >
          <div className="brief-form__grid">
            <TextField
              field="name"
              value={brief.name}
              content={content}
              autoComplete="name"
              required
              onChange={updateField}
            />
            <TextField
              field="email"
              type="email"
              value={brief.email}
              content={content}
              autoComplete="email"
              required
              onChange={updateField}
            />
            <label className="brief-field">
              <span>{fieldLabel('project_type', content)}</span>
              <select
                value={brief.project_type}
                onChange={(event) => updateField('project_type', event.target.value)}
                disabled={isSubmitting}
                required
              >
                <option value="">{locale === 'cs' ? 'Vyberte možnost' : 'Choose an option'}</option>
                {content.projectOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="brief-field brief-field--wide">
              <span>{fieldLabel('message', content)}</span>
              <textarea
                value={brief.message}
                onChange={(event) => updateField('message', event.target.value)}
                placeholder={content.placeholders.message}
                disabled={isSubmitting}
                required
                rows={5}
              />
            </label>
          </div>

          <details className="brief-optional">
            <summary>{content.optionalTitle}</summary>
            <div className="brief-form__grid">
              {optionalFields.map((field) => (
                <TextField
                  key={field}
                  field={field}
                  value={brief[field]}
                  content={content}
                  type={field === 'current_url' ? 'url' : 'text'}
                  onChange={updateField}
                />
              ))}
            </div>
          </details>

          <div className="brief-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? content.waitLabel : content.runLabel}
            </button>
            <p className="terminal-status" aria-live="polite">
              {status}
            </p>
          </div>
        </form>

        <aside className="brief-summary" aria-label={content.summaryAria} data-cat-platform="contact-summary">
          <h3>{content.summaryTitle}</h3>
          <pre>{summary}</pre>
        </aside>
      </div>
    </section>
  );
}

interface TextFieldProps {
  field: BriefField;
  value: string;
  content: SiteContent['terminal'];
  type?: string;
  autoComplete?: string;
  required?: boolean;
  onChange: (field: BriefField, value: string) => void;
}

function TextField({ field, value, content, type = 'text', autoComplete, required, onChange }: TextFieldProps) {
  return (
    <label className="brief-field">
      <span>{fieldLabel(field, content)}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(field, event.target.value)}
        placeholder={content.placeholders[field] ?? ''}
        autoComplete={autoComplete}
        required={required}
      />
    </label>
  );
}

function fieldLabel(field: BriefField, content: SiteContent['terminal']): string {
  return content.fieldLabels[field] ?? field;
}
