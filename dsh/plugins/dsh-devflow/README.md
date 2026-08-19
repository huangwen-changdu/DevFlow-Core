# @devflow-core/dsh-devflow — DevFlow 插件（DSH）

把 DevFlow 完整工作流打包成 DeepSeek Harness 插件：devflow-2 agent preset、
全套 `devflow-*` skills、斜杠命令与验证脚本，一条命令安装，随插件启动自动同步。

## 安装

```sh
npx @deepseek-ai/dsh plugin --profile web add @devflow-core/dsh-devflow
```

装完**必须重启 web**（Ctrl+C → 重新 `npx @deepseek-ai/dsh web`）才生效。

重启后：

1. 新建会话，预设选择器可选 **DevFlow 2.0 (Anchored)**（两阶段锚定 + Code Mode）。
2. 会话内 `devflow-*` skills 出现在技能目录，按任务措辞自动触发。
3. `~/.dsh/commands/` 出现 `devflow*.toml` 斜杠命令，`~/.dsh/scripts/` 出现
   `devflow-*.js` 验证脚本（`node scripts/devflow-plan.js <plan>` 等）。

## 同步内容

插件启动时把包内 `assets/` 四类资产同步到用户 `~/.dsh/`：

| 资产 | 源（包内） | 目标（用户） |
|---|---|---|
| agent preset | `assets/presets/devflow-2/`（5 文件） | `~/.dsh/.agent-presets/devflow-2/` |
| skills | `assets/skills/devflow-*/`（14 个，含 references/） | `~/.dsh/skills/` |
| 斜杠命令 | `assets/commands/devflow*.toml`（11 个） | `~/.dsh/commands/` |
| 验证脚本 | `assets/scripts/devflow-*.js`（6 个 checker） | `~/.dsh/scripts/` |

## 冲突策略

- **devflow-\* 权威覆盖**：目标文件与包内源文件字节相同 → 跳过；不同 → 覆盖。
- 源不再包含的 devflow-\* 残留（升级后旧文件）→ 删除（prune）。
- **非 devflow 资产永不触碰**：用户自装的 skill（如 `atlassian`、`rtk`）、
  自定义命令/脚本一律保留，不删除不覆盖。
- **preset 目录完全由插件管理**：`~/.dsh/.agent-presets/devflow-2/` 整目录归
  插件所有，目录内非包内文件（含手动备份如 `agent.cordis.yml.bak-*`）会在
  下次同步时被清理。请勿在该目录存放自定义文件；如需自定义 preset，把
  目录复制成新预设 id 或改源码重新打包。

## 升级更新

DevFlow-Core 仓库发布新版本后，维护者流程：

```sh
node dsh/plugins/dsh-devflow/scripts/sync-assets.js   # 刷新子包资产（防漂移）
# bump dsh/plugins/dsh-devflow/package.json 版本号
npm publish                                            # 在 dsh/plugins/dsh-devflow 目录
```

已安装用户升级：

```sh
npx @deepseek-ai/dsh plugin --profile web update @devflow-core/dsh-devflow
# 或 remove + add，然后重启 web
```

重启后插件自动把新资产同步到 `~/.dsh/`（字节相同跳过，升级残留 prune）。

## 与 install:user 的关系

`npm run install:user -- --home ~/.dsh`（根仓库）仍是手动路径：把同一批
preset/skills/commands/scripts 复制到 `~/.dsh/`。本插件把同一件事变成一条
命令并随插件版本自动维护，二者并存不冲突——本插件同步时按上述冲突策略
处理已有文件。

## Windows 提示

devflow-2 预设的 `custom-bash.mjs` 需要 Git Bash 可解析：默认自动推断 Git
安装位置；若 `git` 不在 PATH，在 `~/.dsh/.agent-presets/devflow-2/agent.cordis.yml`
的 custom-bash 行显式配置 `bashPath` 指向本机 Git（参照
`docs/dsh-plugins-guide.md` 7.1 节）。

## 发布与更新

完整维护者流程（前置条件、版本 bump、发布命令、错误对照表、git 备选）见
[RELEASE.md](RELEASE.md)。简版：

```sh
cd dsh/plugins/dsh-devflow
node scripts/sync-assets.js   # 发布前必须重跑，保证资产与仓库根一致
# bump package.json 版本号
npm publish --access public --//registry.npmjs.org/:_authToken=<TOKEN>
```
