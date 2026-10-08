# 013 – Implementation plan

Spec: ./spec.md

## Approach

Four localStorage-backed repositories — `lunchSwapRepository`,
`recipePortionsRepository`, `labelChecklistRepository`, and the checked-items
half of `shoppingListRepository` — each hand-roll an identical "read JSON,
fall back to a default on missing or corrupted data; write JSON"
implementation. `anchorRepository` is correctly out of scope: it's a
raw-string passthrough with no JSON parsing at all, so the "corrupt JSON"
problem doesn't apply to it.

Exploration (full file + test contents read) confirmed the four repositories
share this exact skeleton, differing only in storage key, value type, and
default value:

```ts
function readX(storage) {
  const raw = storage.getItem(KEY)
  if (!raw) return DEFAULT
  try { return JSON.parse(raw) } catch { return DEFAULT }
}
function writeX(storage, value) { storage.setItem(KEY, JSON.stringify(value)) }
```

It also found a second, smaller duplication directly relevant to "done" (the
spec's AC4 — shared logic needs its own tests, and the existing suites must
keep passing): all five repository test files (including
`shoppingListRepository.test.ts` and `anchorRepository.test.ts`) independently
redefine an identical `Map`-backed fake `Storage`. Consolidating that alongside
the production helper is low-risk and directly enables the net-new
corrupted-data test, which no existing test file currently covers (confirmed
via grep — zero hits for "corrupt"/"malformed" across `src/data/*.test.ts`).

`shoppingListRepository.getFamilySize`/`setFamilySize` use a different,
non-JSON scheme (a plain number-as-string with `Number.isFinite` guarding) —
explicitly out of scope per spec 013 ("keeping each feature's own saved data
shape... exactly as they are today"); only its checked-items half (which
already uses the JSON-record pattern) is migrated.

The plan adds one new module, `src/data/jsonRecordStore.ts`:

```ts
export interface JsonRecordStore<T> {
  read(): T
  write(value: T): void
}

export function createJsonRecordStore<T>(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
  key: string,
  defaultValue: T,
): JsonRecordStore<T>
```

This is a shared implementation detail, not a public-facing repository: each
of the four repositories keeps its own domain-shaped interface
(`LunchSwapRepository`, `RecipePortionsRepository`, etc.) and calls
`createJsonRecordStore(storage, KEY, DEFAULT).read()/.write()` internally in
place of its own local `readX`/`writeX` pair. No repository's exported
interface, storage key, or default value changes — only where the
read/recover/write logic lives.

Also add `src/data/fakeStorage.ts` exporting the `createFakeStorage()` helper
(currently duplicated verbatim in all five `*.test.ts` files), and point every
repository test file at it instead of its own local copy. (Named
`fakeStorage.ts`, not `*.test.ts`, so Vitest doesn't try to run it as a
suite.)

`anchorRepository.ts`/`.test.ts` are untouched — not in spec 013's scope.

## Files

| File | New/changed | Purpose |
|---|---|---|
| `src/data/jsonRecordStore.ts` | new | Shared read-with-recovery/write helper |
| `src/data/jsonRecordStore.test.ts` | new | Unit tests: missing → default, valid round-trip, corrupted → default |
| `src/data/fakeStorage.ts` | new | Shared in-memory `Storage` fake, extracted from the 5 existing test files |
| `src/data/lunchSwapRepository.ts` | changed | `readSwaps`/`writeSwaps` replaced by `createJsonRecordStore` call |
| `src/data/lunchSwapRepository.test.ts` | changed | import shared fake storage; add 1 corrupted-value test |
| `src/data/recipePortionsRepository.ts` | changed | same pattern as above |
| `src/data/recipePortionsRepository.test.ts` | changed | same pattern as above |
| `src/data/labelChecklistRepository.ts` | changed | same pattern as above |
| `src/data/labelChecklistRepository.test.ts` | changed | same pattern as above |
| `src/data/shoppingListRepository.ts` | changed | `readCheckedItems`/`writeCheckedItems` replaced by `createJsonRecordStore`; `clearTrip` rebuilt on `store.read()/write()`; `getFamilySize`/`setFamilySize` untouched |
| `src/data/shoppingListRepository.test.ts` | changed | import shared fake storage; add 1 corrupted-value test for checked items |

`anchorRepository.ts`/`.test.ts` — not touched (out of scope).

## Types & interfaces

```ts
// src/data/jsonRecordStore.ts
export interface JsonRecordStore<T> {
  read(): T
  write(value: T): void
}
export function createJsonRecordStore<T>(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
  key: string,
  defaultValue: T,
): JsonRecordStore<T>

// src/data/fakeStorage.ts
export function createFakeStorage(): Pick<Storage, 'getItem' | 'setItem'>
```

Each repository's own exported interface (`LunchSwapRepository`,
`RecipePortionsRepository`, `LabelChecklistRepository`,
`ShoppingListRepository`) is unchanged — only their internal `readX`/`writeX`
functions are replaced by a `const store = createJsonRecordStore<T>(storage,
KEY, DEFAULT)` and `store.read()`/`store.write(...)` calls.

## Test strategy

- **AC1** (missing → default, unchanged): already covered per-repository;
  those existing assertions are re-run unmodified after each migration.
- **AC2** (corrupted → default, net-new): one new test in
  `jsonRecordStore.test.ts` (seed fake storage with an invalid-JSON string,
  assert `read()` returns the default), plus one new corrupted-value test
  added to each of the four migrated repositories' test files, confirming
  the specific default each repo returns (`{}` for swaps/portions/checklist,
  `{}` for shopping's checked-items record).
- **AC3** (valid round-trip unchanged): already covered per-repository;
  re-run unmodified.
- **AC4** (full suite passes + shared logic has its own tests): `npm run
  check` after all five files are migrated; `jsonRecordStore.test.ts` is the
  shared logic's independent test coverage.

Order: write `jsonRecordStore.ts` + its test first (red → green on the helper
alone), then migrate repositories one at a time, each its own small commit,
each leaving `npm run check` green — matching "one task = one commit" and
"test first" from `CLAUDE.md`.

## Risks

- `shoppingListRepository.clearTrip` currently reads/mutates/writes a plain
  object directly; rebuilding it on `store.read()`/`store.write()` must
  preserve the exact prefix-delete behavior — mitigated by running its
  existing `clearTrip` test unmodified after the migration.
- Relocating `createFakeStorage` must not change its behavior (still a fresh
  `Map`-backed store per call) — mitigated by keeping the implementation
  verbatim, just moved.
- `getFamilySize`'s `Number.isFinite`-guarded fallback is a different
  "corruption" concept (non-numeric string, not invalid JSON) — explicitly
  left alone; no task should be tempted to fold it into
  `createJsonRecordStore`.
