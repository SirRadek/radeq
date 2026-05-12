import { describe, expect, it } from 'vitest';
import {
  createEmptyBrief,
  generateBriefSummary,
  parseTerminalCommand,
  updateBriefFromCommand,
} from '../src/lib/terminal';
import { createLeadPayload, validateLeadSubmission } from '../src/lib/leads';

describe('terminal brief parser', () => {
  it('accepts whitelisted set commands and updates a brief field', () => {
    const brief = createEmptyBrief();
    const parsed = parseTerminalCommand('set project_type Poptávková stránka');
    const updated = updateBriefFromCommand(brief, parsed);

    expect(updated.project_type).toBe('Poptávková stránka');
  });

  it('rejects unknown commands without shell semantics', () => {
    const parsed = parseTerminalCommand('rm -rf /');

    expect(parsed.ok).toBe(false);
    if (parsed.ok) throw new Error('Expected command to fail');
    expect(parsed.error).toContain('Unknown command');
  });

  it('rejects fields outside the brief contract', () => {
    const parsed = parseTerminalCommand('set secret_key abc123');

    expect(parsed.ok).toBe(false);
    if (parsed.ok) throw new Error('Expected command to fail');
    expect(parsed.error).toContain('Unsupported field');
  });

  it('generates a readable summary from completed fields', () => {
    const summary = generateBriefSummary({
      name: 'Jan Siroky',
      email: 'siroky@radeq.cz',
      company: 'Radeq.cz',
      project_type: 'Poptávkový tok',
      audience: 'Marketing architects',
      deadline: 'Q3',
      current_url: 'https://example.com',
      budget_range: '50k-100k CZK',
      message: 'Need reliable lead routing.',
    });

    expect(summary).toContain('Poptávkový tok');
    expect(summary).toContain('Marketing architects');
    expect(summary).toContain('Need reliable lead routing.');
    expect(summary).toContain('siroky@radeq.cz');
  });

  it('parses submit as an explicit non-shell command', () => {
    const parsed = parseTerminalCommand('submit');

    expect(parsed).toEqual({ ok: true, type: 'submit' });
  });

  it('validates a complete lead payload before storage', () => {
    const result = validateLeadSubmission({
      name: 'Jan Siroky',
      email: 'SIROKY@RADEQ.CZ',
      company: 'Radeq.cz',
      project_type: 'Poptávková stránka',
      audience: 'Micro-SaaS founders',
      deadline: 'Q3',
      current_url: 'https://example.com',
      budget_range: '50k-100k CZK',
      message: 'Need reliable lead routing.',
      source_path: '/',
      referrer: '',
      locale: 'cs-CZ',
      honeypot: '',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('Expected validation to pass');
    expect(result.data.email).toBe('siroky@radeq.cz');
  });

  it('builds lead metadata from the active route locale instead of browser language', () => {
    const payload = createLeadPayload(
      {
        name: 'Jan Siroky',
        email: 'siroky@radeq.cz',
        company: 'Radeq.cz',
        project_type: 'Request Flow',
        audience: 'Marketing architects',
        deadline: 'Q3',
        current_url: 'https://example.com',
        budget_range: '50k-100k CZK',
        message: 'Need reliable lead routing.',
      },
      {
        href: 'https://radeq.cz/en/?utm_source=test',
        locale: 'en',
        referrer: 'https://referrer.example/path',
      },
    );

    expect(payload.source_path).toBe('/en/');
    expect(payload.referrer).toBe('https://referrer.example');
    expect(payload.locale).toBe('en');
  });

  it('drops malformed referrers from lead metadata', () => {
    const payload = createLeadPayload(
      {
        name: 'Radek',
        email: 'radek@example.com',
        company: 'Radeq.cz',
        project_type: 'Request Flow',
        audience: 'Marketing architects',
        deadline: 'Q3',
        current_url: 'https://example.com',
        budget_range: '50k-100k CZK',
        message: 'Need reliable lead routing.',
      },
      {
        href: 'https://radeq.cz/?token=private#brief',
        locale: 'cs',
        referrer: 'not a url',
      },
    );

    expect(payload.source_path).toBe('/');
    expect(payload.referrer).toBe('');
  });

  it('rejects incomplete or suspicious lead payloads', () => {
    const result = validateLeadSubmission({
      name: '',
      email: 'not-an-email',
      project_type: '',
      message: '',
      honeypot: 'spam',
    });

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error('Expected validation to fail');
    expect(result.errors).toContain('Spam filter rejected this submission.');
    expect(result.errors).toContain('Missing required field: name');
    expect(result.errors).toContain('Email does not look valid.');
  });
});
