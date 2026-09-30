import type { MealType, Recipe } from './recipe.ts'

export const MEAL_TYPE_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'alternative', 'extra']

const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'Reggeli',
  lunch: 'Ebéd',
  dinner: 'Vacsora',
  alternative: 'Alternatíva',
  extra: 'Extra',
}

export function mealTypeLabel(mealType: MealType): string {
  return MEAL_TYPE_LABELS[mealType]
}

export interface CatalogSection {
  mealType: MealType
  label: string
  recipes: Recipe[]
}

export function groupRecipesByMealType(recipes: Recipe[]): CatalogSection[] {
  return MEAL_TYPE_ORDER.map((mealType) => ({
    mealType,
    label: mealTypeLabel(mealType),
    recipes: recipes.filter((recipe) => recipe.mealType === mealType),
  })).filter((section) => section.recipes.length > 0)
}

export function recipeHasGlutenRiskIngredient(recipe: Recipe): boolean {
  return recipe.ingredients.some((ingredient) => ingredient.mustBeGlutenFree)
}

export function recipeMatchesQuery(recipe: Recipe, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase()
  if (normalizedQuery === '') return true

  if (recipe.title.toLowerCase().includes(normalizedQuery)) return true
  return recipe.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(normalizedQuery))
}
