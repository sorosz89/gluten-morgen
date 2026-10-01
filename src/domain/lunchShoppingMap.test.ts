import { describe, expect, it } from 'vitest'
import { recipes } from '../data/recipes.ts'
import { shoppingList } from '../data/shoppingList.ts'
import { ALTERNATIVE_RECIPE_IDS } from './lunchSwap.ts'
import { BLOCK_RECIPE_IDS } from './rotation.ts'
import { LUNCH_SHOPPING_MAP, applyLunchSwaps, diffRemovedItems, resolveTripId } from './lunchShoppingMap.ts'

const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]))

const RELEVANT_RECIPE_IDS = [
  ...Object.values(BLOCK_RECIPE_IDS).map((ids) => ids.lunchId),
  ...ALTERNATIVE_RECIPE_IDS,
]

// "M-es tojás" (Paradicsomos húsgombóc) is recorded by weight (g), but the shopping
// list's only egg item ("tojás (M-es)") is counted by piece (db) — an incompatible
// unit with no safe arithmetic merge, so it is deliberately left unmapped.
const KNOWN_UNMAPPED = new Set(['gf-ebed-paradicsomos-husgomboc::M-es tojás'])

function findTrip(trips: typeof shoppingList, tripId: string) {
  return trips.find((trip) => trip.id === tripId)!
}

function findItem(trips: typeof shoppingList, tripId: string, category: string, itemName: string) {
  const trip = findTrip(trips, tripId)
  const found = trip.categories.find((c) => c.heading === category)?.items.find((i) => i.name === itemName)
  return found
}

describe('LUNCH_SHOPPING_MAP completeness', () => {
  it('every g/db ingredient with a non-null amount across the 9 relevant recipes has exactly one row, except the documented exception', () => {
    for (const recipeId of RELEVANT_RECIPE_IDS) {
      const recipe = recipesById.get(recipeId)!
      for (const ingredient of recipe.ingredients) {
        if (ingredient.amount === null) continue
        if (ingredient.unit !== 'g' && ingredient.unit !== 'db') continue

        const key = `${recipeId}::${ingredient.name}`
        const matches = LUNCH_SHOPPING_MAP.filter(
          (row) => row.recipeId === recipeId && row.ingredientName === ingredient.name,
        )

        if (KNOWN_UNMAPPED.has(key)) {
          expect(matches).toHaveLength(0)
        } else {
          expect(matches).toHaveLength(1)
        }
      }
    }
  })
})

describe('resolveTripId', () => {
  it('pantry placement always resolves to the pantry trip regardless of block', () => {
    expect(resolveTripId('pantry', 1)).toBe('pantry')
    expect(resolveTripId('pantry', 4)).toBe('pantry')
  })

  it('fresh placement resolves to freshWeek1 for blocks 1-2 and freshWeek2 for blocks 3-4', () => {
    expect(resolveTripId('fresh', 1)).toBe('freshWeek1')
    expect(resolveTripId('fresh', 2)).toBe('freshWeek1')
    expect(resolveTripId('fresh', 3)).toBe('freshWeek2')
    expect(resolveTripId('fresh', 4)).toBe('freshWeek2')
  })
})

describe('applyLunchSwaps', () => {
  it('with no swaps, returns the trips unchanged (deep-equal to shoppingList)', () => {
    expect(applyLunchSwaps(shoppingList, {}, recipesById)).toEqual(shoppingList)
  })

  it('AC5/AC6: block 2 swapped to the salmon dish reproduces the spec numbers', () => {
    const result = applyLunchSwaps(shoppingList, { 2: 'gf-alternativ-sult-lazac' }, recipesById)

    expect(findItem(result, 'pantry', 'Hús, tojás', 'darált hús')?.amount).toBe(800)
    expect(findItem(result, 'pantry', 'Száraz áru, konzerv, egyéb', 'csicseriborsó (konzerv)')).toBeUndefined()
    expect(findItem(result, 'pantry', 'Száraz áru, konzerv, egyéb', 'paradicsom passata')?.amount).toBe(500)
    expect(findItem(result, 'freshWeek1', 'Zöldség, gyümölcs', 'sárgarépa')).toBeUndefined()
    expect(findItem(result, 'freshWeek1', 'Zöldség, gyümölcs', 'cukkini')).toBeUndefined()

    expect(findItem(result, 'freshWeek1', 'Hús, hal, tojás', 'lazacfilé')?.amount).toBe(640)
    expect(findItem(result, 'freshWeek1', 'Zöldség, gyümölcs', 'brokkoli')?.amount).toBe(400)
    expect(findItem(result, 'freshWeek1', 'Zöldség, gyümölcs', 'burgonya')?.amount).toBe(1300)
  })

  it('AC7: a block swapped to the tuna pasta salad adds the gluten-risk "gluténmentes tészta" line', () => {
    const result = applyLunchSwaps(shoppingList, { 2: 'gf-alternativ-tonhalas-tesztasalata' }, recipesById)

    const item = findItem(result, 'pantry', 'Gluténmentes speciális termékek', 'gluténmentes tészta')
    expect(item?.amount).toBe(280)
    expect(item?.mustBeGlutenFree).toBe(true)
  })

  it('a pantry meat line that is removed also clears its paired freezer-reminder line in the swapped block\'s fresh trip', () => {
    const result = applyLunchSwaps(shoppingList, { 2: 'gf-alternativ-sult-lazac' }, recipesById)

    expect(
      findItem(result, 'freshWeek1', 'Hús, hal, tojás', 'darált hús a fagyasztóból kiolvasztva (lásd fent)'),
    ).toBeUndefined()
    // block 4's own freezer reminder (freshWeek2) is untouched by block 2's swap
    expect(
      findItem(result, 'freshWeek2', 'Hús, hal, tojás', 'darált hús a fagyasztóból kiolvasztva (lásd fent)')?.amount,
    ).toBe(800)
  })
})

describe('diffRemovedItems', () => {
  it('reports items present before but absent after, and nothing else', () => {
    const before = shoppingList
    const after = applyLunchSwaps(shoppingList, { 2: 'gf-alternativ-sult-lazac' }, recipesById)

    const removed = diffRemovedItems(before, after)

    expect(removed).toEqual(
      expect.arrayContaining([
        { tripId: 'pantry', itemName: 'csicseriborsó (konzerv)' },
        { tripId: 'freshWeek1', itemName: 'sárgarépa' },
        { tripId: 'freshWeek1', itemName: 'cukkini' },
        { tripId: 'freshWeek1', itemName: 'darált hús a fagyasztóból kiolvasztva (lásd fent)' },
      ]),
    )
    expect(removed).not.toEqual(expect.arrayContaining([{ tripId: 'pantry', itemName: 'darált hús' }]))
  })
})
