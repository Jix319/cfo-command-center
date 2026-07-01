import type { ReactElement } from 'react'
import type { ImpactMetric } from '../../engines/scenarioSimulator/types'
import DashboardCard from '../layout/DashboardCard'

interface ScenarioComparisonTableProps {
  metrics: ImpactMetric[]
  currency: string
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

function formatMetricValue(metric: ImpactMetric, value: number, currency: string): string {
  if (metric.unit === 'money') return formatMoney(value, currency)
  if (metric.unit === 'days') return `${value} days`
  if (metric.unit === 'percentage') return `${value.toFixed(1)}%`
  return `${value}/100`
}

function formatChange(metric: ImpactMetric, currency: string): string {
  const formattedValue = formatMetricValue(metric, metric.change, currency)

  if (metric.change === 0) return formattedValue
  return `${metric.change > 0 ? '+' : ''}${formattedValue}`
}

export default function ScenarioComparisonTable({
  metrics,
  currency,
}: ScenarioComparisonTableProps): ReactElement {
  return (
    <DashboardCard title="Before vs After">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-700">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <th className="py-2 pr-4 font-semibold">Metric</th>
              <th className="py-2 pr-4 text-right font-semibold">Before</th>
              <th className="py-2 pr-4 text-right font-semibold">After</th>
              <th className="py-2 text-right font-semibold">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {metrics.map((metric) => (
              <tr key={metric.key}>
                <td className="py-3 pr-4 font-medium text-slate-900 dark:text-slate-100">
                  {metric.label}
                </td>
                <td className="py-3 pr-4 text-right text-slate-500 dark:text-slate-400">
                  {formatMetricValue(metric, metric.before, currency)}
                </td>
                <td className="py-3 pr-4 text-right font-semibold text-slate-900 dark:text-slate-100">
                  {formatMetricValue(metric, metric.after, currency)}
                </td>
                <td className="py-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                  {formatChange(metric, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  )
}
