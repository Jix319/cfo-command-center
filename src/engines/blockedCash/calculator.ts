import type { Decision } from '../core/Decision'
import type { FinanceEngine } from '../core/FinanceEngine'
import type { Recommendation } from '../core/Recommendation'
import type { Risk } from '../core/Risk'
import type { Score, ScoreBand, ScoreConfidence } from '../core/Score'
import { withdrawalEligibilityRules } from './rules'
import type {
  BlockedCashEvaluation,
  BlockedCashOutput,
  ProjectWithdrawalPosition,
  WithdrawalRuleFinding,
} from './types'

const BLOCKED_CASH_ENGINE_ID = 'blocked-cash'
const BLOCKED_CASH_ENGINE_VERSION = '1.0.0'

function calculateConfidence(failedRuleCount: number): ScoreConfidence {
  if (failedRuleCount === 0) {
    return 'high'
  }

  if (failedRuleCount === 1) {
    return 'medium'
  }

  return 'low'
}

function calculateScoreBand(value: number): ScoreBand {
  if (value >= 80) {
    return 'strong'
  }

  if (value >= 60) {
    return 'moderate'
  }

  if (value >= 30) {
    return 'weak'
  }

  return 'critical'
}

function createScore(
  ruleFindings: WithdrawalRuleFinding[],
  withdrawableAmount: number,
  requestedWithdrawal: number,
): Score {
  const passedRuleCount = ruleFindings.filter(
    (finding) => finding.isSatisfied,
  ).length
  const ruleScore =
    ruleFindings.length === 0
      ? 100
      : (passedRuleCount / ruleFindings.length) * 100
  const withdrawalScore =
    requestedWithdrawal === 0
      ? 100
      : (withdrawableAmount / requestedWithdrawal) * 100
  const value = Math.round(ruleScore * 0.6 + withdrawalScore * 0.4)
  const failedRuleCount = ruleFindings.length - passedRuleCount

  return {
    value,
    maximum: 100,
    band: calculateScoreBand(value),
    confidence: calculateConfidence(failedRuleCount),
    rationale:
      failedRuleCount === 0
        ? 'All withdrawal eligibility controls are satisfied.'
        : `${failedRuleCount} withdrawal eligibility control${failedRuleCount === 1 ? '' : 's'} failed.`,
  }
}

function createDecision(
  withdrawableAmount: number,
  requestedWithdrawal: number,
): Decision {
  if (withdrawableAmount === requestedWithdrawal) {
    return {
      code: 'WITHDRAWAL_ELIGIBILITY',
      outcome: 'approved',
      summary: 'Requested withdrawal is fully withdrawable.',
      rationale: 'All controls passed and sufficient approved RERA balance is available.',
    }
  }

  if (withdrawableAmount > 0) {
    return {
      code: 'WITHDRAWAL_ELIGIBILITY',
      outcome: 'partially_approved',
      summary: 'Requested withdrawal is partially withdrawable.',
      rationale: 'The approved withdrawal or RERA balance is below the requested amount.',
    }
  }

  return {
    code: 'WITHDRAWAL_ELIGIBILITY',
    outcome: 'blocked',
    summary: 'Requested withdrawal is blocked.',
    rationale: 'One or more mandatory withdrawal controls are not satisfied.',
  }
}

function evaluateBlockedCash(
  project: ProjectWithdrawalPosition,
): BlockedCashEvaluation {
  const ruleFindings: WithdrawalRuleFinding[] = withdrawalEligibilityRules.map(
    (rule) => rule.evaluate(project),
  )
  const failedRules = ruleFindings.filter((finding) => !finding.isSatisfied)
  const hasEligibilityBlock = failedRules.length > 0
  const approvedCapacity = Math.min(
    project.approvedWithdrawal,
    project.reraBalance,
  )
  const withdrawableAmount = hasEligibilityBlock
    ? 0
    : Math.min(project.requestedWithdrawal, approvedCapacity)
  const blockedAmount = Math.max(
    project.requestedWithdrawal - withdrawableAmount,
    0,
  )
  const blockedReasons = failedRules.map((finding) => finding.blockedReason)
  const recommendedActions = failedRules.map(
    (finding) => finding.recommendedAction,
  )

  if (!hasEligibilityBlock && project.approvedWithdrawal < project.requestedWithdrawal) {
    blockedReasons.push(
      'Requested withdrawal exceeds the currently approved withdrawal.',
    )
    recommendedActions.push(
      'Obtain approval for the remaining requested withdrawal amount.',
    )
  }

  const output: BlockedCashOutput = {
    projectName: project.projectName,
    withdrawableAmount,
    blockedAmount,
    blockedReasons,
    recommendedActions,
  }
  const recommendations: Recommendation[] = recommendedActions.map(
    (action, index) => ({
      code: `UNLOCK_CASH_${index + 1}`,
      action,
      rationale: blockedReasons[index] ?? 'Required to unlock blocked cash.',
      priority: failedRules.length > 0 ? 'high' : 'medium',
    }),
  )
  const risks: Risk[] = blockedReasons.map((reason, index) => ({
    code: `BLOCKED_CASH_${index + 1}`,
    title: 'Cash withdrawal constraint',
    description: reason,
    severity: blockedAmount > 0 ? 'high' : 'low',
    financialExposure: blockedAmount,
  }))

  return {
    engineId: BLOCKED_CASH_ENGINE_ID,
    engineVersion: BLOCKED_CASH_ENGINE_VERSION,
    evaluatedAt: new Date().toISOString(),
    output,
    decisions: [createDecision(withdrawableAmount, project.requestedWithdrawal)],
    recommendations,
    risks,
    score: createScore(
      ruleFindings,
      withdrawableAmount,
      project.requestedWithdrawal,
    ),
  }
}

export const blockedCashEngine: FinanceEngine<
  ProjectWithdrawalPosition,
  BlockedCashOutput
> = {
  id: BLOCKED_CASH_ENGINE_ID,
  name: 'Blocked Cash Engine',
  version: BLOCKED_CASH_ENGINE_VERSION,
  evaluate: evaluateBlockedCash,
}

export function evaluateProject(
  project: ProjectWithdrawalPosition,
): BlockedCashEvaluation {
  return blockedCashEngine.evaluate(project)
}
