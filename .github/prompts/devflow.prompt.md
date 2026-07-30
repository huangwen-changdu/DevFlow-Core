---
description: "Run a DevFlow Core route for a development request."
name: "DevFlow"
argument-hint: "Describe the request or paste a plan or diff"
agent: "agent"
---

Read `AGENTS.md`, load `skills/devflow-core/SKILL.md`, and select Problem, Fast, Design-lite, Design, Build, or Recovery from current facts. Before creative work — creating features, building components, adding functionality, modifying behavior, or defining an unapproved problem-directed change — select `devflow-brainstorm` for a `Confirmed request`; pure Q&A, lookup, verification, investigation-only reports, and already approved changes are exceptions.

Core owns all next-step selection. Load the owner skill and its selected reference only when Core chooses it. Explicit independent reviews use `devflow-adversarial` or `devflow-find-fault` without lifecycle handoff. Completion uses `devflow-prove` with fresh evidence and adversarial review.
