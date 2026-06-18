export type DecisionOutcome =
  | 'approved'
  | 'partially_approved'
  | 'blocked'
  | 'review_required'

export interface Decision {
  code: string
  outcome: DecisionOutcome
  summary: string
  rationale: string
}
