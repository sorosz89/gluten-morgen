# 002 – Implementation plan

Spec: ./spec.md

## Approach

Four layers, each built on the one before, domain first:

1. **Data loader** (`src/data/recipes.ts`) — imports the generated
   `recipes.json` and validates it once with `recipeSchema.array()` from
   spec 001, exporting a typed `Recipe[]`. This is the single point where
   untrusted/regenerable JSON becomes a trusted typed value; both the
   catalog and the detail view read from it, never from the raw JSON file.
   `tsconfig.app.json` is missing `resolveJsonModule`, so this needs adding
   it — without it, `tsc -b` cannot type a raw `import … from
   '.../recipes.json'`.

2. **Domain layer** (`src/domain/catalog.ts`, pure, unit-tested, no React):
   - `MEAL_TYPE_ORDER: MealType[]` — the fixed section order.
   - `mealTypeLabel(mealType): string` — the Hungarian label per type.
   - `groupRecipesByMealType(recipes): { mealType, label, recipes }[]` —
     buckets in fixed order, **omits** a section with zero recipes (AC1).
   - `recipeHasGlutenRiskIngredient(recipe): boolean` — `true` iff any
     ingredient has `mustBeGlutenFree: true` (AC2/AC3's badge rule).
   - `recipeMatchesQuery(recipe, query): boolean` — case-insensitive
     substring match against `title` or any ingredient `name`; empty query
     always matches (AC4/AC5).
   This keeps every rule the spec can test independent of rendering, and
   reuses the existing `Recipe`/`MealType` types from `src/domain/recipe.ts`
   rather than inventing parallel ones.

3. **Routing** — no router exists yet. Adds `react-router-dom` (v7):
   `main.tsx` wraps `<App/>` in `<BrowserRouter>`; `App.tsx` declares two
   routes, `"/"` → `CatalogPage` and `"/recipes/:id"` → `RecipeDetailPage`.
   Chosen (over local component state) so AC8's "navigate back" is a real
   URL change with native browser-back support, and a recipe has a
   shareable/bookmarkable link.

4. **Feature components** (`src/features/catalog/`):
   - `CatalogPage.tsx` — renders `groupRecipesByMealType` output as
     labeled sections of cards (title, `servingsLabel`, gluten-risk badge
     via `recipeHasGlutenRiskIngredient`); a controlled search input filters
     via `recipeMatchesQuery`, hiding empty sections and showing an
     explicit no-results message when nothing matches. Each card is a
     `<Link to={"/recipes/" + id}>`.
   - `RecipeDetailPage.tsx` — reads `:id` via `useParams`, looks the
     recipe up in the loaded `Recipe[]`, renders every field (meal type
     label, `servingsLabel`, ingredients with each `mustBeGlutenFree`
     ingredient individually flagged, `stepGroups` in order, `tip`,
     `macros`, `glutenFreeNote`, `source`), and a "Vissza a receptekhez"
     link back to `/`. An unknown `:id` redirects to `/` (`<Navigate>`) —
     not covered by an AC, kept minimal.
   CSS Modules handle layout: cards/sections wrap in a flex/grid that
   never overflows horizontally, and tap targets (cards, search input,
   back link) are sized ≥44px for AC9.

## Files

| File | New/changed | Purpose |
|---|---|---|
| `tsconfig.app.json` | changed | add `"resolveJsonModule": true` |
| `package.json` | changed | add `react-router-dom` |
| `src/data/recipes.ts` | new | validated, typed `Recipe[]` export |
| `src/data/recipes.test.ts` | new | loader returns 18 recipes, all schema-valid |
| `src/domain/catalog.ts` | new | `MEAL_TYPE_ORDER`, `mealTypeLabel`, `groupRecipesByMealType`, `recipeHasGlutenRiskIngredient`, `recipeMatchesQuery` |
| `src/domain/catalog.test.ts` | new | unit tests against real `recipes.json` data plus small fixtures |
| `src/main.tsx` | changed | wrap `<App/>` in `<BrowserRouter>` |
| `src/App.tsx` | changed | `<Routes>`: `"/"` → `CatalogPage`, `"/recipes/:id"` → `RecipeDetailPage` |
| `src/App.test.tsx` | changed | routing/navigation smoke test (AC8) |
| `src/features/catalog/CatalogPage.tsx` | new | sections, cards, gluten badge, search, no-results state |
| `src/features/catalog/CatalogPage.module.css` | new | section/card layout, tap targets |
| `src/features/catalog/CatalogPage.test.tsx` | new | AC1, AC2, AC3, AC4, AC5 |
| `src/features/catalog/RecipeDetailPage.tsx` | new | full recipe rendering, per-ingredient flag, back link |
| `src/features/catalog/RecipeDetailPage.module.css` | new | detail layout, tap targets |
| `src/features/catalog/RecipeDetailPage.test.tsx` | new | AC6, AC7 |

## Types & interfaces

```ts
// src/data/recipes.ts
export const recipes: Recipe[] // validated via recipeSchema.array().parse(raw)

// src/domain/catalog.ts
export const MEAL_TYPE_ORDER: MealType[]
export function mealTypeLabel(mealType: MealType): string
export function groupRecipesByMealType(
  recipes: Recipe[],
): { mealType: MealType; label: string; recipes: Recipe[] }[]
export function recipeHasGlutenRiskIngredient(recipe: Recipe): boolean
export function recipeMatchesQuery(recipe: Recipe, query: string): boolean
```

## Test strategy

| AC | Covered by | Test type |
|---|---|---|
| AC1 | T2, T3 | unit (`groupRecipesByMealType`) + component |
| AC2 | T2, T3 | unit (`recipeHasGlutenRiskIngredient`) + component |
| AC3 | T2, T3 | unit + component |
| AC4 | T2, T4 | unit (`recipeMatchesQuery`) + component |
| AC5 | T4 | component |
| AC6 | T5 | component |
| AC7 | T5 | component |
| AC8 | T6 | component (routing) |
| AC9 | T7 | manual check at 360px (`npm run dev`); no automated test |

## Risks

- The Hungarian label "Extra" for `mealType: "extra"` (one recipe: the
  mézes-mustáros oldalas) is a naming choice made during planning, not
  present in the source data — easy to change in `mealTypeLabel` if wrong.
- AC9 is only partly automatable: CSS is written for it, but real
  viewport reflow isn't checked by jsdom/Vitest, so it needs a manual pass.
- `react-router-dom` is a new runtime dependency; no existing code to
  reconcile with, so low integration risk.
