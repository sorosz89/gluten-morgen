import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { recipes } from '../../data/recipes.ts'
import { MEAL_TYPE_ORDER, mealTypeLabel } from '../../domain/catalog.ts'
import CatalogPage from './CatalogPage.tsx'

function renderCatalog() {
  render(
    <MemoryRouter>
      <CatalogPage />
    </MemoryRouter>,
  )
}

describe('CatalogPage', () => {
  it('AC1: renders all sections in the fixed order with the right recipe counts', () => {
    renderCatalog()

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

  it('AC6: shows a meal-type chip matching its section on every card', () => {
    renderCatalog()

    for (const mealType of MEAL_TYPE_ORDER) {
      const heading = screen.getByRole('heading', { level: 2, name: mealTypeLabel(mealType) })
      const section = heading.closest('section')
      expect(section).not.toBeNull()

      const cards = within(section!).getAllByRole('listitem')
      for (const card of cards) {
        expect(within(card).getByText(mealTypeLabel(mealType))).toBeInTheDocument()
      }
    }
  })

  it('AC2: shows a gluten-risk badge on the Melegszendvics card', () => {
    renderCatalog()

    const card = screen.getByText('Melegszendvics').closest('li')
    expect(card).not.toBeNull()
    expect(within(card!).getByText('Gluténmentes termék szükséges')).toBeInTheDocument()
  })

  it('AC3: shows no gluten-risk badge on the alternative rice card', () => {
    renderCatalog()

    const card = screen.getByText('[Alternatíva] Csirkés rizses egytálétel zöldségekkel').closest('li')
    expect(card).not.toBeNull()
    expect(within(card!).queryByText('Gluténmentes termék szükséges')).not.toBeInTheDocument()
  })

  it('shows a check-the-label tag (not the risk badge) on a recipe with a note but no flagged ingredient', () => {
    renderCatalog()

    const card = screen.getByText('[Alternatíva] Csirkés rizses egytálétel zöldségekkel').closest('li')
    expect(card).not.toBeNull()
    expect(within(card!).getByText('Ellenőrizd a címkét')).toBeInTheDocument()
  })

  it('shows no check-the-label tag on the Melegszendvics card (already carries the stronger risk badge)', () => {
    renderCatalog()

    const card = screen.getByText('Melegszendvics').closest('li')
    expect(card).not.toBeNull()
    expect(within(card!).queryByText('Ellenőrizd a címkét')).not.toBeInTheDocument()
  })

  it('AC4: filters to matching recipes and hides empty sections when searching "sonka"', () => {
    renderCatalog()

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
    renderCatalog()

    const searchInput = screen.getByRole('searchbox')
    fireEvent.change(searchInput, { target: { value: 'sonka' } })
    fireEvent.change(searchInput, { target: { value: '' } })

    expect(screen.getAllByRole('listitem')).toHaveLength(recipes.length)
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(MEAL_TYPE_ORDER.length)
  })

  it('AC5: shows an explicit no-results message when nothing matches', () => {
    renderCatalog()

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'xyz' } })

    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
    expect(screen.queryAllByRole('heading', { level: 2 })).toHaveLength(0)
    expect(screen.getByText(/nincs találat/i)).toBeInTheDocument()
  })
})
