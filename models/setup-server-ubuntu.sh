#!/usr/bin/env bash
#
# Turn a fresh Ubuntu machine into the Harness Code server: Ollama with the
# graphics chip enabled, the harness-code model, and a tunnel binary.
#
# On the X1, after Ubuntu is installed:
#   curl -fsSL -o /tmp/hc-server.sh https://raw.githubusercontent.com/Harness-Studio-US/Harness-Studio/main/models/setup-server-ubuntu.sh && sudo bash /tmp/hc-server.sh
#
# Safe to run twice. It does not touch the tunnel or the website; it prints what
# to do next at the end.

set -euo pipefail

REPO_RAW="${REPO_RAW:-https://raw.githubusercontent.com/Harness-Studio-US/Harness-Studio/main/models}"
NAME="${NAME:-harness-code}"
WEBSITE_ORIGIN="${WEBSITE_ORIGIN:-https://harness-studio-us.github.io}"

say() { printf '%s\n' "$*"; }
die() { printf 'Problem: %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "run this with sudo: sudo bash $0"

say "1/5  Ollama"
if command -v ollama >/dev/null 2>&1; then
  say "     already installed"
else
  curl -fsSL https://ollama.com/install.sh | sh
fi

say "2/5  Vulkan drivers and cloudflared"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq mesa-vulkan-drivers vulkan-tools curl ca-certificates >/dev/null

if command -v cloudflared >/dev/null 2>&1; then
  say "     cloudflared already installed"
else
  case "$(uname -m)" in
    x86_64) pkg="cloudflared-linux-amd64.deb" ;;
    aarch64) pkg="cloudflared-linux-arm64.deb" ;;
    *) die "unknown architecture: $(uname -m)" ;;
  esac
  curl -fsSL -o /tmp/cloudflared.deb \
    "https://github.com/cloudflare/cloudflared/releases/latest/download/$pkg"
  dpkg -i /tmp/cloudflared.deb >/dev/null
  rm -f /tmp/cloudflared.deb
fi

say "3/5  pointing Ollama at the graphics chip and allowing the website"
mkdir -p /etc/systemd/system/ollama.service.d
cat >/etc/systemd/system/ollama.service.d/harness.conf <<EOF
[Service]
Environment="OLLAMA_VULKAN=1"
Environment="OLLAMA_IGPU_ENABLE=1"
Environment="OLLAMA_ORIGINS=$WEBSITE_ORIGIN,http://localhost:3000,http://127.0.0.1:3000"
EOF
systemctl daemon-reload
systemctl enable ollama >/dev/null 2>&1 || true
systemctl restart ollama

say "4/5  waiting for Ollama to answer"
ready=0
for _ in $(seq 1 30); do
  if curl -fsS -m 2 -o /dev/null http://127.0.0.1:11434/api/tags 2>/dev/null; then
    ready=1
    break
  fi
  sleep 1
done
[ "$ready" -eq 1 ] || die "Ollama did not come back. Read: sudo journalctl -u ollama -n 50 --no-pager"

say "5/5  building $NAME (a few GB the first time)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
curl -fsSL -o "$work/Modelfile" "$REPO_RAW/Modelfile" || die "could not download the Modelfile"
base="$(awk '/^FROM[[:space:]]/{print $2; exit}' "$work/Modelfile")"
[ -n "$base" ] || die "no FROM line in the downloaded Modelfile"
say "     base model: $base"
ollama pull "$base"
ollama create "$NAME" -f "$work/Modelfile"

say ""
say "Graphics chip Ollama can see:"
vulkaninfo --summary 2>/dev/null | grep -E "deviceName|driverName" | head -4 || say "  (vulkaninfo found nothing)"

say ""
say "Model built. Now, in a normal terminal (no sudo), start the tunnel:"
say ""
say '  cloudflared tunnel --url http://127.0.0.1:11434 --http-host-header="localhost:11434"'
say ""
say "It prints a line like https://something-something.trycloudflare.com"
say "Put that URL plus /v1 into the repository variable VITE_AI_ENDPOINT."
