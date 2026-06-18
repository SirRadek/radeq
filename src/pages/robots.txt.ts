import type { APIRoute } from 'astro';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ?? new URL('https://radeq.cz');
  const sitemapUrl = new URL(`${basePath}/sitemap.xml`, siteUrl).toString();

  return new Response(['User-agent: *', 'Allow: /', `Sitemap: ${sitemapUrl}`, 'Disallow: /demo/', 'Disallow: /en/demo/', ''].join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
};
