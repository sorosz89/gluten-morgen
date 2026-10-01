import { describe, expect, it } from 'vitest'
import { createLabelChecklistRepository } from './labelChecklistRepository.ts'

function createFakeStorage(): Pick<Storage, 'getItem' | 'setItem'> {
  const store = new Map<string, string>()
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, value),
  }
}

describe('labelChecklistRepository', () => {
  it('AC2: isChecked returns false for an untouched product', () => {
    const repository = createLabelChecklistRepository(createFakeStorage())
    expect(repository.isChecked('sonka/felvágott')).toBe(false)
  })

  it('AC2: setChecked then isChecked round-trips, including over a fresh repository on the same storage', () => {
    const storage = createFakeStorage()
    const repository = createLabelChecklistRepository(storage)
    repository.setChecked('fehérjekoncentrátum (protein por)', true)

    expect(repository.isChecked('fehérjekoncentrátum (protein por)')).toBe(true)

    const reloaded = createLabelChecklistRepository(storage)
    expect(reloaded.isChecked('fehérjekoncentrátum (protein por)')).toBe(true)
  })

  it('AC3: setChecked(false) unchecks a previously checked product', () => {
    const repository = createLabelChecklistRepository(createFakeStorage())
    repository.setChecked('étcsokoládé', true)
    repository.setChecked('étcsokoládé', false)
    expect(repository.isChecked('étcsokoládé')).toBe(false)
  })

  it('AC2/AC3: checking one product leaves every other product unaffected', () => {
    const repository = createLabelChecklistRepository(createFakeStorage())
    repository.setChecked('ketchup', true)

    expect(repository.isChecked('ketchup')).toBe(true)
    expect(repository.isChecked('tejföl')).toBe(false)
    expect(repository.isChecked('sütőpor')).toBe(false)
  })
})
