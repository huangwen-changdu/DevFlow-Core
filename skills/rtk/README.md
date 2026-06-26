# RTK Skill — CLI Token Compression

## Overview

RTK (Rust Token Killer) is a high-performance CLI proxy that reduces LLM token consumption by 60-90% through smart filtering and compression of command outputs. This skill integrates RTK into the PUA-Driven Spec Engineering suite.

## Positioning

| Layer | Skill | What it compresses | Mechanism |
|-------|-------|--------------------|-----------|
| **Input** | `rtk` | CLI command output (git, cargo, npm, etc.) | Hook-based command rewrite |
| **Output** | `caveman` | LLM response text | Linguistic compression |

RTK and caveman are complementary, not competing. RTK reduces tokens **entering** LLM context; caveman reduces tokens **leaving** LLM context.

## Quick Start

1. Install: `brew install rtk` (or see SKILL.md for alternatives)
2. Setup hook: `rtk init --agent copilot` (for CodeBuddy/VS Code)
3. Verify: `rtk gain`

## Files

- `SKILL.md` — Full skill definition with installation, hook setup, and usage guide
- `hooks/` — Hook scripts adapted from rtk-ai/rtk for PUA integration
  - `claude/rtk-rewrite.sh` — Claude Code PreToolUse hook
  - `copilot/rtk-awareness.md` — Copilot awareness document
  - `cursor/rtk-rewrite.sh` — Cursor preToolUse hook

## Related

- Source repo: https://github.com/rtk-ai/rtk
- caveman skill: `skills/caveman/SKILL.md` (output compression)
