export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low'

export interface Risk {
  code: string
  title: string
  description: string
  severity: RiskSeverity
  financialExposure?: number
}
