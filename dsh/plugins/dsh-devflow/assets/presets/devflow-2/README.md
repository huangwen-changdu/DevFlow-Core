# DevFlow 2.0 (Anchored) — DeepSeek Harness Agent Preset

A DSH agent preset that anchors the FIRST model request on the Minimal
surface, then promotes into a full DevFlow session: Code Mode (PTC) on the
wire, the complete DevFlow persona, and the DevFlow lifecycle guaranteed.

## What it is

- `agent.cordis.yml` — two-phase composition (adapted from the `liangshen`
  preset). Phase 1 shows only the one-line Minimal persona
  ("You are a helpful software engineer assistant."), persistent
  `bash` + `str_replace_editor`, no runtime contexts, no injected pre-step
  messages, and a 1024 output budget. The anchor gate (first minimal-like
  reasoning block, 4-step fallback, or first-response release) then promotes
  the session: the wire switches to Code Mode (a single `run_code` tool), the
  full DevFlow persona is restored, and workspace instructions (AGENTS.md
  digest) plus the skill catalog are deferred one step.
- `tool-bootstrap.mjs` — the two-phase bootstrap plugin (from
  `xiaobright/dsh-anchored-standard`, MIT, extended by `dsh-liangshen`),
  with a `phase1Persona` swap so the DevFlow persona only appears after
  promotion.
- `preset.yml` — picker metadata (name: DevFlow 2.0 (Anchored)).

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

Start a new session in the web UI and pick **DevFlow 2.0 (Anchored)** in the
preset picker. The roster may need a refresh or restart to show a newly added
preset. Existing sessions keep their old phase; the two-phase behavior applies
to new sessions.

## Caveats

- `~/.dsh/.agent-presets/` is plugin-maintained: a DSH plugin upgrade may
  regenerate it. Re-run `npm run install:user -- --home ~/.dsh --write --force`
  (or re-copy) after upgrades.
- Phase 1 uses the persistent (PTY-backed) Minimal `bash` shell. On Windows
  builds where DSH's PTY backend is unavailable, phase-1 `bash` calls fail but
  `str_replace_editor` still works, and the first-response release /
  composition-drift guard keep the session usable (Code Mode `run_code` does
  not need the PTY).

## Customize

Never edit the shipped `agent-presets` beside the deployment config (an
upgrade overwrites it). This user-root copy is yours: edit `agent.cordis.yml`
row by row, keeping the plane rule (a row publishing a service needs an
`isolate` realm group) and the realm rule. Mount-validate with
`standingKeyFor(id)` from a `cordis` (创造模式) session before shipping.
