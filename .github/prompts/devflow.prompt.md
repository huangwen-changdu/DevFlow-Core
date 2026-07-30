---
description: "Run a DevFlow Core route for a development request."
name: "DevFlow"
argument-hint: "Describe the request or paste a plan or diff"
agent: "agent"
---

Read `AGENTS.md`, load `skills/devflow-core/SKILL.md`, and select Problem, Fast, Design-lite, Design, Build, or Recovery from current facts.

Core owns all next-step selection. Load the owner skill and its selected reference only when Core chooses it. Explicit independent reviews use `devflow-adversarial` or `devflow-find-fault` without lifecycle handoff. Completion uses `devflow-prove` with fresh evidence and adversarial review.
