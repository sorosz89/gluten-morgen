---
version: 1
slug: "src-features-shopping-shoppingpage-tsx"
primary_target: "src/features/shopping/ShoppingPage.tsx"
related_targets: []
---

THESIS
Shopping's direction is revised a second time: colorful, card-based Fluent 2 (seed key 27135ae8) →
now a dark-chrome/purple-backdrop/left-stripe dashboard direction (seed key 72960d8b), user-pinned
via a reference screenshot. Shopping is the most data-nested page and the one real test site for
whether off-card text (the family-size field) reads legibly against the new dark backdrop.

OWN-WORLD
Shared app-wide direction — see Today's surface brief for the full block. Seed key 72960d8b governs
this surface too; the counterweight roll was run once, app-wide. The destructive-action-isolation
discipline from the prior round (Lista törlése, isolated footer row) is unchanged and carries
forward unmodified.

Explicitly unchanged here: trip cards do NOT gain a left-edge stripe — Shopping groups by shopping
trip, not meal type, so forcing a meal-type hue onto a trip card would misrepresent the grouping.
This was true before this revision and stays true now.

STORY
Unchanged: family size scales every quantity, three trip cards each hold their categories and
items, checking cancels rather than deletes, clearing a trip is a deliberate isolated action. What
changes is presentation — the page sits on the dark/purple backdrop, and the family-size field
(which lives directly on the page background, not inside a card) needs a legible treatment against
the new dark ground rather than its old white-page-tuned gray.

FIRST VIEWPORT
At 360px: the dark two-tier nav above the purple backdrop, then the family-size field (label/input
recolored for the dark ground — this is a required fix, not optional, confirmed in the comp before
the real build), then trip cards unchanged in structure (white, elevated, isolated destructive
footer), each category grid unchanged (2/3-up at wider widths).

FORM
Seed key: 72960d8b (scope: direction, mode: operate) — see Today's brief for the full challenger
weighing (none won; one validating donation on the existing hover-lift convention).

Test-risk discipline specific to this surface: zero DOM structure change — the `categoryHeading.
closest('div')` and `closest('li')` queries this page's tests depend on are untouched, since only
the page background and the one off-card label's color change.

FINISH
Unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict,
DESIGN.md's structural rewrite, and every shipping raster carrying its provenance.
