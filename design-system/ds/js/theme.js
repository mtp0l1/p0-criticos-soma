/* Tema: claro ou escuro. Até a pessoa escolher, segue o sistema; a escolha fica salva em soma-ds-theme. */
const KEY = 'soma-ds-theme';
export const THEMES = ['light', 'dark'];
const PREFERENCES = ['system', ...THEMES];
const root = document.documentElement;
const darkQuery = matchMedia('(prefers-color-scheme: dark)');
const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const write = (v) => { try { localStorage.setItem(KEY, v); } catch {} };

export const getThemePreference = () => (PREFERENCES.includes(read()) ? read() : 'system');
export const themeFor = (p) => (p === 'system' ? (darkQuery.matches ? 'dark' : 'light') : THEMES.includes(p) ? p : 'light');
export const resolvedTheme = () => themeFor(getThemePreference());

let pending = null;
function apply(next) {
  if (next === (pending ?? root.dataset.theme)) return;
  pending = next;
  const run = () => { root.dataset.theme = next; if (pending === next) pending = null; };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (document.startViewTransition && !reduced) {
    const t = document.startViewTransition(run);
    [t.ready, t.finished, t.updateCallbackDone].forEach((p) => p?.catch(() => {}));
  } else run();
}
const announce = () => root.dispatchEvent(new CustomEvent('ds:themechange', { detail: { preference: getThemePreference(), resolved: resolvedTheme() } }));
export const toggleTheme = () => setTheme(resolvedTheme() === 'dark' ? 'light' : 'dark');
export function setTheme(preference) {
  if (!PREFERENCES.includes(preference)) return;
  write(preference);
  apply(resolvedTheme());
  syncControls();
  announce();
}
function syncControls() {
  const dark = resolvedTheme() === 'dark';
  document.querySelectorAll('[data-theme-toggle]').forEach((b) => b.setAttribute('aria-pressed', String(dark)));
}
export function mountThemeControls(scope = document) {
  const buttons = [...scope.querySelectorAll('[data-theme-toggle]')];
  buttons.forEach((b) => b.addEventListener('click', toggleTheme));
  syncControls();
  return () => buttons.forEach((b) => b.removeEventListener('click', toggleTheme));
}
export function initTheme() {
  root.dataset.theme = resolvedTheme();
  darkQuery.addEventListener('change', () => {
    if (getThemePreference() !== 'system') return;
    apply(resolvedTheme()); syncControls(); announce();
  });
}
