export function withBaseHref(href: string, basePath = import.meta.env.BASE_URL.replace(/\/$/, '')): string {
  if (!href.startsWith('/')) return href;

  return `${basePath}${href}`;
}
