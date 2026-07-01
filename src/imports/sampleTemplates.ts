import type { ImportHistoryEntry, ImportTemplate } from './types'

export const IMPORT_TEMPLATES: ImportTemplate[] = [
  {
    importType: 'collections',
    label: 'Collections',
    description: 'Customer receipts and allocation-ready collection records.',
    requiredColumns: ['Customer', 'Project', 'Amount', 'Collection Date'],
    optionalColumns: ['Unit', 'Mode', 'Reference', 'Bank Account'],
    sampleRows: [
      {
        Customer: 'Rohan Mehta',
        Project: 'Shubhashish Geeta',
        Amount: '8500000',
        'Collection Date': '2026-07-01',
        Unit: 'A-1204',
        Mode: 'NEFT',
        Reference: 'NEFT-0701-001',
        'Bank Account': 'Geeta Collection Account',
      },
    ],
    acceptedFormats: ['csv', 'xlsx', 'xls'],
  },
  {
    importType: 'bankStatements',
    label: 'Bank Statements',
    description: 'Bank transaction lines for treasury reconciliation.',
    requiredColumns: ['Date', 'Narration', 'Debit', 'Credit', 'Balance'],
    optionalColumns: ['Account Number', 'Reference', 'Value Date'],
    sampleRows: [
      {
        Date: '2026-07-01',
        Narration: 'Customer receipt - Rohan Mehta',
        Debit: '',
        Credit: '8500000',
        Balance: '210000000',
        'Account Number': 'HDFC-001',
        Reference: 'NEFT-0701-001',
        'Value Date': '2026-07-01',
      },
    ],
    acceptedFormats: ['csv', 'xlsx', 'xls'],
  },
  {
    importType: 'vendorDues',
    label: 'Vendor Dues',
    description: 'Vendor invoice dues and payment planning inputs.',
    requiredColumns: ['Vendor', 'Invoice', 'Due Date', 'Amount'],
    optionalColumns: ['Project', 'Status', 'PO Number'],
    sampleRows: [
      {
        Vendor: 'Aravali Constructions',
        Invoice: 'ACPL/SGT/2026/061',
        'Due Date': '2026-07-15',
        Amount: '92000000',
        Project: 'Shubhashish Geeta',
        Status: 'Issued',
        'PO Number': 'SGT/CIVIL/2025/014',
      },
    ],
    acceptedFormats: ['csv', 'xlsx', 'xls'],
  },
  {
    importType: 'gst',
    label: 'GST',
    description: 'GST liability and settlement working file.',
    requiredColumns: ['GSTIN', 'Period', 'Taxable Value', 'GST Amount'],
    optionalColumns: ['Entity', 'Due Date', 'Challan Reference'],
    sampleRows: [
      {
        GSTIN: '08ABJCS1001A1Z5',
        Period: '2026-06',
        'Taxable Value': '220000000',
        'GST Amount': '44000000',
        Entity: 'Shubhashish Corporate',
        'Due Date': '2026-07-20',
        'Challan Reference': 'GST-JUL-2026',
      },
    ],
    acceptedFormats: ['csv', 'xlsx', 'xls'],
  },
  {
    importType: 'tds',
    label: 'TDS',
    description: 'TDS deduction and statutory payment working file.',
    requiredColumns: ['Vendor', 'PAN', 'Section', 'TDS Amount'],
    optionalColumns: ['Invoice', 'Deduction Date', 'Due Date'],
    sampleRows: [
      {
        Vendor: 'Aravali Constructions',
        PAN: 'AAGCA2211K',
        Section: '194C',
        'TDS Amount': '18500000',
        Invoice: 'ACPL/SGT/2026/061',
        'Deduction Date': '2026-06-30',
        'Due Date': '2026-07-21',
      },
    ],
    acceptedFormats: ['csv', 'xlsx', 'xls'],
  },
  {
    importType: 'rera',
    label: 'RERA',
    description: 'RERA balances, certificates, and withdrawal controls.',
    requiredColumns: ['Project', 'RERA Balance', 'Booked Expenses', 'Certificate Status'],
    optionalColumns: ['Requested Withdrawal', 'Approved Withdrawal', 'Pending Vendor Bills'],
    sampleRows: [
      {
        Project: 'Shubhashish Prakash',
        'RERA Balance': '632000000',
        'Booked Expenses': '274000000',
        'Certificate Status': 'Approved',
        'Requested Withdrawal': '165000000',
        'Approved Withdrawal': '165000000',
        'Pending Vendor Bills': '68500000',
      },
    ],
    acceptedFormats: ['csv', 'xlsx', 'xls'],
  },
]

export const SAMPLE_IMPORT_HISTORY: ImportHistoryEntry[] = [
  {
    id: 'sample-import-collections',
    importType: 'collections',
    importLabel: 'Collections',
    fileName: 'collections_template.csv',
    importedAt: '2026-07-01T09:00:00.000Z',
    status: 'valid',
    recordsImported: 8,
    validationSummary: 'All required columns matched.',
  },
]
