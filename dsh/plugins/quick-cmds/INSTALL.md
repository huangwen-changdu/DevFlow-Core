# DevFlow 快捷命令按钮 — 安装指南

在输入框上方提供一排快捷按钮，点击一键发送 DevFlow 斜杠命令：

| 默认按钮 | 点击发送 |
|---|---|
| 对抗审查 | `/devflow-adversarial` |
| view审查 | `/devflow-prove` |
| 找茬 | `/devflow-find-fault` |

## 特性

- 点击按钮**直接发送**斜杠命令（运行中/提交中按钮自动禁用，防双击）
- **设置 → 快捷命令**页可自定义：按钮名称、命令、后缀内容（命令+空格+内容）、顺序（↑/↓）、增删
- 配置保存在浏览器 localStorage，**刷新页面不丢失**

## 安装方式（两种，推荐静态版）

### 方式一：静态插件包（推荐）— 一条命令安装，重启自动恢复

`@devflow-core/dsh-client-quick-cmds` 0.2.0 起是标准 DSH 插件包：一条命令安装、
随 DSH 启动**自动默认加载**，无需手动复制/改 patch，重启后按钮自动出现：

```powershell
npx @deepseek-ai/dsh plugin --profile web add @devflow-core/dsh-client-quick-cmds
```

装完**必须重启 web**（Ctrl+C → 重新 `npx @deepseek-ai/dsh web`）才生效。

- 仓库已推送 GitHub 时也可不经 npm registry 直装：
  `npx @deepseek-ai/dsh plugin --profile web add github:huangwen-changdu/DevFlow-Core#path:dsh/plugins/quick-cmds-static`
- **0.1.0 手工版（复制目录 + 手改 cordis.patch.yml）不能与插件包混装**：升级前先删除
  `~/.dsh/profiles/web/cordis.patch.yml` 里的 `ui-quick-cmds` insert 块和
  `~/.dsh/profiles/node_modules/@devflow-core/dsh-client-quick-cmds/` 目录，再执行安装命令
  （已配置的按钮存 localStorage，跨版本保留）

详细说明（含卸载、维护者发布流程）见 [`../quick-cmds-static/README.md`](../quick-cmds-static/README.md)。

### 方式二：动态版（让 AI 安装，重启需重装）

把下面这段话发给你的 AI 助手（DSH 会话）：

> 请读取 `dsh/plugins/quick-cmds/plugin.json`，用 cordis_define 创建该插件（kind: new，idPrefix: quick），然后用 cordis_run 激活它。运行成功后告诉我。

AI 会：
1. 读取 `plugin.json`（内含完整插件定义和 Client 代码）
2. 调用 `cordis_define` 创建插件
3. 调用 `cordis_run` 激活（如遇授权提示，请点击允许）
4. 激活后输入框上方即出现三个按钮

> **注意**：动态插件存在进程内存中，DSH 重启后会消失，需要重新安装。静态版不存在此问题。

## 重启 DSH 后如何恢复

| 安装方式 | 重启后 |
|---|---|
| 静态版（推荐） | **自动默认加载**，无需任何操作，按钮和配置自动恢复 |
| 动态版 | 插件消失，需把「方式二」的指令再次发给 AI 重新安装（配置存 localStorage 会自动恢复） |

## 手动验证

- 安装后：输入框上方应出现「对抗审查 / view审查 / 找茬」三个胶囊按钮
- 配置入口：左下角设置（齿轮）→ 左侧「快捷命令」页
- 修改配置后刷新页面，配置应保留

## 常见问题

| 问题 | 处理 |
|---|---|
| 点击按钮后没有反应 | 会话正在运行中（按钮置灰为正常）；确认命令 `/devflow-xxx` 在当前会话有效 |
| 按钮没出现 | 检查 AI 是否已执行 `cordis_run` 且你已允许授权；刷新页面 |
| 想改按钮/命令/顺序 | 设置 → 快捷命令，所有改动即时生效并自动保存 |
| 想卸载 | 让 AI 执行 `cordis_undefine`（或 `cordis_stop` 暂停）该插件 |

## 插件 ID 说明

首次安装时 AI 会生成一个 `quick-<数字>` 形式的插件 ID（如 `quick-2`）。之后更新或卸载均使用该 ID。
