import { describe, expect, it } from 'vitest'
import { RecipeImportError, parseIngredientLine } from './recipeMarkdown.ts'

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
