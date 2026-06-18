import type { ReactElement } from 'react'
import type { ScoreBand } from '../../domain/core/Score'
import type { BankPositionSummary } from '../../engines/bankPosition/types'
import DashboardCard from '../layout/DashboardCard'
import StatusBadge, { type StatusVariant } from '../common/StatusBadge'

interface BankPositionSummaryCardProps {
  summary: BankPositionSummary
  status: ScoreBand
}

const statusVariants: Record<ScoreBand, StatusVariant> = {
  excellent: 'success',
  good: 'success',
  moderate: 'warning',
  weak: 'warning',
  critical: 'error',
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

export default function BankPositionSummaryCard({
  summary,
  status,
}: BankPositionSummaryCardProps): ReactElement {
  const currency = summary.totalBankBalance.currency
  const metrics = [
    ['Total cash', summary.totalBankBalance.amountMinor],
    ['Available cash', summary.availableCash.amountMinor],
    ['Restricted cash', summary.restrictedCash.amountMinor],
    ['Borrowing capacity', summary.borrowingCapacity.amountMinor],
  ]

  return (
    <DashboardCard title="Bank Position">
      <div className="mb-4 flex justify-end">
        <StatusBadge variant={statusVariants[status]} label={status} />
      </div>
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {metrics.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
          >
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {label}
            </span>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {formatMoney(Number(value), currency)}
            </span>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
