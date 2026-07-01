import { DEMO_CREDIT_FACILITIES } from '../../demo/borrowings'
import { DEMO_CASH_INFLOW_FORECASTS } from '../../demo/collections'
import { DEMO_TREASURY_SCHEDULED_PAYMENTS } from '../../demo/payments'
import { bankPositionEngine } from '../bankPosition/calculator'
import { BANK_POSITION_SAMPLE_INPUT } from '../bankPosition/sampleData'
import { blockedCashEngine } from '../blockedCash/calculator'
import { PROJECT_BLOCKED_BY_BILLS } from '../blockedCash/sampleData'
import { liquidityEngine } from '../liquidity/calculator'
import { LIQUIDITY_SAMPLE_INPUT } from '../liquidity/sampleData'
import type {
  ScheduledTreasuryPayment,
  TreasuryFacilityPosition,
  TreasuryInput,
} from './types'

function money(amountMinor: number, currency: string) {
  return { amountMinor, currency }
}

function getFacilityType(
  facilityId: string,
  facilityType: (typeof DEMO_CREDIT_FACILITIES)[number]['facilityType'],
): TreasuryFacilityPosition['facilityType'] {
  if (facilityType === 'overdraft') return 'Overdraft'
  if (facilityType === 'working_capital') return 'Cash Credit'
  if (facilityId.includes('dlod')) return 'DLOD'
  return 'Term Loan'
}

export const TREASURY_SAMPLE_PAYMENTS: ScheduledTreasuryPayment[] =
  DEMO_TREASURY_SCHEDULED_PAYMENTS.map((payment) => ({
    id: payment.id,
    category: payment.category,
    dueDate: payment.dueDate,
    amount: {
      amountMinor: payment.amountMinor,
      currency: BANK_POSITION_SAMPLE_INPUT.reportingCurrency,
    },
    priority: payment.priority,
    fundingStatus: payment.fundingStatus,
  }))

export const TREASURY_SAMPLE_FACILITIES: TreasuryFacilityPosition[] =
  DEMO_CREDIT_FACILITIES.map((facility) => {
    const limit = facility.sanctionedLimit
    const utilised =
      facility.utilizedAmount ??
      money(0, BANK_POSITION_SAMPLE_INPUT.reportingCurrency)
    const available = money(
      Math.max(limit.amountMinor - utilised.amountMinor, 0),
      limit.currency,
    )
    const utilisationPercentage =
      limit.amountMinor > 0
        ? Math.round((utilised.amountMinor / limit.amountMinor) * 1000) / 10
        : 0

    return {
      id: facility.id,
      facilityType: getFacilityType(facility.id, facility.facilityType),
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
const blockedCash = blockedCashEngine.evaluate(PROJECT_BLOCKED_BY_BILLS)

export const TREASURY_SAMPLE_INPUT: TreasuryInput = {
  groupId: BANK_POSITION_SAMPLE_INPUT.groupId,
  reportingCurrency: BANK_POSITION_SAMPLE_INPUT.reportingCurrency,
  asOfDate: BANK_POSITION_SAMPLE_INPUT.asOfDate,
  bankPosition,
  liquidity,
  blockedCash,
  scheduledPayments: TREASURY_SAMPLE_PAYMENTS,
  expectedCollections: DEMO_CASH_INFLOW_FORECASTS.map((inflow) => ({
    id: inflow.id,
    legalEntityId: inflow.legalEntityId,
    projectId: 'projectId' in inflow ? inflow.projectId : undefined,
    description: inflow.description,
    expectedDate: inflow.expectedDate,
    amount: {
      amountMinor: inflow.amountMinor,
      currency: BANK_POSITION_SAMPLE_INPUT.reportingCurrency,
    },
    confidence: inflow.confidence,
  })),
  facilities: TREASURY_SAMPLE_FACILITIES,
}
