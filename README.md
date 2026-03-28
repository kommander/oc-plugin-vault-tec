# Vault-Tec plugin for OpenCode

Vault-Tec is an OpenCode plugin that applies a Vault-Tec system prompt and a Vault-Tec TUI experience.

![Vault-Tec demo](assets/demo.png)

## Installation

Install from the CLI:

```bash
opencode plugin oc-plugin-vault-tec
```

Or from OpenCode commands:

1. Press `Ctrl+P`
2. Select `Install Plugin`
3. Enter `oc-plugin-vault-tec`

## Options

Plugin options can be configured via the `opencode.json` and `tui.json` config files.

### Server

- `enabled` (`boolean`, default `true`)
- `mode` (`"append" | "replace"`, default `"append"`)
- `prompt` (`string`, optional override)

### TUI

- `enabled` (`boolean`, default `true`)
- `theme` (`string`, default `"vault-tec"`)
- `set_theme` (`boolean`, default `true`)
- `scanlines` (`boolean`, default `true`)
- `vignette` (`number`, default `0.75`)
- `sidebar` (`boolean`, default `true`)
- `tips` (`boolean`, default `true`)
