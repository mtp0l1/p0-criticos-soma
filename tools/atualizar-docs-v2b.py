# -*- coding: utf-8 -*-
"""Segunda passada nos textos de componentes: medidas e materiais da v2 (idempotente)."""
import os, re
def validar_pagina(path, texto):
    """Páginas são `export default () => "<html em uma string JS>";`. Confere que a string é JSON válido (sem quebra de linha real nem aspas soltas)."""
    import json
    cab='export default () => '
    if not texto.startswith(cab): return
    try: json.loads(texto[len(cab):].rstrip().rstrip(';'))
    except Exception as e: raise SystemExit('PÁGINA INVÁLIDA depois da edição: '+path+' ('+str(e)[:80]+'). Nada foi gravado.')

root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..')); pages=os.path.join(root,'design-system/site/pages')
P={
'Sheet':[('raio radius-xlarge no topo','raio radius-sheet (36px) no topo'),('sombra shadow-high, padding space-mini','fundo background, sombra shadow-sheet, padding space-mini')],
'Drawer':[('raio radius-xlarge em cima, shadow-high','raio radius-sheet em cima, shadow-sheet')],
'Switch':[('44 × 24px. Desligado: trilho text-secondary e bolinha branca. Ligado: trilho surface-inverse e bolinha primary. Os dois trilhos passam de 3:1 contra o branco; o laranja sozinho não passaria.','52 × 32px. Desligado: trilho interactive-fill-disabled e bolinha branca com sombra. Ligado: trilho primary (laranja). A posição da bolinha também mostra o estado, não só a cor. O trilho ligado tem 2,0:1 contra o branco, abaixo dos 3:1 de borda de controle; a v2 aceita isso porque o estado não depende só da cor.')],
'TabBar':[('Fundo surface-primary, divisor de topo border-primary, altura size-tabbar (64px).','Barra flutuante: surface-primary a 86% com desfoque, raio radius-3xlarge, sombra shadow-float, altura size-tabbar (64px), 16px de cada lado e 24px do fundo. A aba ativa vira pílula laranja com o nome; as outras mostram só o ícone.')],
'Header':[('Voltar (escuro) e ação (icon-brand-strong) são IconButton de size-touch (44px), mesmo onde o Figma desenha círculos de 32 ou 36px: a área tocável não encolhe.','Voltar e ação são discos brancos de size-back (44px) com shadow-card, e o título fica centralizado.')],
'SegmentedControl':[('Contêiner surface-primary com borda border-primary, raio radius-medium, padding space-xnano.','Trilho surface-secondary em pílula (radius-full), padding space-xnano. O segmento ativo é azul-marinho (surface-inverse) com texto text-inverse.'),('no mínimo 44px de altura (alvo de toque do sistema)','40px de altura dentro de um trilho de 48px (a área tocável do trilho passa dos 44px)')],
'PillTabs':[('Pílulas de 44px de altura, radius-full. Ativa: interactive-fill-loud com text-on-loud (navy) e sem borda. Inativa: fundo surface-primary, borda border-highlight e texto foreground.','Pílulas de 40px (size-chip), radius-full. Ativa: surface-inverse com text-inverse. Inativa: fundo surface-primary, sombra shadow-card e texto foreground.')],
'Card':[('outline (borda border sobre fundo branco, padrão)','outline (fundo branco com shadow-card, padrão)'),('Raio radius-large, padding','Raio radius-xlarge (24px), padding'),('Sem sombra: o sistema é plano. Card inteiro','Sombra suave (shadow-card) só nos cartões sobre o fundo creme. Card inteiro')],
'Badge':[('Texto de 12px peso 500, altura mínima 24px, radius-full, padding space-micro.','Texto de 12px peso 700, altura mínima 24px, radius-full, padding de 10px.')],
'ListRow':[('help: fundo surface-accent, raio radius-medium,','help: fundo surface-primary com shadow-card, raio radius-large (20px), altura mínima size-row (64px),')],
'SearchField':[('Altura size-input, raio radius-medium, padding space-mini,','Pílula de size-button (56px), radius-full, sombra shadow-card, padding space-mini,'),('Borda border-strong (3,98:1) por padrão.','Borda border (suave) e sombra shadow-card por padrão.')],
'Toast':[('Raio radius-small, padding','Raio radius-medium (16px), sombra shadow-high, padding'),('borda, raio radius-large) com o ícone','sombra shadow-high, raio radius-xlarge) com o ícone')],
'Checkbox':[('Caixa de 20px, raio radius-xsmall, borda input. Marcada: surface-inverse com check text-inverse. O laranja não é usado aqui porque não passa de 3:1 contra o branco.','Caixa de 26px, raio radius-xsmall (8px), borda input de 2px. Marcada: laranja (primary) com a marca de check em azul-marinho; a marca também mostra o estado, não só a cor.')],
'TextField':[('borda border-strong, raio radius-medium. Rótulo e campo ficam a 8px.','borda border, raio radius-large, shadow-card. O rótulo fica dentro do campo, a 12px do topo.')],
}
TOK=re.compile(r'\b((?:radius|shadow|size|space|surface|border|text|interactive|icon|selected|indicator|feedback|background)-[a-z0-9-]+|primary|focus-ring)\b')
TAG=r'(?:</?(?:code|em|strong)>)*'
def mk(old):
    return re.compile(TAG.join(re.escape(ch) for ch in old))
def codify(t): return TOK.sub(lambda m:'<code>'+m.group(1)+'</code>',t)
n=0
for name,pairs in P.items():
    p=os.path.join(pages,f'componentes__{name}.js'); s=open(p,encoding='utf-8').read(); c=0
    for a,b in pairs:
        rx=mk(a); nb=codify(b)
        if nb in s: continue
        s2,k=rx.subn(lambda m:nb,s,count=1)
        if k: s=s2; c+=1
        else: print('  não achei',name,a[:50])
    validar_pagina(p,s); open(p,'w',encoding='utf-8').write(s); n+=c
print('frases atualizadas:',n,'de',sum(len(v) for v in P.values()))
a=os.path.join(root,'design-system/files/AGENTS.md'); s=open(a,encoding='utf-8').read()
old='| Contraste | 4,5:1 para texto, 3:1 para ícone e borda de controle |'
new='| Contraste | 4,5:1 para texto, 3:1 para ícone e borda de controle. Exceção documentada da v2: campo de texto (rótulo sempre visível e sombra) e interruptor/caixa laranjas (o estado também aparece na posição ou na marca) |'
if old in s: open(a,'w',encoding='utf-8').write(s.replace(old,new))
