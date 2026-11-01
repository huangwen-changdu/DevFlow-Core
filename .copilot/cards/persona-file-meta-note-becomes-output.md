# Persona File Meta Notes Become Output

- Trigger: agent 定义文件, persona 文件, agent.md 调整, 回答像在念文件, 复述文件内容, 人物总结回答, 自报身份, 输出契约归属, senior-engineer 人设, 人格文件里写说明, 第一句不是答案
- Lesson: agent 定义文件的每一句都会被当作"要说的话"执行，而不是"读的话"。写给维护者的说明——单一来源声明、本文不复制该契约、改那份别改这份、某段归谁拥有——一旦写进正文，模型会把它复述进回答，或把它当成输出格式要求。标题叫「输出」的段落位于文件末尾时风险最高：既有最近读写优势，又直接命中"输出"这个词。
- Rejected: 保留 `## 输出` 段只压缩措辞（仍是否定+陈述句，仍会被念）；把说明挪进 frontmatter `description`（description 是运行时常量且会被当成能力介绍，"人物总结"症状会更重）。
- Next action: 改 persona 文件后逐句问"这句是给 agent 执行的，还是给我自己看的"。给维护者看的内容写进 HTML 注释或 requirements/README；指向其他契约时用祈使句（"按 X 执行"），不用陈述句（"X 归 Y 所有"）。同时在开头写死"第一句即答案、不交代身份、不总结本文件"，压住开场立人设的惯性。
- Scope: project
- Related: `.github/agents/senior-engineer.agent.md`, `.opencode/agents/senior-engineer.md`, `.opencode/agents/senior-engineer-investigate.md`, `.codebuddy/agents/senior-engineer.md`, `.codex/agents/senior-engineer.toml`, `scripts/validate-devflow.js`, `.copilot/cards/agents-runtime-prompt-boundary.md`
- Evidence: 2026-10-26 用户反馈 agent 回答出现「输出契约归 DevFlow Core 所有」原句并接人物总结（设计源自同日 persona 去重行，把复制契约换成了指向指针）。移除末尾 `## 输出` 段后六份 persona 文件该短语计数 0；`npm test` PASS；`validate-devflow.js` 的 "must point at the AGENTS.md Output Contracts" 断言仍通过，因为指针改为祈使句保留在权威条款内。
- Evidence Level: L1
- Invalidation: Revise if persona files stop being loaded verbatim as runtime prompts, or if the validator drops the Output Contracts pointer assertion.
