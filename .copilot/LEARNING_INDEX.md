# Learning Index

Read this index first. Only read a card when its trigger and scope match the current task. Evidence and invalidation remain in the selected card body so the index stays small.

| Card | Trigger | Scope | Confidence |
|---|---|---|---:|
| [DevFlow Runtime References](cards/devflow-runtime-references.md) | DevFlow-Core structure, skill framework layout, docs vs references, runtime method source, generated plan docs, Codex onboarding, install file map, target runtime files, user-level runtime files, project-knowledge skill, published skill manifest, script execution model, hooks, global config vs project runtime, project-only AGENTS and CLAUDE | project | 0.8 |
| [Constraint Rule Calibration](cards/constraint-rule-calibration.md) | hard rule, absolute prohibition, Do not, Never, Always, mandatory comment, code-review gate, duplicated lifecycle boundary, rule calibration | project | 0.4 |
| [Skill Description Trigger Surface](cards/skill-description-trigger-surface.md) | skill description, SKILL.md frontmatter, trigger wording, brand text in description, DevFlow-Core in description | project | 0.5 |
| [Skill Sync After Update](cards/skill-sync-after-update.md) | skills updated, commands updated, runtime scripts updated, SKILL.md changed, update complete, sync latest skills, user-level skills directories, .claude skills, .codebuddy skills, .codex skills, .workbuddy skills | project | 0.5 |
| [Global AGENTS Sync Preservation](cards/global-agents-sync-preservation.md) | sync AGENTS, user-level AGENTS, .codex AGENTS, restore global blocks, CodeGraph, Graphify | project | 0.5 |
| [Rule Documentation Merge Sync](cards/rule-doc-merge-sync.md) | sync rules, update rule documents, rules synchronization, 规则同步, 规则文件同步, 合并更新 | project | 0.5 |
| [Reference Project Absorption Proof](cards/reference-project-absorption-proof.md) | reference project, Ponytail, agent-skills, superpowers, pua, skill migration, adapt a skill to DevFlow, absorbed capability, actual usage, not just mentioned | project | 0.8 |
| [AGENTS Runtime Prompt Boundary](cards/agents-runtime-prompt-boundary.md) | AGENTS.md, runtime prompt, prompt file, unrelated explanation, README-like content, long method details, wrong place, misplaced content, repeated correction | project | 0.7 |
| [Problem Reports Need Triage](cards/problem-reports-need-triage.md) | 问题, 有问题, 检查一下, 哪里不对, investigate issue, problem report without fix request | project | 0.6 |
| [PUA Same-Target Trigger](cards/pua-same-target-trigger.md) | devflow-pua, PUA trigger, Recovery trigger, same function, same result, repeated dissatisfaction, repeated target, 首次反馈, 同一功能, 重复指出 | project | 0.5 |
| [Checker Contract And Route Surface Design](cards/checker-contract-route-surface.md) | checker 脚本改动, --json 输出, Status 字段, budget 阈值, 路由一致性校验, 校验表面, devflow-plan/spec/review/debt/audit/budget/route 校验器 | project | 0.5 |
| [Subjective Quality Structure vs Behavior](cards/subjective-quality-structure-vs-behavior.md) | 不够灵动, 不好用, 感觉差点, 太死板, subjective quality, skill feels rigid, optional format, fast lane tier, 用户确认处方 | project | 0.4 |
| [DSH Dynamic Tool defineTool Contract](cards/dsh-definetool-contract.md) | defineTool, output.schema, value schema DSL, 动态插件工具, harness.defineTool 失败 | project | 0.5 |
| [Vague Visual Feedback Ask Intent](cards/vague-visual-feedback-ask-intent.md) | 位置有歪, 看着别扭, 视觉反馈, UI 布局修正, 反复改布局, 模糊视觉诉求 | project | 0.5 |
| [Preset UI Boundary](cards/preset-ui-boundary.md) | 给 preset 加 UI, 固化插件, 常驻看板, agent preset 界面, 动态插件刷新后消失 | project | 0.6 |
| [DSH Round-Based Long Task Execution](cards/dsh-round-based-long-task.md) | DSH 长任务, subagent 10 分钟限制, 子代理超时, 分轮执行, round-based, 主代理汇总 | project | 0.5 |
| [DSH Plugin Preset Distribution](cards/dsh-plugin-preset-distribution.md) | DSH 插件分发 agent preset, dsh plugin add, bundle patch, preset 同步, 插件打包 skills, 模拟插件 apply, 测试同步函数, 客户端插件打包, 纯 client 插件 bundle 挂载, quick-cmds | project | 0.5 |
| [DSH Preset 派生与挂载校验闭环](cards/dsh-preset-derive-mount-validate.md) | 新建/派生 DSH agent preset, agentPresets.standingKeyFor, preset 挂载校验, loop-engine, preset 从已有基底拷贝 | project | 0.4 |
| [PowerShell UTF-8 显示乱码不等于文件损坏](cards/pwsh-utf8-display-mojibake.md) | pwsh Get-Content 中文乱码, PowerShell 显示乱码, UTF-8 文件校验, 哈希对比文件, CJK 文件内容检查 | global | 0.4 |
| [DSH Loop Preset 入口行为迭代教训](cards/dsh-preset-loop-entry-iterations.md) | loop-engine preset 行为不符合预期, 晋升后不草拟定义, 首问被裸答, 会话就停了, 改 preset 后重启修改丢失, phase1Persona 挂载失败, 双源链 | project | 0.7 |
