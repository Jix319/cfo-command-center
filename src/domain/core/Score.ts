export type ScoreBand = 'excellent' | 'good' | 'moderate' | 'weak' | 'critical'
export type ScoreTrend = 'improving' | 'stable' | 'declining' | 'not_available'

export interface Score {
  value: number
  maximum: number
  band: ScoreBand
  trend: ScoreTrend
  rationale: string
}
