# Dark Theme Architecture

This document describes the production dark theme system for AristoByte.

## Files

- Main theme file: `themes/aristobyte-dark-color-theme.json`
- Light theme parity file: `themes/aristobyte-light-color-theme.json`
- Brand palette source: `themes/aristobyte-brand-palette.json`

## Design direction

- Minimal, low-noise editor chrome
- Warm brand accents on top of deep blue-black surfaces
- Strong contrast for long development sessions
- Predictable token hierarchy (keywords/functions/types/strings/numbers)

## Coverage scope

The dark theme includes a broad UI surface, including:

- Editor and gutter systems
- Tabs, title bar, sidebar, panels, activity bar, status bar
- Inputs, dropdowns, buttons, quick pick, menus, notifications
- Terminal, ANSI palette, terminal decorations
- Debug, testing, merge editor, peek view, diff editor
- Git decorations and chart colors
- Token colors and semantic token colors

Current implementation detail:

- `colors` contains 500+ keys (507 currently)
- Coverage includes all keys used by the built-in default VS Code themes (`dark_plus`, `dark_modern`, `dark_vs`, and related defaults)

## Brand mapping

Brand palette anchors:

- `#FFEE27`
- `#FEC800`
- `#F18E35`
- `#E95F32`
- `#E2312D`

Neutral support tones are used for readability and visual balance on dark backgrounds.

## Extending safely

When adding or adjusting keys:

1. Keep base backgrounds stable.
2. Reuse brand accents for interactive/focus states.
3. Reserve red primarily for errors/conflicts.
4. Validate semantic token readability in TypeScript, Python, Rust, Go, JSON, and Markdown.
