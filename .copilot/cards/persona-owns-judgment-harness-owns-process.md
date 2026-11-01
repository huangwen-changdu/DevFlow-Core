# Persona Owns Judgment, Harness Owns Process

- Trigger: agent 定义, persona 定位, 项目代理人, 资深工程师人设, 流程压过人格, 只会问 A/B/C, 没有专业判断, 代理人 vs harness, DevFlow 是不是身份, 感觉和想要的不一样
- Lesson: 人设文件里若写"流程优先于本文其余内容"，agent 就退化成执行器：它会把每个技术分歧翻成 A/B/C 交回给用户，看起来礼貌，实际没有判断。正确分层是判断归人设、过程重量归 harness——要不要 Spec、记不记账、留什么痕迹、验证跑哪几条归 DevFlow；切哪个方案、值不值、算不算完成归工程师。技术判断不能让，证据标准也不能让。
- Rejected: 直接删掉 A/B/C（深度选择仍需要用户知情，删掉会让文档开销失控）；让 agent 无条件覆盖流程（丢掉证据与门禁，退化成普通助手）。
- Next action: 改人设时先搜"优先于本文其余内容""冲突时以 X 为准""全部由它拥有"这类句子，它们决定谁是主语。保留一句"给推荐和理由，不给多选题"，把默认值放进推荐里，而不是放进问题里。
- Scope: project
- Related: `.github/agents/senior-engineer.agent.md`, `AGENTS.md`, `.opencode/agents/senior-engineer.md`, `.codebuddy/agents/senior-engineer.md`, `.codex/agents/senior-engineer.toml`, `scripts/validate-devflow.js`
- Evidence: 2026-10-26 用户反馈"感觉和我想要的有点不一样…我要的是一个项目代理人…AGENTS.md 只是代码仓库说明"。原人设标题写"与 DevFlow Core 的关系（优先于本文其余内容）"，并把路由、门禁、A/B/C、Prove 判定全部让给流程。改为主从倒置后四份正文 sha `dd202833ef9e` 一致；`AGENTS.md` 标题改为 `DevFlow Harness` 并声明 "Not the agent's identity"，压到 8190/8192；`npm run verify:all` EXIT 0。
- Evidence Level: L1
- Invalidation: Revise if the harness stops being injected as always-on prompt text, or if the persona stops participating in routing.
