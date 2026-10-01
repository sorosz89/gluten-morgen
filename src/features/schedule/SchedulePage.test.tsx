import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { anchorRepository } from '../../data/anchorRepository.ts'
import { parseIsoDate } from '../../domain/rotation.ts'
import SchedulePage from './SchedulePage.tsx'

beforeEach(() => {
  localStorage.clear()
})

function renderSchedule(today: Date) {
  render(
    <MemoryRouter>
      <SchedulePage today={today} />
    </MemoryRouter>,
  )
}

describe('SchedulePage', () => {
  it('AC7: shows a setup prompt and no schedule rows when no anchor is set', () => {
    render(
      <MemoryRouter>
        <SchedulePage />
      </MemoryRouter>,
    )

    expect(screen.getByText(/nincs beállítva a ciklus kezdete/i)).toBeInTheDocument()
    expect(screen.queryByText(/blokk/i)).not.toBeInTheDocument()
  })

  it('AC1: lists 7 days starting today, each with its date', () => {
    anchorRepository.setAnchor('2026-10-04')
    renderSchedule(parseIsoDate('2026-10-04'))

    const expectedDates = [
      '2026-10-04',
      '2026-10-05',
      '2026-10-06',
      '2026-10-07',
      '2026-10-08',
      '2026-10-09',
      '2026-10-10',
    ]

    for (const date of expectedDates) {
      expect(screen.getByText(date)).toBeInTheDocument()
    }
  })

  it('AC1/AC2: today (block 1, cook day) shows "igen" and block 1\'s three recipes', () => {
    anchorRepository.setAnchor('2026-10-04')
    renderSchedule(parseIsoDate('2026-10-04'))

    const todayRow = screen.getByText('2026-10-04').closest('li')!
    expect(within(todayRow).getByText(/kell főzni: igen/i)).toBeInTheDocument()
    expect(within(todayRow).getByText('Gyümölcsös joghurtos magmix')).toBeInTheDocument()
    expect(within(todayRow).getByText('Gulyásleves')).toBeInTheDocument()
    expect(within(todayRow).getByText('Sonkás tükörtojás')).toBeInTheDocument()
  })

  it('AC1: a non-cook day shows "nem" and no recipe list', () => {
    anchorRepository.setAnchor('2026-10-04')
    renderSchedule(parseIsoDate('2026-10-04'))

    const mondayRow = screen.getByText('2026-10-05').closest('li')!
    expect(within(mondayRow).getByText(/kell főzni: nem/i)).toBeInTheDocument()
    expect(within(mondayRow).queryByText(/reggeli/i)).not.toBeInTheDocument()
  })

  it('AC2: block 2\'s cook day (2026-10-07) lists block 2\'s three recipes', () => {
    anchorRepository.setAnchor('2026-10-04')
    renderSchedule(parseIsoDate('2026-10-04'))

    const wednesdayRow = screen.getByText('2026-10-07').closest('li')!
    expect(within(wednesdayRow).getByText('Görög joghurtos-banános muffin dupla tojással')).toBeInTheDocument()
    expect(within(wednesdayRow).getByText('Húsos zöldséges passata')).toBeInTheDocument()
    expect(within(wednesdayRow).getByText('Melegszendvics')).toBeInTheDocument()
  })

  it('AC3: flags 2026-10-06 as day 3 of 3, the last day of block 1\'s batch', () => {
    anchorRepository.setAnchor('2026-10-04')
    renderSchedule(parseIsoDate('2026-10-04'))

    const tuesdayRow = screen.getByText('2026-10-06').closest('li')!
    expect(within(tuesdayRow).getByText('3. nap / 3')).toBeInTheDocument()
    expect(within(tuesdayRow).getByText(/utolsó nap/i)).toBeInTheDocument()
  })

  it('AC4: flags 2026-10-10 as day 4 of 4, the last day of block 2\'s batch', () => {
    anchorRepository.setAnchor('2026-10-04')
    renderSchedule(parseIsoDate('2026-10-04'))

    const saturdayRow = screen.getByText('2026-10-10').closest('li')!
    expect(within(saturdayRow).getByText('4. nap / 4')).toBeInTheDocument()
    expect(within(saturdayRow).getByText(/utolsó nap/i)).toBeInTheDocument()
  })

  it('a mid-block day (2026-10-05) shows its position but no last-day flag', () => {
    anchorRepository.setAnchor('2026-10-04')
    renderSchedule(parseIsoDate('2026-10-04'))

    const mondayRow = screen.getByText('2026-10-05').closest('li')!
    expect(within(mondayRow).getByText('2. nap / 3')).toBeInTheDocument()
    expect(within(mondayRow).queryByText(/utolsó nap/i)).not.toBeInTheDocument()
  })

  it('AC5: flags Melegszendvics with the gluten-risk badge, not Húsos zöldséges passata', () => {
    anchorRepository.setAnchor('2026-10-04')
    renderSchedule(parseIsoDate('2026-10-04'))

    const dinnerLine = screen.getByText('Melegszendvics').closest('li')
    expect(dinnerLine).not.toBeNull()
    expect(within(dinnerLine!).getByText('Gluténmentes termék szükséges')).toBeInTheDocument()

    const lunchLine = screen.getByText('Húsos zöldséges passata').closest('li')
    expect(lunchLine).not.toBeNull()
    expect(within(lunchLine!).queryByText('Gluténmentes termék szükséges')).not.toBeInTheDocument()
  })
})
