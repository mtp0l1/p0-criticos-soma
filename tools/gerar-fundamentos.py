# -*- coding: utf-8 -*-
"""Regenera as páginas de Fundamentos (cores, tipografia, espaçamento, raios, tamanhos, elevação) a partir de files/tokens.json.
Parte sempre das páginas da v4 guardadas em tools/paginas-v4/ (copiadas na primeira execução)."""
import json, os, re, html, shutil
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..'))
pages=os.path.join(root,'design-system/site/pages'); bak=os.path.join(root,'tools/paginas-v4')
names=['fundamentos__cores.js','fundamentos__tipografia.js','fundamentos__espacamento.js','fundamentos__raios.js','fundamentos__tamanhos.js','fundamentos__elevacao.js']
os.makedirs(bak,exist_ok=True)
for n in names:
    if not os.path.exists(os.path.join(bak,n)): shutil.copy(os.path.join(pages,n),os.path.join(bak,n))
T=json.load(open(os.path.join(root,'design-system/files/tokens.json'),encoding='utf-8'))
def load(n):
    raw=open(os.path.join(bak,n),encoding='utf-8').read(); return json.loads(raw[len('export default () => '):].rstrip().rstrip(';'))
def save(n,h): open(os.path.join(pages,n),'w',encoding='utf-8').write('export default () => '+json.dumps(h,ensure_ascii=False)+';')
E_=lambda s: html.escape(s,quote=True)
col={x['name']:x for x in T['color']['tokens']}
def hexof(n):
    v=col[n]['value']['light']
    return hexof(v[1:-1]) if v.startswith('{') else v.upper()
def sw(name,ref,usage):
    h=hexof(name); second=(ref+' · '+h) if ref else h
    return f'<button type="button" class="sw" data-q="{name} {h.lower()}" data-copy="{name}" aria-label="Copiar o nome do token {name}"><i style="background:{h}"></i><span><b>{name}</b><span>{second}</span><span class="u">{E_(usage)}</span></span></button>'
core=[x for x in T['color']['tokens'] if not x['value']['light'].startswith('{')]
rest=[x for x in T['color']['tokens'] if x['value']['light'].startswith('{')]
ai=next(i for i,x in enumerate(rest) if x['name']=='background'); sem=rest[:ai]; ali=rest[ai:]
# ---- cores ----
h=load('fundamentos__cores.js')
parts=re.split(r'(?=<section class="doc-section")',h)
def rebuild(sec,tokens,withref):
    body=''.join(sw(x['name'],(x['value']['light'][1:-1] if withref else ''),x['usage']) for x in tokens)
    return re.sub(r'<div class="sws">.*?</div></section>','<div class="sws">'+body+'</div></section>',sec,flags=re.S)
parts[1]=rebuild(parts[1],sem,True); parts[2]=rebuild(parts[2],ali,True); parts[3]=rebuild(parts[3],core,False)
h=''.join(parts); h=re.sub(r'\d+ tokens em três camadas','%d tokens em três camadas'%len(T['color']['tokens']),h)
h=h.replace('Os valores são os do tema padrão; cada produto pode ter o seu tema.','Os valores são os da versão 2 do app, com contraste AA medido; cada produto pode ter o seu tema.')
save('fundamentos__cores.js',h)
# ---- tabelas simples ----
def table(n,cols,rows,lead,desc=None):
    h=load(n); h=re.sub(r'(<p class=doc-header__lead>).*?(</p>)',lambda m:m.group(1)+E_(lead)+m.group(2),h,count=1)
    th=''.join(f'<th>{c}</th>' for c in cols)
    h=re.sub(r'<thead>.*?</thead>',f'<thead><tr>{th}</tr></thead>',h,count=1,flags=re.S)
    h=re.sub(r'<tbody>.*?</tbody>','<tbody>'+''.join('<tr>'+''.join(r)+'</tr>' for r in rows)+'</tbody>',h,count=1,flags=re.S)
    if desc: h=re.sub(r'(<p class=doc-section__desc>).*?(</p>)',lambda m:m.group(1)+E_(desc)+m.group(2),h,count=1)
    save(n,h)
code=lambda s:f'<td><code class="code">{s}</code></td>'
td=lambda s:f'<td>{s}</td>'
sp=T['spacing']; table('fundamentos__espacamento.js',['Token','Valor','Amostra','Uso'],[[code(x['name']),td(x['value']),td(f'<span class="bar" style="width:{x["value"]}"></span>'),td(E_(x['usage']))] for x in sp['tokens']],sp['note'])
rd=T['radius']; table('fundamentos__raios.js',['Token','Valor','Amostra','Uso'],[[code(x['name']),td(x['value']),td(f'<span class="rad" style="border-radius:{x["value"]}"></span>'),td(E_(x['usage']))] for x in rd['tokens']],rd['note'],'Cantos arredondados do sistema: quanto maior a superfície, maior o raio.')
sz=T['size']; table('fundamentos__tamanhos.js',['Token','Valor','Uso'],[[code(x['name']),td(x['value']),td(E_(x['usage']))] for x in sz['tokens']],sz['note'])
sh=T['shadow']; table('fundamentos__elevacao.js',['Token','Amostra','Valor','Uso'],[[code(x['name']),td(f'<span class="shd" style="box-shadow:{x["value"]}"></span>'),td(x['value']),td(E_(x['usage']))] for x in sh['tokens']],sh['note'],'Quanto mais alto o nível, mais a peça flutua sobre o fundo.')
# ---- tipografia ----
h=load('fundamentos__tipografia.js')
li=''.join(f'<li><span class="sample {s["name"]}">{E_(s.get("sample",s["name"]))}</span><span><b>{s["name"]}</b><span>{s["fontSize"]} / {s["lineHeight"]} · peso {s["fontWeight"]} · tracking {s["letterSpacing"]}</span><span>{E_(s["usage"])}</span></span></li>' for s in T['type']['groups'][0]['styles'])
h=re.sub(r'<ul class="typelist">.*?</ul>','<ul class="typelist">'+li+'</ul>',h,count=1,flags=re.S)
h=h.replace('com os estilos de texto do Figma. Aplique pela classe do estilo, nunca por tamanho solto.','com os 16 estilos de texto da versão 2. O tamanho muda o desenho da letra: título grande com tracking negativo, rótulo em caixa-alta com tracking positivo. Aplique pela classe do estilo, nunca por tamanho solto.')
save('fundamentos__tipografia.js',h)
print('fundamentos regenerados')
