/* Paleta de comandos (⌘K / Ctrl K / "/"). Padrão ARIA: combobox + listbox. (Lume, MIT) */
import { icon } from '../icons.js';
import { msg } from './i18n.js';

const normalize = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const isTyping = (el) => el?.closest?.('input, textarea, select, [contenteditable="true"]');
const isMac = navigator.platform.includes('Mac');

export function scoreCommand(item, query) {
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return 0;
  const full = words.join(' ');
  const label = normalize(item.label);
  const haystack = `${label} ${normalize(item.group)} ${normalize(item.description)} ${normalize((item.keywords ?? []).join(' '))}`;
  if (!words.every((w) => haystack.includes(w))) return -1;
  return label.startsWith(full) ? 3 : label.includes(full) ? 2 : 1;
}
export function filterCommands(items, query) {
  if (!normalize(query).trim()) return items;
  return items.map((item) => ({ item, score: scoreCommand(item, query) })).filter((r) => r.score > 0).sort((a, b) => b.score - a.score).map((r) => r.item);
}

export function createCommandPalette({ items, hotkeys = true }) {
  const dialog = document.createElement('dialog');
  dialog.className = 'ds-command';
  dialog.innerHTML = `
<div class="ds-command__search">${icon('search', { size: 20 })}
<input class="ds-command__input" type="text" role="combobox" aria-expanded="true" aria-controls="ds-command-list" aria-autocomplete="list" autocomplete="off" spellcheck="false">
<kbd class="ds-kbd">Esc</kbd></div>
<div class="ds-command__list" id="ds-command-list" role="listbox"></div>
<footer class="ds-command__footer" aria-hidden="true">
<span><kbd class="ds-kbd">↑</kbd><kbd class="ds-kbd">↓</kbd> ${msg('palette.navigate')}</span>
<span><kbd class="ds-kbd">↵</kbd> ${msg('palette.open')}</span>
<span><kbd class="ds-kbd">Esc</kbd> ${msg('palette.close')}</span></footer>`;
  document.body.append(dialog);
  const input = dialog.querySelector('.ds-command__input');
  const list = dialog.querySelector('.ds-command__list');
  dialog.setAttribute('aria-label', msg('palette.label'));
  input.setAttribute('aria-label', msg('palette.label'));
  input.placeholder = msg('palette.placeholder');
  list.setAttribute('aria-label', msg('palette.results'));
  let results = [], active = 0, returnFocus = null;

  function render() {
    const found = filterCommands(typeof items === 'function' ? items(input.value) : items, input.value).slice(0, 80);
    const groups = new Map();
    for (const item of found) { if (!groups.has(item.group)) groups.set(item.group, []); groups.get(item.group).push(item); }
    results = [...groups.values()].flat();
    active = Math.min(active, Math.max(results.length - 1, 0));
    if (!results.length) { list.innerHTML = `<p class="ds-command__empty">${escape(msg('palette.empty', input.value))}</p>`; input.removeAttribute('aria-activedescendant'); return; }
    let index = 0;
    list.innerHTML = [...groups].map(([group, entries], g) => {
      const options = entries.map((item) => {
        const i = index++;
        return `<div class="ds-command__item" role="option" id="ds-command-option-${i}" data-index="${i}" aria-selected="false">
${item.swatch ? `<span class="ds-command__swatch" style="background:${escape(item.swatch)}"></span>` : icon(item.icon ?? 'arrow-right', { size: 18 })}
<span class="ds-command__label">${escape(item.label)}</span>${item.hint ? `<span class="ds-command__hint">${escape(item.hint)}</span>` : ''}
${icon('corner-down-left', { size: 16, className: 'ds-command__enter' })}</div>`;
      }).join('');
      return `<div class="ds-command__group" role="group" aria-labelledby="ds-command-group-${g}"><div class="ds-command__group-label" id="ds-command-group-${g}">${escape(group)}</div>${options}</div>`;
    }).join('');
    highlight(true);
  }
  function highlight(scroll) {
    list.querySelectorAll('[role="option"]').forEach((el) => el.setAttribute('aria-selected', String(Number(el.dataset.index) === active)));
    const el = list.querySelector(`[data-index="${active}"]`);
    if (!el) return;
    input.setAttribute('aria-activedescendant', el.id);
    if (scroll) el.scrollIntoView({ block: 'nearest' });
  }
  function open() { if (dialog.open) return; returnFocus = document.activeElement; input.value = ''; active = 0; render(); dialog.showModal(); input.focus(); }
  function close() { if (dialog.open) dialog.close(); }
  function run(item) { if (!item) return; returnFocus = null; close(); item.perform(); }
  input.addEventListener('input', () => { active = 0; render(); });
  input.addEventListener('keydown', (e) => {
    const n = results.length;
    if (!n) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); active = (active + (e.key === 'ArrowDown' ? 1 : -1) + n) % n; highlight(true); }
    else if (e.key === 'Enter') { e.preventDefault(); run(results[active]); }
  });
  list.addEventListener('click', (e) => { const o = e.target.closest('[role="option"]'); if (o) run(results[Number(o.dataset.index)]); });
  list.addEventListener('pointermove', (e) => { const o = e.target.closest('[role="option"]'); if (o && Number(o.dataset.index) !== active) { active = Number(o.dataset.index); highlight(false); } });
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
  dialog.addEventListener('close', () => { returnFocus?.focus?.({ preventScroll: true }); returnFocus = null; });
  const onKey = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); dialog.open ? close() : open(); }
    else if (e.key === '/' && !dialog.open && !isTyping(e.target)) { e.preventDefault(); open(); }
  };
  if (hotkeys) document.addEventListener('keydown', onKey);
  return { open, close, destroy() { document.removeEventListener('keydown', onKey); close(); dialog.remove(); }, isOpen: () => dialog.open, modifierLabel: isMac ? '⌘' : 'Ctrl' };
}
