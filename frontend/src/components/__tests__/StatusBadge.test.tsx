import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StatusBadge from '../StatusBadge'

describe('StatusBadge', () => {
  it('renders "Submitted" for SUBMITTED status', () => {
    render(<StatusBadge status="SUBMITTED" />)
    expect(screen.getByText('Submitted')).toBeInTheDocument()
  })

  it('renders "Under Review" for UNDER_REVIEW status', () => {
    render(<StatusBadge status="UNDER_REVIEW" />)
    expect(screen.getByText('Under Review')).toBeInTheDocument()
  })

  it('renders "Approved" for APPROVED status', () => {
    render(<StatusBadge status="APPROVED" />)
    expect(screen.getByText('Approved')).toBeInTheDocument()
  })

  it('renders "Rejected" for REJECTED status', () => {
    render(<StatusBadge status="REJECTED" />)
    expect(screen.getByText('Rejected')).toBeInTheDocument()
  })

  it('applies green styling for APPROVED', () => {
    render(<StatusBadge status="APPROVED" />)
    expect(screen.getByText('Approved')).toHaveClass('bg-green-100')
  })

  it('applies red styling for REJECTED', () => {
    render(<StatusBadge status="REJECTED" />)
    expect(screen.getByText('Rejected')).toHaveClass('bg-red-100')
  })
})
