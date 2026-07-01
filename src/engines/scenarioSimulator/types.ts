import type { BlockedCashEvaluation } from '../blockedCash/types'
import type { CollectionsResult } from '../collections/types'
import type { LiquidityResult } from '../liquidity/types'
import type { MorningBrief } from '../morningBrief/types'
import type { TreasuryResult } from '../treasury/types'

export type ScenarioCategory =
  | 'Collections'
  | 'Blocked Cash'
  | 'Borrowings'
  | 'Sales'
  | 'Real Estate'

export type ImpactMetricKey =
  | 'deployableCash'
  | 'runwayDays'
  | 'borrowingUtilization'
  | 'blockedCash'
  | 'financeHealthScore'
  | 'collectionsGap'

export interface Scenario {
  id: string
  name: string
  category: ScenarioCategory
  description: string
  cashImpactMinor: number
  runwayImpactDays: number
  collectionsGapImpactMinor: number
  blockedCashImpactMinor: number
  borrowingUtilizationImpact: number
  healthScoreImpact: number
}

export interface ScenarioMetrics {
  deployableCash: number
  runwayDays: number
  borrowingUtilization: number
  blockedCash: number
  financeHealthScore: number
  collectionsGap: number
}

export interface ImpactMetric {
  key: ImpactMetricKey
  label: string
  unit: 'money' | 'days' | 'percentage' | 'score'
  before: number
  after: number
  change: number
}

export interface ScenarioSimulatorInput {
  currency: string
  treasury: TreasuryResult
  liquidity: LiquidityResult
  collections: CollectionsResult
  blockedCash: BlockedCashEvaluation
  morningBrief: MorningBrief
  scenarios: Scenario[]
}

export interface ScenarioResult {
  scenarioId: string
  scenarioName: string
  category: ScenarioCategory
  before: ScenarioMetrics
  after: ScenarioMetrics
  impact: ImpactMetric[]
  insight: string
}

export interface ScenarioSimulatorSummary {
  currency: string
  scenarios: Scenario[]
  results: ScenarioResult[]
  bestScenario: ScenarioResult
}
