import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import MealTypeChip from './MealTypeChip.tsx'

describe('MealTypeChip', () => {
  it('AC6: renders the Hungarian label for breakfast, lunch and dinner', () => {
    render(
      <>
        <MealTypeChip mealType="breakfast" />
        <MealTypeChip mealType="lunch" />
        <MealTypeChip mealType="dinner" />
      </>,
    )

    expect(screen.getByText('Reggeli')).toBeInTheDocument()
    expect(screen.getByText('Ebéd')).toBeInTheDocument()
    expect(screen.getByText('Vacsora')).toBeInTheDocument()
  })

  it('AC6: renders the Hungarian label for alternative and extra', () => {
    render(
      <>
        <MealTypeChip mealType="alternative" />
        <MealTypeChip mealType="extra" />
      </>,
    )

    expect(screen.getByText('Alternatíva')).toBeInTheDocument()
    expect(screen.getByText('Extra')).toBeInTheDocument()
  })

  it('AC6: alternative and extra fall back to the same color treatment as lunch', () => {
    render(
      <>
        <MealTypeChip mealType="lunch" />
        <MealTypeChip mealType="alternative" />
        <MealTypeChip mealType="extra" />
      </>,
    )

    const lunchClassName = screen.getByText('Ebéd').className
    expect(screen.getByText('Alternatíva').className).toBe(lunchClassName)
    expect(screen.getByText('Extra').className).toBe(lunchClassName)
  })

  it('AC6: breakfast and dinner get their own color treatment, distinct from lunch', () => {
    render(
      <>
        <MealTypeChip mealType="breakfast" />
        <MealTypeChip mealType="lunch" />
        <MealTypeChip mealType="dinner" />
      </>,
    )

    const breakfastClassName = screen.getByText('Reggeli').className
    const lunchClassName = screen.getByText('Ebéd').className
    const dinnerClassName = screen.getByText('Vacsora').className
    expect(breakfastClassName).not.toBe(lunchClassName)
    expect(dinnerClassName).not.toBe(lunchClassName)
    expect(breakfastClassName).not.toBe(dinnerClassName)
  })

  it('AC6: forwards a className for placement-only spacing', () => {
    render(<MealTypeChip mealType="breakfast" className="caller-spacing" />)

    expect(screen.getByText('Reggeli')).toHaveClass('caller-spacing')
  })
})
