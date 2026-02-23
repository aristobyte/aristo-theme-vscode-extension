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

if ! ls -1 *.vsix >/dev/null 2>&1; then
  echo "[release] No VSIX files found. Run scripts/build.sh first." >&2
  exit 1
fi

VERSION="${TAG#v}"
PKG_NAME=$(node -p "require('./package.json').name")
PKG_PUBLISHER=$(node -p "require('./package.json').publisher")
PKG_DISPLAY_NAME=$(node -p "require('./package.json').displayName")
REPO_URL=$(node -p "require('./package.json').repository.url")
HOMEPAGE_URL=$(node -p "require('./package.json').homepage")
ISSUES_URL=$(node -p "require('./package.json').bugs.url")
CHANGELOG_URL="${REPO_URL}/blob/master/CHANGELOG.md"
MARKETPLACE_URL="https://marketplace.visualstudio.com/items?itemName=${PKG_PUBLISHER}.${PKG_NAME}"
OPEN_VSX_URL="https://open-vsx.org/extension/${PKG_PUBLISHER}/${PKG_NAME}"

CHANGELOG_SECTION=$(awk -v v="$VERSION" '
BEGIN { in_block=0 }
$0 ~ "^## \\[" v "\\]" { in_block=1; next }
$0 ~ "^## \\[" && in_block==1 { exit }
in_block==1 { print }
' CHANGELOG.md)

if [[ -z "$CHANGELOG_SECTION" ]]; then
  CHANGELOG_SECTION="No changelog section found for version \`${VERSION}\`."
fi

NOTES_FILE=$(mktemp)
cat > "$NOTES_FILE" <<EOF
# ${PKG_DISPLAY_NAME} ${TAG}

## Release Summary

This release was generated from the tagged version \`${TAG}\`.

| Item | Value |
|---|---|
| Extension ID | \`${PKG_PUBLISHER}.${PKG_NAME}\` |
| Version | \`${VERSION}\` |
| Tag | \`${TAG}\` |

## What's Changed

${CHANGELOG_SECTION}

## Installation

- VS Code Marketplace: [Install ${PKG_DISPLAY_NAME}](${MARKETPLACE_URL})
- Open VSX: [Install ${PKG_DISPLAY_NAME}](${OPEN_VSX_URL})

## Resources

- Homepage: [${HOMEPAGE_URL}](${HOMEPAGE_URL})
- Repository: [${REPO_URL}](${REPO_URL})
- Changelog: [CHANGELOG.md](${CHANGELOG_URL})
- Issues: [Report an issue](${ISSUES_URL})

## Notes

- A \`.vsix\` build artifact is attached to this release.
- If you are updating from an older package identity, uninstall the old extension ID first.
EOF

echo "[release] Creating GitHub release for $TAG"
gh release create "$TAG" \
  --repo "$REPO" \
  --title "${PKG_DISPLAY_NAME} ${TAG}" \
  --notes-file "$NOTES_FILE" \
  *.vsix

rm -f "$NOTES_FILE"

echo "[release] Release created"
