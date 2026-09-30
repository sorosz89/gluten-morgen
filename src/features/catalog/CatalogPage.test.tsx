import { fireEvent, render, screen, within } from '@testing-library/react'
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

  it('AC4: filters to matching recipes and hides empty sections when searching "sonka"', () => {
    render(<CatalogPage />)

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'sonka' } })

    const matches = recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes('sonka') ||
        recipe.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes('sonka')),
    )
    expect(matches.map((recipe) => recipe.mealType)).toEqual(['dinner', 'dinner', 'dinner'])

    expect(screen.getByRole('heading', { level: 2, name: 'Vacsora' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(matches.length)
    expect(screen.queryByRole('heading', { level: 2, name: 'Reggeli' })).not.toBeInTheDocument()
    expect(screen.getByText('Melegszendvics')).toBeInTheDocument()
    expect(screen.getByText('Sonkás tükörtojás')).toBeInTheDocument()
  })

  it('AC4: restores every recipe when the search is cleared', () => {
    render(<CatalogPage />)

    const searchInput = screen.getByRole('searchbox')
    fireEvent.change(searchInput, { target: { value: 'sonka' } })
    fireEvent.change(searchInput, { target: { value: '' } })

    expect(screen.getAllByRole('listitem')).toHaveLength(recipes.length)
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(MEAL_TYPE_ORDER.length)
  })

  it('AC5: shows an explicit no-results message when nothing matches', () => {
    render(<CatalogPage />)

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'xyz' } })

    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
    expect(screen.queryAllByRole('heading', { level: 2 })).toHaveLength(0)
    expect(screen.getByText(/nincs találat/i)).toBeInTheDocument()
  })
})
