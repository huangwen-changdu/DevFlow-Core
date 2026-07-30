# DevFlow Build Methods

Owner: `devflow-build`. Load this reference only after Core selects Build.

## Method 11: Karpathy Minimal Change

Touch only files necessary for the approved goal. Match project style, preserve contracts, avoid one-caller helpers and speculative options, and remove only code introduced by the current change when it becomes unused.

For each changed file record:

```text
Goal link:
Behavior changed:
Why this file:
Verification:
```

## Method 12: Implementation Slices

Split multi-step work into one to five testable slices. Each slice names files, user-visible or contract behavior, verification, and comment requirements. Verify a slice before moving on whenever a focused check exists.

## Build Comments

New or materially changed Node functions need comments that explain the protected contract and failure condition. Inline comments explain non-obvious reasons, not syntax. Markdown runtime contracts use headings and fixed output shapes rather than narrative comments.

