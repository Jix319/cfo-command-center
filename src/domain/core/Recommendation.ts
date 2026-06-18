import type { Money } from '../valueObjects/Money'
import type { DecisionConfidence, DecisionPriority } from './Decision'

export interface Recommendation {
  id: string
  engine: string
  title: string
  description: string
  priority: DecisionPriority
  financialImpact?: Money
  confidence: DecisionConfidence
  action: string
  owner?: string
  dueDate?: string
  dependencies: string[]
}
