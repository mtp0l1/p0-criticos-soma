// Gera design-system/assets/thumbs/<Nome>.jpg (720x450) a partir de cada previews/<Nome>.html com o bundle atual.
// Uso: node thumbs.mjs [Nome ...]   (sem argumentos: todos)
import puppeteer from 'puppeteer-core';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const ds = path.resolve(here, '../design-system');
const only = process.argv.slice(2);
const names = readdirSync(path.join(ds, 'previews')).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5)).filter((n) => !only.length || only.includes(n));
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const page = await browser.newPage();
await page.setViewport({ width: 720, height: 450, deviceScaleFactor: 1 });
let ok = 0;
for (const n of names) {
  try {
    await page.goto(pathToFileURL(path.join(ds, 'previews', n + '.html')).href, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 350));
    await page.screenshot({ path: path.join(ds, 'assets/thumbs', n + '.jpg'), type: 'jpeg', quality: 84, clip: { x: 0, y: 0, width: 720, height: 450 } });
    ok++;
  } catch (e) { console.log('falhou', n, e.message); }
}
await browser.close();
console.log('thumbs', ok, '/', names.length);
