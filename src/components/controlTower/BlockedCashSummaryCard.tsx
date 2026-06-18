import type { ReactElement } from 'react'
import type { BlockedCashEvaluation } from '../../engines/blockedCash/types'
import DashboardCard from '../layout/DashboardCard'
import StatusBadge, { type StatusVariant } from '../common/StatusBadge'

interface BlockedCashSummaryCardProps {
  result: BlockedCashEvaluation
}

const confidenceVariants: Record<
  BlockedCashEvaluation['score']['confidence'],
  StatusVariant
> = {
  high: 'success',
  medium: 'warning',
  low: 'error',
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function BlockedCashSummaryCard({
  result,
}: BlockedCashSummaryCardProps): ReactElement {
  const recommendation =
    result.recommendations[0]?.action ?? 'No immediate action required.'

  return (
    <DashboardCard title="Blocked Cash">
      <div className="mb-4 flex justify-end">
        <StatusBadge
          variant={confidenceVariants[result.score.confidence]}
          label={`${result.score.confidence} confidence`}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Unlockable cash
          </p>
          <p className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
            {formatMoney(result.output.withdrawableAmount)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Blocked cash
          </p>
          <p className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
            {formatMoney(result.output.blockedAmount)}
          </p>
        </div>
      </div>
      <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Highest priority recommendation
        </p>
        <p className="mt-1 text-sm font-medium leading-5 text-slate-900 dark:text-slate-100">
          {recommendation}
        </p>
      </div>
    </DashboardCard>
  )
}
