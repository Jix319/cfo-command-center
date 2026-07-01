import type { ReactElement } from 'react'
import type { MorningBriefAction } from '../../engines/morningBrief/types'
import StatusBadge, { type StatusVariant } from '../common/StatusBadge'

interface MorningBriefActionsProps {
  actions: MorningBriefAction[]
  priorityAction: MorningBriefAction | null
  currency: string
}

const priorityVariant: Record<MorningBriefAction['priority'], StatusVariant> = {
  critical: 'error',
  high: 'error',
  medium: 'warning',
  low: 'info',
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

export default function MorningBriefActions({
  actions,
  priorityAction,
  currency,
}: MorningBriefActionsProps): ReactElement {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Today's Priority
        </h3>
        <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
          {priorityAction ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {priorityAction.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Owner: {priorityAction.owner ?? 'Finance'}
                  </p>
                </div>
                <StatusBadge
                  variant={priorityVariant[priorityAction.priority]}
                  label={priorityAction.priority}
                />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                Impact: {formatMoney(priorityAction.impact, currency)}
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No priority action for today.
            </p>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Today's Actions
        </h3>
        <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
        {actions.slice(0, 5).map((action) => (
          <div key={action.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {action.title}
                </p>
                {action.owner && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Owner: {action.owner}
                  </p>
                )}
              </div>
              <StatusBadge
                variant={priorityVariant[action.priority]}
                label={action.priority}
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              Impact: {formatMoney(action.impact, currency)}
            </p>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}
