import { describe, expect, it } from 'vitest'
import { recipes } from '../data/recipes.ts'
import type { Recipe } from './recipe.ts'
import {
  MEAL_TYPE_ORDER,
  groupRecipesByMealType,
  mealTypeLabel,
  recipeHasGlutenRiskIngredient,
  recipeMatchesQuery,
  recipeNeedsLabelCheck,
} from './catalog.ts'

function makeRecipe(overrides: Partial<Recipe>): Recipe {
  return {
    id: 'test-recipe',
    title: 'Teszt recept',
    mealType: 'lunch',
    servingsLabel: '1 adagra',
    ingredients: [{ amount: 1, unit: 'db', name: 'teszt hozzávaló', mustBeGlutenFree: false }],
    stepGroups: [{ heading: 'Elkészítés', steps: ['Tedd meg.'] }],
    ...overrides,
  }
}

describe('MEAL_TYPE_ORDER', () => {
  it('AC1: fixes the section order to breakfast, lunch, dinner, alternative, extra', () => {
    expect(MEAL_TYPE_ORDER).toEqual(['breakfast', 'lunch', 'dinner', 'alternative', 'extra'])
  })
})

describe('mealTypeLabel', () => {
  it('AC1: returns the Hungarian label for each meal type', () => {
    expect(mealTypeLabel('breakfast')).toBe('Reggeli')
    expect(mealTypeLabel('lunch')).toBe('Ebéd')
    expect(mealTypeLabel('dinner')).toBe('Vacsora')
    expect(mealTypeLabel('alternative')).toBe('Alternatíva')
    expect(mealTypeLabel('extra')).toBe('Extra')
  })
})

describe('groupRecipesByMealType', () => {
  it('AC1: groups recipes into sections in the fixed order and omits empty sections', () => {
    const fixture = [
      makeRecipe({ id: 'a', mealType: 'dinner' }),
      makeRecipe({ id: 'b', mealType: 'breakfast' }),
      makeRecipe({ id: 'c', mealType: 'breakfast' }),
    ]

    const sections = groupRecipesByMealType(fixture)

    expect(sections.map((section) => section.mealType)).toEqual(['breakfast', 'dinner'])
    expect(sections[0]).toEqual({
      mealType: 'breakfast',
      label: 'Reggeli',
      recipes: [fixture[1], fixture[2]],
    })
    expect(sections[1]).toEqual({
      mealType: 'dinner',
      label: 'Vacsora',
      recipes: [fixture[0]],
    })
  })

  it('AC1: every real recipe appears exactly once across the grouped sections', () => {
    const sections = groupRecipesByMealType(recipes)
    const grouped = sections.flatMap((section) => section.recipes)
    expect(grouped).toHaveLength(recipes.length)
    expect(new Set(grouped.map((recipe) => recipe.id)).size).toBe(recipes.length)
  })
})

describe('recipeHasGlutenRiskIngredient', () => {
  it('AC2: returns true for Melegszendvics, which has a mustBeGlutenFree ingredient', () => {
    const melegszendvics = recipes.find((recipe) => recipe.id === 'gf-vacsora-melegszendvics')
    expect(melegszendvics).toBeDefined()
    expect(recipeHasGlutenRiskIngredient(melegszendvics!)).toBe(true)
  })

  it('AC3: returns false for the alternative rice dish, which has no mustBeGlutenFree ingredient', () => {
    const riceDish = recipes.find((recipe) => recipe.id === 'gf-alternativ-csirkes-rizses-egytal')
    expect(riceDish).toBeDefined()
    expect(recipeHasGlutenRiskIngredient(riceDish!)).toBe(false)
  })
})

describe('recipeNeedsLabelCheck', () => {
  it('returns true for a recipe with a glutenFreeNote but no flagged ingredient', () => {
    const riceDish = recipes.find((recipe) => recipe.id === 'gf-alternativ-csirkes-rizses-egytal')
    expect(riceDish).toBeDefined()
    expect(riceDish!.glutenFreeNote).toBeTruthy()
    expect(recipeHasGlutenRiskIngredient(riceDish!)).toBe(false)
    expect(recipeNeedsLabelCheck(riceDish!)).toBe(true)
  })

  it('returns false for a recipe with a flagged ingredient, even if it also has a glutenFreeNote', () => {
    const melegszendvics = recipes.find((recipe) => recipe.id === 'gf-vacsora-melegszendvics')
    expect(melegszendvics).toBeDefined()
    expect(recipeNeedsLabelCheck(melegszendvics!)).toBe(false)
  })

  it('returns false for a recipe with neither a glutenFreeNote nor a flagged ingredient', () => {
    expect(recipeNeedsLabelCheck(makeRecipe({ glutenFreeNote: undefined }))).toBe(false)
  })
})

describe('recipeMatchesQuery', () => {
  it('AC4: matches "sonka" against Melegszendvics via its ham ingredient', () => {
    const melegszendvics = recipes.find((recipe) => recipe.id === 'gf-vacsora-melegszendvics')
    expect(recipeMatchesQuery(melegszendvics!, 'sonka')).toBe(true)
  })

  it('AC4: matches case-insensitively against the title', () => {
    const recipe = makeRecipe({ title: 'Gulyásleves' })
    expect(recipeMatchesQuery(recipe, 'GULYÁS')).toBe(true)
  })

  it('AC4: returns true for every recipe when the query is empty', () => {
    const recipe = makeRecipe({})
    expect(recipeMatchesQuery(recipe, '')).toBe(true)
  })

  it('AC4: returns false when the query matches neither title nor ingredients', () => {
    const recipe = makeRecipe({ title: 'Gulyásleves' })
    expect(recipeMatchesQuery(recipe, 'xyz')).toBe(false)
  })
})
