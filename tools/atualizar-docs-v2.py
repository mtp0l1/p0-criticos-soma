# -*- coding: utf-8 -*-
"""Atualiza textos e previews do Campana para a v2: cores citadas, medidas dos componentes, preview do Button, AGENTS.md. Idempotente."""
import os, re, glob
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..')); ds=os.path.join(root,'design-system')
HEX={'F2A545':'FFA125','1E2A3B':'21344E','5C7089':'56697F','A64B00':'9E5400','FDFEFF':'FFFFFF','F1F5F8':'F1EDE6','FDF5EA':'FFF6E8','E7EDF2':'E8E2D6','DDE4EE':'E8E2D6','7A808A':'8A8374','2A6A1B':'167A3F','E3F3D9':'E6F6EC','9B1C1C':'C62F2F','D92D20':'C62F2F','E0ECFF':'DCEBFB'}
def sub_hex(s):
    for a,b in HEX.items(): s=re.sub('(?i)#'+a,'#'+b,s)
    return s
n=0
files=[f for f in glob.glob(os.path.join(ds,'site/pages/*.js')) if '/fundamentos__' not in f]+glob.glob(os.path.join(ds,'previews/*.html'))+glob.glob(os.path.join(ds,'files/*.md'))
for f in files:
    s=open(f,encoding='utf-8').read(); t=sub_hex(s)
    if t!=s: open(f,'w',encoding='utf-8').write(t); n+=1
print('arquivos com cores atualizadas:',n)
def edit(rel,pairs,must=False):
    p=os.path.join(ds,rel); s=open(p,encoding='utf-8').read(); c=0
    for a,b in pairs:
        if a in s and b not in s: s=s.replace(a,b,1); c+=1
    open(p,'w',encoding='utf-8').write(s); return c
# preview do Button
edit('previews/Button.html',[
("K('hierarchy: loud · quiet · transparent · destructive'),","K('hierarchy: loud · dark · quiet · transparent · destructive'),"),
("h(S.Button,{hierarchy:'quiet',icon:'user-plus',iconPosition:'end'},'Convidar amigos'),","h(S.Button,{hierarchy:'dark',icon:'qr-code'},'Mostrar meu QR'), h(S.Button,{hierarchy:'quiet',icon:'user-plus',iconPosition:'end'},'Convidar amigos'),"),
("K('size: large (48) · compact (44) · icon (44) · asChild com link'),","K('size: large (56) · compact (48) · icon (44) · asChild com link'),"),
])
edit('site/pages/componentes__Button.js',[
("quatro ênfases (<code>loud</code>, <code>quiet</code>, <code>transparent</code>, <code>destructive</code>)","cinco ênfases (<code>loud</code>, <code>dark</code>, <code>quiet</code>, <code>transparent</code>, <code>destructive</code>)"),
("Um <code>loud</code> por tela: <code>primary</code> com <code>primary-foreground</code> (7,07:1). Nunca texto branco sobre laranja.","Um <code>loud</code> por tela: pílula de 56px, <code>primary</code> com <code>primary-foreground</code> (6,2:1) e brilho <code>shadow-glow</code>. Nunca texto branco sobre laranja."),
("<code>quiet</code> é a ação secundária: borda <code>interactive-border-quiet</code>, fundo <code>surface-primary</code>, ícone <code>icon-brand</code>.</li>","<code>quiet</code> é a ação secundária clara: fundo <code>surface-primary</code>, sombra <code>shadow-card</code>, ícone <code>icon-primary</code>.</li>\n<li><code>dark</code> é a ação forte secundária (\"Mostrar meu QR\", \"Compartilhar\"): fundo <code>surface-inverse</code>, texto <code>text-inverse</code>, sombra <code>shadow-dark</code>.</li>"),
])
# textos de componentes
edit('site/pages/componentes__Button.js',[("<code>large</code> (48px, padrão), <code>compact</code> (44px, listas e cards densos)","<code>large</code> (56px, padrão), <code>compact</code> (48px, listas e cards densos)")])
edit('site/pages/componentes__Input.js',[("Altura <code>size-input</code> (48px, a mesma do botão), raio <code>radius-medium</code>","Altura <code>size-input</code> (68px, com o rótulo flutuante dentro do campo), raio <code>radius-large</code> (20px), sombra <code>shadow-card</code>")])
edit('site/pages/componentes__TextField.js',[("Campo de <strong>48px</strong> (<code>size-input</code>, a mesma altura do botão)","Campo de <strong>68px</strong> (<code>size-input</code>), com o rótulo flutuante dentro do campo")],must=False)
edit('site/pages/componentes__PasswordField.js',[("Mesmo campo de 48px do <code>TextField</code>","Mesmo campo de 68px do <code>TextField</code>")])
edit('site/pages/componentes__Select.js',[("Gatilho igual ao <code>Input</code> (48px,","Gatilho igual ao <code>Input</code> (68px,")])
edit('site/pages/componentes__Header.js',[("o campo de formulário ficou com 48px (<code>size-input</code>)","o campo de formulário tem 68px (<code>size-input</code>)")])
# AGENTS.md
a=os.path.join(ds,'files/AGENTS.md'); s=open(a,encoding='utf-8').read()
s=s.replace('| Escala de espaço | 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 |','| Escala de espaço | 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 (meios-passos de 6, 10, 14 e 18 só dentro de componentes) |')
s=s.replace('| Escala de texto | 12 · 14 · 16 · 18 · 20 · 24 · 32px (só `tab-label` tem 11px) |','| Escala de texto | 12 · 14 · 15 · 16 · 17 · 18 · 22 · 28 · 32 · 48px, em 16 estilos (só `tab-label` tem 11px). Tracking acompanha o tamanho. |')
s=s.replace('| Raios | 4 · 8 · 12 · 16 · 24 · pílula |','| Raios | 8 · 12 · 16 · 20 · 24 · 28 · 32 · 36 · pílula |')
s=s.replace('| Largura de desenho | 360px |','| Largura de desenho | 390px (de 360 a 430: margem fixa, conteúdo estica) |')
s=s.replace('| Margem lateral da tela | 20px (`space-xsmall`) |','| Margem lateral da tela | 20px (`space-xsmall`) |\n| Botão | 56px, pílula, largura total (`size-button`) |\n| Campo de texto | 68px, rótulo flutuante (`size-input`) |\n| Bloco de ação fixo | termina 12px acima da barra inferior; nunca fica sob ela |')
s=s.replace('Telas marcadas `ATUAL` (produção) ou `PROPOSTA` (caso de borda sem confirmação) em um handoff do Figma. O sistema segue só o que está marcado `NOVO`.','Telas marcadas `ATUAL` (produção) ou `PROPOSTA` (caso de borda sem confirmação) em um handoff do Figma. O sistema segue a versão 2 do app (as telas marcadas `NOVO`).')
open(a,'w',encoding='utf-8').write(s)
print('ok')
