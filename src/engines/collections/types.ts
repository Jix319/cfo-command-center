import type { FinanceResult } from '../../domain/core/FinanceResult'
import type { Customer } from '../../domain/entities/Customer'
import type { Project } from '../../domain/entities/Project'
import type { Unit } from '../../domain/entities/Unit'
import type { Money } from '../../domain/valueObjects/Money'

export type CollectionStage =
  | 'Demand Raised'
  | 'Customer Committed'
  | 'Loan Processing'
  | 'Registration Scheduled'
  | 'Payment Received'
  | 'Allocated'

export type CollectionDelayReason =
  | 'Loan Processing'
  | 'Registration Pending'
  | 'Documentation Pending'
  | 'Customer Delay'
  | 'Legal Issue'
  | 'Payment Awaited'

export type CollectionRecommendedAction =
  | 'Call Customer'
  | 'Call Banker'
  | 'Schedule Registration'
  | 'Sales Follow-up'
  | 'Legal Follow-up'

export type ForecastConfidence = 'High' | 'Medium' | 'Low'

export interface CollectionCase {
  id: string
  customer: Customer
  project: Project
  unit: Unit
  amountDue: Money
  expectedCollectionDate: string
  probability: number
  delayReason: CollectionDelayReason
  recommendedAction: CollectionRecommendedAction
  stage: CollectionStage
  amountCollected: Money
}

export interface CollectionsInput {
  groupId: string
  reportingCurrency: string
  asOfDate: string
  todayTarget: Money
  monthTarget: Money
  collectionCases: CollectionCase[]
}

export interface CollectionPipelineStage {
  stage: CollectionStage
  caseCount: number
  amount: Money
}

export interface DelayReasonSummary {
  reason: CollectionDelayReason
  caseCount: number
  amount: Money
}

export interface RecoveryCase {
  id: string
  customerName: string
  projectName: string
  unitNumber: string
  amountDue: Money
  expectedCollectionDate: string
  probability: number
  delayReason: CollectionDelayReason
  recommendedAction: CollectionRecommendedAction
  stage: CollectionStage
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
}

export interface CollectionsSummary {
  todayTarget: Money
  todayCollections: Money
  todayAchievementPercentage: number
  monthTarget: Money
  monthCollections: Money
  achievementPercentage: number
  forecast: Money
  forecastConfidence: ForecastConfidence
  collectionGap: Money
  recoveryScore: number
  pipeline: CollectionPipelineStage[]
  delayReasons: DelayReasonSummary[]
  recoveryCases: RecoveryCase[]
}

export type CollectionsResult = FinanceResult<CollectionsSummary>
