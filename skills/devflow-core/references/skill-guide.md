# DevFlow Skill Guide

## Skill Chain

```text
devflow-core
  -> devflow-brainstorm
  -> devflow-spec (when saved requirements source is needed)
  -> /devflow-plan (create Plan Pack from spec or approved design)
  -> devflow-cut
  -> devflow-build
  -> devflow-prove
  -> devflow-pua (when user challenge/repeated miss appears)
  -> devflow-learn (when correction/pitfall appears)
  -> devflow-audit (when repo-wide overengineering audit is requested)
```

## Skill Responsibilities

| Skill | Responsibility |
|---|---|
| `devflow-core` | Route the task and preserve the overall contract. |
| `devflow-brainstorm` | Clarify intent and compare approaches. |
| `devflow-spec` | Write and validate saved requirements specs under `docs/specs/` before implementation planning. |
| `/devflow-plan` | Create a Plan Pack from a spec or approved design. |
| `devflow-cut` | Prevent overengineering and force reuse checks. |
| `devflow-build` | Implement the approved smallest useful change. |
| `devflow-prove` | Verify and report evidence before completion. |
| `devflow-pua` | Stop wrong-path recovery, re-ask or infer the desired result, switch approach, and hand back to Prove/Learn. |
| `devflow-learn` | Capture reusable corrections and pitfalls into `.copilot` learning cards. |
| `devflow-audit` | Audit a repository or scope for overengineering candidates without editing files. |

## Authoring Rules

- Keep each skill short enough to load directly.
- Put trigger phrases in `description`.
- Prefer imperative steps over explanation.
- Do not duplicate all framework rules inside every skill.
- Each skill must name its handoff target.
- Each skill must be executable: trigger, action steps, anti-rationalization check, stop/handoff, proof.
- For method details, point to `skills/devflow-core/references/core-methods.md` instead of restating vague philosophy.

## Minimum Skill Contract

Every `SKILL.md` must include:

1. YAML frontmatter with `name` matching the folder.
2. A `description` that says what the skill does and when to use it.
3. Concrete steps.
4. Required output or artifact.
5. Handoff target or stop condition.
6. Verification or Proof section.

## Command Mapping

| Command | Primary skill |
|---|---|
| `/devflow` | `devflow-core` |
| `/devflow-spec` | `devflow-spec` |
| `/devflow-plan` | Plan creation from spec or approved design |
| `/devflow-review` | `devflow-cut` |
| `/devflow-prove` | `devflow-prove` |
| `/devflow-pua` | `devflow-pua` |
| `/devflow-audit` | `devflow-audit` |
