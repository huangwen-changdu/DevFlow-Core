# DevFlow Core v2

Follow the shared rules in [AGENTS.md](AGENTS.md). User instructions say WHAT, not HOW. Skills enforce their own gates.

Use `devflow-core` for normal development work when skills are available. Use `devflow-brainstorm` for requirements and design (produces an approved design contract; Depth Selection Gate A/B/C determines handoff: A → devflow-spec → /devflow-plan, B → /devflow-plan, C → devflow-cut directly), `devflow-spec` to save a requirements spec, `/devflow-plan` to create an implementation Plan Pack, `devflow-cut` for reuse and overengineering checks, `devflow-build` for minimal implementation, `devflow-pua` when the user challenges a wrong or repeated miss, `devflow-learn` for reusable correction capture, and `devflow-prove` before reporting success.

STOP gates are mandatory wait points — do not continue until the user responds: brainstorm (depth selection A/B/C, core clarification, design contract; then depth-based: A=spec+plan, B=plan, C=direct to cut), spec (review), /devflow-plan (review), cut (CUT_REDUCE/CUT_REUSE confirmation).

Required completion proof:

```text
Command:
Result:
Judgment: PASS / FAIL / BLOCKED
```
