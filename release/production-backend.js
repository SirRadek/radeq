import { reserveQuota, reserveConfirmation } from './atomic-quotas.js';
import { renderConfirmationEmail } from './confirmation-email.js';
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/lib/leads.ts
var leadFieldLimits = {
  name: 90,
  email: 160,
  company: 120,
  project_type: 120,
  audience: 180,
  deadline: 80,
  current_url: 240,
  budget_range: 80,
  message: 1200,
  source_path: 240,
  referrer: 320,
  locale: 32,
  honeypot: 120
};
var requiredFields = ["name", "email", "project_type", "message"];
var leadFields = Object.keys(leadFieldLimits);
function createEmptyLeadSubmission() {
  return {
    name: "",
    email: "",
    company: "",
    project_type: "",
    audience: "",
    deadline: "",
    current_url: "",
    budget_range: "",
    message: "",
    source_path: "",
    referrer: "",
    locale: "",
    honeypot: ""
  };
}
__name(createEmptyLeadSubmission, "createEmptyLeadSubmission");
function createLeadId(now = Date.now()) {
  const randomPart = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10);
  return `lead_${now.toString(36)}_${randomPart}`;
}
__name(createLeadId, "createLeadId");
function normalizeLeadSubmission(input) {
  const source = isObjectRecord(input) ? input : {};
  const normalized = createEmptyLeadSubmission();
  for (const field of leadFields) {
    normalized[field] = sanitizeField(source[field], leadFieldLimits[field]);
  }
  normalized.email = normalized.email.toLowerCase();
  return normalized;
}
__name(normalizeLeadSubmission, "normalizeLeadSubmission");
function validateLeadSubmission(input) {
  const data = normalizeLeadSubmission(input);
  const errors = [];
  if (data.honeypot) {
    errors.push("Spam filter rejected this submission.");
  }
  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  if (data.email && !isLikelyEmail(data.email)) {
    errors.push("Email does not look valid.");
  }
  if (data.current_url && !isPublicHttpUrl(data.current_url)) {
    errors.push("Current URL must be a public http:// or https:// address.");
  }
  if (errors.length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, data };
}
__name(validateLeadSubmission, "validateLeadSubmission");
function sanitizeField(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}
__name(sanitizeField, "sanitizeField");
function isLikelyEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
__name(isLikelyEmail, "isLikelyEmail");
function isPublicHttpUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    if (url.port) return false;
    if (url.username || url.password) return false;
    const hostname = normalizeHostname(url.hostname);
    if (!hostname) return false;
    if (hostname === "localhost" || hostname.endsWith(".localhost")) return false;
    if (hostname === "local" || hostname.endsWith(".local")) return false;
    if (hostname === "internal" || hostname.endsWith(".internal")) return false;
    const ipv4 = parseIpv4(hostname);
    if (ipv4) return false;
    if (isIpv6Literal(hostname)) return false;
    return true;
  } catch {
    return false;
  }
}
__name(isPublicHttpUrl, "isPublicHttpUrl");
function normalizeHostname(hostname) {
  const withoutBrackets = hostname.startsWith("[") && hostname.endsWith("]") ? hostname.slice(1, -1) : hostname;
  return withoutBrackets.toLowerCase().replace(/\.$/, "");
}
__name(normalizeHostname, "normalizeHostname");
function parseIpv4(hostname) {
  const parts = hostname.split(".");
  if (parts.length !== 4) return null;
  const octets = parts.map((part) => {
    if (!/^\d{1,3}$/.test(part)) return Number.NaN;
    const value = Number(part);
    return value >= 0 && value <= 255 ? value : Number.NaN;
  });
  if (octets.some(Number.isNaN)) return null;
  return octets;
}
__name(parseIpv4, "parseIpv4");
function isIpv6Literal(hostname) {
  return hostname.includes(":");
}
__name(isIpv6Literal, "isIpv6Literal");
function isObjectRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
__name(isObjectRecord, "isObjectRecord");

// src/lib/leadNotificationEmail.ts
var notificationTo = "siroky@radeq.cz";
var notificationFrom = "Radeq.cz popt\xE1vky <siroky@radeq.cz>";
var confirmationFrom = "Radeq.cz <siroky@radeq.cz>";
var resendEndpoint = "https://api.resend.com/emails";
async function postToResend(apiKey, message, fetchImpl) {
  const response = await fetchImpl(resendEndpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      from: message.from,
      to: message.to,
      reply_to: message.replyTo,
      subject: message.subject,
      text: message.text,
      ...(message.html ? { html: message.html } : {})
    })
  });
  if (!response.ok) {
    let detail = "";
    try {
      detail = (await response.text()).slice(0, 200);
    } catch {
    }
    throw new Error(`resend_http_${response.status}${detail ? ` ${detail}` : ""}`);
  }
  return "sent";
}
__name(postToResend, "postToResend");
async function sendLeadNotificationEmail(apiKey, lead, leadId, createdAt, fetchImpl = fetch) {
  if (!apiKey) return "skipped";
  return postToResend(apiKey, createLeadNotificationEmail(lead, leadId, createdAt), fetchImpl);
}
__name(sendLeadNotificationEmail, "sendLeadNotificationEmail");
async function sendLeadConfirmationEmail(apiKey, lead, fetchImpl = fetch) {
  if (!apiKey) return "skipped";
  return postToResend(apiKey, createLeadConfirmationEmail(lead), fetchImpl);
}
__name(sendLeadConfirmationEmail, "sendLeadConfirmationEmail");
function createLeadNotificationEmail(lead, leadId, createdAt) {
  return {
    to: notificationTo,
    from: notificationFrom,
    replyTo: lead.email,
    subject: cleanSubject(`Nov\xE1 popt\xE1vka: ${lead.project_type} - ${lead.name}`),
    text: [
      "Nov\xE1 popt\xE1vka z Radeq.cz",
      "",
      `ID: ${leadId}`,
      `\u010Cas: ${createdAt}`,
      `Typ projektu: ${lead.project_type}`,
      `Jm\xE9no: ${lead.name}`,
      `E-mail: ${lead.email}`,
      optionalLine("Firma", lead.company),
      optionalLine("Publikum", lead.audience),
      optionalLine("Term\xEDn", lead.deadline),
      optionalLine("Sou\u010Dasn\xE1 URL", lead.current_url),
      optionalLine("Rozpo\u010Det", lead.budget_range),
      optionalLine("Zdrojov\xE1 cesta", lead.source_path),
      "",
      "Zpr\xE1va:",
      lead.message
    ].filter(Boolean).join("\n")
  };
}
__name(createLeadNotificationEmail, "createLeadNotificationEmail");
function createLeadConfirmationEmail(lead) {
  const { subject, html, text } = renderConfirmationEmail(lead);
  return { to: lead.email, from: confirmationFrom, replyTo: notificationTo, subject, text, html };
}
__name(createLeadConfirmationEmail, "createLeadConfirmationEmail");
function optionalLine(label, value) {
  return value ? `${label}: ${value}` : "";
}
__name(optionalLine, "optionalLine");
function cleanSubject(value) {
  return value.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 140);
}
__name(cleanSubject, "cleanSubject");

// src/lib/requestGuards.ts
var TURNSTILE_SITEVERIFY_ENDPOINT = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
function getCfConnectingIp(request) {
  return request.headers.get("cf-connecting-ip")?.trim() ?? "";
}
__name(getCfConnectingIp, "getCfConnectingIp");
function readTurnstileToken(input) {
  if (typeof input !== "object" || input === null) return "";
  const record = input;
  const primary = record.turnstileToken;
  if (typeof primary === "string" && primary) return primary;
  const fallback = record["cf-turnstile-response"];
  return typeof fallback === "string" ? fallback : "";
}
__name(readTurnstileToken, "readTurnstileToken");
async function verifyTurnstile(secret, token, remoteip, fetchImpl = fetch) {
  const trimmedToken = token.trim();
  if (!trimmedToken || trimmedToken.length > 2048) return false;
  const payload = new URLSearchParams({ secret, response: trimmedToken });
  if (remoteip) payload.set("remoteip", remoteip);
  try {
    const response = await fetchImpl(TURNSTILE_SITEVERIFY_ENDPOINT, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded"
      },
      body: payload
    });
    if (!response.ok) return false;
    const body = await response.json();
    return body.success === true;
  } catch {
    return false;
  }
}
__name(verifyTurnstile, "verifyTurnstile");
// functions/api/leads.ts
var LEAD_RATE_LIMIT_MAX = 2;
var LEAD_RATE_LIMIT_WINDOW_SECONDS = 24 * 60 * 60;
async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.LEADS_DB) {
    return jsonResponse(
      {
        ok: false,
        error: "Lead storage is not configured. Bind a Cloudflare D1 database as LEADS_DB."
      },
      503
    );
  }
  if (!isJsonRequest(request)) {
    return jsonResponse({ ok: false, error: "Expected application/json request body." }, 415);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: "Request body is not valid JSON." }, 400);
  }
  const result = validateLeadSubmission(body);
  if (!result.ok) {
    return jsonResponse({ ok: false, error: "Lead validation failed.", details: result.errors }, 400);
  }
  const lead = result.data;
  const clientIp = getCfConnectingIp(request);
  const isEnglish = lead.locale.toLowerCase().startsWith("en");
  const rateLimitExempt = clientIp !== "" && (env.RATE_LIMIT_WHITELIST ?? "").split(",").map((entry) => entry.trim()).includes(clientIp);
  const turnstileSecret = env.TURNSTILE_SECRET?.trim();
  if (turnstileSecret) {
    const verified = await verifyTurnstile(turnstileSecret, readTurnstileToken(body), clientIp);
    if (!verified) {
      return jsonResponse(
        {
          ok: false,
          error: isEnglish ? "Verification did not pass. Please confirm you are not a robot and submit again." : "Ov\u011B\u0159en\xED neprob\u011Bhlo. Potvr\u010Fte pros\xEDm, \u017Ee nejste robot, a ode\u0161lete znovu."
        },
        403
      );
    }
  }
  const rateLimit = rateLimitExempt ? { status: "allowed" } : await reserveQuota(env.LEADS_DB, {
    scope: "lead", subject: clientIp || "unknown",
    max: LEAD_RATE_LIMIT_MAX,
    windowSeconds: LEAD_RATE_LIMIT_WINDOW_SECONDS
  });
  if (rateLimit.status === "unavailable") return jsonResponse({ ok: false, error: isEnglish ? "The form is temporarily unavailable. Please try later or write by email." : "Formulář je dočasně nedostupný. Zkuste to později nebo napište e-mailem." }, 503);
  if (rateLimit.status === "limited") {
    return jsonResponse(
      {
        ok: false,
        error: isEnglish ? "Too many requests from this connection. Please try again later or write by email." : "Z tohoto p\u0159ipojen\xED p\u0159i\u0161lo p\u0159\xEDli\u0161 mnoho popt\xE1vek. Zkuste to pros\xEDm pozd\u011Bji nebo napi\u0161te e-mailem."
      },
      429,
      rateLimit.retryAfterSeconds
    );
  }
  const id = createLeadId();
  const createdAt = (/* @__PURE__ */ new Date()).toISOString();
  try {
    const stored = await env.LEADS_DB.prepare(
      `INSERT INTO leads (
        id,
        created_at,
        status,
        name,
        email,
        company,
        project_type,
        audience,
        deadline,
        current_url,
        budget_range,
        message,
        source_path,
        referrer,
        locale
      ) VALUES (?, ?, 'new', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      createdAt,
      lead.name,
      lead.email,
      lead.company,
      lead.project_type,
      lead.audience,
      lead.deadline,
      lead.current_url,
      lead.budget_range,
      lead.message,
      lead.source_path,
      lead.referrer,
      lead.locale
    ).run();
    if (!stored.success) {
      return jsonResponse({ ok: false, error: "Lead could not be stored." }, 500);
    }
  } catch {
    return jsonResponse({ ok: false, error: "Lead could not be stored." }, 500);
  }
  const confirmationAllowed = Boolean(env.RESEND_API_KEY) && (await reserveConfirmation(env.LEADS_DB, lead.email)).status === "allowed";
  const [notifyResult, confirmResult] = await Promise.allSettled([
    sendLeadNotificationEmail(env.RESEND_API_KEY, lead, id, createdAt),
    confirmationAllowed ? sendLeadConfirmationEmail(env.RESEND_API_KEY, lead) : Promise.resolve("skipped")
  ]);
  if (notifyResult.status === "rejected") {
    console.error("Lead notification email failed", {
      leadId: id,
      code: getEmailErrorCode(notifyResult.reason),
      message: notifyResult.reason instanceof Error ? notifyResult.reason.message : "Unknown email error"
    });
  }
  if (confirmResult.status === "rejected") {
    console.error("Lead confirmation email failed", {
      leadId: id,
      code: getEmailErrorCode(confirmResult.reason),
      message: confirmResult.reason instanceof Error ? confirmResult.reason.message : "Unknown email error"
    });
  }
  return jsonResponse({ ok: true, leadId: id }, 201);
}
__name(onRequestPost, "onRequestPost");
function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: responseHeaders()
  });
}
__name(onRequestOptions, "onRequestOptions");
function isJsonRequest(request) {
  return request.headers.get("content-type")?.toLowerCase().includes("application/json") ?? false;
}
__name(isJsonRequest, "isJsonRequest");
function jsonResponse(body, status = 200, retryAfterSeconds) {
  const headers = new Headers(responseHeaders());
  if (retryAfterSeconds) {
    headers.set("retry-after", String(retryAfterSeconds));
  }
  return new Response(JSON.stringify(body), {
    status,
    headers
  });
}
__name(jsonResponse, "jsonResponse");
function responseHeaders() {
  return {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type"
  };
}
__name(responseHeaders, "responseHeaders");
function getEmailErrorCode(error) {
  if (typeof error === "object" && error !== null && "code" in error && typeof error.code === "string") {
    return error.code;
  }
  return "unknown";
}
__name(getEmailErrorCode, "getEmailErrorCode");

// functions/api/measure.ts
var PSI_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
var TURNSTILE_SITEVERIFY_ENDPOINT2 = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
var RATE_LIMIT_MAX = 5;
var RATE_LIMIT_WINDOW_SECONDS = 10 * 60;
async function onRequestPost2(context) {
  const { request, env } = context;
  if (!isJsonRequest2(request)) {
    return jsonResponse2(createFailureResponse("invalid_url", "", "cs"), 415);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse2(createFailureResponse("invalid_url", "", "cs"), 400);
  }
  const locale = readLocale(body);
  const measuredUrl = normalizeSubmittedUrl(readString(body, "url"));
  if (!measuredUrl || !isPublicHttpUrl(measuredUrl)) {
    return jsonResponse2(createFailureResponse("invalid_url", measuredUrl ?? "", locale), 400);
  }
  const turnstileSecret = env.TURNSTILE_SECRET?.trim();
  if (turnstileSecret) {
    const verified = await verifyTurnstile2(
      turnstileSecret,
      readTurnstileToken2(body),
      getCfConnectingIp(request)
    );
    if (!verified) {
      return jsonResponse2(createFailureResponse("verification_failed", measuredUrl, locale), 403);
    }
  }
  const rateLimit = await reserveQuota(env.LEADS_DB, { scope: "measure", subject: getCfConnectingIp(request) || "unknown", max: RATE_LIMIT_MAX, windowSeconds: RATE_LIMIT_WINDOW_SECONDS });
  if (rateLimit.status === "unavailable") return jsonResponse2(createFailureResponse("psi_error", measuredUrl, locale), 503);
  if (rateLimit.status === "limited") {
    return jsonResponse2(createFailureResponse("rate_limited", measuredUrl, locale), 429, rateLimit.retryAfterSeconds);
  }
  let psiResponse;
  try {
    psiResponse = await fetch(createPsiUrl(measuredUrl, env.PSI_API_KEY), {
      headers: {
        accept: "application/json"
      }
    });
  } catch {
    return jsonResponse2(createFailureResponse("psi_error", measuredUrl, locale), 502);
  }
  let psiBody;
  try {
    psiBody = await psiResponse.json();
  } catch {
    return jsonResponse2(createFailureResponse("psi_error", measuredUrl, locale), 502);
  }
  if (!psiResponse.ok) {
    const status = classifyPsiError(psiResponse, psiBody);
    return jsonResponse2(createFailureResponse(status, measuredUrl, locale), httpStatusForMeasureStatus(status));
  }
  const runtimeError = psiBody.lighthouseResult?.runtimeError;
  if (runtimeError && isUnreachableMessage(`${runtimeError.code ?? ""} ${runtimeError.message ?? ""}`)) {
    return jsonResponse2(createFailureResponse("unreachable", measuredUrl, locale), 502);
  }
  if (!psiBody.lighthouseResult?.audits) {
    return jsonResponse2(createFailureResponse("psi_error", measuredUrl, locale), 502);
  }
  return jsonResponse2(mapPsiResponse(psiBody, measuredUrl, locale), 200);
}
__name(onRequestPost2, "onRequestPost");
function onRequestOptions2() {
  return new Response(null, {
    status: 204,
    headers: responseHeaders2()
  });
}
__name(onRequestOptions2, "onRequestOptions");
function isJsonRequest2(request) {
  return request.headers.get("content-type")?.toLowerCase().includes("application/json") ?? false;
}
__name(isJsonRequest2, "isJsonRequest");
function jsonResponse2(body, status = 200, retryAfterSeconds) {
  const headers = new Headers(responseHeaders2());
  if (retryAfterSeconds) {
    headers.set("retry-after", String(retryAfterSeconds));
  }
  return new Response(JSON.stringify(body), {
    status,
    headers
  });
}
__name(jsonResponse2, "jsonResponse");
function responseHeaders2() {
  return {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type"
  };
}
__name(responseHeaders2, "responseHeaders");
function readLocale(input) {
  const value = readString(input, "locale").toLowerCase();
  return value.startsWith("en") ? "en" : "cs";
}
__name(readLocale, "readLocale");
function readString(input, key) {
  if (!isObjectRecord2(input)) return "";
  const value = input[key];
  return typeof value === "string" ? value : "";
}
__name(readString, "readString");
function readTurnstileToken2(input) {
  return readString(input, "turnstileToken") || readString(input, "cf-turnstile-response");
}
__name(readTurnstileToken2, "readTurnstileToken");
function normalizeSubmittedUrl(value) {
  const trimmed = value.replace(/[\u0000-\u001f\u007f]/g, " ").trim();
  if (!trimmed || trimmed.length > 2048) return null;
  const withScheme = /^[a-z][a-z\d+\-.]*:\/\//i.test(trimmed) ? trimmed : trimmed.startsWith("//") ? `https:${trimmed}` : `https://${trimmed}`;
  try {
    return new URL(withScheme).toString();
  } catch {
    return null;
  }
}
__name(normalizeSubmittedUrl, "normalizeSubmittedUrl");
function createPsiUrl(measuredUrl, apiKey) {
  const url = new URL(PSI_ENDPOINT);
  url.searchParams.set("url", measuredUrl);
  url.searchParams.set("strategy", "mobile");
  url.searchParams.append("category", "performance");
  url.searchParams.append("category", "seo");
  url.searchParams.append("category", "best-practices");
  if (apiKey) {
    url.searchParams.set("key", apiKey);
  }
  return url.toString();
}
__name(createPsiUrl, "createPsiUrl");
async function verifyTurnstile2(secret, token, remoteip) {
  const trimmedToken = token.trim();
  if (!trimmedToken || trimmedToken.length > 2048) return false;
  const payload = new URLSearchParams({
    secret,
    response: trimmedToken
  });
  if (remoteip) {
    payload.set("remoteip", remoteip);
  }
  try {
    const response = await fetch(TURNSTILE_SITEVERIFY_ENDPOINT2, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded"
      },
      body: payload
    });
    if (!response.ok) return false;
    const body = await response.json();
    return body.success === true;
  } catch {
    return false;
  }
}
__name(verifyTurnstile2, "verifyTurnstile");
function classifyPsiError(response, body) {
  const message = [
    body.error?.status,
    body.error?.message,
    ...body.error?.errors?.flatMap((error) => [error.reason, error.message]) ?? []
  ].filter(Boolean).join(" ");
  if (response.status === 429 || /quota|rate|resource_exhausted/i.test(message)) {
    return "rate_limited";
  }
  if (isUnreachableMessage(message)) {
    return "unreachable";
  }
  return "psi_error";
}
__name(classifyPsiError, "classifyPsiError");
function isUnreachableMessage(message) {
  return /erred_document_request|net::err|lighthouse returned error|navigation|timed out|unable to fetch|failed to fetch|cannot navigate/i.test(
    message
  );
}
__name(isUnreachableMessage, "isUnreachableMessage");
function httpStatusForMeasureStatus(status) {
  switch (status) {
    case "invalid_url":
      return 400;
    case "verification_failed":
      return 403;
    case "rate_limited":
      return 429;
    case "unreachable":
    case "psi_error":
      return 502;
    case "ok":
    case "no_field_data":
      return 200;
  }
}
__name(httpStatusForMeasureStatus, "httpStatusForMeasureStatus");
function mapPsiResponse(body, measuredUrl, locale) {
  const audits = body.lighthouseResult?.audits ?? {};
  const fieldCategory = body.loadingExperience?.overall_category;
  const performanceBand = mapLabPerformance(body.lighthouseResult?.categories?.performance?.score, locale);
  const hasFieldData = fieldCategory === "FAST" || fieldCategory === "AVERAGE" || fieldCategory === "SLOW";
  return {
    status: hasFieldData ? "ok" : "no_field_data",
    measuredUrl,
    findings: [
      hasFieldData ? createFieldSpeedFinding(fieldCategory, locale) : createNoFieldDataFinding(performanceBand, locale),
      createViewportFinding(auditPassed(audits, "viewport"), locale),
      createSeoFinding(
        auditPassed(audits, "document-title"),
        auditPassed(audits, "meta-description"),
        auditPassed(audits, "is-crawlable"),
        locale
      ),
      createImageAltFinding(auditPassed(audits, "image-alt"), locale),
      createHttpsFinding(auditPassed(audits, "is-on-https"), auditPassed(audits, "redirects-http"), locale)
    ]
  };
}
__name(mapPsiResponse, "mapPsiResponse");
function auditPassed(audits, id) {
  const score = audits[id]?.score;
  if (typeof score !== "number") return null;
  return score >= 0.9;
}
__name(auditPassed, "auditPassed");
function mapLabPerformance(value, locale) {
  if (typeof value !== "number") {
    return locale === "en" ? "not confirmed by the lab run" : "laboratorn\u011B nepotvrzen\xFD";
  }
  if (value >= 0.9) return locale === "en" ? "fast in the lab run" : "rychl\xFD v laboratorn\xEDm n\xE1hledu";
  if (value >= 0.5) return locale === "en" ? "mixed in the lab run" : "sm\xED\u0161en\xFD v laboratorn\xEDm n\xE1hledu";
  return locale === "en" ? "slow in the lab run" : "pomal\xFD v laboratorn\xEDm n\xE1hledu";
}
__name(mapLabPerformance, "mapLabPerformance");
function createFieldSpeedFinding(category, locale) {
  const band = fieldSpeedBand(category, locale);
  if (locale === "en") {
    return {
      signal: `Real mobile speed: ${band}`,
      meaning: "CrUX has enough visitor data to show a qualitative real-user speed band for mobile.",
      verify: "I would compare it with a manual template check, key pages, image weight, scripts, and hosting behavior."
    };
  }
  return {
    signal: `Re\xE1ln\xE1 rychlost na mobilu: ${band}`,
    meaning: "CrUX m\xE1 dost n\xE1v\u0161t\u011Bvnick\xFDch dat na kvalitativn\xED pohled na re\xE1ln\xE9 mobiln\xED na\u010D\xEDt\xE1n\xED.",
    verify: "Prov\u011B\u0159il bych konkr\xE9tn\xED \u0161ablony, kl\xED\u010Dov\xE9 str\xE1nky, v\xE1hu obr\xE1zk\u016F, skripty a chov\xE1n\xED hostingu."
  };
}
__name(createFieldSpeedFinding, "createFieldSpeedFinding");
function createNoFieldDataFinding(performanceBand, locale) {
  if (locale === "en") {
    return {
      signal: "Real visitor data: not available",
      meaning: `The website does not have enough traffic for CrUX field data. The fallback lab view is ${performanceBand}.`,
      verify: "I would measure the site directly in the audit and check whether the lab bottleneck appears on real pages."
    };
  }
  return {
    signal: "Re\xE1ln\xE1 data n\xE1v\u0161t\u011Bvn\xEDk\u016F: nejsou k dispozici",
    meaning: `Web nem\xE1 dost n\xE1v\u0161t\u011Bv pro re\xE1ln\xE1 data - v auditu m\u011B\u0159\xEDm p\u0159\xEDmo. Laboratorn\xED n\xE1hled je ${performanceBand}.`,
    verify: "Prov\u011B\u0159il bych web p\u0159\xEDmo v auditu a ov\u011B\u0159il, jestli se laboratorn\xED slabina ukazuje i na re\xE1ln\xFDch str\xE1nk\xE1ch."
  };
}
__name(createNoFieldDataFinding, "createNoFieldDataFinding");
function createViewportFinding(passed, locale) {
  if (locale === "en") {
    return {
      signal: `Mobile viewport: ${triState(passed, "present", "missing", "not confirmed")}`,
      meaning: passed === false ? "Without a viewport declaration, a phone may render the page as a scaled desktop layout." : "PSI checked whether the page declares a mobile viewport.",
      verify: "I would open the main templates on real mobile widths and look for cramped layout, hidden actions, and overflow."
    };
  }
  return {
    signal: `Mobiln\xED zobrazen\xED: ${triState(passed, "OK", "chyb\xED", "nelze potvrdit")}`,
    meaning: passed === false ? "Bez viewportu se m\u016F\u017Ee web na telefonu tv\xE1\u0159it jako zmen\u0161en\xFD desktop." : "PSI zkontrolovalo, jestli str\xE1nka deklaruje mobiln\xED viewport.",
    verify: "Ru\u010Dn\u011B bych pro\u0161el hlavn\xED \u0161ablony na mobiln\xEDch \u0161\xED\u0159k\xE1ch, skryt\xE9 akce a p\u0159et\xE9k\xE1n\xED obsahu."
  };
}
__name(createViewportFinding, "createViewportFinding");
function createSeoFinding(titleOk, descriptionOk, crawlableOk, locale) {
  if (locale === "en") {
    const weakSignals2 = [
      titleOk === false ? "title" : "",
      descriptionOk === false ? "meta description" : "",
      crawlableOk === false ? "crawlability" : ""
    ].filter(Boolean);
    return {
      signal: `SEO basics: ${weakSignals2.length ? weakSignals2.join(", ") : "basic tags present"}`,
      meaning: weakSignals2.length ? "A missing basic tag or blocked crawling can weaken how the page is understood before any deeper SEO work." : "The measured page has the basic title, description, and crawlability signals PSI can verify.",
      verify: "I would check the important pages, duplicated titles, index rules, internal links, and whether search intent is clear."
    };
  }
  const weakSignals = [
    titleOk === false ? "titulek" : "",
    descriptionOk === false ? "meta popis" : "",
    crawlableOk === false ? "indexovatelnost" : ""
  ].filter(Boolean);
  return {
    signal: `SEO z\xE1klad: ${weakSignals.length ? weakSignals.join(", ") : "z\xE1kladn\xED zna\u010Dky jsou p\u0159\xEDtomn\xE9"}`,
    meaning: weakSignals.length ? "Chyb\u011Bj\xEDc\xED z\xE1kladn\xED zna\u010Dka nebo blokace pro roboty m\u016F\u017Ee oslabit pochopen\xED str\xE1nky je\u0161t\u011B p\u0159ed hlub\u0161\xEDm SEO." : "M\u011B\u0159en\xE1 str\xE1nka m\xE1 z\xE1kladn\xED titulek, popis a indexovatelnost, kter\xE9 PSI um\xED ov\u011B\u0159it.",
    verify: "Prov\u011B\u0159il bych d\u016Fle\u017Eit\xE9 str\xE1nky, duplicitn\xED titulky, indexa\u010Dn\xED pravidla, intern\xED odkazy a srozumitelnost z\xE1m\u011Bru."
  };
}
__name(createSeoFinding, "createSeoFinding");
function createImageAltFinding(passed, locale) {
  if (locale === "en") {
    return {
      signal: `Image descriptions: ${triState(passed, "present where PSI checked", "some are missing", "not confirmed")}`,
      meaning: passed === false ? "Images without useful alternative text can hurt accessibility and make content less understandable." : "PSI checked whether visible images expose alternative text.",
      verify: "I would check whether the text is useful, not just present, especially for proof, services, and contact cues."
    };
  }
  return {
    signal: `Popisy obr\xE1zk\u016F: ${triState(passed, "p\u0159\xEDtomn\xE9 tam, kde PSI m\u011B\u0159\xED", "n\u011Bkde chyb\xED", "nelze potvrdit")}`,
    meaning: passed === false ? "Obr\xE1zky bez smyslupln\xE9ho alternativn\xEDho textu zhor\u0161uj\xED p\u0159\xEDstupnost a pochopen\xED obsahu." : "PSI zkontrolovalo, jestli viditeln\xE9 obr\xE1zky maj\xED alternativn\xED text.",
    verify: "Prov\u011B\u0159il bych, jestli jsou popisy u\u017Eite\u010Dn\xE9, ne jen vypln\u011Bn\xE9, hlavn\u011B u d\u016Fkaz\u016F, slu\u017Eeb a kontaktn\xEDch prvk\u016F."
  };
}
__name(createImageAltFinding, "createImageAltFinding");
function createHttpsFinding(httpsOk, redirectOk, locale) {
  const hasProblem = httpsOk === false || redirectOk === false;
  if (locale === "en") {
    return {
      signal: `HTTPS and redirects: ${hasProblem ? "needs checking" : "looks OK in PSI"}`,
      meaning: hasProblem ? "A weak HTTPS or redirect setup can create trust, indexing, and measurement problems." : "PSI did not flag the measured HTTPS and HTTP-to-HTTPS redirect basics.",
      verify: "I would check canonical URLs, redirects between variants, mixed content, and whether analytics keeps one clean URL."
    };
  }
  return {
    signal: `HTTPS a p\u0159esm\u011Brov\xE1n\xED: ${hasProblem ? "chce kontrolu" : "v PSI vypad\xE1 v po\u0159\xE1dku"}`,
    meaning: hasProblem ? "Slab\xE9 HTTPS nebo p\u0159esm\u011Brov\xE1n\xED m\u016F\u017Ee d\u011Blat probl\xE9m d\u016Fv\u011B\u0159e, indexaci i m\u011B\u0159en\xED." : "PSI neozna\u010Dilo z\xE1klad HTTPS a p\u0159esm\u011Brov\xE1n\xED z HTTP na HTTPS jako probl\xE9m.",
    verify: "Prov\u011B\u0159il bych kanonick\xE9 adresy, p\u0159esm\u011Brov\xE1n\xED variant, mixed content a jestli analytika dr\u017E\xED jednu \u010Distou URL."
  };
}
__name(createHttpsFinding, "createHttpsFinding");
function fieldSpeedBand(category, locale) {
  if (locale === "en") {
    if (category === "FAST") return "fast";
    if (category === "AVERAGE") return "average";
    return "slow";
  }
  if (category === "FAST") return "rychl\xE1";
  if (category === "AVERAGE") return "pr\u016Fm\u011Brn\xE1";
  return "pomal\xE1";
}
__name(fieldSpeedBand, "fieldSpeedBand");
function triState(value, yes, no, unknown) {
  if (value === true) return yes;
  if (value === false) return no;
  return unknown;
}
__name(triState, "triState");
function createFailureResponse(status, measuredUrl, locale) {
  return {
    status,
    measuredUrl,
    findings: [failureFinding(status, locale)]
  };
}
__name(createFailureResponse, "createFailureResponse");
function failureFinding(status, locale) {
  const failureText = failureCopy[locale][status] ?? failureCopy[locale].psi_error;
  return {
    signal: failureText.signal,
    meaning: failureText.meaning,
    verify: failureText.verify
  };
}
__name(failureFinding, "failureFinding");
var failureCopy = {
  cs: {
    ok: {
      signal: "M\u011B\u0159en\xED prob\u011Bhlo",
      meaning: "PSI vr\xE1tilo pou\u017Eiteln\xFD kvalitativn\xED n\xE1hled.",
      verify: "V auditu bych v\xFDsledek pro\u0161el ru\u010Dn\u011B."
    },
    no_field_data: {
      signal: "Chyb\xED re\xE1ln\xE1 data n\xE1v\u0161t\u011Bvn\xEDk\u016F",
      meaning: "Web nem\xE1 dost CrUX dat pro re\xE1ln\xFD provoz.",
      verify: "V auditu bych m\u011B\u0159il p\u0159\xEDmo a porovnal kl\xED\u010Dov\xE9 str\xE1nky."
    },
    invalid_url: {
      signal: "Adresa nen\xED ve\u0159ejn\xE1 http/https URL",
      meaning: "M\u011B\u0159\xEDm jen adresu, kterou zad\xE1te, a nep\u0159ij\xEDm\xE1m localhost, intern\xED dom\xE9ny, IP adresy ani nestandardn\xED porty.",
      verify: "Zadejte ve\u0159ejnou adresu webu; intern\xED nebo testovac\xED prost\u0159ed\xED pat\u0159\xED do ru\u010Dn\xEDho auditu."
    },
    verification_failed: {
      signal: "Ov\u011B\u0159en\xED n\xE1v\u0161t\u011Bvn\xEDka neprob\u011Bhlo",
      meaning: "M\u011B\u0159en\xED te\u010F nepust\xEDm bez platn\xE9ho ov\u011B\u0159en\xED, aby n\xE1stroj ne\u0161el zneu\u017E\xEDvat k automatick\xE9mu m\u011B\u0159en\xED.",
      verify: "Obnovte pros\xEDm potvrzen\xED a zkuste to znovu, nebo po\u0161lete adresu rovnou do popt\xE1vky na lidsk\xFD audit."
    },
    unreachable: {
      signal: "Google PSI web nena\u010Detl",
      meaning: "Strojov\xFD n\xE1hled nem\xE1 pou\u017Eiteln\xFD v\xFDstup, proto\u017Ee PSI str\xE1nku nedok\xE1zalo zm\u011B\u0159it.",
      verify: "Prov\u011B\u0159il bych dostupnost, blokace bot\u016F, p\u0159esm\u011Brov\xE1n\xED a jestli web nevy\u017Eaduje p\u0159ihl\xE1\u0161en\xED."
    },
    psi_error: {
      signal: "Google PSI te\u010F nevr\xE1tilo v\xFDsledek",
      meaning: "M\u011B\u0159en\xED je z\xE1visl\xE9 na ofici\xE1ln\xEDm Google API a tentokr\xE1t nedalo pou\u017Eitelnou odpov\u011B\u010F.",
      verify: "Zkusil bych m\u011B\u0159en\xED zopakovat a v placen\xE9m auditu ov\u011B\u0159it web ru\u010Dn\u011B."
    },
    rate_limited: {
      signal: "M\u011B\u0159en\xED je do\u010Dasn\u011B omezen\xE9",
      meaning: "Z jednoho p\u0159ipojen\xED p\u0159i\u0161lo p\u0159\xEDli\u0161 mnoho pokus\u016F v kr\xE1tk\xE9m \u010Dase.",
      verify: "Zkuste to pozd\u011Bji, nebo po\u0161lete adresu rovnou do popt\xE1vky na lidsk\xFD audit."
    }
  },
  en: {
    ok: {
      signal: "Measurement completed",
      meaning: "PSI returned a usable qualitative preview.",
      verify: "In the audit I would check the result manually."
    },
    no_field_data: {
      signal: "Real visitor data is missing",
      meaning: "The website does not have enough CrUX data for real-user traffic.",
      verify: "In the audit I would measure directly and compare the key pages."
    },
    invalid_url: {
      signal: "The address is not a public http/https URL",
      meaning: "I measure only the address you enter, and I do not accept localhost, internal domains, IP addresses, or non-standard ports.",
      verify: "Enter the public website address; internal or staging environments belong in a manual audit."
    },
    verification_failed: {
      signal: "Visitor verification did not pass",
      meaning: "I will not run the machine preview without a valid verification, so the tool cannot be abused for automated measurements.",
      verify: "Refresh the verification and try again, or send the address directly through the human audit request."
    },
    unreachable: {
      signal: "Google PSI could not load the website",
      meaning: "The machine preview has no usable output because PSI could not measure the page.",
      verify: "I would check availability, bot blocking, redirects, and whether the website requires a login."
    },
    psi_error: {
      signal: "Google PSI did not return a result",
      meaning: "Measurement depends on the official Google API, and this run did not return a usable response.",
      verify: "I would retry the measurement and verify the website manually in a paid audit."
    },
    rate_limited: {
      signal: "Measurement is temporarily limited",
      meaning: "Too many attempts came from one connection in a short time.",
      verify: "Try again later, or send the address directly through the human audit request."
    }
  }
};
function isObjectRecord2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
__name(isObjectRecord2, "isObjectRecord");

// worker/index.ts
var index_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/leads") {
      if (request.method === "POST") {
        return onRequestPost({ request, env });
      }
      if (request.method === "OPTIONS") {
        return onRequestOptions();
      }
      return methodNotAllowed();
    }
    if (url.pathname === "/api/measure") {
      if (request.method === "POST") {
        return onRequestPost2({ request, env });
      }
      if (request.method === "OPTIONS") {
        return onRequestOptions2();
      }
      return methodNotAllowed();
    }
    if (url.pathname === "/.well-known/security.txt") {
      return new Response(
        [
          "Contact: mailto:siroky@radeq.cz",
          "Expires: 2027-07-01T00:00:00Z",
          "Preferred-Languages: cs, en",
          "Canonical: https://radeq.cz/.well-known/security.txt",
          ""
        ].join("\n"),
        {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=86400"
          }
        }
      );
    }
    return env.ASSETS.fetch(request);
  }
};
function methodNotAllowed() {
  return new Response("Method Not Allowed", {
    status: 405,
    headers: {
      allow: "POST, OPTIONS",
      "cache-control": "no-store"
    }
  });
}
__name(methodNotAllowed, "methodNotAllowed");
export {
  index_default as default
};
