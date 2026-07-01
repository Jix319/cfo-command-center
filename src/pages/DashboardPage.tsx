import type { ReactElement } from 'react'
import SectionTitle from '../components/common/SectionTitle'
import BankPositionSummaryCard from '../components/controlTower/BankPositionSummaryCard'
import BlockedCashSummaryCard from '../components/controlTower/BlockedCashSummaryCard'
import CashOverviewCard from '../components/controlTower/CashOverviewCard'
import DecisionList from '../components/controlTower/DecisionList'
import FinanceHealthCard from '../components/controlTower/FinanceHealthCard'
import LiquiditySummaryCard from '../components/controlTower/LiquiditySummaryCard'
import OpportunityList from '../components/controlTower/OpportunityList'
import RiskList from '../components/controlTower/RiskList'
import CollectionsSummaryCard from '../components/collections/CollectionsSummaryCard'
import TreasurySummaryCard from '../components/treasury/TreasurySummaryCard'
import ImportStatusCard from '../components/imports/ImportStatusCard'
import MorningBriefActions from '../components/morningBrief/MorningBriefActions'
import MorningBriefCard from '../components/morningBrief/MorningBriefCard'
import MorningBriefRisks from '../components/morningBrief/MorningBriefRisks'
import MorningBriefSummary from '../components/morningBrief/MorningBriefSummary'
import ScenarioImpactCard from '../components/scenarioSimulator/ScenarioImpactCard'
import { morningBriefEngine } from '../engines/morningBrief/morningBriefEngine'
import { MORNING_BRIEF_SAMPLE_INPUT } from '../engines/morningBrief/sampleData'
import { scenarioSimulatorEngine } from '../engines/scenarioSimulator/scenarioSimulatorEngine'
import { SCENARIO_SIMULATOR_SAMPLE_INPUT } from '../engines/scenarioSimulator/sampleData'
import { SAMPLE_IMPORT_HISTORY } from '../imports/sampleTemplates'
import {
  useBankPosition,
  useFinanceHealth,
} from '../hooks/useBankPosition'
import { useBlockedCash } from '../hooks/useBlockedCash'
import { useLiquidity } from '../hooks/useLiquidity'
import { useCollections } from '../hooks/useCollections'
import { useTreasury } from '../hooks/useTreasury'

export default function DashboardPage(): ReactElement {
  const bankPosition = useBankPosition()
  const liquidity = useLiquidity()
  const blockedCash = useBlockedCash()
  const collections = useCollections()
  const treasury = useTreasury()
  const morningBrief = morningBriefEngine.evaluate(MORNING_BRIEF_SAMPLE_INPUT)
  const scenarioSimulator = scenarioSimulatorEngine.evaluate(
    SCENARIO_SIMULATOR_SAMPLE_INPUT,
  )
  const financeHealth = useFinanceHealth(
    blockedCash.score.value,
    bankPosition.score.value,
    liquidity.score.value,
  )

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Executive Control Tower"
        subtitle="Group financial health, liquidity, risks, and actions"
      />

      <MorningBriefCard brief={morningBrief}>
        <MorningBriefSummary brief={morningBrief} />
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
            What Changed
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            {morningBrief.changes.slice(0, 4).map((change) => (
              <div
                key={change.id}
                className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
              >
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {change.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {change.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <MorningBriefRisks
            title="Top Risks"
            items={morningBrief.risks}
            currency={morningBrief.currency}
            mode="risks"
          />
          <MorningBriefRisks
            title="Top Opportunities"
            items={morningBrief.opportunities}
            currency={morningBrief.currency}
            mode="opportunities"
          />
          <MorningBriefActions
            actions={morningBrief.actions}
            priorityAction={morningBrief.todayPriority}
            currency={morningBrief.currency}
          />
        </div>
      </MorningBriefCard>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <FinanceHealthCard {...financeHealth} />
        </div>
        <div className="md:col-span-8">
          <CashOverviewCard
            netDeployableCash={bankPosition.output.netDeployableCash}
            immediatelyAvailableCash={bankPosition.output.availableCash}
            projectedClosingCash={liquidity.output.projectedClosingCash}
            blockedCash={blockedCash.output.blockedAmount}
          />
        </div>

        <div className="md:col-span-4">
          <BankPositionSummaryCard
            summary={bankPosition.output}
            status={bankPosition.score.band}
          />
        </div>
        <div className="md:col-span-4">
          <LiquiditySummaryCard summary={liquidity.output} />
        </div>
        <div className="md:col-span-4">
          <BlockedCashSummaryCard result={blockedCash} />
        </div>

        <div className="md:col-span-4">
          <CollectionsSummaryCard summary={collections.output} compact />
        </div>
        <div className="md:col-span-4">
          <TreasurySummaryCard summary={treasury.output} compact />
        </div>
        <div className="md:col-span-4">
          <ImportStatusCard latestImport={SAMPLE_IMPORT_HISTORY[0]} />
        </div>
        <div className="md:col-span-4">
          <ScenarioImpactCard
            result={scenarioSimulator.bestScenario}
            currency={scenarioSimulator.currency}
            compact
          />
        </div>
        <div className="md:col-span-4">
          <DecisionList
            recommendations={[
              ...blockedCash.recommendations,
              ...bankPosition.recommendations,
              ...liquidity.recommendations,
            ]}
          />
        </div>
        <div className="md:col-span-4">
          <RiskList
            risks={[
              ...blockedCash.risks,
              ...bankPosition.risks,
              ...liquidity.risks,
            ]}
          />
        </div>
        <div className="md:col-span-4">
          <OpportunityList
            opportunities={[
              ...bankPosition.opportunities,
              ...liquidity.opportunities,
            ]}
          />
        </div>
      </div>
    </div>
  )
}
