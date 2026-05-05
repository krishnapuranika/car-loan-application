export type EmploymentStatus = 'EMPLOYED' | 'SELF_EMPLOYED' | 'UNEMPLOYED' | 'RETIRED'

export type ApplicationStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'

export interface LoanApplicationRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  employmentStatus: EmploymentStatus
  annualIncome: number
  employerName?: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: number
  vehiclePrice: number
  downPayment: number
  loanAmount: number
  loanTermMonths: number
}

export interface LoanApplicationResponse {
  trackingId: string
  status: ApplicationStatus
  statusMessage: string
  applicantName: string
  email: string
  loanAmount: number
  loanTermMonths: number
  vehicleInfo: string
  submittedAt: string
  updatedAt: string
}

export interface ApiErrorResponse {
  status: number
  message: string
  errors?: Record<string, string>
  timestamp: string
}
