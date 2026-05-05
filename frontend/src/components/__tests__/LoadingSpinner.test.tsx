import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders the svg spinner', () => {
    const { container } = render(<LoadingSpinner />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders message when provided', () => {
    render(<LoadingSpinner message="Loading your data..." />)
    expect(screen.getByText('Loading your data...')).toBeInTheDocument()
  })

  it('does not render message when omitted', () => {
    const { container } = render(<LoadingSpinner />)
    expect(container.querySelector('p')).not.toBeInTheDocument()
  })

  it('applies small size class', () => {
    const { container } = render(<LoadingSpinner size="sm" />)
    expect(container.querySelector('svg')).toHaveClass('w-4')
  })

  it('applies large size class', () => {
    const { container } = render(<LoadingSpinner size="lg" />)
    expect(container.querySelector('svg')).toHaveClass('w-12')
  })
})
