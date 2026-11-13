/* Dica: qualquer elemento com data-ds-tooltip (e data-ds-tooltip-placement, data-ds-tooltip-kbd). Também no foco do teclado. */
let tip, timer, current;
function ensure() {
  if (tip) return tip;
  tip = document.createElement('div');
  tip.className = 'ds-tooltip';
  tip.setAttribute('role', 'tooltip');
  tip.id = 'ds-tooltip';
  document.body.append(tip);
  return tip;
}
function target(el) {
  const host = el?.closest?.('[data-ds-tooltip]');
  if (!host) return null;
  const sidebar = host.closest('.ds-sidebar');
  if (sidebar && sidebar.dataset.dsTooltips === 'off' && host.classList.contains('ds-nav-item')) return null;
  return host;
}
function show(host) {
  const t = ensure();
  current = host;
  const kbd = host.dataset.dsTooltipKbd;
  t.innerHTML = `${host.dataset.dsTooltip.replace(/</g, '&lt;')}${kbd ? ` <kbd class="ds-kbd">${kbd}</kbd>` : ''}`;
  host.setAttribute('aria-describedby', 'ds-tooltip');
  const r = host.getBoundingClientRect();
  t.setAttribute('data-open', '');
  const w = t.offsetWidth, h = t.offsetHeight;
  const place = host.dataset.dsTooltipPlacement ?? 'bottom';
  let left = r.left + r.width / 2 - w / 2, top = r.bottom + 8;
  if (place === 'right') { left = r.right + 10; top = r.top + r.height / 2 - h / 2; }
  else if (place === 'top') top = r.top - h - 8;
  t.style.left = `${Math.max(8, Math.min(left, innerWidth - w - 8))}px`;
  t.style.top = `${Math.max(8, Math.min(top, innerHeight - h - 8))}px`;
}
function hide() {
  clearTimeout(timer);
  tip?.removeAttribute('data-open');
  current?.removeAttribute('aria-describedby');
  current = null;
}
export function initTooltips() {
  document.addEventListener('pointerover', (e) => { if (e.pointerType === 'touch') return; const h = target(e.target); if (!h || h === current) return; clearTimeout(timer); timer = setTimeout(() => show(h), 350); });
  document.addEventListener('pointerout', (e) => { if (target(e.target)) hide(); });
  document.addEventListener('focusin', (e) => { const h = target(e.target); if (h && e.target.matches?.(':focus-visible')) show(h); });
  document.addEventListener('focusout', hide);
  document.addEventListener('pointerdown', hide);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
}
