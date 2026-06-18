import type { FinanceResult } from '../../domain/core/FinanceResult'
import type { CreditFacility } from '../../domain/entities/CreditFacility'
import type { FinancialObligation } from '../../domain/entities/FinancialObligation'
import type { Money } from '../../domain/valueObjects/Money'
import type {
  BankPositionSummary,
  CashBucket,
} from '../bankPosition/types'

export type PlanningHorizon = 'Today' | '7 Days' | '15 Days' | '30 Days' | '90 Days'
export type LiquidityStatus = 'Green' | 'Amber' | 'Red'

export interface CashInflow {
  id: string
  legalEntityId: string
  projectId?: string
  description: string
  expectedDate: string
  amount: Money
  confidence: 'committed' | 'probable' | 'possible'
}

export interface LiquidityInput {
  groupId: string
  reportingCurrency: string
  asOfDate: string
  planningHorizon: PlanningHorizon
  bankPosition: BankPositionSummary
  cashBuckets: CashBucket[]
  obligations: FinancialObligation[]
  cashInflows: CashInflow[]
  creditFacilities: CreditFacility[]
}

export interface LiquiditySummary {
  planningHorizon: PlanningHorizon
  horizonEndDate: string
  openingCash: Money
  expectedInflows: Money
  expectedOutflows: Money
  projectedClosingCash: Money
  fundingGap: Money
  liquidityCoverageRatio: number
  borrowingHeadroom: Money
  cashRunwayDays: number | null
  liquidityStatus: LiquidityStatus
}

export type LiquidityResult = FinanceResult<LiquiditySummary>
