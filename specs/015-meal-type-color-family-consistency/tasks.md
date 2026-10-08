# 015 – Tasks

Each task is small (≈ one commit, < 1 hour), leaves `npm run check` green,
and names the ACs it serves.

- [ ] T1 – `mealTypeColorFamily` in `src/domain/catalog.ts` + its own tests (AC3)
  - Test first: `catalog.test.ts` — all 5 `MealType`s map to the correct
    family (breakfast/lunch/dinner → themselves, alternative/extra → lunch).
  - Done when: function exists, tests pass, `npm run check` green.

- [ ] T2 – Migrate `MealTypeChip.tsx` (AC1, AC2, AC3)
  - Test first: n/a new test — existing `AC6` test in `MealTypeChip.test.tsx`
    must keep passing unmodified.
  - Done when: local `COLOR_CLASS_KEY` Record removed, replaced by a direct
    call to the shared function; `npm run check` green.

- [ ] T3 – Migrate `TodayPage.tsx`'s rail (AC1, AC2, AC3)
  - Test first: add one new test to `TodayPage.test.tsx` — an
    alternative-meal day's rail class matches lunch's rail class.
  - Done when: `railClassByType` narrowed to 3 keys, indexed via the shared
    function; new + existing tests pass; `npm run check` green.

- [ ] T4 – Migrate `RecipeDetailPage.tsx`'s accent (AC1, AC2, AC3)
  - Test first: add one new test — an alternative recipe's accent class
    matches a lunch recipe's accent class.
  - Done when: `ACCENT_STYLE_KEY` narrowed to 3 keys, indexed via the shared
    function; tests pass; `npm run check` green.

- [ ] T5 – Migrate `SchedulePage.tsx`'s `mealChipClass` (AC1, AC2, AC3)
  - Test first: add one new test — alternative/extra meal chip matches
    lunch's chip; param now typed `MealType`.
  - Done when: function branches on the shared function's result; tests
    pass; `npm run check` green.

- [ ] T6 – Migrate `CatalogPage.tsx`'s `stripClass`; remove dead
      `stripNeutral` style (AC1, AC2, AC3)
  - Test first: add one new test to `CatalogPage.test.tsx` — alternative/
    extra recipe's rail class matches a lunch recipe's rail class. **This
    one is red against today's code** (gray `stripNeutral` vs lunch-teal),
    green once migrated.
  - Done when: `stripClass` branches on the shared function, param typed
    `MealType`; `stripNeutral` removed from `CatalogPage.styles.ts`
    (confirmed unused elsewhere); tests pass; `npm run check` green.

- [ ] T7 – Full-suite verification (AC1, AC2, AC3)
  - Test first: n/a — verification task.
  - Done when: `npm run check` green across the whole suite; manual spot
    check in-browser that an alternative/extra recipe's Catalog card rail
    now matches its chip color.
