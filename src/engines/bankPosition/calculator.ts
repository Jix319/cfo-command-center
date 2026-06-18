import type { Decision } from '../../domain/core/Decision'
import type { FinanceEngine } from '../../domain/core/FinanceEngine'
import type { Opportunity } from '../../domain/core/Opportunity'
import type { Recommendation } from '../../domain/core/Recommendation'
import type { Risk } from '../../domain/core/Risk'
import type { Score, ScoreBand } from '../../domain/core/Score'
import type { Money } from '../../domain/valueObjects/Money'
import {
  HIGH_OD_UTILIZATION_RATIO,
  HIGH_RESTRICTED_CASH_RATIO,
  IDLE_OPERATING_CASH_RATIO,
  LARGE_RESTRICTED_BALANCE_RATIO,
  LOW_AVAILABLE_CASH_RATIO,
  assertCurrency,
  getCashBucketType,
  getFacilityAvailableAmountMinor,
  getFacilityUtilizationRatio,
  getRestrictedAmountMinor,
} from './rules'
import type {
  BankAccountPosition,
  BankFacility,
  BankFacilityType,
  BankPositionInput,
  BankPositionResult,
  BankPositionSummary,
  CashBucket,
  CashBucketType,
} from './types'

const ENGINE_ID = 'bank-position'
const ENGINE_VERSION = '1.0.0'

function money(amountMinor: number, currency: string): Money {
  return { amountMinor: Math.round(amountMinor), currency }
}

function ratio(numerator: number, denominator: number): number {
  return denominator > 0 ? numerator / denominator : 0
}

function sumAccountBalances(accounts: BankAccountPosition[]): number {
  return accounts.reduce(
    (total, accountPosition) => total + accountPosition.balance.amountMinor,
    0,
  )
}

function sumAvailableFacility(
  facilities: BankFacility[],
  facilityType?: BankFacilityType,
): number {
  return facilities
    .filter(
      (bankFacility) =>
        facilityType === undefined ||
        bankFacility.facilityType === facilityType,
    )
    .reduce(
      (total, bankFacility) =>
        total + getFacilityAvailableAmountMinor(bankFacility),
      0,
    )
}

function buildCashBuckets(
  accounts: BankAccountPosition[],
  currency: string,
): CashBucket[] {
  const bucketTypes: CashBucketType[] = [
    'Operating Cash',
    'Restricted Cash',
    'Escrow Cash',
    'Borrowed Funds',
    'Collection Accounts',
  ]

  return bucketTypes.map((type) => {
    const matchingAccounts =
      type === 'Restricted Cash'
        ? accounts.filter(
            (accountPosition) =>
              getRestrictedAmountMinor(accountPosition) > 0,
          )
        : accounts.filter(
            (accountPosition) =>
              getCashBucketType(accountPosition.purpose) === type,
          )
    const amountMinor = matchingAccounts.reduce(
      (total, accountPosition) =>
        total +
        (type === 'Restricted Cash'
          ? getRestrictedAmountMinor(accountPosition)
          : accountPosition.balance.amountMinor),
      0,
    )

    return {
      type,
      amount: money(amountMinor, currency),
      accountIds: matchingAccounts.map(
        (accountPosition) => accountPosition.account.id,
      ),
    }
  })
}

function validateInput(input: BankPositionInput): void {
  input.accounts.forEach((accountPosition) => {
    assertCurrency(accountPosition.balance, input.reportingCurrency)
    accountPosition.restrictions.forEach((restriction) => {
      if (restriction.restrictedAmount) {
        assertCurrency(restriction.restrictedAmount, input.reportingCurrency)
      }
    })
  })

  input.facilities.forEach((bankFacility) => {
    assertCurrency(
      bankFacility.facility.sanctionedLimit,
      input.reportingCurrency,
    )

    if (bankFacility.facility.utilizedAmount) {
      assertCurrency(
        bankFacility.facility.utilizedAmount,
        input.reportingCurrency,
      )
    }
  })
}

function getScoreBand(value: number): ScoreBand {
  if (value >= 85) return 'excellent'
  if (value >= 70) return 'good'
  if (value >= 50) return 'moderate'
  if (value >= 30) return 'weak'
  return 'critical'
}

function createScore(
  availableCashRatio: number,
  restrictedCashRatio: number,
  borrowingHeadroomRatio: number,
  odUtilizationRatio: number,
): Score {
  const availableCashPoints = Math.min(availableCashRatio / 0.5, 1) * 40
  const restrictedCashPoints = Math.max(1 - restrictedCashRatio, 0) * 25
  const borrowingPoints = Math.min(borrowingHeadroomRatio / 0.5, 1) * 20
  const odPoints = Math.max(1 - odUtilizationRatio, 0) * 15
  const value = Math.round(
    availableCashPoints +
      restrictedCashPoints +
      borrowingPoints +
      odPoints,
  )

  return {
    value,
    maximum: 100,
    band: getScoreBand(value),
    trend: 'not_available',
    rationale:
      'Score combines immediately available cash, restricted cash, borrowing headroom, and OD utilization.',
  }
}

function createRisks(
  summary: BankPositionSummary,
  operatingCashMinor: number,
): Risk[] {
  const risks: Risk[] = []
  const currency = summary.totalBankBalance.currency

  if (summary.restrictedCashRatio > HIGH_RESTRICTED_CASH_RATIO) {
    risks.push({
      id: 'bank-risk-restricted-ratio',
      engine: ENGINE_ID,
      title: 'High restricted cash ratio',
      description: 'More than half of the positive bank balance is restricted.',
      severity: 'high',
      status: 'open',
      financialExposure: summary.restrictedCash,
      mitigation: 'Review restrictions and identify balances eligible for release.',
      owner: 'Treasury',
    })
  }

  if (summary.odUtilizationRatio > HIGH_OD_UTILIZATION_RATIO) {
    risks.push({
      id: 'bank-risk-od-utilization',
      engine: ENGINE_ID,
      title: 'High OD utilization',
      description: 'OD utilization is above the configured liquidity threshold.',
      severity: 'high',
      status: 'open',
      mitigation: 'Reduce OD utilization or secure additional short-term headroom.',
      owner: 'Treasury',
    })
  }

  if (operatingCashMinor < 0) {
    risks.push({
      id: 'bank-risk-negative-operating-cash',
      engine: ENGINE_ID,
      title: 'Negative operating cash',
      description: 'Operating-purpose accounts have a negative aggregate balance.',
      severity: 'critical',
      status: 'open',
      financialExposure: money(Math.abs(operatingCashMinor), currency),
      mitigation: 'Fund operating accounts from available liquidity sources.',
      owner: 'Treasury',
    })
  }

  if (summary.availableCashRatio < LOW_AVAILABLE_CASH_RATIO) {
    risks.push({
      id: 'bank-risk-low-available-cash',
      engine: ENGINE_ID,
      title: 'Low immediately available cash',
      description: 'Available cash is low relative to the total positive bank balance.',
      severity: 'medium',
      status: 'open',
      financialExposure: summary.availableCash,
      mitigation: 'Preserve borrowing headroom and review restricted balances.',
      owner: 'Treasury',
    })
  }

  return risks
}

function createOpportunities(
  summary: BankPositionSummary,
  operatingCashMinor: number,
): Opportunity[] {
  const opportunities: Opportunity[] = []
  const currency = summary.totalBankBalance.currency
  const positiveBalance = Math.max(summary.totalBankBalance.amountMinor, 0)

  if (summary.borrowingCapacity.amountMinor > 0) {
    opportunities.push({
      id: 'bank-opportunity-unused-capacity',
      engine: ENGINE_ID,
      title: 'Unused borrowing capacity',
      description: 'Committed OD, CC, or DLOD capacity remains available.',
      potentialValue: summary.borrowingCapacity,
      status: 'identified',
      recommendedAction: 'Preserve and sequence available facilities by cost and flexibility.',
      owner: 'Treasury',
      dependencies: [],
    })
  }

  if (
    positiveBalance > 0 &&
    operatingCashMinor / positiveBalance > IDLE_OPERATING_CASH_RATIO
  ) {
    opportunities.push({
      id: 'bank-opportunity-idle-operating-cash',
      engine: ENGINE_ID,
      title: 'Idle operating cash',
      description: 'A material share of group cash is held in operating accounts.',
      potentialValue: money(Math.max(operatingCashMinor, 0), currency),
      status: 'identified',
      recommendedAction: 'Review surplus operating balances for concentration or deployment.',
      owner: 'Treasury',
      dependencies: [],
    })
  }

  if (
    positiveBalance > 0 &&
    summary.restrictedCash.amountMinor / positiveBalance >
      LARGE_RESTRICTED_BALANCE_RATIO
  ) {
    opportunities.push({
      id: 'bank-opportunity-restricted-balance',
      engine: ENGINE_ID,
      title: 'Large restricted balance',
      description: 'A material restricted balance may warrant eligibility review.',
      potentialValue: summary.restrictedCash,
      status: 'identified',
      recommendedAction: 'Validate whether any restrictions can be released or reduced.',
      owner: 'Treasury',
      dependencies: [],
    })
  }

  return opportunities
}

function createRecommendations(
  summary: BankPositionSummary,
): Recommendation[] {
  const recommendations: Recommendation[] = []

  if (
    summary.odAvailable.amountMinor > 0 &&
    summary.dlodAvailable.amountMinor > 0
  ) {
    recommendations.push({
      id: 'bank-recommendation-facility-sequence',
      engine: ENGINE_ID,
      title: 'Sequence borrowing capacity',
      description: 'Both OD and DLOD headroom are currently available.',
      priority: 'medium',
      financialImpact: summary.odAvailable,
      confidence: 'high',
      action: 'Use available OD capacity before DLOD, subject to facility pricing and covenants.',
      owner: 'Treasury',
      dependencies: [],
    })
  }

  if (summary.odUtilizationRatio > HIGH_OD_UTILIZATION_RATIO) {
    recommendations.push({
      id: 'bank-recommendation-reduce-od',
      engine: ENGINE_ID,
      title: 'Reduce OD utilization',
      description: 'OD utilization exceeds the liquidity threshold.',
      priority: 'high',
      confidence: 'high',
      action: 'Apply surplus unrestricted cash to reduce OD utilization.',
      owner: 'Treasury',
      dependencies: [],
    })
  }

  if (summary.restrictedCashRatio > LARGE_RESTRICTED_BALANCE_RATIO) {
    recommendations.push({
      id: 'bank-recommendation-review-restrictions',
      engine: ENGINE_ID,
      title: 'Review restricted balances',
      description: 'Restricted cash is material relative to the bank balance.',
      priority: 'high',
      financialImpact: summary.restrictedCash,
      confidence: 'high',
      action: 'Review account restrictions with legal, statutory, and lender owners.',
      owner: 'Treasury',
      dependencies: [],
    })
  }

  if (
    summary.availableCashRatio > 0.5 &&
    summary.odUtilizationRatio > 0
  ) {
    recommendations.push({
      id: 'bank-recommendation-move-idle-cash',
      engine: ENGINE_ID,
      title: 'Move idle operating cash',
      description: 'Available cash is high while OD remains utilized.',
      priority: 'medium',
      financialImpact: summary.availableCash,
      confidence: 'medium',
      action: 'Concentrate unrestricted cash and evaluate repayment of utilized OD.',
      owner: 'Treasury',
      dependencies: [],
    })
  }

  return recommendations
}

function createDecisions(summary: BankPositionSummary): Decision[] {
  const currency = summary.totalBankBalance.currency

  if (
    summary.availableCashRatio < LOW_AVAILABLE_CASH_RATIO &&
    summary.odAvailable.amountMinor > 0
  ) {
    return [
      {
        id: 'bank-decision-increase-liquidity',
        engine: ENGINE_ID,
        title: 'Increase liquidity using available OD',
        description: 'Immediately available cash is low and OD headroom exists.',
        priority: 'high',
        financialImpact: summary.odAvailable,
        confidence: 'high',
        recommendedAction: 'Draw OD only to the level required for immediate liquidity.',
        owner: 'CFO',
        dependencies: [],
      },
    ]
  }

  if (summary.restrictedCashRatio > HIGH_RESTRICTED_CASH_RATIO) {
    return [
      {
        id: 'bank-decision-review-restricted-cash',
        engine: ENGINE_ID,
        title: 'Review large restricted balances',
        description: 'Restricted balances represent more than half of positive cash.',
        priority: 'high',
        financialImpact: summary.restrictedCash,
        confidence: 'high',
        recommendedAction: 'Initiate a restriction release review with accountable owners.',
        owner: 'CFO',
        dependencies: [],
      },
    ]
  }

  return [
    {
      id: 'bank-decision-maintain-position',
      engine: ENGINE_ID,
      title: 'Maintain current cash position',
      description: 'Available cash and borrowing headroom are within current thresholds.',
      priority: 'low',
      financialImpact: money(0, currency),
      confidence: 'medium',
      recommendedAction: 'Continue daily monitoring of cash and facility utilization.',
      owner: 'Treasury',
      dependencies: [],
    },
  ]
}

function evaluateBankPosition(input: BankPositionInput): BankPositionResult {
  validateInput(input)

  const positiveBankBalance = input.accounts.reduce(
    (total, accountPosition) =>
      total + Math.max(accountPosition.balance.amountMinor, 0),
    0,
  )
  const totalBankBalance = sumAccountBalances(input.accounts)
  const restrictedCash = input.accounts.reduce(
    (total, accountPosition) =>
      total + getRestrictedAmountMinor(accountPosition),
    0,
  )
  const availableCash = Math.max(positiveBankBalance - restrictedCash, 0)
  const odAvailable = sumAvailableFacility(input.facilities, 'OD')
  const ccAvailable = sumAvailableFacility(input.facilities, 'CC')
  const dlodAvailable = sumAvailableFacility(input.facilities, 'DLOD')
  const borrowingCapacity = odAvailable + ccAvailable + dlodAvailable
  const odFacilities = input.facilities.filter(
    (bankFacility) => bankFacility.facilityType === 'OD',
  )
  const totalOdLimit = odFacilities.reduce(
    (total, bankFacility) =>
      total + bankFacility.facility.sanctionedLimit.amountMinor,
    0,
  )
  const totalOdUtilized = odFacilities.reduce(
    (total, bankFacility) =>
      total + (bankFacility.facility.utilizedAmount?.amountMinor ?? 0),
    0,
  )
  const odUtilizationRatio =
    totalOdLimit > 0
      ? ratio(totalOdUtilized, totalOdLimit)
      : odFacilities.reduce(
          (highest, bankFacility) =>
            Math.max(highest, getFacilityUtilizationRatio(bankFacility)),
          0,
        )
  const cashBuckets = buildCashBuckets(
    input.accounts,
    input.reportingCurrency,
  )
  const operatingCashMinor =
    cashBuckets.find((bucket) => bucket.type === 'Operating Cash')?.amount
      .amountMinor ?? 0
  const availableCashRatio = ratio(availableCash, positiveBankBalance)
  const restrictedCashRatio = ratio(restrictedCash, positiveBankBalance)
  const borrowingHeadroomRatio = ratio(
    borrowingCapacity,
    positiveBankBalance + borrowingCapacity,
  )
  const summary: BankPositionSummary = {
    totalBankBalance: money(totalBankBalance, input.reportingCurrency),
    availableCash: money(availableCash, input.reportingCurrency),
    restrictedCash: money(restrictedCash, input.reportingCurrency),
    borrowingCapacity: money(borrowingCapacity, input.reportingCurrency),
    odAvailable: money(odAvailable, input.reportingCurrency),
    ccAvailable: money(ccAvailable, input.reportingCurrency),
    dlodAvailable: money(dlodAvailable, input.reportingCurrency),
    netDeployableCash: money(
      availableCash + borrowingCapacity,
      input.reportingCurrency,
    ),
    cashBuckets,
    availableCashRatio,
    restrictedCashRatio,
    odUtilizationRatio,
    metadata: {
      groupId: input.groupId,
      reportingCurrency: input.reportingCurrency,
      asOfDate: input.asOfDate,
      legalEntityCount: input.legalEntities.length,
      projectCount: input.projects.length,
      accountCount: input.accounts.length,
      facilityCount: input.facilities.length,
    },
  }

  return {
    engine: ENGINE_ID,
    engineVersion: ENGINE_VERSION,
    evaluatedAt: input.asOfDate,
    subjectId: input.groupId,
    summary: `${input.reportingCurrency} ${(
      summary.netDeployableCash.amountMinor / 100
    ).toLocaleString('en-IN')} is deployable today, including available borrowing capacity.`,
    score: createScore(
      availableCashRatio,
      restrictedCashRatio,
      borrowingHeadroomRatio,
      odUtilizationRatio,
    ),
    risks: createRisks(summary, operatingCashMinor),
    opportunities: createOpportunities(summary, operatingCashMinor),
    recommendations: createRecommendations(summary),
    decisions: createDecisions(summary),
    output: summary,
  }
}

export const bankPositionEngine: FinanceEngine<
  BankPositionInput,
  BankPositionSummary
> = {
  id: ENGINE_ID,
  name: 'Bank Position Engine',
  version: ENGINE_VERSION,
  evaluate: evaluateBankPosition,
}

export function evaluateBankPositionInput(
  input: BankPositionInput,
): BankPositionResult {
  return bankPositionEngine.evaluate(input)
}
