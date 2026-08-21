# Demo 任务：修复 subtract 到测试绿

demo/calc.js 中 `subtract` 的实现有 bug（减法被写成了加法），demo/test.js 有一个失败断言。请用循环工程方式修复它。

## 循环定义（直接使用）

```markdown
# 循环定义
目标: 修复 demo/calc.js 的 subtract，使减法正确
停止条件: `node demo/test.js` 退出码 0
轮次预算: 8
产出物: loop/loop-state.md
检查点: 无（全自动，可随时打断）
```

## 说明

- 第一轮先运行 `node demo/test.js` 复现失败并记录证据，再定位根因、小步修复。
- 每轮结束运行停止条件命令，把退出码写进 `loop/loop-state.md`。
- 修复后 `node demo/test.js` 应输出 `demo test passed` 并以 0 退出。
