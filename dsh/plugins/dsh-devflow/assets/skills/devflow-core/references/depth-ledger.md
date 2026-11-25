# Depth Ledger

Owner: `devflow-core`; used by Core route selection, Brainstorm, Cut, Plan, Build, and Prove. Load after Sense/discovery and before choosing a route.

The ledger estimates the **work**, not how the problem first appears. A problem can look small and need a large fix; a feature can look large and land as a small local change. Record facts after reading current behavior, callers, contracts, data, tests, and prior attempts.

## Record

```text
Depth ledger:
- Blast radius 0/1/2: files, modules, callers, contracts, data/state, UI/jobs
- Uncertainty 0/1/2: reproduced? hypotheses? missing test? product decision? open unknown
- Irreversibility 0/1/2: revertible? migration/delete/external/security/permissions/public contract
- History 0/1/2: prior hotfix rows, learning cards, plans/specs, repeated failures
- Evidence: reads/tests behind the factors
- Risk debt: open decision-impact unknowns; narrow/Build blocked until 0
- Depth: narrow / standard / full
```

0 = local, known, revertible, no history; 1 = one boundary or one open question; 2 = cross-module, public contract, data, irreversible, security, or repeated failure.

## Mapping

| Depth | Existing behavior (fix) | New behavior (feature) |
|---|---|---|
| `narrow` | Fast Small-fix only with a narrow declared budget, `NARROW_OK`, and all factors at most 1 | Brainstorm `compact` -> Cut Depth C -> Build -> Prove `standard`; new behavior never uses Fast Small-fix |
| `standard` | Design-lite or Build -> Prove `standard` | Brainstorm `standard` -> Cut -> Plan when several steps -> Build -> Prove `standard` |
| `full` | Design or Build -> Prove `full` | Brainstorm `deep` -> Spec -> Cut -> Plan -> Build -> Prove `full` |

- All factors at most 1, no protected surface, risk debt 0 -> `narrow`.
- Any factor 2 or total at least 3 -> `standard`.
- Irreversibility 2 or security/data/permission/contract risk -> `full`.
- An open decision-impact unknown blocks `narrow` and `Build` until resolved or promoted.
- New behavior always goes through Brainstorm; low depth compresses clarification, it does not skip it.
- Stop when no decision-impact unknown remains; do not maximize a score.
- File and line counts are a scope warning, not the depth.

## Examples

- Null-check fix, one caller, reproduction test, revertible -> 0/0/0/0 -> `narrow`.
- Permission check in `auth/`, five lines but protected and irreversible -> 1/0/2/0 -> `full`.
- CSV export on an existing local page, no schema or API change -> 1/0/0/0 -> feature `narrow`: compact Brainstorm -> Cut C -> Build -> `standard`.
- New pricing rule with an open product decision -> 1/2/0/1 -> risk debt 1 -> Brainstorm, not Build.
- Add a persisted column with a migration -> 2/0/2/0 -> `full`: Spec -> Cut -> Plan -> Build -> `full`.
