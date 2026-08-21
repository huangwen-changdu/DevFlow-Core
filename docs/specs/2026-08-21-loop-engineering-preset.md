# 循环工程（Loop Engineering）Agent Preset 设计契约

## Goal

打造一个新的 DSH agent preset「loop-engine（循环工程）」：工作方式从「人写提示词」变为「人写循环」——用户写一份循环定义（目标、停止条件、轮次预算、产出物），DSH 会话自循环自动多轮推进，agent 每轮自行决定下一步该干什么。persona 通用、不绑定编码领域，内置编码场景循环模板；沿用 devflow-2 的两阶段锚定机制（首请求 Minimal 锚定，晋升后恢复完整循环 persona）。交付标准：preset 可挂载、选择器可选，且用一个真实小任务实跑循环、按停止条件收尾。

## Context

- 概念背景：「我不再给 Claude 写提示词了，是循环在跑，是它们在提示 Claude、自己琢磨该干什么。我的工作就是写循环。」该说法随后被 OpenClaw 作者 Peter Steinberger 与 Google 资深工程主管 Addy Osmani 呼应，定名为「循环工程」（Loop Engineering）。本质：把人的工作从逐条写提示词，上移到定义外层循环——循环决定下一步提示什么。
- 已确认需求（Brainstorm 产出）：载体 = 会话自循环（排除外部 CLI 代码循环与编排扇出）；工作域 = 通用 + 内置编码模板；验收 = 交付 + 当场端到端跑通真实示例循环。
- 设计审阅反馈：用户明确要求以 devflow-2 两阶段锚定为基底——首个模型请求只暴露 Minimal 锚定（一行 persona + 最小工具对，无运行时上下文注入），锚定门控通过后晋升，persona 恢复为循环工程 persona（替代 devflow-2 的 DevFlow persona）。
- DSH 事实：用户预设落于 ~/.dsh/.agent-presets/ 下同名目录，含 preset.yml 显示元数据与 agent.cordis.yml 组合；挂载校验入口为 agentPresets.standingKeyFor；devflow-2 即 shipped standard 的行级派生 + 两阶段 bootstrap（tool-bootstrap.mjs，锚定门控；Windows 下 custom-bash.mjs 提供 bash 工具），本机已挂载可用，可作基底直接拷贝派生；skill 目录可由 preset 自带并被 skill-filesystem 行发现。
- 仓库先例：dsh/agent-presets/devflow-2/ 源文件在仓库、手动拷贝至 ~/.dsh 安装；本 spec 落于仓库惯例路径 docs/specs/。
- 本机现状：已有 anchored-standard、liangshen、devflow-2 三个预设并列于选择器，新预设需在定位上区分。

## Requirements

- R1 两阶段锚定：首个模型请求只暴露一行 Minimal persona 与最小工具对（bash + str_replace_editor），不注入运行时上下文与自动消息；锚定门控（首块锚定判定 / 四步兜底 / 首响应放行）通过后晋升——persona 恢复为循环工程 persona、完整标准工具面恢复、循环 skill 与工作区指令延迟一步注入。
- R2 循环定义格式：目标（一句可验证的结果描述）、停止条件（客观可检查）、轮次预算（正整数上限）、产出物（状态文件与日志路径）、检查点（可选：每 N 轮暂停确认，缺省全自动）。停止条件或预算缺失时拒绝启动并提示补齐。
- R3 每轮纪律：读状态 → 决定下一步 → 小步执行 → 记录推进（状态文件 + 待办列表）→ 对照停止条件自检 → 未达成且未超预算则继续下一轮。
- R4 状态持久化：循环状态写工作区文件（loop/loop-state.md 与 loop/loop.log），跨轮次、跨上下文压缩可恢复；人可随时打断、修改循环定义后续跑。
- R5 空转保护：连续轮次无实质推进（无可验证产出）判定 blocked 并上报，不允许无限消耗额度；预算耗尽时输出未达成报告。
- R6 通用 persona：不以编码为前提，任何可分解目标可用；内置模板至少覆盖「修 bug 到测试绿」「实现功能到测试绿」「通用任务」三类。
- R7 组合与元数据：以 devflow-2 为基底保留两阶段锚定与完整标准工具面；晋升后 persona 文本为循环工程 persona；preset.yml 提供选择器名称与描述；循环协议 skill 与模板随 preset 目录自包含；沿用 devflow-2 的 MIT NOTICE 声明。
- R8 收尾报告：循环结束（达成 / 预算耗尽 / blocked）时输出结果摘要与证据路径。

## Non-goals

- 不做脱离会话的外部循环代码或无头循环。
- 不新建宿主级引擎、工具插件或服务（完全复用 goal/todo_write/subagent 等现有原语；bootstrap 为 devflow-2 既有代码的沿用，非新能力）。
- 不做多子代理编排扇出专用化（workflow/herdr 特殊协议）。
- 不把 preset 纳入 dsh-devflow 插件资产同步与发布流程（仅仓库源 + 本机安装）。
- 不修改现有预设（anchored-standard/liangshen/devflow-2）与宿主组合。

## Approach

- 选项 1（选定）「devflow-2 两阶段锚定基底 + 循环 persona + 内置 skill」：以 devflow-2 为基底派生——保留两阶段 bootstrap（tool-bootstrap.mjs、Windows custom-bash.mjs、MIT NOTICE）与完整标准工具面，phase1Persona 保持 Minimal 不变，晋升后 persona 文本替换为循环工程 persona；循环协议与模板放入 preset 自带 skill 目录，随 skill-catalog 延迟一步注入；状态与门控复用 goal/todo_write/ask_user/jobs 原语。
  - 理由：用户明确要求两阶段锚定基底，与本机 anchored-standard / liangshen / devflow-2 的既有纪律一致（首请求干净锚定，再进入循环工作）；devflow-2 已在本机证明该派生路径可挂载可用；改动面 = persona 文本 + 新增 skill 文件，bootstrap 代码零改动。
- 选项 2（拒绝）「纯 standard 基底（无锚定）」：首请求即携带完整 persona 与上下文注入，与本机锚定纪律相悖；用户已明确不选。
- 选项 3（拒绝）「自定义循环工具插件」：goal/todo_write/ask_user 已覆盖状态、门控、打断；新插件引入 realm 规则与维护成本，当前无必要。
- 边界：persona 只承载纪律入口（何时读 skill、循环必须遵守协议）；协议细节全部在 skill；不注册任何服务、不新增 isolate realm（沿 devflow-2 既有行）；demo 任务置于工作区 demo/ 目录，轮次预算上限 8 轮。
- 取舍说明：两阶段锚定增加了 bootstrap 复杂度与阶段门控故障面，换来首请求推理轨迹稳定（本机既有实验已验证收益）；循环纪律的遵从度依赖晋升后 persona + skill 双层引导，「agent 真会自行决定下一步」是本设计要实证的核心假设，由 demo 验证。

## Impact

- 新增：仓库源 dsh/agent-presets/loop-engine/（组合、元数据、README、bootstrap 插件、NOTICE、skill 与模板）；运行时 ~/.dsh/.agent-presets/ 下同名目录；工作区 demo/ 目录与循环状态文件。
- 选择器多一项；宿主、现有预设与插件不受影响。
- API 成本：demo 一次循环，预算上限 8 轮（另加锚定阶段 1 步）。
- 定位区分：anchored（锚定）管「怎么开始」，loop-engine（循环）管「怎么持续推进」；loop-engine 同时继承了锚定开场。

## Acceptance

- 挂载校验通过：standingKeyFor(loop-engine) 正常返回。
- 选择器可见且名称/描述正确。
- 用户新建会话选 loop-engine：首请求呈现 Minimal 锚定（一行 persona + 最小工具对），锚定后晋升为循环工程 persona、标准工具面恢复。
- 晋升后输入 demo 循环定义：循环自主多轮推进（无需人工逐轮提示），状态文件记录每轮决策与推进，达到停止条件（测试全绿）或预算上限，输出收尾报告。
- 状态/日志文件可作为 Prove 的新鲜证据。

## Verification

- 组合校验：临时探针插件调用 standingKeyFor(loop-engine)；失败信息逐条修复。
- 行级检查：对照组合编辑规则（plane/realm）检查 agent.cordis.yml 每个改动行。
- 两阶段行为核验：demo 会话首响应为 Minimal 锚定、晋升后工具面与 persona 恢复（用户反馈 + 会话可见行为）。
- demo 实测：晋升后输入内置模板 + 小任务（预算不超 8 轮），读工作区状态文件核验轮次推进与收尾。
- 静态检查：node scripts/devflow-spec.js docs/specs/2026-08-21-loop-engineering-preset.md，后续 plan 用对应检查器。

## Code Documentation

- dsh/agent-presets/loop-engine/agent.cordis.yml：文件头注释说明基底来源（devflow-2 派生）、bootstrap 行必须保持首行的原因、保留 goal/todo_write/ask_user/jobs 行的理由、不新增 realm 的原因。
- preset 自带 skill 的 SKILL.md 即循环协议文档；模板文件自带字段说明与示例。
- preset.yml description 面向选择器用户说明定位（锚定开场 + 循环推进）。
- README.md：安装（拷贝到 ~/.dsh）、使用（新会话选 preset，锚定后输入循环定义）、caveats（升级后重拷、demo 成本、Windows bash 路径）。
- NOTICE：沿用 devflow-2 的 MIT 来源声明（bootstrap 代码来自 dsh-anchored-standard / dsh-liangshen 派生链）。

## Open Questions

- 检查点默认策略：默认全自动（随时可打断）+ 可选「每 N 轮确认」参数；demo 跑通后定默认值。
- persona 与 skill 语言：中文为主、关键术语保留英文（loop / stop condition / budget）对照；demo 后视模型表现调整。
- 其余无阻塞性问题。
