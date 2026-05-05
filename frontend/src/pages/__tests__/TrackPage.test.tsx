import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TrackPage from '../TrackPage'
import * as loanApi from '../../api/loanApi'

vi.mock('../../api/loanApi')

const mockApplication = {
  trackingId: 'CAR-ABCD1234',
  status: 'SUBMITTED' as const,
  statusMessage: 'Your application has been received and is pending review.',
  applicantName: 'John Doe',
  email: 'john@example.com',
  loanAmount: 20000,
  loanTermMonths: 60,
  vehicleInfo: '2023 Toyota Camry',
  submittedAt: '2026-05-05T10:00:00',
  updatedAt: '2026-05-05T10:00:00',
}

function renderTrackPage(path = '/track') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/track" element={<TrackPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('TrackPage – rendering', () => {
  it('renders the page heading', () => {
    renderTrackPage()
    expect(screen.getByText('Track Your Application')).toBeInTheDocument()
  })

  it('renders the tracking ID input', () => {
    renderTrackPage()
    expect(screen.getByPlaceholderText('CAR-XXXXXXXX')).toBeInTheDocument()
  })

  it('renders the Track button', () => {
    renderTrackPage()
    expect(screen.getByText('Track')).toBeInTheDocument()
  })

  it('Track button is disabled when input is empty', () => {
    renderTrackPage()
    expect(screen.getByText('Track')).toBeDisabled()
  })

  it('Track button is enabled after typing a tracking ID', () => {
    renderTrackPage()
    fireEvent.change(screen.getByPlaceholderText('CAR-XXXXXXXX'), {
      target: { value: 'CAR-ABCD1234' },
    })
    expect(screen.getByText('Track')).not.toBeDisabled()
  })
})

describe('TrackPage – successful lookup', () => {
  beforeEach(() => {
    vi.mocked(loanApi.trackApplication).mockResolvedValue(mockApplication)
  })

  it('shows application details after clicking Track', async () => {
    renderTrackPage()
    fireEvent.change(screen.getByPlaceholderText('CAR-XXXXXXXX'), {
      target: { value: 'CAR-ABCD1234' },
    })
    fireEvent.click(screen.getByText('Track'))

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('2023 Toyota Camry')).toBeInTheDocument()
    })
  })

  it('shows the status badge', async () => {
    renderTrackPage()
    fireEvent.change(screen.getByPlaceholderText('CAR-XXXXXXXX'), {
      target: { value: 'CAR-ABCD1234' },
    })
    fireEvent.click(screen.getByText('Track'))

    // "Submitted" appears in both the badge span and the details label — check for the badge specifically
    await waitFor(() => {
      const badges = screen.getAllByText('Submitted')
      expect(badges.some(el => el.tagName === 'SPAN')).toBe(true)
    })
  })

  it('shows the status message', async () => {
    renderTrackPage()
    fireEvent.change(screen.getByPlaceholderText('CAR-XXXXXXXX'), {
      target: { value: 'CAR-ABCD1234' },
    })
    fireEvent.click(screen.getByText('Track'))

    await waitFor(() => {
      expect(screen.getByText(mockApplication.statusMessage)).toBeInTheDocument()
    })
  })

  it('displays formatted loan amount', async () => {
    renderTrackPage()
    fireEvent.change(screen.getByPlaceholderText('CAR-XXXXXXXX'), {
      target: { value: 'CAR-ABCD1234' },
    })
    fireEvent.click(screen.getByText('Track'))

    await waitFor(() => {
      expect(screen.getByText('$20,000.00')).toBeInTheDocument()
    })
  })
})

describe('TrackPage – error handling', () => {
  it('shows an error message when tracking ID is not found', async () => {
    vi.mocked(loanApi.trackApplication).mockRejectedValue({
      message: 'No application found with tracking ID: CAR-NOTEXIST',
    })

    renderTrackPage()
    fireEvent.change(screen.getByPlaceholderText('CAR-XXXXXXXX'), {
      target: { value: 'CAR-NOTEXIST' },
    })
    fireEvent.click(screen.getByText('Track'))

    await waitFor(() => {
      expect(
        screen.getByText('No application found with tracking ID: CAR-NOTEXIST'),
      ).toBeInTheDocument()
    })
  })

  it('clears previous results before a new lookup', async () => {
    vi.mocked(loanApi.trackApplication)
      .mockResolvedValueOnce(mockApplication)
      .mockRejectedValueOnce({ message: 'Not found' })

    renderTrackPage()

    // First search
    fireEvent.change(screen.getByPlaceholderText('CAR-XXXXXXXX'), {
      target: { value: 'CAR-ABCD1234' },
    })
    fireEvent.click(screen.getByText('Track'))
    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument())

    // Second search (invalid)
    fireEvent.change(screen.getByPlaceholderText('CAR-XXXXXXXX'), {
      target: { value: 'CAR-BADID000' },
    })
    fireEvent.click(screen.getByText('Track'))
    await waitFor(() => expect(screen.queryByText('John Doe')).not.toBeInTheDocument())
  })
})

describe('TrackPage – URL query param auto-load', () => {
  it('auto-loads application when ?id= is in the URL', async () => {
    vi.mocked(loanApi.trackApplication).mockResolvedValue(mockApplication)

    renderTrackPage('/track?id=CAR-ABCD1234')

    await waitFor(() => {
      expect(loanApi.trackApplication).toHaveBeenCalledWith('CAR-ABCD1234')
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  it('pre-fills the input with the ID from the URL', async () => {
    vi.mocked(loanApi.trackApplication).mockResolvedValue(mockApplication)

    renderTrackPage('/track?id=CAR-ABCD1234')

    await waitFor(() => {
      const input = screen.getByPlaceholderText('CAR-XXXXXXXX') as HTMLInputElement
      expect(input.value).toBe('CAR-ABCD1234')
    })
  })
})
