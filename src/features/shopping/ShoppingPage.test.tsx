import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { lunchSwapRepository } from '../../data/lunchSwapRepository.ts'
import { shoppingList } from '../../data/shoppingList.ts'
import { shoppingListRepository } from '../../data/shoppingListRepository.ts'
import ShoppingPage from './ShoppingPage.tsx'

function getTripSection(label: string) {
  return screen.getByRole('heading', { level: 2, name: label }).closest('section')!
}

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

  it('AC6: checking an item persists it as checked and survives a re-render', () => {
    const { unmount } = render(<ShoppingPage />)

    const line = screen.getByText('teavaj').closest('li')
    expect(line).not.toBeNull()
    fireEvent.click(within(line!).getByRole('checkbox'))
    expect(within(line!).getByRole('checkbox')).toBeChecked()
    expect(shoppingListRepository.isChecked('pantry', 'teavaj')).toBe(true)

    unmount()
    render(<ShoppingPage />)

    const lineAfterReload = screen.getByText('teavaj').closest('li')
    expect(lineAfterReload).not.toBeNull()
    expect(within(lineAfterReload!).getByRole('checkbox')).toBeChecked()
  })

  it('AC6: the same item name in a different trip has independent checked state', () => {
    render(<ShoppingPage />)

    const week1Heading = screen.getByRole('heading', { level: 2, name: '2. heti bevásárlás (friss)' })
    const week1Section = week1Heading.closest('section')!
    const week2Heading = screen.getByRole('heading', { level: 2, name: '3. heti bevásárlás (friss)' })
    const week2Section = week2Heading.closest('section')!

    const week1Line = within(week1Section).getByText('leveszöldség').closest('li')!
    const week2Line = within(week2Section).getByText('leveszöldség').closest('li')!

    fireEvent.click(within(week1Line).getByRole('checkbox'))

    expect(within(week1Line).getByRole('checkbox')).toBeChecked()
    expect(within(week2Line).getByRole('checkbox')).not.toBeChecked()
  })

  it('AC7: a trip\'s "lista törlése" unchecks only that trip\'s items', () => {
    render(<ShoppingPage />)

    const week1Heading = screen.getByRole('heading', { level: 2, name: '2. heti bevásárlás (friss)' })
    const week1Section = week1Heading.closest('section')!
    const week2Heading = screen.getByRole('heading', { level: 2, name: '3. heti bevásárlás (friss)' })
    const week2Section = week2Heading.closest('section')!

    const week1Line = within(week1Section).getByText('leveszöldség').closest('li')!
    const week2Line = within(week2Section).getByText('leveszöldség').closest('li')!

    fireEvent.click(within(week1Line).getByRole('checkbox'))
    fireEvent.click(within(week2Line).getByRole('checkbox'))

    fireEvent.click(within(week1Section).getByRole('button', { name: 'Lista törlése' }))

    expect(within(week1Line).getByRole('checkbox')).not.toBeChecked()
    expect(within(week2Line).getByRole('checkbox')).toBeChecked()
  })

  it('AC5/AC6: block 2 swapped to the salmon dish shows the updated shopping-list lines', () => {
    lunchSwapRepository.setSwap(2, 'gf-alternativ-sult-lazac')
    render(<ShoppingPage />)

    const pantry = getTripSection('1. Kamra & fagyasztó')
    const freshWeek1 = getTripSection('2. heti bevásárlás (friss)')

    expect(within(within(pantry).getByText('darált hús').closest('li')!).getByText('800 g')).toBeInTheDocument()
    expect(within(pantry).queryByText('csicseriborsó (konzerv)')).not.toBeInTheDocument()
    expect(
      within(within(pantry).getByText('paradicsom passata').closest('li')!).getByText('500 g'),
    ).toBeInTheDocument()
    expect(within(freshWeek1).queryByText('sárgarépa')).not.toBeInTheDocument()
    expect(within(freshWeek1).queryByText('cukkini')).not.toBeInTheDocument()

    expect(
      within(within(freshWeek1).getByText('lazacfilé').closest('li')!).getByText('640 g'),
    ).toBeInTheDocument()
    expect(
      within(within(freshWeek1).getByText('brokkoli').closest('li')!).getByText('400 g'),
    ).toBeInTheDocument()
    expect(
      within(within(freshWeek1).getByText('burgonya').closest('li')!).getByText('1300 g'),
    ).toBeInTheDocument()
  })

  it('AC5/AC6: the swapped-in lines scale by family size like every other line', () => {
    lunchSwapRepository.setSwap(2, 'gf-alternativ-sult-lazac')
    render(<ShoppingPage />)

    fireEvent.change(screen.getByLabelText(/családtagok száma/i), { target: { value: '2' } })

    const freshWeek1 = getTripSection('2. heti bevásárlás (friss)')
    expect(
      within(within(freshWeek1).getByText('lazacfilé').closest('li')!).getByText('1280 g'),
    ).toBeInTheDocument()
    expect(
      within(within(freshWeek1).getByText('burgonya').closest('li')!).getByText('2600 g'),
    ).toBeInTheDocument()
  })

  it('AC7: a block swapped to the tuna pasta salad shows the gluten-risk badge on "gluténmentes tészta"', () => {
    lunchSwapRepository.setSwap(2, 'gf-alternativ-tonhalas-tesztasalata')
    render(<ShoppingPage />)

    const line = screen.getByText('gluténmentes tészta').closest('li')
    expect(line).not.toBeNull()
    expect(within(line!).getByText('280 g')).toBeInTheDocument()
    expect(within(line!).getByText('Gluténmentes termék szükséges')).toBeInTheDocument()
  })
})
