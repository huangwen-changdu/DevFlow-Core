# Vague Visual Feedback: Ask Placement Intent Before Editing

- Trigger: 用户对 UI 视觉/位置给出模糊反馈（"位置有歪"、"不对"、"看着别扭"）、布局被反复修正、插件/前端 UI 调整
- Lesson: 模糊视觉反馈不要推断布局意图。"歪"被先后推断为"与 composer 左缘对齐"、"水平居中"、"可拖动悬浮"，实际用户最终要的是"保持原位置不动"。对视觉反馈来说，"推断"= 反复返工；对 LLM prompt 来说可选格式=行为删除，对视觉意图来说自行推断=改错方向。
- Next action: Next time a user reports vague visual/layout feedback, first ask one pointed question with concrete placement options（左对齐/居中/保持原位/悬浮可拖），或让用户截图；do not infer the desired layout from platform conventions and do not apply a fix before the intent is confirmed.
- Scope: project
- Related: `status-1` 插件（pkg-4/5/6 三次布局修正）、`skills/devflow-pua`、`skills/devflow-brainstorm/references/interview-discipline.md`
- Evidence: 同一生命周期内状态板布局被修正 4 次（v4 左对齐 → v5 居中 → v6 悬浮可拖 → 用户最终确认"拖动不用改了，还是原来的位置就行"）；用户手动 stop/run 插件两次（run-7/run-8）后确认保持默认位置
- Invalidation: Revise when the same class of feedback is reliably resolved by the one-question clarification pattern, or when the user explicitly prefers fast inference over clarification.
