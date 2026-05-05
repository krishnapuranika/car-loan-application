import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { submitApplication } from '../api/loanApi'
import LoadingSpinner from '../components/LoadingSpinner'
import type { LoanApplicationRequest } from '../types/loan'

const schema = z.object({
  firstName:        z.string().min(1, 'Required').max(50),
  lastName:         z.string().min(1, 'Required').max(50),
  email:            z.string().email('Invalid email address'),
  phone:            z.string().regex(/^[+]?[0-9]{10,15}$/, 'Enter a valid phone number (10–15 digits)'),
  dateOfBirth:      z.string().min(1, 'Required'),
  employmentStatus: z.enum(['EMPLOYED', 'SELF_EMPLOYED', 'UNEMPLOYED', 'RETIRED'], {
    errorMap: () => ({ message: 'Select an employment status' }),
  }),
  annualIncome:     z.coerce.number({ invalid_type_error: 'Enter a valid amount' }).positive('Must be greater than 0'),
  employerName:     z.string().max(100).optional(),
  vehicleMake:      z.string().min(1, 'Required').max(50),
  vehicleModel:     z.string().min(1, 'Required').max(50),
  vehicleYear:      z.coerce.number({ invalid_type_error: 'Enter a valid year' }).min(1980, 'Year must be 1980 or later').max(2027, 'Invalid year'),
  vehiclePrice:     z.coerce.number({ invalid_type_error: 'Enter a valid amount' }).min(1000, 'Minimum $1,000'),
  downPayment:      z.coerce.number({ invalid_type_error: 'Enter a valid amount' }).min(0, 'Cannot be negative'),
  loanAmount:       z.coerce.number({ invalid_type_error: 'Enter a valid amount' }).min(1000, 'Minimum $1,000'),
  loanTermMonths:   z.coerce.number({ invalid_type_error: 'Select a loan term' }).positive('Select a loan term'),
})

type FormData = z.infer<typeof schema>

const STEPS = [
  { title: 'Personal Info',     fields: ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth'] as const },
  { title: 'Financial Info',    fields: ['employmentStatus', 'annualIncome', 'employerName'] as const },
  { title: 'Vehicle & Loan',    fields: ['vehicleMake', 'vehicleModel', 'vehicleYear', 'vehiclePrice', 'downPayment', 'loanAmount', 'loanTermMonths'] as const },
]

export default function ApplyPage() {
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [trackingId, setTrackingId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  })

  const vehiclePrice = watch('vehiclePrice')
  const downPayment  = watch('downPayment')

  const advance = useCallback(async () => {
    const valid = await trigger(STEPS[step].fields as (keyof FormData)[])
    if (valid) setStep(s => s + 1)
  }, [step, trigger])

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const payload: LoanApplicationRequest = {
        ...data,
        annualIncome:   Number(data.annualIncome),
        vehicleYear:    Number(data.vehicleYear),
        vehiclePrice:   Number(data.vehiclePrice),
        downPayment:    Number(data.downPayment),
        loanAmount:     Number(data.loanAmount),
        loanTermMonths: Number(data.loanTermMonths),
      }
      const response = await submitApplication(payload)
      setTrackingId(response.trackingId)
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Failed to submit. Please try again.'
      setSubmitError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (trackingId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="card">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 mb-6">Your application has been received. Use your tracking ID to check the status at any time.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Your Tracking ID</p>
            <p className="text-2xl font-mono font-bold text-blue-700 tracking-widest">{trackingId}</p>
          </div>
          <p className="text-sm text-gray-400 mb-6">Save this ID — you'll need it to track your application.</p>
          <Link to={`/track?id=${trackingId}`} className="btn-primary">
            Track My Application
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Apply for a Car Loan</h1>
        <p className="text-gray-500">3 quick steps to get started.</p>
      </div>

      {/* Step progress */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s.title} className="flex items-center flex-1 last:flex-none">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition ${
                i < step  ? 'bg-blue-600 text-white' :
                i === step ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                'bg-gray-200 text-gray-500'
              }`}
            >
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`ml-2 text-sm font-medium hidden sm:block ${i === step ? 'text-blue-600' : 'text-gray-400'}`}>
              {s.title}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 ${i < step ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card mb-6">

          {/* Step 1 – Personal Info */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">First Name *</label>
                  <input {...register('firstName')} className="form-input" placeholder="John" />
                  {errors.firstName && <p className="form-error">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="form-label">Last Name *</label>
                  <input {...register('lastName')} className="form-input" placeholder="Doe" />
                  {errors.lastName && <p className="form-error">{errors.lastName.message}</p>}
                </div>
              </div>
              <div>
                <label className="form-label">Email Address *</label>
                <input {...register('email')} type="email" className="form-input" placeholder="john@example.com" />
                {errors.email && <p className="form-error">{errors.email.message}</p>}
              </div>
              <div>
                <label className="form-label">Phone Number *</label>
                <input {...register('phone')} className="form-input" placeholder="1234567890" />
                {errors.phone && <p className="form-error">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="form-label">Date of Birth *</label>
                <input
                  {...register('dateOfBirth')}
                  type="date"
                  className="form-input"
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.dateOfBirth && <p className="form-error">{errors.dateOfBirth.message}</p>}
              </div>
            </div>
          )}

          {/* Step 2 – Financial Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h2>
              <div>
                <label className="form-label">Employment Status *</label>
                <select {...register('employmentStatus')} className="form-input">
                  <option value="">Select status...</option>
                  <option value="EMPLOYED">Employed</option>
                  <option value="SELF_EMPLOYED">Self-Employed</option>
                  <option value="UNEMPLOYED">Unemployed</option>
                  <option value="RETIRED">Retired</option>
                </select>
                {errors.employmentStatus && <p className="form-error">{errors.employmentStatus.message}</p>}
              </div>
              <div>
                <label className="form-label">Annual Income ($) *</label>
                <input {...register('annualIncome')} type="number" className="form-input" placeholder="60000" min="0" step="100" />
                {errors.annualIncome && <p className="form-error">{errors.annualIncome.message}</p>}
              </div>
              <div>
                <label className="form-label">Employer Name</label>
                <input {...register('employerName')} className="form-input" placeholder="Company name (optional)" />
              </div>
            </div>
          )}

          {/* Step 3 – Vehicle & Loan */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle &amp; Loan Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Vehicle Make *</label>
                  <input {...register('vehicleMake')} className="form-input" placeholder="Toyota" />
                  {errors.vehicleMake && <p className="form-error">{errors.vehicleMake.message}</p>}
                </div>
                <div>
                  <label className="form-label">Vehicle Model *</label>
                  <input {...register('vehicleModel')} className="form-input" placeholder="Camry" />
                  {errors.vehicleModel && <p className="form-error">{errors.vehicleModel.message}</p>}
                </div>
              </div>
              <div>
                <label className="form-label">Vehicle Year *</label>
                <input {...register('vehicleYear')} type="number" className="form-input" placeholder="2023" min="1980" max="2027" />
                {errors.vehicleYear && <p className="form-error">{errors.vehicleYear.message}</p>}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Vehicle Price ($) *</label>
                  <input {...register('vehiclePrice')} type="number" className="form-input" placeholder="25000" min="1000" step="100" />
                  {errors.vehiclePrice && <p className="form-error">{errors.vehiclePrice.message}</p>}
                </div>
                <div>
                  <label className="form-label">Down Payment ($) *</label>
                  <input {...register('downPayment')} type="number" className="form-input" placeholder="5000" min="0" step="100" />
                  {errors.downPayment && <p className="form-error">{errors.downPayment.message}</p>}
                </div>
              </div>
              <div>
                <label className="form-label">Loan Amount ($) *</label>
                <input
                  {...register('loanAmount')}
                  type="number"
                  className="form-input"
                  placeholder={
                    vehiclePrice && downPayment
                      ? String(Math.max(0, Number(vehiclePrice) - Number(downPayment)))
                      : '20000'
                  }
                  min="1000"
                  step="100"
                />
                {errors.loanAmount && <p className="form-error">{errors.loanAmount.message}</p>}
              </div>
              <div>
                <label className="form-label">Loan Term *</label>
                <select {...register('loanTermMonths')} className="form-input">
                  <option value="">Select term...</option>
                  {[12, 24, 36, 48, 60, 72, 84].map(m => (
                    <option key={m} value={m}>
                      {m} months ({m / 12} {m / 12 === 1 ? 'year' : 'years'})
                    </option>
                  ))}
                </select>
                {errors.loanTermMonths && <p className="form-error">{errors.loanTermMonths.message}</p>}
              </div>
            </div>
          )}
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4 text-sm">
            {submitError}
          </div>
        )}

        <div className="flex justify-between">
          {step > 0 ? (
            <button type="button" onClick={() => setStep(s => s - 1)} className="btn-secondary">
              Back
            </button>
          ) : (
            <div />
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={advance} className="btn-primary">
              Continue
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? <LoadingSpinner size="sm" /> : 'Submit Application'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
