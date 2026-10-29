import type {APIRoute} from 'astro';
import {isPreviewChannel} from '../lib/preview-channel.mjs';
const paths=['/','/en/','/sluzby/','/en/sluzby/','/kontakt/','/en/kontakt/','/soukromi/','/en/soukromi/','/spoluprace/','/en/spoluprace/','/ukazky/','/en/ukazky/','/audit/','/en/audit/','/zapisky/','/zapisky/web-pro-zivnostnika-cena/','/zapisky/vlastni-eshop-nebo-shoptet/','/zapisky/jak-se-staram-o-web-po-predani/'];
export const GET:APIRoute=({site})=>new Response('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+(isPreviewChannel?'':paths.map(path=>'  <url><loc>'+new URL(path,site??'https://radeq.cz').href+'</loc></url>').join('\n'))+'\n</urlset>\n',{headers:{'content-type':'application/xml; charset=utf-8'}});
