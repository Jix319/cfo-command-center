import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import type { ScenarioResult } from '../../engines/scenarioSimulator/types'
import ActionButton from '../common/ActionButton'
import StatusBadge from '../common/StatusBadge'
import DashboardCard from '../layout/DashboardCard'

interface ScenarioImpactCardProps {
  result: ScenarioResult
  currency: string
  compact?: boolean
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

function formatChange(value: number, formatter: (amount: number) => string): string {
  if (value === 0) return formatter(value)
  return `${value > 0 ? '+' : ''}${formatter(value)}`
}

export default function ScenarioImpactCard({
  result,
  currency,
  compact = false,
}: ScenarioImpactCardProps): ReactElement {
  const cashChange =
    result.after.deployableCash - result.before.deployableCash
  const runwayChange = result.after.runwayDays - result.before.runwayDays

  return (
    <DashboardCard title={compact ? 'What If Analysis' : 'Impact Summary'}>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {result.scenarioName}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {compact ? 'Best Scenario' : result.category}
            </p>
          </div>
          <StatusBadge variant="info" label={result.category} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cash Impact
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {formatChange(cashChange, (amount) => formatMoney(amount, currency))}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Runway Impact
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {formatChange(runwayChange, (amount) => `${amount} days`)}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-700">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
            Executive Insight
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
            {result.insight}
          </p>
        </div>

        {compact && (
          <Link to="/scenario-simulator" className="inline-block">
            <ActionButton label="Open Scenario Simulator" />
          </Link>
        )}
      </div>
    </DashboardCard>
  )
}
