import type { ReactElement } from 'react'
import DashboardCard from '../layout/DashboardCard'
import StatusBadge from '../common/StatusBadge'
import { RECENT_APPROVALS } from '../../data/dashboardWidgets'

export default function RecentApprovalsWidget(): ReactElement {
  return (
    <DashboardCard title="Recent Approvals">
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {RECENT_APPROVALS.map((approval) => (
          <div
            key={approval.id}
            className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-5 text-slate-900 dark:text-slate-100">
                {approval.document}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {approval.timestamp}
              </p>
            </div>
            <StatusBadge variant={approval.status} label={approval.statusLabel} />
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
