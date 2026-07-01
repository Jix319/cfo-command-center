import type { FinancialObligation } from '../domain/entities/FinancialObligation'
import type { Payment } from '../domain/entities/Payment'
import type { TreasuryPaymentCategory } from '../engines/treasury/types'
import { DEMO_CURRENCY } from './group'

export interface DemoTreasuryPaymentSchedule {
  id: string
  category: TreasuryPaymentCategory
  dueDate: string
  amountMinor: number
  priority: 'critical' | 'high' | 'medium' | 'low'
  fundingStatus: 'funded' | 'watch' | 'gap'
}

export const DEMO_PAYMENTS: Payment[] = [
  {
    id: 'payment-gst-july',
    legalEntityId: 'entity-shubhashish-corporate',
    bankAccountId: 'account-gst',
    dueDate: '2026-07-20T00:00:00.000Z',
    amount: { amountMinor: 44_000_000, currency: DEMO_CURRENCY },
    status: 'approved',
    reference: 'GST-JUL-2026',
  },
  {
    id: 'payment-salary-july',
    legalEntityId: 'entity-shubhashish-corporate',
    bankAccountId: 'account-salary',
    dueDate: '2026-07-25T00:00:00.000Z',
    amount: { amountMinor: 145_000_000, currency: DEMO_CURRENCY },
    status: 'pending_approval',
    reference: 'PAYROLL-JUL-2026',
  },
]

export const DEMO_FINANCIAL_OBLIGATIONS: FinancialObligation[] = [
  {
    id: 'obligation-vendor-run-15',
    legalEntityId: 'entity-shubhashish-homes',
    projectId: 'project-geeta',
    obligationType: 'vendor_payment',
    description: 'Vendor run - 15th cycle',
    counterpartyId: 'vendor-aravali-constructions',
    amount: { amountMinor: 92_000_000, currency: DEMO_CURRENCY },
    dueDate: '2026-07-15T00:00:00.000Z',
    status: 'scheduled',
  },
  {
    id: 'obligation-payroll',
    legalEntityId: 'entity-shubhashish-corporate',
    obligationType: 'payroll',
    description: 'Monthly payroll',
    amount: { amountMinor: 145_000_000, currency: DEMO_CURRENCY },
    dueDate: '2026-07-25T00:00:00.000Z',
    status: 'scheduled',
  },
  {
    id: 'obligation-debt-service',
    legalEntityId: 'entity-shubhashish-builders',
    projectId: 'project-prakash',
    obligationType: 'debt_service',
    description: 'Quarterly debt service',
    amount: { amountMinor: 260_000_000, currency: DEMO_CURRENCY },
    dueDate: '2026-07-30T00:00:00.000Z',
    status: 'scheduled',
  },
  {
    id: 'obligation-tax',
    legalEntityId: 'entity-shubhashish-corporate',
    obligationType: 'tax',
    description: 'Advance tax installment',
    amount: { amountMinor: 95_000_000, currency: DEMO_CURRENCY },
    dueDate: '2026-07-15T00:00:00.000Z',
    status: 'scheduled',
  },
  {
    id: 'obligation-statutory-overdue',
    legalEntityId: 'entity-shubhashish-corporate',
    obligationType: 'statutory',
    description: 'Overdue statutory remittance',
    amount: { amountMinor: 32_000_000, currency: DEMO_CURRENCY },
    dueDate: '2026-06-29T00:00:00.000Z',
    status: 'overdue',
  },
  {
    id: 'obligation-land-installment',
    legalEntityId: 'entity-shubhashish-estates',
    projectId: 'project-forest',
    obligationType: 'other',
    description: 'Land installment',
    amount: { amountMinor: 350_000_000, currency: DEMO_CURRENCY },
    dueDate: '2026-09-10T00:00:00.000Z',
    status: 'scheduled',
  },
]

export const DEMO_TREASURY_SCHEDULED_PAYMENTS: DemoTreasuryPaymentSchedule[] = [
  {
    id: 'treasury-payment-vendor-15',
    category: 'Vendor Run (15th)',
    dueDate: '2026-07-15T00:00:00.000Z',
    amountMinor: 92_000_000,
    priority: 'high',
    fundingStatus: 'funded',
  },
  {
    id: 'treasury-payment-gst',
    category: 'GST',
    dueDate: '2026-07-20T00:00:00.000Z',
    amountMinor: 44_000_000,
    priority: 'critical',
    fundingStatus: 'funded',
  },
  {
    id: 'treasury-payment-tds',
    category: 'TDS',
    dueDate: '2026-07-21T00:00:00.000Z',
    amountMinor: 18_500_000,
    priority: 'critical',
    fundingStatus: 'funded',
  },
  {
    id: 'treasury-payment-salary',
    category: 'Salary',
    dueDate: '2026-07-25T00:00:00.000Z',
    amountMinor: 145_000_000,
    priority: 'critical',
    fundingStatus: 'funded',
  },
  {
    id: 'treasury-payment-interest',
    category: 'Interest',
    dueDate: '2026-07-28T00:00:00.000Z',
    amountMinor: 38_000_000,
    priority: 'high',
    fundingStatus: 'watch',
  },
  {
    id: 'treasury-payment-emi',
    category: 'EMI',
    dueDate: '2026-07-30T00:00:00.000Z',
    amountMinor: 74_000_000,
    priority: 'high',
    fundingStatus: 'watch',
  },
  {
    id: 'treasury-payment-vendor-30',
    category: 'Vendor Run (30th)',
    dueDate: '2026-07-30T00:00:00.000Z',
    amountMinor: 126_000_000,
    priority: 'medium',
    fundingStatus: 'watch',
  },
  {
    id: 'treasury-payment-loan-repayment',
    category: 'Loan Repayment',
    dueDate: '2026-07-31T00:00:00.000Z',
    amountMinor: 95_000_000,
    priority: 'high',
    fundingStatus: 'watch',
  },
]
