# Project Structure

```text
DevFlow-Core/
|-- AGENTS.md
|-- CLAUDE.md
|-- README.md
|-- package.json
|-- plugin.json
|-- gemini-extension.json
|-- docs/
|   |-- PRD.md
|   `-- features/
|       |-- README.md
|       |-- devflow-core.md
|       `-- validation-harness.md
|-- .github/
|   |-- copilot-instructions.md
|   |-- instructions/
|   |   `-- devflow.instructions.md
|   `-- prompts/
|       `-- devflow.prompt.md
|-- .codebuddy/
|   `-- rules/devflow-core/RULE.mdc
|-- commands/
|   |-- devflow.toml
|   |-- devflow-spec.toml
|   |-- devflow-plan.toml
|   |-- devflow-review.toml
|   |-- devflow-debt.toml
|   |-- devflow-prove.toml
|   |-- devflow-pua.toml
|   |-- devflow-learn.toml
|   `-- devflow-audit.toml
|-- scripts/
|   |-- validate-devflow.js
|   |-- validate-learning-loop.js
|   |-- report-scenario-coverage.js
|   |-- validate-skill-triggers.js
|   |-- validate-host-adapters.js
|   |-- devflow-spec.js
|   |-- devflow-plan.js
|   |-- devflow-review.js
|   |-- devflow-debt.js
|   `-- devflow-audit.js
`-- skills/
    |-- devflow-core/SKILL.md
    |-- devflow-core/references/
    |   |-- core-methods.md
    |   |-- project-structure.md
    |   |-- reference-projects.md
    |   `-- skill-guide.md
    |-- devflow-brainstorm/SKILL.md
    |-- devflow-spec/SKILL.md
    |-- devflow-cut/SKILL.md
    |-- devflow-cut/references/
    |   |-- cut-methods.md
    |   `-- native-capability-checklist.md
    |-- devflow-spec/references/spec-plan-methods.md
    |-- devflow-build/SKILL.md
    |-- devflow-build/references/build-methods.md
    |-- devflow-prove/SKILL.md
    |-- devflow-prove/references/
    |   |-- flow-self-test.md
    |   `-- proof-recovery-methods.md
    |-- devflow-pua/SKILL.md
    |-- devflow-learn/SKILL.md
    |-- devflow-audit/SKILL.md
    `-- skill-call-diagram.md
```

## Public Entry Points

- `AGENTS.md`: cross-agent baseline.
- `CLAUDE.md`: Claude Code pointer to the baseline.
- `.github/copilot-instructions.md`: GitHub Copilot inline rules.
- `.github/instructions/devflow.instructions.md`: VS Code task-specific instruction.
- `.github/prompts/devflow.prompt.md`: manual prompt entry.
- `.codebuddy/rules/devflow-core/RULE.mdc`: CodeBuddy always-on rule.
- `commands/*.toml`: slash-command capable hosts.
- `scripts/validate-devflow.js`: package validation.
- `scripts/validate-learning-loop.js`: executable learning-loop closure check.
- `scripts/report-scenario-coverage.js`: scenario coverage report.
- `scripts/validate-skill-triggers.js`: prompt-to-route trigger verification.
- `scripts/validate-host-adapters.js`: cross-host adapter smoke test.
- `docs/PRD.md`: product direction, architecture model, roadmap, and release gates.
- `docs/specs/*.md`: generated requirements specs created during actual use.
- `docs/plans/*.md`: generated implementation plans created during actual use.
- `skills/devflow-*`: skill-capable runtime workflows; `devflow-core` is the only lifecycle router.
- `skills/devflow-*/references/*`: installed runtime artifacts. Core reads its shared map, then the selected skill reads the reference that owns its detailed method.

## Packaging Rule

Platform entry files are thin startup adapters: route signal, Core or explicit owner location, host fallback/load action, and proof exit. `core-methods.md` owns shared routing; selected owner references own detailed lifecycle methods. Target and user installers copy these runtime references with their skills.

`docs/` is reserved for product and generated DevFlow artifacts. Use `docs/specs/` for saved requirements specs and `docs/plans/` for saved implementation plans created during actual use. Do not place runtime framework methods there.
