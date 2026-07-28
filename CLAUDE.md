# DevFlow Core v2

Follow the shared rules in [AGENTS.md](AGENTS.md). User instructions say WHAT, not HOW. Skills enforce their own gates.

You MUST read `skills/devflow-core/references/core-methods.md` before making any engineering decision, route selection, or code change. This file defines Method 0 (Architect Mindset) through Method 15 and the Capability Matrix. If the platform supports skills, load `devflow-core` first — its Context Map will guide you to this file. If skills are unavailable, read the file directly. Do not skip this step.

Use `devflow-core` for normal development work when skills are available. At Sense, probe existing `.copilot/LEARNING_INDEX.md` and `docs/project-knowledge/`, then progressively load only index-matched cards or knowledge documents; absence does not create storage. **Also scan available skills in the current environment** (platform skill registry, `use_skill` listing, local skill directories). When a non-devflow skill (e.g., `frontend-design`, `pdf`, `understand`, `data-analysis`) matches the task, suggest loading it alongside the devflow route — external skills guide execution quality, devflow manages scope and risk. Use `devflow-brainstorm` for requirements and design (first output is a semantic echo-back confirmed by the user, never the depth gate; after echo-back, presents Path Selection Gate — when Fast Exit conditions are met, offers Fast Exit as recommended option alongside A/B/C; user chooses path, LLM does not auto-select; if A/B/C chosen, produces an approved design contract, ending at the Depth Selection Gate where the user picks A/B/C; option semantics live in `skills/devflow-brainstorm/SKILL.md`), `devflow-spec` to save a requirements spec, `devflow-cut` to decide reuse and scope before construction planning, `/devflow-plan` to create a `CUT_PASS`-bounded implementation Plan Pack, `devflow-build` for minimal implementation, `devflow-pua` when the user challenges a wrong or repeated miss, `devflow-learn` for reusable correction capture, `devflow-project-knowledge` for user-confirmed business knowledge maintenance, and `devflow-prove` before reporting success.

For an explicit independent deep adversarial review, red-team review, 对抗审查, or 升级版对抗审查, load `devflow-adversarial` directly. For an explicit find-fault, biggest omission, blind spot, least-certain, 找茬, 最大遗漏, 没有意识到什么, or 最没有把握 request, load `devflow-find-fault` directly. Both can run at any stage and must not read, require, modify, or hand off to lifecycle skills or completion state.

STOP gates are mandatory wait points — do not continue until the user responds: brainstorm (echo-back confirmation, path selection Fast Exit vs A/B/C, depth selection A/B/C, design contract [A/B only]), spec (review), /devflow-plan (review), cut (CUT_REDUCE/CUT_REUSE confirmation).

Required completion proof:

```text
Command:
Result:
Adversarial review:
Judgment: PASS / FAIL / BLOCKED
```
