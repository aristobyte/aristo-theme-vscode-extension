# AristoByte VS Code Color Theme

AristoByte is a production-ready VS Code theme system built for readability, minimalism, and long developer sessions.

## Overview

AristoByte ships with:

- Eight complete themes:
  - `AristoByte Dark`
  - `AristoByte Midnight`
  - `AristoByte Dusk`
  - `AristoByte High Contrast Dark`
  - `AristoByte OLED`
  - `AristoByte Light`
  - `AristoByte Soft Light`
  - `AristoByte High Contrast Light`
- Full workbench/editor coverage
- Onboarding dashboard inside VS Code
- Structured documentation and support guides

## Compatibility

- Supported VS Code version: `>=1.90.0`
- Optimized for latest stable VS Code while remaining compatible with older supported builds
- AristoByte reference: <https://aristobyte.com>

## Themes

### AristoByte Dark

- Brand-forward dark experience
- Broad VS Code component coverage
- Semantic token support

### AristoByte Midnight / Dusk / OLED

- Deeper or warmer dark variants for different working environments
- Retain AristoByte syntax semantics with tuned contrast models

### AristoByte High Contrast Dark / High Contrast Light

- Accessibility-first high contrast variants with stronger boundaries
- Built for maximum legibility across workbench + editor surfaces

### AristoByte Light

- Light counterpart with readability-tuned contrast
- Same structural key coverage as dark
- Brand association preserved with adapted light-safe accents

### AristoByte Soft Light

- Softer daytime palette with reduced visual intensity
- Keeps semantic clarity while lowering glare

## In-Editor Dashboard

AristoByte includes a native walkthrough dashboard (inside the extension view) with:

- Overview
- Installation
- Customization
- Accessibility
- Troubleshooting

You can open it via command palette:

- `AristoByte: Open Home`
- `AristoByte: Open Getting Started Dashboard`

## Commands

- `AristoByte: Open Home`
- `AristoByte: Open Getting Started Dashboard`
- `AristoByte: Open Documentation Index`
- `AristoByte: Open Marketplace/Homepage`
- `AristoByte: Apply Dark Theme`
- `AristoByte: Apply Light Theme`
- `AristoByte: Apply Midnight Theme`
- `AristoByte: Apply Dusk Theme`
- `AristoByte: Apply High Contrast Dark Theme`
- `AristoByte: Apply High Contrast Light Theme`
- `AristoByte: Apply OLED Theme`
- `AristoByte: Apply Soft Light Theme`

## Settings

- `aristobyteTheme.postInstallExperience`
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

## Visual Assets

- Directory: `assets/`

![Marketplace Banner](assets/marketplace-banner.png)

## Installation

### Marketplace install

1. Open Extensions in VS Code.
2. Search `AristoByte Color Theme`.
3. Install and activate the preferred theme.

### Manual install

1. Download a release `.vsix`.
2. Run `Extensions: Install from VSIX...`.
3. Reload VS Code.

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

## For Developers

Developer onboarding, local run flow, and all package commands are documented in `DEVELOPMENT.md`.

## Support

- Issues: <https://github.com/aristobyte/aristo-theme-vscode-extension/issues>
- Discussions: <https://github.com/aristobyte/aristo-theme-vscode-extension/discussions>
- Website: <https://aristobyte.com>

## License

MIT License © 2026 AristoByte
