/* Menu (dropdown) posicionado a partir de um botão. createMenu(button, { label, options, value, onChange, sectionColumns, wrapColumns, maxRows }) */
import { icon } from '../icons.js';
const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
let uid = 0;

export function createMenu(trigger, { label, options, value = null, onChange, sectionColumns = false, wrapColumns = false, maxRows = 0 }) {
  const id = `ds-menu-${++uid}`;
  const menu = document.createElement('div');
  menu.className = 'ds-menu';
  menu.id = id;
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-label', label ?? '');
  const item = (o) => `<button type="button" class="ds-menu__item" role="menuitemradio" data-value="${escape(o.value)}" aria-checked="${o.value === value}">${o.icon ? icon(o.icon, { size: 18 }) : ''}<span class="ds-menu__text">${escape(o.label)}</span>${icon('check', { size: 16, className: 'ds-menu__check' })}</button>`;
  const group = (o) => `<div class="ds-menu__group" role="presentation">${escape(o.label)}</div>`;
  const real = options.filter((o) => o.type !== 'group');
  if (sectionColumns || wrapColumns) {
    const sections = [];
    for (const o of options) { if (o.type === 'group') sections.push({ label: o.label, items: [] }); else (sections.at(-1) ?? sections[sections.push({ label: '', items: [] }) - 1]).items.push(o); }
    menu.classList.add('ds-menu--columns');
    menu.innerHTML = `<div class="ds-menu__sections${wrapColumns ? ' ds-menu__sections--wrap' : ''}">${sections.map((s) => `<div class="ds-menu__section">${s.label ? group({ label: s.label }) : ''}${s.items.map(item).join('')}</div>`).join('')}</div>`;
  } else if (maxRows && real.length > maxRows) {
    menu.classList.add('ds-menu--columns');
    menu.style.setProperty('--_rows', maxRows);
    menu.innerHTML = `<div class="ds-menu__grid">${real.map(item).join('')}</div>`;
  } else menu.innerHTML = options.map((o) => (o.type === 'group' ? group(o) : item(o))).join('');
  document.body.append(menu);
  trigger.setAttribute('aria-haspopup', 'menu');
  trigger.setAttribute('aria-controls', id);
  trigger.setAttribute('aria-expanded', 'false');

  const items = () => [...menu.querySelectorAll('.ds-menu__item')];
  const isOpen = () => menu.hasAttribute('data-open');
  function position() {
    const r = trigger.getBoundingClientRect();
    const w = menu.offsetWidth, h = menu.offsetHeight;
    const left = Math.max(8, Math.min(r.left, innerWidth - w - 8));
    let top = r.bottom + 8;
    if (top + h > innerHeight - 8) top = Math.max(8, r.top - h - 8);
    menu.style.transform = '';
    menu.style.left = `${left}px`; menu.style.top = `${top}px`;
  }
  function open() {
    if (isOpen()) return;
    position();
    menu.setAttribute('data-open', '');
    trigger.setAttribute('aria-expanded', 'true');
    (items().find((i) => i.getAttribute('aria-checked') === 'true') ?? items()[0])?.focus({ preventScroll: true });
    document.addEventListener('pointerdown', outside, true);
    addEventListener('resize', close);
  }
  function close(returnFocus = false) {
    if (!isOpen()) return;
    menu.removeAttribute('data-open');
    trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', outside, true);
    removeEventListener('resize', close);
    if (returnFocus === true) trigger.focus();
  }
  const outside = (e) => { if (!menu.contains(e.target) && !trigger.contains(e.target)) close(); };
  function setValue(v) { value = v; items().forEach((i) => i.setAttribute('aria-checked', String(i.dataset.value === v))); }
  const onTrigger = () => (isOpen() ? close() : open());
  const onTriggerKey = (e) => { if (e.key === 'ArrowDown' && !isOpen()) { e.preventDefault(); open(); } };
  trigger.addEventListener('click', onTrigger);
  trigger.addEventListener('keydown', onTriggerKey);
  menu.addEventListener('click', (e) => { const b = e.target.closest('.ds-menu__item'); if (!b) return; close(); onChange?.(b.dataset.value); });
  menu.addEventListener('keydown', (e) => {
    const list = items(), i = list.indexOf(document.activeElement);
    if (e.key === 'Escape') { e.preventDefault(); close(true); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1) % list.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); list[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); list.at(-1).focus(); }
    else if (e.key === 'Tab') close();
  });
  return { open, close, setValue, destroy() { close(); trigger.removeEventListener('click', onTrigger); trigger.removeEventListener('keydown', onTriggerKey); trigger.removeAttribute('aria-controls'); menu.remove(); } };
}
