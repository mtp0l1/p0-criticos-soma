# Build do Campana (versão 2)

O site é estático e usa `design-system/assets/bundle.js` e `bundle.css`, compilados a partir de `design-system/files/src`.

```bash
cd tools
npm install
./reconstruir.sh            # tokens → componentes → páginas → bundle → miniaturas → pacote → verificação
./reconstruir.sh --sem-miniaturas
```

Etapas (cada uma é idempotente e parte da fonte da v4 guardada em `src-v4/`, `paginas-v4/` e `tokens-base-v4.json`):

| Script | O que faz |
|---|---|
| `aplicar-v2-componentes.py` | Muda as classes dos componentes (botão em pílula, campo com rótulo flutuante, barra flutuante, cartões com sombra, folha de 36px…) |
| `migrar-tokens-v2.py` | Valores da v2 em `files/tokens.json`, `tokens.css` e no preset Tailwind |
| `gerar-fundamentos.py` | Regenera as páginas Cores, Tipografia, Espaçamento, Raios, Tamanhos e Elevação a partir dos tokens |
| `atualizar-docs-v2.py` / `atualizar-docs-v2b.py` | Cores e medidas citadas nos textos, preview do Button, AGENTS.md |
| `atualizar-figma-v2.py` | A seção “No Figma” de cada componente e módulo vira “Nas telas da v2”, com link para a tela do protótipo (no lugar dos nós do handoff anterior) |
| `atualizar-guias-v2.py` | Páginas de guia escritas à mão (Primeiros passos, regras, AGENTS, registro do handoff), contratos e leads, menu sem duplicatas, `index.d.ts` |
| `build.mjs` | esbuild (bundle.js) + Tailwind (bundle.css) |
| `thumbs.mjs` | 146 miniaturas (720×450) com o Chrome instalado |
| `gerar-telas-v2.py` | Página “Telas da v2” e cópia do protótipo em `design-system/prototipo/` (usa a pasta `../../prototipo-soma`) |
| `empacotar.py` | Monta `files/soma-design-system.zip` a partir do que está publicado (bundle, tokens, READMEs convertidos das páginas, `checks/` em `pacote/`), roda as verificações do pacote e regenera `decision-map.md` |
| `verificar.sh` | Sintaxe de todos os módulos e teste de fumaça (todas as rotas e previews no Chrome) |

## Verificação automática no GitHub

`.github/workflows/verificar-site.yml` roda em cada pull request e em cada push na `main`: confere a sintaxe de todos os módulos e abre todas as rotas e previews no Chrome (`tools/testar-site.mjs`). Reprova 404, erro de script e página vazia.

## Revisão visual

```bash
node capturar-site.mjs ../capturas 3 3   # uma imagem por rota e folhas de contato 3×3
```

Além das imagens, o script avisa: rolagem horizontal da página, imagem quebrada, preview vazio ou mais largo que a moldura e elementos fora da coluna de conteúdo.

```bash
node auditar-previews.mjs 390   # contraste, alvo de toque, texto cortado e rolagem horizontal em cada preview (use 360 também)
```

Alertas conhecidos que não são defeito: textos desabilitados (isentos de contraste), perguntas truncadas por desenho no histórico do Quiz e controles cobertos pela película dos previews de folha.
