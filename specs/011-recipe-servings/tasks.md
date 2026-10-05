# 011 – Tasks

Each task is small (≈ one commit, < 1 hour), leaves `npm run check` green,
and names the ACs it serves.

- [x] T1 – Domain: portion-scaling math (AC1, AC2, AC5, AC6, AC7)
  - Test first: `src/domain/recipeScaling.test.ts` for `parseBaseCount` and
    `scaleIngredient` against the real label/ingredient shapes in
    `src/data/recipes.ts` (including "teljes tepsi, 4 napi adagra").
  - Done when: `src/domain/recipeScaling.ts` implements `parseBaseCount`,
    `scaleIngredient`, and the `DEFAULT_PORTION_COUNT`/`MIN_PORTION_COUNT`/
    `MAX_PORTION_COUNT` constants; tests pass; `npm run check` green.
  - Note: ingredient `name` fields in `recipes.json` are split at commas
    (an existing data-import quirk unrelated to this task), e.g. the
    zabkása oats line is named `"gluténmentes (GM) zabpehely (csere: köles-"`
    — tests reference the actual stored names, not the markdown prose.

- [x] T2 – Data: per-recipe portion persistence (AC8)
  - Test first: `src/data/recipePortionsRepository.test.ts` with fake
    storage, covering default-null-for-unseen-id, round-trip get/set,
    per-id isolation, and a reload simulation (second repository instance
    over the same storage).
  - Done when: `src/data/recipePortionsRepository.ts` implements
    `createRecipePortionsRepository` and the `recipePortionsRepository`
    singleton (key `zero-gluten:recipe-portions`); tests pass.

- [ ] T3 – UI: portion stepper control on the recipe detail page
      (AC1, AC3, AC4, AC8)
  - Test first: extend/create `RecipeDetailPage.test.tsx` for: default
    count display of 4; `+`/`-` recalculating amounts with no reload;
    the `-` button disabling at count 1 and the `+` button disabling at
    count 20; the chosen count being read back from
    `recipePortionsRepository` on re-render.
  - Done when: the stepper renders next to `servingsLabel` in
    `RecipeDetailPage.tsx`, wired to `recipeScaling` and
    `recipePortionsRepository`, styled in `RecipeDetailPage.styles.ts`
    with 44×44px tap targets; tests pass.

- [ ] T4 – UI: scaled ingredient rendering + edge cases
      (AC2, AC5, AC6, AC9)
  - Test first: add cases to `RecipeDetailPage.test.tsx` for: a base≠4
    recipe's default display already scaled (e.g. zabkása 70 g → 280 g);
    a to-taste ingredient's line staying literally unchanged at any count;
    a range ingredient (`amountText`) showing its original range text at
    the recipe's own base count and a scaled plain number once moved off
    it; the gluten-free badge still rendering at a scaled count.
  - Done when: `recipe.ingredients.map` feeds `scaleIngredient(...)` output
    into the existing `formatIngredientLine`; all listed tests pass;
    `npm run check` green end-to-end.
