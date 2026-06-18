import type { ReactElement } from 'react'
import type { Opportunity } from '../../domain/core/Opportunity'
import DashboardCard from '../layout/DashboardCard'
import StatusBadge from '../common/StatusBadge'

interface OpportunityListProps {
  opportunities: Opportunity[]
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

export default function OpportunityList({
  opportunities,
}: OpportunityListProps): ReactElement {
  return (
    <DashboardCard title="Top Opportunities">
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {opportunities.slice(0, 5).map((opportunity) => (
          <div key={opportunity.id} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {opportunity.title}
              </p>
              <StatusBadge variant="success" label={opportunity.status} />
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {opportunity.description}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-300">
              {formatMoney(
                opportunity.potentialValue.amountMinor,
                opportunity.potentialValue.currency,
              )}
            </p>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
