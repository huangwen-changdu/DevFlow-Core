---
name: devflow-docs-followup
description: "Use after a verified feature completion, when a user asks whether to record or create completion documentation, or when technical solution, frontend API handoff, or feature-flow troubleshooting documentation may be needed. Ask the current Codex user which documents to create; never create any until explicitly confirmed."
---

# DevFlow Docs Follow-Up

Ask the current Codex user whether the verified feature needs follow-up documentation. Do not create any document until the user explicitly confirms it.

## Entry Gate

1. Confirm the feature has current completion evidence, such as a `devflow-prove` `PASS` result or user-provided equivalent proof.
2. If completion evidence is absent, stop and return to the appropriate proof route. Do not ask about documentation for an unverified feature.
3. Address the current Codex user, not the feature's eventual end user.

## Inquiry

Ask once, allowing one or more selections:

```text
The feature is verified. Do you need any follow-up documentation?

1. Technical solution document
2. Frontend API handoff document
3. Feature-flow troubleshooting document
4. No documents

Reply with one or more numbers, or say none.
```

Rules:

- Treat only an explicit selection as approval to create that document type.
- Treat silence, an ambiguous reply, or an unselected item as not approved.
- Treat `none` as a completed follow-up with no files written.
- If the user selects more than one type, create only those selected types.

## Evidence And Landing

Before writing a selected document, read the current diff, implementation, tests, commands, and user-confirmed decisions. Use project documentation conventions and templates when they exist.

When the target project has no relevant convention, use these fallback locations:

| Document type | Fallback path |
|---|---|
| Technical solution | `docs/technical/YYYY-MM-DD-<short-kebab-name>.md` |
| Frontend API handoff | `docs/frontend-handoff/YYYY-MM-DD-<short-kebab-name>.md` |
| Feature-flow troubleshooting | `docs/troubleshooting/YYYY-MM-DD-<short-kebab-name>.md` |

Do not invent code paths, API contracts, payload fields, errors, or verification results. If the selected document lacks evidence, name the missing evidence and report that document as `BLOCKED`.

## Document Templates

### Technical Solution Document

Use these sections:

```text
Goal:
Context:
Affected modules and data flow:
Key decisions and trade-offs:
Implementation summary:
Verification:
Limitations and follow-up:
```

### Frontend API Handoff Document

Use these sections only for actual interface changes:

```text
Change summary:
Affected endpoint or event:
Authentication and authorization:
Request fields:
Response fields:
Errors and compatibility:
Frontend integration examples:
Verification:
```

If the selected work has no interface contract evidence, do not manufacture a handoff document. State that it is not applicable or request the missing contract source.

### Feature-Flow Troubleshooting Document

Use these sections:

```text
Entry condition:
User and system flow:
Module, service, and data path:
State transitions and decision branches:
Failure symptoms and checks:
Troubleshooting steps:
Verification:
```

## Completion Output

Report the follow-up result without hiding unselected or blocked items:

```text
Documentation follow-up:
- Completion evidence: <command or user-provided proof>
- Selected: <document types or none>
- Created: <paths or none>
- Blocked: <missing evidence or none>
- Not created: <unselected document types>
```

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "These documents are usually useful." | Useful is not approval. Ask the user first. |
| "The feature is almost complete." | Wait for completion evidence before asking. |
| "I can infer the API fields." | Only document contracts supported by current evidence. |
| "The user selected one document, so create all three." | Selection is per document type. |

## Verification

Before leaving this skill, confirm:

- [ ] Completion evidence exists.
- [ ] The current Codex user received the four-option inquiry.
- [ ] Every created document had explicit user approval.
- [ ] Every document statement is supported by current evidence.
- [ ] Unselected documents were not created.
- [ ] The completion output lists created, blocked, and unselected items.
