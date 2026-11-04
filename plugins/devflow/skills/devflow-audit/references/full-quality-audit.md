# Full Quality Audit

Owner: `devflow-audit`. Load this reference before judging a repo-wide audit. It holds the detailed method behind the six dimensions in `SKILL.md`: bug, risk (security and data loss), scale, missing tests, speed, and lean code.

The lean dimension answers "what can be cut". The other five answer "what will break". Both are part of the same one-shot report; neither edits code.

## Order of importance

correct → safe → holds under the expected load → tested → fast → lean.

Lean still matters: every extra line is read, tested, and fixed later. But a lean finding never outranks a real bug.

## 1. Map before judging

- Audit what the user named: a directory, a package, a file set, or the whole repo. Nothing named means the whole repo.
- Read the README, the build and deploy config, the dependency list, the entry points (main, routes, handlers, jobs, CLI commands), and the tests.
- Find the expected load and state it in the report: one person running a script, or many users and processes at once. Judge scale against that assumed load, and say which load you assumed.
- Trace the main flows end to end: where data comes in, what is stored, what goes out. Read those paths fully — user input, money, auth, data writes, background jobs, anything shared between processes.
- Large repo: go deep where a mistake costs the most, not file by file. Name the parts you did not read.

## 2. What to look for

1. **Bug** — wrong result, crash, missed edge case (empty, zero, last item, rounding, time zones), callers that disagree with what a function returns, one rule applied differently in two places.
2. **Risk** — injection, weak randomness, secrets in code, missing checks on input from users; data loss from swallowed errors, writes in the wrong order, or no transaction.
3. **Scale** — fine for one user, wrong for many: check-then-write races, the same work done by every process, lists that only grow, a query per item, O(n²) on big input, per-process state that must be shared.
4. **Missing test** — risky logic (a branch, a parser, money, security, data writes, a bug fix) with no test that fails when it breaks. One good test, not coverage.
5. **Speed** — a real slowdown is a finding. Work repeated in a hot loop is a suggestion; some software counts every millisecond.
6. **Lean** — the delete list from `SKILL.md` (`delete`, `reuse`, `stdlib`, `native`, `yagni`, `shrink`), plus two tags for structure:
   - `merge`: near-copies that must change together.
   - `split`: one function or class doing unrelated jobs, so it is hard to read or test. Split by job, never by line count, and never into helpers that exist only to make a function shorter.

## 3. Check before reporting

- Every finding needs a concrete case: "this input or situation leads to this wrong result". No case, no finding.
- Before calling code unused, search the whole tree — tests, fixtures, config, string and dynamic references — not one grep.
- A `devflow: <ceiling>, revisit when <trigger>` marker is a recorded decision, not a finding, unless the expected load already crosses that ceiling.
- Propose the smallest fix that works, and prefer a fix that deletes code. Never add a layer, framework, or configuration the problem does not need.
- No style taste, no "consider", no vague worry.

## 4. Report

Simple language: short sentences, everyday words. Explain a technical term the first time it appears. Assume the reader has never seen this code.

Start with:

```text
What this repo does: <two or three sentences>. Assumed load: <one line>.
```

Then numbered findings in three groups, most important first; skip an empty group:

- **Must fix** — bug, security, data loss, breaks at the expected load.
- **Should fix** — risky code without a test, real slowness, duplication, a function that mixes jobs, code that should not exist.
- **Nice to have** — small speed-ups, shorter forms.

Number findings across all groups so the user can say "fix 2 and 5". At most 20 findings; when smaller ones are left out, say how many.

Every finding has all four parts, one or two short sentences each. A lean finding carries its tag in the heading:

```text
2. **Orders land on the wrong day** (`billing/close_day.py:L40-52`)
   - What this is: At midnight this job closes the day and bills that day's orders.
   - Problem: It reads "today" from the server clock, which runs in UTC, so an order placed at 00:30 in Berlin is billed the day before.
   - Fix: Compute the day once in the shop time zone: `datetime.now(ZoneInfo("Europe/Berlin")).date()`. Nothing else changes.
   - If we skip it: Late orders carry the wrong date and accounting fixes them by hand.

7. **Hand-rolled email validator** (`stdlib`, `src/validator.js:L12-38`)
   - What this is: A 27-line class that checks whether an address contains "@".
   - Problem: The standard library and a confirmation mail already cover this.
   - Fix: `"@" in email`, one line.
   - If we skip it: Nothing breaks; the file grows.
```

End with:

```text
Verdict: <healthy, or the one thing to fix first>
net: -<N> lines, -<M> dependencies possible.
Not checked: <the parts you did not read or could not run>
```

Nothing material found: still print `What this repo does` and the assumed load, then `Healthy. Nothing to fix.` and one line on what was checked.

## Boundaries

- One-shot report, not a gate. A change is proven by `devflow-prove`; a plan or diff is cut-reviewed by `devflow-cut`. An audit finding on untouched code never blocks a completion claim that has its own proof.
- One-shot report. Change no files, and do not start a fix inside the audit.
- Do not report style preference as a finding. Keep every finding tied to a concrete failure case or a concrete smaller replacement.
- Do not flag tests, validation, accessibility, auth, permission, data-loss protection, or rollback safeguards as bloat.
- Do not infer unused code from a single grep when dynamic entry points or exports may exist; mark it `candidate` or drop it.
- Lean findings use one of the eight `SKILL.md` tags and name a replacement; a bug or risk finding never borrows a lean tag to look smaller.
- If the user wants fixes, hand off to `devflow-core` with the selected findings as design input.

## Verification

- [ ] Scope and assumed load were stated.
- [ ] Connected code was read; the parts not read are named.
- [ ] Findings are numbered across the three groups and each has a concrete case.
- [ ] Lean findings carry one of the eight tags and name a replacement.
- [ ] `Verdict`, `net`, and `Not checked` are present.
- [ ] No file was changed.
