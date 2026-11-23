#!/usr/bin/env python3
"""So+ma DS · verificações estáticas.  Uso: python3 ds_checks.py <pasta do design system> [--json saida.json]
Cada regra tem um ID (ver 7-regras-e-verificacoes.md). A saída cita o ID e o arquivo/valor que falhou.
Regra que não se aplica a um componente é pulada, não reprovada."""
import json, re, sys, os, glob

P = sys.argv[1].rstrip('/')
SRC = P + '/components/src'
res = []          # (id, status, detalhe)   status: ok | falha | info
def add(i, ok, msg, info=False): res.append((i, 'info' if info else ('ok' if ok else 'falha'), msg))

_EXC = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'excecoes.json')
EXC = json.load(open(_EXC)) if os.path.exists(_EXC) else {}

# ------------------------------------------------------------------ tokens
tok = json.load(open(P + '/tokens.json'))
colors = {c['name']: (c['value']['light'] if isinstance(c['value'], dict) else c['value']) for c in tok['color']['tokens']}
def resolve(v, depth=0):
    m = re.fullmatch(r'\{(.+)\}', v.strip())
    return resolve(colors[m.group(1)], depth + 1) if m and depth < 8 else v
def rgb(v):
    v = resolve(v).strip()
    if v.startswith('#'):
        h = v[1:]; h = ''.join(c * 2 for c in h) if len(h) in (3, 4) else h
        if len(h) == 8 and h[6:] != 'ff': return None  # com transparência: fora do escopo
        return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
    return None
def lum(c):
    f = lambda x: (x / 255 / 12.92) if x / 255 <= .03928 else ((x / 255 + .055) / 1.055) ** 2.4
    r, g, b = map(f, c); return .2126 * r + .7152 * g + .0722 * b
def ratio(a, b):
    la, lb = lum(a), lum(b); hi, lo = max(la, lb), min(la, lb); return (hi + .05) / (lo + .05)

# TOK-03 · contraste dos pares de token (texto 4,5:1; borda e ícone de controle 3:1)
TEXT = [
 ('text-primary', ['background-primary', 'surface-primary', 'surface-secondary', 'surface-accent']),
 ('text-secondary', ['background-primary', 'surface-primary', 'surface-secondary', 'surface-accent']),
 ('text-link', ['background-primary', 'surface-primary', 'surface-accent']),
 ('text-on-loud', ['interactive-fill-loud', 'interactive-fill-loud-hover', 'interactive-fill-loud-active']),
 ('text-inverse', ['surface-inverse']),
 ('feedback-text-positive', ['feedback-fill-positive']), ('feedback-text-negative', ['feedback-fill-negative']),
 ('feedback-text-caution', ['feedback-fill-caution']), ('feedback-text-informative', ['feedback-fill-informative']),
 ('foreground', ['background']), ('card-foreground', ['card']), ('muted-foreground', ['background', 'card', 'muted']),
 ('primary-foreground', ['primary']), ('secondary-foreground', ['secondary']), ('accent-foreground', ['accent']),
 ('destructive-foreground', ['destructive']), ('popover-foreground', ['popover']),
]
NONTEXT = [('input', ['background', 'card']), ('focus-ring', ['background', 'card']), ('selected-indicator', ['surface-primary'])]
bad = []; known = []; n = 0
for fg, bgs in TEXT + NONTEXT:
    need = 4.5 if (fg, bgs) in TEXT else 3.0
    for bg in bgs:
        if fg not in colors or bg not in colors: bad.append(f'{fg} × {bg}: token não existe'); continue
        a, b = rgb(colors[fg]), rgb(colors[bg])
        if not a or not b: continue
        n += 1; r = ratio(a, b)
        if r < need:
            k = f'{fg} sobre {bg}'
            (known if k in EXC.get('TOK-03', {}) else bad).append(f'{k} = {r:.2f}:1 (mínimo {need}:1)')
add('TOK-03', not bad, f'{n} pares de token medidos' + ('' if not bad else ': ' + '; '.join(bad)))
if known: add('TOK-03', True, 'exceção registrada em excecoes.json: ' + '; '.join(known), info=True)

# ------------------------------------------------------------------ código dos componentes
files = sorted(glob.glob(SRC + '/soma/*.tsx') + glob.glob(SRC + '/ui/*.tsx'))
code = {f: open(f).read() for f in files}
css = open(P + '/components/bundle.css').read()

# TOK-01 · classe de cor/medida que não existe no CSS gerado (erro de digitação ou token inexistente)
PREF = r'(?:bg|text|border|ring|fill|stroke|divide|outline|from|to|via|shadow|rounded|gap|gap-x|gap-y|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|size|min-h|min-w|max-w|h|w)'
unknown = {}
for f, s in code.items():
    for lit in re.findall(r'''(?:className|cn\(|'|")([^'"`{}]*?)(?:'|")''', s):
        pass
    for m in re.finditer(r'''["'`]([^"'`\n]{3,400})["'`]''', s):
        for cl in m.group(1).split():
            base = re.split(r':(?![^\[]*\])', cl)[-1].lstrip('!-')
            if not re.fullmatch(PREF + r'-[a-z0-9][a-z0-9-]*(?:/[0-9]+)?', base): continue
            if base in css or base.replace('/', '\\/') in css: continue
            unknown.setdefault(base, set()).add(os.path.basename(f))
# palavras de texto comuns (não são classes) ficam de fora
ruido = {b for b in unknown if re.fullmatch(r'(?:to|from|h|w|p|m|text)-[a-z]+', b) and b.split('-', 1)[1] in {'do', 'ao', 'sua', 'seu'}}
for b in ruido: unknown.pop(b)
add('TOK-01', not unknown, 'toda classe de cor e medida existe no CSS gerado' if not unknown else 'classe inexistente: ' + ', '.join(f'{k} ({"/".join(sorted(v))})' for k, v in sorted(unknown.items())))

# TOK-02 · nenhum valor cru de cor (hex, rgb, hsl) nas telas e nos componentes
hexes = []
for f, s in code.items():
    if f.endswith('illustration.tsx'): continue
    for m in re.finditer(r"#[0-9a-fA-F]{6}\b|rgba?\(|hsla?\(", s): hexes.append(os.path.basename(f))
add('TOK-02', not hexes, 'nenhum hex, rgb ou hsl nos componentes' if not hexes else f'{len(hexes)} valores crus de cor em: ' + ', '.join(sorted(set(hexes))))

# TOK-04 · escala tipográfica fechada da v2: 11, 12, 13, 14, 15, 16, 17, 18, 22, 28, 32, 48px (os 16 estilos de texto)
ESC = {11, 12, 13, 14, 15, 16, 17, 18, 22, 28, 32, 48}
fora = {}
for f, s in code.items():
    for m in re.finditer(r'text-\[(\d+(?:\.\d+)?)px\]', s):
        if float(m.group(1)) not in ESC: fora.setdefault(m.group(0), set()).add(os.path.basename(f))
add('TOK-04', not fora, 'todo texto está na escala 11/12/13/14/15/16/17/18/22/28/32/48' if not fora else 'tamanho fora da escala: ' + ', '.join(f'{k} ({"/".join(sorted(v))})' for k, v in sorted(fora.items())))
menor = [s['name'] for s in tok['type']['groups'][0]['styles'] if float(s['fontSize'][:-2]) not in ESC]
add('TOK-04b', not menor, 'estilos de texto fora da escala da v2: ' + (', '.join(menor) or 'nenhum'))

# TOK-05 · raios fechados: nenhuma medida arbitrária em rounded-[...]
rr = sorted({m.group(0) for s in code.values() for m in re.finditer(r'rounded-\[[^\]]+\]', s)} - set(EXC.get('TOK-05', [])))
add('TOK-05', not rr, 'raios só da escala (8, 12, 16, 20, 24, 28, 32, 36, pílula)' if not rr else 'raio arbitrário: ' + ', '.join(rr))

# SPC-01 · espaçamento (gap, padding, margem) só na escala 4·8·12·16·20·24·32·40·48 (meios-passos de 6, 10, 14 e 18 só dentro de componentes). Dívida conhecida vira "info", não falha.
ESP = {4, 8, 12, 16, 20, 24, 32, 40, 48, 0}
dev = {}
for f, s in code.items():
    for m in re.finditer(r'(?<![\w-])-?(?:gap|gap-x|gap-y|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr)-\[(\d+(?:\.\d+)?)px\]', s):
        if float(m.group(1)) not in ESP: dev.setdefault(m.group(0), set()).add(os.path.basename(f))
base = {'SPC-01': EXC.get('SPC-01', {})}
novos = {k: v for k, v in dev.items() if k not in base['SPC-01']}
add('SPC-01', not novos, f'{len(dev)} medidas fora da escala, todas já listadas em excecoes.json' if not novos else 'espaçamento novo fora da escala: ' + ', '.join(f'{k} ({"/".join(sorted(v))})' for k, v in sorted(novos.items())))

# ------------------------------------------------------------------ contratos dos componentes
comps = sorted(d for d in os.listdir(P + '/components') if os.path.exists(f'{P}/components/{d}/README.md'))
sem = []; vazios = []
for c in comps:
    t = open(f'{P}/components/{c}/README.md').read()
    for chave in ('Usar para', 'Nunca', 'Verificado por'):
        if f'**{chave}:**' not in t: sem.append(f'{c}: falta "{chave}"')
    m = re.search(r'\*\*Nunca:\*\*\s*(.+)', t)
    if m and len(m.group(1).strip()) < 15: vazios.append(c)
add('CTR-01', not sem and not vazios, f'{len(comps)} componentes com contrato (Usar para, Nunca, Verificado por)' if not sem and not vazios else '; '.join((sem + [f'{c}: "Nunca" vazio' for c in vazios])[:12]))

# CAT-01 · todo componente tem categoria no mapa de decisão
try:
    cats = json.load(open(P + '/checks/categorias.json'))
    sc = [c for c in comps if c not in cats]; sob = [c for c in cats if c not in comps]
    add('CAT-01', not sc and not sob, f'{len(comps)} componentes com categoria' if not sc and not sob else 'sem categoria: ' + ', '.join(sc) + ' · categoria de componente que não existe: ' + ', '.join(sob))
except Exception as e:
    add('CAT-01', False, f'checks/categorias.json ilegível: {e}')

# IDX-01 · todo componente com contrato aparece no índice da doc 1
idx = open(P + '/1-gerar-telas-com-ia.md').read()
fora = [c for c in comps if not re.search(r'`' + c + r'`|\*\*' + c + r'\*\*|\b' + c + r'\b', idx)]
add('IDX-01', not fora, 'todo componente está no índice da doc 1' if not fora else 'fora do índice da doc 1: ' + ', '.join(fora))

# NAME-01 · todo `Soma.X` citado nas docs existe na API publicada
dts = open(P + '/components/index.d.ts').read()
api = set(re.findall(r'export declare (?:function|const|class) (\w+)', dts)) | set(re.findall(r'\n\t\t\t(\w+): typeof', dts))
usados = {}
for f in glob.glob(P + '/*.md') + glob.glob(P + '/components/*/README.md'):
    for nm in re.findall(r'Soma\.([A-Z]\w+)', open(f).read()): usados.setdefault(nm, set()).add(os.path.basename(os.path.dirname(f)) if 'components' in f else os.path.basename(f))
miss = {k: v for k, v in usados.items() if k not in api}
add('NAME-01', not miss, f'{len(usados)} nomes `Soma.X` citados nas docs existem na API' if not miss else 'nome que não existe: ' + ', '.join(f'{k} ({"/".join(sorted(v))})' for k, v in sorted(miss.items())))

# DEC-01 · o mapa de decisão está igual ao que os contratos geram agora
dm = P + '/decision-map.md'
try:
    from gen_decision_map import build
    atual = build(P)
    ok = os.path.exists(dm) and open(dm).read() == atual
    add('DEC-01', ok, 'mapa de decisão em dia com os contratos' if ok else 'decision-map.md desatualizado: rode gen_decision_map.py')
except Exception as e:
    add('DEC-01', False, f'não consegui gerar o mapa: {e}')

# ------------------------------------------------------------------ saída
w = {'ok': 'OK   ', 'falha': 'FALHA', 'info': 'info '}
for i, s, m in res: print(f'{w[s]} {i}  {m}')
if '--json' in sys.argv: json.dump([{'id': i, 'status': s, 'detalhe': m} for i, s, m in res], open(sys.argv[sys.argv.index('--json') + 1], 'w'), ensure_ascii=False, indent=1)
sys.exit(1 if any(s == 'falha' for _, s, _ in res) else 0)
