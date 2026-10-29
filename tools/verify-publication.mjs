import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'publication-manifest.json'),'utf8'));
const siteOnly=process.argv.includes('--site-only');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const failures=[];
const files=Object.entries(manifest.files).filter(([p])=>!siteOnly||p.startsWith('site/'));
for(const [rel,expected]of files){
 const absolute=path.resolve(root,rel);
 if(!absolute.startsWith(root+path.sep)||!fs.existsSync(absolute)||hash(absolute)!==expected)failures.push(rel);
}
const ignore=new Set(['.git','node_modules','dist','.astro','.wrangler','__pycache__']);
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>ignore.has(e.name)?[]:e.isDirectory()?walk(path.join(dir,e.name)):[path.relative(root,path.join(dir,e.name)).split(path.sep).join('/')]);}
const observed=walk(siteOnly?path.join(root,'site'):root);
const unexpected=observed.filter(p=>p!=='publication-manifest.json'&&!Object.hasOwn(manifest.files,p));
if(failures.length||unexpected.length){console.error(JSON.stringify({status:'FAIL',mismatches:failures,unexpected},null,2));process.exitCode=1;}
else console.log(JSON.stringify({status:'PASS',checked:files.length,scope:siteOnly?'site':'complete-publication',acceptedRuntime:manifest.accepted_runtime.run}));
