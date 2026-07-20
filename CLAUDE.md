# DevFlow Core v2

Follow the shared rules in [AGENTS.md](AGENTS.md). User instructions say WHAT, not HOW. Skills enforce their own gates.

Use `devflow-core` for normal development work when skills are available. At Sense, probe existing `.copilot/LEARNING_INDEX.md` and `docs/project-knowledge/`, then progressively load only index-matched cards or knowledge documents; absence does not create storage. Use `devflow-brainstorm` for requirements and design (produces an approved design contract, ending at the Depth Selection Gate where the user picks A/B/C; option semantics live in `skills/devflow-brainstorm/SKILL.md`), `devflow-spec` to save a requirements spec, `/devflow-plan` to create an implementation Plan Pack, `devflow-cut` for reuse and overengineering checks, `devflow-build` for minimal implementation, `devflow-pua` when the user challenges a wrong or repeated miss, `devflow-learn` for reusable correction capture, `devflow-project-knowledge` for user-confirmed business knowledge maintenance, and `devflow-prove` before reporting success.

STOP gates are mandatory wait points — do not continue until the user responds: brainstorm (depth selection A/B/C, core clarification, design contract), spec (review), /devflow-plan (review), cut (CUT_REDUCE/CUT_REUSE confirmation).

Required completion proof:

```text
Command:
Result:
Judgment: PASS / FAIL / BLOCKED
```
