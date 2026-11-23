# -*- coding: utf-8 -*-
"""Gera a galeria de componentes (#/componentes): uma miniatura por componente e módulo, agrupada por categoria,
com busca e filtro Núcleo/Módulos. Lê as páginas do site (categoria e primeira frase do lead) e as miniaturas em assets/thumbs.
Também liga a rota no menu e o botão "Ver componentes" da home. Idempotente."""
import html, json, os, re

root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
ds = os.path.join(root, 'design-system')
pages = os.path.join(ds, 'site/pages')
PREFIX = 'export default () => '
SEXTA = 'M7 7h10v10M7 17 17 7'  # seta do cartão (a mesma da home)


def pagina(nome):
    s = open(os.path.join(pages, nome + '.js'), encoding='utf-8').read()
    return json.loads(s[len(PREFIX):s.rindex(';')])


def texto(h):
    return html.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', h))).strip()


def curto(t, n=96):
    m = re.match(r'(.+?[.!?])(\s|$)', t)
    p = m.group(1) if m else t
    if len(p) > n:
        p = p[:n].rsplit(' ', 1)[0].rstrip(',;: ') + '…'
    return p


def itens():
    nav = open(os.path.join(ds, 'site/nav.js'), encoding='utf-8').read()
    out = []
    for m in re.finditer(r'\{label:"([^"]+)",icon:"[^"]*",path:"(/(?:componentes|modulos)/([^"]+))",description:"([^"]*)"', nav):
        label, path, nome, curta = m.groups()
        j = pagina(path[1:].replace('/', '__'))
        eb = re.search(r'doc-header__eyebrow">(.*?)</p>', j)
        lead = re.search(r'doc-header__lead>(.*?)</p>', j, re.S)
        partes = [x.strip() for x in (eb.group(1) if eb else '').split('·')]
        camada = 'Módulos' if partes[0].startswith('Módulo') else 'Núcleo'
        cat = partes[1] if len(partes) > 1 else ''
        out.append(dict(nome=nome, path=path, camada=camada, cat=cat, desc=html.unescape(curta) or (curto(texto(lead.group(1))) if lead else '')))
    return out


def cartao(i):
    q = html.escape((i['nome'] + ' ' + i['cat'] + ' ' + i['desc']).lower(), quote=True)
    return ('<a class="tile" href="#%s" data-q="%s"><span class="tile__preview pv-img" aria-hidden="true"><img src="assets/thumbs/%s.jpg?v=2" alt="" loading="lazy" width="480" height="300"></span>'
            '<span class="tile__title">%s<svg class="ds-icon tile__arrow" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
            '<path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></span><span class="tile__desc">%s</span></a>') % (i['path'], q, i['nome'], i['nome'], html.escape(i['desc']))


def monta():
    its = itens()
    grupos = []  # (camada, categoria) na ordem do menu
    for i in its:
        k = (i['camada'], i['cat'])
        if k not in grupos: grupos.append(k)
    secoes = []
    for camada, cat in grupos:
        lista = [i for i in its if (i['camada'], i['cat']) == (camada, cat)]
        titulo = cat or camada
        eyebrow = camada
        secoes.append('<section class="doc-section gal-section" data-group="%s" style="padding-top:var(--ds-space-500)"><header class="doc-section__header"><div><p class="home-section__eyebrow">%s</p><h2 class="doc-section__title">%s <span class="gal-count">%d</span></h2></div></header><div class="tile-grid tile-grid--gal">%s</div></section>'
                      % (camada, eyebrow, html.escape(titulo), len(lista), ''.join(cartao(i) for i in lista)))
    nn = sum(1 for i in its if i['camada'] == 'Núcleo'); nm = len(its) - nn
    busca = ('<svg class="ds-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>')
    toolbar = ('<div class="doc-section" style="padding-top:var(--ds-space-400)"><div class="toolbar"><label class="ds-input-wrap">%s<span class="ds-visually-hidden">Filtrar componentes</span><input type="search" data-filter placeholder="Filtrar por nome ou categoria" autocomplete="off"></label>'
               '<div class="ds-chip-group" role="group" aria-label="Camada"><button type="button" class="ds-chip" data-layer="" aria-pressed="true">Todos</button><button type="button" class="ds-chip" data-layer="Núcleo" aria-pressed="false">Núcleo</button><button type="button" class="ds-chip" data-layer="Módulos" aria-pressed="false">Módulos</button></div></div></div>') % busca
    return ('<div class="page doc"><header class="doc-header"><div><p class="doc-header__eyebrow">Componentes</p><h1 class="doc-header__title">Todos os componentes</h1>'
            '<p class=doc-header__lead>%d componentes do núcleo e %d módulos de produto, cada um rodando de verdade com os tokens do tema. Escolha um para ver o exemplo interativo, o contrato e o código.</p></div></header>'
            '<div data-filterable>%s%s<p class="empty" hidden>Nenhum componente encontrado.</p></div></div>') % (nn, nm, toolbar, ''.join(secoes))


def main():
    h = monta()
    open(os.path.join(pages, 'componentes.js'), 'w', encoding='utf-8').write(PREFIX + json.dumps(h, ensure_ascii=False) + ';\n')
    nav = os.path.join(ds, 'site/nav.js'); t = open(nav, encoding='utf-8').read()
    if 'path:"/componentes"' not in t:
        ancora = '{label:"Para qualquer produto"'
        item = '{label:"Componentes",icon:"layout-grid",path:"/componentes",description:"Todos os componentes e módulos em miniaturas, com busca e filtro.",load:()=>import("./pages/componentes.js")},'
        assert ancora in t
        t = t.replace(ancora, item + ancora, 1)
        open(nav, 'w', encoding='utf-8').write(t)
    home = os.path.join(pages, 'home.js'); s = open(home, encoding='utf-8').read()
    novo = s.replace('href=\\"#/componentes/Button\\">Ver componentes</a>', 'href=\\"#/componentes\\">Ver componentes</a>')
    novo = re.sub(r'(assets/thumbs/[A-Za-z]+\.jpg)(?!\?v=)', r'\1?v=2', novo)
    if novo != s: open(home, 'w', encoding='utf-8').write(novo)
    print('galeria:', h.count('class="tile"'), 'cartões')


if __name__ == '__main__':
    main()
