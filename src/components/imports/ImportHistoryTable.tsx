import type { ReactElement } from 'react'
import type { ImportHistoryEntry, ImportStatus } from '../../imports/types'
import StatusBadge, { type StatusVariant } from '../common/StatusBadge'
import DashboardCard from '../layout/DashboardCard'

interface ImportHistoryTableProps {
  history: ImportHistoryEntry[]
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

export default function ImportHistoryTable({
  history,
}: ImportHistoryTableProps): ReactElement {
  return (
    <DashboardCard title="Import History">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-700">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <th className="py-2 pr-4 font-semibold">Import Type</th>
              <th className="py-2 pr-4 font-semibold">File</th>
              <th className="py-2 pr-4 font-semibold">Last Import</th>
              <th className="py-2 pr-4 text-right font-semibold">Records</th>
              <th className="py-2 pr-4 font-semibold">Status</th>
              <th className="py-2 font-semibold">Validation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {history.map((entry) => (
              <tr key={entry.id}>
                <td className="py-3 pr-4 font-medium text-slate-900 dark:text-slate-100">
                  {entry.importLabel}
                </td>
                <td className="py-3 pr-4 text-slate-500 dark:text-slate-400">
                  {entry.fileName}
                </td>
                <td className="py-3 pr-4 text-slate-500 dark:text-slate-400">
                  {formatDateTime(entry.importedAt)}
                </td>
                <td className="py-3 pr-4 text-right font-semibold text-slate-900 dark:text-slate-100">
                  {entry.recordsImported}
                </td>
                <td className="py-3 pr-4">
                  <StatusBadge
                    variant={statusVariant[entry.status]}
                    label={entry.status}
                  />
                </td>
                <td className="py-3 text-slate-500 dark:text-slate-400">
                  {entry.validationSummary}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  )
}
