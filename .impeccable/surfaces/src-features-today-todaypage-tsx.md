---
version: 1
slug: "src-features-today-todaypage-tsx"
primary_target: "src/features/today/TodayPage.tsx"
related_targets: []
---

THESIS
Today's direction has now been revised twice before this: restrained, no-cards (seed key
51efc9ba) → colorful, card-based Fluent 2 (seed key 27135ae8) → now, a third revision, to a
dark-chrome/purple-backdrop/left-stripe dashboard direction (seed key 72960d8b), user-pinned via a
reference screenshot of an unrelated enterprise dashboard. Today remains the highest-traffic
screen and leads this change, as it did the last one.

OWN-WORLD
Assigned direction: a two-tier dark navy/indigo chrome (utility bar + header bar) with a purple/
violet radial-gradient backdrop, white floating content cards, and left-edge status stripes —
user-pinned via a reference screenshot. Per Operate mode rules, the world lends type, palette,
density, and one signature move; it never supplies layout, navigation, or controls, which stay the
same standard components already in place.

Theme architecture: Fluent's `FluentProvider` theme stays the existing light `zeroGlutenTheme` —
switching to `createDarkTheme` would force re-verifying every already-proven component's contrast
for no visible benefit, since cards stay white either way (the reference image itself only darkens
the chrome, not its content). Dark/purple styling lives entirely in hand-pinned hex
(`src/styles/shellColors.ts`) applied to the nav/shell and each page's outer background only.

Palette resolution: purple/indigo becomes the new chrome/world color; rosemary green is demoted,
not removed — it keeps its existing meaning ("primary action inside a white card": buttons,
checkbox accent, link color), unchanged from the prior round. The three meal-type data hues
(breakfast gold/lunch teal/dinner plum) and the gluten-risk signal (#fbe0cc/#8a3b00) are also
unchanged in hex value — only their position moves, never their meaning or color.

Signature move: Today's meal cards switch from a top head-band to a left-edge status stripe — the
deliberate, recorded reversal of the "no decorative left-border" rule written in the prior
DESIGN.md pass. The meal-type label text moves from the old head-band into a small chip inside the
card body, reusing the same mealColors hex, not inventing a new one. The nest-cards-inside-cards
ban is unaffected and still stands.

Explicitly scoped out, stated plainly: no data table (not applicable to Today's content shape
anyway); no new icon-affordance row (no real action behind the reference's 3-icon row); no
createDarkTheme switch.

Gluten-badge collision re-check: re-run explicitly, not assumed clear. The badge always renders on
the white card body against its existing, unchanged contrast pair. Only the breakfast-gold stripe's
position changes (top to left), not its hex or what it sits against — confirmed in the comp review.

STORY
Unchanged in substance from the prior round: glance at cook-today status, scan three meals, tap
one for a recipe, or tap the edit affordance to change the rotation anchor. What changes again is
presentation — the page now sits on a dark/purple backdrop, the nav above it is a two-tier dark
chrome, and each meal card's color cue moves from its top band to a left-edge rail with the
meal-type name now living as a small chip in the card body instead.

FIRST VIEWPORT
At 360px: a slim near-black utility bar (product name only, no new interactive controls) above a
dark-indigo nav bar (unchanged links, now on shellColors tokens, active-route underline in white)
— both over the page's purple-gradient backdrop. Below: date/weekday line, cook-today status line,
then three meal cards, each with a 6px left-edge meal-type stripe, white body, meal-type chip +
title + optional gluten badge, resting shadow lifting on hover/focus. The anchor-edit affordance
and its expanded form are unchanged structurally, now floating on the dark backdrop like everything
else, still inside their own white-card context where needed.

FORM
Seed key: 72960d8b (scope: direction, mode: operate)

Challenger verdicts:
1. notation-diagram-systems-labanotation (vertical dance-notation staff, shape=direction) —
   DECLINED (loses both axes: a notation system is wrong register for a working task tool, and
   its bottom-to-top time flow has no analog in this app). No donation — too abstract to transfer.
2. pop-culture-shelf-streaming-title-card-wall (horizontal poster rails, focused tile lifts/dims) —
   DECLINED (loses both axes: full-bleed poster artwork and horizontal-scroll rails are a
   Persuade/Experience pattern, wrong for a dense Operate task list). Donation taken: "the focused
   item lifts while the rest dims" reinforces, rather than changes, the card hover/focus-lift
   already in the system (shadow4→shadow8 + translateY) — not new, just validated.
3. rw-centre-rail-reference-setting (manuscript twin-column, vermilion key-rail) — DECLINED (loses
   both axes: a print-manuscript register is wrong for a colorful dashboard direction, and its
   "no radius anywhere" rule directly conflicts with the brief). No donation.
4. digital-design-canon-metro-typographic-tiles (flat color tiles, giant cropped headlines, chrome
   deleted) — DECLINED (loses both axes: deleting chrome entirely contradicts a brief that
   specifically wants a two-tier chrome, and giant cropped type doesn't fit dense kitchen data).
   No donation.
5. crouwel-grid-specimen (visible construction grid, monumental grid-built letterforms) — DECLINED
   (loses both axes: a typographic-specimen register is wrong for a working product, and
   monumental display type has no role on this surface). No donation.
6. ikeda-datamatics (pure black/white data field, zero color) — DECLINED (loses both axes: directly
   contradicts "colorful," and its whole discipline is the absence of color). No donation.

No challenger won or held competitive on audience identification; one validating donation taken
(challenger 2, confirming the existing hover-lift convention). The user-pinned dark/purple
dashboard direction is the built direction, unmodified by any challenger borrowing.

FINISH
Unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict,
DESIGN.md's structural rewrite, and every shipping raster carrying its provenance.
