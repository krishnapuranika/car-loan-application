import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import HomePage from '../HomePage'

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  )
}

describe('HomePage', () => {
  it('renders the main heading', () => {
    renderHomePage()
    expect(screen.getByText('Drive Your Dreams')).toBeInTheDocument()
  })

  it('renders the Apply for a Loan card', () => {
    renderHomePage()
    expect(screen.getByText('Apply for a Loan')).toBeInTheDocument()
  })

  it('renders the Track Your Application card', () => {
    renderHomePage()
    expect(screen.getByText('Track Your Application')).toBeInTheDocument()
  })

  it('Apply card links to /apply', () => {
    renderHomePage()
    const link = screen.getByText('Apply for a Loan').closest('a')
    expect(link).toHaveAttribute('href', '/apply')
  })

  it('Track card links to /track', () => {
    renderHomePage()
    const link = screen.getByText('Track Your Application').closest('a')
    expect(link).toHaveAttribute('href', '/track')
  })

  it('renders the three feature highlights', () => {
    renderHomePage()
    expect(screen.getByText('Fast Decision')).toBeInTheDocument()
    expect(screen.getByText('Secure & Private')).toBeInTheDocument()
    expect(screen.getByText('Competitive Rates')).toBeInTheDocument()
  })
})
