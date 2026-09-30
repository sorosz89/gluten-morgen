# 001 – Tasks

Each task is small (≈ one commit, < 1 hour), leaves `npm run check` green,
and names the ACs it serves.

- [x] T1 – Recipe domain types & Zod schema (AC1 foundation)
  - Test first: `src/domain/recipe.test.ts` — a minimal valid `Recipe`
    (all required fields, `macros` present) passes `recipeSchema.safeParse`;
    an object missing `ingredients` fails; an `Ingredient` with
    `amount: 5, unit: null` fails the refine.
  - Done when: `zod` added to `package.json`; `src/domain/recipe.ts`
    exports `mealTypeSchema`, `unitSchema`, `ingredientSchema`,
    `stepGroupSchema`, `macrosSchema`, `recipeSchema` and their inferred
    types; `npm run check` green.

- [ ] T2 – Ingredient line parser (AC4, AC5)
  - Test first: table-driven tests in `src/domain/recipeMarkdown.test.ts`
    for `parseIngredientLine`: the exact AC4 example line; the
    no-leading-number example (`amount: null`, whole line as `name`); a
    `**bold**` ingredient → `mustBeGlutenFree: true`; a non-bold
    watchlist-substring match → `true`; a plain non-matching ingredient →
    `false`; a decimal-comma range (`"1,2–1,5 kg …"`) → `amount: 1.2`,
    `amountText: "1,2–1,5"`; a hyphen range (`"2-3 evőkanál …"`); an
    unrecognized-unit fixture → throws `RecipeImportError` naming the file.
  - Done when: `parseIngredientLine` implemented in
    `src/domain/recipeMarkdown.ts`, all cases pass, `npm run check` green.

- [ ] T3 – Section splitting & step-group parsing
  - Test first: inline fixtures for `splitSections`/`parseStepGroups`
    covering: (a) a single `## Elkészítés` numbered list → 1 group; (b) two
    `## Elkészítés – X` headings (zabkása shape) → 2 groups, each with its
    own steps; (c) a prose, non-numbered heading (oldalas `Pácolás` shape)
    → 1 group with exactly 1 step; (d) a fixture with no step-ish heading
    at all → throws naming the file.
  - Done when: `splitSections` + `parseStepGroups` implemented, all cases
    pass, `npm run check` green.

- [ ] T4 – Full `parseRecipeMarkdown` wiring (AC2, AC3 shape, mealType,
      Makró, Tipp/source, gluten note)
  - Test first: one inline "complete recipe" fixture shaped like
    `gf-ebed-gulyasleves.md` (small but with all sections) asserting the
    returned object matches expectations field-by-field (title,
    servingsLabel, ingredient count, step count, macros); a fixture missing
    `## Hozzávalók` → throws `RecipeImportError` naming the file and
    "Hozzávalók" (AC2); a fixture whose title has no ` (` parenthetical at
    all (oldalas shape) → title = whole line, no throw; `classifyMealType`
    tested directly for `reggeli`/`ebed`/`vacsora`/`alternativ`/other
    filenames.
  - Done when: `parseRecipeMarkdown` fully implemented, all green.

- [ ] T5 – Import script + `npm run import` (AC1 mechanics)
  - Test first: n/a for the CLI wiring itself; `buildRecipes(sourceDir):
    Recipe[]` must be exported so T6 can test it.
  - Done when: `scripts/import-recipes.ts` reads `data/source/*.md`
    excluding the two known non-recipe files, calls `parseRecipeMarkdown` +
    `recipeSchema.parse` per file (rethrowing `ZodError` as
    `RecipeImportError`), writes pretty-printed `src/data/recipes.json`;
    `main()` prints one line per failure and sets `process.exitCode = 1` on
    any error; `tsconfig.node.json`'s `include` widened as planned; running
    `npm run import` for real produces 18 recipes.

- [ ] T6 – Real-data integration tests (AC1, AC3, AC6)
  - Test first: `scripts/import-recipes.integration.test.ts` calls
    `buildRecipes` on the real `data/source/` directly (not the generated
    JSON) and asserts: length 18; the `gf-ebed-gulyasleves` recipe has
    `mealType: "lunch"`, `servingsLabel: "4 napi adagra"`, 8 ingredients, 9
    steps total, and the exact macros object; no ingredient's `name` (not
    `note`) contains any of `bulgur, kuszkusz, durum, búzaliszt`
    (case-insensitive), across all 18 recipes.
  - Done when: passes against real files, `npm run check` green.

- [ ] T7 – Generate & commit `src/data/recipes.json`, final AC7 sweep
  - Test first: n/a — verification task.
  - Done when: `npm run import` run once and its output committed;
    `npm run check` passes end to end; confirm T1–T4's tests use only
    inline fixtures (AC7) while T6 is the sole real-data consumer.
