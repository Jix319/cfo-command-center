import type { Money } from '../../domain/valueObjects/Money'
import type {
  AccountPurpose,
  BankAccountPosition,
  BankFacility,
  CashBucketType,
  Restriction,
} from './types'

export const HIGH_RESTRICTED_CASH_RATIO = 0.5
export const HIGH_OD_UTILIZATION_RATIO = 0.8
export const LOW_AVAILABLE_CASH_RATIO = 0.2
export const IDLE_OPERATING_CASH_RATIO = 0.3
export const LARGE_RESTRICTED_BALANCE_RATIO = 0.3

const inherentlyRestrictedPurposes: AccountPurpose[] = [
  'Escrow',
  'RERA70',
  'GST',
  'TRA',
]

export function isInherentlyRestrictedPurpose(
  purpose: AccountPurpose,
): boolean {
  return inherentlyRestrictedPurposes.includes(purpose)
}

export function isActiveRestriction(restriction: Restriction): boolean {
  return restriction.category !== 'None'
}

export function getRestrictedAmountMinor(
  accountPosition: BankAccountPosition,
): number {
  const positiveBalance = Math.max(accountPosition.balance.amountMinor, 0)

  if (isInherentlyRestrictedPurpose(accountPosition.purpose)) {
    return positiveBalance
  }

  const activeRestrictions = accountPosition.restrictions.filter(
    isActiveRestriction,
  )

  if (activeRestrictions.length === 0) {
    return 0
  }

  const hasUnspecifiedAmount = activeRestrictions.some(
    (restriction) => restriction.restrictedAmount === undefined,
  )

  if (hasUnspecifiedAmount) {
    return positiveBalance
  }

  const restrictedAmount = activeRestrictions.reduce(
    (total, restriction) =>
      total + (restriction.restrictedAmount?.amountMinor ?? 0),
    0,
  )

  return Math.min(Math.max(restrictedAmount, 0), positiveBalance)
}

export function getCashBucketType(
  purpose: AccountPurpose,
): Exclude<CashBucketType, 'Restricted Cash'> {
  if (purpose === 'Collection') {
    return 'Collection Accounts'
  }

  if (purpose === 'Escrow' || purpose === 'RERA70' || purpose === 'TRA') {
    return 'Escrow Cash'
  }

  if (
    purpose === 'OD' ||
    purpose === 'CC' ||
    purpose === 'DLOD' ||
    purpose === 'TermLoan'
  ) {
    return 'Borrowed Funds'
  }

  return 'Operating Cash'
}

export function getFacilityAvailableAmountMinor(
  bankFacility: BankFacility,
): number {
  if (bankFacility.facility.status !== 'active') {
    return 0
  }

  const sanctioned = bankFacility.facility.sanctionedLimit.amountMinor
  const utilized = bankFacility.facility.utilizedAmount?.amountMinor ?? 0

  return Math.max(sanctioned - utilized, 0)
}

export function getFacilityUtilizationRatio(
  bankFacility: BankFacility,
): number {
  const sanctioned = bankFacility.facility.sanctionedLimit.amountMinor

  if (sanctioned <= 0 || bankFacility.facility.status !== 'active') {
    return 0
  }

  const utilized = bankFacility.facility.utilizedAmount?.amountMinor ?? 0
  return Math.max(utilized / sanctioned, 0)
}

export function assertCurrency(
  money: Money,
  reportingCurrency: string,
): void {
  if (money.currency !== reportingCurrency) {
    throw new Error(
      `Expected ${reportingCurrency}, received ${money.currency}. Currency conversion is required before evaluation.`,
    )
  }
}
