# Build do Campana (versão 2)

O site é estático e usa `design-system/assets/bundle.js` e `bundle.css`, compilados a partir de `design-system/files/src`.

```bash
cd tools
npm install
./reconstruir.sh            # tokens → componentes → páginas → bundle → miniaturas
./reconstruir.sh --sem-miniaturas
```

Etapas (cada uma é idempotente e parte da fonte da v4 guardada em `src-v4/`, `paginas-v4/` e `tokens-base-v4.json`):

| Script | O que faz |
|---|---|
| `aplicar-v2-componentes.py` | Muda as classes dos componentes (botão em pílula, campo com rótulo flutuante, barra flutuante, cartões com sombra, folha de 36px…) |
| `migrar-tokens-v2.py` | Valores da v2 em `files/tokens.json`, `tokens.css` e no preset Tailwind |
| `gerar-fundamentos.py` | Regenera as páginas Cores, Tipografia, Espaçamento, Raios, Tamanhos e Elevação a partir dos tokens |
| `atualizar-docs-v2.py` | Cores e medidas citadas nos textos, preview do Button, AGENTS.md |
| `build.mjs` | esbuild (bundle.js) + Tailwind (bundle.css) |
| `thumbs.mjs` | 146 miniaturas (720×450) com o Chrome instalado |
| `gerar-telas-v2.py` | Página “Telas da v2” e cópia do protótipo em `design-system/prototipo/` (usa a pasta `../../prototipo-soma`) |
