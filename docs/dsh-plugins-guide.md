# DSH Web 插件安装与配置指南

> 面向 Windows 用户；macOS/Linux 命令相同，路径按 `~/.dsh` 对应。
> 适用版本：`@deepseek-ai/dsh 0.1.1-rc.2`

---

## 0. 环境准备

| 依赖 | 版本（本机已验证） |
|---|---|
| Node.js | ≥ 22（本机 v24.14.0） |
| pnpm | ≥ 10（本机 v10.30.3） |
| dsh | 0.1.1-rc.2（npx 运行，无需全局安装） |

启动 dsh web（首次运行会自动创建 profile 目录 `~/.dsh/profiles/web/`）：

```powershell
npx --yes @deepseek-ai/dsh web
```

目录结构说明：

- `~/.dsh/profiles/web/` — Web profile（依赖、bundles、patch）
- `~/.dsh/profiles/node_modules/` — 公共依赖 fallback（手工放置的本地包也放这里）
- `~/.dsh/cordis.patch.yml` — 全局补丁层（作用于所有 profile）
- `~/.dsh/.agent-presets/` — Agent 预设目录

---

## 1. 安装插件（官方命令）

```powershell
npx @deepseek-ai/dsh plugin --profile web add <包名>
```

该命令自动完成：写入 `dependencies` → 注册到 `dsh.profile.bundles` → pnpm 安装。
**装完必须重启 web 才生效**（Ctrl+C → 重新 `npx @deepseek-ai/dsh web`）。

移除：

```powershell
npx @deepseek-ai/dsh plugin --profile web remove <包名>
```

GitHub 源插件（未发布到 npm 或需取 GitHub 最新）：

```powershell
npx @deepseek-ai/dsh plugin --profile web add github:omdsh-dev/dsh-notification
npx @deepseek-ai/dsh plugin --profile web add github:omdsh-dev/dsh-open-in-vscode
```

---

## 2. 基础插件（按需安装）

| 插件 | 安装命令 | 用途 |
|---|---|---|
| dsh-better-sidebar | 全家桶自带（0.15.2） | 增强侧边栏（宽度、code viewer 等） |
| dsh-browser | `dsh plugin --profile web add dsh-browser` | Chrome 侧边面板：agent 读取当前页面、抓取 HTTP 流量（需配合 Chrome） |
| dsh-chat-import | `dsh plugin --profile web add dsh-chat-import` | 会话导入（Claude/Codex/ChatGPT/Cursor/Gemini/Reasonix/opencode/ZCode/Grok/WorkBuddy 等 18 源，0.8.0 起收敛为单一 import_chat 分发器） |
| dsh-conversation-navigator | `dsh plugin --profile web add dsh-conversation-navigator` | 会话导航：按轮折叠的对话大纲面板（节点点击跳转、滚动位置高亮、轨迹视图同款配色） |
| dsh-drop-caret | `dsh plugin --profile web add dsh-drop-caret` | 拖拽文件/文件夹到输入框光标位置，插入 `@文件名` 引用 |
| dsh-message-edit | `dsh plugin --profile web add dsh-message-edit` | 消息编辑/重生成/重试/版本时间线（分支式，不改写历史，v0.2.3） |
| dsh-notification | `dsh plugin --profile web add github:omdsh-dev/dsh-notification` | 桌面通知（GitHub: omdsh-dev，v0.1.3） |
| dsh-open-in-vscode | `dsh plugin --profile web add github:omdsh-dev/dsh-open-in-vscode` | 工作区菜单"Open in VSCode"（GitHub: omdsh-dev，v0.1.6） |

注意：

- npm 上的 `dsh-notification`（nishit130 维护，0.1.1）与本机用的 omdsh-dev GitHub 源不是同一个，勿混装。
- `dsh-open-in-vscode` 未发布到 npm（已下架），只能走 GitHub 源。

---

## 3. Web UI 全家桶（推荐）

```powershell
npx @deepseek-ai/dsh plugin --profile web add @linxin666/dsh-web-all
```

> **命名沿革**：旧聚合包 `@linxin666/dsh-web-ui-all` 自 0.3.4 起停发，0.3.5 为最后双发布版本；新包名统一为 `@linxin666/dsh-web-all`。迁移流程：备份 package.json 与 pnpm-lock.yaml → `add @linxin666/dsh-web-all@0.3.5` → `remove @linxin666/dsh-web-ui-all` → 重启。

一个包带 20 个子插件（0.3.5，依赖按 package.json 实际清单）：

| 子插件 | 用途 |
|---|---|
| dsh-client-ui-plugin-manager | 插件管理 |
| dsh-client-ui-community-plugins | 社区插件目录 |
| dsh-client-ui-market | 插件市场（Workshop） |
| dsh-client-ui-aionui-panel | AionUi 右侧面板（文件树 + 预览） |
| dsh-client-ui-task-board | 任务看板 |
| dsh-client-ui-git-graph | Git 图 |
| dsh-perf | 性能统计 |
| dsh-pet | 桌面宠物 |
| dsh-remote-web-ui | 远程访问（手机扫码配对控制） |
| dsh-ssh | SSH 终端（见第 5 节构建说明） |
| dsh-tool-describe-image | 图像描述工具 |
| dsh-chat-recovery | 会话恢复 |
| dsh-liangshen | 梁神预设插件（见 7.1.1） |
| dsh-client-ui-skill-explorer | 技能浏览 |
| dsh-desktop-launcher | 桌面启动器 |
| dsh-doctor | 健康诊断（dsh-doctor） |
| dsh-client-ui-web-ui-settings | 设置区总开关（统一管理全家桶启用/配置） |
| dsh-client-ui-skin-center | 皮肤中心 |
| @mlgbnb/dsh-archive-manager | 归档管理 |
| dsh-better-sidebar | 增强侧边栏（0.15.2） |

注意：

- 子插件**捆绑激活**，不能单独安装/移除其中一个；不想要某个只能通过 `cordis.patch.yml` 禁用（见第 4 节）或整体移除全家桶。
- **不要**与同一插件的独立 npm 包混装（会冲突）。
- 升级全家桶后，`cordis.patch.yml` 中的禁用 id 需同步：旧前缀 `ui-*` / `describe-image` → 新前缀 `web-ui-*`（如 `ui-dsh-aionui-panel` → `web-ui-dsh-aionui-panel`、`describe-image` → `web-ui-describe-image`），否则 dump-config 报 entry not found 且禁用失效。

---

## 4. 可选手工补丁（profiles/web/cordis.patch.yml）

### 4.1 禁用某个插件（例：关闭 AionUi 右侧面板）

编辑 `~/.dsh/profiles/web/cordis.patch.yml`，追加：

```yaml
- id: web-ui-dsh-aionui-panel
  disabled: true
```

重启后该插件不再加载；删除这两行即恢复。

**本机当前实际补丁**（2026-08-27）：

```yaml
- insert:
    - id: ui-quick-cmds
      name: '@devflow-core/dsh-client-quick-cmds'
- id: web-ui-dsh-aionui-panel
  disabled: true
- id: message-edit
  name: dsh-message-edit
  disabled: true
- id: web-ui-describe-image
  name: '@linxin666/dsh-tool-describe-image'
  disabled: true
```

即：注入 quick-cmds 快捷命令；禁用 AionUi 右侧面板、消息编辑、图像描述。

---

## 5. SSH 终端构建脚本（可选，仅当要用 dsh-ssh）

pnpm 10 默认忽略原生模块构建脚本（`node-pty/ssh2/cloudflared/cpu-features`），SSH 终端功能需放行：

```powershell
cd ~/.dsh/profiles/web
pnpm approve-builds
```

本机 `pnpm-workspace.yaml` 的 onlyBuiltDependencies 已含上述四包：node-pty 1.1.0 走自带 win32-x64 预构建（prebuilds/pty.node，无需 VS）；ssh2 的 crypto binding 缺 VS 时自动回退纯 JS，不影响功能。

---

## 6. 全局插件（作用于所有 profile，~/.dsh/cordis.patch.yml）

### 6.1 手工 insert（例：herdr 工具）

```yaml
- insert:
    - id: tool-herdr
      name: '@deepseek-ai/dsh-tool-herdr'
      config:
        herdrBinPath: 'D:\Project\Github\herdr\target\x86_64-pc-windows-gnu\release\herdr.exe'
        session: default
        defaultTimeoutMs: 60000
```

（本机当前全局补丁仅此一项，指向本机构建产物。）

### 6.2 皮肤自动管理区（勿手改）

`dsh-skin use <名称>` 会自动在全局 patch 生成/更新 `# dsh-skin managed` 区域（记录当前禁用的皮肤）。日常换皮肤用 **设置 → 皮肤中心** 即可。

---

## 7. Agent 预设（与插件同层，可选）

在 `~/.dsh/.agent-presets/` 下建目录，放入 `agent.cordis.yml` 即注册为预设。

- 目录名即预设 id，**只能用小写字母、数字、连字符**（含点号会被 discovery 静默跳过）
- 预设文件里用 `dsh.bundle` 或 patch 组合工具/提示；可引用 `@deepseek-ai/dsh-*` 官方包（从 harness 解析）
- 注意：**config 值里不要用 `!!js` 三元表达式**（如 `!!js process.platform === 'win32' ? [...] : [...]` 会导致该预设挂载失败）；顶层 `disabled: !!js ...` 可用
- 预设 discovery 每次调用实时重读磁盘（新增/改名无需重启），但 web 前端有缓存需 F5 刷新

本机当前预设（2026-08-27）：

| 预设 | order | 说明 |
|---|---|---|
| liangshen | 4 | 梁神模式（全家桶同步，见 7.1.1） |
| anchored-standard | 5 | Anchored Standard (experimental)，两阶段常驻小目录 |
| devflow-2 | 6 | DevFlow 2.0 (Anchored)，两阶段锚定 + 提升后 Code Mode + 完整 DevFlow 人设 |
| loop-engine | 7 | Loop Engineering 循环工程：两阶段锚定开场，提升后循环工程 persona（目标/停止条件/轮次预算/产出物），内置修 bug 到绿、实现功能到绿、通用任务三类循环模板 |

---

### 7.1 Windows 上预设报错处理（PTY → custom-bash 分支）

**症状**：Windows 上使用依赖 persistent-shell（PTY 持久 bash）的预设（如 devflow-2、liangshen），bash 工具报错：

```
subprocess-local: terminal inspection is unsupported on platform win32
```

**原因**：DSH 的 PTY 后端仅支持 linux/darwin，Windows 上 persistent-shell 起不来；此外预设里写死的 `bashPath` 若指向 C 盘 Git、而本机装在 D 盘（或其他盘），bash 同样无法解析。

**修复**（每个预设目录做三处，可对照 anchored-standard 现成写法）：

1. `persistent-shell` 组加 Windows 禁用（顶层 `disabled: !!js` 可用）：

```yaml
- id: persistent-shell
  name: cordis:group
  group: true
  isolate:
    terminals: true
  disabled: !!js process.platform === 'win32'
  config:
    ...
```

2. 组后新增 `custom-bash`（Windows 独占，走普通子进程 `bash -c`，不碰 PTY）：

```yaml
- id: custom-bash
  name: ./custom-bash.mjs        # 相对路径，脚本必须复制到该预设目录
  disabled: !!js process.platform !== 'win32'
  config:
    bashPath: 'D:\Program Files\Git\bin\bash.exe'   # 按本机 Git 实际位置修改
```

3. 把 `anchored-standard/custom-bash.mjs` 复制到目标预设目录（脚本内部用 `resolveExecutable` 解析 bashPath）。

**bashPath 定位**：`where.exe git` / `git --version` 可查 Git 安装位置；Git for Windows 的 bash 在 `<安装目录>\bin\bash.exe`。本机为 `D:\Program Files\Git`。

**Code Mode（run_code）限制**：liangshen / devflow-2 配置了 `promotedPresentation: code`，promote 后只有 `run_code` 可直接调用，直接调 `bash`/`read` 等会报：

```
unknown tool "bash": only `run_code` is callable directly — call `bash` from inside a `run_code` program instead
```

若不想要该限制，删除 `promotedPresentation: code` 配置行（默认 `native`，promote 后工具直接可用）。

**注意**：Windows 下 custom-bash 是**无状态子进程**（每次 `bash -c` 新开），状态不跨调用保留——这是替代 PTY 的固有取舍。

### 7.1.1 ⚠️ liangshen 例外：插件同步覆盖，不要手工改

`@linxin666/dsh-liangshen`（全家桶子插件）是一个**预设插件**：每次 dsh 启动时把自带的 `presets/liangshen/` 按字节比对同步到 `~/.dsh/.agent-presets/liangshen/`（源里没有的文件会被删除）。因此：

- 手工修改 liangshen 预设（删 `promotedPresentation: code`、加 custom-bash 等）**下次启动即被覆盖还原**——改了白改
- 线上原版**本来就是 Code Mode（PTC）设计**：promote 后切单 `run_code` 工具线

**版本注意**：

- **0.1.19**：persistent-shell 无 win32 禁用、无 custom-bash → Windows 上 bash 报 terminal inspection
- **0.2.0**：官方内置 Windows 适配（persistent-shell win32 禁用 + custom-bash，`bashPath` 可选、默认自动推断 Git Bash）→ Windows 上 bash 可用，Code Mode 正常
- **0.3.5**（当前）：bundled 预设已内置 custom-bash.mjs，且插件只管理自己的 liangshen 目录，不触碰 devflow-2 / anchored-standard / loop-engine 等其他预设；0.3.5 含 #578（goal 自动轮次放行，避免 `/goal` 死锁）与 #1128（promote/reset 广播 `tools/presentation-changed`，供外部纪律/分析插件感知模式切换）

**结论**：liangshen **保持线上原版一致**（不手工改、不禁用插件）；0.2.0 起 Windows 直接用即可；想要无 Code Mode 的两阶段锚定用 devflow-2 / devflow。

---

### 7.2 Windows 工具可用性检查清单（防再次踩坑）

新增插件或预设后，用三条快速检查确认 Windows 兼容性：

1. **平台条件扫描**：在插件包 / 预设里搜 `process.platform`、`win32`、`node-pty`、`pty`：
   - `!!js process.platform === 'win32'` 禁用 → 该工具 Windows 上没有，需确认替代（如 tool-bash → custom-bash / tool-pwsh）
   - `node-pty` 依赖 → 终端类功能，检查 `node_modules/<包>/prebuilds/win32-<arch>/` 是否有预编译二进制（node-pty 1.x 自带 prebuilds，可免构建直接使用）
2. **bashPath 核对**：`where.exe git` 确认 Git 安装位置，custom-bash 的 `bashPath` 必须指向实际路径（本机 `D:\Program Files\Git\bin\bash.exe`）
3. **两个雷区**：不要依赖 persistent-shell（PTY 仅 linux/darwin，win32 必须禁用并由 custom-bash 补位）；遇到 `only run_code is callable directly` 就删 `promotedPresentation: code`

本机已核实（2026-08-27）：

- 预设 Windows 兼容性：
  - **liangshen**（线上原版 0.3.5）：Code Mode（PTC）+ 官方内置 custom-bash（Git Bash 自动推断）→ Windows 可用
  - **devflow-2**（源 + Windows 适配）：两阶段锚定 + Code Mode + custom-bash（无固定 bashPath，自动推断）→ Windows 可用；已同步 liangshen 0.3.5 的 #578/#1128 修复
  - **anchored-standard**：custom-bash 分支（bashPath 指向本机 Git）→ Windows 可用
  - **loop-engine**：两阶段锚定 + custom-bash → Windows 可用
- node-pty 族（dsh-better-sidebar 终端、dsh-ssh）：`prebuilds/win32-x64` 已打包 → Windows 可用；ssh2 的 cpu-features 加速可选（`pnpm approve-builds` 放行）
- dsh-open-in-vscode 自带 win32 分支，正常
- dsh-message-edit / dsh-notification / dsh-chat-import / dsh-browser / dsh-conversation-navigator / dsh-drop-caret：无平台依赖
- 已知差异（非故障）：custom-bash 描述里的 "apt/pip mirror、internet" 是 linux 持久 shell 的遗留文案，Windows 上仅描述不准确，功能不受影响

---

## 8. 常见问题

| 问题 | 处理 |
|---|---|
| 选预设后弹回默认 | 非空白会话不能切换；新建空白会话再选；或确认预设无挂载问题 |
| bash 报 terminal inspection unsupported | Windows 上 PTY 不可用：给该预设加 custom-bash 分支（见 7.1）；liangshen 0.2.0 起官方已内置，无需手动改 |
| 报 only run_code is callable | Code Mode 限制（promotedPresentation: code）：改用 run_code 包程序；或删除该配置行恢复 native |
| 插件装完不生效 | 重启 web（patch 是启动时读取的） |
| 全家桶与独立包冲突 | `dsh plugin --profile web remove` 掉其中一个 |
| dump-config 报 entry not found | 全家桶升级后禁用 id 前缀变了：旧 `ui-*`/`describe-image` → 新 `web-ui-*`（见第 3 节） |
| 皮肤中心不生效 | 检查全局 patch 的 `dsh-skin managed` 区域未被手改 |
| 想审查第三方插件 | `npm pack <包名>` 解压检查后再安装 |

---

## 附：本机当前插件清单（2026-08-27 状态）

- **profile 依赖**（`~/.dsh/profiles/web/package.json`）：
  - 官方 runtime/UI：@deepseek-ai/dsh-client-runtime（0.1.1-rc.2）、@deepseek-ai/dsh-client-ui-conversation（0.1.1-rc.2）
  - 全家桶：@linxin666/dsh-web-all（0.3.5，含 dsh-liangshen 0.3.5、dsh-better-sidebar 0.15.2 等 20 子插件）
  - 独立插件：dsh-browser（0.1.0）、dsh-chat-import（0.8.0）、dsh-conversation-navigator（0.2.0）、dsh-drop-caret（0.2.2）、dsh-message-edit（0.2.3，**已禁用**）、dsh-notification（0.1.3，GitHub 源）、dsh-open-in-vscode（0.1.6，GitHub 源）
  - 注入：@devflow-core/dsh-client-quick-cmds（patch insert，非 package.json 依赖）
- **Agent 预设状态（Windows）**：liangshen（线上原版 0.3.5）/ anchored-standard（custom-bash）/ devflow-2（源 + Windows 适配 + Code Mode + #578/#1128 同步）/ loop-engine（循环工程，两阶段锚定）；settings.yaml `agent-presets.default` = devflow-2
- **手工补丁**（profiles/web/cordis.patch.yml）：注入 ui-quick-cmds；禁用 web-ui-dsh-aionui-panel、message-edit、web-ui-describe-image
- **全局补丁**（~/.dsh/cordis.patch.yml）：insert tool-herdr（herdrBinPath 指向 D:\Project\Github\herdr 构建产物）
- **已移除**：@liustack/modlens（2026-08-27 移除，不再使用；settings.yaml 已无 modlens 配置，agent-default-model 走 deepseek provider）
- **其他**：settings.yaml `agent-default-model` = deepseek/deepseek-v4-flash-vision-exp（provider deepseek-official，reasoning high）；`permission.defaultPreset` = danger-full-access；`agent-loop.maxParallelToolCalls` = 10
