# Loop Engine 循环工程 — DeepSeek Harness Agent Preset

把「写提示词」变成「写循环」：你定义循环（目标 / 停止条件 / 轮次预算 / 产出物），会话自循环自动多轮推进，agent 每轮自己决定下一步该干什么，直到停止条件达成或预算耗尽。

## What it is

- 两阶段开场（沿用 devflow-2 / 锚定纪律）：首个请求只暴露 Minimal 锚定（一行 persona + 最小工具对），锚定门控通过后晋升为完整的**循环工程师 persona**，晋升后保持 **native 工具面**（bash 直接可用，不走 PTC run_code）。
- 循环协议：`loop-engineering` skill（单一来源全局 `~/.dsh/skills/loop-engineering/`，由插件 / install:user 同步，随 preset 不重复打包）——循环定义六要素、每轮五步纪律、状态文件 `loop/loop-state.md`（含决策日志）、空转 blocked 保护、收尾报告。
- 循环隔离：循环激活期间，工作区规则文件与 DevFlow 生命周期要求（审批门/Brainstorm/Plan）不参与循环决策；预算、停止条件、空转保护与平台安全始终生效；产出规范（风格/命名/约定）仍适用；循环结束恢复正常。
- 三个内置模板：修 bug 到测试绿 / 实现功能到测试绿 / 通用任务（`~/.dsh/skills/loop-engineering/templates/`）。
- 零新插件：bootstrap 与工具面全部沿用 devflow-2 / standard，循环机制复用 goal / todo_write / ask_user / subagent 等 DSH 原语。

## Install

随 @devflow-core/dsh-loop-engine 插件分发（独立插件，不依赖 dsh-devflow）：

```sh
npx @deepseek-ai/dsh plugin --profile web add @devflow-core/dsh-loop-engine
# 装完必须重启 web（Ctrl+C → 重新 npx @deepseek-ai/dsh web）才生效
```

重启后插件自动把 preset 同步到 `~/.dsh/.agent-presets/loop-engine/`、skill 同步到 `~/.dsh/skills/loop-engineering/`。

手动路径（install:user，与插件并存不冲突）：

```sh
npm run install:user -- --home ~/.dsh --write --force
npm run install:user -- --home ~/.dsh --check
```

## Use

1. 在 Web UI 新建会话，预设选择器选 **Loop Engine 循环工程**。
2. 首个请求走 Minimal 锚定；晋升后（循环 persona 生效）输入循环定义——从模板复制示例块替换字段即可；**或只描述需求**：agent 会先草拟循环定义（目标 / 停止条件 / 轮次预算 / 产出物）请你确认，确认后才开始执行：

```markdown
# 循环定义
目标: 修复 demo/calc.js 的 subtract，使减法正确
停止条件: `node demo/test.js` 退出码 0
轮次预算: 8
产出物: loop/loop-state.md
```

3. 循环自动多轮推进；随时可发新消息打断或改定义。收尾时输出结果、轮次统计与证据路径。

## 升级更新

插件升级（`npx @deepseek-ai/dsh plugin --profile web update @devflow-core/dsh-loop-engine` 或 remove + add）后重启 web，插件自动把新资产同步到 `~/.dsh/`（字节相同跳过，升级残留 prune）。preset 目录 `~/.dsh/.agent-presets/loop-engine/` 完全由插件管理，勿存放自定义文件（会被清理）；需要自定义请复制成新预设 id。

## Caveats

- 新装预设后，选择器可能需要刷新一次或重启 dsh 才显示「Loop Engine 循环工程」。
- `~/.dsh/.agent-presets/loop-engine/` 完全由插件管理：插件升级重建时无需手工重装，install:user 可作手动路径（二者并存不冲突）。
- 循环消耗 API 额度：轮次预算请按任务大小设置（demo 建议 ≤8 轮）；空转保护在连续 2 轮无推进时自动 blocked。
- Windows：phase-1 bash 走 `custom-bash.mjs`（Git Bash 推断）；PTY 不可用时锚定阶段文件工具仍可用；若 `git` 不在 PATH，在组合文件 custom-bash 行显式配置 `bashPath`。
- 循环状态写入工作区 `loop/loop-state.md`（默认），与任务文件同目录。
