#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$ROOT_DIR"

TAG="${1:-}"
REPO="${2:-${GITHUB_REPOSITORY:-}}"

if [[ -z "$TAG" ]]; then
  echo "[release] Missing tag argument" >&2
  exit 1
fi

if [[ -z "$REPO" ]]; then
  echo "[release] Missing repository (arg2 or GITHUB_REPOSITORY)" >&2
  exit 1
fi

if [[ -z "${GH_TOKEN:-}" ]]; then
  echo "[release] GH_TOKEN is missing" >&2
  exit 1
fi

if gh release view "$TAG" --repo "$REPO" >/dev/null 2>&1; then
  echo "[release] GitHub release for $TAG already exists."
  exit 0
fi

echo "[release] Creating GitHub release for $TAG"
gh release create "$TAG" \
  --repo "$REPO" \
  --title "$TAG" \
  --generate-notes

echo "[release] Release created"
