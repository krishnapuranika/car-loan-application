import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { trackApplication } from '../api/loanApi'
import type { LoanApplicationResponse } from '../types/loan'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'

const STATUS_STEPS = [
  { key: 'SUBMITTED',    label: 'Application Submitted' },
  { key: 'UNDER_REVIEW', label: 'Under Review' },
  { key: 'DECISION',     label: 'Decision Made' },
] as const

const STATUS_INDEX: Record<string, number> = {
  SUBMITTED:    0,
  UNDER_REVIEW: 1,
  APPROVED:     2,
  REJECTED:     2,
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

export default function TrackPage() {
  const [searchParams] = useSearchParams()
  const [inputId, setInputId]       = useState(searchParams.get('id') ?? '')
  const [application, setApplication] = useState<LoanApplicationResponse | null>(null)
  const [isLoading, setIsLoading]   = useState(false)
  const [error, setError]           = useState<string | null>(null)

  const performTrack = useCallback(async (id: string) => {
    if (!id.trim()) return
    setIsLoading(true)
    setError(null)
    setApplication(null)
    try {
      const result = await trackApplication(id.trim())
      setApplication(result)
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Application not found. Please check your tracking ID.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      setInputId(id)
      performTrack(id)
    }
  }, [searchParams, performTrack])

  const currentIndex = application ? (STATUS_INDEX[application.status] ?? 0) : -1

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Track Your Application</h1>
        <p className="text-gray-500">Enter your tracking ID to check the latest status.</p>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <label className="form-label">Tracking ID</label>
        <div className="flex gap-3">
          <input
            value={inputId}
            onChange={e => setInputId(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && performTrack(inputId)}
            placeholder="CAR-XXXXXXXX"
            className="form-input font-mono flex-1 tracking-wide"
          />
          <button
            onClick={() => performTrack(inputId)}
            disabled={isLoading || !inputId.trim()}
            className="btn-primary whitespace-nowrap"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Track'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
          {error}
        </div>
      )}

      {application && (
        <div className="space-y-4">
          {/* Status card */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Tracking ID</p>
                <p className="font-mono font-bold text-lg text-gray-900 tracking-widest">
                  {application.trackingId}
                </p>
              </div>
              <StatusBadge status={application.status} />
            </div>
            <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm leading-relaxed">
              {application.statusMessage}
            </p>
          </div>

          {/* Progress timeline */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-5">Application Progress</h3>
            <div className="space-y-4">
              {STATUS_STEPS.map((s, i) => {
                const isDone    = i < currentIndex
                const isCurrent = i === currentIndex
                const isDecisionApproved = s.key === 'DECISION' && application.status === 'APPROVED'
                const isDecisionRejected = s.key === 'DECISION' && application.status === 'REJECTED'

                return (
                  <div key={s.key} className="flex items-center gap-4">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold transition ${
                        isDecisionRejected ? 'bg-red-500 text-white' :
                        isDone || (isCurrent && (application.status === 'APPROVED' || application.status === 'SUBMITTED' || application.status === 'UNDER_REVIEW'))
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isDone || isDecisionApproved ? '✓' : isDecisionRejected ? '✕' : i + 1}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isDone || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                        {s.label}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {application.status === 'APPROVED'
                            ? 'Approved – congratulations!'
                            : application.status === 'REJECTED'
                            ? 'Not approved at this time'
                            : 'Currently in progress'}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Details */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Application Details</h3>
            <dl className="grid sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
              {[
                { label: 'Applicant',     value: application.applicantName },
                { label: 'Vehicle',       value: application.vehicleInfo },
                { label: 'Loan Amount',   value: formatCurrency(application.loanAmount) },
                { label: 'Loan Term',     value: `${application.loanTermMonths} months` },
                { label: 'Submitted',     value: formatDate(application.submittedAt) },
                { label: 'Last Updated',  value: formatDate(application.updatedAt) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-gray-400 text-xs uppercase tracking-wide">{label}</dt>
                  <dd className="font-medium text-gray-900 mt-0.5">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}
