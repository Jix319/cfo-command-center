import type { BankAccount } from '../domain/entities/BankAccount'
import type { Money } from '../domain/valueObjects/Money'
import type {
  AccountPurpose,
  RestrictionCategory,
} from '../engines/bankPosition/types'
import { DEMO_CURRENCY } from './group'

export interface DemoBankAccountPosition {
  account: BankAccount
  purpose: AccountPurpose
  balance: Money
  restrictions: {
    category: RestrictionCategory
    description: string
    restrictedAmount?: Money
    reviewDate?: string
  }[]
}

function bankAccount(
  id: string,
  name: string,
  accountType: BankAccount['accountType'],
  legalEntityId: string,
  purpose: AccountPurpose,
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
    bankName: 'HDFC Bank',
    currency: DEMO_CURRENCY,
  }
}

export const DEMO_BANK_ACCOUNT_POSITIONS: DemoBankAccountPosition[] = [
  {
    account: bankAccount(
      'account-corporate',
      'House of Shubhashish Corporate Treasury',
      'current',
      'entity-shubhashish-corporate',
      'Corporate',
    ),
    purpose: 'Corporate',
    balance: { amountMinor: 325_000_000, currency: DEMO_CURRENCY },
    restrictions: [{ category: 'None', description: 'No external restriction.' }],
  },
  {
    account: bankAccount(
      'account-operating',
      'Group Operating Account',
      'current',
      'entity-shubhashish-corporate',
      'Operating',
    ),
    purpose: 'Operating',
    balance: { amountMinor: 118_000_000, currency: DEMO_CURRENCY },
    restrictions: [{ category: 'None', description: 'No external restriction.' }],
  },
  {
    account: bankAccount(
      'account-geeta-collection',
      'Shubhashish Geeta Collection Account',
      'current',
      'entity-shubhashish-homes',
      'Collection',
      'project-geeta',
    ),
    purpose: 'Collection',
    balance: { amountMinor: 210_000_000, currency: DEMO_CURRENCY },
    restrictions: [{ category: 'None', description: 'No external restriction.' }],
  },
  {
    account: bankAccount(
      'account-geeta-rera-70',
      'Shubhashish Geeta RERA 70% Account',
      'rera',
      'entity-shubhashish-homes',
      'RERA70',
      'project-geeta',
    ),
    purpose: 'RERA70',
    balance: { amountMinor: 490_000_000, currency: DEMO_CURRENCY },
    restrictions: [
      {
        category: 'RERA',
        description: 'Withdrawal subject to statutory RERA conditions.',
      },
    ],
  },
  {
    account: bankAccount(
      'account-prakash-escrow',
      'Shubhashish Prakash Lender Escrow',
      'escrow',
      'entity-shubhashish-builders',
      'Escrow',
      'project-prakash',
    ),
    purpose: 'Escrow',
    balance: { amountMinor: 175_000_000, currency: DEMO_CURRENCY },
    restrictions: [
      {
        category: 'LenderRestriction',
        description: 'Controlled by the lender waterfall.',
      },
    ],
  },
  {
    account: bankAccount(
      'account-gst',
      'Group GST Statutory Account',
      'current',
      'entity-shubhashish-corporate',
      'GST',
    ),
    purpose: 'GST',
    balance: { amountMinor: 42_000_000, currency: DEMO_CURRENCY },
    restrictions: [
      {
        category: 'Statutory',
        description: 'Reserved for GST settlement.',
      },
    ],
  },
  {
    account: bankAccount(
      'account-prakash-tra',
      'Shubhashish Prakash TRA Account',
      'current',
      'entity-shubhashish-builders',
      'TRA',
      'project-prakash',
    ),
    purpose: 'TRA',
    balance: { amountMinor: 86_000_000, currency: DEMO_CURRENCY },
    restrictions: [
      {
        category: 'BankLien',
        description: 'Subject to lender-controlled TRA mechanism.',
      },
    ],
  },
  {
    account: bankAccount(
      'account-salary',
      'Group Salary Disbursement Account',
      'current',
      'entity-shubhashish-corporate',
      'Salary',
    ),
    purpose: 'Salary',
    balance: { amountMinor: 28_000_000, currency: DEMO_CURRENCY },
    restrictions: [
      {
        category: 'Internal',
        description: 'Internally reserved for payroll.',
        restrictedAmount: { amountMinor: 20_000_000, currency: DEMO_CURRENCY },
      },
    ],
  },
  {
    account: bankAccount(
      'account-forest-collection',
      'Shubhashish Forest Collection Account',
      'current',
      'entity-shubhashish-estates',
      'Collection',
      'project-forest',
    ),
    purpose: 'Collection',
    balance: { amountMinor: 64_000_000, currency: DEMO_CURRENCY },
    restrictions: [{ category: 'None', description: 'No external restriction.' }],
  },
]
