import { describe, expect, it } from 'vitest'
import { recipes } from '../data/recipes.ts'
import { BLOCK_RECIPE_IDS, getRotationDay, parseIsoDate } from './rotation.ts'

describe('getRotationDay', () => {
  it('AC2: block 1, cook today, on the anchor Sunday itself (2026-10-04)', () => {
    const anchor = parseIsoDate('2026-10-04')
    expect(getRotationDay(anchor, parseIsoDate('2026-10-04'))).toEqual({
      block: 1,
      cookToday: true,
    })
  })

  it('AC3: block 1, no cook, on the last day of block 1 (2026-10-06, Tuesday)', () => {
    const anchor = parseIsoDate('2026-10-04')
    expect(getRotationDay(anchor, parseIsoDate('2026-10-06'))).toEqual({
      block: 1,
      cookToday: false,
    })
  })

  it('AC4: block 2, cook today, on the following Wednesday (2026-10-07)', () => {
    const anchor = parseIsoDate('2026-10-04')
    expect(getRotationDay(anchor, parseIsoDate('2026-10-07'))).toEqual({
      block: 2,
      cookToday: true,
    })
  })

  it('AC5: wraps back to block 1, cook today, 14 days after the anchor (2026-10-18)', () => {
    const anchor = parseIsoDate('2026-10-04')
    expect(getRotationDay(anchor, parseIsoDate('2026-10-18'))).toEqual({
      block: 1,
      cookToday: true,
    })
  })
})

describe('BLOCK_RECIPE_IDS', () => {
  it('every mapped id exists in the real recipe data with the expected mealType', () => {
    const byId = new Map(recipes.map((recipe) => [recipe.id, recipe]))

    for (const { breakfastId, lunchId, dinnerId } of Object.values(BLOCK_RECIPE_IDS)) {
      expect(byId.get(breakfastId)?.mealType).toBe('breakfast')
      expect(byId.get(lunchId)?.mealType).toBe('lunch')
      expect(byId.get(dinnerId)?.mealType).toBe('dinner')
    }
  })
})
