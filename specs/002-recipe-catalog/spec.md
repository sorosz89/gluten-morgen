# 002 – Recipe catalog & detail view

Status: implemented
Depends on: 001

## Problem

The 18 recipes imported in spec 001 (`src/data/recipes.json`) have no UI yet — the
only way to read one today is to open the JSON or the original markdown. The
person planning and cooking needs a phone-friendly way to browse every recipe
grouped by meal type, quickly see which ones need a gluten-free product swap,
and open any recipe to read the full ingredients and steps while cooking.

## User stories

- As the planner, I want to browse all recipes grouped by meal type, so I can
  quickly see what's available for breakfast, lunch, dinner, or as an
  alternative/extra.
- As the planner, I want to search recipes by name or ingredient, so I can
  find one without scrolling through every section.
- As the cook, I want to see at a glance which recipes need a gluten-free
  product swap, so I know before I start whether I need a special ingredient.
- As the cook, I want the full recipe (ingredients, steps, macros, tip,
  gluten-free note) on one screen, so I can cook without the original
  markdown open.

## Scope

In scope:
- A catalog screen listing every recipe in `src/data/recipes.json`, grouped
  into sections by meal type, in a fixed order: breakfast, lunch, dinner,
  alternative, extra.
- A recipe card per recipe showing at least its title and `servingsLabel`.
- A gluten-risk badge on any card whose recipe has at least one ingredient
  with `mustBeGlutenFree: true`.
- A text search box that filters recipes by title or ingredient name
  (case-insensitive substring match) across all sections at once.
- Opening a recipe card navigates to a detail view for that recipe; a way to
  return to the catalog.
- The detail view renders every field the recipe has: title, meal type,
  `servingsLabel`, full ingredient list, step groups (with headings, in
  order), `tip`, `macros`, `glutenFreeNote`, `source`.
- In the detail view's ingredient list, each ingredient with
  `mustBeGlutenFree: true` is individually, visibly flagged (not just a
  recipe-level badge).
- Usable one-handed at 360px width (constitution principle 3).

Out of scope:
- Swapping an alternative recipe into the rotation, or any interactive
  "use this instead" action (backlog #007).
- The "Today" / rotation screen and "do I need to cook today" logic
  (backlog #003).
- Scaling ingredient quantities to family size (backlog #004).
- Filtering/sorting beyond meal-type sections and the text search (e.g. by
  macros, prep time).
- Creating, editing, or deleting recipes.
- A custom meal planner for building plans outside the fixed rotation
  (tracked separately as a new backlog item, not specced here).

## Acceptance criteria

- **AC1** – Given the catalog screen, when it loads, then every recipe from
  `src/data/recipes.json` appears exactly once, grouped into sections in the
  order breakfast, lunch, dinner, alternative, extra, and each section is
  visibly labeled (Hungarian) and only appears if it has at least one recipe.

- **AC2** – Given a recipe that has at least one ingredient with
  `mustBeGlutenFree: true` (e.g. "Melegszendvics", whose "gluténmentes
  zsemle vagy kenyér" is flagged), when its card renders in the catalog,
  then the card shows a visible gluten-risk badge/icon.

- **AC3** – Given a recipe where no ingredient has `mustBeGlutenFree: true`
  (e.g. "[Alternatíva] Csirkés rizses egytálétel zöldségekkel"), when its
  card renders, then no gluten-risk badge appears on it.

- **AC4** – Given the search box, when the user types a query that matches a
  recipe title or an ingredient name (e.g. typing "sonka" matches both
  "Melegszendvics" and "Sonkás tükörtojás", via their ham ingredient), then
  only matching recipes remain visible, and sections with no remaining
  matches are hidden; when the query is cleared, all recipes reappear.

- **AC5** – Given the search box, when the query matches no recipe title or
  ingredient, then the catalog shows an explicit "no results" message
  instead of an empty screen.

- **AC6** – Given the catalog, when the user opens a recipe card (e.g.
  "Gulyásleves"), then the detail view shows its `servingsLabel`
  ("4 napi adagra"), its full ingredient list, its step groups with heading
  "Elkészítés" and all 9 steps in order, its `tip`, its `macros`
  (822 kcal, 65 g fehérje, 77 g szénhidrát, 670 mg só, 28 g zsír, 12 g rost),
  and its `glutenFreeNote`.

- **AC7** – Given a recipe detail view, when the ingredient list renders,
  then every ingredient with `mustBeGlutenFree: true` is visibly flagged
  next to that specific ingredient (e.g. in "Gulyásleves", the "300 g
  gluténmentes kenyér" line is flagged while the other ingredients are not).

- **AC8** – Given a recipe detail view, when the user navigates back, then
  they return to the catalog screen.

- **AC9** – Given any screen in this feature at a 360px viewport width, when
  rendered, then all recipe cards, the search box, and the detail view's
  content are fully readable with no horizontal scrolling, and tap targets
  (cards, back navigation) are large enough for one-handed phone use.

## Data & rules

- Source of truth: `src/data/recipes.json` (produced by spec 001's import),
  validated by `recipeSchema` in `src/domain/recipe.ts`. This feature reads
  that data; it does not transform or re-derive it.
- Meal type section order and Hungarian labels: `breakfast` → "Reggeli",
  `lunch` → "Ebéd", `dinner` → "Vacsora", `alternative` → "Alternatíva",
  `extra` → "Extra".
- Gluten-risk badge rule (constitution principle 1: "Any ingredient that
  needs a gluten-free version ... is visibly flagged everywhere it
  appears"): the badge/flag is driven purely by each ingredient's
  `mustBeGlutenFree` boolean already present in the data — this feature does
  not decide which ingredients are risky, only renders the existing flag.
- Search matches on `title` and on each ingredient's `name`, case-insensitive
  substring, no fuzzy matching.
- Concrete detail-view example ("Gulyásleves", `data/source/gf-ebed-gulyasleves.md`):
  4 napi adagra, 8 ingredients (only "gluténmentes kenyér" flagged), one step
  group "Elkészítés" with 9 steps, a "Tipp" paragraph, macros
  822/65/77/670/28/12, and a `glutenFreeNote` about not reusing the same
  cutting board/toaster as regular bread.

## Open questions

None — resolved during the interview: catalog stays scoped to browse +
search + detail (no predefined-plan or custom-planner content); a custom
meal planner is tracked as a new backlog item instead.
