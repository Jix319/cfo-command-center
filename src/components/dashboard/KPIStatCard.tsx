import type { ReactElement } from 'react'
import type { DashboardMetric } from '../../types/dashboard'
import MetricCard from '../common/MetricCard'

interface KPIStatCardProps {
  metric: DashboardMetric
}

export default function KPIStatCard({ metric }: KPIStatCardProps): ReactElement {
  return (
    <div>
      <MetricCard
        title={metric.title}
        value={metric.value}
        change={metric.change}
        changeType={metric.changeType}
        icon={metric.icon}
      />
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{metric.subtitle}</p>
    </div>
  )
}
