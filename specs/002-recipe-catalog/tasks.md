# 002 – Tasks

Each task is small (≈ one commit, < 1 hour), leaves `npm run check` green,
and names the ACs it serves.

- [x] T1 – Recipe data loader (foundation)
  - Test first: `src/data/recipes.test.ts` — importing `src/data/recipes.ts`
    yields an array of 18 items, and each one passes `recipeSchema.safeParse`.
  - Done when: `"resolveJsonModule": true` added to `tsconfig.app.json`;
    `src/data/recipes.ts` imports `recipes.json` and exports `recipes:
    Recipe[]` via `recipeSchema.array().parse(raw)`; `npm run check` green.

- [x] T2 – Domain catalog helpers (AC1, AC2, AC3, AC4)
  - Test first: `src/domain/catalog.test.ts` — `groupRecipesByMealType`
    returns sections in the fixed order breakfast/lunch/dinner/
    alternative/extra and omits any section with zero recipes (use a
    fixture missing one meal type); `recipeHasGlutenRiskIngredient`
    returns `true` for "Melegszendvics" and `false` for "[Alternatíva]
    Csirkés rizses egytálétel zöldségekkel" (both from the real data);
    `recipeMatchesQuery` matches "sonka" against both a title and an
    ingredient name, matches case-insensitively, and returns `true` for
    every recipe when the query is empty.
  - Done when: `src/domain/catalog.ts` exports `MEAL_TYPE_ORDER`,
    `mealTypeLabel`, `groupRecipesByMealType`,
    `recipeHasGlutenRiskIngredient`, `recipeMatchesQuery`; all tests pass;
    `npm run check` green.
  - Note: `catalog.test.ts` (under `src/domain/`, part of `tsconfig.node.json`'s
    `module: nodenext` project) transitively imports `src/data/recipes.ts`'s
    JSON import, which `nodenext` requires an import attribute for; added
    `with { type: 'json' }` to that import in `recipes.ts` (T1) to keep
    `tsc -b` green.

- [x] T3 – Routing + CatalogPage skeleton (AC1, AC2, AC3)
  - Test first: `src/features/catalog/CatalogPage.test.tsx` — renders 5
    labeled sections in the fixed order with the right recipe counts; the
    "Melegszendvics" card shows a gluten-risk badge; the alternative rice
    card does not.
  - Done when: `react-router-dom` added to `package.json`; `src/main.tsx`
    wraps `<App/>` in `<BrowserRouter>`; `src/App.tsx` declares `"/"` →
    `CatalogPage` and `"/recipes/:id"` → a placeholder `RecipeDetailPage`;
    `CatalogPage.tsx` renders sections/cards/badges from T1+T2; `npm run
    check` green.
  - Note: `src/test/setup.ts` had no `afterEach(cleanup)` wired up (vitest
    `globals` is off, so Testing Library's implicit auto-cleanup never
    registered) — with 3 tests in one file, the second and third `render()`
    calls left the first render's DOM in place, breaking `getByText`.
    Added an explicit `afterEach(() => cleanup())`. This affects every
    component test file, not just this task's.
  - Note: `App.tsx` no longer renders the literal "Zéró Glutén Konyha"
    heading (routing moved that content into `CatalogPage`), and `Routes`
    now requires a Router ancestor, so `App.test.tsx` was updated to wrap
    `<App/>` in `<MemoryRouter>` and assert on the catalog's "Reggeli"
    section heading instead. Plan/tasks had `App.test.tsx` pegged to T6;
    this minimal update was required here to keep `npm run check` green
    after T3's routing change.

- [x] T4 – Search wired into CatalogPage (AC4, AC5)
  - Test first: typing "sonka" in the search box leaves only matching
    cards visible and hides sections with no matches; clearing the box
    restores every recipe; a query matching nothing (e.g. "xyz") shows an
    explicit no-results message instead of an empty screen.
  - Done when: search input is wired to `recipeMatchesQuery`; empty
    sections hidden while filtering; no-results state implemented; `npm
    run check` green.

- [x] T5 – RecipeDetailPage (AC6, AC7)
  - Test first: `src/features/catalog/RecipeDetailPage.test.tsx` — routing
    to `/recipes/gf-ebed-gulyasleves` renders `servingsLabel` ("4 napi
    adagra"), all 8 ingredients, the "Elkészítés" heading with all 9 steps
    in order, the `tip` text, the exact macros (822 kcal, 65 g fehérje,
    77 g szénhidrát, 670 mg só, 28 g zsír, 12 g rost), and the
    `glutenFreeNote`; only the "gluténmentes kenyér" ingredient line is
    visibly flagged, no other ingredient is.
  - Done when: `RecipeDetailPage.tsx` renders every recipe field per the
    plan; `npm run check` green.

- [ ] T6 – Card → detail navigation, back link (AC8)
  - Test first: from `CatalogPage`, clicking a recipe card navigates to
    that recipe's `/recipes/:id` route and its detail renders; clicking
    the "Vissza a receptekhez" link on the detail page navigates back to
    `/` and the catalog renders again.
  - Done when: cards are `Link`s to their detail route; detail page has a
    working back link; `src/App.test.tsx` covers the round trip; `npm run
    check` green.

- [ ] T7 – Responsive / tap-target pass (AC9)
  - Test first: none automated (jsdom doesn't do real layout) — this is
    the one AC verified by a written manual check instead.
  - Done when: `CatalogPage.module.css` / `RecipeDetailPage.module.css`
    ensure no horizontal overflow and ≥44px tap targets for cards, the
    search input and the back link; manually verified with `npm run dev`
    at a 360px viewport (browser devtools device toolbar); note the
    manual check result in this task's completion commit message.
