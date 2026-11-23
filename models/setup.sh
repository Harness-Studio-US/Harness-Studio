#!/usr/bin/env bash
# Builds the two Harness models from the Modelfiles beside this script.
#
#   bash models/setup.sh                 # harness-code and harness-copilot
#   bash models/setup.sh code            # only one of them
#
# Names can be overridden: CODE_NAME=... COPILOT_NAME=... bash models/setup.sh
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
which="${1:-both}"
code_name="${CODE_NAME:-harness-code}"
copilot_name="${COPILOT_NAME:-harness-copilot}"

die() { printf 'Problem: %s\n' "$*" >&2; exit 1; }

if ! command -v ollama >/dev/null 2>&1; then
  die "Ollama is not installed. Get it from https://ollama.com/download, then run this again."
fi

build() { # modelfile name
  local file="$1" name="$2" base
  [ -f "$file" ] || die "missing $file"
  base="$(awk '/^FROM[[:space:]]/{print $2; exit}' "$file")"
  [ -n "$base" ] || die "no FROM line in $file"
  # HARNESS_BASE=qwen2.5-coder:7b builds the same model on a stronger Apache
  # base without editing the Modelfile. Slower, noticeably better at code.
  if [ -n "${HARNESS_BASE:-}" ] && [ "${HARNESS_BASE}" != "$base" ]; then
    echo "Overriding base: $base -> $HARNESS_BASE"
    local swapped
    swapped="$(mktemp)"
    awk -v base="$HARNESS_BASE" '
      /^FROM[[:space:]]/ && !done { print "FROM " base; done = 1; next }
      { print }
    ' "$file" >"$swapped"
    file="$swapped"
    base="$HARNESS_BASE"
  fi
  echo "Base model for $name: $base"
  ollama pull "$base"
  echo "Creating $name…"
  ollama create "$name" -f "$file"
  echo
}

case "$which" in
  code) build "$here/Modelfile" "$code_name" ;;
  copilot) build "$here/Modelfile.copilot" "$copilot_name" ;;
  both)
    build "$here/Modelfile" "$code_name"
    build "$here/Modelfile.copilot" "$copilot_name"
    ;;
  *) die "unknown target '$which' (use code, copilot or both)" ;;
esac

echo "Done. Try them:"
echo "  ollama run $code_name \"a fetch wrapper with a timeout\""
echo "  ollama run $copilot_name \"how do I centre a div?\""
echo
echo "Then point the console at them by adding these lines to .env.local:"
echo "  VITE_AI_MODEL=$code_name"
echo "  VITE_AI_COPILOT_MODEL=$copilot_name"
echo
echo "and restart with: bun run dev"
