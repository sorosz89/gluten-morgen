import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import LunchSwapPage from './LunchSwapPage.tsx'

const SALMON_TITLE = '[Alternatíva] Sült lazacfilé citromos burgonyapürével és gőzölt brokkolival'

beforeEach(() => {
  localStorage.clear()
})

describe('LunchSwapPage', () => {
  it('AC1: shows all 4 blocks with their default rotation lunch as active, each offering the 5 alternatives', () => {
    render(<LunchSwapPage />)

    expect(screen.getByText('Aktuális ebéd: Gulyásleves')).toBeInTheDocument()
    expect(screen.getByText('Aktuális ebéd: Húsos zöldséges passata')).toBeInTheDocument()
    expect(screen.getByText('Aktuális ebéd: Savanyú lencseleves')).toBeInTheDocument()
    expect(screen.getByText('Aktuális ebéd: Paradicsomos húsgombóc')).toBeInTheDocument()

    const selects = screen.getAllByRole('combobox')
    expect(selects).toHaveLength(4)
    for (const select of selects) {
      const optionLabels = Array.from(select.querySelectorAll('option')).map((option) => option.textContent)
      expect(optionLabels.some((label) => label?.includes('Csirkés rizses egytálétel zöldségekkel'))).toBe(true)
      expect(optionLabels.some((label) => label?.includes('Fokhagymás-citromos sertésszelet'))).toBe(true)
      expect(optionLabels.some((label) => label?.includes('Sült csirkemell rizzsel'))).toBe(true)
      expect(optionLabels.some((label) => label?.includes('Sült lazacfilé'))).toBe(true)
      expect(optionLabels.some((label) => label?.includes('Tonhalas gluténmentes tésztasaláta'))).toBe(true)
    }
  })

  it('AC4: choosing an alternative for a block updates the active recipe shown and persists it', () => {
    render(<LunchSwapPage />)

    const block2Select = screen.getByLabelText('2. blokk ebédje')
    fireEvent.change(block2Select, { target: { value: 'gf-alternativ-sult-lazac' } })

    expect(screen.getByText(`Aktuális ebéd: ${SALMON_TITLE}`)).toBeInTheDocument()
    expect(screen.queryByText('Aktuális ebéd: Húsos zöldséges passata')).not.toBeInTheDocument()
  })

  it('AC3: choosing "eredeti recept" reverts a swapped block back to its default', () => {
    render(<LunchSwapPage />)

    const block2Select = screen.getByLabelText('2. blokk ebédje')
    fireEvent.change(block2Select, { target: { value: 'gf-alternativ-sult-lazac' } })
    expect(screen.getByText(`Aktuális ebéd: ${SALMON_TITLE}`)).toBeInTheDocument()

    fireEvent.change(block2Select, { target: { value: '' } })

    expect(screen.getByText('Aktuális ebéd: Húsos zöldséges passata')).toBeInTheDocument()
    expect(screen.queryByText(`Aktuális ebéd: ${SALMON_TITLE}`)).not.toBeInTheDocument()
  })

  it('AC9: the active lunch per block survives an unmount/remount', () => {
    const { unmount } = render(<LunchSwapPage />)

    const block2Select = screen.getByLabelText('2. blokk ebédje')
    fireEvent.change(block2Select, { target: { value: 'gf-alternativ-sult-lazac' } })
    unmount()

    render(<LunchSwapPage />)

    expect(screen.getByText(`Aktuális ebéd: ${SALMON_TITLE}`)).toBeInTheDocument()
  })
})
