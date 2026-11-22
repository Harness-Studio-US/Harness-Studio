#!/usr/bin/env bash
#
# Let the Harness Studio website talk to the Ollama running on this machine.
#
# On the ZBook:
#   curl -fsSL -o /tmp/origins.sh https://raw.githubusercontent.com/Harness-Studio-US/Harness-Studio/main/models/set-ollama-origins.sh && sudo bash /tmp/origins.sh
#
# It writes one small systemd drop-in, restarts Ollama and then checks the
# result. Safe to run twice.

set -euo pipefail

ORIGINS="${ORIGINS:-https://harness-studio-us.github.io,http://localhost:3000,http://127.0.0.1:3000}"
REQUIRED_ORIGIN="https://harness-studio-us.github.io"
DROPIN_DIR="/etc/systemd/system/ollama.service.d"
DROPIN="${DROPIN_DIR}/origins.conf"
API="http://127.0.0.1:11434"

say() { printf '%s\n' "$*"; }
die() { printf 'Problem: %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "this needs root, run it with: sudo bash $0"
command -v curl >/dev/null 2>&1 || die "curl is not installed (sudo apt install curl)"
systemctl cat ollama.service >/dev/null 2>&1 \
  || die "there is no ollama.service on this machine, so there is nothing to restart"

say "1/4  writing $DROPIN"
mkdir -p "$DROPIN_DIR"
cat >"$DROPIN" <<EOF
[Service]
Environment="OLLAMA_ORIGINS=$ORIGINS"
EOF
cat "$DROPIN"

say "2/4  reloading systemd and restarting Ollama"
systemctl daemon-reload
systemctl restart ollama

say "3/4  waiting for Ollama to answer"
ready=0
for _ in $(seq 1 30); do
  if curl -fsS -m 2 -o /dev/null "$API/api/tags" 2>/dev/null; then
    ready=1
    break
  fi
  sleep 1
done
[ "$ready" -eq 1 ] || die "Ollama did not come back up. Read: sudo journalctl -u ollama -n 50 --no-pager"

say "4/4  checking that $REQUIRED_ORIGIN is allowed"
headers="$(curl -sS -m 10 -D- -o /dev/null -H "Origin: $REQUIRED_ORIGIN" "$API/v1/models" || true)"
allow="$(printf '%s' "$headers" | tr -d '\r' | awk 'tolower($1) == "access-control-allow-origin:" { print $2 }')"

if [ "$allow" = "$REQUIRED_ORIGIN" ]; then
  say ""
  say "Done. The website may now use this machine."
  say "Keep Ollama and the cloudflared tunnel running."
  exit 0
fi

say ""
printf 'The check saw: %s\n' "${allow:-no access-control-allow-origin header}"
say "Nothing is broken, the restart just did not pick the file up."
say "Send that line to the coding agent and it will take it from there."
exit 1
