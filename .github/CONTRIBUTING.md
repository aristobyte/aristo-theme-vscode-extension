# Contributing to AristoByte Color Theme

Thanks for contributing.

## Project scope

This repository is a VS Code color theme extension. Contributions typically involve:

- Theme token and UI color improvements
- Documentation updates
- Release/version updates

## Prerequisites

- Node.js 20+
- Yarn 1.x
- VS Code 1.105+

## Local workflow

1. Install dependencies:

```bash
yarn install --frozen-lockfile
```

2. Package the extension:

```bash
yarn package
```

3. Install the generated `.vsix` into VS Code:

```bash
yarn install:local
```

4. Verify in VS Code:

- Open Command Palette
- Run `Preferences: Color Theme`
- Select `AristoByte Dark` or `AristoByte Light`

## Branching and pull requests

- Create branches from `master`.
- Use clear branch names like `theme/token-contrast` or `docs/readme-update`.
- Open PRs against `master`.
- Add before/after screenshots for visual changes.

## Release process

Releases are automated via GitHub Actions and run only from `master`.

1. Bump version in `package.json` (for example `yarn release:patch`).
2. Update `CHANGELOG.md`.
3. Merge into `master`.
4. The `Release` workflow publishes to:
   - VS Code Marketplace (requires `VSCE_PAT` secret)
   - Open VSX (requires `OVSX_PAT` secret)
   - GitHub Releases (tag: `v<version>`)

## Code of conduct

See `.github/CODE_OF_CONDUCT.md`.
