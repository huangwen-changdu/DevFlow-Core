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
    BRAIN -->|"design contract"| CUT
    BRAIN -->|"saved spec needed"| SPEC
    SPEC -->|"validated spec"| CUT
    CUT -->|"cut gate passed"| BUILD
    BUILD -->|"implementation done"| PROVE
    PROVE -->|"FAIL/BLOCKED"| CORE
    CORE -->|"correction or pitfall"| LEARN
    PROVE -->|"learning signal"| LEARN
```

## Runtime Chain

```text
devflow-core -> devflow-brainstorm -> devflow-cut -> devflow-build -> devflow-prove
devflow-core --> devflow-brainstorm
devflow-brainstorm --> devflow-spec
devflow-spec --> devflow-cut
devflow-brainstorm --> devflow-cut
devflow-cut --> devflow-build
devflow-build --> devflow-prove
devflow-core --> devflow-pua
devflow-pua --> devflow-brainstorm
devflow-pua --> devflow-prove
devflow-prove --> devflow-learn
devflow-core --> devflow-audit
```

## Short Rules

- Requirements and behavior changes enter `devflow-brainstorm`.
- Larger or explicitly spec-requested work enters `devflow-spec` before planning.
- New implementation structure enters `devflow-cut`.
- Approved minimal work enters `devflow-build`.
- Any completion claim enters `devflow-prove`.
- User challenge, changed-wrong result, repeated miss, or quality complaint enters `devflow-pua`.
- Corrections and reusable pitfalls enter `devflow-learn`.
- Repo-wide overengineering audits enter `devflow-audit`.
