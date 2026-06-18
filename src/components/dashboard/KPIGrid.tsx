import type { ReactElement } from 'react'
import type { DashboardMetric } from '../../types/dashboard'
import KPIStatCard from './KPIStatCard'

interface KPIGridProps {
  metrics: DashboardMetric[]
}

export default function KPIGrid({ metrics }: KPIGridProps): ReactElement {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <KPIStatCard key={metric.id} metric={metric} />
      ))}
    </div>
  )
}
