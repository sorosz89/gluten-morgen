---
version: 1
slug: "src-features-lunchswap-lunchswappage-tsx"
primary_target: "src/features/lunchSwap/LunchSwapPage.tsx"
related_targets: []
---

THESIS
Lunch swap's direction is revised a second time: colorful, card-based Fluent 2 (seed key 27135ae8)
→ now a dark-chrome/purple-backdrop/left-stripe dashboard direction (seed key 72960d8b),
user-pinned via a reference screenshot. This remains the lowest visual-stakes page, now also the
lowest-risk page in the whole redesign since it has no off-card text at all.

OWN-WORLD
Shared app-wide direction — see Today's surface brief for the full block. Seed key 72960d8b governs
this surface too; the counterweight roll was run once, app-wide. The prior round's explicit
decision to keep the native `<select>` (not swap to Fluent's `Dropdown`) is unchanged and carries
forward unmodified — this revision touches only chrome/backdrop, not that structural choice.

STORY
Unchanged: four blocks, each a status line and a select. What changes is presentation — the page
sits on the dark/purple backdrop; since both the heading and the select live inside each block's
card already, there is no off-card text on this page needing a contrast fix.

FIRST VIEWPORT
At 360px: the dark two-tier nav above the purple backdrop (filling the viewport via the same
min-height fix as the other short pages), then four unchanged block-cards.

FORM
Seed key: 72960d8b (scope: direction, mode: operate) — see Today's brief for the full challenger
weighing (none won; one validating donation on the existing hover-lift convention).

Test-risk discipline specific to this surface: zero DOM structure change — the native select/
option structure and label association are untouched; only the page background changes.

FINISH
Unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict,
DESIGN.md's structural rewrite, and every shipping raster carrying its provenance.
