import { describe, expect, it } from 'vitest'
import { createLunchSwapRepository } from './lunchSwapRepository.ts'

function createFakeStorage(): Pick<Storage, 'getItem' | 'setItem'> {
  const store = new Map<string, string>()
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, value),
  }
}

describe('lunchSwapRepository', () => {
  it('AC1: getSwaps is {} by default', () => {
    const repository = createLunchSwapRepository(createFakeStorage())
    expect(repository.getSwaps()).toEqual({})
  })

  it('AC4: setSwap(2, id) then getSwaps() reflects { 2: id }', () => {
    const repository = createLunchSwapRepository(createFakeStorage())
    repository.setSwap(2, 'gf-alternativ-sult-lazac')
    expect(repository.getSwaps()).toEqual({ 2: 'gf-alternativ-sult-lazac' })
  })

  it('AC3: setSwap(2, null) removes that block entry', () => {
    const repository = createLunchSwapRepository(createFakeStorage())
    repository.setSwap(2, 'gf-alternativ-sult-lazac')
    repository.setSwap(2, null)
    expect(repository.getSwaps()).toEqual({})
  })

  it('AC4: swaps for different blocks are independent', () => {
    const repository = createLunchSwapRepository(createFakeStorage())
    repository.setSwap(2, 'gf-alternativ-sult-lazac')
    repository.setSwap(4, 'gf-alternativ-tonhalas-tesztasalata')

    expect(repository.getSwaps()).toEqual({
      2: 'gf-alternativ-sult-lazac',
      4: 'gf-alternativ-tonhalas-tesztasalata',
    })

    repository.setSwap(2, null)
    expect(repository.getSwaps()).toEqual({ 4: 'gf-alternativ-tonhalas-tesztasalata' })
  })

  it('AC9: state survives re-reading the same storage (reload simulation)', () => {
    const storage = createFakeStorage()
    const repository = createLunchSwapRepository(storage)
    repository.setSwap(2, 'gf-alternativ-sult-lazac')

    const reloaded = createLunchSwapRepository(storage)
    expect(reloaded.getSwaps()).toEqual({ 2: 'gf-alternativ-sult-lazac' })
  })
})
