#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$ROOT_DIR"

if [[ -z "${VSCE_PAT:-}" ]]; then
  echo "[publish] VSCE_PAT is missing" >&2
  exit 1
fi

if [[ -z "${OVSX_PAT:-}" ]]; then
  echo "[publish] OVSX_PAT is missing" >&2
  exit 1
fi

VSIX_FILE=$(ls -t *.vsix 2>/dev/null | head -n 1 || true)
if [[ -z "$VSIX_FILE" ]]; then
  echo "[publish] No VSIX file found. Run scripts/build.sh first." >&2
  exit 1
fi

echo "[publish] Publishing to VS Code Marketplace"
npx @vscode/vsce publish -p "$VSCE_PAT"

echo "[publish] Publishing to Open VSX using $VSIX_FILE"
npx ovsx publish "$VSIX_FILE" -p "$OVSX_PAT"

echo "[publish] Publish complete"
