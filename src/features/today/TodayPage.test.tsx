import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { anchorRepository } from '../../data/anchorRepository.ts'
import { parseIsoDate } from '../../domain/rotation.ts'
import TodayPage from './TodayPage.tsx'

beforeEach(() => {
  localStorage.clear()
})

function renderToday(today: Date) {
  render(
    <MemoryRouter>
      <TodayPage today={today} />
    </MemoryRouter>,
  )
}

describe('TodayPage', () => {
  it('AC1: shows a setup prompt and no meal or cook-today info when no anchor is set', () => {
    render(<TodayPage />)

    expect(screen.getByText(/add meg, melyik vasárnap/i)).toBeInTheDocument()
    expect(screen.queryByText(/kell főzni/i)).not.toBeInTheDocument()
  })

  it('AC2: shows block 1\'s meals and "cook today" = igen on the anchor Sunday (2026-10-04)', () => {
    anchorRepository.setAnchor('2026-10-04')
    renderToday(parseIsoDate('2026-10-04'))

    expect(screen.getByText('Gyümölcsös joghurtos magmix')).toBeInTheDocument()
    expect(screen.getByText('Gulyásleves')).toBeInTheDocument()
    expect(screen.getByText('Sonkás tükörtojás')).toBeInTheDocument()
    expect(screen.getByText(/kell főzni ma\?/i)).toHaveTextContent('igen')
  })

  it('AC3: still shows block 1\'s meals but "cook today" = nem on 2026-10-06', () => {
    anchorRepository.setAnchor('2026-10-04')
    renderToday(parseIsoDate('2026-10-06'))

    expect(screen.getByText('Gulyásleves')).toBeInTheDocument()
    expect(screen.getByText(/kell főzni ma\?/i)).toHaveTextContent('nem')
  })

  it('AC4: shows block 2\'s meals and "cook today" = igen on 2026-10-07', () => {
    anchorRepository.setAnchor('2026-10-04')
    renderToday(parseIsoDate('2026-10-07'))

    expect(screen.getByText('Görög joghurtos-banános muffin dupla tojással')).toBeInTheDocument()
    expect(screen.getByText('Húsos zöldséges passata')).toBeInTheDocument()
    expect(screen.getByText('Melegszendvics')).toBeInTheDocument()
    expect(screen.getByText(/kell főzni ma\?/i)).toHaveTextContent('igen')
  })

  it('AC5: wraps back to block 1\'s meals with "cook today" = igen on 2026-10-18', () => {
    anchorRepository.setAnchor('2026-10-04')
    renderToday(parseIsoDate('2026-10-18'))

    expect(screen.getByText('Gulyásleves')).toBeInTheDocument()
    expect(screen.getByText(/kell főzni ma\?/i)).toHaveTextContent('igen')
  })

  it('AC6: flags Melegszendvics with the gluten-risk badge, not Húsos zöldséges passata', () => {
    anchorRepository.setAnchor('2026-10-04')
    renderToday(parseIsoDate('2026-10-07'))

    const dinnerLine = screen.getByText('Melegszendvics').closest('li')
    expect(dinnerLine).not.toBeNull()
    expect(within(dinnerLine!).getByText('Gluténmentes termék szükséges')).toBeInTheDocument()

    const lunchLine = screen.getByText('Húsos zöldséges passata').closest('li')
    expect(lunchLine).not.toBeNull()
    expect(within(lunchLine!).queryByText('Gluténmentes termék szükséges')).not.toBeInTheDocument()
  })

  it('AC7: changing the anchor to a different Sunday updates today\'s meals', () => {
    anchorRepository.setAnchor('2026-10-04')
    renderToday(parseIsoDate('2026-10-04'))

    expect(screen.getByText('Gulyásleves')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/ciklus kezdete/i), { target: { value: '2026-09-27' } })
    fireEvent.click(screen.getByRole('button', { name: 'Mentés' }))

    expect(screen.queryByText('Gulyásleves')).not.toBeInTheDocument()
    expect(screen.getByText('Savanyú lencseleves')).toBeInTheDocument()
    expect(anchorRepository.getAnchor()).toBe('2026-09-27')
  })

  it('AC7: rejects a non-Sunday anchor and leaves the stored anchor and meals unchanged', () => {
    anchorRepository.setAnchor('2026-10-04')
    renderToday(parseIsoDate('2026-10-04'))

    fireEvent.change(screen.getByLabelText(/ciklus kezdete/i), { target: { value: '2026-10-05' } })
    fireEvent.click(screen.getByRole('button', { name: 'Mentés' }))

    expect(screen.getByText(/válassz vasárnapot/i)).toBeInTheDocument()
    expect(screen.getByText('Gulyásleves')).toBeInTheDocument()
    expect(anchorRepository.getAnchor()).toBe('2026-10-04')
  })
})
