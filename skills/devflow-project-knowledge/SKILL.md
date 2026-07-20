---
name: devflow-project-knowledge
description: "Use when initializing a project-knowledge pack, adding a business domain, updating confirmed business facts, or maintaining a user-confirmed project-knowledge candidate after verified work."
---

# DevFlow Project Knowledge

## Overview

本 Skill 负责两件事：
1. **项目初始化**：为新项目生成完整的 `docs/project-knowledge/` 知识包骨架
2. **业务域追加/维护**：在新业务点落地或业务梳理时，追加或更新对应的知识文档

知识包不是 graphify（关系图谱），也不是 `.copilot/cards`（踩坑记录）。它是**人工整理的业务语义文档**，回答"这个项目是什么、改 X 从哪里入手、哪里是红线"。

## 渐进披露与落地边界

普通任务的 `devflow-core` 只探测本知识包；存在时先读 `AI-START-HERE.md`，回退 `index.md`，再用 `registry.json` 定位相关业务域、模块、风险或任务入口文档，禁止全量读取知识包。

缺失的知识包、入口或注册表不阻塞任务，也不得因读取尝试创建目录。只有用户确认 `devflow-learn` 报告的代码支撑业务事实候选后，本 Skill 才创建或维护 `docs/project-knowledge/`；本 Skill 是该业务知识存储的唯一维护者。

---

## When to Use

触发以下任一信号时加载本 Skill：

- 用户说"初始化知识包""给这个项目生成 project-knowledge"
- 用户说"新增了一个业务模块/业务点，帮我更新知识文档"
- 用户说"梳理一下 XX 业务，沉淀到知识包"
- 用户完成了一个新功能的 devflow-spec/brainstorming，需要把结论落到知识包
- `devflow-learn` 在验证通过后的主动复盘识别到业务事实变更，且用户已确认维护知识包
- 知识包某个文件的 `stale_risk` 已经是 `high`，需要重新扫描更新

---

## 知识包结构

```
docs/project-knowledge/
├── AI-START-HERE.md          ← AI 进入仓库时的执行心智（必读入口）
├── index.md                  ← 阅读顺序 + 高风险边界 + 任务路由
├── registry.json             ← 机器可读索引（terms / modules / tables / apis / jobs / reuse）
├── 00-overview.md            ← 项目全局脑图（架构、运行时、目录）
├── 01-canonical-glossary.md  ← 统一术语表（业务词汇的权威定义）
├── 02-domain-entities.md     ← 核心领域实体（Entity / DTO / Enum）
├── 03-db-table-ledger.md     ← 数据库表台账（表名、字段、业务边界）
├── 04-module-responsibility-map.md ← 模块职责地图（改动落点）
├── 05-service-api-map.md     ← 服务与 API 地图（Controller → Service）
├── 06-page-route-flow-map.md ← 页面路由流图（前端/客户端消费面）
├── 07-job-task-scheduler-map.md ← 定时任务 / 队列 / 后台服务地图
├── 08-reuse-extension-map.md ← 复用点 / 扩展点地图（别重复造轮子）
├── 09-invariants-and-risk-notes.md ← 不变量与风险红线
├── 10-task-harness-playbook.md ← 任务组装 Playbook（接需求后先读什么）
├── 11-change-log.md          ← 知识包变更日志
└── {NN}-{domain}-deep-dive.md ← 业务域深挖（按需追加，从 12 开始编号）
```

---

## 阶段一：项目初始化

### 触发条件
用户说"初始化""新项目""生成知识包"，且目标项目下没有 `docs/project-knowledge/` 目录。

### 执行步骤

**Step 0（可选）：读取 graphify 扫描报告**

检查 `graphify-out/GRAPH_REPORT.md` 是否存在：
- **存在** → 提取以下信息作为后续步骤的导航：
  - 社区列表（Communities）→ 业务域候选
  - 高频节点 Top N（Hub Nodes）→ 核心实体候选
  - 入口点（Entry Points）→ 任务入口候选
  - 图谱 `lastUpdated` → 输出时效提醒（图谱过期不阻断流程，但必须提示）
- **不存在** → 输出"graphify 未找到，进入纯手工模式"，直接跳到 Step 1

社区数量 > 20 时：列出所有社区，让用户选择优先梳理的域（不超过 5 个），再继续。

**Step 0.5（仅 graphify 存在时执行）：生成扫描报告草稿**

输出候选表格，让用户确认后再进入 Step 1：

| 社区/模块 | 核心节点 | 业务域候选名称 | 是否需要 deep-dive |
|---|---|---|---|
| {社区名} | {高频节点列表} | {AI 推断的业务域名} | 是/否/待确认 |

**Step 1：扫描项目结构**（必须先做，不得脑补；graphify 存在时以社区列表为导航起点）

```
扫描目标：
- 项目根目录结构（solution / 子项目 / 主要目录）
- 入口文件（Program.cs / Startup.cs / main / app.py 等）
- 主要模块划分（Controller / Service / Repository / Model 等）
- 技术栈（框架、ORM、认证、缓存、队列）
- 现有文档（when present: README.md / docs / AGENTS.md）
```

**Step 2：生成核心骨架文件**（按顺序，每个文件生成后停下确认再继续；AI 推断的内容标 `confidence: low`，代码扫描有直接证据标 `medium`，人工明确确认后标 `high`）

生成顺序：
1. `AI-START-HERE.md` — 执行心智 + 防误判清单
2. `index.md` — 阅读顺序 + 高风险边界
3. `00-overview.md` — 全局脑图
4. `01-canonical-glossary.md` — 统一术语（先填已知的，标注待验证）
5. `04-module-responsibility-map.md` — 模块职责（最高价值，优先完成）
6. `09-invariants-and-risk-notes.md` — 风险红线（第二高价值）
7. `08-reuse-extension-map.md` — 复用点
8. `registry.json` — 机器可读索引
9. 其余文件按需生成（`02/03/05/06/07/10/11`）

**Step 3：生成 `registry.json`**

必须包含以下顶层 key：
```json
{
  "repo": "<项目根路径>",
  "lastUpdated": "<YYYY-MM-DD>",
  "docs": [...],
  "terms": {...},
  "modules": {...},
  "tables": {...},
  "apis": {...},
  "jobs": {...},
  "reuse": {...},
  "openQuestions": [...]
}
```

**Step 4：生成 `AI-START-HERE.md`**

必须包含：
- 项目是什么（一句话 + 技术栈）
- 进入任务前先冻结的 5 个问题
- 第一次进入仓库的阅读顺序（必读 + 按任务类型追加）
- 最短正确心智模型（项目分层）
- 绝对优先防的误判点（至少 3 条）
- 默认执行规则
- 改完后至少要回传什么证据

**Step 5：人工 Review 聚焦点**

人工只需确认以下内容（不要求全量复核）：
1. `09-invariants-and-risk-notes.md` 中的红线和不变量是否准确
2. `confidence=low` 的内容：是否需要立即补全，还是标 `[待验证]` 留待后续
3. 业务域边界是否与实际一致（deep-dive 文件的"业务域定位"章节）

---

## 阶段二：新业务域追加

### 触发条件
- 新功能 devflow-spec 已确认，需要把业务定义沉淀到知识包
- 新业务点上线，涉及新的 Controller / Service / Entity / Table
- 用户说"梳理一下 XX 业务"

### 执行步骤

**Step 0（可选）：graphify 社区对比**

如果 `graphify-out/GRAPH_REPORT.md` 存在，检查新业务域的核心类是否已在某个社区中：
- **已在某社区** → 说明该域与已有 deep-dive 文件可能有重叠，先确认：追加到现有文件，还是新建独立文件
- **不在任何社区** → 可能是新模块，直接进入 Step 1 新建 deep-dive 文件

**Step 1：确认业务域边界**

先问（或从 devflow-spec/brainstorming 结论中提取）：
- 业务域名称是什么？（用项目术语，不用通用词）
- 涉及哪些 Controller / Service / Entity / Table？
- 有哪些关键业务规则 / 边界条件 / 风险点？
- 与现有哪些业务域有交叉？

**Step 2：确定文件编号**

查看 `docs/project-knowledge/` 下最大编号，新文件取 `{最大编号+1}-{domain-slug}-deep-dive.md`。

**Step 3：生成 deep-dive 文件**

必须包含以下 Section（按实际情况取舍，但前 4 个必须有）：

```markdown
# {业务域名称} Deep Dive

Metadata:
- repo: {项目路径}
- last_updated: {YYYY-MM-DD}
- updated_from: {来源：devflow-spec/brainstorming/代码扫描}
- confidence: {low/medium/high}
- coverage: {覆盖范围描述}
- stale_risk: {low/medium/high}
- next_review_hint: {下次需要重新审视的触发条件}

## 业务域定位
{一句话说明这个域解决什么问题，服务哪些角色}

## 核心实体 / DTO
{列出关键 Entity、DTO、Enum，说明字段语义}

## 数据库表
{列出涉及的表，说明关键字段和业务边界}

## 服务与 API 地图
{Controller → Service 调用链，关键接口说明}

## 业务规则与边界条件
{必须遵守的规则，违反会导致数据错误或越权的条件}

## 风险点与红线
{不能随意改的地方，改了会影响哪些消费者}

## 复用点
{可以复用的 Helper / Service / Pattern}

## 典型任务入口
{接到这个域的任务时，先读哪些文件，从哪个 Controller/Service 入手}
```

**Step 4：更新 `index.md`**

在 `index.md` 中追加：
- 新域的阅读路径（在"按任务类型追加"章节）
- 新域的高风险边界（如果有）

**Step 5：更新 `registry.json`**

追加新文件的：
- `docs[]` 条目
- `terms{}` 中新业务术语的映射
- `modules{}` 中新 Controller/Service 的映射
- `tables{}` 中新表的映射
- `apis{}` 中新接口的映射

**Step 6：追加 `11-change-log.md`**

```markdown
## {YYYY-MM-DD} — 追加 {域名称} deep-dive

- 新增文件：`{NN}-{domain}-deep-dive.md`
- 覆盖范围：{一句话}
- 更新文件：`index.md`、`registry.json`
- 来源：{devflow-spec/brainstorming/代码扫描/用户梳理}
```

---

## 文件写作规范

### Metadata 块（每个文档必须有）

```markdown
Metadata:
- repo: {项目根路径}
- last_updated: {YYYY-MM-DD}
- updated_from: {来源说明}
- confidence: {low/medium/high}
- coverage: {覆盖范围}
- stale_risk: {low/medium/high}
- next_review_hint: {触发重新审视的条件}
```

### 写作原则

1. **用项目术语，不用通用词**：写"达人"不写"用户"，写"机构"不写"组织"，写"团长"不写"管理员"
2. **写事实，不写猜测**：没有代码证据的内容标注 `[待验证]` 或 `[需扫描代码确认]`
3. **写边界，不写流程**：重点说"哪里不能改""改了影响谁"，而不是复述代码逻辑
4. **写入口，不写全量**：给出"接到这类任务先看哪里"，而不是把所有代码都搬进来
5. **stale_risk 要诚实**：涉及权限/缓存/启动链路的文件，`stale_risk` 至少是 `medium`

### confidence 评分标准

| 值 | 含义 |
|---|---|
| `high` | 基于代码扫描确认，主要结构不太可能快速变化 |
| `medium` | 基于代码扫描，但细节可能有遗漏或已部分过期 |
| `low` | 基于推断或用户口述，未经代码验证 |

---

## 与其他知识层的关系

| 层 | 路径 | 本 Skill 的关系 |
|---|---|---|
| graphify | `graphify-out/` | 生成知识包前可先读 `GRAPH_REPORT.md` 了解模块社区划分，但不依赖它 |
| .copilot/cards | `.copilot/cards/` | 执行经验与复用模式；知识包是业务定义，不互相替代 |
| devflow-spec | `docs/specs/` | 新功能 devflow-spec 确认后，用本 Skill 把业务定义沉淀到知识包 |

---

## 完成复盘交接

`devflow-learn` 在每次 `devflow-prove PASS` 后主动复盘。若复盘发现代码已证明的业务事实变化，它只能报告候选；用户明确确认维护后，本 Skill 才接手，并按需创建或维护知识包。

可接收的候选：业务域、规则、边界、Entity/DTO/Enum 语义、API 或数据表边界、模块职责、任务行为、典型任务入口。

不接收：Agent 执行教训、纠错记录、验证心得、原始实现过程。它们属于 `.copilot/cards/`。纯重构、重命名、Helper 提取且无业务语义变化时，不维护知识包。

交接时先扫描代码证据，再按现有增量维护流程更新；不得因 `PASS` 或候选报告自动写入知识包。

---

## 增量维护触发规则

| 变更类型 | 触发动作 |
|---|---|
| 新业务域上线（新 Controller/Service/Entity/Table）| 追加 `{NN}-{domain}-deep-dive.md` + 更新 `index.md` + `registry.json` |
| 现有域有业务语义变化（规则变更、字段新增、边界调整）| 更新对应 deep-dive 文件 + 追加 `11-change-log.md` |
| 纯代码重构（无业务语义变化，如改方法名、提取公共方法）| **不触发**知识包更新 |
| devflow-spec 新功能确认后 | 用本 Skill 把业务定义沉淀到知识包（阶段二流程）|

---

## 完成钩子

生成或更新知识包后，必须报告：

```
知识包更新闭环：
- 操作类型：初始化 / 追加域 / 更新现有文件
- Recall source: `AI-START-HERE.md` / `index.md` / `registry.json` / none for first initialization
- 新增/更新文件：{列表}
- registry.json 更新：是/否
- index.md 更新：是/否
- change-log 追加：是/否
- 待验证项：{列出所有标注 [待验证] 的内容}
- 建议下一步：{是否需要扫描代码补充 confidence=low 的部分}
```

---

## Anti-Rationalization

| 借口 | 事实 |
|---|---|
| "普通任务先建个知识包。" | 回忆缺失不阻塞，也不创建空目录。 |
| "把所有知识文档读一遍更安全。" | 先读入口和注册表，只读取任务匹配文档。 |
| "PASS 就自动更新业务知识。" | 必须先获得用户确认，且只能记录代码支撑的业务事实。 |
| "执行教训也放进知识包。" | 执行经验归 `.copilot/cards/`，知识包只保留业务事实。 |

## Verification

离开本 Skill 前确认：

- [ ] 用户已确认业务事实候选，或本次仅完成非写入式知识召回。
- [ ] 已从 `AI-START-HERE.md`、`index.md`、`registry.json` 渐进定位相关文档，未全量读取。
- [ ] 缺失知识包或导航时已记录为非阻塞事实，未创建空目录。
- [ ] 新建或更新知识包时，`index.md`、`registry.json` 和 `11-change-log.md` 已按适用范围同步。
- [ ] 完成钩子已报告实际更新、待验证项和下一步。

## 底线

**知识包是攻略手册，不是代码注释。先扫代码确认事实，再写文档；不确定的标待验证，不脑补；写完必须更新 registry.json 和 index.md。**
