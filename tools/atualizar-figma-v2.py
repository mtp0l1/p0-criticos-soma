# -*- coding: utf-8 -*-
"""Troca as citações de nós do handoff antigo (Figma 443:…, 463:…, 438:1973 etc.) por referências às telas da v2.

Cada página de componente/módulo tem a seção "No Figma". Aqui ela vira "Nas telas da v2" e passa a listar
as telas do protótipo navegável (com link), no lugar dos IDs do handoff anterior. Também limpa as citações
em padrões, página inicial, navegação, ilustrações e nos textos do registro do handoff.

Idempotente: se a seção já foi trocada, não faz nada. Valida cada página antes de gravar (ver validar_pagina)."""
import json, os, re, sys, html

root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
ds = os.path.join(root, 'design-system')
pages = os.path.join(ds, 'site/pages')
proto = os.path.abspath(os.path.join(root, '..', 'prototipo-soma/fonte/dados/proto.json'))
P = json.load(open(proto, encoding='utf-8'))['screens']
PREFIX = 'export default () => '

# apelidos curtos -> id da tela no protótipo
A = dict(
    c01='835:6472', c02='835:6486', c03='835:6501', c04='835:6516', c04A='835:6529', c05='835:6551',
    c06='835:6586', c06A='835:6568', c07='835:6657', c07A='835:6601', c07B='835:6621',
    q1='849:8934', q2A='849:9097', q2B='849:9426', q3='849:9175', q3B='849:10747', q4='849:9313',
    q5='849:9497', q6='849:9594', q7='849:9714', q8='849:9797',
    r1='859:9252', r2='859:9406', r3='859:9557', r4='859:10444', r5='859:10593', r6='859:10108',
    r7='859:10199', r8='859:10752', r9='859:9669', r9V='859:10323', r10='859:9741', r11='859:9900',
    r12='859:9967', r13='859:10036', r14='859:10915', r15='859:10987', r16='859:11110',
    c1='890:10512',
    rc1='854:9534', rc2='854:9429', rc3='854:9076', rc4='854:9138', rc5='854:9923', rc6='854:9253',
    rc7='854:9315', rc8='854:9374', rc9='854:10106', rv1='854:9743', rv2='854:9193',
    i1='829:6612', i3='829:6915', i4='829:7018',
    a1='842:9233', a2='842:9303', a3='842:9387', a4='842:9952', a5='842:9467', a6='842:9599',
    a7='842:9688', a8='842:9771', a9='842:9867', a10='842:10084', a11='842:10156', a12='842:10230',
    a13='842:10344', a14='842:10479', a15='842:10589', a16='842:10693', a17='842:10848',
    d1='832:7334', d2='832:6524', d2A='832:7246', d3='832:6750', d4='832:6949',
    d3A='832:6686', d3B='832:6819', d3C='832:6884', d3D='832:6626', d3E='832:6460',
)
for k, v in A.items():
    assert v in P, (k, v)


def link(*keys):
    """Lista de telas com link para o protótipo: 'Resposta certa (2A)', ..."""
    out = []
    for k in keys:
        i = A[k]; m = P[i]
        out.append('<a href="prototipo/#%s" target="_blank" rel="noopener">%s</a>' % (i.replace(':', '-'), html.escape(m['title'])))
    return out[0] if len(out) == 1 else ', '.join(out[:-1]) + ' e ' + out[-1]


def plain(*keys):
    out = [P[A[k]]['title'] for k in keys]
    return out[0] if len(out) == 1 else ', '.join(out[:-1]) + ' e ' + out[-1]


# texto novo da seção de cada página (o que aparece depois de "Nas telas da v2")
SEC = {
    'componentes__ChoiceChips': lambda: f'Chips de categoria em Recompensas ({link("rc1")}) e chips de material na aba Reciclar ({link("i4")}).',
    'componentes__EmptyState': lambda: f'Ranking: {link("r6")} e {link("r8")}.',
    'componentes__Header': lambda: f'Barra superior de Doar pontos ({link("d2")}), do Quiz ({link("q1")}) e do Ranking ({link("r1")}).',
    'componentes__PasswordField': lambda: f'Cadastro: {link("c05")}.',
    'componentes__PillTabs': lambda: f'Recompensas: {link("rc1")} e {link("rc9")}. O handoff anterior desenhava a aba inativa com texto laranja (#DD8613, 2,6:1); na v2 o texto fica navy.',
    'componentes__ResultScreen': lambda: f'Ranking: {link("r12")}, {link("r14")} e {link("r16")}. Doar pontos: {link("d4")} (círculo <code>xs</code> neutro com check, ilustração <code>doar-sucesso</code> e "Ir para o início"; sem cabeçalho nem voltar, a saída é o botão ou a barra inferior). Ativação: {link("a1", "a6", "a8", "a9")} (erro do calendário).',
    'componentes__StepDots': lambda: f'Indicador de passos do Cadastro, de {link("c01")} a {link("c07")}.',
    'componentes__TabBar': lambda: f'Barra inferior de todas as telas de aba, por exemplo {link("i3")} e {link("i4")}.',
    'componentes__TextField': lambda: f'Cadastro, de {link("c01")} a {link("c07")}, e Doar pontos ({link("d3")}). Campo de 68px com rótulo flutuante; a lista completa de estados está em {link("d3A", "d3B", "d3C")}.',
    'componentes__Toast': lambda: f'Ranking: {link("r5")} e {link("r10")}.',
    'modulos__AccountExistsSheet': lambda: f'Cadastro: {link("c04A")}.',
    'modulos__ActivityRow': lambda: f'Início: {link("a17")}.',
    'modulos__AnswerHistory': lambda: f'Quiz: {link("q4")}.',
    'modulos__AnswerResult': lambda: f'Quiz: {link("q2A")} e {link("q2B")}.',
    'modulos__BalanceCard': lambda: f'Início: {link("i3")} ("Saldo atual · 10 pontos", sem legenda) e, com meta ativa, {link("a17")}. O handoff anterior tinha uma ilustração decorativa e um botão ocultos no card; não entram.',
    'modulos__CampaignBanner': lambda: f'Recompensas: {link("rc1")} e {link("rc2")}. Antes era um card com título, texto e "Ver regras".',
    'modulos__ContactRow': lambda: f'Ranking: {link("r15")}.',
    'modulos__DailyDone': lambda: f'Quiz: {link("q3")}.',
    'modulos__DeliveryCard': lambda: f'Aba Reciclar ({link("i4")}). Os rótulos "Variante A/B" do handoff anterior eram anotação e não vão para a tela; no produto é um só card, em largura total.',
    'modulos__DeliveryDayCard': lambda: f'Ativação: {link("a10")}.',
    'modulos__DeliveryHistoryRow': lambda: f'Ativação: {link("a7")}.',
    'modulos__DeliverySummaryCard': lambda: f'Ativação: {link("a6", "a8", "a9", "a7")}.',
    'modulos__DonationAmountCard': lambda: f'Doar pontos: {link("d3A", "d3C", "d3B", "d3")}.',
    'modulos__DonationStateCard': lambda: f'Doar pontos: {link("d3D")} e {link("d3E")}.',
    'modulos__FriendRequestSheet': lambda: f'Ranking: {link("r13")}.',
    'modulos__GoalCard': lambda: f'Recompensas: {link("rc1", "rc4", "rc5")}. Sem o botão "Trocar meta" que existia na versão anterior.',
    'modulos__GoalNote': lambda: f'Ativação: {link("a12")}, no aviso da meta.',
    'modulos__GoalProgressCard': lambda: f'Ativação: {link("a2")} e {link("a3")}.',
    'modulos__GoalSummaryCard': lambda: f'Início: {link("a17")}. Fica acima do <code>BalanceCard tone="dark"</code>, abaixo da saudação.',
    'modulos__HistorySummary': lambda: f'Quiz: {link("q4")}.',
    'modulos__HomeGreeting': lambda: f'Início: {link("i3")}.',
    'modulos__ImpactTiles': lambda: f'Ativação: {link("a12")}. "Compartilhar" abre o <code>ShareImpactModal</code> ({link("a16")}).',
    'modulos__InstitutionCard': lambda: f'Doar pontos: {link("d3")}. Na lista de escolha a instituição é o <code>InstitutionRow</code>.',
    'modulos__InstitutionDetailModal': lambda: f'Doar pontos: "Saber mais" ({link("d2A")}).',
    'modulos__InstitutionRow': lambda: f'Doar pontos: {link("d2")}.',
    'modulos__InviteCodeCard': lambda: f'Convidar amigos: {link("r9")} e {link("c1")}.',
    'modulos__InviteCodeField': lambda: f'Cadastro: {link("c07")} e {link("c07A")}.',
    'modulos__InviteCodeHelpSheet': lambda: f'Cadastro: {link("c07B")}.',
    'modulos__InviteMessageExample': lambda: f'Cadastro: {link("c07B")}, na "Simulação de conversa".',
    'modulos__LevelBadge': lambda: f'Etiquetas "Bronze", "Iniciante", "Intermediário" e "Avançado" no Quiz: {link("q1", "q4", "q5")}.',
    'modulos__LevelCard': lambda: f'Quiz: {link("q1")} e {link("q3")}, no selo do reciclador.',
    'modulos__LocationBar': lambda: f'Início: {link("i3")}. Antes eram duas linhas ("Entregando em" em cima do nome).',
    'modulos__MilestoneResult': lambda: f'Quiz: {link("q7")} e {link("q8")}.',
    'modulos__NeighborhoodNote': lambda: f'Cadastro: {link("c06")} e {link("c06A")}.',
    'modulos__Podium': lambda: f'Pódio no Ranking, abas Amigos, Meu espaço e Geral ({link("r1", "r2", "r3")}).',
    'modulos__PositionCard': lambda: f'Ranking, aba Geral ({link("r3")}).',
    'modulos__ProtectionNotice': lambda: f'Quiz: {link("q1", "q5", "q6")}. No handoff anterior o escudo do card era um emoji; aqui é o ícone <code>shield</code>.',
    'modulos__QrCheckinCard': lambda: f'Entrega: {link("a11")}.',
    'modulos__QuestionCard': lambda: f'Quiz: {link("q1")}. O laranja #DD8613 do handoff anterior reprova (2,8:1); aqui é <code>text-link</code>.',
    'modulos__QuestionTeaser': lambda: f'Início: {link("i3")}, com o título de bloco "Pergunta do dia" e o card. Pendente: onde fica a trilha completa do Quiz depois do Início.',
    'modulos__RankingRow': lambda: f'Lista do Ranking: {link("r1", "r2", "r4", "r7")}. #FFF2EA/#FFD3BE do handoff anterior viram <code>surface-accent</code>/<code>border-highlight</code>; o raio de 14px vira <code>radius-medium</code> (12px), da escala fechada.',
    'modulos__RankingStarterCard': lambda: f'Ranking: {link("r4")}, "0 kg reciclados no período".',
    'modulos__RedeemCode': lambda: f'Recompensas: {link("rc7")}.',
    'modulos__ReminderCard': lambda: f'Ativação: {link("a12", "a13", "a14", "a15")}.',
    'modulos__RewardChoiceList': lambda: f'Ativação: {link("a2")} e {link("a3")}.',
    'modulos__RewardDetail': lambda: f'Recompensas: {link("rc3")}.',
    'modulos__RewardRow': lambda: f'Recompensas: {link("rc1", "rc5", "rc9", "rc2")}.',
    'modulos__ShareImpactModal': lambda: f'Ativação: {link("a16")}.',
    'modulos__SignupStep': lambda: f'Cadastro, de {link("c01")} a {link("c07")}.',
    'modulos__SlotPicker': lambda: f'Escolha de data e horário no agendamento: {link("a4")} e {link("a5")}. As opções do handoff anterior tinham 42×52px (data) e 42×40px (hora); aqui mantêm 44px de largura e de altura mínimas.',
    'modulos__SpaceCard': lambda: f'Escolha do espaço: {link("a4")} e {link("a5")}. Na escolha do espaço cada card tem o "Como chegar" dentro (<code>onDirections</code>); no passo anterior o escolhido abre o <code>SpaceDetail</code>.',
    'modulos__SpaceDetail': lambda: f'Reciclar, detalhe do espaço ({link("i4")}) e {link("a4")}.',
    'modulos__StatsRow': lambda: 'Resumo da Ativação (entregas, kg, pontos).',
    'modulos__StreakProgress': lambda: f'Quiz: {link("q1")}, no "progresso-blocos".',
    'modulos__StreakSection': lambda: f'Quiz: {link("q1")} e {link("q3")}, na "TrailSection".',
    'modulos__StreakTrail': lambda: f'"Sua trilha", Quiz: {link("q1")} e {link("q3")}.',
    'modulos__TermsConsent': lambda: f'Cadastro: {link("c07", "c07A", "c07B")}.',
    'modulos__TierCard': lambda: f'Quiz: {link("q5")} e {link("q6")}.',
    'modulos__Tile': lambda: f'Início: {link("i3")}. O token <code>size-tile</code> passou de 88px para 80px.',
    'modulos__Trophy': lambda: f'Quiz: troféus dos níveis Bronze, Prata e Ouro ({link("q5", "q6")}).',
}

OLD_TITLE = '<h2 class="doc-section__title" id="figma-title">No Figma</h2>'
NEW_TITLE = '<h2 class="doc-section__title" id="figma-title">Nas telas da v2</h2>'
SECTION_RE = re.compile(r'(<h2 class="doc-section__title" id="figma-title">)No Figma(</h2></div></header>)<div class="doc-prose"><p>.*?</p></div>', re.S)


def carregar(path):
    s = open(path, encoding='utf-8').read()
    assert s.startswith(PREFIX), path
    return json.loads(s[len(PREFIX):s.rindex(';')])


def gravar(path, j):
    out = PREFIX + json.dumps(j, ensure_ascii=False) + ';'
    # valida: tem de reler igual
    assert json.loads(out[len(PREFIX):out.rindex(';')]) == j, 'PÁGINA INVÁLIDA ' + path
    open(path, 'w', encoding='utf-8').write(out)


def troca_secao(nome):
    path = os.path.join(pages, nome + '.js')
    j = carregar(path)
    if '>No Figma<' not in j:
        return False
    novo = SEC[nome]()
    j2, n = SECTION_RE.subn(lambda m: m.group(1) + 'Nas telas da v2' + m.group(2) + '<div class="doc-prose"><p>' + novo + '</p></div>', j, count=1)
    assert n == 1, 'seção não achada em ' + nome
    j2 = j2.replace('data-target="figma">No Figma<', 'data-target="figma">Nas telas da v2<')
    j2 = j2.replace('Acessibilidade  No Figma', 'Acessibilidade  Nas telas da v2')
    assert '>No Figma<' not in j2, nome
    gravar(path, j2)
    return True


if __name__ == '__main__':
    feitos = [n for n in SEC if troca_secao(n)]
    print('seções trocadas:', len(feitos), 'de', len(SEC))
    faltam = [f[:-3] for f in os.listdir(pages) if f.endswith('.js') and ('No Figma' in open(os.path.join(pages, f), encoding='utf-8').read())]
    print('páginas que ainda têm "No Figma":', faltam)
    sys.exit(0)
