# 004 – Shopping list

Status: implemented
Depends on: 001

## Problem

The 2-week shopping plan in `data/source/gf-bevasarlolista-2het.md` is a
hand-aggregated, per-person list split into 3 trips (pantry & freezer once,
then two fresh-grocery runs). Today it only exists as markdown: the shopper
has to do the × family-size math themselves, re-read the whole document each
trip to see what's left to buy, and has no way to mark an item as "got it"
without crossing it out on a printout.

## User stories

- As the shopper, I want to see each of the 3 trips as its own checklist, so
  I buy the right things on the right trip without re-reading the whole plan.
- As the shopper, I want quantities already scaled to how many people I'm
  shopping for, so I don't have to do the multiplication in my head in the
  shop.
- As the shopper, I want to check items off as I put them in the cart, and
  have that stick if I close the app and reopen it mid-trip.
- As the cook, I want the same gluten-risk flag I see on recipes to show up
  here too, so I don't grab the wrong bread or ham by mistake.

## Scope

In scope:
- Three trip sections, in order: pantry & freezer (once per cycle), fresh
  week 1, fresh week 2 — each showing its items grouped by the same
  categories used in the source document.
- Every item from all 3 trips in `data/source/gf-bevasarlolista-2het.md`,
  with its per-person quantity.
- A family-size number the user sets once, used to scale every item's
  displayed quantity (quantity-per-person × family size); persisted so it
  doesn't need re-entry.
- A checkbox per item; checked state persists per item per trip.
- A "clear this trip's checks" action, scoped to one trip at a time.
- A gluten-risk badge on items that must always be bought as a labelled
  gluten-free product (constitution principle 1 / the `gluten-free-domain`
  skill's "must be bought labelled gluten-free" tier): bread/roll, flour
  mix, (GM) oats, ham/cold cuts, protein powder, dark chocolate.

Out of scope:
- The softer "check the label once, remember the safe brand" tier (light
  cheese, sour cream, ketchup, baking powder) — tracked separately as
  backlog #006 (Label checklist).
- Any link between a trip and a real calendar date, or to the rotation's
  cycle anchor from spec 003 — the 3 trips are static sections the shopper
  works through whenever suits them, in whatever order.
- Deriving or cross-checking shopping quantities from individual recipe
  ingredients in `src/data/recipes.json` — this feature's numbers come only
  from the aggregated shopping-list document (see Data & rules).
- Editing item quantities, adding custom items, or multiple saved lists.
- Any automatic reset of checked items (e.g. tied to a 14-day cycle).

## Acceptance criteria

- **AC1** – Given the shopping screen, when it loads, then it shows the 3
  trips in order (pantry & freezer, fresh week 1, fresh week 2), each
  visibly labeled, with every item from that trip's section of
  `data/source/gf-bevasarlolista-2het.md` appearing exactly once, grouped
  under the same category headings the source uses (e.g. trip 1's "Hús,
  tojás", "Gluténmentes speciális termékek").

- **AC2** – Given no family size has been set yet, when the screen loads,
  then it behaves as family size = 1, and every item's displayed quantity
  equals its per-person amount from the source document unchanged (e.g.
  "gluténmentes kenyér/zsemle: kb. 800 g").

- **AC3** – Given the shopper sets family size to 4, when the screen
  re-renders, then every item's displayed quantity is its per-person amount
  × 4 (e.g. "pörköltnek való sovány hús" 1500 g → 6000 g, "gluténmentes
  kenyér/zsemle" kb. 800 g → kb. 3200 g), and the chosen family size is
  still 4 after reloading the page.

- **AC4** – Given an item whose source amount carries a qualifier or
  approximation (e.g. "tojás (M-es): kb. 17 db"), when its quantity is
  scaled by family size, then the numeric amount scales (17 × N) while the
  qualifier ("kb.") and unit ("db") remain attached and readable, not
  dropped.

- **AC5** – Given "gluténmentes kenyér/zsemle" in trip 1, when it renders,
  then it shows the same gluten-risk badge used on recipe cards/detail
  views (specs 002/003); given "light sajt" in trip 2, when it renders,
  then it shows no badge (that softer check-once tier is backlog #006, not
  this spec).

- **AC6** – Given any item's checkbox, when the shopper checks it, then it
  renders as checked, and remains checked after reloading the page; the
  same item in a *different* trip (e.g. "leveszöldség" appears in both the
  week-1 and week-2 fresh trips) has its own independent checked state.

- **AC7** – Given a trip with some items checked, when the shopper uses that
  trip's "lista törlése" action, then every item in that trip becomes
  unchecked, and checked items in the other two trips are unaffected.

- **AC8** – Given the shopping screen at 360px width, when rendered, then
  every trip section, item, checkbox, the family-size input and each trip's
  clear action are fully readable with no horizontal scrolling, and tap
  targets (checkboxes, clear action) are large enough for one-handed phone
  use (constitution principle 3).

## Data & rules

- Source of truth: `data/source/gf-bevasarlolista-2het.md`. Its 3 sections
  become the 3 trips, in the order they appear in the document; its
  category subheadings within each trip are preserved as-is. This feature
  does not re-derive or cross-check these numbers against
  `src/data/recipes.json` — per the document's own opening note, several
  items (e.g. "oregánó, só, bors ízlés szerint" style entries elsewhere in
  the project) have no numeric amount, and the freezer meat quantities are
  deliberately repeated in later trips as "thawed from the freezer"
  reminders, not fresh purchases — both are easier to keep as the document
  states them than to re-derive.
- Every quantity in the source is already per one person; the displayed
  quantity for a family size of N is `amount × N`. Family size is a single
  number covering the whole shopping list (not per trip, not per item).
- An item appearing in more than one trip (e.g. "leveszöldség" in both fresh
  trips, or a "+ 1000 g ... a fagyasztóból kiolvasztva" freezer reminder
  line) is a separate checkable item in each trip it appears in — checking
  it in one trip has no effect on the other.
- Gluten-risk badge rule, this feature's scope only: an item is flagged iff
  it is bread/roll, a gluten-free flour mix, (GM-certified) oats, ham/cold
  cuts, protein powder/concentrate, or dark chocolate — the "must always
  buy labelled gluten-free" tier from the `gluten-free-domain` skill. The
  source document's own "Gluténmentes speciális termékek" category is
  exactly this tier for the pantry trip; ham in the fresh trips gets the
  same flag. The softer "check once" tier (light cheese, sour cream,
  ketchup, baking powder) is never flagged here.
- Trip labels (Hungarian, no date references since trips aren't date-bound
  in this spec): "1. Kamra & fagyasztó", "2. heti bevásárlás (friss)", "3.
  heti bevásárlás (friss)".

## Open questions

None — resolved during the interview:
- Shopping quantities come from a new parse of the bevásárlólista document
  (mirroring spec 001's recipe import), not from summing recipe ingredients.
- Family size is one number, set directly on this screen, defaulting to 1,
  persisted client-side.
- The 3 trips are static sections with no tie to spec 003's cycle anchor.
- Checked items persist until manually cleared per trip; no automatic
  reset.
- Only the "always buy labelled gluten-free" tier is flagged here; the
  "check once, remember the brand" tier is backlog #006.
