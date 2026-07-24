# DevFlow Core v2

Follow the shared rules in [AGENTS.md](AGENTS.md). User instructions say WHAT, not HOW. Skills enforce their own gates.

You MUST read `skills/devflow-core/references/core-methods.md` before making any engineering decision, route selection, or code change. This file defines Method 0 (Architect Mindset) through Method 15 and the Capability Matrix. If the platform supports skills, load `devflow-core` first — its Context Map will guide you to this file. If skills are unavailable, read the file directly. Do not skip this step.

Use `devflow-core` for normal development work when skills are available. At Sense, probe existing `.copilot/LEARNING_INDEX.md` and `docs/project-knowledge/`, then progressively load only index-matched cards or knowledge documents; absence does not create storage. Use `devflow-brainstorm` for requirements and design (first output is a semantic echo-back confirmed by the user, never the depth gate; after echo-back, presents Path Selection Gate — when Fast Exit conditions are met, offers Fast Exit as recommended option alongside A/B/C; user chooses path, LLM does not auto-select; if A/B/C chosen, produces an approved design contract, ending at the Depth Selection Gate where the user picks A/B/C; option semantics live in `skills/devflow-brainstorm/SKILL.md`), `devflow-spec` to save a requirements spec, `/devflow-plan` to create an implementation Plan Pack, `devflow-cut` for reuse and overengineering checks, `devflow-build` for minimal implementation, `devflow-pua` when the user challenges a wrong or repeated miss, `devflow-learn` for reusable correction capture, `devflow-project-knowledge` for user-confirmed business knowledge maintenance, and `devflow-prove` before reporting success.

STOP gates are mandatory wait points — do not continue until the user responds: brainstorm (echo-back confirmation, path selection Fast Exit vs A/B/C, depth selection A/B/C, core clarification, design contract), spec (review), /devflow-plan (review), cut (CUT_REDUCE/CUT_REUSE confirmation).

Required completion proof:

```text
Command:
Result:
Judgment: PASS / FAIL / BLOCKED
```
