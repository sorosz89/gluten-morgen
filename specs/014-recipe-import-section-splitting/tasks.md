# 014 – Tasks

Each task is small (≈ one commit, < 1 hour), leaves `npm run check` green,
and names the ACs it serves.

- [ ] T1 – `markdownSections.ts` shared splitter + its own direct tests (AC5)
  - Test first: `markdownSections.test.ts` — single heading level (`##` only,
    recipe-shaped); two nested levels (`##` then `###` within one section's
    body, shopping-list-shaped); no heading present → empty array; content
    before the first heading is dropped (names today's existing behavior).
  - Done when: `src/domain/markdownSections.ts` exists, all those tests pass,
    `npm run check` green.

- [ ] T2 – Migrate `recipeMarkdown.ts` onto the shared splitter (AC1, AC2, AC4, AC5)
  - Test first: repoint `recipeMarkdown.test.ts`'s `splitSections`/`Section`
    import at `markdownSections.ts`; no behavior assertions change.
  - Done when: local `splitSections`/`Section` removed from
    `recipeMarkdown.ts`; all existing `recipeMarkdown.test.ts` +
    `import-recipes.integration.test.ts` cases pass unmodified; `npm run
    check` green.

- [ ] T3 – Migrate `shoppingListMarkdown.ts` onto the shared splitter (AC3, AC4, AC5)
  - Test first: n/a new imports needed (splitter was never imported directly
    by its test file); existing `shoppingListMarkdown.test.ts` +
    `import-shopping-list.integration.test.ts` cases must keep passing.
  - Done when: local `splitSections`/`RawSection` removed; `TRIP_HEADING_RE`/
    `CATEGORY_HEADING_RE` calls now go through the shared function; `npm run
    check` green.

- [ ] T4 – Zero-diff verification against real source data (AC1, AC2, AC3, AC4)
  - Test first: n/a — verification task, run after T1–T3.
  - Done when: `npm run import && npm run import:shopping` regenerates
    `src/data/recipes.json` and `src/data/shoppingList.json`; `git diff
    --stat` on both shows no changes (explicitly confirms gulyásleves's
    "gluténmentes kenyér" ingredient still shows `"mustBeGlutenFree": true`,
    since any change there would show up as a diff).
