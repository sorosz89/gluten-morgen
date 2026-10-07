import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import GlutenRiskBadge from './GlutenRiskBadge.tsx'

describe('GlutenRiskBadge', () => {
  it('AC3: renders the fixed Hungarian gluten-risk label', () => {
    render(<GlutenRiskBadge />)

    expect(screen.getByText('Gluténmentes termék szükséges')).toBeInTheDocument()
  })

  it('AC3: forwards a className for placement-only spacing', () => {
    render(<GlutenRiskBadge className="caller-spacing" />)

    expect(screen.getByText('Gluténmentes termék szükséges')).toHaveClass('caller-spacing')
  })
})
