import type { Invoice } from '../domain/entities/Invoice'
import { DEMO_CURRENCY } from './group'

export const DEMO_VENDOR_INVOICES: Invoice[] = [
  {
    id: 'invoice-geeta-civil-june',
    legalEntityId: 'entity-shubhashish-homes',
    vendorId: 'vendor-aravali-constructions',
    projectId: 'project-geeta',
    invoiceNumber: 'ACPL/SGT/2026/061',
    invoiceDate: '2026-06-20T00:00:00.000Z',
    dueDate: '2026-07-15T00:00:00.000Z',
    amount: { amountMinor: 92_000_000, currency: DEMO_CURRENCY },
    status: 'issued',
  },
  {
    id: 'invoice-prakash-mep-june',
    legalEntityId: 'entity-shubhashish-builders',
    vendorId: 'vendor-pinkcity-mep',
    projectId: 'project-prakash',
    invoiceNumber: 'PMEP/SPR/2026/044',
    invoiceDate: '2026-06-22T00:00:00.000Z',
    dueDate: '2026-07-30T00:00:00.000Z',
    amount: { amountMinor: 126_000_000, currency: DEMO_CURRENCY },
    status: 'issued',
  },
  {
    id: 'invoice-geeta-elevator-advance',
    legalEntityId: 'entity-shubhashish-homes',
    vendorId: 'vendor-jaipur-elevators',
    projectId: 'project-geeta',
    invoiceNumber: 'JEL/SGT/2026/018',
    invoiceDate: '2026-06-27T00:00:00.000Z',
    dueDate: '2026-07-22T00:00:00.000Z',
    amount: { amountMinor: 38_000_000, currency: DEMO_CURRENCY },
    status: 'issued',
  },
]
