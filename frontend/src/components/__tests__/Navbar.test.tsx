import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Navbar from '../Navbar'

function renderNavbar(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
    </MemoryRouter>,
  )
}

describe('Navbar', () => {
  it('renders the brand name', () => {
    renderNavbar()
    expect(screen.getByText('CarLoan')).toBeInTheDocument()
  })

  it('renders the Apply Now link', () => {
    renderNavbar()
    expect(screen.getByText('Apply Now')).toBeInTheDocument()
  })

  it('renders the Track Application link', () => {
    renderNavbar()
    expect(screen.getByText('Track Application')).toBeInTheDocument()
  })

  it('brand name links to home', () => {
    renderNavbar()
    expect(screen.getByText('CarLoan').closest('a')).toHaveAttribute('href', '/')
  })

  it('Apply Now links to /apply', () => {
    renderNavbar()
    expect(screen.getByText('Apply Now').closest('a')).toHaveAttribute('href', '/apply')
  })

  it('Track Application links to /track', () => {
    renderNavbar()
    expect(screen.getByText('Track Application').closest('a')).toHaveAttribute('href', '/track')
  })

  it('highlights Apply Now when on /apply', () => {
    renderNavbar('/apply')
    expect(screen.getByText('Apply Now')).toHaveClass('text-blue-600')
  })
})
