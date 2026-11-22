#!/usr/bin/env bash
#
# Build (or rebuild) the "harness-code" model on this machine, straight from the
# repo, without cloning anything.
#
# On the ZBook:
#   curl -fsSL -o /tmp/hc-model.sh https://raw.githubusercontent.com/Harness-Studio-US/Harness-Studio/main/models/install-model.sh && bash /tmp/hc-model.sh
#
# It runs as your normal user, not root: the model lives in your home folder.
# Safe to run twice; the second run only rebuilds the model.

set -euo pipefail

REPO_RAW="${REPO_RAW:-https://raw.githubusercontent.com/Harness-Studio-US/Harness-Studio/main/models}"
NAME="${1:-harness-code}"

say() { printf '%s\n' "$*"; }
die() { printf 'Problem: %s\n' "$*" >&2; exit 1; }

command -v ollama >/dev/null 2>&1 \
  || die "ollama is not installed on this machine"
command -v curl >/dev/null 2>&1 || die "curl is not installed (sudo apt install curl)"

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

say "1/4  downloading the model definition"
curl -fsSL -o "$work/Modelfile" "$REPO_RAW/Modelfile" || die "could not download the Modelfile"

base="$(awk '/^FROM[[:space:]]/{print $2; exit}' "$work/Modelfile")"
[ -n "$base" ] || die "no FROM line in the downloaded Modelfile"
say "     base model: $base"

say "2/4  pulling $base (a few GB the first time)"
ollama pull "$base"

say "3/4  creating $NAME"
ollama create "$NAME" -f "$work/Modelfile"

say "4/4  checking that it answers"
answer="$(ollama run "$NAME" "Say hi in five words." 2>/dev/null | tr -d '\r' | head -c 300)"
if [ -z "$answer" ]; then
  say ""
  say "The model was built but gave an empty answer."
  say "Send that line to the coding agent and it will take it from there."
  exit 1
fi

say ""
say "It answered:"
say "  $answer"
say ""
say "Done. Reload the website and try the chat."
