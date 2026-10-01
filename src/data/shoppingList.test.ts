import { describe, expect, it } from 'vitest'
import { shoppingTripSchema } from '../domain/shoppingList.ts'
import { shoppingList } from './shoppingList.ts'

describe('shoppingList data loader', () => {
  it('T2: loads all 3 trips', () => {
    expect(shoppingList).toHaveLength(3)
  })

  it('T2: every trip is already schema-valid', () => {
    for (const trip of shoppingList) {
      expect(shoppingTripSchema.safeParse(trip).success).toBe(true)
    }
  })
})
