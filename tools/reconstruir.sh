#!/bin/sh
# Reaplica a v2 sobre a fonte da v4 e recompila: tokens → componentes → páginas → bundle → miniaturas.
set -e
cd "$(dirname "$0")"
python3 aplicar-v2-componentes.py
python3 alinhar-app-componentes.py
python3 migrar-tokens-v2.py
python3 gerar-fundamentos.py
python3 atualizar-docs-v2.py
python3 atualizar-docs-v2b.py
python3 atualizar-figma-v2.py
python3 atualizar-guias-v2.py
python3 alinhar-app-paginas.py
python3 organizar-previews.py
python3 gerar-galeria.py
node build.mjs
[ "$1" = "--sem-miniaturas" ] || node thumbs.mjs
python3 gerar-telas-v2.py
python3 empacotar.py
./verificar.sh
