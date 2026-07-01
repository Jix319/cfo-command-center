import type {
  ImportFileFormat,
  ImportTemplate,
  ParsedImportFile,
} from './types'

function escapeCsvValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replaceAll('"', '""')}"`
  }

  return value
}

function parseCsvLine(line: string): string[] {
  const values: string[] = []
  let currentValue = ''
  let isInsideQuote = false

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    const nextCharacter = line[index + 1]

    if (character === '"' && nextCharacter === '"') {
      currentValue += '"'
      index += 1
    } else if (character === '"') {
      isInsideQuote = !isInsideQuote
    } else if (character === ',' && !isInsideQuote) {
      values.push(currentValue.trim())
      currentValue = ''
    } else {
      currentValue += character
    }
  }

  values.push(currentValue.trim())
  return values
}

function getFileFormat(fileName: string): ImportFileFormat | undefined {
  const extension = fileName.split('.').pop()?.toLowerCase()

  if (extension === 'csv' || extension === 'xlsx' || extension === 'xls') {
    return extension
  }

  return undefined
}

export function createTemplateCsv(template: ImportTemplate): string {
  const columns = [...template.requiredColumns, ...template.optionalColumns]
  const header = columns.map(escapeCsvValue).join(',')
  const rows = template.sampleRows.map((row) =>
    columns.map((column) => escapeCsvValue(row[column] ?? '')).join(','),
  )

  return [header, ...rows].join('\n')
}

export function parseCsvText(fileName: string, text: string): ParsedImportFile {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const headers = lines[0] ? parseCsvLine(lines[0]) : []
  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line)

    return headers.reduce<Record<string, string>>((record, header, index) => {
      record[header] = values[index] ?? ''
      return record
    }, {})
  })

  return {
    fileName,
    format: 'csv',
    headers,
    rows,
  }
}

export async function mapUploadedFile(file: File): Promise<ParsedImportFile> {
  const format = getFileFormat(file.name)

  if (format === undefined) {
    throw new Error('Unsupported file format. Upload CSV, XLS, or XLSX files only.')
  }

  if (format !== 'csv') {
    return {
      fileName: file.name,
      format,
      headers: [],
      rows: [],
    }
  }

  return parseCsvText(file.name, await file.text())
}
