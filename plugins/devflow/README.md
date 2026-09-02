# DevFlow for Codex

Codex plugin packaging the DevFlow lifecycle skills: clarification, scope cutting,
planning, implementation, proof, recovery, learning, and independent review.

## Install

Install this plugin from the repository or copy the `plugins/devflow` directory into
your local plugin source directory. The required manifest is
`.codex-plugin/plugin.json`; Codex discovers the 14 skill trees through `./skills/`.

Validate a checkout before sharing it:

```sh
python3 C:/Users/<user>/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py plugins/devflow
```

The validator path is installation-specific. Use the `plugin-creator` skill's local
path when it differs.

## Included scripts

`scripts/` contains five self-contained daily checkers plus a plugin smoke test.
Run them from a project directory, for example:

```sh
node /path/to/plugins/devflow/scripts/devflow-spec.js docs/specs/example.md
node /path/to/plugins/devflow/scripts/devflow-plan.js docs/plans/example.md
node /path/to/plugins/devflow/scripts/devflow-review.js docs/plans/example.md
node /path/to/plugins/devflow/scripts/devflow-debt.js .
node /path/to/plugins/devflow/scripts/devflow-audit.js .
```

The repository's `devflow-doctor.js` and installer are intentionally not copied:
they depend on the full source checkout rather than the standalone plugin. The skills first look for checkers in the target project,
then `~/.codex/scripts/` or `~/.claude/scripts/`, so plugin-local scripts are an
explicit fallback for users who want them.

## Scope and limits

- Included: Codex manifest, 14 DevFlow skill trees, references, and checker scripts.
- Not included: DSH agent presets, Cordis patches, DSH slash commands, host hooks,
  MCP servers, apps, or automatic user-home installation.
- Codex does not register arbitrary plugin `commands/` files through this manifest;
  DSH command assets remain in `dsh/plugins/dsh-devflow`.

## Updating

When the authoritative root `skills/devflow-*` trees change, refresh the copies,
bump `version` in `.codex-plugin/plugin.json`, then run the validator and compare
the source/destination trees byte-for-byte. Keep this plugin directory self-contained
before publishing or sharing it.

## License

MIT. See [LICENSE](LICENSE).
