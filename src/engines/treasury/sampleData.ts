import {
  BANK_FACILITIES,
  BANK_POSITION_SAMPLE_INPUT,
} from '../bankPosition/sampleData'
import { bankPositionEngine } from '../bankPosition/calculator'
import { BLOCKED_CASH_SAMPLE_PROJECTS } from '../blockedCash/sampleData'
import { blockedCashEngine } from '../blockedCash/calculator'
import {
  LIQUIDITY_SAMPLE_INFLOWS,
  LIQUIDITY_SAMPLE_INPUT,
} from '../liquidity/sampleData'
import { liquidityEngine } from '../liquidity/calculator'
import type {
  ScheduledTreasuryPayment,
  TreasuryFacilityPosition,
  TreasuryInput,
} from './types'

const INR = 'INR'

function money(amountMinor: number) {
  return { amountMinor, currency: INR }
}

export const TREASURY_SAMPLE_PAYMENTS: ScheduledTreasuryPayment[] = [
  {
    id: 'treasury-payment-vendor-15',
    category: 'Vendor Run (15th)',
    dueDate: '2026-06-15T00:00:00.000Z',
    amount: money(92_000_000),
    priority: 'high',
    fundingStatus: 'funded',
  },
  {
    id: 'treasury-payment-gst',
    category: 'GST',
    dueDate: '2026-06-20T00:00:00.000Z',
    amount: money(44_000_000),
    priority: 'critical',
    fundingStatus: 'funded',
  },
  {
    id: 'treasury-payment-tds',
    category: 'TDS',
    dueDate: '2026-06-21T00:00:00.000Z',
    amount: money(18_500_000),
    priority: 'critical',
    fundingStatus: 'funded',
  },
  {
    id: 'treasury-payment-salary',
    category: 'Salary',
    dueDate: '2026-06-25T00:00:00.000Z',
    amount: money(145_000_000),
    priority: 'critical',
    fundingStatus: 'funded',
  },
  {
    id: 'treasury-payment-interest',
    category: 'Interest',
    dueDate: '2026-06-28T00:00:00.000Z',
    amount: money(38_000_000),
    priority: 'high',
    fundingStatus: 'watch',
  },
  {
    id: 'treasury-payment-emi',
    category: 'EMI',
    dueDate: '2026-06-30T00:00:00.000Z',
    amount: money(74_000_000),
    priority: 'high',
    fundingStatus: 'watch',
  },
  {
    id: 'treasury-payment-vendor-30',
    category: 'Vendor Run (30th)',
    dueDate: '2026-06-30T00:00:00.000Z',
    amount: money(126_000_000),
    priority: 'medium',
    fundingStatus: 'watch',
  },
  {
    id: 'treasury-payment-loan-repayment',
    category: 'Loan Repayment',
    dueDate: '2026-07-15T00:00:00.000Z',
    amount: money(95_000_000),
    priority: 'high',
    fundingStatus: 'watch',
  },
]

export const TREASURY_SAMPLE_FACILITIES: TreasuryFacilityPosition[] =
  BANK_FACILITIES.map((bankFacility) => {
    const limit = bankFacility.facility.sanctionedLimit
    const utilised = bankFacility.facility.utilizedAmount ?? money(0)
    const available = money(
      Math.max(limit.amountMinor - utilised.amountMinor, 0),
    )
    const utilisationPercentage =
      limit.amountMinor > 0
        ? Math.round((utilised.amountMinor / limit.amountMinor) * 1000) / 10
        : 0
    const facilityType =
      bankFacility.facilityType === 'OD'
        ? 'Overdraft'
        : bankFacility.facilityType === 'CC'
          ? 'Cash Credit'
          : 'DLOD'

    return {
      id: bankFacility.facility.id,
      facilityType,
      limit,
      utilised,
      available,
      utilisationPercentage,
      recommendation:
        utilisationPercentage > 80
          ? 'Reduce utilisation and preserve headroom.'
          : 'Keep facility available for payment timing gaps.',
    }
  })

const bankPosition = bankPositionEngine.evaluate(BANK_POSITION_SAMPLE_INPUT)
const liquidity = liquidityEngine.evaluate(LIQUIDITY_SAMPLE_INPUT)
const blockedCash = blockedCashEngine.evaluate(BLOCKED_CASH_SAMPLE_PROJECTS[1])

export const TREASURY_SAMPLE_INPUT: TreasuryInput = {
  groupId: BANK_POSITION_SAMPLE_INPUT.groupId,
  reportingCurrency: BANK_POSITION_SAMPLE_INPUT.reportingCurrency,
  asOfDate: BANK_POSITION_SAMPLE_INPUT.asOfDate,
  bankPosition,
  liquidity,
  blockedCash,
  scheduledPayments: TREASURY_SAMPLE_PAYMENTS,
  expectedCollections: LIQUIDITY_SAMPLE_INFLOWS,
  facilities: TREASURY_SAMPLE_FACILITIES,
}
