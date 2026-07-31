# DevFlow Harness 迭代 Pack 实施计划

Status: approved
Goal: 落地已确认的 7 条架构建议（P0-1 CI、P0-2 skill 预算、P0-3 路由一致性校验、P1-4 生命周期状态字段、P1-5 checker JSON 输出与 installer 升级 manifest、P2-6 本地观测日志、P2-7 规模治理 gate），并新增 docs/iteration-plan.md 长期迭代文档
Architecture: 全部复用现有 Node.js 标准库校验器/安装器/hook 模式与 npm scripts 入口；新增 2 个校验脚本、1 个 CI workflow、1 个迭代文档；无新依赖、无新目录、不改流程语义
Tech Stack: Node.js 标准库（node:fs、node:path、node:crypto）+ GitHub Actions 官方 action
Source: Cut Decision（2026-07-31 Brainstorm 确认，B 深度）；无独立 Spec 文件
Spec coverage: design-only——7 条建议 + 迭代文档逐条映射到 Task 1-8
Cut Decision: CUT_PASS——allowed scope 为 P0-1..3 + P1-4..5 + P2-6..7 + docs/iteration-plan.md，按 P0/P1/P2/文档四批执行；reuse conclusion 为沿用 validate-devflow.js 断言与 runVerifier 挂载模式、installer --check 比较逻辑、session-start hook 框架；exclusions 为流程语义、skill 内容、target 项目现有文件、数据上报；verification constraints 为每批完成后 npm run verify:all 全绿
External Skills: none

## Global Constraints
- 不新增依赖：全部使用 Node.js 标准库与 GitHub Actions 官方 action
- 运行时 checker（scripts/devflow-spec.js、scripts/devflow-plan.js、scripts/devflow-review.js、scripts/devflow-debt.js、scripts/devflow-audit.js）会被复制到 target 项目：契约变更必须向后兼容——Status 缺失视为 legacy 不报错；--json 为可选参数，默认输出不变
- 新增文件限制在 .github/、scripts/、docs/、hooks/ 与项目根清单内；不新建目录
- 流程语义（路由表、A/B/C、门禁定义）保持不变
- 观测日志默认关闭，仅本地写入，无网络上报
- 执行顺序即任务编号顺序：批次 P0（Task 1-3）、P1（Task 4-6）、P2（Task 7）、文档（Task 8）；每批完成后运行一次 npm run verify:all

## File Structure

| File / symbol | Operation | Responsibility | Why here | Not responsible for |
|---|---|---|---|---|
| `.github/workflows/ci.yml` | Create | P0-1 CI：push/PR 触发 verify:all | .github/ 是现有平台入口面 | 不覆盖本地校验 |
| `scripts/devflow-budget.js` | Create | P0-2/P2-7 skill 预算门禁 | scripts/ 是现有校验器所在 | 不重写 skill 内容 |
| `scripts/validate-route-consistency.js` | Create | P0-3 四文件关键路由边一致性 | validate-* 家族 | 不判断架构 |
| `scripts/validate-devflow.js` | Modify | 挂载两个新校验器 | 现有聚合入口 | 不新增校验维度 |
| `package.json` | Modify | 新 scripts 与 verify:all 扩展 | 现有 npm 脚本入口 | 不新增依赖 |
| `scripts/devflow-plan.js` | Modify | P1-4 Status 可选校验 + P1-5a --json | 现有 plan checker | 不改变必填字段集合 |
| `scripts/devflow-spec.js` | Modify | P1-4 Status 可选校验 + P1-5a --json | 现有 spec checker | 不改变必填字段集合 |
| `scripts/devflow-review.js` | Modify | P1-5a --json | 现有 review checker | 不改门禁集合 |
| `scripts/devflow-debt.js` | Modify | P1-5a --json | 现有 debt checker | 不改 marker 语义 |
| `scripts/devflow-audit.js` | Modify | P1-5a --json | 现有 audit checker | 不改扫描语义 |
| `scripts/install-devflow.js` | Modify | P1-5b manifest 写入与版本差检测 | 现有 target installer | 不改 skip/merge 语义 |
| `hooks/devflow-session-start.js` | Modify | P2-6 可选本地观测日志 | 现有 session hook | 不改变注入文本 |
| `.gitignore` | Modify | 忽略 .devflow-observe.log | 现有忽略清单 | 不忽略其他文件 |
| `docs/iteration-plan.md` | Create | 长期迭代计划活文档 | docs/ 现有文档面 | 不含实施代码 |
| `README.md` | Modify | 文档索引与 Status/--json/manifest 说明 | 现有用户入口 | 不重写安装说明 |

Task: 接入 GitHub Actions CI（P0-1）

Task type: Code change
Files:
- Create: .github/workflows/ci.yml | new file | push/PR 触发 verify:all
Interfaces:
- Consumes: GitHub push 与 pull_request 事件
- Produces: workflow job 结果（job 成功 = npm run verify:all 全绿）
Current behavior: 仓库无 CI，校验只能本地手动运行
Target behavior: 每次 push 与 pull_request 自动运行 npm run verify:all
Change mechanics: pseudocode——定义 on: [push, pull_request] 触发，添加 checkout@v4 与 setup-node@v4（node-version: 22）步骤，最后添加 npm run verify:all 步骤；验证以 verify:all 收尾
Call impact: 无运行时影响，仅仓库级 CI 配置
Steps:
- [ ] Create `.github/workflows/ci.yml` 按 pseudocode 添加两级缩进 YAML：on push/pull_request、runs-on ubuntu-latest、checkout@v4、setup-node@v4 node 22、`npm install`、`npm run verify:all`
- [ ] 运行 `git status --short .github/workflows/ci.yml` 并读取文件内容，确认触发与命令行存在且缩进正确
Acceptance: .github/workflows/ci.yml 存在，包含 push 与 pull_request 触发定义和 npm run verify:all 步骤
Verify: Run `Get-Content .github/workflows/ci.yml`; expect 文件含 `on:`、`pull_request:` 与 `verify:all` 且 YAML 缩进为两级
Comments: 本地无法执行 GitHub Actions，语法正确性以内容检查为准；workflow 是仓库级配置，不属于运行时校验面
Not doing: 不添加操作系统矩阵、不缓存 npm、不上传产物

Prewalk:

Execution Trace:
- Read: `.github/` 目录列表 → 仅有 copilot 相关 3 个文件，无 workflows 目录。
- Read: `package.json` → 存在 `verify:all` 聚合脚本，CI 可直接调用。
- Ran: `Get-ChildItem .github -Recurse` → 确认无现成 CI 配置可复用。
- Edited: none yet → workflow 创建待执行。
- Verified: none yet → CI 本地无法执行，以内容检查为证明。

Current Handoff Facts:
- Target anchors: `.github/workflows/ci.yml`（新建）。
- Nearby convention: `package.json` 的 `verify:all` 串联全部校验脚本。
- Direct path: 仓库在 GitHub 托管，push/PR 事件即触发面。
- Current constraints: 无 lockfile，用 `npm install` 而非 `npm ci`。
- Planned touch set: 仅 `.github/workflows/ci.yml`。
- Risks / stop conditions: YAML 缩进错误会导致 Actions 解析失败；无其他阻断。

Remaining Structured Worklist:
- [ ] Create `.github/workflows/ci.yml` 并添加两级缩进的 YAML 配置。
  Anchors: `.github/workflows/ci.yml`。
  Verify: `Get-Content .github/workflows/ci.yml` 目视核对触发与命令。
  Done when: 文件存在且含 push/pull_request 与 verify:all。

Task: skill 预算门禁（P0-2 + P2-7）

Task type: Code change
Files:
- Create: scripts/devflow-budget.js | new file | skill 预算扫描与门禁
- Modify: package.json | `scripts` | 添加 budget:verify 并扩展 verify:all
- Modify: scripts/validate-devflow.js | `runVerifier` | 挂载 budget verifier
Interfaces:
- Consumes: scan(root: string) → 遍历 root/skills/*/SKILL.md 读取字节数
- Produces: report(root: string, json: boolean) → 输出每文件字节与超限清单，返回 exit code
Current behavior: skill 体积无门禁，devflow-prove 主体已达 13,937 字节且无总量约束
Target behavior: 单 SKILL.md 主体超 15 KiB（15,360 字节）或 skills/ 总量超 280,000 字节时校验失败
Change mechanics: pseudocode——定义 MAX_SKILL_BYTES = 15 * 1024 与 MAX_TOTAL_BYTES = 280000；scan 收集 {rel, bytes}；report 打印逐文件字节、超限列表、总量，超限则返回 1；--self-test 用临时目录构造超限样本验证 FAIL 路径；--json 输出单行 JSON；package.json 添加 "budget:verify": "node scripts/devflow-budget.js" 并追加 "&& npm run budget:verify" 到 verify:all；validate-devflow.js 在 runVerifier("scripts/validate-skill-triggers.js") 之后追加 runVerifier("scripts/devflow-budget.js")
Call impact: verify:all 与 validate-devflow.js 的执行链新增一个校验器；target 项目不受影响（该脚本不复制）
Steps:
- [ ] Create `scripts/devflow-budget.js` 按 pseudocode 实现 scan/report/selfTest/usage 与 --json 分支
- [ ] Modify `package.json` 的 `scripts` 段按 pseudocode 添加 budget:verify 并扩展 verify:all 末尾
- [ ] Modify `scripts/validate-devflow.js` 在 L184 后按 pseudocode 追加 runVerifier("scripts/devflow-budget.js")
- [ ] 运行 `npm run budget:verify` 与 `node scripts/devflow-budget.js --self-test`，期望均通过
Acceptance: 超限脚本在 --self-test 中触发 FAIL；当前仓库状态通过预算门禁
Verify: Run `npm run budget:verify`; expect exit 0 且输出含 skills 总量
Comments: 阈值以 UTF-8 字节数为准（statSync().size），最大现存主体 devflow-project-knowledge 14,715 字节，15 KiB 上限留约 645 字节余量；总量 280,000 高于 SKILL.md 主体合计 131,874
Not doing: 不按 token 计费模型折算、不对 references 计费、不重写 skill 内容

Prewalk:

Execution Trace:
- Read: `skills/*/SKILL.md` 字节统计（UTF-8 字节数） → 最大主体 devflow-project-knowledge 14,715 字节，SKILL.md 主体合计 131,874 字节。
- Read: `scripts/validate-devflow.js` → 已有 AGENTS.md 8 KiB 断言与 runVerifier 挂载模式（L183-184）。
- Read: `package.json` → verify:all 用 && 串联全部校验脚本。
- Edited: none yet → 预算脚本创建待执行。
- Verified: none yet → 基线数值来自本轮目录统计。

Current Handoff Facts:
- Target anchors: `scripts/validate-devflow.js` L183-184 runVerifier 区；`package.json` scripts 段。
- Nearby convention: devflow-debt.js 与 devflow-audit.js 均采用 scan(root) + report(root) + selfTest() 结构。
- Direct path: verify:all 与 validate-devflow.js 聚合入口。
- Current constraints: 新增脚本须自带 --self-test 与 exit code；validate-devflow.js L152 的脚本名断言集合不包含新名字，无需扩展；字节口径用 statSync().size 而非字符数。
- Planned touch set: scripts/devflow-budget.js、package.json、scripts/validate-devflow.js。
- Risks / stop conditions: 阈值过紧导致现有 skill 超限——当前最大值低于 14 KiB，无风险。

Remaining Structured Worklist:
- [ ] Create `scripts/devflow-budget.js` 添加 scan/report/selfTest 实现。
  Anchors: `scripts/devflow-budget.js`。
  Verify: `node scripts/devflow-budget.js --self-test` 期望通过。
  Done when: 自测通过且 `npm run budget:verify` 输出总量。

Task: 路由一致性校验（P0-3）

Task type: Code change
Files:
- Create: scripts/validate-route-consistency.js | new file | 四文件关键路由边一致性
- Modify: package.json | `scripts` | 添加 route:verify
- Modify: scripts/validate-devflow.js | `runVerifier` | 挂载 consistency verifier
Interfaces:
- Consumes: 读取 AGENTS.md、skills/devflow-core/references/core-methods.md、README.md、skills/skill-call-diagram.md 四个文件文本
- Produces: 每文件缺失边清单，任何缺失返回 exit 1
Current behavior: 路由边只在 validate-devflow.js 中对 core SKILL.md 断言，其余三份文件无校验，四处拷贝可漂移
Target behavior: 四个文件各自包含全部 3 条成功边与 7 个异常返回 token
Change mechanics: pseudocode——定义 edges 数组：三条成功边正则（无前缀版本：/Spec\s*->\s*Cut\s*->\s*Plan\s*->\s*Build\s*->\s*Prove/、/Cut\s*->\s*Plan\s*->\s*Build\s*->\s*Prove/、/Cut\s*->\s*Build\s*->\s*Prove/）与 7 个异常正则（/CUT_REDUCE/、/CUT_REUSE/、/CUT_BLOCKED/、/BUILD_BLOCKED/、/scope[- ]drift/i、/PUA[^.\n]*recovery/i、/Proof[^.\n]*FAIL[^.\n]*BLOCKED/）；三个权威表面（AGENTS.md、core SKILL.md、skill-call-diagram.md）断言全部 10 条边，README 作为用户文档只断言成功边与 CUT_PASS、scope drift；缺失则输出 文件:边 并返回 1；validate-devflow.js 追加 runVerifier；package.json 添加 "route:verify"
Call impact: verify:all 执行链新增一个校验器；不影响运行时 checker
Steps:
- [ ] Create `scripts/validate-route-consistency.js` 按 pseudocode 实现边集合与四文件断言
- [ ] Modify `package.json` 的 `scripts` 段按 pseudocode 添加 route:verify 并追加到 verify:all
- [ ] Modify `scripts/validate-devflow.js` 在 budget verifier 行后按 pseudocode 追加 runVerifier("scripts/validate-route-consistency.js")
- [ ] 运行 `npm run route:verify`，期望 exit 0
Acceptance: 四个文件全部通过 10 项边断言；故意移除某文件一条边时脚本能失败（以现有四文件现状为通过基线）
Verify: Run `npm run route:verify`; expect exit 0 且输出校验通过
Comments: 成功边用无前缀正则，兼容 README 的 `Spec -> Cut -> Plan -> Build -> Prove` 写法；异常边用容错正则，兼容 AGENTS.md 的 Proof 反引号写法
Not doing: 不比对文件全文、不校验 mermaid 图、不生成路由表

Prewalk:

Execution Trace:
- Read: `AGENTS.md` → 含 3 条 direct success 边与 CUT_REDUCE/REUSE/BLOCKED、BUILD_BLOCKED、scope drift、Proof 反引号 FAIL/BLOCKED、PUA recovery。
- Read: `README.md` → Runtime Flow 段含无前缀成功边与 "scope drift" 描述性表述，无 CUT_REDUCE 等 token。
- Read: `skills/devflow-core/SKILL.md` → Core Flow Map 含 A/B/C 文本边与全部异常返回清单；含 scope-drift 连字符与 "PUA returns recovery facts" 表述。
- Read: `scripts/validate-devflow.js` → assertHybridLifecycleContract 只断言 core SKILL.md。
- Edited: none yet → 一致性脚本创建待执行。
- Verified: none yet → 四文件现状已目视确认包含全部边。

Current Handoff Facts:
- Target anchors: `scripts/validate-devflow.js` runVerifier 区；四份路由文件路径。
- Nearby convention: assertHybridLifecycleContract 的成功边/异常边集合。
- Direct path: verify:all 聚合入口。
- Current constraints: 边表述跨文件存在反引号、连字符（scope-drift）与缩写差异，须用正则容错而非逐字比较；core-methods.md 不含边文本，不列入检查；README 是用户文档，仅轻量检查。
- Planned touch set: scripts/validate-route-consistency.js、package.json、scripts/validate-devflow.js。
- Risks / stop conditions: README 若改写为表格符号版本会破坏正则——当前文本版本匹配。

Remaining Structured Worklist:
- [ ] Create `scripts/validate-route-consistency.js` 添加边集合与四文件断言实现。
  Anchors: `scripts/validate-route-consistency.js`。
  Verify: `npm run route:verify` 期望 exit 0。
  Done when: 四文件断言全部通过。

Task: plan/spec checker 的 Status 与 --json（P1-4 + P1-5a 前半）

Task type: Code change
Files:
- Modify: scripts/devflow-plan.js | `checkPlan`, `report`, `selfTest`, `usage` | 可选 Status 校验与 --json 输出
- Modify: scripts/devflow-spec.js | `checkSpec`, `report`, `selfTest`, `usage` | 可选 Status 校验与 --json 输出
Interfaces:
- Consumes: plan/spec 文档文本；CLI 参数 --json
- Produces: 默认人类可读报告（逐字节不变）；--json 时单行 JSON {checker, judgment, status, ...}；exit code 不变
Current behavior: plan/spec 文档无状态字段概念，checker 无 --json 参数
Target behavior: 文档头部可选 `Status: draft|approved|in-progress|done`，缺失视为 legacy 不报错、非法值报错；--json 输出机器可读摘要
Change mechanics: pseudocode——两文件均添加 const validStatuses = ["draft", "approved", "in-progress", "done"] 与 statusPattern（/^\s*(?:\*\*)?Status(?:\*\*)?\s*:\s*([^\n]+)/im，不含进 requiredFields）；校验逻辑为缺失→status "legacy" 不失败、存在且值非法→invalidStatus 失败；report 增加 json 参数（由 args.includes("--json") 传入），json 时输出 JSON.stringify({checker, judgment, status, ...现有摘要字段})；usage 文本追加 [--json]；self-test 增加三用例：合法值通过、非法值失败、缺失通过
Call impact: 默认调用路径输出不变；--json 为纯增量参数；target 项目的旧文档无 Status 字段不受影响
Steps:
- [ ] Modify `scripts/devflow-plan.js` 按 pseudocode 添加 validStatuses/statusPattern 与 checkPlan 的 status 校验分支、--json 输出分支、usage 更新
- [ ] Modify `scripts/devflow-plan.js` selfTest 按 pseudocode 增加 Status 三用例（合法/非法/缺失）
- [ ] Modify `scripts/devflow-spec.js` 按同样 pseudocode 添加 Status 校验与 --json 分支
- [ ] Modify `scripts/devflow-spec.js` selfTest 按 pseudocode 增加 Status 三用例
- [ ] 运行 `node scripts/devflow-plan.js --self-test` 与 `node scripts/devflow-spec.js --self-test`，期望均通过
- [ ] 运行 `node scripts/devflow-plan.js docs/plans/2026-07-31-devflow-harness-iteration.md --json`，期望输出 JSON 且含 status 字段
Acceptance: 两 checker 自测通过；本计划文件带 Status 字段且 --json 输出可解析
Verify: Run `node scripts/devflow-plan.js --self-test`; expect DevFlow plan self-test passed
Comments: Status 值域与生命周期阶段对应（draft 澄清后、approved 批准后、in-progress 构建中、done 完成后）；checker 只校验格式不裁决状态转换
Not doing: 不强制要求 Status 存在、不新增状态机逻辑、不修改必填字段集合

Prewalk:

Execution Trace:
- Read: `scripts/devflow-plan.js` → requiredGlobalFields 为纯必需集合（L3），checkPlan 在 L309-330，report 在 L348-406，selfTest 在 L415-577。
- Read: `scripts/devflow-spec.js` → requiredFields 在 L3-14，report 在 L95-112，selfTest 在 L122-184。
- Traced: 两 checker 的 CLI 入口 → 均以 process.exitCode 接收 report 返回值，--json 只需在 report 内分叉。
- Ran: `node scripts/devflow-plan.js --self-test` → 基线自测通过。
- Edited: none yet → Status 与 --json 改动待执行。
- Verified: none yet → 基线输出为人类可读文本。

Current Handoff Facts:
- Target anchors: `scripts/devflow-plan.js` L309 checkPlan、L348 report、L415 selfTest；`scripts/devflow-spec.js` L48 checkSpec、L95 report、L122 selfTest。
- Nearby convention: 两 checker 的 report 均以 console.log 分行输出并返回 0/1。
- Direct path: CLI 入口将 args.includes("--json") 传入 report。
- Current constraints: fieldPatterns 由 requiredFields 构造，Status 必须独立正则以免变成必填；legacy 兼容要求缺失不失败。
- Planned touch set: scripts/devflow-plan.js、scripts/devflow-spec.js。
- Risks / stop conditions: 若把 Status 误加进 requiredFields 会破坏全部现存文档——实现时保持独立常量。

Remaining Structured Worklist:
- [ ] Modify `scripts/devflow-plan.js` 添加 Status 校验与 --json 分支及自测用例。
  Anchors: `scripts/devflow-plan.js` checkPlan/report/selfTest。
  Verify: `node scripts/devflow-plan.js --self-test` 期望通过。
  Done when: 自测通过且 --json 输出含 status 字段。

Task: review/debt/audit checker 的 --json（P1-5a 后半）

Task type: Code change
Files:
- Modify: scripts/devflow-review.js | `report`, `usage` | --json 输出
- Modify: scripts/devflow-debt.js | `report`, `usage` | --json 输出
- Modify: scripts/devflow-audit.js | `report`, `usage` | --json 输出
Interfaces:
- Consumes: 现有输入（plan/diff 文本或目录）；CLI 参数 --json
- Produces: 默认人类可读输出不变；--json 时单行 JSON {checker, judgment, ...}；exit code 不变
Current behavior: 三 checker 只有人类可读输出，无机器可读摘要
Target behavior: --json 参数输出机器可读摘要，默认输出逐字节不变
Change mechanics: pseudocode——三文件 report 增加 json 参数（args.includes("--json") 传入）；json 分支输出 JSON.stringify({checker, judgment, 现有摘要字段})；debt 的零 marker 早退路径在 json 模式下输出 JSON 而非纯文本；usage 追加 [--json]
Call impact: 默认调用路径输出不变；--json 为纯增量参数
Steps:
- [ ] Modify `scripts/devflow-review.js` report 按 pseudocode 增加 json 分支并更新 usage
- [ ] Modify `scripts/devflow-debt.js` report 按 pseudocode 增加 json 分支（含零 marker 路径）并更新 usage
- [ ] Modify `scripts/devflow-audit.js` report 按 pseudocode 增加 json 分支并更新 usage
- [ ] 运行三文件 `--self-test` 与 `npm run review:verify` 等既有 npm script，期望均通过
- [ ] 运行 `node scripts/devflow-review.js README.md --json` 验证输出可解析
Acceptance: 三 checker 自测与既有 verify 脚本通过；--json 输出为合法 JSON
Verify: Run `node scripts/devflow-review.js --self-test`; expect DevFlow review self-test passed
Comments: debt 与 audit 的 report 有早退路径，json 分支必须覆盖；JSON 摘要字段沿用各报告现有数据
Not doing: 不改门禁集合、不改 marker 扫描语义、不改变退出码语义

Prewalk:

Execution Trace:
- Read: `scripts/devflow-review.js` → report 在 L28-42，输出 Present/Missing gates 与 Judgment。
- Read: `scripts/devflow-debt.js` → report 在 L122-137，含零 marker 早退（L126-129）。
- Read: `scripts/devflow-audit.js` → report 在 L163-178，含 "Lean already. Ship." 早退（L166-169）。
- Traced: 三文件 CLI 入口 → 均以 process.exitCode 接收 report 返回值。
- Ran: `node scripts/devflow-review.js --self-test` → 基线自测通过。
- Edited: none yet → --json 改动待执行。
- Verified: none yet → 基线输出为人类可读文本。

Current Handoff Facts:
- Target anchors: devflow-review.js L28 report、devflow-debt.js L122 report、devflow-audit.js L163 report。
- Nearby convention: 三文件 report 返回 0/1，由 CLI 入口 process.exitCode 承接。
- Direct path: CLI 入口将 args.includes("--json") 传入 report。
- Current constraints: debt 与 audit 的早退路径必须同样产出 JSON。
- Planned touch set: scripts/devflow-review.js、scripts/devflow-debt.js、scripts/devflow-audit.js。
- Risks / stop conditions: 早退路径遗漏会输出非 JSON 文本——逐路径覆盖。

Remaining Structured Worklist:
- [ ] Modify `scripts/devflow-review.js` report 增加 json 分支。
  Anchors: `scripts/devflow-review.js` L28 report。
  Verify: `node scripts/devflow-review.js --self-test` 期望通过。
  Done when: 自测通过且 --json 输出为合法 JSON。

Task: installer manifest 与版本差检测（P1-5b）

Task type: Code change
Files:
- Modify: scripts/install-devflow.js | `copyFile`, `checkFile` | manifest 写入与上游版本差检测
Interfaces:
- Consumes: 源文件字节（sha256 计算）；target 项目根；package.json 的 version
- Produces: target 项目根 .devflow-manifest.json {package, version, files: {rel: sha256}}；check 模式版本差提示与 exit 1
Current behavior: --check 只按字节比较源/目标文件，无上游版本概念；write 不产生安装记录
Target behavior: write 模式在全部拷贝完成后写入 manifest；check 模式检测到 manifest 版本与当前版本不一致时报告升级路径并失败
Change mechanics: pseudocode——顶部 const { createHash } = require("node:crypto")；write 分支在 results 计算后、输出总结前，将 manifest 写入 targetRoot/.devflow-manifest.json（files 为 runtimeEntries 逐一 sha256 源文件）；check 分支在字节比较前读取 target manifest，若存在且 version 不等于当前 packageJson.version，输出 "Upstream version changed: installed INSTALLED_VERSION, current CURRENT_VERSION. Re-run install:target --write --force to upgrade." 并计入 changed 集合；manifest 缺失不失败（老安装兼容）
Call impact: dry-run 与既有 skip/merge 语义不变；check 对带 manifest 的安装新增版本差失败项
Steps:
- [ ] 运行 `Get-Content scripts/validate-installer.js` 检查其对 write/check 输出的断言，确认新增 manifest 文件不破坏断言
- [ ] Modify `scripts/install-devflow.js` 按 pseudocode 添加 crypto 引用、manifest 写入逻辑与 check 版本差分支
- [ ] 运行 `npm run install:verify` 与 `node scripts/install-devflow.js --self-test`（若存在），期望均通过
- [ ] 运行 `node scripts/install-devflow.js TEMP_DIR --write` 干跑验证 manifest 生成，再运行 `--check` 验证版本一致时通过
Acceptance: write 后 target 根出现 .devflow-manifest.json；check 在版本一致时通过、版本不一致时报告并 exit 1；install:verify 通过
Verify: Run `npm run install:verify`; expect install verifier passed
Comments: validate-installer.js 若断言 target 文件集合则需同步扩展其期望；manifest 不计入 runtimeEntries 拷贝列表
Not doing: 不做增量同步、不做文件级 diff 合并、user installer 不加 manifest

Prewalk:

Execution Trace:
- Read: `scripts/install-devflow.js` → copyFile 在 L107-138，check 分支在 L180-198，write 分支在 L200-214。
- Traced: check 模式 → 现有 changed/missing 判定后 exit 1。
- Read: `scripts/validate-installer.js` 目录存在 → 尚未读取断言细节，需在本任务第一步核实。
- Ran: none yet → 基线未验证 installer 行为。
- Edited: none yet → manifest 逻辑待执行。
- Verified: none yet → 待第一步核实后确认断言面。

Current Handoff Facts:
- Target anchors: `scripts/install-devflow.js` L180 check 分支、L200 write 分支。
- Nearby convention: 现有 check 用 Buffer.compare 比较字节。
- Direct path: CLI 入口区分 --write/--check/--dry-run。
- Current constraints: manifest 缺失的旧安装不得失败；dry-run 不写文件。
- Planned touch set: scripts/install-devflow.js；视第一步结果可能含 scripts/validate-installer.js。
- Risks / stop conditions: validate-installer.js 若严格断言 target 文件清单会因新文件失败——先读后改。

Remaining Structured Worklist:
- [ ] Read `scripts/validate-installer.js` 全文并检查其对 write/check 的断言。
  Anchors: `scripts/validate-installer.js`。
  Verify: 记录断言清单。
  Done when: 明确 manifest 是否影响既有断言。

Task: 本地观测日志（P2-6）

Task type: Code change
Files:
- Modify: hooks/devflow-session-start.js | `use strict` | env 开关的本地会话日志
- Modify: .gitignore | `nul` | 忽略 .devflow-observe.log
Interfaces:
- Consumes: 环境变量 DEVFLOW_OBSERVE === "1"；process.cwd()
- Produces: 项目根 .devflow-observe.log 追加行（ISO 时间戳 + session-start）；默认无任何输出变化
Current behavior: hook 只向 stdout 输出注入上下文 JSON，无任何文件写入
Target behavior: 显式设置 DEVFLOW_OBSERVE=1 时每次会话启动追加一行本地日志；未设置时行为与现状逐字节一致
Change mechanics: exact replacement——文件顶部加 const fs = require("node:fs") 与 const path = require("node:path")；在 context 定义前插入：if (process.env.DEVFLOW_OBSERVE === "1") { try { fs.appendFileSync(path.join(process.cwd(), ".devflow-observe.log"), `${new Date().toISOString()} session-start\n`, "utf8"); } catch {} }；.gitignore 追加一行 .devflow-observe.log
Call impact: hook 的 stdout 输出与 hooks.json 触发不变；默认运行零行为差异；日志写入失败静默
Steps:
- [ ] Modify `hooks/devflow-session-start.js` 顶部按 pseudocode 添加 fs/path 引用与 env 开关日志块
- [ ] Modify `.gitignore` 末尾按 pseudocode 追加 `.devflow-observe.log`
- [ ] 运行 `node hooks/devflow-session-start.js` 验证无 env 时输出与现状一致且不产生日志文件
- [ ] 运行 `$env:DEVFLOW_OBSERVE="1"; node hooks/devflow-session-start.js` 后清除该环境变量，验证日志文件生成一行
Acceptance: 无 env 时无文件写入且输出不变；有 env 时 .devflow-observe.log 追加一行
Verify: Run `node hooks/devflow-session-start.js`; expect 仅输出 JSON 且工作目录无 .devflow-observe.log
Comments: 日志仅本地、默认关闭、无网络上报；cwd 即 Claude Code 启动的项目目录
Not doing: 不记录路由/门禁详情（hook 无法捕获对话内决策）、不做轮转、不写入用户主目录

Prewalk:

Execution Trace:
- Read: `hooks/devflow-session-start.js` → 现为纯 stdout JSON 输出，无 require 语句（L1-17）。
- Read: `hooks/hooks.json` → SessionStart matcher 为 startup|clear|compact，commandWindows 调 node 执行。
- Traced: hook 运行 cwd → Claude Code 在项目目录启动，process.cwd() 为项目根。
- Ran: none yet → 基线 hook 输出未实跑。
- Edited: none yet → 日志块待执行。
- Verified: none yet → 待执行后验证。

Current Handoff Facts:
- Target anchors: `hooks/devflow-session-start.js` L1-4 顶部区。
- Nearby convention: hook 保持零依赖与静默失败风格。
- Direct path: hooks.json 的 command/commandWindows 调用入口。
- Current constraints: 日志必须 try/catch 静默，防止阻断会话注入。
- Planned touch set: hooks/devflow-session-start.js、.gitignore。
- Risks / stop conditions: appendFileSync 在只读目录抛错——已由 try/catch 覆盖。

Remaining Structured Worklist:
- [ ] Modify `hooks/devflow-session-start.js` 顶部添加 env 开关日志块。
  Anchors: `hooks/devflow-session-start.js` L1-4。
  Verify: `node hooks/devflow-session-start.js` 无 env 时输出不变。
  Done when: 有 env 时日志文件生成且无 env 时零文件写入。

Task: 长期迭代文档（用户点名交付）

Task type: Documentation-only
Files:
- Create: docs/iteration-plan.md | new file | 长期迭代计划活文档
- Modify: README.md | 文档引用段 | 链接 iteration-plan 并简述 Status/--json/manifest
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Create `docs/iteration-plan.md` 包含：目的与范围；更新机制（触发时机为每批完成、每次发布或用户要求；步骤为更新已落地状态、修订候选清单、运行 npm run verify:all、提交）；本次已落地清单（7 条逐条记录位置与验证命令）；后续迭代候选（观测数据驱动约束校准、budget 阈值演进、跨会话状态自动恢复、checker 输出消费方、升级路径细化）
- [ ] Modify `README.md` 在 Quick Start 文档引用处追加 docs/iteration-plan.md 链接，并在脚本表格后补一行说明 --json、.devflow-manifest.json 与 Status 字段
- [ ] 运行 `git status --short docs/iteration-plan.md README.md` 确认两文件变更可见
Acceptance: docs/iteration-plan.md 存在且含更新机制与已落地清单；README 含链接
Verify: Run `git status --short docs/iteration-plan.md`; expect 文件被列出且 README 含 iteration-plan 链接
Comments: 该文档是后续迭代的唯一更新入口，其自身必须写明更新流程
Not doing: 不含实施代码、不复制流程文档内容、不承诺具体排期

## 批次与验证

| 批次 | 任务 | 批后验证 |
|---|---|---|
| P0 | Task 1-3 | npm run verify:all |
| P1 | Task 4-6 | npm run verify:all |
| P2 | Task 7 | npm run verify:all |
| 文档 | Task 8 | npm run verify:all + git status 检查 |
