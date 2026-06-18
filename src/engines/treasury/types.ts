import type { FinanceResult } from '../../domain/core/FinanceResult'
import type { Money } from '../../domain/valueObjects/Money'
import type { BankPositionResult } from '../bankPosition/types'
import type { BlockedCashEvaluation } from '../blockedCash/types'
import type { CashInflow, LiquidityResult } from '../liquidity/types'

export type TreasuryPaymentCategory =
  | 'Vendor Run (15th)'
  | 'Vendor Run (30th)'
  | 'GST'
  | 'TDS'
  | 'Salary'
  | 'EMI'
  | 'Interest'
  | 'Loan Repayment'

export type TreasuryPriority = 'critical' | 'high' | 'medium' | 'low'
export type TreasuryFundingStatus = 'funded' | 'watch' | 'gap'
export type TreasuryFacilityType = 'Cash Credit' | 'Overdraft' | 'DLOD' | 'Term Loan'
export type TreasuryForecastHorizon = 'Today' | '7 Days' | '15 Days' | '30 Days'

export interface ScheduledTreasuryPayment {
  id: string
  category: TreasuryPaymentCategory
  dueDate: string
  amount: Money
  priority: TreasuryPriority
  fundingStatus: TreasuryFundingStatus
}

export interface TreasuryFacilityPosition {
  id: string
  facilityType: TreasuryFacilityType
  limit: Money
  utilised: Money
  available: Money
  utilisationPercentage: number
  recommendation: string
}

export interface TreasuryCashForecast {
  horizon: TreasuryForecastHorizon
  openingCash: Money
  expectedCollections: Money
  scheduledPayments: Money
  borrowingAvailability: Money
  blockedCash: Money
  projectedCash: Money
  fundingGap: Money
}

export interface TreasuryRecommendation {
  id: string
  priority: TreasuryPriority
  title: string
  reason: string
  expectedImpact: Money
}

export interface TreasuryInput {
  groupId: string
  reportingCurrency: string
  asOfDate: string
  bankPosition: BankPositionResult
  liquidity: LiquidityResult
  blockedCash: BlockedCashEvaluation
  scheduledPayments: ScheduledTreasuryPayment[]
  expectedCollections: CashInflow[]
  facilities: TreasuryFacilityPosition[]
}

export interface TreasurySummary {
  deployableCash: Money
  operatingCash: Money
  restrictedCash: Money
  blockedReraCash: Money
  expectedUnlockableCash: Money
  borrowingCapacity: Money
  borrowingUtilisationPercentage: number
  availableOd: Money
  availableCc: Money
  availableDlod: Money
  cashForecast: TreasuryCashForecast[]
  fundingGap: Money
  treasuryHealthScore: number
  paymentsDueThisWeek: Money
  upcomingFundingRequirements: ScheduledTreasuryPayment[]
  paymentCalendar: ScheduledTreasuryPayment[]
  borrowingPosition: TreasuryFacilityPosition[]
  treasuryRecommendations: TreasuryRecommendation[]
}

export type TreasuryResult = FinanceResult<TreasurySummary>
