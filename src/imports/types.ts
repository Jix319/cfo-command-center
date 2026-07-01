export type ImportType =
  | 'collections'
  | 'bankStatements'
  | 'vendorDues'
  | 'gst'
  | 'tds'
  | 'rera'

export type ImportStatus =
  | 'ready'
  | 'valid'
  | 'invalid'
  | 'needsReview'

export type ImportFileFormat = 'csv' | 'xlsx' | 'xls'

export interface ImportTemplate {
  importType: ImportType
  label: string
  description: string
  requiredColumns: string[]
  optionalColumns: string[]
  sampleRows: Record<string, string>[]
  acceptedFormats: ImportFileFormat[]
}

export interface ImportValidationIssue {
  field: string
  message: string
  rowNumber?: number
}

export interface ImportValidationResult {
  status: ImportStatus
  isValid: boolean
  importType: ImportType
  fileName?: string
  requiredColumns: string[]
  missingColumns: string[]
  recordsImported: number
  issues: ImportValidationIssue[]
  validatedAt: string
}

export interface ParsedImportFile {
  fileName: string
  format: ImportFileFormat
  headers: string[]
  rows: Record<string, string>[]
}

export interface ImportHistoryEntry {
  id: string
  importType: ImportType
  importLabel: string
  fileName: string
  importedAt: string
  status: ImportStatus
  recordsImported: number
  validationSummary: string
}
