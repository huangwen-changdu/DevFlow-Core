# @devflow-core/dsh-devflow — 发布与更新流程

维护者指南：如何发布新版本、用户如何升级、常见错误与修复。用户安装/使用说明见
[README.md](README.md)。

## 前置条件

| 项 | 要求 |
|---|---|
| npm 账号 | 拥有 `@devflow-core` 组织（org）的写权限（创建于 npmjs.com/org/create，免费 public 方案） |
| npm token | Granular Access Token，**Read and write** + **勾选 "Bypass 2FA for publish"**（或 Automation token）。生成地址：https://www.npmjs.com/settings/<账号>/tokens |
| Node / pnpm | Node ≥22；pnpm ≥10（发布由 npm CLI 完成，但 `dsh plugin` 安装链路依赖 pnpm） |
| 仓库 | DevFlow-Core 仓库可写，`dsh/plugins/dsh-devflow/` 子包为发布源 |

> token 不要写进仓库或 .npmrc。发布时用命令行参数临时注入（见下），用完即弃；
> token 一旦在聊天/日志中暴露，发布后立即到 npm 设置页 revoke 并重新生成。

## 一次完整发布（改代码 → 发布 → 用户升级）

### 1. 修改源码或资产

需要更新的内容都在仓库根：

- 预设：`dsh/agent-presets/devflow-2/`（agent.cordis.yml / preset.yml / tool-bootstrap.mjs / custom-bash.mjs / NOTICE）
- 技能：`skills/devflow-*/`（SKILL.md 与 references/）
- 命令：`commands/devflow*.toml`
- 验证脚本：`scripts/devflow-*.js`（spec/plan/review/debt/audit/doctor）
- 插件代码：`dsh/plugins/dsh-devflow/lib/`（同步引擎 / 挂载 / announce）

### 2. 根仓库验证不回归

```sh
npm run verify:all        # 必须全绿（exit 0）
```

### 3. 刷新子包资产（防漂移）

子包 assets/ 是自包含副本，发布前必须从仓库根重新复制：

```sh
node dsh/plugins/dsh-devflow/scripts/sync-assets.js
```

预期输出四行 `synced N entries`；重复运行应幂等（第二次仍成功且无新文件）。

### 4. 子包自测

```sh
node dsh/plugins/dsh-devflow/test/sync.test.js
# 预期: DevFlow DSH plugin sync test passed（五场景: 创建/幂等/覆盖/隔离/prune）
```

### 5. 版本 bump

```sh
# 编辑 dsh/plugins/dsh-devflow/package.json 的 "version"
# 语义: patch=缺陷修复, minor=资产/功能更新, major=不兼容变更
```

发布时使用 CLI 参数临时注入 token（不落盘）：

```sh
cd dsh/plugins/dsh-devflow
node scripts/sync-assets.js   # 发布前再跑一次，保证资产最新
npm publish --access public --//registry.npmjs.org/:_authToken=<TOKEN>
```

- `--access public` 必须显式给出：scoped 包默认按私有发布，会报 `E402 Payment Required`。
- `--//registry.npmjs.org/:_authToken=` 是 npm 的 per-registry 参数注入，token 不写入 .npmrc。

### 6. 发布后验证

```sh
npm view @devflow-core/dsh-devflow version dist-tags.latest
# 预期输出: 0.1.x 与 latest: 0.1.x
```

> 新包首次发布后 registry 有约 5 分钟传播延迟，期间 `npm view` 可能 404 属正常；
> 用 `--prefer-online` 绕过本地缓存。若发布命令报 "cannot publish over the
> previously published versions"，说明该版本已存在，bump 版本号再发。

### 7. 提交并推送仓库

```sh
git add -A
git commit -m "chore(dsh-devflow): release v<新版本>"
git push origin master
```

## 用户升级

已安装用户升级到新版本：

```sh
npx @deepseek-ai/dsh plugin --profile web update @devflow-core/dsh-devflow
# 或 remove + add 后重启
```

重启 web 后插件启动时自动把新资产同步到 `~/.dsh/`：

- 字节相同的文件跳过（不覆盖用户 mtime）
- 不同的文件覆盖（devflow-* 权威）
- 源不再包含的 devflow-* 残留 prune
- 非 devflow 资产（atlassian、rtk 等）永不触碰
- `~/.dsh/.agent-presets/devflow-2/` 整目录归插件管理，目录内非包内文件会被清理

## 常见错误对照表

| 报错 | 原因 | 修复 |
|---|---|---|
| `E403 Two-factor authentication or granular access token with bypass 2fa` | token 未勾选 Bypass 2FA | 重新生成 token，勾选 "Bypass 2FA for publish" 或改用 Automation token |
| `E402 Payment Required - You must sign up for private packages` | scoped 包按私有发布 | 加 `--access public` |
| `E404 Scope not found` | `@devflow-core` 组织不存在或无权 | 先在 npmjs.com 创建 `devflow-core` org，或改用账号 scope |
| `E403 You cannot publish over the previously published versions: x.y.z` | 该版本已发布 | bump 版本号再发 |
| `npm view` 404 但 publish 成功 | registry 传播延迟 / 本地缓存 | 等 5 分钟；`npm view --prefer-online` |
| `E404 Not found`（view 时） | 包不存在或 scope 无权 | 确认发布成功（`npm view --prefer-online`），或检查 org 归属 |

## 备选：git 分发（不用 npm）

仓库已推送到 GitHub 时，用户也可以不经 npm registry 直接安装：

```sh
npx @deepseek-ai/dsh plugin --profile web add github:huangwen-changdu/DevFlow-Core#path:dsh/plugins/dsh-devflow
```

- `dsh plugin` 是 pnpm 转发器，git URL 直接透传；`#path:` 指定仓库内子目录。
- 无需 npm token/org；更新 = 推送仓库后用户重装。
- 与 npm 发布二选一即可；npm 发布提供版本化与 `dsh plugin update` 升级路径。
