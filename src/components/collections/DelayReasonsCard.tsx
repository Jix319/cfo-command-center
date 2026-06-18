import type { ReactElement } from 'react'
import type { DelayReasonSummary } from '../../engines/collections/types'
import DashboardCard from '../layout/DashboardCard'

interface DelayReasonsCardProps {
  delayReasons: DelayReasonSummary[]
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amountMinor / 100)
}

export default function DelayReasonsCard({
  delayReasons,
}: DelayReasonsCardProps): ReactElement {
  return (
    <DashboardCard title="Delay Reasons">
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {delayReasons.map((delay) => (
          <div
            key={delay.reason}
            className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
          >
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {delay.reason}
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {delay.caseCount} cases
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {formatMoney(delay.amount.amountMinor, delay.amount.currency)}
            </p>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
