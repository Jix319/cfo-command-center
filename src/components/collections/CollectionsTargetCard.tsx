import type { ReactElement } from 'react'
import type { CollectionsSummary } from '../../engines/collections/types'
import DashboardCard from '../layout/DashboardCard'
import StatusBadge from '../common/StatusBadge'

interface CollectionsTargetCardProps {
  summary: CollectionsSummary
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

export default function CollectionsTargetCard({
  summary,
}: CollectionsTargetCardProps): ReactElement {
  const currency = summary.todayTarget.currency

  return (
    <DashboardCard title="Today's Target">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {formatMoney(summary.todayTarget.amountMinor, currency)}
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Collected {formatMoney(summary.todayCollections.amountMinor, currency)}
          </p>
        </div>
        <StatusBadge
          variant={
            summary.todayAchievementPercentage >= 80
              ? 'success'
              : summary.todayAchievementPercentage >= 50
                ? 'warning'
                : 'error'
          }
          label={`${summary.todayAchievementPercentage.toFixed(0)}% today`}
        />
      </div>
    </DashboardCard>
  )
}
