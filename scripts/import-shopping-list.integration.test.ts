import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { shoppingTripSchema } from '../src/domain/shoppingList.ts'
import { buildShoppingList } from './import-shopping-list.ts'

const sourceDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'source')
const trips = buildShoppingList(sourceDir)

describe('buildShoppingList (real data/source)', () => {
  it('AC1: imports exactly 3 trips, each schema-valid', () => {
    expect(trips).toHaveLength(3)
    for (const trip of trips) {
      expect(shoppingTripSchema.safeParse(trip).success).toBe(true)
    }
  })

  it('AC1: trips are in document order with their real labels', () => {
    expect(trips.map((trip) => trip.id)).toEqual(['pantry', 'freshWeek1', 'freshWeek2'])
    expect(trips.map((trip) => trip.label)).toEqual([
      '1. Kamra & fagyasztó',
      '2. heti bevásárlás (friss)',
      '3. heti bevásárlás (friss)',
    ])
  })

  it('AC1: trip 1 keeps the source category headings', () => {
    const pantry = trips.find((trip) => trip.id === 'pantry')
    expect(pantry?.categories.map((category) => category.heading)).toEqual([
      'Hús, tojás',
      'Tejtermék',
      'Száraz áru, konzerv, egyéb',
      'Gluténmentes speciális termékek',
    ])
  })
})
