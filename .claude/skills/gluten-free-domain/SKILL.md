---
name: gluten-free-domain
description: Domain knowledge for the Zero Gluten app - gluten-free safety rules, forbidden ingredients, hidden-gluten products, the 2-week meal rotation and Hungarian recipe vocabulary. Use whenever writing specs, code, tests or UI text that touches recipes, ingredients, swaps, shopping lists or the meal plan.
user-invocable: false
---

# Gluten-free domain rules

Source files: `data/source/gf-etrend-attekintes.md` (plan + rules) and
`data/source/gf-bevasarlolista-2het.md` (shopping). These are the truth; this
skill is a summary.

## Safety rules (treat violations as bugs)

- **Never suggest** as a swap or alternative: bulgur, kuszkusz (couscous),
  durum tészta, búzaliszt, regular zabpehely, árpa, rozs, maláta.
- **Safe swaps** for grains: köles, quinoa, hajdina, vörös lencse, rizs.
- **Must be bought labelled gluten-free** (show a clear flag in UI):
  kenyér/zsemle, lisztkeverék, zabpehely ("GM" certified), sonka/felvágott,
  fehérjekoncentrátum/protein por, étcsoki, mustár.
- **Check the label once, then remember the brand**: light sajt, tejföl,
  ketchup, sütőpor.
- Cross-contamination: separate cutting board, toaster, baking sheet and oil
  for gluten-free food if anyone at home eats regular bread.

## Meal plan model

- 2-week cycle, 4 blocks. Block 1: week 1 Sun–Wed, block 2: week 1 Wed–Sun,
  block 3: week 2 Sun–Wed, block 4: week 2 Wed–Sun. Wednesday belongs to both
  neighbouring blocks in the source; a spec must decide how to handle it.
- Each block = 1 breakfast + 1 lunch + 1 dinner recipe, cooked in bulk.
- Block 1: joghurtos magmix / gulyásleves / sonkás tükörtojás
- Block 2: görögjoghurtos-banán muffin / húsos zöldséges passata / melegszendvics
- Block 3: túrós epres süti / savanyú lencseleves / sajtos szendvics
- Block 4: proteines zabkása / paradicsomos húsgombóc / tojásos-avokádó saláta
- Quantities are per person; multiply by family size.
- "Alternatív" recipes are not in the rotation unless a user swaps one in.

## Vocabulary (Hungarian → English)

reggeli breakfast · ebéd lunch · vacsora dinner · hozzávalók ingredients ·
előkészület prep (mise en place) · elkészítés method · makró macros ·
fehérje protein · szénhidrát carbs · zsír fat · rost fiber · só salt ·
adag portion · evőkanál tablespoon · teáskanál teaspoon · db piece ·
gerezd clove · ízlés szerint to taste · kiolvasztva thawed · fagyasztó freezer ·
bevásárlólista shopping list · kamra pantry
