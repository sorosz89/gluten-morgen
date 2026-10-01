import { describe, expect, it } from 'vitest'
import { LABEL_CHECKLIST_PRODUCTS } from './labelChecklist.ts'

describe('labelChecklist', () => {
  it('AC1: lists exactly the 7 check-once products, in order', () => {
    expect(LABEL_CHECKLIST_PRODUCTS).toEqual([
      'sonka/felvágott',
      'fehérjekoncentrátum (protein por)',
      'étcsokoládé',
      'light sajt',
      'tejföl',
      'ketchup',
      'sütőpor',
    ])
  })
})
