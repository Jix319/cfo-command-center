import type { ReactElement } from 'react'
import type {
  ProjectControlProject,
  ProjectControlSummary,
  ProjectHealthStatus,
} from '../../engines/projectControl/types'
import StatusBadge, { type StatusVariant } from '../common/StatusBadge'
import DashboardCard from '../layout/DashboardCard'

interface ProjectHealthCardProps {
  project?: ProjectControlProject
  summary?: ProjectControlSummary
  currency?: string
  compact?: boolean
}

const healthVariant: Record<ProjectHealthStatus, StatusVariant> = {
  Strong: 'success',
  Stable: 'success',
  Watch: 'warning',
  Risk: 'error',
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

export default function ProjectHealthCard({
  project,
  summary,
  currency = 'INR',
  compact = false,
}: ProjectHealthCardProps): ReactElement {
  if (compact && summary) {
    return (
      <DashboardCard title="Project Health">
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          <div className="flex items-center justify-between gap-4 py-2.5 first:pt-0">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Best Project
            </span>
            <span className="text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
              {summary.bestProject.projectName}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 py-2.5">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Highest Risk Project
            </span>
            <span className="text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
              {summary.highestRiskProject.projectName}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 py-2.5 last:pb-0">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Escrow Unlock Opportunity
            </span>
            <span className="text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
              {formatMoney(summary.escrowUnlockOpportunityMinor, summary.currency)}
            </span>
          </div>
        </div>
      </DashboardCard>
    )
  }

  if (!project) {
    return <DashboardCard title="Project Health" />
  }

  const metrics = [
    ['Collections', `${project.health.collectionsPercentage.toFixed(1)}%`],
    ['Construction', `${project.health.constructionPercentage.toFixed(1)}%`],
    ['Inventory Sold', `${project.health.inventorySoldPercentage.toFixed(1)}%`],
    ['Cash Position', formatMoney(project.health.cashPositionMinor, currency)],
  ]

  return (
    <DashboardCard title="Project Health">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {project.projectName}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Project-level CFO command view
          </p>
        </div>
        <StatusBadge
          variant={healthVariant[project.health.overallHealth]}
          label={project.health.overallHealth}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {value}
            </p>
          </div>
        ))}
      </div>
      {project.insights.length > 0 && (
        <div className="mt-4 space-y-2">
          {project.insights.slice(0, 3).map((insight) => (
            <p
              key={insight.id}
              className="rounded-lg bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600 dark:bg-slate-700 dark:text-slate-200"
            >
              {insight.message}
            </p>
          ))}
        </div>
      )}
    </DashboardCard>
  )
}
