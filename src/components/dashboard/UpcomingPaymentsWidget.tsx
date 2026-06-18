import type { ReactElement } from 'react'
import DashboardCard from '../layout/DashboardCard'
import { UPCOMING_PAYMENTS } from '../../data/dashboardWidgets'

export default function UpcomingPaymentsWidget(): ReactElement {
  return (
    <DashboardCard title="Upcoming Payments">
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {UPCOMING_PAYMENTS.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                {payment.vendor}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Due {payment.dueDate}
              </p>
            </div>
            <p className="shrink-0 text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
              {payment.amount}
            </p>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
