import type { ReactElement, ReactNode } from 'react'
import type { MorningBrief } from '../../engines/morningBrief/types'
import DashboardCard from '../layout/DashboardCard'
import StatusBadge, { type StatusVariant } from '../common/StatusBadge'

interface MorningBriefCardProps {
  brief: MorningBrief
  children: ReactNode
}

function healthVariant(score: number): StatusVariant {
  if (score >= 70) return 'success'
  if (score >= 50) return 'warning'
  return 'error'
}

function formatDateTime(dateIso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateIso))
}

export default function MorningBriefCard({
  brief,
  children,
}: MorningBriefCardProps): ReactElement {
  return (
    <DashboardCard title="Good Morning">
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              CFO Morning Brief
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Generated {formatDateTime(brief.generatedAt)}
            </p>
          </div>
          <StatusBadge
            variant={healthVariant(brief.healthScore)}
            label={`Finance Health ${brief.healthScore}/100`}
          />
        </div>
        {children}
      </div>
    </DashboardCard>
  )
}
