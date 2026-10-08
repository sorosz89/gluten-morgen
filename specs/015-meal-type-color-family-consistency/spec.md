# 015 – Meal-type color-family consistency

Status: approved
Depends on: none

## Problem

Every meal is colored by its type — breakfast, lunch, or dinner — on the Recipe
catalog, the Today screen, the Recipe detail page, and the Schedule page. The
rotation's "alternative" and "extra" recipes aren't one of those three base types,
so each of these screens has to decide on its own which color family an
alternative or extra recipe borrows. Four of the five places that make this
decision agree today (borrow lunch's color), but that agreement is a coincidence
of separate pieces of code happening to make the same choice — nothing requires
them to keep agreeing, and nothing would catch it if one of them drifted. The
fifth already drifted: the Catalog page's own card-rail color currently falls back
to a neutral gray instead of lunch, so an alternative or extra recipe's card today
shows a lunch-colored chip next to a gray rail on the same card.

## User stories

- As the person using the app, I want an alternative recipe's color to be the same
  wherever I see it — catalog, today, the recipe itself, the weekly schedule — so
  the color consistently means the same thing at a glance, not something that
  happens to usually agree.
- As the maintainer, I want the alternative/extra color fallback decided in one
  place, so a future change to it (or a new non-base meal type) is made once and
  automatically applies everywhere a meal's color appears, instead of requiring
  four separate edits that could disagree.

## Scope

In scope:
- The decision of which color family (breakfast, lunch, or dinner) represents a
  given meal type, including the fallback used for "alternative" and "extra"
  recipes, wherever that decision is currently made on the Catalog, Today, Recipe
  detail, and Schedule pages.

Out of scope:
- Any change to the color values themselves (the breakfast/lunch/dinner hex
  values and their meaning stay exactly as they are today).
- Picking a new fallback for alternative/extra recipes — this spec keeps lunch,
  the fallback already used by the meal-type chip, the Today card rail, the
  Recipe detail accent, and the Schedule chip. The one exception is the Catalog
  page's own card-rail color, which currently disagrees (falls back to a neutral
  gray instead of lunch, even though the chip on the same card already shows
  lunch) — AC1 requires the whole Catalog card to show one consistent color, so
  this spec corrects that one rail to lunch rather than leaving it as a sixth
  special case.
- Any change to each page's own visual presentation of its chip, rail, stripe, or
  badge beyond having it ask the shared decision instead of deciding locally — for
  example, the Schedule page may keep its own current code shape for applying the
  color, as long as the color-family choice itself comes from the shared decision.
- The gluten-risk badge's color — that is a separate signal (Principle 1) and is
  not a meal-type color.

## Acceptance criteria

- **AC1** – Given a recipe with meal type "alternative" or "extra" (e.g. the
  alternative recipe "Sült lazacfilé citromos burgonyapürével és gőzölt
  brokkolival", `data/source/gf-alternativ-sult-lazac.md`), when it is shown on
  the Catalog page's card (both its chip and its rail), the Today page's card,
  the Recipe detail page's accent, and the Schedule page's meal chip, then all
  five use the same color family (lunch), and that choice is made by one shared
  decision rather than five independent ones.

- **AC2** – Given a recipe with meal type "breakfast", "lunch", or "dinner", when
  it is shown across the same surfaces, then each surface displays that meal's
  own correct color family, unchanged from today's behavior.

- **AC3** – Given the existing tests for the Catalog, Today, Recipe detail, and
  Schedule pages' meal-type coloring, when the decision is centralized, then all
  pre-existing tests still pass, plus the shared decision itself has a new unit
  test covering all five meal types (breakfast, lunch, dinner, alternative,
  extra), plus a new test on the Catalog page confirming its card rail now
  matches its chip for an alternative/extra recipe.

## Data & rules

- The three color families and their current meaning are unchanged: breakfast,
  lunch, dinner — see `specs/constitution.md` and the existing per-feature chip/
  rail/stripe components. This spec only consolidates *which* family a given meal
  type maps to, never the families' own colors.
- Reference recipe for AC1: `data/source/gf-alternativ-sult-lazac.md` (meal type
  "alternative" in `src/data/recipes.json`), already resolving to the lunch color
  family everywhere except the Catalog page's card rail today.
- The Catalog page's card-rail discrepancy (neutral gray instead of lunch for
  alternative/extra recipes) was found during planning, not during the original
  `/spec` interview — confirmed with the user afterward that fixing it (rather
  than leaving it as a separate, undocumented special case) is in scope.
- No gluten-safety acceptance criterion applies here: meal-type color is a
  distinct signal from the gluten-risk badge (Principle 1), and this spec does not
  touch the gluten-risk badge or its color in any way.

## Open questions

- [ ] None outstanding — scope (all five surfaces, including Catalog's card
  rail), keeping the existing lunch fallback and existing color values
  unchanged, and leaving each page's own local code shape otherwise untouched
  were confirmed with the user during the `/spec` interview (2026-10-08) and,
  for the Catalog-rail discrepancy specifically, during `/plan-spec` planning
  (2026-10-08).
