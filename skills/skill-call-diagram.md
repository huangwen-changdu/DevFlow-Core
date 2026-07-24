# DevFlow Core Skill Call Diagram

```mermaid
graph TD
    CORE["devflow-core<br/>route Fast / Design / Build / Recovery"]
    BRAIN["devflow-brainstorm<br/>goal, constraints, approaches"]
    SPEC["devflow-spec<br/>requirements source"]
    CUT["devflow-cut<br/>Ponytail Ladder + gates"]
    BUILD["devflow-build<br/>minimal implementation"]
    PROVE["devflow-prove<br/>evidence before completion"]
    PUA["devflow-pua<br/>pressure recovery and re-alignment"]
    LEARN["devflow-learn<br/>learning cards and pitfall capture"]
    AUDIT["devflow-audit<br/>repo-wide overengineering audit"]

    CORE -->|"Design route"| BRAIN
    CORE -->|"Build route"| BRAIN
    CORE -->|"Fast route"| PROVE
    CORE -->|"Recovery pressure"| PUA
    CORE -->|"/devflow-audit or audit request"| AUDIT
    PUA -->|"goal/result clear"| BRAIN
    PUA -->|"proof needed"| PROVE
    BRAIN -->|"STOP: Path Gate (user chooses)"| PATH{"Fast Exit / A/B/C"}
    PATH -->|"User picks Fast Exit"| CUT
    PATH -->|"User picks A/B/C"| DEPTH{"Depth A/B/C"}
    DEPTH -->|"A: Full Spec"| SPEC
    DEPTH -->|"B: Simplified"| PLAN["/devflow-plan"]
    DEPTH -->|"C: Dialogue"| CUT
    SPEC --> PLAN
    PLAN --> CUT
    CUT -->|"cut gate passed"| BUILD
    BUILD -->|"implementation done"| PROVE
    PROVE -->|"FAIL/BLOCKED"| CORE
    CORE -->|"correction or pitfall"| LEARN
    PROVE -->|"learning signal"| LEARN
```

## Runtime Chain

```text
devflow-core -> devflow-brainstorm -> [STOP: Path Gate: user chooses Fast Exit or A/B/C]
  -> Fast Exit (user-chosen): short design contract -> devflow-cut
  -> A/B/C (user-chosen): A: devflow-spec -> /devflow-plan | B: /devflow-plan | C: direct -> devflow-cut
-> devflow-build -> devflow-prove
devflow-core --> devflow-pua
devflow-pua --> devflow-brainstorm
devflow-pua --> devflow-prove
devflow-prove --> devflow-learn
devflow-core --> devflow-audit
```

## Short Rules

- Requirements and behavior changes enter `devflow-brainstorm`, which presents a Path Selection Gate: when Fast Exit conditions are met (small change to existing feature, all boundary gates pass, single plausible path), Fast Exit is offered as a recommended option alongside A/B/C. The user chooses the path — the LLM does not auto-select.
- Depth A saves a spec via `devflow-spec` then plans via `/devflow-plan`; Depth B plans directly; Depth C goes straight to `devflow-cut`.
- New implementation structure enters `devflow-cut`.
- Approved minimal work enters `devflow-build`.
- Any completion claim enters `devflow-prove`.
- User challenge, changed-wrong result, repeated miss, or quality complaint enters `devflow-pua`.
- Corrections and reusable pitfalls enter `devflow-learn`.
- Repo-wide overengineering audits enter `devflow-audit`.
