import type { Money } from '../valueObjects/Money'

export type DecisionPriority = 'critical' | 'high' | 'medium' | 'low'
export type DecisionConfidence = 'high' | 'medium' | 'low'

export interface Decision {
  id: string
  engine: string
  title: string
  description: string
  priority: DecisionPriority
  financialImpact: Money
  confidence: DecisionConfidence
  recommendedAction: string
  owner: string
  dueDate?: string
  dependencies: string[]
}
