# 012 – Tasks

Each task is small (≈ one commit, < 1 hour), leaves `npm run check` green,
and names the ACs it serves.

- [x] T1 – `GlutenRiskBadge` shared component, wired into Catalog & Detail (AC3)
  - Test first: `src/components/GlutenRiskBadge.test.tsx` (renders fixed label,
    forwards `className`); existing Catalog badge tests (AC2/AC3) and Detail badge
    test (AC7) must keep passing unmodified against the new component.
  - Done when: both pages render the same component for the gluten-risk badge; their
    local `badge` style keys are removed; `npm run check` green.
  - Note: both pages' local `badge` keys became `badgeSpacing` (placement-only
    margin), since color/shape now live in the shared component.

- [x] T2 – `MealTypeChip` shared component, wired into Catalog cards & Detail header (AC6)
  - Test first: `src/components/MealTypeChip.test.tsx` (label per `MealType`, color
    class per type incl. `alternative`/`extra` → lunch fallback); update
    `CatalogPage.test.tsx` to assert each card shows its meal-type chip text; update
    `RecipeDetailPage.test.tsx` to assert the chip (not a plain span) renders the
    meal-type label.
  - Done when: Catalog card shows rail + chip + badge together (Today's recipe);
    Detail header shows the chip in place of the old plain `mealType` span;
    `npm run check` green.
  - Note: Detail's old `mealType` style key became `mealTypeChipSpacing`
    (placement-only block + margin); Catalog's card body got a new
    `chipSpacing` key for the same reason.

- [x] T3 – Amber `glutenFreeNote` callout, distinct from `tip` (AC4)
  - Test first: add a `RecipeDetailPage.test.tsx` assertion that the `tip` and
    `glutenFreeNote` paragraphs render with different classes (regression guard).
  - Done when: `glutenFreeNote` renders boxed in `glutenBg`/`glutenFg` with a
    `Warning16Filled` icon; `tip` is unchanged; gulyásleves shows both, visually
    distinct, note never lower-emphasis; `npm run check` green.
  - Note: test also asserts the warning icon's `<svg>` is present inside the
    note paragraph and absent from the tip paragraph, so the red step actually
    failed before the icon/box were added (plain class-name difference alone
    was already true beforehand).

- [ ] T4 – AC7 regression test: no empty sections for a recipe missing optional fields
  - Test first: new test rendering `mezes-mustaros-sult-oldalas`, asserting no tip
    paragraph, no macros list, no glutenFreeNote paragraph appear.
  - Done when: test passes against current conditional-render logic; `npm run check`
    green.

- [ ] T5 – Constitution change log entry (required by Principle 7 + spec scope)
  - Test first: n/a (docs-only).
  - Done when: `specs/constitution.md` change log has an entry recording the pilot's
    extension to Catalog & Detail and naming the two new shared components.

- [ ] T6 – Manual verification: AC1, AC2, AC5, AC8
  - Test first: n/a (manual check + full existing suite re-run).
  - Done when: 1440px/360px layouts confirmed in-browser; full `npm test` shows all
    spec-011 stepper tests (AC1–AC9) still passing unmodified; contrast spot-checked
    for the amber callout and chip colors.
