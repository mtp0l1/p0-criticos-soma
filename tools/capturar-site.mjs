// Captura cada rota do site (topo da página) e confere problemas de layout; monta folhas de contato para revisão visual.
// Uso: node capturar-site.mjs <pasta-de-saida> [colunas=3] [linhas=3]
import puppeteer from 'puppeteer-core';
import http from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const CHROME = process.env.CHROME_PATH || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium'].find((p) => existsSync(p));
const ds = path.resolve(here, '../design-system');
const out = path.resolve(process.argv[2] || 'capturas'); const COLS = +(process.argv[3] || 3), ROWS = +(process.argv[4] || 3);
mkdirSync(out, { recursive: true });
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.zip': 'application/zip', '.md': 'text/plain' };
const srv = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ds, p.replace(/^\/design-system/, ''));
  if (!f.startsWith(ds) || !existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); return res.end('404'); }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); res.end(readFileSync(f));
}).listen(0);
const base = `http://localhost:${srv.address().port}/design-system/`;
const routes = [...readFileSync(path.join(ds, 'site/nav.js'), 'utf8').matchAll(/path:"([^"]+)"/g)].map((m) => m[1]);
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage(); await page.setViewport({ width: 1280, height: 900 });
await page.goto(base + '#/', { waitUntil: 'load' });
const problemas = []; const lista = [];
for (const [i, r] of routes.entries()) {
  await page.evaluate((h) => { location.hash = h; }, '#' + r);
  await new Promise((s) => setTimeout(s, 900));
  const info = await page.evaluate(async () => {
    const c = document.getElementById('content') || document.body; const o = [];
    if (document.documentElement.scrollWidth > innerWidth + 2) o.push('rolagem horizontal da página: ' + document.documentElement.scrollWidth);
    c.querySelectorAll('img').forEach((im) => { if (im.complete && im.naturalWidth === 0) o.push('imagem quebrada: ' + (im.getAttribute('src') || '').slice(-40)); });
    // elementos que estouram a coluna de conteúdo
    const box = c.getBoundingClientRect();
    let est = 0; c.querySelectorAll('*').forEach((e) => { const b = e.getBoundingClientRect(); if (b.width > 0 && b.right > box.right + 6 && !e.closest('.tw,pre,.ds-code-block,.doc-nav,[tabindex="0"]')) est++; });
    if (est > 0) o.push('elementos além da coluna: ' + est);
    // iframes de preview
    const fr = [...c.querySelectorAll('iframe')]; let vazios = 0, largos = 0;
    for (const f of fr) { try { const d = f.contentDocument; const root = d.getElementById('root'); if (!root || !root.children.length) vazios++; if (d.documentElement.scrollWidth > f.clientWidth + 2) largos++; } catch (e) { } }
    if (vazios) o.push('previews vazios: ' + vazios + '/' + fr.length); if (largos) o.push('previews com rolagem horizontal: ' + largos + '/' + fr.length);
    const h1 = c.querySelector('h1'); return { t: h1 ? h1.innerText : document.title, o, n: c.innerText.length, fr: fr.length };
  });
  const arq = String(i).padStart(3, '0') + '.jpg';
  await page.screenshot({ path: path.join(out, arq), type: 'jpeg', quality: 60 });
  lista.push({ arq, rota: r, titulo: info.t });
  if (info.o.length) problemas.push({ rota: r, ...info });
}
writeFileSync(path.join(out, 'lista.json'), JSON.stringify(lista, null, 1));
console.log('rotas:', routes.length, '· com alerta de layout:', problemas.length); problemas.forEach((p) => console.log(JSON.stringify(p)));
// folhas de contato
const per = COLS * ROWS; const sheets = Math.ceil(lista.length / per);
for (let s = 0; s < sheets; s++) {
  const items = lista.slice(s * per, (s + 1) * per);
  const html = `<body style="margin:0;background:#222;font:12px sans-serif;color:#fff"><div style="display:grid;grid-template-columns:repeat(${COLS},1fr);gap:6px;padding:6px">${items.map((it) => `<figure style="margin:0"><img style="width:100%;display:block" src="data:image/jpeg;base64,${readFileSync(path.join(out, it.arq)).toString('base64')}"><figcaption style="padding:2px 0">${it.arq.slice(0, 3)} ${it.rota}</figcaption></figure>`).join('')}</div></body>`;
  const p2 = await browser.newPage(); await p2.setViewport({ width: 1500, height: 900 }); await p2.setContent(html, { waitUntil: 'load' });
  await p2.screenshot({ path: path.join(out, `folha-${String(s + 1).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 70, fullPage: true }); await p2.close();
}
console.log('folhas:', sheets);
await browser.close(); srv.close();
