export type ScoreBand = 'strong' | 'moderate' | 'weak' | 'critical'
export type ScoreConfidence = 'high' | 'medium' | 'low'

export interface Score {
  value: number
  maximum: 100
  band: ScoreBand
  confidence: ScoreConfidence
  rationale: string
}
