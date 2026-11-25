# 规则健康台账（Rule Health）

> 用途：每条常驻规则或校验记录最近一次真正拦下问题的时间，作为降级、删除或保留的证据；没有拦截记录的规则不该永久留在主路径。
> 维护：每次缺陷修复或季度复核时更新；`最近拦截` 写 `YYYY-MM-DD`，没有案例写 `baseline <date>` 并只在复核日之后重新计时。
> 机检：`node scripts/devflow-docs.js --check` 只保证本文件被 `docs/INDEX.md` 路由；拦截记录本身是人工判断。

## 复核规则

1. 每季度复核一次；`复核日` 到期前必须给出 `keep`、`downgrade`、`remove` 之一。
2. 90 天没有一次真实拦截案例的规则，降级为提示（不再阻断）或删除；不因"看起来重要"保留。
3. 90 天内出现两次误报（规则拦下但判断为不适用）的规则，直接降级并记录反例。
4. 新规则先进入 `observe`，给 90 天观察期；观察期内不叠加新规则。
5. 降级或删除必须写清替代证据：哪条更窄的规则覆盖了同一风险。

## 台账

| 规则/校验 | 归属 | 最近拦截 | 复核日 | 决定 |
|---|---|---|---|---|
| Brainstorm risk gate | `devflow-core` | baseline 2026-11-25 | 2027-02-23 | observe |
| Fast Small-fix gate | `devflow-core` | baseline 2026-11-25 | 2027-02-23 | observe |
| Prove tier gate | `devflow-prove` | baseline 2026-11-25 | 2027-02-23 | observe |
| Small-fix diff checker | `scripts/devflow-smallfix.js` | baseline 2026-11-25 | 2027-02-23 | observe |
| Small-fix audit mode | `devflow-core` | baseline 2026-11-25 | 2027-02-23 | observe |
| Recall check（踩坑召回） | `devflow-prove` | 2026-11-17（Recall evidence 修复） | 2027-02-23 | keep |
| Hotfix ledger row | `devflow-learn` | baseline 2026-11-25 | 2027-02-23 | observe |
| Requirements ledger terminal | `devflow-prove` | baseline 2026-11-25 | 2027-02-23 | observe |
| Route consistency check | `scripts/validate-route-consistency.js` | baseline 2026-11-25 | 2027-02-23 | observe |
| Mirror parity check | `scripts/validate-devflow.js` | 2026-11-18（安装落位修复） | 2027-02-23 | keep |
| Skill budget check | `scripts/devflow-budget.js` | baseline 2026-11-25 | 2027-02-23 | observe |
| Scenario coverage | `scripts/report-scenario-coverage.js` | baseline 2026-11-25 | 2027-02-23 | observe |
| Rule health review | this file | baseline 2026-11-25 | 2027-02-23 | observe |

多数规则目前只有 baseline，没有真实拦截案例；这不是删除依据，而是复核起点。下一季度先看 `Fast Small-fix`、`Prove tier`、`Route consistency` 三条：如果 90 天内没有一次真实拦截，就降级为提示，把固定成本还给改动。

本次同时启用 Small-fix、Prove tier、Route consistency 三条，作为一次性基线例外；之后新增规则按"一次一条、90 天观察"执行，不再成组叠加。

## 复核记录

| 日期 | 复核人 | 结论 | 依据 |
|---|---|---|---|
| 2026-11-25 | DevFlow Core | 建立台账；Small-fix、Prove tier、Route consistency 进入 observe | 流程固定成本与改动大小脱钩，先观察 90 天 |

## 与观测的关系

- 每次任务在 completion block 记录 `Duration` 与 `Stops`（可选但推荐）；季度复核用它们判断某条规则是否只增加等待、不增加拦截。
- `DEVFLOW_OBSERVE=1` 时，SessionStart hook 追加 JSONL 的 `.devflow-observe.log`；任务结束时用 `--observe` 追加完成事件：
  `DEVFLOW_OBSERVE=1 DEVFLOW_EVENT=complete DEVFLOW_ROUTE=fast DEVFLOW_TIER=narrow DEVFLOW_STOPS=0 DEVFLOW_DURATION_MS=... node hooks/devflow-session-start.js --observe`
- 季度复核按 `route` / `tier` 聚合 `duration_ms` 与 `stops`，对比"有拦截"与"只有等待"的任务。
- 没有观测数据时，至少保留每个任务的真实命令和等待点；没有证据的"感觉慢了"不作为保留规则的理由。
