import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildRecipes } from './import-recipes.ts'

const FORBIDDEN_TERMS = ['bulgur', 'kuszkusz', 'durum', 'búzaliszt']

const sourceDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'source')
const recipes = buildRecipes(sourceDir)

describe('buildRecipes (real data/source)', () => {
  it('AC1: imports all 18 recipes', () => {
    expect(recipes).toHaveLength(18)
  })

  it('AC3: gf-ebed-gulyasleves has the exact expected shape', () => {
    const gulyas = recipes.find((recipe) => recipe.id === 'gf-ebed-gulyasleves')
    expect(gulyas).toBeDefined()
    expect(gulyas?.mealType).toBe('lunch')
    expect(gulyas?.servingsLabel).toBe('4 napi adagra')
    expect(gulyas?.ingredients).toHaveLength(8)
    expect(
      gulyas?.stepGroups.reduce((total, group) => total + group.steps.length, 0),
    ).toBe(9)
    expect(gulyas?.macros).toEqual({
      kcal: 822,
      proteinG: 65,
      carbsG: 77,
      saltMg: 670,
      fatG: 28,
      fiberG: 12,
    })
  })

  it('AC6: no ingredient name contains a forbidden term (only notes may)', () => {
    for (const recipe of recipes) {
      for (const ingredient of recipe.ingredients) {
        for (const term of FORBIDDEN_TERMS) {
          expect(ingredient.name.toLowerCase()).not.toContain(term)
        }
      }
    }
  })
})
