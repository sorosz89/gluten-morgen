import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import RecipeDetailPage from './RecipeDetailPage.tsx'

function renderAt(id: string) {
  render(
    <MemoryRouter initialEntries={[`/recipes/${id}`]}>
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RecipeDetailPage', () => {
  it('AC6: renders every field of Gulyásleves', () => {
    renderAt('gf-ebed-gulyasleves')

    expect(screen.getByRole('heading', { name: 'Gulyásleves' })).toBeInTheDocument()
    expect(screen.getByText('4 napi adagra')).toBeInTheDocument()

    const stepHeading = screen.getByRole('heading', { name: 'Elkészítés' })
    const stepList = stepHeading.parentElement!.querySelector('ol')
    expect(stepList).not.toBeNull()
    const stepItems = within(stepList!).getAllByRole('listitem')
    expect(stepItems).toHaveLength(9)
    expect(stepItems[0]).toHaveTextContent('Egy nagy fazékban hevítsd fel a zsírt')
    expect(stepItems[8]).toHaveTextContent('gluténmentes kenyérrel kínáld')

    const ingredientList = screen.getByRole('list', { name: 'Hozzávalók' })
    expect(within(ingredientList).getAllByRole('listitem')).toHaveLength(8)

    expect(screen.getByText(/A fűszerpaprikát mindig lángról levéve keverd a levesbe/)).toBeInTheDocument()

    expect(screen.getByText('822 kcal')).toBeInTheDocument()
    expect(screen.getByText('65 g fehérje')).toBeInTheDocument()
    expect(screen.getByText('77 g szénhidrát')).toBeInTheDocument()
    expect(screen.getByText('670 mg só')).toBeInTheDocument()
    expect(screen.getByText('28 g zsír')).toBeInTheDocument()
    expect(screen.getByText('12 g rost')).toBeInTheDocument()

    expect(screen.getByText(/Csak a levesbetét kenyerét kell cserélni/)).toBeInTheDocument()
  })

  it('AC7: flags only the gluténmentes kenyér ingredient line', () => {
    renderAt('gf-ebed-gulyasleves')

    const ingredientList = screen.getByRole('list', { name: 'Hozzávalók' })
    const flaggedLine = within(ingredientList).getByText(/gluténmentes kenyér/).closest('li')
    expect(flaggedLine).not.toBeNull()
    expect(within(flaggedLine!).getByText('Gluténmentes termék szükséges')).toBeInTheDocument()

    const otherLine = within(ingredientList).getByText(/pörköltnek való sovány hús/).closest('li')
    expect(otherLine).not.toBeNull()
    expect(within(otherLine!).queryByText('Gluténmentes termék szükséges')).not.toBeInTheDocument()

    const flaggedCount = within(ingredientList).getAllByText('Gluténmentes termék szükséges')
    expect(flaggedCount).toHaveLength(1)
  })
})
