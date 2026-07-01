import type { ReactElement } from 'react'
import type { ProjectControlProject } from '../../engines/projectControl/types'
import DashboardCard from '../layout/DashboardCard'

interface LandownerStatusCardProps {
  project: ProjectControlProject
  currency: string
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

function formatDate(dateIso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateIso))
}

export default function LandownerStatusCard({
  project,
  currency,
}: LandownerStatusCardProps): ReactElement {
  const metrics = [
    ['Revenue Share', `${project.landowner.revenueSharePercentage.toFixed(1)}%`],
    ['Released', formatMoney(project.landowner.releasedMinor, currency)],
    ['Pending', formatMoney(project.landowner.pendingMinor, currency)],
    ['Next Payment', formatDate(project.landowner.nextPaymentDate)],
    ['Exposure', formatMoney(project.landowner.exposureMinor, currency)],
  ]

  return (
    <DashboardCard title="Landowner Status">
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {metrics.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
          >
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {label}
            </span>
            <span className="text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
              {value}
            </span>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
