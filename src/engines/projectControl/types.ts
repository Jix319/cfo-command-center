import type { Booking } from '../../domain/entities/Booking'
import type { CreditFacility } from '../../domain/entities/CreditFacility'
import type { Invoice } from '../../domain/entities/Invoice'
import type { Project } from '../../domain/entities/Project'
import type { Unit } from '../../domain/entities/Unit'
import type { DemoBankAccountPosition } from '../../demo/bankAccounts'
import type {
  DemoCashInflowForecast,
  DemoCollectionRecoveryItem,
} from '../../demo/collections'
import type { DemoReraWithdrawalPosition } from '../../demo/rera'

export type ProjectHealthStatus = 'Strong' | 'Stable' | 'Watch' | 'Risk'

export interface ProjectControlLandownerPlan {
  projectId: string
  revenueSharePercentage: number
  releasedMinor: number
  pendingMinor: number
  nextPaymentDate: string
}

export interface ProjectControlConstructionPlan {
  projectId: string
  plannedProgressPercentage: number
  actualProgressPercentage: number
  pendingCertifications: number
}

export interface ProjectControlInventoryPlan {
  projectId: string
  totalUnits: number
  registeredUnits: number
}

export interface ProjectControlInput {
  asOfDate: string
  currency: string
  projects: Project[]
  units: Unit[]
  bookings: Booking[]
  collectionRecoveryItems: DemoCollectionRecoveryItem[]
  cashInflowForecasts: DemoCashInflowForecast[]
  bankAccounts: DemoBankAccountPosition[]
  creditFacilities: CreditFacility[]
  reraWithdrawalPositions: DemoReraWithdrawalPosition[]
  vendorInvoices: Invoice[]
  landownerPlans: ProjectControlLandownerPlan[]
  constructionPlans: ProjectControlConstructionPlan[]
  inventoryPlans: ProjectControlInventoryPlan[]
}

export interface ProjectHealthView {
  projectName: string
  collectionsPercentage: number
  constructionPercentage: number
  inventorySoldPercentage: number
  cashPositionMinor: number
  overallHealth: ProjectHealthStatus
}

export interface EscrowReraView {
  escrowBalanceMinor: number
  withdrawableAmountMinor: number
  blockedAmountMinor: number
  architectCertificateStatus: string
  caCertificateStatus: string
  nextWithdrawalOpportunity: string
}

export interface LandownerView {
  revenueSharePercentage: number
  releasedMinor: number
  pendingMinor: number
  nextPaymentDate: string
  exposureMinor: number
}

export interface ConstructionView {
  plannedProgressPercentage: number
  actualProgressPercentage: number
  variancePercentage: number
  contractorExposureMinor: number
  pendingCertifications: number
}

export interface InventoryView {
  availableUnits: number
  bookedUnits: number
  registeredUnits: number
  unsoldUnits: number
  unsoldInventoryValueMinor: number
}

export interface ProjectCashFlowView {
  projectedInflowsMinor: number
  projectedOutflowsMinor: number
  fundingGapMinor: number
  runwayDays: number
  borrowingRequirementMinor: number
}

export interface ProjectControlInsight {
  id: string
  message: string
  severity: 'info' | 'warning' | 'success'
}

export interface ProjectControlProject {
  projectId: string
  projectName: string
  health: ProjectHealthView
  escrowRera: EscrowReraView
  landowner: LandownerView
  construction: ConstructionView
  inventory: InventoryView
  cashFlow: ProjectCashFlowView
  insights: ProjectControlInsight[]
}

export interface ProjectControlSummary {
  currency: string
  projects: ProjectControlProject[]
  bestProject: ProjectControlProject
  highestRiskProject: ProjectControlProject
  escrowUnlockOpportunityMinor: number
}
