import type { ReactElement } from 'react'
import type { ProjectControlProject } from '../../engines/projectControl/types'
import DashboardCard from '../layout/DashboardCard'

interface ProjectCashFlowCardProps {
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

export default function ProjectCashFlowCard({
  project,
  currency,
}: ProjectCashFlowCardProps): ReactElement {
  const metrics = [
    ['Projected Inflows', formatMoney(project.cashFlow.projectedInflowsMinor, currency)],
    ['Projected Outflows', formatMoney(project.cashFlow.projectedOutflowsMinor, currency)],
    ['Funding Gap', formatMoney(project.cashFlow.fundingGapMinor, currency)],
    ['Runway', `${project.cashFlow.runwayDays} days`],
    ['Borrowing Requirement', formatMoney(project.cashFlow.borrowingRequirementMinor, currency)],
  ]

  return (
    <DashboardCard title="Project Cash Flow">
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
