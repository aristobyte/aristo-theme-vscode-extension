#!/usr/bin/env bash
set -euo pipefail

LAST_COMMIT_MSG=$(git log -1 --pretty=%s)

case "$LAST_COMMIT_MSG" in
  feat*|feature*) BUMP_TYPE="minor" ;;
  fix*|chore*|docs*) BUMP_TYPE="patch" ;;
  ref*|refactor*) BUMP_TYPE="major" ;;
  *) BUMP_TYPE="patch" ;;
esac

printf '%s\n' "$BUMP_TYPE"
