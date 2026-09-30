import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App.tsx'

describe('App', () => {
  it('AC2/AC3: renders the "Zéró Glutén Konyha" heading', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Zéró Glutén Konyha' }),
    ).toBeInTheDocument()
  })
})
