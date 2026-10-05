---
version: 1
slug: "src-features-catalog-catalogpage-tsx"
primary_target: "src/features/catalog/CatalogPage.tsx"
related_targets: ["src/features/catalog/RecipeDetailPage.tsx"]
---

THESIS
Catalog's direction is revised a second time: colorful, card-based Fluent 2 (seed key 27135ae8) →
now a dark-chrome/purple-backdrop/left-stripe dashboard direction (seed key 72960d8b), user-pinned
via a reference screenshot. Catalog remains the clearest card-grid page in the app and is the best
candidate for proving the left-stripe pattern at density.

OWN-WORLD
Shared app-wide direction — see Today's surface brief for the full block (theme architecture,
palette resolution, scoped-out items, gluten-badge re-check). Seed key 72960d8b governs this
surface too; the counterweight roll was run once, app-wide.

Signature move here specifically: the existing top `strip` div (meal-type color) becomes a 6px
left-edge rail on a now-flex card layout — same DOM node, same four color variants, restyled in
place, not moved into a new wrapper (preserves the existing `closest('li')`/`closest('section')`
test structure).

STORY
Unchanged: search narrows the list live, recipes group by meal type under a heading, a card leads
to its recipe detail. What changes is presentation — the page sits on the dark/purple backdrop, and
each card's meal-type color cue is now a left rail instead of a top strip.

FIRST VIEWPORT
At 360px: the dark two-tier nav (shared across all pages) above the purple-gradient backdrop, then
the search box floating directly on that backdrop (white pill, contrast-checked against the dark
ground), then meal-type sections, each a single-column list of left-striped cards. At ≥640/1024/
1366px the grid still goes 2/3/4-column as before — only the stripe position and backdrop changed,
not the responsive behavior. Recipe detail (covered by this same brief) is backdrop-only: no card
grid exists on that page, so no stripe treatment applies there.

FORM
Seed key: 72960d8b (scope: direction, mode: operate) — see Today's brief for the full challenger
weighing (none won; one validating donation on the existing hover-lift convention).

Test-risk discipline specific to this surface: the `strip` div's CSS properties change (height→
width, top→left positioning) but it stays the same DOM node inside the same `<Link>` — no new
wrapper. The floating search box's white-on-dark contrast is confirmed in the comp review before
being trusted in the real build.

FINISH
Unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict,
DESIGN.md's structural rewrite, and every shipping raster carrying its provenance.
