# AGENTS.md · Campana, o design system da So+ma

Leia isto primeiro. Vale para qualquer IA (Claude, Claude Design, IA do Figma, Claude Code), para quem está começando e para qualquer produto do ecossistema So+ma: o Campana é white label, com um núcleo que não depende de produto e módulos opcionais por funcionalidade.

## Ordem de leitura

1. Este arquivo.
2. `tokens.json`: a única fonte de cor, espaço, raio, tamanho e texto. Nenhum valor cru fora dele.
3. `decision-map.md`: ache a necessidade da tela e o componente que a resolve.
4. `components/<Nome>/README.md` do componente que for usar: leia **Usar para**, **Nunca** e **Verificado por** antes de tudo.
5. `8-para-qualquer-produto.md`: as camadas (fundamentos, núcleo, módulos) e como adotar em um produto novo.
6. `1-gerar-telas-com-ia.md` (processo e índice) e `2-padroes-de-tela.md` (como cada tela fecha).
7. `7-regras-e-verificacoes.md`: regras com ID, o que o script confere e o que ainda é revisão humana.

## Regras de composição

- **CMP-01** Só use componentes que têm contrato (README com Usar para, Nunca e Verificado por).
- **CMP-02** Não crie variante. Se a necessidade não cabe nas variantes que existem, é peça nova (CMP-03).
- **CMP-03** Peça nova entra rotulada `##Nome##` com quatro dados: nome, tarefa que resolve, motivo de não caber no que existe e origem (tela do Figma ou pedido). Sem os quatro, não entra.
- **CMP-04** Não mude o desenho de um componente por `className` ou `style`: cor, raio, altura e espaço vêm das props e dos tokens.
- Prefira o núcleo. Use um módulo de produto só quando o produto tem a funcionalidade dele. Nome de peça nova vem da tarefa, nunca do produto.

## Valores que se conferem

| Regra | Valor |
|---|---|
| Margem lateral da tela | 20px (`space-xsmall`) |
| Título de bloco → conteúdo | 8px (`space-nano`) |
| Entre blocos da tela | 24px (`space-small`) |
| Escala de espaço | 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 |
| Escala de texto | 12 · 14 · 16 · 18 · 20 · 24 · 32px (só `tab-label` tem 11px) |
| Raios | 4 · 8 · 12 · 16 · 24 · pílula |
| Alvo de toque | 44px de altura e de largura |
| Contraste | 4,5:1 para texto, 3:1 para ícone e borda de controle |
| Botão `loud` | um por tela |
| Largura de desenho | 360px |
| Fonte | Lexend |

## O que NÃO usar

Telas marcadas `ATUAL` (produção) ou `PROPOSTA` (caso de borda sem confirmação) em um handoff do Figma. O sistema segue só o que está marcado `NOVO`.

## Antes de entregar

Rode `checks/run.sh` (ou `python3 checks/ds_checks.py .`). Falha cita o ID da regra e o arquivo. Exceção só entra em `checks/excecoes.json` com motivo.
