# -*- coding: utf-8 -*-
"""Gera a página 'Telas da v2' (galeria das 201 telas com miniatura e link para o protótipo) e copia o protótipo para design-system/prototipo/.
Entrada: ../../prototipo-soma/fonte/dados (proto.json, miniaturas.json) e ../../prototipo-soma/prototipo-soma.html."""
import json, os, re, base64, shutil, html
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..')); ds=os.path.join(root,'design-system')
proto_dir=os.path.abspath(os.path.join(root,'..','prototipo-soma'))
P=json.load(open(os.path.join(proto_dir,'fonte/dados/proto.json'),encoding='utf-8')); TH=json.load(open(os.path.join(proto_dir,'fonte/dados/miniaturas.json')))
out=os.path.join(ds,'assets/telas-v2'); os.makedirs(out,exist_ok=True)
for k,v in TH.items():
    m=re.match(r'data:image/(\w+);base64,(.*)',v,re.S)
    if m: open(os.path.join(out,k+'.'+('webp' if m.group(1)=='webp' else m.group(1))),'wb').write(base64.b64decode(m.group(2)))
ext='webp'
os.makedirs(os.path.join(ds,'prototipo'),exist_ok=True)
shutil.copy(os.path.join(proto_dir,'prototipo-soma.html'),os.path.join(ds,'prototipo/index.html'))
E_=lambda s: html.escape(s,quote=True)
css='<style>.tv2{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:16px}.tv2 a{display:block;text-decoration:none;color:inherit}.tv2 figure{margin:0}.tv2 a,.tv2 figure{min-width:0}.tv2 img{display:block!important;width:100%!important;max-width:100%!important;height:auto!important;aspect-ratio:9/19.5;object-fit:cover;object-position:top;border-radius:20px;background:var(--ds-surface-2,#f1ede6);box-shadow:0 1px 2px rgba(33,52,78,.06),0 10px 28px rgba(33,52,78,.08);transition:transform .12s ease-out}.tv2 a:hover img{transform:translateY(-3px)}.tv2 a:active img{transform:scale(.98)}.tv2 figcaption{margin-top:8px;font-size:13px;line-height:18px}.tv2 b{display:block;font-weight:600}.tv2 span{opacity:.7;font-size:12px}.tv2cta{display:inline-flex;align-items:center;gap:8px;margin-top:8px;font-weight:600}</style>'
body=''
total=0
for s in P['sections']:
    cards=''
    for g in s['groups']:
        for i in g['ids']:
            m=P['screens'][i]; k=i.replace(':','-'); total+=1
            cards+=f'<a href="prototipo/#{k}" target="_blank" rel="noopener"><figure><img loading="lazy" src="assets/telas-v2/{k}.{ext}" alt="Tela {E_(m["code"])}: {E_(m["title"])}" width="300" height="650"><figcaption><b>{E_(m["code"])} · {E_(m["title"])}</b><span>{E_(g["title"])}</span></figcaption></figure></a>'
    n=sum(len(g['ids']) for g in s['groups'])
    body+=f'<section class="doc-section" id="{E_(s["id"])}" aria-labelledby="{E_(s["id"])}-t"><header class="doc-section__header"><div><h2 class="doc-section__title" id="{E_(s["id"])}-t">{E_(s["title"])}</h2><p class="doc-section__desc">{E_(s.get("blurb",""))} {n} telas.</p></div></header><div class="tv2">{cards}</div></section>'
nav=''.join(f'<button type="button" class="doc-nav__link" data-target="{E_(s["id"])}">{E_(s["title"])}</button>' for s in P['sections'])
page=f'<div class="page doc">{css}<header class="doc-header"><div><p class="doc-header__eyebrow">Padrões</p><h1 class="doc-header__title">Telas da v2</h1><p class="doc-header__lead">As {total} telas da versão 2 do app So+ma, a referência oficial do sistema. Toque em uma tela para abri-la no protótipo navegável, com todos os botões, campos e estados funcionando.</p><a class="tv2cta" href="prototipo/" target="_blank" rel="noopener">Abrir o protótipo navegável →</a></div></header><nav class="doc-nav" aria-label="Nesta página">{nav}</nav>{body}</div>'
open(os.path.join(ds,'site/pages/padroes__telas-v2.js'),'w',encoding='utf-8').write('export default () => '+json.dumps(page,ensure_ascii=False)+';')
# nav.js
p=os.path.join(ds,'site/nav.js'); s=open(p,encoding='utf-8').read()
item='{label:"Telas da v2",icon:"smartphone",path:"/padroes/telas-v2",description:"As 201 telas oficiais da versão 2, com link para o protótipo navegável.",load:()=>import("./pages/padroes__telas-v2.js")},'
if 'padroes/telas-v2' not in s:
    k='{id:"padroes",label:"Padrões",items:['; assert k in s; s=s.replace(k,k+item,1)
s=s.replace('Lexend em quatro pesos, com os estilos de texto do Figma.','Lexend em quatro pesos, com os 16 estilos de texto da versão 2.')
open(p,'w',encoding='utf-8').write(s)
print('telas',total,'miniaturas',len(os.listdir(out)))
