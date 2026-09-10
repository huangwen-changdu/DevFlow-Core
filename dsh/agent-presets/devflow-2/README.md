# DevFlow 2.0 — DeepSeek Harness Agent Preset

A DSH agent preset that anchors the FIRST model request on the Minimal
surface, then promotes into a full DevFlow session: the native tool surface,
the complete DevFlow persona, and the DevFlow lifecycle guaranteed.

## What it is

- `agent.cordis.yml` — two-phase composition (adapted from the `liangshen`
  preset). Phase 1 shows only the one-line Minimal persona
  ("You are a helpful software engineer assistant."),
  `bash` + `str_replace_editor`, no runtime contexts, no injected pre-step
  messages, and — since 2026-09-10 — no output-token cap. The anchor gate
  (first minimal-like reasoning block, 4-step fallback, or first-response
  release) then promotes the session: the wire switches to the deployment
  default presentation (`native` — 33 tool schemas, no `run_code`, no generated
  SDK section), the full DevFlow persona is restored, and workspace
  instructions (AGENTS.md digest) plus the skill catalog are deferred one step.
- `tool-bootstrap.mjs` — the two-phase bootstrap plugin (from
  `xiaobright/dsh-anchored-standard`, MIT, extended by `dsh-liangshen`),
  with a `phase1Persona` swap so the DevFlow persona only appears after
  promotion.
- `preset.yml` — picker metadata (name: DevFlow 2.0).

Skills are NOT bundled: the preset's `skill-filesystem` row uses the default
user root (`$DSH_HOME/skills`), which is exactly where `npm run install:user`
ships the DevFlow skills. One install path, no second copy to drift.

## Install

```sh
npm run install:user -- --home ~/.dsh --write --force
npm run install:user -- --home ~/.dsh --check
```

This installs the preset to `~/.dsh/.agent-presets/devflow-2/` (alongside the
skills). Manual copy works too (remember the bundled plugin):

```sh
mkdir -p ~/.dsh/.agent-presets/devflow-2
cp dsh/agent-presets/devflow-2/agent.cordis.yml      ~/.dsh/.agent-presets/devflow-2/
cp dsh/agent-presets/devflow-2/preset.yml            ~/.dsh/.agent-presets/devflow-2/
cp dsh/agent-presets/devflow-2/tool-bootstrap.mjs    ~/.dsh/.agent-presets/devflow-2/
cp dsh/agent-presets/devflow-2/custom-bash.mjs       ~/.dsh/.agent-presets/devflow-2/
cp dsh/agent-presets/devflow-2/NOTICE                ~/.dsh/.agent-presets/devflow-2/
```

## Use

Start a new session in the web UI and pick **DevFlow 2.0** in the
preset picker. The roster may need a refresh or restart to show a newly added
preset. Existing sessions keep their old phase; the two-phase behavior applies
to new sessions. The same holds for the 2026-09-10 prompt-budget changes: a
running session keeps the policy it mounted with, so start a new session to
pick them up.

## Caveats

- `~/.dsh/.agent-presets/` is plugin-maintained: a DSH plugin upgrade may
  regenerate it. Re-run `npm run install:user -- --home ~/.dsh --write --force`
  (or re-copy) after upgrades.
- Phase 1 uses the Minimal `bash`: the persistent PTY-backed shell on
  linux/darwin, or the stateless Git-Bash-backed `custom-bash.mjs` on Windows,
  where the PTY backend is unavailable. `str_replace_editor` is the phase-1
  editor on both paths, and the first-response release / composition-drift
  guard keep the session usable if either bootstrap tool is missing.

## Changes 2026-09-10 (prompt budget)

Three independent defects were measured on real session logs and fixed:

- **Phase-1 output cap removed.** `bootstrapMaxTokens: 1024` capped every
  pre-promotion request, and output tokens INCLUDE reasoning tokens: under
  `reasoningEffort: max` the first request was hard-truncated at 1024
  (`finish_reason=length`, reasoning-only blocks with no text and no tool call),
  which the web UI reports as "已达到输出 token 上限 / 回答被截断". The cap was
  the anchor's forcing function for the short We-need block, not a safety limit;
  the gate still promotes through its other three paths.
- **`promotedPresentation: code` → `native`.** `code` does NOT mean "PTC only".
  In `@deepseek-ai/dsh-tools`, `presentAs(mode)` attaches the collapse + SDK
  sections for every mode except `native`, while `wireSchemas()` narrows the
  wire to `run_code` only for `ptc`; `code` falls through to the default branch.
  `code` therefore behaves as `both`: native schemas AND `run_code` AND the
  generated SDK section — measured at 33,805 + 35,333 chars, i.e. one 36-tool
  catalog paid for twice. `native` keeps the tools and drops the duplicate
  (~-48% prompt per request). Use `ptc` instead to keep PTC batching at about
  the same saving, at the cost of routing every call through a program.
- **Three never-used tool families disabled** (0 calls across 30 recorded
  sessions): `tool-jobs` (`job_kill`/`job_list`/`job_output`, 1,508 B + a
  384-char guidance section that the same plugin contributes), the `workflow`
  rows (4,067 B — the largest single schema), and `tool-ralph` (845 B). Each is
  commented out in place with its restore note. The `subagent` family is kept
  (it has real calls); `herdr_*` is kept because this deployment installs
  `@deepseek-ai/dsh-tool-herdr` deliberately via `~/.dsh/cordis.patch.yml`.

## Customize

Never edit the shipped `agent-presets` beside the deployment config (an
upgrade overwrites it). This user-root copy is yours: edit `agent.cordis.yml`
row by row, keeping the plane rule (a row publishing a service needs an
`isolate` realm group) and the realm rule. Mount-validate with
`standingKeyFor(id)` from a `cordis` (创造模式) session before shipping.
