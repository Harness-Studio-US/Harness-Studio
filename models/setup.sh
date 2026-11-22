#!/usr/bin/env bash
# Builds the Harness Code model from models/Modelfile.
#
#   bash models/setup.sh              # creates "harness-code"
#   bash models/setup.sh harness-dev  # or any name you like
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
name="${1:-harness-code}"
base="$(awk '/^FROM[[:space:]]/{print $2; exit}' "$here/Modelfile")"

if [ -z "$base" ]; then
  echo "No FROM line found in $here/Modelfile" >&2
  exit 1
fi

if ! command -v ollama >/dev/null 2>&1; then
  echo "Ollama is not installed. Get it from https://ollama.com/download, then run this again." >&2
  exit 1
fi

echo "Base model: $base"
echo "Pulling $base (a few GB the first time)…"
ollama pull "$base"

echo "Creating $name…"
ollama create "$name" -f "$here/Modelfile"

echo
echo "Created. Try it:"
echo "  ollama run $name \"a fetch wrapper with a timeout\""
echo
echo "Then point the console at it by adding this line to .env.local:"
echo "  VITE_AI_MODEL=$name"
echo
echo "and restart with: bun run dev"
