/* Textos fixos da interface (só português). */
const M = {
  'shell.closeMenu': 'Fechar menu', 'shell.openMenu': 'Abrir menu', 'shell.collapse': 'Recolher menu lateral', 'shell.expand': 'Expandir menu lateral', 'shell.more': 'Mais',
  'palette.label': 'Busca rápida', 'palette.placeholder': 'Buscar páginas, tokens e ícones…', 'palette.results': 'Resultados', 'palette.navigate': 'navegar', 'palette.open': 'abrir', 'palette.close': 'fechar',
  'palette.empty': (q) => `Nada encontrado para “${q}”.`,
};
export const msg = (key, ...args) => { const v = M[key]; return typeof v === 'function' ? v(...args) : v ?? key; };
