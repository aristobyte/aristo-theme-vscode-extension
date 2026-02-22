# AristoByte VS Code Color Theme

AristoByte is a production-ready VS Code theme system built for readability, minimalism, and long developer sessions.

## Overview

AristoByte ships with:

- Two complete themes (`AristoByte Dark`, `AristoByte Light`)
- Full workbench/editor coverage
- Onboarding dashboard inside VS Code
- Structured documentation and support guides

## Compatibility

- Supported VS Code version: `>=1.90.0`
- Optimized for latest stable VS Code while remaining compatible with older supported builds

## Themes

### AristoByte Dark

- Brand-forward dark experience
- Broad VS Code component coverage
- Semantic token support

### AristoByte Light

- Light counterpart with readability-tuned contrast
- Same structural key coverage as dark
- Brand association preserved with adapted light-safe accents

## In-Editor Dashboard

AristoByte includes a native walkthrough dashboard (inside the extension view) with:

- Overview
- Installation
- Customization
- Accessibility
- Troubleshooting

You can open it via command palette:

- `AristoByte: Open Getting Started Dashboard`

## Commands

- `AristoByte: Open Getting Started Dashboard`
- `AristoByte: Open Documentation Index`
- `AristoByte: Open Marketplace/Homepage`
- `AristoByte: Apply Dark Theme`
- `AristoByte: Apply Light Theme`

## Settings

- `aristobyteTheme.showWalkthroughOnInstallOrUpdate`
- `aristobyteTheme.defaultThemeOnInstall`
- `aristobyteTheme.openDocsInEditor`

## Documentation Portal

- Index: `docs/INDEX.md`
- Features/runtime: `docs/FEATURES.md`
- Overview: `docs/OVERVIEW.md`
- Installation: `docs/INSTALLATION.md`
- Usage: `docs/USAGE.md`
- Customization: `docs/CUSTOMIZATION.md`
- Accessibility: `docs/ACCESSIBILITY.md`
- Troubleshooting: `docs/TROUBLESHOOTING.md`
- FAQ: `docs/FAQ.md`
- Support: `docs/SUPPORT.md`
- Privacy: `docs/PRIVACY.md`
- Release guide: `docs/RELEASE.md`
- Publish reset guide: `docs/PUBLISH_RESET.md`
- Metadata checklist: `docs/SEO_METADATA.md`
- Dark architecture: `docs/THEME_DARK_GUIDE.md`
- Placeholder map: `docs/IMAGE_REPLACEMENT_MAP.md`

## Placeholder Assets

All planned visuals are present as named placeholders:

- Directory: `media/placeholders/`
- Replacement map: `docs/IMAGE_REPLACEMENT_MAP.md`

![Marketplace Placeholder](media/placeholders/marketplace-banner-placeholder.png)

## Installation

### Marketplace install

1. Open Extensions in VS Code.
2. Search `AristoByte Color Theme`.
3. Install and activate the preferred theme.

### Manual install

1. Download a release `.vsix`.
2. Run `Extensions: Install from VSIX...`.
3. Reload VS Code.

## Local Development

```bash
npm install
npm run package
npm run install:local
```

## Release

Release is automated from `master`:

- `scripts/detect-bump.sh` (bump type detection from last commit)
- `scripts/bump.sh` (version + changelog update)
- `scripts/build.sh` (VSIX packaging)
- `scripts/publish.sh` (Marketplace + Open VSX publish)
- VS Code Marketplace publish
- Open VSX publish
- GitHub Release creation

Required repository secrets:

- `VSCE_PAT`
- `OVSX_PAT`

## Support

- Issues: <https://github.com/aristobyte/aristo-theme-vscode-extension/issues>
- Discussions: <https://github.com/aristobyte/aristo-theme-vscode-extension/discussions>

## License

MIT License © 2026 AristoByte
