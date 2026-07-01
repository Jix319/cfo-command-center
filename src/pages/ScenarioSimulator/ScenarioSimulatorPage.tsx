import type { ReactElement } from 'react'
import { useState } from 'react'
import SectionTitle from '../../components/common/SectionTitle'
import ScenarioComparisonTable from '../../components/scenarioSimulator/ScenarioComparisonTable'
import ScenarioImpactCard from '../../components/scenarioSimulator/ScenarioImpactCard'
import ScenarioSelector from '../../components/scenarioSimulator/ScenarioSelector'
import { scenarioSimulatorEngine } from '../../engines/scenarioSimulator/scenarioSimulatorEngine'
import { SCENARIO_SIMULATOR_SAMPLE_INPUT } from '../../engines/scenarioSimulator/sampleData'

export default function ScenarioSimulatorPage(): ReactElement {
  const simulator = scenarioSimulatorEngine.evaluate(
    SCENARIO_SIMULATOR_SAMPLE_INPUT,
  )
  const [selectedScenarioId, setSelectedScenarioId] = useState(
    simulator.bestScenario.scenarioId,
  )
  const selectedResult =
    simulator.results.find(
      (result) => result.scenarioId === selectedScenarioId,
    ) ?? simulator.bestScenario

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Scenario Simulator"
        subtitle="Deterministic before-and-after impact of CFO decisions"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <ScenarioSelector
            scenarios={simulator.scenarios}
            selectedScenarioId={selectedResult.scenarioId}
            onSelectScenario={setSelectedScenarioId}
          />
        </div>

        <div className="space-y-6 lg:col-span-8">
          <ScenarioImpactCard
            result={selectedResult}
            currency={simulator.currency}
          />
          <ScenarioComparisonTable
            metrics={selectedResult.impact}
            currency={simulator.currency}
          />
        </div>
      </div>
    </div>
  )
}
