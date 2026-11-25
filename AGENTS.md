# DevFlow Harness

Harness contract for changing code: stages, gates, stop points, output contracts. Not the agent's identity. Stays executable without skills. Method depth stays in `skills/*/references/`.

## Process

Run the seven stages in order. Each ends with an exit artifact; skip one only where the route table allows it.

1. **Sense** — Read rules, source, tests, commands, `README.md`. Match `docs/features/INDEX.md` and `docs/plans/INDEX.md`; open only the matched row, or filter an index over 40 rows with `node scripts/devflow-plan.js --index --query 关键词`. Read matching learning cards (global first), then `docs/INDEX.md` and `docs/project-knowledge/AI-START-HERE.md`. Search callers before diagnosing a bug; when cause, constraint, invariant, or mechanism is unclear, explain facts, constraints, mechanism, verification. Missing sources are non-blocking. Exit: `Facts` and `Unknowns`.
2. **Route** — Precedence: explicit independent review (`devflow-adversarial`, `devflow-find-fault`) -> investigation-only problem report or pure inquiry -> approved scope -> risk gate -> lifecycle owner. Keywords never decide. Signals: clear low-risk existing behavior change, creative work with ambiguity, material risk, or explicit grill/stress-test request, unapproved problem-directed change outside the Small-fix gate (creative work, never Fast), `spec doc`, `plan`, `ready`, repeated same-target miss. Exit: one route.
3. **Gate** — Brainstorm is required for material risk, ambiguity, cross-module/external impact, irreversible effects, security/data-loss/permission/contract risk, or a missing decision fact. Skip only when goal, local behavior, one path, local impact, reversibility, no protected risk, and quick proof all hold. A Fast Small-fix skips Brainstorm, Cut, and Plan only with: explicit fix request; <=20 lines and <=2 files; reversible; local; no protected surface (auth, permissions, payments, data, contract, security, irreversible); no new dependency, abstraction, configuration, directory, or framework layer; one command verifies it. Any miss promotes to Design-lite or Build. Unapproved edits never use Fast except through the Small-fix gate. A narrow claim requires `devflow-smallfix.js` `NARROW_OK`; missing or failed -> `standard`. Skipping Brainstorm compresses analysis only; it never skips Cut or Prove. Exit: `Brainstorm required: yes/no` plus a depth hint; STOP for the Confirmed request and user-selected A/B/C.
4. **Contract** — Smallest contract: two-line Small-fix intent (`cause / smallest change / verify command`) with the diff as approval boundary; Design-lite contract (goal, acceptance, exclusions, baseline); Confirmed request; or approved Spec/Plan. No contract, no change. Exit: the contract artifact.
5. **Change** — Smallest diff that satisfies acceptance. Reuse and native platform before new code; add no dependency, abstraction, configuration surface, directory, framework layer, or generic engine without an accepted need. A Small-fix that exceeds its estimate or touches a protected surface stops and promotes. For destructive or irreversible work, explain impact, alternatives, verification, rollback, then wait. Exit: diff plus a fresh check.
6. **Prove** — Run the narrowest sufficient check, then review the gap between claim and evidence. Tiers: `narrow` for Fast Small-fix, `standard` for Design-lite/Build, `full` for protected, cross-module, irreversible, or explicitly reviewed work. Narrow: named check, one regression, diff review, one-line strongest challenge, hotfix row for a defect. Standard adds Simplify Pass, Code Review Report, Learn review. Full adds Recall learning cards and `docs/hotfix-log.md` rows; a card that would have caught a defect here is FAIL. No matching evidence, no completion. Exit: PASS, FAIL, or BLOCKED.
7. **Record** — One `docs/requirements.md` row for a creative or problem-directed change outside Fast Small-fix. Append one `docs/hotfix-log.md` row per landed defect fix; create a missing ledger from its header, never skip. Fast Small-fix gets a hotfix row for a defect and no requirements row. Two corrections to the same boundary, placement, workflow, or wording per lifecycle require a learning card. Write a learning card only for reusable, evidence-backed experience; Fast Small-fix defaults to no card. Keep the knowledge pack current: create on first landing, refresh code-evidenced structure, gate business semantics on confirmation. Review `docs/rule-health.md` quarterly when present; 90 days without interception downgrades or removes a rule. Update docs only on behavior or contract change. Exit: the record, or why not.

## Routes

| Route | Enter when | Owner and exit |
|---|---|---|
| Problem | Reported problem, no fix request. | Facts first; later work only if a change is known. |
| Fast | Answer/lookup/verify, or a Small-fix passing stage 3. | Sense -> Fix -> Prove (`narrow`); promote if the estimate or blast radius grows. |
| Design-lite | Existing behavior, seven low-risk conditions, not a Small-fix. | `devflow-cut` Depth C -> Build -> Prove (`standard`). |
| Design | New behavior, ambiguity, material risk, or options. | `devflow-brainstorm` -> user-selected A/B/C. |
| Build | Implement or land an approved scope. | `devflow-cut` -> Plan if several steps -> Build -> Prove. |
| Recovery | Same target still wrong after repeated correction, or a switch request. | `devflow-pua`; one ordinary correction returns to Core. |


## Flow and Returns

```text
Fast Small-fix success: Sense -> Fix -> Prove (narrow).
Skip-Brainstorm Design-lite success: Cut -> Build -> Prove.
A direct success: Brainstorm -> Spec -> Cut -> Plan -> Build -> Prove
B direct success: Brainstorm -> Cut -> Plan -> Build -> Prove
C direct success: Brainstorm -> Cut -> Build -> Prove

CUT_REDUCE, CUT_REUSE, CUT_BLOCKED, scope drift, BUILD_BLOCKED,
Proof FAIL or BLOCKED, and PUA recovery -> Core selects the next owner or stops.
Small-fix estimate exceeded, protected surface, or verification failure -> promote.
```

Owners return facts to Core. STOP for Brainstorm/Spec/Plan approval and `CUT_REDUCE`/`CUT_REUSE`; a passing Small-fix has no STOP.

## Receipt

Every task ends with one fenced receipt (执行回执), last: `▸ devflow · <node> · <state> · <evidence>`, state `已加载 / 已执行 / 不适用 / 受阻 / 未执行`. A node emits its own only on stop, failure, or route change. Loading is 已加载, never 已执行; 不适用 names the unmet condition; no gate or verdict power. A status line that changes no action does not appear; when the user must decide, merge it: `▸ devflow · <node> → <next> · awaiting approval`.

## Skills and Fallback

Load `.agents/skills/devflow-core/SKILL.md` first (source `skills/`), then only the lifecycle reference Core selects; `skills/...` paths resolve there. Resolve skills/checkers from the project, then `~/.agents`, `~/.claude`, `~/.codex`, `~/.dsh`. A matching environment skill may do bounded work and returns result/not-applicable/failure facts; it never selects route, depth, approval, or final status. A missing skill, index, or checker is non-blocking and never a reason to stop. When skills are unavailable, this file is the whole procedure.

## Always-On Rules

- Independent judgment: check for false premises, logical leaps, and material missing information; separate verified facts, inferences, and opinions; state the evidence, risks, and plausible alternative explanations; state the evidence boundary when verification is unavailable; name overlooked variables, costs, constraints, and likely biases.
- Final artifacts and wrappers describe the accepted final state for a reader who did not see this session.
- Keep progress visible: maintain a `todo_write` list with one item per active work unit, and a goal for long-running work.

## Output Contracts

Design:

```text
Goal:
Smallest useful plan:
Not doing:
Impact:
Verification:
```

Completion:

```text
Command:
Result:
Adversarial review:
Judgment: PASS / FAIL / BLOCKED
```

## Graphify

Only where `graphify-out/` exists: read `GRAPH_REPORT.md` before architecture answers, then run `graphify update .` after changing code.
