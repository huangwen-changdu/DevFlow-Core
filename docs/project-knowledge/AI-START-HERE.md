# DevFlow-Core 项目上下文导航（AI 起点）

Metadata:
- repo: DevFlow-Core（本仓库根目录）
- last_updated: 2026-08-13
- updated_from: 全量结构探索 + 四路交叉评审 + 三项改进落地（2026-08-13 会话）
- confidence: high（所有路径经 glob/read 核实）
- coverage: 目录/技能/命令/脚本/宿主入口地图、生命周期路由、验证矩阵、已确认改进点清单、关键结论
- stale_risk: medium（结构随重构过期；改进点清单随排期过期）
- next_review_hint: 结构或技能增删时同步本文；改进点落地后更新其状态列

## 项目是什么

DevFlow-Core 是一个可安装的 AI 编码代理工作流框架：把问题/需求通过 `Sense → Brainstorm 澄清（用户选 A/B/C）→ Spec/Cut → Plan → Build → Prove → Learn` 变成小步、验证过的改动，内置防过度工程阶梯与防自欺完成闸门。零运行时依赖；载体是 AGENTS.md、14 个技能、11 个命令、Node 校验脚本；支持 Codex、Claude Code、Copilot、CodeBuddy、WorkBuddy、Gemini、DSH。

## 进入任务前先冻结的 5 个问题

1. 这是创造性工作（新功能/行为修改/未批准的问题导向改动）还是纯 Q&A/调查？（决定是否必须过 Brainstorm 的 A/B/C）
2. 用户是否已选定 A/B/C 深度？走哪条成功边？
3. 本次改动是否触碰 runtime 面（skills/*、AGENTS.md、commands、scripts/devflow-*.js）还是仅 docs/？（决定同步范围与验证矩阵）
4. 是否新增依赖/抽象/目录/配置？（必须先过 Cut 阶梯，validator 会拦）
5. 完成时能否给出 Command / Result / 对抗审查 / Judgment 的新鲜证据？

## 阅读顺序

必读（新会话建上下文）：

1. 本文件（结构导航）
2. `AGENTS.md`（启动接口 + 路由表 + 硬边界，≤8 KiB）
3. `.copilot/LEARNING_INDEX.md` → 只读 Trigger/Scope 匹配的卡，禁止全量读 cards/

按任务类型追加：

- 改路由/生命周期语义 → `docs/features/devflow-core.md`（v1–v51 决策历史，先读 Key Decisions 防重蹈）+ `skills/devflow-core/SKILL.md` + `skills/devflow-core/references/core-methods.md`
- 改某个技能 → 该技能的 `SKILL.md` + 其 references + `scripts/validate-devflow.js` 中对应精确短语断言
- 改安装/打包 → `README.md`、`scripts/install-devflow.js`、`scripts/install-devflow-user.js`、`docs/platform-setup.md`
- 产品方向 → `docs/PRD.md`
- 改验证体系 → `docs/features/validation-harness.md`

## 目录与职责地图

| 技能 | 职责一句话 | 关键引用 |
|---|---|---|
| `skills/devflow-core/` | 路由与非唯一选择（Problem/Fast/Design-lite/Design/Build/Recovery） | `references/core-methods.md` |
| `skills/devflow-brainstorm/` | 语义回显 + 一次一问 + Confirmed request + A/B/C 门 | `references/interview-discipline.md` |
| `skills/devflow-spec/` | A 分支设计契约 + 保存 spec | `references/spec-plan-methods.md` |
| `skills/devflow-plan/` | A/B 实现计划（Plan Pack） | `references/plan-methods.md` |
| `skills/devflow-cut/` | 防过度工程；最小方案阶梯单一源在 SKILL.md（9 阶 + Ponytail 定义） | `references/cut-methods.md`、`references/native-capability-checklist.md` |
| `skills/devflow-build/` | 最小改动 + 实现切片 | `references/build-methods.md` |
| `skills/devflow-prove/` | 完成闸门（Command/Result/对抗审查/Judgment） | `references/proof-recovery-methods.md`、`references/code-review-checklist.md`、`references/flow-self-test.md` |
| `skills/devflow-pua/` | 压力恢复（停、隔离、换方法） | `references/methodology-router.md`、`references/methodology-library.md`、`references/flavor-display.md` |
| `skills/devflow-learn/` | PASS 复盘 + 学习卡（索引先行） | — |
| `skills/devflow-adversarial/` / `skills/devflow-find-fault/` | 用户显式请求的独立评审（不进入生命周期） | — |
| `skills/devflow-audit/` | 仓库级过度工程扫描 | — |
| `skills/devflow-project-knowledge/` | 业务知识包维护（唯一维护者） | — |
| `skills/devflow-docs-followup/` | 验证过的功能完成后的可选文档询问 | — |

其余入口：

- `commands/*.toml`：11 个命令（devflow、spec、plan、review、debt、prove、pua、learn、adversarial、find-fault、audit）
- `scripts/`：运行时检查器（devflow-spec/plan/review/debt/audit/doctor.js，随安装分发）+ 安装器（install-devflow.js、install-devflow-user.js）+ 维护者验证器（validate-*.js、report-scenario-coverage.js、capability-eval.js、devflow-budget.js、validate-route-consistency.js，不随安装分发）
- 宿主入口：`.github/`（copilot-instructions.md + instructions/ + prompts/）、`.claude/`（settings.json + commands/devflow-core.md）、`.codebuddy/rules/devflow-core/RULE.mdc`、`hooks/`（SessionStart）、`dsh/agent-presets/devflow/`（DSH 预设：薄激活器）、`dsh/agent-presets/devflow-2/`（DSH 预设：两阶段锚定 + Code Mode，自带 tool-bootstrap.mjs）、`plugin.json`、`gemini-extension.json`
- `docs/`：`PRD.md`（产品方向）、`features/`（devflow-core.md 迭代台账、validation-harness.md）、`specs/` `plans/`（日期前缀落地件）、`platform-setup.md`、`iteration-plan.md`
- `.copilot/`：`LEARNING_INDEX.md` + `cards/`（踩坑/拦截规则，索引先行只读匹配卡）

## 生命周期路由（速览，细节以 AGENTS.md + core SKILL 为准）

- 路由表 6 条：Problem / Fast / Design-lite / Design / Build / Recovery
- 直接成功边：A `Brainstorm→Spec→Cut→Plan→Build→Prove`；B `Brainstorm→Cut→Plan→Build→Prove`；C `Brainstorm→Cut→Build→Prove`
- 回 Core 的非唯一状态：`CUT_REDUCE/REUSE/BLOCKED`、scope drift、`BUILD_BLOCKED`、Proof `FAIL/BLOCKED`、PUA recovery
- 生命周期节点活跃时，每条用户可见消息尾部带状态行：`[DevFlow: <node> -> <next> | awaiting approval / in progress]`

## 验证矩阵

- `npm test`：包校验（必需文件、精确短语断言、学习卡字段、宿主/触发/路由一致性）
- `npm run verify:all`：17 项全矩阵（test、learn、scenario、trigger、host、install、user、debt、review、spec、plan、audit、doctor、capability:verify/eval、budget、route）
- `npm run install:user -- --home <home> --write --force` 后 `--check`：用户级同步（本机六个 home：`.dsh`、`.claude`、`.codebuddy`、`.codex`、`.workbuddy`、`.zcode`，见卡片 skill-sync-after-update）
- `npm run install:target -- <project> --check`：项目级安装校验
- `node scripts/devflow-doctor.js`：六个 home 完整性快检（失败时打印具体 missing/changed 文件）

## 已确认改进点清单（2026-08-13 全量探索 + 交叉评审）

已完成（本次会话）：

- Cut 阶梯单一事实源 + `Ponytail` 术语定义（`skills/devflow-cut/*` + `scripts/validate-devflow.js` 断言）
- 生命周期状态行（`AGENTS.md` + `skills/devflow-core/SKILL.md` + `flow-self-test.md` Scenario 10）
- `scripts/devflow-doctor.js` + `doctor:verify` + 安装器清单接入

未做（分析确认，按类排序；每一项均有 file:line 证据，做前仍走 Brainstorm→Cut）：

- 体验类：PASS 输出契约按改动规模分层；首用 5 分钟路径/中文 README；DSH preset 与 skills 一步安装
- 一致性类：`plugin.json` skills 清单补全运行时 references；`spec-plan-methods.md` 薄文件合并（Method 10 孤儿编号）；METHOD/SWITCH 与 Build 任务契约的多处重复收敛；`flow-self-test.md` 编号乱序；中英混杂清理
- 架构类：跨会话状态持久化（PUA 方法历史 / learn 信号计数）；adversarial/find-fault/audit 入口同构合并；PUA 公司品牌层移除；checker 注册为 DSH 原生工具（phase-2）；状态行升级为 DSH 界面面板（phase-2）

## 关键结论（亮点与摩擦点）

- 亮点：证明门防自欺（No proof, no completion）；PUA 压力恢复（Miss 分类 + 方法切换阶梯）；Cut 量化审查标签（file:line + 替换方案 + net 行数）；learn 晋升阶梯（卡→规则→自动化）；find-fault 的 Unease 分级；框架自测（verify:all + 747 行 flow-self-test）
- 摩擦：完成一次小改动的固定 paperwork 偏重；跨会话状态零持久化；三个独立评审入口 80% 同构；一致性债见上表
- 一句话：这套框架的价值在"防自欺 + 闭环学习"；改它时不要拔掉这两颗牙，也不要为减仪式感放松强制结构（卡片 subjective-quality-structure-vs-behavior）

## 绝对优先防的误判点

1. 把分析/结论写进 `AGENTS.md` 或技能——runtime 面只放执行规则，探索结论与导航放 `docs/`
2. 改技能/命令/脚本后不同步六个用户级 home——立即漂移，靠 `--check`/doctor 才能发现
3. 绕过 Cut 直接加依赖/抽象/目录——validator 与产品第一原则双重拦截
4. 用旧输出或"应该没问题"报告完成——Prove 闸门要求新鲜命令证据
5. 把 `docs/specs/`、`docs/plans/` 里带日期的快照当长期事实——它们是历史记录，导航以本文件 + 权威源为准

## 默认执行规则（新会话）

- 开发工作先加载 `devflow-core` 技能 + `core-methods.md`，只加载选中 owner 的 reference
- 创造性工作必须过 Brainstorm 的 A/B/C；本文件中的改进点清单是排期依据，不构成授权
- 生命周期节点活跃时消息尾部带状态行（AGENTS.md 硬边界）
- 改完 skills/commands/scripts 后 overlay-sync 六个 home 并 `--check`，再报完成

## 改完后至少要回传的证据

```text
Command: <实际命令>
Result: <关键输出>
Adversarial review: <最强挑战与处置>
Judgment: PASS / FAIL / BLOCKED
```
