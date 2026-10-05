import { describe, expect, it } from 'vitest'
import { createRecipePortionsRepository } from './recipePortionsRepository.ts'

function createFakeStorage(): Pick<Storage, 'getItem' | 'setItem'> {
  const store = new Map<string, string>()
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, value),
  }
}

describe('recipePortionsRepository', () => {
  it('AC8: getPortions returns null for a recipe id with nothing stored', () => {
    const repository = createRecipePortionsRepository(createFakeStorage())
    expect(repository.getPortions('gf-ebed-gulyasleves')).toBeNull()
  })

  it('AC8: setPortions then getPortions round-trips, including over a fresh repository on the same storage', () => {
    const storage = createFakeStorage()
    const repository = createRecipePortionsRepository(storage)
    repository.setPortions('gf-ebed-gulyasleves', 6)

    expect(repository.getPortions('gf-ebed-gulyasleves')).toBe(6)

    const reloaded = createRecipePortionsRepository(storage)
    expect(reloaded.getPortions('gf-ebed-gulyasleves')).toBe(6)
  })

  it('AC8: portions are isolated per recipe id', () => {
    const repository = createRecipePortionsRepository(createFakeStorage())
    repository.setPortions('gf-ebed-gulyasleves', 6)
    repository.setPortions('gf-reggeli-proteines-zabkasa', 2)

    expect(repository.getPortions('gf-ebed-gulyasleves')).toBe(6)
    expect(repository.getPortions('gf-reggeli-proteines-zabkasa')).toBe(2)
    expect(repository.getPortions('mezes-mustaros-sult-oldalas')).toBeNull()
  })

  it('AC8: setPortions again for the same recipe id overwrites the previous value', () => {
    const repository = createRecipePortionsRepository(createFakeStorage())
    repository.setPortions('gf-ebed-gulyasleves', 6)
    repository.setPortions('gf-ebed-gulyasleves', 1)

    expect(repository.getPortions('gf-ebed-gulyasleves')).toBe(1)
  })
})
