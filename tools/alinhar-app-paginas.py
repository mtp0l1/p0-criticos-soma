# -*- coding: utf-8 -*-
"""Atualiza as páginas dos módulos que foram alinhados ao desenho final do app (ver alinhar-app-componentes.py):
lead, contrato, "O que você fornece", especificação, acessibilidade e código de InstitutionRow, HomeGreeting, BalanceCard,
SignupStep, RankingRow e Podium. Rode depois de atualizar-guias-v2.py. Idempotente: regrava as seções inteiras."""
import json, os, re, sys

root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
pages = os.path.join(root, 'design-system/site/pages')
PREFIX = 'export default () => '


def carregar(n):
    s = open(os.path.join(pages, n + '.js'), encoding='utf-8').read()
    return json.loads(s[len(PREFIX):s.rindex(';')])


def salvar(n, j):
    open(os.path.join(pages, n + '.js'), 'w', encoding='utf-8').write(PREFIX + json.dumps(j, ensure_ascii=False) + ';\n')


def c(t): return '<code>%s</code>' % t


def secao(j, sid, inner):
    novo, k = re.subn(r'(<section class="doc-section" id="%s".*?<div class="doc-prose">)(.*?)(</div></section>)' % sid, lambda m: m.group(1) + inner + m.group(3), j, count=1, flags=re.S)
    if not k: sys.exit('seção %s não achada' % sid)
    return novo


def lead(j, txt):
    novo, k = re.subn(r'<p class=doc-header__lead>.*?</p>', lambda m: '<p class=doc-header__lead>%s</p>' % txt, j, count=1, flags=re.S)
    if not k: sys.exit('lead não achado')
    return novo


def uso(j, usar, nunca):
    textos = list(re.finditer(r'<p class="usage-card__text">(.*?)</p>', j, re.S))
    if len(textos) < 2: sys.exit('cartões de uso não achados')
    a, b = textos[0], textos[1]
    return j[:a.start(1)] + usar + j[a.end(1):b.start(1)] + nunca + j[b.end(1):] if False else (
        j[:a.start(1)] + usar + j[a.end(1):b.start(1)] + nunca + j[b.end(1):])


def codigo(j, snippet):
    novo, k = re.subn(r'(<pre class="ds-code" tabindex="0"><code>)(.*?)(</code></pre>)', lambda m: m.group(1) + snippet + m.group(3), j, count=1, flags=re.S)
    if not k: sys.exit('código não achado')
    return novo


def lista(*itens): return '<ul>\n' + '\n'.join('<li>%s</li>' % i for i in itens) + '\n</ul>'


def esc(s): return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')


# ------------------------------------------------------------------ InstitutionRow
n = 'modulos__InstitutionRow'; j = carregar(n)
j = lead(j, 'Instituição na lista "Escolha para quem você quer doar seus pontos": cartão branco com o tile do ícone em tom de categoria. Um toque abre a tela de doação daquela instituição.')
j = secao(j, 'fornece', '<p>O nome (%s), a causa em uma linha (%s), o ícone da causa (%s), o tom da categoria (%s, opcional: sem ele sai do nome) e %s (ou %s).</p>' % (c('name'), c('description'), c('icon'), c('tint'), c('onPress'), c('href')))
j = secao(j, 'especificacao', lista(
    'Cartão %s, raio %s (28px), sombra %s e padding de 14px. Três colunas com %s entre elas: tile de 60px, texto e um botão redondo de 36px (%s) com a seta.' % (c('surface-primary'), c('radius-2xlarge'), c('shadow-card'), c('space-micro'), c('surface-secondary')),
    'Tile de 60px com raio %s no tom da categoria (%s, %s, %s, %s, %s ou %s) e o ícone de 24px em foreground. O tom muda por categoria da causa, nunca por estado.' % (c('radius-large'), c('surface-tint-peach'), c('-green'), c('-blue'), c('-lavender'), c('-pink'), c('-yellow')),
    'Nome em %s, causa em %s %s. A causa quebra em quantas linhas precisar ("Abrigo, cuidados veterinários e adoção responsável de animais resgatados.").' % (c('label'), c('body-small'), c('text-secondary')),
    'Na lista do app: CUFA %s, Ação da Cidadania %s, Mesa Brasil SESC %s, Instituto Esporte e Educação %s, Gol de Letra %s, APAE %s e Associação S. Francisco de Assis %s.' % (
        c('peach · shopping-bag'), c('green · heart'), c('blue · utensils'), c('lavender · award'), c('pink · sport'), c('yellow · users'), c('green · heart')),
    'Não é o %s: o card com foto, descrição e "Saber mais" aparece depois da escolha, na tela de doação.' % c('InstitutionCard')))
j = codigo(j, esc('<Soma.InstitutionRow icon="utensils" tint="blue" name="Mesa Brasil SESC" description="Distribuição de alimentos" onPress={abrir} />'))
salvar(n, j)

# ------------------------------------------------------------------ HomeGreeting
n = 'modulos__HomeGreeting'; j = carregar(n)
j = lead(j, 'Saudação do Início: avatar com a inicial, "Olá Mônica", o espaço de recebimento e os botões do cartão QR e da ajuda.')
j = uso(j, 'Saudação do Início: avatar, "Olá Mônica", o espaço de recebimento e os botões do QR e da ajuda.', 'trocar o nome da pessoa por texto genérico quando ele existe.')
j = secao(j, 'fornece', '<p>O primeiro nome (%s) e, se existirem, %s (espaço de recebimento), %s, %s e %s.</p>' % (c('name'), c('location'), c('photo'), c('onQr'), c('onHelp')))
j = secao(j, 'especificacao', lista(
    'Avatar de 48px em %s (laranja) com a inicial do nome em foreground; com %s, a foto no lugar.' % (c('interactive-fill-loud'), c('photo')),
    '"Olá {nome}" em %s (22px bold), sem vírgula. Embaixo, o espaço de recebimento em %s %s, com o ícone %s em %s.' % (c('screen-title'), c('caption'), c('text-secondary'), c('pin'), c('icon-brand')),
    'À direita, QR e ajuda em discos brancos de 44px (%s, %s) com o ícone em %s.' % (c('surface-primary'), c('shadow-card'), c('icon-brand')),
    'Fica no topo do Início, 24px acima do %s. O espaço de recebimento vem na própria saudação.' % c('BalanceCard'),
    'Os dois botões têm 44px, que já é a área de toque.'))
j = secao(j, 'acessibilidade', '<p>O nome é um h1; os botões se chamam "Meu cartão QR" e "Ajuda". O avatar é decorativo.</p>')
j = codigo(j, esc('<Soma.HomeGreeting name="Mônica" location="Casa so+ma Batel" onQr={abrirQr} onHelp={abrirAjuda} />'))
salvar(n, j)

# ------------------------------------------------------------------ BalanceCard
n = 'modulos__BalanceCard'; j = carregar(n)
j = lead(j, 'Card com o saldo de pontos e uma legenda de apoio; leva ao extrato. Tem três tons: hero (azul-marinho, o do Início), claro e escuro.')
j = secao(j, 'fornece', '<p>O saldo (%s), a legenda (%s) e o destino do toque. Opcional: %s (%s, %s ou %s) e %s (%s).</p>' % (c('points'), c('hint'), c('tone'), c('hero'), c('light'), c('dark'), c('action'), c('{ label, onClick | href }')))
j = secao(j, 'especificacao', lista(
    '%s (padrão): fundo %s, raio %s (32px), sombra %s, altura mínima de 150px e duas formas circulares translúcidas ao fundo. "Saldo atual" em %s e, no canto superior direito, um disco branco de 32px com a seta. O número em %s (48px bold) na cor %s (laranja) e "pontos" em %s %s. Para o Início com saldo.' % (
        c('tone="hero"'), c('surface-inverse'), c('radius-3xlarge'), c('shadow-dark'), c('body-small'), c('balance-number'), c('primary'), c('subtitle'), c('text-inverse')),
    '%s: fundo %s, raio %s, altura mínima de 104px, conteúdo no topo e seta centralizada à direita. "Saldo atual" em %s, o número em 48px regular e "pontos" em %s, tudo em %s. A legenda, quando existe, em %s. Para telas de apoio, como o extrato.' % (
        c('tone="light"'), c('surface-accent'), c('radius-large'), c('caption'), c('subtitle'), c('text-primary'), c('text-secondary')),
    '%s: fundo %s com "SEU SALDO ATUAL" em %s e número de 28px bold em %s; leva %s (botão loud compacto, como "Ver meta"). Para o Início com meta ativa (Início pós-entrega).' % (
        c('tone="dark"'), c('surface-inverse'), c('icon-brand'), c('text-inverse'), c('action')),
    'Saldo zero sempre mostra um caminho: sem hint, escreve "Faça sua primeira entrega e comece a pontuar". Nunca "Você não tem pontos a expirar" com saldo zero.',
    'Número com separador de milhar (707, 9.057). Com saldo 1, "ponto" no singular.'))
j = secao(j, 'acessibilidade', '<p>No hero e no claro, o card inteiro é um botão (ou link com %s) e o nome lido inclui saldo e legenda. No escuro, o toque é só do %s; o saldo é texto.</p>' % (c('href'), c('action')))
j = secao(j, 'figma', '<p>Início: <a href="prototipo/#832-7334" target="_blank" rel="noopener">Home com saldo</a> e <a href="prototipo/#829-6713" target="_blank" rel="noopener">Início · Responda ao Quiz</a> (%s). Com meta ativa, o <a href="prototipo/#842-10848" target="_blank" rel="noopener">Início pós-entrega</a> (%s).</p>' % (c('hero'), c('dark')))
salvar(n, j)

# ------------------------------------------------------------------ SignupStep
n = 'modulos__SignupStep'; j = carregar(n)
j = lead(j, 'Passo do cadastro: topo com Voltar, barra de progresso e Ajuda; tile de ícone, título, campos e o botão fixo no pé da tela. <strong>Um dado por tela.</strong> Não leva %s.' % c('Header'))
j = uso(j, 'Passo do cadastro: topo com progresso, título, campos e botão fixo no pé da tela.', 'pôr mais de um dado por tela nem soltar o botão do pé da tela: ele fica fixo embaixo.')
j = secao(j, 'fornece', '<p>O título do passo (%s), o passo atual (%s) e o total (%s, padrão 7). Opcional: %s, %s, %s, %s e %s (o botão). Os campos entram como filhos.</p>' % (c('title'), c('step'), c('total'), c('icon'), c('description'), c('onBack'), c('onHelp'), c('action')))
j = secao(j, 'especificacao', lista(
    'Topo: Voltar em disco branco de 44px, a barra de progresso ("Passo 4 de 7", os passos já feitos em laranja) no centro e Ajuda em disco à direita. Padding lateral %s (20px).' % c('space-xsmall'),
    'Tile de ícone de 52px (%s, ícone em %s), 40px abaixo do topo. Título em %s (28px bold) e a linha de apoio em %s %s, 8px abaixo.' % (c('surface-tint-peach'), c('icon-brand'), c('page-title'), c('body-small'), c('text-secondary')),
    'Campos a 24px do título (%s); campos do mesmo bloco, numa div com %s.' % (c('space-small'), c('grid gap-nano')),
    'O botão fica fixo no pé da tela (56px de altura, 24px da borda). Fica desabilitado até o campo obrigatório estar válido; o erro é curto, embaixo do campo, sem apagar o que a pessoa digitou.',
    'Voltar retorna ao passo anterior e mantém o que já foi preenchido. Não há botão "Voltar" no corpo.',
    'Passos: 01 nome e data de nascimento, 02 CPF, 03 e-mail, 04 celular, 05 senha, 06 CEP, 07 código de convite e aceite (aqui o botão é "Criar minha conta").'))
j = secao(j, 'acessibilidade', '<p>O título do passo é o h2 da tela; os botões se chamam "Voltar" e "Ajuda". A barra de progresso diz "Passo 4 de 7" ao leitor de tela.</p>')
j = codigo(j, esc('<Soma.SignupStep title="Qual é o seu celular?" icon="phone" step={4} onBack={voltar} onHelp={ajuda} action={<Soma.Button fullWidth>Continuar</Soma.Button>}>\n  <Soma.TextField label="Celular" mask="phone" required value={v} onChange={setV} />\n</Soma.SignupStep>'))
salvar(n, j)

# ------------------------------------------------------------------ RankingRow
n = 'modulos__RankingRow'; j = carregar(n)
j = secao(j, 'fornece', '<p>Posição, nome, quilos e, se houver, foto e %s (tom do avatar; sem ele, sai do nome). Na linha da própria pessoa: %s, %s ("Faltam 6,5 kg para ultrapassar Carlos Lima") e, se as letras do avatar diferem do nome, %s.</p>' % (c('tint'), c('self'), c('hint'), c('initials')))
j = secao(j, 'especificacao', lista(
    'Card %s sem borda, raio %s, sombra %s, padding %s (12px). Colunas: "#4" em 14px bold %s, avatar de 36px em tom de categoria (%s), nome em %s e quilos em %s bold, à direita. Entre as colunas, %s.' % (
        c('surface-primary'), c('radius-large'), c('shadow-card'), c('space-micro'), c('text-secondary'), c('surface-tint-*'), c('label'), c('label'), c('space-micro')),
    '%s: fundo %s, borda %s, avatar na cor de destaque, "#5" e quilos em %s, nome em bold. O nome é "Você (Policarpo)" e o avatar mostra "P".' % (c('self'), c('surface-accent'), c('border-highlight'), c('text-link')),
    '%s ocupa a largura da linha, abaixo, alinhado ao avatar (32px da borda), em %s bold. Só a linha da própria pessoa tem dica.' % (c('hint'), c('caption')),
    'Use dentro de %s (lista ordenada com %s entre linhas). Não é tocável.' % (c('RankingList'), c('space-nano'))))
j = re.sub(r'#FFF2EA/#FFD3BE do handoff anterior viram <code>surface-accent</code>/<code>border-highlight</code>; o raio de 14px vira <code>radius-medium</code> \(12px\), da escala fechada\.', 'A linha da própria pessoa usa <code>surface-accent</code> e <code>border-highlight</code>; os avatares seguem os tons de categoria do app.', j)
salvar(n, j)

# ------------------------------------------------------------------ Podium
n = 'modulos__Podium'; j = carregar(n)
j = lead(j, 'Os três primeiros do período: avatares em tom claro sobre degraus laranja, areia e pêssego.')
j = uso(j, 'Os três primeiros do período: avatares em tom claro sobre degraus laranja, areia e pêssego.', 'ordenar visualmente sem manter a ordem 1 · 2 · 3 para o leitor de tela.')
j = secao(j, 'especificacao', lista(
    'Ordem visual 2 · 1 · 3, três colunas de 100px com %s entre elas. Avatar de 64px no primeiro e 52px nos outros, em tom claro quando não há foto: %s (1º), %s (2º) e %s (3º). Degraus retos (sem raio), com 46/34/26px de altura e o número centralizado em 16px bold.' % (c('space-micro'), c('surface-tint-peach'), c('surface-tint-blue'), c('surface-tint-lavender')),
    'Degraus: o 1º em %s (laranja da marca), o 2º em %s (areia) e o 3º em %s (pêssego), todos com o número em foreground.' % (c('primary'), c('surface-podium-2'), c('surface-podium-3')),
    '%s: avatar laranja com contorno de 2,5px em foreground e degrau laranja, nome "Você" em bold e quilos em %s. Só a pessoa tem esse contorno.' % (c('self'), c('text-link')),
    '%s (Geral): avatar "?" e o nome "Participante". O ranking geral não identifica ninguém.' % c('anonymous'),
    'Quilos com separador de milhar. Quem não está no pódio aparece em %s. Com menos de 3 participantes, não use pódio: só a lista (Tela 7).' % c('RankingRow')))
salvar(n, j)
print('ok alinhar-app-paginas')

# ------------------------------------------------------------------ mapa de decisão (página): mesmos contratos dos módulos acima
n = 'recursos__mapa-de-decisao'; j = carregar(n)
TROCAS = [
    ('Corpo de um passo do cadastro: título, campos, botão e pontos de progresso.', 'Passo do cadastro: topo com progresso, título, campos e botão fixo no pé da tela.'),
    ('pôr mais de um dado por tela nem prender o botão no rodapé: ele segue o conteúdo.', 'pôr mais de um dado por tela nem soltar o botão do pé da tela: ele fica fixo embaixo.'),
    ('Saudação do Início: "Olá Mônica", o botão do cartão QR e a ajuda.', 'Saudação do Início: avatar, "Olá Mônica", o espaço de recebimento e os botões do QR e da ajuda.'),
    ('Os três primeiros do período: avatares sobre degraus ouro, prata e bronze.', 'Os três primeiros do período: avatares em tom claro sobre degraus laranja, areia e pêssego.'),
]
for velho, novo in TROCAS:
    for a, b in ((velho, novo), (velho.replace('"', '&quot;'), novo.replace('"', '&quot;'))):
        j = j.replace(a, b)
salvar(n, j)
dm = os.path.join(root, 'design-system/files/decision-map.md')
if os.path.exists(dm):
    t = open(dm, encoding='utf-8').read()
    for velho, novo in TROCAS: t = t.replace(velho, novo)
    open(dm, 'w', encoding='utf-8').write(t)

# ------------------------------------------------------------------ index.d.ts: props novas dos módulos alinhados
dts = os.path.join(root, 'design-system/files/index.d.ts')
t = open(dts, encoding='utf-8').read()


def tdts(velho, novo):
    global t
    if novo in t: return
    if velho not in t: sys.exit('index.d.ts: NÃO ACHEI ' + velho[:70])
    t = t.replace(velho, novo, 1)


tdts('''	/** Primeiro nome. Mostra "Olá {nome}". */
	name: string;
	/** Abre o cartão QR da pessoa (botão redondo ao lado do nome). Sem ele, o botão não aparece. */
	onQr?: () => void;
	/** Abre a ajuda (ícone à direita). Sem ele, o ícone não aparece. */
	onHelp?: () => void;''', '''	/** Primeiro nome. Mostra "Olá {nome}" e a inicial no avatar. */
	name: string;
	/** Espaço de recebimento ("Casa so+ma Batel"), em linha de apoio sob o nome, com o ícone de local. */
	location?: string;
	/** Foto da pessoa. Sem ela, o avatar mostra a inicial. */
	photo?: string;
	/** Abre o cartão QR da pessoa (disco branco à direita). Sem ele, o botão não aparece. */
	onQr?: () => void;
	/** Abre a ajuda (disco branco à direita). Sem ele, o botão não aparece. */
	onHelp?: () => void;''')
tdts('''export interface TileProps {
	icon: IconName;
	label: string;
	href?: string;''', '''/** light = cartão branco (padrão) · primary = laranja da marca (a ação que gera pontos) · dark = azul-marinho · peach = pêssego. */
export type TileTone = "light" | "primary" | "dark" | "peach";
export interface TileProps {
	icon: IconName;
	label: string;
	tone?: TileTone;
	href?: string;''')
tdts('export declare function Tile({ icon, label, href, onClick }: TileProps)', 'export declare function Tile({ icon, label, tone, href, onClick }: TileProps)')
tdts('''	/** light = card creme tocável com seta (Início) · dark = faixa escura com botão (Início com meta, Tela 17). */
	tone?: "light" | "dark";''', '''	/** hero = cartão azul-marinho com o saldo em laranja (Início da v2, padrão) · light = cartão creme tocável com seta · dark = faixa escura com botão (Início com meta, Tela 17). */
	tone?: "hero" | "light" | "dark";''')
tdts('''	/** Ícone da causa (cesta, coração, talheres…). Aparece em quadro de 40px com borda. */
	icon?: IconName;
	href?: string;''', '''	/** Ícone da causa (cesta, coração, talheres…). Aparece em tile de 60px colorido pela categoria. */
	icon?: IconName;
	/** Tom do tile, por categoria da causa. Sem ele, o tom sai do nome (sempre o mesmo para a mesma instituição). */
	tint?: Tint;
	href?: string;''')
tdts('''	/** Total de passos (padrão 7). */
	total?: number;
	/** Blocos do passo (campos, aceite). Cada filho fica a 40px do próximo; agrupe campos de um mesmo bloco numa `div` com `grid gap-small`. */
	children?: React$1.ReactNode;
	/** Botão "Continuar" (ou "Criar minha conta"). Fica 40px abaixo do último bloco, não preso no rodapé. */''', '''	/** Total de passos (padrão 7). */
	total?: number;
	/** Ícone do passo, em tile pêssego acima do título (user, id-card, phone…). */
	icon?: IconName;
	/** Volta ao passo anterior (disco à esquerda). Sem ele, o botão não aparece. */
	onBack?: () => void;
	/** Abre a ajuda (disco à direita). Sem ele, o botão não aparece. */
	onHelp?: () => void;
	/** Blocos do passo (campos, aceite). Agrupe os campos de um mesmo bloco numa `div` com `grid gap-nano`. */
	children?: React$1.ReactNode;
	/** Botão "Continuar" (ou "Criar minha conta"). Fica fixo no pé da tela, 56px de altura. */''')
tdts('''	/** Letras do avatar quando diferem do nome exibido ("Você (Policarpo)" → "P"). */
	initials?: string;
	/** Linha da própria pessoa: fundo creme''', '''	/** Letras do avatar quando diferem do nome exibido ("Você (Policarpo)" → "P"). */
	initials?: string;
	/** Tom do avatar. Sem ele, sai do nome (o mesmo tom para a mesma pessoa). */
	tint?: Tint;
	/** Linha da própria pessoa: fundo creme''')
if 'export type Tint =' not in t:
    t += '''
/** Tom de categoria (tile de ícone, avatar). Cada um aponta para um token surface-tint-*. */
export type Tint = "peach" | "green" | "blue" | "lavender" | "pink" | "yellow";
export declare const tintBg: Record<Tint, string>;
export declare function tintFor(seed: string): Tint;
'''
open(dts, 'w', encoding='utf-8').write(t)

# ------------------------------------------------------------------ Tile e QuestionTeaser
n = 'modulos__Tile'; j = carregar(n)
j = lead(j, 'Tile de atalho do Início: disco com o ícone em cima, rótulo embaixo, em grade de duas colunas (<code>TileGrid</code>), em quatro tons.')
j = uso(j, 'Tile de atalho do Início: disco com o ícone em cima, rótulo embaixo, em grade de duas colunas (<code>TileGrid</code>).', 'usar para dado (use <code>StatTile</code>) nem sem rótulo de texto.')
j = secao(j, 'fornece', '<p>O ícone, um rótulo de até duas linhas, o destino e, opcionalmente, o tom (%s). Agrupe os tiles sob um SectionHeader.</p>' % c('tone'))
j = secao(j, 'especificacao', lista(
    'Cartão de 128px de altura, raio %s (28px), padding %s e o conteúdo nas pontas: o disco de 44px com o ícone em cima e o rótulo %s embaixo, em até duas linhas. Entre os dois tiles, %s.' % (c('radius-2xl'), c('space-mini'), c('label'), c('space-mini')),
    '%s (padrão): fundo %s com %s; disco %s. %s: fundo %s (laranja da marca) para a ação que gera pontos ("Buscar material"). %s: fundo %s, texto %s e disco translúcido ("Recompensas"). %s: fundo %s e disco branco ("Doar pontos").' % (
        c('tone="light"'), c('surface-primary'), c('shadow-card'), c('surface-tint-peach'), c('primary'), c('primary'), c('dark'), c('surface-inverse'), c('text-inverse'), c('peach'), c('surface-tint-peach')),
    'Agrupe por intenção ("Reciclar e ganhar pontos", "Resultado das minhas ações", "Usar pontos") e deixe a ação que gera pontos acima da dobra. Um tile laranja por grupo, no máximo.',
    'O tile todo é tocável.'))
j = secao(j, 'estados', '<p>Hover e toque escurecem um passo o fundo do tom (o laranja segue os estados do botão), foco com o anel %s. O tom %s não muda no hover. Com %s, vira link.</p>' % (c('ring'), c('dark'), c('href')))
salvar(n, j)

n = 'modulos__QuestionTeaser'; j = carregar(n)
j = lead(j, 'Banner "Pergunta do dia" no Início, que chama para o Quiz: etiqueta, a pergunta e um disco com a seta.')
j = uso(j, 'Banner "Pergunta do dia" no Início, que chama para o Quiz.', 'mostrar a resposta no Início.')
j = secao(j, 'fornece', '<p>O texto (%s), o apoio (%s) e o destino (%s ou %s).</p>' % (c('question'), c('hint'), c('href'), c('onPress')))
j = secao(j, 'especificacao', lista(
    'Cartão %s, raio %s (28px), padding %s (24px). No topo, a etiqueta "Pergunta do dia" em pílula branca (%s, ícone %s). Abaixo, a pergunta em %s e o apoio em %s %s; à direita, um disco de 48px em %s com a seta.' % (
        c('surface-tint-peach'), c('radius-2xl'), c('space-small'), c('eyebrow'), c('sparkles'), c('screen-title'), c('body-small'), c('text-secondary'), c('surface-inverse')),
    'Um só toque leva ao Quiz. Com %s, vira link.' % c('href'),
    'Texto sugerido: "Isopor é reciclável?" com "Responda para somar pontos e trocar por recompensas." Não mostre o nível nem os troféus no Início.'))
salvar(n, j)
