import type { Money } from '../valueObjects/Money'

export type PaymentStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'cancelled'

export interface Payment {
  id: string
  legalEntityId: string
  vendorId?: string
  projectId?: string
  invoiceId?: string
  bankAccountId: string
  paymentDate?: string
  dueDate?: string
  amount: Money
  status: PaymentStatus
  reference?: string
}
