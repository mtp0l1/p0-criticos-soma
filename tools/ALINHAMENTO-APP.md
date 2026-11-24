# Campana × app: registro de alinhamento

Revisão feita em 23/11/2026, comparando o Campana com as 201 telas da v2 do app (o protótipo navegável, que sai do Figma).

## Como foi medido

1. **Cores:** todas as cores usadas nas 201 telas (`prototipo-soma/fonte/dados/svg`) contra `tokens.css`. 57 cores; 41 fora dos tokens, quase todas em ilustrações. As que importavam eram de interface e viraram token (abaixo).
2. **Telas lado a lado:** as 23 telas de padrão do Campana (`previews/Tela*.html`) contra a tela oficial equivalente do protótipo, em 360px.
3. **Protótipo:** as 201 telas montam sem erro no Chrome (`__mount` em cada uma), sem erro de console.

## O que foi alinhado ao app

| Peça | Antes | Agora (como no app) |
|---|---|---|
| Tokens | sem tons de categoria | `surface-tint-peach · green · blue · lavender · pink · yellow` e degraus `surface-podium-2 · 3` |
| `InstitutionRow` | cartão cinza, ícone com borda | cartão branco de 28px, tile de 60px em tom de categoria, botão redondo com seta |
| `Avatar` do ranking (`RankingRow`, `Podium`) | cinza, ouro, prata e bronze | tons de categoria; degraus laranja, areia e pêssego; a própria pessoa com contorno |
| `HomeGreeting` | "Olá nome" com QR | avatar com inicial, espaço de recebimento, QR e ajuda em discos brancos |
| `BalanceCard` | cartão creme | `tone="hero"` (azul-marinho, saldo em laranja) como padrão do Início |
| `Tile` | cartão cinza de 80px | cartão de 128px em quatro tons (`light`, `primary`, `dark`, `peach`) |
| `QuestionTeaser` | cartão com borda | banner pêssego com etiqueta e disco com seta |
| `SignupStep` | `Header` "Cadastro" e pontos embaixo | barra de progresso no topo, tile de ícone e botão fixo no pé |
| Telas de padrão | | Cadastro (8), Doar lista e Início recompostas com os módulos acima |

Scripts: `alinhar-app-componentes.py` (código), `alinhar-app-paginas.py` (documentação e `index.d.ts`), tokens em `migrar-tokens-v2.py`.

## Ainda diferente do app (não feito nesta rodada)

Achados da comparação das telas de padrão. Cada item precisa de componente novo ou redesenho, com página, exemplo e verificações.

- **Doar pontos (valor):** o app tem o valor grande ("500 | pts") e um teclado numérico próprio. O `DonationAmountCard` é um cartão com campo. Faltam `NumericKeypad` e o valor em destaque.
- **Doar, saldo insuficiente:** o app mostra um anel de progresso (150 de 500); o Campana mostra barra.
- **Doar, sucesso:** cabeçalho laranja com disco azul-marinho e texto grande; o Campana usa tela clara.
- **Reciclar:** título grande, carrossel de dois cartões (próxima entrega) e materiais como tiles de ícone.
- **Recompensas e meta:** abas, busca, chips, cartão de meta azul-marinho com barra, vitrine de ofertas.
- **Agendar e Meus agendamentos:** cabeçalho com Voltar e título à esquerda; seletor de data e horário.
- **Início pós-entrega:** `GoalSummaryCard` azul-marinho "SUA META" e cartão branco de saldo com "Ver meta".
- **Quiz, Ranking, Conta, Ajuda, Materiais e os 24 modais:** não foram comparados tela a tela. Só o ranking (avatares e pódio) foi ajustado.
- **Número do saldo no `BalanceCard` hero:** no app ele é maior (cerca de 64px); o estilo `balance-number` da escala fechada tem 48px. Mudar exige um 17º estilo de texto.
- **Cores do app sem token:** cinza do rascunho de campo (#6B7788), alça do bottom sheet (#D8D1C2), azul do escudo de proteção (#2F5F9E), azul de rede social (#1D9BF0). Aparecem em poucas telas.
- **Cabeçalho do protótipo:** o viewer usa algumas cores próprias (#8C97A6, #2C3F5A, #1B8A4B, #C26A00…), fora do sistema.

## Como repetir a comparação

```bash
node capturar-previews.mjs ../capturas 360 4 3 TelaInicio TelaDoarLista   # lado do Campana
# lado do app: renderize prototipo-soma/fonte/dados/svg/<id>.svg a 360px (ids em proto.json)
```
