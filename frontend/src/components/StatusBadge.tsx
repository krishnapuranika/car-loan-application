import type { ApplicationStatus } from '../types/loan'

const config: Record<ApplicationStatus, { label: string; classes: string }> = {
  SUBMITTED:    { label: 'Submitted',    classes: 'bg-blue-100 text-blue-800' },
  UNDER_REVIEW: { label: 'Under Review', classes: 'bg-yellow-100 text-yellow-800' },
  APPROVED:     { label: 'Approved',     classes: 'bg-green-100 text-green-800' },
  REJECTED:     { label: 'Rejected',     classes: 'bg-red-100 text-red-800' },
}

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  const { label, classes } = config[status]
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${classes}`}>
      {label}
    </span>
  )
}
