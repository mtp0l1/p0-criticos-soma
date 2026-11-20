// Teste de fumaça do site: abre cada rota e cada preview no Chrome e aponta 404, erro de script e conteúdo vazio.
// Uso: node testar-site.mjs
import puppeteer from 'puppeteer-core';
import http from 'node:http';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const ds = path.resolve(here, '../design-system');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.zip': 'application/zip', '.md': 'text/plain' };
const srv = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ds, p.replace(/^\/design-system/, ''));
  if (!f.startsWith(ds) || !existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); return res.end('404'); }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); res.end(readFileSync(f));
}).listen(0);
const port = srv.address().port; const base = `http://localhost:${port}/design-system/`;
const routes = [...readFileSync(path.join(ds, 'site/nav.js'), 'utf8').matchAll(/path:"([^"]+)"/g)].map((m) => m[1]);
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage(); await page.setViewport({ width: 1280, height: 900 });
let errs = []; page.on('pageerror', (e) => errs.push('JS: ' + e.message)); page.on('response', (r) => { if (r.status() >= 400) errs.push(`HTTP ${r.status()} ${r.url().replace(base, '')}`); });
page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 140)); });
const bad = [];
await page.goto(base + '#/', { waitUntil: 'load' });
for (const r of routes) {
  errs = [];
  await page.evaluate((h) => { location.hash = h; }, '#' + r);
  await new Promise((s) => setTimeout(s, 450));
  const info = await page.evaluate(() => ({ t: document.title, n: (document.getElementById('content') || document.body).innerText.length, nf: /Página não encontrada/.test(document.body.innerText) }));
  if (info.nf || info.n < 150 || errs.length) bad.push({ rota: r, ...info, errs: [...new Set(errs)].slice(0, 4) });
}
console.log('rotas testadas:', routes.length, '· com problema:', bad.length); bad.forEach((b) => console.log(JSON.stringify(b)));
// previews
const prev = readdirSync(path.join(ds, 'previews')).filter((f) => f.endsWith('.html')); const pb = [];
for (const f of prev) {
  errs = [];
  await page.goto(base + 'previews/' + f, { waitUntil: 'load' }); await new Promise((s) => setTimeout(s, 250));
  const n = await page.evaluate(() => (document.getElementById('root') || document.body).children.length);
  errs = errs.filter((e) => !/favicon/.test(e) && !/Failed to load resource/.test(e));
  if (n === 0 || errs.length) pb.push({ preview: f, filhos: n, errs: [...new Set(errs)].slice(0, 3) });
}
console.log('previews testados:', prev.length, '· com problema:', pb.length); pb.forEach((b) => console.log(JSON.stringify(b)));
await browser.close(); srv.close();
