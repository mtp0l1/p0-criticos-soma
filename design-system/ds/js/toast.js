/* Aviso rápido. toast('Nome copiado') */
let host;
export function toast(text) {
  if (!host) { host = document.createElement('div'); host.className = 'ds-toast-host'; host.setAttribute('role', 'status'); host.setAttribute('aria-live', 'polite'); document.body.append(host); }
  const el = document.createElement('div');
  el.className = 'ds-toast';
  el.textContent = text;
  host.replaceChildren(el);
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.remove(), 2400);
}
