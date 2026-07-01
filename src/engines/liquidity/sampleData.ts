import type { CreditFacility } from '../../domain/entities/CreditFacility'
import type { FinancialObligation } from '../../domain/entities/FinancialObligation'
import { DEMO_CREDIT_FACILITIES } from '../../demo/borrowings'
import { DEMO_CASH_INFLOW_FORECASTS } from '../../demo/collections'
import { DEMO_FINANCIAL_OBLIGATIONS } from '../../demo/payments'
import { bankPositionEngine } from '../bankPosition/calculator'
import { BANK_POSITION_SAMPLE_INPUT } from '../bankPosition/sampleData'
import type { CashInflow, LiquidityInput } from './types'

const bankPosition = bankPositionEngine.evaluate(
  BANK_POSITION_SAMPLE_INPUT,
).output

export const LIQUIDITY_SAMPLE_OBLIGATIONS: FinancialObligation[] =
  DEMO_FINANCIAL_OBLIGATIONS

export const LIQUIDITY_SAMPLE_INFLOWS: CashInflow[] =
  DEMO_CASH_INFLOW_FORECASTS.map((inflow) => ({
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
  }))

export const LIQUIDITY_SAMPLE_FACILITIES: CreditFacility[] =
  DEMO_CREDIT_FACILITIES

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
