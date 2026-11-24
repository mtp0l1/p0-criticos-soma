# Pontos críticos do app atual × v2

Origem: página "Mapeamento de pontos críticos" do Figma (199 notas amarelas, 13 seções, sobre as telas do app que estava no ar).
Revisão feita em 23/11/2026 contra o protótipo da v2 (201 telas) e o Campana. Cada tema abaixo diz se a v2 resolve, com a tela que prova.

| Tema das notas | Notas | Na v2 | Prova |
|---|---|---|---|
| "<" e "Fechar" duplicados, e voltando para o Início em vez de voltar para a tela anterior | ~35 | Resolvido | 76 botões Voltar, todos `@back` (histórico). Só há um fechar por folha. A única tela com os dois (Compartilhar convite) tem o Voltar na tela de fundo e a folha sem X |
| Texto de cabeçalho que não representa o gatilho ("Doar meus pontos") | 5 | Resolvido | Cabeçalho "Doar pontos" em todas as telas do fluxo |
| Muito texto no modal do Quiz, CTA escondido; tooltip translúcido | 8 | Resolvido | Folha "Como funciona a sequência" em três cartões, "Entendi" visível; Popover sobre `surface-primary` opaco |
| "Meu Impacto" com maiúscula; microcopy ("Código copiado", "clicar") | 6 | Resolvido | Nenhum "clicar", "Tudo bom" ou "Meu Impacto" nas 2.599 linhas de texto das telas |
| Buscar material: textos longos, nome repetido, "Outros nomes", categoria acima do material, material sem foto | ~45 | Resolvido | Tela do PET: nome em destaque, categoria em etiqueta, lista de aceitos e como preparar; lista com tile de ícone (sem foto) |
| Buscar material: estado sem resultado; ":(" ilegível por leitor de tela; "Item" em vez de "material" | 8 | Resolvido na tela; **faltava no Campana** | `Nenhum material encontrado para “pilha”`. O Campana ainda usava "Item não encontrado" (corrigido agora) |
| "Entregando em Sem preferência de espaço" parecendo um lugar | 3 | Resolvido | `LocationBar` vazia vira "Adicione seu local de entrega" (regra no Campana) |
| CPF avançava sem validar; CTA habilitado | 2 | Resolvido | O protótipo valida CPF, CEP e e-mail, com erro curto e CTA bloqueado |
| Conta sem pontos vendo lista de doação | 18 | Resolvido | Tela 3D "Saldo zero", com chamada para juntar pontos |
| Ranking: "posição nenhuma", ranking sem participação | 4 | Resolvido | `PositionCard percent={null}` e tela "Ranking do novato" |
| Meu impacto com números para quem ainda não reciclou ("Que impacto? Ainda não fiz nada.") | 5 | **Faltava** | Nova tela **M2A · Meu impacto · ainda sem entregas** |
| Falta empty state para o carrinho / lista de resgates | 2 | **Faltava** | Nova tela **A1V · Meus resgates · vazio** |
| Recompensas: componente não suporta 4 linhas, título de categoria com 3 linhas, tag descentralizada, texto cortado | 9 | Resolvido; ação do título quebrava | Teste com títulos de 4 linhas e de 3 linhas: nada corta, tags centralizadas. `SectionHeader`: a ação "Ver todas (12)" quebrava em 3 linhas (corrigido) |
| Onboarding com missões e etapas, Home com blocos redundantes | 10 | Não se aplica | A v2 não tem missões; a ativação é um fluxo de 18 telas |
| Cabeçalho do menu alto demais; erros de português | 3 | Resolvido | Cabeçalho do Menu abaixo da barra de status; varredura de 2.599 textos sem acento faltando, espaço duplo ou frase em minúscula |
| Dados: materiais sem foto, busca com resultado incorreto, falta o item "Espaçolaser" | 5 | Fora do escopo | Problema de conteúdo e API, não de tela |

## O que foi feito nesta rodada

- Protótipo: duas telas novas, **M2A** (`916:90001`) e **A1V** (`866:90001`), ligadas a partir das telas originais ("Ver o caso…") e à barra inferior; 201 telas montam sem erro.
- Campana: `EmptyState` ganhou os dois exemplos e links para as telas; "Item não encontrado" virou "Nenhum material encontrado"; a amostra de tipografia deixou de dizer "clique"; `SectionHeader` não quebra mais a ação.
- Protótipo: a senha do cadastro dizia "Use 6 números" mas a validação exigia 8 caracteres com letra e número (quem seguia o texto era barrado). Agora a regra é a do desenho: 6 números, teclado numérico.
- Gerador das telas: `prototipo-soma/fonte/adicionar-estados-vazios.py` (idempotente; depois `python3 montar.py`).

## Como repetir a revisão

1. Texto: extraia os ids de texto das telas (`<path id="…">` em `prototipo-soma/fonte/dados/svg`) e procure os padrões das notas.
2. Comportamento: `proto.json` → `hot` e `links` de cada tela (Voltar deve ser `@back`).
3. Layout: renderize a tela e compare com a nota.
