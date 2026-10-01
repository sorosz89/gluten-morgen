import { describe, expect, it } from 'vitest'
import { parseShoppingListMarkdown } from './shoppingListMarkdown.ts'

// Mirrors the real structure and representative lines of
// data/source/gf-bevasarlolista-2het.md closely enough to exercise every
// line shape; the full real document is covered by
// scripts/import-shopping-list.integration.test.ts.
const FIXTURE = `
# Bevásárlólista – 2 hetes gluténmentes RUTIN forgás

Minden mennyiség egy főre értendő – szorozd meg a családtagok számával.

## 1. Kamra & fagyasztó (egyszer, a ciklus elején)

### Hús, tojás
- pörköltnek való sovány hús: 1500 g → fagyasztva, 2 adagban (1000 g az 1. hétre, 500 g a 2. hétre)
- tojás (M-es): kb. 17 db (a Görög joghurtos-banános muffin dupla adag tojást használ)

### Tejtermék
- teavaj: 55 g

### Száraz áru, konzerv, egyéb
- ketchup: 50 g

### Gluténmentes speciális termékek
- gluténmentes kenyér/zsemle: kb. 800 g → fagyasztva, szeletenként kiolvasztva

## 2. Friss bevásárlás – 1. hét (Nap 1 előtt, blokk 1–2)

### Zöldség, gyümölcs
- leveszöldség: 500 g

### Tejtermékek
- light sajt: 50 g

### Hús, hal, tojás
- csirke/pulykamell sonka: 200 g
- + 1000 g pörköltnek való hús a fagyasztóból kiolvasztva (lásd fent)

## 3. Friss bevásárlás – 2. hét (Nap 9 előtt, blokk 3–4)

### Zöldség, gyümölcs
- leveszöldség: 500 g

## Vásárláskor egyszer ellenőrizendő címkék (utána megjegyezhető biztonságos márkaként)
- sonka/felvágott – ne legyen benne búzakeményítő töltőanyag
`

describe('parseShoppingListMarkdown', () => {
  it('AC1: returns 3 trips in document order, skipping the trailing check-once section', () => {
    const trips = parseShoppingListMarkdown(FIXTURE)

    expect(trips.map((trip) => trip.id)).toEqual(['pantry', 'freshWeek1', 'freshWeek2'])
  })

  it('AC1: trip 1 has its real category headings, including "Gluténmentes speciális termékek"', () => {
    const [pantry] = parseShoppingListMarkdown(FIXTURE)

    expect(pantry!.categories.map((category) => category.heading)).toEqual([
      'Hús, tojás',
      'Tejtermék',
      'Száraz áru, konzerv, egyéb',
      'Gluténmentes speciális termékek',
    ])
  })

  it('AC1: a plain line parses to name/amount/unit with no qualifier or note', () => {
    const item = parseShoppingListMarkdown(FIXTURE)[0]!.categories[1]!.items[0]!

    expect(item).toEqual({ name: 'teavaj', amount: 55, unit: 'g', mustBeGlutenFree: false })
  })

  it('AC4: a qualified line keeps "kb." as amountQualifier and the parenthetical as note', () => {
    const item = parseShoppingListMarkdown(FIXTURE)[0]!.categories[0]!.items[1]!

    expect(item.name).toBe('tojás (M-es)')
    expect(item.amount).toBe(17)
    expect(item.amountQualifier).toBe('kb.')
    expect(item.unit).toBe('db')
    expect(item.note).toContain('Görög joghurtos-banános muffin')
  })

  it('AC1: a freezer-reminder line ("+ amount unit name") parses via the other line grammar', () => {
    const freshWeek1 = parseShoppingListMarkdown(FIXTURE).find((trip) => trip.id === 'freshWeek1')!
    const husCategory = freshWeek1.categories.find((category) => category.heading === 'Hús, hal, tojás')!
    const reminder = husCategory.items.find((item) => item.name.startsWith('pörköltnek való hús'))!

    expect(reminder.amount).toBe(1000)
    expect(reminder.unit).toBe('g')
  })

  it('AC5: "gluténmentes kenyér/zsemle" and "csirke/pulykamell sonka" are flagged gluten-risk', () => {
    const [pantry, freshWeek1] = parseShoppingListMarkdown(FIXTURE)

    const bread = pantry!.categories[3]!.items[0]!
    expect(bread.name).toBe('gluténmentes kenyér/zsemle')
    expect(bread.mustBeGlutenFree).toBe(true)

    const ham = freshWeek1!.categories[2]!.items[0]!
    expect(ham.name).toBe('csirke/pulykamell sonka')
    expect(ham.mustBeGlutenFree).toBe(true)
  })

  it('AC5: "light sajt" and "ketchup" are not flagged (softer check-once tier, backlog #006)', () => {
    const [pantry, freshWeek1] = parseShoppingListMarkdown(FIXTURE)

    const cheese = freshWeek1!.categories[1]!.items[0]!
    expect(cheese.name).toBe('light sajt')
    expect(cheese.mustBeGlutenFree).toBe(false)

    const ketchup = pantry!.categories[2]!.items[0]!
    expect(ketchup.name).toBe('ketchup')
    expect(ketchup.mustBeGlutenFree).toBe(false)
  })
})
