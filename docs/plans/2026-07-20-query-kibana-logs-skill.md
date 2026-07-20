# Implementation Plan: Query Kibana Logs Skill

## Source

`docs/specs/2026-07-20-query-kibana-logs-skill.md`

## Steps

1. Initialize `C:\Users\huangwen\.codex\skills\query-kibana-logs` with the skill-creator initializer and generated UI metadata.
2. Replace the generated `SKILL.md` with Chrome-first, read-only Kibana Discover instructions. Define optional parameters for time range, `Request.userid`, URL filter, KQL, displayed fields, and JSON extraction path; default to `Request.content.searchKey`.
3. Keep the workflow UI-driven: use supplied Discover URL when available, edit only user-supplied values, refresh, inspect visible results, safely parse JSON, and deduplicate requested values.
4. Include explicit stopped/error outcomes for missing Chrome login, empty result set, missing fields, and invalid JSON. Do not add scripts, dependencies, API requests, data writes, or exports.
5. Run `quick_validate.py` for the new skill. Review metadata and instructions against the approved example: 9 results with the two expected unique `searchKey` values.

## Files

- `C:\Users\huangwen\.codex\skills\query-kibana-logs\SKILL.md`
- `C:\Users\huangwen\.codex\skills\query-kibana-logs\agents\openai.yaml`

## Proof

- Skill validator exits successfully.
- Frontmatter activates on Kibana log queries and parameter-change requests.
- Instructions require Chrome plus an already authenticated session and rule out write/API operations.
