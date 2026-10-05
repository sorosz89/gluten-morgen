# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: the person in the household who plans, shops, and cooks for the family. Context: phone in hand, often with wet or busy hands in the kitchen, or in a shop without reliable signal. The whole family eats one shared gluten-free menu — there are no separate per-person meal preferences to manage.

Confirmed: this is a single-family, personal tool by design, not built for multi-tenant/multi-family use. No need to design for other households or configurable family identity beyond the existing "family of N people" scaling already in the domain model.

## Product Purpose

A gluten-free family meal-planning app that answers three questions fast, on a phone, in the kitchen or the shop:

1. What do we eat today, and do I need to cook?
2. How do I make it? (recipe with prep, steps, macros, gluten notes)
3. What do I need to buy? (shopping list for the next trip, scaled to family size)

The family eats one shared, fully gluten-free menu that repeats every 2 weeks in 4 blocks of 3–4 days, each with one breakfast, one lunch, and one dinner cooked in bulk.

Secondary purpose: the project also serves as the owner's vehicle for learning a repeatable spec → plan → implement → verify workflow with Claude Code (see `README.md`). That shapes how work gets done (specs before code, small tested tasks, one task per commit) but is not itself a user-facing concern.

## Positioning

Not a general-purpose recipe or meal-planning app — built around one family's exact, fixed 2-week rotation sourced from real Hungarian recipe documents, not a generic recipe database a neighboring product could swap in. Gluten-safety flagging is woven through every screen (recipes, shopping list, swaps) rather than bolted on as a filter.

## Operating Context

- Mobile-first, one-handed use: core screens must work at 360px wide with large tap targets.
- Used in two main settings: in the kitchen while cooking (hands often wet/busy) and in a shop while buying groceries (sometimes offline).
- Shopping happens in 3 trips per cycle: pantry & freezer (once per cycle), fresh week 1, fresh week 2.
- "Alternatív" recipes are optional extras, not part of the fixed rotation, and can be swapped in for a lunch (spec 007 – alternative lunch swap).
- Daily target ~1900 kcal (NORMÁL 1900 plan).

## Capabilities and Constraints

- No backend: all data ships as static JSON generated from `data/source/*.md`; persistence is `localStorage` behind a repository interface.
- Source recipes in `data/source/` are the truth — the app must never invent quantities, macros, or steps.
- Gluten safety is non-negotiable: any ingredient needing a gluten-free version (bread, flour, oats, ham, protein powder, chocolate, etc.) must be visibly flagged everywhere it appears; the app never suggests wheat-based swaps (bulgur, couscous, durum pasta, regular oats).
- Must work offline once loaded (milestone 008, not yet built, but must not be designed against).
- UI strings are Hungarian; code, identifiers, comments, and specs are English.
- Explicitly out of scope for now: user accounts, multi-device sync, recipe editing in the UI, per-person nutrition tracking, AI features.
- Currently implemented surfaces: Today, Recipe catalog/detail, Shopping list, Cooking schedule, Label checklist, Lunch swap (alternatives). Not yet built: offline/PWA (008), e2e tests (009), custom meal planner beyond the fixed rotation (010).

## Brand Commitments

"Zero Gluten" is the confirmed product name.

## Evidence on Hand

- Real Hungarian recipe source documents in `data/source/*.md` (breakfasts, lunches, dinners, alternatives, shopping list overview, rotation overview) — the only content evidence; treat as read-only source of truth.
- No photos of dishes or the kitchen exist (confirmed). Future visual work must not fabricate food photography or stock images; use placeholders or illustration instead if imagery is needed.

## Product Principles

1. Gluten safety is a correctness concern, not a nice-to-have — flag it everywhere, never suggest a wheat-based swap.
2. Source data is truth; the app surfaces it, never invents it.
3. Optimize for one-handed, phone-in-kitchen-or-shop use, including offline shop trips.
4. Small, tested, spec-driven steps over big-bang changes.
5. No backend, no accounts, no sync — stay a single-family, static-data tool until a spec proves otherwise.

## Accessibility & Inclusion

No household-specific accessibility needs have been established. Known standard: mobile-first with large tap targets at 360px width (`specs/constitution.md`); no colorblind-safe or screen-reader requirement has been confirmed yet.
