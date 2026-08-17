# Platform Setup

How to install and use DevFlow-Core on each supported agent platform. All commands run from the DevFlow-Core repo root unless noted.

Two install modes:

- **Project-level** (`npm run install:target -- <project> --write`): copies the full runtime pack into a target repository. This is the recommended mode for real work — the pack is versioned with the project and shared with every teammate and agent that opens the repo.
- **User-level** (`npm run install:user -- --write`): copies only `skills/`, `commands/`, and `scripts/devflow-*.js` into a personal runtime home (`~/.codex` by default, `~/.claude` with `--home`). Good for personal global access; does not install project rules.

## Sync Matrix

What each platform actually reads, and which synced files feed it:

| Platform | Project entry it reads | User-level home | Skills | Slash commands |
|---|---|---|---|---|
| Codex / shared agents | `AGENTS.md` | `~/.codex` | `skills/` | `commands/*.toml` |
| Claude Code | `CLAUDE.md` + `.claude/settings.json` (hook) | `~/.claude` | `skills/` | `.claude/commands/devflow-core.md` |
| opencode | `AGENTS.md` | `~/.config/opencode` | not natively* | `.opencode/commands/*.md` (manual convert)* |
| CodeBuddy IDE | `.codebuddy/rules/devflow-core/RULE.mdc` | `~/.codebuddy` | `skills/` | `commands/*.toml` |
| WorkBuddy | none (GUI project instructions) | GUI personal skill library | `skills/` (imported via GUI) | n/a |
| DeepSeek Harness (DSH) | `AGENTS.md` (workspace instructions) | `~/.dsh` | `skills/` | n/a |

\* opencode caveats are covered in its section below.

Files the project installer syncs (identical for every platform — you get one pack, each platform reads its own entry):

| Synced path | Consumed by |
|---|---|
| `AGENTS.md` | Codex, opencode, shared agents |
| `CLAUDE.md` | Claude Code |
| `.codebuddy/rules/devflow-core/RULE.mdc` | CodeBuddy IDE |
| `.claude/settings.json`, `.claude/commands/devflow-core.md` | Claude Code |
| `.github/copilot-instructions.md`, `.github/instructions/`, `.github/prompts/` | GitHub Copilot / VS Code |
| `hooks/hooks.json`, `hooks/devflow-session-start.js` | Claude SessionStart context injection |
| `commands/devflow*.toml` | Command-capable hosts (Codex, CodeBuddy) |
| `skills/devflow-*/` + `skills/*/references/` | All skill-capable hosts |
| `scripts/devflow-{spec,plan,review,debt,audit}.js` | Local checkers any agent can run |

## Codex

Entry surface: `AGENTS.md` at the project root. Codex reads it as the runtime prompt, but does not automatically load skill bodies. `AGENTS.md` therefore provides the minimal hybrid-flow fallback: Brainstorm collects a user-selected A/B/C depth, named success edges flow directly, and Core selects only non-unique exceptions. Core then reads the shared method map and only the reference owned by the selected lifecycle skill.

Install into a target project:

```bash
npm run install:target -- <project>          # dry-run first
npm run install:target -- <project> --write
npm run install:target -- <project> --check  # verify no drift later
```

Optional user-level install (personal global skills/commands/scripts):

```bash
npm run install:user            # dry-run
npm run install:user -- --write
npm run install:user -- --check
```

What gets synced for Codex: everything in the sync matrix above. The load-bearing files are `AGENTS.md`, `commands/devflow*.toml`, `skills/`, and `scripts/devflow-*.js`.

Daily use:

- Open the target project root in Codex, not the DevFlow-Core repo.
- Start work with route-friendly wording: `Problem report: ...`, `Requirement: implement ...`, `Bug report: ... fix the bug.`
- Or invoke a command: `/devflow`, `/devflow-spec`, `/devflow-plan`, `/devflow-review`, `/devflow-debt`, `/devflow-audit`.
- Run checkers when a route calls for them: `node scripts/devflow-plan.js <plan-file>` etc.

## Claude Code

Entry surfaces: `CLAUDE.md` (points back to the shared contract in `AGENTS.md`), `.claude/settings.json` (SessionStart hook), and `.claude/commands/devflow-core.md` (`/devflow-core` command).

Project-level install — same command as Codex:

```bash
npm run install:target -- <project> --write
```

The installer merges the DevFlow `SessionStart` entry into an existing `.claude/settings.json` without touching other fields. Other existing rule files are skipped, not overwritten; merge `AGENTS.md`/`CLAUDE.md` content manually if the target already has them, or pass `--force` when replacement is intentional.

User-level install:

```bash
npm run install:user -- --home ~/.claude            # dry-run
npm run install:user -- --home ~/.claude --write
npm run install:user -- --home ~/.claude --check
```

What gets synced for Claude Code: the full pack. The load-bearing files are `CLAUDE.md`, `.claude/settings.json`, `.claude/commands/devflow-core.md`, `hooks/`, `skills/`, and `scripts/devflow-*.js`.

Daily use:

- Claude Code reads the project's `CLAUDE.md` automatically; the SessionStart hook injects a short DevFlow routing reminder each session.
- Use `/devflow-core` for the command-driven route, or let the `devflow-*` skills trigger by wording.
- Hard boundary: `AGENTS.md` and `CLAUDE.md` are project files. Never install them into `~/.claude` — the user installer already excludes them.

## opencode

Entry surface: `AGENTS.md` at the project root (native) and `~/.config/opencode/AGENTS.md` (global). opencode has no native skill system; custom commands are markdown files with YAML frontmatter, not TOML.

Project-level install:

```bash
npm run install:target -- <project> --write
```

This gives opencode its primary entry (`AGENTS.md`) plus `skills/` and `scripts/devflow-*.js` as on-disk reference material. The entry routes to Core; Core and its selected lifecycle owner are read on demand.

Two honest limitations:

1. **`commands/*.toml` does not work in opencode.** opencode reads `.opencode/commands/*.md` (project) or `~/.config/opencode/commands/*.md` (user). To get slash commands, convert each TOML prompt into a markdown command. Minimal example:

   ```markdown
   ---
   description: Route a task through DevFlow Core.
   ---

   Use DevFlow Core for this request. Route the work as Fast, Design-lite, Design, Build, or Recovery...
   (paste the prompt body from commands/devflow.toml)
   ```

   Save as `<project>/.opencode/commands/devflow.md`; invoke with `/devflow`.

2. **Skills are not auto-loaded.** `skills/` still earns its place: `AGENTS.md` identifies Core and its fallback, then the agent reads the matching `SKILL.md` and owner reference when the route calls for them (progressive disclosure by hand instead of by runtime).

What gets synced for opencode: the full pack, but the load-bearing files are `AGENTS.md`, `skills/`, and `scripts/devflow-*.js`. `.claude/`, `.codebuddy/`, and `.github/` surfaces are inert in opencode (harmless to keep; other teammates may use those platforms).

User-level: there is no DevFlow user installer target for opencode. If you want global commands, place converted `.md` files in `~/.config/opencode/commands/` manually.

## CodeBuddy IDE

Entry surface: `.codebuddy/rules/devflow-core/RULE.mdc` (`alwaysApply: true`, loaded every session), plus native skill support for `skills/devflow-*/SKILL.md`.

Project-level install:

```bash
npm run install:target -- <project> --write
```

User-level install (personal skills/commands/scripts under `~/.codebuddy`):

```bash
npm run install:user -- --home ~/.codebuddy --write
```

What gets synced for CodeBuddy: the full pack. The load-bearing files are `.codebuddy/rules/devflow-core/RULE.mdc`, `skills/`, `commands/devflow*.toml`, and `scripts/devflow-*.js`.

Daily use:

- The always-on rule routes automatically; skill-capable CodeBuddy loads `devflow-core` and the focused `devflow-*` skills.
- Slash commands from `commands/*.toml` are available to command-capable CodeBuddy surfaces.
- The rule file points at `devflow-core`; Core loads `skills/devflow-core/references/core-methods.md` first, then the selected owner's local reference. Keep the full `skills/` tree in the project.

## WorkBuddy

WorkBuddy (Tencent cloud CodeBuddy desktop agent) manages projects and skills through its GUI rather than repo-local rule directories. There is no `install:target` integration; setup is manual and takes about two minutes.

Project rules (instructions):

1. In WorkBuddy, open 项目 (Projects) and create or edit your project.
2. In the 指令 (instructions) field, paste the current startup contract from this repo's `AGENTS.md`. It identifies Core, direct-review exceptions, and the proof boundary; import skills separately for the detailed lifecycle behavior.
3. Every task in the project now inherits the DevFlow routing rules automatically.

Skills:

1. In the WorkBuddy skill manager, import each `skills/devflow-*/` directory as a project skill (each folder is a standard `SKILL.md` skill pack with its references).
2. Project skills are shared with all project members and take priority in task skill selection.

What to sync manually: `AGENTS.md` content into project instructions; `skills/devflow-*/` into project skills. `commands/*.toml`, `hooks/`, and host-specific directories (`.claude/`, `.codex/`, `.github/`) have no WorkBuddy equivalent — skip them.

Checker scripts (`scripts/devflow-*.js`) can still run anywhere Node is available if you clone this repo, but they are optional for WorkBuddy usage.

## DeepSeek Harness (DSH)

Entry surfaces: `AGENTS.md` at the project root (auto-injected as workspace instructions) plus `skills/devflow-*/SKILL.md` discovered through DSH's skill filesystem. DSH is skill-capable, so Core and the focused lifecycle skills load on demand.

User-level install (personal skills under `~/.dsh`):

```bash
npm run install:user -- --home ~/.dsh --write
```

What gets synced for DSH: the full pack. The load-bearing files are `AGENTS.md`, `skills/`, and `scripts/devflow-*.js`; host-specific `.claude/`, `.codebuddy/`, `.github/` surfaces are inert in DSH.

Daily use:

- DSH injects `AGENTS.md` automatically; the `devflow-*` skills trigger by wording.
- Run checkers through the DSH shell tool: `node scripts/devflow-spec.js <spec-file>` and `node scripts/devflow-plan.js <plan-file>`.
- DSH-native gates: present A/B/C and approval choices with the `ask_user_question` tool; run independent reviews (`devflow-adversarial`, `devflow-find-fault`) as fresh `subagent` runs.

DSH agent presets (optional):

- `install:user` also syncs two agent presets to `~/.dsh/.agent-presets/`: `devflow/` and `devflow-2/`. Pick **DevFlow** (thin activator) or **DevFlow 2.0 (Anchored)** (two-phase anchored bootstrap) in the web UI preset picker for sessions that auto-activate `devflow-core` (guaranteed activation) instead of relying on AGENTS.md loading.
- Both presets are thin activators in the persona sense: the persona guarantees the `devflow-core` skill is loaded; the route table stays in the skill and AGENTS.md; skills remain in `~/.dsh/skills` (one source). Sources live at `dsh/agent-presets/devflow/` and `dsh/agent-presets/devflow-2/` in this repo. Customize the user-root copy, never the shipped preset install.
- `devflow-2` bundles `tool-bootstrap.mjs` (MIT; from `xiaobright/dsh-anchored-standard`, extended by `dsh-liangshen`): request #1 shows only the one-line Minimal persona plus persistent `bash` + `str_replace_editor`; after the anchor gate the wire switches to Code Mode (`run_code`) and the full DevFlow persona is restored.
- `~/.dsh/.agent-presets/` is plugin-maintained: after a DSH plugin upgrade re-run `npm run install:user -- --home ~/.dsh --write --force` (or re-copy) to restore the repo versions.

## Updating An Installed Project

After this pack changes, re-sync and verify:

```bash
npm run install:target -- <project> --check   # reports ok / missing / changed per file
npm run install:target -- <project> --write   # re-copy; existing files are skipped
npm run install:target -- <project> --write --force  # replace local edits (review first)
```

When `--check` reports `changed`, review the target-local edits before forcing — the target may have intentional project-specific merges.

## Verify The Pack Itself

From this repo:

```bash
npm run verify:all
```

This proves the framework pack (file presence, adapter contracts, installer safety, checker self-tests). It does not prove a target project's business feature — always run the target project's own proof command before claiming completion there.
