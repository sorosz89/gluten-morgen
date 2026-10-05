const RECIPE_PORTIONS_KEY = 'zero-gluten:recipe-portions'

export interface RecipePortionsRepository {
  getPortions(recipeId: string): number | null
  setPortions(recipeId: string, count: number): void
}

function readPortions(storage: Pick<Storage, 'getItem' | 'setItem'>): Record<string, number> {
  const raw = storage.getItem(RECIPE_PORTIONS_KEY)
  if (!raw) return {}

  try {
    return JSON.parse(raw) as Record<string, number>
  } catch {
    return {}
  }
}

function writePortions(storage: Pick<Storage, 'getItem' | 'setItem'>, portions: Record<string, number>): void {
  storage.setItem(RECIPE_PORTIONS_KEY, JSON.stringify(portions))
}

export function createRecipePortionsRepository(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
): RecipePortionsRepository {
  return {
    getPortions(recipeId) {
      return readPortions(storage)[recipeId] ?? null
    },
    setPortions(recipeId, count) {
      const portions = readPortions(storage)
      portions[recipeId] = count
      writePortions(storage, portions)
    },
  }
}

export const recipePortionsRepository: RecipePortionsRepository =
  createRecipePortionsRepository(window.localStorage)
