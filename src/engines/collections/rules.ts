import type { Money } from '../../domain/valueObjects/Money'
import type {
  CollectionCase,
  CollectionStage,
  ForecastConfidence,
  RecoveryCase,
} from './types'

export const COLLECTION_STAGES: CollectionStage[] = [
  'Demand Raised',
  'Customer Committed',
  'Loan Processing',
  'Registration Scheduled',
  'Payment Received',
  'Allocated',
]

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

export function isSameUtcDay(left: string, right: string): boolean {
  return left.slice(0, 10) === right.slice(0, 10)
}

export function isSameUtcMonth(left: string, right: string): boolean {
  return left.slice(0, 7) === right.slice(0, 7)
}

export function getForecastConfidence(
  collectionCases: CollectionCase[],
): ForecastConfidence {
  if (collectionCases.length === 0) return 'Low'

  const weightedProbability =
    collectionCases.reduce(
      (total, collectionCase) =>
        total +
        collectionCase.probability * collectionCase.amountDue.amountMinor,
      0,
    ) /
    collectionCases.reduce(
      (total, collectionCase) => total + collectionCase.amountDue.amountMinor,
      0,
    )

  if (weightedProbability >= 0.75) return 'High'
  if (weightedProbability >= 0.5) return 'Medium'
  return 'Low'
}

export function getRecoveryPriority(
  collectionCase: CollectionCase,
  asOfDate: string,
): RecoveryCase['priority'] {
  const daysFromToday = Math.ceil(
    (new Date(collectionCase.expectedCollectionDate).getTime() -
      new Date(asOfDate).getTime()) /
      86_400_000,
  )

  if (
    collectionCase.delayReason === 'Legal Issue' ||
    daysFromToday < 0
  ) {
    return 'Critical'
  }

  if (daysFromToday <= 2 || collectionCase.probability < 0.5) {
    return 'High'
  }

  if (daysFromToday <= 7) {
    return 'Medium'
  }

  return 'Low'
}

export function getStageRecoveryWeight(stage: CollectionStage): number {
  const weights: Record<CollectionStage, number> = {
    'Demand Raised': 0.25,
    'Customer Committed': 0.5,
    'Loan Processing': 0.55,
    'Registration Scheduled': 0.7,
    'Payment Received': 0.9,
    Allocated: 1,
  }

  return weights[stage]
}
