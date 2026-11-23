// Captura cada preview (design-system/previews/*.html) na largura da moldura do site e monta folhas de contato.
// Uso: node capturar-previews.mjs <pasta-de-saida> [largura=860] [colunas=4] [linhas=3] [Nome ...]
import puppeteer from 'puppeteer-core';
import http from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const CHROME = process.env.CHROME_PATH || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium'].find((p) => existsSync(p));
const ds = path.resolve(here, '../design-system');
const out = path.resolve(process.argv[2] || 'previews-capturados'); const W = +(process.argv[3] || 860), COLS = +(process.argv[4] || 4), ROWS = +(process.argv[5] || 3);
const only = process.argv.slice(6);
mkdirSync(out, { recursive: true });
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' };
const srv = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ds, p.replace(/^\/design-system/, ''));
  if (!f.startsWith(ds) || !existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); return res.end('404'); }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); res.end(readFileSync(f));
}).listen(0);
const base = `http://localhost:${srv.address().port}/design-system/`;
const names = readdirSync(path.join(ds, 'previews')).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5)).filter((n) => !only.length || only.includes(n));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage(); await page.setViewport({ width: W, height: 700 });
const lista = [];
for (const n of names) {
  await page.goto(base + 'previews/' + n + '.html', { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready); await new Promise((s) => setTimeout(s, 450));
  const h = await page.evaluate(() => Math.min(1500, document.documentElement.scrollHeight));
  await page.setViewport({ width: W, height: Math.max(h, 300) });
  await page.screenshot({ path: path.join(out, n + '.jpg'), type: 'jpeg', quality: 62 });
  await page.setViewport({ width: W, height: 700 });
  lista.push(n);
}
const per = COLS * ROWS; const sheets = Math.ceil(lista.length / per);
for (let s = 0; s < sheets; s++) {
  const items = lista.slice(s * per, (s + 1) * per);
  const html = `<body style="margin:0;background:#222;font:12px sans-serif;color:#fff"><div style="display:grid;grid-template-columns:repeat(${COLS},1fr);gap:6px;padding:6px;align-items:start">${items.map((n) => `<figure style="margin:0"><img style="width:100%;display:block" src="data:image/jpeg;base64,${readFileSync(path.join(out, n + '.jpg')).toString('base64')}"><figcaption style="padding:2px 0">${n}</figcaption></figure>`).join('')}</div></body>`;
  const p2 = await browser.newPage(); await p2.setViewport({ width: 1600, height: 900 }); await p2.setContent(html, { waitUntil: 'load' });
  await p2.screenshot({ path: path.join(out, `folha-${String(s + 1).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 70, fullPage: true }); await p2.close();
}
console.log('previews:', lista.length, '· folhas:', sheets);
await browser.close(); srv.close();
