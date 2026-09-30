import { describe, expect, it } from 'vitest'
import {
  RecipeImportError,
  parseIngredientLine,
  parseStepGroups,
  splitSections,
} from './recipeMarkdown.ts'

describe('parseIngredientLine', () => {
  it('AC4: parses amount, unit, name and note, splitting on the first comma', () => {
    expect(
      parseIngredientLine(
        '1000 g pörköltnek való sovány hús, 2 cm-es kockákra vágva (marhalábszár/lapocka, sertéscomb, csirkecomb bőr nélkül, vadhús, harcsa, máj)',
        'test.md',
      ),
    ).toEqual({
      amount: 1000,
      unit: 'g',
      name: 'pörköltnek való sovány hús',
      note: '2 cm-es kockákra vágva (marhalábszár/lapocka, sertéscomb, csirkecomb bőr nélkül, vadhús, harcsa, máj)',
      mustBeGlutenFree: false,
    })
  })

  it('AC4: a line with no leading number keeps amount/unit null and the full text as name', () => {
    expect(parseIngredientLine('só, bors ízlés szerint', 'test.md')).toEqual({
      amount: null,
      unit: null,
      name: 'só, bors ízlés szerint',
      mustBeGlutenFree: false,
    })
  })

  it('AC5: a bold ingredient must be bought gluten-free', () => {
    const result = parseIngredientLine(
      '300 g **gluténmentes kenyér** (a levesbetéthez)',
      'test.md',
    )
    expect(result.mustBeGlutenFree).toBe(true)
    expect(result.name).toBe('gluténmentes kenyér (a levesbetéthez)')
  })

  it('AC5: a non-bold ingredient matching a watchlist keyword must be bought gluten-free', () => {
    const result = parseIngredientLine(
      '100 g csirke- vagy pulykamell sonka, csere: comb-/karajsonka',
      'test.md',
    )
    expect(result.mustBeGlutenFree).toBe(true)
  })

  it('AC5: a plain ingredient matching nothing is not flagged', () => {
    const result = parseIngredientLine('500 g burgonya, kockára vágva', 'test.md')
    expect(result.mustBeGlutenFree).toBe(false)
  })

  it('parses a decimal-comma range, storing the lower bound and original text', () => {
    const result = parseIngredientLine('1,2–1,5 kg sertés oldalas', 'test.md')
    expect(result.amount).toBe(1.2)
    expect(result.amountText).toBe('1,2–1,5')
    expect(result.unit).toBe('kg')
  })

  it('parses a hyphen range the same way as an en-dash range', () => {
    const result = parseIngredientLine('2-3 evőkanál méz', 'test.md')
    expect(result.amount).toBe(2)
    expect(result.amountText).toBe('2-3')
    expect(result.unit).toBe('evőkanál')
  })

  it('normalizes "tk" and "teáskanál" to the same unit', () => {
    expect(parseIngredientLine('1 tk sütőpor', 'test.md').unit).toBe('tk')
    expect(parseIngredientLine('1 teáskanál sütőpor', 'test.md').unit).toBe('tk')
  })

  it('throws RecipeImportError naming the file for an unrecognized unit', () => {
    expect(() => parseIngredientLine('3 csipet só', 'test.md')).toThrow(
      RecipeImportError,
    )
    expect(() => parseIngredientLine('3 csipet só', 'test.md')).toThrow(/test\.md/)
  })
})

describe('parseStepGroups', () => {
  it('a single "Elkészítés" numbered list becomes one step group', () => {
    const sections = splitSections(`# Title
## Hozzávalók (1 adagra)
- 100 g valami
## Elkészítés
1. Első lépés.
2. Második lépés.
`)

    expect(parseStepGroups(sections, 'test.md')).toEqual([
      { heading: 'Elkészítés', steps: ['Első lépés.', 'Második lépés.'] },
    ])
  })

  it('two "Elkészítés – ..." variant headings become two step groups', () => {
    const sections = splitSections(`# Title
## Hozzávalók (1 adagra)
- 100 g valami
## Elkészítés – hidegen (áztatva)
1. Áztasd be egy éjszakára.
## Elkészítés – melegen
1. Forrald fel.
2. Kavard meg.
`)

    expect(parseStepGroups(sections, 'test.md')).toEqual([
      { heading: 'Elkészítés – hidegen (áztatva)', steps: ['Áztasd be egy éjszakára.'] },
      { heading: 'Elkészítés – melegen', steps: ['Forrald fel.', 'Kavard meg.'] },
    ])
  })

  it('a prose, non-numbered heading becomes one group with one step', () => {
    const sections = splitSections(`# Title
## Hozzávalók (4 főre)
- 1 kg hús
## Pácolás (előző este)
Keverd össze a hozzávalókat és pácold be egy éjszakára.
`)

    expect(parseStepGroups(sections, 'test.md')).toEqual([
      {
        heading: 'Pácolás (előző este)',
        steps: ['Keverd össze a hozzávalókat és pácold be egy éjszakára.'],
      },
    ])
  })

  it('throws RecipeImportError naming the file when there is no step-ish heading at all', () => {
    const sections = splitSections(`# Title
## Hozzávalók (1 adagra)
- 100 g valami
## Tipp
Csak egy tipp, semmi más.
`)

    expect(() => parseStepGroups(sections, 'test.md')).toThrow(RecipeImportError)
    expect(() => parseStepGroups(sections, 'test.md')).toThrow(/test\.md/)
  })
})
