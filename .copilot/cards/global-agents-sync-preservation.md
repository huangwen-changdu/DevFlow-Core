# Global AGENTS Sync Preservation

- Trigger: sync AGENTS, user-level AGENTS, .codex AGENTS, restore global blocks, CodeGraph, Graphify.
- Lesson: Repository `AGENTS.md` can omit user-global extensions; replacing `C:\Users\huangwen\.codex\AGENTS.md` wholesale loses those active runtime blocks.
- Next action: Next time syncing global AGENTS, first preserve named user-global blocks, then verify the repository body and each required marker appear exactly once; do not blindly replace the full global file.
- Encoding: Read and write both source and target explicitly as UTF-8; do not rely on PowerShell `Get-Content` default decoding for non-ASCII prompt text.
- Scope: project
- Related: `AGENTS.md`, `C:\Users\huangwen\.codex\AGENTS.md`
- Evidence: user-global and repository AGENTS files inspected during synchronization work.
- Invalidation: Revise when the user-global extension locations or merge policy changes.
