# DevFlow UI Slop Checklist

Owners: `devflow-prove` and `devflow-build`. A bounded post-write check for UI, page, and design output before handoff.

Source: distilled from `Nutlope/hallmark` (MIT license) — its "58 gates + pre-emit self-critique" list. This is a distilled copy of the criteria, not a vendored file; hallmark's own installation, stamp, log, and genre-override mechanisms are dropped, only the transferable judgments are kept. Every gate must answer **no**; any yes is a defect to fix before shipping.

Scope: generated UI, pages, components, and design artifacts. Non-visual changes skip this checklist.

## Six-axis self-critique (六轴自评)

Run this **before** the gate list, not after. Score the planned output 1–5 on each axis. Anything **< 3 on any axis triggers a revision pass** before the gate sweep — do not bring known weakness into a fifty-eight-gate review. Two passes is normal; three means the brief is wrong, not the design — re-read the brief.

| # | Axis | What you're scoring |
|---|---|---|
| A | Philosophy | Is there a clear *why* — a position the output is taking? Or is it just a layout? |
| B | Hierarchy | Can a reader tell, in 2 seconds, what's primary, secondary, tertiary? Or is everything the same weight? |
| C | Execution | Are the details (rule weight, accent footprint, text-wrap, focus rings, contrast) all in spec, or is there sloppiness even if the bones are right? |
| D | Specificity | Does this look like *this brief* — or like a generic artifact that could be anyone's? |
| E | Restraint | Have you removed everything that isn't earning its place — decoration, redundancy, padding for padding's sake? |
| F | Variety | Does this output share a structural fingerprint with a previous output in this project? Score by structural distance, not visual distance — color swaps do not count as variety. |

Record the six scores in the proof evidence so the next run can avoid repeating the same weakness.

## The 58 gates (numbered 1–57 plus 38a)

### Visual (1–7)

1. Is the display font an Inter / Roboto / Open Sans / Poppins / Lato / system-default default?
2. Is there a purple-to-blue or cyan-to-magenta gradient anywhere, including a `background-clip: text` gradient headline? No genre allows gradient text.
3. Is there a 3-equal-column card grid with icon-above-heading tiles?
4. Is any card nested inside another card?
5. Is any card using a thick colored left/right side-stripe border?
6. **Hero shape — centered everything.** Is the hero `min-height: 100vh` with everything centered, or are eyebrow, title, lede, and CTA all stacked on the same centered vertical axis? Auto-fail: pick at most two centered elements and break alignment for the rest.
7. Is pure `#000` or pure `#fff` used as a base color?

### Structural (8–9)

8. Does the output reuse a structure it shouldn't — the generic template (Hero → 3 features → CTA → footer), or the same structural fingerprint as a previous output in this project? *(Adapted: judge by reading prior outputs; the upstream log.json mechanism is dropped.)*
9. Are sections separated only by equal whitespace, with no rule, ornament, or color shift — every section identical in rhythm?

### Microinteractions (10–19)

10. Is `transition-all` (or `transition: all`) used anywhere? Specify the properties instead.
11. Is a uniform hover-scale applied across multiple unrelated elements?
12. Are bouncy / overshoot easings used on UI state changes — buttons, modals, tooltips? Overshoot is for physical interactions only.
13. Does any element have more than one hover effect at the same time (translate + scale + shadow + color + rotate)?
14. Are you animating `width`, `height`, `top`, `left`, `margin`, or `padding`?
15. Does the focus ring transition into existence? Focus rings must appear instantly.
16. Is there a celebratory success toast for an action whose effect the user can already see? Silent success is taste; toasts are for failures and invisible effects.
17. Are tooltip hover-delay and focus-delay equal? Hover should delay 800–1000 ms; focus should be 0 ms.
18. Is auto-rotating content (carousel, banner, stats) lacking pause-on-hover-and-focus? (WCAG 2.2.2.)
19. Is there a placeholder name (Jane Doe / John Smith) or a startup cliché (Acme, Nexus, Seamless, Unleash)?

### Variety (20–21)

20. Does the output repeat a macrostructure already used in this project without stating how this build differs? *(Adapted: the upstream CSS stamp mechanism is dropped; state the difference in proof evidence.)*
21. Did you default to a signature macrostructure (numbered left-margin labels + huge serif + asymmetric spans + typographic-only CTA) when the brief did not call for that energy? Specimen fall-through is banned.

### Implementation (22–27)

22. Does any neutral / surface color have zero chroma (`oklch(... 0 ...)`)? Pure grays read as flat; tint every neutral toward the anchor hue (minimum 0.005 chroma).
23. Does the accent color cover more than ~5% of any single viewport (solid fills, large accent headings, full-bleed accent backgrounds)? Accent is for emphasis, not filling.
24. Is any padding / gap / margin off the named spacing scale (multiples of 4 px)? Arbitrary `padding: 17px` is a tell.
25. Is any prose container's `max-width` outside 45–75 ch? Under 45 ch is choppy; over 75 ch loses the eye.
26. Does any interactive element lack `:focus-visible`, `:active`, or `:disabled` styling? Default + hover is two; you need at least default, hover, focus-visible, active, and disabled present.
27. Is there any `transform` / `animation` keyframe not covered by a `@media (prefers-reduced-motion: reduce)` fallback?

### Hero enrichment (28–31)

28. If the output has a demo video, does it autoplay with sound, lack a `poster`, lack `fetchpriority="high"`, or use `loading="lazy"` on the LCP element?
29. If there is an abstract background, is it more than one accent color, more than ~5% footprint, or an animating mesh gradient over the whole page?
30. **Icon tells.** Does the output mix two or more icon libraries, or use an emoji glyph (✨ 🚀 ⚡ 🔥 🎯 ✅) as a feature-card / step / pricing-tier icon? Pick one library, build a custom SVG, or drop the icon and lead with typography.
31. If there is illustration, did you default to a Lottie library when a hand-built SVG or pure-CSS shape would have worked?

### Diversification (32–33)

32. If you reused an archetype from a previous output, did you pick at least one different variation knob (tile count, spans, accent placement)? Two identical bento grids are the same bento; state the knob deltas in the proof evidence.
33. Does any visual-only `<svg>`, custom-art `<div>`, `<canvas>`, or decorative figure lack `aria-label` or `aria-hidden="true"`? Skipping this is the new accessibility tell.

### Layout safety (34–36)

34. Does the page horizontally scroll on any viewport between 320 px and 1920 px? The required fix is `overflow-x: clip` on both `html` and `body` — `clip`, not `hidden` (clip preserves `position: sticky` / `fixed` on descendants).
35. For every decorative effect on text (highlighter band, accent stroke, underline), did you visually confirm position and size? A highlighter band must sit behind the x-height, not at the baseline; underlines are 1–2 px and offset 1–2 px from the baseline; decorative strokes stay under 5% of the viewport.
36. Are interactive bars (nav, toolbar, command bar, CTA row, footer link strip) explicitly vertically centered? Every flex row mixing height-different elements must declare `align-items: center` and `line-height: 1` on items with intrinsic height.

### Typography discipline (37, 38, 38a)

37. Does the output use more than three distinct `font-family` families? Display + body + at most one outlier. A fourth family is slop; same family at different weights counts as one; mono counts as a family if used outside code blocks.
38. Is the outlier face used in more than two slots? The outlier is a register, not a third surface — wordmark + hero stat is the canonical pair. Three slots means it has become a third body font.
38a. Is any heading or display type italic? Italic headers — above all a single italicized emphasis word inside an upright headline — are a top AI tell. Headers are roman; emphasis comes from weight, accent color, or a drawn underline. Italic is allowed only as body-copy emphasis inside running paragraphs.

### Input state (39)

39. Do input / textarea / select fields handle every state? Fail on any of these five: (a) border-width shifts between states (changes go to background, outline, shadow, or border-color — never border-width); (b) focus ring built from `border` instead of `outline`; (c) input height differs from the adjacent button height on the same form (share one base height, 44 px floor); (d) helper-text slot collapses when empty (reserve `min-height: 1lh`); (e) disabled signalled by `opacity` alone (needs opacity + `cursor: not-allowed` + the native `disabled` attribute).

### Contrast & readability (40–41)

40. Does any text, icon, or `:focus-visible` ring fail its threshold against its computed background? Body text (under 24 px regular or under 18 px bold) needs WCAG 4.5:1 / APCA Lc ≥ 60; large text, icons, and focus rings need WCAG 3:1 / Lc ≥ 45. Pair every `color` with its effective `background-color` — the most-missed cases are inherited text on a switched card background and muted text on a darker paper token.
41. Fail on any of: button text within 5% lightness AND 0.05 chroma of its fill (the black-on-black bug); `--color-accent-ink` missing or unused when the accent fills a text-bearing surface; dark-section ink-on-ink (any background under 50% OKLCH lightness must also swap its text color in the same rule, with children inheriting).

### Nav · footer · hero chrome (42–45)

42. **Nav fingerprint.** Is the nav the AI default — wordmark left, 4–5 inline links centered-or-right, button right, hairline bottom border, white background? Rotate among non-default nav patterns unless the brief justifies the default.
43. **Footer fingerprint.** Is the footer the AI default — 4 link columns (Product / Company / Resources / Legal) + social-icon row + tiny copyright + hairline top border + neutral gray? Fail unless the page is a genuine docs hub.
44. **Hero fit.** Is `padding-block-end` ≥ 1.3× `padding-block-start`? And at 1280×800, can the eyebrow, headline, lede, and primary CTA all be seen without scrolling? Usual culprits: oversized display clamp, loose line-height (~1.2 instead of 1.0–1.1), a lede running 3+ lines, bloated `padding-block`. Do not overcorrect into tiny type.
45. **Decorative without purpose.** Does the hero contain a decorative element (cursor, scanline, gradient blob, ornament, badge) with no semantic anchor in the content? Decoration must be motivated: a cursor inside a typed command, a numeral that names an issue or year, a stamp that names authorship or date.

### Honest copy (46)

46. **Invented metric.** Does the output contain any quantitative claim ("10× faster", "saves 5 hours per week", "99.9% uptime") that the user did not supply and has no source? Fix by replacing the number with `—`, asking the user, or rebuilding the section without the proof slot. A stat is never the hero's sole headline — pair a lead figure with a line that says what it means.

### Re-drawn UI chrome (47)

47. **Re-drawn chrome.** Did you hand-build a fake browser bar (URL pill + traffic-light dots), a fake phone frame, a fake code-block or terminal frame, or fake IDE chrome? One of the strongest "looks AI-generated" tells — the environment already has that UI. Fix: use a real screenshot, or omit the chrome and let the content stand alone.

### Token discipline (48)

48. **Mid-render token improvisation.** Did you introduce any color value or `font-family` declaration outside the design tokens? Every color and font must reference a named token; inline hex or one-off OKLCH is improvising a theme mid-render. Fix: lift the value into the token block or replace it with an existing token.

### Responsive — clickable affordances (49)

49. **Two-line clickable text.** Does any button label, nav link, footer link, tab label, breadcrumb, or CTA wrap to two or more lines between 320 px and 1920 px? Clickable text reading on two lines looks broken. Fix: shorten the label, set `white-space: nowrap` and let the parent reflow, drop non-essential nav items at narrow widths, or collapse the nav into a menu.

### Mobile non-negotiables (50–57)

50. **Image-bearing grid track without `minmax(0, 1fr)`.** Does a `1fr` track render an image inside it? Plain `1fr` resolves with an intrinsic minimum and blows past the viewport on phones. Fix: `1fr` → `minmax(0, 1fr)`.
51. **Display headers without long-word wrap.** Does any display-size element lack `overflow-wrap: anywhere; min-width: 0`? Long hyphenated words overflow the viewport.
52. **Section-head override without mobile collapse.** Does a theme that overrides `.section__head { grid-template-columns: ... }` off `1fr` lack a matching mobile-collapse rule? Title then wraps onto the section label and the page reads broken.
53. **CSS-only radio tab pattern that scroll-jumps.** Do tab radios sit at `position: absolute; top: 0` with no JS guard? Default-position radios jump the page to the section top on every tab click. Keep radios in normal flow, or intercept clicks and focus with `{ preventScroll: true }`.
54. **Section eyebrow beside the heading.** Does any wrapper containing both an eyebrow/label/number and a heading use a multi-column grid? Auto-fail on content shape, not class name: such a wrapper must be single-column (block, flex column, or one-column grid). Vertical stack only — heading directly underneath the eyebrow.
55. **All-caps display heads with line-height < 1.0.** Does any display-size element combine `text-transform: uppercase` with line-height below 1.0? Cap-tops collide on wrap. Floor is `line-height: 1.0`; recommended 1.02–1.08.
56. **Sticky element at `top: 0` below a sticky page nav.** Are there two sticky-at-top-0 elements? The deeper element paints over the nav. Fix: offset secondary stickies to `top: var(--banner-height)` and give the nav the higher z-index. Trivially passes when the output has no sticky elements.
57. **Studied DNA discarded for a catalog theme.** Did a study diagnosis happen earlier, and did the build fall back to a canned theme without the user pivoting? Re-emit using the studied tokens directly. Trivially passes when no study exists.

## Exit check

Six axes each ≥ 3, then all 58 gates answered no. Any yes is fixed before handoff; a failure that cannot be fixed inside the approved scope returns its facts to Core rather than shipping slop.
