import type { CreditFacility } from '../../domain/entities/CreditFacility'
import type { FinancialObligation } from '../../domain/entities/FinancialObligation'
import { bankPositionEngine } from '../bankPosition/calculator'
import { BANK_POSITION_SAMPLE_INPUT } from '../bankPosition/sampleData'
import type { CashInflow, LiquidityInput } from './types'

const INR = 'INR'
const bankPosition = bankPositionEngine.evaluate(
  BANK_POSITION_SAMPLE_INPUT,
).output

export const LIQUIDITY_SAMPLE_OBLIGATIONS: FinancialObligation[] = [
  {
    id: 'obligation-payroll',
    legalEntityId: 'entity-holdco',
    obligationType: 'payroll',
    description: 'Monthly payroll',
    amount: { amountMinor: 145_000_000, currency: INR },
    dueDate: '2026-06-25T00:00:00.000Z',
    status: 'scheduled',
  },
  {
    id: 'obligation-debt-service',
    legalEntityId: 'entity-projects',
    obligationType: 'debt_service',
    description: 'Quarterly debt service',
    amount: { amountMinor: 260_000_000, currency: INR },
    dueDate: '2026-06-30T00:00:00.000Z',
    status: 'scheduled',
  },
  {
    id: 'obligation-tax',
    legalEntityId: 'entity-projects',
    obligationType: 'tax',
    description: 'Advance tax installment',
    amount: { amountMinor: 95_000_000, currency: INR },
    dueDate: '2026-07-15T00:00:00.000Z',
    status: 'scheduled',
  },
  {
    id: 'obligation-statutory-overdue',
    legalEntityId: 'entity-projects',
    obligationType: 'statutory',
    description: 'Overdue statutory remittance',
    amount: { amountMinor: 32_000_000, currency: INR },
    dueDate: '2026-06-17T00:00:00.000Z',
    status: 'overdue',
  },
  {
    id: 'obligation-long-term',
    legalEntityId: 'entity-projects',
    obligationType: 'other',
    description: 'Land installment',
    amount: { amountMinor: 350_000_000, currency: INR },
    dueDate: '2026-09-10T00:00:00.000Z',
    status: 'scheduled',
  },
]

export const LIQUIDITY_SAMPLE_INFLOWS: CashInflow[] = [
  {
    id: 'inflow-corporate-receipt',
    legalEntityId: 'entity-holdco',
    description: 'Committed corporate receipt',
    expectedDate: '2026-06-21T00:00:00.000Z',
    amount: { amountMinor: 180_000_000, currency: INR },
    confidence: 'committed',
  },
  {
    id: 'inflow-project-milestone',
    legalEntityId: 'entity-projects',
    projectId: 'project-heights',
    description: 'Expected milestone receipts',
    expectedDate: '2026-06-28T00:00:00.000Z',
    amount: { amountMinor: 225_000_000, currency: INR },
    confidence: 'probable',
  },
  {
    id: 'inflow-potential-sale',
    legalEntityId: 'entity-projects',
    projectId: 'project-greens',
    description: 'Potential project receipt',
    expectedDate: '2026-07-08T00:00:00.000Z',
    amount: { amountMinor: 150_000_000, currency: INR },
    confidence: 'possible',
  },
  {
    id: 'inflow-quarter-receipts',
    legalEntityId: 'entity-projects',
    description: 'Committed quarterly receipts',
    expectedDate: '2026-08-15T00:00:00.000Z',
    amount: { amountMinor: 300_000_000, currency: INR },
    confidence: 'committed',
  },
]

export const LIQUIDITY_SAMPLE_FACILITIES: CreditFacility[] =
  BANK_POSITION_SAMPLE_INPUT.facilities.map(
    (bankFacility) => bankFacility.facility,
  )

export const LIQUIDITY_SAMPLE_INPUT: LiquidityInput = {
  groupId: BANK_POSITION_SAMPLE_INPUT.groupId,
  reportingCurrency: BANK_POSITION_SAMPLE_INPUT.reportingCurrency,
  asOfDate: BANK_POSITION_SAMPLE_INPUT.asOfDate,
  planningHorizon: '30 Days',
  bankPosition,
  cashBuckets: bankPosition.cashBuckets,
  obligations: LIQUIDITY_SAMPLE_OBLIGATIONS,
  cashInflows: LIQUIDITY_SAMPLE_INFLOWS,
  creditFacilities: LIQUIDITY_SAMPLE_FACILITIES,
}
