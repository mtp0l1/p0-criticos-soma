#!/bin/sh
# Reaplica a v2 sobre a fonte da v4 e recompila: tokens → componentes → páginas → bundle → miniaturas.
set -e
cd "$(dirname "$0")"
python3 aplicar-v2-componentes.py
python3 migrar-tokens-v2.py
python3 gerar-fundamentos.py
python3 atualizar-docs-v2.py
node build.mjs
[ "$1" = "--sem-miniaturas" ] || node thumbs.mjs
python3 gerar-telas-v2.py
