import type { ReactElement } from 'react'
import type { TreasuryCashForecast } from '../../engines/treasury/types'
import DashboardCard from '../layout/DashboardCard'

interface CashForecastCardProps {
  forecasts: TreasuryCashForecast[]
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

export default function CashForecastCard({
  forecasts,
}: CashForecastCardProps): ReactElement {
  return (
    <DashboardCard title="Cash Forecast">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {forecasts.map((forecast) => (
          <div
            key={forecast.horizon}
            className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {forecast.horizon}
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {formatMoney(
                forecast.projectedCash.amountMinor,
                forecast.projectedCash.currency,
              )}
            </p>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">Collections</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {formatMoney(
                    forecast.expectedCollections.amountMinor,
                    forecast.expectedCollections.currency,
                  )}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">Payments</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {formatMoney(
                    forecast.scheduledPayments.amountMinor,
                    forecast.scheduledPayments.currency,
                  )}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">Gap</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {formatMoney(
                    forecast.fundingGap.amountMinor,
                    forecast.fundingGap.currency,
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
