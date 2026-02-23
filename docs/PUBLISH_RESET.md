# Publish Reset and Old Version Removal

Use this guide if you changed repository/location and want a clean restart.

## 1) Decide your extension identity strategy

VS Code extension identity is:

- `publisher` + `name` (from `package.json`)

If you want to **keep existing users and upgrade path**, keep the same identity.

If you want a **fresh start from scratch**, use a new identity by changing either:

- `publisher`
- `name`

## 2) Remove old extension from local VS Code

```bash
code --uninstall-extension <publisher>.<name>
```

Example:

```bash
code --uninstall-extension aristobyte.aristo-theme-vscode-color-theme
```

## 3) Remove old extension from VS Code Marketplace (if desired)

```bash
npx @vscode/vsce unpublish <publisher>.<name>
```

Example:

```bash
npx @vscode/vsce unpublish aristobyte.aristo-theme-vscode-color-theme
```

## 4) Remove old extension from Open VSX (if desired)

```bash
npx ovsx unpublish <publisher>.<name>
```

Example:

```bash
npx ovsx unpublish aristobyte.aristo-theme-vscode-color-theme
```

## 5) Publish the new extension identity

```bash
npm run package
npx @vscode/vsce publish -p "$VSCE_PAT"
npx ovsx publish -p "$OVSX_PAT"
```

## 6) Important note about continuity

If you publish with a new identity, users of the old identity do not auto-upgrade. They must install the new extension manually.
