# Persona Copies Drift Past Anchor Assertions

- Trigger: persona 副本, senior-engineer 人设, 多宿主 agent 定义, agent.md 同步, 单一来源, anchor assertion, 字符串锚点, 副本漂移, prompt 体积, persona 预算, 至少 3 个可证伪假设, 固定步骤清单
- Lesson: 用几条字符串锚点守多份手抄 prompt，只能证明那几句还在，其余正文早可以整段分叉，漂移最后靠肉眼或用户发现。同一内容进多份文件时，要么由一份生成，要么把去掉合法差异（frontmatter、HTML 注释、宿主专属段）后的正文逐字比对；锚点只配当附加门槛。人设文件同样需要自己的体积上限：它与 `AGENTS.md` 同轮注入，而 `AGENTS.md` 有 8 KiB 硬顶、人设当时 14.6 KB 无顶，增长只能靠自觉。副本清单本身也不可信：按文件路径维护的清单会漏掉另一宿主目录下的复述（`.codebuddy/rules/`）和同目录的只读子代理，改完要再用正文短语全仓搜一遍。
- Rejected: 继续靠 grep 手工核对（上一轮就是这么"验证"的，结果 `.opencode`/`.codebuddy` 整份停在旧版）；把 `.codex` TOML 也拉进逐字比对（它是有意的压缩摘要而非副本，比对只会逼出一份夹生全文）；为"人设没有行为测试"补一个 LLM 行为用例（仓库没有模型调用回路，只会变成假绿灯），改为钉住已发生过的复述原句。
- Next action: 改任何多宿主 prompt 前不要相信文件清单，先按正文短语全仓搜出所有复述点，改完立刻同步并跑 `validate-devflow.js`；给 persona 加内容前先看离上限还剩多少字节，超了先删再加。
- Scope: project
- Related: `.github/agents/senior-engineer.agent.md`, `.opencode/agents/senior-engineer.md`, `.opencode/agents/senior-engineer-investigate.md`, `.codebuddy/agents/senior-engineer.md`, `.codebuddy/rules/senior-engineer/RULE.mdc`, `.codex/agents/senior-engineer.toml`, `scripts/validate-devflow.js`, `docs/requirements.md`
- Evidence: 2026-10-27 本轮：`git diff` 显示 `.opencode`/`.codebuddy` 正文停在六处改动之前的旧版，而当时 validator 的五条锚点断言全 PASS；改为归一化正文比对后，四条反向用例（注入维护者注释、正文 +1200 字、副本删一句、RULE.mdc 复述旧规则）各 EXIT:1 并点名文件与原因，恢复后 `npm run verify:all` EXIT:0；全仓搜"资深开发工程师"另揪出 `.codebuddy/rules/senior-engineer/RULE.mdc` 与只读子代理两处带旧规则的复述，都不在 persona 文件清单内；canonical 14136/15360 bytes。
- Evidence Level: L1
- Invalidation: Revise if persona copies are generated from a single source instead of hand-synced, or if a real model-output regression suite replaces string anchoring.
