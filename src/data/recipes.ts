import { recipeSchema } from '../domain/recipe.ts'
import type { Recipe } from '../domain/recipe.ts'
import raw from './recipes.json' with { type: 'json' }

export const recipes: Recipe[] = recipeSchema.array().parse(raw)
