import type { ReactElement } from 'react'
import DashboardCard from '../layout/DashboardCard'
import StatusBadge from '../common/StatusBadge'
import { CRITICAL_ALERTS } from '../../data/dashboardWidgets'

export default function CriticalAlertsWidget(): ReactElement {
  return (
    <DashboardCard title="Critical Alerts">
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {CRITICAL_ALERTS.map((alert) => (
          <div key={alert.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <div className="mt-0.5 rounded-lg bg-slate-100 p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <alert.icon aria-hidden="true" className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {alert.title}
                </p>
                <StatusBadge variant={alert.severity} label={alert.severityLabel} />
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {alert.description}
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {alert.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
