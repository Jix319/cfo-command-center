import type { ReactElement } from 'react'
import type {
  Scenario,
  ScenarioCategory,
} from '../../engines/scenarioSimulator/types'
import DashboardCard from '../layout/DashboardCard'

interface ScenarioSelectorProps {
  scenarios: Scenario[]
  selectedScenarioId: string
  onSelectScenario: (scenarioId: string) => void
}

const categoryOrder: ScenarioCategory[] = [
  'Real Estate',
  'Collections',
  'Blocked Cash',
  'Borrowings',
  'Sales',
]

export default function ScenarioSelector({
  scenarios,
  selectedScenarioId,
  onSelectScenario,
}: ScenarioSelectorProps): ReactElement {
  return (
    <DashboardCard title="Scenario Categories">
      <div className="space-y-5">
        {categoryOrder.map((category) => {
          const categoryScenarios = scenarios.filter(
            (scenario) => scenario.category === category,
          )

          if (categoryScenarios.length === 0) return null

          return (
            <div key={category}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {category}
              </p>
              <div className="space-y-2">
                {categoryScenarios.map((scenario) => {
                  const isSelected = scenario.id === selectedScenarioId

                  return (
                    <button
                      key={scenario.id}
                      type="button"
                      onClick={() => onSelectScenario(scenario.id)}
                      className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                        isSelected
                          ? 'border-slate-900 bg-slate-100 text-slate-900 dark:border-slate-300 dark:bg-slate-700 dark:text-slate-100'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      <p className="text-sm font-semibold">{scenario.name}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {scenario.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </DashboardCard>
  )
}
