# 004 – Tasks

Each task is small (≈ one commit, < 1 hour), leaves `npm run check` green,
and names the ACs it serves.

- [x] T1 – Shopping-list domain schema + markdown parser (AC1, AC4, AC5)
  - Test first: `src/domain/shoppingListMarkdown.test.ts` —
    `parseShoppingListMarkdown` returns 3 trips in document order, each
    with its real category headings (e.g. trip 1's "Hús, tojás",
    "Gluténmentes speciális termékek"); a plain line like "teavaj: 55 g"
    parses to `{ name: 'teavaj', amount: 55, unit: 'g' }`; a qualified line
    like "tojás (M-es): kb. 17 db (...)" parses with `amountQualifier:
    'kb.'` and the parenthetical kept as `note`; a freezer-reminder line
    ("+ 1000 g pörköltnek való hús a fagyasztóból kiolvasztva (lásd
    fent)") parses to the same shape via the other line grammar; the
    trailing "Vásárláskor egyszer ellenőrizendő címkék" section is not
    present in the result; "gluténmentes kenyér/zsemle" and "csirke/
    pulykamell sonka" parse with `mustBeGlutenFree: true`, "light sajt"
    and "ketchup" parse with `mustBeGlutenFree: false`.
  - Done when: `WATCHLIST`/`isGlutenFree` exported from
    `src/domain/recipeMarkdown.ts` (no behavior change; spec 001's
    existing tests still pass); `src/domain/shoppingList.ts` exports the
    zod schema/types; `src/domain/shoppingListMarkdown.ts` exports
    `parseShoppingListMarkdown`; all tests pass; `npm run check` green.
  - Note: `shoppingListMarkdown.test.ts` uses an inline fixture string
    (mirroring the real document's structure and representative lines)
    rather than reading `data/source/gf-bevasarlolista-2het.md` from disk —
    `recipeMarkdown.test.ts` already established this pattern, and a
    direct `node:fs` read under `src/domain/` fails typecheck anyway since
    `tsconfig.app.json` doesn't include `"node"` in `types`. The full real
    document is covered by T2's integration test instead.

- [ ] T2 – Import script + generated `shoppingList.json` + loader (AC1)
  - Test first: `scripts/import-shopping-list.integration.test.ts` —
    `buildShoppingList(sourceDir)` against the real `data/source` directory
    returns 3 trips that all pass `shoppingTripSchema.safeParse`;
    `src/data/shoppingList.test.ts` — importing `src/data/shoppingList.ts`
    yields 3 trips, each schema-valid.
  - Done when: `scripts/import-shopping-list.ts` writes
    `src/data/shoppingList.json`; `npm run import:shopping` added to
    `package.json`; `src/data/shoppingList.ts` imports and validates that
    JSON via `shoppingListSchema.parse`; `npm run check` green.

- [ ] T3 – Family-size & checked-item repository (foundation for AC2, AC3, AC6, AC7)
  - Test first: `src/data/shoppingListRepository.test.ts` —
    `getFamilySize` returns 1 when nothing is stored; `setFamilySize` then
    `getFamilySize` round-trips; `isChecked` returns `false` for an
    untouched item; `setChecked` then `isChecked` round-trips per
    `(tripId, itemName)` pair, independent across trips; `clearTrip`
    unchecks every item in that trip only. Uses an injected in-memory fake
    storage, not real `localStorage`.
  - Done when: `src/data/shoppingListRepository.ts` exports
    `ShoppingListRepository`, `createShoppingListRepository(storage)`,
    and a default `shoppingListRepository` backed by
    `window.localStorage`; `npm run check` green.

- [ ] T4 – ShoppingPage skeleton: trips, categories, items, gluten badge (AC1, AC2, AC5)
  - Test first: `src/features/shopping/ShoppingPage.test.tsx` — renders
    the 3 trips in order, each labeled, with every item from
    `src/data/shoppingList.json` appearing exactly once under its
    category heading; with no family size set, "gluténmentes
    kenyér/zsemle" shows "800 g" unscaled (AC2); "gluténmentes
    kenyér/zsemle" shows the gluten-risk badge, "light sajt" does not.
  - Done when: `/bevasarlas` route added in `App.tsx` with a "Lista" nav
    link; `ShoppingPage.tsx` renders trips/categories/items read-only,
    defaulting family size to 1 via the repository; `npm run check`
    green.

- [ ] T5 – Editable family size (AC3, AC4)
  - Test first: extend `ShoppingPage.test.tsx` — setting family size to 4
    updates every displayed quantity to `amount × 4` (e.g. "pörköltnek
    való sovány hús" 1500 g → 6000 g); "tojás (M-es)" still shows its "kb."
    qualifier attached to the scaled number (kb. 68 db); the chosen family
    size is still 4 after a re-render with a fresh repository read
    (persisted).
  - Done when: a family-size number input is wired to
    `shoppingListRepository`; every item's displayed quantity is
    `amount × familySize`, qualifier and unit preserved; `npm run check`
    green.

- [ ] T6 – Checkboxes + per-trip clear (AC6, AC7)
  - Test first: extend `ShoppingPage.test.tsx` — checking an item persists
    it as checked via the repository and survives a re-render; the same
    item name in a different trip (e.g. "leveszöldség" in both fresh
    trips) has independent checked state; using one trip's "lista törlése"
    unchecks every item in that trip only, leaving the other two trips'
    checked items untouched.
  - Done when: each item has a checkbox wired to
    `shoppingListRepository.isChecked`/`setChecked`; each trip has a
    "lista törlése" button wired to `clearTrip`; `npm run check` green.

- [ ] T7 – Responsive / tap-target pass (AC8)
  - Test first: none automated (jsdom doesn't do real layout) — verified
    by a written manual check instead, same approach as specs 002/003's
    final task.
  - Done when: `ShoppingPage.module.css` ensures no horizontal overflow
    and ≥44px tap targets for checkboxes, the family-size input, and each
    trip's clear action; manually verified with `npm run dev` at a 360px
    viewport; note the manual check result in this task's completion
    commit message.
