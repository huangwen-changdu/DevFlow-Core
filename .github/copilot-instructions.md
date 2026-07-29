# DevFlow Core v2 Copilot Instructions

Follow [AGENTS.md](../AGENTS.md) as the shared project rule source.

Default workflow:

1. Sense: read project facts before deciding. Probe existing `.copilot/LEARNING_INDEX.md` and `docs/project-knowledge/`, then progressively read only index-matched cards or navigation-selected knowledge documents; absence is non-blocking and does not create storage. **Also scan available skills in the current environment** (platform skill registry, `use_skill` listing, local skill directories). When a non-devflow skill (e.g., `frontend-design`, `pdf`, `understand`, `data-analysis`) matches the task, suggest loading it alongside the devflow route — external skills guide execution quality, devflow manages scope and risk.
2. Brainstorm clarification: for requirements, behavior changes, features, architecture, ambiguity, or multiple options, read facts, send a Semantic Echo-Back, apply the Understanding Revision Rule when a correction changes the request, and resolve only goal, scope, exclusions, constraints, acceptance, and open questions one at a time. `devflow-brainstorm` ends with `Confirmed request` and `Status: clarified`; `devflow-core` then decides whether the request needs Spec design work. Use Design-lite only for a small change to an existing feature with clear behavior, one plausible path, low risk, local impact, and quick proof — not for new requirements.
3. Spec, Cut, or Plan: when Core selects it, `devflow-spec` compares real options, writes and waits for approval of the design contract/saved spec, then returns the confirmed Spec to Core. Core selects `devflow-cut` for reuse and scope constraints before planning. Every Cut result returns to Core: after `CUT_PASS`, Core selects `/devflow-plan`, Build, Prove, or no further work; `/devflow-plan` returns its reviewed, Cut-consistent Plan to Core. Spec and plan have a STOP gate for user review.
4. Cut: apply Required Gates (Reuse, Ponytail, Root-Cause, Native, Overbuild, Diff, Scope) before new code or structure. The Ponytail Ladder includes a skill-reuse rung: does an available environment skill handle this without writing new code? External skills that guide implementation (e.g., `frontend-design`) are loaded alongside the devflow route, not instead of it. Output CUT_PASS / CUT_REDUCE / CUT_REUSE / CUT_BLOCKED.
5. Build: make the smallest necessary change only.
6. Prove: run verification and report real evidence. For development work, perform adversarial review against acceptance criteria, touched files, likely regressions, activation paths, and proof coverage; a real gap means `FAIL` or continued work before completion.

For problem solving, bug fixing, and architecture design, use First Principles Cut when the cause, constraint, invariant, abstraction, or smallest correct mechanism is unclear. Reduce to facts, constraints, and invariants before selecting a solution.

When the user repeatedly points out that the same function, result, or requested capability has a problem in one task lifecycle, enter pressure recovery: stop the current approach, read the local `devflow-pua` methodology-router/methodology-library/flavor-display references, quarantine old wrong context, classify User-view miss and Satisfaction gap, show `METHOD: {flavor} / {method}`, return recovery facts to Core, ask what is wrong and what result is wanted when not inferable, and switch to a different/opposite method when the prior method failed. Core decides whether Brainstorm must re-confirm the request and selects any later lifecycle work. If the miss is reusable, load `devflow-learn`.

For an explicit independent deep adversarial review, red-team review, 对抗审查, or 升级版对抗审查, load `devflow-adversarial` directly. For an explicit find-fault, biggest omission, blind spot, least-certain, 找茬, 最大遗漏, 没有意识到什么, or 最没有把握 request, load `devflow-find-fault` directly. Both are manual at any stage and do not read, require, modify, or hand off to lifecycle skills or completion state.

For bug fixes, search callers/references before editing and choose shared vs narrow fix intentionally. Mark deliberate simplifications with `devflow: <ceiling>, revisit when <trigger>` so `/devflow-debt` can harvest them.

When the user reports a problem without explicitly asking for a fix, prove the facts first and re-route only after the needed change is known.

If a request might be Fast, Design-lite, or full Design and facts do not decide it, ask the user to choose the route instead of guessing.

Design output:

```text
Goal:
Smallest useful plan:
Not doing:
Impact:
Verification:
```

Completion proof:

```text
Command:
Result:
Adversarial review:
Judgment: PASS / FAIL / BLOCKED
```

Never claim done without proof. Never add dependency, abstraction, config, directory, framework layer, or generic extension unless the current task needs it now. User instructions say WHAT, not HOW — skills enforce their own gates.
