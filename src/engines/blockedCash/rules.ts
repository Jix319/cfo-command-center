import type {
  ProjectWithdrawalPosition,
  WithdrawalEligibilityRule,
  WithdrawalRuleFinding,
} from './types'

function createFinding(
  ruleCode: string,
  isSatisfied: boolean,
  blockedReason: string,
  recommendedAction: string,
): WithdrawalRuleFinding {
  return {
    ruleCode,
    isSatisfied,
    blockedReason,
    recommendedAction,
  }
}

export const vendorBillsBookedRule: WithdrawalEligibilityRule = {
  code: 'VENDOR_BILLS_BOOKED',
  evaluate: (project: ProjectWithdrawalPosition): WithdrawalRuleFinding =>
    createFinding(
      'VENDOR_BILLS_BOOKED',
      project.pendingVendorBills === 0,
      `₹${project.pendingVendorBills.toLocaleString('en-IN')} of vendor bills are pending booking.`,
      'Book and validate all pending vendor bills in the project accounts.',
    ),
}

export const architectCertificateRule: WithdrawalEligibilityRule = {
  code: 'ARCHITECT_CERTIFICATE_APPROVED',
  evaluate: (project: ProjectWithdrawalPosition): WithdrawalRuleFinding =>
    createFinding(
      'ARCHITECT_CERTIFICATE_APPROVED',
      project.architectCertificateStatus === 'approved',
      `Architect certificate is ${project.architectCertificateStatus.replace('_', ' ')}.`,
      'Obtain an approved architect certificate for the withdrawal request.',
    ),
}

export const caCertificateRule: WithdrawalEligibilityRule = {
  code: 'CA_CERTIFICATE_APPROVED',
  evaluate: (project: ProjectWithdrawalPosition): WithdrawalRuleFinding =>
    createFinding(
      'CA_CERTIFICATE_APPROVED',
      project.caCertificateStatus === 'approved',
      `CA certificate is ${project.caCertificateStatus.replace('_', ' ')}.`,
      'Obtain an approved CA certificate for the withdrawal request.',
    ),
}

export const approvedWithdrawalWithinReraBalanceRule: WithdrawalEligibilityRule = {
  code: 'APPROVED_WITHDRAWAL_WITHIN_RERA_BALANCE',
  evaluate: (project: ProjectWithdrawalPosition): WithdrawalRuleFinding =>
    createFinding(
      'APPROVED_WITHDRAWAL_WITHIN_RERA_BALANCE',
      project.approvedWithdrawal <= project.reraBalance,
      'Approved withdrawal exceeds the available RERA balance.',
      'Reduce the approved withdrawal to the available RERA balance.',
    ),
}

export const withdrawalEligibilityRules: WithdrawalEligibilityRule[] = [
  vendorBillsBookedRule,
  architectCertificateRule,
  caCertificateRule,
  approvedWithdrawalWithinReraBalanceRule,
]
