import { describe, expect, it } from 'vitest'
import { recipeSchema } from '../domain/recipe.ts'
import { recipes } from './recipes.ts'

describe('recipes data loader', () => {
  it('T1: loads all 18 recipes', () => {
    expect(recipes).toHaveLength(18)
  })

  it('T1: every recipe is already schema-valid', () => {
    for (const recipe of recipes) {
      expect(recipeSchema.safeParse(recipe).success).toBe(true)
    }
  })
})
