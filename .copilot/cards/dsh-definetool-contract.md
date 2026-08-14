# DSH Dynamic Tool defineTool Contract

- Trigger: 动态 Cordis 插件注册模型工具失败、harness.defineTool 报错、output.schema 校验失败、写 DSH Host 插件工具
- Lesson: `harness.defineTool` 需要 `{ name, description, parameters, execute, output }`。`output.schema` 是 dsh-tools 值模式 DSL，不是 JSON Schema：根节点必须声明 `type`；`required` 是属性级标记（`required: true` 写在属性 schema 上，不在根上写 `required: [...]` 数组）；`object` 必须显式 `additionalProperties: true|false`；`output.render(args, value)` 必须返回 ContentBlock 数组（如 `[{ type: 'text', text: String(v) }]`）；`execute` 返回 canonical lossless-JSON 值并会被 `output.schema` 校验。`parameters` 可用 JSON-Schema 风格包装。错误信息 "unsupported JSON schema: schema.required is not supported by the value schema DSL" 指向 schema 写法错误。
- Next action: Next time writing `harness.defineTool` in a dynamic plugin, first read `node_modules/@deepseek-ai/dsh-tools/lib/index.js` (`valueSchemaSpecToJsonSchema` / `defineTool`) to confirm the value-schema DSL vocabulary; do not write JSON-Schema-style `{ type:'object', properties, required:[...] }` for `output.schema`.
- Scope: project
- Related: `skills/cordis-plugin-development`, `dsh-cordis-host-runner/lib/index.js` `sandboxDefineTool`, 本仓库动态插件 status-1
- Evidence: status-1 pkg-1 失败（output 必须声明 `{schema, render}`）、pkg-2 失败（`schema.required is not supported by the value schema DSL`）、pkg-3 按 DSL 修正后 run 成功；`agent_status` set/list/clear 实测通过
- Invalidation: Revise when the harness.defineTool contract or the value schema DSL changes（重新核对 dsh-tools 源码），或插件开发迁移到其它平台运行时。
