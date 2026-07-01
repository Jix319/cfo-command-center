import { DEMO_BANK_ACCOUNT_POSITIONS } from '../../demo/bankAccounts'
import { DEMO_UNITS, DEMO_BOOKINGS } from '../../demo/bookings'
import { DEMO_CREDIT_FACILITIES } from '../../demo/borrowings'
import {
  DEMO_CASH_INFLOW_FORECASTS,
  DEMO_COLLECTION_RECOVERY_ITEMS,
} from '../../demo/collections'
import { DEMO_AS_OF_DATE, DEMO_CURRENCY } from '../../demo/group'
import { DEMO_VENDOR_INVOICES } from '../../demo/invoices'
import { DEMO_PROJECTS } from '../../demo/projects'
import { DEMO_RERA_WITHDRAWAL_POSITIONS } from '../../demo/rera'
import type { ProjectControlInput } from './types'

export const PROJECT_CONTROL_SAMPLE_INPUT: ProjectControlInput = {
  asOfDate: DEMO_AS_OF_DATE,
  currency: DEMO_CURRENCY,
  projects: DEMO_PROJECTS,
  units: DEMO_UNITS,
  bookings: DEMO_BOOKINGS,
  collectionRecoveryItems: DEMO_COLLECTION_RECOVERY_ITEMS,
  cashInflowForecasts: DEMO_CASH_INFLOW_FORECASTS,
  bankAccounts: DEMO_BANK_ACCOUNT_POSITIONS,
  creditFacilities: DEMO_CREDIT_FACILITIES,
  reraWithdrawalPositions: DEMO_RERA_WITHDRAWAL_POSITIONS,
  vendorInvoices: DEMO_VENDOR_INVOICES,
  landownerPlans: [
    {
      projectId: 'project-geeta',
      revenueSharePercentage: 18,
      releasedMinor: 42_000_000,
      pendingMinor: 18_000_000,
      nextPaymentDate: '2026-07-12T00:00:00.000Z',
    },
    {
      projectId: 'project-prakash',
      revenueSharePercentage: 22,
      releasedMinor: 58_000_000,
      pendingMinor: 44_000_000,
      nextPaymentDate: '2026-07-18T00:00:00.000Z',
    },
    {
      projectId: 'project-forest',
      revenueSharePercentage: 16,
      releasedMinor: 24_000_000,
      pendingMinor: 36_000_000,
      nextPaymentDate: '2026-07-09T00:00:00.000Z',
    },
  ],
  constructionPlans: [
    {
      projectId: 'project-geeta',
      plannedProgressPercentage: 42,
      actualProgressPercentage: 46,
      pendingCertifications: 1,
    },
    {
      projectId: 'project-prakash',
      plannedProgressPercentage: 58,
      actualProgressPercentage: 51,
      pendingCertifications: 3,
    },
    {
      projectId: 'project-forest',
      plannedProgressPercentage: 24,
      actualProgressPercentage: 19,
      pendingCertifications: 2,
    },
  ],
  inventoryPlans: [
    { projectId: 'project-geeta', totalUnits: 124, registeredUnits: 38 },
    { projectId: 'project-prakash', totalUnits: 96, registeredUnits: 42 },
    { projectId: 'project-forest', totalUnits: 142, registeredUnits: 11 },
  ],
}
