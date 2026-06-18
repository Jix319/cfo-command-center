import type { ReactElement } from 'react'
import type { CollectionPipelineStage } from '../../engines/collections/types'
import DashboardCard from '../layout/DashboardCard'

interface CollectionsPipelineCardProps {
  pipeline: CollectionPipelineStage[]
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amountMinor / 100)
}

export default function CollectionsPipelineCard({
  pipeline,
}: CollectionsPipelineCardProps): ReactElement {
  return (
    <DashboardCard title="Collection Pipeline">
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {pipeline.map((stage) => (
          <div
            key={stage.stage}
            className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
          >
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {stage.stage}
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {stage.caseCount} cases
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {formatMoney(stage.amount.amountMinor, stage.amount.currency)}
            </p>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
