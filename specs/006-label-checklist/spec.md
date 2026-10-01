# 006 – Label checklist

Status: implemented
Depends on: none

## Problem

A handful of processed products the family keeps buying (ham/cold cuts, protein
powder, dark chocolate, light cheese, sour cream, ketchup, baking powder) are
"usually gluten-free, but check the label" items: the risk comes from a specific
brand's recipe (wheat-starch filler, malt flavoring, a shared production line),
not from the product category itself. Once the shopper has read the label for
the brand they actually buy and confirmed it is safe, re-reading that label on
every future shopping trip is wasted effort and gets skipped under time
pressure — exactly the moment a silent brand or recipe change would be missed.
The app should let the shopper record each product as checked once it has been
verified, so they know at a glance which labels they still owe a read.

## User stories

- As the shopper, I want a single list of the "check the label once" products,
  so I don't have to remember which items in `data/source/` need this and
  which don't.
- As the shopper, I want to mark a product as checked once I've confirmed its
  label is gluten-free, so I'm not re-reading the same safe label every trip.
- As the shopper, I want to see which products I still haven't checked, so I
  know what to read labels for on my next shop.
- As the shopper, I want to un-mark a product I'd already checked, so I can
  force a re-check if I switch brands or stores.

## Scope

In scope:
- A standalone checklist screen listing the fixed set of "check once" product
  types (see Data & rules).
- A checked/unchecked state per product type, persisted across sessions.
- Marking a product checked or unchecked from this screen.
- Showing, at a glance, how many of the products are still unchecked.

Out of scope:
- Recording which brand was checked, or any free-text notes.
- Any change to the existing shopping list screen or its
  "Gluténmentes termék szükséges" badge — this checklist is a separate,
  informational feature and does not read or write shopping-list state.
- Products that must always be bought as an explicitly gluten-free-labelled
  item regardless of brand history (gluténmentes lisztkeverék, "GM" zabpehely,
  gluténmentes kenyér/zsemle) — those are a permanent recipe swap, not a
  one-time brand check, and stay off this list.
- Reminding the shopper to re-check on a schedule (e.g. "recheck every 6
  months"). Un-checking is manual only.

## Acceptance criteria

- **AC1** – Given the shopper opens the label checklist for the first time,
  when the screen loads, then it shows exactly these 7 products, each
  unchecked: sonka/felvágott, fehérjekoncentrátum (protein por), étcsokoládé,
  light sajt, tejföl, ketchup, sütőpor.
- **AC2** – Given "Fehérjekoncentrátum (protein por)" is unchecked, when the
  shopper checks it off, then it is shown as checked, and the checked state is
  still shown as checked after reloading the app (state persists).
- **AC3** – Given "Étcsokoládé" is checked, when the shopper un-checks it, then
  it is shown as unchecked again, including after a reload.
- **AC4** – Given 3 of the 7 products are checked, when the shopper views the
  checklist, then the screen shows a count of remaining unchecked products
  (4 maradt / 4 left) somewhere visible without opening each item.
- **AC5** – Given all 7 products are checked, when the shopper views the
  checklist, then the screen clearly indicates nothing is left to check (e.g.
  0 maradt), distinct from the in-progress state in AC4.
- **AC6** – Given the shopper opens the shopping list screen, when they view
  an item such as "sonka/felvágott: 200 g" that also appears on the label
  checklist, then its "Gluténmentes termék szükséges" badge is shown exactly
  as it is today, unaffected by the checklist's checked state (checklist and
  shopping list are independent — see `specs/004-shopping-list`).

## Data & rules

The 7 checklist products and why each is here (source:
`data/source/gf-etrend-attekintes.md`, "Amit külön ellenőrizni kell a boltban"):

- **Sonka / felvágott** – cheap brands sometimes use wheat starch as filler.
- **Fehérjekoncentrátum (protein por)** – flavored versions sometimes contain
  malt or a gluten-containing additive.
- **Étcsokoládé** – plain 70% dark chocolate is usually gluten-free, but many
  brands carry a "may contain traces of gluten" shared-line warning.
- **Light sajt, tejföl, ketchup, sütőpor** – almost always gluten-free, but as
  processed products worth a one-time ingredient/allergen-warning check.

These are product *types*, not individual shopping-list line items — the
checklist is brand-agnostic by name (AC1 lists the exact 7 labels to show).
The same product type recurs across multiple shopping trips and recipes
(e.g. "sonka/felvágott" appears in both the week-1 and week-2 fresh trips in
`data/source/gf-bevasarlolista-2het.md`); checking it once on this screen
covers all of those occurrences, which is the point of the feature.

Kitchen cross-contamination practice (separate cutting board, toaster, baking
sheet, thorough washing of shared tools) is mentioned in the same source
section but is not a label check and is not part of this checklist.

## Open questions

- [ ] None — scope, placement, stored data and the shopping-list boundary were
  confirmed with the human during `/spec`.
