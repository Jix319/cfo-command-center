import type { FinanceResult } from '../core/FinanceResult'

export type FinanceCertificateStatus =
  | 'approved'
  | 'pending'
  | 'rejected'
  | 'not_submitted'

export interface ProjectWithdrawalPosition {
  projectName: string
  reraBalance: number
  bookedExpenses: number
  pendingVendorBills: number
  architectCertificateStatus: FinanceCertificateStatus
  caCertificateStatus: FinanceCertificateStatus
  requestedWithdrawal: number
  approvedWithdrawal: number
}

export interface WithdrawalRuleFinding {
  ruleCode: string
  isSatisfied: boolean
  blockedReason: string
  recommendedAction: string
}

export interface WithdrawalEligibilityRule {
  code: string
  evaluate: (project: ProjectWithdrawalPosition) => WithdrawalRuleFinding
}

export interface BlockedCashOutput {
  projectName: string
  withdrawableAmount: number
  blockedAmount: number
  blockedReasons: string[]
  recommendedActions: string[]
}

export type BlockedCashEvaluation = FinanceResult<BlockedCashOutput>
