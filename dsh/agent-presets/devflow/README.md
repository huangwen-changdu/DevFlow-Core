# DevFlow — DeepSeek Harness Agent Preset

A DSH agent preset that turns any session into a DevFlow session: the full
`standard` coding agent plus guaranteed workflow activation.

## What it is

- `agent.cordis.yml` — the shipped `standard` preset kept row-for-row, with a
  DevFlow persona replacing the default one. The persona guarantees the model
  loads `devflow-core` before development work instead of hoping it reads
  AGENTS.md; the route table and hard boundaries stay in the skill and
  AGENTS.md (single source, nothing duplicated here).
- `preset.yml` — picker metadata (name: DevFlow, description).

Skills are NOT bundled: the preset's `skill-filesystem` row uses the default
user root (`$DSH_HOME/skills`), which is exactly where `npm run install:user`
ships the DevFlow skills. One install path, no second copy to drift.

## Install

```sh
npm run install:user -- --home ~/.dsh --write --force
npm run install:user -- --home ~/.dsh --check
```

This installs the preset to `~/.dsh/.agent-presets/devflow/` (alongside the
skills). Manual copy works too:

```sh
mkdir -p ~/.dsh/.agent-presets/devflow
cp dsh/agent-presets/devflow/agent.cordis.yml ~/.dsh/.agent-presets/devflow/
cp dsh/agent-presets/devflow/preset.yml  ~/.dsh/.agent-presets/devflow/
```

## Use

Start a new session in the web UI and pick **DevFlow** in the preset picker.
The roster may need a refresh or restart to show a newly added preset.

## Customize

Never edit the shipped `agent-presets` beside the deployment config (an
upgrade overwrites it). This user-root copy is yours: edit `agent.cordis.yml`
row by row, keeping the plane rule (a row publishing a service needs an
`isolate` realm group) and the realm rule. Mount-validate with
`standingKeyFor(id)` from a `cordis` (创造模式) session before shipping.

## Roadmap (phase 2)

Register the DevFlow checkers (`scripts/devflow-*.js`) as native Cordis tools
(schema-validated args, structured output, always in the tool catalog). This
needs a small npm package wrapping the scripts, because a composition row can
only name an installed package — out of scope for this thin-activator preset.
