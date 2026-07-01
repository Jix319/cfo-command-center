import { DEMO_BANK_ACCOUNT_POSITIONS } from '../../demo/bankAccounts'
import { DEMO_CREDIT_FACILITIES } from '../../demo/borrowings'
import { DEMO_LEGAL_ENTITIES } from '../../demo/entities'
import {
  DEMO_AS_OF_DATE,
  DEMO_CURRENCY,
  DEMO_GROUP_ID,
} from '../../demo/group'
import { DEMO_PROJECTS } from '../../demo/projects'
import type { CreditFacility } from '../../domain/entities/CreditFacility'
import type { LegalEntity } from '../../domain/entities/LegalEntity'
import type { Project } from '../../domain/entities/Project'
import type {
  BankAccountPosition,
  BankFacility,
  BankFacilityType,
  BankPositionInput,
} from './types'

export const BANK_POSITION_LEGAL_ENTITIES: LegalEntity[] = DEMO_LEGAL_ENTITIES
export const BANK_POSITION_PROJECTS: Project[] = DEMO_PROJECTS

export const BANK_ACCOUNT_POSITIONS: BankAccountPosition[] =
  DEMO_BANK_ACCOUNT_POSITIONS.map((accountPosition) => ({
    account: accountPosition.account,
    purpose: accountPosition.purpose,
    balance: accountPosition.balance,
    restrictions: accountPosition.restrictions,
  }))

function mapFacilityType(
  facility: CreditFacility,
): BankFacilityType | undefined {
  if (facility.facilityType === 'overdraft') return 'OD'
  if (facility.facilityType === 'working_capital') return 'CC'
  if (facility.id.includes('dlod')) return 'DLOD'
  return undefined
}

export const BANK_FACILITIES: BankFacility[] = DEMO_CREDIT_FACILITIES.flatMap(
  (facility) => {
    const facilityType = mapFacilityType(facility)

    return facilityType === undefined
      ? []
      : [
          {
            facility,
            facilityType,
          },
        ]
  },
)

export const BANK_POSITION_SAMPLE_INPUT: BankPositionInput = {
  groupId: DEMO_GROUP_ID,
  reportingCurrency: DEMO_CURRENCY,
  asOfDate: DEMO_AS_OF_DATE,
  legalEntities: BANK_POSITION_LEGAL_ENTITIES,
  projects: BANK_POSITION_PROJECTS,
  accounts: BANK_ACCOUNT_POSITIONS,
  facilities: BANK_FACILITIES,
}
