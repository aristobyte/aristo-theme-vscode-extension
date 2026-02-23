#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$ROOT_DIR"

echo "[build] Cleaning previous VSIX files"
rm -f *.vsix

echo "[build] Packaging extension"
npx @vscode/vsce package

echo "[build] Build complete"
