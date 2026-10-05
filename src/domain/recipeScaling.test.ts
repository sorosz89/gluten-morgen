import { describe, expect, it } from 'vitest'
import { recipes } from '../data/recipes.ts'
import type { Ingredient } from './recipe.ts'
import {
  DEFAULT_PORTION_COUNT,
  MAX_PORTION_COUNT,
  MIN_PORTION_COUNT,
  parseBaseCount,
  scaleIngredient,
} from './recipeScaling.ts'

const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]))

function findIngredient(recipeId: string, name: string): Ingredient {
  const recipe = recipesById.get(recipeId)!
  const ingredient = recipe.ingredients.find((candidate) => candidate.name === name)
  if (!ingredient) throw new Error(`ingredient not found: ${recipeId} / ${name}`)
  return ingredient
}

describe('constants', () => {
  it('AC1/AC4: default is 4, bounds are 1 and 20', () => {
    expect(DEFAULT_PORTION_COUNT).toBe(4)
    expect(MIN_PORTION_COUNT).toBe(1)
    expect(MAX_PORTION_COUNT).toBe(20)
  })
})

describe('parseBaseCount', () => {
  it('AC1: "4 napi adagra" -> 4', () => {
    expect(parseBaseCount(recipesById.get('gf-ebed-gulyasleves')!.servingsLabel)).toBe(4)
  })

  it('AC2: "1 adagra" -> 1', () => {
    expect(parseBaseCount(recipesById.get('gf-reggeli-proteines-zabkasa')!.servingsLabel)).toBe(1)
  })

  it('"4 főre" -> 4', () => {
    expect(parseBaseCount(recipesById.get('mezes-mustaros-sult-oldalas')!.servingsLabel)).toBe(4)
  })

  it('a non-leading integer is still found: "teljes tepsi, 4 napi adagra" -> 4', () => {
    expect(parseBaseCount(recipesById.get('gf-reggeli-gorogjoghurtos-banan-muffin')!.servingsLabel)).toBe(4)
  })

  it('the first of several integers wins: "4 napi adagra / teljes tepsire" -> 4', () => {
    expect(parseBaseCount(recipesById.get('gf-reggeli-turos-epres-suti')!.servingsLabel)).toBe(4)
  })
})

describe('scaleIngredient', () => {
  it('AC5: amount: null is returned unchanged regardless of factor', () => {
    const ingredient = findIngredient('mezes-mustaros-sult-oldalas', 'só, bors')
    expect(ingredient.amount).toBeNull()

    expect(scaleIngredient(ingredient, 1.5)).toEqual(ingredient)
    expect(scaleIngredient(ingredient, 0.25)).toEqual(ingredient)
  })

  it('AC1: factor 1 returns the ingredient unchanged, including amountText', () => {
    const ingredient = findIngredient('mezes-mustaros-sult-oldalas', 'méz')
    expect(scaleIngredient(ingredient, 1)).toEqual(ingredient)
  })

  it('AC2/AC7: zabkása oats scale from 70 g to 280 g at factor 4 (default 4 over base 1)', () => {
    const ingredient = findIngredient('gf-reggeli-proteines-zabkasa', 'gluténmentes (GM) zabpehely (csere: köles-')
    expect(ingredient.amount).toBe(70)

    const scaled = scaleIngredient(ingredient, 4)

    expect(scaled.amount).toBe(280)
    expect(scaled.unit).toBe(ingredient.unit)
    expect(scaled.name).toBe(ingredient.name)
  })

  it('AC6/AC7: ribs méz (amount 3, amountText "3-4") drops the range text and rounds once scaled off base', () => {
    const ingredient = findIngredient('mezes-mustaros-sult-oldalas', 'méz')
    expect(ingredient.amount).toBe(3)
    expect(ingredient.amountText).toBe('3-4')

    const scaled = scaleIngredient(ingredient, 1.5)

    expect(scaled.amount).toBe(5) // 3 * 1.5 = 4.5, rounds up
    expect(scaled.amountText).toBeUndefined()
  })

  it('AC7: rounds to the nearest whole number', () => {
    const ingredient: Ingredient = {
      amount: 10,
      unit: 'g',
      name: 'test',
      mustBeGlutenFree: false,
    }

    expect(scaleIngredient(ingredient, 1.24).amount).toBe(12) // 12.4 -> 12
    expect(scaleIngredient(ingredient, 1.25).amount).toBe(13) // 12.5 -> 13 (rounds up)
  })
})
