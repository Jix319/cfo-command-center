export type BankAccountType =
  | 'current'
  | 'savings'
  | 'escrow'
  | 'rera'
  | 'deposit'
  | 'loan'
  | 'other'

export interface BankAccount {
  id: string
  name: string
  accountType: BankAccountType
  legalEntityId: string
  projectId?: string
  purpose: string
  restrictions: string[]
  bankName?: string
  currency: string
}
