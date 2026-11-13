# Mapa de decisão

Gerado dos contratos dos componentes (`checks/gen_decision_map.py`). **Não edite à mão:** mude o "Usar para" ou o "Nunca" no README do componente e gere de novo.

Como usar: ache a necessidade da tela na coluna "Usar para". Se achar, use o componente. Se não achar, é peça nova: siga a triagem em `7-regras-e-verificacoes.md`.

## Ação

| Componente | Usar para | Nunca |
|---|---|---|
| `Button` | Botão de ação em quatro ênfases (`loud`, `quiet`, `transparent`, `destructive`), construído como o Button do shadcn/ui: `buttonVariants` (CVA), `asChild` (Radix Slot) e `forwardRef`. | ter dois botões `loud` na mesma tela, nem trocar cor ou raio por `className`. |
| `ButtonGroup` | Botões relacionados colados lado a lado, com uma borda só entre eles (shadcn ButtonGroup). | juntar ações sem relação; só opções do mesmo tipo (Dia · Semana · Mês). |
| `Checkbox` | Caixa de seleção, sobre Radix Checkbox (shadcn Checkbox). | usar para escolha única (use `RadioList`) nem sem rótulo ao lado. |
| `ChoiceChips` | Chips de escolha única: valores de doação, categorias de recompensa e materiais. | usar para navegação entre telas nem para marcar vários itens quando a escolha é única. |
| `RadioList` | Lista de opções de escolha única, como a escolha do impacto a compartilhar. | usar com mais de 5 opções (use `Select`) nem para ação imediata. |
| `Switch` | Interruptor de liga e desliga com efeito imediato, sobre Radix Switch (shadcn Switch). | exigir botão de salvar depois: o efeito é imediato; para aceite de regulamento use `Checkbox`. |
| `Toggle` | Botão de liga e desliga, sozinho ou em grupo (shadcn Toggle e ToggleGroup, sobre Radix). | usar para enviar formulário ou navegar; só liga e desliga um estado. |

## Navegação

| Componente | Usar para | Nunca |
|---|---|---|
| `Header` | Cabeçalho de tela com voltar, título e no máximo uma ação. | pôr mais de uma ação à direita, título com mais de uma linha, nem botão "Voltar" no corpo da tela. |
| `ListRow` | Linha de lista em dois formatos: `help` (creme, com título, legenda e seta) e `menu` (ícone, rótulo e divisor). | misturar os formatos `help` e `menu` na mesma lista. |
| `LocationBar` | Barra do topo que mostra o espaço de recebimento onde a pessoa entrega e abre a troca de local. | esconder a troca de local; sem espaço escolhido vira chamada, não some. |
| `Pagination` | Navegação entre páginas de uma lista (shadcn Pagination). | usar em lista curta ou rolagem infinita. |
| `PillTabs` | Abas em pílulas soltas: a ativa cheia e as outras contornadas. | usar fora de Recompensas nem com mais de duas abas. |
| `SectionHeader` | Título de bloco dentro da tela, com um link opcional à direita. | usar como título de tela (use `Header`) nem com mais de um link à direita. |
| `SegmentedControl` | Controle em pílula para alternar entre duas ou três seções, como Quiz e Histórico. | ter mais de três seções (use `Tabs`). |
| `StepDots` | Pontos de progresso do cadastro: um ponto por passo, só o atual em destaque. | mostrar mais de um ponto laranja: só o passo atual tem destaque. |
| `TabBar` | Barra de navegação inferior fixa, com os cinco destinos do produto. | ter mais ou menos de cinco destinos, nem esconder em tela de fluxo (cadastro, QR). |
| `Tabs` | Abas com sublinhado para trocar o recorte de uma mesma tela, como o período do ranking. | usar para trocar de tela inteira; só recorta o mesmo conteúdo (período). |
| `Tile` | Tile de atalho da Home: ícone em cima, rótulo embaixo, em grade de duas colunas (`TileGrid`). | usar para dado (use `StatTile`) nem sem rótulo de texto. |

## Formulário

| Componente | Usar para | Nunca |
|---|---|---|
| `Combobox` | Select com busca, para listas longas como cidade (shadcn Combobox: Popover + Command). | usar para listas curtas (use `Select`). |
| `Command` | Lista com campo de busca e navegação por teclado (shadcn Command, sobre cmdk). | usar sozinho como tela; é a base do `Combobox`. |
| `Field` | Estrutura de um campo de formulário: rótulo, controle, ajuda e erro (shadcn Field). | repetir rótulo, ajuda e erro à mão: a estrutura já vem pronta. |
| `Input` | Campo de texto de uma linha (shadcn Input) e o `Label` do Radix, com a altura e a borda acessível do Campana. | usar sem `Label` ou `aria-label`; para telas de produto prefira `TextField`. |
| `InputGroup` | Campo com ícone, texto ou botão dentro da mesma borda (shadcn InputGroup). | pôr mais de um botão dentro da mesma borda. |
| `InputOTP` | Código de verificação digitado em casas separadas (shadcn InputOTP, sobre input-otp). | usar para texto livre; só código de tamanho fixo. |
| `NativeSelect` | Lista suspensa que abre o seletor do próprio aparelho (shadcn NativeSelect). | usar quando o menu precisa de ícone ou estilo próprio (use `Select`). |
| `PasswordField` | Campo de senha com botão de mostrar e ocultar dentro do campo. | mostrar a senha por padrão nem aceitar menos que o texto de ajuda promete (6 caracteres). |
| `SearchField` | Campo de busca com lupa, texto e botão de limpar. | usar como filtro de uma lista já visível sem limpar (botão de limpar é obrigatório). |
| `Select` | Lista suspensa de escolha única, sobre Radix Select (shadcn Select). | usar com menos de três opções nem com busca (use `Combobox`). |
| `Slider` | Escolha de um valor, ou de uma faixa, arrastando uma alça (shadcn Slider, sobre Radix). | usar para valor exato digitado (use `Input`). |
| `TextField` | Campo de formulário com rótulo acima, texto de ajuda e mensagem de erro. | trocar rótulo por placeholder nem apagar o que a pessoa digitou ao mostrar erro. |
| `Textarea` | Campo de texto de várias linhas (shadcn Textarea). | usar para resposta curta (use `Input`). |

## Cadastro

| Componente | Usar para | Nunca |
|---|---|---|
| `AccountExistsSheet` | Bottom sheet "O (11) 98765-4321 já tem uma conta": aparece no passo do celular quando o número já está cadastrado. | bloquear a pessoa: as duas saídas (entrar, usar outro número) sempre aparecem. |
| `InviteCodeField` | Campo opcional de código de convite, com o estado "Código aplicado" e o link "Onde encontro o código?". | bloquear o cadastro por código inválido: o campo é opcional. |
| `InviteCodeHelpSheet` | Bottom sheet "Onde encontro o código?": explica e mostra a mensagem de convite de exemplo. | abrir fora do passo do código de convite. |
| `InviteMessageExample` | Simulação de conversa que mostra onde está o código dentro da mensagem de convite. | usar como mensagem real de envio; é só uma simulação. |
| `NeighborhoodNote` | Bairro encontrado pelo CEP, com o link "Corrigir". | mostrar sem o link "Corrigir". |
| `SignupStep` | Corpo de um passo do cadastro: título, campos, botão e pontos de progresso. | pôr mais de um dado por tela nem prender o botão no rodapé: ele segue o conteúdo. |
| `TermsConsent` | Aceite do regulamento e aviso de privacidade, no último passo do cadastro. | pré-marcar o aceite nem liberar o botão sem ele. |

## Início

| Componente | Usar para | Nunca |
|---|---|---|
| `ActivityRow` | Linha de atividade recente no Início: o que aconteceu e quando, com uma ação opcional. | passar de uma ação por linha. |
| `BalanceCard` | Card com o saldo de pontos e uma legenda de apoio; leva ao extrato. | mostrar saldo sem a ação que leva ao extrato. |
| `CampaignBanner` | Campanha ativa no catálogo e no Início: uma faixa de uma linha. | passar de uma linha. |
| `GoalSummaryCard` | Resumo da meta de pontos no Início: a recompensa escolhida e quanto falta. | aparecer sem meta definida (use `GoalCard` ou a chamada de escolher meta). |
| `HomeGreeting` | Saudação do Início: "Olá Mônica", o botão do cartão QR e a ajuda. | trocar o nome da pessoa por texto genérico quando ele existe. |
| `QrCheckinCard` | Cartão do QR de atendimento: a pessoa mostra o QR no espaço para a equipe registrar a entrega. | usar para outro código que não seja o QR de atendimento; o cartão de membro da versão antiga saiu. |
| `QuestionTeaser` | Card "Pergunta do dia" no Início, que chama para o Quiz. | mostrar a resposta no Início. |

## Quiz

| Componente | Usar para | Nunca |
|---|---|---|
| `AnswerHistory` | Lista de respostas do Quiz por mês, com navegação entre os meses (Tela 4). | misturar meses numa lista só: a navegação é mês a mês. |
| `AnswerResult` | Tela cheia com o resultado da pergunta do dia, no acerto (2A) ou no erro (2B). | mostrar medalha: o nível é troféu (`Trophy`). |
| `DailyDone` | Estado do Quiz depois de responder (Tela 3): "Tarefa cumprida!" e o tempo até a próxima pergunta. | tirar o contador de tempo até a próxima pergunta. |
| `HelpfulVote` | Pergunta "Essa resposta foi útil?" com Sim e Não, ao fim de um artigo de ajuda. | usar fora do fim de um artigo de ajuda. |
| `HistorySummary` | Topo do Histórico do Quiz (Tela 4): o troféu do nível, quando subiu e os totais. | misturar medalha e troféu. |
| `LevelBadge` | Etiqueta do nível do Quiz, em maiúsculas: o nome ("BRONZE") ou a dificuldade ("INICIANTE"). | usar para texto que não seja nível ou dificuldade. |
| `LevelCard` | Topo do Quiz (Telas 1 e 3): o troféu do nível, a etiqueta e quantas perguntas faltam para o próximo. | mostrar Ferro ou Platina: só Bronze, Prata e Ouro existem. |
| `MilestoneResult` | Tela cheia de conquista quando a pessoa completa um marco de semanas seguidas (Telas 7 e 8). | disparar fora de marco de semanas seguidas. |
| `QuestionCard` | Card da "Pergunta do dia" no Quiz (Tela 1): pergunta, opções "a) …" e envio. | revelar a resposta certa antes do envio. |
| `StreakProgress` | Barra da sequência em semanas, com os marcos que dão pontos extras. | mostrar marco sem os pontos extras que ele dá. |
| `StreakSection` | Bloco "Sua trilha" das Telas 1 e 3 do Quiz: título, os sete dias, a barra de semanas, o aviso de proteção e o link "Ver histórico". | esconder o link "Ver histórico". |
| `StreakTrail` | Os sete dias da semana na trilha do Quiz, com o estado de cada um. | mostrar mais de sete dias. |
| `TierCard` | Um nível na tela "Campeão da Reciclagem" (Tela 5): troféu, nome, etiqueta de dificuldade e quantas perguntas pede. | mostrar nível sem troféu e sem a etiqueta de dificuldade. |
| `Trophy` | Troféu ilustrado do nível no Quiz: uma pilha de pontos com uma estrela, dentro de um círculo. | trocar por medalha ou por ilustração nova sem registro. |

## Ranking e social

| Componente | Usar para | Nunca |
|---|---|---|
| `ContactRow` | Linha de contato para convidar: avatar, nome, espaço e o botão "Convidar". | trocar o botão "Convidar" por outra ação. |
| `FriendRequestSheet` | Pedido de amizade recebido: bottom sheet com "Agora não" e "Aceitar". | pôr outra ação além de "Agora não" e "Aceitar". |
| `InviteCodeCard` | Seu código de convite, com botão de copiar. | esconder o botão de copiar. |
| `Podium` | Os três primeiros do período: avatares sobre degraus ouro, prata e bronze. | ordenar visualmente sem manter a ordem 1 · 2 · 3 para o leitor de tela. |
| `PositionCard` | Card "Sua posição" no ranking, com o percentual de participantes que a pessoa superou. | comparar a pessoa a um indivíduo; só ao percentual de participantes. |
| `RankingRow` | Linha da classificação depois do pódio: "#4", avatar, nome e quilos. | mostrar posição sem o nome da pessoa. |
| `RankingStarterCard` | Card da primeira entrega no Ranking, para quem ainda não reciclou no período. | aparecer para quem já entregou no período. |

## Recompensas

| Componente | Usar para | Nunca |
|---|---|---|
| `GoalCard` | Minha meta no topo do catálogo de recompensas: o prêmio escolhido e o quanto falta. | mostrar meta sem quanto falta. |
| `GoalNote` | Nota "Sua meta" na tela Entrega registrada: caixa tracejada que liga o que a pessoa acabou de ganhar com a recompensa que quer. | usar fora da tela Entrega registrada. |
| `GoalProgressCard` | Progresso da recompensa escolhida como meta: pontos atuais, o custo e quantos quilos faltam. | esconder quantos quilos faltam. |
| `MaterialResult` | Resultado da busca de material: foto, nome, se é aceito no local, se é reciclável e a categoria. | omitir se o material é aceito no local ou se é reciclável. |
| `RedeemCode` | Código do resgate em caixa tracejada, com botão de copiar em largura total. | mostrar o código sem o botão de copiar. |
| `RedemptionItem` | Item do histórico de resgates: logo do parceiro, nome da recompensa, pontos e hora, e o status. | escrever o status em texto livre: use `StatusChip`. |
| `RewardChoiceList` | Lista de recompensas para escolher a meta durante o cadastro. | usar fora do cadastro (no catálogo use `RewardRow`). |
| `RewardDetail` | Detalhe de uma recompensa: imagem, categoria, nome, custo, etiquetas e "De onde vêm os pontos". | esconder "De onde vêm os pontos". |
| `RewardRow` | Linha do catálogo de recompensas: título, pontos e seta. | ter área tocável menor que a linha inteira. |
| `StatusChip` | Chip em pílula com o estado de um resgate: Concluído, Aguardando retirada ou Expirado. | criar um quarto estado: são três (Concluído, Aguardando retirada, Expirado). |

## Reciclar e entrega

| Componente | Usar para | Nunca |
|---|---|---|
| `DeliveryCard` | Card "Sua próxima entrega", na aba Reciclar e no Início. | usar como resumo de confirmação (use `DeliverySummaryCard`). |
| `DeliveryDayCard` | Card de espera no dia da entrega: lembra o endereço e o horário do espaço antes de a pessoa abrir o QR. | trocar o lembrete de endereço e horário pelo próprio QR (ele vive no `QrCheckinCard`). |
| `DeliveryHistoryRow` | Entrega anterior na lista de Meus agendamentos: onde foi, quando e a situação. | misturar entrega futura e passada. |
| `DeliverySummaryCard` | Resumo do agendamento: quando, onde e a que horas a pessoa entrega. | mudar de forma entre confirmação, agendamentos e calendário: é o mesmo card. |
| `ImpactTiles` | Três números do impacto da entrega: quilos, pontos ganhos e água economizada. | passar de três números. |
| `ReminderCard` | Lembrete da próxima entrega: data sugerida e botão "Adicionar ao calendário". | trocar o botão "Adicionar ao calendário" por outra ação. |
| `SlotPicker` | Escolha de data ou horário em fileira rolável, no agendamento da entrega. | mostrar horário cheio sem marcar "indisponível" para o leitor de tela. |
| `SpaceCard` | Espaço de recebimento: na lista "perto de você" ou como opção na escolha do agendamento. | mostrar espaço sem endereço. |
| `SpaceDetail` | Detalhe de um espaço de recebimento: nome, endereço, horário e "Como chegar". | aparecer antes de um espaço ser escolhido. |

## Doar

| Componente | Usar para | Nunca |
|---|---|---|
| `DonationAmountCard` | Cartão "Quantos pontos deseja doar?" da tela de doação: saldo, campo de quantidade e mensagem de erro. | esconder o saldo: ele aparece no cartão junto do campo. |
| `DonationStateCard` | Estado que toma o lugar do campo de doação quando a pessoa não pode doar ainda. | aparecer junto do campo de doação. |
| `InstitutionCard` | Instituição que recebe a doação de pontos. | esconder o "Saber mais". |
| `InstitutionDetailModal` | Modal "Saber mais" de uma instituição: banner, nome, texto longo e contatos. | servir de tela de doação: ele abre pelo "Saber mais", a doação fica na tela de doar. |
| `InstitutionRow` | Instituição na lista "Escolha para quem você quer doar seus pontos". | pôr dois alvos de toque na mesma linha. |

## Feedback e estados

| Componente | Usar para | Nunca |
|---|---|---|
| `Badge` | Selo não interativo em pílula (shadcn Badge), em seis tons. | ser tocável (use `Button` ou `Tag`) nem carregar texto longo. |
| `EmptyState` | Estado vazio centralizado com ilustração, título, explicação e um próximo passo. | mostrar sem próximo passo nem usar ilustração fora do catálogo. |
| `Message` | Mensagem em linha que fica na tela, em quatro tons: informativa, positiva, de atenção e de erro. | usar para aviso passageiro (use `Toast`) nem sem ícone ou texto. |
| `Progress` | Barra de progresso contínua, sobre Radix Progress (shadcn Progress). | usar para etapas discretas (use `StepDots`). |
| `ProtectionNotice` | Aviso da proteção semanal da sequência: "se você perder um dia, a sequência continua". | prometer proteção que a regra semanal não dá. |
| `ResultScreen` | Tela de resultado ou pedido: sucesso, erro ou permissão (contatos, notificação). | deixar o fluxo sem uma ação principal clara. |
| `Skeleton` | Esqueleto de carregamento para texto, linha com miniatura e card. | ficar no lugar do erro: se a carga falhar, mostre `Message`. |
| `Spinner` | Indicador de espera sem duração conhecida (shadcn Spinner). | usar quando se sabe a duração (use `Progress`). |
| `Tag` | Etiqueta de categoria (Plástico, Cartonado). | ser tocável nem passar de uma palavra ou duas. |
| `Toast` | Aviso curto e passageiro: erro, confirmação, aviso neutro ou novidade do ranking, sempre com ícone e uma frase. | guardar informação que a pessoa precisa reler; some sozinho. |
| `Toaster` | Provedor de avisos passageiros, com fila, tempo e gesto de dispensar (shadcn Sonner). | montar mais de um provedor por produto. |

## Sobreposição

| Componente | Usar para | Nunca |
|---|---|---|
| `Accordion` | Lista de perguntas que abrem e fecham, sobre Radix Accordion (shadcn Accordion). | abrir tudo por padrão nem esconder regra que a pessoa precisa aceitar. |
| `AlertDialog` | Confirmação que exige resposta antes de seguir, sobre Radix AlertDialog (shadcn AlertDialog). | usar para informação sem decisão (use `Modal` ou `Message`). |
| `Collapsible` | Um trecho que abre e fecha, com animação de altura (shadcn Collapsible, sobre Radix). | esconder informação obrigatória. |
| `Dialog` | As primitivas do Radix Dialog no estilo Campana (shadcn Dialog), para montar um diálogo fora do padrão do `Modal`. | usar quando o `Modal` serve; é só para diálogo fora do padrão. |
| `Drawer` | Bottom sheet que acompanha o dedo e fecha ao ser arrastado para baixo (shadcn Drawer, sobre Vaul). | usar sem a alça de arrastar: a alça é o gesto de fechar. |
| `DropdownMenu` | Menu de ações de um item, aberto por um botão (shadcn DropdownMenu, sobre Radix). | esconder ação principal da tela. |
| `Modal` | Modal de confirmação ou de escolha, com título, texto curto ou conteúdo, e uma única ação. | ter mais de uma ação principal nem esconder a saída. |
| `Popover` | Balão de ajuda curta que abre ao tocar, sobre Radix Popover (shadcn Popover). | guardar ação obrigatória; é só ajuda curta. |
| `ShareImpactModal` | Modal "Compartilhar meu impacto": resume os números da entrega e oferece três caminhos para compartilhar. | passar de três caminhos de compartilhar. |
| `Sheet` | Bottom sheet, sobre Radix Dialog (shadcn Sheet com `side="bottom"`). | usar para confirmação destrutiva (use `AlertDialog`). |

## Layout e conteúdo

| Componente | Usar para | Nunca |
|---|---|---|
| `AspectRatio` | Mantém a proporção de uma imagem, vídeo ou mapa enquanto a largura muda (shadcn AspectRatio, sobre Radix). | usar sem proporção definida. |
| `Avatar` | Foto ou iniciais da pessoa em círculo, sobre Radix Avatar (shadcn Avatar). | mostrar sem iniciais quando falta a foto. |
| `Card` | Contêiner de conteúdo (shadcn Card) com cabeçalho, título, descrição, conteúdo e rodapé, em quatro variantes. | aninhar card dentro de card nem mudar o raio por `className`. |
| `Carousel` | Slides que passam por gesto, com setas e pontos (shadcn Carousel, sobre Embla). | esconder conteúdo essencial depois do primeiro slide. |
| `Icon` | Ícones de linha do Lucide, o mesmo set das telas novas no Figma, com nomes do Campana. | importar ícone de fora do set Lucide do sistema. |
| `Illustration` | Mostra uma das ilustrações do sistema pelo nome, no tamanho do Figma ou em outro. | desenhar ilustração nova sem registrar em 6-ilustracoes.md. |
| `PointsBadge` | Pílula com os pontos de uma pergunta, de um prêmio ou de um custo. | usar para outro número que não seja pontos. |
| `ScrollArea` | Área com rolagem própria e barra visível (shadcn ScrollArea, sobre Radix). | criar rolagem aninhada dentro da rolagem da tela. |
| `Separator` | Linha divisória horizontal ou vertical, sobre Radix Separator (shadcn Separator). | usar só para espaçar: o espaço vem da escala. |
| `StatTile` | Indicador de impacto: ícone, frase de entrada, valor e equivalência. | usar sem equivalência quando o dado a tem. |
| `StatsRow` | Números lado a lado (entregas, quilos, pontos) num bloco neutro. | passar de três números. |
| `Table` | Tabela de dados simples, como o extrato de pontos (shadcn Table). | usar para lista de itens tocáveis (use `ListRow`). |
