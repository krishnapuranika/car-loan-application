import type { LoanApplicationRequest, LoanApplicationResponse, ApiErrorResponse } from '../types/loan'

const API_BASE = '/api/v1/applications'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiErrorResponse = await response.json().catch(() => ({
      status: response.status,
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    }))
    throw error
  }
  return response.json()
}

export async function submitApplication(
  data: LoanApplicationRequest,
): Promise<LoanApplicationResponse> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return handleResponse<LoanApplicationResponse>(response)
}

export async function trackApplication(trackingId: string): Promise<LoanApplicationResponse> {
  const response = await fetch(`${API_BASE}/${encodeURIComponent(trackingId.toUpperCase())}`)
  return handleResponse<LoanApplicationResponse>(response)
}
