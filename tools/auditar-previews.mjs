// Audita todos os previews no tamanho do celular: contraste de texto, alvo de toque, texto cortado e imagem quebrada.
// Uso: node auditar-previews.mjs [largura=390]
import puppeteer from 'puppeteer-core';
import http from 'node:http';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const CHROME = process.env.CHROME_PATH || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium'].find((p) => existsSync(p)); const ds = path.resolve(here, '../design-system');
const W = +(process.argv[2] || 390);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html'; const f = path.join(ds, p.replace(/^\/design-system/, '')); if (!existsSync(f) || statSync(f).isDirectory()) { r.writeHead(404); return r.end('404'); } r.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); r.end(readFileSync(f)); }).listen(0);
const base = `http://localhost:${srv.address().port}/design-system/previews/`;
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
const pg = await b.newPage(); await pg.setViewport({ width: W, height: 900 });
const out = [];
for (const f of readdirSync(path.join(ds, 'previews')).filter((x) => x.endsWith('.html')).sort()) {
  await pg.goto(base + f, { waitUntil: 'load' }); await new Promise((s) => setTimeout(s, 350));
  const r = await pg.evaluate(() => {
    const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
    const lum = ({ r, g, b }) => { const f = (c) => { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
    const over = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 });
    const bgOf = (el) => { const chain = []; for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0) { chain.push(c); if (c.a >= 1) break; } } let acc = { r: 255, g: 255, b: 255, a: 1 }; for (const c of chain.reverse()) acc = over(c, acc); return acc; };
    const probs = [];
    const vis = (e) => { const s = getComputedStyle(e); const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05; };
    const seen = new Set();
    document.querySelectorAll('#root *').forEach((e) => {
      if (!vis(e)) return;
      const own = [...e.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(' ');
      if (own && !e.closest('[disabled],[aria-disabled="true"],[data-disabled]')) {
        const s = getComputedStyle(e); const fg = parse(s.color); if (fg) { const bg = bgOf(e); const f = over(fg, bg); const l1 = lum(f), l2 = lum(bg); const cr = (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05); const fs = parseFloat(s.fontSize); const need = (fs >= 24 || (fs >= 18.66 && +s.fontWeight >= 700)) ? 3 : 4.5; if (cr < need - .02 && !e.closest('svg')) { const k = own.slice(0, 24) + cr.toFixed(2); if (!seen.has(k)) { seen.add(k); probs.push('contraste ' + cr.toFixed(2) + ':1 "' + own.slice(0, 28) + '"'); } } }
      }
      if (['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(e.tagName) || ['button', 'tab', 'radio', 'switch', 'checkbox'].includes(e.getAttribute('role'))) {
        const bb = e.getBoundingClientRect();
        if ((bb.height < 43.5 || bb.width < 43.5) && !e.closest('[disabled],[aria-disabled="true"],[data-disabled]')) {
          // a área tocável pode passar do próprio elemento (hitArea, rótulo): testa pontos a 22px do centro
          const cx = bb.left + bb.width / 2, cy = bb.top + bb.height / 2; const dx = bb.width < 43.5 ? 21 : 0, dy = bb.height < 43.5 ? 21 : 0; let ok = true;
          for (const [sx, sy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { if ((sx && !dx) || (sy && !dy)) continue; const h = document.elementFromPoint(cx + sx * dx, cy + sy * dy); if (!h || !(e.contains(h) || h.contains(e) || (e.closest('label') && e.closest('label').contains(h)) || (h.closest && h.closest('label') && h.closest('label').contains(e)))) ok = false; }
          if (!ok) probs.push('alvo ' + Math.round(bb.width) + '×' + Math.round(bb.height) + ' ' + (e.getAttribute('aria-label') || e.textContent.trim().slice(0, 20) || e.tagName));
        }
      }
      const s = getComputedStyle(e); const bw = e.getBoundingClientRect();
      if (s.textOverflow === 'ellipsis' && e.scrollWidth > e.clientWidth + 2 && bw.width > 3 && own) probs.push('texto truncado "' + own.slice(0, 24) + '"');
      if (e.tagName === 'IMG' && e.complete && e.naturalWidth === 0) probs.push('imagem quebrada');
    });
    if (document.documentElement.scrollWidth > innerWidth + 1) probs.push('rolagem horizontal ' + document.documentElement.scrollWidth);
    return [...new Set(probs)].slice(0, 8);
  });
  if (r.length) out.push({ preview: f, problemas: r });
}
console.log('largura', W, '· previews com alerta:', out.length); out.forEach((o) => console.log(o.preview, '→', o.problemas.join(' | ')));
await b.close(); srv.close();
