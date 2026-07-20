# Query Kibana Logs Skill

## Goal

Create a personal Codex skill that lets a user change Kibana Discover query parameters in Chrome and extract values from `Request.content`, including `searchKey`.

## Context

The user has a logged-in Chrome session for `https://kibana-log.changdu.vip`. A supplied Discover URL uses time range, `Request.userid`, and `url` filters. `Request.content` holds JSON payloads.

## Requirements

- Install the personal skill at `C:\Users\huangwen\.codex\skills\query-kibana-logs`.
- Use the existing logged-in Chrome session and Kibana Discover UI.
- Accept user-provided time range, `Request.userid`, URL filter, optional KQL, requested fields, and JSON path.
- Refresh the query after changing supplied parameters.
- Read visible results only, parse JSON-valued `Request.content` safely, and report result count plus deduplicated extracted values.
- Support `Request.content.searchKey` as the default extraction path.
- Report login, empty-result, missing-field, and invalid-JSON states explicitly.

## Non-goals

- Do not call Elasticsearch or Kibana APIs directly.
- Do not handle authentication, write or delete data, or export unbounded result sets.
- Do not add project runtime skills, dependencies, scripts, or configuration.

## Approach

Create a concise `SKILL.md` with Chrome/Kibana workflow and safety boundaries, plus `agents/openai.yaml` for skill discovery. Use the visible Kibana result grid as the source of truth and retain the queried page as a handoff tab when useful.

## Impact

- New personal files under `C:\Users\huangwen\.codex\skills\query-kibana-logs`.
- This spec is the only project-local artifact.

## Acceptance

- A request can state changed query parameters in natural language.
- The skill updates only supplied filters or time values, refreshes the Discover view, and returns the count and unique requested values.
- The default path returns unique `Request.content.searchKey` values.
- The skill never performs write operations or direct API requests.

## Verification

- Run the skill validator against the created skill directory.
- Inspect the generated metadata and instructions for matching trigger wording and safety boundaries.
- Use the confirmed example query: 9 rows, 8 occurrences of `The Prince Is A Girl: The Beast King's Captive Mate`, and 1 occurrence of `beat captive 2`.

## Open Questions

None.
