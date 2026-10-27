import { useMemo, useRef, useState } from 'react';
import type { Locale } from '../data/locales';
import type { SiteContent } from '../data/siteContent';
import { createLeadPayload, getMissingLeadFields, leadFieldLimits, validateLeadSubmission } from '../lib/leads';
import { dispatchMeasurementEvent } from '../lib/measurement';
import {
  createEmptyBrief,
  generateBriefSummary,
  type BriefField,
  type BriefSummaryLabels,
  type TerminalBrief,
} from '../lib/terminal';
import { readSubmittedTurnstileToken, useTurnstileWidget } from '../lib/useTurnstileWidget';

const TURNSTILE_SITE_KEY = String(import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '').trim();

interface Props {
  locale: Locale;
  content: SiteContent['terminal'];
}

const optionalFields = ['company', 'current_url', 'budget_range', 'deadline', 'audience'] as const satisfies BriefField[];
type StatusTone = 'neutral' | 'pending' | 'success' | 'error';

export default function ContactTerminal({ locale, content }: Props) {
  const [brief, setBrief] = useState<TerminalBrief>(() => createEmptyBrief());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(content.readyStatus);
  const [statusTone, setStatusTone] = useState<StatusTone>('neutral');
  const [errors, setErrors] = useState<Partial<Record<BriefField, string>>>({});
  const hasStarted = useRef(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileUnavailable, setTurnstileUnavailable] = useState(false);
  const isTurnstileEnabled = TURNSTILE_SITE_KEY.length > 0;
  const { containerRef: turnstileContainerRef, resetWidget: resetTurnstileWidget } = useTurnstileWidget({
    enabled: isTurnstileEnabled,
    siteKey: TURNSTILE_SITE_KEY,
    onToken: setTurnstileToken,
    onUnavailable: setTurnstileUnavailable,
  });

  const summaryLabels = content.fieldLabels as BriefSummaryLabels;
  const emptySummaryValue = locale === 'cs' ? 'nenastaveno' : 'not set';
  const summary = useMemo(
    () => generateBriefSummary(brief, summaryLabels, emptySummaryValue),
    [brief, emptySummaryValue, summaryLabels],
  );

  function updateField(field: BriefField, value: string) {
    markStarted();
    setBrief((current) => ({
      ...current,
      [field]: value,
    }));
    setErrors((current) => {
      if (!current[field]) return current;

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function markStarted() {
    if (hasStarted.current) return;
    hasStarted.current = true;
    dispatchMeasurementEvent('form_start');
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
      setErrors(
        Object.fromEntries(missing.map((field) => [field, content.requiredError])) as Partial<
          Record<BriefField, string>
        >,
      );
      setStatus(error);
      setStatusTone('error');
      window.requestAnimationFrame(() => document.getElementById(`brief-${missing[0]}`)?.focus());
      return;
    }

    setErrors({});
    const payload = createLeadPayload(brief, {
      href: window.location.href,
      locale,
      referrer: document.referrer,
    });
    const validation = validateLeadSubmission(payload);
    if (!validation.ok) {
      const validationErrors: Partial<Record<BriefField, string>> = {};

      if (validation.errors.some((error) => error.startsWith('Email '))) {
        validationErrors.email = content.invalidEmailError;
      }

      if (validation.errors.some((error) => error.startsWith('Current URL '))) {
        validationErrors.current_url = content.invalidUrlError;
      }

      setErrors(validationErrors);
      const invalidFields = Object.keys(validationErrors) as BriefField[];
      setStatus(
        invalidFields.length > 0
          ? `${content.invalidFieldsPrefix}: ${invalidFields.map((field) => fieldLabel(field, content)).join(', ')}`
          : validation.errors.join(' '),
      );
      setStatusTone('error');
      if (invalidFields[0]) {
        window.requestAnimationFrame(() => document.getElementById(`brief-${invalidFields[0]}`)?.focus());
      }
      return;
    }

    const submittedTurnstileToken = readSubmittedTurnstileToken(turnstileToken, turnstileContainerRef.current);
    if (isTurnstileEnabled && !submittedTurnstileToken) {
      setStatus(turnstileUnavailable ? content.verificationUnavailable : content.verificationPrompt);
      setStatusTone('error');
      return;
    }

    setIsSubmitting(true);
    setStatus(content.sendingStatus);
    setStatusTone('pending');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          ...(isTurnstileEnabled ? { turnstileToken: submittedTurnstileToken } : {}),
        }),
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

      setStatus(`${content.storedPrefix}: ${result.leadId}`);
      setStatusTone('success');
      dispatchMeasurementEvent('form_submit_success');
    } catch (error) {
      const message = error instanceof Error ? error.message : content.apiUnavailable;
      setStatus(message);
      setStatusTone('error');
    } finally {
      setIsSubmitting(false);
      resetTurnstileWidget();
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
          aria-describedby="brief-required-note"
          data-cat-platform="contact-form"
          noValidate
        >
          <fieldset className="brief-form__fieldset">
            <legend>{content.commandLabel}</legend>
            <p id="brief-required-note" className="brief-form__note">
              {content.requiredNote}
            </p>
            <div className="brief-form__grid">
              <TextField
                field="name"
                value={brief.name}
                content={content}
                autoComplete="name"
                error={errors.name}
                disabled={isSubmitting}
                required
                onFocus={markStarted}
                onChange={updateField}
              />
              <TextField
                field="email"
                type="email"
                value={brief.email}
                content={content}
                autoComplete="email"
                error={errors.email}
                disabled={isSubmitting}
                inputMode="email"
                required
                spellCheck={false}
                onFocus={markStarted}
                onChange={updateField}
              />
              <div className="brief-field">
                <label htmlFor="brief-project_type">
                  <span>{fieldLabel('project_type', content)}</span>
                  <small aria-hidden="true">{content.requiredLabel}</small>
                </label>
                <select
                  id="brief-project_type"
                  name="project_type"
                  value={brief.project_type}
                  onChange={(event) => updateField('project_type', event.target.value)}
                  onFocus={markStarted}
                  disabled={isSubmitting}
                  autoComplete="off"
                  aria-describedby={errors.project_type ? 'brief-project_type-error' : undefined}
                  aria-invalid={errors.project_type ? 'true' : undefined}
                  required
                >
                  <option value="">{content.selectPlaceholder}</option>
                  {content.projectOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.project_type ? (
                  <span className="brief-field__error" id="brief-project_type-error">
                    {errors.project_type}
                  </span>
                ) : null}
              </div>
              <div className="brief-field brief-field--wide">
                <label htmlFor="brief-message">
                  <span>{fieldLabel('message', content)}</span>
                  <small aria-hidden="true">{content.requiredLabel}</small>
                </label>
                <textarea
                  id="brief-message"
                  name="message"
                  value={brief.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  onFocus={markStarted}
                  placeholder={content.placeholders.message}
                  disabled={isSubmitting}
                  autoComplete="off"
                  aria-describedby={errors.message ? 'brief-message-error' : undefined}
                  aria-invalid={errors.message ? 'true' : undefined}
                  maxLength={leadFieldLimits.message}
                  required
                  rows={5}
                />
                {errors.message ? (
                  <span className="brief-field__error" id="brief-message-error">
                    {errors.message}
                  </span>
                ) : null}
              </div>
            </div>
          </fieldset>

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
                  autoComplete={field === 'company' ? 'organization' : 'off'}
                  disabled={isSubmitting}
                  inputMode={field === 'current_url' ? 'url' : undefined}
                  spellCheck={field !== 'current_url'}
                  onFocus={markStarted}
                  onChange={updateField}
                />
              ))}
            </div>
          </details>

          {isTurnstileEnabled ? (
            <div className="brief-form__turnstile-group">
              <div
                className="brief-form__turnstile"
                ref={turnstileContainerRef}
                aria-label={content.verificationLabel}
              />
              <p className="brief-form__turnstile-note">{content.turnstileNote}</p>
            </div>
          ) : null}

          <div className="brief-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? content.waitLabel : content.runLabel}
            </button>
            <p
              className="terminal-status"
              data-tone={statusTone}
              role={statusTone === 'error' ? 'alert' : 'status'}
              aria-live={statusTone === 'error' ? 'assertive' : 'polite'}
              aria-atomic="true"
            >
              {status}
            </p>
          </div>
        </form>

        <div className="brief-summary" data-cat-platform="contact-summary">
          <h3>{content.summaryTitle}</h3>
          <pre>{summary}</pre>
        </div>
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
  disabled?: boolean;
  error?: string;
  inputMode?: 'email' | 'url';
  required?: boolean;
  spellCheck?: boolean;
  onFocus?: () => void;
  onChange: (field: BriefField, value: string) => void;
}

function TextField({
  field,
  value,
  content,
  type = 'text',
  autoComplete = 'off',
  disabled,
  error,
  inputMode,
  required,
  spellCheck,
  onFocus,
  onChange,
}: TextFieldProps) {
  const fieldId = `brief-${field}`;
  const errorId = `${fieldId}-error`;

  return (
    <div className="brief-field">
      <label htmlFor={fieldId}>
        <span>{fieldLabel(field, content)}</span>
        <small aria-hidden="true">{required ? content.requiredLabel : content.optionalLabel}</small>
      </label>
      <input
        id={fieldId}
        name={field}
        type={type}
        value={value}
        onChange={(event) => onChange(field, event.target.value)}
        onFocus={onFocus}
        placeholder={content.placeholders[field] ?? ''}
        autoComplete={autoComplete}
        disabled={disabled}
        inputMode={inputMode}
        maxLength={leadFieldLimits[field]}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? 'true' : undefined}
        required={required}
        spellCheck={spellCheck}
      />
      {error ? (
        <span className="brief-field__error" id={errorId}>
          {error}
        </span>
      ) : null}
    </div>
  );
}

function fieldLabel(field: BriefField, content: SiteContent['terminal']): string {
  return content.fieldLabels[field] ?? field;
}
