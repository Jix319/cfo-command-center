import type { Recommendation } from '../../domain/core/Recommendation'
import type { Risk as DomainRisk } from '../../domain/core/Risk'
import type { Risk as BlockedCashRisk } from '../core/Risk'
import type {
  MorningBrief,
  MorningBriefAction,
  MorningBriefChange,
  MorningBriefHealthComponent,
  MorningBriefInput,
  MorningBriefOpportunity,
  MorningBriefPriority,
  MorningBriefRisk,
} from './types'

const priorityRank: Record<MorningBriefPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

function toPriority(value: string): MorningBriefPriority {
  if (value === 'critical' || value === 'high' || value === 'medium') {
    return value
  }

  return 'low'
}

function getRiskExposure(risk: DomainRisk | BlockedCashRisk): number {
  const exposure = risk.financialExposure

  if (typeof exposure === 'number') return exposure
  return exposure?.amountMinor ?? 0
}

function buildChanges(input: MorningBriefInput): MorningBriefChange[] {
  const changes: MorningBriefChange[] = []
  const collectionsGap = input.collections.output.collectionGap.amountMinor
  const runwayDays = input.liquidity.output.cashRunwayDays
  const statutoryDues = input.treasury.output.paymentCalendar.filter(
    (payment) => payment.category === 'GST' || payment.category === 'TDS',
  )

  changes.push({
    id: 'morning-change-collections',
    title: 'Collections improved',
    description: `${input.collections.output.achievementPercentage.toFixed(1)}% of the monthly target is collected and forecast confidence is ${input.collections.output.forecastConfidence.toLowerCase()}.`,
    tone: collectionsGap > 0 ? 'warning' : 'positive',
  })

  changes.push({
    id: 'morning-change-runway',
    title:
      runwayDays === null || runwayDays >= 15
        ? 'Runway increased'
        : 'Runway tightened',
    description:
      runwayDays === null
        ? 'No forecast outflow is currently reducing runway.'
        : `${runwayDays} days of cash runway is available in the current liquidity view.`,
    tone:
      runwayDays === null || runwayDays >= 15
        ? 'positive'
        : runwayDays >= 7
          ? 'warning'
          : 'critical',
  })

  if (input.blockedCash.output.blockedAmount > 0) {
    changes.push({
      id: 'morning-change-blocked-cash',
      title:
        input.blockedCash.output.withdrawableAmount > 0
          ? 'Blocked cash reduced'
          : 'Blocked cash still locked',
      description:
        input.blockedCash.output.withdrawableAmount > 0
          ? 'A portion of RERA cash is now unlockable through approved withdrawal capacity.'
          : 'RERA cash remains blocked until withdrawal controls are cleared.',
      tone: 'warning',
    })
  }

  if (statutoryDues.length > 0) {
    changes.push({
      id: 'morning-change-statutory-dues',
      title: 'Upcoming statutory dues added',
      description: `${statutoryDues.length} statutory payment${statutoryDues.length === 1 ? '' : 's'} appear in the treasury calendar.`,
      tone: 'neutral',
    })
  }

  return changes
}

function buildRisks(input: MorningBriefInput): MorningBriefRisk[] {
  const risks: MorningBriefRisk[] = [
    ...input.treasury.risks,
    ...input.collections.risks,
    ...input.liquidity.risks,
    ...input.blockedCash.risks,
  ]
    .map((risk) => ({
      id: 'id' in risk ? risk.id : risk.code,
      title: risk.title,
      description: risk.description,
      priority: toPriority(risk.severity),
      exposure: getRiskExposure(risk),
    }))
    .sort(
      (left, right) =>
        priorityRank[left.priority] - priorityRank[right.priority] ||
        right.exposure - left.exposure,
    )

  return risks.slice(0, 5)
}

function buildOpportunities(
  input: MorningBriefInput,
): MorningBriefOpportunity[] {
  const opportunities: MorningBriefOpportunity[] = []

  input.blockedCash.output.recommendedActions.forEach((action, index) => {
    const normalizedAction = action.toLowerCase()
    const title = normalizedAction.includes('architect')
      ? 'Architect Certificate Approval'
      : normalizedAction.includes('ca') ||
          normalizedAction.includes('chartered')
        ? 'CA Certification Approval'
        : 'RERA Cash Release'

    opportunities.push({
      id: `morning-opportunity-blocked-cash-${index + 1}`,
      title,
      description: action,
      impact: input.blockedCash.output.blockedAmount,
    })
  })

  input.collections.opportunities.forEach((opportunity) => {
    opportunities.push({
      id: `morning-opportunity-${opportunity.id}`,
      title: 'Accelerate Committed Collections',
      description: opportunity.recommendedAction,
      impact: opportunity.potentialValue.amountMinor,
    })
  })

  if (input.treasury.output.availableDlod.amountMinor > 0) {
    opportunities.push({
      id: 'morning-opportunity-expected-loan-disbursement',
      title: 'Expected Loan Disbursement',
      description: 'Use available DLOD headroom to support near-term funding requirements if required.',
      impact: input.treasury.output.availableDlod.amountMinor,
    })
  }

  if (input.treasury.output.borrowingCapacity.amountMinor > 0) {
    opportunities.push({
      id: 'morning-opportunity-borrowing-headroom',
      title: 'Preserve Borrowing Headroom',
      description: 'Committed facility availability can protect payment timing over the 30-day horizon.',
      impact: input.treasury.output.borrowingCapacity.amountMinor,
    })
  }

  return opportunities
    .sort((left, right) => right.impact - left.impact)
    .slice(0, 5)
}

function buildActions(input: MorningBriefInput): MorningBriefAction[] {
  const domainRecommendations: Recommendation[] = [
    ...input.treasury.recommendations,
    ...input.collections.recommendations,
    ...input.liquidity.recommendations,
  ]
  const blockedActions: MorningBriefAction[] =
    input.blockedCash.recommendations.map((recommendation, index) => ({
      id: `morning-blocked-action-${index + 1}`,
      title: recommendation.action,
      impact: input.blockedCash.output.blockedAmount,
      priority: toPriority(recommendation.priority),
    }))
  const actions = [
    ...domainRecommendations.map((recommendation) => ({
      id: recommendation.id,
      title: recommendation.action,
      impact: recommendation.financialImpact?.amountMinor ?? 0,
      priority: toPriority(recommendation.priority),
      owner: recommendation.owner,
    })),
    ...blockedActions,
  ]

  return actions
    .sort(
      (left, right) =>
        priorityRank[left.priority] - priorityRank[right.priority] ||
        right.impact - left.impact,
    )
    .slice(0, 5)
}

function buildHealthBreakdown(
  input: MorningBriefInput,
): MorningBriefHealthComponent[] {
  const statutoryPayments = input.treasury.output.paymentCalendar.filter(
    (payment) => payment.category === 'GST' || payment.category === 'TDS',
  )
  const complianceScore =
    statutoryPayments.length === 0
      ? 100
      : statutoryPayments.every((payment) => payment.fundingStatus === 'funded')
        ? 90
        : statutoryPayments.some((payment) => payment.fundingStatus === 'gap')
          ? 35
          : 65
  const components: Omit<MorningBriefHealthComponent, 'contribution'>[] = [
    { label: 'Liquidity', score: input.liquidity.score.value, weight: 20 },
    { label: 'Collections', score: input.collections.score.value, weight: 20 },
    { label: 'Treasury', score: input.treasury.score.value, weight: 20 },
    { label: 'Blocked Cash', score: input.blockedCash.score.value, weight: 20 },
    { label: 'Compliance', score: complianceScore, weight: 20 },
  ]

  return components.map((component) => ({
    ...component,
    contribution: Math.round((component.score * component.weight) / 100),
  }))
}

export function evaluateMorningBrief(
  input: MorningBriefInput,
): MorningBrief {
  const healthBreakdown = buildHealthBreakdown(input)
  const healthScore = healthBreakdown.reduce(
    (total, component) => total + component.contribution,
    0,
  )
  const actions = buildActions(input)
  const todayPriority =
    actions.length === 0
      ? null
      : [...actions].sort((left, right) => right.impact - left.impact)[0]

  return {
    generatedAt: input.generatedAt,
    currency: input.treasury.output.deployableCash.currency,
    healthScore,
    healthBreakdown,
    deployableCash: input.treasury.output.deployableCash.amountMinor,
    runwayDays: input.liquidity.output.cashRunwayDays,
    collectionsGap: input.collections.output.collectionGap.amountMinor,
    blockedCash: input.blockedCash.output.blockedAmount,
    unlockableCash: input.blockedCash.output.withdrawableAmount,
    treasuryStatus: input.liquidity.output.liquidityStatus,
    collectionsAchievement: input.collections.output.achievementPercentage,
    changes: buildChanges(input),
    risks: buildRisks(input),
    opportunities: buildOpportunities(input),
    actions,
    todayPriority,
  }
}

export const morningBriefEngine = {
  id: 'morning-brief',
  name: 'Morning Brief Engine',
  version: '1.0.0',
  evaluate: evaluateMorningBrief,
}
