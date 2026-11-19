// Compila design-system/files/src em design-system/assets/bundle.js e bundle.css.
// Uso: node build.mjs [--out ../design-system/assets]
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const ds = path.resolve(here, '../design-system');
const outIdx = process.argv.indexOf('--out');
const out = outIdx > 0 ? path.resolve(process.argv[outIdx + 1]) : path.join(ds, 'assets');
mkdirSync(out, { recursive: true });

// cabeçalho do bundle: lista de componentes (usada pelo site) + resolvedor dos chunks de ícones
const orig = readFileSync(path.join(ds, 'assets/bundle.js'), 'utf8');
const headEnd = orig.indexOf('*/') + 2;
const header = orig.slice(0, headEnd) + '\n(function(){var b=null;try{var s=document.currentScript;if(s&&s.src&&s.src.indexOf("blob:")!==0&&s.src.indexOf("data:")!==0)b=new URL("icons-chunks/",s.src).href;}catch(e){}window.__SOMA_ICON_CHUNK__=function(g){return (window.__SOMA_ICON_BASE__||b||"./icons-chunks/")+g+".js";};})();\n';
const footer = '\n(function(){var w=window;w.Soma=w.Soma||{};Object.assign(w.Soma,__somaDS);})();\n';

const globals = { react: 'window.React', 'react-dom': 'window.ReactDOM', 'react/jsx-runtime': 'window.__jsx' };
const globalsPlugin = { name: 'globals', setup(b) {
  b.onResolve({ filter: /^react(-dom)?(\/.*)?$/ }, (a) => ({ path: a.path, namespace: 'g' }));
  b.onLoad({ filter: /.*/, namespace: 'g' }, (a) => ({ contents: a.path === 'react/jsx-runtime' ? 'module.exports={jsx:(t,p,k)=>window.React.createElement(t,k==null?p:Object.assign({key:k},p)),jsxs:(t,p,k)=>window.React.createElement(t,k==null?p:Object.assign({key:k},p)),Fragment:window.React.Fragment}' : 'module.exports=' + (globals[a.path] || 'window.React'), loader: 'js' }));
} };
const r = await build({
  entryPoints: [path.join(ds, 'files/src/index.ts')], bundle: true, minify: true, format: 'iife', globalName: '__somaDS',
  target: 'es2019', platform: 'browser', write: false, plugins: [globalsPlugin], jsx: 'transform', jsxFactory: 'window.React.createElement', jsxFragment: 'window.React.Fragment',
  define: { 'process.env.NODE_ENV': '"production"' }, logLevel: 'warning',
  nodePaths: [path.join(here, 'node_modules')], absWorkingDir: here,
});
writeFileSync(path.join(out, 'bundle.js'), header + '"use strict";' + r.outputFiles[0].text + footer);

// CSS: Tailwind com o preset do sistema
const twcfg = path.join(here, 'tailwind.config.cjs');
writeFileSync(twcfg, `module.exports={presets:[require(${JSON.stringify(path.join(ds, 'files/src/tailwind.preset.js'))})],content:[${JSON.stringify(path.join(ds, 'files/src/**/*.{ts,tsx}'))},${JSON.stringify(path.join(ds, 'previews/*.html'))}],corePlugins:{}};`);
writeFileSync(path.join(here, 'in.css'), '@tailwind base;@tailwind components;@tailwind utilities;\n' + readFileSync(path.join(here, 'extra.css'), 'utf8'));
execFileSync(path.join(here, 'node_modules/.bin/tailwindcss'), ['-c', twcfg, '-i', path.join(here, 'in.css'), '-o', path.join(out, 'bundle.css'), '--minify'], { stdio: 'inherit' });
console.log('ok →', out);
