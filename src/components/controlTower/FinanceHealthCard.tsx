import type { ReactElement } from 'react'
import type { ScoreBand } from '../../domain/core/Score'
import DashboardCard from '../layout/DashboardCard'
import StatusBadge, { type StatusVariant } from '../common/StatusBadge'

interface FinanceHealthCardProps {
  score: number
  trend: 'stable'
  status: ScoreBand
}

const statusVariants: Record<ScoreBand, StatusVariant> = {
  excellent: 'success',
  good: 'success',
  moderate: 'warning',
  weak: 'warning',
  critical: 'error',
}

export default function FinanceHealthCard({
  score,
  trend,
  status,
}: FinanceHealthCardProps): ReactElement {
  return (
    <DashboardCard title="Finance Health">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {score}
            <span className="text-base font-medium text-slate-400">/100</span>
          </p>
          <p className="mt-2 text-xs capitalize text-slate-500 dark:text-slate-400">
            Trend: {trend}
          </p>
        </div>
        <StatusBadge
          variant={statusVariants[status]}
          label={status.replace('_', ' ')}
        />
      </div>
    </DashboardCard>
  )
}
