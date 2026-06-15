import type { APIRoute } from 'astro';
import { showcaseExamples } from '../data/showcaseExamples';
import { getModuleOptions } from '../data/styleMatrix';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const lastmod = '2026-06-12';

function withBase(path: string) {
  return `${basePath}${path}`;
}

function renderUrl(path: string, site: URL) {
  const loc = new URL(withBase(path), site).toString();

  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    '  </url>',
  ].join('\n');
}

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ?? new URL('https://radeq.cz');
  const moduleIds = getModuleOptions('cs').map((moduleOption) => moduleOption.id);
  const showcasePaths = ['/ukazky/', ...showcaseExamples.map((example) => `/ukazky/${example.slug}/`)];
  const routePagePaths = ['/kontakt/', '/sluzby/', '/portfolio/', '/soukromi/', '/podminky/', '/gdpr/', '/cookies/'];
  const paths = [
    '/',
    '/en/',
    ...routePagePaths,
    ...showcasePaths,
    ...moduleIds.map((moduleId) => `/demo/${moduleId}/`),
    ...moduleIds.map((moduleId) => `/en/demo/${moduleId}/`),
  ];

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((path) => renderUrl(path, siteUrl)),
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
    },
  });
};
