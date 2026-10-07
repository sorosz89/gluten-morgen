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

// A recipe can carry gluten-safety guidance (e.g. a cross-contamination or
// check-the-label note) without any single ingredient being flagged
// `mustBeGlutenFree` — Catalog/Today must still signal that, distinctly from
// the stronger ingredient-level badge, so the caution isn't invisible at the
// list level (spec: recipe-detail critique, P1).
export function recipeNeedsLabelCheck(recipe: Recipe): boolean {
  return Boolean(recipe.glutenFreeNote) && !recipeHasGlutenRiskIngredient(recipe)
}

export function recipeMatchesQuery(recipe: Recipe, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase()
  if (normalizedQuery === '') return true

  if (recipe.title.toLowerCase().includes(normalizedQuery)) return true
  return recipe.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(normalizedQuery))
}
