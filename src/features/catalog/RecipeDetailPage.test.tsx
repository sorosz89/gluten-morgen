import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
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

function decreaseButton() {
  return screen.getByRole('button', { name: 'Adag csökkentése' })
}

function increaseButton() {
  return screen.getByRole('button', { name: 'Adag növelése' })
}

beforeEach(() => {
  localStorage.clear()
})

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

describe('Portion stepper', () => {
  it('AC1: defaults to 4 and shows unscaled amounts for a base-4 recipe', () => {
    renderAt('gf-ebed-gulyasleves')

    expect(screen.getByText('4 adag')).toBeInTheDocument()
    expect(screen.getByText(/1000 g pörköltnek való sovány hús/)).toBeInTheDocument()
    expect(screen.getByText(/500 g burgonya/)).toBeInTheDocument()
  })

  it('AC3: pressing + recalculates amounts immediately', () => {
    renderAt('gf-ebed-gulyasleves')

    fireEvent.click(increaseButton())

    expect(screen.getByText('5 adag')).toBeInTheDocument()
    expect(screen.getByText(/1250 g pörköltnek való sovány hús/)).toBeInTheDocument()
    expect(screen.getByText(/625 g burgonya/)).toBeInTheDocument()
  })

  it('AC3: pressing - recalculates amounts immediately', () => {
    renderAt('gf-ebed-gulyasleves')

    fireEvent.click(decreaseButton())

    expect(screen.getByText('3 adag')).toBeInTheDocument()
    expect(screen.getByText(/750 g pörköltnek való sovány hús/)).toBeInTheDocument()
    expect(screen.getByText(/375 g burgonya/)).toBeInTheDocument()
  })

  it('AC4: - disables at the minimum of 1 and does not go lower', () => {
    renderAt('gf-ebed-gulyasleves')

    fireEvent.click(decreaseButton())
    fireEvent.click(decreaseButton())
    fireEvent.click(decreaseButton())

    expect(screen.getByText('1 adag')).toBeInTheDocument()
    expect(decreaseButton()).toBeDisabled()

    fireEvent.click(decreaseButton())
    expect(screen.getByText('1 adag')).toBeInTheDocument()
  })

  it('AC4: + disables at the maximum of 20 and does not go higher', () => {
    renderAt('gf-ebed-gulyasleves')

    for (let i = 0; i < 16; i++) {
      fireEvent.click(increaseButton())
    }

    expect(screen.getByText('20 adag')).toBeInTheDocument()
    expect(increaseButton()).toBeDisabled()

    fireEvent.click(increaseButton())
    expect(screen.getByText('20 adag')).toBeInTheDocument()
  })

  it('AC8: the chosen count is remembered when the recipe is reopened', () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/recipes/gf-ebed-gulyasleves']}>
        <Routes>
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    fireEvent.click(increaseButton())
    fireEvent.click(increaseButton())
    expect(screen.getByText('6 adag')).toBeInTheDocument()
    unmount()

    renderAt('gf-ebed-gulyasleves')
    expect(screen.getByText('6 adag')).toBeInTheDocument()
  })

  it('AC8: a different recipe keeps its own default, unaffected by another recipe\'s chosen count', () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/recipes/gf-ebed-gulyasleves']}>
        <Routes>
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )
    fireEvent.click(increaseButton())
    unmount()

    renderAt('gf-reggeli-proteines-zabkasa')
    expect(screen.getByText('4 adag')).toBeInTheDocument()
  })
})

describe('Scaled ingredient edge cases', () => {
  it('AC2: a base-1 recipe is already scaled at the default of 4 adag (70 g -> 280 g)', () => {
    renderAt('gf-reggeli-proteines-zabkasa')

    expect(screen.getByText('4 adag')).toBeInTheDocument()
    expect(screen.getByText(/280 g gluténmentes \(GM\) zabpehely/)).toBeInTheDocument()
    expect(screen.queryByText(/70 g gluténmentes \(GM\) zabpehely/)).not.toBeInTheDocument()
  })

  it('AC5: a to-taste ingredient (amount: null) stays unchanged at any portion count', () => {
    renderAt('mezes-mustaros-sult-oldalas')

    expect(screen.getByText('só, bors')).toBeInTheDocument()

    fireEvent.click(increaseButton())
    fireEvent.click(increaseButton())
    expect(screen.getByText('6 adag')).toBeInTheDocument()
    expect(screen.getByText('só, bors')).toBeInTheDocument()
  })

  it('AC6: a range ingredient (amountText) shows the range at its own base count and a scaled number once moved off it', () => {
    renderAt('mezes-mustaros-sult-oldalas')

    expect(screen.getByText('4 adag')).toBeInTheDocument()
    expect(screen.getByText(/3-4 evőkanál méz/)).toBeInTheDocument()

    fireEvent.click(increaseButton())
    fireEvent.click(increaseButton())
    expect(screen.getByText('6 adag')).toBeInTheDocument()

    expect(screen.queryByText(/3-4 evőkanál méz/)).not.toBeInTheDocument()
    expect(screen.getByText(/5 evőkanál méz/)).toBeInTheDocument()
  })

  it('AC9: the gluten-free badge keeps rendering once amounts are scaled', () => {
    renderAt('gf-ebed-gulyasleves')

    fireEvent.click(increaseButton())

    const ingredientList = screen.getByRole('list', { name: 'Hozzávalók' })
    const flaggedLine = within(ingredientList).getByText(/gluténmentes kenyér/).closest('li')
    expect(flaggedLine).not.toBeNull()
    expect(within(flaggedLine!).getByText('Gluténmentes termék szükséges')).toBeInTheDocument()
  })
})
