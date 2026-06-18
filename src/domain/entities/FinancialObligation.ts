import type { Money } from '../valueObjects/Money'

export type FinancialObligationType =
  | 'vendor_payment'
  | 'debt_service'
  | 'tax'
  | 'payroll'
  | 'statutory'
  | 'other'

export type FinancialObligationStatus =
  | 'scheduled'
  | 'due'
  | 'overdue'
  | 'settled'
  | 'cancelled'

export interface FinancialObligation {
  id: string
  legalEntityId: string
  projectId?: string
  obligationType: FinancialObligationType
  description: string
  counterpartyId?: string
  amount: Money
  dueDate: string
  status: FinancialObligationStatus
}
