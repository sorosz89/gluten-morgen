import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from './App.tsx'

beforeEach(() => {
  localStorage.clear()
})

describe('App', () => {
  it('AC1: renders the catalog at "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Reggeli', level: 2 })).toBeInTheDocument()
  })

  it('AC8: navigates from a catalog card to its detail view and back', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('link', { name: /Gulyásleves/ }))

    expect(screen.getByRole('heading', { name: 'Gulyásleves', level: 1 })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: 'Vissza a receptekhez' }))

    expect(screen.getByRole('heading', { name: 'Reggeli', level: 2 })).toBeInTheDocument()
  })

  it('AC1 (003): renders TodayPage\'s setup prompt at "/ma"', () => {
    render(
      <MemoryRouter initialEntries={['/ma']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByText(/add meg, melyik vasárnap/i)).toBeInTheDocument()
  })
})
