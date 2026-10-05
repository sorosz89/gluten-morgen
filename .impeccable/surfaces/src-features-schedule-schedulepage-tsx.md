---
version: 1
slug: "src-features-schedule-schedulepage-tsx"
primary_target: "src/features/schedule/SchedulePage.tsx"
related_targets: []
---

THESIS
Schedule's direction is revised a second time: colorful, card-based Fluent 2 (seed key 27135ae8)
→ now a dark-chrome/purple-backdrop/left-stripe dashboard direction (seed key 72960d8b),
user-pinned via a reference screenshot. Schedule remains Today's week-ahead sibling.

OWN-WORLD
Shared app-wide direction — see Today's surface brief for the full block. Seed key 72960d8b governs
this surface too; the counterweight roll was run once, app-wide.

Explicitly unchanged here: day cards and their inline meal-type chips stay as pills, not stripes —
a 6px rail doesn't fit an inline pill chip. The "last day of block" tag stays its own neutral
treatment, not a data-series hue, unchanged from the prior round.

STORY
Unchanged: seven day-cards, a cooking day expands to its meal list. What changes is presentation —
the page sits on the dark/purple backdrop, and the empty-state prompt/anchor-link (which lives
directly on the page background when no anchor is set) needs a legible treatment against the dark
ground rather than its old white-page-tuned green.

FIRST VIEWPORT
At 360px: the dark two-tier nav above the purple backdrop, then either the empty-state prompt
(recolored for the dark ground — required fix, confirmed in the comp) or seven day-cards, unchanged
in structure, each still showing meal-type color via its existing pill chips.

FORM
Seed key: 72960d8b (scope: direction, mode: operate) — see Today's brief for the full challenger
weighing (none won; one validating donation on the existing hover-lift convention).

Test-risk discipline specific to this surface: zero DOM structure change — every day/meal
assertion in this page's tests resolves via `getByText(...).closest('li')`, untouched by this
revision; only the page background and the one off-card text's color change.

FINISH
Unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict,
DESIGN.md's structural rewrite, and every shipping raster carrying its provenance.
