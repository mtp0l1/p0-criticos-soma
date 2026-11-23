#!/bin/sh
# Verificação rápida antes de publicar: sintaxe de todo módulo do site e, se o Chrome existir, teste de todas as rotas e previews.
set -e
cd "$(dirname "$0")/../design-system"
erro=0
for f in site/pages/*.js site/nav.js site/app.js site/search-index.js site/aliases.js ds/js/*.js; do
  node --check --input-type=module < "$f" >/dev/null 2>&1 || { echo "ERRO de sintaxe: $f"; erro=1; }
done
[ $erro = 0 ] || exit 1
echo "sintaxe ok"
if [ -d ../tools/node_modules/puppeteer-core ] && { [ -d "/Applications/Google Chrome.app" ] || command -v google-chrome >/dev/null 2>&1 || [ -n "$CHROME_PATH" ]; }; then node ../tools/testar-site.mjs; fi
