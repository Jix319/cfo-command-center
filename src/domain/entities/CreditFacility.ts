import type { Money } from '../valueObjects/Money'
import type { Percentage } from '../valueObjects/Percentage'

export type CreditFacilityType =
  | 'term_loan'
  | 'working_capital'
  | 'overdraft'
  | 'bank_guarantee'
  | 'letter_of_credit'
  | 'other'

export type CreditFacilityStatus = 'active' | 'inactive' | 'closed'

export interface CreditFacility {
  id: string
  legalEntityId: string
  projectId?: string
  lender: string
  facilityType: CreditFacilityType
  sanctionedLimit: Money
  utilizedAmount?: Money
  interestRate?: Percentage
  maturityDate?: string
  status: CreditFacilityStatus
}
