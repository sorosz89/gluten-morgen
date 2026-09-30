# Constitution – Zero Gluten

This file holds the decisions that every spec and plan must respect. Change it
deliberately and rarely, and note the date and reason at the bottom.

## Product vision

A family of N people eats one shared, fully gluten-free menu. The plan repeats
every 2 weeks in 4 blocks of 3–4 days. Each block has one breakfast, one lunch and
one dinner, cooked in bulk. The app answers three questions fast, on a phone, in
the kitchen or the shop:

1. **What do we eat today, and do I need to cook?**
2. **How do I make it?** (recipe with prep, steps, macros, gluten notes)
3. **What do I need to buy?** (shopping list for the next trip, scaled to N people)

## Users

- Primary: the person who plans, shops and cooks for the family.
- Context: phone in hand, often with wet or busy hands; sometimes offline in a shop.

## Principles (non-negotiable)

1. **Gluten safety first.** Any ingredient that needs a gluten-free version
   (bread, flour, oats, ham, protein powder, chocolate…) is visibly flagged
   everywhere it appears. The app never suggests wheat-based swaps
   (bulgur, couscous, durum pasta, regular oats).
2. **The source recipes are the truth.** Data comes from `data/source/*.md`.
   The app does not invent quantities, macros or steps.
3. **Mobile first, one hand.** Every core screen works at 360 px wide with
   large tap targets.
4. **Works offline** once loaded (later milestone, but don't block it).
5. **Small, tested steps.** Domain logic is pure and unit tested. Every feature
   has acceptance criteria that are checked by tests or a written manual check.
6. **No backend** until a spec proves we need one.

## Domain facts

- Rotation: 2 weeks, 4 blocks (week 1 Sun–Wed, week 1 Wed–Sun, week 2 Sun–Wed,
  week 2 Wed–Sun). See `data/source/gf-etrend-attekintes.md`.
- Recipe quantities are **per person** for the whole block (e.g. "4 napi adagra").
- Shopping happens in 3 trips: pantry & freezer (once per cycle), fresh week 1,
  fresh week 2. See `data/source/gf-bevasarlolista-2het.md`.
- "Alternatív" recipes are optional extras, **not** in the rotation.
- Daily target ~1900 kcal (NORMÁL 1900 plan).

## Out of scope (for now)

User accounts, sync between devices, recipe editing in the UI, nutrition tracking
per person, AI features.

## Change log

- 2026-09-30 – initial version.
