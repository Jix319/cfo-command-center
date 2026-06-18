import { withdrawalEligibilityRules } from './rules'
import type {
  BlockedCashConfidenceLevel,
  BlockedCashEvaluation,
  ProjectWithdrawalPosition,
  WithdrawalRuleFinding,
} from './types'

function calculateConfidenceLevel(
  failedRuleCount: number,
): BlockedCashConfidenceLevel {
  if (failedRuleCount === 0) {
    return 'high'
  }

  if (failedRuleCount === 1) {
    return 'medium'
  }

  return 'low'
}

export function evaluateProject(
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

  return {
    projectName: project.projectName,
    withdrawableAmount,
    blockedAmount,
    blockedReasons,
    recommendedActions,
    confidenceLevel: calculateConfidenceLevel(failedRules.length),
  }
}
