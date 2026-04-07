#!/usr/bin/env bash
# build.sh — Script de build para Render

set -o errexit

pip install --upgrade pip
pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Optional bulk card import for production DB.
# Enable only when needed to avoid long deploy times.
if [ "${IMPORT_CARDS_ON_BUILD:-false}" = "true" ]; then
	PAGE_SIZE="${CARDS_IMPORT_PAGE_SIZE:-250}"
	MAX_PAGES="${CARDS_IMPORT_MAX_PAGES:-40}"
	python getdata.py --page-size "$PAGE_SIZE" --max-pages "$MAX_PAGES"
fi
