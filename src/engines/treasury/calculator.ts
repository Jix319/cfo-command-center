import type { Decision } from '../../domain/core/Decision'
import type { FinanceEngine } from '../../domain/core/FinanceEngine'
import type { Opportunity } from '../../domain/core/Opportunity'
import type { Recommendation } from '../../domain/core/Recommendation'
import type { Risk } from '../../domain/core/Risk'
import type { Score, ScoreBand } from '../../domain/core/Score'
import type { Money } from '../../domain/valueObjects/Money'
import type {
  TreasuryCashForecast,
  TreasuryForecastHorizon,
  TreasuryInput,
  TreasuryRecommendation,
  TreasuryResult,
  TreasurySummary,
} from './types'

const ENGINE_ID = 'treasury'
const ENGINE_VERSION = '1.0.0'

function money(amountMinor: number, currency: string): Money {
  return { amountMinor: Math.round(amountMinor), currency }
}

function addDays(dateIso: string, days: number): string {
  const date = new Date(dateIso)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString()
}

function isWithinDateRange(dateIso: string, startIso: string, endIso: string): boolean {
  const time = new Date(dateIso).getTime()
  return time >= new Date(startIso).getTime() && time <= new Date(endIso).getTime()
}

function sumMoney(values: Money[], currency: string): Money {
  return money(
    values.reduce((total, value) => total + value.amountMinor, 0),
    currency,
  )
}

function getHorizonDays(horizon: TreasuryForecastHorizon): number {
  if (horizon === 'Today') return 0
  if (horizon === '7 Days') return 7
  if (horizon === '15 Days') return 15
  return 30
}

function getScoreBand(value: number): ScoreBand {
  if (value >= 85) return 'excellent'
  if (value >= 70) return 'good'
  if (value >= 50) return 'moderate'
  if (value >= 30) return 'weak'
  return 'critical'
}

function buildCashForecast(input: TreasuryInput): TreasuryCashForecast[] {
  const horizons: TreasuryForecastHorizon[] = ['Today', '7 Days', '15 Days', '30 Days']
  const openingCash = input.bankPosition.output.availableCash
  const borrowingAvailability = input.bankPosition.output.borrowingCapacity
  const blockedCash = money(
    input.blockedCash.output.blockedAmount,
    input.reportingCurrency,
  )

  return horizons.map((horizon) => {
    const endDate = addDays(input.asOfDate, getHorizonDays(horizon))
    const expectedCollections = sumMoney(
      input.expectedCollections
        .filter((collection) =>
          isWithinDateRange(collection.expectedDate, input.asOfDate, endDate),
        )
        .map((collection) => collection.amount),
      input.reportingCurrency,
    )
    const scheduledPayments = sumMoney(
      input.scheduledPayments
        .filter((payment) =>
          isWithinDateRange(payment.dueDate, input.asOfDate, endDate),
        )
        .map((payment) => payment.amount),
      input.reportingCurrency,
    )
    const projectedCashMinor =
      openingCash.amountMinor +
      expectedCollections.amountMinor -
      scheduledPayments.amountMinor
    const fundingGapMinor = Math.max(
      scheduledPayments.amountMinor -
        openingCash.amountMinor -
        expectedCollections.amountMinor -
        borrowingAvailability.amountMinor,
      0,
    )

    return {
      horizon,
      openingCash,
      expectedCollections,
      scheduledPayments,
      borrowingAvailability,
      blockedCash,
      projectedCash: money(projectedCashMinor, input.reportingCurrency),
      fundingGap: money(fundingGapMinor, input.reportingCurrency),
    }
  })
}

function buildOperationalRecommendations(
  input: TreasuryInput,
  summary: Omit<TreasurySummary, 'treasuryRecommendations'>,
): TreasuryRecommendation[] {
  const recommendations: TreasuryRecommendation[] = []

  if (summary.fundingGap.amountMinor > 0) {
    recommendations.push({
      id: 'treasury-action-delay-discretionary-payments',
      priority: 'critical',
      title: 'Delay discretionary payments',
      reason: 'A 30-day funding gap remains after available borrowing.',
      expectedImpact: summary.fundingGap,
    })
  }

  if (summary.availableOd.amountMinor > 0 && summary.fundingGap.amountMinor > 0) {
    recommendations.push({
      id: 'treasury-action-draw-od',
      priority: 'high',
      title: 'Draw OD',
      reason: 'OD headroom is available for near-term payment timing gaps.',
      expectedImpact: summary.availableOd,
    })
  }

  if (
    summary.availableDlod.amountMinor > 0 &&
    summary.availableOd.amountMinor === 0 &&
    summary.fundingGap.amountMinor > 0
  ) {
    recommendations.push({
      id: 'treasury-action-use-dlod',
      priority: 'high',
      title: 'Use DLOD',
      reason: 'DLOD is the remaining available facility to cover the gap.',
      expectedImpact: summary.availableDlod,
    })
  }

  if (summary.blockedReraCash.amountMinor > 0) {
    recommendations.push({
      id: 'treasury-action-release-blocked-cash',
      priority: 'high',
      title: 'Release blocked cash',
      reason: 'Blocked RERA cash can improve deployable liquidity once controls are cleared.',
      expectedImpact: summary.blockedReraCash,
    })
  }

  if (input.liquidity.output.expectedInflows.amountMinor > 0) {
    recommendations.push({
      id: 'treasury-action-accelerate-collections',
      priority: summary.fundingGap.amountMinor > 0 ? 'high' : 'medium',
      title: 'Accelerate collections',
      reason: 'Expected collections are a key source for covering scheduled payments.',
      expectedImpact: input.liquidity.output.expectedInflows,
    })
  }

  if (
    summary.fundingGap.amountMinor === 0 &&
    summary.borrowingUtilisationPercentage > 50
  ) {
    recommendations.push({
      id: 'treasury-action-reduce-borrowing',
      priority: 'medium',
      title: 'Reduce borrowing',
      reason: 'Near-term payments are covered and borrowing utilisation is material.',
      expectedImpact: summary.deployableCash,
    })
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: 'treasury-action-maintain-liquidity',
      priority: 'low',
      title: 'Maintain current liquidity',
      reason: 'Current deployable cash and headroom cover the 30-day obligation view.',
      expectedImpact: summary.deployableCash,
    })
  }

  return recommendations
}

function createScore(summary: TreasurySummary): Score {
  const coverageBase =
    summary.upcomingFundingRequirements.reduce(
      (total, payment) => total + payment.amount.amountMinor,
      0,
    ) || 1
  const liquidityCoverage = Math.min(
    summary.deployableCash.amountMinor / coverageBase,
    1,
  )
  const fundingGapPoints = summary.fundingGap.amountMinor === 0 ? 30 : 0
  const borrowingPoints = Math.max(
    1 - summary.borrowingUtilisationPercentage / 100,
    0,
  ) * 20
  const blockedCashPoints =
    summary.deployableCash.amountMinor > 0
      ? Math.max(
          1 -
            summary.blockedReraCash.amountMinor /
              summary.deployableCash.amountMinor,
          0,
        ) * 10
      : 0
  const value = Math.round(
    liquidityCoverage * 40 + fundingGapPoints + borrowingPoints + blockedCashPoints,
  )

  return {
    value,
    maximum: 100,
    band: getScoreBand(value),
    trend: 'stable',
    rationale:
      'Treasury health combines 30-day payment coverage, funding gap, borrowing utilisation, and blocked cash pressure.',
  }
}

function createRisks(summary: TreasurySummary): Risk[] {
  const risks: Risk[] = []

  if (summary.fundingGap.amountMinor > 0) {
    risks.push({
      id: 'treasury-risk-funding-gap',
      engine: ENGINE_ID,
      title: '30-day funding gap',
      description: 'Scheduled payments exceed deployable resources and borrowing headroom.',
      severity: 'critical',
      status: 'open',
      financialExposure: summary.fundingGap,
      mitigation: 'Activate facilities, accelerate collections, or defer discretionary payments.',
      owner: 'Treasury',
    })
  }

  if (summary.borrowingUtilisationPercentage > 75) {
    risks.push({
      id: 'treasury-risk-high-borrowing-utilisation',
      engine: ENGINE_ID,
      title: 'High borrowing utilisation',
      description: 'Borrowing utilisation is above the preferred treasury threshold.',
      severity: 'high',
      status: 'open',
      financialExposure: summary.borrowingCapacity,
      mitigation: 'Reduce utilisation or preserve remaining headroom for priority obligations.',
      owner: 'Treasury',
    })
  }

  return risks
}

function createOpportunities(summary: TreasurySummary): Opportunity[] {
  const opportunities: Opportunity[] = []

  if (summary.borrowingCapacity.amountMinor > 0) {
    opportunities.push({
      id: 'treasury-opportunity-borrowing-headroom',
      engine: ENGINE_ID,
      title: 'Borrowing headroom available',
      description: 'Committed facilities can cover short-term payment timing gaps.',
      potentialValue: summary.borrowingCapacity,
      status: 'identified',
      recommendedAction: 'Preserve headroom and sequence draws by cost and flexibility.',
      owner: 'Treasury',
      dependencies: [],
    })
  }

  if (summary.expectedUnlockableCash.amountMinor > 0) {
    opportunities.push({
      id: 'treasury-opportunity-unlock-rera-cash',
      engine: ENGINE_ID,
      title: 'Expected unlockable cash',
      description: 'Approved RERA withdrawals can increase deployable cash.',
      potentialValue: summary.expectedUnlockableCash,
      status: 'identified',
      recommendedAction: 'Clear pending controls required for release.',
      owner: 'Finance',
      dependencies: [],
    })
  }

  return opportunities
}

function createRecommendations(summary: TreasurySummary): Recommendation[] {
  return summary.treasuryRecommendations.map((recommendation) => ({
    id: recommendation.id,
    engine: ENGINE_ID,
    title: recommendation.title,
    description: recommendation.reason,
    priority: recommendation.priority,
    financialImpact: recommendation.expectedImpact,
    confidence: 'medium',
    action: recommendation.title,
    owner: 'Treasury',
    dependencies: [],
  }))
}

function createDecisions(summary: TreasurySummary): Decision[] {
  if (summary.fundingGap.amountMinor > 0) {
    return [
      {
        id: 'treasury-decision-close-30-day-gap',
        engine: ENGINE_ID,
        title: 'Close 30-day payment funding gap',
        description: 'The current forecast shows insufficient resources for scheduled payments.',
        priority: 'critical',
        financialImpact: summary.fundingGap,
        confidence: 'high',
        recommendedAction: 'Approve a treasury funding plan for the 30-day window.',
        owner: 'CFO',
        dependencies: [],
      },
    ]
  }

  return [
    {
      id: 'treasury-decision-maintain-payment-plan',
      engine: ENGINE_ID,
      title: 'Maintain current payment plan',
      description: 'Deployable cash and borrowing headroom cover the 30-day payment calendar.',
      priority: 'low',
      financialImpact: summary.deployableCash,
      confidence: 'high',
      recommendedAction: 'Continue daily treasury monitoring and preserve headroom.',
      owner: 'Treasury',
      dependencies: [],
    },
  ]
}

function evaluateTreasury(input: TreasuryInput): TreasuryResult {
  const operatingCash =
    input.bankPosition.output.cashBuckets.find(
      (bucket) => bucket.type === 'Operating Cash',
    )?.amount ?? money(0, input.reportingCurrency)
  const restrictedCash = input.bankPosition.output.restrictedCash
  const blockedReraCash = money(
    input.blockedCash.output.blockedAmount,
    input.reportingCurrency,
  )
  const expectedUnlockableCash = money(
    input.blockedCash.output.withdrawableAmount,
    input.reportingCurrency,
  )
  const totalLimit = input.facilities.reduce(
    (total, facility) => total + facility.limit.amountMinor,
    0,
  )
  const totalUtilised = input.facilities.reduce(
    (total, facility) => total + facility.utilised.amountMinor,
    0,
  )
  const borrowingUtilisationPercentage =
    totalLimit > 0 ? Math.round((totalUtilised / totalLimit) * 1000) / 10 : 0
  const cashForecast = buildCashForecast(input)
  const thirtyDayForecast = cashForecast.find(
    (forecast) => forecast.horizon === '30 Days',
  ) as TreasuryCashForecast
  const dueThisWeekEnd = addDays(input.asOfDate, 7)
  const paymentsDueThisWeek = sumMoney(
    input.scheduledPayments
      .filter((payment) =>
        isWithinDateRange(payment.dueDate, input.asOfDate, dueThisWeekEnd),
      )
      .map((payment) => payment.amount),
    input.reportingCurrency,
  )
  const upcomingFundingRequirements = input.scheduledPayments.filter(
    (payment) =>
      isWithinDateRange(payment.dueDate, input.asOfDate, addDays(input.asOfDate, 30)),
  )
  const availableOd =
    input.facilities.find((facility) => facility.facilityType === 'Overdraft')
      ?.available ?? money(0, input.reportingCurrency)
  const availableCc =
    input.facilities.find((facility) => facility.facilityType === 'Cash Credit')
      ?.available ?? money(0, input.reportingCurrency)
  const availableDlod =
    input.facilities.find((facility) => facility.facilityType === 'DLOD')
      ?.available ?? money(0, input.reportingCurrency)

  const summaryWithoutRecommendations = {
    deployableCash: input.bankPosition.output.netDeployableCash,
    operatingCash,
    restrictedCash,
    blockedReraCash,
    expectedUnlockableCash,
    borrowingCapacity: input.bankPosition.output.borrowingCapacity,
    borrowingUtilisationPercentage,
    availableOd,
    availableCc,
    availableDlod,
    cashForecast,
    fundingGap: thirtyDayForecast.fundingGap,
    treasuryHealthScore: 0,
    paymentsDueThisWeek,
    upcomingFundingRequirements,
    paymentCalendar: input.scheduledPayments,
    borrowingPosition: input.facilities,
  }
  const treasuryRecommendations = buildOperationalRecommendations(
    input,
    summaryWithoutRecommendations,
  )
  const summary: TreasurySummary = {
    ...summaryWithoutRecommendations,
    treasuryRecommendations,
    treasuryHealthScore: 0,
  }
  const score = createScore(summary)
  const output = {
    ...summary,
    treasuryHealthScore: score.value,
  }

  return {
    engine: ENGINE_ID,
    engineVersion: ENGINE_VERSION,
    evaluatedAt: input.asOfDate,
    subjectId: input.groupId,
    summary: `${input.reportingCurrency} ${(output.deployableCash.amountMinor / 100).toLocaleString('en-IN')} is deployable against the 30-day treasury plan.`,
    score,
    risks: createRisks(output),
    opportunities: createOpportunities(output),
    recommendations: createRecommendations(output),
    decisions: createDecisions(output),
    output,
  }
}

export const treasuryEngine: FinanceEngine<TreasuryInput, TreasurySummary> = {
  id: ENGINE_ID,
  name: 'Treasury Engine',
  version: ENGINE_VERSION,
  evaluate: evaluateTreasury,
}

export function evaluateTreasuryPosition(input: TreasuryInput): TreasuryResult {
  return treasuryEngine.evaluate(input)
}
