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

### 方式一：静态版（推荐）— 默认加载，重启自动恢复

静态插件随 DSH 启动**自动加载**，无需手动安装/重装，重启后按钮自动出现：

1. 把 `dsh/plugins/quick-cmds-static/` 包装入 profile 的 node_modules：
   ```powershell
   $target = "$env:USERPROFILE\.dsh\profiles\node_modules\@devflow-core"
   New-Item -ItemType Directory -Force -Path $target | Out-Null
   Copy-Item -Recurse -Force dsh\plugins\quick-cmds-static $target\dsh-client-quick-cmds
   ```
2. 在 `$env:USERPROFILE\.dsh\profiles\web\cordis.patch.yml` 注册组合行：
   ```yaml
   - insert:
       - id: ui-quick-cmds
         name: '@devflow-core/dsh-client-quick-cmds'
   ```
3. 重启 DSH。之后**每次启动 DSH 都会默认加载**该插件，无需任何操作。

详细说明见 [`../quick-cmds-static/README.md`](../quick-cmds-static/README.md)。

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
