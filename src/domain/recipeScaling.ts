import type { Ingredient } from './recipe.ts'

export const DEFAULT_PORTION_COUNT = 4
export const MIN_PORTION_COUNT = 1
export const MAX_PORTION_COUNT = 20

export function parseBaseCount(servingsLabel: string): number {
  const match = servingsLabel.match(/\d+/)
  if (!match) {
    throw new Error(`servingsLabel has no integer to use as a base count: "${servingsLabel}"`)
  }
  return Number(match[0])
}

export function scaleIngredient(ingredient: Ingredient, factor: number): Ingredient {
  if (ingredient.amount === null || factor === 1) {
    return ingredient
  }

  return {
    ...ingredient,
    amount: Math.round(ingredient.amount * factor),
    amountText: undefined,
  }
}
