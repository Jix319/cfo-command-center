import type { ReactElement } from 'react'
import type { TreasuryCashForecast } from '../../engines/treasury/types'
import DashboardCard from '../layout/DashboardCard'

interface LiquidityTimelineCardProps {
  forecasts: TreasuryCashForecast[]
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

export default function LiquidityTimelineCard({
  forecasts,
}: LiquidityTimelineCardProps): ReactElement {
  return (
    <DashboardCard title="Liquidity Timeline">
      <div className="space-y-4">
        {forecasts.map((forecast) => (
          <div key={forecast.horizon} className="flex items-center gap-4">
            <div className="w-20 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {forecast.horizon}
            </div>
            <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-700">
              <div
                className="h-2 rounded-full bg-slate-700 dark:bg-slate-300"
                style={{
                  width: `${Math.min(
                    Math.max(
                      (forecast.projectedCash.amountMinor /
                        Math.max(
                          forecast.openingCash.amountMinor +
                            forecast.borrowingAvailability.amountMinor,
                          1,
                        )) *
                        100,
                      8,
                    ),
                    100,
                  )}%`,
                }}
              />
            </div>
            <div className="w-36 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
              {formatMoney(
                forecast.projectedCash.amountMinor,
                forecast.projectedCash.currency,
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
