import type { Money } from '../valueObjects/Money'

export type InvoiceStatus =
  | 'draft'
  | 'issued'
  | 'partially_paid'
  | 'paid'
  | 'overdue'
  | 'cancelled'

export interface Invoice {
  id: string
  legalEntityId: string
  vendorId?: string
  customerId?: string
  projectId?: string
  invoiceNumber: string
  invoiceDate: string
  dueDate?: string
  amount: Money
  status: InvoiceStatus
}
