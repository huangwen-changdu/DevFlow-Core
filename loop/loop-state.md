# Loop State — 修复 demo/calc.js 的 subtract 减法问题

## 循环定义（2026 新循环，用户确认版）
- 目标: 复现 demo/calc.js 中 subtract 的减法问题并修复，使减法语义正确（subtract(2,1) === 1），同时保证 test.js 中 multiply 断言也通过
- 停止条件: `node demo/test.js` 退出码 0 且输出 `demo test passed`
- 轮次预算: 8（demo 规模小修）
- 产出物: loop/loop-state.md
- 检查点: 无（全自动，可随时打断）
- 模板: fix-bug-to-green

## 轮次日志

### R1
决策: 第一轮先复现——运行停止条件命令并记录退出码作为证据，同时查看 demo/calc.js 与 demo/test.js 现状，判断 subtract 是否真的有问题、根因在哪。
动作:
1. `node demo/test.js` → 输出 `demo test passed`，退出码 **0**（subtract 与 multiply 实现均正确）
2. 查看 calc.js / test.js 现状 + git status / git diff（demo/ 无未提交改动）
3. `git show HEAD:demo/calc.js` → 与工作区一致（subtract 已是 `return a - b`）
4. `git log --follow -- demo/` → 仅 1 个提交 1c20100（首次提交即为当前"已修复"内容）
5. grep 全仓 subtract 引用 → 对照 docs/plans/2026-08-21-loop-engineering-preset.md（第 193–209 行）

证据:
- 停止条件命令已通过：`node demo/test.js` 退出码 **0**
- **矛盾点**：demo/calc.js 头部注释宣称「故意 bug：subtract 返回 a + b（减法写成加法）」，实际实现却是 `return a - b`（已修复态）；test.js 注释宣称「修复前失败」，实际从未失败（首提交即修复态）
- 设计意图：docs/plans/2026-08-21-loop-engineering-preset.md 明确要求 demo 的 calc.js 为「subtract 返回 a + b（故意 bug）」，test.js 断言失败，用于演示红→绿循环；实际提交的 demo 丢失了故意 bug

结论:
- 减法**功能**无问题：subtract(2,1) === 1 正确，停止条件已达成（exit 0）
- 减法**demo 演示**有问题：demo 打包/提交时放入的是修复后版本，故意 bug 缺失，导致 demo 无法演示失败→修复过程；calc.js 头部注释与实现自相矛盾，与计划文档不符
- 当前循环定义（目标=使减法正确）下无需改代码，停止条件已达成

## 决策日志
- R1: 先复现拿证据，再定位根因；避免凭 calc.js 注释（"已修复"）直接下结论。复现确认功能正确，但发现 demo 与计划文档/注释存在实质矛盾。

## 当前状态
**已达成**：停止条件（node demo/test.js 退出码 0）在 R1 即满足——减法实现本身正确，无需修复。
遗留发现（超出当前定义目标，待用户决策）: demo 的"故意 bug"缺失（subtract 应为 a + b 的 bug 态以演示红→绿），calc.js 头部注释与实现矛盾，与 docs/plans/2026-08-21-loop-engineering-preset.md 设计不符。

---

## 历史（上一循环：实现 multiply，已完成）
- 目标: 在 demo/calc.js 中实现 multiply 函数（先加失败断言再实现），使乘法正确
- 停止条件: `node demo/test.js` 退出码 0 且测试包含 multiply 断言
- 轮次预算: 6（实际使用 3）
- 结果: 完成（PASS），3/6 轮 + 2 轮重入核验；变更 demo/calc.js（实现 multiply）、demo/test.js（新增 multiply 断言）

### R2（复核，用户重新发起"减法有问题，帮我看看"）
决策: 用户再次发起同一问题，按协议先复核 R1 结论是否仍成立，不盲信旧记录。
动作:
1. 重读 demo/calc.js / test.js / TASK.md → 与 R1 记录一致：subtract 实现为 `return a - b`，calc.js 头部注释仍宣称"故意 bug：subtract 返回 a + b"
2. `node demo/test.js` → `demo test passed`，退出码 **0**（停止条件达成，减法功能正确）
3. `git log --oneline -- demo/` + `git status --short demo/` → 仅提交 1c20100，demo/ 无未提交改动（非半成品状态）
4. 对照 docs/plans/2026-08-21-loop-engineering-preset.md（第 185–215 行）→ 设计文档明确要求：calc.js 的 subtract 返回 a + b（故意 bug）、test.js 断言 subtract(2,1)===1 当前失败、验收 = `node demo/test.js` 退出码 1（RED 起点）
证据:
- 减法功能正确：subtract(2,1) === 1，`node demo/test.js` 退出码 0
- demo 与设计意图不符：设计文档要求 demo 处于 RED 态（退出码 1）以演示红→绿循环；实际提交为 GREEN 态（退出码 0），故意 bug 缺失
- 自相矛盾：calc.js 第 2–3 行注释宣称存在 bug，第 5 行实现却已修复；test.js 第 2–3 行注释宣称"修复前失败"，实际从未失败
结论:
- 停止条件（exit 0）已达成 → 功能层面无需修复
- 真正问题 = demo 演示不成立：故意 bug 缺失，无法演示失败→修复过程；注释与实现、与设计文档互相矛盾
- 修复方向存在**决策分叉**（恢复故意 bug 会使测试变红，与当前停止条件相反），需用户拍板

# 循环定义（用户修改版：恢复故意 bug）
- 目标: 把 demo/calc.js 的 subtract 恢复为故意 bug（返回 a + b），使 demo 回到设计文档要求的 RED 起点（node demo/test.js 退出码 1），注释与实现一致
- 停止条件: `node demo/test.js` 退出码 1（subtract(2,1) 返回 3 ≠ 1，断言失败）
- 轮次预算: 4（单文件小改 + 验证，≤4 足够）
- 产出物: loop/loop-state.md
- 检查点: 无（全自动，可随时打断）

## 轮次日志（恢复 bug 循环）
### R1
决策: 只改 demo/calc.js 的 subtract 一行（a - b → a + b），头部注释已声明故意 bug 无需改；test.js 保留（multiply 断言不影响 RED 态，subtract 断言在前先失败）。
动作: 修改 demo/calc.js 第 5 行 subtract 实现与行尾注释。
证据: 待自检验证。
结论: 待定。

（续 R1 结论）
证据: `node demo/test.js` 退出码 **1**，AssertionError `3 !== 1`（subtract(2,1) 返回 3，断言期望 1 失败）——与设计文档验收一致（RED 起点）
结论: **达成**。demo/calc.js subtract 恢复为故意 bug（a + b），注释与实现一致；test.js 无需改动（subtract 断言在前先失败，multiply 断言保留）
