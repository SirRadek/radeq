import {mkdirSync,readFileSync,writeFileSync,openSync,readdirSync} from 'node:fs';
import {resolve,join,relative} from 'node:path';import {pathToFileURL} from 'node:url';import {spawnSync} from 'node:child_process';import {createHash} from 'node:crypto';
function seal(m){
 const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
 const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);
 const sources=[...['src','functions','tests','public','scripts'].flatMap(dir=>walk(resolve(dir))),...['astro.config.mjs','tsconfig.json','package.json','package-lock.json','playwright.themed-demos.config.ts','vitest.config.ts'].map(p=>resolve(p))];
 m.revision=spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).stdout.trim();m.source_hashes=Object.fromEntries(sources.map(p=>[p,sha(p)]));
 for(const v of m.variants)v.artifact_hashes=Object.fromEntries(walk(v.dist).map(p=>[p,sha(p)]));
 return m;
}
if(process.argv[2]==='--seal'){const file=process.argv[3];const m=JSON.parse(readFileSync(file));writeFileSync(file,JSON.stringify(seal(m),null,2));console.log('retained sources and compiled artifacts sealed; no rebuild');process.exit(0);}
const root=process.cwd(),run=resolve('docs/audits/2026-10-09-themed-demos',`build-${Date.now()}`);mkdirSync(run,{recursive:true});
const variants=[];const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
for(const [name,base,port]of [['root','',4213],['subpath','/radeq',4214]]){
 const dir=join(run,name);mkdirSync(dir);const config=join(dir,'astro.config.mjs'),dist=join(dir,'dist');
 writeFileSync(config,`import original from ${JSON.stringify(pathToFileURL(resolve('astro.config.mjs')).href)};export default {...original,root:${JSON.stringify(root)},base:${JSON.stringify(base||'/')},outDir:${JSON.stringify(dist)},cacheDir:${JSON.stringify(join(dir,'cache'))}};`);
 const env={...process.env};delete env.DEPLOY_TARGET;if(base)env.DEPLOY_TARGET='github-pages';
 const result=spawnSync('npm',['run','build','--','--config',relative(root,config)],{cwd:root,env,stdio:['ignore',openSync(join(dir,'build.log'),'w'),openSync(join(dir,'error.log'),'w')]});if(result.status!==0)throw new Error(`build failed: ${dir}`);
 const html=join(dist,'minimalni-navrh/ukazky/instalater/index.html');variants.push({name,base,port,config,dist,config_hash:hash(config),html_hash:hash(html)});
}
const manifest=join(run,'artifact-manifest.json');writeFileSync(manifest,JSON.stringify(seal({root,variants}),null,2));writeFileSync(resolve('docs/audits/2026-10-09-themed-demos/latest-manifest.txt'),manifest);
const tests=spawnSync('npx',['vitest','run','tests/themed-demos-state.test.mjs','tests/themed-demos-preview.test.mjs','tests/four-showcases-preview.test.mjs','tests/public-preview-contract.test.mjs'],{env:{...process.env,DEMO_ARTIFACT_MANIFEST:manifest},stdio:['ignore',openSync(join(run,'green.log'),'w'),openSync(join(run,'green-error.log'),'w')]});if(tests.status!==0)throw new Error('compiled tests failed');
const config=join(run,'tsconfig.json');writeFileSync(config,JSON.stringify({extends:resolve('tsconfig.json'),compilerOptions:{allowJs:true,checkJs:false},include:[resolve('.astro/types.d.ts'),resolve('src/**/*.astro'),resolve('src/**/*.ts'),resolve('src/**/*.tsx'),resolve('functions/**/*.ts')],exclude:[resolve('docs'),resolve('dist'),resolve('node_modules')]}));
const check=spawnSync('npx',['astro','check','--tsconfig',config],{stdio:['ignore',openSync(join(run,'typecheck.log'),'w'),openSync(join(run,'typecheck-error.log'),'w')]});if(check.status!==0)throw new Error('scoped typecheck failed');
console.log(manifest);
