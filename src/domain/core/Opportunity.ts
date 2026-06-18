import type { Money } from '../valueObjects/Money'
import type { Percentage } from '../valueObjects/Percentage'

export type OpportunityStatus =
  | 'identified'
  | 'validated'
  | 'in_progress'
  | 'realized'
  | 'dismissed'

export interface Opportunity {
  id: string
  engine: string
  title: string
  description: string
  potentialValue: Money
  realizationProbability?: Percentage
  status: OpportunityStatus
  recommendedAction: string
  owner?: string
  targetDate?: string
  dependencies: string[]
}
