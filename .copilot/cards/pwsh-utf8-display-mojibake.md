# PowerShell UTF-8 显示乱码不等于文件损坏

- Trigger: pwsh Get-Content 中文乱码、PowerShell 显示乱码、UTF-8 文件校验、哈希对比文件、CJK 文件内容检查
- Lesson: Windows PowerShell 5.1 的 Get-Content 默认按 ANSI/GBK 解码无 BOM 的 UTF-8 文件，中文会显示为「寰幆宸ョ▼」类乱码；这是显示层解码问题，文件字节通常完好。核实顺序：先 (Get-FileHash 源).Hash -eq (Get-FileHash 目标).Hash 或 Get-Content -Encoding UTF8 重读，再决定是否重写；不要凭默认输出误判文件损坏而重写。
- Next action: Next time 在 pwsh 里检查含中文的文件内容，first 显式 `-Encoding UTF8` 读取或先做哈希对比，do not 依据默认解码的乱码输出判断文件损坏。
- Scope: global
- Related: DSH pwsh 工具、dsh/agent-presets/loop-engine/preset.yml（首现现场）
- Evidence: 安装 preset.yml 后 Get-Content 默认输出乱码；哈希对比三文件全 True + -Encoding UTF8 重读内容正确（「Loop Engine 循环工程」完整）
- Invalidation: 迁移到 PowerShell 7+（默认 UTF-8）或 pwsh 工具改为 UTF-8 输出后本卡过时
