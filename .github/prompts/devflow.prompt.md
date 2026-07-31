---
description: "Run a DevFlow Core route for a development request."
name: "DevFlow"
argument-hint: "Describe the request or paste a plan or diff"
agent: "agent"
---

Read `AGENTS.md`, load `skills/devflow-core/SKILL.md`, and select Problem, Fast, Design-lite, Design, Build, or Recovery from current facts. Before creative work, select `devflow-brainstorm` for a `Confirmed request` and user-selected A/B/C; pure Q&A, lookup, verification, investigation-only reports, and already approved changes are exceptions.

Core owns non-unique next-step selection. Direct successes are A: Brainstorm -> Spec -> Cut -> Plan -> Build -> Prove, B: Brainstorm -> Cut -> Plan -> Build -> Prove, and C: Brainstorm -> Cut -> Build -> Prove. Other artifacts return to Core. Explicit independent reviews use `devflow-adversarial` or `devflow-find-fault` without lifecycle handoff. Completion uses `devflow-prove` with fresh evidence and adversarial review.
