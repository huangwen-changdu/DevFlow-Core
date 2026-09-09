# 需求台账（Requirements）

> 摘要: 用途=一条需求从确认到落地的唯一记录，补上 Spec/Plan/能力行之间缺失的那一环 | 维护=各生命周期节点推进状态，Prove 写终态 | 机检=node scripts/devflow-plan.js --index | 更新日=2026-09-10

## 状态机

```text
open -> designed -> planned -> built -> landed
任一非终态 -> opt-out（用户显式跳过文档）或 dropped（需求作废）
```

| 状态 | 含义 | 写入方 |
|---|---|---|
| `open` | 需求已确认，尚未设计 | `devflow-brainstorm` 或 `devflow-core` |
| `designed` | Spec 已批准 | `devflow-spec` |
| `planned` | Plan 已批准 | `devflow-plan` |
| `built` | 构建完成 | `devflow-build` |
| `landed` | 验证通过并落地 | `devflow-prove` |
| `opt-out` | 验证通过，但用户显式跳过文档 | `devflow-docs-followup` |
| `dropped` | 需求作废 | `devflow-core` |

## 台账

| 日期 | 需求 | 来源 | 深度 | 落地物 | 状态 | 证据或跳过 | 更新日 |
|---|---|---|---|---|---|---|---|
| 2026-09-10 | 需求闭环与开发者画像：需求台账 + 跳过留痕 + 闭环报告 + 偏好卡 | 用户请求 | A | docs/specs/2026-09-10-requirement-loop-and-developer-profile.md, docs/plans/2026-09-10-requirement-loop-and-developer-profile.md | landed | npm run verify:all 退出码 0；--index PASS；--loop 输出计数 | 2026-09-10 |

## 维护机制

- **建档**：Brainstorm 输出 `Confirmed request`，或 Core 判为创造性工作（Design / Build 路由）时，立即写 `open` 行；纯问答、纯查询、只读验证不建档。
- **推进**：每个节点只把状态推进一格，不回退；「落地物」列填 spec 或计划路径，路径必须真实存在。
- **终态**：`landed` 与 `opt-out` 都必须填证据；`opt-out` 还必须写原因（谁在何时选择跳过哪类文档）。
- **跳过权在用户**：沉默或含糊回复不算跳过，默认记录照常生成；只有用户显式说不需要文档才写 `opt-out`。跳过只豁免文档正文，不豁免验证。
- **机检**：`node scripts/devflow-plan.js --index` 校验状态白名单、终态证据、`opt-out` 原因与落地物路径；`node scripts/devflow-plan.js --loop` 输出各状态计数、计划落地率与晋升候选。
