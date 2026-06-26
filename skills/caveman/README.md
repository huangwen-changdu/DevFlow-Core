# Caveman Token 压缩技能

## 简介

caveman 是一个 Token 压缩优化技能，通过让 AI 代理使用"穴居人风格"的简洁语言，实现 **~75% 输出 token 减少**，同时保持技术准确性。

## 核心特性

- **输出压缩**：减少约 75% 的输出 token
- **输入压缩**：通过 `caveman-compress` 子技能重写记忆文件，减少约 46% 输入 token
- **分级压缩**：支持 lite/full/ultra/wenyan 四个强度级别
- **技术准确**：保持完整技术准确性，只移除填充词和客套话

## 使用方式

### 激活 caveman 模式

```bash
# 在对话中激活
/caveman

# 或者说
"talk like caveman"
"use caveman"
"less tokens"
"be brief"
```

### 强度级别

| 级别 | 描述 |
|------|------|
| **lite** | 移除填充词/模糊表达，保留冠词和完整句子 |
| **full** | 移除冠词，允许片段，使用短同义词（默认） |
| **ultra** | 缩写散文词，移除连词，使用箭头表示因果关系 |
| **wenyan** | 文言文风格，最大压缩 |

### 停止 caveman 模式

```bash
# 停止 caveman 模式
"stop caveman"
"normal mode"
```

## 集成到 PUA 流程

caveman 技能已集成到 PUA-Driven Spec Engineering 流程中：

1. **核心技能**：在技能系统中声明为 Token 压缩优化技能
2. **调用规则**：当需要 token 压缩优化时，加载 `caveman` skill；仅当平台不支持 skill 加载且对应用户级 skills 目录（如 `~/.codebuddy/skills/caveman/SKILL.md` 或平台约定的 `~/.skills/caveman/SKILL.md`）存在时，才读取该用户目录文件
3. **微标标识**：启用 caveman 模式时输出 `🪨 CAVEMAN · {强度级别} · Token 压缩已启用`

## 技术细节

- **来源**：https://github.com/JuliusBrussee/caveman
- **兼容性**：支持 Claude Code、Codex、Gemini、Cursor、Windsurf、Cline、Copilot 等 30+ 代理
- **安装**：通过 `npx skills add JuliusBrussee/caveman` 安装

## 最佳实践

1. **渐进式采用**：先在 `lite` 模式下测试，再逐步升级
2. **选择性使用**：在需要精确表达时使用 `full` 模式，在快速交流时使用 `ultra` 模式
3. **保持 PUA 风格**：将 caveman 的简洁性与 PUA 的严谨性结合
4. **监控效果**：使用 `/caveman-stats` 查看 token 节省统计

## 注意事项

- caveman 只影响输出 token，不影响思考/推理 token
- 在安全警告、不可逆操作确认等场景下会自动切换到正常模式
- 代码块、提交信息、PR 评论等保持正常格式