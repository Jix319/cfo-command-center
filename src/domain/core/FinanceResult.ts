import type { Decision } from './Decision'
import type { Opportunity } from './Opportunity'
import type { Recommendation } from './Recommendation'
import type { Risk } from './Risk'
import type { Score } from './Score'

export interface FinanceResult<TOutput> {
  engine: string
  engineVersion: string
  evaluatedAt: string
  subjectId?: string
  summary: string
  score: Score
  decisions: Decision[]
  recommendations: Recommendation[]
  risks: Risk[]
  opportunities: Opportunity[]
  output: TOutput
}
