import type { CreditFacility } from '../../domain/entities/CreditFacility'
import type { FinancialObligation } from '../../domain/entities/FinancialObligation'
import type { Money } from '../../domain/valueObjects/Money'
import type {
  CashInflow,
  LiquidityStatus,
  PlanningHorizon,
} from './types'

export const LOW_LIQUIDITY_COVERAGE_RATIO = 1
export const AMBER_LIQUIDITY_COVERAGE_RATIO = 1.2
export const HIGH_BORROWING_DEPENDENCY_RATIO = 0.5
export const STRONG_INFLOW_COVERAGE_RATIO = 0.75

const horizonDays: Record<PlanningHorizon, number> = {
  Today: 0,
  '7 Days': 7,
  '15 Days': 15,
  '30 Days': 30,
  '90 Days': 90,
}

export function getPlanningHorizonDays(horizon: PlanningHorizon): number {
  return horizonDays[horizon]
}

export function getHorizonEndDate(
  asOfDate: string,
  horizon: PlanningHorizon,
): string {
  const endDate = new Date(asOfDate)
  endDate.setUTCDate(endDate.getUTCDate() + getPlanningHorizonDays(horizon))
  return endDate.toISOString()
}

export function isDateWithinHorizon(
  date: string,
  asOfDate: string,
  horizonEndDate: string,
): boolean {
  const value = new Date(date).getTime()
  return (
    value >= new Date(asOfDate).getTime() &&
    value <= new Date(horizonEndDate).getTime()
  )
}

export function isRelevantObligation(
  obligation: FinancialObligation,
  asOfDate: string,
  horizonEndDate: string,
): boolean {
  return (
    obligation.status !== 'settled' &&
    obligation.status !== 'cancelled' &&
    (obligation.status === 'overdue' ||
      isDateWithinHorizon(obligation.dueDate, asOfDate, horizonEndDate))
  )
}

export function isRelevantInflow(
  inflow: CashInflow,
  asOfDate: string,
  horizonEndDate: string,
): boolean {
  return (
    inflow.confidence !== 'possible' &&
    isDateWithinHorizon(inflow.expectedDate, asOfDate, horizonEndDate)
  )
}

export function getAvailableFacilityAmountMinor(
  facility: CreditFacility,
): number {
  if (facility.status !== 'active') {
    return 0
  }

  return Math.max(
    facility.sanctionedLimit.amountMinor -
      (facility.utilizedAmount?.amountMinor ?? 0),
    0,
  )
}

export function determineLiquidityStatus(
  fundingGapMinor: number,
  projectedClosingCashMinor: number,
  liquidityCoverageRatio: number,
): LiquidityStatus {
  if (
    fundingGapMinor > 0 ||
    projectedClosingCashMinor < 0 ||
    liquidityCoverageRatio < LOW_LIQUIDITY_COVERAGE_RATIO
  ) {
    return 'Red'
  }

  if (liquidityCoverageRatio < AMBER_LIQUIDITY_COVERAGE_RATIO) {
    return 'Amber'
  }

  return 'Green'
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
