# 007 – Tasks

Each task is small (≈ one commit, < 1 hour), leaves `npm run check` green,
and names the ACs it serves.

- [x] T1 – Active-lunch resolution domain logic (AC1, AC4)
  - Test first: `lunchSwap.test.ts` — `getActiveLunchId` returns each
    block's default lunch id (`BLOCK_RECIPE_IDS`) when `swaps` has no entry
    for it; returns the swapped id when one is set; `ALTERNATIVE_RECIPE_IDS`
    contains exactly the 5 `alternative`-mealType ids (cross-checked
    against `recipes` from `src/data/recipes.ts`).
  - Done when: `src/domain/lunchSwap.ts` exports `ActiveSwaps`,
    `getActiveLunchId`, `ALTERNATIVE_RECIPE_IDS`; `npm run check` green.

- [x] T2 – Lunch-swap persistence repository (AC3, AC4, AC9)
  - Test first: `lunchSwapRepository.test.ts` with a fake storage —
    `getSwaps()` is `{}` by default; `setSwap(2, id)` then `getSwaps()`
    reflects `{ 2: id }`; `setSwap(2, null)` removes that block's entry;
    swaps for different blocks are independent; state survives re-reading
    the same storage (reload simulation).
  - Done when: `src/data/lunchSwapRepository.ts` implements
    `LunchSwapRepository` on `window.localStorage`, mirroring
    `anchorRepository.ts`'s shape.

- [x] T3 – Swap picker screen + route (AC1, AC3, AC4, AC10)
  - Test first: `LunchSwapPage.test.tsx` — renders all 4 blocks, each
    showing its currently active recipe title and a control offering the
    block's default plus the 5 alternatives (AC1); choosing an alternative
    updates the active recipe shown and persists it via the repository
    (AC4); choosing "eredeti recept" reverts to the default (AC3); state
    survives unmount/remount (AC9).
  - Done when: `src/features/lunchSwap/LunchSwapPage.tsx` +
    `.module.css` exist; `/csere` route and nav link added in `App.tsx`;
    `npm run check` green. AC10 (360px) is a manual visual check, same
    convention as every prior spec in this project.

- [x] T4 – Today & Schedule screens read the active lunch (AC2)
  - Test first: extend `TodayPage.test.tsx` — with block 2 swapped to
    "Sült lazacfilé citromos burgonyapürével és gőzölt brokkolival",
    rendering Today on 2026-10-07 shows the salmon dish instead of "Húsos
    zöldséges passata"; rendering again on 2026-10-21 (14 days later)
    still shows it. Extend `SchedulePage.test.tsx` with the same swapped
    scenario for consistency.
  - Done when: `TodayPage.tsx` and `SchedulePage.tsx` resolve the lunch id
    via `getActiveLunchId(block, lunchSwapRepository.getSwaps())` instead
    of `getBlockRecipeIds(block).lunchId` directly.

- [x] T5 – Recipe→shopping-list contribution map + `applyLunchSwaps` (AC5, AC6, AC7)
  - Note: "M-es tojás" (50 g, Paradicsomos húsgombóc) is deliberately left
    unmapped — the shopping list's only egg item ("tojás (M-es)") is counted
    in db, an incompatible unit with no safe arithmetic merge. Documented as
    a named exception in the completeness test rather than silently
    skipped. 59 rows total (plan estimated ~60).
  - Test first: `lunchShoppingMap.test.ts` —
    - completeness: every ingredient with unit `g`/`db` and a non-null
      amount, across the 4 default lunch recipes and the 5 alternatives,
      appears exactly once in `LUNCH_SHOPPING_MAP` for its recipe id
      (cross-checked against `recipes`).
    - `applyLunchSwaps` with no swaps returns the trips unchanged (deep-equal
      to `shoppingList`).
    - block 2 swapped to the salmon dish reproduces the spec's AC5 numbers
      (darált hús 1300→800 g, csicseriborsó line removed, paradicsom
      passata 1500→500 g, sárgarépa/cukkini lines removed) and AC6 numbers
      (new lazacfilé 640 g and brokkoli 400 g lines, burgonya 500→1300 g).
    - a block swapped to the tuna pasta salad adds "gluténmentes tészta"
      (280 g) with `mustBeGlutenFree: true` (AC7).
  - Done when: `src/domain/lunchShoppingMap.ts` exports
    `LUNCH_SHOPPING_MAP`, `resolveTripId`, `applyLunchSwaps`,
    `diffRemovedItems`; all pass.

- [ ] T6 – Shopping list screen reflects active swaps (AC5, AC6, AC7)
  - Test first: extend `ShoppingPage.test.tsx` — with block 2's swap to
    the salmon dish set in the repository before render, the rendered
    trips show the AC5/AC6 line changes, correctly scaled by family size;
    with a swap to the tuna pasta salad, the gluten-risk badge (AC7)
    appears on its "gluténmentes tészta" line.
  - Done when: `ShoppingPage.tsx` renders
    `applyLunchSwaps(shoppingList, lunchSwapRepository.getSwaps(),
    recipesById)` instead of the raw `shoppingList`.

- [ ] T7 – Checked-state cleared on swap (AC8)
  - Test first: `LunchSwapPage.test.tsx` — check "csicseriborsó (konzerv)"
    in the shopping repository, then perform the block-2-to-salmon swap
    from the picker; assert the repository's checked flag for that item is
    now `false`; assert a newly-introduced item ("lazacfilé") is
    unchecked; swap back and then to a different alternative that
    reintroduces an item of the same name and assert it starts unchecked.
  - Done when: `LunchSwapPage`'s swap handler calls `diffRemovedItems`
    before/after the swap and clears `shoppingListRepository`'s checked
    state for every item that disappears.
