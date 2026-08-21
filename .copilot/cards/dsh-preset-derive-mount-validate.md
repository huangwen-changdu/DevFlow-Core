# DSH Preset 派生与挂载校验闭环

- Trigger: 新建/派生 DSH agent preset、agentPresets.standingKeyFor、preset 挂载校验、loop-engine、preset 从已有基底拷贝
- Lesson: 新 preset 从现有基底派生（拷贝 agent.cordis.yml + 换 persona + 自带 skill 目录，bootstrap 行保持首行）后，组合级验证 = 临时动态插件（`inject: ['agentPresets']` + `harness.defineTool` 注册一个执行 `ctx.agentPresets.standingKeyFor('<id>')` 的工具）→ `cordis_define`/`cordis_run` → 调用工具读 'mounted OK' → `cordis_undefine` 清理。standingKeyFor 是真实组合挂载（非静态检查），能抓 YAML 解析、行未激活、服务注册到根 realm 等四类失败。挂载 OK 只证明组合可挂载；persona/协议行为必须靠真实新会话 demo 端到端验证（demo 状态文件如 loop/loop-state.md 是 Prove 的可读证据）。运行时安装用 Copy-Item 后必须做哈希对比确认字节一致。
- Next action: Next time 创建或派生 DSH preset，first 走「拷贝基底 → 换 persona/skill → 临时 probe 插件 standingKeyFor → 真实会话 demo」，do not 只用静态检查或文件存在性代替挂载校验，也不要跳过端到端 demo 就声称 preset 可用。
- Scope: project
- Related: dsh/agent-presets/loop-engine/、docs/specs/2026-08-21-loop-engineering-preset.md、docs/plans/2026-08-21-loop-engineering-preset.md
- Evidence: probe-1 动态插件实测 standingKeyFor('loop-engine') 返回 mounted OK；demo 新会话实跑 1 轮达成停止条件，loop/loop-state.md 与 node demo/test.js 退出码 0 独立复核一致；运行时 10 文件哈希与仓库源一致
- Invalidation: DSH 改变 preset 挂载校验机制或 agentPresets 服务契约后本卡过时
