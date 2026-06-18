export type RecommendationPriority = 'critical' | 'high' | 'medium' | 'low'

export interface Recommendation {
  code: string
  action: string
  rationale: string
  priority: RecommendationPriority
}
