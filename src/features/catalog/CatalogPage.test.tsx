import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { recipes } from '../../data/recipes.ts'
import { MEAL_TYPE_ORDER, mealTypeLabel } from '../../domain/catalog.ts'
import CatalogPage from './CatalogPage.tsx'

describe('CatalogPage', () => {
  it('AC1: renders all sections in the fixed order with the right recipe counts', () => {
    render(<CatalogPage />)

    const headings = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
    expect(headings).toEqual(MEAL_TYPE_ORDER.map(mealTypeLabel))

    for (const mealType of MEAL_TYPE_ORDER) {
      const expectedCount = recipes.filter((recipe) => recipe.mealType === mealType).length
      const heading = screen.getByRole('heading', { level: 2, name: mealTypeLabel(mealType) })
      const section = heading.closest('section')
      expect(section).not.toBeNull()
      expect(within(section!).getAllByRole('listitem')).toHaveLength(expectedCount)
    }
  })

  it('AC2: shows a gluten-risk badge on the Melegszendvics card', () => {
    render(<CatalogPage />)

    const card = screen.getByText('Melegszendvics').closest('li')
    expect(card).not.toBeNull()
    expect(within(card!).getByText('Gluténmentes termék szükséges')).toBeInTheDocument()
  })

  it('AC3: shows no gluten-risk badge on the alternative rice card', () => {
    render(<CatalogPage />)

    const card = screen.getByText('[Alternatíva] Csirkés rizses egytálétel zöldségekkel').closest('li')
    expect(card).not.toBeNull()
    expect(within(card!).queryByText('Gluténmentes termék szükséges')).not.toBeInTheDocument()
  })
})
