import type { ProjectWithdrawalPosition } from './types'

export const HEALTHY_PROJECT: ProjectWithdrawalPosition = {
  projectName: 'Aarav Heights',
  reraBalance: 48_500_000,
  bookedExpenses: 18_750_000,
  pendingVendorBills: 0,
  architectCertificateStatus: 'approved',
  caCertificateStatus: 'approved',
  requestedWithdrawal: 12_000_000,
  approvedWithdrawal: 12_000_000,
}

export const PROJECT_BLOCKED_BY_BILLS: ProjectWithdrawalPosition = {
  projectName: 'Meridian Business Park',
  reraBalance: 63_200_000,
  bookedExpenses: 27_400_000,
  pendingVendorBills: 6_850_000,
  architectCertificateStatus: 'approved',
  caCertificateStatus: 'approved',
  requestedWithdrawal: 16_500_000,
  approvedWithdrawal: 16_500_000,
}

export const PROJECT_BLOCKED_BY_CERTIFICATION: ProjectWithdrawalPosition = {
  projectName: 'Solstice Residences',
  reraBalance: 35_800_000,
  bookedExpenses: 14_100_000,
  pendingVendorBills: 0,
  architectCertificateStatus: 'pending',
  caCertificateStatus: 'not_submitted',
  requestedWithdrawal: 9_500_000,
  approvedWithdrawal: 9_500_000,
}

export const BLOCKED_CASH_SAMPLE_PROJECTS: ProjectWithdrawalPosition[] = [
  HEALTHY_PROJECT,
  PROJECT_BLOCKED_BY_BILLS,
  PROJECT_BLOCKED_BY_CERTIFICATION,
]
