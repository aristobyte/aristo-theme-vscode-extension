# Release Guide

## Trigger model

- Single release workflow
- Runs on pushes to `master`
- Also supports manual `workflow_dispatch`

## Required repository secrets

- `VSCE_PAT`: token for VS Code Marketplace publish
- `OVSX_PAT`: token for Open VSX publish

## Release flow

1. Merge changes to `master` (or run manual `workflow_dispatch`).
2. Workflow order:
   - `scripts/detect-bump.sh` determines `patch` / `minor` / `major` from the last commit message
   - `scripts/bump.sh` bumps `package.json` and appends release notes into `CHANGELOG.md`
   - Workflow commits the bump and creates tag `v<version>`
   - `scripts/build.sh` packages a `.vsix`
   - `scripts/publish.sh` publishes to VS Code Marketplace and Open VSX
   - GitHub Release is created with the `.vsix` asset

## Bump detection rules

- `feat*` / `feature*` -> `minor`
- `fix*` / `chore*` / `docs*` -> `patch`
- `ref*` / `refactor*` -> `major`
- anything else -> `patch`
