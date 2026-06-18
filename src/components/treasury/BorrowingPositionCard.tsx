import type { ReactElement } from 'react'
import type { TreasuryFacilityPosition } from '../../engines/treasury/types'
import DashboardCard from '../layout/DashboardCard'

interface BorrowingPositionCardProps {
  facilities: TreasuryFacilityPosition[]
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

export default function BorrowingPositionCard({
  facilities,
}: BorrowingPositionCardProps): ReactElement {
  return (
    <DashboardCard title="Borrowing Position">
      <div className="space-y-4">
        {facilities.map((facility) => (
          <div
            key={facility.id}
            className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {facility.facilityType}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {facility.recommendation}
                </p>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {facility.utilisationPercentage.toFixed(1)}%
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-slate-500 dark:text-slate-400">Limit</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {formatMoney(facility.limit.amountMinor, facility.limit.currency)}
                </p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Utilised</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {formatMoney(
                    facility.utilised.amountMinor,
                    facility.utilised.currency,
                  )}
                </p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Available</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {formatMoney(
                    facility.available.amountMinor,
                    facility.available.currency,
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
