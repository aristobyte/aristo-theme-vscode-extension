# AristoByte Development Guide

This document is for contributors and maintainers working on the extension source.

## Prerequisites

- Node.js 20+
- Yarn 1.x (`yarn --version`)
- VS Code 1.90+

## Clone and install

```bash
git clone https://github.com/aristobyte/aristo-theme-vscode-extension.git
cd aristo-theme-vscode-extension
yarn install --frozen-lockfile
```

## Local development flow

```bash
yarn package
yarn install:local
```

To refresh quickly during iteration:

```bash
yarn reinstall:local
```

## Package scripts

- `yarn package`: package extension VSIX
- `yarn package:pre`: package pre-release VSIX
- `yarn install:local`: install latest VSIX into local VS Code
- `yarn uninstall:local`: uninstall local extension ID from VS Code
- `yarn dev`: package and install locally
- `yarn reinstall:local`: uninstall then reinstall locally
- `yarn clean:vsix`: remove VSIX files from project root
- `yarn publish:marketplace`: publish to VS Code Marketplace (interactive/authenticated environment)
- `yarn publish:ovsx`: publish to Open VSX (interactive/authenticated environment)
- `yarn publish:marketplace:token`: publish to Marketplace using `VSCE_PAT`
- `yarn publish:ovsx:token`: publish to Open VSX using `OVSX_PAT`
- `yarn bump:detect`: infer bump type from latest commit message
- `yarn bump:auto`: bump version/changelog using inferred bump type
- `yarn bump:patch`: patch release bump
- `yarn bump:minor`: minor release bump
- `yarn bump:major`: major release bump
- `yarn build:release`: clean and build VSIX for release
- `yarn publish:release`: publish built VSIX to Marketplace and Open VSX
- `yarn release:create`: create GitHub Release from current version/tag
- `yarn release:upload-assets`: upload VSIX to existing GitHub release

## Release notes

- Release workflow runs from `master`.
- Workflow uses scripts in `scripts/` for detect, bump, build, publish, and release metadata handling.
- Required secrets: `VSCE_PAT`, `OVSX_PAT`.
