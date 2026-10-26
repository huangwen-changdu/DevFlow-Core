# DSH Round-Based Long Task Execution

- Trigger: DSH 长任务, subagent 10 分钟限制, 子代理超时, 分轮执行, round-based, subagent 单次运行时长, 主代理汇总, fresh subagent turns are time-bounded
- Lesson: DSH 子代理单次 turn 有约 10 分钟时限（用户实测），长审查或长任务不能让一个无记忆子代理闷头跑到底。把任务切成固定小单元（一轮一个单元），每轮只审该单元并先回传该轮发现与进度，最后一轮后拼出最终报告；单轮无果（超时/截断/失败）记入 Context limitations、用更窄指令重试一次、继续剩余轮次、绝不静默丢弃。分轮是时长保护，与由谁执行无关。若确实派发子代理：子代理无会话种子才独立于主代理推理，主代理必须把审查目标与材料路径显式写进 prompt；且只写「流程描述」（run as a fresh subagent / the main agent starts a subagent）不会让模型真正调用 subagent 工具，必须写成命令式并点名工具与参数（call the subagent tool once with run_in_background: false，续轮用 send_message）。
- Rejected: not-recorded (legacy card; the rejected alternative was never captured before this field existed)
- Next action: Next time a DevFlow skill or command needs to survive a long bounded run, split it into rounds with per-round progress reports and let the final report assemble from them. Do not add subagent dispatch unless the owner skill's contract requires it: `devflow-adversarial` and `devflow-find-fault` run every round in the current session.
- Scope: project
- Related: skills/devflow-adversarial/SKILL.md, skills/devflow-find-fault/SKILL.md, commands/devflow-adversarial.toml, commands/devflow-find-fault.toml, skills/devflow-prove/references/flow-self-test.md
- Evidence: 2026-08-20 分轮改造批次：两份 SKILL.md 写入分轮协议；trigger:verify 与 capability:verify PASS；capability:eval 两条独立审查条目 PASS；打包资产 parity PASS。2026-10-19：用户要求移除独立审查技能里的子代理派发说明、保留分轮；两份 SKILL.md、两个命令模板、flow-self-test 1F/1G 与 capability-eval 断言同步改写为「技能自身执行每一轮」，`npm run verify:all` 退出码 0（capability:eval 13/13 PASS），源/Codex 插件/DSH 资产三处 md5 一致，六个用户级 home `--check` 6/6 exit 0。
- Evidence Level: L1
- Invalidation: 当审查不再需要分轮（单轮即可完整审完）时修订。
