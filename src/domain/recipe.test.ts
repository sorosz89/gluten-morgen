import { describe, expect, it } from 'vitest'
import { recipeSchema } from './recipe.ts'
import type { Recipe } from './recipe.ts'

const validRecipe: Recipe = {
  id: 'gf-ebed-gulyasleves',
  title: 'Gulyásleves',
  mealType: 'lunch',
  servingsLabel: '4 napi adagra',
  ingredients: [
    {
      amount: 1000,
      unit: 'g',
      name: 'pörköltnek való sovány hús',
      mustBeGlutenFree: false,
    },
  ],
  stepGroups: [{ heading: 'Elkészítés', steps: ['Hevítsd fel a zsírt.'] }],
  macros: {
    kcal: 822,
    proteinG: 65,
    carbsG: 77,
    saltMg: 670,
    fatG: 28,
    fiberG: 12,
  },
}

describe('recipeSchema', () => {
  it('AC1: accepts a minimal valid recipe', () => {
    expect(recipeSchema.safeParse(validRecipe).success).toBe(true)
  })

  it('AC1: rejects a recipe with no ingredients', () => {
    const result = recipeSchema.safeParse({ ...validRecipe, ingredients: [] })
    expect(result.success).toBe(false)
  })

  it('AC1: rejects an ingredient where amount and unit disagree on null', () => {
    const result = recipeSchema.safeParse({
      ...validRecipe,
      ingredients: [
        { amount: 5, unit: null, name: 'só', mustBeGlutenFree: false },
      ],
    })
    expect(result.success).toBe(false)
  })
})
