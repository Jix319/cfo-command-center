import type { ChangeEvent, ReactElement } from 'react'
import { useRef } from 'react'
import type { ImportTemplate, ImportValidationResult } from '../../imports/types'
import ActionButton from '../common/ActionButton'
import StatusBadge, { type StatusVariant } from '../common/StatusBadge'
import DashboardCard from '../layout/DashboardCard'

interface ImportCardProps {
  template: ImportTemplate
  result?: ImportValidationResult
  onUpload: (template: ImportTemplate, file: File) => void
  onDownloadTemplate: (template: ImportTemplate) => void
}

function getStatusVariant(result?: ImportValidationResult): StatusVariant {
  if (!result) return 'info'
  if (result.isValid) return 'success'
  if (result.status === 'needsReview') return 'warning'
  return 'error'
}

function getStatusLabel(result?: ImportValidationResult): string {
  if (!result) return 'Ready'
  if (result.status === 'needsReview') return 'Needs Review'
  return result.isValid ? 'Valid' : 'Invalid'
}

export default function ImportCard({
  template,
  result,
  onUpload,
  onDownloadTemplate,
}: ImportCardProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0]

    if (file) {
      onUpload(template, file)
    }

    event.target.value = ''
  }

  return (
    <DashboardCard title={template.label}>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {template.description}
          </p>
          <StatusBadge
            variant={getStatusVariant(result)}
            label={getStatusLabel(result)}
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Required columns
          </p>
          <div className="flex flex-wrap gap-2">
            {template.requiredColumns.map((column) => (
              <span
                key={column}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-200"
              >
                {column}
              </span>
            ))}
          </div>
        </div>

        {result && (
          <div className="rounded-lg border border-slate-200 p-3 text-xs dark:border-slate-700">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500 dark:text-slate-400">Records</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {result.recordsImported}
              </span>
            </div>
            <div className="mt-2 flex justify-between gap-4">
              <span className="text-slate-500 dark:text-slate-400">File</span>
              <span className="text-right font-semibold text-slate-900 dark:text-slate-100">
                {result.fileName}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <input
            ref={inputRef}
            className="hidden"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
          />
          <ActionButton
            label="Upload File"
            onClick={() => inputRef.current?.click()}
          />
          <ActionButton
            label="Download Template"
            variant="secondary"
            onClick={() => onDownloadTemplate(template)}
          />
        </div>
      </div>
    </DashboardCard>
  )
}
