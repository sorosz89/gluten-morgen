# 013 – Tasks

Each task is small (≈ one commit, < 1 hour), leaves `npm run check` green,
and names the ACs it serves.

- [ ] T1 – `createJsonRecordStore<T>` shared helper + its own tests (AC2, AC4)
  - Test first: `src/data/jsonRecordStore.test.ts` — missing key → default;
    valid JSON round-trips; corrupted JSON → default (the net-new case no
    existing test covers).
  - Done when: `src/data/jsonRecordStore.ts` exists and passes those tests;
    `npm run check` green.

- [ ] T2 – Extract shared `createFakeStorage()` test helper (supports T1, AC4)
  - Test first: n/a — pure extraction of code already proven by 5 existing
    test files.
  - Done when: `src/data/fakeStorage.ts` exists; `jsonRecordStore.test.ts`
    (T1) imports it instead of defining its own copy; `npm run check` green.

- [ ] T3 – Migrate `lunchSwapRepository` onto the shared store (AC1–AC4)
  - Test first: add one corrupted-value test to
    `lunchSwapRepository.test.ts`; switch the file to import
    `createFakeStorage` from T2.
  - Done when: `readSwaps`/`writeSwaps` are gone, replaced by a
    `createJsonRecordStore` call; all existing + new tests pass; `npm run
    check` green.

- [ ] T4 – Migrate `recipePortionsRepository` onto the shared store (AC1–AC4)
  - Test first: same shape as T3, for this repository's key/default.
  - Done when: same bar as T3.

- [ ] T5 – Migrate `labelChecklistRepository` onto the shared store (AC1–AC4)
  - Test first: same shape as T3, for this repository's key/default.
  - Done when: same bar as T3.

- [ ] T6 – Migrate `shoppingListRepository`'s checked-items half onto the
      shared store; `clearTrip` rebuilt on `store.read()/write()`;
      `getFamilySize`/`setFamilySize` untouched (AC1–AC4)
  - Test first: add one corrupted-value test for the checked-items key;
    switch the file to import `createFakeStorage` from T2; existing
    `clearTrip`/`getFamilySize` tests must keep passing unmodified.
  - Done when: same bar as T3, plus `clearTrip`'s existing test still
    passes unmodified.

- [ ] T7 – Full-suite verification (AC4)
  - Test first: n/a — verification task.
  - Done when: `npm run check` green; confirm by inspection that
    `anchorRepository` (out of scope) was not touched.
