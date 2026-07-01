import type { ReactElement } from 'react'
import type { ProjectControlProject } from '../../engines/projectControl/types'
import DashboardCard from '../layout/DashboardCard'

interface ConstructionProgressCardProps {
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

export default function ConstructionProgressCard({
  project,
  currency,
}: ConstructionProgressCardProps): ReactElement {
  const metrics = [
    ['Planned Progress', `${project.construction.plannedProgressPercentage.toFixed(1)}%`],
    ['Actual Progress', `${project.construction.actualProgressPercentage.toFixed(1)}%`],
    ['Variance', `${project.construction.variancePercentage.toFixed(1)}%`],
    ['Contractor Exposure', formatMoney(project.construction.contractorExposureMinor, currency)],
    ['Pending Certifications', String(project.construction.pendingCertifications)],
  ]

  return (
    <DashboardCard title="Construction Progress">
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
