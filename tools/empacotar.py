# -*- coding: utf-8 -*-
"""Monta o pacote para baixar (design-system/files/soma-design-system.zip) a partir do estado atual do site.

O pacote antigo carregava o bundle e os READMEs da versão anterior. Agora tudo sai do que está publicado:
  · tokens.json / tokens.css / AGENTS.md / decision-map.md / index.d.ts  ← design-system/files
  · components/bundle.js, bundle.css, icons-chunks, src                    ← design-system/assets e files/src
  · components/<Nome>/README.md  e  README.md, 1-… a 8-….md               ← convertidos das páginas do site (HTML → Markdown)
  · assets/icons, assets/illustrations, marca                             ← design-system/assets
  · checks/                                                               ← tools/pacote/checks (verificações do pacote)
Rode depois do build e das páginas. Idempotente."""
import html, json, os, re, shutil, subprocess, sys, zipfile
from html.parser import HTMLParser

root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
ds = os.path.join(root, 'design-system')
pages = os.path.join(ds, 'site/pages')
here = os.path.dirname(os.path.abspath(__file__))
PREFIX = 'export default () => '
PKG = 'soma-design-system'


def pagina(nome):
    s = open(os.path.join(pages, nome + '.js'), encoding='utf-8').read()
    return json.loads(s[len(PREFIX):s.rindex(';')])


# ------------------------------------------------------------------ HTML → Markdown
class MD(HTMLParser):
    SKIP = {'svg', 'style', 'script', 'button', 'iframe', 'nav', 'noscript', 'select', 'input'}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []; self.skip = 0; self.list = []; self.pre = False; self.cell = None; self.rows = None; self.row = None
        self.href = None; self.skipsec = 0; self.sec_depth = 0; self.stack = []

    def w(self, t):
        if self.skip: return
        if self.cell is not None: self.cell.append(t)
        else: self.out.append(t)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs); cls = a.get('class', '') or ''
        self.stack.append((tag, cls))
        if tag in self.SKIP: self.skip += 1; return
        if self.skip: return
        if tag in ('h1', 'h2', 'h3', 'h4'): self.w('\n\n' + '#' * int(tag[1]) + ' ')
        elif tag == 'p':
            self.w('\n\n' + ('**Usar para:** ' if False else ''))
        elif tag in ('ul', 'ol'): self.list.append([tag, 0]); self.w('\n')
        elif tag == 'li':
            d = len(self.list) - 1; mark = '-' if not self.list or self.list[-1][0] == 'ul' else str(self.list[-1][1] + 1) + '.'
            if self.list: self.list[-1][1] += 1
            self.w('\n' + '  ' * max(d, 0) + mark + ' ')
        elif tag == 'br': self.w('  \n' if self.cell is None else ' ')
        elif tag in ('strong', 'b'): self.w('**')
        elif tag in ('em', 'i'): self.w('_')
        elif tag == 'code':
            if not self.pre: self.w('`')
        elif tag == 'pre': self.pre = True; self.w('\n\n```\n')
        elif tag == 'a':
            self.href = a.get('href'); self.interno = (self.href or '').startswith('#/')
            if not self.interno: self.w('[')
        elif tag == 'table': self.rows = []
        elif tag == 'tr': self.row = []
        elif tag in ('td', 'th'): self.cell = []
        elif tag in ('section', 'article', 'div', 'header') and ('usage-card__head' in cls or 'usage-card' in cls): self.w('\n\n')
        elif tag == 'img': self.w(a.get('alt', ''))

    def handle_endtag(self, tag):
        while self.stack and self.stack[-1][0] != tag: self.stack.pop()
        if self.stack: self.stack.pop()
        if tag in self.SKIP: self.skip = max(0, self.skip - 1); return
        if self.skip: return
        if tag in ('strong', 'b'): self.w('**')
        elif tag in ('em', 'i'): self.w('_')
        elif tag == 'code':
            if not self.pre: self.w('`')
        elif tag == 'pre': self.pre = False; self.w('\n```\n')
        elif tag == 'a':
            h = self.href or ''
            if not getattr(self, 'interno', False): self.w(']' + ('(' + h + ')' if h else ''))
            self.href = None; self.interno = False; self.w(' ' if getattr(self, 'interno_bloco', False) else '')
        elif tag in ('ul', 'ol'):
            if self.list: self.list.pop()
            self.w('\n')
        elif tag in ('td', 'th'):
            c = ' '.join(''.join(self.cell).split()).replace('|', '/'); self.cell = None
            if self.row is not None: self.row.append(c)
        elif tag == 'tr':
            if self.rows is not None and self.row is not None: self.rows.append(self.row)
            self.row = None
        elif tag == 'table':
            rows = [r for r in (self.rows or []) if r]
            if rows:
                n = max(len(r) for r in rows); rows = [r + [''] * (n - len(r)) for r in rows]
                t = '\n\n| ' + ' | '.join(rows[0]) + ' |\n|' + '---|' * n + '\n' + '\n'.join('| ' + ' | '.join(r) + ' |' for r in rows[1:]) + '\n'
                self.out.append(t)
            self.rows = None

    def handle_data(self, d):
        if self.skip: return
        if self.pre: self.w(d)
        else:
            d = re.sub(r'\s+', ' ', d)
            self.w(d)


def para_md(h):
    p = MD(); p.feed(h); s = ''.join(p.out)
    s = re.sub(r'[ \t]+\n', '\n', s); s = re.sub(r'\n{3,}', '\n\n', s)
    s = re.sub(r'\*\*\s+', '**', s) if False else s
    return s.strip() + '\n'


def corta_secao(j, sid):
    m = re.search(r'<section class="doc-section" id="' + re.escape(sid) + r'"[^>]*>(.*?)</section>(?=<section class="doc-section"|</div>$)', j, re.S)
    return m.group(1) if m else ''


def readme_componente(nome, j):
    lead = re.search(r'<p class=doc-header__lead>(.*?)</p>', j, re.S)
    uso = re.search(r'<article class="usage-card usage-card--do">.*?<p class="usage-card__text">(.*?)</p></article>', j, re.S)
    nunca = re.search(r'<article class="usage-card usage-card--dont">.*?<p class="usage-card__text">(.*?)</p>', j, re.S)
    ver = re.search(r'<article class="usage-card usage-card--tip">.*?<p class="usage-card__text">(.*?)</p>', j, re.S) or re.search(r'Verificado por</p>.*?<p class="usage-card__text">(.*?)</p>', j, re.S)
    out = ['# ' + nome, '']
    if lead: out += [para_md(lead.group(1)).strip(), '']
    for sid, titulo in [('fornece', 'O que você fornece'), ('especificacao', 'Especificação'), ('estados', 'Estados'), ('acessibilidade', 'Acessibilidade'), ('figma', 'Nas telas da v2'), ('base-tecnica', 'Base técnica'), ('codigo', 'Código')]:
        sec = corta_secao(j, sid)
        if not sec: continue
        corpo = re.sub(r'<header class="doc-section__header">.*?</header>', '', sec, count=1, flags=re.S)
        md = para_md(corpo)
        if md.strip(): out += ['## ' + titulo, '', md.strip(), '']
    out += ['---']
    for rot, m in (('Usar para', uso), ('Nunca', nunca), ('Verificado por', ver)):
        if m: out.append('**%s:** %s' % (rot, ' '.join(para_md(m.group(1)).split())))
    return '\n'.join(out).strip() + '\n'


def doc_md(j, titulo):
    corpo = re.sub(r'<nav class="doc-nav".*?</nav>', '', j, count=1, flags=re.S)
    corpo = re.sub(r'<p class="doc-header__eyebrow">.*?</p>', '', corpo, count=1, flags=re.S)
    return para_md(corpo)


DOCS = [('README.md', 'primeiros-passos'), ('1-gerar-telas-com-ia.md', 'recursos__gerar-telas'), ('2-padroes-de-tela.md', 'padroes__padroes-de-tela'),
        ('3-para-engenharia.md', 'recursos__engenharia'), ('4-registro-do-handoff-anterior.md', 'recursos__telas-novas'), ('5-auditoria-shadcn.md', 'recursos__auditoria-shadcn'),
        ('6-ilustracoes.md', 'fundamentos__ilustracoes'), ('7-regras-e-verificacoes.md', 'recursos__regras'), ('8-para-qualquer-produto.md', 'produtos')]


def main():
    tmp = os.path.join(here, '_pacote'); shutil.rmtree(tmp, ignore_errors=True)
    P = os.path.join(tmp, PKG); os.makedirs(P + '/components', exist_ok=True)
    F = os.path.join(ds, 'files')
    for f in ('tokens.json', 'tokens.css', 'AGENTS.md', 'decision-map.md'): shutil.copy(os.path.join(F, f), P)
    shutil.copy(os.path.join(F, 'index.d.ts'), P + '/components/index.d.ts')
    for f in ('bundle.js', 'bundle.css'): shutil.copy(os.path.join(ds, 'assets', f), P + '/components/' + f)
    shutil.copytree(os.path.join(ds, 'assets/icons-chunks'), P + '/components/icons-chunks')
    shutil.copytree(os.path.join(F, 'src'), P + '/components/src')
    shutil.copytree(os.path.join(ds, 'assets/icons'), P + '/assets/icons')
    shutil.copytree(os.path.join(ds, 'assets/illustrations'), P + '/assets/illustrations')
    shutil.copytree(os.path.join(ds, 'assets/brand'), P + '/marca')
    shutil.copytree(os.path.join(here, 'pacote/checks'), P + '/checks', ignore=shutil.ignore_patterns('__pycache__', 'resultado.json', 'relatorio.md'))
    shutil.copy(os.path.join(here, 'pacote/design-system.json'), P + '/design-system.json')
    for dst, nome in DOCS: open(os.path.join(P, dst), 'w', encoding='utf-8').write(doc_md(pagina(nome), nome))
    n = 0
    for f in sorted(os.listdir(pages)):
        if f.startswith(('componentes__', 'modulos__')):
            nome = f[:-3].split('__', 1)[1]
            os.makedirs(P + '/components/' + nome, exist_ok=True)
            open(P + '/components/%s/README.md' % nome, 'w', encoding='utf-8').write(readme_componente(nome, pagina(f[:-3]))); n += 1
    # mapa de decisão e verificações, rodados no pacote montado
    subprocess.run([sys.executable, P + '/checks/gen_decision_map.py', P], check=True)
    r = subprocess.run([sys.executable, P + '/checks/ds_checks.py', P, '--json', P + '/checks/resultado.json'], capture_output=True, text=True)
    print(r.stdout[-1800:] or r.stderr[-1800:])
    shutil.copy(P + '/decision-map.md', os.path.join(F, 'decision-map.md'))
    zpath = os.path.join(F, PKG + '.zip')
    with zipfile.ZipFile(zpath, 'w', zipfile.ZIP_DEFLATED) as z:
        for d, _, fs in os.walk(P):
            for f in sorted(fs):
                full = os.path.join(d, f); z.write(full, os.path.relpath(full, tmp))
    shutil.rmtree(tmp, ignore_errors=True)
    print('componentes com README:', n, '· zip:', round(os.path.getsize(zpath) / 1e6, 2), 'MB')


if __name__ == '__main__':
    main()
