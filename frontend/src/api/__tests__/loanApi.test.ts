import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { submitApplication, trackApplication } from '../loanApi'
import type { LoanApplicationRequest, LoanApplicationResponse } from '../../types/loan'

const mockResponse: LoanApplicationResponse = {
  trackingId: 'CAR-ABCD1234',
  status: 'SUBMITTED',
  statusMessage: 'Your application has been received.',
  applicantName: 'John Doe',
  email: 'john@example.com',
  loanAmount: 20000,
  loanTermMonths: 60,
  vehicleInfo: '2023 Toyota Camry',
  submittedAt: '2026-05-05T10:00:00',
  updatedAt: '2026-05-05T10:00:00',
}

const mockRequest: LoanApplicationRequest = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '1234567890',
  dateOfBirth: '1990-01-01',
  employmentStatus: 'EMPLOYED',
  annualIncome: 60000,
  vehicleMake: 'Toyota',
  vehicleModel: 'Camry',
  vehicleYear: 2023,
  vehiclePrice: 25000,
  downPayment: 5000,
  loanAmount: 20000,
  loanTermMonths: 60,
}

beforeEach(() => {
  global.fetch = vi.fn()
})

afterEach(() => {
  vi.restoreAllMocks()
})

function mockFetchOk(body: unknown) {
  vi.mocked(global.fetch).mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(body),
  } as Response)
}

function mockFetchError(status: number, body: unknown) {
  vi.mocked(global.fetch).mockResolvedValueOnce({
    ok: false,
    json: () => Promise.resolve(body),
  } as Response)
}

describe('submitApplication', () => {
  it('sends a POST request to /api/v1/applications', async () => {
    mockFetchOk(mockResponse)

    await submitApplication(mockRequest)

    expect(fetch).toHaveBeenCalledWith(
      '/api/v1/applications',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('sends JSON content-type header', async () => {
    mockFetchOk(mockResponse)

    await submitApplication(mockRequest)

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ headers: { 'Content-Type': 'application/json' } }),
    )
  })

  it('serialises the request body as JSON', async () => {
    mockFetchOk(mockResponse)

    await submitApplication(mockRequest)

    const [, options] = vi.mocked(fetch).mock.calls[0]
    const body = JSON.parse((options as RequestInit).body as string)
    expect(body.firstName).toBe('John')
    expect(body.loanAmount).toBe(20000)
  })

  it('returns the parsed response on success', async () => {
    mockFetchOk(mockResponse)

    const result = await submitApplication(mockRequest)

    expect(result.trackingId).toBe('CAR-ABCD1234')
    expect(result.status).toBe('SUBMITTED')
  })

  it('throws the error body when response is not ok', async () => {
    mockFetchError(400, { message: 'Validation failed', errors: { email: 'Invalid' } })

    await expect(submitApplication(mockRequest)).rejects.toMatchObject({
      message: 'Validation failed',
    })
  })
})

describe('trackApplication', () => {
  it('sends a GET request with the uppercased tracking ID', async () => {
    mockFetchOk(mockResponse)

    await trackApplication('car-abcd1234')

    expect(fetch).toHaveBeenCalledWith('/api/v1/applications/CAR-ABCD1234')
  })

  it('returns the parsed response on success', async () => {
    mockFetchOk(mockResponse)

    const result = await trackApplication('CAR-ABCD1234')

    expect(result.applicantName).toBe('John Doe')
    expect(result.vehicleInfo).toBe('2023 Toyota Camry')
  })

  it('throws when application is not found', async () => {
    mockFetchError(404, { message: 'No application found with tracking ID: CAR-NOTEXIST' })

    await expect(trackApplication('CAR-NOTEXIST')).rejects.toMatchObject({
      message: 'No application found with tracking ID: CAR-NOTEXIST',
    })
  })
})
