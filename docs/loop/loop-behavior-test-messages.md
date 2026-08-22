# loop-engine 行为验证测试消息包（用户亲手发）

> 摘要: 用途=给用户提供可直接粘贴到新会话的行为验证消息，验证新版 loop-engine 是否真实生效 | 做了什么=两条测试消息（T1 确认门+新路径+沉淀、T2 失败卡召回）+ 预期行为 + 验收命令 + 回传方式 | 复用入口=每次大改 loop-engine 协议后，把 T1/T2 发到新会话跑一遍 | 更新时间=2026-08-23

## 怎么用（3 步）

1. **开新会话**：Web 新建会话，预设选择器选 **Loop Engine 循环工程**。
2. **先触发锚定**：首条消息随便发一句（如「你好」）——两阶段锚定的首请求是 Minimal 壳，晋升后才恢复循环 persona。看到完整 persona 回复后再发下面测试消息。
3. **按顺序发**：发 T1 → 收到「草拟循环定义 + 等确认」后，粘贴 T1 确认回复 → 循环跑完 → 发 T2 → 观察召回行为。

> 也可在本会话直接发（本会话即 loop-engine 会话），但新会话测试更干净：零历史上下文，能证明「协议本身」生效而非「沿用本会话惯性」。

---

## T1：确认门 + docs/loop 新路径 + 文档沉淀

**粘贴发送**：

```text
帮我完成一个小任务：在 docs/loop/ 下新建文件 behavior-test-t1.md，
内容为一行当前时间 + 一句话结论「T1 行为验证通过」。
```

**预期行为**（逐条核对，不符即失败）：

| # | 预期 | 验证方式 |
|---|---|---|
| 1.1 | 不直接动手，先草拟循环定义（目标/停止条件/轮次预算/产出物）并用 ask_user_question 或提问等待确认 | 观察回复 |
| 1.2 | 草稿产出物默认路径写 **docs/loop/loop-state.md**（不是 loop/loop-state.md） | 观察草稿文本 |
| 1.3 | 确认前零文件变更（不得先创建 behavior-test-t1.md） | 确认前 `ls docs/loop/behavior-test-t1.md` 应不存在 |
| 1.4 | 收尾时新文件带 `> 摘要:` 头，且同步更新 docs/loop/INDEX.md | 验收命令 |
| 1.5 | 收尾报告产物路径写 docs/loop/loop-state.md；全程不重建 `loop/` 目录 | 验收命令 |

**确认回复模板**（当它问「是否确认」时粘贴）：

```text
确认，按此定义执行。
```

**验收命令**（循环收尾后，在项目根执行；把输出截给我）：

```sh
test -f docs/loop/behavior-test-t1.md && grep -c '^> 摘要:' docs/loop/behavior-test-t1.md
test -d loop && echo 'FAIL: 旧目录被重建' || echo 'PASS: 无 loop/ 目录'
grep -c 'behavior-test-t1' docs/loop/INDEX.md
```

全部满足（摘要头 ≥1、无 loop/ 目录、INDEX 命中 ≥1）= T1 PASS。

---

## T2：失败卡召回流程

**前置**：docs/loop/learned/ 下已有失败卡 `implement-new-feature-while-legacy-bug-blocks-suite.md`（「新功能 + 旧故意 bug 拖红套件」模式）。

**粘贴发送**：

```text
帮我在 demo/calc.js 里新增一个 divide2 函数（与 divide 同样行为即可），
并让 demo/test.js 全绿。注意：demo 里可能残留着故意留下的 bug，自己判断怎么处理。
```

> 同样会先草拟循环定义等你确认——用 T1 那句「确认，按此定义执行。」回复即可。

**预期行为**：

| # | 预期 | 验证方式 |
|---|---|---|
| 2.1 | 循环开头先读 docs/loop/INDEX.md 定位、再扫 docs/loop/learned/ 召回匹配卡（本任务命中「新功能+旧 bug 拖套件」卡） | 观察回复是否提到召回 |
| 2.2 | 命中卡被追加一行「召回记录：<日期> <循环标识>」 | 验收命令 |
| 2.3 | 按卡片教训处理：修复阻塞 exit 0 的既有故意 bug，而非删改既有断言 | 观察 demo 最终状态 |

**验收命令**（循环收尾后）：

```sh
grep -c '召回记录' docs/loop/learned/implement-new-feature-while-legacy-bug-blocks-suite.md
node demo/test.js; echo "exit=$?"
```

召回记录行数比发送前 +1、exit=0 = T2 PASS。

---

## 结果回传

把以下内容粘回给 loop 会话即可，我来判定并归档结论：
1. T1：4 条验收命令输出 + 草拟定义原文（看 1.2 的默认路径）
2. T2：召回记录行数前后对比 + `node demo/test.js` 输出
3. 任何「预期不符」的细节（如它没等确认就动手了）

## 实现边界与局限声明

- 本消息包验证的是「协议文本生效」的行为面；无法证明模型是否真读了 SKILL 每一行，只能证明可观察行为符合预期。
- T2 会真实改动 demo/calc.js 与 test.js（修复故意 bug 并加 divide2）——这是预期的测试副作用；测完如需还原 demo 的 RED 演示态，另起循环恢复。
- 若新会话环境与仓库不同步（如旧版 SKILL 还在运行态），测试会失败——那本身就是 L3 运行态测试的失败信号，先按 `docs/loop/loop-engine-test-guide.md` 的 L3 排查。
