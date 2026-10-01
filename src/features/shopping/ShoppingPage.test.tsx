import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { shoppingList } from '../../data/shoppingList.ts'
import { shoppingListRepository } from '../../data/shoppingListRepository.ts'
import ShoppingPage from './ShoppingPage.tsx'

beforeEach(() => {
  localStorage.clear()
})

describe('ShoppingPage', () => {
  it('AC1: renders the 3 trips in order, each labeled', () => {
    render(<ShoppingPage />)

    const headings = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
    expect(headings).toEqual(shoppingList.map((trip) => trip.label))
  })

  it('AC1: every item from every trip appears exactly once under its category heading', () => {
    render(<ShoppingPage />)

    for (const trip of shoppingList) {
      const tripHeading = screen.getByRole('heading', { level: 2, name: trip.label })
      const tripSection = tripHeading.closest('section')
      expect(tripSection).not.toBeNull()

      for (const category of trip.categories) {
        const categoryHeading = within(tripSection!).getByRole('heading', {
          level: 3,
          name: category.heading,
        })
        const categorySection = categoryHeading.closest('div')
        expect(categorySection).not.toBeNull()

        for (const item of category.items) {
          expect(within(categorySection!).getByText(item.name)).toBeInTheDocument()
        }
      }
    }
  })

  it('AC2: with no family size set, shows "gluténmentes kenyér/zsemle" as "kb. 800 g" unscaled', () => {
    render(<ShoppingPage />)

    const line = screen.getByText('gluténmentes kenyér/zsemle').closest('li')
    expect(line).not.toBeNull()
    expect(within(line!).getByText('kb. 800 g')).toBeInTheDocument()
  })

  it('AC5: shows the gluten-risk badge on "gluténmentes kenyér/zsemle" but not on "light sajt"', () => {
    render(<ShoppingPage />)

    const flaggedLine = screen.getByText('gluténmentes kenyér/zsemle').closest('li')
    expect(flaggedLine).not.toBeNull()
    expect(within(flaggedLine!).getByText('Gluténmentes termék szükséges')).toBeInTheDocument()

    const unflaggedLine = screen.getAllByText('light sajt')[0]!.closest('li')
    expect(unflaggedLine).not.toBeNull()
    expect(within(unflaggedLine!).queryByText('Gluténmentes termék szükséges')).not.toBeInTheDocument()
  })

  it('AC3: setting family size to 4 scales every item quantity by 4', () => {
    render(<ShoppingPage />)

    fireEvent.change(screen.getByLabelText(/családtagok száma/i), { target: { value: '4' } })

    const line = screen.getByText('pörköltnek való sovány hús').closest('li')
    expect(line).not.toBeNull()
    expect(within(line!).getByText('6000 g')).toBeInTheDocument()
  })

  it('AC4: a qualified amount keeps "kb." attached to the scaled number', () => {
    render(<ShoppingPage />)

    fireEvent.change(screen.getByLabelText(/családtagok száma/i), { target: { value: '4' } })

    const line = screen.getByText('tojás (M-es)').closest('li')
    expect(line).not.toBeNull()
    expect(within(line!).getByText('kb. 68 db')).toBeInTheDocument()
  })

  it('AC3: the chosen family size persists after reloading the page', () => {
    const { unmount } = render(<ShoppingPage />)
    fireEvent.change(screen.getByLabelText(/családtagok száma/i), { target: { value: '4' } })
    unmount()

    render(<ShoppingPage />)

    expect(screen.getByLabelText(/családtagok száma/i)).toHaveValue(4)
    expect(shoppingListRepository.getFamilySize()).toBe(4)
    const line = screen.getByText('pörköltnek való sovány hús').closest('li')
    expect(line).not.toBeNull()
    expect(within(line!).getByText('6000 g')).toBeInTheDocument()
  })
})
