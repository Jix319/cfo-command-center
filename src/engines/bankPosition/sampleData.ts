import type { BankAccount } from '../../domain/entities/BankAccount'
import type { CreditFacility } from '../../domain/entities/CreditFacility'
import type { LegalEntity } from '../../domain/entities/LegalEntity'
import type { Project } from '../../domain/entities/Project'
import type {
  BankAccountPosition,
  BankFacility,
  BankPositionInput,
  Restriction,
} from './types'

const INR = 'INR'

export const BANK_POSITION_LEGAL_ENTITIES: LegalEntity[] = [
  {
    id: 'entity-holdco',
    groupId: 'group-aurora',
    name: 'Aurora Holdings',
    legalName: 'Aurora Holdings Private Limited',
    jurisdiction: 'India',
    functionalCurrency: INR,
    status: 'active',
  },
  {
    id: 'entity-projects',
    groupId: 'group-aurora',
    name: 'Aurora Projects',
    legalName: 'Aurora Projects Private Limited',
    jurisdiction: 'India',
    functionalCurrency: INR,
    status: 'active',
  },
]

export const BANK_POSITION_PROJECTS: Project[] = [
  {
    id: 'project-heights',
    legalEntityId: 'entity-projects',
    name: 'Aurora Heights',
    code: 'AH-01',
    status: 'active',
    location: 'Mumbai',
  },
  {
    id: 'project-greens',
    legalEntityId: 'entity-projects',
    name: 'Aurora Greens',
    code: 'AG-02',
    status: 'active',
    location: 'Pune',
  },
]

function account(
  id: string,
  name: string,
  accountType: BankAccount['accountType'],
  legalEntityId: string,
  purpose: string,
  projectId?: string,
): BankAccount {
  return {
    id,
    name,
    accountType,
    legalEntityId,
    projectId,
    purpose,
    restrictions: [],
    bankName: 'National Commercial Bank',
    currency: INR,
  }
}

const noRestriction: Restriction[] = [
  { category: 'None', description: 'No external restriction.' },
]

export const BANK_ACCOUNT_POSITIONS: BankAccountPosition[] = [
  {
    account: account(
      'account-corporate',
      'Corporate Treasury Account',
      'current',
      'entity-holdco',
      'Corporate',
    ),
    purpose: 'Corporate',
    balance: { amountMinor: 325_000_000, currency: INR },
    restrictions: noRestriction,
  },
  {
    account: account(
      'account-operating',
      'Projects Operating Account',
      'current',
      'entity-projects',
      'Operating',
    ),
    purpose: 'Operating',
    balance: { amountMinor: 118_000_000, currency: INR },
    restrictions: noRestriction,
  },
  {
    account: account(
      'account-collection-heights',
      'Aurora Heights Collection Account',
      'current',
      'entity-projects',
      'Collection',
      'project-heights',
    ),
    purpose: 'Collection',
    balance: { amountMinor: 210_000_000, currency: INR },
    restrictions: noRestriction,
  },
  {
    account: account(
      'account-rera-heights',
      'Aurora Heights RERA 70% Account',
      'rera',
      'entity-projects',
      'RERA70',
      'project-heights',
    ),
    purpose: 'RERA70',
    balance: { amountMinor: 490_000_000, currency: INR },
    restrictions: [
      {
        category: 'RERA',
        description: 'Withdrawal subject to statutory RERA conditions.',
      },
    ],
  },
  {
    account: account(
      'account-escrow-greens',
      'Aurora Greens Escrow Account',
      'escrow',
      'entity-projects',
      'Escrow',
      'project-greens',
    ),
    purpose: 'Escrow',
    balance: { amountMinor: 175_000_000, currency: INR },
    restrictions: [
      {
        category: 'LenderRestriction',
        description: 'Controlled by the project lender waterfall.',
      },
    ],
  },
  {
    account: account(
      'account-gst',
      'GST Statutory Account',
      'current',
      'entity-projects',
      'GST',
    ),
    purpose: 'GST',
    balance: { amountMinor: 42_000_000, currency: INR },
    restrictions: [
      {
        category: 'Statutory',
        description: 'Reserved for statutory tax settlement.',
      },
    ],
  },
  {
    account: account(
      'account-tra',
      'Project TRA Account',
      'current',
      'entity-projects',
      'TRA',
      'project-greens',
    ),
    purpose: 'TRA',
    balance: { amountMinor: 86_000_000, currency: INR },
    restrictions: [
      {
        category: 'BankLien',
        description: 'Subject to lender-controlled TRA mechanism.',
      },
    ],
  },
  {
    account: account(
      'account-salary',
      'Salary Disbursement Account',
      'current',
      'entity-holdco',
      'Salary',
    ),
    purpose: 'Salary',
    balance: { amountMinor: 28_000_000, currency: INR },
    restrictions: [
      {
        category: 'Internal',
        description: 'Internally reserved for payroll.',
        restrictedAmount: { amountMinor: 20_000_000, currency: INR },
      },
    ],
  },
]

function facility(
  id: string,
  legalEntityId: string,
  facilityType: CreditFacility['facilityType'],
  sanctionedLimit: number,
  utilizedAmount: number,
): CreditFacility {
  return {
    id,
    legalEntityId,
    lender: 'National Commercial Bank',
    facilityType,
    sanctionedLimit: { amountMinor: sanctionedLimit, currency: INR },
    utilizedAmount: { amountMinor: utilizedAmount, currency: INR },
    status: 'active',
  }
}

export const BANK_FACILITIES: BankFacility[] = [
  {
    facility: facility(
      'facility-od',
      'entity-holdco',
      'overdraft',
      300_000_000,
      210_000_000,
    ),
    facilityType: 'OD',
  },
  {
    facility: facility(
      'facility-cc',
      'entity-projects',
      'working_capital',
      240_000_000,
      150_000_000,
    ),
    facilityType: 'CC',
  },
  {
    facility: facility(
      'facility-dlod',
      'entity-projects',
      'term_loan',
      500_000_000,
      320_000_000,
    ),
    facilityType: 'DLOD',
  },
]

export const BANK_POSITION_SAMPLE_INPUT: BankPositionInput = {
  groupId: 'group-aurora',
  reportingCurrency: INR,
  asOfDate: '2026-06-19T09:00:00.000Z',
  legalEntities: BANK_POSITION_LEGAL_ENTITIES,
  projects: BANK_POSITION_PROJECTS,
  accounts: BANK_ACCOUNT_POSITIONS,
  facilities: BANK_FACILITIES,
}
