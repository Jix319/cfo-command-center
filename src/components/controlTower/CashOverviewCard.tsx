import type { ReactElement } from 'react'
import type { Money } from '../../domain/valueObjects/Money'
import DashboardCard from '../layout/DashboardCard'

interface CashOverviewCardProps {
  netDeployableCash: Money
  immediatelyAvailableCash: Money
  projectedClosingCash: Money
  blockedCash: number
}

function formatMoney(value: Money): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: value.currency,
    maximumFractionDigits: 0,
  }).format(value.amountMinor / 100)
}

function formatRupees(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function CashOverviewCard({
  netDeployableCash,
  immediatelyAvailableCash,
  projectedClosingCash,
  blockedCash,
}: CashOverviewCardProps): ReactElement {
  const metrics = [
    ['Net deployable', formatMoney(netDeployableCash)],
    ['Immediately available', formatMoney(immediatelyAvailableCash)],
    ['30-day projected close', formatMoney(projectedClosingCash)],
    ['Blocked cash', formatRupees(blockedCash)],
  ]

  return (
    <DashboardCard title="Cash Overview">
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
