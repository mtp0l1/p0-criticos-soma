# -*- coding: utf-8 -*-
"""Atualiza as páginas de guia (escritas à mão) para a versão 2: regras visuais, registro do handoff, citações de nós.

Roda depois de atualizar-figma-v2.py. Cada troca é conferida: se o texto de origem não existir e o novo também não,
o script para com erro (assim uma mudança na página original não passa em silêncio). Idempotente."""
import json, os, re, sys

root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
pages = os.path.join(root, 'design-system/site/pages')
PREFIX = 'export default () => '


def carregar(nome):
    s = open(os.path.join(pages, nome + '.js'), encoding='utf-8').read()
    assert s.startswith(PREFIX)
    return json.loads(s[len(PREFIX):s.rindex(';')])


def gravar(nome, j):
    out = PREFIX + json.dumps(j, ensure_ascii=False) + ';'
    assert json.loads(out[len(PREFIX):out.rindex(';')]) == j, 'PÁGINA INVÁLIDA ' + nome
    open(os.path.join(pages, nome + '.js'), 'w', encoding='utf-8').write(out)


class Pagina:
    def __init__(self, nome):
        self.nome = nome; self.j = carregar(nome); self.alterou = False

    def troca(self, velho, novo, obrigatorio=True):
        if velho in self.j:
            self.j = self.j.replace(velho, novo); self.alterou = True
        elif novo in self.j or not obrigatorio:
            pass
        else:
            raise SystemExit('NÃO ACHEI em %s: %r' % (self.nome, velho[:90]))

    def regex(self, padrao, novo, flags=re.S, obrigatorio=True):
        j2, n = re.subn(padrao, lambda m: novo, self.j, count=1, flags=flags)
        if n:
            self.j = j2; self.alterou = True
        elif not obrigatorio:
            pass
        else:
            raise SystemExit('REGEX NÃO ACHOU em %s: %r' % (self.nome, padrao[:90]))

    def salvar(self):
        if self.alterou:
            gravar(self.nome, self.j)
        return self.alterou


# ---------------------------------------------------------------- primeiros-passos
def primeiros_passos():
    p = Pagina('primeiros-passos')
    p.troca('Monte com o núcleo. O handoff de referência mostra como cada tela de exemplo aponta para componentes e tokens.',
            'Monte com o núcleo. As telas da v2 (Padrões › Telas da v2) são a referência oficial; o registro do handoff anterior mostra de onde vieram os módulos e quais tokens substituíram cada valor.')
    p.regex(r'O sistema segue as telas novas do handoff de referência no Figma\..*?(?=</li>|</p>)',
            'O sistema segue a versão 2 do app, a referência oficial (Padrões › Telas da v2). O que a v2 substituiu foi removido, sem versão anterior. O registro do handoff anterior guarda de onde vieram os módulos e o mapa tela → componentes.', obrigatorio=False)
    p.regex(r'<p><strong>Cor\.</strong>.*?</p>',
            '<p><strong>Cor.</strong> Fundo creme, texto azul-marinho, laranja só no que é ação. Valores do tema padrão So+ma (versão 2): texto <code>ink</code> #21344E, apoio #56697F, divisor #E8E2D6, fundo de tela #FBF7F1, superfície #FFFFFF, laranja da ação #FFA125, laranja de texto #9E5400. Cada produto pode ter um tema com valores de núcleo próprios (veja "Para qualquer produto"); os papéis dos tokens semânticos não mudam. Fundo de tela <code>background-primary</code> (creme); trilhos e áreas rebaixadas em <code>background-secondary</code>; cartões, campos, linhas de lista e a barra inferior em <code>surface-primary</code>; lembretes e dicas em <code>surface-accent</code>; cartão de saldo, botão escuro e toast em <code>surface-inverse</code>; <code>surface-brand</code> (laranja) só como fundo da tela de sucesso. Texto em <code>text-primary</code>, apoio em <code>text-secondary</code>, link e rótulo de ação em <code>text-link</code>. Um laranja cheio por tela, na ação principal. Verde e vermelho sempre com ícone e texto. <code>border-highlight</code> (#FFA125) marca o que está selecionado ou em foco. Ouro, prata e bronze (<code>award-*</code>) só em pódio e selo de nível, nos módulos que têm ranking ou nível. Os tons de dados (azul, lilás, verde, rosa, amarelo) só distinguem categorias, nunca em botão, seleção ou feedback.</p>')
    p.regex(r'<p><strong>Botão primário\.</strong>.*?</p>',
            '<p><strong>Botão primário.</strong> <code>interactive-fill-loud</code> com <code>text-on-loud</code> (azul-marinho, 6,2:1) em todos os primários, com o brilho <code>shadow-glow</code>. No tema padrão, texto branco sobre laranja mede 2,0:1 e não é permitido, nem em botão, nem em banner, nem em cartão. Um tema novo precisa conferir o par próprio.</p>')
    p.regex(r'<p><strong>Laranja como texto\.</strong>.*?</p>',
            '<p><strong>Laranja como texto.</strong> Texto e ícone isolado em laranja usam <code>text-link</code> e <code>icon-brand-strong</code> (#9E5400 no tema padrão): 5,6:1 sobre <code>surface-primary</code> e 4,9:1 sobre <code>surface-accent</code>.</p>')
    p.regex(r'<p><strong>Tipografia\.</strong>.*?</p>',
            '<p><strong>Tipografia.</strong> Uma família, Lexend (<code>sans</code>), em quatro pesos (400, 500, 600, 700), com os 16 estilos de texto da v2 (a lista completa, com tamanho, peso e tracking, está em Fundamentos › Tipografia): <code>page-title</code> = Title L (28/34 bold), <code>screen-title</code> = Title M (22/28 bold), <code>section-title</code> = Title S (18/24 semibold), <code>subtitle</code> e <code>header-title</code> = Heading (17/22 semibold), <code>body</code> = Body (15/22), <code>body-small</code> = Body S (14/20), <code>caption</code> = Micro (12/16), <code>balance-number</code> = Display XL (48/56), <code>display</code> = Display (32/38). O tracking acompanha o tamanho: negativo nos títulos grandes, positivo na caixa-alta, zero no corpo. <code>tab-label</code> é o único estilo abaixo de 12px. Legenda é <code>text-secondary</code> cheia, nunca texto translúcido.</p>')
    linhas = [
        ('Título da tela e de passo do cadastro', 'page-title'),
        ('Título de folha, de tela de estado e valor médio', 'screen-title'),
        ('Título de seção e de cartão', 'section-title'),
        ('Título de linha e de bloco', 'subtitle'),
        ('Título do cabeçalho', 'header-title'),
        ('Número de destaque (saldo, total)', 'balance-number'),
        ('Valor de indicador, posição no ranking', 'stat-number'),
        ('Parágrafo', 'body'),
        ('Parágrafo em ênfase, pergunta do quiz', 'body-strong'),
        ('Texto de apoio, texto de opção', 'body-small'),
        ('Rótulo de tile, linha, card', 'label'),
        ('Legenda, meta, equivalência', 'caption'),
        ('Categoria acima de título', 'eyebrow</code> (maiúsculo no componente'),
        ('Título de tela de sucesso', 'display'),
    ]
    tab = ('<div class="tw" tabindex="0" role="region" aria-label="Tabela 1"><table>\n<thead>\n<tr>\n<th>Elemento</th>\n<th>Estilo</th>\n</tr>\n</thead>\n<tbody>\n'
           + ''.join('<tr>\n<td>%s</td>\n<td><code>%s</code></td>\n</tr>\n' % l for l in linhas) + '</tbody>\n</table></div>')
    p.regex(r'<div class="tw" tabindex="0" role="region" aria-label="Tabela 1"><table>\n<thead>\n<tr>\n<th>Elemento</th>\n<th>Estilo</th>.*?</table></div>', tab)
    p.regex(r'<p><strong>Espaço e forma\.</strong>.*?</p>',
            '<p><strong>Espaço e forma.</strong> Grade de 4px, só tokens <code>space-*</code>: margem lateral de tela <code>space-xsmall</code> (20px, conteúdo de 350px em tela de 390px); do cabeçalho ao conteúdo e entre blocos <code>space-small</code> (24px); título de bloco ao conteúdo <code>space-nano</code>; padding de card <code>space-mini</code>; botões empilhados a 10px. O bloco de ação fixo termina 12px acima da barra inferior e tem altura automática (dois botões cabem); o conteúdo rolável leva 140px de padding inferior para o último item não ficar sob a barra. Em tela de resultado o ícone começa a <code>space-large</code> (40px) do cabeçalho. Raios (Fundamentos › Raios): miniatura <code>radius-small</code> (12); aviso e nota <code>radius-medium</code> (16); campo e linha de lista <code>radius-large</code> (20); cartão, bloco e modal <code>radius-xlarge</code> (24); botão <code>radius-2xlarge</code> (28); barra inferior flutuante <code>radius-3xlarge</code> (32); folha <code>radius-sheet</code> (36, só nos cantos superiores); chip, selo e disco <code>radius-full</code>. O raio do filho é menor ou igual ao do pai.</p>')
    p.regex(r'<p><strong>Superfície\.</strong>.*?</p>',
            '<p><strong>Superfície.</strong> A v2 usa elevação suave, em azul-marinho com transparência, nunca preta (Fundamentos › Elevação): <code>shadow-card</code> em cartão, campo, linha de lista e botão claro; <code>shadow-dark</code> em botão escuro e cartão de saldo; <code>shadow-glow</code> só no botão laranja primário; <code>shadow-float</code> na barra inferior flutuante; <code>shadow-high</code> em popover, lista do Select e toast; <code>shadow-sheet</code> na folha. A barra inferior é branca a 86% com desfoque de 24 (com "reduzir transparência": branco opaco, sem desfoque); o cabeçalho fixo ao rolar é opaco; nunca empilhe uma superfície translúcida clara sobre outra. Modal e folha separam do fundo pela película <code>overlay</code> (azul-marinho a 50%).</p>')
    p.troca(' Contorno de controle usa <code>border-strong</code>.',
            ' Contorno de campo usa <code>border-primary</code> (exceção documentada ao contraste 3:1 de controle, porque o estado também aparece pelo rótulo e pela posição); foco em borda de 2px.')
    p.regex(r'<p><strong>Navegação\.</strong>.*?</p>',
            '<p><strong>Navegação.</strong> Barra inferior flutuante com cinco itens, a 16px das laterais e a 24px do fundo; cada produto escolhe os destinos e a ordem (no primeiro produto: Início, Reciclar, Recompensas, Impacto e Menu). A aba ativa vira pílula laranja com o nome; as outras são só ícone em <code>icon-secondary</code>. Toda tela de aba mostra a barra; tela de fluxo fechado, não. Cabeçalho com uma única saída, que volta à tela anterior real. Na tela inicial, a ação principal do produto fica acima da dobra.</p>')
    p.regex(r'<p><strong>Movimento\.</strong>.*?</p>',
            '<p><strong>Movimento.</strong> Responder ao toque (não ao soltar), seguir o dedo 1:1, tudo interrompível, ir e voltar pelo mesmo caminho, mola em vez de cronômetro: botão pressionado vai a 0,97 em 100 ms; folha abre com mola de resposta 0,30 s e amortecimento 0,8; avançar e voltar usam resposta 0,40 s e amortecimento 1,0; toast entra de cima e fica 2,2 s; carrosséis projetam o gesto e resistem nas bordas. Respeite a preferência de movimento reduzido do aparelho: troque deslocamento e mola por fade de 200 ms.</p>')
    p.troca('Lucide, o mesmo set das telas novas no Figma, com traço de 2px, em <code>size-icon</code> (24px) ou <code>size-icon-small</code> (16px) dentro de chip, linha de status e botão compacto.',
            'Lucide, em grade de 24 com traço de 2px (2,2px sobre cor de destaque), pontas e cantos arredondados, em <code>size-icon</code> (24px) ou <code>size-icon-small</code> (16px) dentro de chip, linha de status e botão compacto. Sobre disco de 44px, um tom de dados por categoria. Ícone importante sempre com texto.')
    p.troca('Os "SVG fornecido" do Figma também são Lucide (por exemplo, Pino = <code>pin</code>, Recompensas = <code>gift</code>). A lista completa por grupo e os apelidos (o nome da camada no Figma também funciona) estão no README do <code>Icon</code>.',
            'Os ícones marcados como "SVG fornecido" no handoff anterior também são Lucide (por exemplo, Pino = <code>pin</code>, Recompensas = <code>gift</code>). A lista completa por grupo e os apelidos (o nome da camada no Figma também funciona) estão no README do <code>Icon</code>.')
    p.troca('O estilo é plano, em tons suaves, sem renders 3D.', 'O estilo é de ilustração plana, em tons suaves, sem renders 3D.')
    return p.salvar()


# ---------------------------------------------------------------- recursos/regras, engenharia, gerar-telas, mapa, agents, home
def guias():
    ch = []
    p = Pagina('recursos__regras')
    p.troca('Tokens de movimento e de elevação além de uma sombra ( shadow-high ); o sistema é plano.'.replace(' ( ', ' (').replace(' )', ')'),
            'Tokens de movimento além da tabela de molas de Fundamentos (pressão, folha, avançar e voltar, toast, carrossel); a elevação já existe em seis níveis (<code>shadow-card</code> a <code>shadow-glow</code>).', obrigatorio=False)
    p.regex(r'Tokens de movimento e de elevação além de uma sombra.*?o sistema é plano\.',
            'Tokens de movimento além da tabela de molas de Fundamentos (pressão, folha, avançar e voltar, toast, carrossel); a elevação já existe em seis níveis (<code>shadow-card</code> a <code>shadow-glow</code>).', obrigatorio=False)
    p.troca('Layouts além de 360px de largura.', 'Layouts fora da faixa de 360 a 430px de largura (a referência é 390px).')
    p.troca('Tela 6A (e-mail) do cadastro.', 'Tela 6A (e-mail) do cadastro: desenhada na v2, ainda sem componente próprio.', obrigatorio=False)
    ch.append(p.salvar())

    p = Pagina('recursos__gerar-telas')
    p.troca('a das telas no Figma (o sistema também vale para 390px)', 'a das telas de menor largura (a referência da v2 é 390px; vale de 360 a 430px, com margem fixa e conteúdo que estica)')
    p.troca('Largura de referência: 360px', 'Largura de referência: 390px')
    p.troca('Superfície e divisor; o sistema é plano', 'Elevação do sistema: <code>shadow-card</code> no cartão e no botão claro, <code>shadow-dark</code> no botão escuro, <code>shadow-glow</code> só no primário; sombra preta ou solta não')
    p.troca('Sombra em card, tile ou botão', 'Sombra solta, preta ou fora dos seis níveis')
    p.troca('conceitos no Figma', 'conceitos antigos')
    p.troca('veja o mapa de hex do Figma', 'veja Fundamentos › Cores')
    p.troca('(#DD8613, #F36208, #E8823F no Figma)', '(#DD8613, #F36208, #E8823F do handoff anterior)')
    ch.append(p.salvar())

    p = Pagina('recursos__engenharia')
    p.troca('confirmada nas variáveis de texto do Figma', 'confirmada nos estilos de texto do Figma (página Design System So+ma)')
    p.troca('Texto laranja do Figma (#DD8613, #F36208, #E8823F)', 'Texto laranja do handoff anterior (#DD8613, #F36208, #E8823F)')
    p.troca('Confirme com o time antes de seguir o Figma ao pé da letra.', 'Confirme com o time antes de seguir o handoff anterior ao pé da letra.')
    p.troca('Textos de 9 e 10px do Figma', 'Textos de 9 e 10px do handoff anterior')
    p.troca('Pendente no Figma', 'Pendente no desenho')
    ch.append(p.salvar())

    p = Pagina('modulos__BalanceCard')
    p.troca('(Tela 17, 443:14233)', '(Início pós-entrega)')
    ch.append(p.salvar())

    p = Pagina('home')
    p.troca('campo de 48px', 'campo de 68px com rótulo flutuante')
    p.troca('fiel ao Figma', 'fiel à versão 2 do app')
    p.troca('(Figma 463:4472 a 463:4666)', '(telas da v2)')
    ch.append(p.salvar())
    return any(ch)


# ---------------------------------------------------------------- citações de nós (padrões, ilustrações, registro)
ID = r'\d{3}:\d{3,6}'


def limpa_ids(p):
    # "(443:15355)", "(Figma 443:13010 e 13198)", "(443:19179, versão vigente)"
    p.j = re.sub(r'\s*\((?:Figma )?' + ID + r'[^()<>]*\)', '', p.j)
    p.j = re.sub(r'\s*· nó ' + ID, '', p.j)
    p.alterou = True


def padroes_e_registro():
    ch = []
    p = Pagina('padroes__padroes-de-tela')
    p.regex(r'Tudo aqui segue as telas\s*<[^>]*>\s*NOVAS\s*</[^>]*>\s*do handoff de referência no Figma \(canvas "🟢 HO", 438:1973\)\. Telas marcadas ATUAL no Figma são as de produção que a nova substitui: não use seus componentes\.',
            'Tudo aqui segue as telas da versão 2 do app, a referência oficial (Padrões › Telas da v2). Telas marcadas ATUAL no Figma são as de produção que a v2 substitui: não use seus componentes.', obrigatorio=False)
    p.troca('Regras comuns: largura 360px', 'Regras comuns: largura de referência 390px (vale de 360 a 430px)')
    p.troca('Figma: "Aba Reciclar" (443:12175).', 'Telas da v2: "Aba Reciclar".', obrigatorio=False)
    p.troca('Figma: "escolha-espaco" (477:9296).', 'Telas da v2: "Escolha do espaço".', obrigatorio=False)
    p.regex(r'Figma: "Início e navegação inferior" \(' + ID + r'\): Home DEPOIS \(' + ID + r'\), barra \(' + ID + r'\) e Tela 17 \(' + ID + r'\)\.',
            'Telas da v2: "Início e navegação inferior": Início · depois, barra inferior e Início pós-entrega.', obrigatorio=False)
    p.troca('(463:4472 vazio, 463:4666 zero, 463:4602 acima do saldo, 463:4536 válido)', '(vazio, zero, acima do saldo, válido)', obrigatorio=False)
    p.j = re.sub(r'Figma: seção ("?[^("]+?"?) \(' + ID + r'[^()]*\)', lambda m: 'Telas da v2: seção ' + m.group(1).replace('"02 · ', '"'), p.j)
    limpa_ids(p)
    ch.append(p.salvar())

    p = Pagina('fundamentos__ilustracoes')
    p.j = re.sub(r'<small>(\d+×\d+ px) · nó ' + ID + r'</small>', r'<small>\1</small>', p.j); p.alterou = True
    p.troca('exportadas das telas NOVO do Figma', 'exportadas das telas do app', obrigatorio=False)
    p.troca('As imagens estão no tamanho em que aparecem no Figma', 'As imagens estão no tamanho em que aparecem nas telas', obrigatorio=False)
    ch.append(p.salvar())

    # registro do handoff anterior: continua como histórico, com aviso claro
    p = Pagina('recursos__telas-novas')
    p.troca('<h1 class="doc-header__title">Handoff de referência</h1><p class=doc-header__lead>Origem dos módulos: qual componente monta cada tela do handoff do primeiro produto e para qual token vai cada hex.</p>',
            '<h1 class="doc-header__title">Registro do handoff anterior</h1><p class=doc-header__lead>Histórico: de onde vieram os módulos, qual componente montava cada tela do handoff anterior à v2 e para qual token ia cada hex.</p>')
    p.troca('<p>Registro de como o sistema foi alinhado ao handoff do primeiro produto do ecossistema (Figma <code>AMfte9XW4rEFYw18xjeeBC</code>). É a origem dos módulos e das telas de exemplo, e o modelo para registrar o handoff de outro produto. Use esta página no handoff: para cada tela, quais componentes a montam; para cada hex do arquivo, qual token usar.</p>',
            '<p><strong>Esta página é um registro histórico.</strong> A referência oficial é a versão 2 do app (Padrões › Telas da v2), e os valores atuais estão em Fundamentos e Componentes. As tabelas abaixo guardam como o sistema foi alinhado ao handoff anterior do primeiro produto do ecossistema (Figma <code>AMfte9XW4rEFYw18xjeeBC</code>): a origem dos módulos e das telas de exemplo, e o modelo para registrar o handoff de outro produto. Os nomes de token valem hoje, mas vários valores citados mudaram na v2: campo de 68px (era 48px), raios da escala nova (por exemplo, <code>radius-small</code> é 12px), estilos de texto de 11 a 48px, elevação em seis níveis e barra inferior flutuante. A numeração das telas é a do handoff anterior.</p>')
    p.troca('O sistema foi alinhado primeiro aos conceitos (Quiz 477:<em>, Ranking 478:</em>) e depois ao <strong>handoff</strong> (canvas "🟢 HO", 438:1973), que é a fonte de verdade. O que o handoff substituiu foi <strong>removido</strong>, sem <code>version="anterior"</code>.',
            'O sistema foi alinhado primeiro aos conceitos (Quiz e Ranking) e depois ao <strong>handoff anterior</strong>, que era a fonte de verdade na época. O que aquele handoff substituiu foi <strong>removido</strong>, sem <code>version="anterior"</code>; a versão 2 repete a regra.')
    p.troca('Nós do handoff (438:1973). ', 'Telas do handoff anterior. ', obrigatorio=False)
    for velho, novo_ in [('O que mudou para alinhar com o Figma', 'O que mudou no alinhamento ao handoff anterior'),
                         ('Tela do Figma → componentes', 'Tela do handoff anterior → componentes'),
                         ('Hex do Figma → token', 'Hex do handoff anterior → token')]:
        p.j = p.j.replace('>' + velho + '<', '>' + novo_ + '<')
    limpa_ids(p)
    ch.append(p.salvar())
    return any(ch)


def figma_residual():
    """Frases 'no Figma / o Figma desenha' nas páginas de módulo e componente: viram 'handoff anterior' (comparações com o desenho antigo)."""
    ch = []
    ignorar = {'componentes__Icon', 'componentes__Illustration'}
    for f in sorted(os.listdir(pages)):
        nome = f[:-3]
        if not f.endswith('.js') or not nome.startswith(('modulos__', 'componentes__')) or nome in ignorar:
            continue
        p = Pagina(nome)
        antes = p.j
        if nome == 'componentes__Progress':
            p.j = p.j.replace('como no Figma', 'como nas telas da v2')
        for velho, novo in [(r'\bNo Figma\b', 'No handoff anterior'), (r'\bO Figma\b', 'O handoff anterior'), (r'\bo Figma\b', 'o handoff anterior'),
                            (r'\bdo Figma\b', 'do handoff anterior'), (r'\bno Figma\b', 'no handoff anterior'), (r'\bem Aberto \(Figma\)', 'Em aberto (handoff anterior)')]:
            p.j = re.sub(velho, novo, p.j)
        # as seções e o menu já foram renomeados; protege os nomes de camada e o link de downloads
        if p.j != antes:
            p.alterou = True
        ch.append(p.salvar())
    return any(ch)


def descricoes():
    """Tira o '(Figma 443:…)' das descrições das telas de exemplo e do menu."""
    n = 0
    for f in sorted(os.listdir(pages)):
        if f.startswith('padroes__Tela') or f == 'home.js':
            nome = f[:-3]
            p = Pagina(nome) if f != 'home.js' else None
            if p is None:
                continue
            antes = p.j
            p.j = re.sub(r'\s*\(Figma ' + ID + r'[^()]*\)', '', p.j)
            if p.j != antes:
                p.alterou = True; n += 1
            p.salvar()
    nav = os.path.join(root, 'design-system/site/nav.js')
    t = open(nav, encoding='utf-8').read()
    t2 = re.sub(r'\s*\(Figma ' + ID + r'[^()"]*\)', '', t)
    t2 = t2.replace('{label:"Handoff de referência",icon:"map",path:"/recursos/telas-novas",description:"Origem dos módulos: qual componente monta cada tela do handoff do primeiro produto e para qual token vai cada hex."',
                    '{label:"Registro do handoff anterior",icon:"map",path:"/recursos/telas-novas",description:"Histórico: de onde vieram os módulos e qual componente montava cada tela do handoff anterior à v2."')
    if t2 != t:
        open(nav, 'w', encoding='utf-8').write(t2); n += 1
    return n


# ---------------------------------------------------------------- textos de contrato e leads que ficaram na v1
# (html, md): o mesmo trecho nas páginas (HTML) e no decision-map.md (Markdown)
FRASES = [
    ('Botão de ação em quatro ênfases (<code>loud</code>, <code>quiet</code>, <code>transparent</code>, <code>destructive</code>)',
     'Botão de ação em cinco ênfases (<code>loud</code>, <code>dark</code>, <code>quiet</code>, <code>transparent</code>, <code>destructive</code>)',
     'Botão de ação em quatro ênfases (`loud`, `quiet`, `transparent`, `destructive`)',
     'Botão de ação em cinco ênfases (`loud`, `dark`, `quiet`, `transparent`, `destructive`)'),
    ('Pontos de progresso do cadastro: um ponto por passo, só o atual em destaque.',
     'Progresso do cadastro: um segmento por passo, o atual mais largo, com o texto "Passo X de N".', None, None),
    ('mostrar mais de um ponto laranja: só o passo atual tem destaque.',
     'destacar mais de um segmento como atual: só o passo atual é mais largo.', None, None),
    ('Os pontos são decorativos; o leitor de tela ouve "Passo 1 de 7".',
     'Os segmentos são decorativos; o leitor de tela ouve "Passo 1 de 7".', None, None),
    (', centralizado, como no Figma. Já vem dentro do', ', centralizado. Já vem dentro do', None, None),
    ('Barra de navegação inferior fixa, com os cinco destinos do produto.',
     'Barra de navegação inferior flutuante, com os cinco destinos do produto.', None, None),
    ('Campo de formulário com rótulo acima, texto de ajuda e mensagem de erro.',
     'Campo de formulário com rótulo flutuante dentro do campo, texto de ajuda e mensagem de erro.', None, None),
    ('Rótulo em <code>tab-label</code> (11/14). Inativo: <code>text-secondary</code>, peso 400. Ativo: ícone e rótulo em <code>text-link</code> (#9E5400, 5,73:1), peso 600.',
     'Inativa: só o ícone, em <code>icon-secondary</code> (o nome fica para o leitor de tela). Ativa: pílula laranja (<code>interactive-fill-loud</code>) com ícone e nome em <code>text-on-loud</code> (azul-marinho, 6,2:1), nome em <code>caption</code> negrito.', None, None),
    ('Quatro arranjos, todos vistos no handoff anterior.', 'Quatro arranjos.', None, None),
    ('o mesmo das telas novas no Figma, com nomes do Campana', 'o mesmo das telas da v2, com nomes do Campana', None, None),
    ('Traço de 2px, como no Figma', 'Traço de 2px (2,2px sobre cor de destaque)', None, None),
    ('86 ícones de linha do Lucide, o mesmo set das telas novas no Figma, com traço de 2px', '86 ícones de linha do Lucide, o mesmo set das telas da v2, com traço de 2px', None, None),
    ('no tamanho do Figma ou em outro', 'no tamanho original ou em outro', None, None),
    ('nó do Figma e onde cada uma é usada', 'origem e onde cada uma é usada', None, None),
    ('Catálogo completo, com nós do Figma e regras de uso', 'Catálogo completo, com a origem de cada uma e regras de uso', None, None),
    ('O sistema segue as telas <strong>NOVAS</strong> do handoff de referência no Figma.', 'O sistema segue a versão 2 do app, a referência oficial (Padrões › Telas da v2).', None, None),
    ('está listado em "Handoff de referência"', 'está listado em "Registro do handoff anterior"', None, None),
    ('está listado em &quot;Handoff de referência&quot;', 'está listado em &quot;Registro do handoff anterior&quot;', None, None),
    ('e a numeração da Home', 'e a numeração da Home', None, None),
]


def frases():
    ch = False
    for f in sorted(os.listdir(pages)):
        if not f.endswith('.js') or not f.startswith(('componentes__', 'modulos__', 'recursos__', 'fundamentos__', 'primeiros-passos', 'home')):
            continue
        nome = f[:-3]; p = Pagina(nome); antes = p.j
        for velho, novo, _, _ in FRASES:
            p.j = p.j.replace(velho, novo)
        if p.j != antes:
            p.alterou = True; ch = True
        p.salvar()
    dm = os.path.join(root, 'design-system/files/decision-map.md')
    t = open(dm, encoding='utf-8').read(); t2 = t
    for velho, novo, vmd, nmd in FRASES:
        t2 = t2.replace(vmd or velho, nmd or novo) if (vmd or '<' not in velho) else t2
    if t2 != t:
        open(dm, 'w', encoding='utf-8').write(t2); ch = True
    return ch


def nav_sem_duplicatas():
    """Uma rota por entrada no menu (SegmentedControl aparecia duas vezes)."""
    nav = os.path.join(root, 'design-system/site/nav.js')
    t = open(nav, encoding='utf-8').read()
    ent = re.compile(r'\{label:"[^"]*",icon:"[^"]*",path:"([^"]+)",.*?load:\(\)=>import\("[^"]+"\)\},?', re.S)
    vistos = set(); partes = []; ultimo = 0; n = 0
    for m in ent.finditer(t):
        if m.group(1) in vistos:
            partes.append(t[ultimo:m.start()]); ultimo = m.end(); n += 1
        vistos.add(m.group(1))
    partes.append(t[ultimo:])
    if n:
        open(nav, 'w', encoding='utf-8').write(''.join(partes))
    return n


def leads_padroes():
    """Toda tela de exemplo avisa que a montagem é de referência e a tela oficial está em Telas da v2."""
    nota = ' (montagem de referência; a tela oficial está em Telas da v2)'
    n = 0
    nav = os.path.join(root, 'design-system/site/nav.js'); t = open(nav, encoding='utf-8').read(); t0 = t
    t = t.replace(nota + '"', '"')  # o menu fica só com a descrição curta
    for f in sorted(os.listdir(pages)):
        if not f.startswith('padroes__Tela') or f == 'padroes__telas-v2.js':
            continue
        p = Pagina(f[:-3])
        m = re.search(r'(<p class=doc-header__lead>)([^<]*)(</p>)', p.j)
        if m and 'montagem de referência' not in m.group(2):
            p.j = p.j.replace(m.group(0), m.group(1) + m.group(2) + nota + m.group(3), 1); p.alterou = True; n += 1
        p.salvar()
    if t != t0:
        open(nav, 'w', encoding='utf-8').write(t)
    return n


def tipos():
    """index.d.ts: o Button da v2 tem a ênfase dark."""
    f = os.path.join(root, 'design-system/files/index.d.ts'); t = open(f, encoding='utf-8').read()
    velho = 'hierarchy?: "transparent" | "loud" | "quiet" | "destructive" | null | undefined;'
    novo = 'hierarchy?: "transparent" | "loud" | "quiet" | "dark" | "destructive" | null | undefined;'
    if velho in t:
        open(f, 'w', encoding='utf-8').write(t.replace(velho, novo)); return True
    assert novo in t, 'index.d.ts: tipo do Button não encontrado'
    return False


def agents_sem_repeticao():
    """AGENTS.md: linhas de tabela repetidas por reconstruções anteriores (a mesma linha 5 vezes)."""
    f = os.path.join(root, 'design-system/files/AGENTS.md'); linhas = open(f, encoding='utf-8').read().split('\n'); vistas = set(); out = []
    for l in linhas:
        if l.startswith('|') and not set(l) <= set('|- :'):
            chave = l.strip()
            if chave in vistas:
                continue
            vistas.add(chave)
        elif not l.startswith('|'):
            vistas = set()
        out.append(l)
    novo = '\n'.join(out)
    if novo != '\n'.join(linhas):
        open(f, 'w', encoding='utf-8').write(novo); return True
    return False


def agents_pagina():
    """A página "Para IAs" repete as tabelas do AGENTS.md: fica igual ao arquivo."""
    md = open(os.path.join(root, 'design-system/files/AGENTS.md'), encoding='utf-8').read()
    sec = md.split('## Valores que se conferem')[1].split('\n## ')[0]
    linhas = [l for l in sec.split('\n') if l.startswith('|') and not set(l) <= set('|- :')][1:]
    cel = lambda t: re.sub(r'`([^`]+)`', r'<code>\1</code>', t.strip())
    corpo = '<tbody>\n' + ''.join('<tr>\n<td>%s</td>\n<td>%s</td>\n</tr>\n' % tuple(cel(c) for c in l.strip().strip('|').split('|', 1)) for l in linhas) + '</tbody>'
    p = Pagina('recursos__agents')
    i = p.j.index('Valores que se conferem</h2>'); a = p.j.index('<tbody>', i); z = p.j.index('</tbody>', a) + len('</tbody>')
    if p.j[a:z] != corpo:
        p.j = p.j[:a] + corpo + p.j[z:]; p.alterou = True
    p.troca('O sistema segue só o que está marcado <code>NOVO</code>.', 'O sistema segue a versão 2 do app (as telas marcadas <code>NOVO</code>).')
    return p.salvar()


def llms():
    f = os.path.join(root, 'design-system/llms.txt'); t = open(f, encoding='utf-8').read(); linhas = t.split('\n'); vistos = set(); out = []
    for l in linhas:
        if l.startswith('- #/'):
            if l in vistos: continue
            vistos.add(l)
        out.append(l)
    novo = '\n'.join(out).replace('- #/recursos/telas-novas: Handoff de referência', '- #/recursos/telas-novas: Registro do handoff anterior (histórico)')
    if novo != t:
        open(f, 'w', encoding='utf-8').write(novo); return True
    return False


def previews():
    """Rótulos dos previews: números de tela do handoff anterior viram o nome da tela da v2."""
    troca = {
        'DeliverySummaryCard': [('(Tela 6)', '(Entrega marcada)'), ('(Tela 28)', '(Entrega marcada · calendário ok)')],
        'EmptyState': [('(Tela 6)', '(Ranking: Meu espaço sem CEP)'), ('(Tela 8)', '(Ranking: Amigos vazio)')],
        'ResultScreen': [('(Tela 12, Pedido enviado)', '(Ranking: Pedido enviado)'), ('(Tela 14, permissão de contatos)', '(Ranking: Permissão de contatos)'),
                         ('Tela 19 (Recompensas)', 'Recompensas: Nova meta definida'), ('Tela 22 (Recompensas)', 'Recompensas: Recompensa resgatada')],
        'Toast': [('(Telas 5 e 10)', '(Ranking: Subiu no ranking e Amigo entrou)')],
    }
    ch = False
    for nome, pares in troca.items():
        f = os.path.join(root, 'design-system/previews/%s.html' % nome); t = open(f, encoding='utf-8').read(); t2 = t
        for v, n in pares:
            if v in t2: t2 = t2.replace(v, n)
        if t2 != t:
            open(f, 'w', encoding='utf-8').write(t2); ch = True
    return ch


if __name__ == '__main__':
    r = [primeiros_passos(), guias(), padroes_e_registro(), figma_residual(), descricoes(), frases(), nav_sem_duplicatas(), leads_padroes(), tipos(), agents_sem_repeticao(), agents_pagina(), llms(), previews()]
    print('guias alterados:', r)
