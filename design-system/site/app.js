/* So+ma Design System · app da documentação: roteador por hash, shell, busca ⌘K, tema e layout.
   Arquitetura e interface adaptadas do Lume Design System (MIT, https://lumeui.dev); fonte e conteúdo são da So+ma. */
import { icon } from '../ds/icons.js';
import { initTheme, mountThemeControls, toggleTheme, resolvedTheme } from '../ds/js/theme.js';
import { createShell, renderSidebarNav, setActiveNavItem, renderNavbarNav } from '../ds/js/shell.js';
import { createCommandPalette } from '../ds/js/command-palette.js';
import { createMenu } from '../ds/js/menu.js';
import { initTooltips } from '../ds/js/tooltip.js';
import { toast } from '../ds/js/toast.js';
import { navigation } from './nav.js';
import { CURRENT_VERSION, UPDATED } from './changelog.js';
import { EXTRA } from './search-index.js';

const KIND_ICON = { Cor: 'palette', Ícone: 'smile', Ilustração: 'image', Texto: 'type', Medida: 'ruler', Guia: 'book-open', Novidade: 'sparkles', Roadmap: 'milestone', Arquivos: 'download' };
const SEEN_KEY = 'soma-ds-seen-version';
const read = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

initTheme();
initTooltips();

const root = document.getElementById('shell');
const content = document.getElementById('content');
const scroller = root.querySelector('.ds-main__scroll');
const main = root.querySelector('.ds-main');
const navEl = document.getElementById('nav');

/* ───────── Navegação ───────── */
const seen = read(SEEN_KEY) === CURRENT_VERSION;
const groups = navigation.map((g) => ({ ...g, items: g.items.map((i) => ({ ...i, href: `#${i.path}`, dot: i.dot && !seen })) }));
const flat = groups.flatMap((g) => g.items.map((i) => ({ ...i, group: g.label, groupId: g.id })));
const byPath = new Map(flat.map((i) => [i.path, i]));

renderSidebarNav(navEl, groups);
const shell = createShell(root);
const go = (href) => { location.hash = href.startsWith('#') ? href : `#${href}`; };
const navbar = renderNavbarNav(document.getElementById('navbar-nav'), groups, { createMenu, go });

/* ───────── Busca (⌘K) ───────── */
const toggleThemeAction = () => toggleTheme();
const palette = createCommandPalette({
  items: (query) => {
    const pages = flat.map((i) => ({ id: i.path, label: i.label, group: i.group || 'Navegação', icon: i.icon, description: i.description, keywords: [i.section, i.path], hint: i.section || '', perform: () => go(i.href) }));
    const actions = [
      { id: 'theme', label: resolvedTheme() === 'dark' ? 'Usar tema claro' : 'Usar tema escuro', group: 'Ações', icon: resolvedTheme() === 'dark' ? 'sun' : 'moon', keywords: ['tema', 'escuro', 'claro', 'dark', 'light'], perform: toggleThemeAction },
      { id: 'sidebar', label: shell.isCollapsed() ? 'Expandir menu lateral' : 'Recolher menu lateral', group: 'Ações', icon: 'panel-left', keywords: ['sidebar', 'menu', 'lateral'], perform: () => shell.toggle() },
      { id: 'layout', label: shell.layout() === 'sidebar' ? 'Usar layout com barra superior' : 'Usar layout com menu lateral', group: 'Ações', icon: shell.layout() === 'sidebar' ? 'panel-top' : 'panel-left', keywords: ['layout', 'navbar', 'sidebar', 'barra'], perform: () => shell.setLayout(shell.layout() === 'sidebar' ? 'navbar' : 'sidebar') },
    ];
    const extra = query.trim().length >= 2 ? EXTRA.map(([label, kind, path, hint, swatch]) => ({ id: `${kind}:${label}`, label, group: kind, icon: KIND_ICON[kind] ?? 'search', swatch, hint, keywords: [hint], perform: () => go(`${path}?q=${encodeURIComponent(label)}`) })) : [];
    return query.trim() ? [...pages, ...extra, ...actions] : [...pages.slice(0, 4), ...actions, ...pages.slice(4)];
  },
});
document.querySelectorAll('[data-palette-open]').forEach((b) => {
  b.addEventListener('click', () => palette.open());
  b.querySelectorAll('[data-mod]').forEach((k) => (k.textContent = palette.modifierLabel));
});
mountThemeControls(document);

/* ───────── Voltar ao topo ───────── */
const toTop = document.createElement('button');
toTop.type = 'button';
toTop.className = 'ds-back-to-top';
toTop.setAttribute('aria-label', 'Voltar ao topo');
toTop.innerHTML = icon('arrow-up', { size: 20 });
main.append(toTop);
toTop.addEventListener('click', () => scroller.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
scroller.addEventListener('scroll', () => toTop.toggleAttribute('data-visible', scroller.scrollTop > 480), { passive: true });

/* ───────── Páginas ───────── */
let cleanup = [];
let token = 0;
const parse = () => {
  const [p, q = ''] = (location.hash.slice(1) || '/').split('?');
  return { path: decodeURI(p).replace(/\/+$/, '') || '/', query: new URLSearchParams(q) };
};

function crumbs(page) {
  const el = document.getElementById('crumbs');
  const first = flat.find((i) => i.groupId === page.groupId);
  el.innerHTML = page.groupId && page.groupId !== 'main'
    ? `<li><a href="${esc(first.href)}">${esc(page.group)}</a></li><li aria-current="page">${esc(page.label)}</li>`
    : `<li aria-current="page">${esc(page.label)}</li>`;
}

async function render() {
  const my = ++token;
  const { path, query } = parse();
  const page = byPath.get(path) ?? { path, label: 'Página não encontrada', group: '', groupId: 'main', description: '', load: null };
  cleanup.forEach((fn) => fn?.());
  cleanup = [];
  document.title = path === '/' ? 'So+ma Design System' : `${page.label} · So+ma Design System`;
  setActiveNavItem(navEl, `#${path}`);
  navbar.setActive(`#${path}`);
  crumbs(page);
  shell.closeMobile();
  let mod = null;
  if (page.load) { try { mod = await page.load(); } catch (e) { console.error(e); } }
  if (my !== token) return;
  content.innerHTML = mod
    ? mod.default(page)
    : `<div class="page page--panel"><header class="doc-header"><div><p class="doc-header__eyebrow">404</p><h1 class="doc-header__title">Página não encontrada</h1><p class="doc-header__lead">Esse endereço não existe. Use a busca (<kbd class="ds-kbd">⌘ K</kbd>) ou volte ao <a href="#/">início</a>.</p></div></header></div>`;
  scroller.scrollTo({ top: 0 });
  main.removeAttribute('data-scrolled');
  enhance(content, page, query, cleanup);
  mod?.mount?.(content, page, query)?.call?.(null);
  if (path === '/novidades') { write(SEEN_KEY, CURRENT_VERSION); document.querySelectorAll('.ds-dot[aria-label="Novidade"]').forEach((d) => d.remove()); }
  content.focus({ preventScroll: true });
}
addEventListener('hashchange', render);

/* ───────── Recursos de conteúdo (delegação) ───────── */
const norm = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

async function copy(text, label) {
  try { await navigator.clipboard.writeText(text); toast(`${label ?? 'Copiado'}: ${text.length > 40 ? text.slice(0, 40) + '…' : text}`); }
  catch { toast('Não deu para copiar. Selecione o texto e copie.'); }
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (a && !a.getAttribute('href').startsWith('#/') && a.getAttribute('href').length > 1) {
    const t = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
    e.preventDefault();
    t?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    return;
  }
  const c = e.target.closest('[data-copy]');
  if (c) return copy(c.dataset.copy, 'Copiado');
  const b = e.target.closest('[data-copy-code]');
  if (b) return copy(b.closest('.ds-code-block').querySelector('pre').textContent.replace(/\n$/, ''), 'Código copiado');
  const n = e.target.closest('.doc-nav__link');
  if (n) { const t = document.getElementById(n.dataset.target); t?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); }
  const w = e.target.closest('[data-w]');
  if (w) {
    const stage = w.closest('.stage');
    stage.querySelectorAll('[data-w]').forEach((x) => x.setAttribute('aria-pressed', String(x === w)));
    stage.classList.toggle('phone', w.dataset.w === 'phone');
  }
  const chip = e.target.closest('[data-layer]');
  if (chip) {
    chip.parentElement.querySelectorAll('[data-layer]').forEach((x) => x.setAttribute('aria-pressed', String(x === chip)));
    applyFilter(chip.closest('[data-filterable]'));
  }
});
addEventListener('message', (e) => {
  if (e.data?.soma !== 'h') return;
  const f = [...document.querySelectorAll('iframe[data-n]')].find((x) => x.dataset.n === e.data.n);
  if (f) f.style.height = `${Math.max(120, Math.ceil(e.data.h))}px`;
});

function applyFilter(scope) {
  if (!scope) return;
  const q = norm(scope.querySelector('[data-filter]')?.value ?? '').trim();
  const layer = scope.querySelector('[data-layer][aria-pressed="true"]')?.dataset.layer ?? '';
  let any = false;
  scope.querySelectorAll('[data-group]').forEach((sec) => {
    const inLayer = !layer || sec.dataset.group === layer;
    let n = 0;
    sec.querySelectorAll('[data-q]').forEach((it) => { const ok = inLayer && (!q || norm(it.dataset.q).includes(q)); it.hidden = !ok; if (ok) n++; });
    sec.hidden = !n; any ||= n > 0;
  });
  scope.querySelector('.empty')?.toggleAttribute('hidden', any);
}

function enhance(rootEl, page, query, cleanups) {
  /* doc-nav: marca a seção visível */
  const links = [...rootEl.querySelectorAll('.doc-nav__link')];
  if (links.length) {
    const sections = links.map((l) => document.getElementById(l.dataset.target)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((en) => en.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      links.forEach((l) => l.removeAttribute('aria-current'));
      links.find((l) => l.dataset.target === visible.target.id)?.setAttribute('aria-current', 'true');
    }, { root: scroller, rootMargin: '-110px 0px -65% 0px' });
    sections.forEach((s) => io.observe(s));
    links[0].setAttribute('aria-current', 'true');
    cleanups.push(() => io.disconnect());
  }
  /* filtros (cores e ícones) */
  rootEl.querySelectorAll('[data-filterable]').forEach((scope) => {
    const input = scope.querySelector('[data-filter]');
    input?.addEventListener('input', () => applyFilter(scope));
    const q = query.get('q');
    if (q && input) { input.value = q; }
    applyFilter(scope);
    if (q) requestAnimationFrame(() => scope.querySelector('[data-q]:not([hidden])')?.scrollIntoView({ block: 'center' }));
  });
}

/* ───────── Início ───────── */
document.getElementById('account-version').textContent = `Versão ${CURRENT_VERSION}`;
document.getElementById('account-updated').textContent = `Atualizado em ${UPDATED}`;
if (!location.hash) history.replaceState(null, '', '#/');
render();
