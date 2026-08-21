# DSH Loop Preset 入口行为迭代教训

- Trigger: loop-engine preset 行为不符合预期、晋升后不草拟定义、首问被裸答、会话「就停了」、改 preset 时重启后修改丢失、phase1Persona 挂载失败
- Lesson: 三轮用户实测暴露四层问题与对应解：(1) **触发面窄**——协议触发写「收到循环定义才启用」，用户发自然语言问题被模型合法跳过；解法 = persona 宽触发（任何「要求干活」的消息）+ 单动作（加载 skill）+ skill 内分流，触发面覆盖需求/问题/疑问。(2) **晋升回合边界**——promoteAfterFirstResponse 的纯文本首响应在回合结束才晋升，晋升后处理原问题要第二轮消息，用户看到「就停了」；解法 = `phase1FirstCallInstruction`（bootstrap opt-in）让 phase-1 先调一条无害命令保回合，锚定后同回合内晋升。(3) **YAML 冒号坑**——phase1Persona 等 plain scalar 值含「冒号+空格」被解析成 mapping 键，standingKeyFor 报 bad indentation；值必须引号包裹。(4) **双源链**——权威源（dsh/agent-presets/<id>/ 6 文件 + 仓库根 skills/<name>/）→ 插件镜像（dsh/plugins/dsh-loop-engine/assets/，sync-assets.js 单向拷贝）→ 运行时（~/.dsh 两处，插件启动权威覆盖）；改 preset 必须三步全同步，否则重启插件回退修改。协作纪律：文件被外部修改/移动时先查源链归属（插件 assets、全局 skills 根、运行时），对齐后再动，不静默覆盖。
- Next action: Next time 改 loop-engine（或任何插件分发的 DSH preset），first 确认权威源位置（dsh/agent-presets/<id>/ + 仓库根 skills/）并跑 sync-assets + 同步运行时 + standingKeyFor；Next time 设计协议入口，first 用「宽触发 + 单动作 load skill」而非窄触发多条款；Next time 改 bootstrap 相关配置，first 记住 phase1FirstCallInstruction 保回合、引号包 plain scalar 值；do not 在未确认外部修改归属时覆盖文件。
- Scope: project
- Related: dsh/agent-presets/loop-engine/、skills/loop-engineering/SKILL.md、dsh/plugins/dsh-loop-engine/（assets + scripts/sync-assets.js + lib/sync.js）、.copilot/cards/dsh-preset-derive-mount-validate.md
- Evidence: 三次用户实测失败→修复闭环：首问裸答（触发面窄）→ 调查不草拟（多段软规则失效）→ 「就停了」（回合边界，phase1FirstCallInstruction 修复后用户确认三步全对）；standingKeyFor 抓出 phase1Persona YAML 冒号错误；双源哈希一致性验证（权威源/插件镜像/运行时三处 True）；四件套行为验收：分级自判（预算 10 单函数任务判小、免路线图，依据入状态文件）、对抗轮（-0/NaN/断言覆盖/副作用/过期文档五查）、失败卡四要素落盘、开头扫卡召回、定义内自决（顺修 subtract）与定义外停下（TASK.md 不擅改）全部按协议运转；路线图/子目标链路径未触发（需真正多步骤任务验证）
- Invalidation: bootstrap 升级改变晋升机制或 phase1FirstCallInstruction 语义、dsh-loop-engine 插件同步策略改变后本卡过时
