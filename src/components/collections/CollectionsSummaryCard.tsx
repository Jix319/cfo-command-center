import type { ReactElement } from 'react'
import type { CollectionsSummary } from '../../engines/collections/types'
import DashboardCard from '../layout/DashboardCard'
import StatusBadge, { type StatusVariant } from '../common/StatusBadge'

interface CollectionsSummaryCardProps {
  summary: CollectionsSummary
  compact?: boolean
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

function achievementVariant(achievement: number): StatusVariant {
  if (achievement >= 90) return 'success'
  if (achievement >= 70) return 'warning'
  return 'error'
}

export default function CollectionsSummaryCard({
  summary,
  compact = false,
}: CollectionsSummaryCardProps): ReactElement {
  const currency = summary.todayTarget.currency
  const metrics = compact
    ? [
        ['Today collected', formatMoney(summary.todayCollections.amountMinor, currency)],
        ['Today target', formatMoney(summary.todayTarget.amountMinor, currency)],
        ['Achievement', `${summary.achievementPercentage.toFixed(1)}%`],
        ['Forecast', formatMoney(summary.forecast.amountMinor, currency)],
      ]
    : [
        ['Month collected', formatMoney(summary.monthCollections.amountMinor, currency)],
        ['Month target', formatMoney(summary.monthTarget.amountMinor, currency)],
        ['Collection gap', formatMoney(summary.collectionGap.amountMinor, currency)],
        ['Recovery score', `${summary.recoveryScore}/100`],
      ]

  return (
    <DashboardCard title={compact ? 'Collections Summary' : 'Collections Performance'}>
      <div className="mb-4 flex justify-end">
        <StatusBadge
          variant={achievementVariant(summary.achievementPercentage)}
          label={`${summary.achievementPercentage.toFixed(1)}% achieved`}
        />
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {metrics.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
              {value}
            </p>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
