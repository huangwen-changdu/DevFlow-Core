# Plan Checker Syntax Before Writing

- Trigger: 写 Plan Pack, devflow-plan checker, 计划校验 FAIL, unresolved placeholder, missing file symbol/anchor, Verify needs command/scenario, executable intent verb, 尖括号占位符, plan:verify, Judgment FAIL 计划
- Lesson: `scripts/devflow-plan.js` 的 v2 校验是**字面正则**，不是语义判断，四条硬约束会连着挂：(1) `unresolvedPatterns` 含 `/<[^>\n]+>/`，所以任何尖括号——包括 `<pending|name>`、`<cap>`、`<n>` 这种纯格式说明——都被判成未解析占位符；(2) 文件锚点必须匹配 `locationPattern`：纯反引号内容且 ≥3 字符，或 `keyword name`，或 markdown 标题；反引号后面再跟一句中文就不匹配；(3) `Change` 必须含 `implementationVerbPattern` 里的动词（parse/validate/add/remove/replace/insert/set/check/compare/append/emit，或 增加/添加/解析/验证/拒绝/替换/输出/收集/要求/检查）；(4) `Verify` 要同时匹配命令模式（反引号或 node/npm/git）与期望词（expect/expected/passes/pass/fails/fail/returns/result），而 `passed` 因词边界不满足 `\bpass\b`。
- Rejected: 「按 `SKILL.md` 的字段描述写就够」被否——SKILL 只说 checker 校验结构，不给正则，两轮 FAIL 证明抽象描述躲不开字面规则；「先手写一个样本再看报错」也被否，四条规则互不相关，猜中一条不代表全过，而每轮返工都是一次真实提交延迟。
- Next action: Next time 写 v2 Plan Pack，first 打开 `scripts/devflow-plan.js` 读 `unresolvedPatterns`、`locationPattern`、`implementationVerbPattern`、`verificationCommandPattern` 四条正则，按它们把字段写对，再跑 `node scripts/devflow-plan.js <文件>`；do not 写完等被拒，也不要指望「描述得更清楚」能过字面校验。
- Scope: project
- Related: `scripts/devflow-plan.js`, `docs/plans/2026-10-25-read-budget-and-load-visibility.md`, `skills/devflow-plan/SKILL.md`
- Evidence: 2026-10-25 read-budget 计划两轮 FAIL：首轮报 `Task 1: unresolved <pending|name>`（格式说明里的尖括号）与 `Task 2/3/4: missing file symbol/anchor`（锚点后跟中文说明）以及 `Task 3: Change needs an executable intent verb`；修完再跑报 `Task 3: Verify needs command/scenario and expected result`，根因是 `passed` 不满足词边界；补 `expected` 后 `Judgment: PASS` 且 exit 0。
- Evidence Level: L1
- Invalidation: 若 checker 改为 AST 或语义校验、占位符规则收窄到只认 TODO/TBD、或锚点与动词规则被移除，本卡需重写。
