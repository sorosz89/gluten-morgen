import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import TodayPage from './TodayPage.tsx'

beforeEach(() => {
  localStorage.clear()
})

describe('TodayPage', () => {
  it('AC1: shows a setup prompt and no meal or cook-today info when no anchor is set', () => {
    render(<TodayPage />)

    expect(screen.getByText(/vasárnap/i)).toBeInTheDocument()
    expect(screen.queryByText(/kell főzni/i)).not.toBeInTheDocument()
  })
})
