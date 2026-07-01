import type { ReactElement } from 'react'
import type { ImportHistoryEntry, ImportStatus } from '../../imports/types'
import StatusBadge, { type StatusVariant } from '../common/StatusBadge'
import DashboardCard from '../layout/DashboardCard'

interface ImportStatusCardProps {
  latestImport?: ImportHistoryEntry
  title?: string
}

const statusVariant: Record<ImportStatus, StatusVariant> = {
  ready: 'info',
  valid: 'success',
  invalid: 'error',
  needsReview: 'warning',
}

function formatDateTime(dateIso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateIso))
}

export default function ImportStatusCard({
  latestImport,
  title = 'Import Status',
}: ImportStatusCardProps): ReactElement {
  const metrics = latestImport
    ? [
        ['Last import', formatDateTime(latestImport.importedAt)],
        ['Import type', latestImport.importLabel],
        ['Records imported', String(latestImport.recordsImported)],
        ['Validation result', latestImport.validationSummary],
      ]
    : [
        ['Last import', 'No imports yet'],
        ['Import type', '—'],
        ['Records imported', '0'],
        ['Validation result', 'Awaiting upload'],
      ]

  return (
    <DashboardCard title={title}>
      <div className="mb-4 flex justify-end">
        <StatusBadge
          variant={latestImport ? statusVariant[latestImport.status] : 'info'}
          label={latestImport ? latestImport.status : 'ready'}
        />
      </div>
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
