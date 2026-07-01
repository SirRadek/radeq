import { isPublicHttpUrl } from '../../src/lib/leads';

type MeasureStatus = 'ok' | 'no_field_data' | 'unreachable' | 'psi_error' | 'rate_limited' | 'invalid_url';
type MeasureLocale = 'cs' | 'en';

interface Env {
  // TODO pre-launch: set PSI_API_KEY as a Cloudflare secret for production volume.
  PSI_API_KEY?: string;
  MEASURE_RATE_LIMIT?: KVNamespace;
}

interface PagesContext {
  request: Request;
  env: Env;
}

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

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

interface PsiApiError {
  code?: number;
  message?: string;
  status?: string;
  errors?: Array<{ message?: string; reason?: string }>;
}

interface LighthouseAudit {
  score?: number | null;
}

interface PsiResponse {
  error?: PsiApiError;
  loadingExperience?: {
    overall_category?: string;
  };
  lighthouseResult?: {
    finalUrl?: string;
    runtimeError?: {
      code?: string;
      message?: string;
    };
    categories?: {
      performance?: {
        score?: number | null;
      };
    };
    audits?: Record<string, LighthouseAudit | undefined>;
  };
}

interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

const PSI_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 10 * 60;
const RATE_LIMIT_WINDOW_MS = RATE_LIMIT_WINDOW_SECONDS * 1000;

const memoryRateLimit = new Map<string, { count: number; resetAt: number }>();

export async function onRequestPost(context: PagesContext) {
  const { request, env } = context;

  if (!isJsonRequest(request)) {
    return jsonResponse(createFailureResponse('invalid_url', '', 'cs'), 415);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(createFailureResponse('invalid_url', '', 'cs'), 400);
  }

  const locale = readLocale(body);
  const measuredUrl = normalizeSubmittedUrl(readString(body, 'url'));

  if (!measuredUrl || !isPublicHttpUrl(measuredUrl)) {
    return jsonResponse(createFailureResponse('invalid_url', measuredUrl ?? '', locale), 400);
  }

  const rateLimit = await checkRateLimit(request, env);
  if (!rateLimit.allowed) {
    return jsonResponse(createFailureResponse('rate_limited', measuredUrl, locale), 429, rateLimit.retryAfterSeconds);
  }

  let psiResponse: Response;
  try {
    psiResponse = await fetch(createPsiUrl(measuredUrl, env.PSI_API_KEY), {
      headers: {
        accept: 'application/json',
      },
    });
  } catch {
    return jsonResponse(createFailureResponse('psi_error', measuredUrl, locale), 502);
  }

  let psiBody: PsiResponse;
  try {
    psiBody = (await psiResponse.json()) as PsiResponse;
  } catch {
    return jsonResponse(createFailureResponse('psi_error', measuredUrl, locale), 502);
  }

  if (!psiResponse.ok) {
    const status = classifyPsiError(psiResponse, psiBody);
    return jsonResponse(createFailureResponse(status, measuredUrl, locale), httpStatusForMeasureStatus(status));
  }

  const runtimeError = psiBody.lighthouseResult?.runtimeError;
  if (runtimeError && isUnreachableMessage(`${runtimeError.code ?? ''} ${runtimeError.message ?? ''}`)) {
    return jsonResponse(createFailureResponse('unreachable', measuredUrl, locale), 502);
  }

  if (!psiBody.lighthouseResult?.audits) {
    return jsonResponse(createFailureResponse('psi_error', measuredUrl, locale), 502);
  }

  return jsonResponse(mapPsiResponse(psiBody, measuredUrl, locale), 200);
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: responseHeaders(),
  });
}

function isJsonRequest(request: Request): boolean {
  return request.headers.get('content-type')?.toLowerCase().includes('application/json') ?? false;
}

function jsonResponse(body: MeasureResponse, status = 200, retryAfterSeconds?: number): Response {
  const headers = new Headers(responseHeaders());
  if (retryAfterSeconds) {
    headers.set('retry-after', String(retryAfterSeconds));
  }

  return new Response(JSON.stringify(body), {
    status,
    headers,
  });
}

function responseHeaders(): HeadersInit {
  return {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
  };
}

function readLocale(input: unknown): MeasureLocale {
  const value = readString(input, 'locale').toLowerCase();
  return value.startsWith('en') ? 'en' : 'cs';
}

function readString(input: unknown, key: string): string {
  if (!isObjectRecord(input)) return '';
  const value = input[key];
  return typeof value === 'string' ? value : '';
}

function normalizeSubmittedUrl(value: string): string | null {
  const trimmed = value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim();
  if (!trimmed || trimmed.length > 2048) return null;

  const withScheme = /^[a-z][a-z\d+\-.]*:\/\//i.test(trimmed)
    ? trimmed
    : trimmed.startsWith('//')
      ? `https:${trimmed}`
      : `https://${trimmed}`;

  try {
    return new URL(withScheme).toString();
  } catch {
    return null;
  }
}

function createPsiUrl(measuredUrl: string, apiKey?: string): string {
  const url = new URL(PSI_ENDPOINT);
  url.searchParams.set('url', measuredUrl);
  url.searchParams.set('strategy', 'mobile');
  url.searchParams.append('category', 'performance');
  url.searchParams.append('category', 'seo');
  url.searchParams.append('category', 'best-practices');

  if (apiKey) {
    url.searchParams.set('key', apiKey);
  }

  return url.toString();
}

async function checkRateLimit(request: Request, env: Env): Promise<RateLimitResult> {
  const clientIp = getClientIp(request);
  const key = `measure:${clientIp || 'unknown'}`;

  // TODO pre-launch: bind MEASURE_RATE_LIMIT KV in wrangler; this fallback is isolate-local only.
  // TODO pre-launch: add Turnstile to the form if anonymous measurement starts seeing abuse.
  if (env.MEASURE_RATE_LIMIT) {
    return checkKvRateLimit(env.MEASURE_RATE_LIMIT, key);
  }

  return checkMemoryRateLimit(key);
}

async function checkKvRateLimit(kv: KVNamespace, key: string): Promise<RateLimitResult> {
  const now = Date.now();
  const raw = await kv.get(key);
  const current = parseRateLimitEntry(raw, now);
  if (current.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfterSeconds: secondsUntil(current.resetAt, now) };
  }

  await kv.put(
    key,
    JSON.stringify({
      count: current.count + 1,
      resetAt: current.resetAt,
    }),
    { expirationTtl: RATE_LIMIT_WINDOW_SECONDS + 60 },
  );

  return { allowed: true };
}

function checkMemoryRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  pruneMemoryRateLimit(now);

  const current = memoryRateLimit.get(key);
  if (!current || current.resetAt <= now) {
    memoryRateLimit.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfterSeconds: secondsUntil(current.resetAt, now) };
  }

  current.count += 1;
  return { allowed: true };
}

function parseRateLimitEntry(raw: string | null, now: number): { count: number; resetAt: number } {
  if (!raw) return { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

  try {
    const parsed = JSON.parse(raw) as { count?: unknown; resetAt?: unknown };
    const count = typeof parsed.count === 'number' && Number.isFinite(parsed.count) ? parsed.count : 0;
    const resetAt = typeof parsed.resetAt === 'number' && parsed.resetAt > now
      ? parsed.resetAt
      : now + RATE_LIMIT_WINDOW_MS;

    return { count, resetAt };
  } catch {
    return { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }
}

function pruneMemoryRateLimit(now: number): void {
  if (memoryRateLimit.size < 1000) return;

  for (const [key, entry] of memoryRateLimit) {
    if (entry.resetAt <= now) {
      memoryRateLimit.delete(key);
    }
  }
}

function secondsUntil(resetAt: number, now: number): number {
  return Math.max(1, Math.ceil((resetAt - now) / 1000));
}

function getClientIp(request: Request): string {
  const cfIp = request.headers.get('cf-connecting-ip')?.trim();
  if (cfIp) return cfIp;

  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
}

function classifyPsiError(response: Response, body: PsiResponse): MeasureStatus {
  const message = [
    body.error?.status,
    body.error?.message,
    ...(body.error?.errors?.flatMap((error) => [error.reason, error.message]) ?? []),
  ]
    .filter(Boolean)
    .join(' ');

  if (response.status === 429 || /quota|rate|resource_exhausted/i.test(message)) {
    return 'rate_limited';
  }

  if (isUnreachableMessage(message)) {
    return 'unreachable';
  }

  return 'psi_error';
}

function isUnreachableMessage(message: string): boolean {
  return /erred_document_request|net::err|lighthouse returned error|navigation|timed out|unable to fetch|failed to fetch|cannot navigate/i.test(
    message,
  );
}

function httpStatusForMeasureStatus(status: MeasureStatus): number {
  switch (status) {
    case 'invalid_url':
      return 400;
    case 'rate_limited':
      return 429;
    case 'unreachable':
    case 'psi_error':
      return 502;
    case 'ok':
    case 'no_field_data':
      return 200;
  }
}

function mapPsiResponse(body: PsiResponse, measuredUrl: string, locale: MeasureLocale): MeasureResponse {
  const audits = body.lighthouseResult?.audits ?? {};
  const fieldCategory = body.loadingExperience?.overall_category;
  const performanceBand = mapLabPerformance(body.lighthouseResult?.categories?.performance?.score, locale);
  const hasFieldData = fieldCategory === 'FAST' || fieldCategory === 'AVERAGE' || fieldCategory === 'SLOW';

  return {
    status: hasFieldData ? 'ok' : 'no_field_data',
    measuredUrl,
    findings: [
      hasFieldData
        ? createFieldSpeedFinding(fieldCategory, locale)
        : createNoFieldDataFinding(performanceBand, locale),
      createViewportFinding(auditPassed(audits, 'viewport'), locale),
      createSeoFinding(
        auditPassed(audits, 'document-title'),
        auditPassed(audits, 'meta-description'),
        auditPassed(audits, 'is-crawlable'),
        locale,
      ),
      createImageAltFinding(auditPassed(audits, 'image-alt'), locale),
      createHttpsFinding(auditPassed(audits, 'is-on-https'), auditPassed(audits, 'redirects-http'), locale),
    ],
  };
}

function auditPassed(audits: Record<string, LighthouseAudit | undefined>, id: string): boolean | null {
  const score = audits[id]?.score;
  if (typeof score !== 'number') return null;
  return score >= 0.9;
}

function mapLabPerformance(value: number | null | undefined, locale: MeasureLocale): string {
  if (typeof value !== 'number') {
    return locale === 'en' ? 'not confirmed by the lab run' : 'laboratorně nepotvrzený';
  }

  if (value >= 0.9) return locale === 'en' ? 'fast in the lab run' : 'rychlý v laboratorním náhledu';
  if (value >= 0.5) return locale === 'en' ? 'mixed in the lab run' : 'smíšený v laboratorním náhledu';
  return locale === 'en' ? 'slow in the lab run' : 'pomalý v laboratorním náhledu';
}

function createFieldSpeedFinding(category: string | undefined, locale: MeasureLocale): MeasureFinding {
  const band = fieldSpeedBand(category, locale);

  if (locale === 'en') {
    return {
      signal: `Real mobile speed: ${band}`,
      meaning: 'CrUX has enough visitor data to show a qualitative real-user speed band for mobile.',
      verify: 'I would compare it with a manual template check, key pages, image weight, scripts, and hosting behavior.',
    };
  }

  return {
    signal: `Reálná rychlost na mobilu: ${band}`,
    meaning: 'CrUX má dost návštěvnických dat na kvalitativní pohled na reálné mobilní načítání.',
    verify: 'Prověřil bych konkrétní šablony, klíčové stránky, váhu obrázků, skripty a chování hostingu.',
  };
}

function createNoFieldDataFinding(performanceBand: string, locale: MeasureLocale): MeasureFinding {
  if (locale === 'en') {
    return {
      signal: 'Real visitor data: not available',
      meaning: `The website does not have enough traffic for CrUX field data. The fallback lab view is ${performanceBand}.`,
      verify: 'I would measure the site directly in the audit and check whether the lab bottleneck appears on real pages.',
    };
  }

  return {
    signal: 'Reálná data návštěvníků: nejsou k dispozici',
    meaning: `Web nemá dost návštěv pro reálná data - v auditu měřím přímo. Laboratorní náhled je ${performanceBand}.`,
    verify: 'Prověřil bych web přímo v auditu a ověřil, jestli se laboratorní slabina ukazuje i na reálných stránkách.',
  };
}

function createViewportFinding(passed: boolean | null, locale: MeasureLocale): MeasureFinding {
  if (locale === 'en') {
    return {
      signal: `Mobile viewport: ${triState(passed, 'present', 'missing', 'not confirmed')}`,
      meaning: passed === false
        ? 'Without a viewport declaration, a phone may render the page as a scaled desktop layout.'
        : 'PSI checked whether the page declares a mobile viewport.',
      verify: 'I would open the main templates on real mobile widths and look for cramped layout, hidden actions, and overflow.',
    };
  }

  return {
    signal: `Mobilní zobrazení: ${triState(passed, 'OK', 'chybí', 'nelze potvrdit')}`,
    meaning: passed === false
      ? 'Bez viewportu se může web na telefonu tvářit jako zmenšený desktop.'
      : 'PSI zkontrolovalo, jestli stránka deklaruje mobilní viewport.',
    verify: 'Ručně bych prošel hlavní šablony na mobilních šířkách, skryté akce a přetékání obsahu.',
  };
}

function createSeoFinding(titleOk: boolean | null, descriptionOk: boolean | null, crawlableOk: boolean | null, locale: MeasureLocale): MeasureFinding {
  if (locale === 'en') {
    const weakSignals = [
      titleOk === false ? 'title' : '',
      descriptionOk === false ? 'meta description' : '',
      crawlableOk === false ? 'crawlability' : '',
    ].filter(Boolean);

    return {
      signal: `SEO basics: ${weakSignals.length ? weakSignals.join(', ') : 'basic tags present'}`,
      meaning: weakSignals.length
        ? 'A missing basic tag or blocked crawling can weaken how the page is understood before any deeper SEO work.'
        : 'The measured page has the basic title, description, and crawlability signals PSI can verify.',
      verify: 'I would check the important pages, duplicated titles, index rules, internal links, and whether search intent is clear.',
    };
  }

  const weakSignals = [
    titleOk === false ? 'titulek' : '',
    descriptionOk === false ? 'meta popis' : '',
    crawlableOk === false ? 'indexovatelnost' : '',
  ].filter(Boolean);

  return {
    signal: `SEO základ: ${weakSignals.length ? weakSignals.join(', ') : 'základní značky jsou přítomné'}`,
    meaning: weakSignals.length
      ? 'Chybějící základní značka nebo blokace pro roboty může oslabit pochopení stránky ještě před hlubším SEO.'
      : 'Měřená stránka má základní titulek, popis a indexovatelnost, které PSI umí ověřit.',
    verify: 'Prověřil bych důležité stránky, duplicitní titulky, indexační pravidla, interní odkazy a srozumitelnost záměru.',
  };
}

function createImageAltFinding(passed: boolean | null, locale: MeasureLocale): MeasureFinding {
  if (locale === 'en') {
    return {
      signal: `Image descriptions: ${triState(passed, 'present where PSI checked', 'some are missing', 'not confirmed')}`,
      meaning: passed === false
        ? 'Images without useful alternative text can hurt accessibility and make content less understandable.'
        : 'PSI checked whether visible images expose alternative text.',
      verify: 'I would check whether the text is useful, not just present, especially for proof, services, and contact cues.',
    };
  }

  return {
    signal: `Popisy obrázků: ${triState(passed, 'přítomné tam, kde PSI měří', 'někde chybí', 'nelze potvrdit')}`,
    meaning: passed === false
      ? 'Obrázky bez smysluplného alternativního textu zhoršují přístupnost a pochopení obsahu.'
      : 'PSI zkontrolovalo, jestli viditelné obrázky mají alternativní text.',
    verify: 'Prověřil bych, jestli jsou popisy užitečné, ne jen vyplněné, hlavně u důkazů, služeb a kontaktních prvků.',
  };
}

function createHttpsFinding(httpsOk: boolean | null, redirectOk: boolean | null, locale: MeasureLocale): MeasureFinding {
  const hasProblem = httpsOk === false || redirectOk === false;

  if (locale === 'en') {
    return {
      signal: `HTTPS and redirects: ${hasProblem ? 'needs checking' : 'looks OK in PSI'}`,
      meaning: hasProblem
        ? 'A weak HTTPS or redirect setup can create trust, indexing, and measurement problems.'
        : 'PSI did not flag the measured HTTPS and HTTP-to-HTTPS redirect basics.',
      verify: 'I would check canonical URLs, redirects between variants, mixed content, and whether analytics keeps one clean URL.',
    };
  }

  return {
    signal: `HTTPS a přesměrování: ${hasProblem ? 'chce kontrolu' : 'v PSI vypadá v pořádku'}`,
    meaning: hasProblem
      ? 'Slabé HTTPS nebo přesměrování může dělat problém důvěře, indexaci i měření.'
      : 'PSI neoznačilo základ HTTPS a přesměrování z HTTP na HTTPS jako problém.',
    verify: 'Prověřil bych kanonické adresy, přesměrování variant, mixed content a jestli analytika drží jednu čistou URL.',
  };
}

function fieldSpeedBand(category: string | undefined, locale: MeasureLocale): string {
  if (locale === 'en') {
    if (category === 'FAST') return 'fast';
    if (category === 'AVERAGE') return 'average';
    return 'slow';
  }

  if (category === 'FAST') return 'rychlá';
  if (category === 'AVERAGE') return 'průměrná';
  return 'pomalá';
}

function triState(value: boolean | null, yes: string, no: string, unknown: string): string {
  if (value === true) return yes;
  if (value === false) return no;
  return unknown;
}

function createFailureResponse(status: MeasureStatus, measuredUrl: string, locale: MeasureLocale): MeasureResponse {
  return {
    status,
    measuredUrl,
    findings: [failureFinding(status, locale)],
  };
}

function failureFinding(status: MeasureStatus, locale: MeasureLocale): MeasureFinding {
  const failureText = failureCopy[locale][status] ?? failureCopy[locale].psi_error;
  return {
    signal: failureText.signal,
    meaning: failureText.meaning,
    verify: failureText.verify,
  };
}

const failureCopy: Record<MeasureLocale, Record<MeasureStatus, MeasureFinding>> = {
  cs: {
    ok: {
      signal: 'Měření proběhlo',
      meaning: 'PSI vrátilo použitelný kvalitativní náhled.',
      verify: 'V auditu bych výsledek prošel ručně.',
    },
    no_field_data: {
      signal: 'Chybí reálná data návštěvníků',
      meaning: 'Web nemá dost CrUX dat pro reálný provoz.',
      verify: 'V auditu bych měřil přímo a porovnal klíčové stránky.',
    },
    invalid_url: {
      signal: 'Adresa není veřejná http/https URL',
      meaning: 'Měřím jen adresu, kterou zadáte, a nepřijímám localhost, interní domény, IP adresy ani nestandardní porty.',
      verify: 'Zadejte veřejnou adresu webu; interní nebo testovací prostředí patří do ručního auditu.',
    },
    unreachable: {
      signal: 'Google PSI web nenačetl',
      meaning: 'Strojový náhled nemá použitelný výstup, protože PSI stránku nedokázalo změřit.',
      verify: 'Prověřil bych dostupnost, blokace botů, přesměrování a jestli web nevyžaduje přihlášení.',
    },
    psi_error: {
      signal: 'Google PSI teď nevrátilo výsledek',
      meaning: 'Měření je závislé na oficiálním Google API a tentokrát nedalo použitelnou odpověď.',
      verify: 'Zkusil bych měření zopakovat a v placeném auditu ověřit web ručně.',
    },
    rate_limited: {
      signal: 'Měření je dočasně omezené',
      meaning: 'Z jednoho připojení přišlo příliš mnoho pokusů v krátkém čase.',
      verify: 'Zkuste to později, nebo pošlete adresu rovnou do poptávky na lidský audit.',
    },
  },
  en: {
    ok: {
      signal: 'Measurement completed',
      meaning: 'PSI returned a usable qualitative preview.',
      verify: 'In the audit I would check the result manually.',
    },
    no_field_data: {
      signal: 'Real visitor data is missing',
      meaning: 'The website does not have enough CrUX data for real-user traffic.',
      verify: 'In the audit I would measure directly and compare the key pages.',
    },
    invalid_url: {
      signal: 'The address is not a public http/https URL',
      meaning: 'I measure only the address you enter, and I do not accept localhost, internal domains, IP addresses, or non-standard ports.',
      verify: 'Enter the public website address; internal or staging environments belong in a manual audit.',
    },
    unreachable: {
      signal: 'Google PSI could not load the website',
      meaning: 'The machine preview has no usable output because PSI could not measure the page.',
      verify: 'I would check availability, bot blocking, redirects, and whether the website requires a login.',
    },
    psi_error: {
      signal: 'Google PSI did not return a result',
      meaning: 'Measurement depends on the official Google API, and this run did not return a usable response.',
      verify: 'I would retry the measurement and verify the website manually in a paid audit.',
    },
    rate_limited: {
      signal: 'Measurement is temporarily limited',
      meaning: 'Too many attempts came from one connection in a short time.',
      verify: 'Try again later, or send the address directly through the human audit request.',
    },
  },
};

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
