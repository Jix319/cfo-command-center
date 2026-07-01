import type { Certificate } from '../domain/entities/Certificate'
import { DEMO_CURRENCY } from './group'

export type DemoReraCertificateStatus =
  | 'approved'
  | 'pending'
  | 'rejected'
  | 'not_submitted'

export interface DemoReraWithdrawalPosition {
  projectId: string
  projectName: string
  reraBalanceMinor: number
  bookedExpensesMinor: number
  pendingVendorBillsMinor: number
  architectCertificateStatus: DemoReraCertificateStatus
  caCertificateStatus: DemoReraCertificateStatus
  requestedWithdrawalMinor: number
  approvedWithdrawalMinor: number
}

export const DEMO_RERA_CERTIFICATES: Certificate[] = [
  {
    id: 'certificate-geeta-architect',
    projectId: 'project-geeta',
    certificateType: 'architect',
    status: 'approved',
    issueDate: '2026-06-25T00:00:00.000Z',
    certifiedAmount: { amountMinor: 165_000_000, currency: DEMO_CURRENCY },
    reference: 'ARCH/SGT/JUN-2026',
  },
  {
    id: 'certificate-geeta-ca',
    projectId: 'project-geeta',
    certificateType: 'chartered_accountant',
    status: 'approved',
    issueDate: '2026-06-26T00:00:00.000Z',
    certifiedAmount: { amountMinor: 165_000_000, currency: DEMO_CURRENCY },
    reference: 'CA/SGT/JUN-2026',
  },
  {
    id: 'certificate-prakash-architect',
    projectId: 'project-prakash',
    certificateType: 'architect',
    status: 'approved',
    issueDate: '2026-06-24T00:00:00.000Z',
    certifiedAmount: { amountMinor: 220_000_000, currency: DEMO_CURRENCY },
    reference: 'ARCH/SPR/JUN-2026',
  },
  {
    id: 'certificate-forest-architect',
    projectId: 'project-forest',
    certificateType: 'architect',
    status: 'submitted',
    issueDate: '2026-06-28T00:00:00.000Z',
    certifiedAmount: { amountMinor: 120_000_000, currency: DEMO_CURRENCY },
    reference: 'ARCH/SFR/JUN-2026',
  },
]

export const DEMO_RERA_WITHDRAWAL_POSITIONS: DemoReraWithdrawalPosition[] = [
  {
    projectId: 'project-geeta',
    projectName: 'Shubhashish Geeta',
    reraBalanceMinor: 485_000_000,
    bookedExpensesMinor: 187_500_000,
    pendingVendorBillsMinor: 0,
    architectCertificateStatus: 'approved',
    caCertificateStatus: 'approved',
    requestedWithdrawalMinor: 120_000_000,
    approvedWithdrawalMinor: 120_000_000,
  },
  {
    projectId: 'project-prakash',
    projectName: 'Shubhashish Prakash',
    reraBalanceMinor: 632_000_000,
    bookedExpensesMinor: 274_000_000,
    pendingVendorBillsMinor: 68_500_000,
    architectCertificateStatus: 'approved',
    caCertificateStatus: 'approved',
    requestedWithdrawalMinor: 165_000_000,
    approvedWithdrawalMinor: 165_000_000,
  },
  {
    projectId: 'project-forest',
    projectName: 'Shubhashish Forest',
    reraBalanceMinor: 358_000_000,
    bookedExpensesMinor: 141_000_000,
    pendingVendorBillsMinor: 0,
    architectCertificateStatus: 'pending',
    caCertificateStatus: 'not_submitted',
    requestedWithdrawalMinor: 95_000_000,
    approvedWithdrawalMinor: 95_000_000,
  },
]
