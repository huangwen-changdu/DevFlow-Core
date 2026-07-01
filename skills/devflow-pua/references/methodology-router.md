# DevFlow PUA Methodology Router

This is the local runtime source for pressure-recovery methodology. It is adapted into DevFlow-Core from the PUA methodology-router idea so agents do not need to link to or read another project at runtime.

Use this file whenever `devflow-pua` activates.

## Rule

A flavor is not decoration. It is the active problem-solving method plus a short visible voice. Switching flavor means switching behavior.

Always display the selected method with this compact user-facing line:

```text
METHOD: {flavor} / {method}
```

If switching away from a failed method, add:

```text
SWITCH: <old flavor>/<old method> -> <new flavor>/<new method>: <reason>
```

The route, switch reason, and evidence still matter, but they are internal selection checks unless the user asks for full diagnostics.

## Starting Route

| Signal | Flavor | Method | Required behavior |
|---|---|---|---|
| Bug, error, regression, behavior unchanged | Huawei | RCA + Blue-Team | Trace root cause, search callers, attack the fix before editing. |
| User-visible UX/product/result mismatch | Amazon | Customer Backwards | Start from the user-visible result and acceptance proof. |
| Repeated missing pieces, missed sync, incomplete entrypoints | Alibaba | Closure + Coverage Map | Enumerate every required surface and prove each one. |
| New feature, scope pressure, overbuilding risk | Musk | The Algorithm | Question need, delete, simplify, then build the minimum. |
| Quality complaint, hard-to-distinguish result, polish gap | Jobs | Subtraction + Highest Standard | Remove noise and define the visible quality bar. |
| Guessing without evidence, docs/API uncertainty | Baidu | Search First | Retrieve facts before deciding. |
| Proof gap, metrics, validation uncertainty | ByteDance | Data/Proof | Define measurable evidence before claiming result. |
| Repeated same hypothesis, no changed action | Microsoft | Learning Loop | Failed assumption -> new evidence -> changed action -> proof. |
| Too many middle steps, ceremony, or unnecessary layers | Pinduoduo | Cut Middle Layers | Remove process and ship the shortest result path. |

Default when no signal is clear: Alibaba Closure, because recovery needs goal, process, result, and retrospective.

## Failure Switch

When the current method fails, switch by failure pattern. Do not repeat a failed method unchanged.

| Failure pattern | Switch chain | Why |
|---|---|---|
| Same approach loop | Musk -> Pinduoduo -> Huawei | Reset assumptions, cut noise, then attack root cause. |
| Missing this / missing that | Alibaba -> Amazon -> Huawei | Map surfaces, re-check desired result, then trace root cause. |
| User says result is not what they wanted | Amazon -> Jobs -> Alibaba | Rebuild from user outcome, tighten visible quality, then close coverage. |
| Behavior still unchanged | Huawei -> Microsoft -> Baidu | Root cause failed, inspect learning loop, then retrieve new facts. |
| Proof absent or weak | ByteDance -> JD -> Alibaba | Evidence first, result ownership, closure. |
| Guessing or stale memory | Baidu -> Amazon -> Huawei | Find facts, work backwards, then root-cause. |
| Overbuilt or wrong artifact | Musk -> Jobs -> Alibaba | Delete wrong structure, focus target surface, close coverage. |

## Pre-Switch Check

Before switching, answer:

1. Did the current method's core steps actually run?
2. Is failure due to the method being wrong, or execution being incomplete?
3. Does the next method directly address the failure pattern?

If the current method was not executed, run it properly before switching. If it was executed and still missed, switch immediately and restart checks from facts.

## Method Summaries

| Flavor | Method summary |
|---|---|
| Alibaba | Define goal, track process, get result, retrospective. Recovery uses Coverage Map and closure proof. |
| Huawei | RCA 5-Why, caller/reference search, Blue-Team attack, evidence-based delivery. |
| Amazon | Customer Obsession, Working Backwards, Dive Deep, Single-Threaded Owner. |
| Musk | Question requirement, delete, simplify, accelerate, automate only after proof. |
| Jobs | Subtraction before addition, visible quality bar, DRI responsibility. |
| Baidu | Search and source retrieval before judgment; simple and reliable output. |
| ByteDance | Data before intuition; verification path before completion claim. |
| Microsoft | Learning loop: failed assumption, new evidence, changed action, verified impact. |
| Pinduoduo | Cut all middle layers; results only; shortest decision chain. |
| JD | Customer result and frontline reality; no remote guessing. |
