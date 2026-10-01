import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { LABEL_CHECKLIST_PRODUCTS } from '../../domain/labelChecklist.ts'
import LabelChecklistPage from './LabelChecklistPage.tsx'

beforeEach(() => {
  localStorage.clear()
})

describe('LabelChecklistPage', () => {
  it('AC1: renders exactly the 7 products from LABEL_CHECKLIST_PRODUCTS, all unchecked', () => {
    render(<LabelChecklistPage />)

    for (const product of LABEL_CHECKLIST_PRODUCTS) {
      expect(screen.getByRole('checkbox', { name: product })).not.toBeChecked()
    }
    expect(screen.getAllByRole('checkbox')).toHaveLength(LABEL_CHECKLIST_PRODUCTS.length)
  })

  it('AC2: checking a product persists it as checked across a remount', () => {
    const { unmount } = render(<LabelChecklistPage />)

    fireEvent.click(screen.getByRole('checkbox', { name: 'fehérjekoncentrátum (protein por)' }))
    expect(screen.getByRole('checkbox', { name: 'fehérjekoncentrátum (protein por)' })).toBeChecked()

    unmount()
    render(<LabelChecklistPage />)

    expect(screen.getByRole('checkbox', { name: 'fehérjekoncentrátum (protein por)' })).toBeChecked()
  })

  it('AC3: un-checking a checked product returns it to unchecked, including after reload', () => {
    const { unmount } = render(<LabelChecklistPage />)

    const checkbox = screen.getByRole('checkbox', { name: 'étcsokoládé' })
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()

    unmount()
    render(<LabelChecklistPage />)

    expect(screen.getByRole('checkbox', { name: 'étcsokoládé' })).not.toBeChecked()
  })
})
