import type { Decision } from './Decision'
import type { Recommendation } from './Recommendation'
import type { Risk } from './Risk'
import type { Score } from './Score'

export interface FinanceResult<TOutput> {
  engineId: string
  engineVersion: string
  evaluatedAt: string
  output: TOutput
  decisions: Decision[]
  recommendations: Recommendation[]
  risks: Risk[]
  score: Score
}
