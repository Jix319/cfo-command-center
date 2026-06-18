import type { Money } from '../valueObjects/Money'
import type { Percentage } from '../valueObjects/Percentage'

export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low'
export type RiskStatus = 'open' | 'mitigated' | 'accepted' | 'closed'

export interface Risk {
  id: string
  engine: string
  title: string
  description: string
  severity: RiskSeverity
  status: RiskStatus
  probability?: Percentage
  financialExposure?: Money
  mitigation?: string
  owner?: string
  dueDate?: string
}
