import { useMemo, useState } from 'react';
import type { AuditContent } from '../data/audit';
import type { Locale } from '../data/locales';
import { readSubmittedTurnstileToken, useTurnstileWidget } from '../lib/useTurnstileWidget';

type MeasureStatus =
  | 'ok'
  | 'no_field_data'
  | 'unreachable'
  | 'psi_error'
  | 'rate_limited'
  | 'invalid_url'
  | 'verification_failed';
type StatusState = MeasureStatus | 'idle' | 'loading';
type AutomationAnswer = 'yes' | 'no';

interface MeasureFinding {
  signal: string;
  meaning: string;
  verify: string;
}

interface MeasureResponse {
  status: MeasureStatus;
  measuredUrl: string;
  findings: MeasureFinding[];
}

interface Props {
  locale: Locale;
  content: AuditContent['tool'];
  measurePath: string;
  contactHref: string;
}

const TURNSTILE_SITE_KEY = String(import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '').trim();

export default function AuditTool({ locale, content, measurePath, contactHref }: Props) {
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<MeasureResponse | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [inlineStatus, setInlineStatus] = useState<StatusState>('idle');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [automationAnswer, setAutomationAnswer] = useState<AutomationAnswer>('no');
  const isTurnstileEnabled = TURNSTILE_SITE_KEY.length > 0;
  const { containerRef: turnstileContainerRef, resetWidget: resetTurnstileWidget } = useTurnstileWidget({
    enabled: isTurnstileEnabled,
    siteKey: TURNSTILE_SITE_KEY,
    onToken: (token) => {
      setTurnstileToken(token);
      if (!token) return;

      setInlineStatus('idle');
      setStatusMessage((current) => (current === content.verificationPrompt ? '' : current));
    },
  });

  const ctaHref = useMemo(() => {
    const measuredUrl = result && result.status !== 'invalid_url' ? result.measuredUrl : '';
    const projectType = automationAnswer === 'yes' ? content.automationProjectType : content.auditProjectType;
    return createContactHref(contactHref, measuredUrl, projectType);
  }, [automationAnswer, contactHref, content.auditProjectType, content.automationProjectType, result]);
  const statusState = result?.status ?? (isSubmitting ? 'loading' : inlineStatus);
  const isAlertStatus =
    statusState === 'invalid_url' ||
    statusState === 'unreachable' ||
    statusState === 'psi_error' ||
    statusState === 'rate_limited' ||
    statusState === 'verification_failed';

  async function submitMeasurement(event: { preventDefault: () => void }) {
    event.preventDefault();
    if (isSubmitting) return;

    const submittedTurnstileToken = readSubmittedTurnstileToken(turnstileToken, turnstileContainerRef.current);
    if (isTurnstileEnabled && !submittedTurnstileToken) {
      setResult(null);
      setInlineStatus('verification_failed');
      setStatusMessage(content.verificationPrompt);
      return;
    }

    setIsSubmitting(true);
    setResult(null);
    setInlineStatus('idle');
    setStatusMessage(content.loadingLabel);

    try {
      const response = await fetch(measurePath, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          url,
          locale,
          ...(isTurnstileEnabled ? { turnstileToken: submittedTurnstileToken } : {}),
        }),
      });

      const responseType = response.headers.get('content-type') || '';
      if (!responseType.includes('application/json')) {
        throw new Error('Expected JSON response.');
      }

      const payload = (await response.json()) as MeasureResponse;
      if (!isMeasureResponse(payload)) {
        throw new Error('Unexpected measure response.');
      }

      setResult(payload);
      setStatusMessage(content.statusLabels[payload.status] ?? content.statusLabels.psi_error);
    } catch {
      const fallback: MeasureResponse = {
        status: 'psi_error',
        measuredUrl: '',
        findings: [content.apiUnavailableFinding],
      };
      setResult(fallback);
      setStatusMessage(content.statusLabels.psi_error);
    } finally {
      setIsSubmitting(false);
      resetTurnstileWidget();
    }
  }

  return (
    <section className="audit-tool" aria-label={content.formAriaLabel}>
      <form className="audit-tool__form" onSubmit={submitMeasurement} noValidate>
        <div className="audit-tool__field">
          <label htmlFor="audit-url">{content.inputLabel}</label>
          <input
            id="audit-url"
            name="url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder={content.inputPlaceholder}
            autoComplete="url"
            inputMode="url"
            spellCheck={false}
            disabled={isSubmitting}
            required
          />
        </div>

        <p className="audit-tool__consent">{content.consent}</p>

        {isTurnstileEnabled ? (
          <div className="audit-tool__turnstile-group">
            <div
              className="audit-tool__turnstile"
              ref={turnstileContainerRef}
              aria-label={content.verificationLabel}
            />
            <p className="audit-tool__turnstile-note">{content.turnstileNote}</p>
          </div>
        ) : null}

        <div className="audit-tool__actions">
          <button className="rq-btn rq-btn--primary audit-tool__submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? content.loadingLabel : content.submitLabel}
          </button>
          {!result ? (
            <p
              className="audit-tool__status"
              data-status={statusState}
              role={isAlertStatus ? 'alert' : 'status'}
              aria-live={isAlertStatus ? 'assertive' : 'polite'}
              aria-atomic="true"
            >
              {statusMessage}
            </p>
          ) : null}
        </div>
      </form>

      {result ? (
        <div className="audit-tool__result" data-status={result.status}>
          <header className="audit-tool__result-header">
            <p
              className="audit-tool__status audit-tool__status--result"
              data-status={statusState}
              role={isAlertStatus ? 'alert' : 'status'}
              aria-live={isAlertStatus ? 'assertive' : 'polite'}
              aria-atomic="true"
            >
              {statusMessage}
            </p>

            {result.measuredUrl ? (
              <p className="audit-tool__measured">
                <span>{content.measuredLabel}</span>
                <strong>{result.measuredUrl}</strong>
              </p>
            ) : null}
          </header>

          <div className="audit-tool__cards">
            {result.findings.map((finding, index) => (
              <article className="audit-tool__card" key={`${finding.signal}-${index}`}>
                <h3 className="audit-tool__card-title">
                  <span className="rq-sr-only">{content.signalLabel}: </span>
                  {finding.signal}
                </h3>
                <div className="audit-tool__card-block">
                  <span className="audit-tool__card-label">{content.meaningLabel}</span>
                  <p>{finding.meaning}</p>
                </div>
                <div className="audit-tool__card-block">
                  <span className="audit-tool__card-label">{content.verifyLabel}</span>
                  <p>{finding.verify}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="audit-tool__close">
            <p>{content.resultNote}</p>
            <a className="rq-btn rq-btn--primary audit-tool__cta" href={ctaHref}>
              {content.ctaLabel}
            </a>
          </div>

          <fieldset className="audit-tool__qualifier">
            <legend>{content.automationQuestion}</legend>
            <div className="audit-tool__toggle-group">
              <label>
                <input
                  type="radio"
                  name="audit-automation"
                  value="yes"
                  checked={automationAnswer === 'yes'}
                  onChange={() => setAutomationAnswer('yes')}
                />
                <span>{content.automationYes}</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="audit-automation"
                  value="no"
                  checked={automationAnswer === 'no'}
                  onChange={() => setAutomationAnswer('no')}
                />
                <span>{content.automationNo}</span>
              </label>
            </div>
          </fieldset>
        </div>
      ) : null}
    </section>
  );
}

function createContactHref(contactHref: string, measuredUrl: string, projectType: string): string {
  const url = new URL(contactHref || '/#kontakt', 'https://radeq.cz');
  if (measuredUrl) {
    url.searchParams.set('current_url', measuredUrl);
  }
  url.searchParams.set('project_type', projectType);
  url.hash = 'kontakt';

  return `${url.pathname}${url.search}${url.hash}`;
}

function isMeasureResponse(value: unknown): value is MeasureResponse {
  if (!isObjectRecord(value)) return false;
  if (!isMeasureStatus(value.status)) return false;
  if (typeof value.measuredUrl !== 'string') return false;
  if (!Array.isArray(value.findings)) return false;

  return value.findings.every((finding) => {
    if (!isObjectRecord(finding)) return false;
    return (
      typeof finding.signal === 'string' &&
      typeof finding.meaning === 'string' &&
      typeof finding.verify === 'string'
    );
  });
}

function isMeasureStatus(value: unknown): value is MeasureStatus {
  return (
    value === 'ok' ||
    value === 'no_field_data' ||
    value === 'unreachable' ||
    value === 'psi_error' ||
    value === 'rate_limited' ||
    value === 'invalid_url' ||
    value === 'verification_failed'
  );
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
