# @devflow-core/dsh-client-quick-cmds — DSH 客户端插件

DevFlow 快捷命令按钮：输入框上方一键发送斜杠命令（/devflow-adversarial、/devflow-prove、
/devflow-find-fault），支持在设置页自定义按钮名称/命令/后缀/顺序，配置存 localStorage 刷新不丢。
随 DSH 启动**自动默认加载**，重启不丢失，无需手动重装。

## 安装（一条命令）

```sh
npx @deepseek-ai/dsh plugin --profile web add @devflow-core/dsh-client-quick-cmds
```

装完**必须重启 web**（Ctrl+C → 重新 `npx @deepseek-ai/dsh web`）才生效。重启后输入框上方出现
「对抗审查 / view审查 / 找茬」三个胶囊按钮。

### 备选：git 直装（不经 npm registry）

仓库已推送 GitHub 时，用户也可以直接安装：

```sh
npx @deepseek-ai/dsh plugin --profile web add github:huangwen-changdu/DevFlow-Core#path:dsh/plugins/quick-cmds-static
```

更新 = 仓库推送新版本后用户重装（`remove` + `add`）。

## 从手工安装版切换（0.1.0 → 0.2.0）

0.1.0 手工版（复制目录 + 手改 `cordis.patch.yml`）与 0.2.0 插件包**不能混装**。升级前先移除手工版：

1. 删除 `~/.dsh/profiles/web/cordis.patch.yml` 中的手工 insert 块（`ui-quick-cmds` 行）：
   ```yaml
   - insert:
       - id: ui-quick-cmds
         name: '@devflow-core/dsh-client-quick-cmds'
   ```
2. 删除手工复制的包目录 `~/.dsh/profiles/node_modules/@devflow-core/dsh-client-quick-cmds/`。
3. 再执行上面的安装命令并重启 web。

> 已配置的按钮（localStorage）跨版本保留，无需重新配置。

## 默认加载机制

- `dsh plugin add` 读取包内 `dsh.bundle.patch` 声明的 `cordis.patch.yml`，把
  `ui-quick-cmds` 组合行注册进 web profile 的 bundle 层
- DSH 每次启动时 client-modules 服务自动加载该包，按钮**默认出现**
- host half（`lib/index.js`）是 minimal 挂载桩；浏览器 half（`exports ./client`）渲染按钮与设置页

## 自定义配置

设置（齿轮）→ 左侧「快捷命令」页：改按钮名称/命令/后缀/顺序（↑/↓）、增删按钮。
改动即时生效，存 localStorage 刷新不丢。

## 验证

- 输入框上方出现「对抗审查 / view审查 / 找茬」三个胶囊按钮
- 点击按钮直接发送对应斜杠命令（运行中/提交中按钮自动禁用，防双击）
- 修改配置后刷新页面，配置应保留

## 卸载

```sh
npx @deepseek-ai/dsh plugin --profile web remove @devflow-core/dsh-client-quick-cmds
```

## 维护者：发布与更新

子包源码 = `dsh/plugins/quick-cmds-static/`（本仓库）。改完 `lib/client.js` 后：

1. 确认 JSON/语法：`node --check lib/index.js lib/client.js`（在子包目录）
2. bump `package.json` 的 `version`（patch=缺陷修复，minor=功能/资产更新）
3. 检查打包内容：`npm pack --dry-run`，应列出 package.json / cordis.patch.yml / lib/ / README.md
4. 发布（npm 或 git 二选一）：

```sh
# npm 发布（需 @devflow-core org 权限，token 命令行临时注入，勿落盘）
cd dsh/plugins/quick-cmds-static
npm publish --access public --//registry.npmjs.org/:_authToken=<TOKEN>

# 或 git 直装（无需 npm）：用户安装 github:huangwen-changdu/DevFlow-Core#path:dsh/plugins/quick-cmds-static
```

完整发布前置条件、错误对照表见 [`../dsh-devflow/RELEASE.md`](../dsh-devflow/RELEASE.md)（通用流程）。
