import { IMPORT_TEMPLATES } from './sampleTemplates'
import type {
  ImportTemplate,
  ImportType,
  ImportValidationIssue,
  ImportValidationResult,
  ParsedImportFile,
} from './types'

function normalizeColumn(column: string): string {
  return column.trim().toLowerCase().replace(/\s+/g, ' ')
}

function findTemplate(importType: ImportType): ImportTemplate {
  const template = IMPORT_TEMPLATES.find(
    (candidate) => candidate.importType === importType,
  )

  if (!template) {
    throw new Error(`Unsupported import type: ${importType}`)
  }

  return template
}

function hasValue(row: Record<string, string>, column: string): boolean {
  const matchingKey = Object.keys(row).find(
    (key) => normalizeColumn(key) === normalizeColumn(column),
  )

  return matchingKey !== undefined && row[matchingKey].trim().length > 0
}

function validateRequiredValues(
  rows: Record<string, string>[],
  requiredColumns: string[],
): ImportValidationIssue[] {
  return rows.flatMap((row, index) =>
    requiredColumns
      .filter((column) => !hasValue(row, column))
      .map((column) => ({
        field: column,
        rowNumber: index + 2,
        message: `${column} is required.`,
      })),
  )
}

export function validateImport(
  importType: ImportType,
  parsedFile: ParsedImportFile,
): ImportValidationResult {
  const template = findTemplate(importType)
  const normalizedHeaders = parsedFile.headers.map(normalizeColumn)
  const missingColumns =
    parsedFile.format === 'csv'
      ? template.requiredColumns.filter(
          (column) => !normalizedHeaders.includes(normalizeColumn(column)),
        )
      : []
  const issues: ImportValidationIssue[] = missingColumns.map((column) => ({
    field: column,
    message: `${column} column is required.`,
  }))

  if (parsedFile.format !== 'csv') {
    issues.push({
      field: 'File',
      message:
        'Workbook uploaded. Convert this template to CSV for browser-side column validation in this workflow.',
    })
  } else {
    issues.push(
      ...validateRequiredValues(parsedFile.rows, template.requiredColumns),
    )
  }

  const isValid =
    parsedFile.format === 'csv' &&
    missingColumns.length === 0 &&
    issues.length === 0

  return {
    status: isValid
      ? 'valid'
      : parsedFile.format === 'csv'
        ? 'invalid'
        : 'needsReview',
    isValid,
    importType,
    fileName: parsedFile.fileName,
    requiredColumns: template.requiredColumns,
    missingColumns,
    recordsImported: isValid ? parsedFile.rows.length : 0,
    issues,
    validatedAt: new Date().toISOString(),
  }
}

export function getImportTemplate(importType: ImportType): ImportTemplate {
  return findTemplate(importType)
}
