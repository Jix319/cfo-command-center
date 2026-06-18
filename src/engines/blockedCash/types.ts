export type FinanceCertificateStatus =
  | 'approved'
  | 'pending'
  | 'rejected'
  | 'not_submitted'

export type BlockedCashConfidenceLevel = 'high' | 'medium' | 'low'

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

export interface BlockedCashEvaluation {
  projectName: string
  withdrawableAmount: number
  blockedAmount: number
  blockedReasons: string[]
  recommendedActions: string[]
  confidenceLevel: BlockedCashConfidenceLevel
}
