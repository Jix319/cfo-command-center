import type { ReactElement } from 'react'
import { useState } from 'react'
import SectionTitle from '../../components/common/SectionTitle'
import ImportCard from '../../components/imports/ImportCard'
import ImportHistoryTable from '../../components/imports/ImportHistoryTable'
import ImportStatusCard from '../../components/imports/ImportStatusCard'
import DashboardCard from '../../components/layout/DashboardCard'
import {
  IMPORT_TEMPLATES,
  SAMPLE_IMPORT_HISTORY,
} from '../../imports/sampleTemplates'
import { createTemplateCsv, mapUploadedFile } from '../../imports/mappers'
import { validateImport } from '../../imports/validators'
import type {
  ImportHistoryEntry,
  ImportTemplate,
  ImportType,
  ImportValidationResult,
} from '../../imports/types'

function getValidationSummary(result: ImportValidationResult): string {
  if (result.isValid) {
    return 'All required columns matched.'
  }

  if (result.status === 'needsReview') {
    return 'Workbook uploaded for review; CSV validation rules are ready.'
  }

  if (result.missingColumns.length > 0) {
    return `${result.missingColumns.length} required column missing.`
  }

  return `${result.issues.length} validation issue${result.issues.length === 1 ? '' : 's'}.`
}

function downloadTemplate(template: ImportTemplate): void {
  const csv = createTemplateCsv(template)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `${template.importType}-template.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function UploadPage(): ReactElement {
  const [latestResults, setLatestResults] = useState<
    Partial<Record<ImportType, ImportValidationResult>>
  >({})
  const [history, setHistory] = useState<ImportHistoryEntry[]>(
    SAMPLE_IMPORT_HISTORY,
  )
  const latestImport = history[0]
  const latestResult = latestImport
    ? latestResults[latestImport.importType]
    : undefined

  async function handleUpload(
    template: ImportTemplate,
    file: File,
  ): Promise<void> {
    const parsedFile = await mapUploadedFile(file)
    const result = validateImport(template.importType, parsedFile)
    const historyEntry: ImportHistoryEntry = {
      id: `${template.importType}-${Date.now()}`,
      importType: template.importType,
      importLabel: template.label,
      fileName: file.name,
      importedAt: result.validatedAt,
      status: result.status,
      recordsImported: result.recordsImported,
      validationSummary: getValidationSummary(result),
    }

    setLatestResults((currentResults) => ({
      ...currentResults,
      [template.importType]: result,
    }))
    setHistory((currentHistory) => [historyEntry, ...currentHistory])
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Import Centre"
        subtitle="Upload, validate, and review finance operating files before engine integration"
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <ImportStatusCard latestImport={latestImport} />
        </div>
        <div className="md:col-span-8">
          <DashboardCard title="Validation Result">
            {latestResult ? (
              <div className="space-y-3">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {latestResult.fileName}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {getValidationSummary(latestResult)}
                </p>
                {latestResult.issues.length > 0 && (
                  <ul className="space-y-2">
                    {latestResult.issues.slice(0, 5).map((issue) => (
                      <li
                        key={`${issue.field}-${issue.rowNumber ?? 'header'}`}
                        className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-200"
                      >
                        {issue.rowNumber ? `Row ${issue.rowNumber}: ` : ''}
                        {issue.message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Select an import type and upload a CSV file to run validation.
              </p>
            )}
          </DashboardCard>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {IMPORT_TEMPLATES.map((template) => (
          <ImportCard
            key={template.importType}
            template={template}
            result={latestResults[template.importType]}
            onUpload={handleUpload}
            onDownloadTemplate={downloadTemplate}
          />
        ))}
      </div>
      <ImportHistoryTable history={history} />
    </div>
  )
}
