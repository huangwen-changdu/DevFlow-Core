# DevFlow Skill Guide

## Skill Chain

```text
devflow-core -> devflow-brainstorm -> user-selected A/B/C
  -> A: devflow-spec -> devflow-cut -> devflow-plan -> devflow-build -> devflow-prove
  -> B: devflow-cut -> devflow-plan -> devflow-build -> devflow-prove
  -> C: devflow-cut -> devflow-build -> devflow-prove
  -> non-unique artifact: return facts to devflow-core
  -> devflow-pua (when user challenge/repeated miss appears)
  -> devflow-learn (when correction/pitfall appears)
  -> devflow-audit (when a repo-wide quality audit is requested)
```

## Review Selector

Choose by object and question, not by the word "review". One primary owner per request.

| Object | Question | Owner | Output | Gate |
|---|---|---|---|---|
| The current change's completion claim | What is the strongest reason this is still wrong? | `devflow-prove` built-in adversarial review | `Adversarial review:` line in the completion block | Yes: a real gap returns `FAIL` |
| Current result, plan, design, or claim | Does it still hold, and where can it be broken? | `devflow-adversarial` | Five-angle coverage plus Critical / Important / Observation findings with evidence and confidence | No, independent report |
| Current requirement, implementation, or task material | What is missing, unconfirmed, or least certain? | `devflow-find-fault` | Three questions, unease check, necessary adjustments and fixes | No, independent report |
| Repository, directory, or file set | What breaks, what is slow, what can be cut? | `devflow-audit` | Six-dimension findings plus the lean list | No, independent report |
| Current diff or plan | Is this overengineered or out of scope? | `devflow-cut` (`/devflow-review`) | Eight-tag cut lines | No, independent report |

Rules:

- A bare "review this" or "审查一下" without an object and question asks one four-way selector: A whole-repo quality (`devflow-audit`) / B does the current result hold (`devflow-adversarial`) / C what is missing or unconfirmed (`devflow-find-fault`) / D overengineering in the current diff or plan (`devflow-cut`). Do not start two owners by default.
- If the user explicitly asks for both adversarial and find-fault, run adversarial first, then find-fault, and keep the reports separate.
- `devflow-prove`'s adversarial review is a mandatory completion-gate step, not a load of `devflow-adversarial`; the standalone skill never reads or changes Prove state.

## Skill Responsibilities

| Skill | Responsibility |
|---|---|
| `devflow-core` | Route entry and any non-unique artifact, load shared methods, and maintain the compact flow map. |
| `devflow-brainstorm` | Clarify intent, then let the user select A/B/C and start its direct branch. |
| `devflow-spec` | Write and validate saved requirements specs under `docs/specs/` before implementation planning. |
| `devflow-plan` | Create a Plan Pack from a `CUT_PASS`-bounded spec or approved design. |
| `devflow-cut` | Prevent overengineering and force reuse checks. |
| `devflow-build` | Implement the approved smallest useful change. |
| `devflow-prove` | Verify and report evidence before completion. |
| `devflow-pua` | Stop wrong-path recovery, re-ask or infer the desired result, switch approach, and hand back to Prove/Learn. |
| `devflow-learn` | Capture reusable corrections and pitfalls into `.copilot` learning cards. |
| `devflow-adversarial` | Independently challenge whether a current result holds; report five-angle coverage and severity findings without touching lifecycle state. |
| `devflow-find-fault` | Independently find missing, unconfirmed, or least-certain parts; run the unease check and report necessary adjustments without touching lifecycle state. |
| `devflow-audit` | Audit a repository or scope for bugs, risk, load failure, and missing tests, then always print every confirmed cut with its replacement and `Apply next` handoff, without editing files. |

## Authoring Rules

- Keep each skill short enough to load directly.
- Put trigger phrases in `description`.
- Prefer imperative steps over explanation.
- Do not duplicate all framework rules inside every skill.
- A skill directly follows only its named A/B/C success edge; every other artifact returns facts to Core or states an independent stop boundary.
- Each skill must be executable: trigger, action steps, anti-rationalization check, stop/handoff, proof.
- Put shared routing details in `skills/devflow-core/references/core-methods.md`; put detailed lifecycle methods in the selected owner's local reference.
- Keep runtime methods in `skills/*/references/*`. `docs/` is reserved for product and generated artifacts — `docs/specs/` for saved specs, `docs/plans/` for saved plans — never runtime framework methods.

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
| `/devflow-simplify` | Prove simplify pass (`devflow-prove` reference) |
| `/devflow-pua` | `devflow-pua` |
| `/devflow-audit` | `devflow-audit` |
