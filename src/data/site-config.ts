// Public key observed on existing radeq.cz; secret stays in Cloudflare.
export const turnstileSiteKey=String(import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '0x4AAAAAADuCM9qkDGmWKvsw').trim();
