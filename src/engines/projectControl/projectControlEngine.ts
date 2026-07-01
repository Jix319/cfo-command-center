import { blockedCashEngine } from '../blockedCash/calculator'
import type { ProjectWithdrawalPosition } from '../blockedCash/types'
import type {
  ConstructionView,
  EscrowReraView,
  InventoryView,
  LandownerView,
  ProjectCashFlowView,
  ProjectControlInput,
  ProjectControlInsight,
  ProjectControlProject,
  ProjectControlSummary,
  ProjectHealthStatus,
  ProjectHealthView,
} from './types'

function ratio(numerator: number, denominator: number): number {
  return denominator > 0 ? numerator / denominator : 0
}

function percentage(numerator: number, denominator: number): number {
  return Math.round(ratio(numerator, denominator) * 1000) / 10
}

function scoreToHealth(score: number): ProjectHealthStatus {
  if (score >= 80) return 'Strong'
  if (score >= 65) return 'Stable'
  if (score >= 45) return 'Watch'
  return 'Risk'
}

function toWithdrawalPosition(
  position: ProjectControlInput['reraWithdrawalPositions'][number],
): ProjectWithdrawalPosition {
  return {
    projectName: position.projectName,
    reraBalance: position.reraBalanceMinor,
    bookedExpenses: position.bookedExpensesMinor,
    pendingVendorBills: position.pendingVendorBillsMinor,
    architectCertificateStatus: position.architectCertificateStatus,
    caCertificateStatus: position.caCertificateStatus,
    requestedWithdrawal: position.requestedWithdrawalMinor,
    approvedWithdrawal: position.approvedWithdrawalMinor,
  }
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0)
}

function buildEscrowReraView(
  input: ProjectControlInput,
  projectId: string,
): EscrowReraView {
  const reraPosition = input.reraWithdrawalPositions.find(
    (position) => position.projectId === projectId,
  )
  const blockedCash = reraPosition
    ? blockedCashEngine.evaluate(toWithdrawalPosition(reraPosition)).output
    : undefined
  const projectAccounts = input.bankAccounts.filter(
    (accountPosition) => accountPosition.account.projectId === projectId,
  )
  const escrowBalanceMinor = sum(
    projectAccounts
      .filter(
        (accountPosition) =>
          accountPosition.purpose === 'Escrow' ||
          accountPosition.purpose === 'RERA70' ||
          accountPosition.purpose === 'TRA',
      )
      .map((accountPosition) => accountPosition.balance.amountMinor),
  )
  const nextWithdrawalOpportunity =
    blockedCash && blockedCash.withdrawableAmount > 0
      ? 'Withdraw approved RERA amount'
      : reraPosition?.architectCertificateStatus !== 'approved'
        ? 'Architect certificate approval'
        : reraPosition?.caCertificateStatus !== 'approved'
          ? 'CA certificate approval'
          : 'Clear pending vendor bill booking'

  return {
    escrowBalanceMinor,
    withdrawableAmountMinor: blockedCash?.withdrawableAmount ?? 0,
    blockedAmountMinor: blockedCash?.blockedAmount ?? 0,
    architectCertificateStatus:
      reraPosition?.architectCertificateStatus ?? 'not_submitted',
    caCertificateStatus: reraPosition?.caCertificateStatus ?? 'not_submitted',
    nextWithdrawalOpportunity,
  }
}

function buildInventoryView(
  input: ProjectControlInput,
  projectId: string,
): InventoryView {
  const projectUnits = input.units.filter((unit) => unit.projectId === projectId)
  const projectBookings = input.bookings.filter(
    (booking) => booking.projectId === projectId && booking.status === 'confirmed',
  )
  const inventoryPlan = input.inventoryPlans.find(
    (plan) => plan.projectId === projectId,
  )
  const totalUnits = inventoryPlan?.totalUnits ?? projectUnits.length
  const bookedUnits = projectBookings.length
  const registeredUnits = inventoryPlan?.registeredUnits ?? 0
  const unsoldUnits = Math.max(totalUnits - bookedUnits, 0)
  const averageUnitValue = ratio(
    sum(projectUnits.map((unit) => unit.saleValue?.amountMinor ?? 0)),
    projectUnits.length,
  )

  return {
    availableUnits: Math.max(totalUnits - bookedUnits, 0),
    bookedUnits,
    registeredUnits,
    unsoldUnits,
    unsoldInventoryValueMinor: Math.round(unsoldUnits * averageUnitValue),
  }
}

function buildConstructionView(
  input: ProjectControlInput,
  projectId: string,
): ConstructionView {
  const plan = input.constructionPlans.find(
    (candidate) => candidate.projectId === projectId,
  )
  const projectInvoices = input.vendorInvoices.filter(
    (invoice) => invoice.projectId === projectId && invoice.status !== 'paid',
  )
  const plannedProgressPercentage = plan?.plannedProgressPercentage ?? 0
  const actualProgressPercentage = plan?.actualProgressPercentage ?? 0

  return {
    plannedProgressPercentage,
    actualProgressPercentage,
    variancePercentage:
      Math.round((actualProgressPercentage - plannedProgressPercentage) * 10) / 10,
    contractorExposureMinor: sum(
      projectInvoices.map((invoice) => invoice.amount.amountMinor),
    ),
    pendingCertifications: plan?.pendingCertifications ?? 0,
  }
}

function buildLandownerView(
  input: ProjectControlInput,
  projectId: string,
): LandownerView {
  const plan = input.landownerPlans.find(
    (candidate) => candidate.projectId === projectId,
  )

  return {
    revenueSharePercentage: plan?.revenueSharePercentage ?? 0,
    releasedMinor: plan?.releasedMinor ?? 0,
    pendingMinor: plan?.pendingMinor ?? 0,
    nextPaymentDate: plan?.nextPaymentDate ?? input.asOfDate,
    exposureMinor: plan?.pendingMinor ?? 0,
  }
}

function buildProjectCashFlowView(
  input: ProjectControlInput,
  projectId: string,
  cashPositionMinor: number,
  landowner: LandownerView,
  construction: ConstructionView,
): ProjectCashFlowView {
  const projectedInflowsMinor = sum(
    input.cashInflowForecasts
      .filter((inflow) => 'projectId' in inflow && inflow.projectId === projectId)
      .map((inflow) => inflow.amountMinor),
  )
  const projectedOutflowsMinor =
    construction.contractorExposureMinor + landowner.pendingMinor
  const projectBorrowingMinor = sum(
    input.creditFacilities
      .filter((facility) => facility.projectId === projectId)
      .map(
        (facility) =>
          facility.sanctionedLimit.amountMinor -
          (facility.utilizedAmount?.amountMinor ?? 0),
      ),
  )
  const fundingGapMinor = Math.max(
    projectedOutflowsMinor - cashPositionMinor - projectedInflowsMinor,
    0,
  )
  const averageDailyOutflow = projectedOutflowsMinor / 30

  return {
    projectedInflowsMinor,
    projectedOutflowsMinor,
    fundingGapMinor,
    runwayDays:
      averageDailyOutflow > 0
        ? Math.round(((cashPositionMinor + projectedInflowsMinor) / averageDailyOutflow) * 10) / 10
        : 0,
    borrowingRequirementMinor: Math.max(fundingGapMinor - projectBorrowingMinor, 0),
  }
}

function buildHealthView(
  projectName: string,
  collectionsPercentage: number,
  construction: ConstructionView,
  inventory: InventoryView,
  cashPositionMinor: number,
): ProjectHealthView {
  const totalInventory = inventory.availableUnits + inventory.bookedUnits
  const inventorySoldPercentage = percentage(inventory.bookedUnits, totalInventory)
  const score = Math.round(
    Math.min(collectionsPercentage, 100) * 0.35 +
      construction.actualProgressPercentage * 0.3 +
      inventorySoldPercentage * 0.2 +
      (cashPositionMinor > 0 ? 15 : 0),
  )

  return {
    projectName,
    collectionsPercentage,
    constructionPercentage: construction.actualProgressPercentage,
    inventorySoldPercentage,
    cashPositionMinor,
    overallHealth: scoreToHealth(score),
  }
}

function buildInsights(
  project: ProjectControlProject,
  input: ProjectControlInput,
): ProjectControlInsight[] {
  const insights: ProjectControlInsight[] = []
  const nextPaymentDate = new Date(project.landowner.nextPaymentDate).getTime()
  const asOfDate = new Date(input.asOfDate).getTime()
  const daysToLandownerPayment = Math.ceil(
    (nextPaymentDate - asOfDate) / (1000 * 60 * 60 * 24),
  )

  if (
    project.health.collectionsPercentage >
    project.construction.actualProgressPercentage
  ) {
    insights.push({
      id: `${project.projectId}-collections-ahead`,
      message: 'Collections are ahead of construction progress.',
      severity: 'success',
    })
  }

  if (project.escrowRera.withdrawableAmountMinor > 0) {
    insights.push({
      id: `${project.projectId}-escrow-unlock`,
      message: `Escrow withdrawal can unlock ${project.escrowRera.withdrawableAmountMinor}.`,
      severity: 'success',
    })
  }

  if (daysToLandownerPayment >= 0 && daysToLandownerPayment <= 15) {
    insights.push({
      id: `${project.projectId}-landowner-due`,
      message: 'Landowner payment due within 15 days.',
      severity: 'warning',
    })
  }

  if (project.health.inventorySoldPercentage < 35) {
    insights.push({
      id: `${project.projectId}-inventory-absorption`,
      message: 'Inventory absorption below target.',
      severity: 'warning',
    })
  }

  return insights
}

function buildProject(
  input: ProjectControlInput,
  project: ProjectControlInput['projects'][number],
): ProjectControlProject {
  const projectCollectionItems = input.collectionRecoveryItems.filter(
    (item) => item.projectId === project.id,
  )
  const collectionsPercentage = percentage(
    sum(projectCollectionItems.map((item) => item.amountCollectedMinor)),
    sum(projectCollectionItems.map((item) => item.amountDueMinor)),
  )
  const cashPositionMinor = sum(
    input.bankAccounts
      .filter((accountPosition) => accountPosition.account.projectId === project.id)
      .map((accountPosition) => accountPosition.balance.amountMinor),
  )
  const escrowRera = buildEscrowReraView(input, project.id)
  const landowner = buildLandownerView(input, project.id)
  const construction = buildConstructionView(input, project.id)
  const inventory = buildInventoryView(input, project.id)
  const cashFlow = buildProjectCashFlowView(
    input,
    project.id,
    cashPositionMinor,
    landowner,
    construction,
  )
  const projectControlProject: ProjectControlProject = {
    projectId: project.id,
    projectName: project.name,
    health: buildHealthView(
      project.name,
      collectionsPercentage,
      construction,
      inventory,
      cashPositionMinor,
    ),
    escrowRera,
    landowner,
    construction,
    inventory,
    cashFlow,
    insights: [],
  }

  return {
    ...projectControlProject,
    insights: buildInsights(projectControlProject, input),
  }
}

function healthRank(health: ProjectHealthStatus): number {
  const ranks: Record<ProjectHealthStatus, number> = {
    Strong: 0,
    Stable: 1,
    Watch: 2,
    Risk: 3,
  }

  return ranks[health]
}

export function evaluateProjectControl(
  input: ProjectControlInput,
): ProjectControlSummary {
  const projects = input.projects.map((project) => buildProject(input, project))
  const sortedByHealth = [...projects].sort(
    (left, right) =>
      healthRank(left.health.overallHealth) -
        healthRank(right.health.overallHealth) ||
      right.health.cashPositionMinor - left.health.cashPositionMinor,
  )
  const bestProject = sortedByHealth[0]
  const highestRiskProject = [...projects].sort(
    (left, right) =>
      healthRank(right.health.overallHealth) -
        healthRank(left.health.overallHealth) ||
      right.escrowRera.blockedAmountMinor - left.escrowRera.blockedAmountMinor,
  )[0]

  if (!bestProject || !highestRiskProject) {
    throw new Error('Project Control requires at least one project.')
  }

  return {
    currency: input.currency,
    projects,
    bestProject,
    highestRiskProject,
    escrowUnlockOpportunityMinor: sum(
      projects.map((project) => project.escrowRera.withdrawableAmountMinor),
    ),
  }
}

export const projectControlEngine = {
  id: 'project-control',
  name: 'Project Control Engine',
  version: '1.0.0',
  evaluate: evaluateProjectControl,
}
