import { DEMO_RERA_WITHDRAWAL_POSITIONS } from '../../demo/rera'
import type { ProjectWithdrawalPosition } from './types'

function toProjectWithdrawalPosition(
  position: (typeof DEMO_RERA_WITHDRAWAL_POSITIONS)[number],
): ProjectWithdrawalPosition {
  return {
    projectName: position.projectName,
    reraBalance: position.reraBalanceMinor,
    bookedExpenses: position.bookedExpensesMinor,
    pendingVendorBills: position.pendingVendorBillsMinor,
    architectCertificateStatus: position.architectCertificateStatus,
    caCertificateStatus: position.caCertificateStatus,
    requestedWithdrawal: position.requestedWithdrawalMinor,
    approvedWithdrawal: position.approvedWithdrawalMinor,
  }
}

export const HEALTHY_PROJECT: ProjectWithdrawalPosition =
  toProjectWithdrawalPosition(DEMO_RERA_WITHDRAWAL_POSITIONS[0])

export const PROJECT_BLOCKED_BY_BILLS: ProjectWithdrawalPosition =
  toProjectWithdrawalPosition(DEMO_RERA_WITHDRAWAL_POSITIONS[1])

export const PROJECT_BLOCKED_BY_CERTIFICATION: ProjectWithdrawalPosition =
  toProjectWithdrawalPosition(DEMO_RERA_WITHDRAWAL_POSITIONS[2])

export const BLOCKED_CASH_SAMPLE_PROJECTS: ProjectWithdrawalPosition[] =
  DEMO_RERA_WITHDRAWAL_POSITIONS.map(toProjectWithdrawalPosition)
