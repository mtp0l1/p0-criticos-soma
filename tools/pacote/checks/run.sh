#!/usr/bin/env bash
# Roda todas as verificações. Uso: bash checks/run.sh   (da pasta do design system)
# ACC-01 e ACC-02 precisam de Playwright e das visualizações em test/ (geradas pelo build do projeto).
set -u
cd "$(dirname "$0")/.."
python3 checks/gen_decision_map.py .
python3 checks/ds_checks.py . --json checks/resultado.json
