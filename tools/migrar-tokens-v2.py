# -*- coding: utf-8 -*-
"""Migra o Campana para os valores da versão 2 do app So+ma. Reescreve files/tokens.json, files/tokens.css, assets/tokens.css e o preset Tailwind.
Rode: python3 migrar-tokens-v2.py   (idempotente: parte sempre de tokens-base-v4.json)"""
import json, os, re, shutil
ds=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','design-system'))
base=os.path.join(os.path.dirname(__file__),'tokens-base-v4.json')
if not os.path.exists(base): shutil.copy(os.path.join(ds,'files/tokens.json'),base)
t=json.load(open(base,encoding='utf-8'))
def lum(h):
    h=h.lstrip('#'); r,g,b=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    f=lambda c:c/12.92 if c<=.03928 else ((c+.055)/1.055)**2.4
    return .2126*f(r)+.7152*f(g)+.0722*f(b)
def cr(a,b):
    la,lb=sorted([lum(a),lum(b)],reverse=True); return (la+.05)/(lb+.05)
NEW={'orange':'#FFA125','orange-deep':'#9E5400','orange-hover':'#F29200','orange-pressed':'#E08700','navy':'#21344E','ink-secondary':'#56697F','white':'#FFFFFF',
'surface-tile':'#F1EDE6','surface-warm':'#FFF6E8','warm-pressed':'#FFEBD0','tile-pressed':'#E8E2D6','line':'#E8E2D6','line-strong':'#8A8374',
'danger-ax':'#C62F2F','danger-soft':'#FBE5E5','danger-ink':'#C62F2F','success-soft':'#E6F6EC','success-ink':'#167A3F','ink':'#21344E','paper':'#FFFFFF','highlight':'#FFA125',
'sky-soft':'#DCEBFB','danger-ax-hover':'#A82525','danger-ax-pressed':'#8A1F1F'}
OLD={x['name']:x['value']['light'] for x in t['color']['tokens'] if not x['value']['light'].startswith('{')}
hexmap={OLD[k].upper():v for k,v in NEW.items() if k in OLD and OLD[k].upper()!=v.upper()}
toks=t['color']['tokens']
for x in toks:
    if x['name'] in NEW: x['value']['light']=NEW[x['name']]
# núcleo novo
def add_core(after,name,val,usage):
    i=next(k for k,x in enumerate(toks) if x['name']==after); toks.insert(i+1,{'name':name,'value':{'light':val},'usage':usage})
add_core('paper','canvas','#FBF7F1','Núcleo (cor crua). Creme do fundo de toda tela da v2. Use background-primary.')
add_core('canvas','warm-150','#E9E4DA','Núcleo (cor crua). Fundo do botão desabilitado. Use interactive-fill-disabled.')
add_core('warm-150','ink-disabled','#8A94A3','Núcleo (cor crua). Texto de botão desabilitado (isento de contraste). Use interactive-text-disabled.')
# tons de categoria: tile de ícone (instituições, materiais, "Como resgatar") e avatar, como nas telas da v2
add_core('sky-soft','tint-green','#DDF3E4','Núcleo (cor crua). Verde claro do tile de categoria. Use surface-tint-green.')
add_core('tint-green','tint-lavender','#E9E2FB','Núcleo (cor crua). Lavanda do tile de categoria. Use surface-tint-lavender.')
add_core('tint-lavender','tint-pink','#FCE1E4','Núcleo (cor crua). Rosa claro do tile de categoria. Use surface-tint-pink.')
add_core('tint-pink','tint-yellow','#FFF1B8','Núcleo (cor crua). Amarelo claro do tile de categoria. Use surface-tint-yellow.')
add_core('tint-yellow','podium-second','#DDD6C7','Núcleo (cor crua). Degrau do 2º lugar no pódio. Use surface-podium-2.')
add_core('podium-second','podium-third','#F0C9A0','Núcleo (cor crua). Degrau do 3º lugar no pódio. Use surface-podium-3.')
def add_sem(after,name,ref,usage): add_core(after,name,ref,usage)
add_sem('surface-info','surface-podium-2','{podium-second}','Semântico. Degrau do 2º lugar no pódio do ranking (o 1º usa o laranja da marca).')
add_sem('surface-info','surface-podium-3','{podium-third}','Semântico. Degrau do 3º lugar no pódio do ranking.')
for n,ref,cor in (('peach','{warm-pressed}','pêssego'),('green','{tint-green}','verde'),('blue','{sky-soft}','azul'),('lavender','{tint-lavender}','lavanda'),('pink','{tint-pink}','rosa'),('yellow','{tint-yellow}','amarelo')):
    add_sem('surface-info','surface-tint-'+n,ref,f'Semântico. Tile de ícone de categoria e avatar em {cor}. Ícone e inicial em foreground por cima (mín. 10:1). Varia por categoria, nunca por estado.')
SEM={'background-primary':'{canvas}','interactive-fill-disabled':'{warm-150}','interactive-text-disabled':'{ink-disabled}'}
for x in toks:
    if x['name'] in SEM: x['value']['light']=SEM[x['name']]
# textos de uso: troca os hex antigos
def fix(s):
    for a,b in hexmap.items(): s=s.replace(a,b).replace(a.lower(),b)
    return s
for x in toks: x['usage']=fix(x['usage'])
# textos específicos que citavam o app antigo
toks_by={x['name']:x for x in toks}
toks_by['orange']['usage']='Núcleo (cor crua): não aplique direto em tela, use o token semântico que aponta para ela. Laranja do botão primário (#FFA125). Preenchimento de botão e aba ativa, ícones de linha. Como texto sobre claro reprova (2,0:1): texto usa orange-deep; sobre laranja o texto é sempre azul-marinho (6,2:1).'
toks_by['paper']['usage']='Núcleo (cor crua). Branco das superfícies: cartões, campos, linhas e barra inferior. Use surface-primary.'
toks_by['background-primary']['usage']='Semântico. Creme (#FBF7F1) do fundo de toda tela. Cartões brancos se destacam sobre ele.'
# contraste (relatório)
rep=[('text-secondary sobre canvas',NEW['ink-secondary'],'#FBF7F1'),('text-link sobre branco',NEW['orange-deep'],'#FFFFFF'),('success-ink sobre success-soft',NEW['success-ink'],NEW['success-soft']),('danger-ink sobre danger-soft',NEW['danger-ink'],NEW['danger-soft']),('navy sobre orange',NEW['navy'],NEW['orange']),('borda de controle sobre branco',NEW['line-strong'],'#FFFFFF')]
print('\n'.join(f'{n}: {cr(a,b):.2f}' for n,a,b in rep))
t['color']['note']='Três camadas: núcleo (valores brutos da v2), semântico Campana (o papel) e aliases shadcn/ui (background, primary, ring…). Telas usam semânticos ou aliases; nunca o núcleo. Valores da versão 2 do app, com contraste AA medido.'
# espaço
t['spacing']['note']='Grade de 4px. Meios-passos de 6, 10, 14 e 18 só dentro de componentes. Valores da v2.'
# raio
t['radius']={'note':'Quanto maior a superfície, maior o raio. Filho nunca com raio maior que o contêiner. Botões e discos são pílula (radius-full).','tokens':[
{'name':'radius-xsmall','value':'8px','usage':'Checkbox e marcas pequenas dentro de controle.'},
{'name':'radius-small','value':'12px','usage':'Miniatura, tile de ícone, selo grande, toast.'},
{'name':'radius-medium','value':'16px','usage':'Aviso (Message), nota, linha compacta, opção de resposta.'},
{'name':'radius-large','value':'20px','usage':'Campo de texto, linha de lista, cartão pequeno.'},
{'name':'radius-xlarge','value':'24px','usage':'Cartão, bloco de conteúdo, modal.'},
{'name':'radius-2xlarge','value':'28px','usage':'Botão de 56px (pílula).'},
{'name':'radius-3xlarge','value':'32px','usage':'Barra inferior flutuante.'},
{'name':'radius-sheet','value':'36px','usage':'Cantos superiores do bottom sheet.'},
{'name':'radius-full','value':'999px','usage':'Chip, selo, disco de ícone, segmento, controle segmentado.'}]}
# tamanhos
sz={x['name']:x for x in t['size']['tokens']}
sz['size-button']['value']='56px'; sz['size-button']['usage']='Altura do botão (pílula). Largura total na tela.'
sz['size-input']['value']='68px'; sz['size-input']['usage']='Altura do campo de formulário, com rótulo flutuante. A busca usa 56px (size-button).'
sz['size-header']['usage']='Altura mínima do cabeçalho (Voltar de 44px, título e ajuda).'
extra=[('size-chip','40px','Chip de filtro.'),('size-row','64px','Linha de lista.'),('size-tab-item','48px','Item da barra inferior.'),('size-back','44px','Botão Voltar (disco).'),('size-disc','44px','Disco de ícone.'),('size-disc-small','26px','Disco de ícone pequeno (dentro de chip).')]
for n,v,u in extra: t['size']['tokens'].append({'name':n,'value':v,'usage':u})
t['size']['note']='Medidas da v2, em px. Alvo de toque nunca menor que 44px.'
# sombra
t['shadow']={'note':'Sombra suave em azul-marinho com transparência, nunca preta. Duas camadas: uma curta, uma longa. Só cartão, flutuante, folha e botões em destaque ganham sombra.','tokens':[
{'name':'shadow-card','value':'0 1px 2px rgba(33,52,78,0.06), 0 10px 28px rgba(33,52,78,0.07)','usage':'Cartão, campo, linha de lista e botão claro sobre o fundo creme.'},
{'name':'shadow-high','value':'0 8px 20px rgba(33,52,78,0.16)','usage':'Popover, conteúdo do Select, toast.'},
{'name':'shadow-float','value':'0 2px 4px rgba(33,52,78,0.08), 0 14px 32px rgba(33,52,78,0.14)','usage':'Barra inferior flutuante.'},
{'name':'shadow-sheet','value':'0 -4px 12px rgba(33,52,78,0.10), 0 -10px 40px rgba(33,52,78,0.20)','usage':'Bottom sheet (sombra para cima).'},
{'name':'shadow-dark','value':'0 2px 4px rgba(33,52,78,0.08), 0 10px 22px rgba(33,52,78,0.18)','usage':'Botão escuro e cartão de saldo.'},
{'name':'shadow-glow','value':'0 10px 24px rgba(255,161,37,0.38)','usage':'Somente o botão laranja primário.'}]}
# tipografia
TS={'page-title':(28,34,700,-3,0,'Título de tela e de passo do cadastro. Title L.'),'screen-title':(22,28,700,-2,0,'Título de folha, de tela de estado e valor médio. Title M.'),'section-title':(18,24,600,-2,0,'Título de seção e de cartão. Title S.'),'subtitle':(17,22,600,0,0,'Título de linha e de bloco. Heading.'),'header-title':(17,22,600,0,0,'Título centralizado do cabeçalho. Heading.'),'stat-number':(22,28,700,-2,0,'Valor de estatística. Title M.'),'balance-number':(48,56,700,-4,0,'Saldo e numerais de destaque. Display XL.'),'body':(15,22,400,0,0,'Texto padrão. Body.'),'body-strong':(15,22,600,0,0,'Texto padrão em ênfase. Body Strong.'),'body-small':(14,20,400,0,0,'Texto de apoio. Body S.'),'label':(14,20,600,0,0,'Rótulo e apoio em ênfase. Body S Strong.'),'caption':(12,16,500,0,0,'Meta, dica e legenda. Micro.'),'eyebrow':(12,16,600,10,1,'Rótulo em caixa-alta. Overline.'),'tab-label':(11,14,600,8,1,'Rótulo mínimo. Overline S.'),'button':(16,22,700,-1,0,'Rótulo de botão. Button.')}
styles=t['type']['groups'][0]['styles']
for s in styles:
    f,l,w,ls,up,u=TS[s['name']]; s['fontSize']=f'{f}px'; s['lineHeight']=f'{l}px'; s['fontWeight']=w; s['letterSpacing']=f'{ls/100:.2f}em'; s['uppercase']=bool(up); s['usage']=u
styles.append({'name':'display','fontSize':'32px','lineHeight':'38px','fontWeight':700,'letterSpacing':'-0.03em','uppercase':False,'usage':'Título de tela de sucesso e estados. Display.','sample':'Doação realizada!'})
t['version']=5
# remove das descrições as referências ao desenho antigo (Neutral/Level, "do Figma das telas novas")
LIMPA=[('Laranja escuro do Figma das telas novas (cor do item ativo da barra inferior).','Laranja escuro para texto de ação e link.'),
('(valor documentado no Figma)','(cor da marca)'),('Neutro de apoio do Figma (','Neutro de apoio ('),
('Neutral/Level 6 do Figma: divisores','Divisores'),('Neutral/Level 3 do Figma: texto e ícone principais nas telas novas.','Texto e ícone principais.'),
('Highlight/Default do Figma: ','Destaque: '),('Neutral/Level 5 do Figma: ponto de passo pendente','Ponto de passo pendente'),
('Azul claro do Figma: dia protegido','Azul claro: dia protegido'),('(Figma, Tela 5)','(Quiz, Tela 5)'),
('laranjas de texto do Figma','laranjas de texto do handoff anterior'),('(20px, como no Figma)','(20px)'),
('Busque o material desejado ou clique por cada tipo','Busque o material desejado ou toque em cada tipo'),
('Ouro do pódio e do nível Ouro.','Ouro do nível Ouro (Quiz).'),('Prata do pódio e do nível Prata.','Prata do nível Prata (Quiz).'),('Bronze do pódio e do nível Bronze.','Bronze do nível Bronze (Quiz).'),
('Primeiro lugar do pódio e nível Ouro.','Nível Ouro (Quiz).'),('Segundo lugar do pódio e nível Prata.','Nível Prata (Quiz).'),('Terceiro lugar do pódio e nível Bronze.','Nível Bronze (Quiz).')]
def limpa_todos(o):
    if isinstance(o,dict):
        return {k:limpa_todos(v) for k,v in o.items()}
    if isinstance(o,list): return [limpa_todos(v) for v in o]
    if isinstance(o,str):
        for a,b in LIMPA: o=o.replace(a,b)
    return o
t=limpa_todos(t)
json.dump(t,open(os.path.join(ds,'files/tokens.json'),'w',encoding='utf-8'),ensure_ascii=False,indent=2)
# ---- CSS ----
def val(v): return f'var(--{v[1:-1]})' if v.startswith('{') else v
L=[':root{']
for x in toks: L.append(f"--{x['name']}:{val(x['value']['light'])};")
for g in ('spacing','radius','size','shadow'):
    for x in t[g]['tokens']: L.append(f"--{x['name']}:{x['value']};")
L.append('--font-sans:"Lexend", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;'); L.append('}')
for s in styles:
    L.append(f".{s['name']}{{font-family:var(--font-sans);font-size:{s['fontSize']};line-height:{s['lineHeight']};font-weight:{s['fontWeight']};letter-spacing:{s['letterSpacing']};{'text-transform:uppercase;' if s['uppercase'] else ''}}}")
css='\n'.join(L)
open(os.path.join(ds,'files/tokens.css'),'w',encoding='utf-8').write(css)
old=open(os.path.join(ds,'assets/tokens.css'),encoding='utf-8').read(); ff=''.join(l+'\n' for l in old.split('\n') if l.startswith('@font-face'))
open(os.path.join(ds,'assets/tokens.css'),'w',encoding='utf-8').write(ff+css)
# ---- preset ----
p=os.path.join(ds,'files/src/tailwind.preset.js'); s=open(p,encoding='utf-8').read()
s=re.sub(r'"borderRadius": \{.*?\n    \},','"borderRadius": {\n      "none": "0px",\n      "xs": "var(--radius-xsmall)",\n      "sm": "var(--radius-small)",\n      "md": "var(--radius-medium)",\n      "lg": "var(--radius-large)",\n      "xl": "var(--radius-xlarge)",\n      "2xl": "var(--radius-2xlarge)",\n      "3xl": "var(--radius-3xlarge)",\n      "sheet": "var(--radius-sheet)",\n      "full": "var(--radius-full)"\n    },',s,count=1,flags=re.S)
s=re.sub(r'"boxShadow": \{.*?\n    \},','"boxShadow": {\n      "none": "none",\n      "card": "var(--shadow-card)",\n      "high": "var(--shadow-high)",\n      "float": "var(--shadow-float)",\n      "sheet": "var(--shadow-sheet)",\n      "dark": "var(--shadow-dark)",\n      "glow": "var(--shadow-glow)"\n    },',s,count=1,flags=re.S)
if '"surface-podium-3"' not in s:
    s=re.sub(r'\n      "surface-tint-[a-z]+": "var\(--surface-tint-[a-z]+\)",?','',s)
    s=s.replace('"surface-info": "var(--surface-info)",','"surface-info": "var(--surface-info)",\n'+''.join(f'      "surface-{n}": "var(--surface-{n})",\n' for n in ('tint-peach','tint-green','tint-blue','tint-lavender','tint-pink','tint-yellow','podium-2','podium-3')).rstrip('\n'))
s=s.replace('"icon-small": "var(--size-icon-small)",','"icon-small": "var(--size-icon-small)",\n      "chip": "var(--size-chip)",\n      "row": "var(--size-row)",\n      "tab-item": "var(--size-tab-item)",\n      "back": "var(--size-back)",\n      "disc": "var(--size-disc)",\n      "disc-small": "var(--size-disc-small)",') if '"chip"' not in s else s
open(p,'w',encoding='utf-8').write(s)
print('ok cores',len(toks),'estilos',len(styles))
