# 014 – Recipe import section-splitting consistency

Status: approved
Depends on: none

## Problem

Turning the Hungarian recipe source documents into the app's data involves the
same basic step twice: split a markdown document into its named sections (by
heading) so each section's content can be parsed on its own. The shopping-list
import already does this in a general way that correctly handles documents with
headings at two different levels (trips, then categories within a trip). The
recipe import does the same kind of splitting again, but as its own separate,
less general version that only handles one heading level.

Because the splitting step exists twice, a future recipe source document with a
heading-formatting quirk the shopping-list importer already handles correctly
(because it was built more generally) has no guarantee the recipe importer
handles it the same way — the two were never required to agree, and nothing
checks that they do.

## User stories

- As the maintainer, I want one tested way to split a markdown document into
  sections by heading, used by both the recipe and shopping-list imports, so a
  heading-format edge case fixed for one is automatically fixed for the other.
- As the person relying on the app's recipes, I want the recipe import to keep
  producing exactly the same ingredients, quantities, steps, and gluten-free flags
  it does today, so this internal change never silently changes what a recipe
  says.

## Scope

In scope:
- The section-splitting step used by the recipe import and the shopping-list
  import.
- Confirming that every recipe and the shopping list still import to exactly the
  same parsed result as before, for every existing source document.

Out of scope:
- Any change to the Hungarian source documents in `data/source/`.
- Any change to a recipe's parsed fields (title, ingredients, quantities, step
  groups, macros, tip, source) or the shopping list's parsed structure (trips,
  categories, items) — this spec only changes how the splitting step is
  implemented, never its output.
- Any change to the gluten-free-ingredient detection rule itself (the watchlist of
  products that need a verified gluten-free version) — only confirming its output
  is unaffected.

## Acceptance criteria

- **AC1** – Given the recipe source document for gulyásleves
  (`data/source/gf-ebed-gulyasleves.md`), when it is imported before and after the
  section-splitting step is consolidated, then the resulting recipe has the exact
  same title, ingredient list (including amounts and units), step groups, macros,
  tip, and source line in both cases.

- **AC2** – Given gulyásleves's ingredient "gluténmentes kenyér" (300 g, flagged as
  needing a verified gluten-free product), when the recipe is imported after the
  consolidation, then that ingredient is still flagged `mustBeGlutenFree: true`,
  unchanged (Principle 1 — the gluten-risk signal must never silently disappear or
  weaken as a side effect of an unrelated refactor).

- **AC3** – Given the shopping-list source document
  (`data/source/gf-bevasarlolista-2het.md`), when it is imported before and after
  the consolidation, then the resulting trips, categories, and items are
  unchanged.

- **AC4** – Given every recipe source document in `data/source/` (all breakfasts,
  lunches, dinners, and alternatives), when each is imported after the
  consolidation, then none fails to import and none produces a different set of
  parsed fields than it did before this spec.

- **AC5** – Given the existing unit tests for the recipe and shopping-list import,
  when the shared splitting step is extracted, then all pre-existing tests still
  pass, plus the shared splitting step has its own new unit tests covering both a
  single heading level (as recipes use) and two heading levels (as the shopping
  list uses).

## Data & rules

- Reference recipe for AC1–AC2: gulyásleves, `data/source/gf-ebed-gulyasleves.md`
  — one ingredient, 300 g "gluténmentes kenyér", already flagged
  `mustBeGlutenFree: true` in `src/data/recipes.json`; this spec requires that flag
  to survive the refactor unchanged.
- Reference document for AC3: `data/source/gf-bevasarlolista-2het.md`, the
  two-level (trip, then category) shopping-list source already handled by the more
  general existing splitter.
- "Before and after" in AC1, AC3, and AC4 means: the generated JSON output of the
  import step, compared for equality, not a manual visual check.
- This spec does not touch, and its tests do not need to re-verify, any rule for
  *which* ingredients are gluten-flagged (the watchlist itself) — only that the
  existing flags survive this specific refactor.

## Open questions

- [ ] None outstanding — scope (both importers), the behavior-preservation bar,
  and the explicit gluten-safety regression check were confirmed with the user
  during the `/spec` interview (2026-10-08).
