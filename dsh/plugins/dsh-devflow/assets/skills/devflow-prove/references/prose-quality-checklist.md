# DevFlow Prose Quality Checklist

Owners: `devflow-prove` and `devflow-build`. A bounded post-write check for final prose DevFlow emits.

Source: distilled from `blader/humanizer` (MIT license), itself built on Wikipedia's "Signs of AI writing" and WikiProject AI Cleanup. This is a distilled copy of the pattern list, not a vendored file; installation and usage instructions from the upstream skill are deliberately not carried over.

Scope: completion messages, commit and PR text, handoffs, and created documentation. Spec, Plan, and requirements internal contracts are exempt (they are lifecycle contracts, not delivered prose).

Red line — do not invent: a name, number, date, quote, citation, or other factual detail must come from the source material or the writer. If a sentence needs a detail that is missing, ask instead of inventing one. Personal writing keeps the writer's opinions; technical and reference prose stays neutral and plain.

## How to run

1. Mark every tell you find in the draft, strongest first.
2. Rewrite without treating the original structure as fixed; keep every supported claim.
3. Check the draft against the 25 patterns and against the original claims.
4. Ship the final version; a name, number, date, or quote not present in the source is a defect, not a candidate for embellishment.

## The 25 patterns

Numbered by strength and frequency. The first five justify an edit on a single sighting. Patterns marked *weak alone* count only when several tells share a passage, because a careful writer may use any one of them on purpose.

### A. Staging instead of stating (single-sighting edits)

| # | Pattern | Tell | Fix |
|---|---|---|---|
| 1 | Not X but Y | "It's not just X, it's Y" / "This doesn't mean X. It means Y." | State the point directly |
| 2 | One-line closers and dramatic fragments | "That is the real win." after every section; "No prior. No nostalgia." | Cut the closer that repeats; merge fragments into one specific claim |
| 3 | Sayings that sound deep | "At its core, what matters is..." / "Symmetry is the language of trust" | Replace the saying with the specific claim |
| 4 | Staged run-up before the point | "Let's dive in" / "Honestly? It depends..." | Remove the run-up and state the point |
| 5 | Arguing with no one | "This isn't mainly about..." / "A tempting approach would be..." | Remove the unraised objection or fake option; keep any real claim |

### B. Rhythm by rule

| # | Pattern | Tell | Fix |
|---|---|---|---|
| 6 | Forced triads | "innovation, inspiration, and insights"; three examples plus a lesson | Use the number of items the meaning needs |
| 7 | Repeated sentence openings | "She noted... She noted... She filed..." | Merge the sentences or change the subject |
| 8 | Dashes as the universal connector (*weak alone*) | "institutions—not the people—yet this continues—" | Use periods, commas, colons, or parentheses |
| 9 | Stacked qualifiers (*weak alone*) | "could potentially possibly be argued" | Keep only qualifiers the source supports |
| 10 | Hyphenated pairs everywhere (*weak alone*) | "the team is cross-functional" | Keep only the hyphens grammar needs |
| 11 | Passive voice and missing subjects (*weak alone*) | "No configuration file needed" | Name the actor when that helps |

### C. Inflation and borrowed authority

| # | Pattern | Tell | Fix |
|---|---|---|---|
| 12 | Overused AI words | "delve... testament... landscape... showcasing" | Use plain words |
| 13 | Inflated significance | "marking a pivotal moment" / "Despite challenges... continues to thrive" / "The future looks bright" | Keep the fact and drop the significance; end on the last concrete fact |
| 14 | Vague connection or association | "associated with the leadership of" / "in connection with" | State the relationship the source gives |
| 15 | Shallow -ing riders | "symbolizing... reflecting... showcasing..." | Keep only what the source supports |
| 16 | Sales language | "nestled within the breathtaking region" | State what the thing is |
| 17 | Borrowed authority | "Experts believe..." / a list of outlets with no attribution | Name a real source and what it said, or remove the claim or list |
| 18 | Avoiding is, are, and has | "serves as... features... boasts" | Use "is... has" |

### D. Formatting by rule

| # | Pattern | Tell | Fix |
|---|---|---|---|
| 19 | Bold as decoration | "**OKRs**, **KPIs**"; "**Performance:** Performance improved" | Remove the bold; turn a labeled list into prose |
| 20 | Decorative headings | "Strategic Negotiations And Partnerships" / "🚀 Launch Phase:" | Sentence case; remove emojis and arrows |
| 21 | Curly quotation marks (*weak alone*) | `said “the project”` | `said "the project"` |

### E. Leftovers from the chat and the draft

| # | Pattern | Tell | Fix |
|---|---|---|---|
| 22 | Chatbot residue | "Great question! ... I hope this helps!" | Remove the wrapper and keep the content |
| 23 | Knowledge-limit disclaimers and guesses | "While details are limited in available sources, it appears..." | State what the source shows, or remove the sentence |
| 24 | A heading repeated in the first sentence | "## Performance" + "Speed matters." | Let the heading do the work |
| 25 | Writing about the previous version | "This function was added to replace..." | Describe what it does now |

## Exit check

Every answer must be no, or the tell is fixed: no staged run-up, no significance dressed as a fact, no invented name, number, date, or quote, no chatbot wrapper, and no formatting applied by rule. If a fix needs a fact you do not have, ask instead of writing it.
