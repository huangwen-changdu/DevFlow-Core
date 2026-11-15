# Output Reasoning, Not Process

- Trigger: 用户说输出只有流程和改动、看不到"你想了什么/做了什么"；要求把不确定的点、不知道的点、用户语义说错和记错的点讲出来让用户补；skill 只给结论不给依据；"简化的路径"投诉；output only shows process and diff, no evidence, hide the reasoning.
- Lesson: 只要规则允许"读到了就不用问"，执行侧最省力的读法就是"不提问，也不亮出来"，用户看到的就是流程和结论。修法不是加流程，而是把证据变成强制输出的一部分：承载判断的事实带 `path:line` 或命令，推断单独标注并带依据，未知写成让用户填的具体请求，用户术语或前提与仓库事实冲突时当面说破并让用户裁决——不静默采纳，也不静默覆盖。限幅用"哪些读取改变了需求、哪些读空了但影响了判断"，避免退化成逐条工具旁白。
- Rejected: 单独加一个"工作汇报"段落（会变成流程综述，仍然不给依据）；放开 Echo-Back 字段按需填写（2026-07-30 已验证：可选格式等于行为删除）；在 SKILL.md 里写全量规则（预算只剩 2 字节，细则应进 references）。
- Next action: 下次把"看不到思考"类反馈落到 skill 输出契约时，先找那条允许沉默的规则（例如"已读到就不用问"），把依据写进强制消息的字段，格式用 `<来源> → <读到了什么>`；验收按默认行为测：给一个用户记错前提的需求，检查 Echo-Back 是否点名冲突并请用户裁决，而不是默默按错前提开工。
- Scope: project
- Related: `skills/devflow-brainstorm/SKILL.md`, `skills/devflow-brainstorm/references/interview-discipline.md`, `scripts/validate-devflow.js`, `scripts/capability-eval-scenarios.json`
- Evidence: 2026-11-15 用户反馈 devflow-brainstorm"有很多角度，但输出只代表流程和改动"，要求把做了什么、不确认的、不知道的、语义不对的和记错的都讲给用户。Echo-Back 增加 `What I read` / `Where your terms or facts seem off` / `What I infer` / `What I do not know` 四字段，reference 新增 `## Visible Reasoning`；`validate-devflow.js` 新增 `assertBrainstormReasoningContract`，反向删 `Where your terms or facts seem off` 得 EXIT 1 并点名，恢复后 PASS；`npm run verify:all` EXIT 0（19 项全过）；brainstorm SKILL 15351/15360。
- Evidence Level: L1
- Invalidation: 若宿主能对结论做独立事实核查（自动比对来源行），字段式证据可降级；或预算门禁开始扫描 references，"细则进 references"的策略需重算。
