import type { ReactElement } from 'react'
import type { TreasuryRecommendation } from '../../engines/treasury/types'
import StatusBadge, { type StatusVariant } from '../common/StatusBadge'
import DashboardCard from '../layout/DashboardCard'

interface TreasuryRecommendationsCardProps {
  recommendations: TreasuryRecommendation[]
}

const priorityVariant: Record<TreasuryRecommendation['priority'], StatusVariant> = {
  critical: 'error',
  high: 'warning',
  medium: 'info',
  low: 'success',
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

export default function TreasuryRecommendationsCard({
  recommendations,
}: TreasuryRecommendationsCardProps): ReactElement {
  return (
    <DashboardCard title="Treasury Recommendations">
      <div className="space-y-3">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
          >
            <div className="mb-2 flex items-start justify-between gap-4">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {recommendation.title}
              </p>
              <StatusBadge
                variant={priorityVariant[recommendation.priority]}
                label={recommendation.priority}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {recommendation.reason}
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {formatMoney(
                recommendation.expectedImpact.amountMinor,
                recommendation.expectedImpact.currency,
              )}
            </p>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
