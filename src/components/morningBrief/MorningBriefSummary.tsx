import type { ReactElement } from 'react'
import type { MorningBrief } from '../../engines/morningBrief/types'

interface MorningBriefSummaryProps {
  brief: MorningBrief
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

export default function MorningBriefSummary({
  brief,
}: MorningBriefSummaryProps): ReactElement {
  const metrics = [
    ['Finance Health', `${brief.healthScore}/100`],
    ['Collections Gap', formatMoney(brief.collectionsGap, brief.currency)],
    ['Blocked Cash', formatMoney(brief.blockedCash, brief.currency)],
    [
      'Runway Days',
      brief.runwayDays === null ? 'No forecast outflow' : `${brief.runwayDays} days`,
    ],
  ]

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="rounded-lg border border-slate-200 p-5 dark:border-slate-700 lg:col-span-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Deployable Cash
        </p>
        <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">
          {formatMoney(brief.deployableCash, brief.currency)}
        </p>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Most important available-cash view for today's decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
        {metrics.map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {label}
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700 lg:col-span-12">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Finance Health Breakdown
          </p>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Total {brief.healthScore}/100
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          {brief.healthBreakdown.map((component) => (
            <div
              key={component.label}
              className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700"
            >
              <p className="text-xs font-medium text-slate-500 dark:text-slate-300">
                {component.label}
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
                {component.score}/100
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                {component.contribution} pts · {component.weight}% weight
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
