import type { BlockedCashEvaluation } from '../blockedCash/types'
import type { CollectionsResult } from '../collections/types'
import type { LiquidityResult } from '../liquidity/types'
import type { TreasuryResult } from '../treasury/types'

export type MorningBriefPriority = 'critical' | 'high' | 'medium' | 'low'
export type MorningBriefTone = 'positive' | 'warning' | 'critical' | 'neutral'

export interface MorningBriefInput {
  generatedAt: string
  treasury: TreasuryResult
  collections: CollectionsResult
  blockedCash: BlockedCashEvaluation
  liquidity: LiquidityResult
}

export interface MorningBriefChange {
  id: string
  title: string
  description: string
  tone: MorningBriefTone
}

export interface MorningBriefRisk {
  id: string
  title: string
  description: string
  priority: MorningBriefPriority
  exposure: number
}

export interface MorningBriefOpportunity {
  id: string
  title: string
  description: string
  impact: number
}

export interface MorningBriefHealthComponent {
  label: 'Liquidity' | 'Collections' | 'Treasury' | 'Blocked Cash' | 'Compliance'
  score: number
  weight: number
  contribution: number
}

export interface MorningBriefAction {
  id: string
  title: string
  impact: number
  priority: MorningBriefPriority
  owner?: string
}

export interface MorningBrief {
  generatedAt: string
  currency: string
  healthScore: number
  healthBreakdown: MorningBriefHealthComponent[]
  deployableCash: number
  runwayDays: number | null
  collectionsGap: number
  blockedCash: number
  unlockableCash: number
  treasuryStatus: string
  collectionsAchievement: number
  changes: MorningBriefChange[]
  risks: MorningBriefRisk[]
  opportunities: MorningBriefOpportunity[]
  actions: MorningBriefAction[]
  todayPriority: MorningBriefAction | null
}
