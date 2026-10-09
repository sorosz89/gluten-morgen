# Backlog

Rough order. Each item becomes a spec with `/spec` when it's next.

| # | Feature | Notes |
|---|---|---|
| 000 | Project scaffold | implemented |
| 001 | Recipe data model & import | implemented |
| 002 | Recipe catalog & detail view | implemented |
| 003 | Rotation & "Today" screen | implemented |
| 004 | Shopping list | implemented |
| 005 | Cooking schedule | implemented |
| 006 | Label checklist | implemented |
| 007 | Alternatives | implemented |
| 008 | Offline / PWA | installable, works in the shop without signal |
| 009 | E2E tests | Playwright happy paths for Today, Recipe, Shopping |
| 010 | Custom meal planner | build/save an alternate plan beyond the fixed 2-week rotation |
| 011 | Recipe portion scaling | implemented |
| 012 | Recipe detail & catalog visual consistency | approved — extends the Today component pilot (constitution Principle 7) to Recipe detail + Catalog |
| 013 | Saved-state repository consistency | approved — internal refactor, from codebase-design review: one shared read/fall-back/recovery behavior for lunch swaps, portion counts, label checklist, shopping-list checked items |
| 014 | Recipe import section-splitting consistency | approved — internal refactor, from codebase-design review: share one markdown section-splitter between the recipe and shopping-list imports |
| 015 | Meal-type color-family consistency | approved — internal refactor, from codebase-design review: one shared decision for which color family a meal type (incl. alternative/extra) maps to |
| 016 | Backend foundation | approved — minimal backend + hosted-LLM call + beta nav page + cost guardrail; retires Principle 6's "no backend" rule. Enables a future AI recipe generator spec. |
