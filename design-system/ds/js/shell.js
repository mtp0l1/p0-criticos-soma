/* Comportamento do app shell: sidebar recolhível, gaveta no celular, grupos, item ativo, layout sidebar|navbar. (Lume, MIT) */
import { icon } from '../icons.js';
import { msg } from './i18n.js';

const SIDEBAR_KEY = 'soma-ds-sidebar', LAYOUT_KEY = 'soma-ds-layout', GROUPS_KEY = 'soma-ds-nav-groups';
export const LAYOUTS = ['sidebar', 'navbar'];
const mobileQuery = matchMedia('(max-width: 1023.98px)');
const store = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} },
};
const isTyping = (el) => el?.closest?.('input, textarea, select, [contenteditable="true"]');

export function createShell(root, { persist = true } = {}) {
  const save = (k, v) => persist && store.set(k, v);
  const startLayout = persist ? store.get(LAYOUT_KEY, root.dataset.layout) : root.dataset.layout;
  root.dataset.layout = LAYOUTS.includes(startLayout) ? startLayout : 'sidebar';
  const sidebar = root.querySelector('.ds-sidebar');
  const scrim = root.querySelector('[data-shell-scrim]');
  const main = root.querySelector('.ds-main');
  const scroller = root.querySelector('.ds-main__scroll');
  const toggles = [...root.querySelectorAll('[data-shell-toggle]')];
  root.dataset.sidebar = persist ? store.get(SIDEBAR_KEY, 'expanded') : 'expanded';
  root.dataset.mobileOpen = 'false';

  const isMobile = () => mobileQuery.matches;
  const isCollapsed = () => root.dataset.sidebar === 'collapsed';
  const isMobileOpen = () => root.dataset.mobileOpen === 'true';

  function sync() {
    const mobile = isMobile();
    const expanded = mobile ? isMobileOpen() : !isCollapsed();
    const label = msg(mobile ? (expanded ? 'shell.closeMenu' : 'shell.openMenu') : expanded ? 'shell.collapse' : 'shell.expand');
    for (const btn of toggles) {
      btn.setAttribute('aria-expanded', String(expanded));
      btn.setAttribute('aria-label', label);
      btn.dataset.dsTooltip = label;
      if (!mobile) btn.dataset.dsTooltipKbd = navigator.platform.includes('Mac') ? '⌘B' : 'Ctrl B';
    }
    sidebar.dataset.dsTooltips = !mobile && isCollapsed() ? 'on' : 'off';
    root.querySelectorAll('.ds-nav-group__header').forEach((h) => (h.tabIndex = !mobile && isCollapsed() ? -1 : 0));
    root.dispatchEvent(new CustomEvent('ds:shellchange', { detail: { sidebar: root.dataset.sidebar, layout: root.dataset.layout, mobile, mobileOpen: isMobileOpen() } }));
  }
  function setCollapsed(c) { root.dataset.sidebar = c ? 'collapsed' : 'expanded'; save(SIDEBAR_KEY, root.dataset.sidebar); sync(); }
  function setMobileOpen(open) {
    if (open === isMobileOpen()) return;
    root.dataset.mobileOpen = String(open);
    sync();
    if (open) (sidebar.querySelector('[aria-current="page"]') ?? sidebar.querySelector('a, button'))?.focus({ preventScroll: true });
  }
  function toggle() { isMobile() ? setMobileOpen(!isMobileOpen()) : setCollapsed(!isCollapsed()); }

  toggles.forEach((b) => b.addEventListener('click', toggle));
  scrim?.addEventListener('click', () => setMobileOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMobile() && isMobileOpen()) { setMobileOpen(false); root.querySelector('.ds-topbar [data-shell-toggle]')?.focus(); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b' && !isTyping(e.target)) { e.preventDefault(); toggle(); }
  });
  mobileQuery.addEventListener('change', () => { root.dataset.mobileOpen = 'false'; sync(); });
  scroller?.addEventListener('scroll', () => main.toggleAttribute('data-scrolled', scroller.scrollTop > 4), { passive: true });

  root.addEventListener('click', (e) => {
    const header = e.target.closest('.ds-nav-group__header');
    if (!header) return;
    const group = header.closest('.ds-nav-group');
    const open = group.dataset.open !== 'true';
    group.dataset.open = String(open);
    header.setAttribute('aria-expanded', String(open));
    const state = store.get(GROUPS_KEY, {});
    state[group.dataset.group] = open;
    save(GROUPS_KEY, state);
  });

  const layoutOptions = () => [...root.querySelectorAll('[data-layout-option]')];
  function syncLayout() {
    for (const btn of layoutOptions()) {
      const on = btn.dataset.layoutOption === root.dataset.layout;
      btn.setAttribute('aria-checked', String(on));
      btn.tabIndex = on ? 0 : -1;
    }
  }
  function setLayout(next) {
    if (!LAYOUTS.includes(next) || next === root.dataset.layout) return;
    root.dataset.layout = next; save(LAYOUT_KEY, next); syncLayout(); sync();
  }
  root.addEventListener('click', (e) => { const b = e.target.closest('[data-layout-option]'); if (b) setLayout(b.dataset.layoutOption); });
  root.addEventListener('keydown', (e) => {
    const options = layoutOptions();
    const index = options.indexOf(document.activeElement);
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (index < 0 || !delta) return;
    e.preventDefault();
    const next = options[(index + delta + options.length) % options.length];
    next.focus(); setLayout(next.dataset.layoutOption);
  });
  syncLayout();
  sync();
  requestAnimationFrame(() => requestAnimationFrame(() => root.setAttribute('data-ready', '')));

  return { toggle, setCollapsed, setLayout, layout: () => root.dataset.layout, setMobileOpen, closeMobile: () => setMobileOpen(false), isCollapsed, isMobile, isMobileOpen, scrollToTop: () => scroller?.scrollTo({ top: 0 }) };
}

const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
function navItem(item, large) {
  return `<li><a class="ds-nav-item${large ? ' ds-nav-item--lg' : ''}" href="${escape(item.href)}" data-ds-tooltip="${escape(item.label)}" data-ds-tooltip-placement="right">
${icon(item.icon, { size: 20 })}<span class="ds-nav-item__label">${escape(item.label)}</span>${item.dot ? '<span class="ds-dot" aria-label="Novidade"></span>' : ''}</a></li>`;
}
/** groups: [{ id, label?, items: [{ label, icon, href, dot?, section? }] }]; o grupo sem label vira a navegação principal. */
export function renderSidebarNav(container, groups) {
  const openState = store.get(GROUPS_KEY, {});
  container.innerHTML = groups.map((group) => {
    if (!group.label) return `<ul class="ds-nav-list" role="list">${group.items.map((i) => navItem(i, true)).join('')}</ul><hr class="ds-divider ds-divider--fade ds-sidebar__divider">`;
    const open = openState[group.id] ?? (group.id !== 'componentes');
    const id = `nav-group-${group.id}`;
    return `<section class="ds-nav-group" data-group="${group.id}" data-open="${open}">
<button type="button" class="ds-nav-group__header" aria-expanded="${open}" aria-controls="${id}"><span class="ds-nav-group__label">${escape(group.label)}</span><span class="ds-nav-group__toggle" aria-hidden="true">${icon('chevron-down', { size: 16 })}</span></button>
<div class="ds-nav-group__items" id="${id}"><ul class="ds-nav-list" role="list">${group.items.map((i, n) => (i.section && i.section !== group.items[n - 1]?.section ? `<li class="ds-nav-section" aria-hidden="true">${escape(i.section)}</li>` : '') + navItem(i, false)).join('')}</ul></div></section>`;
  }).join('');
}
export function setActiveNavItem(container, href) {
  container.querySelectorAll('.ds-nav-item').forEach((a) => (a.getAttribute('href') === href ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
  const active = container.querySelector('[aria-current="page"]');
  const group = active?.closest('.ds-nav-group');
  if (group && group.dataset.open === 'false') { group.dataset.open = 'true'; group.querySelector('.ds-nav-group__header')?.setAttribute('aria-expanded', 'true'); }
  if (!active) return;
  const list = container.closest('.ds-sidebar__nav') ?? container;
  const a = active.getBoundingClientRect(), l = list.getBoundingClientRect();
  if (a.top < l.top) list.scrollTop += a.top - l.top - 8;
  else if (a.bottom > l.bottom) list.scrollTop += a.bottom - l.bottom + 8;
}

/** Navbar: o grupo sem label vira links; cada grupo com label vira um botão que abre um menu. O que não couber vai para "Mais". */
export function renderNavbarNav(container, groups, { createMenu, go }) {
  container.innerHTML = groups.map((g) => g.label
    ? `<button type="button" class="ds-navbar__item" data-navbar-group="${escape(g.id)}"><span>${escape(g.label)}</span><span class="ds-navbar__chevron" aria-hidden="true">${icon('chevron-down', { size: 16 })}</span></button>`
    : g.items.filter((i) => i.href !== '#/').map((i) => `<a class="ds-navbar__item" href="${escape(i.href)}"><span>${escape(i.label)}</span>${i.dot ? '<span class="ds-dot" aria-label="Novidade"></span>' : ''}</a>`).join('')).join('');
  container.insertAdjacentHTML('beforeend', `<button type="button" class="ds-navbar__item" data-navbar-more hidden><span>${escape(msg('shell.more'))}</span><span class="ds-navbar__chevron" aria-hidden="true">${icon('chevron-down', { size: 16 })}</span></button>`);
  const groupOptions = (g) => g.items.flatMap((i, n) => [...(i.section && i.section !== g.items[n - 1]?.section ? [{ type: 'group', label: i.section }] : []), { value: i.href, label: i.label, icon: i.icon }]);
  const menus = groups.filter((g) => g.label).map((group) => {
    const button = container.querySelector(`[data-navbar-group="${group.id}"]`);
    const sections = new Set(group.items.map((i) => i.section).filter(Boolean)).size;
    return { group, button, menu: createMenu(button, { label: group.label, options: groupOptions(group), ...(sections > 6 ? { wrapColumns: true } : sections ? { sectionColumns: true } : { maxRows: 5 }), value: null, onChange: go }) };
  });
  const bar = container.closest('.ds-navbar');
  const more = container.querySelector('[data-navbar-more]');
  const entries = [...container.children].filter((el) => el !== more);
  let moreMenu = null, overflowKey = '', activeHref = null;
  const overflowOptions = (hidden) => hidden.flatMap((el) => {
    if (el.tagName === 'A') return [{ value: el.getAttribute('href'), label: el.querySelector('span').textContent }];
    const g = groups.find((x) => x.id === el.dataset.navbarGroup);
    return [{ type: 'group', label: g.label }, ...g.items.slice(0, 12).map((i) => ({ value: i.href, label: i.label, icon: i.icon }))];
  });
  function syncMoreCurrent() {
    const hidden = entries.filter((el) => el.hidden);
    const here = hidden.some((el) => (el.tagName === 'A' ? el.getAttribute('href') === activeHref : groups.find((g) => g.id === el.dataset.navbarGroup)?.items.some((i) => i.href === activeHref)));
    more.toggleAttribute('data-current', here);
    moreMenu?.setValue?.(here ? activeHref : null);
  }
  function renderMore(hidden) {
    const key = hidden.map((el) => el.dataset.navbarGroup ?? el.getAttribute('href')).join('|');
    if (key === overflowKey) return;
    overflowKey = key;
    moreMenu?.destroy();
    moreMenu = hidden.length ? createMenu(more, { label: msg('shell.more'), options: overflowOptions(hidden), sectionColumns: true, value: null, onChange: go }) : null;
    syncMoreCurrent();
  }
  function fit() {
    if (!bar?.offsetWidth) return;
    const overflowing = () => container.scrollWidth > container.clientWidth + 1;
    entries.forEach((el) => (el.hidden = false));
    more.hidden = true;
    bar.removeAttribute('data-compact');
    if (overflowing()) {
      bar.setAttribute('data-compact', '');
      if (overflowing()) { more.hidden = false; for (let i = entries.length - 1; i >= 0 && overflowing(); i--) entries[i].hidden = true; }
    }
    renderMore(entries.filter((el) => el.hidden));
  }
  const observer = bar && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null;
  if (bar) observer?.observe(bar);
  fit();
  document.fonts?.ready.then(fit);
  return {
    setActive(href) {
      activeHref = href;
      container.querySelectorAll('a.ds-navbar__item').forEach((a) => (a.getAttribute('href') === href ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
      for (const { group, button, menu } of menus) {
        const here = group.items.some((i) => i.href === href);
        button.toggleAttribute('data-current', here);
        menu.setValue?.(here ? href : null);
      }
      syncMoreCurrent();
    },
    destroy() { observer?.disconnect(); moreMenu?.destroy(); menus.forEach(({ menu }) => menu.destroy()); },
  };
}
