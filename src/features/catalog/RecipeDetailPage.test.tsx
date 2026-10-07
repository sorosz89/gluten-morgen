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

// Ingredient amounts and macro values each render in their own <span>,
// separate from the sibling text/label node, so a combined string no longer
// lives on one node — match against the enclosing <li>'s full text instead.
function listItemTextMatcher(expected: string) {
  return (_content: string, element: Element | null) =>
    element?.tagName.toLowerCase() === 'li' && (element.textContent ?? '').includes(expected)
}

function getIngredientLine(expected: string) {
  return screen.getByText(listItemTextMatcher(expected))
}

function queryIngredientLine(expected: string) {
  return screen.queryByText(listItemTextMatcher(expected))
}

function getMacroLine(expected: string) {
  const macrosList = screen.getByRole('list', { name: 'Makrók' })
  return within(macrosList).getByText(listItemTextMatcher(expected))
}

beforeEach(() => {
  localStorage.clear()
})

describe('RecipeDetailPage', () => {
  it('AC6: renders every field of Gulyásleves', () => {
    renderAt('gf-ebed-gulyasleves')

    expect(screen.getByRole('heading', { name: 'Gulyásleves' })).toBeInTheDocument()
    expect(screen.getByText('Ebéd')).toBeInTheDocument()
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

    expect(getMacroLine('822')).toBeInTheDocument()
    expect(getMacroLine('kcal')).toBeInTheDocument()
    expect(getMacroLine('65 g')).toBeInTheDocument()
    expect(getMacroLine('fehérje')).toBeInTheDocument()
    expect(getMacroLine('77 g')).toBeInTheDocument()
    expect(getMacroLine('szénhidrát')).toBeInTheDocument()
    expect(getMacroLine('670 mg')).toBeInTheDocument()
    expect(getMacroLine('só')).toBeInTheDocument()
    expect(getMacroLine('28 g')).toBeInTheDocument()
    expect(getMacroLine('zsír')).toBeInTheDocument()
    expect(getMacroLine('12 g')).toBeInTheDocument()
    expect(getMacroLine('rost')).toBeInTheDocument()

    expect(screen.getByText(/Csak a levesbetét kenyerét kell cserélni/)).toBeInTheDocument()
  })

  it('AC4: tip and glutenFreeNote render as visually distinct callouts', () => {
    renderAt('gf-ebed-gulyasleves')

    const tip = screen.getByText(/A fűszerpaprikát mindig lángról levéve keverd a levesbe/)
    const note = screen.getByText(/Csak a levesbetét kenyerét kell cserélni/)

    expect(tip.className).not.toBe('')
    expect(note.className).not.toBe('')
    expect(tip.className).not.toBe(note.className)

    const noteContainer = note.closest('p')
    expect(noteContainer?.querySelector('svg')).not.toBeNull()
    const tipContainer = tip.closest('p')
    expect(tipContainer?.querySelector('svg')).toBeNull()
  })

  it('012-AC7: renders no empty tip/macros/glutenFreeNote sections when none are set', () => {
    renderAt('mezes-mustaros-sult-oldalas')

    expect(screen.queryByText(/A fűszerpaprikát/)).not.toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Makrók' })).not.toBeInTheDocument()
    expect(screen.queryByText('kcal', { exact: false })).not.toBeInTheDocument()
  })

  it('places glutenFreeNote at the very end of the page, after the source line', () => {
    renderAt('gf-ebed-gulyasleves')

    const note = screen.getByText(/Csak a levesbetét kenyerét kell cserélni/)
    const stepper = screen.getByRole('button', { name: 'Adag növelése' })
    const ingredientList = screen.getByRole('list', { name: 'Hozzávalók' })
    const source = screen.getByText(/Forrás:/)

    expect(stepper.compareDocumentPosition(note) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(ingredientList.compareDocumentPosition(note) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(source.compareDocumentPosition(note) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('labels the macros list with a per-serving caption, distinct from the ingredient list styling', () => {
    renderAt('gf-ebed-gulyasleves')

    expect(screen.getByText('Tápérték (adagonként)')).toBeInTheDocument()
    const macrosList = screen.getByRole('list', { name: 'Makrók' })
    const ingredientList = screen.getByRole('list', { name: 'Hozzávalók' })
    expect(macrosList.className).not.toBe(ingredientList.className)
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
    expect(getIngredientLine('1000 g pörköltnek való sovány hús')).toBeInTheDocument()
    expect(getIngredientLine('500 g burgonya')).toBeInTheDocument()
  })

  it('AC3: pressing + recalculates amounts immediately', () => {
    renderAt('gf-ebed-gulyasleves')

    fireEvent.click(increaseButton())

    expect(screen.getByText('5 adag')).toBeInTheDocument()
    expect(getIngredientLine('1250 g pörköltnek való sovány hús')).toBeInTheDocument()
    expect(getIngredientLine('625 g burgonya')).toBeInTheDocument()
  })

  it('AC3: pressing - recalculates amounts immediately', () => {
    renderAt('gf-ebed-gulyasleves')

    fireEvent.click(decreaseButton())

    expect(screen.getByText('3 adag')).toBeInTheDocument()
    expect(getIngredientLine('750 g pörköltnek való sovány hús')).toBeInTheDocument()
    expect(getIngredientLine('375 g burgonya')).toBeInTheDocument()
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

describe('Step check-off', () => {
  it('toggles a step to done and back on click, without affecting other steps', () => {
    renderAt('gf-ebed-gulyasleves')

    const firstStepButton = screen.getByText(/Egy nagy fazékban hevítsd fel a zsírt/).closest('button')
    const secondStepButton = screen.getByText(/Add hozzá az apróra vágott hagymát/).closest('button')
    expect(firstStepButton).not.toBeNull()
    expect(secondStepButton).not.toBeNull()

    expect(firstStepButton).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(firstStepButton!)
    expect(firstStepButton).toHaveAttribute('aria-pressed', 'true')
    expect(secondStepButton).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(firstStepButton!)
    expect(firstStepButton).toHaveAttribute('aria-pressed', 'false')
  })

  it('starts a different recipe with a clean checklist', () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/recipes/gf-ebed-gulyasleves']}>
        <Routes>
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByText(/Egy nagy fazékban hevítsd fel a zsírt/).closest('button')!)
    unmount()

    renderAt('gf-reggeli-proteines-zabkasa')
    const buttons = screen.getAllByRole('button', { pressed: false })
    expect(buttons.length).toBeGreaterThan(0)
    expect(screen.queryByRole('button', { pressed: true })).not.toBeInTheDocument()
  })
})

describe('Scaled ingredient edge cases', () => {
  it('AC2: a base-1 recipe is already scaled at the default of 4 adag (70 g -> 280 g)', () => {
    renderAt('gf-reggeli-proteines-zabkasa')

    expect(screen.getByText('4 adag')).toBeInTheDocument()
    expect(getIngredientLine('280 g gluténmentes (GM) zabpehely')).toBeInTheDocument()
    expect(queryIngredientLine('70 g gluténmentes (GM) zabpehely')).not.toBeInTheDocument()
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
    expect(getIngredientLine('3-4 evőkanál méz')).toBeInTheDocument()

    fireEvent.click(increaseButton())
    fireEvent.click(increaseButton())
    expect(screen.getByText('6 adag')).toBeInTheDocument()

    expect(queryIngredientLine('3-4 evőkanál méz')).not.toBeInTheDocument()
    expect(getIngredientLine('5 evőkanál méz')).toBeInTheDocument()
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
