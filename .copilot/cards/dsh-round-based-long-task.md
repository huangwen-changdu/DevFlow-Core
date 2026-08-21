# DSH Round-Based Long Task Execution

- Trigger: DSH 长任务, subagent 10 分钟限制, 子代理超时, 分轮执行, round-based, subagent 单次运行时长, 主代理汇总, fresh subagent turns are time-bounded
- Lesson: DSH 子代理单次 turn 有约 10 分钟时限（用户实测），长审查或长任务不能让一个无记忆子代理闷头跑到底。把任务切成固定小单元（一轮一个单元），子代理每轮只审该单元并回传发现，主代理逐轮汇总并汇报进度，最后一轮后拼出最终报告；单轮无果（超时/截断/失败）记入 Context limitations、用更窄指令重试一次、继续剩余轮次、绝不静默丢弃。子代理保持无会话种子以保证独立于主代理推理，主代理必须把审查目标与材料路径显式传给子代理（子代理看不到主对话）。关键坑：只写「流程描述」（run as a fresh subagent / the main agent starts a subagent）不会让模型真正调用 subagent 工具——主代理会默认自己直接读文件审查。必须写成命令式并点名工具与参数（call the subagent tool once with run_in_background: false，续轮用 send_message），并要求子代理 prompt 里写明目标与材料路径、读材料后返回有证据的发现。
- Next action: Next time a DevFlow skill or command delegates long work to a DSH subagent, write bounded rounds with per-round reports instead of one silent pass; keep each round under the turn cap and let the main agent aggregate. Write the dispatch as an imperative naming the tool and args (call the subagent tool / send_message), plus an explicit do-not-review-in-your-own-context line, never as a passive workflow description.
- Scope: project
- Related: skills/devflow-adversarial/SKILL.md, skills/devflow-find-fault/SKILL.md, commands/devflow-adversarial.toml, commands/devflow-find-fault.toml
- Evidence: 2026-08-20 分轮改造批次：两份 SKILL.md 写入分轮协议；trigger:verify 与 capability:verify PASS；capability:eval 两条独立审查条目 PASS；打包资产 parity PASS。
- Invalidation: 当 DSH 子代理时限解除、或执行模型改为不依赖子代理时修订。
