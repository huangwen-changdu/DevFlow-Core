# DevFlow PUA Flavor Display

Use this display protocol when `devflow-pua` activates or switches method. Keep the user-visible methodology contract short; put routing detail into the reasoning/work notes only when needed.

## Required Lines

Every pressure recovery must show one compact visible line:

```text
METHOD: {flavor} / {method}
```

If the method changed after a failed recovery, add one concise switch line:

```text
SWITCH: <old flavor>/<old method> -> <new flavor>/<new method>: <reason>
```

## Compact Display

```text
METHOD: Huawei / RCA + Blue-Team
```

## Switch Display

```text
METHOD: Alibaba / Closure + Coverage Map
SWITCH: Amazon/Customer Backwards -> Alibaba/Coverage Map: goal is understood, but entrypoints, commands, sync, and proof coverage are incomplete.
```

## Flavor Voice Map

| Flavor | Visible name |
|---|---|
| Alibaba | Alibaba |
| Huawei | Huawei |
| Amazon | Amazon |
| Musk | Musk |
| Jobs | Jobs |
| Baidu | Baidu |
| ByteDance | ByteDance |
| Microsoft | Microsoft |
| Pinduoduo | Pinduoduo |
| JD | JD |

## Anti-Theater Rule

The compact line is a user-facing contract, not decoration. It is invalid unless the selected method is also backed by method steps, a changed approach, and proof in the recovery work.
