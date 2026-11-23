// Gera design-system/assets/thumbs/<Nome>.jpg (960x600, 8:5) a partir de cada previews/<Nome>.html com o bundle atual.
// A miniatura é uma composição: o componente de verdade (primeiros grupos do preview, sem rótulos nem película),
// centralizado sobre um fundo tonal da categoria, sem cortar nada. Peças altas ficam com a base esmaecida.
// Uso: node thumbs.mjs [Nome ...]   (sem argumentos: todos)
import puppeteer from 'puppeteer-core';
import http from 'node:http';
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const ds = path.resolve(here, '../design-system');
const CHROME = process.env.CHROME_PATH || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium'].find((p) => existsSync(p));
const only = process.argv.slice(2);

// ---- categoria de cada componente (eyebrow da página) → tom do fundo
const TONS = {
  'Ações': { a: '#FFF1D9', b: '#FFD9A0' }, 'Formulários': { a: '#EEF4FB', b: '#C9DCF1' }, 'Exibição': { a: '#FAF5EC', b: '#E8DCC6' },
  'Sobreposições': { a: '#33445C', b: '#1B2735', escuro: true }, 'Feedback': { a: '#EFF8F2', b: '#C6E6D0' }, 'Navegação': { a: '#F3F2FC', b: '#D8D6F0' },
  'Módulo': { a: '#FFF3EA', b: '#FADBC4' }, 'padrao': { a: '#F7F3EC', b: '#E6DDCE' },
};
const cat = {};
for (const f of readdirSync(path.join(ds, 'site/pages'))) {
  if (!/^(componentes|modulos)__/.test(f)) continue;
  const src = readFileSync(path.join(ds, 'site/pages', f), 'utf8');
  const html = JSON.parse(src.slice('export default () => '.length, src.lastIndexOf(';')));
  const m = html.match(/doc-header__eyebrow">(.*?)<\/p>/);
  const nome = f.replace(/\.js$/, '').split('__')[1];
  const partes = (m ? m[1] : '').split('·').map((s) => s.trim());
  cat[nome] = partes[0].startsWith('Módulo') ? 'Módulo' : partes[1] || 'padrao';
}

// ---- servidor estático (os previews usam caminhos relativos)
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
const page = await browser.newPage();
const comp = await browser.newPage(); await comp.setViewport({ width: 480, height: 300, deviceScaleFactor: 2 });

const CAIXA_W = 410, CAIXA_H = 236, ESCALA_MAX = 1.5, ALTURA_MAX = 360;
const TELA = (png, t, escala, w, h, esmaece) => `<!doctype html><meta charset=utf-8><body style="margin:0"><div style="position:relative;width:480px;height:300px;overflow:hidden;background:
  radial-gradient(ellipse 62% 58% at 50% 46%,${t.escuro ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.78)'},transparent 72%),linear-gradient(145deg,${t.a},${t.b})">
  <div style="position:absolute;inset:0;background:radial-gradient(circle at 1px 1px,${t.escuro ? 'rgba(255,255,255,.16)' : 'rgba(30,42,56,.13)'} 1px,transparent 1.5px) 0 0/18px 18px;-webkit-mask-image:radial-gradient(ellipse 80% 78% at 50% 50%,#000 30%,transparent 100%)"></div>
  <img src="data:image/png;base64,${png}" style="position:absolute;left:50%;top:50%;width:${(w * escala).toFixed(1)}px;height:${(h * escala).toFixed(1)}px;transform:translate(-50%,-50%);${esmaece ? '-webkit-mask-image:linear-gradient(#000 62%,transparent 100%);' : ''}"></div>`;

let ok = 0;
const limite = (p, ms, n) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('tempo esgotado')), ms))]);
for (const n of names) {
  try { await limite((async () => {
    // largura: a da coluna do preview + o respiro da página; telas ocupam 360 e peças soltas 420
    await page.setViewport({ width: 860, height: 900, deviceScaleFactor: 3 });
    await page.goto(base + 'previews/' + n + '.html', { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready); await new Promise((r) => setTimeout(r, 350));
    const meta = await page.evaluate(() => {
      const r = document.getElementById('root'); const mw = parseInt(r.style.maxWidth) || 390;
      return { mw, tela: document.body.classList.contains('p-0'), sobre: !!document.querySelector('.bg-overlay') };
    });
    const vw = meta.tela ? 360 : meta.sobre ? 420 : 860;
    await page.setViewport({ width: vw, height: meta.sobre ? 600 : 900, deviceScaleFactor: 3 });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 250)));
    // previews que mostram só o gatilho (menu, seleção, gaveta): abre o primeiro para a miniatura mostrar o componente aberto
    const gatilho = await page.evaluate(() => {
      const aberto = document.querySelector('[role=dialog],[role=alertdialog],[role=menu],[role=listbox],[data-radix-popper-content-wrapper]');
      const g = document.querySelector('#root [aria-haspopup][aria-expanded="false"]');
      if (aberto || !g) return null; const b = g.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
    });
    if (gatilho) { await page.mouse.click(gatilho.x, gatilho.y); await new Promise((r) => setTimeout(r, 450)); await page.evaluate(() => scrollTo(0, 0)); }
    const caixa = await page.evaluate((ALTURA_MAX) => {
      const st = document.createElement('style');
      st.textContent = 'html,body{background:transparent!important;background-image:none!important}.bg-overlay{display:none!important}#root>p.caption{display:none!important}*{animation:none!important;caret-color:transparent!important}';
      document.head.appendChild(st);
      const root = document.getElementById('root');
      const kids = [...root.children].filter((k) => k.getBoundingClientRect().height > 0);
      let acc = 0, n = 0;
      for (const k of kids) {
        const h = k.getBoundingClientRect().height;
        if (n >= 3 || acc >= 200) k.style.display = 'none'; else { acc += h + 14; n++; }
      }
      // linha de exemplos: vale o espaço dos filhos, não a largura da coluna
      const cr = (e) => {
        const cs = getComputedStyle(e);
        if (e.classList.contains('flex-wrap') && cs.display.includes('flex') && e.children.length) {
          let l = 1e9, t = 1e9, r = 0, b = 0;
          for (const c of e.children) { const q = c.getBoundingClientRect(); if (!q.width && !q.height) continue; l = Math.min(l, q.left); t = Math.min(t, q.top); r = Math.max(r, q.right); b = Math.max(b, q.bottom); }
          if (r > l) return { left: l, top: t, right: r, bottom: b };
        }
        return e.getBoundingClientRect();
      };
      const visivel = (e) => e.getBoundingClientRect().height > 0;
      const dialogos = [...document.querySelectorAll('[role=dialog],[role=alertdialog]')].filter((e) => visivel(e) && !e.closest('[data-radix-popper-content-wrapper]'));
      const flutuantes = [...document.querySelectorAll('[role=menu],[role=listbox],[data-radix-popper-content-wrapper]')].filter(visivel);
      // caixas de diálogo e folhas aparecem sozinhas; popover e menu aparecem com o gatilho
      const els = dialogos.length ? dialogos : [...[...root.children].filter((k) => k.style.display !== 'none' && visivel(k)), ...flutuantes];
      // coluna larga demais deixaria o texto miúdo: tira grupos do fim até caber com folga
      const larg = () => { let a = 1e9, z = 0; for (const e of els) { const b = cr(e); a = Math.min(a, b.left); z = Math.max(z, b.right); } return z - a; };
      const vis = () => els.filter((e) => e.style.display !== 'none');
      while (vis().length > 1 && larg() > 520 && !dialogos.length) { const u = vis().filter((e) => e.parentElement === root).pop(); if (!u) break; u.style.display = 'none'; els.splice(els.indexOf(u), 1); }
      let x0 = 1e9, y0 = 1e9, x1 = 0, y1 = 0;
      for (const e of els) { const b = cr(e); x0 = Math.min(x0, b.left); y0 = Math.min(y0, b.top); x1 = Math.max(x1, b.right); y1 = Math.max(y1, b.bottom); }
      return { x0, y0, x1, y1 };
    }, ALTURA_MAX);
    const S = 34;
    const x = Math.max(0, caixa.x0 - S), y = Math.max(0, caixa.y0 - S);
    const w = Math.min(vw - x, caixa.x1 - caixa.x0 + 2 * S), hTotal = caixa.y1 - caixa.y0 + 2 * S;
    const amax = meta.tela ? 250 : ALTURA_MAX; // telas: só o topo, em tamanho legível, com a base esmaecida
    const esmaece = hTotal - 2 * S > amax;
    const h = Math.min(hTotal, amax + 2 * S);
    const png = await page.screenshot({ type: 'png', omitBackground: true, encoding: 'base64', clip: { x, y, width: w, height: h } });
    const escala = Math.min(CAIXA_W / (w - 2 * S), CAIXA_H / (h - 2 * S), ESCALA_MAX);
    await comp.setContent(TELA(png, TONS[cat[n] || (meta.tela ? 'Módulo' : 'padrao')] || TONS.padrao, escala, w, h, esmaece), { waitUntil: 'load' });
    await comp.screenshot({ path: path.join(ds, 'assets/thumbs', n + '.jpg'), type: 'jpeg', quality: 88 });
    ok++;
  })(), 30000, n); } catch (e) { console.log('falhou', n, e.message); }
}
await browser.close(); srv.close();
console.log('thumbs', ok, '/', names.length);
