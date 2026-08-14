# @devflow-core/dsh-client-quick-cmds — 静态客户端插件

DevFlow 快捷命令按钮的**静态版**：随 DSH 启动**自动默认加载**，重启不丢失，无需手动重装。

## 默认加载机制

- 包装入 profile 的 node_modules 后，`cordis.patch.yml` 中的组合行使其成为 DSH 启动组合的一部分
- DSH 每次启动时，client-modules 服务自动扫描并加载该包，按钮**默认出现**
- 与动态版（每次重启后需 AI 重新安装）不同，静态版**安装一次、永久默认加载**

## 与动态版（plugin.json）的区别

| | 动态版 | 静态版（本包） |
|---|---|---|
| 安装 | 每次重启后需 AI 重装 | **一次安装，永久生效** |
| 生效方式 | cordis_define + cordis_run | 装入 profile + 组合行，随 DSH 启动加载 |
| 适用场景 | 临时试用 | 正式使用 / 分发给其他用户 |

## 安装步骤（本机）

1. **把包装进 profile 的 node_modules**（与 `@deepseek-ai/*` 同级）：

   ```powershell
   $target = "$env:USERPROFILE\.dsh\profiles\node_modules\@devflow-core"
   New-Item -ItemType Directory -Force -Path $target | Out-Null
   Copy-Item -Recurse -Force dsh\plugins\quick-cmds-static $target\dsh-client-quick-cmds
   ```

2. **注册组合行**：编辑 `$env:USERPROFILE\.dsh\profiles\web\cordis.patch.yml`，加入：

   ```yaml
   - insert:
       - id: ui-quick-cmds
         name: '@devflow-core/dsh-client-quick-cmds'
   ```

3. **重启 DSH**（`dsh --profile web`），按钮随启动自动出现。

## 验证

- 输入框上方出现「对抗审查 / view审查 / 找茬」三个胶囊按钮
- 设置 → 快捷命令 可自定义，配置存 localStorage 刷新不丢
- 重启 DSH 后按钮**自动恢复**，无需任何操作

## 更新包内容

改完 `lib/client.js` 后重新执行步骤 1 的复制，然后重启 DSH 生效。
