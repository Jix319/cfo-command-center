import type { ComponentType, SVGProps } from 'react'

export type DashboardMetricChangeType = 'increase' | 'decrease' | 'neutral'

export interface DashboardMetric {
  id: string
  title: string
  value: string
  change: string
  changeType: DashboardMetricChangeType
  subtitle: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}
