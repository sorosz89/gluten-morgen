import { describe, expect, it } from 'vitest'
import { createShoppingListRepository } from './shoppingListRepository.ts'

function createFakeStorage(): Pick<Storage, 'getItem' | 'setItem'> {
  const store = new Map<string, string>()
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, value),
  }
}

describe('shoppingListRepository', () => {
  it('AC2: getFamilySize returns 1 when nothing is stored', () => {
    const repository = createShoppingListRepository(createFakeStorage())
    expect(repository.getFamilySize()).toBe(1)
  })

  it('AC3: setFamilySize then getFamilySize round-trips', () => {
    const repository = createShoppingListRepository(createFakeStorage())
    repository.setFamilySize(4)
    expect(repository.getFamilySize()).toBe(4)
  })

  it('AC6: isChecked returns false for an untouched item', () => {
    const repository = createShoppingListRepository(createFakeStorage())
    expect(repository.isChecked('pantry', 'teavaj')).toBe(false)
  })

  it('AC6: setChecked then isChecked round-trips per (tripId, itemName)', () => {
    const repository = createShoppingListRepository(createFakeStorage())
    repository.setChecked('pantry', 'teavaj', true)
    expect(repository.isChecked('pantry', 'teavaj')).toBe(true)
    expect(repository.isChecked('freshWeek1', 'teavaj')).toBe(false)
  })

  it('AC6: the same item name in a different trip has independent checked state', () => {
    const repository = createShoppingListRepository(createFakeStorage())
    repository.setChecked('freshWeek1', 'leveszöldség', true)
    expect(repository.isChecked('freshWeek1', 'leveszöldség')).toBe(true)
    expect(repository.isChecked('freshWeek2', 'leveszöldség')).toBe(false)
  })

  it('AC6: setChecked(false) unchecks a previously checked item', () => {
    const repository = createShoppingListRepository(createFakeStorage())
    repository.setChecked('pantry', 'teavaj', true)
    repository.setChecked('pantry', 'teavaj', false)
    expect(repository.isChecked('pantry', 'teavaj')).toBe(false)
  })

  it('AC7: clearTrip unchecks every item in that trip only', () => {
    const repository = createShoppingListRepository(createFakeStorage())
    repository.setChecked('freshWeek1', 'leveszöldség', true)
    repository.setChecked('freshWeek1', 'burgonya', true)
    repository.setChecked('freshWeek2', 'leveszöldség', true)

    repository.clearTrip('freshWeek1')

    expect(repository.isChecked('freshWeek1', 'leveszöldség')).toBe(false)
    expect(repository.isChecked('freshWeek1', 'burgonya')).toBe(false)
    expect(repository.isChecked('freshWeek2', 'leveszöldség')).toBe(true)
  })
})
