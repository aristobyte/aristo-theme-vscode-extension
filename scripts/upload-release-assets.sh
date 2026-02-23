#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$ROOT_DIR"

TAG="${1:-}"
REPO="${2:-${GITHUB_REPOSITORY:-}}"

if [[ -z "$TAG" ]]; then
  echo "[release-assets] Missing tag argument" >&2
  exit 1
fi

if [[ -z "$REPO" ]]; then
  echo "[release-assets] Missing repository (arg2 or GITHUB_REPOSITORY)" >&2
  exit 1
fi

if [[ -z "${GH_TOKEN:-}" ]]; then
  echo "[release-assets] GH_TOKEN is missing" >&2
  exit 1
fi

if ! ls -1 *.vsix >/dev/null 2>&1; then
  echo "[release-assets] No VSIX files found" >&2
  exit 1
fi

echo "[release-assets] Uploading VSIX assets to release $TAG"
gh release upload "$TAG" --repo "$REPO" --clobber *.vsix

echo "[release-assets] Upload complete"
