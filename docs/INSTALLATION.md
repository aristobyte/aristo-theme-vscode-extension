# Installation

## Compatibility

- Minimum supported VS Code version: `1.90.0`
- Recommended: latest stable VS Code

## Option 1: VS Code Marketplace

1. Open Extensions in VS Code.
2. Search for `AristoByte Color Theme`.
3. Click **Install**.
4. Run `Preferences: Color Theme` and choose your preferred AristoByte theme.

## Option 2: Open VSX

1. Install from Open VSX if your editor distribution uses it.
2. Select the theme after installation.

## Option 3: Manual VSIX installation

1. Download a `.vsix` file from releases.
2. Run `Extensions: Install from VSIX...`.
3. Reload VS Code.

## Option 4: Build from source (developer/local)

```bash
git clone https://github.com/aristobyte/aristo-theme-vscode-extension.git
cd aristo-theme-vscode-extension
yarn install --frozen-lockfile
yarn package
yarn install:local
```

## Verify installation

- Open Command Palette.
- Run `Preferences: Color Theme`.
- Confirm `AristoByte Dark` and `AristoByte Light` are visible.

![Installation Steps](../media/assets/installation-steps.gif)
