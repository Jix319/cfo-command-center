import type { Decision } from '../../domain/core/Decision'
import type { FinanceEngine } from '../../domain/core/FinanceEngine'
import type { Opportunity } from '../../domain/core/Opportunity'
import type { Recommendation } from '../../domain/core/Recommendation'
import type { Risk } from '../../domain/core/Risk'
import type { Score, ScoreBand } from '../../domain/core/Score'
import type { Money } from '../../domain/valueObjects/Money'
import {
  COLLECTION_STAGES,
  assertCurrency,
  getForecastConfidence,
  getRecoveryPriority,
  getStageRecoveryWeight,
  isSameUtcDay,
  isSameUtcMonth,
} from './rules'
import type {
  CollectionCase,
  CollectionDelayReason,
  CollectionsInput,
  CollectionsResult,
  CollectionsSummary,
  DelayReasonSummary,
  RecoveryCase,
} from './types'

const ENGINE_ID = 'collections'
const ENGINE_VERSION = '1.0.0'

function money(amountMinor: number, currency: string): Money {
  return { amountMinor: Math.round(amountMinor), currency }
}

function scoreBand(value: number): ScoreBand {
  if (value >= 85) return 'excellent'
  if (value >= 70) return 'good'
  if (value >= 50) return 'moderate'
  if (value >= 30) return 'weak'
  return 'critical'
}

function validateInput(input: CollectionsInput): void {
  assertCurrency(input.todayTarget, input.reportingCurrency)
  assertCurrency(input.monthTarget, input.reportingCurrency)
  input.collectionCases.forEach((collectionCase) => {
    assertCurrency(collectionCase.amountDue, input.reportingCurrency)
    assertCurrency(collectionCase.amountCollected, input.reportingCurrency)

    if (
      collectionCase.probability < 0 ||
      collectionCase.probability > 1
    ) {
      throw new Error('Collection probability must be between 0 and 1.')
    }
  })
}

function sumCollected(cases: CollectionCase[]): number {
  return cases.reduce(
    (total, collectionCase) =>
      total + collectionCase.amountCollected.amountMinor,
    0,
  )
}

function buildRecoveryCases(
  input: CollectionsInput,
): RecoveryCase[] {
  const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }

  return input.collectionCases
    .filter(
      (collectionCase) =>
        collectionCase.stage !== 'Allocated' &&
        collectionCase.amountDue.amountMinor >
          collectionCase.amountCollected.amountMinor,
    )
    .map((collectionCase) => ({
      id: collectionCase.id,
      customerName: collectionCase.customer.name,
      projectName: collectionCase.project.name,
      unitNumber: collectionCase.unit.unitNumber,
      amountDue: money(
        Math.max(
          collectionCase.amountDue.amountMinor -
            collectionCase.amountCollected.amountMinor,
          0,
        ),
        input.reportingCurrency,
      ),
      expectedCollectionDate: collectionCase.expectedCollectionDate,
      probability: collectionCase.probability,
      delayReason: collectionCase.delayReason,
      recommendedAction: collectionCase.recommendedAction,
      stage: collectionCase.stage,
      priority: getRecoveryPriority(collectionCase, input.asOfDate),
    }))
    .sort(
      (left, right) =>
        priorityOrder[left.priority] - priorityOrder[right.priority] ||
        right.amountDue.amountMinor - left.amountDue.amountMinor,
    )
}

function buildDelayReasons(
  input: CollectionsInput,
  recoveryCases: RecoveryCase[],
): DelayReasonSummary[] {
  const reasons = Array.from(
    new Set(recoveryCases.map((recoveryCase) => recoveryCase.delayReason)),
  )

  return reasons
    .map((reason: CollectionDelayReason) => {
      const matchingCases = recoveryCases.filter(
        (recoveryCase) => recoveryCase.delayReason === reason,
      )

      return {
        reason,
        caseCount: matchingCases.length,
        amount: money(
          matchingCases.reduce(
            (total, recoveryCase) =>
              total + recoveryCase.amountDue.amountMinor,
            0,
          ),
          input.reportingCurrency,
        ),
      }
    })
    .sort((left, right) => right.amount.amountMinor - left.amount.amountMinor)
}

function createScore(
  achievementPercentage: number,
  recoveryCases: RecoveryCase[],
  collectionCases: CollectionCase[],
): Score {
  const weightedRecovery =
    collectionCases.length === 0
      ? 0
      : collectionCases.reduce(
          (total, collectionCase) =>
            total +
            collectionCase.probability *
              getStageRecoveryWeight(collectionCase.stage),
          0,
        ) / collectionCases.length
  const criticalPenalty =
    recoveryCases.filter((recoveryCase) => recoveryCase.priority === 'Critical')
      .length * 8
  const value = Math.max(
    Math.min(
      Math.round(
        Math.min(achievementPercentage, 100) * 0.55 +
          weightedRecovery * 100 * 0.45 -
          criticalPenalty,
      ),
      100,
    ),
    0,
  )

  return {
    value,
    maximum: 100,
    band: scoreBand(value),
    trend: 'not_available',
    rationale:
      'Recovery score combines month achievement, probability-weighted pipeline maturity, and critical-case exposure.',
  }
}

function createRisks(summary: CollectionsSummary): Risk[] {
  const risks: Risk[] = []

  if (summary.collectionGap.amountMinor > 0) {
    risks.push({
      id: 'collections-risk-gap',
      engine: ENGINE_ID,
      title: 'Collection target gap',
      description: 'Forecast collections remain below the monthly target.',
      severity: summary.achievementPercentage < 60 ? 'high' : 'medium',
      status: 'open',
      financialExposure: summary.collectionGap,
      mitigation: 'Prioritize high-value recovery cases and committed receipts.',
      owner: 'Collections',
    })
  }

  const legalExposure = summary.delayReasons.find(
    (reason) => reason.reason === 'Legal Issue',
  )

  if (legalExposure) {
    risks.push({
      id: 'collections-risk-legal',
      engine: ENGINE_ID,
      title: 'Legal collection delays',
      description: 'Outstanding collections are delayed by legal issues.',
      severity: 'high',
      status: 'open',
      financialExposure: legalExposure.amount,
      mitigation: 'Escalate legal cases with documented recovery milestones.',
      owner: 'Legal',
    })
  }

  return risks
}

function createOpportunities(summary: CollectionsSummary): Opportunity[] {
  const committedPipeline = summary.pipeline.find(
    (stage) => stage.stage === 'Customer Committed',
  )

  return committedPipeline && committedPipeline.amount.amountMinor > 0
    ? [
        {
          id: 'collections-opportunity-committed',
          engine: ENGINE_ID,
          title: 'Committed collections available to accelerate',
          description:
            'Customer-committed receipts can be converted through focused follow-up.',
          potentialValue: committedPipeline.amount,
          status: 'identified',
          recommendedAction: 'Confirm payment dates and remove final execution blockers.',
          owner: 'Collections',
          dependencies: [],
        },
      ]
    : []
}

function createRecommendations(
  recoveryCases: RecoveryCase[],
): Recommendation[] {
  return recoveryCases.slice(0, 5).map((recoveryCase) => ({
    id: `collections-recommendation-${recoveryCase.id}`,
    engine: ENGINE_ID,
    title: recoveryCase.recommendedAction,
    description: `${recoveryCase.customerName} · ${recoveryCase.projectName} · Unit ${recoveryCase.unitNumber}`,
    priority: recoveryCase.priority.toLowerCase() as Recommendation['priority'],
    financialImpact: recoveryCase.amountDue,
    confidence:
      recoveryCase.probability >= 0.75
        ? 'high'
        : recoveryCase.probability >= 0.5
          ? 'medium'
          : 'low',
    action: recoveryCase.recommendedAction,
    owner:
      recoveryCase.recommendedAction === 'Legal Follow-up'
        ? 'Legal'
        : 'Collections',
    dueDate: recoveryCase.expectedCollectionDate,
    dependencies: [],
  }))
}

function createDecisions(summary: CollectionsSummary): Decision[] {
  if (summary.collectionGap.amountMinor > 0) {
    return [
      {
        id: 'collections-decision-recovery-plan',
        engine: ENGINE_ID,
        title: 'Activate collection recovery plan',
        description: 'Forecast collections are below the monthly target.',
        priority: 'high',
        financialImpact: summary.collectionGap,
        confidence:
          summary.forecastConfidence === 'High'
            ? 'high'
            : summary.forecastConfidence === 'Medium'
              ? 'medium'
              : 'low',
        recommendedAction: 'Assign owners to the highest-priority recovery cases today.',
        owner: 'CFO',
        dependencies: [],
      },
    ]
  }

  return [
    {
      id: 'collections-decision-maintain',
      engine: ENGINE_ID,
      title: 'Maintain collection plan',
      description: 'Forecast collections meet or exceed the monthly target.',
      priority: 'low',
      financialImpact: summary.forecast,
      confidence: 'high',
      recommendedAction: 'Continue monitoring committed receipts and allocation.',
      owner: 'Collections',
      dependencies: [],
    },
  ]
}

function evaluateCollections(input: CollectionsInput): CollectionsResult {
  validateInput(input)

  const todayCases = input.collectionCases.filter((collectionCase) =>
    isSameUtcDay(collectionCase.expectedCollectionDate, input.asOfDate),
  )
  const monthCases = input.collectionCases.filter((collectionCase) =>
    isSameUtcMonth(collectionCase.expectedCollectionDate, input.asOfDate),
  )
  const todayCollectionsMinor = sumCollected(todayCases)
  const monthCollectionsMinor = sumCollected(monthCases)
  const todayAchievementPercentage =
    input.todayTarget.amountMinor > 0
      ? (todayCollectionsMinor / input.todayTarget.amountMinor) * 100
      : 100
  const forecastMinor = monthCases.reduce(
    (total, collectionCase) =>
      total +
      collectionCase.amountCollected.amountMinor +
      Math.max(
        collectionCase.amountDue.amountMinor -
          collectionCase.amountCollected.amountMinor,
        0,
      ) *
        collectionCase.probability,
    0,
  )
  const achievementPercentage =
    input.monthTarget.amountMinor > 0
      ? (monthCollectionsMinor / input.monthTarget.amountMinor) * 100
      : 100
  const recoveryCases = buildRecoveryCases(input)
  const summary: CollectionsSummary = {
    todayTarget: input.todayTarget,
    todayCollections: money(todayCollectionsMinor, input.reportingCurrency),
    todayAchievementPercentage:
      Math.round(todayAchievementPercentage * 10) / 10,
    monthTarget: input.monthTarget,
    monthCollections: money(monthCollectionsMinor, input.reportingCurrency),
    achievementPercentage: Math.round(achievementPercentage * 10) / 10,
    forecast: money(forecastMinor, input.reportingCurrency),
    forecastConfidence: getForecastConfidence(monthCases),
    collectionGap: money(
      Math.max(input.monthTarget.amountMinor - forecastMinor, 0),
      input.reportingCurrency,
    ),
    recoveryScore: 0,
    pipeline: COLLECTION_STAGES.map((stage) => {
      const stageCases = input.collectionCases.filter(
        (collectionCase) => collectionCase.stage === stage,
      )

      return {
        stage,
        caseCount: stageCases.length,
        amount: money(
          stageCases.reduce(
            (total, collectionCase) =>
              total + collectionCase.amountDue.amountMinor,
            0,
          ),
          input.reportingCurrency,
        ),
      }
    }),
    delayReasons: buildDelayReasons(input, recoveryCases),
    recoveryCases,
  }
  const score = createScore(
    summary.achievementPercentage,
    recoveryCases,
    input.collectionCases,
  )
  summary.recoveryScore = score.value

  return {
    engine: ENGINE_ID,
    engineVersion: ENGINE_VERSION,
    evaluatedAt: input.asOfDate,
    subjectId: input.groupId,
    summary: `${summary.achievementPercentage.toFixed(1)}% of the monthly collection target has been achieved with ${recoveryCases.length} active recovery cases.`,
    score,
    decisions: createDecisions(summary),
    recommendations: createRecommendations(recoveryCases),
    risks: createRisks(summary),
    opportunities: createOpportunities(summary),
    output: summary,
  }
}

export const collectionsEngine: FinanceEngine<
  CollectionsInput,
  CollectionsSummary
> = {
  id: ENGINE_ID,
  name: 'Collections Engine',
  version: ENGINE_VERSION,
  evaluate: evaluateCollections,
}

export function evaluateCollectionsPosition(
  input: CollectionsInput,
): CollectionsResult {
  return collectionsEngine.evaluate(input)
}
