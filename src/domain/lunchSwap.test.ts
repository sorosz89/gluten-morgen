import { describe, expect, it } from 'vitest'
import { recipes } from '../data/recipes.ts'
import { BLOCK_RECIPE_IDS } from './rotation.ts'
import { ALTERNATIVE_RECIPE_IDS, getActiveLunchId } from './lunchSwap.ts'

describe('getActiveLunchId', () => {
  it('AC1: returns the block default lunch id when swaps has no entry for it', () => {
    expect(getActiveLunchId(1, {})).toBe(BLOCK_RECIPE_IDS[1].lunchId)
    expect(getActiveLunchId(2, {})).toBe(BLOCK_RECIPE_IDS[2].lunchId)
    expect(getActiveLunchId(3, {})).toBe(BLOCK_RECIPE_IDS[3].lunchId)
    expect(getActiveLunchId(4, {})).toBe(BLOCK_RECIPE_IDS[4].lunchId)
  })

  it('AC4: returns the swapped id when one is set for that block', () => {
    const swaps = { 2: 'gf-alternativ-sult-lazac' }
    expect(getActiveLunchId(2, swaps)).toBe('gf-alternativ-sult-lazac')
  })

  it('AC4: other blocks are unaffected by a swap on one block', () => {
    const swaps = { 2: 'gf-alternativ-sult-lazac' }
    expect(getActiveLunchId(1, swaps)).toBe(BLOCK_RECIPE_IDS[1].lunchId)
  })
})

describe('ALTERNATIVE_RECIPE_IDS', () => {
  it('AC1: contains exactly the 5 alternative-mealType recipe ids', () => {
    const actualAlternativeIds = recipes
      .filter((recipe) => recipe.mealType === 'alternative')
      .map((recipe) => recipe.id)
      .sort()

    expect([...ALTERNATIVE_RECIPE_IDS].sort()).toEqual(actualAlternativeIds)
  })
})
