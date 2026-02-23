#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$ROOT_DIR"

log_info() {
  printf '[bump] %s\n' "$*"
}

BUMP_TYPE="${1:-}"
if [[ -z "$BUMP_TYPE" ]]; then
  BUMP_TYPE=$("$ROOT_DIR/scripts/detect-bump.sh")
fi

if [[ "$BUMP_TYPE" != "patch" && "$BUMP_TYPE" != "minor" && "$BUMP_TYPE" != "major" ]]; then
  printf 'Invalid bump type: %s\n' "$BUMP_TYPE" >&2
  exit 1
fi

LAST_COMMIT_MSG=$(git log -1 --pretty=%s)
log_info "Last commit: \"${LAST_COMMIT_MSG}\""
log_info "Selected bump type: ${BUMP_TYPE}"

CURRENT_VERSION=$(node -p "require('./package.json').version")
NEW_VERSION=$(node - <<'NODE' "$CURRENT_VERSION" "$BUMP_TYPE"
const current = process.argv[2];
const type = process.argv[3];
const m = current.match(/^(\d+)\.(\d+)\.(\d+)$/);
if (!m) {
  throw new Error(`Unsupported semver format: ${current}`);
}
let [major, minor, patch] = m.slice(1).map(Number);
if (type === 'major') {
  major += 1;
  minor = 0;
  patch = 0;
} else if (type === 'minor') {
  minor += 1;
  patch = 0;
} else {
  patch += 1;
}
process.stdout.write(`${major}.${minor}.${patch}`);
NODE
)

node - <<'NODE' "$NEW_VERSION"
const fs = require('fs');
const version = process.argv[2];
const p = 'package.json';
const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
pkg.version = version;
fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + '\n');
NODE
TODAY=$(date +%F)

log_info "Version: ${CURRENT_VERSION} -> ${NEW_VERSION}"

CHANGELOG_FILE="$ROOT_DIR/CHANGELOG.md"
TMP_FILE=$(mktemp)

ENTRY_HEADER="## [${NEW_VERSION}] - ${TODAY}"
ENTRY_BODY_1="### Changed"
ENTRY_BODY_2="- Automated ${BUMP_TYPE} release bump from commit: \`${LAST_COMMIT_MSG}\`."

awk -v h="$ENTRY_HEADER" -v b1="$ENTRY_BODY_1" -v b2="$ENTRY_BODY_2" '
BEGIN { inserted=0 }
/^## \[[0-9]+\.[0-9]+\.[0-9]+\]/ && inserted==0 {
  print h
  print ""
  print b1
  print ""
  print b2
  print ""
  inserted=1
}
{ print }
END {
  if (inserted==0) {
    print ""
    print h
    print ""
    print b1
    print ""
    print b2
  }
}
' "$CHANGELOG_FILE" > "$TMP_FILE"

mv "$TMP_FILE" "$CHANGELOG_FILE"

log_info "Updated CHANGELOG.md"
log_info "BUMP_TYPE=${BUMP_TYPE}"
log_info "NEW_VERSION=${NEW_VERSION}"
