#!/usr/bin/env python3
"""Gera decision-map.md a partir dos contratos dos READMEs. Não edite o mapa à mão: mude o contrato e rode de novo.
Uso: python3 gen_decision_map.py <pasta do design system>"""
import os, re, sys, json

ORDEM = ['Ação', 'Navegação', 'Formulário', 'Cadastro', 'Início', 'Quiz', 'Ranking e social', 'Recompensas', 'Reciclar e entrega', 'Doar', 'Feedback e estados', 'Sobreposição', 'Layout e conteúdo']

def build(P):
    cats = json.load(open(P + '/checks/categorias.json'))
    por = {}
    for c in sorted(cats):
        f = f'{P}/components/{c}/README.md'
        if not os.path.exists(f): continue
        t = open(f).read()
        u = re.search(r'\*\*Usar para:\*\*\s*(.+)', t); n = re.search(r'\*\*Nunca:\*\*\s*(.+)', t)
        por.setdefault(cats[c], []).append((c, u.group(1).strip() if u else '', n.group(1).strip() if n else ''))
    out = ['# Mapa de decisão', '',
           'Gerado dos contratos dos componentes (`checks/gen_decision_map.py`). **Não edite à mão:** mude o "Usar para" ou o "Nunca" no README do componente e gere de novo.',
           '', 'Como usar: ache a necessidade da tela na coluna "Usar para". Se achar, use o componente. Se não achar, é peça nova: siga a triagem em `7-regras-e-verificacoes.md`.', '']
    for cat in ORDEM + sorted(set(por) - set(ORDEM)):
        if cat not in por: continue
        out += [f'## {cat}', '', '| Componente | Usar para | Nunca |', '|---|---|---|']
        out += [f'| `{c}` | {u.replace("|", "/")} | {n.replace("|", "/")} |' for c, u, n in por[cat]]
        out.append('')
    return '\n'.join(out)

if __name__ == '__main__':
    P = sys.argv[1].rstrip('/')
    open(P + '/decision-map.md', 'w').write(build(P))
    print('decision-map.md gerado')
