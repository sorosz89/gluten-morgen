# 006 – Tasks

Each task is small (≈ one commit, < 1 hour), leaves `npm run check` green,
and names the ACs it serves.

- [x] T1 – `LABEL_CHECKLIST_PRODUCTS` domain constant (AC1)
  - Test first: `src/domain/labelChecklist.test.ts` asserts
    `LABEL_CHECKLIST_PRODUCTS` equals exactly the 7 names, in order:
    sonka/felvágott, fehérjekoncentrátum (protein por), étcsokoládé,
    light sajt, tejföl, ketchup, sütőpor.
  - Done when: `src/domain/labelChecklist.ts` exports the constant;
    `npm run check` green.

- [x] T2 – `labelChecklistRepository` (AC2, AC3)
  - Test first: `src/data/labelChecklistRepository.test.ts`, fake-storage
    harness (copy `shoppingListRepository.test.ts`'s pattern) —
    `isChecked` defaults to `false`; `setChecked(product, true)` then
    `isChecked(product)` round-trips, including with a fresh repository
    instance over the same storage; `setChecked(product, false)` unchecks;
    checking one product leaves others unaffected.
  - Done when: `createLabelChecklistRepository` + `labelChecklistRepository`
    exported from `src/data/labelChecklistRepository.ts`, storage key
    `zero-gluten:label-checklist`; `npm run check` green.

- [x] T3 – `LabelChecklistPage` + route, checkbox persistence (AC1, AC2, AC3)
  - Test first: `src/features/labelChecklist/LabelChecklistPage.test.tsx`
    (`localStorage.clear()` in `beforeEach`) — renders exactly the 7
    products from `LABEL_CHECKLIST_PRODUCTS`, all unchecked; checking one
    persists across `unmount` + re-`render`; un-checking it afterwards
    returns it to unchecked, including after reload.
  - Done when: `LabelChecklistPage.tsx` + `.module.css` created, wired into
    `App.tsx` at route `/cimkek` with a "Címkék" nav link; each checkbox
    reads/writes `labelChecklistRepository`; `npm run check` green.

- [ ] T4 – Remaining-count / all-done summary (AC4, AC5, AC6 verification)
  - Test first: extend `LabelChecklistPage.test.tsx` — with 3 of 7 products
    checked, the summary shows "4 maradt"; with all 7 checked, the summary
    shows a distinct all-done message (not "0 maradt").
  - Done when: the page renders the remaining-count line and the distinct
    done state; `npm run check` green; `git diff` confirms
    `ShoppingPage.tsx`/`ShoppingPage.test.tsx` are untouched (AC6); manual
    spot-check in `npm run dev` that toggling `/cimkek` items leaves
    `/bevasarlas`'s gluten badges unchanged.
