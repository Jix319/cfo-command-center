import type { Decision } from '../../domain/core/Decision'
import type { FinanceEngine } from '../../domain/core/FinanceEngine'
import type { Opportunity } from '../../domain/core/Opportunity'
import type { Recommendation } from '../../domain/core/Recommendation'
import type { Risk } from '../../domain/core/Risk'
import type { Score, ScoreBand } from '../../domain/core/Score'
import type { Money } from '../../domain/valueObjects/Money'
import {
  HIGH_BORROWING_DEPENDENCY_RATIO,
  LOW_LIQUIDITY_COVERAGE_RATIO,
  STRONG_INFLOW_COVERAGE_RATIO,
  assertCurrency,
  determineLiquidityStatus,
  getAvailableFacilityAmountMinor,
  getHorizonEndDate,
  getPlanningHorizonDays,
  isRelevantInflow,
  isRelevantObligation,
} from './rules'
import type {
  LiquidityInput,
  LiquidityResult,
  LiquiditySummary,
} from './types'

const ENGINE_ID = 'liquidity'
const ENGINE_VERSION = '1.0.0'

function money(amountMinor: number, currency: string): Money {
  return { amountMinor: Math.round(amountMinor), currency }
}

function ratio(numerator: number, denominator: number): number {
  if (denominator <= 0) {
    return numerator >= 0 ? Number.POSITIVE_INFINITY : 0
  }

  return numerator / denominator
}

function validateInput(input: LiquidityInput): void {
  const monetaryValues: Money[] = [
    input.bankPosition.availableCash,
    input.bankPosition.borrowingCapacity,
    ...input.cashBuckets.map((bucket) => bucket.amount),
    ...input.obligations.map((obligation) => obligation.amount),
    ...input.cashInflows.map((inflow) => inflow.amount),
    ...input.creditFacilities.flatMap((facility) => [
      facility.sanctionedLimit,
      ...(facility.utilizedAmount ? [facility.utilizedAmount] : []),
    ]),
  ]

  monetaryValues.forEach((value) =>
    assertCurrency(value, input.reportingCurrency),
  )
}

function scoreBand(value: number): ScoreBand {
  if (value >= 85) return 'excellent'
  if (value >= 70) return 'good'
  if (value >= 50) return 'moderate'
  if (value >= 30) return 'weak'
  return 'critical'
}

function createScore(
  coverageRatio: number,
  fundingGapMinor: number,
  projectedClosingCashMinor: number,
  borrowingDependencyRatio: number,
): Score {
  const coveragePoints = Math.min(coverageRatio / 1.5, 1) * 50
  const closingCashPoints = projectedClosingCashMinor >= 0 ? 25 : 0
  const fundingPoints = fundingGapMinor === 0 ? 15 : 0
  const dependencyPoints =
    Math.max(1 - borrowingDependencyRatio, 0) * 10
  const value = Math.round(
    coveragePoints + closingCashPoints + fundingPoints + dependencyPoints,
  )

  return {
    value,
    maximum: 100,
    band: scoreBand(value),
    trend: 'not_available',
    rationale:
      'Score combines liquidity coverage, projected closing cash, funding sufficiency, and borrowing dependency.',
  }
}

function createRisks(
  summary: LiquiditySummary,
  borrowingDependencyRatio: number,
): Risk[] {
  const risks: Risk[] = []

  if (summary.fundingGap.amountMinor > 0) {
    risks.push({
      id: 'liquidity-risk-funding-gap',
      engine: ENGINE_ID,
      title: 'Funding gap',
      description: 'Cash and available borrowing do not cover obligations in the selected horizon.',
      severity: 'critical',
      status: 'open',
      financialExposure: summary.fundingGap,
      mitigation: 'Secure funding or reschedule eligible discretionary outflows.',
      owner: 'Treasury',
      dueDate: summary.horizonEndDate,
    })
  }

  if (summary.projectedClosingCash.amountMinor < 0) {
    risks.push({
      id: 'liquidity-risk-negative-cash',
      engine: ENGINE_ID,
      title: 'Negative projected cash',
      description: 'Forecast cash outflows exceed opening cash and expected inflows.',
      severity: 'high',
      status: 'open',
      financialExposure: money(
        Math.abs(summary.projectedClosingCash.amountMinor),
        summary.projectedClosingCash.currency,
      ),
      mitigation: 'Activate available headroom and prioritize essential obligations.',
      owner: 'Treasury',
      dueDate: summary.horizonEndDate,
    })
  }

  if (borrowingDependencyRatio > HIGH_BORROWING_DEPENDENCY_RATIO) {
    risks.push({
      id: 'liquidity-risk-borrowing-dependency',
      engine: ENGINE_ID,
      title: 'High borrowing dependency',
      description: 'More than half of liquidity coverage depends on undrawn facilities.',
      severity: 'high',
      status: 'open',
      financialExposure: summary.borrowingHeadroom,
      mitigation: 'Accelerate inflows and preserve committed facility availability.',
      owner: 'CFO',
    })
  }

  if (summary.liquidityCoverageRatio < LOW_LIQUIDITY_COVERAGE_RATIO) {
    risks.push({
      id: 'liquidity-risk-low-coverage',
      engine: ENGINE_ID,
      title: 'Low liquidity coverage',
      description: 'Total liquidity resources are below obligations in the selected horizon.',
      severity: 'critical',
      status: 'open',
      financialExposure: summary.expectedOutflows,
      mitigation: 'Close the funding gap before obligations become due.',
      owner: 'CFO',
      dueDate: summary.horizonEndDate,
    })
  }

  return risks
}

function createOpportunities(
  summary: LiquiditySummary,
  inflowCoverageRatio: number,
): Opportunity[] {
  const opportunities: Opportunity[] = []
  const currency = summary.openingCash.currency

  if (
    summary.expectedInflows.amountMinor > 0 &&
    inflowCoverageRatio >= STRONG_INFLOW_COVERAGE_RATIO
  ) {
    opportunities.push({
      id: 'liquidity-opportunity-strong-inflows',
      engine: ENGINE_ID,
      title: 'Strong collection inflows',
      description: 'Expected inflows cover a substantial share of forecast obligations.',
      potentialValue: summary.expectedInflows,
      status: 'identified',
      recommendedAction: 'Protect timing and certainty of forecast inflows.',
      owner: 'Finance',
      targetDate: summary.horizonEndDate,
      dependencies: [],
    })
  }

  if (summary.borrowingHeadroom.amountMinor > 0) {
    opportunities.push({
      id: 'liquidity-opportunity-headroom',
      engine: ENGINE_ID,
      title: 'Unused borrowing capacity',
      description: 'Committed facility headroom is available during the planning horizon.',
      potentialValue: summary.borrowingHeadroom,
      status: 'identified',
      recommendedAction: 'Preserve facility availability as a liquidity buffer.',
      owner: 'Treasury',
      dependencies: [],
    })
  }

  if (
    summary.projectedClosingCash.amountMinor >
    summary.expectedOutflows.amountMinor * 0.5
  ) {
    opportunities.push({
      id: 'liquidity-opportunity-debt-reduction',
      engine: ENGINE_ID,
      title: 'Potential debt reduction',
      description: 'Projected surplus cash may support reduction of utilized borrowing.',
      potentialValue: money(
        summary.projectedClosingCash.amountMinor,
        currency,
      ),
      status: 'identified',
      recommendedAction: 'Evaluate surplus cash against facility costs and liquidity buffers.',
      owner: 'Treasury',
      dependencies: [],
    })
  }

  return opportunities
}

function createRecommendations(
  summary: LiquiditySummary,
): Recommendation[] {
  const recommendations: Recommendation[] = []

  if (
    summary.projectedClosingCash.amountMinor < 0 &&
    summary.borrowingHeadroom.amountMinor > 0
  ) {
    recommendations.push({
      id: 'liquidity-recommendation-draw-od',
      engine: ENGINE_ID,
      title: 'Draw available OD',
      description: 'Forecast cash is negative while committed headroom remains available.',
      priority: 'high',
      financialImpact: money(
        Math.min(
          Math.abs(summary.projectedClosingCash.amountMinor),
          summary.borrowingHeadroom.amountMinor,
        ),
        summary.borrowingHeadroom.currency,
      ),
      confidence: 'high',
      action: 'Draw the lowest-cost available revolving facility before the funding date.',
      owner: 'Treasury',
      dueDate: summary.horizonEndDate,
      dependencies: [],
    })
  }

  if (summary.fundingGap.amountMinor > 0) {
    recommendations.push({
      id: 'liquidity-recommendation-delay-payments',
      engine: ENGINE_ID,
      title: 'Delay discretionary payments',
      description: 'A residual funding gap remains after available borrowing.',
      priority: 'critical',
      financialImpact: summary.fundingGap,
      confidence: 'high',
      action: 'Review and defer non-critical obligations within approved policy.',
      owner: 'CFO',
      dueDate: summary.horizonEndDate,
      dependencies: [],
    })
    recommendations.push({
      id: 'liquidity-recommendation-accelerate-inflows',
      engine: ENGINE_ID,
      title: 'Accelerate collections',
      description: 'Additional inflows are required to close the projected funding gap.',
      priority: 'critical',
      financialImpact: summary.fundingGap,
      confidence: 'medium',
      action: 'Prioritize committed and probable inflows due within the horizon.',
      owner: 'Finance',
      dueDate: summary.horizonEndDate,
      dependencies: [],
    })
  }

  if (
    summary.liquidityStatus === 'Green' &&
    summary.projectedClosingCash.amountMinor >
      summary.expectedOutflows.amountMinor * 0.5
  ) {
    recommendations.push({
      id: 'liquidity-recommendation-reduce-borrowing',
      engine: ENGINE_ID,
      title: 'Reduce borrowings',
      description: 'Projected cash remains strong after forecast obligations.',
      priority: 'medium',
      financialImpact: summary.projectedClosingCash,
      confidence: 'medium',
      action: 'Evaluate repayment of high-cost utilized facilities while preserving the cash buffer.',
      owner: 'Treasury',
      dependencies: [],
    })
  }

  return recommendations
}

function createDecisions(summary: LiquiditySummary): Decision[] {
  if (summary.liquidityStatus === 'Red') {
    return [
      {
        id: 'liquidity-decision-close-gap',
        engine: ENGINE_ID,
        title: 'Close the projected funding gap',
        description: 'Liquidity resources are insufficient for the selected horizon.',
        priority: 'critical',
        financialImpact: summary.fundingGap,
        confidence: 'high',
        recommendedAction: 'Approve a funding and outflow mitigation plan immediately.',
        owner: 'CFO',
        dueDate: summary.horizonEndDate,
        dependencies: [],
      },
    ]
  }

  if (summary.liquidityStatus === 'Amber') {
    return [
      {
        id: 'liquidity-decision-protect-buffer',
        engine: ENGINE_ID,
        title: 'Protect liquidity buffer',
        description: 'Coverage is adequate but below the preferred operating threshold.',
        priority: 'high',
        financialImpact: summary.borrowingHeadroom,
        confidence: 'high',
        recommendedAction: 'Preserve headroom and closely manage inflow timing.',
        owner: 'CFO',
        dueDate: summary.horizonEndDate,
        dependencies: [],
      },
    ]
  }

  return [
    {
      id: 'liquidity-decision-maintain-plan',
      engine: ENGINE_ID,
      title: 'Maintain current liquidity plan',
      description: 'Forecast resources sufficiently cover obligations.',
      priority: 'low',
      financialImpact: summary.projectedClosingCash,
      confidence: 'high',
      recommendedAction: 'Continue monitoring forecast timing and facility availability.',
      owner: 'Treasury',
      dueDate: summary.horizonEndDate,
      dependencies: [],
    },
  ]
}

function evaluateLiquidity(input: LiquidityInput): LiquidityResult {
  validateInput(input)

  const horizonEndDate = getHorizonEndDate(
    input.asOfDate,
    input.planningHorizon,
  )
  const relevantInflows = input.cashInflows.filter((inflow) =>
    isRelevantInflow(inflow, input.asOfDate, horizonEndDate),
  )
  const relevantObligations = input.obligations.filter((obligation) =>
    isRelevantObligation(obligation, input.asOfDate, horizonEndDate),
  )
  const openingCashMinor = input.bankPosition.availableCash.amountMinor
  const expectedInflowsMinor = relevantInflows.reduce(
    (total, inflow) => total + inflow.amount.amountMinor,
    0,
  )
  const expectedOutflowsMinor = relevantObligations.reduce(
    (total, obligation) => total + obligation.amount.amountMinor,
    0,
  )
  const projectedClosingCashMinor =
    openingCashMinor + expectedInflowsMinor - expectedOutflowsMinor
  const borrowingHeadroomMinor = input.creditFacilities.reduce(
    (total, facility) => total + getAvailableFacilityAmountMinor(facility),
    0,
  )
  const totalLiquidityMinor =
    openingCashMinor + expectedInflowsMinor + borrowingHeadroomMinor
  const fundingGapMinor = Math.max(
    expectedOutflowsMinor - totalLiquidityMinor,
    0,
  )
  const liquidityCoverageRatio = ratio(
    totalLiquidityMinor,
    expectedOutflowsMinor,
  )
  const horizonDays = Math.max(
    getPlanningHorizonDays(input.planningHorizon),
    1,
  )
  const averageDailyOutflow = expectedOutflowsMinor / horizonDays
  const cashRunwayDays =
    averageDailyOutflow > 0
      ? Math.max(
          (openingCashMinor + expectedInflowsMinor) / averageDailyOutflow,
          0,
        )
      : null
  const liquidityStatus = determineLiquidityStatus(
    fundingGapMinor,
    projectedClosingCashMinor,
    liquidityCoverageRatio,
  )
  const borrowingDependencyRatio = ratio(
    Math.max(expectedOutflowsMinor - openingCashMinor - expectedInflowsMinor, 0),
    expectedOutflowsMinor,
  )
  const inflowCoverageRatio = ratio(
    expectedInflowsMinor,
    expectedOutflowsMinor,
  )
  const summary: LiquiditySummary = {
    planningHorizon: input.planningHorizon,
    horizonEndDate,
    openingCash: money(openingCashMinor, input.reportingCurrency),
    expectedInflows: money(expectedInflowsMinor, input.reportingCurrency),
    expectedOutflows: money(expectedOutflowsMinor, input.reportingCurrency),
    projectedClosingCash: money(
      projectedClosingCashMinor,
      input.reportingCurrency,
    ),
    fundingGap: money(fundingGapMinor, input.reportingCurrency),
    liquidityCoverageRatio,
    borrowingHeadroom: money(
      borrowingHeadroomMinor,
      input.reportingCurrency,
    ),
    cashRunwayDays:
      cashRunwayDays === null ? null : Math.round(cashRunwayDays * 10) / 10,
    liquidityStatus,
  }

  return {
    engine: ENGINE_ID,
    engineVersion: ENGINE_VERSION,
    evaluatedAt: input.asOfDate,
    subjectId: input.groupId,
    summary: `${liquidityStatus} liquidity status for the ${input.planningHorizon.toLowerCase()} horizon with a coverage ratio of ${Number.isFinite(liquidityCoverageRatio) ? liquidityCoverageRatio.toFixed(2) : 'unlimited'}.`,
    score: createScore(
      liquidityCoverageRatio,
      fundingGapMinor,
      projectedClosingCashMinor,
      borrowingDependencyRatio,
    ),
    risks: createRisks(summary, borrowingDependencyRatio),
    opportunities: createOpportunities(summary, inflowCoverageRatio),
    recommendations: createRecommendations(summary),
    decisions: createDecisions(summary),
    output: summary,
  }
}

export const liquidityEngine: FinanceEngine<
  LiquidityInput,
  LiquiditySummary
> = {
  id: ENGINE_ID,
  name: 'Liquidity Engine',
  version: ENGINE_VERSION,
  evaluate: evaluateLiquidity,
}

export function evaluateLiquidityPosition(
  input: LiquidityInput,
): LiquidityResult {
  return liquidityEngine.evaluate(input)
}
