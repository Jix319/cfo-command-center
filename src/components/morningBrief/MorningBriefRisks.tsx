import type { ReactElement } from 'react'
import type {
  MorningBriefOpportunity,
  MorningBriefRisk,
} from '../../engines/morningBrief/types'
import StatusBadge, { type StatusVariant } from '../common/StatusBadge'

interface MorningBriefRisksProps {
  title: string
  items: MorningBriefRisk[] | MorningBriefOpportunity[]
  currency: string
  mode: 'risks' | 'opportunities'
}

const priorityVariant: Record<string, StatusVariant> = {
  critical: 'error',
  high: 'error',
  medium: 'warning',
  low: 'info',
  opportunity: 'success',
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

function getAmount(
  item: MorningBriefRisk | MorningBriefOpportunity,
): number {
  return 'exposure' in item ? item.exposure : item.impact
}

export default function MorningBriefRisks({
  title,
  items,
  currency,
  mode,
}: MorningBriefRisksProps): ReactElement {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
        {items.slice(0, 3).map((item) => {
          const label = 'priority' in item ? item.priority : 'opportunity'

          return (
            <div key={item.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {item.title}
                </p>
                <StatusBadge
                  variant={priorityVariant[label]}
                  label={label}
                />
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {item.description}
              </p>
              <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {mode === 'risks' ? 'Exposure' : 'Impact'}:{' '}
                {formatMoney(getAmount(item), currency)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
