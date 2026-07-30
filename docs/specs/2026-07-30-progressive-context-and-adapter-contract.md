# Progressive Context And Adapter Contract

## Goal

将 DevFlow-Core 的运行时上下文改为按需加载的分层契约：入口文件负责识别任务、加载正确的 owner skill，并在不支持自动 skill 加载的宿主中保留最小可执行 fallback；技能和引用文件只在其生命周期步骤被选择后加载。实现后，同一流程语义不再被复制到每个宿主入口。

## Context

当前项目已经把“薄适配层”和“渐进披露”列为原则，但运行时载荷没有完全遵守它：

- `AGENTS.md` 为 13,234 bytes，`skills/devflow-core/SKILL.md` 为 18,397 bytes，`skills/devflow-core/references/core-methods.md` 为 31,310 bytes。
- 所有工程决策都要求完整读取 `core-methods.md`，即使 Fast、Problem 或首次路由只需要共享约束与路由规则。
- `scripts/validate-host-adapters.js` 要求 Codex、Claude、Copilot、VS Code、CodeBuddy、命令和 Hook 入口重复许多相同短语。这使静态校验奖励文本复制，而非职责可达。
- Codex 和部分兼容宿主不会自动加载 skill；入口不能只留下链接，必须保留任务识别、owner 定位和无 skill 时的最小 fallback。
- `.copilot/LEARNING_INDEX.md` 已采用索引后按需读取的模式，但学习卡没有统一的来源和失效字段，旧经验可能长期参与匹配。

本 Spec 消化用户确认的 Harness 原则：规则表述为判断，示例表述为接口，长上下文按需加载，指令单一归属，记忆写入独立且受生命周期管理的载体。

## Requirements

1. `AGENTS.md` 必须成为跨宿主的最小启动契约，保留 ASCII 路由触发词、不可省略的安全和证明边界、skill 路径、fallback 行为及明确 STOP 条件；不得再次解释各 skill 的完整步骤、方法细节或跨 skill 手off 细节。
2. `AGENTS.md` 的 UTF-8 体积必须不超过 8 KiB。`CLAUDE.md`、Copilot、VS Code、CodeBuddy、Claude command 与 SessionStart 入口只保留宿主特有加载行为和到权威 owner 的链接，其余规范不重复复制。
3. `skills/devflow-core/references/core-methods.md` 必须缩为共享方法和加载地图：保留 Method 0、路由判断、共同安全约束、owner 映射及证明边界；不再要求所有任务全文读取 Method 0 至 Method 15。
4. Cut、Spec/Plan、Build、Prove/Recovery、Learn 分别拥有按需加载的方法细节。每一段方法只能有一个权威 runtime owner；其他入口和 skill 只声明何时加载该 owner，不重复同一语义。
5. `devflow-core` 必须先读取最小共享方法，再根据选中的路径加载具体方法。Fast、Problem 的事实收集阶段与首次 Design intake 不得被要求读取完整的所有生命周期方法。
6. `scripts/validate-host-adapters.js` 必须从“每个文件包含同一句”改为“每个入口满足其能力契约”。契约应在现有校验脚本中集中定义，不新增独立配置格式。每个入口至少验证：可识别的路由入口、权威 owner 的定位方式、宿主特有 fallback 或加载动作、completion 的证明出口。
7. 验证器必须保留核心行为覆盖：Problem 先证明事实，Requirement 经确认后返回 Core，Cut/Plan/Spec/Recovery 的返回 Core 合同，独立审查不进入生命周期，以及 completion 进入 Prove。行为覆盖不能依赖八个入口文本完全相同。
8. 新增的按需引用文件必须由 target installer 同步安装；安装验证必须证明新安装项目可读取全部被运行时契约引用的文件。用户级安装范围保持不变，除非其现有安装边界已经需要该引用。
9. `.copilot/LEARNING_INDEX.md` 的卡片格式必须为可复用经验增加 `Evidence` 和 `Invalidation` 字段。`devflow-learn` 只在确有复用价值时写卡，并记录可验证来源与失效条件；没有匹配卡时不得加载卡正文。
10. 不得新增运行时依赖、数据库、后台记忆服务、新的通用工作流引擎或新的宿主支持层。

## Non-goals

- 不改变 DevFlow 的唯一生命周期 owner：所有后续选择仍由 `devflow-core` 做出。
- 不降低安全、数据保护、明确用户行为、Root-Cause Check 或 Proof Before Done 的要求。
- 不为每个现有 skill 做纯文案压缩；只迁移因共享方法或宿主入口复制而产生的运行时载荷。
- 不把学习卡变成会话日志、自动摘要仓库或业务知识库。
- 不实现外部模型 token、延迟、成本或真实 IDE 宿主加载的基准评测。

## Approach

比较的方案：

1. 保持现状。优点是零改动；缺点是所有工程任务继续完整读取 31 KiB 方法库，且适配器文本会随规则增长而漂移，不能满足目标。
2. 只压缩每个入口的措辞。优点是改动局部；缺点是没有明确 owner，校验器仍会迫使同一语义散落复制，无法保证无自动 skill 加载宿主的 fallback。
3. 采用能力感知的三层契约。第一层是每个宿主的最小启动接口；第二层是 `devflow-core` 的共享路由和加载地图；第三层是被选择的 lifecycle skill 及其局部引用。优点是保留兼容宿主的可执行性，同时将长内容移到真正需要它的步骤；缺点是需要一次性同步入口、skill、installer 与验证器。

选择方案 3，因为当前已有八个入口和多个安装面，集中契约已经有现实复用需求，而不是未来抽象。

设计边界：

```text
用户请求
  -> 宿主启动接口：识别信号，定位 devflow-core，提供 fallback
  -> devflow-core：共享路由和加载地图
  -> 已选择 owner skill：加载本步骤方法引用，产生其返回产物
  -> devflow-core：消费返回产物，选择下一步
```

实现分为四个可验证切片：

1. 将 `core-methods.md` 收敛为共享内核和加载地图；把 Cut、Spec/Plan、Build、Prove/Recovery、Learn 的细节移至各自 skill 的局部 references。各 skill 只在被选择后加载其局部 reference。
2. 以紧凑路由表和 owner 链接重写 `AGENTS.md` 及宿主适配器。Codex/shared fallback 保留必要路由与证明规则；支持 skill 的宿主优先加载 skill，而不是复制 skill 内容。
3. 以 `validate-host-adapters.js` 内的能力契约替换逐入口短语清单，并在 `validate-devflow.js` 中加入入口载荷上限与“禁止完整方法强制读取”的回归断言。
4. 扩展 learning-card 格式、学习验证和 target installer 文件清单，使新引用和有失效条件的卡片在安装后仍可用。

## Impact

- `AGENTS.md`、`CLAUDE.md`、`.github/copilot-instructions.md`、`.github/instructions/devflow.instructions.md`、`.github/prompts/devflow.prompt.md`、`.codebuddy/rules/devflow-core/RULE.mdc`、`.claude/commands/devflow-core.md`、`hooks/devflow-session-start.js`：收敛为宿主启动接口。
- `skills/devflow-core/SKILL.md`、`skills/devflow-core/references/core-methods.md`：定义共享加载地图与 owner 路由。
- `skills/devflow-cut/`、`skills/devflow-spec/`、`skills/devflow-plan/`、`skills/devflow-build/`、`skills/devflow-prove/`、`skills/devflow-pua/`、`skills/devflow-learn/`：接管与各自生命周期匹配的方法细节，必要时新增局部 reference。
- `.copilot/LEARNING_INDEX.md`、`.copilot/cards/*.md`、`skills/devflow-learn/SKILL.md`：增加经验来源和失效边界。
- `scripts/validate-host-adapters.js`、`scripts/validate-devflow.js`、`scripts/validate-skill-triggers.js`、`scripts/validate-learning-loop.js`：改为验证能力契约、加载归属、载荷上限和记忆卡 schema。
- `scripts/install-devflow.js`、`scripts/validate-installer.js`、`plugin.json`：确保新增 runtime reference 对 target 安装可达并与发布清单一致。
- `README.md`、`docs/platform-setup.md`、`skills/devflow-core/references/project-structure.md`：说明分层加载与宿主 fallback，不复制完整规则。

## Acceptance

1. `AGENTS.md` 小于等于 8 KiB，且 `scripts/validate-devflow.js` 以实际 UTF-8 bytes 验证该上限。
2. 每个宿主入口能从输入信号定位到 `devflow-core` 或明确的直接 owner；无自动 skill 加载宿主仍包含最小 fallback；宿主入口不再承担完整生命周期叙述。
3. `core-methods.md` 不再包含所有 lifecycle 步骤的详细执行规则，也不存在“每个工程决策必须全文读取 Method 0 至 Method 15”这一要求。
4. 每个详细方法在一个 lifecycle owner 或其局部 reference 中有唯一权威定义，跨入口只允许短链接和调用条件；静态验证能发现关键责任回流从 owner 中丢失。
5. `npm run trigger:verify`、`npm run host:verify` 和 `npm test` 继续覆盖现有路由、Core 回流、独立审查与 Proof 行为，但不要求同一流程句子出现在所有适配器中。
6. target installer 安装到空项目后，新方法引用全部存在，并且 `npm run install:verify` 通过。
7. 现有学习卡升级后均具备 `Evidence` 和 `Invalidation`；`npm run learn:verify` 同时覆盖缺字段拒绝、索引匹配读取和无匹配不加载正文。
8. `npm run verify:all`、`git diff --check` 通过；验证报告将任何缺失 owner、缺失引用、过大入口或失去 fallback 标为 FAIL。

## Verification

1. `node scripts/devflow-spec.js docs/specs/2026-07-30-progressive-context-and-adapter-contract.md`
2. `npm test`
3. `npm run trigger:verify`
4. `npm run host:verify`
5. `npm run learn:verify`
6. `npm run install:verify`
7. `npm run user:verify`
8. `npm run verify:all`
9. `git diff --check`

## Code Documentation

- 新增或实质修改的 Node 校验函数必须有函数级注释，说明其保护的契约及其失败条件。
- 仅当 capability contract 把宿主 fallback、自动加载或直接 owner 区分开时，添加简短行内注释解释该差异。
- Markdown 入口、skill 与 reference 用清晰标题、路由表、owner 链接和输出契约表达职责；不添加重复性的文件级说明。

## Open Questions

None.
