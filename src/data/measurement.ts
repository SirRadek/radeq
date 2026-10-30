// Only public identifiers belong here. Empty integrations are deliberately inactive.
export const measurement = {
 ga4: (import.meta.env.PUBLIC_GA4_ID ?? 'G-KEYQT7L6WE').trim(),
 sem: (import.meta.env.PUBLIC_SEZNAM_SEM_ID ?? 'hnmz6knxzn0cjegwwy74qv0z').trim(),
 seznamVerification: (import.meta.env.PUBLIC_SEZNAM_WMT ?? '').trim(),
 googleVerification: (import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION ?? '').trim(),
};
