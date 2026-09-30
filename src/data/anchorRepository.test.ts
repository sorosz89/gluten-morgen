import { describe, expect, it } from 'vitest'
import { createAnchorRepository } from './anchorRepository.ts'

function createFakeStorage(): Pick<Storage, 'getItem' | 'setItem'> {
  const store = new Map<string, string>()
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, value),
  }
}

describe('anchorRepository', () => {
  it('T2: getAnchor returns null when nothing is stored', () => {
    const repository = createAnchorRepository(createFakeStorage())
    expect(repository.getAnchor()).toBeNull()
  })

  it('T2: setAnchor then getAnchor round-trips the same ISO date string', () => {
    const repository = createAnchorRepository(createFakeStorage())
    repository.setAnchor('2026-10-04')
    expect(repository.getAnchor()).toBe('2026-10-04')
  })
})
