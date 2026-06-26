---
name: rtk
description: >
  RTK (Rust Token Killer) CLI proxy integration. Reduces LLM token consumption by 60-90%
  through smart filtering and compression of command outputs. Use when running dev commands
  (git, cargo, npm, docker, etc.) to minimize token waste. Triggers: "use rtk", "token savings",
  "rtk init", "rtk gain", or when CLI output compression is needed.
---

# RTK — Rust Token Killer Skill

High-performance CLI proxy that reduces LLM token consumption by 60-90%. Single Rust binary, 100+ supported commands, <10ms overhead.

## What RTK Does

RTK intercepts CLI commands and compresses their output before it reaches LLM context:

```
Agent runs "cargo test"
  → RTK hook intercepts
  → Rewrites to "rtk cargo test"
  → Filtered output reaches LLM (~90% fewer tokens)
```

## Two-Layer Token Strategy (with caveman)

| Layer | Skill | Mechanism | Savings |
|-------|-------|-----------|---------|
| **Input** | `rtk` | CLI output compression | 60-90% |
| **Output** | `caveman` | LLM response compression | ~75% |

Combined: up to ~95% total token reduction.

## Installation

### Homebrew (macOS/Linux)
```bash
brew install rtk
```

### Quick Install (Linux/macOS)
```bash
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
```

### Cargo
```bash
cargo install --git https://github.com/rtk-ai/rtk
```

### Windows
Download from [releases](https://github.com/rtk-ai/rtk/releases): `rtk-x86_64-pc-windows-msvc.zip`

Extract `rtk.exe` to a PATH directory (e.g. `C:\Users\<you>\.local\bin`).

### Verify
```bash
rtk --version   # Should show: rtk 0.28.2+
rtk gain        # Should show token savings dashboard
```

> ⚠️ **Name collision**: If `rtk gain` fails, you may have `reachingforthejack/rtk` (Rust Type Kit). Reinstall from rtk-ai/rtk.

## Hook Setup

RTK integrates with AI IDEs via hooks that automatically rewrite commands. Choose your IDE:

### Claude Code
```bash
rtk init --agent claude
```
Installs shell hook to `~/.claude/hooks/rtk-rewrite.sh` + awareness doc to `CLAUDE.md`.

### VS Code Copilot / CodeBuddy
```bash
rtk init --agent copilot
```
Installs Rust binary hook via `.github/hooks/rtk-rewrite.json` + awareness doc to `.github/copilot-instructions.md`.

### Cursor
```bash
rtk init --agent cursor
```
Installs shell hook to `~/.cursor/hooks/rtk-rewrite.sh`.

### Other Agents
```bash
rtk init --agent cline      # Rules file (.clinerules)
rtk init --agent windsurf   # Rules file (.windsurfrules)
rtk init --agent codex      # AGENTS.md integration
rtk init --agent opencode   # TypeScript plugin
rtk init --agent hermes     # Python plugin
```

## Meta Commands

Always use these directly (not through hooks):

```bash
rtk gain              # Token savings dashboard
rtk gain --history    # Per-command history with savings %
rtk discover          # Scan session history for missed opportunities
rtk proxy <cmd>       # Run raw command without filtering (for debugging)
```

## Supported Commands

Hooks automatically rewrite these command categories:

| Category | Examples | Savings |
|----------|----------|---------|
| Test Runners | vitest, pytest, cargo test, go test, playwright | 90-99% |
| Build Tools | cargo build, npm, pnpm, dotnet, make | 70-90% |
| VCS | git status/log/diff/show | 70-80% |
| Language Servers | tsc, mypy | 80-83% |
| Linters | eslint, ruff, golangci-lint, biome | 80-85% |
| Package Managers | pip, cargo install, pnpm list | 75-80% |
| File Operations | ls, find, grep, cat, head, tail | 60-75% |
| Infrastructure | docker, kubectl, aws, terraform | 75-85% |

## Override Controls

- **Per-command**: `RTK_DISABLED=1 git status` — runs raw, no filtering
- **Config file**: `~/.config/rtk/config.toml` → `exclude_commands = ["git push"]`
- **Already-RTK**: `rtk git status` passes through unchanged

## Compound Commands

RTK handles `&&`, `||`, `;`, `|` operators:
- `cargo fmt --all && cargo test` → `rtk cargo fmt --all && rtk cargo test`
- Pipes: only left side rewritten (right side consumes output format)

## Graceful Degradation

Hooks never block command execution:
- jq not installed → warning to stderr, exit 0
- rtk not found → warning to stderr, exit 0
- rtk too old (< 0.23.0) → warning to stderr, exit 0
- Invalid JSON → pass through unchanged
- rtk rewrite crashes → hook exits 0

## PUA Integration

### Activation
RTK activates automatically when hooks are installed. No skill-loading required for normal operation.

### Manual trigger
```
/use rtk          # Check rtk status + savings
rtk gain          # Show current session savings
rtk discover      # Find missed optimization opportunities
```

### Combined with caveman
For maximum token efficiency, use both. Status markers are shown only when explicitly requested, during troubleshooting, or when explaining mode switches:
```
🪨 CAVEMAN · full · Token 压缩已启用      ← output compression
⚡ RTK · hooks active · 输入压缩已启用     ← input compression
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `rtk gain` fails | Wrong package installed. Reinstall from rtk-ai/rtk |
| Hook not rewriting | Check `rtk --version` >= 0.23.0, jq installed |
| Commands still verbose | Check `RTK_DISABLED` not set, rtk in PATH |
| Windows hook issues | Use WSL for best experience, or `rtk proxy <cmd>` |

## References

- Source: https://github.com/rtk-ai/rtk
- Docs: https://www.rtk-ai.app
- Architecture: https://github.com/rtk-ai/rtk/blob/master/docs/contributing/ARCHITECTURE.md
