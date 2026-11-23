# -*- coding: utf-8 -*-
"""Liga a folha de estilo de apresentação (assets/preview.css) em todos os previews. Idempotente."""
import os, re
ds = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'design-system')
pv = os.path.join(ds, 'previews')
LINK = '<link rel="stylesheet" href="../assets/preview.css">'
n = 0
for f in sorted(os.listdir(pv)):
    if not f.endswith('.html'): continue
    p = os.path.join(pv, f); s = open(p, encoding='utf-8').read()
    if 'assets/preview.css' in s: continue
    novo = s.replace('<link rel="stylesheet" href="../assets/bundle.css">', '<link rel="stylesheet" href="../assets/bundle.css">' + LINK, 1)
    if novo == s: print('sem bundle.css:', f); continue
    open(p, 'w', encoding='utf-8').write(novo); n += 1
print('previews com preview.css ligado agora:', n)
