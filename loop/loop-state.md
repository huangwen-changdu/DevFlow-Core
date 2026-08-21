# Loop State — 在 demo/calc.js 实现 multiply（TDD）

## 循环定义（2026 新循环，取代旧的 subtract 循环）
- 目标: 在 demo/calc.js 中实现 multiply 函数（先加失败断言再实现），使乘法正确
- 停止条件: `node demo/test.js` 退出码 0 且测试包含 multiply 断言
- 轮次预算: 6（实际使用 3）
- 产出物: loop/loop-state.md

## 基线（第 1 轮）
- `node demo/test.js` → 输出 `demo test passed`，退出码 **0**（旧 subtract 任务已绿，无 multiply）

## 第 1 轮（红：先加失败断言）
- **变更**：demo/test.js 第 7 行新增 `assert.strictEqual(multiply(3, 4), 12)`（并从 calc.js 解构 multiply）
- **复现失败**：`node demo/test.js` → 退出码 **1**，`TypeError: multiply is not a function`（函数尚不存在）

## 第 2 轮（绿：实现）
- **变更**：demo/calc.js 新增 `function multiply(a, b) { return a * b; }` 并加入 `module.exports`
- **验证**：`node demo/test.js` → 输出 `demo test passed`，退出码 **0**

## 第 3 轮（停止条件核验）
- 退出码：**0**（独立复跑确认）
- 测试含 multiply 断言：**是**（demo/test.js 含 `multiply(3, 4)` 断言，grep 确认）
- **判定**：停止条件满足（退出码 0 且测试包含 multiply 断言），循环结束

## 第 4 轮（重入核验：新会话复跑同一定义）
- 决策：文件已处目标态（calc.js 含 multiply、test.js 含断言），不做破坏性回退，最小动作 = 新鲜复跑停止条件
- 动作：`node demo/test.js` + grep demo/test.js 的 multiply 断言
- 证据：输出 `demo test passed`，退出码 **0**；test.js 第 5 行解构、第 7 行 `assert.strictEqual(multiply(3, 4), 12)`
- 结论：停止条件再次满足，循环结束（重入不消耗新实现轮次）

## 第 5 轮（重入核验：新会话复跑同一定义）
- 决策：文件已处目标态（calc.js 含 multiply、test.js 含断言），不做破坏性回退；本轮最小动作 = 以自身证据新鲜复跑停止条件（不依赖状态文件历史）
- 动作：`node demo/test.js` 并捕获退出码 + grep demo/test.js 的 multiply 断言
- 证据：输出 `demo test passed`，退出码 **0**；test.js 第 5 行 `const { subtract, multiply } = require('./calc.js')`、第 7 行 `assert.strictEqual(multiply(3, 4), 12)`
- 结论：停止条件再次满足（退出码 0 且测试含 multiply 断言），循环结束，无新实现轮次消耗

## 结论
- 状态：**完成**（PASS）
- 使用轮次：3 / 6（+ 2 轮重入核验，未计入实现轮次）
- 变更文件：demo/calc.js（实现 multiply）、demo/test.js（新增 multiply 断言）
