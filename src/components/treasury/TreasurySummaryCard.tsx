import type { ReactElement } from 'react'
import type { TreasurySummary } from '../../engines/treasury/types'
import DashboardCard from '../layout/DashboardCard'
import StatusBadge, { type StatusVariant } from '../common/StatusBadge'

interface TreasurySummaryCardProps {
  summary: TreasurySummary
  compact?: boolean
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

function healthVariant(score: number): StatusVariant {
  if (score >= 70) return 'success'
  if (score >= 50) return 'warning'
  return 'error'
}

export default function TreasurySummaryCard({
  summary,
  compact = false,
}: TreasurySummaryCardProps): ReactElement {
  const currency = summary.deployableCash.currency
  const metrics = compact
    ? [
        ['Deployable cash', formatMoney(summary.deployableCash.amountMinor, currency)],
        [
          'Payments due this week',
          formatMoney(summary.paymentsDueThisWeek.amountMinor, currency),
        ],
        [
          'Borrowing headroom',
          formatMoney(summary.borrowingCapacity.amountMinor, currency),
        ],
        ['Treasury health', `${summary.treasuryHealthScore}/100`],
      ]
    : [
        ['Operating cash', formatMoney(summary.operatingCash.amountMinor, currency)],
        ['Restricted cash', formatMoney(summary.restrictedCash.amountMinor, currency)],
        [
          'Blocked RERA cash',
          formatMoney(summary.blockedReraCash.amountMinor, currency),
        ],
        [
          'Expected unlockable cash',
          formatMoney(summary.expectedUnlockableCash.amountMinor, currency),
        ],
      ]

  return (
    <DashboardCard title={compact ? 'Treasury Summary' : 'Treasury Health'}>
      <div className="mb-4 flex justify-end">
        <StatusBadge
          variant={healthVariant(summary.treasuryHealthScore)}
          label={`${summary.treasuryHealthScore}/100`}
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
