import type { BankAccount } from '../../domain/entities/BankAccount'
import type { CreditFacility } from '../../domain/entities/CreditFacility'
import type { LegalEntity } from '../../domain/entities/LegalEntity'
import type { Project } from '../../domain/entities/Project'
import type { FinanceResult } from '../../domain/core/FinanceResult'
import type { Money } from '../../domain/valueObjects/Money'

export type AccountPurpose =
  | 'Collection'
  | 'Escrow'
  | 'RERA70'
  | 'Operating'
  | 'Corporate'
  | 'Salary'
  | 'GST'
  | 'OD'
  | 'CC'
  | 'DLOD'
  | 'TRA'
  | 'TermLoan'
  | 'Other'

export type RestrictionCategory =
  | 'None'
  | 'RERA'
  | 'BankLien'
  | 'LenderRestriction'
  | 'Statutory'
  | 'Internal'
  | 'Legal'

export interface Restriction {
  category: RestrictionCategory
  description: string
  restrictedAmount?: Money
  reviewDate?: string
}

export interface BankAccountPosition {
  account: BankAccount
  purpose: AccountPurpose
  balance: Money
  restrictions: Restriction[]
}

export type BankFacilityType = 'OD' | 'CC' | 'DLOD'

export interface BankFacility {
  facility: CreditFacility
  facilityType: BankFacilityType
}

export type CashBucketType =
  | 'Operating Cash'
  | 'Restricted Cash'
  | 'Escrow Cash'
  | 'Borrowed Funds'
  | 'Collection Accounts'

export interface CashBucket {
  type: CashBucketType
  amount: Money
  accountIds: string[]
}

export interface BankPositionInput {
  groupId: string
  reportingCurrency: string
  asOfDate: string
  legalEntities: LegalEntity[]
  projects: Project[]
  accounts: BankAccountPosition[]
  facilities: BankFacility[]
}

export interface BankPositionMetadata {
  groupId: string
  reportingCurrency: string
  asOfDate: string
  legalEntityCount: number
  projectCount: number
  accountCount: number
  facilityCount: number
}

export interface BankPositionSummary {
  totalBankBalance: Money
  availableCash: Money
  restrictedCash: Money
  borrowingCapacity: Money
  odAvailable: Money
  ccAvailable: Money
  dlodAvailable: Money
  netDeployableCash: Money
  cashBuckets: CashBucket[]
  availableCashRatio: number
  restrictedCashRatio: number
  odUtilizationRatio: number
  metadata: BankPositionMetadata
}

export type BankPositionResult = FinanceResult<BankPositionSummary>
