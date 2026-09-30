# 003 – Tasks

Each task is small (≈ one commit, < 1 hour), leaves `npm run check` green,
and names the ACs it serves.

- [x] T1 – Rotation domain logic (AC2, AC3, AC4, AC5)
  - Test first: `src/domain/rotation.test.ts` — `getRotationDay` returns
    `{ block: 1, cookToday: true }` for anchor 2026-10-04 / today 2026-10-04;
    `{ block: 1, cookToday: false }` for today 2026-10-06; `{ block: 2,
    cookToday: true }` for today 2026-10-07; `{ block: 1, cookToday: true }`
    again for today 2026-10-18 (14-day wraparound); every id in
    `BLOCK_RECIPE_IDS` exists in `src/data/recipes.json` with the expected
    `mealType`.
  - Done when: `src/domain/rotation.ts` exports `BlockNumber`,
    `RotationDay`, `BLOCK_RECIPE_IDS`, `getRotationDay`,
    `getBlockRecipeIds`, `isSunday`, `parseIsoDate`, `formatIsoDate`; all
    tests pass; `npm run check` green.

- [ ] T2 – Anchor repository (foundation for AC1, AC7)
  - Test first: `src/data/anchorRepository.test.ts` — `getAnchor` returns
    `null` when nothing is stored; `setAnchor` then `getAnchor` round-trips
    the same ISO date string; uses an injected in-memory fake storage, not
    real `localStorage`.
  - Done when: `src/data/anchorRepository.ts` exports the
    `AnchorRepository` interface, `createAnchorRepository(storage)`, and a
    default `anchorRepository` instance backed by `window.localStorage`;
    `npm run check` green.

- [ ] T3 – TodayPage first-run prompt + `/ma` route (AC1)
  - Test first: `src/features/today/TodayPage.test.tsx` — with no anchor
    stored (repository cleared before the test), renders the anchor-setup
    prompt and no recipe titles or cook-flag text.
  - Done when: `/ma` route added in `App.tsx` with a small shared nav
    (`Receptek` / `Ma`); `TodayPage.tsx` reads the anchor via
    `anchorRepository` and renders the setup prompt when none is set;
    `npm run check` green.

- [ ] T4 – Today's meals + cook flag (AC2, AC3, AC4, AC5)
  - Test first: extend `TodayPage.test.tsx` — with an anchor of 2026-10-04
    stored and `today` pinned via the component's `today` prop, asserts the
    three correct recipe titles and "cook today?" text for each of
    2026-10-04, 2026-10-06, 2026-10-07 and 2026-10-18.
  - Done when: `TodayPage` computes `getRotationDay`, looks up the block's
    recipes via `getBlockRecipeIds` + `src/data/recipes.ts`, renders each
    meal's title linking to `/recipes/:id`, and renders the cook-flag text;
    `npm run check` green.

- [ ] T5 – Gluten-risk badge reuse (AC6)
  - Test first: extend `TodayPage.test.tsx` — on 2026-10-07, the dinner
    entry "Melegszendvics" shows the same badge used in spec 002's
    catalog; the lunch entry "Húsos zöldséges passata" shows none.
  - Done when: `TodayPage` reuses `recipeHasGlutenRiskIngredient` from
    `src/domain/catalog.ts` for each meal entry; `npm run check` green.

- [ ] T6 – Edit the cycle anchor (AC7)
  - Test first: extend `TodayPage.test.tsx` — starting from anchor
    2026-10-04, changing the date input to a different Sunday and saving
    updates the displayed meals/cook-flag to match, and the repository
    reflects the new value; entering a non-Sunday date is rejected with an
    inline message and does not change the stored anchor.
  - Done when: `TodayPage` renders an always-visible date input pre-filled
    with the current anchor and a save action; save validates `isSunday`
    before writing via `anchorRepository`; `npm run check` green.

- [ ] T7 – Responsive / tap-target pass (AC8)
  - Test first: none automated (jsdom doesn't do real layout) — verified
    by a written manual check instead, same approach as spec 002's T7.
  - Done when: `TodayPage.module.css` (and the new nav) ensure no
    horizontal overflow and ≥44px tap targets for the meal links, the date
    input/save action, and the nav links; manually verified with `npm run
    dev` at a 360px viewport; note the manual check result in this task's
    completion commit message.
