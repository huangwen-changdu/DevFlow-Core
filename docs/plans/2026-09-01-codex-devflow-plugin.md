# Codex DevFlow Plugin Distribution

Goal: Package the existing DevFlow skills and portable checker tools as a self-contained Codex plugin for external users.
Architecture: Static plugin directory with one Codex manifest, copied skill trees, documentation, license, and optional Node.js checkers; no runtime host adapter.
Tech Stack: JSON manifest, Markdown/YAML skill assets, Node.js built-in checkers, Python plugin validator, PowerShell file checks.
Source: Confirmed request and CUT_PASS from the current task conversation.
Spec coverage: The confirmed Codex distribution scope maps to Tasks 1-3; DSH-only assets and marketplace publication remain excluded.
Cut Decision: CUT_PASS; reuse the 14 root `skills/devflow-*` trees and five self-contained runtime checkers, add only distribution metadata/docs/license and a local smoke test; do not add dependencies, host runtime code, Codex command registration, presets, hooks, apps, MCP, or marketplace changes.
External Skills: plugin-creator; role: bounded manifest scaffolding and validation; expected evidence: valid Codex manifest and plugin validation; return facts: result / failure facts

## Global Constraints

- Keep the root `skills/devflow-*` trees authoritative for this change; copied plugin content must be byte-identical at creation time.
- Keep the existing DSH plugin, root commands, root scripts, and user marketplace untouched.
- Use plugin name `devflow`, version `0.1.0`, and a relative `./skills/` manifest path with no unsupported manifest fields.
- Do not add a sync mechanism yet; revisit only when a demonstrated plugin-source drift problem exists.

## File Structure

| File / symbol | Operation | Responsibility | Why here | Not responsible for |
|---|---|---|---|---|
| plugins/devflow/.codex-plugin/plugin.json | Modify | Codex plugin identity, external metadata, and skill discovery path | Required Codex plugin contract | Runtime behavior, marketplace metadata, host synchronization |
| plugins/devflow/skills/devflow-* | Create | Self-contained copies of all 14 existing DevFlow skill trees and references | Codex archives validate and load files inside the plugin root | New skill behavior, command wrappers, DSH preset assets |
| plugins/devflow/scripts/*.js | Create | Portable checker tools and plugin smoke test | Users can run checks without the repository root | Automatic Codex command registration, installer runtime |
| plugins/devflow/README.md, scripts/README.md, LICENSE | Create | Installation, limits, usage, and redistribution terms | External users need clear delivery contract | DSH documentation or npm release automation |

Task: Create and package the self-contained Codex DevFlow plugin
Task type: Code change
Files:
- Create: plugins/devflow/.codex-plugin/plugin.json | new file | declare the `devflow` plugin and `./skills/` discovery path
- Create: plugins/devflow/skills/devflow-* | new file | copy all 14 root DevFlow skill directories, including references and any existing agent metadata
- Create: plugins/devflow/scripts/*.js | new file | include portable checkers and smoke test
- Create: plugins/devflow/README.md, scripts/README.md, LICENSE | new file | document install, scope, usage, and license
Interfaces:
- Consumes: root skill trees at `skills/devflow-*/` with existing `SKILL.md` frontmatter and referenced files
- Produces: plugin manifest object `{ name: "devflow", version: "0.1.0", skills: "./skills/", interface: {...} }` and a plugin-local skill tree
Current behavior: Codex has no repository-local DevFlow plugin; DevFlow skills and checkers exist only under the root `skills/` and `scripts/` directories and DSH has a separate packaged asset flow.
Target behavior: `plugins/devflow` is a valid self-contained Codex plugin whose manifest discovers all 14 copied `devflow-*` skill trees and whose optional scripts can run from the plugin directory.
Change mechanics: exact replacement: preserve copied skill trees byte-for-byte; update supported manifest metadata; copy self-contained checkers; add docs/license/smoke test; omit unsupported Codex command registration and DSH-only assets.
Call impact: no host runtime callers; Codex reads `.codex-plugin/plugin.json` and `./skills/`; scripts are manual CLI entry points.
Steps:
- [ ] Run the plugin scaffold for `devflow` at `plugins/` with `--with-skills --force`, then set the manifest metadata to the approved `devflow` identity, `0.1.0` version, `./skills/` path, and non-placeholder interface fields.
- [ ] Copy every root directory matching `skills/devflow-*` into `plugins/devflow/skills/`, preserving nested references and `agents/openai.yaml` files; verify the source and destination directory names match exactly and the count is 14.
- [ ] Add README/license and copy the five self-contained checkers plus `verify-plugin.js` using the exact replacement rule `Copy-Item scripts/devflow-spec.js,scripts/devflow-plan.js,scripts/devflow-review.js,scripts/devflow-debt.js,scripts/devflow-audit.js plugins/devflow/scripts/`; omit repository-dependent `devflow-doctor.js`.
- [ ] Run `python3 C:/Users/huangwen/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py plugins/devflow`; expect `Plugin validation passed` and no unsupported-field or missing-skill errors.
- [ ] Run `node plugins/devflow/scripts/verify-plugin.js` and a byte comparison over each source/destination skill tree; expect smoke tests and equality to pass.
Acceptance: The manifest validates, the plugin contains exactly the 14 existing `devflow-*` skill trees, portable checker smoke tests pass, and every copied skill file matches its root source.
Verify: Run validator, `node plugins/devflow/scripts/verify-plugin.js`, and recursive source/destination comparison; expect all PASS and no changes under `dsh/plugins/dsh-devflow`, root `commands`, or root `scripts`.
Comments: Keep manifest metadata explicit and placeholder-free; no code comments are needed for static asset copies.
Not doing: Do not migrate DSH presets, Cordis patches, slash commands, host adapters, automatic installation, or marketplace entries.

Prewalk:

Execution Trace:
- Read: C:/Users/huangwen/.codex/skills/.system/plugin-creator/scripts/create_basic_plugin.py and validate_plugin.py → the scaffold creates `.codex-plugin/plugin.json`; validation requires strict semver, interface metadata, relative `./skills/`, and valid skill frontmatter.
- Traced: dsh/plugins/dsh-devflow/scripts/sync-assets.js and scripts/install-devflow-user.js → existing DSH/user installers copy assets into host homes, so they are outside this static Codex plugin boundary.
- Ran: PowerShell enumeration of root skills/devflow-*, commands/devflow*, and scripts/devflow-* → found 14 skills, 11 commands, and 7 scripts; only the 14 skills are in scope.
- Edited: plugins/devflow/.codex-plugin/plugin.json, plugins/devflow/skills/devflow-*, plugins/devflow/scripts/*, README.md, scripts/README.md, and LICENSE → added external metadata/docs/license, copied checkers, and added smoke test.
- Verified: validator, `node plugins/devflow/scripts/verify-plugin.js`, plan checker, and recursive SHA-256 comparison → all passed; 14 skill directories matched byte-for-byte and five checker self-tests passed.

Current Handoff Facts:
- Target anchors: `plugins/devflow/.codex-plugin/plugin.json`; `plugins/devflow/skills/devflow-*`.
- Nearby convention: root `skills/devflow-*` directories contain the authoritative `SKILL.md` plus nested `references/` and optional `agents/openai.yaml`; preserve that tree shape.
- Direct path: Codex reads the manifest, resolves `./skills/`, then validates each skill directory; no runtime caller or DSH entry point is involved.
- Current constraints: manifest paths must be relative and inside the plugin; unsupported fields and placeholder markers fail validation; plugin name and folder must be `devflow`.
- Planned touch set: create `plugins/devflow/.codex-plugin/plugin.json` and copy `skills/devflow-*` to `plugins/devflow/skills/`.
- Risks / stop conditions: if a root skill is missing valid frontmatter or a nested reference is not self-contained, return the exact failing skill to Core rather than widening scope; otherwise none beyond ordinary Plan drift.
- Read-basis: plugin-creator scaffold/validator, plugin JSON spec, DSH sync sources, root skill/command/script enumeration.
- Live anchors: `skills/devflow-*`, `plugins/devflow/.codex-plugin/plugin.json`, `plugins/devflow/skills/devflow-*`.

Remaining Structured Worklist:
- none; all planned work items completed during Build.
