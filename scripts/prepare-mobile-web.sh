#!/usr/bin/env bash
set -euo pipefail
rm -rf www
mkdir -p www
for path in index.html manifest.json sw.js css js icons; do
  if [ -e "$path" ]; then
    cp -R "$path" www/
  fi
done
# Optional static reference/document directories are included when present.
for path in legal docs pwa; do
  if [ -e "$path" ]; then
    cp -R "$path" www/
  fi
done
for required in www/index.html www/js/app.js www/js/data.js; do
  test -f "$required" || { echo "Missing mobile web asset: $required" >&2; exit 1; }
done
echo "Prepared Capacitor web bundle in www/"
