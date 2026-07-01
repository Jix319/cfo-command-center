import type {
  ImpactMetric,
  Scenario,
  ScenarioMetrics,
  ScenarioResult,
  ScenarioSimulatorInput,
  ScenarioSimulatorSummary,
} from './types'

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum)
}

function buildBeforeMetrics(input: ScenarioSimulatorInput): ScenarioMetrics {
  return {
    deployableCash: input.treasury.output.deployableCash.amountMinor,
    runwayDays: input.liquidity.output.cashRunwayDays ?? 0,
    borrowingUtilization: input.treasury.output.borrowingUtilisationPercentage,
    blockedCash: input.blockedCash.output.blockedAmount,
    financeHealthScore: input.morningBrief.healthScore,
    collectionsGap: input.collections.output.collectionGap.amountMinor,
  }
}

function applyScenario(
  before: ScenarioMetrics,
  scenario: Scenario,
): ScenarioMetrics {
  return {
    deployableCash: Math.max(
      before.deployableCash + scenario.cashImpactMinor,
      0,
    ),
    runwayDays: Math.max(
      before.runwayDays + scenario.runwayImpactDays,
      0,
    ),
    borrowingUtilization: clamp(
      before.borrowingUtilization + scenario.borrowingUtilizationImpact,
      0,
      100,
    ),
    blockedCash: Math.max(
      before.blockedCash - scenario.blockedCashImpactMinor,
      0,
    ),
    financeHealthScore: clamp(
      before.financeHealthScore + scenario.healthScoreImpact,
      0,
      100,
    ),
    collectionsGap: Math.max(
      before.collectionsGap - scenario.collectionsGapImpactMinor,
      0,
    ),
  }
}

function metric(
  key: ImpactMetric['key'],
  label: string,
  unit: ImpactMetric['unit'],
  before: number,
  after: number,
): ImpactMetric {
  return {
    key,
    label,
    unit,
    before,
    after,
    change: after - before,
  }
}

function buildImpact(
  before: ScenarioMetrics,
  after: ScenarioMetrics,
): ImpactMetric[] {
  return [
    metric('deployableCash', 'Deployable Cash', 'money', before.deployableCash, after.deployableCash),
    metric('runwayDays', 'Runway', 'days', before.runwayDays, after.runwayDays),
    metric(
      'borrowingUtilization',
      'Borrowing Utilization',
      'percentage',
      before.borrowingUtilization,
      after.borrowingUtilization,
    ),
    metric('blockedCash', 'Blocked Cash', 'money', before.blockedCash, after.blockedCash),
    metric(
      'financeHealthScore',
      'Finance Health Score',
      'score',
      before.financeHealthScore,
      after.financeHealthScore,
    ),
    metric('collectionsGap', 'Collections Gap', 'money', before.collectionsGap, after.collectionsGap),
  ]
}

function buildInsight(scenario: Scenario, impact: ImpactMetric[]): string {
  const deployableCashImpact =
    impact.find((item) => item.key === 'deployableCash')?.change ?? 0
  const runwayImpact =
    impact.find((item) => item.key === 'runwayDays')?.change ?? 0
  const blockedCashImpact =
    Math.abs(impact.find((item) => item.key === 'blockedCash')?.change ?? 0)

  if (scenario.id.includes('architect') && blockedCashImpact > 0) {
    return 'Approving architect certification provides a direct blocked cash release opportunity.'
  }

  if (scenario.id.includes('ca-certificate') && blockedCashImpact > 0) {
    return 'CA certification approval improves RERA withdrawal readiness and finance health.'
  }

  if (scenario.id.includes('collection') && runwayImpact > 0) {
    return `Additional collections improve runway by ${runwayImpact} days.`
  }

  if (scenario.id.includes('od') && deployableCashImpact > 0) {
    return 'OD enhancement has limited impact compared to blocked cash release if utilization rises.'
  }

  if (scenario.id.includes('dlod')) {
    return 'Drawing DLOD improves immediate cash but increases borrowing utilization.'
  }

  if (scenario.id.includes('sales-slower')) {
    return 'Slower sales increases collection pressure and reduces short-term cash flexibility.'
  }

  return 'This scenario improves near-term CFO flexibility using deterministic engine outputs.'
}

function evaluateScenario(
  input: ScenarioSimulatorInput,
  scenario: Scenario,
): ScenarioResult {
  const before = buildBeforeMetrics(input)
  const after = applyScenario(before, scenario)
  const impact = buildImpact(before, after)

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    category: scenario.category,
    before,
    after,
    impact,
    insight: buildInsight(scenario, impact),
  }
}

export function evaluateScenarioSimulator(
  input: ScenarioSimulatorInput,
): ScenarioSimulatorSummary {
  const results = input.scenarios.map((scenario) =>
    evaluateScenario(input, scenario),
  )
  const bestScenario = [...results].sort(
    (left, right) =>
      right.after.deployableCash -
        right.before.deployableCash -
        (left.after.deployableCash - left.before.deployableCash) ||
      right.after.runwayDays -
        right.before.runwayDays -
        (left.after.runwayDays - left.before.runwayDays),
  )[0]

  if (!bestScenario) {
    throw new Error('Scenario simulator requires at least one scenario.')
  }

  return {
    currency: input.currency,
    scenarios: input.scenarios,
    results,
    bestScenario,
  }
}

export const scenarioSimulatorEngine = {
  id: 'scenario-simulator',
  name: 'Scenario Simulator Engine',
  version: '1.0.0',
  evaluate: evaluateScenarioSimulator,
}
