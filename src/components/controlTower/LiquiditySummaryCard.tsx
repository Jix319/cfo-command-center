import type { ReactElement } from 'react'
import type {
  LiquidityStatus,
  LiquiditySummary,
} from '../../engines/liquidity/types'
import DashboardCard from '../layout/DashboardCard'
import StatusBadge, { type StatusVariant } from '../common/StatusBadge'

interface LiquiditySummaryCardProps {
  summary: LiquiditySummary
}

const statusVariants: Record<LiquidityStatus, StatusVariant> = {
  Green: 'success',
  Amber: 'warning',
  Red: 'error',
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

export default function LiquiditySummaryCard({
  summary,
}: LiquiditySummaryCardProps): ReactElement {
  const currency = summary.openingCash.currency
  const metrics = [
    ['Opening cash', formatMoney(summary.openingCash.amountMinor, currency)],
    [
      'Projected closing cash',
      formatMoney(summary.projectedClosingCash.amountMinor, currency),
    ],
    ['Funding gap', formatMoney(summary.fundingGap.amountMinor, currency)],
    [
      'Cash runway',
      summary.cashRunwayDays === null
        ? 'No forecast outflow'
        : `${summary.cashRunwayDays} days`,
    ],
  ]

  return (
    <DashboardCard title="Liquidity">
      <div className="mb-4 flex justify-end">
        <StatusBadge
          variant={statusVariants[summary.liquidityStatus]}
          label={summary.liquidityStatus}
        />
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
              {value}
            </span>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
