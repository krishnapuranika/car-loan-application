import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ApplyPage from '../ApplyPage'
import * as loanApi from '../../api/loanApi'

vi.mock('../../api/loanApi')

function renderApplyPage() {
  return render(
    <MemoryRouter>
      <ApplyPage />
    </MemoryRouter>,
  )
}

describe('ApplyPage – step 1 (Personal Info)', () => {
  it('renders the page heading', () => {
    renderApplyPage()
    expect(screen.getByText('Apply for a Car Loan')).toBeInTheDocument()
  })

  it('shows Personal Information fields by default', () => {
    renderApplyPage()
    expect(screen.getByPlaceholderText('John')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('1234567890')).toBeInTheDocument()
  })

  it('shows 3 step indicators', () => {
    renderApplyPage()
    expect(screen.getByText('Personal Info')).toBeInTheDocument()
    expect(screen.getByText('Financial Info')).toBeInTheDocument()
    expect(screen.getByText('Vehicle & Loan')).toBeInTheDocument()
  })

  it('shows validation errors when Continue is clicked with empty fields', async () => {
    renderApplyPage()
    fireEvent.click(screen.getByText('Continue'))

    await waitFor(() => {
      expect(screen.getAllByText('Required').length).toBeGreaterThan(0)
    })
  })

  it('does not show Back button on step 1', () => {
    renderApplyPage()
    expect(screen.queryByText('Back')).not.toBeInTheDocument()
  })
})

describe('ApplyPage – step navigation', () => {
  async function fillStep1AndAdvance() {
    renderApplyPage()
    fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Smith' } })
    fireEvent.change(screen.getByPlaceholderText('john@example.com'), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('1234567890'), { target: { value: '9876543210' } })
    fireEvent.change(screen.getByDisplayValue(''), { target: { value: '1990-06-15' } })
    fireEvent.blur(screen.getByPlaceholderText('john@example.com'))
    fireEvent.click(screen.getByText('Continue'))
    await waitFor(() => expect(screen.getByText('Financial Information')).toBeInTheDocument())
  }

  it('moves to step 2 after valid step 1', async () => {
    await fillStep1AndAdvance()
    expect(screen.getByText('Financial Information')).toBeInTheDocument()
  })

  it('shows Back button on step 2', async () => {
    await fillStep1AndAdvance()
    expect(screen.getByText('Back')).toBeInTheDocument()
  })

  it('returns to step 1 when Back is clicked', async () => {
    await fillStep1AndAdvance()
    fireEvent.click(screen.getByText('Back'))
    await waitFor(() => expect(screen.getByPlaceholderText('John')).toBeInTheDocument())
  })
})

describe('ApplyPage – success state', () => {
  beforeEach(() => {
    vi.mocked(loanApi.submitApplication).mockResolvedValue({
      trackingId: 'CAR-SUCCESS1',
      status: 'SUBMITTED',
      statusMessage: 'Received.',
      applicantName: 'Test User',
      email: 'test@example.com',
      loanAmount: 20000,
      loanTermMonths: 60,
      vehicleInfo: '2023 Toyota Camry',
      submittedAt: '2026-05-05T10:00:00',
      updatedAt: '2026-05-05T10:00:00',
    })
  })

  it('shows tracking ID after successful submission', async () => {
    const { container } = renderApplyPage()

    // Step 1
    fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Smith' } })
    fireEvent.change(screen.getByPlaceholderText('john@example.com'), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('1234567890'), { target: { value: '9876543210' } })
    fireEvent.change(screen.getByDisplayValue(''), { target: { value: '1990-06-15' } })
    fireEvent.click(screen.getByText('Continue'))

    await waitFor(() => expect(screen.getByText('Financial Information')).toBeInTheDocument())

    // Step 2
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'EMPLOYED' } })
    fireEvent.change(screen.getByPlaceholderText('60000'), { target: { value: '70000' } })
    fireEvent.click(screen.getByText('Continue'))

    await waitFor(() => expect(screen.getByText('Vehicle & Loan Details')).toBeInTheDocument())

    // Step 3 — target inputs by name to avoid ambiguous placeholder matching
    fireEvent.change(container.querySelector('[name="vehicleMake"]')!, { target: { value: 'Toyota' } })
    fireEvent.change(container.querySelector('[name="vehicleModel"]')!, { target: { value: 'Camry' } })
    fireEvent.change(container.querySelector('[name="vehicleYear"]')!, { target: { value: '2023' } })
    fireEvent.change(container.querySelector('[name="vehiclePrice"]')!, { target: { value: '25000' } })
    fireEvent.change(container.querySelector('[name="downPayment"]')!, { target: { value: '5000' } })
    fireEvent.change(container.querySelector('[name="loanAmount"]')!, { target: { value: '20000' } })
    fireEvent.change(container.querySelector('[name="loanTermMonths"]')!, { target: { value: '60' } })

    fireEvent.click(screen.getByText('Submit Application'))

    await waitFor(() => {
      expect(screen.getByText('Application Submitted!')).toBeInTheDocument()
      expect(screen.getByText('CAR-SUCCESS1')).toBeInTheDocument()
    })
  })
})
